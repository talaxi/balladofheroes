import { Injectable } from '@angular/core';
import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import * as pluralize from 'pluralize';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { StoryStyleSettingEnum } from 'src/app/models/enums/story-style-setting-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { AltarService } from '../altar/altar.service';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { MenuService } from '../menu/menu.service';
import { StoryService } from '../story/story.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';
import { ColiseumService } from './coliseum.service';
import { DpsCalculatorService } from './dps-calculator.service';
import { GameLogService } from './game-log.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battle: Battle;
  battleItemInUse: ItemsEnum;
  targetbattleItemMode: boolean = false;
  characterInTargetMode: CharacterEnum;
  targetCharacterMode: boolean = false;
  showNewEnemyGroup = false;
  currentSubzoneType: SubZoneEnum;
  pityCoinTimer = 0;

  constructor(private globalService: GlobalService, private subzoneGeneratorService: SubZoneGeneratorService,
    private balladService: BalladService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService, private storyService: StoryService, private achievementService: AchievementService,
    private menuService: MenuService, public dialog: MatDialog, private tutorialService: TutorialService,
    private dpsCalculatorService: DpsCalculatorService, private coliseumService: ColiseumService, private altarService: AltarService) { }

  handleBattle(deltaTime: number, loadingContent: any) {
    var lastPerformanceNow = performance.now();
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
        if (this.storyService.showOptionalStory)
          continueShowing = this.storyService.handleOptionalScene(deltaTime);
        else
          continueShowing = this.storyService.handleScene(deltaTime);
      }
      else if (this.battle.sceneType === SceneTypeEnum.Chest) {
        continueShowing = this.handleChest(deltaTime);
      }
      else if (this.battle.sceneType === SceneTypeEnum.SideQuest) {
        continueShowing = true;
      }

      if (!continueShowing) {
        this.battle.atScene = false;
        this.battle.sceneType = SceneTypeEnum.None;
      }
    }
    else {
      if (subZone.isTown && this.battle.activeTournament.type === ColiseumTournamentEnum.None) //no need to check any battle info
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

      if (deltaTime > 0) {
        this.battle.battleDuration += deltaTime;
        this.updateBattleState(party, enemies);

        if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
          this.battle.activeTournament.tournamentTimer += deltaTime;

          if (this.battle.activeTournament.tournamentTimer >= this.battle.activeTournament.tournamentTimerLength) {
            this.battle.activeTournament = new ColiseumTournament();
            this.coliseumService.handleColiseumLoss();
          }
        }
      }
    }

    if (this.globalService.globalVar.performanceMode) {
      var performanceNow = performance.now();
      var diff = performanceNow - lastPerformanceNow;
      console.log('Battle Loop: ' + diff + " ms");

      lastPerformanceNow = performanceNow;
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
        this.checkAutoAttackTimer(true, partyMember, enemies, party, deltaTime);
        this.handleAbilities(true, partyMember, enemies, party, deltaTime, false);
        this.checkOverdriveStatus(partyMember, deltaTime);
      }
    });
  }

  handleEnemyActions(enemies: Character[], party: Character[], deltaTime: number) {
    enemies.forEach(enemy => {
      var isDefeated = this.isCharacterDefeated(enemy);
      if (!isDefeated) {
        this.handleStatusEffectDurations(false, enemy, deltaTime);
        this.handleAutoAttackTimer(enemy, deltaTime);
        this.checkAutoAttackTimer(false, enemy, party, enemies, deltaTime);
        this.handleAbilities(false, enemy, party, enemies, deltaTime, true);
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

    if (subzone.type === SubZoneEnum.DodonaDelphiOutskirts && subzone.victoryCount === 2) {
      this.globalService.globalVar.altars.isUnlocked = true;
      this.globalService.globalVar.altars.altar1 = this.altarService.getTutorialAltar();
      this.globalService.globalVar.altars.showNewNotification = true;
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Altars));
    }

    if (subzone.type === SubZoneEnum.DodonaCountryside && subzone.victoryCount >= 1) {
      var archer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
      if (archer !== undefined && !archer.isAvailable) {
        archer.isAvailable = true;
        this.globalService.globalVar.isDpsUnlocked = true;

        this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
        this.menuService.setNewPartyMember2(this.globalService.globalVar.activePartyMember2);

        var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
        if (artemis !== undefined && !artemis.isAvailable) {
          artemis.isAvailable = true;
          this.globalService.globalVar.altars.altar2 = this.altarService.getNewSmallAltar(GodEnum.Artemis);

          artemis.abilityList.forEach(ability => {
            if (artemis!.level >= ability.requiredLevel)
              ability.isAvailable = true;
          });

          var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);
          if (character2 !== undefined) {
            character2.assignedGod1 = GodEnum.Artemis;
          }
        }
      }
    }

    if (this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.TournamentOfTheDead)!.defeatCount > 0) {
      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      if (hermes !== undefined && !hermes.isAvailable) {
        hermes.isAvailable = true;
        this.globalService.globalVar.altars.altar3 = this.altarService.getNewSmallAltar(GodEnum.Hermes);

        hermes.abilityList.forEach(ability => {
          if (hermes!.level >= ability.requiredLevel)
            ability.isAvailable = true;
        });

        var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
        if (character1 !== undefined && character1.assignedGod1 === GodEnum.None) {
          character1.assignedGod1 = GodEnum.Hermes;
        }
        if (character1 !== undefined && character1.assignedGod2 === GodEnum.None) {
          character1.assignedGod2 = GodEnum.Hermes;
        }
      }
    }
  }

  checkScene() {
    var subzone = this.balladService.getActiveSubZone();
    this.storyService.checkForNewStoryScene();

    if (this.storyService.showStory || (this.storyService.showOptionalStory !== OptionalSceneEnum.None)) {
      this.globalService.globalVar.activeBattle.atScene = true;
      this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Story;
    }
    else {
      console.log("Not story but checking")
      //check for side quests
      if (subzone.type === SubZoneEnum.CalydonAltarOfAsclepius) {
        this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.SideQuest;
        this.globalService.globalVar.activeBattle.atScene = true;
      }
      else
      {
        //expecting this to be reset below if you are actually at a scene
        this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.None;
        this.globalService.globalVar.activeBattle.atScene = false;
      }

      //check for treasure chests
      var treasureChestChance = this.subzoneGeneratorService.generateTreasureChestChance(subzone.type);

      var rng = this.utilityService.getRandomNumber(0, 1);
      var showBattleItemTutorial = false;

      //auto gain throwing stones in aigosthena upper coast
      if (subzone.type === SubZoneEnum.AigosthenaUpperCoast && subzone.victoryCount >= 2 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaUpperCoastAwarded = true;
        showBattleItemTutorial = true;
        this.globalService.globalVar.areBattleItemsUnlocked = true;
      }

      //auto gain a sword in aigosthena bay
      if (subzone.type === SubZoneEnum.AigosthenaBay && subzone.victoryCount >= 3 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaBayAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaBayAwarded = true;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Equipment));
      }

      //auto gain healing herbs in aigosthena lower coast
      if (subzone.type === SubZoneEnum.AigosthenaLowerCoast && subzone.victoryCount >= 5 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaLowerCoastAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaLowerCoastAwarded = true;
      }

      //auto gain throwing stones in dodona mountain opening
      if (subzone.type === SubZoneEnum.DodonaMountainOpening && subzone.victoryCount >= 0 &&
        !this.globalService.globalVar.freeTreasureChests.dodonaMountainOpening) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.dodonaMountainOpening = true;
      }

      if (rng <= treasureChestChance) {
        //Get chest rewards
        this.globalService.globalVar.activeBattle.atScene = true;
        this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Chest;
        this.globalService.globalVar.activeBattle.chestRewards = this.subzoneGeneratorService.getTreasureChestRewards(subzone.type);
        this.globalService.globalVar.activeBattle.chestRewards.forEach(reward => {
          this.lookupService.gainResource(reward);
          this.lookupService.addLootToLog(reward.item, reward.amount);
          if (this.globalService.globalVar.gameLogSettings.get("foundTreasureChest")) {
            var itemName = (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : this.utilityService.handlePlural(this.lookupService.getItemName(reward.item)));
            if (reward.type === ItemTypeEnum.Equipment) {
              var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(reward.item));
              itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
            }

            this.gameLogService.updateGameLog(GameLogEntryEnum.TreasureChestRewards, "You find a treasure chest containing <strong>" + reward.amount + " " + itemName + "</strong>.");
          }
        });

        if (showBattleItemTutorial)
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.BattleItems));
      }
    }
  }

  initializeEnemyList() {
    var subZone = this.balladService.getActiveSubZone();

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      //tournament battles
      var enemyOptions = this.coliseumService.generateBattleOptions(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
    }
    else {
      //all standard battles
      var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subZone.type);
    }

    var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
    if (subZone.type === SubZoneEnum.AigosthenaUpperCoast && subZone.victoryCount < 2)
      this.battle.currentEnemies = enemyOptions[0];
    else
      this.battle.currentEnemies = randomEnemyTeam;
    this.battle.battleDuration = 0;
  }

  handleStatusEffectDurations(isPartyMember: boolean, character: Character, deltaTime: number) {
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
          var damageDealt = this.dealTrueDamage(!isPartyMember, character, effect.effectiveness, undefined, effect.element);
          var elementalText = "";
          if (effect.element !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(effect.element);

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes " + Math.round(damageDealt) + elementalText + " damage from " + effect.associatedAbilityName + "'s effect.";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }

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

  checkAutoAttackTimer(isPartyAttacking: boolean, character: Character, targets: Character[], party: Character[], deltaTime: number) {
    var timeToAutoAttack = this.globalService.getAutoAttackTime(character);

    //hopefully unnecessary fail safe
    var autoAttacksAtOnce = 0;
    var totalAutoAttacksAtOnce = 1;

    if (this.globalService.globalVar.isCatchingUp)
      totalAutoAttacksAtOnce = 50;

    while (character.battleInfo.autoAttackTimer >= timeToAutoAttack && autoAttacksAtOnce < totalAutoAttacksAtOnce &&
      (character.battleInfo.autoAttackAutoMode || character.battleInfo.autoAttackManuallyTriggered)) {
      var autoAttackOccurred = this.handleAutoAttack(isPartyAttacking, character, targets, party);

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

  handleAutoAttack(isPartyAttacking: boolean, character: Character, targets: Character[], party: Character[], additionalDamageMultiplier?: number) {
    var target = this.getTarget(character, targets);

    if (target === undefined)
      return false;

    if (this.doesAutoAttackMiss(character, target, isPartyAttacking)) {
      return false;
    }

    var totalAutoAttackCount = this.lookupService.getTotalAutoAttackCount(character, isPartyAttacking);
    var damageMultiplier = this.getDamageMultiplier(character, target, additionalDamageMultiplier) * totalAutoAttackCount;
    var isCritical = this.isDamageCritical(character, target);
    var overdriveMultiplier = 1;
    var elementalType = character.battleInfo.elementalType;

    if (character.overdriveInfo.overdriveIsActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Smash)
      overdriveMultiplier = 1.5;

    if (character.overdriveInfo.overdriveIsActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Nature)
      elementalType = character.overdriveInfo.lastUsedElement;

    if (elementalType === ElementalTypeEnum.None) {
      elementalType = this.checkUserForEnElement(character);
    }

    var elementalText = "";
    if (elementalType !== ElementalTypeEnum.None)
      elementalText = this.getElementalDamageText(elementalType);

    if (isPartyAttacking)
      this.altarService.incrementAltarCount(AltarConditionEnum.AutoAttackUse);

    var damageDealt = this.dealDamage(isPartyAttacking, character, target, isCritical, overdriveMultiplier, damageMultiplier, undefined, elementalType);

    var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " attacks <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + damageDealt + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
    if (isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.PartyAutoAttacks, gameLogEntry);
    }
    else if (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.EnemyAutoAttacks, gameLogEntry);
    }

    for (var i = 0; i < Math.floor(totalAutoAttackCount); i++) {
      this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, target, party, targets);
      this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAutoAttack, character, target, party, targets);
      this.applyToxin(character, target, party, targets);
    }

    var thorns = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
    if (thorns !== undefined) {
      this.dealTrueDamage(!isPartyAttacking, character, thorns.effectiveness);
      if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
        (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thorns.effectiveness + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Thorns effect.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
      }
    }

    var barrage = this.lookupService.characterHasAbility("Barrage", character);
    if (barrage !== undefined) {
      barrage.count += 1;

      if (barrage.count >= barrage.maxCount) {
        var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
        var additionalTargets = potentialTargets.filter(item => item !== target);
        if (additionalTargets.length > 0) {
          additionalTargets.forEach(additionalTarget => {
            var additionalDamageDealt = this.dealDamage(isPartyAttacking, character, additionalTarget, false, undefined, barrage!.effectiveness);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack hits <strong>" + additionalTarget.name + "</strong> for " + additionalDamageDealt + " damage as well.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            }
            this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, additionalTarget, party, targets);

            var thorns = additionalTarget.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
            if (thorns !== undefined) {
              this.dealTrueDamage(!isPartyAttacking, character, thorns.effectiveness);
              if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
                (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thorns.effectiveness + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(additionalTarget.type) + "'>" + additionalTarget.name + "</strong>'s Thorns effect.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
              }
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
          if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong> gains " + Math.round(healAmount) + " HP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
        }
      }
    }

    if (character.level >= this.utilityService.characterOverdriveLevel) {
      character.overdriveInfo.overdriveGaugeAmount += character.overdriveInfo.gainPerAutoAttack * this.lookupService.getOverdriveGainMultiplier(character);
      if (character.overdriveInfo.overdriveGaugeAmount > character.overdriveInfo.overdriveGaugeTotal)
        character.overdriveInfo.overdriveGaugeAmount = character.overdriveInfo.overdriveGaugeTotal;
    }
    return true;
  }

  doesAutoAttackMiss(character: Character, target: Character, isPartyAttacking: boolean) {
    var blind = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Blind);
    if (blind !== undefined) {
      var attackSuccessRate = .5;
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= attackSuccessRate) {
        if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) ||
          (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack misses!";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
        return true;
      }
    }

    var dodge = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Dodge);
    if (dodge !== undefined) {
      if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) ||
        (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack misses!";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
      }
      return true;
    }

    return false;
  }

  handleAbilities(isPartyUsing: boolean, character: Character, targets: Character[], partyMembers: Character[], deltaTime: number, handleCooldown: boolean) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        if (handleCooldown)
          this.handleAbilityCooldown(character, ability, deltaTime);
        this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (handleCooldown)
              this.handleAbilityCooldown(character, ability, deltaTime);
            this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets);
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
            this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets);
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

  checkAbilityCooldown(isPartyUsing: boolean, character: Character, ability: Ability, deltaTime: number, partyMembers: Character[], targets: Character[]) {
    if (ability.currentCooldown <= 0) {
      ability.currentCooldown = 0;

      if (targets !== undefined && targets.length > 0 && (ability.autoMode || ability.manuallyTriggered) &&
        this.avoidAbilityRedundancy(ability, partyMembers)) {
        var abilityUsed = this.useAbility(isPartyUsing, ability, character, targets, partyMembers, true);

        if (abilityUsed)
          ability.currentCooldown = this.lookupService.getAbilityCooldown(ability, character);
      }

      ability.manuallyTriggered = false;
    }
  }

  avoidAbilityRedundancy(ability: Ability, partyMembers: Character[]) {
    if (!ability.isActivatable)
      return false;
    return true;
  }

  //isPartyUsing = is the character using the ability a party member or enemy
  useAbility(isPartyUsing: boolean, ability: Ability, user: Character, targets: Character[], party: Character[], isGodAbility: boolean) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    var target = this.getTarget(user, ability.targetsAllies ? party : targets, ability.targetType !== undefined ? ability.targetType : TargetEnum.Random);
    var damageDealt = 0;
    var elementalText = "";

    if (target === undefined)
      return false;

    var abilityEffectiveness = this.getAbilityEffectiveness(user, target, ability, party, isGodAbility);

    if (ability.dealsDirectDamage) {
      var damageMultiplier = this.getDamageMultiplier(user, target);
      var isCritical = this.isDamageCritical(user, target);
      if (ability.elementalType !== ElementalTypeEnum.None)
        elementalText = this.getElementalDamageText(ability.elementalType);

      if (ability.isAoe) {
        potentialTargets.forEach(potentialTarget => {
          damageDealt = this.dealDamage(isPartyUsing, user, potentialTarget, isCritical, abilityEffectiveness, damageMultiplier, ability, ability.elementalType);
          if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
            (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on <strong class='" + this.globalService.getCharacterColorClassText(potentialTarget.type) + "'>" + potentialTarget.name + "</strong> for " + damageDealt + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
        })
      }
      else {
        damageDealt = this.dealDamage(isPartyUsing, user, target, isCritical, abilityEffectiveness, damageMultiplier, ability, ability.elementalType);
        if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
          (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + damageDealt + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
      }
    }
    else if (ability.heals) {
      var healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user, ability, isPartyUsing);
      var adjustedCriticalMultiplier = 1;
      var isCritical = this.isHealCritical(user);
      if (isCritical)
        adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user, isPartyUsing);
      healAmount *= adjustedCriticalMultiplier;

      var healedAmount = this.gainHp(target, healAmount);
      if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + " on " + target.name + ", restoring " + Math.round(healedAmount) + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
      }

      //check Apollo conditions
      if (ability.name === "Ostinato") {
        var staccato = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        var fortissimo = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        var coda = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (staccato !== undefined) {
          party.forEach(member => {
            var instantAttack = this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, 1, true, true);
            this.applyStatusEffect(instantAttack, member, party, user);
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
    else {
      if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + ability.name + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
      }
    }

    this.checkForEquipmentEffect(EffectTriggerEnum.OnAbilityUse, user, target, party, targets);
    this.handleuserEffects(isPartyUsing, ability.userEffect, user, party, potentialTargets, damageDealt);
    this.handletargetEffects(isPartyUsing, ability.targetEffect, user, target, potentialTargets, party, damageDealt);

    if (isPartyUsing)
      this.altarService.incrementAltarCount(AltarConditionEnum.AbilityUse);

    //code specific to Ixion
    if (user.name === "Ixion" && user.battleInfo.statusEffects.some(item => (item.type === StatusEffectEnum.AgilityUp || item.type === StatusEffectEnum.AttackUp) && item.stackCount > 3)) {
      var flamesOfTartarus = user.abilityList.find(item => item.name === "Flames of Tartarus");
      if (flamesOfTartarus !== undefined) {
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item =>
          !((item.type === StatusEffectEnum.AgilityUp || item.type === StatusEffectEnum.AttackUp) && item.stackCount > 3));

        this.useAbility(isPartyUsing, flamesOfTartarus, user, targets, party, isGodAbility);
      }
    }

    var secondWind = this.lookupService.characterHasAbility("Second Wind", user);

    if (secondWind !== undefined && !
      user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack)) {
      var statusEffect = secondWind.userEffect[0].makeCopy();
      this.applyStatusEffect(statusEffect, user, party, user);
    }

    if (user.level >= this.utilityService.characterOverdriveLevel) {
      user.overdriveInfo.overdriveGaugeAmount += user.overdriveInfo.gainPerAbility * this.lookupService.getOverdriveGainMultiplier(user);
      if (user.overdriveInfo.overdriveGaugeAmount > user.overdriveInfo.overdriveGaugeTotal)
        user.overdriveInfo.overdriveGaugeAmount = user.overdriveInfo.overdriveGaugeTotal;
    }
    return true;
  }

  handleuserEffects(isPartyUsing: boolean, userEffect: StatusEffect[], user: Character, party: Character[], targets: Character[], damageDealt: number = 0) {
    if (userEffect.length > 0) {
      userEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = gainedStatusEffect.makeCopy();

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = user.battleStats.attack * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnDamage)
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
        }

        this.applyStatusEffect(appliedStatusEffect, user, party, user);
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
            this.handleAutoAttack(isPartyUsing, member, targets, party, instantEffect.effectiveness);
          }

          if (instantEffect.type === StatusEffectEnum.Sap) {
            var sapDamage = instantEffect.effectiveness * member.battleStats.attack;
            var target = this.getTarget(user, targets, TargetEnum.Random);
            if (target !== undefined) {
              this.dealTrueDamage(isPartyUsing, target, sapDamage);
              this.gainHp(user, sapDamage);
            }
          }

          if (instantEffect.type === StatusEffectEnum.SelfKO) {
            user.battleStats.currentHp = 0;
            this.isCharacterDefeated(user);
          }

          if (instantEffect.type === StatusEffectEnum.Barrier) {
            var barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing));
            if (instantEffect.isAoe) {
              party.forEach(partyMember => {
                partyMember.battleInfo.barrierValue += barrierAmount;

                if (partyMember.battleInfo.barrierValue > partyMember.battleStats.maxHp * instantEffect.threshold) {
                  //TODO: maybe don't overwrite existing effect though if it was already higher
                  partyMember.battleInfo.barrierValue = Math.round(partyMember.battleStats.maxHp * instantEffect.threshold);
                }

                partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Barrier);
              });
            }
            else {
              user.battleInfo.barrierValue += barrierAmount;

              if (user.battleInfo.barrierValue > user.battleStats.maxHp * instantEffect.threshold) {
                //TODO: maybe don't overwrite existing effect though if it was already higher
                user.battleInfo.barrierValue = user.battleStats.maxHp * instantEffect.threshold;
              }
            }


            if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
              (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields allies for " + barrierAmount + " damage.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
            }
          }
        });
      }

      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => !item.isInstant);
    });
  }

  handletargetEffects(isPartyUsing: boolean, targetEffect: StatusEffect[], user: Character, target: Character, potentialTargets: Character[], party: Character[], damageDealt: number = 0) {
    if (targetEffect.length > 0) {
      targetEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = gainedStatusEffect.makeCopy();

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = user.battleStats.attack * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnDamage)
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
        }

        if (target !== undefined) {
          this.applyStatusEffect(appliedStatusEffect, target, potentialTargets, user);
        }

        var mark = user.abilityList.find(item => item.name === "Mark" && item.isAvailable);
        if (mark !== undefined) {
          var markEffect = mark.targetEffect[0].makeCopy();
          markEffect.duration = gainedStatusEffect.duration;
          markEffect.isAoe = gainedStatusEffect.isAoe;

          if (target !== undefined)
            this.applyStatusEffect(markEffect, target, potentialTargets, user);
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

        if (instantEffect.type === StatusEffectEnum.InstantTrueDamage) {
          if (target !== undefined) {
            var trueDamageDealt = this.dealTrueDamage(isPartyUsing, target, instantEffect.effectiveness, user, instantEffect.element);
            var elementalText = "";
            if (instantEffect.element !== ElementalTypeEnum.None)
              elementalText = this.getElementalDamageText(instantEffect.element);
            var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + Math.round(trueDamageDealt) + elementalText + " damage.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
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
            this.handleAutoAttack(isPartyUsing, target, party, potentialTargets, instantEffect.effectiveness);
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

  getDamageMultiplier(character: Character, target: Character, additionalDamageMultiplier?: number, isAutoAttack: boolean = false) {
    var overallDamageMultiplier = 1;

    if (additionalDamageMultiplier !== undefined)
      overallDamageMultiplier *= additionalDamageMultiplier;

    if (isAutoAttack) {
      if (this.lookupService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAutoAttackUp) !== undefined) {
        var relevantAltarEffect = this.lookupService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAutoAttackUp);
        overallDamageMultiplier *= relevantAltarEffect!.effectiveness;
      }
    }

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

  applyStatusEffect(appliedStatusEffect: StatusEffect, target: Character, potentialTargets?: Character[], castingCharacter?: Character) {
    if (appliedStatusEffect.isPositive &&
      this.lookupService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.lookupService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (!appliedStatusEffect.isPositive && castingCharacter !== undefined &&
      castingCharacter.battleStats.debuffDuration > 0) {
      appliedStatusEffect.duration *= 1 + castingCharacter.battleStats.debuffDuration;
    }

    if (appliedStatusEffect.isAoe && potentialTargets !== undefined) {
      potentialTargets.forEach(enemy => {
        var existingApplication = enemy.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (existingApplication !== undefined) {
          if (appliedStatusEffect.effectStacks) {
            existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
            existingApplication.stackCount += 1;
          }

          if (appliedStatusEffect.refreshes) {
            if (appliedStatusEffect.duration > existingApplication.duration)
              existingApplication.duration = appliedStatusEffect.duration;
          }
          else
            enemy.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
        }
        else
          enemy.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
      });
    }
    else {
      var existingApplication = target.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
      if (existingApplication !== undefined) {
        if (appliedStatusEffect.effectStacks) {
          existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
          existingApplication.stackCount += 1;
        }

        if (appliedStatusEffect.refreshes) {
          if (appliedStatusEffect.duration > existingApplication.duration)
            existingApplication.duration = appliedStatusEffect.duration;
        }
        else
          target.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
      }
      else {
        target.battleInfo.statusEffects.push(appliedStatusEffect.makeCopy());
      }
    }
  }

  getTarget(user: Character, targets: Character[], targetType: TargetEnum = TargetEnum.Random) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
    if (potentialTargets.length === 0)
      return undefined;

    var target = potentialTargets[0];

    if (user.targeting !== undefined && potentialTargets.some(item => item === user.targeting)) {
      target = user.targeting;
    }
    else {
      if (targetType === TargetEnum.Random)
        target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
      else if (targetType === TargetEnum.LowestHpPercent) {
        potentialTargets = potentialTargets.sort(function (a, b) {
          return a.battleStats.getHpPercent() > b.battleStats.getHpPercent() ? 1 :
            a.battleStats.getHpPercent() < b.battleStats.getHpPercent() ? -1 : 0;
        });
        var target = potentialTargets[0];
      }
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

  dealDamage(isPartyAttacking: boolean, attacker: Character, target: Character, isCritical: boolean, abilityDamageMultiplier?: number, damageMultiplier?: number, ability?: Ability, elementalType?: ElementalTypeEnum) {
    //damage formula, check for shields, check for ko
    if (abilityDamageMultiplier === undefined)
      abilityDamageMultiplier = 1;

    if (damageMultiplier === undefined)
      damageMultiplier = 1;

    if (elementalType === undefined)
      elementalType = ElementalTypeEnum.None;

    var adjustedAttack = this.lookupService.getAdjustedAttack(attacker, ability, isPartyAttacking);
    var adjustedDefense = this.lookupService.getAdjustedDefense(target, !isPartyAttacking) * this.lookupService.getArmorPenetrationMultiplier(attacker);
    var adjustedCriticalMultiplier = 1;
    if (isCritical)
      adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(attacker, isPartyAttacking);

    /*
    DFFOO style
    Skill Power x ((ATK x ATK boost x 2/3) - (DEF x DEF boost x 2/5)) x (BRV DMG Reduction) x 
    (BRV DMG Dealt Multiplier) x (BRV DMG Increase Multiplier) x (Critical Damage) x (RNG)

    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
      (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier);  
    */

    var elementalDamageIncrease = 1;
    var elementalDamageDecrease = 1;
    if (elementalType !== ElementalTypeEnum.None) {
      elementalDamageIncrease = this.getElementalDamageIncrease(elementalType, attacker);
      elementalDamageDecrease = this.getElementalDamageDecrease(elementalType, target);
      attacker.overdriveInfo.lastUsedElement = elementalType;
      attacker.trackedStats.elementalAttacksUsed.incrementStatByEnum(elementalType);
      if (attacker.trackedStats.elementalAttacksUsed.getCountOfNonZeroElements() >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    //2 * Attack^2 / (Attack + Defense)    
    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * adjustedCriticalMultiplier
      * elementalDamageIncrease * elementalDamageDecrease
      * Math.ceil(Math.pow(adjustedAttack, 2) / (adjustedAttack + adjustedDefense)));

    if (damage < 0)
      damage = 0;

    var totalDamageDealt = damage;

    target.trackedStats.damageTaken += totalDamageDealt;
    if (target.trackedStats.damageTaken >= this.utilityService.overdriveDamageNeededToUnlockProtection &&
      !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Protection))
      target.unlockedOverdrives.push(OverdriveNameEnum.Protection);
    if (target.overdriveInfo.overdriveIsActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection)
      target.overdriveInfo.damageTaken += totalDamageDealt;

    if (target.level >= this.utilityService.characterOverdriveLevel) {
      target.overdriveInfo.overdriveGaugeAmount += target.overdriveInfo.gainPerBeingAttacked * this.lookupService.getOverdriveGainMultiplier(target);
      if (target.overdriveInfo.overdriveGaugeAmount > target.overdriveInfo.overdriveGaugeTotal)
        target.overdriveInfo.overdriveGaugeAmount = target.overdriveInfo.overdriveGaugeTotal;
    }

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

    if (isPartyAttacking)
      this.dpsCalculatorService.addPartyDamageAction(totalDamageDealt);
    else
      this.dpsCalculatorService.addEnemyDamageAction(totalDamageDealt);

    this.isCharacterDefeated(target);

    return totalDamageDealt;
  }

  //DoTs
  dealTrueDamage(isPartyAttacking: boolean, target: Character, damage: number, attacker?: Character, elementalType: ElementalTypeEnum = ElementalTypeEnum.None) {
    if (damage < 0)
      damage = 0;

    var elementalDamageIncrease = 1;
    var elementalDamageDecrease = 1;
    if (elementalType !== ElementalTypeEnum.None) {
      elementalDamageDecrease = this.getElementalDamageDecrease(elementalType, target);
    }

    if (attacker !== undefined) {
      elementalDamageIncrease = this.getElementalDamageIncrease(elementalType, attacker);
      attacker.overdriveInfo.lastUsedElement = elementalType;
      attacker.trackedStats.elementalAttacksUsed.incrementStatByEnum(elementalType);
      if (attacker.trackedStats.elementalAttacksUsed.getCountOfNonZeroElements() >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    var totalDamageDealt = damage * elementalDamageIncrease * elementalDamageDecrease;

    target.trackedStats.damageTaken += totalDamageDealt;
    if (target.trackedStats.damageTaken >= this.utilityService.overdriveDamageNeededToUnlockProtection &&
      !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Protection))
      target.unlockedOverdrives.push(OverdriveNameEnum.Protection);
    if (target.overdriveInfo.overdriveIsActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection)
      target.overdriveInfo.damageTaken += totalDamageDealt;

    if (target.level >= this.utilityService.characterOverdriveLevel) {
      target.overdriveInfo.overdriveGaugeAmount += target.overdriveInfo.gainPerBeingAttacked * this.lookupService.getOverdriveGainMultiplier(target);
      if (target.overdriveInfo.overdriveGaugeAmount > target.overdriveInfo.overdriveGaugeTotal)
        target.overdriveInfo.overdriveGaugeAmount = target.overdriveInfo.overdriveGaugeTotal;
    }

    if (target.battleInfo.barrierValue > 0) {
      target.battleInfo.barrierValue -= totalDamageDealt;
      totalDamageDealt = 0;

      if (target.battleInfo.barrierValue < 0) {
        //deal remaining damage to hp
        totalDamageDealt = -target.battleInfo.barrierValue;
        target.battleInfo.barrierValue = 0;
      }
    }

    target.battleStats.currentHp -= totalDamageDealt;

    if (target.battleStats.currentHp < 0)
      target.battleStats.currentHp = 0;

    if (isPartyAttacking)
      this.dpsCalculatorService.addPartyDamageAction(totalDamageDealt);
    else
      this.dpsCalculatorService.addEnemyDamageAction(totalDamageDealt);

    return totalDamageDealt;
  }

  getElementalDamageIncrease(element: ElementalTypeEnum, attacker: Character) {
    var increase = 0;

    if (element === ElementalTypeEnum.Holy)
      increase = attacker.battleStats.elementalDamageIncrease.holy;
    if (element === ElementalTypeEnum.Fire)
      increase = attacker.battleStats.elementalDamageIncrease.fire;
    if (element === ElementalTypeEnum.Lightning)
      increase = attacker.battleStats.elementalDamageIncrease.lightning;
    if (element === ElementalTypeEnum.Air)
      increase = attacker.battleStats.elementalDamageIncrease.air;
    if (element === ElementalTypeEnum.Water)
      increase = attacker.battleStats.elementalDamageIncrease.water;
    if (element === ElementalTypeEnum.Earth)
      increase = attacker.battleStats.elementalDamageIncrease.earth;

    return 1 + increase;
  }

  getElementalDamageDecrease(element: ElementalTypeEnum, target: Character) {
    var decrease = 0;

    if (element === ElementalTypeEnum.Holy)
      decrease = target.battleStats.elementalDamageResistance.holy;
    if (element === ElementalTypeEnum.Fire)
      decrease = target.battleStats.elementalDamageResistance.fire;
    if (element === ElementalTypeEnum.Lightning)
      decrease = target.battleStats.elementalDamageResistance.lightning;
    if (element === ElementalTypeEnum.Air)
      decrease = target.battleStats.elementalDamageResistance.air;
    if (element === ElementalTypeEnum.Water)
      decrease = target.battleStats.elementalDamageResistance.water;
    if (element === ElementalTypeEnum.Earth)
      decrease = target.battleStats.elementalDamageResistance.earth;

    return 1 - decrease;
  }

  //check for upper limits and any weird logic
  gainHp(character: Character, healAmount: number) {
    var healModifier = 1;

    if (character.battleStats.healingReceived > 0)
      healModifier = 1 + character.battleStats.healingReceived;

    healAmount = healAmount * healModifier;

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

        if (this.globalService.getActivePartyCharacters(true).some(item => item.targeting === character)) {
          this.globalService.getActivePartyCharacters(true).forEach(item => {
            if (item.targeting === character)
              item.targeting = undefined;
          });
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
      this.battle.battleDuration = 0;
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
    this.battle.activeTournament = new ColiseumTournament();

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.forEach(subzone => {
              subzone.isSelected = false;
            });
        });
    });

    var recentlyDefeatedDebuff = this.globalService.createStatusEffect(StatusEffectEnum.RecentlyDefeated, 30, .75, false, false, true);
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
      var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
      if (startingPoint !== undefined) {
        this.balladService.setActiveSubZone(startingPoint.type);
        this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
      }

      if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. You hurry back to the safety of town.");
      }
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

      var unlockedSubZone = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
      if (unlockedSubZone !== undefined) {
        unlockedSubZone.isAvailable = true;
        unlockedSubZone.isSelected = true;
        this.globalService.globalVar.playerNavigation.currentSubzone = unlockedSubZone;
      }

      //trigger underworld flow
      var storyStyle = this.globalService.globalVar.settings.get("storyStyle");
      if (storyStyle !== StoryStyleSettingEnum.Skip) {
        this.storyService.triggerFirstTimeUnderworldScene = true;
        setTimeout(() => {
          this.storyService.showFirstTimeUnderworldStory = true;
          this.storyService.checkForNewStoryScene();
        }, 3500);
      }
    }
    else {
      //haven't unlocked underworld yet but passed tutorial
      var gorgon = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Gorgon);
      if (gorgon !== undefined && gorgon.isAvailable) {

        var startingPoint = this.balladService.findSubzone(SubZoneEnum.DodonaDelphi);
        if (startingPoint !== undefined) {
          this.balladService.setActiveSubZone(startingPoint.type);
          this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
        }

        if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. You hurry back to the safety of town.");
        }
      }
      else {
        //you're still in the tutorial part of the game                        
        var startingPoint = this.balladService.findSubzone(SubZoneEnum.AigosthenaUpperCoast);
        if (startingPoint !== undefined) {
          this.balladService.setActiveSubZone(startingPoint.type);
          this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
        }

        recentlyDefeatedDebuff.duration = 0;
        if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "You have been defeated. You quickly retreat and regroup.");
        }
      }
    }

    this.applyStatusEffect(recentlyDefeatedDebuff, party[0], party);
  }

  moveToNextBattle() {
    this.showNewEnemyGroup = true;
    if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "The enemy party has been defeated.");
    }
    var subZone = this.balladService.getActiveSubZone();
    subZone.victoryCount += 1;
    this.altarService.incrementAltarCount(AltarConditionEnum.Victories);

    //console.log("Completed in: " + this.battle.battleDuration);
    if (subZone.fastestCompletionSpeed === undefined || this.battle.battleDuration < subZone.fastestCompletionSpeed) {
      subZone.fastestCompletionSpeed = this.battle.battleDuration;
    }

    var achievements = this.achievementService.checkForSubzoneAchievement(subZone.type, this.globalService.globalVar.achievements);

    if (achievements !== undefined && achievements.length > 0) {
      this.addAchievementToGameLog(achievements);
    }

    if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + this.lookupService.getTotalXpGainFromEnemyTeam(this.battle.currentEnemies.enemyList) + " XP</strong>.");
    }
    this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies);
    this.updateEnemyDefeatCount(this.battle.currentEnemies);

    var loot = this.getLoot(this.battle.currentEnemies);
    this.getCoinRewards(this.battle.currentEnemies);
    if (loot !== undefined && loot.length > 0) {
      loot.forEach(item => {
        if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + item.amount + " " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : this.utilityService.handlePlural(this.lookupService.getItemName(item.item))) + "</strong>.");
        }
        this.lookupService.addLootToLog(item.item, item.amount);
        this.addLootToResources(item);
      });
    }

    if (subZone.victoryCount >= subZone.victoriesNeededToProceed) {
      this.unlockNextSubzone(subZone);
    }

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      if (this.battle.activeTournament.currentRound >= this.battle.activeTournament.maxRounds) {
        //handle victory situation
        this.coliseumService.handleColiseumVictory(this.battle.activeTournament.type);
      }
      else
        this.battle.activeTournament.currentRound += 1;
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
    var fullCoinDurationCutoff = 5;
    var noCoinGainDueToFastClear = false;

    if (defeatedEnemies.enemyList.length === 0)
      return;

    if (this.battle.battleDuration < fullCoinDurationCutoff) {
      noCoinGainDueToFastClear = true;
    }

    defeatedEnemies.enemyList.forEach(enemy => {
      var coinGain = enemy.coinGainFromDefeat;
      if (this.battle.battleDuration < fullCoinDurationCutoff && this.pityCoinTimer < fullCoinDurationCutoff) {
        coinGain = Math.round(coinGain * (this.battle.battleDuration / fullCoinDurationCutoff));
        //coinGain = this.utilityService.getRandomInteger(0, possibleCoinGain);        
        if (enemy.coinGainFromDefeat > 0 && coinGain > 0)
          noCoinGainDueToFastClear = false;
      }
      coin += coinGain;
    });

    if (this.pityCoinTimer >= fullCoinDurationCutoff)
      this.pityCoinTimer = 0;

    if (noCoinGainDueToFastClear)
      this.pityCoinTimer += this.battle.battleDuration;
    else
      this.pityCoinTimer = 0;

    if (coin > 0) {
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, coin));
      if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain <strong>" + Math.round(coin) + " " + (Math.round(coin) === 1 ? this.lookupService.getItemName(ItemsEnum.Coin) : this.utilityService.handlePlural(this.lookupService.getItemName(ItemsEnum.Coin))) + "</strong>.");
      }
    }
  }

  addAchievementToGameLog(achievements: Achievement[]) {
    achievements.forEach(achievement => {
      var achievementBonus = "";
      if (achievement.bonusResources !== undefined && achievement.bonusResources.length > 0) {
        achievement.bonusResources.forEach(item => {
          achievementBonus += "<strong>" + item.amount + " " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : this.utilityService.handlePlural(this.lookupService.getItemName(item.item))) + "</strong>, ";
        });

        achievementBonus = achievementBonus.substring(0, achievementBonus.length - 2);
      }
      var gameLogUpdate = "Achievement <strong>" + this.lookupService.getAchievementName(achievement) + "</strong> completed!";
      if (achievementBonus !== "")
        gameLogUpdate += " You gain " + achievementBonus + ".";

      if (this.globalService.globalVar.gameLogSettings.get("achievementUnlocked")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, gameLogUpdate);
      }
    });
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

  updateEnemyDefeatCount(defeatedEnemies: EnemyTeam) {
    defeatedEnemies.enemyList.forEach(enemy => {
      var matchingEnemy = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
      if (matchingEnemy !== undefined)
        matchingEnemy.defeatCount += 1;
    });
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
    this.globalService.globalVar.isGamePaused = !this.globalService.globalVar.isGamePaused;
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

    if (itemType === ItemTypeEnum.HealingItem || itemType === ItemTypeEnum.Toxin || itemType === ItemTypeEnum.Elixir) {
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

  useBattleItemOnCharacter(character: Character, party: Character[]) {
    if (!this.targetbattleItemMode || this.battleItemInUse === undefined || this.battleItemInUse === ItemsEnum.None)
      return;

    var itemName = this.lookupService.getItemName(this.battleItemInUse);

    var effect = this.lookupService.getBattleItemEffect(this.battleItemInUse);

    if (this.battleItemInUse === ItemsEnum.HealingHerb || this.battleItemInUse === ItemsEnum.HealingPoultice) {
      if (character.battleStats.currentHp === character.battleStats.maxHp)
        return;

      var healedAmount = this.gainHp(character, effect.healAmount)
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses " + itemName + ", gaining " + Math.round(healedAmount) + " HP.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HealingSalve) {
      var itemUsed = false;

      party.forEach(member => {
        if (member.battleStats.currentHp < member.battleStats.maxHp) {
          itemUsed = true;
          var healedAmount = this.gainHp(member, effect.healAmount)

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong>" + " uses " + itemName + ", gaining " + Math.round(healedAmount) + " HP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
          }
        }
      })

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    if (this.battleItemInUse === ItemsEnum.ThrowingStone || this.battleItemInUse === ItemsEnum.ExplodingPotion ||
      this.battleItemInUse === ItemsEnum.FirePotion) {
      if (character.battleStats.currentHp <= 0)
        return;

      var elementalType = ElementalTypeEnum.None;
      if (this.battleItemInUse === ItemsEnum.FirePotion)
        elementalType = ElementalTypeEnum.Fire;

      var elementalText = "";
      if (elementalType !== ElementalTypeEnum.None)
        elementalText = this.getElementalDamageText(elementalType);

      var damage = this.dealTrueDamage(true, character, effect.trueDamageAmount, undefined, elementalType);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " is hit by " + itemName + ", dealing " + damage + elementalText + " damage.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.PoisonExtractPotion) {
      var itemUsed = false;

      party.forEach(member => {
        if (member.battleStats.currentHp > 0) {
          itemUsed = true;

          this.applyStatusEffect(effect.targetEffect[0], member);

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "<strong>" + member.name + "</strong>" + " is poisoned by " + itemName + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
          }
        }
      });

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }
    if (this.battleItemInUse === ItemsEnum.PoisonFang || this.battleItemInUse === ItemsEnum.StranglingGasPotion) {
      if (character.battleStats.currentHp <= 0)
        return;

      this.applyStatusEffect(effect.targetEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " is poisoned by " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.PoisonousToxin || this.battleItemInUse === ItemsEnum.DebilitatingToxin) {
      if (character.battleStats.currentHp <= 0)
        return;

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " applies " + itemName + " to their weapon.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HeroicElixir) {
      if (character.battleStats.currentHp <= 0)
        return;

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " uses " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
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

  handleHpRegen(character: Character, deltaTime: number) {
    character.battleInfo.hpRegenTimer += deltaTime;
    if (character.battleInfo.hpRegenTimer >= character.battleInfo.hpRegenTimerLength) {
      var totalHpRegen = character.battleStats.hpRegen;
      this.gainHp(character, totalHpRegen);
      character.battleInfo.hpRegenTimer -= character.battleInfo.hpRegenTimerLength;
    }
  }

  getElementalDamageText(type: ElementalTypeEnum) {
    var text = "";

    if (type === ElementalTypeEnum.Holy)
      text = " <span class='holyColor bold'>Holy</span> ";
    if (type === ElementalTypeEnum.Fire)
      text = " <span class='fireColor bold'>Fire</span> ";
    if (type === ElementalTypeEnum.Air)
      text = " <span class='airColor bold'>Air</span> ";
    if (type === ElementalTypeEnum.Lightning)
      text = " <span class='lightningColor bold'>Lightning</span> ";
    if (type === ElementalTypeEnum.Water)
      text = " <span class='waterColor bold'>Water</span> ";
    if (type === ElementalTypeEnum.Earth)
      text = " <span class='earthColor bold'>Earth</span> ";


    return text;
  }

  checkForEquipmentEffect(trigger: EffectTriggerEnum, user: Character, target: Character, party: Character[], targets: Character[]) {
    var userGainsEffects: StatusEffect[] = [];
    var targetGainsEffects: StatusEffect[] = [];
    var rng = 0;

    //go through each equipment piece
    if (user.equipmentSet.weapon !== undefined && user.equipmentSet.weapon.equipmentEffect.trigger === trigger) {
      user.equipmentSet.weapon.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.weapon.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else {
          targetGainsEffects.push(effect.makeCopy());
        }
      });
    }

    if (user.equipmentSet.shield !== undefined && user.equipmentSet.shield.equipmentEffect.trigger === trigger) {
      user.equipmentSet.shield.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.shield.equipmentEffect.targetEffect.forEach(effect => {
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
      user.equipmentSet.armor?.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            targetGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.armor?.equipmentEffect.targetEffect.forEach(effect => {
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
      user.equipmentSet.ring?.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.ring?.equipmentEffect.targetEffect.forEach(effect => {
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
      user.equipmentSet.necklace?.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            userGainsEffects.push(effect.makeCopy());
        }
        else
          userGainsEffects.push(effect.makeCopy());
      });

      user.equipmentSet.necklace?.equipmentEffect.targetEffect.forEach(effect => {
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

      this.handleuserEffects(true, userGainsEffects, user, party, targets);
    }

    if (targetGainsEffects.length > 0) {
      this.handletargetEffects(true, targetGainsEffects, user, target, targets, party);
    }
  }

  applyToxin(user: Character, target: Character, party: Character[], targets: Character[]) {
    //check if user has toxin buff
    //handle based on what it is
    if (user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.PoisonousToxin || item.type === StatusEffectEnum.DebilitatingToxin)) {
      var poisonousToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PoisonousToxin);
      if (poisonousToxin !== undefined) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= poisonousToxin.effectiveness) {
          var damageDealt = 8;
          this.dealTrueDamage(true, target, damageDealt);
          var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + Math.round(damageDealt) + " damage from " + poisonousToxin.caster + "'s effect.";

          if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
        }
      }

      var debilitatingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DebilitatingToxin);
      if (debilitatingToxin !== undefined) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= debilitatingToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 5, .9, false, false), target, undefined, user);
        }
      }
    }
  }

  checkUserForEnElement(character: Character) {
    var elementalType = ElementalTypeEnum.None;

    var enfire = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enfire);
    if (enfire !== undefined) {
      elementalType = ElementalTypeEnum.Fire;
    }

    return elementalType;
  }

  checkOverdriveStatus(character: Character, deltaTime: number) {
    if (character.overdriveInfo.overdriveGaugeAmount === character.overdriveInfo.overdriveGaugeTotal &&
      (character.overdriveInfo.overdriveAutoMode || character.overdriveInfo.manuallyTriggered)) {
      character.overdriveInfo.overdriveIsActive = true;
      character.overdriveInfo.overdriveGaugeAmount = 0;
      this.altarService.incrementAltarCount(AltarConditionEnum.OverdriveUse);

      if (this.globalService.globalVar.gameLogSettings.get("partyUseOverdrive")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses Overdrive: " + this.lookupService.getOverdriveName(character.overdriveInfo.selectedOverdrive) + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Overdrive, gameLogEntry);
      }
    }

    character.overdriveInfo.manuallyTriggered = false;

    if (character.overdriveInfo.overdriveIsActive) {
      character.overdriveInfo.overdriveActiveDuration += deltaTime;

      if (character.overdriveInfo.overdriveActiveDuration >= character.overdriveInfo.overdriveActiveLength) {
        character.overdriveInfo.overdriveIsActive = false;
        character.overdriveInfo.overdriveActiveDuration = 0;

        if (character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection) {
          this.gainHp(character, character.overdriveInfo.damageTaken / 2);
          character.overdriveInfo.damageTaken = 0;
        }
      }
    }
  }
}
