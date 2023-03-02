import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { BattleService } from '../battle/battle.service';
import { GlobalService } from '../global/global.service';
import { AlchemyService } from '../professions/alchemy.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private globalService: GlobalService, private battleService: BattleService, private utilityService: UtilityService,
    private alchemyService: AlchemyService) { }

  //global -- this occurs even when at a scene or in a town
  handleBackgroundTimers(deltaTime: number, isInTown: boolean) {
    this.alchemyService.handleAlchemyTimer(deltaTime);
    this.handleAltarEffectDurations(deltaTime);
    var party = this.globalService.getActivePartyCharacters(true);
    var enemies: Enemy[] = [];

    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined)
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;

    party.forEach(partyMember => {
      //check for defeated      
      var isDefeated = this.battleService.isCharacterDefeated(partyMember);
      if (!isDefeated && !this.globalService.globalVar.isBattlePaused) {
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.AlwaysActive, partyMember, new Character(), party, []);
        this.battleService.handleHpRegen(partyMember, deltaTime);
        this.battleService.handleStatusEffectDurations(true, partyMember, deltaTime);
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.TriggersEvery, partyMember, undefined, party, enemies, deltaTime);

        if (!isInTown)
        {
          this.battleService.handleAutoAttackTimer(partyMember, deltaTime);
          this.handleAbilityCooldowns(partyMember, deltaTime);
        }
      }
    });
  }

  handleTown(deltaTime: number, loading: any) {
    var party = this.globalService.getActivePartyCharacters(true);
    this.gainHpInTown(party, deltaTime);
  }

  handleAbilityCooldowns(character: Character, deltaTime: number) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        this.battleService.handleAbilityCooldown(character, ability, deltaTime);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }
  }

  gainHpInTown(party: Character[], deltaTime: number) {
    var hpGainPercent = .1;

    this.globalService.globalVar.timers.townHpGainTimer += deltaTime;
    var teamNeedsHealing = party.some(item => item.battleStats.currentHp < item.battleStats.maxHp);

    while (this.globalService.globalVar.timers.townHpGainTimer > this.globalService.globalVar.timers.townHpGainLength && teamNeedsHealing) {
      party.forEach(partyMember => {
        if (partyMember.battleStats.currentHp < partyMember.battleStats.maxHp) {
          partyMember.battleStats.currentHp += Math.ceil(partyMember.battleStats.maxHp * hpGainPercent);
        }

        if (partyMember.battleStats.currentHp >= partyMember.battleStats.maxHp) {
          partyMember.battleStats.currentHp = partyMember.battleStats.maxHp;
        }
      });

      this.globalService.globalVar.timers.townHpGainTimer -= this.globalService.globalVar.timers.townHpGainLength;
      teamNeedsHealing = party.some(item => item.battleStats.currentHp < item.battleStats.maxHp);

      if (!teamNeedsHealing)
        this.globalService.globalVar.timers.townHpGainTimer = 0;
    }
  }

  handleAltarEffectDurations(deltaTime: number) {
    if (this.globalService.globalVar.altars.activeAltarEffect1 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect1.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect1, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect1.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect1);
        this.globalService.globalVar.altars.activeAltarEffect1 = undefined;
      }
    }
    if (this.globalService.globalVar.altars.activeAltarEffect2 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect2.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect2, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect2.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect2);
        this.globalService.globalVar.altars.activeAltarEffect2 = undefined;
      }
    }
    if (this.globalService.globalVar.altars.activeAltarEffect3 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect3.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect3, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect3.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect3);
        this.globalService.globalVar.altars.activeAltarEffect3 = undefined;
      }
    }
  }

  handleTickingAltarEffect(effect: AltarEffect, deltaTime: number) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    effect.tickTimer += deltaTime;

    if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
      if (effect.type === AltarEffectsEnum.AthenaHealOverTime) {
        party.forEach(member => {
          this.battleService.gainHp(member, effect.effectiveness);
        });
      }

      effect.tickTimer -= effect.tickFrequency;
    }
  }

  handleEndOfDurationAltarEffect(effect: AltarEffect) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    var enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;
    enemies = enemies.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));

    if (effect.type === AltarEffectsEnum.AthenaHeal) {
      party.forEach(member => {
        this.battleService.gainHp(member, effect.effectiveness);
      });
    }

    if (effect.type === AltarEffectsEnum.ArtemisDefenseDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ApolloHeal) {
      party = party.sort(function (a, b) {
        return a.battleStats.getHpPercent() > b.battleStats.getHpPercent() ? 1 :
          a.battleStats.getHpPercent() < b.battleStats.getHpPercent() ? -1 : 0;
      });
      var target = party[0];
      
      this.battleService.gainHp(target, effect.effectiveness);
    }

    if (effect.type === AltarEffectsEnum.HermesAbilityCooldown) {
      party.forEach(member => {
        if (member.abilityList !== undefined && member.abilityList.length > 0)
          member.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            ability.currentCooldown /= effect.effectiveness;
          });

        if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod1);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown /= effect.effectiveness;
              });
          }
        }

        if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod2);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown /= effect.effectiveness;
              });
          }
        }
      });
    }
  }
}
