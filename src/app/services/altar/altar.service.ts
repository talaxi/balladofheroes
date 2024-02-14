import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
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

  getAltarMaxConditions(altar: AltarInfo) {
    var maxCount = 0;
    var tutorialAmount = false;
    if (!this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld)?.isAvailable)
      tutorialAmount = true;

    if (altar.condition === AltarConditionEnum.OverdriveUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 1;
      else if (altar.type === AltarEnum.Large)
        maxCount = 2;
    }
    if (altar.condition === AltarConditionEnum.Victories) {
      if (altar.type === AltarEnum.Small)
        maxCount = 5;
      if (altar.type === AltarEnum.Large)
        maxCount = 10;
    }
    if (altar.condition === AltarConditionEnum.AutoAttackUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 20;
      if (altar.type === AltarEnum.Large)
        maxCount = 50;
    }
    if (altar.condition === AltarConditionEnum.AbilityUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 10 : 20;
      else if (altar.type === AltarEnum.Large)
        maxCount = 40;
    }

    return maxCount;
  }

  incrementAltarCount(condition: AltarConditionEnum) {
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

  pray(altar: AltarInfo, comingFromFollowers: boolean = false, followersActivatingAltar: boolean = false, comingFromItem: boolean = false) {
    var effect = this.getRandomEffect(altar, followersActivatingAltar);
    if (effect === AltarEffectsEnum.None)
      return;

    this.setAltarEffect(effect, altar, (comingFromFollowers && !followersActivatingAltar) || comingFromItem);
    var affinityXpGain = 0;
    var godXpGain = 0;

    var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);
    if (god !== undefined) {
      if (altar.type === AltarEnum.Small) {
        affinityXpGain = this.utilityService.smallAltarAffinityGain;
        godXpGain = this.utilityService.basePrayGodXpIncrease;
      }
      else if (altar.type === AltarEnum.Large) {
        affinityXpGain = this.utilityService.largeAltarAffinityGain;
        godXpGain = this.utilityService.largeAltarPrayGodXpIncrease;
      }

      god.affinityExp += affinityXpGain;
      this.globalService.giveGodExp(god, godXpGain);

      if (god.affinityExp >= god.affinityExpToNextLevel) {
        god.affinityExp -= god.affinityExpToNextLevel;
        god.affinityLevel += 1;
        god.affinityExpToNextLevel = this.utilityService.getFibonacciValue(god.affinityLevel + 3);

        if (this.globalService.globalVar.gameLogSettings.get("godAffinityLevelUp")) {
          var gameLogEntry = "<strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains Affinity Level " + god.affinityLevel + ".";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry, this.globalService.globalVar);
        }

        if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm) {
          this.lookupService.gainResource(new ResourceValue(this.getSmallCharmOfGod(god.type), 1));
        }
        else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm) {
          this.lookupService.gainResource(new ResourceValue(this.getLargeCharmOfGod(god.type), 1));
        }
      }

      if (comingFromFollowers) {
        if (this.globalService.globalVar.gameLogSettings.get("followerPrayer")) {
          if (followersActivatingAltar) {
            var gameLogEntry = "Your followers activate your altar to <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> for a boon and you receive <strong>" + this.lookupService.getBoonName(effect) + "</strong>.<br/><strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains " + godXpGain + " XP and " + affinityXpGain + " Affinity XP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.FollowerPrayer, gameLogEntry, this.globalService.globalVar);
          }
          else {
            var gameLogEntry = "Your followers pray to <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> for a boon and you receive <strong>" + this.lookupService.getBoonName(effect) + "</strong>.<br/><strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains " + godXpGain + " XP and " + affinityXpGain + " Affinity XP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.FollowerPrayer, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
      else {
        if (this.globalService.globalVar.gameLogSettings.get("prayToAltar")) {
          var gameLogEntry = "You pray to <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> for a boon and you receive <strong>" + this.lookupService.getBoonName(effect) + "</strong>.<br/><strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains " + godXpGain + " XP and " + affinityXpGain + " Affinity XP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry, this.globalService.globalVar);
        }
      }
    }

    if (altar === this.globalService.globalVar.altars.altar1) {
      var altarType = this.globalService.globalVar.altars.altar1.type;
      this.globalService.globalVar.altars.altar1 = undefined;
      this.globalService.globalVar.altars.altar1 = this.getNewAltar(altarType);
    }
    if (altar === this.globalService.globalVar.altars.altar2) {
      var altarType = this.globalService.globalVar.altars.altar2.type;
      this.globalService.globalVar.altars.altar2 = undefined;
      this.globalService.globalVar.altars.altar2 = this.getNewAltar(altarType);
    }
    if (altar === this.globalService.globalVar.altars.altar3) {
      var altarType = this.globalService.globalVar.altars.altar3.type;
      this.globalService.globalVar.altars.altar3 = undefined;
      this.globalService.globalVar.altars.altar3 = this.getNewAltar(altarType);
    }
  }

  getNewAltar(type: AltarEnum, specifiedGod: GodEnum = GodEnum.None, noRepeatingAltars: boolean = true) {
    var altar = new AltarInfo();

    altar.type = type;
    if (specifiedGod === GodEnum.None)
      altar.god = this.lookupService.getRandomGodEnum(noRepeatingAltars);
    else
      altar.god = specifiedGod;
    altar.condition = this.getRandomSmallAltarCondition();
    altar.conditionMax = this.getAltarMaxConditions(altar);

    return altar;
  }

  getRandomEffect(altar: AltarInfo, comingFromFollowers: boolean = false) {
    var possibleEffects: AltarEffectsEnum[] = [];

    possibleEffects = this.getPossibleEffects(altar.god, altar.type);

    possibleEffects = possibleEffects.filter(item => item !== this.globalService.globalVar.altars.activeAltarEffect1?.type &&
      item !== this.globalService.globalVar.altars.activeAltarEffect2?.type && item !== this.globalService.globalVar.altars.activeAltarEffect3?.type);

    if (this.globalService.globalVar.altars.additionalAltarEffects !== undefined && this.globalService.globalVar.altars.additionalAltarEffects.length > 0) {
      this.globalService.globalVar.altars.additionalAltarEffects.forEach(effect => {
        possibleEffects = possibleEffects.filter(item => item !== effect.type);
      });
    }

    if (possibleEffects.length === 0)
      return AltarEffectsEnum.None;

    return possibleEffects[this.utilityService.getRandomInteger(0, possibleEffects.length - 1)];
  }

  getPossibleEffects(godType: GodEnum, altarType: AltarEnum, ignorePartyRequirement: boolean = false) {
    var possibleEffects: AltarEffectsEnum[] = [];

    if (godType === GodEnum.Athena) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.AthenaDefenseUp);
        possibleEffects.push(AltarEffectsEnum.AthenaHeal);
        possibleEffects.push(AltarEffectsEnum.AthenaHealOverTime);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.AthenaRareHealOverTime);
        possibleEffects.push(AltarEffectsEnum.AthenaRareBlind);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.AthenaRareHolyDamageIncrease);
      }
    }
    if (godType === GodEnum.Artemis) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.ArtemisLuckUp);
        possibleEffects.push(AltarEffectsEnum.ArtemisCriticalDamageUp);
        possibleEffects.push(AltarEffectsEnum.ArtemisDefenseDebuff);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.ArtemisRareAttackDebuff);
        possibleEffects.push(AltarEffectsEnum.ArtemisRareCriticalDamageUp);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.ArtemisRareDebuffDurationUp);
      }
    }
    if (godType === GodEnum.Hermes) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.HermesAbilityCooldown);
        possibleEffects.push(AltarEffectsEnum.HermesAgilityUp);
        possibleEffects.push(AltarEffectsEnum.HermesAutoAttackUp);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.HermesRareAutoAttackUp);
        possibleEffects.push(AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.HermesRareReduceAutoAttackCooldown);
      }
    }
    if (godType === GodEnum.Apollo) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.ApolloResistanceUp);
        possibleEffects.push(AltarEffectsEnum.ApolloHeal);
        possibleEffects.push(AltarEffectsEnum.ApolloBuffDurationUp);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.ApolloRareBuffDurationUp);
        possibleEffects.push(AltarEffectsEnum.ApolloRareHpRegenIncrease);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.ApolloRareOstinato);
      }
    }
    if (godType === GodEnum.Ares) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.AresMaxHpUp);
        possibleEffects.push(AltarEffectsEnum.AresDamageOverTime);
        possibleEffects.push(AltarEffectsEnum.AresOverdriveGain);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage);
        possibleEffects.push(AltarEffectsEnum.AresRareOverdriveGain);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.AresRareDealHpDamage);
      }
    }
    if (godType === GodEnum.Hades) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.HadesAoeDamageUp);
        possibleEffects.push(AltarEffectsEnum.HadesEarthDamageUp);
        possibleEffects.push(AltarEffectsEnum.HadesFireDamageUp);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.HadesRareElementalDamageUp);
        possibleEffects.push(AltarEffectsEnum.HadesRareAoeDamageUp);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.HadesRareDealElementalDamage);
      }
    }
    if (godType === GodEnum.Dionysus) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.DionysusRandomBuff);
        possibleEffects.push(AltarEffectsEnum.DionysusRandomDebuff);
        possibleEffects.push(AltarEffectsEnum.DionysusSingleBarrier);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.DionysusRareFastDebuffs);
        possibleEffects.push(AltarEffectsEnum.DionysusRareMultiBarrier);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.DionysusRareFullDebuffs);
      }
    }
    if (godType === GodEnum.Nemesis) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.NemesisThorns);
        possibleEffects.push(AltarEffectsEnum.NemesisDealDamage);
        possibleEffects.push(AltarEffectsEnum.NemesisLuckDebuff);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.NemesisRareArmorPenetrationUp);
        possibleEffects.push(AltarEffectsEnum.NemesisRareThorns);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.NemesisRareDuesUp);
      }
    }
    if (godType === GodEnum.Zeus) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.ZeusAttackUp);
        possibleEffects.push(AltarEffectsEnum.ZeusAttackUpBuff);
        possibleEffects.push(AltarEffectsEnum.ZeusLightningDamageIncrease);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.ZeusRareStun);
        possibleEffects.push(AltarEffectsEnum.ZeusRareLightningDamageIncrease);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.ZeusRareSurge);
      }
    }

    if (godType === GodEnum.Poseidon) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.PoseidonWaterDamageIncrease);
        possibleEffects.push(AltarEffectsEnum.PoseidonDealWaterDamage);
        possibleEffects.push(AltarEffectsEnum.PoseidonUnsteady);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.PoseidonRareWaterDamageIncrease);
        possibleEffects.push(AltarEffectsEnum.PoseidonRareReduceAbilityCooldownAfter);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.PoseidonRareFlow);
      }
    }

    if (godType === GodEnum.Hera) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.HeraAirDamageIncrease);
        possibleEffects.push(AltarEffectsEnum.HeraReduceEnemyDamageAfter);
        possibleEffects.push(AltarEffectsEnum.HeraAttackUp);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.HeraRareAirDamageIncrease);
        possibleEffects.push(AltarEffectsEnum.HeraRareReduceAllEnemyDamageAfter);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.HeraRareShapeshift);
      }
    }

    if (godType === GodEnum.Aphrodite) {
      if (altarType === AltarEnum.Small) {
        possibleEffects.push(AltarEffectsEnum.AphroditeMaxHpUpAfter);
        possibleEffects.push(AltarEffectsEnum.AphroditeDealAttackDamageAll);
        possibleEffects.push(AltarEffectsEnum.AphroditeHealPartyOverTime);
      }
      else if (altarType === AltarEnum.Large) {
        possibleEffects.push(AltarEffectsEnum.AphroditeRareHealPartyOverTime);
        possibleEffects.push(AltarEffectsEnum.AphroditeRareDamageUp);
        if (this.globalService.isGodEquipped(godType) || ignorePartyRequirement)
          possibleEffects.push(AltarEffectsEnum.AphroditeRarePassionateRhythmOverTime);
      }
    }

    return possibleEffects;
  }

  getBaseAltarEffect(altarType: AltarEnum, effectType: AltarEffectsEnum) {
    var altarEffect = new AltarEffect();
    altarEffect.type = effectType;

    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaDefenseUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaHeal) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 20;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AthenaHealOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 5;
      altarEffect.tickFrequency = (30 / 4);
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisLuckUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisCriticalDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ArtemisDefenseDebuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAgilityUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAutoAttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HermesAbilityCooldown) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.01;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloResistanceUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloHeal) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 20;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ApolloBuffDurationUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AthenaRareHolyDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AthenaRareHealOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 60;
      altarEffect.tickFrequency = (60 / 10);
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AthenaRareBlind) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ArtemisRareAttackDebuff) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ArtemisRareDebuffDurationUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ArtemisRareCriticalDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HermesRareAutoAttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.005;
      altarEffect.tickFrequency = (60 / 5);
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HermesRareReduceAutoAttackCooldown) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = .98;
      altarEffect.stacks = false;
      //altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ApolloRareHpRegenIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ApolloRareOstinato) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ApolloRareBuffDurationUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AresMaxHpUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AresOverdriveGain) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AresDamageOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 50;
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AresRareOverdriveGain) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AresRareDealHpDamage) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HadesEarthDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HadesFireDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HadesAoeDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HadesRareElementalDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HadesRareAoeDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HadesRareDealElementalDamage) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 200;
      altarEffect.tickFrequency = (60 / 12);
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
      altarEffect.element = this.lookupService.getRandomElement();
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.DionysusRandomBuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.DionysusRandomDebuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.DionysusSingleBarrier) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.01;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.DionysusRareFastDebuffs) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.025;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.DionysusRareMultiBarrier) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.DionysusRareFullDebuffs) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.NemesisDealDamage) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 100;
      altarEffect.tickFrequency = (30 / 6);
      altarEffect.stacks = false;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.NemesisLuckDebuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.NemesisThorns) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.NemesisRareThorns) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.NemesisRareArmorPenetrationUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.NemesisRareDuesUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ZeusAttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ZeusAttackUpBuff) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.ZeusLightningDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ZeusRareLightningDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ZeusRareSurge) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.tickFrequency = (60 / 4);
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.ZeusRareStun) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.PoseidonDealWaterDamage) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.PoseidonUnsteady) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.countTowards1 = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.PoseidonWaterDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.PoseidonRareWaterDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.PoseidonRareReduceAbilityCooldownAfter) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.PoseidonRareFlow) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HeraReduceEnemyDamageAfter) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .95;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HeraAttackUp) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.HeraAirDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HeraRareReduceAllEnemyDamageAfter) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = .97;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HeraRareAirDamageIncrease) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.HeraRareShapeshift) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.02;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AphroditeHealPartyOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.01;
      altarEffect.tickFrequency = (30 / 4);
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AphroditeMaxHpUpAfter) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
    }
    if (altarType === AltarEnum.Small && effectType === AltarEffectsEnum.AphroditeDealAttackDamageAll) {
      altarEffect.duration = altarEffect.totalDuration = 30;
      altarEffect.effectiveness = .15;
      altarEffect.stacks = false;
      altarEffect.effectOnExpiration = true;
      altarEffect.isEffectMultiplier = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AphroditeRareHealPartyOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.025;
      altarEffect.tickFrequency = (30 / 4);
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AphroditeRareDamageUp) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.015;
      altarEffect.stacks = false;
    }
    if (altarType === AltarEnum.Large && effectType === AltarEffectsEnum.AphroditeRarePassionateRhythmOverTime) {
      altarEffect.duration = altarEffect.totalDuration = 60;
      altarEffect.effectiveness = 1.04;
      altarEffect.stacks = false;
      altarEffect.tickFrequency = (60 / 4);
    }


    return altarEffect;
  }

  setAltarEffect(effectType: AltarEffectsEnum, altar: AltarInfo, additionalAltarEffect: boolean = false) {
    var altarEffect = this.getBaseAltarEffect(altar.type, effectType);
    var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);
    var priest = this.globalService.getActivePartyCharacters(true).find(member => member.type === CharacterEnum.Priest);

    if (god !== undefined) {
      altarEffect.associatedGod = god.type;

      //repeats every 4 levels, duration increase is at level X1
      var durationIncreaseCount = this.lookupService.getGodAffinityBoonDurationIncreaseCount(god);

      var priestDurationIncrease = 1;
      if (priest !== undefined) {

        var faith = priest.abilityList.find(item => item.name === "Faith" && item.isAvailable);
        if (faith !== undefined) {
          priestDurationIncrease = faith.effectiveness;
          
          var permanentUpgrades = priest.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
          if (permanentUpgrades !== undefined)
          priestDurationIncrease += permanentUpgrades.effectiveness;
        }
      }

        if (!altarEffect.effectOnExpiration)
          altarEffect.duration *= 1 + (durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration * priestDurationIncrease);
        else
          altarEffect.duration /= 1 + (durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration * priestDurationIncrease);

        altarEffect.totalDuration = altarEffect.duration;

        //repeats every 4 levels, effectiveness increase is at level X2
        var effectivenessIncreaseCount = this.lookupService.getGodAffinityBoonEffectivenessIncreaseCount(god);

        if (altarEffect.isEffectMultiplier && altarEffect.effectiveness > 1) {
          altarEffect.effectiveness = (altarEffect.effectiveness - 1) * (1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness)) + 1;
        }
        else if (altarEffect.isEffectMultiplier && altarEffect.effectiveness < 1 && altarEffect.countTowards1)
          altarEffect.effectiveness = ((altarEffect.effectiveness) * (1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness)));
        else if (altarEffect.isEffectMultiplier && altarEffect.effectiveness < 1)
          altarEffect.effectiveness = 1 - ((1 - altarEffect.effectiveness) * (1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness)));
        else
          altarEffect.effectiveness *= 1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness);

        if (priest !== undefined) {
          var faith = priest.abilityList.find(item => item.name === "Faith" && item.isAvailable);
          if (faith !== undefined) {
            var faithEffectiveness = faith.effectiveness;

            var permanentUpgrades = priest.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
            if (permanentUpgrades !== undefined)
              faithEffectiveness += permanentUpgrades.effectiveness;

            if (altarEffect.isEffectMultiplier && altarEffect.effectiveness > 1) {
              altarEffect.effectiveness = (altarEffect.effectiveness - 1) * (faithEffectiveness) + 1;
            }
            else if (altarEffect.isEffectMultiplier && altarEffect.effectiveness < 1 && altarEffect.countTowards1)
              altarEffect.effectiveness = altarEffect.effectiveness * (faithEffectiveness);
            else if (altarEffect.isEffectMultiplier && altarEffect.effectiveness < 1)
              altarEffect.effectiveness = 1 - ((1 - altarEffect.effectiveness) * (faithEffectiveness));
            else
              altarEffect.effectiveness *= faithEffectiveness;
          }
        }

        altarEffect.effectiveness = this.utilityService.roundTo(altarEffect.effectiveness, 5);
      }

      if (additionalAltarEffect) {
        if (this.globalService.globalVar.altars.additionalAltarEffects === undefined)
          this.globalService.globalVar.altars.additionalAltarEffects = [];

        this.globalService.globalVar.altars.additionalAltarEffects.push(altarEffect);
      }
      else {
        if (altar === this.globalService.globalVar.altars.altar1) {
          if (this.globalService.globalVar.altars.activeAltarEffect1 !== undefined &&
            this.isEndOfDurationEffect(this.globalService.globalVar.altars.activeAltarEffect1)) {
            this.globalService.globalVar.altars.activeAltarEffect1.duration = 0;
            this.globalService.globalVar.altars.additionalAltarEffects.push(this.globalService.globalVar.altars.activeAltarEffect1);
          }
          this.globalService.globalVar.altars.activeAltarEffect1 = altarEffect;
        }
        if (altar === this.globalService.globalVar.altars.altar2) {
          if (this.globalService.globalVar.altars.activeAltarEffect2 !== undefined &&
            this.isEndOfDurationEffect(this.globalService.globalVar.altars.activeAltarEffect2)) {
            this.globalService.globalVar.altars.activeAltarEffect2.duration = 0;
            this.globalService.globalVar.altars.additionalAltarEffects.push(this.globalService.globalVar.altars.activeAltarEffect2);
          }

          this.globalService.globalVar.altars.activeAltarEffect2 = altarEffect;
        }
        if (altar === this.globalService.globalVar.altars.altar3) {
          if (this.globalService.globalVar.altars.activeAltarEffect3 !== undefined &&
            this.isEndOfDurationEffect(this.globalService.globalVar.altars.activeAltarEffect3)) {
            this.globalService.globalVar.altars.activeAltarEffect3.duration = 0;
            this.globalService.globalVar.altars.additionalAltarEffects.push(this.globalService.globalVar.altars.activeAltarEffect3);
          }

          this.globalService.globalVar.altars.activeAltarEffect3 = altarEffect;
        }
      }
    }

    isEndOfDurationEffect(effect: AltarEffect) {
      if (effect.type === AltarEffectsEnum.AthenaHeal || effect.type === AltarEffectsEnum.AresOverdriveGain || effect.type === AltarEffectsEnum.AresRareOverdriveGain ||
        effect.type === AltarEffectsEnum.ArtemisDefenseDebuff || effect.type === AltarEffectsEnum.ApolloHeal || effect.type === AltarEffectsEnum.HermesAbilityCooldown ||
        effect.type === AltarEffectsEnum.AthenaRareBlind || effect.type === AltarEffectsEnum.ArtemisRareAttackDebuff || effect.type === AltarEffectsEnum.ApolloRareOstinato ||
        effect.type === AltarEffectsEnum.DionysusRandomDebuff || effect.type === AltarEffectsEnum.AresRareDealHpDamage || effect.type === AltarEffectsEnum.AresDamageOverTime ||
        effect.type === AltarEffectsEnum.DionysusSingleBarrier || effect.type === AltarEffectsEnum.DionysusRareMultiBarrier || effect.type === AltarEffectsEnum.DionysusRareFullDebuffs ||
        effect.type === AltarEffectsEnum.NemesisLuckDebuff || effect.type === AltarEffectsEnum.NemesisRareDuesUp || effect.type === AltarEffectsEnum.ZeusRareStun ||
        effect.type === AltarEffectsEnum.ZeusAttackUpBuff || effect.type === AltarEffectsEnum.PoseidonUnsteady || effect.type === AltarEffectsEnum.PoseidonDealWaterDamage ||
        effect.type === AltarEffectsEnum.PoseidonRareReduceAbilityCooldownAfter || effect.type === AltarEffectsEnum.HeraReduceEnemyDamageAfter ||
        effect.type === AltarEffectsEnum.HeraRareReduceAllEnemyDamageAfter || effect.type === AltarEffectsEnum.AphroditeMaxHpUpAfter || effect.type === AltarEffectsEnum.AphroditeRareDamageUp)
        return true;

      return false;
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
      if (type === GodEnum.Hades)
        item = ItemsEnum.SmallCharmOfHades;
      if (type === GodEnum.Dionysus)
        item = ItemsEnum.SmallCharmOfDionysus;
      if (type === GodEnum.Nemesis)
        item = ItemsEnum.SmallCharmOfNemesis;
      if (type === GodEnum.Poseidon)
        item = ItemsEnum.SmallCharmOfPoseidon;
      if (type === GodEnum.Hera)
        item = ItemsEnum.SmallCharmOfHera;
      if (type === GodEnum.Aphrodite)
        item = ItemsEnum.SmallCharmOfAphrodite;

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
      if (type === GodEnum.Hades)
        item = ItemsEnum.LargeCharmOfHades;
      if (type === GodEnum.Dionysus)
        item = ItemsEnum.LargeCharmOfDionysus;
      if (type === GodEnum.Nemesis)
        item = ItemsEnum.LargeCharmOfNemesis;
      if (type === GodEnum.Poseidon)
        item = ItemsEnum.LargeCharmOfPoseidon;
      if (type === GodEnum.Hera)
        item = ItemsEnum.LargeCharmOfHera;
      if (type === GodEnum.Aphrodite)
        item = ItemsEnum.LargeCharmOfAphrodite;

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
