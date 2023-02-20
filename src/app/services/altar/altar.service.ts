import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { God } from 'src/app/models/character/god.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AltarService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService,
    private gameLogService: GameLogService) { }

  getTutorialAltar() {
    var altar = new AltarInfo();
    altar.type = AltarEnum.Small;
    altar.god = GodEnum.Athena;
    altar.condition = AltarConditionEnum.Victories;
    altar.conditionCount = altar.conditionMax = 1;

    return altar;
  }

  getNewSmallAltar(specifiedGod: GodEnum = GodEnum.None) {
    var altar = new AltarInfo();

    altar.type = AltarEnum.Small;
    if (specifiedGod === GodEnum.None)
      altar.god = this.lookupService.getRandomGodEnum(true);
    else
      altar.god = specifiedGod;
    altar.condition = this.getRandomSmallAltarCondition();
    altar.conditionMax = this.getAltarMaxConditions(altar);

    return altar;
  }

  getAltarMaxConditions(altar: AltarInfo) {
    var maxCount = 0;
    var tutorialAmount = false;
    if (!this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld)?.isAvailable)
      tutorialAmount = true;

    if (altar.condition === AltarConditionEnum.OverdriveUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 2;
    }
    if (altar.condition === AltarConditionEnum.Victories) {
      if (altar.type === AltarEnum.Small)
        maxCount = 5;
    }
    if (altar.condition === AltarConditionEnum.AutoAttackUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 20;
    }
    if (altar.condition === AltarConditionEnum.AbilityUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 10 : 20;
    }

    return maxCount;
  }

  incrementAltarCount(condition: AltarConditionEnum) {
    /*this.globalService.globalVar.altarInfo.forEach(altar => {
      if (altar.condition === condition && altar.conditionCount < altar.conditionMax)
        altar.conditionCount += 1;
    });*/
    var altar1 = this.globalService.globalVar.altars.altar1;

    if (altar1 !== undefined && altar1.condition === condition && altar1.conditionCount < altar1.conditionMax)
      altar1.conditionCount += 1;

    var altar2 = this.globalService.globalVar.altars.altar2;

    if (altar2 !== undefined && altar2.condition === condition && altar2.conditionCount < altar2.conditionMax)
      altar2.conditionCount += 1;

    var altar3 = this.globalService.globalVar.altars.altar3;

    if (altar3 !== undefined && altar3.condition === condition && altar3.conditionCount < altar3.conditionMax)
      altar3.conditionCount += 1;
  }

  getButtonOptions(altar: AltarInfo) {
    var options: AltarPrayOptionsEnum[] = [];

    if (altar.type === AltarEnum.Small) {
      options.push(AltarPrayOptionsEnum.Strength);
      options.push(AltarPrayOptionsEnum.Fortune);
    }

    return options;
  }

  getButtonText(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    var text = "";

    if (option === AltarPrayOptionsEnum.Strength)
      text = "Pray for Strength";
    if (option === AltarPrayOptionsEnum.Fortune)
      text = "Pray for Fortune";

    return text;
  }

  pray(altar: AltarInfo) {
    if (altar.type === AltarEnum.Small) {
      var effect = this.getRandomEffect(altar);
      this.setAltarEffect(effect, altar);

      var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);
      if (god !== undefined) {
        god.affinityExp += this.utilityService.smallAltarAffinityGain;
        this.globalService.giveGodExp(god, this.utilityService.basePrayGodXpIncrease);

        if (god.affinityExp >= god.affinityExpToNextLevel) {
          god.affinityExp -= god.affinityExpToNextLevel;
          god.affinityLevel += 1;
          god.affinityExpToNextLevel = this.utilityService.getFibonacciValue(god.affinityLevel + 3);

          if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm) {
            this.lookupService.gainResource(new ResourceValue(this.getSmallCharmOfGod(god.type), ItemTypeEnum.Charm, 1));
          }
          else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm) {
            this.lookupService.gainResource(new ResourceValue(this.getLargeCharmOfGod(god.type), ItemTypeEnum.Charm, 1));
          }
        }

        if (this.globalService.globalVar.gameLogSettings.get("prayToAltar")) {
          var gameLogEntry = "You pray to <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> for a boon. <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains " + this.utilityService.basePrayGodXpIncrease + " XP and " + this.utilityService.smallAltarAffinityGain + " Affinity XP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry);
        }
      }

      if (altar === this.globalService.globalVar.altars.altar1) {
        this.globalService.globalVar.altars.altar1 = undefined;
        this.globalService.globalVar.altars.altar1 = this.getNewSmallAltar();
      }
      if (altar === this.globalService.globalVar.altars.altar2) {
        this.globalService.globalVar.altars.altar2 = undefined;
        this.globalService.globalVar.altars.altar2 = this.getNewSmallAltar();
      }
      if (altar === this.globalService.globalVar.altars.altar3) {
        this.globalService.globalVar.altars.altar3 = undefined;
        this.globalService.globalVar.altars.altar3 = this.getNewSmallAltar();
      }
    }
  }

  getRandomEffect(altar: AltarInfo) {
    var possibleEffects: AltarEffectsEnum[] = [];

    possibleEffects.push(AltarEffectsEnum.AttackUp);

    if (altar.god === GodEnum.Athena) {
      possibleEffects.push(AltarEffectsEnum.AthenaDefenseUp);
      possibleEffects.push(AltarEffectsEnum.AthenaHeal);
      possibleEffects.push(AltarEffectsEnum.AthenaHealOverTime);
    }
    if (altar.god === GodEnum.Artemis) {
      possibleEffects.push(AltarEffectsEnum.ArtemisLuckUp);
      possibleEffects.push(AltarEffectsEnum.ArtemisCriticalDamageUp);
      possibleEffects.push(AltarEffectsEnum.ArtemisDefenseDebuff);
    }
    if (altar.god === GodEnum.Hermes) {
      possibleEffects.push(AltarEffectsEnum.HermesAbilityCooldown);
      possibleEffects.push(AltarEffectsEnum.HermesAgilityUp);
      possibleEffects.push(AltarEffectsEnum.HermesAutoAttackUp);
    }
    if (altar.god === GodEnum.Apollo) {
      possibleEffects.push(AltarEffectsEnum.ApolloResistanceUp);
      possibleEffects.push(AltarEffectsEnum.ApolloHeal);
      possibleEffects.push(AltarEffectsEnum.ApolloBuffDurationUp);
    }

    return possibleEffects[this.utilityService.getRandomInteger(0, possibleEffects.length - 1)];
  }

  setAltarEffect(effectType: AltarEffectsEnum, altar: AltarInfo) {
    var altarEffect = new AltarEffect();
    altarEffect.type = effectType;

    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.AttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaDefenseUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaHeal) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 20;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaHealOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 5;
      altarEffect.tickFrequency = (30 / 4);
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisLuckUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisCriticalDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisDefenseDebuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAgilityUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAutoAttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAbilityCooldown) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.01;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloResistanceUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloHeal) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 20;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altar.type === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloBuffDurationUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }

    var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);

    if (god !== undefined) {
      altarEffect.associatedGod = god.type;

      //repeats every 4 levels, duration increase is at level X1
      var durationIncreaseCount = Math.floor(god.affinityLevel / 4);
      if (god.affinityLevel % 4 >= 1)
        durationIncreaseCount += 1;

      if (!altarEffect.effectOnExpiration)
        altarEffect.duration *= 1 + (durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration);
      else
        altarEffect.duration /= 1 + (durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration);

      altarEffect.totalDuration = altarEffect.duration;

      //repeats every 4 levels, effectiveness increase is at level X2
      var effectivenessIncreaseCount = Math.floor(god.affinityLevel / 4);
      if (god.affinityLevel % 4 >= 2)
        effectivenessIncreaseCount += 1;
      
      if (altarEffect.isEffectMultiplier && altarEffect.effectiveness > 1)
      {        
        altarEffect.effectiveness = (altarEffect.effectiveness - 1) * (1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness)) + 1;
      }
      else if (altarEffect.isEffectMultiplier && altarEffect.effectiveness < 1)
        altarEffect.effectiveness = 1 - ((1 - altarEffect.effectiveness) * (1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness)));
      else
        altarEffect.effectiveness *= 1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness);            
    }

    if (altar === this.globalService.globalVar.altars.altar1)
      this.globalService.globalVar.altars.activeAltarEffect1 = altarEffect;
    if (altar === this.globalService.globalVar.altars.altar2)
      this.globalService.globalVar.altars.activeAltarEffect2 = altarEffect;
    if (altar === this.globalService.globalVar.altars.altar3)
      this.globalService.globalVar.altars.activeAltarEffect3 = altarEffect;
  }

  getSmallCharmOfGod(type: GodEnum) {
    var item: ItemsEnum = ItemsEnum.None;

    if (type === GodEnum.Athena)
      item = ItemsEnum.SmallCharmOfAthena;
    if (type === GodEnum.Artemis)
      item = ItemsEnum.SmallCharmOfArtemis;
    if (type === GodEnum.Hermes)
      item = ItemsEnum.SmallCharmOfHermes;
    if (type === GodEnum.Apollo)
      item = ItemsEnum.SmallCharmOfApollo;
    if (type === GodEnum.Ares)
      item = ItemsEnum.SmallCharmOfAres;
    if (type === GodEnum.Zeus)
      item = ItemsEnum.SmallCharmOfZeus;
    if (type === GodEnum.Poseidon)
      item = ItemsEnum.SmallCharmOfPoseidon;

    return item;
  }

  getLargeCharmOfGod(type: GodEnum) {
    var item: ItemsEnum = ItemsEnum.None;

    if (type === GodEnum.Athena)
      item = ItemsEnum.LargeCharmOfAthena;
    if (type === GodEnum.Artemis)
      item = ItemsEnum.LargeCharmOfArtemis;
    if (type === GodEnum.Hermes)
      item = ItemsEnum.LargeCharmOfHermes;
    if (type === GodEnum.Apollo)
      item = ItemsEnum.LargeCharmOfApollo;
    if (type === GodEnum.Ares)
      item = ItemsEnum.LargeCharmOfAres;
    if (type === GodEnum.Zeus)
      item = ItemsEnum.LargeCharmOfZeus;
    if (type === GodEnum.Poseidon)
      item = ItemsEnum.LargeCharmOfPoseidon;

    return item;
  }

  getRandomSmallAltarCondition() {
    var availableEnums: AltarConditionEnum[] = [];

    for (const [propertyKey, propertyValue] of Object.entries(AltarConditionEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as AltarConditionEnum;
      //break down what can be chosen for small, large, etc
      if (enumValue !== AltarConditionEnum.None && enumValue !== AltarConditionEnum.CoinSpent) {
        if (enumValue !== AltarConditionEnum.OverdriveUse ||
          (enumValue === AltarConditionEnum.OverdriveUse && this.globalService.globalVar.characters.some(item => item.level >= this.utilityService.characterOverdriveLevel)))
          availableEnums.push(enumValue);
      }
    }

    var rng = this.utilityService.getRandomInteger(0, availableEnums.length - 1);

    return availableEnums[rng];
  }
}
