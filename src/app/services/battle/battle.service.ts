import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as pluralize from 'pluralize';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DamageOverTimeTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
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
  battleItemInUse: ItemsEnum;
  targetbattleItemMode: boolean = false;
  showNewEnemyGroup = false;
  currentSubzoneType: SubZoneEnum;

  constructor(private globalService: GlobalService, private subzoneGeneratorService: SubZoneGeneratorService,
    private balladService: BalladService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService, private storyService: StoryService, private achievementService: AchievementService,
    private menuService: MenuService, public dialog: MatDialog, private tutorialService: TutorialService) { }

  handleBattle(deltaTime: number, loadingContent: any) {
    var subZone = this.balladService.getActiveSubZone();
    if (this.currentSubzoneType !== undefined && this.currentSubzoneType !== subZone.type) {
      this.checkScene();
    }
    this.currentSubzoneType = subZone.type;

    if (this.globalService.globalVar.activeBattle === undefined)
      this.initializeBattle();

    this.battle = this.globalService.globalVar.activeBattle!;
    if (this.battle === undefined)
      return;

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
      if (subZone.isTown) //no need to check any battle info
      {
        this.battle.atTown = true;
        return;
      }
      else
        this.battle.atTown = false;

      if (this.battle.currentEnemies === undefined || this.battle.currentEnemies.enemyList.length === 0)
        this.initializeEnemyList();

      var party = this.globalService.getActivePartyCharacters(true);
      var enemies = this.battle.currentEnemies.enemyList;

      //randomized so that you don't always kill enemies before they have the chance to move
      if (!this.globalService.globalVar.isCatchingUp || (this.utilityService.getRandomNumber(0, 1) <= .5)) {
        this.handlePartyActions(party, enemies, deltaTime);
        this.handleEnemyActions(enemies, party, deltaTime);
      }
      else {
        this.handleEnemyActions(enemies, party, deltaTime);
        this.handlePartyActions(party, enemies, deltaTime);
      }

      if (deltaTime > 0)
        this.updateBattleState(party, enemies);
    }
  }

  handlePartyActions(party: Character[], enemies: Character[], deltaTime: number) {
    party.forEach(partyMember => {
      //check for defeated
      var isDefeated = this.isCharacterDefeated(partyMember);
      if (!isDefeated) {
        //check for status effects
        this.updateBattleStats(partyMember);
        //this.handleStatusEffectDurations(partyMember, deltaTime);
        this.checkAutoAttackTimer(partyMember, enemies, party, deltaTime);
        this.handleAbilities(partyMember, enemies, party, deltaTime, false);
      }
    });
  }

  handleEnemyActions(enemies: Character[], party: Character[], deltaTime: number) {
    enemies.forEach(enemy => {
      var isDefeated = this.isCharacterDefeated(enemy);
      if (!isDefeated) {
        this.handleStatusEffectDurations(enemy, deltaTime);
        this.handleAutoAttackTimer(enemy, deltaTime);
        this.checkAutoAttackTimer(enemy, party, enemies, deltaTime);
        this.handleAbilities(enemy, party, enemies, deltaTime, true);
      }
    });
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
      var archer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
      if (archer !== undefined)
        archer.isAvailable = true;

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
    /*if (subzone.type === SubZoneEnum.DodonaCountryside && subzone.victoryCount >= 1) {
      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      if (hermes !== undefined && !hermes.isAvailable) {
        hermes.isAvailable = true;

        hermes.abilityList.forEach(ability => {
          if (hermes!.level >= ability.requiredLevel)
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
    }*/
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
      var showBattleItemTutorial = false;

      //auto gain throwing stones in aigosthena upper coast
      if (subzone.type === SubZoneEnum.AigosthenaUpperCoast && subzone.victoryCount >= 2 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded = true;
        showBattleItemTutorial = true;
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.TreasureChestRewards, "You find a treasure chest containing <strong>" + reward.amount + " " + (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : pluralize(this.lookupService.getItemName(reward.item))) + "</strong>.");
        });

        if (showBattleItemTutorial)
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.BattleItems));
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
      var previousDuration = effect.duration;
      effect.duration -= deltaTime;

      //a second has passed
      if (Math.ceil(previousDuration) > Math.ceil(effect.duration)) {
        if (effect.type === StatusEffectEnum.Paralyze) {
          var stunChance = .1;
          var rng = this.utilityService.getRandomNumber(0, 1);
          if (rng < stunChance) {
            this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 2, 0, false, false), character);
          }
        }
      }

      if (effect.type === StatusEffectEnum.DamageOverTime) {
        //check tick time
        effect.tickTimer += deltaTime;
        
        if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {          
          //deal damage
          var damageDealt = this.dealTrueDamage(character, effect.effectiveness);
          var gameLogEntry = "<strong>" + character.name + "</strong>" + " takes " + Math.round(damageDealt) + " damage from " + effect.associatedAbilityName + "'s effect.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);

          effect.tickTimer -= effect.tickFrequency;
        }
      }
    });

    character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(effect => effect.isPermanent || effect.duration > 0);
  }

  //add equipment and permanent stats to base stats
  updateBattleStats(character: Character) {
    this.globalService.calculateCharacterBattleStats(character);
  }

  handleAutoAttackTimer(character: Character, deltaTime: number) {
    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun))
      character.battleInfo.autoAttackTimer += deltaTime;
  }

  checkAutoAttackTimer(character: Character, targets: Character[], party: Character[], deltaTime: number) {
    var timeToAutoAttack = this.lookupService.getAutoAttackTime(character);

    //hopefully unnecessary fail safe
    var autoAttacksAtOnce = 0;
    var totalAutoAttacksAtOnce = 1;

    if (this.globalService.globalVar.isCatchingUp)
      totalAutoAttacksAtOnce = 50;

    while (character.battleInfo.autoAttackTimer >= timeToAutoAttack && autoAttacksAtOnce < totalAutoAttacksAtOnce &&
      (character.battleInfo.autoAttackAutoMode || character.battleInfo.autoAttackManuallyTriggered)) {
      var autoAttackOccurred = this.handleAutoAttack(character, targets, party);

      if (autoAttackOccurred)
        character.battleInfo.autoAttackTimer -= timeToAutoAttack;

      if (character.battleInfo.autoAttackManuallyTriggered)
        character.battleInfo.autoAttackTimer = 0;
      autoAttacksAtOnce += 1;

      //this prevents auto attack timer from building up while in scene or town
      if (autoAttacksAtOnce === totalAutoAttacksAtOnce)
        character.battleInfo.autoAttackTimer = 0;
    }

    character.battleInfo.autoAttackManuallyTriggered = false;
  }

  handleAutoAttack(character: Character, targets: Character[], party: Character[], additionalDamageMultiplier?: number) {
    //TODO: handle targetting system -- default to random but have options to target highest or lowest hp and other conditions
    var target = this.getTarget(character, targets);

    if (target === undefined)
      return false;

    if (this.doesAutoAttackMiss(character, target)) {
      return false;
    }

    var damageMultiplier = this.getDamageMultiplier(character, target, additionalDamageMultiplier);
    var isCritical = this.isDamageCritical(character, target);
    var overdriveMultiplier = 1;
    var usingOverdrive = false;

    if (character.overdriveInfo.overdriveGaugeAmount === character.overdriveInfo.overdriveGaugeTotal &&
      (character.overdriveInfo.overdriveAutoMode || character.overdriveInfo.manuallyTriggered)) {
      overdriveMultiplier = this.lookupService.getOverdriveMultiplier(character);
      usingOverdrive = true;
      character.overdriveInfo.overdriveGaugeAmount = 0;
    }
    character.overdriveInfo.manuallyTriggered = false;

    var damageDealt = this.dealDamage(character, target, isCritical, overdriveMultiplier, damageMultiplier);

    var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " attacks <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + damageDealt + " damage." + (usingOverdrive ? " <strong>OVERDRIVE!</strong>" : "") + (isCritical ? " <strong>Critical hit!</strong>" : "");
    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
    this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, target, party, targets);
    this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAutoAttack, character, target, party, targets);

    var thorns = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
    if (thorns !== undefined) {
      this.dealTrueDamage(character, thorns.effectiveness);
      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thorns.effectiveness + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Thorns effect.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
    }

    var barrage = this.lookupService.characterHasAbility("Barrage", character);
    if (barrage !== undefined) {
      barrage.count += 1;

      if (barrage.count >= barrage.maxCount) {
        var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
        var additionalTargets = potentialTargets.filter(item => item !== target);
        if (additionalTargets.length > 0) {
          additionalTargets.forEach(additionalTarget => {
            var additionalDamageDealt = this.dealDamage(character, additionalTarget, false, undefined, barrage!.effectiveness);
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack hits <strong>" + additionalTarget.name + "</strong> for " + additionalDamageDealt + " damage as well.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, additionalTarget, party, targets);

            var thorns = additionalTarget.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
            if (thorns !== undefined) {
              this.dealTrueDamage(character, thorns.effectiveness);
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thorns.effectiveness + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(additionalTarget.type) + "'>" + additionalTarget.name + "</strong>'s Thorns effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            }
          });
        }
        barrage.count = 0;
      }
    }

    var quicken = this.lookupService.characterHasAbility("Quicken", character);
    if (quicken !== undefined) {
      if (character.abilityList !== undefined && character.abilityList.length > 0)
        character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
          ability.currentCooldown -= quicken!.effectiveness;
        });

      if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown -= quicken!.effectiveness;
            });
        }
      }

      if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown -= quicken!.effectiveness;
            });
        }
      }
    }

    var instantHeal = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack);
    if (instantHeal !== undefined) {
      var healAmount = damageDealt * instantHeal.effectiveness;

      if (character !== undefined) {
        this.gainHp(character, healAmount);
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.InstantHealAfterAutoAttack);

        if (Math.round(healAmount) > 0) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong> gains " + Math.round(healAmount) + " HP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
      }
    }

    if (character.level >= this.utilityService.characterOverdriveLevel) {
      character.overdriveInfo.overdriveGaugeAmount += character.overdriveInfo.gainPerAutoAttack;
      if (character.overdriveInfo.overdriveGaugeAmount > character.overdriveInfo.overdriveGaugeTotal)
        character.overdriveInfo.overdriveGaugeAmount = character.overdriveInfo.overdriveGaugeTotal;
    }
    return true;
  }

  doesAutoAttackMiss(character: Character, target: Character) {
    var blind = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Blind);
    if (blind !== undefined) {
      var attackSuccessRate = .5;
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= attackSuccessRate) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack misses!";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        return true;
      }
    }

    return false;
  }

  handleAbilities(character: Character, targets: Character[], partyMembers: Character[], deltaTime: number, handleCooldown: boolean) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        if (handleCooldown)
          this.handleAbilityCooldown(character, ability, deltaTime);
        this.checkAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (handleCooldown)
              this.handleAbilityCooldown(character, ability, deltaTime);
            this.checkAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (handleCooldown)
              this.handleAbilityCooldown(character, ability, deltaTime);
            this.checkAbilityCooldown(character, ability, deltaTime, partyMembers, targets);
          });
      }
    }
  }

  handleAbilityCooldown(character: Character, ability: Ability, deltaTime: number) {
    if (!ability.isActivatable)
      return;

    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun))
      ability.currentCooldown -= deltaTime;
  }

  checkAbilityCooldown(character: Character, ability: Ability, deltaTime: number, partyMembers: Character[], targets: Character[]) {
    if (ability.currentCooldown <= 0) {
      ability.currentCooldown = 0;

      if (targets !== undefined && targets.length > 0 && (ability.autoMode || ability.manuallyTriggered) &&
        this.avoidAbilityRedundancy(ability, partyMembers)) {
        var abilityUsed = this.useAbility(ability, character, targets, partyMembers, true);

        if (abilityUsed)
          ability.currentCooldown = ability.cooldown;
      }

      ability.manuallyTriggered = false;
    }
  }

  avoidAbilityRedundancy(ability: Ability, partyMembers: Character[]) {
    if (!ability.isActivatable)
      return false;
    return true;
  }

  useAbility(ability: Ability, user: Character, targets: Character[], party: Character[], isGodAbility: boolean) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    var target = this.getTarget(user, ability.targetsAllies ? party : targets, ability.targetType !== undefined ? ability.targetType : TargetEnum.Random);
    var damageDealt = 0;

    if (target === undefined)
      return false;

    var abilityEffectiveness = this.getAbilityEffectiveness(user, target, ability, party, isGodAbility);

    if (ability.dealsDirectDamage) {
      var damageMultiplier = this.getDamageMultiplier(user, target);
      var isCritical = this.isDamageCritical(user, target);

      if (ability.isAoe) {
        potentialTargets.forEach(potentialTarget => {
          damageDealt = this.dealDamage(user, potentialTarget, isCritical, abilityEffectiveness, damageMultiplier, ability);
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on <strong class='" + this.globalService.getCharacterColorClassText(potentialTarget.type) + "'>" + potentialTarget.name + "</strong> for " + damageDealt + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        })
      }
      else {
        damageDealt = this.dealDamage(user, target, isCritical, abilityEffectiveness, damageMultiplier, ability);
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + damageDealt + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
      }
    }
    else if (ability.heals) {
      var healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user);
      var adjustedCriticalMultiplier = 1;
      var isCritical = this.isHealCritical(user);
      if (isCritical)
        adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user);
      healAmount *= adjustedCriticalMultiplier;

      var healedAmount = this.gainHp(target, healAmount);
      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on " + target.name + ", restoring " + Math.round(healedAmount) + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);

      //check Apollo conditions
      if (ability.name === "Ostinato") {
        var staccato = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        var fortissimo = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        var coda = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (staccato !== undefined) {
          party.forEach(member => {
            var instantAttack = this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, 1, true, true);
            this.applyStatusEffect(instantAttack, member, party);
          });
        }

        if (fortissimo !== undefined) {
          var fortissimoAbility = this.lookupService.characterHasAbility("Fortissimo", user);
          party.forEach(member => {
            if (member.abilityList !== undefined && member.abilityList.length > 0)
              member.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown /= fortissimoAbility!.secondaryEffectiveness;
              });

            if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
              var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod1);
              if (god !== undefined) {
                if (god.abilityList !== undefined && god.abilityList.length > 0)
                  god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                    ability.currentCooldown /= fortissimoAbility!.secondaryEffectiveness;
                  });
              }
            }

            if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
              var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod2);
              if (god !== undefined) {
                if (god.abilityList !== undefined && god.abilityList.length > 0)
                  god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                    ability.currentCooldown /= fortissimoAbility!.secondaryEffectiveness;
                  });
              }
            }
          });
        }

        if (coda !== undefined) {
          var negativeStatusEffects: StatusEffect[] = [];
          party.forEach(member => {
            member.battleInfo.statusEffects.filter(item => !item.isPositive).forEach(effect => {
              negativeStatusEffects.push(effect);
            });
          });

          if (negativeStatusEffects.length > 0) {
            var rng = this.utilityService.getRandomInteger(0, negativeStatusEffects.length - 1);
            negativeStatusEffects[rng].duration = 0;
          }
        }
      }
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

      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + ", shielding allies for " + barrierAmount + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
    }
    else {
      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + ".";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
    }

    this.handleUserGainsStatusEffects(ability.userGainsStatusEffect, user, party, targets, damageDealt);
    this.handleTargetGainsStatusEffects(ability.targetGainsStatusEffect, user, target, potentialTargets, party, damageDealt);

    var secondWind = this.lookupService.characterHasAbility("Second Wind", user);

    if (secondWind !== undefined && !
      user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack)) {
      var statusEffect = secondWind.userGainsStatusEffect[0].makeCopy();
      this.applyStatusEffect(statusEffect, user, party);
    }

    if (user.level >= this.utilityService.characterOverdriveLevel) {
      user.overdriveInfo.overdriveGaugeAmount += user.overdriveInfo.gainPerAbility;
      if (user.overdriveInfo.overdriveGaugeAmount > user.overdriveInfo.overdriveGaugeTotal)
        user.overdriveInfo.overdriveGaugeAmount = user.overdriveInfo.overdriveGaugeTotal;
    }
    return true;
  }

  handleUserGainsStatusEffects(userGainsStatusEffect: StatusEffect[], user: Character, party: Character[], targets: Character[], damageDealt: number = 0) {
    if (userGainsStatusEffect.length > 0) {
      userGainsStatusEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = gainedStatusEffect.makeCopy();

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.damageOverTimeType === DamageOverTimeTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = user.battleStats.attack * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.damageOverTimeType === DamageOverTimeTypeEnum.BasedOnDamage)
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
        }

        this.applyStatusEffect(appliedStatusEffect, user, party);
      });
    }

    party.forEach(member => {
      if (member.battleInfo.statusEffects.some(item => item.isInstant)) {
        member.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
          if (instantEffect.type === StatusEffectEnum.InstantHeal) {
            var healAmount = damageDealt * instantEffect.effectiveness;

            if (member !== undefined)
              this.gainHp(member, healAmount);
          }

          if (instantEffect.type === StatusEffectEnum.DebuffDurationIncrease) {
            if (member !== undefined && member.battleInfo.statusEffects.length > 0) {
              member.battleInfo.statusEffects.filter(item => item.duration > 0).forEach(effect => {
                effect.duration *= instantEffect.effectiveness;
              });
            }
          }

          if (instantEffect.type === StatusEffectEnum.InstantAutoAttack) {
            this.handleAutoAttack(member, targets, party, instantEffect.effectiveness);
          }
        });
      }

      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => !item.isInstant);
    });
  }

  handleTargetGainsStatusEffects(targetGainsStatusEffect: StatusEffect[], user: Character, target: Character, potentialTargets: Character[], party: Character[], damageDealt: number = 0) {
    if (targetGainsStatusEffect.length > 0) {
      targetGainsStatusEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = gainedStatusEffect.makeCopy();

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.damageOverTimeType === DamageOverTimeTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = user.battleStats.attack * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.damageOverTimeType === DamageOverTimeTypeEnum.BasedOnDamage)
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
        }

        if (target !== undefined) {
          this.applyStatusEffect(appliedStatusEffect, target, potentialTargets);
        }

        var mark = user.abilityList.find(item => item.name === "Mark" && item.isAvailable);
        if (mark !== undefined) {
          var markEffect = mark.targetGainsStatusEffect[0].makeCopy();
          markEffect.duration = gainedStatusEffect.duration;
          markEffect.isAoe = gainedStatusEffect.isAoe;

          if (target !== undefined)
            this.applyStatusEffect(markEffect, target, potentialTargets);
        }
      });
    }

    //check all instant effects (maybe make its own function?)
    if (target.battleInfo.statusEffects.some(item => item.isInstant)) {
      target.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
        if (instantEffect.type === StatusEffectEnum.InstantHeal) {
          var healAmount = damageDealt * instantEffect.effectiveness;

          if (target !== undefined)
            this.gainHp(target, healAmount);
        }

        if (instantEffect.type === StatusEffectEnum.DebuffDurationIncrease) {
          if (target !== undefined && target.battleInfo.statusEffects.length > 0) {
            target.battleInfo.statusEffects.filter(item => item.duration > 0).forEach(effect => {
              effect.duration *= instantEffect.effectiveness;
            });
          }
        }

        if (instantEffect.type === StatusEffectEnum.InstantAutoAttack) {
          if (target !== undefined)
            this.handleAutoAttack(target, party, potentialTargets, instantEffect.effectiveness);
        }
      });

      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => !item.isInstant);
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

  getDamageMultiplier(character: Character, target: Character, additionalDamageMultiplier?: number) {
    var overallDamageMultiplier = 1;

    if (additionalDamageMultiplier !== undefined)
      overallDamageMultiplier *= additionalDamageMultiplier;

    //check for basic damage up/down buffs
    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageDealtDown ||
        effect.type === StatusEffectEnum.DamageDealtUp);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          overallDamageMultiplier *= effect.effectiveness;
        });
      }
    }

    if (target.battleInfo !== undefined && target.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = target.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageTakenDown ||
        effect.type === StatusEffectEnum.DamageTakenUp);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          overallDamageMultiplier *= effect.effectiveness;
        });
      }
    }

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

  applyStatusEffect(appliedStatusEffect: StatusEffect, target: Character, potentialTargets?: Character[]) {
    if (appliedStatusEffect.isAoe && potentialTargets !== undefined) {
      potentialTargets.forEach(enemy => {
        var existingApplication = enemy.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (appliedStatusEffect.refreshes && existingApplication !== undefined) {
          if (appliedStatusEffect.duration > existingApplication.duration)
            existingApplication.duration = appliedStatusEffect.duration;
        }
        else
          enemy.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
      });
    }
    else {
      var existingApplication = target.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
      if (appliedStatusEffect.refreshes && existingApplication !== undefined) {
        if (appliedStatusEffect.duration > existingApplication.duration)
          existingApplication.duration = appliedStatusEffect.duration;
      }
      else
        target.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
    }
  }

  getTarget(user: Character, targets: Character[], targetType: TargetEnum = TargetEnum.Random) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    if (potentialTargets.length === 0)
      return undefined;

    var target = potentialTargets[0];

    if (targetType === TargetEnum.Random)
      target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
    else if (targetType === TargetEnum.LowestHpPercent) {
      potentialTargets = potentialTargets.sort(function (a, b) {
        return a.battleStats.getHpPercent() > b.battleStats.getHpPercent() ? 1 :
          a.battleStats.getHpPercent() < b.battleStats.getHpPercent() ? -1 : 0;
      });
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

        character.battleInfo.autoAttackTimer = 0;

        if (character.abilityList !== undefined && character.abilityList.length > 0)
          character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            ability.currentCooldown = ability.cooldown;
          });

        if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown = ability.cooldown;
              });
          }
        }

        if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown = ability.cooldown;
              });
          }
        }
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
      this.handlePartyDefeat(party);
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

  handlePartyDefeat(party: Character[]) {
    this.globalService.globalVar.settings.set("autoProgress", false);

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.forEach(subzone => {
              subzone.isSelected = false;
            });
        });
    });

    var recentlyDefeatedDebuff = this.globalService.createStatusEffect(StatusEffectEnum.RecentlyDefeated, 60, .75, false, false, true);
    this.globalService.getActivePartyCharacters(true).forEach(member => {
      member.battleStats.currentHp = member.battleStats.maxHp * .25;

      member.abilityList.forEach(ability => {
        ability.currentCooldown = ability.cooldown;
      })

      if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown = ability.cooldown;
            });
        }
      }

      if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown = ability.cooldown;
            });
        }
      }
    });

    //redirect you away from the fight
    var underworld = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld);
    if (underworld !== undefined && underworld.isAvailable) {
      //send you to the underworld
      var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelHallOfTheDead);
      if (startingPoint !== undefined) {
        startingPoint.isSelected = true;
        startingPoint.showNewNotification = false;
        this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
      }

      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. Maybe Hermes can help you out of here?");
    }
    else if (this.balladService.getActiveSubZone().type === SubZoneEnum.NemeaCountryRoadsOne) {
      //trigger first time underworld flow
      this.globalService.globalVar.ballads.forEach(item => {
        item.isAvailable = false;
        item.isSelected = false;

        item.zones.forEach(zone => {
          zone.isSelected = false;
          zone.subzones.forEach(subzone => {
            subzone.isSelected = false;
          })
        })
      });

      var underworld = this.balladService.findBallad(BalladEnum.Underworld);
      if (underworld !== undefined) {
        underworld.isAvailable = true;
        underworld.isSelected = true;
      }

      var unlockedZone = this.balladService.findZone(ZoneEnum.Asphodel);
      if (unlockedZone !== undefined) {
        unlockedZone.isAvailable = true;
        unlockedZone.isSelected = true;
      }

      var unlockedSubZone = this.balladService.findSubzone(SubZoneEnum.AsphodelHallOfTheDead);
      if (unlockedSubZone !== undefined) {
        unlockedSubZone.isAvailable = true;
        unlockedSubZone.isSelected = true;
        this.globalService.globalVar.playerNavigation.currentSubzone = unlockedSubZone;
      }

      //trigger underworld flow
      this.storyService.triggerFirstTimeUnderworldScene = true;
      setTimeout(() => {
        this.storyService.showFirstTimeUnderworldStory = true;
        this.storyService.checkForNewStoryScene();
      }, 3500);
    }
    else {
      //haven't unlocked underworld yet but passed tutorial
      var gorgon = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Gorgon);
      if (gorgon !== undefined && gorgon.isAvailable) {

        var startingPoint = this.balladService.findSubzone(SubZoneEnum.DodonaDelphi);
        if (startingPoint !== undefined) {
          startingPoint.isSelected = true;
          startingPoint.showNewNotification = false;
          this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
        }

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. You quickly make your way back to the safety of town.");
      }
      else {
        //you're still in the tutorial part of the game                        
        var startingPoint = this.balladService.findSubzone(SubZoneEnum.AigosthenaUpperCoast);
        if (startingPoint !== undefined) {
          startingPoint.isSelected = true;
          startingPoint.showNewNotification = false;
          this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
        }

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "You have been defeated. You quickly retreat and regroup.");
      }
    }

    this.applyStatusEffect(recentlyDefeatedDebuff, party[0], party);
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
    this.getCoinRewards(this.battle.currentEnemies);
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

  getCoinRewards(defeatedEnemies: EnemyTeam) {
    var coin = 0;

    if (defeatedEnemies.enemyList.length === 0)
      return;

    defeatedEnemies.enemyList.forEach(enemy => {
      coin += enemy.coinGainFromDefeat;
    });

    if (coin > 0) {
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, coin));
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain <strong>" + coin + " " + (coin === 1 ? this.lookupService.getItemName(ItemsEnum.Coin) : pluralize(this.lookupService.getItemName(ItemsEnum.Coin))) + "</strong>.");
    }
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

          if (unlockedSubZone.type === SubZoneEnum.AigosthenaBay) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.NewSubzone));
          }
        }
      });
    }
  }

  togglePause() {
    this.utilityService.isGamePaused = !this.utilityService.isGamePaused;
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

    var effect = this.lookupService.getBattleItemEffect(this.battleItemInUse);

    if (this.battleItemInUse === ItemsEnum.HealingHerb) {
      if (character.battleStats.currentHp === character.battleStats.maxHp)
        return;

      var healedAmount = this.gainHp(character, effect.healAmount)
      this.lookupService.useResource(this.battleItemInUse, 1);

      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses a Healing Herb, gaining " + healedAmount + " HP.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
    }

    if (this.battleItemInUse === ItemsEnum.ThrowingStone) {
      if (character.battleStats.currentHp <= 0)
        return;

      var damage = this.dealTrueDamage(character, effect.trueDamageAmount)
      this.lookupService.useResource(this.battleItemInUse, 1);

      var gameLogEntry = "<strong>" + character.name + "</strong>" + " is hit by a Throwing Stone, dealing " + damage + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
    }
    if (this.battleItemInUse === ItemsEnum.PoisonFang) {
      if (character.battleStats.currentHp <= 0)
        return;

      this.applyStatusEffect(effect.targetGainsStatusEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      var gameLogEntry = "<strong>" + character.name + "</strong>" + " is poisoned by the Poison Fang.";
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

  checkForEquipmentEffect(trigger: EffectTriggerEnum, user: Character, target: Character, party: Character[], targets: Character[]) {
    var userGainsEffects: StatusEffect[] = [];
    var targetGainsEffects: StatusEffect[] = [];
    var rng = 0;

    //go through each equipment piece
    if (user.equipmentSet.weapon !== undefined && user.equipmentSet.weapon.equipmentEffect.trigger === trigger) {
      user.equipmentSet.weapon.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.weapon.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          targetGainsEffects.push(effect.makeCopy());
      });
    }

    if (user.equipmentSet.shield !== undefined && user.equipmentSet.shield.equipmentEffect.trigger === trigger) {
      user.equipmentSet.shield.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.shield.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          targetGainsEffects.push(effect.makeCopy());
      });
    }

    if (user.equipmentSet.armor !== undefined && user.equipmentSet.armor.equipmentEffect.trigger === trigger) {
      user.equipmentSet.armor?.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.armor?.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          targetGainsEffects.push(effect.makeCopy());
      });
    }

    if (user.equipmentSet.ring !== undefined && user.equipmentSet.ring.equipmentEffect.trigger === trigger) {
      user.equipmentSet.ring?.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.ring?.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          targetGainsEffects.push(effect.makeCopy());
      });
    }

    if (user.equipmentSet.necklace !== undefined && user.equipmentSet.necklace.equipmentEffect.trigger === trigger) {
      user.equipmentSet.necklace?.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.necklace?.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          targetGainsEffects.push(effect.makeCopy());
      });
    }

    if (userGainsEffects.length > 0) {
      //if it's already active, don't reapply
      if (trigger === EffectTriggerEnum.AlwaysActive) {
        userGainsEffects.forEach(effect => {
          if (user.battleInfo.statusEffects.some(existingEffect => existingEffect.caster === effect.caster))
            effect.type = StatusEffectEnum.None;
        })

        userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.None);
      }

      this.handleUserGainsStatusEffects(userGainsEffects, user, party, targets);
    }

    if (targetGainsEffects.length > 0)
      this.handleTargetGainsStatusEffects(targetGainsEffects, user, target, targets, party);
  }
}
