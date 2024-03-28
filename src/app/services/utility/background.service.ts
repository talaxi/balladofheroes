import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AltarService } from '../altar/altar.service';
import { BalladService } from '../ballad/ballad.service';
import { BattleService } from '../battle/battle.service';
import { GameLogService } from '../battle/game-log.service';
import { FollowersService } from '../followers/followers.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { UtilityService } from './utility.service';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { DictionaryService } from './dictionary.service';
import { EquipmentService } from '../resources/equipment.service';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { TrialService } from 'src/app/services/battle/trial.service';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { TrialDefeatCount } from 'src/app/models/battle/trial-defeat-count.model';
import { TimeFragmentRun } from 'src/app/models/utility/time-fragment-run.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { ZodiacService } from 'src/app/services/global/zodiac.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private globalService: GlobalService, private battleService: BattleService, private utilityService: UtilityService,
    private professionService: ProfessionService, private followerService: FollowersService, private lookupService: LookupService,
    private gameLogService: GameLogService, private balladService: BalladService, private altarService: AltarService,
    private dictionaryService: DictionaryService, private equipmentService: EquipmentService, private trialService: TrialService,
    private subzoneGeneratorService: SubZoneGeneratorService, private zodiacService: ZodiacService) { }

  //global -- this occurs even when at a scene or in a town
  handleBackgroundTimers(deltaTime: number, isInTown: boolean) {
    this.handleItemCooldowns(deltaTime);
    this.checkForDailyOccurrences(deltaTime);
    this.professionService.handleProfessionTimer(ProfessionEnum.Alchemy, deltaTime);
    this.professionService.handleProfessionTimer(ProfessionEnum.Jewelcrafting, deltaTime);
    this.handleAltarEffectDurations(deltaTime);
    this.handleFollowerSearch(deltaTime);
    this.handleFollowerPrayer(deltaTime);
    this.handleGlobalStatusEffectDurations(deltaTime);
    this.handleSparringMatchMultiplier(deltaTime);
    this.handleTimeFragments(deltaTime);
    //this.handleMelete(deltaTime);
    var party = this.globalService.getActivePartyCharacters(true);
    var enemies: Enemy[] = [];
    var activeSubzone = this.balladService.getActiveSubZone();

    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined &&
      activeSubzone.type !== SubZoneEnum.CalydonAltarOfAsclepius && !(this.balladService.isSubzoneTown(activeSubzone.type) &&
        this.lookupService.userNotInTownBattle()))
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;

    party.forEach(partyMember => {
      //check for defeated      
      var isDefeated = this.battleService.isCharacterDefeated(partyMember);
      if (!isDefeated && !this.globalService.globalVar.isBattlePaused) {
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.AlwaysActive, partyMember, new Character(), party, []);
        this.battleService.handleHpRegen(partyMember, deltaTime);
        this.handleLinkCooldown(partyMember, deltaTime);
        this.battleService.handleStatusEffectDurations(true, partyMember, enemies, party, deltaTime);
        this.checkForThornsGems(partyMember);
        this.checkGodStatuses(partyMember);

        if (partyMember.overdriveInfo !== undefined && partyMember.overdriveInfo.isActive && partyMember.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Revenge && partyMember.overdriveInfo.revengeTime !== undefined) {
          if (partyMember.overdriveInfo.revengeTime <= 0) {
            partyMember.overdriveInfo.revengeTime = 0;
          }
          else {
            partyMember.overdriveInfo.revengeTime -= deltaTime;
          }
        }

        if (partyMember.battleInfo !== undefined && partyMember.battleInfo.duoAbilityCooldown !== undefined && partyMember.battleInfo.duoAbilityCooldown > 0) {
          if (partyMember.battleInfo.duoAbilityCooldown <= 0) {
            partyMember.battleInfo.duoAbilityCooldown = 0;
          }
          else {
            partyMember.battleInfo.duoAbilityCooldown -= deltaTime;
          }
        }

        if (!isInTown) {
          this.battleService.handleAutoAttackTimer(partyMember, deltaTime);
          this.handleAbilityCooldowns(partyMember, deltaTime);
          this.battleService.checkForEquipmentEffect(EffectTriggerEnum.TriggersEvery, partyMember, this.battleService.getTarget(partyMember, enemies), party, enemies, deltaTime);
        }
      }
    });
  }

  handleLinkCooldown(member: Character, deltaTime: number) {
    if (member.linkInfo.cooldown > 0) {
      member.linkInfo.cooldown -= deltaTime;

      if (member.linkInfo.cooldown <= 0)
        member.linkInfo.remainingLinks = member.linkInfo.totalLinks;
    }
  }

  handleGlobalStatusEffectDurations(deltaTime: number) {
    if (this.globalService.globalVar.globalStatusEffects.length === 0)
      return;

    this.globalService.globalVar.globalStatusEffects.forEach(effect => {
      effect.duration -= deltaTime;
    });

    this.globalService.globalVar.globalStatusEffects = this.globalService.globalVar.globalStatusEffects.filter(effect => effect.isPermanent || effect.duration > 0);

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
    var teamNeedsHealing = party.some(item => item.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(item));

    while (this.globalService.globalVar.timers.townHpGainTimer > this.globalService.globalVar.timers.townHpGainLength && teamNeedsHealing) {
      party.forEach(partyMember => {
        if (partyMember.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(partyMember)) {
          partyMember.battleStats.currentHp += Math.ceil(this.lookupService.getAdjustedMaxHp(partyMember) * hpGainPercent);
        }

        if (partyMember.battleStats.currentHp >= this.lookupService.getAdjustedMaxHp(partyMember)) {
          partyMember.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(partyMember);
        }
      });

      this.globalService.globalVar.timers.townHpGainTimer -= this.globalService.globalVar.timers.townHpGainLength;
      teamNeedsHealing = party.some(item => item.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(item));

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

    if (this.globalService.globalVar.altars.additionalAltarEffects !== undefined && this.globalService.globalVar.altars.additionalAltarEffects.length > 0) {
      this.globalService.globalVar.altars.additionalAltarEffects.forEach(effect => {
        effect.duration -= deltaTime;
        this.handleTickingAltarEffect(effect, deltaTime);

        if (effect.duration <= 0) {
          this.handleEndOfDurationAltarEffect(effect);
        }
      });

      this.globalService.globalVar.altars.additionalAltarEffects = this.globalService.globalVar.altars.additionalAltarEffects.filter(item => item.duration > 0);
    }
  }

  handleTickingAltarEffect(effect: AltarEffect, deltaTime: number) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    var enemies: Enemy[] | undefined = undefined;
    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined) {
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;
      enemies = enemies.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    }
    effect.tickTimer += deltaTime;

    if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
      if (effect.type === AltarEffectsEnum.AthenaHealOverTime || effect.type === AltarEffectsEnum.AthenaRareHealOverTime) {
        party.forEach(member => {
          this.battleService.gainHp(member, effect.effectiveness);
        });
      }

      if (effect.type === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime) {
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

      if (effect.type === AltarEffectsEnum.HadesRareDealElementalDamage) {
        if (enemies !== undefined) {
          enemies.forEach(member => {
            if (member !== undefined)
              this.battleService.dealTrueDamage(true, member, effect.effectiveness, undefined, effect.element);
          });
        }
      }

      if (effect.type === AltarEffectsEnum.NemesisDealDamage) {
        if (enemies !== undefined) {
          var target = this.lookupService.getRandomPartyMember(enemies);
          if (target !== undefined)
            this.battleService.dealTrueDamage(true, target, effect.effectiveness);
        }
      }

      if (effect.type === AltarEffectsEnum.ZeusRareSurge) {
        var memberWithZeus = party.find(item => item.assignedGod1 === GodEnum.Zeus || item.assignedGod2 === GodEnum.Zeus);
        if (memberWithZeus !== undefined) {
          var surge = memberWithZeus.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Surge);
          if (surge === undefined) {
            var overload = this.lookupService.characterHasAbility("Overload", memberWithZeus);
            if (overload !== undefined) {
              this.battleService.applyStatusEffect(this.globalService.makeStatusEffectCopy(overload.userEffect[0]), memberWithZeus, party, memberWithZeus);
            }
          }
          else {
            surge.effectiveness = ((surge.effectiveness - 1) * effect.effectiveness) + 1;
          }
        }
      }

      if (effect.type === AltarEffectsEnum.AphroditeHealPartyOverTime || effect.type === AltarEffectsEnum.AphroditeRareHealPartyOverTime) {
        party.forEach(member => {
          var hpEffectiveness = this.lookupService.getAdjustedMaxHp(member, true) * (effect.effectiveness - 1);
          this.battleService.gainHp(member, hpEffectiveness);
        });
      }

      if (effect.type === AltarEffectsEnum.AphroditeRarePassionateRhythmOverTime) {
        var memberWithAphrodite = party.find(item => item.assignedGod1 === GodEnum.Aphrodite || item.assignedGod2 === GodEnum.Aphrodite);
        if (memberWithAphrodite !== undefined) {
          var rng = this.utilityService.getRandomInteger(0, 1);
          if (rng === 0) {
            var passionateRhythm = this.globalService.createStatusEffect(StatusEffectEnum.PassionateRhythm, -1, effect.effectiveness, false, true);
            this.battleService.applyStatusEffect(this.globalService.makeStatusEffectCopy(passionateRhythm), memberWithAphrodite, party, memberWithAphrodite);
          }
          else if (rng === 1) {
            var passionateRhythm = this.globalService.createStatusEffect(StatusEffectEnum.PassionateRhythmAutoAttack, -1, effect.effectiveness, false, true);
            this.battleService.applyStatusEffect(this.globalService.makeStatusEffectCopy(passionateRhythm), memberWithAphrodite, party, memberWithAphrodite);
          }
        }
      }

      effect.tickTimer -= effect.tickFrequency;
    }
  }

  handleEndOfDurationAltarEffect(effect: AltarEffect) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    var enemies: Enemy[] | undefined = undefined;
    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined) {
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;
      enemies = enemies.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    }

    if (effect.type === AltarEffectsEnum.AthenaHeal) {
      party.forEach(member => {
        this.battleService.gainHp(member, effect.effectiveness);
      });
    }

    if (effect.type === AltarEffectsEnum.AresOverdriveGain || effect.type === AltarEffectsEnum.AresRareOverdriveGain) {
      party.forEach(member => {
        if (member.level >= this.utilityService.characterOverdriveLevel) {
          member.overdriveInfo.gaugeAmount += (member.overdriveInfo.gaugeTotal * (effect.effectiveness - 1)) * this.lookupService.getOverdriveGainMultiplier(member);
          if (member.overdriveInfo.gaugeAmount > member.overdriveInfo.gaugeTotal)
            member.overdriveInfo.gaugeAmount = member.overdriveInfo.gaugeTotal;
        }
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
      if (party !== undefined && party.length > 0) {
        var lowestHpPartyMember: Character = party[0];
        party.forEach(member => {
          var CharAHpPercent = lowestHpPartyMember.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(lowestHpPartyMember, false, false);
          var CharBHpPercent = member.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(member, false, false);

          if (CharBHpPercent < CharAHpPercent)
            lowestHpPartyMember = member;
        });

        this.battleService.gainHp(lowestHpPartyMember, effect.effectiveness);
      }
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

    if (effect.type === AltarEffectsEnum.AthenaRareBlind) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 6, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ArtemisRareAttackDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 12, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ApolloRareOstinato) {
      party.forEach(member => {
        if (member.assignedGod1 === GodEnum.Apollo || member.assignedGod2 === GodEnum.Apollo) {
          var ostinato = this.lookupService.characterHasAbility("Ostinato", member);
          if (ostinato !== undefined && this.globalService.globalVar.activeBattle !== undefined) {
            this.battleService.useAbility(true, ostinato, member, enemies === undefined ? [] : enemies, party, true, effect.effectiveness - 1);
          }
        }
      });
    }

    if (effect.type === AltarEffectsEnum.AresDamageOverTime) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createDamageOverTimeEffect(12, 3, effect.effectiveness, "Ares Altar", dotTypeEnum.TrueDamage, undefined, true), member);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.AresRareDealHpDamage) {
      var totalHp = 0;
      party.forEach(member => {
        totalHp += member.battleStats.currentHp * (effect.effectiveness - 1);
      });

      if (enemies !== undefined) {
        enemies.forEach(member => {
          if (member !== undefined)
            this.battleService.dealTrueDamage(true, member, totalHp);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRandomDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(this.battleService.getRandomPrimaryStatDownStatusEffect(true), 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRandomBuff) {
      party.forEach(member => {
        this.battleService.applyStatusEffect(this.globalService.createStatusEffect(this.battleService.getRandomPrimaryStatUpStatusEffect(), 10, effect.effectiveness, false, true), member, enemies);
      });
    }

    if (effect.type === AltarEffectsEnum.DionysusSingleBarrier) {
      var barrierTarget = this.lookupService.getRandomPartyMember(party);
      if (barrierTarget !== undefined) {
        var barrierAmount = Math.round((effect.effectiveness - 1) * this.lookupService.getAdjustedMaxHp(barrierTarget, true));
        barrierTarget.battleInfo.barrierValue += barrierAmount;
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRareMultiBarrier) {
      if (party.length > 0) {
        party.forEach(member => {
          var barrierAmount = Math.round((effect.effectiveness - 1) * this.lookupService.getAdjustedMaxHp(member, true));
          member.battleInfo.barrierValue += barrierAmount;
        });
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRareFullDebuffs) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 15, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.NemesisLuckDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.NemesisRareDuesUp) {
      party.forEach(member => {
        var dues = member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
        if (dues !== undefined) {
          dues.effectiveness *= effect.effectiveness;
        }
      });
    }

    if (effect.type === AltarEffectsEnum.ZeusRareStun) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, effect.effectiveness, 1, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ZeusAttackUpBuff) {
      party.forEach(member => {
        this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, effect.effectiveness, false, true), member, enemies);
      });
    }

    if (effect.type === AltarEffectsEnum.PoseidonUnsteady) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.PoseidonDealWaterDamage) {
      if (enemies !== undefined && party !== undefined) {
        var totalAttack = 0;
        party.forEach(member => {
          totalAttack += this.lookupService.getAdjustedAttack(member);
        });
        var damage = totalAttack * effect.effectiveness;

        var target = this.lookupService.getRandomPartyMember(enemies);
        if (target !== undefined)
          this.battleService.dealTrueDamage(true, target, damage, undefined, ElementalTypeEnum.Water);
      }
    }

    if (effect.type === AltarEffectsEnum.PoseidonRareReduceAbilityCooldownAfter) {
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

    if (effect.type === AltarEffectsEnum.AphroditeDealAttackDamageAll) {
      if (enemies !== undefined && party !== undefined) {
        var totalAttack = 0;
        party.forEach(member => {
          totalAttack += this.lookupService.getAdjustedAttack(member);
        });
        var damage = totalAttack * effect.effectiveness;

        enemies.forEach(enemy => {
          if (enemy !== undefined)
            this.battleService.dealTrueDamage(true, enemy, damage);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.AphroditeMaxHpUpAfter) {
      party.forEach(member => {
        this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.MaxHpUp, 10, effect.effectiveness, false, true), member, enemies);
      });
    }

    if (effect.type === AltarEffectsEnum.HeraReduceEnemyDamageAfter) {
      if (enemies !== undefined) {
        var target = this.lookupService.getRandomPartyMember(enemies);
        this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtDown, 10, effect.effectiveness, false, false), target, enemies);
      }
    }

    if (effect.type === AltarEffectsEnum.HeraRareReduceAllEnemyDamageAfter) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtDown, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }
  }

  handleFollowerSearch(deltaTime: number) {
    var hour = 1 * 60 * 60; //average per hour

    if (this.globalService.globalVar.timers.followerSearchZoneTimer < 0) {
      this.globalService.globalVar.timers.followerSearchZoneTimer = 0;
    }

    var checkTime = this.globalService.globalVar.timers.followerSearchZoneTimerLength;
    this.globalService.globalVar.timers.followerSearchZoneTimer += deltaTime;

    if (this.globalService.globalVar.timers.followerSearchZoneTimer >= this.globalService.globalVar.timers.followerSearchZoneTimerLength) {
      this.globalService.globalVar.timers.followerSearchZoneTimer -= this.globalService.globalVar.timers.followerSearchZoneTimerLength;
      this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo === FollowerActionEnum.SearchingZone).forEach(follower => {
        var rewards = this.followerService.getZoneSearchRewards(follower.assignedZone); //bring this out of the for loop? only if performance is poor
        var zone = this.balladService.findZone(follower.assignedZone);
        var zoneName = zone !== undefined ? zone.zoneName : "";

        rewards.forEach(reward => {
          var chance = reward.amount / (hour / checkTime); //average = amount per hour divided by how often we check
          var rng = this.utilityService.getRandomNumber(0, 1);
          var rewardAmount = 1;

          if (rng <= chance) {
            var foundReward = new ResourceValue(reward.item, rewardAmount);
            if (this.globalService.globalVar.gameLogSettings.get("followerSearch")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.FollowerSearch, "Your followers found <strong>" + foundReward.amount + " " + this.dictionaryService.getItemName(foundReward.item) + "</strong> while searching " + zoneName + ".", this.globalService.globalVar);
            }
            this.lookupService.addLootToLog(foundReward.item, foundReward.amount, SubZoneEnum.Follower);
            this.lookupService.gainResource(foundReward);
          }
        });
      });
    }
  }

  handleFollowerPrayer(deltaTime: number) {
    if (this.globalService.globalVar.timers.followerPrayerTimer === undefined || this.globalService.globalVar.timers.followerPrayerTimer < 0) {
      this.globalService.globalVar.timers.followerPrayerTimer = 0;
      this.globalService.globalVar.timers.followerPrayerTimerLength = 60;
    }

    this.globalService.globalVar.timers.followerPrayerTimer += deltaTime;
    if (this.globalService.globalVar.timers.followerPrayerTimer >= this.globalService.globalVar.timers.followerPrayerTimerLength) {
      this.globalService.globalVar.timers.followerPrayerTimer -= this.globalService.globalVar.timers.followerPrayerTimerLength;
      this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo === FollowerActionEnum.Praying).forEach(follower => {
        if (follower.assignedPrayerType === FollowerPrayerTypeEnum.Activate) {
          var chance = 0;
          if (follower.assignedAltarType === AltarEnum.Small)
            chance = this.utilityService.smallAltarActivationChancePerFollower;
          else if (follower.assignedAltarType === AltarEnum.Large)
            chance = this.utilityService.largeAltarActivationChancePerFollower;

          var rng = this.utilityService.getRandomNumber(0, 1);

          if (rng <= chance) {
            //find available altar, activate it
            var altarOptions: AltarInfo[] = [];
            if (this.globalService.globalVar.altars.altar1 !== undefined && this.globalService.globalVar.altars.altar1.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar1.conditionCount >= this.globalService.globalVar.altars.altar1.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar1);
            if (this.globalService.globalVar.altars.altar2 !== undefined && this.globalService.globalVar.altars.altar2.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar2.conditionCount >= this.globalService.globalVar.altars.altar2.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar2);
            if (this.globalService.globalVar.altars.altar3 !== undefined && this.globalService.globalVar.altars.altar3.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar3.conditionCount >= this.globalService.globalVar.altars.altar3.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar3);

            if (altarOptions.length > 0) {
              var altarRng = this.utilityService.getRandomInteger(0, altarOptions.length - 1);
              this.altarService.pray(altarOptions[altarRng], true, true);
            }
          }
        }
        else if (follower.assignedPrayerType === FollowerPrayerTypeEnum.Pray) {
          if (follower.assignedAltarType === AltarEnum.Small) {
            var chance = this.utilityService.smallAltarPrayChancePerFollower;
            var rng = this.utilityService.getRandomNumber(0, 1);

            if (rng <= chance) {
              var altar = this.altarService.getNewAltar(AltarEnum.Small, undefined, false);
              this.altarService.pray(altar, true);
            }
          }
          if (follower.assignedAltarType === AltarEnum.Large) {
            var chance = this.utilityService.largeAltarPrayChancePerFollower;
            var rng = this.utilityService.getRandomNumber(0, 1);

            if (rng <= chance) {
              var altar = this.altarService.getNewAltar(AltarEnum.Large, undefined, false);
              this.altarService.pray(altar, true);
            }
          }
        }
      });
    }
  }

  handleItemCooldowns(deltaTime: number) {
    if (this.globalService.globalVar.timers.itemCooldowns !== undefined && this.globalService.globalVar.timers.itemCooldowns.length > 0) {
      this.globalService.globalVar.timers.itemCooldowns.forEach(item => {
        item[1] -= deltaTime;
      });
    }

    this.globalService.globalVar.timers.itemCooldowns = this.globalService.globalVar.timers.itemCooldowns.filter(item => item[1] > 0);
  }

  checkForDailyOccurrences(deltaTime: number) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var lastTicketDate = new Date(this.globalService.globalVar.sidequestData.lastWeeklyMeleeTicketReceived);
    if (lastTicketDate === undefined)
      lastTicketDate = new Date();

    var dayOfLastTicket = new Date(lastTicketDate.getFullYear(), lastTicketDate.getMonth(), lastTicketDate.getDate());
    dayOfLastTicket.setHours(0, 0, 0);
    var todaysDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    todaysDate.setHours(0, 0, 0);

    var diffDays = Math.floor(Math.abs((todaysDate.valueOf() - dayOfLastTicket.valueOf()) / oneDay));
    if (diffDays > 0) {
      var ticketMultiplier = 1;
      if (this.globalService.globalVar.isSubscriber)
        ticketMultiplier = 2;

      var bonusTicket = false;
      if (todaysDate.getDay() === 6 || todaysDate.getDay() === 0) {
        bonusTicket = true;
      }

      this.globalService.globalVar.sidequestData.weeklyMeleeEntries += diffDays * ticketMultiplier;

      if (bonusTicket) {
        this.globalService.globalVar.sidequestData.weeklyMeleeEntries += ticketMultiplier;
      }

      if (this.globalService.globalVar.sidequestData.weeklyMeleeEntries > (this.utilityService.weeklyMeleeEntryCap * ticketMultiplier))
        this.globalService.globalVar.sidequestData.weeklyMeleeEntries = (this.utilityService.weeklyMeleeEntryCap * ticketMultiplier);
    }
    this.globalService.globalVar.sidequestData.lastWeeklyMeleeTicketReceived = new Date();
  }

  checkGodStatuses(character: Character) {
    if ((character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis) &&
      !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", character);
      if (dispenserOfDues !== undefined) {
        this.battleService.applyStatusEffect(dispenserOfDues.userEffect[0], character);
      }
    }
    else if ((character.assignedGod1 !== GodEnum.Nemesis && character.assignedGod2 !== GodEnum.Nemesis) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DispenserOfDues);
    }

    if ((character.assignedGod1 === GodEnum.Hera || character.assignedGod2 === GodEnum.Hera) &&
      !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Shapeshift)) {
      var shapeshift = this.lookupService.characterHasAbility("Shapeshift", character);
      if (shapeshift !== undefined) {
        var copy = this.globalService.makeStatusEffectCopy(shapeshift.userEffect[0]);
        copy.effectiveness = 1;
        this.battleService.applyStatusEffect(copy, character);
      }
    }
    if ((character.assignedGod1 !== GodEnum.Hera && character.assignedGod2 !== GodEnum.Hera) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Shapeshift)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Shapeshift);
    }
  }

  checkForThornsGems(character: Character) {
    var total = this.equipmentService.getFlatThornDamageGain(character.equipmentSet);
    var gemThornsEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns && item.caster === character.name + "Gems");

    if (total > 0) {
      if (gemThornsEffect === undefined) {
        character.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, total, false, true, false, character.name + "Gems"));
      }
      else {
        gemThornsEffect.effectiveness = total;
      }
    }
    else if (total === 0 && gemThornsEffect !== undefined) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.Thorns && item.caster === character.name + "Gems"));
    }
  }

  handleMelete(deltaTime: number) {
    if (this.globalService.globalVar.melete.activeActions.length > 0) {
      this.globalService.globalVar.melete.activeActions.forEach(action => {
        action[1] -= deltaTime;
      });
    }

    this.globalService.globalVar.melete.activeActions = this.globalService.globalVar.melete.activeActions.filter(item => item[1] > 0);
  }

  handleSparringMatchMultiplier(deltaTime: number) {
    this.globalService.globalVar.sidequestData.sparringMatchTimer += deltaTime;
    var resetTimer = 15 * 60;

    if (this.globalService.globalVar.sidequestData.sparringMatchTimer >= resetTimer) {
      this.globalService.globalVar.sidequestData.sparringMatchTimer -= resetTimer;

      this.globalService.globalVar.sidequestData.sparringMatchMultiplier /= 1.1;

      if (this.globalService.globalVar.sidequestData.sparringMatchMultiplier < 1)
        this.globalService.globalVar.sidequestData.sparringMatchMultiplier = 1;
    }
  }

  handleTimeFragments(deltaTime: number) {
    if (this.globalService.globalVar.timeFragmentRuns === undefined || this.globalService.globalVar.timeFragmentRuns.length === 0)
      return;

    this.globalService.globalVar.timeFragmentRuns.forEach(run => {
      run.timer += deltaTime;
      var lootInfo: [number, number, [ItemsEnum, number][]] | undefined = undefined;

      if (run.clearTime === undefined || run.clearTime === null)
        return;

      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());

        if (trialType === undefined || trialType.count === 0)
          return;

        run.clearTime = this.getTimeFragmentClearRate(run);
      }

      if (run.selectedTrial === TrialEnum.TrialOfTheStarsNormal || run.selectedTrial === TrialEnum.TrialOfTheStarsHard || run.selectedTrial === TrialEnum.TrialOfTheStarsVeryHard || run.selectedTrial === TrialEnum.TrialOfTheStarsUltimate) {
        var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.zodiacType === this.zodiacService.getCurrentZodiac());

        if (trialType === undefined || trialType.count === 0)
          return;

        run.clearTime = this.getTimeFragmentClearRate(run);
      }

      while (run.timer >= run.clearTime) {
        if (lootInfo === undefined)
          lootInfo = this.getTimeFragmentCondensedRewards(run);

        //gain xp
        var xpGain = lootInfo[0];
        this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), xpGain);

        if (run.selectedTrial === TrialEnum.TrialOfSkill) {
          var efficiency = this.globalService.globalVar.isSubscriber ? this.utilityService.supporterTimeFragmentEfficiency : this.utilityService.timeFragmentEfficiency;
          var affinityXpGain = this.utilityService.trialAffinityXpGain * efficiency;

          var god = this.globalService.globalVar.gods.find(item => item.type === this.trialService.getGodEnumFromTrialOfSkillBattle());
          if (god !== undefined) {
            god.affinityExp += affinityXpGain;

            if (god.affinityExp >= god.affinityExpToNextLevel) {
              god.affinityExp -= god.affinityExpToNextLevel;
              god.affinityLevel += 1;
              god.affinityExpToNextLevel = this.utilityService.getFibonacciValue(god.affinityLevel + 3);

              if (this.globalService.globalVar.gameLogSettings.get("godAffinityLevelUp")) {
                var gameLogEntry = "<strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains Affinity Level " + god.affinityLevel + ".";
                this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry, this.globalService.globalVar);
              }

              if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm) {
                this.lookupService.gainResource(new ResourceValue(this.altarService.getSmallCharmOfGod(god.type), 1));
              }
              else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm) {
                this.lookupService.gainResource(new ResourceValue(this.altarService.getLargeCharmOfGod(god.type), 1));
              }
            }
          }
        }

        //gain coins
        var coinGain = lootInfo[1];
        this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, coinGain));

        //gain rewards
        var lootOptions = lootInfo[2];
        if (lootOptions.length > 0) {
          lootOptions.forEach(loot => {
            var rng = this.utilityService.getRandomNumber(0, 1);
            var lootChance = loot[1];

            var lootRateEffect = this.globalService.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.LootRateUp);
            if (lootRateEffect !== undefined) {
              lootChance = lootChance * lootRateEffect.effectiveness;
            }

            if (rng <= lootChance) {
              if (this.lookupService.isItemUnique(loot[0])) {
                var existingUnique = this.globalService.globalVar.uniques.find(item => item.type === loot[0]);
                if (existingUnique !== undefined) {
                  this.lookupService.giveUniqueXp(existingUnique, 1);
                }
              }
              else
                this.lookupService.gainResource(new ResourceValue(loot[0], 1));
            }
          });
        }

        run.timer -= run.clearTime;
      }
    });
  }

  getTimeFragmentClearRate(run: TimeFragmentRun) {
    var clearRate = 0;
    var maxDps = 0;
    var hpList: number[] = [];
    var enemyOptions: EnemyTeam[] = [];

    if (run.selectedTrial !== undefined) {
      var trialType: TrialDefeatCount | undefined;
      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      }
      else if (run.selectedTrial === TrialEnum.TrialOfTheStarsNormal || run.selectedTrial === TrialEnum.TrialOfTheStarsHard || run.selectedTrial === TrialEnum.TrialOfTheStarsVeryHard || run.selectedTrial === TrialEnum.TrialOfTheStarsUltimate) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.zodiacType === this.zodiacService.getCurrentZodiac());
      }
      else {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial);
      }

      if (trialType !== undefined)
        maxDps = trialType.highestDps;

      var trial = this.dictionaryService.getTrialInfoFromType(run.selectedTrial);
      enemyOptions = this.trialService.generateBattleOptions(trial);
      enemyOptions.forEach(enemyTeam => {
        var teamHp = 0;

        enemyTeam.enemyList.forEach(enemy => {
          if (run.selectedTrial === TrialEnum.TrialOfSkill && trialType !== undefined)
            teamHp += trialType.highestHp;
          else
            teamHp += enemy.battleStats.maxHp;
        });
        hpList.push(teamHp);
      });
    }
    else if (run.selectedSubzone !== undefined) {
      var subzone = this.balladService.findSubzone(run.selectedSubzone);
      if (subzone !== undefined)
        maxDps = subzone.maxDps;

      enemyOptions = this.subzoneGeneratorService.generateBattleOptions(run.selectedSubzone);
      enemyOptions.forEach(enemyTeam => {
        var teamHp = 0;

        enemyTeam.enemyList.forEach(enemy => {
          teamHp += enemy.battleStats.maxHp;
        });

        hpList.push(teamHp);
      });
    }

    var hpSum = hpList.reduce(function (acc, cur) { return acc + cur; });
    clearRate = this.utilityService.genericShortRound(this.utilityService.genericShortRound(hpSum / hpList.length) / maxDps);

    if (clearRate < this.utilityService.timeFragmentClearRateMinimumSeconds)
      clearRate = this.utilityService.timeFragmentClearRateMinimumSeconds;

    return clearRate;
  }

  getTimeFragmentCondensedRewards(run: TimeFragmentRun): [number, number, [ItemsEnum, number][]] {
    var enemyOptions: EnemyTeam[] = [];
    var lootOptions: [ItemsEnum, number][] = []; //item, rate divided by number of teams
    var finalLootOptions: [ItemsEnum, number][] = []; //compress the list so duplicates are combined
    var xpList: number[] = [];
    var coinList: number[] = [];
    var xpGained = 0;
    var coinsGained = 0;
    var fragmentEfficiency = this.globalService.globalVar.isSubscriber ? this.utilityService.supporterTimeFragmentEfficiency : this.utilityService.timeFragmentEfficiency;

    if (run.selectedTrial !== undefined) {
      /*var trialType: TrialDefeatCount | undefined;
      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      }
      else {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial);
      }*/

      var trial = this.dictionaryService.getTrialInfoFromType(run.selectedTrial);
      enemyOptions = this.trialService.generateBattleOptions(trial);
      enemyOptions.forEach(enemyTeam => {
        var teamXp = 0;
        var teamCoins = 0;

        enemyTeam.enemyList.forEach(enemy => {
          var partySizeXpMultiplier = 1;
          if (enemyTeam.enemyList.length === 2)
            partySizeXpMultiplier = 1.15;
          if (enemyTeam.enemyList.length === 3)
            partySizeXpMultiplier = 1.3;
          if (enemyTeam.enemyList.length === 4)
            partySizeXpMultiplier = 1.45;

          teamXp += enemy.xpGainFromDefeat * partySizeXpMultiplier;
          teamCoins += enemy.coinGainFromDefeat;

          if (enemy.loot !== undefined && enemy.loot.length > 0) {
            enemy.loot.forEach(loot => {
              if (loot.item === ItemsEnum.GoldenApple || loot.item === ItemsEnum.FireAbsorptionPotionRecipe || loot.item === ItemsEnum.WaterAbsorptionPotionRecipe ||
                loot.item === ItemsEnum.LightningAbsorptionPotionRecipe || loot.item === ItemsEnum.EarthAbsorptionPotionRecipe || loot.item === ItemsEnum.HolyAbsorptionPotionRecipe ||
                loot.item === ItemsEnum.AirAbsorptionPotionRecipe || loot.item === ItemsEnum.PoisonExtractPotionRecipe || loot.item === ItemsEnum.PotentConcoctionRecipe)
                return;

              lootOptions.push([loot.item, (loot.chance * loot.amount * fragmentEfficiency) / enemyOptions.length]);
            });
          }
        });

        xpList.push(teamXp);
        coinList.push(teamCoins);
      });
    }
    else if (run.selectedSubzone !== undefined) {
      enemyOptions = this.subzoneGeneratorService.generateBattleOptions(run.selectedSubzone);
      enemyOptions.forEach(enemyTeam => {
        var teamXp = 0;
        var teamCoins = 0;

        enemyTeam.enemyList.forEach(enemy => {
          var partySizeXpMultiplier = 1;
          if (enemyTeam.enemyList.length === 2)
            partySizeXpMultiplier = 1.15;
          if (enemyTeam.enemyList.length === 3)
            partySizeXpMultiplier = 1.3;
          if (enemyTeam.enemyList.length === 4)
            partySizeXpMultiplier = 1.45;

          teamXp += enemy.xpGainFromDefeat * partySizeXpMultiplier;
          teamCoins += enemy.coinGainFromDefeat;

          if (enemy.loot !== undefined && enemy.loot.length > 0) {
            enemy.loot.forEach(loot => {
              if (loot.item === ItemsEnum.GoldenApple || loot.item === ItemsEnum.FireAbsorptionPotionRecipe || loot.item === ItemsEnum.WaterAbsorptionPotionRecipe ||
                loot.item === ItemsEnum.LightningAbsorptionPotionRecipe || loot.item === ItemsEnum.EarthAbsorptionPotionRecipe || loot.item === ItemsEnum.HolyAbsorptionPotionRecipe ||
                loot.item === ItemsEnum.AirAbsorptionPotionRecipe || loot.item === ItemsEnum.PoisonExtractPotionRecipe || loot.item === ItemsEnum.PotentConcoctionRecipe)
                return;

              lootOptions.push([loot.item, (loot.chance * loot.amount * fragmentEfficiency) / enemyOptions.length]);
            });
          }
        });

        xpList.push(teamXp);
        coinList.push(teamCoins);
      });

      var treasureChestRewards = this.subzoneGeneratorService.getTreasureChestRewards(run.selectedSubzone);
      if (treasureChestRewards !== undefined && treasureChestRewards.length > 0 && run.selectedSubzone !== SubZoneEnum.AigosthenaUpperCoast
        && run.selectedSubzone !== SubZoneEnum.AigosthenaBay && run.selectedSubzone !== SubZoneEnum.AigosthenaLowerCoast && run.selectedSubzone !== SubZoneEnum.DodonaMountainOpening) {
        var chance = this.subzoneGeneratorService.generateTreasureChestChance(run.selectedSubzone);
        treasureChestRewards.forEach(reward => {
          lootOptions.push([reward.item, chance * fragmentEfficiency * reward.amount]);
        });
      }
    }

    var xpSum = xpList.reduce(function (acc, cur) { return acc + cur; });
    xpGained = this.utilityService.genericShortRound(xpSum / xpList.length);

    var coinSum = coinList.reduce(function (acc, cur) { return acc + cur; });
    coinsGained = this.utilityService.genericShortRound(coinSum / coinList.length);

    lootOptions.forEach(loot => {
      var lootOption = finalLootOptions.find(item => item[0] === loot[0]);
      if (lootOption !== undefined) {
        lootOption[1] += loot[1];
      }
      else {
        finalLootOptions.push(loot);
      }
    });


    return [xpGained * fragmentEfficiency, coinsGained * fragmentEfficiency, finalLootOptions];
  }
}
