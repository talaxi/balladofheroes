import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as pluralize from 'pluralize';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { MenuService } from '../menu/menu.service';
import { StoryService } from '../story/story.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battle: Battle;
  isPaused: boolean;
  battleItemInUse: ItemsEnum;
  targetbattleItemMode: boolean = false;
  showNewEnemyGroup = false;
  bankedTime = 0;
  catchupDialog: MatDialogRef<unknown, any> | undefined = undefined;

  constructor(private globalService: GlobalService, private subzoneGeneratorService: SubZoneGeneratorService,
    private balladService: BalladService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService, private storyService: StoryService, private achievementService: AchievementService,
    private menuService: MenuService, public dialog: MatDialog) { }

  handleBattle(deltaTime: number, loadingContent: any) {
    //institute a max deltaTime before stop automating and adding to double time, currently set to 60 minutes    
    if (this.isPaused)
    deltaTime = 0;
    
    this.handleShortTermCatchUpTime(deltaTime, loadingContent);    

    var subZone = this.balladService.getActiveSubZone();    

    if (this.globalService.globalVar.activeBattle === undefined)
      this.initializeBattle();

    this.battle = this.globalService.globalVar.activeBattle!;
    if (this.battle === undefined)
      return;

    if (subZone.isTown) //no need to check any battle info
    {
      this.battle.atTown = true;
      return;
    }
    else
      this.battle.atTown = false;


    if (this.battle.atScene) {
      var continueShowing = false;
      if (this.battle.sceneType === SceneTypeEnum.Story) {
        continueShowing = this.storyService.handleScene(deltaTime);
      }
      else if (this.battle.sceneType === SceneTypeEnum.Chest) {
        continueShowing = this.handleChest(deltaTime);
      }

      if (!continueShowing) {
        this.battle.atScene = false;
        this.battle.sceneType = SceneTypeEnum.None;
      }
    }
    else {
      if (this.battle.currentEnemies === undefined || this.battle.currentEnemies.enemyList.length === 0)
        this.initializeEnemyList();

      var party = this.globalService.getActivePartyCharacters(true);
      var enemies = this.battle.currentEnemies.enemyList;

      party.forEach(partyMember => {
        //check for defeated
        var isDefeated = this.isCharacterDefeated(partyMember);
        if (!isDefeated) {
          //check for status effects
          this.updateBattleStats(partyMember);
          this.handleStatusEffectDurations(partyMember, deltaTime);
          this.handleAutoAttackTimer(partyMember, enemies, deltaTime);
          this.handleAbilities(partyMember, enemies, party, deltaTime);
        }
      });

      enemies.forEach(enemy => {
        var isDefeated = this.isCharacterDefeated(enemy);
        if (!isDefeated) {
          this.handleStatusEffectDurations(enemy, deltaTime);
          this.handleAutoAttackTimer(enemy, party, deltaTime);
          this.handleAbilities(enemy, party, enemies, deltaTime);
        }
      });

      if (deltaTime > 0)
        this.updateBattleState(party, enemies);
    }
  }

  openCatchUpModal(content: any) {
    var dialog = this.dialog.open(content, { width: '50%' });

    return dialog;
  }

  initializeBattle() {
    this.globalService.globalVar.activeBattle = new Battle();
    this.checkScene();
  }

  checkBreakpoints() {
    var subzone = this.balladService.getActiveSubZone();

    var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
    if (subzone.type === SubZoneEnum.AigosthenaHeartOfTheWoods && subzone.victoryCount >= 1) {
      if (athena !== undefined && !athena.isAvailable) {
        athena.isAvailable = true;

        athena.abilityList.forEach(ability => {
          if (athena!.level >= ability.requiredLevel)
            ability.isAvailable = true;
        });

        var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
        if (character1 !== undefined) {
          character1.assignedGod1 = GodEnum.Athena;
        }
      }
    }

    if (subzone.type === SubZoneEnum.DodonaCountryside && subzone.victoryCount >= 1) {
      this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
      this.menuService.setNewPartyMember2(this.globalService.globalVar.activePartyMember2);

      var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
      if (artemis !== undefined && !artemis.isAvailable) {
        artemis.isAvailable = true;

        artemis.abilityList.forEach(ability => {
          if (athena!.level >= ability.requiredLevel)
            ability.isAvailable = true;
        });

        var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);
        if (character2 !== undefined) {
          character2.assignedGod1 = GodEnum.Artemis;
        }
      }
    }

    //TODO: THIS IS JUST FOR THE TUTORIAL RELEASE BUT WILL EVENTUALLY BE REMOVED
    //VVV
    if (subzone.type === SubZoneEnum.DodonaCountryside && subzone.victoryCount >= 1) {
      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      if (hermes !== undefined && !hermes.isAvailable) {
        hermes.isAvailable = true;

        hermes.abilityList.forEach(ability => {
          if (apollo!.level >= ability.requiredLevel)
            ability.isAvailable = true;
        });

        var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
        if (character1 !== undefined) {
          character1.assignedGod2 = GodEnum.Hermes;
        }
      }

      var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
      if (apollo !== undefined && !apollo.isAvailable) {
        apollo.isAvailable = true;

        apollo.abilityList.forEach(ability => {
          if (apollo!.level >= ability.requiredLevel)
            ability.isAvailable = true;
        });

        var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);
        if (character2 !== undefined) {
          character2.assignedGod2 = GodEnum.Apollo;
        }
      }
    }
    //^^^
  }

  checkScene() {
    var subzone = this.balladService.getActiveSubZone();
    this.storyService.checkForNewStoryScene();

    if (this.storyService.showStory) {
      this.globalService.globalVar.activeBattle.atScene = true;
      this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Story;
    }
    else {
      //TODO: get random % for other scenes
      //get % per subzone of treasure chest
      var treasureChestChance = this.subzoneGeneratorService.generateTreasureChestChance(subzone.type);
      //get % per subzone of altar
      var altarChance = 0;

      var rng = this.utilityService.getRandomNumber(0, 1);

      //auto gain throwing stones in aigosthena upper coast
      if (subzone.type === SubZoneEnum.AigosthenaUpperCoast && subzone.victoryCount >= 3 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded = true;
      }

      //auto gain a sword in aigosthena bay
      if (subzone.type === SubZoneEnum.AigosthenaBay && subzone.victoryCount >= 4 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaBayAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaBayAwarded = true;
      }

      if (rng <= treasureChestChance) {
        //Get chest rewards
        this.globalService.globalVar.activeBattle.atScene = true;
        this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Chest;
        this.globalService.globalVar.activeBattle.chestRewards = this.subzoneGeneratorService.getTreasureChestRewards(subzone.type);
        this.globalService.globalVar.activeBattle.chestRewards.forEach(reward => {
          this.lookupService.gainResource(reward);
        });
      }
    }
  }

  initializeEnemyList() {
    var subZone = this.balladService.getActiveSubZone();
    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subZone.type);
    var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
    this.battle.currentEnemies = randomEnemyTeam;
  }

  handleStatusEffectDurations(character: Character, deltaTime: number) {
    if (character.battleInfo.statusEffects.length === 0)
      return;

    character.battleInfo.statusEffects.forEach(effect => {
      effect.duration -= deltaTime;

      if (effect.type === StatusEffectEnum.DamageOverTime) {
        //check tick time
        effect.tickTimer += deltaTime;
        if (effect.tickTimer >= effect.tickFrequency) {
          //deal damage
          var damageDealt = this.dealTrueDamage(character, effect.effectiveness);
          var gameLogEntry = "<strong>" + character.name + "</strong>" + " takes " + damageDealt + " damage from " + effect.associatedAbilityName + "'s effect.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);

          effect.tickTimer -= effect.tickFrequency;
        }
      }
    });

    character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(effect => effect.duration > 0);
  }

  //add equipment and permanent stats to base stats
  updateBattleStats(character: Character) {
    this.globalService.calculateCharacterBattleStats(character);
  }

  handleAutoAttackTimer(character: Character, targets: Character[], deltaTime: number) {
    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun))
      character.battleInfo.autoAttackTimer += deltaTime;

    var timeToAutoAttack = this.lookupService.getAutoAttackTime(character);

    //hopefully unnecessary fail safe
    var autoAttacksAtOnce = 0;
    var totalAutoAttacksAtOnce = 100;

    while (character.battleInfo.autoAttackTimer >= timeToAutoAttack && autoAttacksAtOnce < totalAutoAttacksAtOnce &&
      (character.battleInfo.autoAttackAutoMode || character.battleInfo.autoAttackManuallyTriggered)) {
      this.handleAutoAttack(character, targets);
      character.battleInfo.autoAttackTimer -= timeToAutoAttack;

      if (character.battleInfo.autoAttackManuallyTriggered)
        character.battleInfo.autoAttackTimer = 0;
      autoAttacksAtOnce += 1;
    }

    character.battleInfo.autoAttackManuallyTriggered = false;
  }

  handleAutoAttack(character: Character, targets: Character[]) {
    //TODO: handle targetting system -- default to random but have options to target highest or lowest hp and other conditions
    var target = this.getTarget(character, targets);

    var damageMultiplier = this.getDamageMultiplier(character, target);
    var isCritical = this.isDamageCritical(character, target);

    var damageDealt = this.dealDamage(character, target, isCritical, undefined, damageMultiplier);

    var gameLogEntry = "<strong>" + character.name + "</strong>" + " attacks <strong>" + target.name + "</strong> for " + damageDealt + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);

    if (character.abilityList.find(item => item.name === "Barrage" && item.isAvailable)) {
      var barrage = character.abilityList.find(item => item.name === "Barrage" && item.isAvailable)!;
      barrage.count += 1;

      if (barrage.count >= barrage.maxCount) {
        var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
        var additionalTargets = potentialTargets.filter(item => item !== target);
        if (additionalTargets.length > 0) {
          additionalTargets.forEach(additionalTarget => {
            var additionalDamageDealt = this.dealDamage(character, additionalTarget, false, undefined, barrage!.effectiveness);
            var gameLogEntry = "<strong>" + character.name + "</strong>" + "'s attack hits <strong>" + additionalTarget.name + "</strong> for " + additionalDamageDealt + " damage as well.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          });
        }
        barrage.count = 0;
      }
    }
  }

  handleAbilities(character: Character, targets: Character[], partyMembers: Character[], deltaTime: number) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        this.handleAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.handleAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.handleAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
          });
      }
    }
  }

  handleAbilityCooldown(character: Character, ability: Ability, deltaTime: number, partyMembers: Character[], targets: Character[]) {
    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun))
      ability.currentCooldown -= deltaTime;

    if (ability.currentCooldown <= 0) {
      ability.currentCooldown = 0;

      if (targets !== undefined && targets.length > 0 && (ability.autoMode || ability.manuallyTriggered)) {
        this.useAbility(ability, character, ability.targetsAllies ? partyMembers : targets, partyMembers, true);
        ability.currentCooldown = ability.cooldown;
      }

      ability.manuallyTriggered = false;
    }
  }

  useAbility(ability: Ability, user: Character, targets: Character[], party: Character[], isGodAbility: boolean) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    var target = this.getTarget(user, targets, ability.targetType !== undefined ? ability.targetType : TargetEnum.Random);

    var abilityEffectiveness = this.getAbilityEffectiveness(user, target, ability, party, isGodAbility);

    if (ability.dealsDirectDamage) {
      var damageMultiplier = this.getDamageMultiplier(user, target);
      var isCritical = this.isDamageCritical(user, target);

      var damageDealt = this.dealDamage(user, target, isCritical, abilityEffectiveness, damageMultiplier, ability);
      var gameLogEntry = "<strong>" + user.name + "</strong>" + " uses " + ability.name + " on <strong>" + target.name + "</strong> for " + damageDealt + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
    }
    else if (ability.heals) {
      var healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user);
      var adjustedCriticalMultiplier = 1;
      var isCritical = this.isHealCritical(user);
      if (isCritical)
        adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user);
      healAmount *= adjustedCriticalMultiplier;

      var healedAmount = this.gainHp(target, healAmount);
      var gameLogEntry = "<strong>" + user.name + "</strong>" + " uses " + ability.name + " on " + target.name + ", restoring " + healedAmount + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
    }
    else if (ability.name === "Pray") {
      var barrierAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user);

      targets.forEach(partyMember => {
        partyMember.battleInfo.barrierValue += barrierAmount;

        if (partyMember.battleInfo.barrierValue > partyMember.battleStats.maxHp * ability.threshold) {
          //TODO: maybe don't overwrite existing effect though if it was already higher
          partyMember.battleInfo.barrierValue = partyMember.battleStats.maxHp * ability.threshold;
        }
      });

      var gameLogEntry = "<strong>" + user.name + "</strong>" + " uses " + ability.name + ", shielding allies for " + barrierAmount + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
    }
    else {
      var gameLogEntry = "<strong>" + user.name + "</strong>" + " uses " + ability.name + ".";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
    }

    if (ability.userGainsStatusEffect.length > 0) {
      ability.userGainsStatusEffect.forEach(gainedStatusEffect => {
        user.battleInfo.statusEffects.push(gainedStatusEffect.makeCopy());
      });

      if (user.battleInfo.statusEffects.some(item => item.isInstant)) {
        user.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
          if (instantEffect.type === StatusEffectEnum.InstantHeal) {
            var healAmount = damageDealt * instantEffect.effectiveness;
            this.gainHp(user, healAmount);
          }
        });

        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => !item.isInstant);
      }
    }

    if (ability.targetGainsStatusEffect.length > 0) {
      ability.targetGainsStatusEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = gainedStatusEffect.makeCopy();

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          appliedStatusEffect.effectiveness = user.battleStats.attack * appliedStatusEffect.effectiveness;
        }

        this.applyStatusEffect(appliedStatusEffect, target, potentialTargets);

        var mark = user.abilityList.find(item => item.name === "Mark" && item.isAvailable);
        if (mark !== undefined) {
          var markEffect = mark.targetGainsStatusEffect[0].makeCopy();
          markEffect.duration = gainedStatusEffect.duration;
          markEffect.isAoe = gainedStatusEffect.isAoe;

          this.applyStatusEffect(markEffect, target, potentialTargets);
        }
      });

      if (target.battleInfo.statusEffects.some(item => item.isInstant)) {
        target.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
          if (instantEffect.type === StatusEffectEnum.InstantHeal) {
            var healAmount = damageDealt * instantEffect.effectiveness;
            this.gainHp(target, healAmount);
          }
        });

        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => !item.isInstant);
      }
    }
  }

  getAbilityEffectiveness(character: Character, target: Character, ability: Ability, party: Character[], isGodAbility: boolean) {
    //return ability effectivness * faith boost
    var effectiveness = ability.effectiveness;

    //check for faith
    var priest = party.find(member => member.type === CharacterEnum.Priest);
    if (priest !== undefined) {
      var faith = priest.abilityList.find(item => item.name === "Faith" && item.isAvailable);
      if (faith !== undefined && isGodAbility) {
        effectiveness *= faith.effectiveness;
      }
    }

    return effectiveness;
  }

  getDamageMultiplier(character: Character, target: Character) {
    var overallDamageMultiplier = 1;

    //check for basic damage up/down buffs

    //each unique status effect is its own multiplier. or perhaps they should be additive, i'm not sure
    var thousandCutsDamageIncrease = 1;
    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ThousandCuts)) {
      var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThousandCuts)!;
      thousandCutsDamageIncrease += effect.effectiveness * effect.count;
      effect.count += 1;
    }

    //check for mark
    var markDamageIncrease = 1;
    if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Mark)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Mark)!;
      markDamageIncrease = effect.effectiveness;
    }

    return overallDamageMultiplier * thousandCutsDamageIncrease * markDamageIncrease;
  }

  applyStatusEffect(appliedStatusEffect: StatusEffect, target: Character, potentialTargets: Character[]) {
    if (appliedStatusEffect.isAoe) {
      potentialTargets.forEach(enemy => {
        var existingApplication = enemy.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (appliedStatusEffect.refreshes && existingApplication !== undefined) {
          if (appliedStatusEffect.duration > existingApplication.duration)
            existingApplication.duration = appliedStatusEffect.duration;
        }
        else
          enemy.battleInfo.statusEffects.push(appliedStatusEffect);
      });
    }
    else {
      var existingApplication = target.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
      if (appliedStatusEffect.refreshes && existingApplication !== undefined) {
        if (appliedStatusEffect.duration > existingApplication.duration)
          existingApplication.duration = appliedStatusEffect.duration;
      }
      else
        target.battleInfo.statusEffects.push(appliedStatusEffect);
    }
  }

  getTarget(user: Character, targets: Character[], targetType: TargetEnum = TargetEnum.Random) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    if (potentialTargets.length === 0)
      return new Character();

    var target = potentialTargets[0];

    if (targetType === TargetEnum.Random)
      target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
    else if (targetType === TargetEnum.LowestHpPercent) {
      potentialTargets = potentialTargets.sort(item => item.battleStats.getHpPercent());
      var target = potentialTargets[0];
    }

    var taunted = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Taunt);
    if (taunted !== undefined) {
      var tauntCaster = targets.find(caster => caster.name === taunted!.caster);
      if (tauntCaster !== undefined && !tauntCaster.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead))
        target = tauntCaster;
    }

    var targetsWithTaunt = potentialTargets.filter(target => target.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Taunt));
    if (targetsWithTaunt.length > 0) {
      var target = targetsWithTaunt[this.utilityService.getRandomInteger(0, targetsWithTaunt.length - 1)];
    }

    return target;
  }

  dealDamage(attacker: Character, target: Character, isCritical: boolean, abilityDamageMultiplier?: number, damageMultiplier?: number, ability?: Ability) {
    //damage formula, check for shields, check for ko
    if (abilityDamageMultiplier === undefined)
      abilityDamageMultiplier = 1;

    if (damageMultiplier === undefined)
      damageMultiplier = 1;

    var adjustedAttack = this.lookupService.getAdjustedAttack(attacker, ability);
    var adjustedDefense = this.lookupService.getAdjustedDefense(target);
    var adjustedCriticalMultiplier = 1;
    if (isCritical)
      adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(attacker);

    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
      (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier);

    /*
    Skill Power x ((ATK x ATK boost x 2/3) - (DEF x DEF boost x 2/5)) x (BRV DMG Reduction) x 
    (BRV DMG Dealt Multiplier) x (BRV DMG Increase Multiplier) x (Critical Damage) x (RNG)
    */

    if (damage < 0)
      damage = 0;

    var totalDamageDealt = damage;

    if (target.battleInfo.barrierValue > 0) {
      target.battleInfo.barrierValue -= damage;
      damage = 0;

      if (target.battleInfo.barrierValue < 0) {
        //deal remaining damage to hp
        damage = -target.battleInfo.barrierValue;
        target.battleInfo.barrierValue = 0;
      }
    }

    target.battleStats.currentHp -= damage;

    if (target.battleStats.currentHp < 0)
      target.battleStats.currentHp = 0;

    return totalDamageDealt;
  }

  //DoTs
  dealTrueDamage(target: Character, damage: number) {
    if (damage < 0)
      damage = 0;

    target.battleStats.currentHp -= damage;

    if (target.battleStats.currentHp < 0)
      target.battleStats.currentHp = 0;

    return damage;
  }

  //check for upper limits and any weird logic
  gainHp(character: Character, healAmount: number) {
    character.battleStats.currentHp += healAmount;

    if (character.battleStats.currentHp > character.battleStats.maxHp) {
      healAmount -= character.battleStats.currentHp - character.battleStats.maxHp;
      character.battleStats.currentHp = character.battleStats.maxHp;
    }

    return healAmount;
  }

  isHealCritical(user: Character) {
    var isCritical = false;
    var criticalChance = .05;
    var rng = this.utilityService.getRandomNumber(0, 1);

    criticalChance = this.lookupService.getHealingCriticalChance(user);

    if (rng <= criticalChance) {
      isCritical = true;
    }

    return isCritical;
  }

  isDamageCritical(attacker: Character, target: Character) {
    var isCritical = false;
    var criticalChance = .05;
    var rng = this.utilityService.getRandomNumber(0, 1);

    criticalChance = this.lookupService.getDamageCriticalChance(attacker, target);

    if (rng <= criticalChance) {
      isCritical = true;
    }

    return isCritical;
  }

  isCharacterDefeated(character: Character) {
    if (character.battleStats.currentHp <= 0) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.persistsDeath);
      if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        character.battleInfo.statusEffects.push(new StatusEffect(StatusEffectEnum.Dead, true));
      }

      return true;
    }
    else {
      return false;
    }
  }

  updateBattleState(party: Character[], enemies: Character[]) {
    var stateChanged = false;

    if (this.areCharactersDefeated(party)) {
      stateChanged = true;
      this.handlePartyDefeat();
    }

    if (this.areCharactersDefeated(enemies)) {
      stateChanged = true;
      this.moveToNextBattle();
    }

    if (stateChanged) {
      this.checkScene();
      this.checkBreakpoints();
    }
  }

  areCharactersDefeated(characters: Character[]) {
    var areCharactersDefeated = true;

    characters.forEach(item => {
      if (!item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        areCharactersDefeated = false;
      }
    });

    return areCharactersDefeated;
  }

  handlePartyDefeat() {
    this.isPaused = true;
    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated.");
  }

  moveToNextBattle() {
    this.showNewEnemyGroup = true;
    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "The enemy party has been defeated.");
    var subZone = this.balladService.getActiveSubZone();
    subZone.victoryCount += 1;
    var achievement = this.achievementService.checkForSubzoneAchievement(subZone.type, this.globalService.globalVar.achievements);

    if (achievement !== undefined) {
      this.addAchievementToGameLog(achievement);
    }

    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + this.lookupService.getTotalXpGainFromEnemyTeam(this.battle.currentEnemies.enemyList) + " XP</strong>.");
    this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies);
    var loot = this.getLoot(this.battle.currentEnemies);
    if (loot !== undefined && loot.length > 0) {
      loot.forEach(item => {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + item.amount + " " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : pluralize(this.lookupService.getItemName(item.item))) + "</strong>.");
        this.addLootToResources(item);
      });
    }

    if (subZone.victoryCount >= subZone.victoriesNeededToProceed) {
      this.unlockNextSubzone(subZone);
    }

    this.initializeEnemyList();
  }

  getLoot(defeatedEnemies: EnemyTeam) {
    var lootGained: ResourceValue[] = [];

    if (defeatedEnemies.enemyList.length === 0)
      return;

    defeatedEnemies.enemyList.forEach(enemy => {
      if (enemy.loot !== undefined && enemy.loot.length > 0) {
        enemy.loot.forEach(loot => {
          var rng = this.utilityService.getRandomNumber(0, 1);

          if (rng <= loot.chance) {
            if (lootGained.some(item => item.item === loot.item)) {
              var existingLootItem = lootGained.find(item => item.item === loot.item);
              if (existingLootItem !== undefined)
                existingLootItem.amount += loot.amount;
            }
            else
              lootGained.push(new ResourceValue(loot.item, loot.type, loot.amount));
          }
        });
      }
    });

    return lootGained;
  }

  addAchievementToGameLog(achievement: Achievement) {
    var achievementBonus = "";
    if (achievement.bonusResources !== undefined && achievement.bonusResources.length > 0) {
      achievement.bonusResources.forEach(item => {
        achievementBonus += "<strong>" + item.amount + " " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : pluralize(this.lookupService.getItemName(item.item))) + "</strong>, ";
      });

      achievementBonus = achievementBonus.substring(0, achievementBonus.length - 2);
    }
    var gameLogUpdate = "Achievement " + this.lookupService.getAchievementName(achievement) + " completed!";
    if (achievementBonus !== "")
      gameLogUpdate += " You gain " + achievementBonus + ".";

    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, gameLogUpdate);
  }

  addLootToResources(item: ResourceValue | undefined) {
    if (item === undefined)
      return;

    var existingResource = this.globalService.globalVar.resources.find(resource => item.item === resource.item);
    if (existingResource === undefined) {
      this.globalService.globalVar.resources.push(item);
    }
    else {
      existingResource.amount += item.amount;
    }
  }

  unlockNextSubzone(subZone: SubZone) {
    var subZoneUnlocks = this.subzoneGeneratorService.getSubZoneUnlocks(subZone.type);
    var zoneUnlocks = this.subzoneGeneratorService.getZoneUnlocks(subZone.type);
    var balladUnlocks = this.subzoneGeneratorService.getBalladUnlocks(subZone.type);

    if (balladUnlocks !== undefined && balladUnlocks.length > 0) {
      balladUnlocks.forEach(ballad => {
        var unlockedBallad = this.balladService.findBallad(ballad);
        if (unlockedBallad !== undefined && !unlockedBallad.isAvailable) {
          unlockedBallad.isAvailable = true;
          unlockedBallad.showNewNotification = true;
        }
      });
    }

    if (zoneUnlocks !== undefined && zoneUnlocks.length > 0) {
      zoneUnlocks.forEach(zone => {
        var unlockedZone = this.balladService.findZone(zone);
        if (unlockedZone !== undefined && !unlockedZone.isAvailable) {
          unlockedZone.isAvailable = true;
          unlockedZone.showNewNotification = true;
        }
      });
    }

    if (subZoneUnlocks !== undefined && subZoneUnlocks.length > 0) {
      subZoneUnlocks.forEach(subZone => {
        var unlockedSubZone = this.balladService.findSubzone(subZone);
        if (unlockedSubZone !== undefined && !unlockedSubZone.isAvailable) {
          unlockedSubZone.isAvailable = true;
          unlockedSubZone.showNewNotification = true;
          this.achievementService.createDefaultAchievementsForSubzone(subZone).forEach(achievement => {
            this.globalService.globalVar.achievements.push(achievement);
          });
        }
      });
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  useBattleItem(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
      return;

    var selectedItem = this.globalService.globalVar.itemBelt[slotNumber];

    if (selectedItem === undefined || this.lookupService.getResourceAmount(selectedItem) === 0) {
      this.targetbattleItemMode = false;
      return;
    }

    if (this.lookupService.itemDoesNotNeedSelection()) {
      //use item      
    }
    else {
      if (this.targetbattleItemMode === false) {
        this.battleItemInUse = selectedItem;
        this.targetbattleItemMode = true;
      }
      else
        this.targetbattleItemMode = false;
    }
  }

  isTargetableWithItem(character: Character, isEnemy: boolean) {
    var isTargetable = true;
    var isCharacterDead = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Dead) !== undefined;

    if (!this.targetbattleItemMode || this.battleItemInUse === undefined || this.battleItemInUse === ItemsEnum.None) {
      isTargetable = false;
      return isTargetable;
    }

    var itemType = this.lookupService.getItemTypeFromItemEnum(this.battleItemInUse);
    if (itemType === ItemTypeEnum.None) {
      console.log("Error getting item type from item");
      isTargetable = false;
      return isTargetable;
    }

    if (itemType === ItemTypeEnum.HealingItem) {
      if (isEnemy || isCharacterDead)
        isTargetable = false;
    }

    if (itemType === ItemTypeEnum.BattleItem) {
      if (!isEnemy || isCharacterDead) {
        isTargetable = false;
      }
    }

    return isTargetable;
  }

  useBattleItemOnCharacter(character: Character) {
    if (!this.targetbattleItemMode || this.battleItemInUse === undefined || this.battleItemInUse === ItemsEnum.None)
      return;

    if (this.battleItemInUse === ItemsEnum.HealingHerb) {
      if (character.battleStats.currentHp === character.battleStats.maxHp)
        return;

      var healedAmount = this.gainHp(character, this.lookupService.getHealingHerbAmount())
      this.lookupService.useResource(this.battleItemInUse, 1);

      var gameLogEntry = "<strong>" + character.name + "</strong>" + " uses a Healing Herb, gaining " + healedAmount + " HP.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
    }

    if (this.battleItemInUse === ItemsEnum.ThrowingStone) {
      if (character.battleStats.currentHp <= 0)
        return;

      var damage = this.dealTrueDamage(character, this.lookupService.getThrowingStoneAmount())
      this.lookupService.useResource(this.battleItemInUse, 1);

      var gameLogEntry = "<strong>" + character.name + "</strong>" + " is hit by a Throwing Stone, dealing " + damage + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
    }

    if (this.lookupService.getResourceAmount(this.battleItemInUse) === 0) {
      this.targetbattleItemMode = false;
    }
  }

  handleChest(deltaTime: number) {
    this.globalService.globalVar.timers.chestTimer += deltaTime;
    if (this.globalService.globalVar.timers.chestTimer >= this.globalService.globalVar.timers.chestLength) {
      this.globalService.globalVar.timers.chestTimer = 0;
      return false;
    }

    return true;
  }

  handleShortTermCatchUpTime(deltaTime: number, loadingContent: any) {
    if (deltaTime > 1 * 60 * 60)
      deltaTime = 1 * 60 * 60;

    var batchTime = 5;
    //user was afk, run battle in batches until you're caught up
    if (deltaTime > batchTime) {
      this.bankedTime += deltaTime - batchTime;
      deltaTime = batchTime;

      if (this.bankedTime > 60 && this.catchupDialog === undefined)
        this.catchupDialog = this.openCatchUpModal(loadingContent);
    }

    if (deltaTime < batchTime && this.bankedTime > 0) {

      if (this.bankedTime + deltaTime <= batchTime) //amount of time banked is less than a batch so use it all
      {
        deltaTime += this.bankedTime;
        this.bankedTime = 0;

        if (this.catchupDialog !== undefined) {
          this.catchupDialog.close();
          this.catchupDialog = undefined;
        }
      }
      else //use partial amount of banked time
      {
        var useAmount = batchTime - deltaTime;
        this.bankedTime -= useAmount;
        deltaTime += useAmount;

        if (this.bankedTime <= 0)
          this.bankedTime = 0;
      }
    }
  }
}
