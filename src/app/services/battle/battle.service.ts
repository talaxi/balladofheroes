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
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
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
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
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
import { AlchemyService } from '../professions/alchemy.service';
import { ProfessionService } from '../professions/profession.service';
import { StoryService } from '../story/story.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';
import { ColiseumService } from './coliseum.service';
import { DpsCalculatorService } from './dps-calculator.service';
import { GameLogService } from './game-log.service';
import { DictionaryService } from '../utility/dictionary.service';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { God } from 'src/app/models/character/god.model';
import { TrialService } from './trial.service';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';

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
    private dpsCalculatorService: DpsCalculatorService, private coliseumService: ColiseumService, private altarService: AltarService,
    private professionService: ProfessionService, private dictionaryService: DictionaryService, private trialService: TrialService) { }

  handleBattle(deltaTime: number, loadingContent: any) {
    deltaTime = this.utilityService.roundTo(deltaTime, this.utilityService.genericRoundTo);
    var lastPerformanceNow = performance.now();
    var subZone = this.balladService.getActiveSubZone();

    if (this.currentSubzoneType !== undefined && this.currentSubzoneType !== subZone.type) {
      this.checkForOptionalScene();
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

        var autoProgress = this.globalService.globalVar.settings.get("autoProgress") ?? false;

        if (autoProgress) {
          this.balladService.selectNextSubzone();
        }
      }
    }
    else {
      if (this.lookupService.isSubzoneATown(subZone.type) && this.lookupService.userNotInTownBattle(this.battle)) //no need to check any battle info
      {
        this.battle.atTown = true;

        var subZone = this.balladService.getActiveSubZone();
        var autoProgress = this.globalService.globalVar.settings.get("autoProgress") ?? false;

        if (autoProgress) {
          this.balladService.selectNextSubzone();
        }
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
            this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You ran out of time before successfully completing your coliseum fight. You finished in round " + this.battle.activeTournament.currentRound + (this.battle.activeTournament.maxRounds !== -1 ? " of " + this.battle.activeTournament.maxRounds : "") + ".");
            this.globalService.handleColiseumLoss(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
            this.battle.activeTournament = this.globalService.setNewTournament(true);
          }
        }

        if (this.battle.activeTrial.type !== TrialEnum.None) {
          this.battle.activeTrial.timer += deltaTime;

          if (this.battle.activeTrial.timer >= this.battle.activeTrial.timerLength) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You ran out of time before successfully completing your trial.");
            this.globalService.handleTrialLoss(this.battle.activeTrial.type);
            this.battle.activeTrial = this.globalService.setNewTrial(false);
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
        this.handleStatusEffectDurations(false, enemy, party, deltaTime);
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Altars, undefined, undefined, true, subzone.type));
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
          this.globalService.globalVar.altars.altar2 = this.altarService.getNewAltar(AltarEnum.Small, GodEnum.Artemis);

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

    if (this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.TournamentOfTheDead)!.count > 0) {
      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      if (hermes !== undefined && !hermes.isAvailable) {
        hermes.isAvailable = true;
        this.globalService.globalVar.altars.altar3 = this.altarService.getNewAltar(AltarEnum.Small, GodEnum.Hermes);

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

    if (subzone.type === SubZoneEnum.ElysiumWavesOfOceanus && subzone.victoryCount === 1 &&
      this.globalService.globalVar.chthonicPowers.preferredGod === GodEnum.None) {
      this.globalService.globalVar.chthonicPowers.preferredGod = this.lookupService.getPreferredGod();
    }

    if (subzone.type === SubZoneEnum.CalydonForestPassage && subzone.victoryCount === 10) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.ObscurredNotification, undefined, undefined, true, subzone.type));
    }
  }

  checkForOptionalScene() {
    if (this.balladService.getActiveSubZone().type === SubZoneEnum.ElysiumWindingPaths &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade1Scene1)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade1Scene1);
    }

    if (this.balladService.getActiveSubZone().type === SubZoneEnum.ElysiumWavesOfOceanus &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade1Scene2)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade1Scene2);
    }

    if (this.lookupService.getSubZoneCompletionByType(SubZoneEnum.ElysiumWavesOfOceanus) &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade1Scene3)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade1Scene3);
    }

    if (this.balladService.getActiveSubZone().type === SubZoneEnum.CalydonTallGrass &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.CalydonDenMother)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.CalydonDenMother);
    }

    if (this.balladService.getActiveSubZone().type === SubZoneEnum.TheLetheLetheBasin2 &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade2Scene1)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade2Scene1);
    }

    if (this.balladService.getActiveSubZone().type === SubZoneEnum.TheLetheHypnosIsland &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade2Scene2)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade2Scene2);
    }

    if (this.lookupService.getSubZoneCompletionByType(SubZoneEnum.TheLetheHypnosIsland) &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavorUpgrade2Scene3)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.ChthonicFavorUpgrade2Scene3);
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
      //check for side quests
      if (subzone.type === SubZoneEnum.CalydonAltarOfAsclepius) {
        this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.SideQuest;
        this.globalService.globalVar.activeBattle.atScene = true;
      }
      else {
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Equipment, undefined, undefined, true, subzone.type));
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
          this.lookupService.addLootToLog(reward.item, reward.amount, subzone.type);
          if (this.globalService.globalVar.gameLogSettings.get("foundTreasureChest")) {
            var itemName = (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item)));
            if (this.lookupService.getItemTypeFromItemEnum(reward.item) === ItemTypeEnum.Equipment) {
              var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(reward.item)?.quality);
              itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
            }

            this.gameLogService.updateGameLog(GameLogEntryEnum.TreasureChestRewards, "You find a treasure chest containing <strong>" + reward.amount + " " + itemName + "</strong>.");
          }
        });

        if (showBattleItemTutorial)
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.BattleItems, undefined, undefined, true, subzone.type));
      }
    }
  }

  initializeEnemyList() {
    var subZone = this.balladService.getActiveSubZone();
    var enemyOptions: EnemyTeam[] = [];

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      //tournament battles
      //console.log("Get " + this.battle.activeTournament.type + " enemy options for round " + this.battle.activeTournament.currentRound);
      enemyOptions = this.coliseumService.generateBattleOptions(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
    }
    else if (this.battle.activeTrial.type !== TrialEnum.None) {
      enemyOptions = this.trialService.generateBattleOptions(this.battle.activeTrial);
    }
    else {
      //all standard battles
      enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subZone.type);
    }

    var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
    if (subZone.type === SubZoneEnum.AigosthenaUpperCoast && subZone.victoryCount < 2)
      this.battle.currentEnemies = enemyOptions[0];
    else
      this.battle.currentEnemies = randomEnemyTeam;
    this.battle.battleDuration = 0;
  }

  handleStatusEffectDurations(isPartyMember: boolean, character: Character, targets: Character[], deltaTime: number) {
    if (character.battleInfo.statusEffects.length === 0)
      return;

    var fastDebuffSpeed = 1;
    if (isPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.DionysusRareFastDebuffs) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.DionysusRareFastDebuffs);
      fastDebuffSpeed = relevantAltarEffect!.effectiveness;
    }

    character.battleInfo.statusEffects.forEach(effect => {
      var previousDuration = effect.duration;

      if (!effect.isPositive)
        effect.duration -= deltaTime * fastDebuffSpeed;
      else
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
          var caster: Character | undefined = undefined;
          if (effect.casterEnum !== CharacterEnum.None) {
            if (effect.casterEnum === CharacterEnum.Enemy) {
              caster = this.battle.currentEnemies.enemyList.find(item => item.name === effect.caster);
            }
          }

          //deal damage
          var damageDealt = this.dealTrueDamage(!isPartyMember, character, effect.effectiveness, caster, effect.element, false, true);
          var elementalText = "";
          if (effect.element !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(effect.element);

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(damageDealt)) + elementalText + " damage from " + effect.abilityName + "'s effect.";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }

          effect.tickTimer -= effect.tickFrequency;
        }
      }

      if (effect.type === StatusEffectEnum.RepeatDamageAfterDelay && effect.duration <= 0) {
        var target = this.getTarget(character, targets);
        if (target !== undefined) {
          var damageDealt = this.dealTrueDamage(isPartyMember, target, effect.effectiveness, character, effect.element, false, false);
          var elementalText = "";
          if (effect.element !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(effect.element);

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " repeats their previous damage, dealing " + this.utilityService.bigNumberReducer(Math.round(damageDealt)) + elementalText + " damage to " + target.name + ".";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
        }
      }
    });

    character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(effect => effect.isPermanent || effect.duration > 0);

    if (character.name === "Athena") { //Trial of Skill
      var totalEffectiveness = 11;
      var amountPerDebuff = 1.25;
      var totalDebuffs = character.battleInfo.statusEffects.filter(item => !item.isPositive).length;
      if (totalDebuffs > 8)
        totalDebuffs = 8;

      var defenseUpBuff = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DefenseUp);
      if (defenseUpBuff !== undefined) {
        defenseUpBuff.effectiveness = totalEffectiveness - (amountPerDebuff * totalDebuffs);
      }

      var resistanceUpBuff = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ResistanceUp);
      if (resistanceUpBuff !== undefined) {
        resistanceUpBuff.effectiveness = totalEffectiveness - (amountPerDebuff * totalDebuffs);
      }
    }
  }

  //add equipment and permanent stats to base stats
  updateBattleStats(character: Character) {
    this.globalService.calculateCharacterBattleStats(character);
  }

  handleAutoAttackTimer(character: Character, deltaTime: number) {
    var stagger = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Stagger);
    if (stagger !== undefined) {
      deltaTime *= 1 - stagger.effectiveness;
    }

    var autoAttackSpeedUp = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.AutoAttackSpeedUp);
    if (autoAttackSpeedUp !== undefined) {
      deltaTime *= autoAttackSpeedUp.effectiveness;
    }

    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun || effect.type === StatusEffectEnum.Immobilize))
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

  handleAutoAttack(isPartyAttacking: boolean, character: Character, targets: Character[], party: Character[], additionalDamageMultiplier?: number, canTriggerInstantAutoAttack: boolean = true) {
    var target = this.getTarget(character, targets);

    if (target === undefined)
      return false;

    if (this.doesAutoAttackMiss(character, target, isPartyAttacking)) {
      return true;
    }

    var totalAutoAttackCount = this.lookupService.getTotalAutoAttackCount(character, isPartyAttacking);
    var isCritical = this.isDamageCritical(character, target);
    var overdriveMultiplier = 1;
    var elementalType = character.battleInfo.elementalType;
    var autoAttackMultiplier = character.battleInfo.autoAttackModifier === undefined ? 1 : character.battleInfo.autoAttackModifier;

    if (character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Smash)
      overdriveMultiplier = 1.25;

    autoAttackMultiplier *= overdriveMultiplier;

    var autoAttackInvulnerability = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AutoAttackInvulnerable);
    var invulnerability = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Invulnerable);
    if (autoAttackInvulnerability !== undefined || invulnerability !== undefined)
      autoAttackMultiplier = 0;

    if (character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Nature)
      elementalType = character.overdriveInfo.lastUsedElement;

    if (elementalType === ElementalTypeEnum.None) {
      elementalType = this.checkUserForEnElement(character);
    }

    var flamingToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FlamingToxin);
    if (flamingToxin !== undefined) {
      elementalType = ElementalTypeEnum.Fire;
    }

    var elementalText = "";
    if (elementalType !== ElementalTypeEnum.None) {
      elementalText = this.getElementalDamageText(elementalType);

      var disaster = this.lookupService.characterHasAbility("Natural Disaster", character);
      if (disaster !== undefined && (character.battleInfo.elementsUsed === undefined || !character.battleInfo.elementsUsed.some(item => item === elementalType))) {
        if (character.battleInfo.elementsUsed === undefined)
          character.battleInfo.elementsUsed = [];

        character.battleInfo.elementsUsed.push(elementalType);
      }
    }

    if (isPartyAttacking)
      this.altarService.incrementAltarCount(AltarConditionEnum.AutoAttackUse);

    var damageMultiplier = this.getDamageMultiplier(character, target, additionalDamageMultiplier, true, elementalType) * totalAutoAttackCount;

    var damageDealt = this.dealDamage(isPartyAttacking, character, target, isCritical, autoAttackMultiplier, damageMultiplier, undefined, elementalType);

    var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " attacks <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + this.utilityService.bigNumberReducer(damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
    if (isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.PartyAutoAttacks, gameLogEntry);
    }
    else if (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.EnemyAutoAttacks, gameLogEntry);
    }

    var targetEffects = [];
    //code specific to Stymphalian Birds
    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ExtraTrueDamage)) {
      var extraTrueDamage = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ExtraTrueDamage);

      if (extraTrueDamage !== undefined) {
        extraTrueDamage.effectiveness += 20;
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, extraTrueDamage.effectiveness, true, false, false));
      }
    }

    this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, target, party, targets, undefined, undefined, Math.floor(totalAutoAttackCount), !canTriggerInstantAutoAttack);
    this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAutoAttack, character, target, party, targets, undefined, undefined, Math.floor(totalAutoAttackCount), !canTriggerInstantAutoAttack);
    this.applyToxin(character, target, party, targets);

    this.handleuserEffects(isPartyAttacking, [], character, party, targets, damageDealt);
    this.handletargetEffects(isPartyAttacking, [], character, target, targets, party, damageDealt);

    var invulnerability = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Invulnerable);
    if (invulnerability === undefined) {
      var reprisalThornsBonus = 1;
      var reprisalThorns = 0;
      if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Reprisal) {
        reprisalThorns = this.utilityService.reprisalAmount;
        reprisalThornsBonus = this.utilityService.reprisalBonus;
      }

      var thorns = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
      if (thorns !== undefined || target.battleStats.thorns > 0 || reprisalThorns > 0 ||
        (!isPartyAttacking && (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns) !== undefined ||
          this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns) !== undefined))) {
        var thornsPercentDamage = damageDealt * target.battleStats.thorns;
        thornsPercentDamage += damageDealt * reprisalThorns;

        var thornsEffectiveness = 0;
        if (thorns !== undefined) {
          target.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.Thorns).forEach(thornEffect => {
            thornsEffectiveness += thornEffect.effectiveness;
          });
        }

        var altarThornsDamage = 0;
        if (!isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns);
          altarThornsDamage += damageDealt * (relevantAltarEffect!.effectiveness - 1);
        }
        if (!isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns);
          altarThornsDamage += damageDealt * (relevantAltarEffect!.effectiveness - 1);
        }

        var thornsDamageDealt = Math.round(this.dealTrueDamage(!isPartyAttacking, character, (thornsEffectiveness + thornsPercentDamage + altarThornsDamage) * reprisalThornsBonus, undefined, undefined, false));
        if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
          (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thornsDamageDealt + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Thorns effect.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
      }
    }

    var barrage = this.lookupService.characterHasAbility("Barrage", character);
    if (barrage !== undefined) {
      barrage.count += 1;

      if (barrage.count >= barrage.maxCount) {
        var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Invulnerable || item.type === StatusEffectEnum.AutoAttackInvulnerable));
        var additionalTargets = potentialTargets.filter(item => item !== target);
        if (additionalTargets.length > 0) {
          additionalTargets.forEach(additionalTarget => {
            var additionalDamageDealt = this.dealDamage(isPartyAttacking, character, additionalTarget, false, undefined, barrage!.effectiveness);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack hits <strong>" + additionalTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(additionalDamageDealt) + " damage as well.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            }
            this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, additionalTarget, party, targets);

            var thorns = additionalTarget.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
            if (thorns !== undefined) {
              this.dealTrueDamage(!isPartyAttacking, character, thorns.effectiveness, undefined, undefined, false);
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
      var effectiveness = quicken.effectiveness;
      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      if (hermes !== undefined) {
        var permanentAbility = hermes.permanentAbilityUpgrades.find(item => item.requiredLevel === quicken!.requiredLevel);
        if (permanentAbility !== undefined && permanentAbility.effectiveness > 0)
          effectiveness += permanentAbility.effectiveness;
      }

      if (character.abilityList !== undefined && character.abilityList.length > 0)
        character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
          ability.currentCooldown -= effectiveness;
        });

      if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown -= effectiveness;
            });
        }
      }

      if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown -= effectiveness;
            });
        }
      }
    }

    var instantHeal = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack);
    if (instantHeal !== undefined) {
      var healAmount = instantHeal.effectiveness * (1 + character.battleStats.healingDone);

      if (character !== undefined) {
        this.gainHp(character, healAmount);
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.InstantHealAfterAutoAttack);

        if (Math.round(healAmount) > 0) {
          if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong> gains " + Math.round(healAmount) + " HP" + (instantHeal.abilityName !== undefined && instantHeal.abilityName !== "" ? " from " + instantHeal.abilityName : "") + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
        }
      }
    }

    if (character.level >= this.utilityService.characterOverdriveLevel) {
      character.overdriveInfo.gaugeAmount += character.overdriveInfo.gainPerAutoAttack * this.lookupService.getOverdriveGainMultiplier(character, true);
      if (character.overdriveInfo.gaugeAmount > character.overdriveInfo.gaugeTotal)
        character.overdriveInfo.gaugeAmount = character.overdriveInfo.gaugeTotal;
    }
    return true;
  }

  doesAutoAttackMiss(character: Character, target: Character, isPartyAttacking: boolean) {
    var blind = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Blind);
    if (blind !== undefined) {
      var attackFailureRate = blind.effectiveness;
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= attackFailureRate) {
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


    if (ability.name === "Sprout Head") {
      var deadCount = 0;
      this.battle.currentEnemies.enemyList.filter(enemy => enemy.bestiaryType === BestiaryEnum.HydraHead).forEach(enemy => {
        if (enemy.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Dead))
          deadCount += 1;
      });
      if (deadCount === 0) {
        return;
      }
    }

    if (ability.name === "Strangle") {
      var strangleAlreadyApplied = false;
      if (this.globalService.getActivePartyCharacters(true).some(character => character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Immobilize)))
        strangleAlreadyApplied = true;

      if (strangleAlreadyApplied)
        return;
    }

    var unsteady = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Unsteady);
    if (unsteady !== undefined) {
      deltaTime *= 1 - unsteady.effectiveness;
    }

    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun || effect.type === StatusEffectEnum.Immobilize))
      ability.currentCooldown -= deltaTime;
  }

  checkAbilityCooldown(isPartyUsing: boolean, character: Character, ability: Ability, deltaTime: number, partyMembers: Character[], targets: Character[]) {
    if (ability.currentCooldown <= 0) {

      if (targets !== undefined && targets.length > 0 && (ability.autoMode || ability.manuallyTriggered) &&
        this.avoidAbilityRedundancy(ability, partyMembers)) {
        ability.currentCooldown = 0;
        var abilityUsed = this.useAbility(isPartyUsing, ability, character, targets, partyMembers, true);

        if (abilityUsed)
          ability.currentCooldown = this.globalService.getAbilityCooldown(ability, character);
      }

      ability.manuallyTriggered = false;

      this.handlePostAbilityUseEffects(ability, character);
    }
  }

  avoidAbilityRedundancy(ability: Ability, partyMembers: Character[]) {
    var partyNotFullHp = partyMembers.some(member => member.battleStats.currentHp !== member.battleStats.maxHp);

    if (!ability.manuallyTriggered && (!ability.isActivatable || (!partyNotFullHp && ability.name === "Heal")))
      return false;

    //foresight from the furies
    if (ability.name === "Fate Foretold" &&
      partyMembers.some(member => member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns) !== undefined)) {
      return false;
    }

    return true;
  }

  //isPartyUsing = is the character using the ability a party member or enemy
  useAbility(isPartyUsing: boolean, ability: Ability, user: Character, targets: Character[], party: Character[], isGodAbility: boolean, effectivenessModifier: number = 1, abilityWillRepeat: boolean = false) {
    var abilityCopy = ability.makeCopy();
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Invulnerable));
    var target = this.getTarget(user, abilityCopy.targetsAllies ? party : targets, abilityCopy.targetType !== undefined ? abilityCopy.targetType : TargetEnum.Random);
    var damageDealt = 0;
    var elementalText = "";
    var elementalType = abilityCopy.elementalType;
    var userEffects: StatusEffect[] = [];
    var targetEffects: StatusEffect[] = [];

    this.handleConditionalAbilityChanges(abilityCopy, user, party);

    if (target === undefined)
      return false;

    var invulnerability = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Invulnerable);
    if (invulnerability !== undefined) {
      if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>, but it has no effect due to their invulnerability!";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
      }
      return true;
    }

    if (elementalType === ElementalTypeEnum.None) {
      elementalType = this.checkUserForEnElement(user);
    }

    var disaster = this.lookupService.characterHasAbility("Natural Disaster", user);
    if (elementalType !== ElementalTypeEnum.None && disaster !== undefined && (user.battleInfo.elementsUsed === undefined || !user.battleInfo.elementsUsed.some(item => item === elementalType)) &&
      abilityCopy.name !== "Natural Disaster") { //avoid an infinite loop by not including itself

      if (user.battleInfo.elementsUsed === undefined)
        user.battleInfo.elementsUsed = [];

      user.battleInfo.elementsUsed.push(elementalType);
    }

    var abilityEffectiveness = this.getAbilityEffectiveness(abilityCopy, effectivenessModifier, user, isGodAbility);
    var onslaughtUsed = false;

    if (abilityCopy.dealsDirectDamage) {
      if (elementalType !== ElementalTypeEnum.None)
        elementalText = this.getElementalDamageText(elementalType);

      if (abilityCopy.isAoe) {
        potentialTargets.forEach(potentialTarget => {
          var damageMultiplier = this.getDamageMultiplier(user, potentialTarget, undefined, false, elementalType, abilityCopy.name, abilityCopy.isAoe);
          var isCritical = this.isDamageCritical(user, potentialTarget);

          damageDealt = this.dealDamage(isPartyUsing, user, potentialTarget, isCritical, abilityEffectiveness, damageMultiplier, abilityCopy, elementalType);
          if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
            (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(potentialTarget.type) + "'>" + potentialTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
          }
          onslaughtUsed = this.checkForOnslaught(damageDealt, user, potentialTarget, potentialTargets, abilityCopy, abilityWillRepeat);
        });
      }
      else {
        var damageMultiplier = this.getDamageMultiplier(user, target, undefined, false, elementalType, abilityCopy.name);
        var isCritical = this.isDamageCritical(user, target);
        damageDealt = this.dealDamage(isPartyUsing, user, target, isCritical, abilityEffectiveness, damageMultiplier, abilityCopy, elementalType);
        if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
          (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + this.utilityService.bigNumberReducer(damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "");
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
        onslaughtUsed = this.checkForOnslaught(damageDealt, user, target, potentialTargets, abilityCopy, abilityWillRepeat);
      }
    }
    else if (abilityCopy.heals) {
      var healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user, abilityCopy, isPartyUsing) * (1 + user.battleStats.healingDone);

      if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Preservation)
        healAmount *= 1.5;

      if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Harmony) {
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10));
      }

      var adjustedCriticalMultiplier = 1;
      var isCritical = this.isHealCritical(user);
      if (isCritical)
        adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user, isPartyUsing);
      healAmount *= adjustedCriticalMultiplier;

      var healedAmount = this.gainHp(target, healAmount);

      user.trackedStats.healingDone += healedAmount;
      if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
        !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
        user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

      user.trackedStats.healsMade += 1;
      if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
        !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
        user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);

      if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on " + target.name + ", restoring " + this.utilityService.bigNumberReducer(Math.round(healedAmount)) + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
      }

      //check Apollo conditions
      if (abilityCopy.name === "Ostinato") {
        var staccato = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        var fortissimo = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        var coda = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (staccato !== undefined) {
          party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead || effect.type === StatusEffectEnum.Stun || effect.type === StatusEffectEnum.Immobilize)).forEach(member => {
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
      if (abilityCopy.name === "Sprout Head") //Lernean Hydra Ability
      {
        this.battle.currentEnemies.enemyList.forEach(enemy => {
          if (enemy.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
            enemy.battleInfo.statusEffects = [];
            enemy.battleStats.currentHp = enemy.battleStats.maxHp;
          }
        });

        if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", healing any destroyed head back to full HP and regaining its immunity.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
        }

        var mainHead = this.battle.currentEnemies.enemyList.find(item => item.bestiaryType === BestiaryEnum.LerneanHydra);
        if (mainHead !== undefined && !mainHead.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Invulnerable))
          mainHead.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Invulnerable, -1, 1, false, true, false));
      }
      else if (abilityCopy.name === "Ground" && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) { //Enceladus ability
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", preventing you from escaping the battle.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
      }
      else if (((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) &&
        (abilityCopy.name !== "Revel in Blood" || !isPartyUsing)) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
      }
    }

    if (abilityCopy.name === "Revel in Blood" && isPartyUsing) {
      var hpLoss = user.battleStats.currentHp * .1;
      user.battleStats.currentHp -= hpLoss;
      var DoT = this.globalService.makeStatusEffectCopy(abilityCopy.targetEffect.find(dotEffect => dotEffect.type === StatusEffectEnum.DamageOverTime)!);
      if (DoT !== undefined) {
        DoT.dotType = dotTypeEnum.TrueDamage;
        DoT.effectiveness = Math.abs(hpLoss) * (DoT.effectiveness - 1);
        DoT.isAoe = true;

        if (target !== undefined) {
          this.applyStatusEffect(DoT, target, potentialTargets, user);
        }

        if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", losing " + Math.round(Math.abs(hpLoss)) + " HP and applying a damage over time effect on all enemies.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
        }
      }
    }

    if (onslaughtUsed)
      user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Onslaught);

    //get copies instead of actually effects
    if (abilityCopy.userEffect.length > 0) {
      abilityCopy.userEffect.forEach(effect => {
        userEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (abilityCopy.targetEffect.length > 0) {
      abilityCopy.targetEffect.forEach(effect => {
        targetEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Preservation) {
      var userBarrier = userEffects.find(item => item.type === StatusEffectEnum.Barrier);
      var targetBarrier = targetEffects.find(item => item.type === StatusEffectEnum.Barrier);

      if (userBarrier !== undefined)
        userBarrier.effectiveness *= 1.5;

      if (targetBarrier !== undefined)
        targetBarrier.effectiveness *= 1.5;
    }

    if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Harmony) {
      var userBarrier = userEffects.find(item => item.type === StatusEffectEnum.Barrier);
      var targetBarrier = targetEffects.find(item => item.type === StatusEffectEnum.Barrier);

      if (userBarrier !== undefined)
        userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10));

      if (targetBarrier !== undefined)
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10));
    }

    if (abilityCopy.name === "Revelry") {
      var effect = userEffects.find(item => item.type === StatusEffectEnum.Barrier);
      if (effect !== undefined) {
        var buffCount = this.getBuffsOnCharacter(user);
        var effectivenessMultiplier = 1;
        effectivenessMultiplier += buffCount * (abilityCopy.secondaryEffectiveness - 1);
        effect.effectiveness *= effectivenessMultiplier;
      }
    }

    if (abilityCopy.name === "Thyrsus") {
      var effect = targetEffects.find(item => item.type === StatusEffectEnum.Thyrsus);
      if (effect !== undefined) {
        var debuffCount = this.getDebuffsOnCharacter(target);
        if (debuffCount > 20)
          debuffCount = 20;
        effect.effectiveness -= 1;
        var effectivenessMultiplier = 1;
        effectivenessMultiplier += debuffCount * (abilityCopy.secondaryEffectiveness - 1);
        effect.effectiveness *= effectivenessMultiplier;
        effect.effectiveness += 1;
      }
    }

    if (abilityCopy.name === "Chain Lightning") {
      if (userEffects.some(item => item.type === StatusEffectEnum.RepeatDamageAfterDelay)) {
        userEffects.filter(item => item.type === StatusEffectEnum.RepeatDamageAfterDelay).forEach(effect => {
          effect.effectiveness = damageDealt;
        });
      }
    }

    var overload = this.lookupService.characterHasAbility("Overload", user);
    if (overload !== undefined && elementalType === ElementalTypeEnum.Lightning) {
      var copy = this.globalService.makeStatusEffectCopy(overload.userEffect[0]);
      var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
      if (zeus !== undefined) {
        var overloadUpgrade = zeus.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
        if (overloadUpgrade !== undefined && overloadUpgrade.userEffect.length > 0)
          copy.effectiveness += overloadUpgrade.userEffect[0].effectiveness;
      }

      this.applyStatusEffect(copy, user, party, user);
    }

    var chanceToStun = targetEffects.find(item => item.type === StatusEffectEnum.ChanceToStun);
    if (chanceToStun !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);

      if (rng <= chanceToStun.effectiveness) {
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, ability.secondaryEffectiveness, 0, false, false));
      }

      targetEffects = targetEffects.filter(item => item.type !== StatusEffectEnum.ChanceToStun);
    }

    //code specific to Stymphalian Birds
    if (user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ExtraTrueDamage) && abilityCopy.dealsDirectDamage) {
      var extraTrueDamage = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ExtraTrueDamage);

      if (extraTrueDamage !== undefined) {
        extraTrueDamage.effectiveness += 20;
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, extraTrueDamage.effectiveness, true, false, false));
      }
    }

    this.handleuserEffects(isPartyUsing, userEffects, user, party, potentialTargets, damageDealt, abilityCopy);
    this.handletargetEffects(isPartyUsing, targetEffects, user, target, potentialTargets, party, damageDealt, abilityCopy.targetsAllies, abilityCopy);
    this.checkForEquipmentEffect(EffectTriggerEnum.OnAbilityUse, user, target, party, targets, undefined, abilityCopy.targetsAllies);
    this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAbilityUse, user, target, party, targets, undefined, abilityCopy.targetsAllies);

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
      var statusEffect = this.globalService.makeStatusEffectCopy(secondWind.userEffect[0]);
      this.applyStatusEffect(statusEffect, user, party, user);
    }

    if (user.level >= this.utilityService.characterOverdriveLevel) {
      user.overdriveInfo.gaugeAmount += user.overdriveInfo.gainPerAbility * this.lookupService.getOverdriveGainMultiplier(user);
      if (user.overdriveInfo.gaugeAmount > user.overdriveInfo.gaugeTotal)
        user.overdriveInfo.gaugeAmount = user.overdriveInfo.gaugeTotal;
    }
    return true;
  }

  checkForOnslaught(damageDealt: number, user: Character, target: Character, potentialTargets: Character[], ability: Ability, willAbilityRepeat: boolean = false) {
    var addDoTDamage = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Onslaught);
    if (addDoTDamage !== undefined && damageDealt > 0) {
      var onslaught = this.lookupService.characterHasAbility("Onslaught", user);
      if (onslaught !== undefined && onslaught.targetEffect.find(dotEffect => dotEffect.type === StatusEffectEnum.DamageOverTime) !== undefined) {
        var DoT = this.globalService.makeStatusEffectCopy(onslaught.targetEffect.find(dotEffect => dotEffect.type === StatusEffectEnum.DamageOverTime)!);
        if (DoT !== undefined) {
          DoT.dotType = dotTypeEnum.BasedOnDamage;
          DoT.effectiveness = damageDealt * DoT.effectiveness;
          DoT.isAoe = false;

          if (target !== undefined) {
            this.applyStatusEffect(DoT, target, potentialTargets, user);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + "'s " + ability.name + " also applies a damage over time effect from Onslaught.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
            }

            var willAbilityRepeat = ability.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) || willAbilityRepeat;

            return !willAbilityRepeat;
          }
        }
      }
    }

    return false;
  }

  handleuserEffects(isPartyUsing: boolean, userEffect: StatusEffect[], user: Character, party: Character[], targets: Character[], damageDealt: number = 0, originalAbility?: Ability) {
    if (userEffect.length > 0) {
      userEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = this.globalService.makeStatusEffectCopy(gainedStatusEffect);

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing) * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnDamage)
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.UserCurrentMaxHpPercent)
            appliedStatusEffect.effectiveness = user.battleStats.currentHp * appliedStatusEffect.effectiveness;
        }

        if (appliedStatusEffect.dotType !== dotTypeEnum.None)
          this.applyStatusEffect(appliedStatusEffect, user, party, user, originalAbility);
      });
    }

    party.forEach(member => {
      if (member.battleInfo.statusEffects.some(item => item.isInstant)) {
        member.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDown) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDown); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHp) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(true), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHp); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatUp) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatUpStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, true, instantEffect.isAoe);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatUp); });
          }

          if (instantEffect.type === StatusEffectEnum.InstantHeal) {
            var healAmount = damageDealt * instantEffect.effectiveness * (1 + member.battleStats.healingDone);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong> gains " + this.utilityService.bigNumberReducer(Math.round(healAmount)) + " HP" + (instantEffect.abilityName !== undefined && instantEffect.abilityName !== "" ? " from " + instantEffect.abilityName : "") + ".";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            }

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
            instantEffect.type = StatusEffectEnum.None; //because handleAutoAttack calls this method as well, need to prevent this from being recast
            this.handleAutoAttack(isPartyUsing, member, targets, party, instantEffect.effectiveness, false); //prevent it from infinite looping itself
          }

          if (instantEffect.type === StatusEffectEnum.RepeatAbility && originalAbility !== undefined) {
            var repeatCount = originalAbility.userEffect.filter(effect => effect.type === StatusEffectEnum.RepeatAbility).length;
            originalAbility.userEffect = originalAbility.userEffect.filter(item => item.type !== StatusEffectEnum.RepeatAbility);
            for (var i = 0; i < repeatCount; i++) {
              this.useAbility(isPartyUsing, originalAbility, user, targets, party, false, undefined, i < repeatCount - 1);
            }
          }

          if (instantEffect.type === StatusEffectEnum.Sap) {
            var sapDamage = instantEffect.effectiveness * member.battleStats.attack;
            var target = this.getTarget(user, targets, TargetEnum.Random);
            if (target !== undefined) {
              sapDamage = this.dealTrueDamage(isPartyUsing, target, sapDamage, undefined, undefined, true);
              this.gainHp(user, sapDamage);
            }
          }

          if (instantEffect.type === StatusEffectEnum.SelfKO) {
            user.battleStats.currentHp = 0;
            this.isCharacterDefeated(user);
          }

          if (instantEffect.type === StatusEffectEnum.ClearDebuffs) {
            user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.isPositive);
          }

          if (instantEffect.type === StatusEffectEnum.Barrier) {
            var barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing));

            if (instantEffect.isAoe) {
              party.filter(item => !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(partyMember => {
                user.trackedStats.healsMade += 1;
                user.trackedStats.healingDone += barrierAmount;
                if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
                  !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
                  user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);
                if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
                  !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
                  user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

                if (partyMember.battleInfo.barrierValue < partyMember.battleStats.maxHp * instantEffect.threshold) {
                  partyMember.battleInfo.barrierValue += barrierAmount;

                  //if you went over threshold, set it back down 
                  if (partyMember.battleInfo.barrierValue > partyMember.battleStats.maxHp * instantEffect.threshold) {
                    partyMember.battleInfo.barrierValue = Math.round(partyMember.battleStats.maxHp * instantEffect.threshold);
                  }
                }

                partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Barrier);
              });
              if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
                (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields allies for " + this.utilityService.bigNumberReducer(barrierAmount) + " damage.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
              }
            }
            else {
              user.trackedStats.healsMade += 1;
              user.trackedStats.healingDone += barrierAmount;
              if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
                !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
                user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);
              if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
                !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
                user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

              var barrierTarget: Character | undefined;
              if (originalAbility !== undefined && originalAbility?.targetType === TargetEnum.Random)
                barrierTarget = this.lookupService.getRandomPartyMember(party);
              else
                barrierTarget = this.getTarget(user, party, TargetEnum.LowestHpPercent);

              if (barrierTarget === undefined)
                return;

              if (barrierTarget.battleInfo.barrierValue < barrierTarget.battleStats.maxHp * instantEffect.threshold) {
                barrierTarget.battleInfo.barrierValue += barrierAmount;

                //if you went over threshold, set it back down 
                if (barrierTarget.battleInfo.barrierValue > barrierTarget.battleStats.maxHp * instantEffect.threshold) {
                  barrierTarget.battleInfo.barrierValue = Math.round(barrierTarget.battleStats.maxHp * instantEffect.threshold);
                }
              }

              if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
                (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields " + "<strong class='" + this.globalService.getCharacterColorClassText(barrierTarget.type) + "'>" + barrierTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(barrierAmount) + " damage.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
              }
            }
          }

          if (instantEffect.type === StatusEffectEnum.SelfBarrier) {
            var barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing));
            user.trackedStats.healsMade += 1;
            user.trackedStats.healingDone += barrierAmount;

            if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
              !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
              user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);
            if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
              !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
              user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

            if (user.battleInfo.barrierValue < user.battleStats.maxHp * instantEffect.threshold) {
              user.battleInfo.barrierValue += barrierAmount;

              //if you went over threshold, set it back down 
              if (user.battleInfo.barrierValue > user.battleStats.maxHp * instantEffect.threshold) {
                user.battleInfo.barrierValue = Math.round(user.battleStats.maxHp * instantEffect.threshold);
              }
            }

            if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
              (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields allies for " + this.utilityService.bigNumberReducer(barrierAmount) + " damage.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry);
            }
          }
        });
      }

      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => !item.isInstant);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.None);
    });
  }

  handletargetEffects(isPartyUsing: boolean, targetEffect: StatusEffect[], user: Character, target: Character, potentialTargets: Character[], party: Character[], damageDealt: number = 0, abilityTargetedAllies: boolean = false, originalAbility?: Ability) {
    if (targetEffect.length > 0) {
      targetEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = this.globalService.makeStatusEffectCopy(gainedStatusEffect);

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnAttack)
            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing) * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnDamage) {
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;   
          }                              
          else if (appliedStatusEffect.dotType === dotTypeEnum.UserCurrentMaxHpPercent)
              appliedStatusEffect.effectiveness = user.battleStats.currentHp * appliedStatusEffect.effectiveness;
        }

        if (target !== undefined && appliedStatusEffect.dotType !== dotTypeEnum.None) {
          this.applyStatusEffect(appliedStatusEffect, target, potentialTargets, user, originalAbility);
        }

        var mark = user.abilityList.find(item => item.name === "Mark" && item.isAvailable);
        if (!abilityTargetedAllies && mark !== undefined) {
          var markEffect = this.globalService.makeStatusEffectCopy(mark.targetEffect[0]);
          markEffect.duration = gainedStatusEffect.duration;
          markEffect.isAoe = gainedStatusEffect.isAoe;

          if (target !== undefined)
            this.applyStatusEffect(markEffect, target, potentialTargets, user);
        }
      });
    }

    //check all instant effects (maybe make its own function?)    
    var totalTrueDamageDealt = 0;
    var totalTrueDamageHitCount = 0;
    if (target.battleInfo.statusEffects.some(item => item.isInstant)) {
      target.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDown) {
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe);
          this.applyStatusEffect(statusEffect, target, potentialTargets, user);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDown); });
        }
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHp) {
          var randomTarget: Character | undefined = target;
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(true), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe);

          if (originalAbility !== undefined && originalAbility.name === "Insanity") {
            randomTarget = this.getTarget(user, potentialTargets);
            if (randomTarget === undefined)
              randomTarget = target;
          }

          this.applyStatusEffect(statusEffect, randomTarget, potentialTargets, user, originalAbility);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHp); });
        }
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatUp) {
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatUpStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, true, instantEffect.isAoe);
          this.applyStatusEffect(statusEffect, target, potentialTargets, user);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatUp); });
        }

        if (instantEffect.type === StatusEffectEnum.InstantHeal) {
          var healAmount = damageDealt * instantEffect.effectiveness * (1 + target.battleStats.healingDone);

          if (target !== undefined)
            this.gainHp(target, healAmount);
        }

        if (instantEffect.type === StatusEffectEnum.RemoveBuff) {
          var potentialTargetBuffs = target.battleInfo.statusEffects.filter(item => item.isPositive && !this.globalService.doesStatusEffectPersistDeath(item.type));
          var randomBuff = potentialTargetBuffs[this.utilityService.getRandomInteger(0, potentialTargetBuffs.length - 1)];
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item !== randomBuff);
        }

        if (instantEffect.type === StatusEffectEnum.InstantTrueDamage) {
          var resetTarget: Character | undefined = target;
          if (abilityTargetedAllies && !instantEffect.targetsAllies) {
            resetTarget = this.getTarget(user, potentialTargets, TargetEnum.Random);
          }

          var allTargets: Character[] = [];
          if (instantEffect.isAoe) {
            allTargets = potentialTargets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Invulnerable));
          }
          else {
            if (resetTarget !== undefined)
              allTargets.push(resetTarget);
          }

          if (allTargets !== undefined && allTargets.length > 0) {
            allTargets.forEach(newTarget => {
              var totalHits = target.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.InstantTrueDamage && item.caster === instantEffect.caster).length;

              var trueDamageDealt = this.dealTrueDamage(isPartyUsing, newTarget, instantEffect.effectiveness, user, instantEffect.element, true);

              if (totalHits === 1) {
                var elementalText = "";
                if (instantEffect.element !== ElementalTypeEnum.None)
                  elementalText = this.getElementalDamageText(instantEffect.element);
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                }
              }
              else {
                totalTrueDamageDealt += trueDamageDealt;
                totalTrueDamageHitCount += 1;

                if (totalTrueDamageHitCount === totalHits) {
                  var elementalText = "";
                  if (instantEffect.element !== ElementalTypeEnum.None)
                    elementalText = this.getElementalDamageText(instantEffect.element);

                  var castEffect = instantEffect.caster + "'s effect";
                  if (castEffect === "'s effect")
                    castEffect = "a damaging effect";

                  var gameLogEntry = "<<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                  }
                }
              }
            });
          }

          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.InstantTrueDamage && item.caster === instantEffect.caster)); });
        }

        if (instantEffect.type === StatusEffectEnum.DebuffDurationIncrease) {
          if (target !== undefined && target.battleInfo.statusEffects.length > 0) {
            target.battleInfo.statusEffects.filter(item => item.duration > 0).forEach(effect => {
              effect.duration *= instantEffect.effectiveness;
            });
          }
        }

        if (instantEffect.type === StatusEffectEnum.InstantHpPercentDamage) {
          var resetTarget: Character | undefined = target;
          if (abilityTargetedAllies && !instantEffect.targetsAllies) {
            resetTarget = this.getTarget(user, potentialTargets, TargetEnum.Random);
          }

          var allTargets: Character[] = [];
          if (instantEffect.isAoe) {
            allTargets = potentialTargets;
          }
          else {
            if (resetTarget !== undefined)
              allTargets.push(resetTarget);
          }

          if (allTargets !== undefined && allTargets.length > 0) {
            allTargets.forEach(newTarget => {
              var totalHits = target.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.InstantHpPercentDamage && item.caster === instantEffect.caster).length;

              var effectiveness = newTarget.battleStats.maxHp * instantEffect.effectiveness;
              if (instantEffect.threshold !== undefined && instantEffect.threshold !== 1 && effectiveness > instantEffect.threshold)
                effectiveness = instantEffect.threshold;

              var trueDamageDealt = this.dealTrueDamage(isPartyUsing, newTarget, effectiveness, user, instantEffect.element, true);

              if (totalHits === 1) {
                var elementalText = "";
                if (instantEffect.element !== ElementalTypeEnum.None)
                  elementalText = this.getElementalDamageText(instantEffect.element);
                var gameLogEntry = "<strong>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                }
              }
              else {
                totalTrueDamageDealt += trueDamageDealt;
                totalTrueDamageHitCount += 1;

                if (totalTrueDamageHitCount === totalHits) {
                  var elementalText = "";
                  if (instantEffect.element !== ElementalTypeEnum.None)
                    elementalText = this.getElementalDamageText(instantEffect.element);

                  var castEffect = instantEffect.caster + "'s effect";
                  if (castEffect === "'s effect")
                    castEffect = "a damaging effect";

                  var gameLogEntry = "<<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                  }
                }
              }
            });
          }

          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.InstantHpPercentDamage && item.caster === instantEffect.caster)); });
        }

        if (instantEffect.type === StatusEffectEnum.InstantCurrentHpPercentDamage) {
          var resetTarget: Character | undefined = target;
          if (abilityTargetedAllies && !instantEffect.targetsAllies) {
            resetTarget = this.getTarget(user, potentialTargets, TargetEnum.Random);
          }

          var allTargets: Character[] = [];
          if (instantEffect.isAoe) {
            allTargets = potentialTargets;
          }
          else {
            if (resetTarget !== undefined)
              allTargets.push(resetTarget);
          }

          if (allTargets !== undefined && allTargets.length > 0) {
            allTargets.forEach(newTarget => {
              var totalHits = target.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.InstantCurrentHpPercentDamage && item.caster === instantEffect.caster).length;

              var effectiveness = newTarget.battleStats.currentHp * instantEffect.effectiveness;
              if (instantEffect.threshold !== undefined && instantEffect.threshold !== 1 && effectiveness > instantEffect.threshold)
                effectiveness = instantEffect.threshold;

              var trueDamageDealt = this.dealTrueDamage(isPartyUsing, newTarget, effectiveness, user, instantEffect.element, true);

              if (totalHits === 1) {
                var elementalText = "";
                if (instantEffect.element !== ElementalTypeEnum.None)
                  elementalText = this.getElementalDamageText(instantEffect.element);
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                }
              }
              else {
                totalTrueDamageDealt += trueDamageDealt;
                totalTrueDamageHitCount += 1;

                if (totalTrueDamageHitCount === totalHits) {
                  var elementalText = "";
                  if (instantEffect.element !== ElementalTypeEnum.None)
                    elementalText = this.getElementalDamageText(instantEffect.element);

                  var castEffect = instantEffect.caster + "'s effect";
                  if (castEffect === "'s effect")
                    castEffect = "a damaging effect";

                  var gameLogEntry = "<strong>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
                  }
                }
              }
            });
          }

          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.InstantHpPercentDamage && item.caster === instantEffect.caster)); });
        }

        if (instantEffect.type === StatusEffectEnum.InstantAutoAttack) {
          instantEffect.type = StatusEffectEnum.None; //because handleAutoAttack calls this method as well, need to prevent this from being recast         
          if (target !== undefined)
            this.handleAutoAttack(isPartyUsing, target, party, potentialTargets, instantEffect.effectiveness);
        }

        if (instantEffect.type === StatusEffectEnum.InstantCounter) {
          var originalAttacker = party.find(item => item.name === instantEffect.caster);
          if (originalAttacker !== undefined) {
            var targetedEnemy = originalAttacker;
            var counterDamageDealt = 0;
            var elementalText = "";
            var elementalType = this.checkUserForEnElement(target);

            //needed to use dues
            var abilityThatTriggeredCounter: Ability | undefined = undefined;
            var retribution = this.lookupService.characterHasAbility("Retribution", target);
            abilityThatTriggeredCounter = retribution;

            var disaster = this.lookupService.characterHasAbility("Natural Disaster", target);
            if (elementalType !== ElementalTypeEnum.None && disaster !== undefined && (target.battleInfo.elementsUsed === undefined || !target.battleInfo.elementsUsed.some(item => item === elementalType))) {
              if (target.battleInfo.elementsUsed === undefined)
                target.battleInfo.elementsUsed = [];

              target.battleInfo.elementsUsed.push(elementalType);
            }

            var abilityEffectiveness = instantEffect.effectiveness;

            if (elementalType !== ElementalTypeEnum.None)
              elementalText = this.getElementalDamageText(elementalType);
            var damageMultiplier = this.getDamageMultiplier(target, targetedEnemy, undefined, false, elementalType);
            var isCritical = this.isDamageCritical(target, targetedEnemy);
            counterDamageDealt = this.dealDamage(isPartyUsing, target, targetedEnemy, isCritical, abilityEffectiveness, damageMultiplier, abilityThatTriggeredCounter, elementalType);
            if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
              (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " counters for " + this.utilityService.bigNumberReducer(counterDamageDealt) + elementalText + " damage on <strong class='" + this.globalService.getCharacterColorClassText(targetedEnemy.type) + "'>" + targetedEnemy.name + "</strong>." + (isCritical ? " <strong>Critical hit!</strong>" : "");
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
            }
          }
        }
      });

      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => !item.isInstant);
      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.None);
    }
  }

  handlePostAbilityUseEffects(ability: Ability, user: Character) {
    if (ability.name === "Natural Disaster" && (user.name === "Hades" || (user.assignedGod1 === GodEnum.Hades || user.assignedGod2 === GodEnum.Hades))) {
      ability.userEffect = [];
    }
  }

  getRandomPrimaryStatDownStatusEffect(excludeHp: boolean = false) {
    var options = [];
    options.push(StatusEffectEnum.AgilityDown);
    options.push(StatusEffectEnum.AttackDown);
    options.push(StatusEffectEnum.ResistanceDown);
    if (!excludeHp)
      options.push(StatusEffectEnum.MaxHpDown);
    options.push(StatusEffectEnum.DefenseDown);
    options.push(StatusEffectEnum.LuckDown);
    var rng = this.utilityService.getRandomInteger(0, options.length - 1);

    return options[rng];
  }

  getRandomPrimaryStatUpStatusEffect(excludeHp: boolean = false) {
    var options = [];
    options.push(StatusEffectEnum.AgilityUp);
    options.push(StatusEffectEnum.AttackUp);
    options.push(StatusEffectEnum.ResistanceUp);
    if (!excludeHp)
      options.push(StatusEffectEnum.MaxHpUp);
    options.push(StatusEffectEnum.DefenseUp);
    options.push(StatusEffectEnum.LuckUp);
    var rng = this.utilityService.getRandomInteger(0, options.length - 1);

    return options[rng];
  }

  handleConditionalAbilityChanges(ability: Ability, user: Character, party: Character[]) {
    if (ability.name === "Loyal Arbiter" && ability.targetEffect.length > 0) {
      var effectiveness = .55;
      var remainingParty = party.filter(member => !member.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)).length;
      if (remainingParty === 2)
        effectiveness = .7;
      else if (remainingParty === 1)
        effectiveness = .85;

      ability.targetEffect[0].effectiveness = effectiveness;
    }
    if (ability.name === "Natural Disaster" && (user.name === "Hades" || (user.assignedGod1 === GodEnum.Hades || user.assignedGod2 === GodEnum.Hades))) {
      var elementsUsed = user.battleInfo.elementsUsed === undefined ? 0 : user.battleInfo.elementsUsed.length;
      user.battleInfo.elementsUsed = [];

      for (var i = 0; i < elementsUsed; i++) {
        ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      }
    }
  }

  getGodPermanentAbilityUpgrades(baseAbility?: Ability, user?: Character) {
    if (baseAbility === undefined || user === undefined)
      return undefined;

    var abilityFound = false;
    var permanentUpgrades: Ability | undefined = undefined;
    var godWithAbility: God | undefined = undefined;
    if (user.assignedGod1 !== undefined && user.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === user.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0) {
          abilityFound = god.abilityList.some(item => item.name === baseAbility.name);
          if (abilityFound)
            godWithAbility = god;
        }
      }
    }

    if (!abilityFound) {
      if (user.assignedGod2 !== undefined && user.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === user.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0) {
            abilityFound = god.abilityList.some(item => item.name === baseAbility.name);
            if (abilityFound)
              godWithAbility = god;
          }
        }
      }
    }

    if (abilityFound && godWithAbility !== undefined)
      var permanentUpgrades = godWithAbility.permanentAbilityUpgrades.find(item => item.requiredLevel === baseAbility.requiredLevel);

    return permanentUpgrades;
  }

  getAbilityEffectiveness(ability: Ability, effectivenessModifier: number, user: Character, isGodAbility: boolean = false) {
    var permanentEffectivenessIncrease = 0;

    if (isGodAbility) {
      var permanentAbilityUpgrades = this.getGodPermanentAbilityUpgrades(ability, user);
      if (permanentAbilityUpgrades !== undefined)
        permanentEffectivenessIncrease = permanentAbilityUpgrades.effectiveness;
    }

    var effectiveness = (ability.effectiveness + permanentEffectivenessIncrease) * effectivenessModifier;

    return effectiveness;
  }

  getDamageMultiplier(character: Character, target: Character, additionalDamageMultiplier?: number, isAutoAttack: boolean = false, elementalType: ElementalTypeEnum = ElementalTypeEnum.None, abilityName: string = "", isAoe: boolean = false) {
    var overallDamageMultiplier = 1;

    if (additionalDamageMultiplier !== undefined)
      overallDamageMultiplier *= additionalDamageMultiplier;

    var altarMultiplier = 1;
    if (isAutoAttack) {
      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAutoAttackUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAutoAttackUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesRareAutoAttackUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesRareAutoAttackUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }
    }

    var aoeIncrease = 1;
    if (isAoe) {
      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesAoeDamageUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesAoeDamageUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesRareAoeDamageUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesRareAoeDamageUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (character.battleStats.aoeDamage > 0)
        aoeIncrease = 1 + character.battleStats.aoeDamage;

      if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
        var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AoeDamageUp);

        if (relevantStatusEffects.length > 0) {
          relevantStatusEffects.forEach(effect => {
            if (effect.type === StatusEffectEnum.AoeDamageUp) {
              aoeIncrease *= effect.effectiveness;
            }
          });
        }
      }
    }

    if (elementalType === ElementalTypeEnum.Holy && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaRareHolyDamageIncrease) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaRareHolyDamageIncrease);
      altarMultiplier *= relevantAltarEffect!.effectiveness;
    }

    if (elementalType === ElementalTypeEnum.Lightning && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusLightningDamageIncrease) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusLightningDamageIncrease);
      altarMultiplier *= relevantAltarEffect!.effectiveness;
    }

    if (elementalType === ElementalTypeEnum.Lightning && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusRareLightningDamageIncrease) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusRareLightningDamageIncrease);
      altarMultiplier *= relevantAltarEffect!.effectiveness;
    }

    //check for basic damage up/down buffs
    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var damageDealtUpAggregate = 1;

      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageDealtDown ||
        effect.type === StatusEffectEnum.DamageDealtUp ||
        (elementalType === ElementalTypeEnum.Holy && (effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageDown)) ||
        (elementalType === ElementalTypeEnum.Fire && (effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageDown)) ||
        (elementalType === ElementalTypeEnum.Lightning && (effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageDown)) ||
        (elementalType === ElementalTypeEnum.Air && (effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageDown)) ||
        (elementalType === ElementalTypeEnum.Water && (effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageDown)) ||
        (elementalType === ElementalTypeEnum.Earth && (effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageDown)));

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.effectiveness > 1)
            damageDealtUpAggregate += effect.effectiveness - 1;
          else if (effect.effectiveness < 1)
            damageDealtUpAggregate -= 1 - effect.effectiveness;
        });
      }

      overallDamageMultiplier *= damageDealtUpAggregate;
    }

    var surge = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Surge);
    if (surge !== undefined && !isAutoAttack) {
      overallDamageMultiplier *= surge.effectiveness;
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Surge);
    }

    if (target.battleInfo !== undefined && target.battleInfo.statusEffects.length > 0) {
      var damageTakenAggregate = 1;

      var relevantStatusEffects = target.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageTakenDown ||
        effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.Retribution || effect.type === StatusEffectEnum.DivineProtection ||
        (elementalType === ElementalTypeEnum.Holy && (effect.type === StatusEffectEnum.HolyDamageTakenUp || effect.type === StatusEffectEnum.HolyDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Fire && (effect.type === StatusEffectEnum.FireDamageTakenUp || effect.type === StatusEffectEnum.FireDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Lightning && (effect.type === StatusEffectEnum.LightningDamageTakenUp || effect.type === StatusEffectEnum.LightningDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Air && (effect.type === StatusEffectEnum.AirDamageTakenUp || effect.type === StatusEffectEnum.AirDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Water && (effect.type === StatusEffectEnum.WaterDamageTakenUp || effect.type === StatusEffectEnum.WaterDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Earth && (effect.type === StatusEffectEnum.EarthDamageTakenUp || effect.type === StatusEffectEnum.EarthDamageTakenDown)));

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.effectiveness > 1)
            damageTakenAggregate += effect.effectiveness - 1;
          else if (effect.effectiveness < 1)
            damageTakenAggregate -= 1 - effect.effectiveness;
        });
      }

      overallDamageMultiplier *= damageTakenAggregate;
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

    //check for thyrsus
    var thyrsusDamageIncrease = 1;
    if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Thyrsus)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thyrsus)!;
      thyrsusDamageIncrease = effect.effectiveness;
    }

    //Minos ability Final Judgment
    var enemySpecificAbilityIncrease = 1;
    if (abilityName === "Final Judgment") {
      var enemies = this.battle.currentEnemies.enemyList;
      enemySpecificAbilityIncrease = enemies.filter(item => !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).length;
    }

    //Shade of Hypnos ability Dreameater
    var enemySpecificAbilityIncrease = 1;
    if (abilityName === "Dreameater") {
      var dreameaterMultiplierAmount = .2;
      enemySpecificAbilityIncrease += dreameaterMultiplierAmount * target.battleInfo.statusEffects.filter(item => !item.isPositive).length;
    }

    //console.log("DMG: " + overallDamageMultiplier + " * " + thousandCutsDamageIncrease + " * " + markDamageIncrease + " * " + thyrsusDamageIncrease + " * " + enemySpecificAbilityIncrease + " * " + altarMultiplier + " * " + aoeIncrease + " = " + (overallDamageMultiplier * thousandCutsDamageIncrease * markDamageIncrease * thyrsusDamageIncrease * enemySpecificAbilityIncrease * altarMultiplier * aoeIncrease));
    return overallDamageMultiplier * thousandCutsDamageIncrease * markDamageIncrease * thyrsusDamageIncrease * enemySpecificAbilityIncrease * altarMultiplier * aoeIncrease;
  }

  applyStatusEffect(appliedStatusEffect: StatusEffect, target: Character, potentialTargets?: Character[], castingCharacter?: Character, originalAbility?: Ability) {
    var permanentAbilityUpgrades = this.getGodPermanentAbilityUpgrades(originalAbility, castingCharacter);
    if (originalAbility !== undefined && permanentAbilityUpgrades !== undefined) {
      if (permanentAbilityUpgrades.userEffect !== undefined && permanentAbilityUpgrades.userEffect.length > 0) {
        appliedStatusEffect.effectiveness += permanentAbilityUpgrades.userEffect[0].effectiveness;
        appliedStatusEffect.duration += permanentAbilityUpgrades.userEffect[0].duration;
      }
      if (permanentAbilityUpgrades.targetEffect !== undefined && permanentAbilityUpgrades.targetEffect.length > 0) {
        appliedStatusEffect.effectiveness += permanentAbilityUpgrades.targetEffect[0].effectiveness;
        appliedStatusEffect.duration += permanentAbilityUpgrades.targetEffect[0].duration;
      }
    }

    if (appliedStatusEffect.isPositive &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (appliedStatusEffect.isPositive &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareBuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareBuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (!appliedStatusEffect.isPositive &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareDebuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareDebuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (!appliedStatusEffect.isPositive && castingCharacter !== undefined &&
      castingCharacter.battleStats.debuffDuration > 0) {
      appliedStatusEffect.duration *= 1 + castingCharacter.battleStats.debuffDuration;
    }

    if (castingCharacter !== undefined && castingCharacter.battleStats.tickFrequency > 0 && appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
      appliedStatusEffect.tickFrequency *= (1 - castingCharacter.battleStats.tickFrequency);
    }

    //this is used by Melampus from the Forgotten Kings trial
    var blessingOfDionysus = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlessingOfDionysus);
    if (blessingOfDionysus !== undefined && !appliedStatusEffect.isPositive && appliedStatusEffect.duration > 0 && !appliedStatusEffect.isInstant) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= blessingOfDionysus.effectiveness) //status effect not applied
      {
        if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " avoids the status effect due to their blessing from Dionysus.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }

        return;
      }
    }

    if (appliedStatusEffect.type === StatusEffectEnum.Retribution && originalAbility !== undefined) {
      appliedStatusEffect.count = originalAbility.maxCount;
    }

    if (appliedStatusEffect.isAoe && potentialTargets !== undefined) {
      potentialTargets.forEach(enemy => {
        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.EnemyMaxHpPercent)
            appliedStatusEffect.effectiveness = appliedStatusEffect.effectiveness * this.lookupService.getAdjustedMaxHp(enemy, false);
        }

        var existingApplication = enemy.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (existingApplication !== undefined) {
          if (appliedStatusEffect.effectStacks && (appliedStatusEffect.maxCount === 0 || existingApplication.stackCount < appliedStatusEffect.maxCount)) {
            existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
            existingApplication.stackCount += 1;
          }

          if (this.globalService.doesStatusEffectRefresh(appliedStatusEffect.type)) {
            if (existingApplication.stackCount > 1 || appliedStatusEffect.effectiveness === existingApplication.effectiveness) {
              if (appliedStatusEffect.duration > existingApplication.duration)
                existingApplication.duration = appliedStatusEffect.duration;
            }
            else if (appliedStatusEffect.effectiveness > existingApplication.effectiveness) {
              existingApplication.duration = appliedStatusEffect.duration;
              existingApplication.effectiveness = appliedStatusEffect.effectiveness;
            }
          }
          else if (this.globalService.doesStatusEffectDurationStack(appliedStatusEffect.type)) {
            existingApplication.duration += appliedStatusEffect.duration;
          }
          else
            enemy.battleInfo.statusEffects.push(this.globalService.makeStatusEffectCopy(appliedStatusEffect));
        }
        else
          enemy.battleInfo.statusEffects.push(this.globalService.makeStatusEffectCopy(appliedStatusEffect));
      });
    }
    else {
      if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
        if (appliedStatusEffect.dotType === dotTypeEnum.EnemyMaxHpPercent)
          appliedStatusEffect.effectiveness = appliedStatusEffect.effectiveness * this.lookupService.getAdjustedMaxHp(target, false);
      }

      var existingApplication = target.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
      if (existingApplication !== undefined) {
        if (appliedStatusEffect.effectStacks && (appliedStatusEffect.maxCount === 0 || existingApplication.stackCount < appliedStatusEffect.maxCount)) {
          existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
          existingApplication.stackCount += 1;
        }

        if (this.globalService.doesStatusEffectRefresh(appliedStatusEffect.type)) {
          if (originalAbility !== undefined && originalAbility.name === "Insanity") {
            existingApplication.duration += appliedStatusEffect.duration;
          }
          else {
            if (existingApplication.stackCount > 1 || appliedStatusEffect.effectiveness === existingApplication.effectiveness) {
              if (appliedStatusEffect.duration > existingApplication.duration)
                existingApplication.duration = appliedStatusEffect.duration;
            }
            else if (appliedStatusEffect.effectiveness > existingApplication.effectiveness) {
              existingApplication.duration = appliedStatusEffect.duration;
              existingApplication.effectiveness = appliedStatusEffect.effectiveness;
            }
          }
        }
        else if (this.globalService.doesStatusEffectDurationStack(appliedStatusEffect.type)) {
          existingApplication.duration += appliedStatusEffect.duration;
        }
        else
          target.battleInfo.statusEffects.push(this.globalService.makeStatusEffectCopy(appliedStatusEffect));
      }
      else {
        target.battleInfo.statusEffects.push(this.globalService.makeStatusEffectCopy(appliedStatusEffect));
      }
    }
  }

  getTarget(user: Character, targets: Character[], targetType: TargetEnum = TargetEnum.Random) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Untargetable));
    if (potentialTargets.length === 0)
      return undefined;

    var target = potentialTargets[0];

    if (user.targeting !== undefined && targetType !== TargetEnum.LowestHpPercent && targetType !== TargetEnum.ForcedRandom && potentialTargets.some(item => item === user.targeting)) {
      target = user.targeting;

      var chainsOfFateAttacker = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
      potentialTargets.forEach(item => {
        var chainsOfFateEnemy = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
        var focus = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Focus);

        //messenger takes priority
        if (chainsOfFateEnemy !== undefined && chainsOfFateAttacker !== undefined)
          target = item;
        else if (focus !== undefined)
          target = item;
      });
    }
    else {
      if (targetType === TargetEnum.Random || targetType === TargetEnum.ForcedRandom) {
        target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];

        var chainsOfFateAttacker = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
        //override target and target whoever you are focused on. might need to expand this beyond random target type
        potentialTargets.forEach(item => {
          var chainsOfFateEnemy = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
          var focus = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Focus);

          //messenger takes priority
          if (chainsOfFateEnemy !== undefined && chainsOfFateAttacker !== undefined)
            target = item;
          else if (focus !== undefined)
            target = item;
        });
      }
      else if (targetType === TargetEnum.LowestHpPercent) {
        potentialTargets = potentialTargets.sort(function (a, b) {
          return a.battleStats.getHpPercent() > b.battleStats.getHpPercent() ? 1 :
            a.battleStats.getHpPercent() < b.battleStats.getHpPercent() ? -1 : 0;
        });
        target = potentialTargets[0];
      }
      else if (targetType === TargetEnum.Self) {
        target = user;
      }
    }

    var taunted = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Taunt);
    if (taunted !== undefined && targetType !== TargetEnum.ForcedRandom && targetType !== TargetEnum.LowestHpPercent) {
      var tauntCaster = targets.find(caster => caster.name === taunted!.caster);
      if (tauntCaster !== undefined && !tauntCaster.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
        target = tauntCaster;
      }
    }

    //messenger takes priority
    var chainsOfFate = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
    if (chainsOfFate !== undefined && targetType !== TargetEnum.ForcedRandom && targetType !== TargetEnum.LowestHpPercent) {
      var caster = targets.find(caster => caster.name === chainsOfFate!.caster);
      if (caster !== undefined && !caster.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
        target = caster;
      }
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

    //var adjustedAttack = this.lookupService.getAdjustedAttack(attacker, ability, isPartyAttacking);
    var adjustedAttack = attacker.battleStats.attack;

    if (ability !== undefined && ability.name === "Shield Slam") {
      adjustedAttack += this.lookupService.getAdjustedDefense(attacker) * ability.secondaryEffectiveness;
    }

    var adjustedAttackModifier = this.lookupService.getAdjustedAttackModifier(attacker, ability, isPartyAttacking);
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

    var elementIncrease = 1;
    var elementalDamageDecrease = 1;
    if (elementalType !== ElementalTypeEnum.None) {
      elementIncrease = this.getElementalDamageIncrease(elementalType, attacker);
      elementalDamageDecrease = this.getElementalDamageDecrease(elementalType, target, attacker);
      attacker.overdriveInfo.lastUsedElement = elementalType;
      //attacker.trackedStats.elementalAttacksUsed.incrementStatByEnum(elementalType);      
    }

    adjustedDefense *= 3;

    //separate out multipliers to attack from the exponent or things get too wild
    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * adjustedCriticalMultiplier
      * elementIncrease * elementalDamageDecrease
      * Math.ceil((adjustedAttackModifier * Math.pow(adjustedAttack, 2)) / (adjustedAttack + adjustedDefense)));

    //console.log(attacker.name + ": " + damageMultiplier + " * " + abilityDamageMultiplier + " * " + adjustedCriticalMultiplier + " * " + elementIncrease
    //  + " * " + elementalDamageDecrease + " * Math.ceil((" + adjustedAttackModifier + " * " + adjustedAttack + " ^2) / (" + adjustedAttack + " + " + adjustedDefense + " ) = " + damage);

    var dispenserOfDuesEffect = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
    if (dispenserOfDuesEffect !== undefined && ability !== undefined) {
      damage += dispenserOfDuesEffect.effectiveness;
      if (!ability?.userEffect.some(item => item.type === StatusEffectEnum.KeepDues)) {
        dispenserOfDuesEffect.effectiveness = 0;
      }
    }

    if (ability?.damageModifierRange !== undefined) {
      var rng = this.utilityService.getRandomNumber(1 - ability.damageModifierRange, 1 + ability.damageModifierRange);
      damage = Math.round(damage * rng);
    }

    var reduceDamage = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceDirectDamage);
    if (reduceDamage !== undefined)
      damage -= reduceDamage.effectiveness;

    if (damage < 0)
      damage = 0;

    var totalDamageDealt = damage;

    //could probably make a unique ability check method
    var foresight = this.lookupService.characterHasAbility("Foresight", target);
    if (foresight !== undefined) { //This is assumed to be used by Helenus from Forgotten Kings trial
      var barrierAmount = Math.round(foresight.userEffect[0].effectiveness * this.lookupService.getAdjustedAttack(target, undefined, !isPartyAttacking));

      if (target.battleInfo.barrierValue < target.battleStats.maxHp * foresight.userEffect[0].threshold) {
        target.battleInfo.barrierValue += barrierAmount;

        //if you went over threshold, set it back down 
        if (target.battleInfo.barrierValue > target.battleStats.maxHp * foresight.userEffect[0].threshold) {
          target.battleInfo.barrierValue = Math.round(target.battleStats.maxHp * foresight.userEffect[0].threshold);
        }

        if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " uses " + foresight.name + ", giving herself a barrier of " + this.utilityService.bigNumberReducer(barrierAmount) + " HP before being attacked.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
      }
    }


    target.trackedStats.damageTaken += totalDamageDealt;

    var retributionEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Retribution);
    if (retributionEffect !== undefined) {
      var retribution = this.lookupService.characterHasAbility("Retribution", target);
      if (retribution !== undefined) {
        //ability.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, retribution.effectiveness, true, true, true, attacker.name));
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, retribution.effectiveness, true, true, true, attacker.name), target, undefined, attacker);
        retributionEffect.count -= 1;

        if (retributionEffect.count <= 0)
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Retribution);
      }
    }

    var dispenserOfDuesEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
    if (dispenserOfDuesEffect !== undefined) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", target);
      if (dispenserOfDues !== undefined) {
        dispenserOfDuesEffect.effectiveness += Math.round(totalDamageDealt * dispenserOfDues.effectiveness);

        if (dispenserOfDuesEffect.effectiveness > target.battleStats.maxHp * 3)
          dispenserOfDuesEffect.effectiveness = target.battleStats.maxHp * 3;
      }
    }

    var immobilizeEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.CastingImmobilize);
    if (immobilizeEffect !== undefined) {
      immobilizeEffect.count += totalDamageDealt;

      if (immobilizeEffect.count > immobilizeEffect.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.CastingImmobilize);
        if (isPartyAttacking) {
          this.globalService.getActivePartyCharacters(true).forEach(character => {
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Immobilize);
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageOverTime && item.abilityName !== "Strangle");
          });
        }
        immobilizeEffect.count = 0;
      }
    }


    target.trackedStats.damagingHitsTaken += 1;
    if (target.trackedStats.damagingHitsTaken >= this.utilityService.overdriveHitsNeededToUnlockReprisal &&
      !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Reprisal))
      target.unlockedOverdrives.push(OverdriveNameEnum.Reprisal);

    if (isCritical) {
      attacker.trackedStats.criticalsDealt += 1;

      if (attacker.overdriveInfo.isActive && attacker.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Bullseye) {
        if (target.overdriveInfo.criticalDamageTaken.some(item => item[0] === attacker.type)) {
          target.overdriveInfo.criticalDamageTaken.find(item => item[0] === attacker.type)![1] += totalDamageDealt * .5;
        }
        else {
          target.overdriveInfo.criticalDamageTaken.push([attacker.type, totalDamageDealt * .5]);
        }
      }
    }
    if (attacker.trackedStats.criticalsDealt >= this.utilityService.overdriveCriticalsNeededToUnlockBullseye &&
      !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Bullseye))
      attacker.unlockedOverdrives.push(OverdriveNameEnum.Bullseye);

    if (target.trackedStats.damageTaken >= this.utilityService.overdriveDamageNeededToUnlockProtection &&
      !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Protection))
      target.unlockedOverdrives.push(OverdriveNameEnum.Protection);
    if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection)
      target.overdriveInfo.damageTaken += totalDamageDealt;

    if (elementalType !== ElementalTypeEnum.None) {
      attacker.trackedStats.elementalDamageDealt += totalDamageDealt;
      if (attacker.trackedStats.elementalDamageDealt >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    if (target.level >= this.utilityService.characterOverdriveLevel) {
      target.overdriveInfo.gaugeAmount += target.overdriveInfo.gainPerBeingAttacked * this.lookupService.getOverdriveGainMultiplier(target);
      if (target.overdriveInfo.gaugeAmount > target.overdriveInfo.gaugeTotal)
        target.overdriveInfo.gaugeAmount = target.overdriveInfo.gaugeTotal;
    }

    var matchingAbsorption = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AbsorbElementalDamage && item.element === elementalType)
    if (matchingAbsorption !== undefined) {
      if (matchingAbsorption.effectiveness > 0) {
        matchingAbsorption.effectiveness -= damage;
        damage = 0;

        if (matchingAbsorption.effectiveness < 0) {
          //deal remaining damage to hp
          damage = -matchingAbsorption.effectiveness;
          matchingAbsorption.effectiveness = 0;
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item !== matchingAbsorption);
        }
      }
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

    var isDefeated = this.isCharacterDefeated(target);

    if (isDefeated && (attacker.assignedGod1 === GodEnum.Hades || attacker.assignedGod2 === GodEnum.Hades)) {
      var lordOfTheUnderworld = this.lookupService.characterHasAbility("Lord of the Underworld", attacker);

      if (lordOfTheUnderworld !== undefined) {
        var copy = this.globalService.makeStatusEffectCopy(lordOfTheUnderworld.userEffect[0]);
        var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
        if (hades !== undefined) {
          var lordOfTheUnderworldUpgrade = hades.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (lordOfTheUnderworldUpgrade !== undefined && lordOfTheUnderworldUpgrade.userEffect.length > 0)
            copy.effectiveness += lordOfTheUnderworldUpgrade.userEffect[0].effectiveness;
        }

        this.applyStatusEffect(copy, attacker);
      }
    }

    if (target.name === "Geryon") {
      var damageTakenEffect = target.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.DamageTakenDown);
      if (damageTakenEffect !== undefined) {
        if (target.battleStats.currentHp <= target.battleStats.maxHp * .25) {
          damageTakenEffect.effectiveness = .25;
        }
        else if (target.battleStats.currentHp <= target.battleStats.maxHp * .5) {
          damageTakenEffect.effectiveness = .5;
        }
      }

      var damageOverTimeTakenEffect = target.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.DamageOverTimeTakenDown);
      if (damageOverTimeTakenEffect !== undefined) {
        if (target.battleStats.currentHp <= target.battleStats.maxHp * .25) {
          damageOverTimeTakenEffect.effectiveness = .25;
        }
        else if (target.battleStats.currentHp <= target.battleStats.maxHp * .5) {
          damageOverTimeTakenEffect.effectiveness = .5;
        }
      }
    }

    return totalDamageDealt;
  }

  //DoTs
  dealTrueDamage(isPartyAttacking: boolean, target: Character, damage: number, attacker?: Character, elementalType: ElementalTypeEnum = ElementalTypeEnum.None, isReducable: boolean = true, isDamageOverTime: boolean = false) {
    if (damage < 0)
      damage = 0;

    var elementIncrease = 1;
    var elementalDamageDecrease = 1;
    var bloodlustDamageBonus = 1;
    var statusEffectDamageBonus = 1;
    var statusEffectDamageReduction = 1;
    if (elementalType !== ElementalTypeEnum.None) {
      elementalDamageDecrease = this.getElementalDamageDecrease(elementalType, target, attacker);
    }

    if (attacker !== undefined) {
      elementIncrease = this.getElementalDamageIncrease(elementalType, attacker);
      attacker.overdriveInfo.lastUsedElement = elementalType;
      attacker.trackedStats.elementalAttacksUsed.incrementStatByEnum(elementalType);
      if (attacker.trackedStats.elementalAttacksUsed.getCountOfNonZeroElements() >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    var bloodlust = this.lookupService.characterHasAbility("Bloodlust", this.globalService.getActivePartyCharacters(true)[0]);
    if (bloodlust === undefined && this.globalService.getActivePartyCharacters(true).length > 1)
      bloodlust = this.lookupService.characterHasAbility("Bloodlust", this.globalService.getActivePartyCharacters(true)[1]);

    if (attacker !== undefined &&
      attacker.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DamageOverTimeDamageUp)) {
      var effect = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageOverTimeDamageUp)!;
      statusEffectDamageBonus = effect.effectiveness;
    }

    if (target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DamageOverTimeTakenDown)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageOverTimeTakenDown)!;
      statusEffectDamageReduction = effect.effectiveness;
    }

    if (target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DivineProtection)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DivineProtection)!;
      statusEffectDamageReduction = effect.effectiveness;
    }

    if (isDamageOverTime && bloodlust !== undefined && this.battle !== undefined && this.battle.currentEnemies !== undefined) {
      var totalDots = 0;
      this.battle.currentEnemies.enemyList.forEach(enemy => {
        totalDots += enemy.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.DamageOverTime).length;
      })

      if (totalDots > bloodlust.maxCount)
        totalDots = bloodlust.maxCount;

      bloodlustDamageBonus += totalDots * bloodlust.effectiveness;
    }

    var altarIncrease = 1;
    if (isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage);
      altarIncrease *= relevantAltarEffect!.effectiveness;
    }

    var totalDamageDealt = damage * elementIncrease * elementalDamageDecrease * bloodlustDamageBonus * altarIncrease * statusEffectDamageBonus * statusEffectDamageReduction;

    if (target !== undefined) {
      var reduceDamage = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceDirectDamage);
      if (reduceDamage !== undefined && isReducable)
        totalDamageDealt -= reduceDamage.effectiveness;
    }

    if (totalDamageDealt < 0)
      totalDamageDealt = 0;

    target.trackedStats.damageTaken += totalDamageDealt;
    if (target.trackedStats.damageTaken >= this.utilityService.overdriveDamageNeededToUnlockProtection &&
      !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Protection))
      target.unlockedOverdrives.push(OverdriveNameEnum.Protection);
    if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection)
      target.overdriveInfo.damageTaken += totalDamageDealt;

    if (attacker !== undefined && elementalType !== ElementalTypeEnum.None) {
      attacker.trackedStats.elementalDamageDealt += totalDamageDealt;
      if (attacker.trackedStats.elementalDamageDealt >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    if (target.level >= this.utilityService.characterOverdriveLevel) {
      target.overdriveInfo.gaugeAmount += target.overdriveInfo.gainPerBeingAttacked * this.lookupService.getOverdriveGainMultiplier(target);
      if (target.overdriveInfo.gaugeAmount > target.overdriveInfo.gaugeTotal)
        target.overdriveInfo.gaugeAmount = target.overdriveInfo.gaugeTotal;
    }

    if (target !== undefined) {
      var matchingAbsorption = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AbsorbElementalDamage && item.element === elementalType)
      if (matchingAbsorption !== undefined) {
        if (matchingAbsorption.effectiveness > 0) {
          matchingAbsorption.effectiveness -= damage;
          damage = 0;

          if (matchingAbsorption.effectiveness < 0) {
            //deal remaining damage to hp
            damage = -matchingAbsorption.effectiveness;
            matchingAbsorption.effectiveness = 0;
            target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item !== matchingAbsorption);
          }
        }
      }
    }

    var actualDamageDealt = totalDamageDealt; //otherwise you return a reduced value from barrier
    if (target !== undefined && target.battleInfo.barrierValue > 0) {
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

    return actualDamageDealt;
  }

  getElementalDamageIncrease(element: ElementalTypeEnum, attacker: Character) {
    var increase = 0;

    if (element === ElementalTypeEnum.Holy)
      increase = attacker.battleStats.elementIncrease.holy;
    if (element === ElementalTypeEnum.Fire)
      increase = attacker.battleStats.elementIncrease.fire;
    if (element === ElementalTypeEnum.Lightning)
      increase = attacker.battleStats.elementIncrease.lightning;
    if (element === ElementalTypeEnum.Air)
      increase = attacker.battleStats.elementIncrease.air;
    if (element === ElementalTypeEnum.Water)
      increase = attacker.battleStats.elementIncrease.water;
    if (element === ElementalTypeEnum.Earth)
      increase = attacker.battleStats.elementIncrease.earth;

    var altarIncrease = 1;
    if (attacker.type !== CharacterEnum.None && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesEarthDamageUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesEarthDamageUp);
      altarIncrease = relevantAltarEffect!.effectiveness;
    }
    if (attacker.type !== CharacterEnum.None && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesFireDamageUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesFireDamageUp);
      altarIncrease = relevantAltarEffect!.effectiveness;
    }
    if (attacker.type !== CharacterEnum.None && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesRareElementalDamageUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesRareElementalDamageUp);
      altarIncrease = relevantAltarEffect!.effectiveness;
    }

    return 1 + (increase * altarIncrease);
  }

  getElementalDamageDecrease(element: ElementalTypeEnum, target: Character, attacker?: Character) {
    var decrease = 0;
    var elementalReduction = 0;

    var resistanceDown = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AllElementalResistanceDown)
    if (resistanceDown !== undefined) {
      elementalReduction += resistanceDown.effectiveness;
    }

    if (attacker !== undefined)
      elementalReduction -= attacker.battleStats.elementResistanceReduction;

    if (element === ElementalTypeEnum.Holy)
      decrease = target.battleStats.elementResistance.holy + elementalReduction;
    if (element === ElementalTypeEnum.Fire)
      decrease = target.battleStats.elementResistance.fire + elementalReduction;
    if (element === ElementalTypeEnum.Lightning)
      decrease = target.battleStats.elementResistance.lightning + elementalReduction;
    if (element === ElementalTypeEnum.Air)
      decrease = target.battleStats.elementResistance.air + elementalReduction;
    if (element === ElementalTypeEnum.Water)
      decrease = target.battleStats.elementResistance.water + elementalReduction;
    if (element === ElementalTypeEnum.Earth)
      decrease = target.battleStats.elementResistance.earth + elementalReduction;

    return 1 - decrease;
  }

  //check for upper limits and any weird logic
  gainHp(character: Character, healAmount: number) {
    var healModifier = 1;

    if (character.battleStats.healingReceived > 0)
      healModifier = 1 + character.battleStats.healingReceived;

    var reduceHealingDebuff = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceHealing);
    if (reduceHealingDebuff !== undefined)
      healModifier *= reduceHealingDebuff.effectiveness;

    healAmount = healAmount * healModifier;

    character.battleStats.currentHp += healAmount;

    if (Math.ceil(character.battleStats.currentHp) > Math.ceil(this.lookupService.getAdjustedMaxHp(character, true))) {
      healAmount -= character.battleStats.currentHp - this.lookupService.getAdjustedMaxHp(character, true);
      character.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(character, true);
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
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => this.globalService.doesStatusEffectPersistDeath(item.type));
      if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        character.battleInfo.statusEffects.push(new StatusEffect(StatusEffectEnum.Dead));

        character.battleInfo.autoAttackTimer = 0;
        character.overdriveInfo.gaugeAmount = 0;

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

        var lastBreath = this.lookupService.characterHasAbility("Last Breath", character);
        if (lastBreath !== undefined) //this is assumed to be Cassandra from Forgotten Kings Trial
        {
          var teammate = this.battle.currentEnemies.enemyList.find(item => item.battleInfo.statusEffects.find(item => item.type !== StatusEffectEnum.Dead));
          if (teammate !== undefined) {
            this.gainHp(teammate, teammate.battleStats.maxHp / 2);
          }
        }

        var dyingWish = this.lookupService.characterHasAbility("Dying Wish", character);
        if (dyingWish !== undefined) //this is assumed to be Helenus from Forgotten Kings Trial
        {
          var teammate = this.battle.currentEnemies.enemyList.find(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
          if (teammate !== undefined) {
            this.applyStatusEffect(dyingWish.userEffect[0], teammate, undefined);
          }
        }

        if (character.name === "Ladon") {
          this.globalService.getActivePartyCharacters(true).forEach(character => {
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Immobilize);
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageOverTime && item.abilityName !== "Strangle");
          });
        }

        if (character.name.includes("Hydra Head")) //this is assumed to be Lernean Hydra
        {
          var teammate = this.battle.currentEnemies.enemyList.find(item => item.bestiaryType === BestiaryEnum.HydraHead && !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
          if (teammate === undefined) {
            var mainHead = this.battle.currentEnemies.enemyList.find(item => item.bestiaryType === BestiaryEnum.LerneanHydra);
            if (mainHead !== undefined)
              mainHead.battleInfo.statusEffects = mainHead.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Invulnerable);
          }
        }

        var khalkotauroiFury = this.lookupService.characterHasAbility("Khalkotauroi Fury", character);
        if (khalkotauroiFury !== undefined) //this is assumed to be Khalkotauroi from Reinforcements from Aeetes
        {
          khalkotauroiFury = khalkotauroiFury.makeCopy();
          var teammate = this.battle.currentEnemies.enemyList.find(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
          if (teammate !== undefined) {
            var party = this.globalService.getActivePartyCharacters(true);
            var potentialTargets = party.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
            var target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
            //khalkotauroiFury.targetEffect[0].effectiveness = this.lookupService.getAdjustedAttack(character, undefined, false) * khalkotauroiFury.targetEffect[0].effectiveness;
            this.applyStatusEffect(khalkotauroiFury.targetEffect[0], target, undefined);

            if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, "With one final angry snarl, <strong>" + character.name + "</strong> uses Khalkotauroi Fury on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>.");
            }
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
    var enemiesDefeated = false;

    if (this.areCharactersDefeated(party)) {
      stateChanged = true;
      this.handlePartyDefeat(party);
    }

    if (this.areCharactersDefeated(enemies)) {
      stateChanged = true;
      enemiesDefeated = true;
      this.moveToNextBattle();
    }

    if (stateChanged) {
      this.battle.battleDuration = 0;
      this.checkForOptionalScene();
      this.checkScene();
      this.checkBreakpoints();
    }

    if (enemiesDefeated && !this.globalService.globalVar.activeBattle.atScene) {
      var subZone = this.balladService.getActiveSubZone();
      var autoProgress = this.globalService.globalVar.settings.get("autoProgress") ?? false;

      if (autoProgress && (this.balladService.autoProgressShouldChangeSubZone(subZone) || this.balladService.isSubzoneTown(subZone.type))) {
        this.balladService.selectNextSubzone();
      }
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
    if (this.globalService.globalVar.settings.get("autoProgressRemoveOnDeath"))
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

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You have been defeated in the Coliseum. You finished in round " + this.battle.activeTournament.currentRound + (this.battle.activeTournament.maxRounds !== -1 ? " of " + this.battle.activeTournament.maxRounds : "") + ".");
      this.globalService.handleColiseumLoss(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
      this.battle.activeTournament = this.globalService.setNewTournament(this.battle.activeTournament.type === ColiseumTournamentEnum.WeeklyMelee);
    }
    else if (underworld !== undefined && underworld.isAvailable) {
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

            if (subzone.type === SubZoneEnum.NemeaCountryRoadsOne)
              subzone.isAvailable = false;
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
    if (subZone.fastestCompletion === undefined || this.battle.battleDuration < subZone.fastestCompletion) {
      subZone.fastestCompletion = this.utilityService.roundTo(this.battle.battleDuration, 5);
    }

    var achievements = this.achievementService.checkForSubzoneAchievement(subZone.type, this.globalService.globalVar.achievements);

    if (achievements !== undefined && achievements.length > 0) {
      this.addAchievementToGameLog(achievements);
    }

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.WeeklyMelee) { //don't get xp/coins/items until you finish the melee
      if (this.globalService.globalVar.gameLogSettings.get("battleXpRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + this.lookupService.getTotalXpGainFromEnemyTeam(this.battle.currentEnemies.enemyList).toLocaleString() + " XP</strong>.");
      }

      this.battle.currentEnemies.enemyList.forEach(enemy => {
        this.dpsCalculatorService.addXpGain(enemy.xpGainFromDefeat);
      });

      this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies);
      this.updateEnemyDefeatCount(this.battle.currentEnemies);

      var loot = this.getLoot(this.battle.currentEnemies);
      this.getCoinRewards(this.battle.currentEnemies);
      if (loot !== undefined && loot.length > 0) {
        loot.forEach(item => {
          var itemCopy = this.lookupService.makeResourceCopy(item);
          if (this.globalService.globalVar.gameLogSettings.get("battleItemsRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCopy.amount + " " + (itemCopy.amount === 1 ? this.dictionaryService.getItemName(itemCopy.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(itemCopy.item))) + "</strong>.");
          }

          this.lookupService.addLootToLog(itemCopy.item, itemCopy.amount, subZone.type);
          if (itemCopy.item === ItemsEnum.FocusPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.FocusPotion);
          }
          else if (itemCopy.item === ItemsEnum.PotentConcoctionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.PotentConcoction);
          }
          else if (itemCopy.item === ItemsEnum.GoldenApple && this.globalService.globalVar.sidequestData.goldenApplesObtained <= 25) {
            this.globalService.globalVar.sidequestData.goldenApplesObtained += item.amount;
            var difference = 0;
            if (this.globalService.globalVar.sidequestData.goldenApplesObtained > 25) {
              difference = this.globalService.globalVar.sidequestData.goldenApplesObtained - 25;
              this.globalService.globalVar.sidequestData.goldenApplesObtained = 25;
            }
            var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
            if (alchemy !== undefined) {
              alchemy.maxLevel += item.amount - difference;
              this.addLootToResources(new ResourceValue(item.item, item.amount - difference));
            }
          }
          else {
            this.addLootToResources(itemCopy);
          }
        });
      }
    }

    if (subZone.victoryCount >= this.balladService.getVictoriesNeededToProceed(subZone.type)) {
      this.unlockNextSubzone(subZone);
    }

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      if (this.battle.activeTournament.maxRounds !== -1 && this.battle.activeTournament.currentRound >= this.battle.activeTournament.maxRounds) {
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
          if (loot.item === ItemsEnum.GoldenApple && this.globalService.globalVar.sidequestData.goldenApplesObtained > 25)
            return;

          var rng = this.utilityService.getRandomNumber(0, 1);

          if (rng <= loot.chance) {
            if (lootGained.some(item => item.item === loot.item)) {
              var existingLootItem = lootGained.find(item => item.item === loot.item);
              if (existingLootItem !== undefined)
                existingLootItem.amount += loot.amount;
            }
            else
              lootGained.push(new ResourceValue(loot.item, loot.amount));
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
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, coin));
      if (this.globalService.globalVar.gameLogSettings.get("battleCoinsRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain <strong>" + Math.round(coin) + " " + (Math.round(coin) === 1 ? this.dictionaryService.getItemName(ItemsEnum.Coin) : this.utilityService.handlePlural(this.dictionaryService.getItemName(ItemsEnum.Coin))) + "</strong>.");
      }
    }
  }

  addAchievementToGameLog(achievements: Achievement[]) {
    achievements.forEach(achievement => {
      var achievementBonus = "";
      var rewards = this.achievementService.getAchievementReward(achievement.subzone, achievement.type);
      if (rewards !== undefined && rewards.length > 0) {
        rewards.forEach(item => {
          var amount = item.amount.toString();
          if (item.item === ItemsEnum.BoonOfOlympus)
            amount = item.amount * 100 + "%";
          achievementBonus += "<strong>" + amount + " " + (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item))) + "</strong>, ";
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

    var existingResource = this.globalService.globalVar.resources.find(resource => item.item === resource.item && this.globalService.extraItemsAreEqual(item.extras, resource.extras));
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
        matchingEnemy.count += 1;
      else
        this.globalService.globalVar.enemyDefeatCount.push(new EnemyDefeatCount(enemy.bestiaryType, 1));
    });
  }

  unlockNextSubzone(subZone: SubZone) {
    var underworld = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld);

    var subZoneUnlocks = this.subzoneGeneratorService.getSubZoneUnlocks(subZone.type);
    var zoneUnlocks = this.subzoneGeneratorService.getZoneUnlocks(subZone.type);
    var balladUnlocks = this.subzoneGeneratorService.getBalladUnlocks(subZone.type, underworld === undefined ? false : underworld.isAvailable);

    if (balladUnlocks !== undefined && balladUnlocks.length > 0) {
      balladUnlocks.forEach(ballad => {
        var unlockedBallad = this.balladService.findBallad(ballad);
        if (unlockedBallad !== undefined && !unlockedBallad.isAvailable) {
          unlockedBallad.isAvailable = true;
          unlockedBallad.notify = true;
        }
      });
    }

    if (zoneUnlocks !== undefined && zoneUnlocks.length > 0) {
      zoneUnlocks.forEach(zone => {
        var unlockedZone = this.balladService.findZone(zone);
        if (unlockedZone !== undefined && !unlockedZone.isAvailable) {
          unlockedZone.isAvailable = true;
          unlockedZone.notify = true;
        }
      });
    }

    if (subZoneUnlocks !== undefined && subZoneUnlocks.length > 0) {
      subZoneUnlocks.forEach(subZone => {
        var unlockedSubZone = this.balladService.findSubzone(subZone);
        if (unlockedSubZone !== undefined && !unlockedSubZone.isAvailable) {
          unlockedSubZone.isAvailable = true;
          unlockedSubZone.notify = true;
          this.achievementService.createDefaultAchievementsForSubzone(subZone).forEach(achievement => {
            this.globalService.globalVar.achievements.push(achievement);
          });

          if (unlockedSubZone.type === SubZoneEnum.AigosthenaBay) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.NewSubzone, undefined, undefined, true, subZone));
          }
          if (unlockedSubZone.type === SubZoneEnum.AigosthenaLowerCoast) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.QuickView, undefined, undefined, true, subZone));
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

  isBattleItemOnCooldown(battleItem: ItemsEnum) {
    var onCooldown = false;

    if (this.globalService.globalVar.timers.itemCooldowns.find(item => item[0] === battleItem && item[1] > 0))
      onCooldown = true;

    return onCooldown;
  }

  useBattleItemOnCharacter(character: Character, party: Character[]) {
    if (!this.targetbattleItemMode || this.battleItemInUse === undefined || this.battleItemInUse === ItemsEnum.None ||
      this.isBattleItemOnCooldown(this.battleItemInUse))
      return;

    var itemName = this.dictionaryService.getItemName(this.battleItemInUse);

    var effect = this.lookupService.getBattleItemEffect(this.battleItemInUse);
    var damageMultiplier = 1;
    var healingMultiplier = 1;

    this.globalService.getActivePartyCharacters(true).forEach(character => {
      var itemEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BattleItemDamageUp);
      if (itemEffect !== undefined)
        damageMultiplier += itemEffect.effectiveness - 1;

      var itemEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BattleItemEffectUp);
      if (itemEffect !== undefined) {
        damageMultiplier += itemEffect.effectiveness - 1;
        healingMultiplier += itemEffect.effectiveness - 1;
      }
    });

    if (this.battleItemInUse === ItemsEnum.HealingHerb || this.battleItemInUse === ItemsEnum.HealingPoultice
      || this.battleItemInUse === ItemsEnum.RestorativeHerb || this.battleItemInUse === ItemsEnum.RestorativePoultice
      || this.battleItemInUse === ItemsEnum.HoneyPoultice) {
      if (character.battleStats.currentHp === this.lookupService.getAdjustedMaxHp(character))
        return;

      var healedAmount = this.gainHp(character, effect.healAmount * healingMultiplier)
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        if (character.name === "Asclepius") {
          var gameLogEntry = "You leave one " + itemName + " worth " + this.utilityService.bigNumberReducer(Math.round(healedAmount)) + " HP at the altar in honor of <strong>Asclepius</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
        }
        else {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses " + itemName + ", gaining " + Math.round(healedAmount) + " HP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
        }
      }
    }

    if (this.battleItemInUse === ItemsEnum.FocusPotion) {
      if (character.overdriveInfo.gaugeAmount === character.overdriveInfo.gaugeTotal)
        return;

      var gainedAmount = effect.userEffect[0].effectiveness * character.overdriveInfo.gaugeTotal;
      character.overdriveInfo.gaugeAmount += gainedAmount;

      if (character.overdriveInfo.gaugeAmount > character.overdriveInfo.gaugeTotal)
        character.overdriveInfo.gaugeAmount = character.overdriveInfo.gaugeTotal;

      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses " + itemName + ", gaining " + effect.userEffect[0].effectiveness * 100 + "% to their Overdrive gauge.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HealingSalve || this.battleItemInUse === ItemsEnum.RestorativeSalve ||
      this.battleItemInUse === ItemsEnum.HoneySalve) {
      var itemUsed = false;

      if (character.name === "Asclepius") {
        itemUsed = true;
        var healedAmount = this.gainHp(character, effect.healAmount * healingMultiplier);
        if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
          var gameLogEntry = "You leave one " + itemName + " worth " + this.utilityService.bigNumberReducer(Math.round(healedAmount)) + " HP at the altar in honor of <strong>Asclepius</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
        }
      }

      party.forEach(member => {
        if (!member.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)
          && member.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(member)) {
          itemUsed = true;
          var healedAmount = this.gainHp(member, effect.healAmount * healingMultiplier)

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong>" + " uses " + itemName + ", gaining " + this.utilityService.bigNumberReducer(Math.round(healedAmount)) + " HP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
          }
        }
      })

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    if (this.battleItemInUse === ItemsEnum.ThrowingStone || this.battleItemInUse === ItemsEnum.ExplodingPotion ||
      this.battleItemInUse === ItemsEnum.FirePotion || this.battleItemInUse === ItemsEnum.HeftyStone ||
      this.battleItemInUse === ItemsEnum.PotentConcoction || this.battleItemInUse === ItemsEnum.PiercingPotion) {
      if (character.battleStats.currentHp <= 0)
        return;

      var elementalType = ElementalTypeEnum.None;
      if (this.battleItemInUse === ItemsEnum.FirePotion)
        elementalType = ElementalTypeEnum.Fire;
      else if (this.battleItemInUse === ItemsEnum.PotentConcoction)
        elementalType = this.lookupService.getRandomElement();

      var elementalText = "";
      if (elementalType !== ElementalTypeEnum.None)
        elementalText = this.getElementalDamageText(elementalType);

      if (effect.trueDamagePercent > 0)
        effect.trueDamageAmount = effect.trueDamagePercent * character.battleStats.maxHp;

      if (effect.maxThreshold > 0 && effect.trueDamageAmount > effect.maxThreshold)
        effect.trueDamageAmount = effect.maxThreshold;

      var damage = this.dealTrueDamage(true, character, effect.trueDamageAmount * damageMultiplier, undefined, elementalType, true);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " is hit by " + itemName + ", dealing " + this.utilityService.bigNumberReducer(damage) + elementalText + " damage.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    //aoe damage
    if (this.battleItemInUse === ItemsEnum.UnstablePotion) {
      var itemUsed = false;

      party.forEach(member => {
        if (member.battleStats.currentHp > 0) {
          itemUsed = true;

          var elementalText = "";
          if (elementalType !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(elementalType);

          if (effect.trueDamagePercent > 0)
            effect.trueDamageAmount = effect.trueDamagePercent * member.battleStats.maxHp;

          if (effect.maxThreshold > 0 && effect.trueDamageAmount > effect.maxThreshold)
            effect.trueDamageAmount = effect.maxThreshold;

          var damage = this.dealTrueDamage(true, member, effect.trueDamageAmount * damageMultiplier, undefined, elementalType, true);

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "<strong>" + member.name + "</strong>" + " is hit by " + itemName + ", dealing " + this.utilityService.bigNumberReducer(damage) + elementalText + " damage.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
          }
        }
      });

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    if (this.battleItemInUse === ItemsEnum.PoisonExtractPotion) {
      var itemUsed = false;
      effect.targetEffect[0].effectiveness *= damageMultiplier;

      party.forEach(member => {
        if (member.battleStats.currentHp > 0) {
          itemUsed = true;

          this.applyStatusEffect(effect.targetEffect[0], member);

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "";
            if (this.battleItemInUse === ItemsEnum.PoisonExtractPotion)
              gameLogEntry = "<strong>" + member.name + "</strong>" + " is poisoned by " + itemName + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
          }
        }
      });

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }
    if (this.battleItemInUse === ItemsEnum.PoisonFang || this.battleItemInUse === ItemsEnum.StranglingGasPotion ||
      this.battleItemInUse === ItemsEnum.BoomingPotion || this.battleItemInUse === ItemsEnum.SlowingPotion) {
      if (character.battleStats.currentHp <= 0)
        return;

      effect.targetEffect[0].effectiveness *= damageMultiplier;

      this.applyStatusEffect(effect.targetEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "";
        if (this.battleItemInUse === ItemsEnum.BoomingPotion)
          gameLogEntry = "<strong>" + character.name + "</strong>" + "'s Resistance is reduced by " + itemName + ".";
        else if (this.battleItemInUse === ItemsEnum.SlowingPotion)
          gameLogEntry = "<strong>" + character.name + "</strong>" + "'s Agility is reduced by " + itemName + ".";
        else
          gameLogEntry = "<strong>" + character.name + "</strong>" + " is poisoned by " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.PoisonousToxin || this.battleItemInUse === ItemsEnum.DebilitatingToxin ||
      this.battleItemInUse === ItemsEnum.WitheringToxin || this.battleItemInUse === ItemsEnum.VenomousToxin ||
      this.battleItemInUse === ItemsEnum.FlamingToxin || this.battleItemInUse === ItemsEnum.ParalyzingToxin) {
      if (character.battleStats.currentHp <= 0)
        return;

      var matchingStatusEffect = this.getMatchingStatusEffectFromItem(this.battleItemInUse);

      //remove any other existing toxin
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type === matchingStatusEffect || !this.isStatusEffectAToxin(item.type));

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " applies " + itemName + " to their weapon.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HeroicElixir || this.battleItemInUse === ItemsEnum.RejuvenatingElixir ||
      this.battleItemInUse === ItemsEnum.ElixirOfFortitude || this.battleItemInUse === ItemsEnum.ElixirOfSpeed) {
      if (character.battleStats.currentHp <= 0)
        return;

      var matchingStatusEffect = this.getMatchingStatusEffectFromItem(this.battleItemInUse);

      //remove any other existing elixir
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type === matchingStatusEffect || !this.isStatusEffectAnElixir(item.type));

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " uses " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry);
      }
    }

    if (effect.cooldown > 0) {
      this.globalService.globalVar.timers.itemCooldowns.push([this.battleItemInUse, effect.cooldown]);
    }

    if (this.lookupService.getResourceAmount(this.battleItemInUse) === 0) {
      this.targetbattleItemMode = false;
    }
  }

  getMatchingStatusEffectFromItem(type: ItemsEnum) {
    if (type === ItemsEnum.WitheringToxin) {
      return StatusEffectEnum.WitheringToxin;
    }
    if (type === ItemsEnum.DebilitatingToxin) {
      return StatusEffectEnum.DebilitatingToxin;
    }
    if (type === ItemsEnum.VenomousToxin) {
      return StatusEffectEnum.VenomousToxin;
    }
    if (type === ItemsEnum.PoisonousToxin) {
      return StatusEffectEnum.PoisonousToxin;
    }
    if (type === ItemsEnum.FlamingToxin) {
      return StatusEffectEnum.FlamingToxin;
    }
    if (type === ItemsEnum.ParalyzingToxin) {
      return StatusEffectEnum.ParalyzingToxin;
    }
    if (type === ItemsEnum.ElixirOfFortitude) {
      return StatusEffectEnum.ElixirOfFortitude;
    }
    if (type === ItemsEnum.RejuvenatingElixir) {
      return StatusEffectEnum.RejuvenatingElixir;
    }
    if (type === ItemsEnum.HeroicElixir) {
      return StatusEffectEnum.HeroicElixir;
    }
    if (type === ItemsEnum.ElixirOfSpeed) {
      return StatusEffectEnum.ElixirOfSpeed;
    }

    return StatusEffectEnum.None;
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
    character.battleInfo.hpRegenTimer += this.utilityService.roundTo(deltaTime, this.utilityService.genericRoundTo);
    if (character.battleInfo.hpRegenTimer >= character.battleInfo.hpRegenTimerLength) {
      var totalHpRegen = character.battleStats.hpRegen;

      var rejuvenatingElixir = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.RejuvenatingElixir);
      if (rejuvenatingElixir !== undefined) {
        totalHpRegen += rejuvenatingElixir.effectiveness;
      }

      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareHpRegenIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareHpRegenIncrease);
        totalHpRegen *= relevantAltarEffect!.effectiveness;
      }

      this.gainHp(character, totalHpRegen);
      character.battleInfo.hpRegenTimer -= character.battleInfo.hpRegenTimerLength;
      character.battleInfo.hpRegenTimer = this.utilityService.roundTo(character.battleInfo.hpRegenTimer, this.utilityService.genericRoundTo);
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

  checkForEquipmentEffect(trigger: EffectTriggerEnum, user: Character, target: Character | undefined, party: Character[], targets: Character[], deltaTime: number = 0, originalTriggerTargetedAllies: boolean = false, totalAttempts: number = 1, removeInstantAutoAttack: boolean = false) {
    var userGainsEffects: StatusEffect[] = [];
    var targetGainsEffects: StatusEffect[] = [];
    var rng = 0;

    //console.log("User " + user.name);

    //go through each equipment piece
    if (user.equipmentSet.weapon !== undefined && user.equipmentSet.weapon.equipmentEffect.trigger === trigger) {
      //console.log("Check weapon");
      user.equipmentSet.weapon.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          for (var i = 0; i < totalAttempts; i++) {
            rng = this.utilityService.getRandomNumber(0, 1);
            if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          }
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          for (var i = 0; i < totalAttempts; i++) {
            rng = this.utilityService.getRandomNumber(0, 1);
            if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          }
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else {
          for (var i = 0; i < totalAttempts; i++)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
      });

      user.equipmentSet.weapon.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          for (var i = 0; i < totalAttempts; i++) {
            rng = this.utilityService.getRandomNumber(0, 1);
            if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          }
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          for (var i = 0; i < totalAttempts; i++) {
            rng = this.utilityService.getRandomNumber(0, 1);
            if (rng <= user.equipmentSet.weapon!.equipmentEffect.chance)
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          }
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.weapon!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else {
          for (var i = 0; i < totalAttempts; i++)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
      });
    }

    if (user.equipmentSet.shield !== undefined && user.equipmentSet.shield.equipmentEffect.trigger === trigger) {
      //console.log("Check shield on trigger " + trigger + " for user " + user.name);
      //console.log(user.equipmentSet.shield);
      user.equipmentSet.shield.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.shield!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.shield!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.shield!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });

      user.equipmentSet.shield.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.shield!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.shield!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.shield!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.shield!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (user.equipmentSet.armor !== undefined && user.equipmentSet.armor.equipmentEffect.trigger === trigger) {
      user.equipmentSet.armor?.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.armor!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.armor!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.armor!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });

      user.equipmentSet.armor?.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.armor!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.armor!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.armor!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.armor!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (user.equipmentSet.ring !== undefined && user.equipmentSet.ring.equipmentEffect.trigger === trigger) {
      //console.log("Matched ring trigger " + trigger);
      user.equipmentSet.ring?.equipmentEffect.userEffect.forEach(effect => {
        //console.log("For effect")
        //console.log(effect);
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.ring!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.ring!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {           
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.ring!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });

      user.equipmentSet.ring?.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.ring!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.ring!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.ring!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.ring!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (user.equipmentSet.necklace !== undefined && user.equipmentSet.necklace.equipmentEffect.trigger === trigger) {
      user.equipmentSet.necklace?.equipmentEffect.userEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });

      user.equipmentSet.necklace?.equipmentEffect.targetEffect.forEach(effect => {
        if (trigger === EffectTriggerEnum.ChanceOnAutoAttack) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.ChanceOnAbilityUse) {
          rng = this.utilityService.getRandomNumber(0, 1);
          if (rng <= user.equipmentSet.necklace!.equipmentEffect.chance)
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
        }
        else if (trigger === EffectTriggerEnum.TriggersEvery) {
          //this could be problematic if there are multiple triggers every effects
          user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount += deltaTime;

          if (user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
            targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            user.equipmentSet.necklace!.equipmentEffect.triggersEveryCount = 0;
          }
        }
        else
          targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
      });
    }

    if (userGainsEffects.length > 0) {
      //if it's already active, don't reapply
      if (trigger === EffectTriggerEnum.AlwaysActive) {
        userGainsEffects.forEach(effect => {
          if (user.battleInfo.statusEffects.some(existingEffect => existingEffect.caster === effect.caster))
            effect.type = StatusEffectEnum.None;
        });

        userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.None);
      }

      if (removeInstantAutoAttack) {
        userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.InstantAutoAttack);
      }

      //console.log("Triggered " + userGainsEffects[0].type);
      this.handleuserEffects(true, userGainsEffects, user, party, targets);
    }

    if (targetGainsEffects.length > 0 && target !== undefined) {
      //if it's already active, don't reapply
      if (trigger === EffectTriggerEnum.AlwaysActive) {
        targetGainsEffects.forEach(effect => {
          if (target.battleInfo.statusEffects.some(existingEffect => existingEffect.caster === effect.caster))
            effect.type = StatusEffectEnum.None;
        });

        targetGainsEffects = targetGainsEffects.filter(item => item.type !== StatusEffectEnum.None);
      }

      targetGainsEffects.forEach(effect => {
        if (effect.dotType === dotTypeEnum.BasedOnAttack) //reusing this enum
        {
          effect.effectiveness *= this.lookupService.getAdjustedAttack(user);
        }
      });

      if (removeInstantAutoAttack) {
        targetGainsEffects = targetGainsEffects.filter(item => item.type !== StatusEffectEnum.InstantAutoAttack);
      }

      this.handletargetEffects(true, targetGainsEffects, user, target, targets, party, undefined, originalTriggerTargetedAllies);
    }
  }

  applyToxin(user: Character, target: Character, party: Character[], targets: Character[]) {
    //check if user has toxin buff
    //handle based on what it is    
    var poisonousToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PoisonousToxin);
    if (poisonousToxin !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= poisonousToxin.effectiveness) {
        var damageDealt = 65;
        this.dealTrueDamage(true, target, damageDealt, user, undefined, true);
        var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(damageDealt)) + " damage from " + poisonousToxin.caster + "'s effect.";

        if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
        }
      }
    }

    var debilitatingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DebilitatingToxin);
    if (debilitatingToxin !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= debilitatingToxin.effectiveness) {
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 14, .8, false, false), target, undefined, user);
      }
    }

    var witheringToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WitheringToxin);
    if (witheringToxin !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= witheringToxin.effectiveness) {
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 16, .8, false, false), target, undefined, user);
      }
    }

    var paralyzingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ParalyzingToxin);
    if (paralyzingToxin !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= paralyzingToxin.effectiveness) {
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Paralyze, 20, 0, false, false), target, undefined, user);
      }
    }

    var venomousToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.VenomousToxin);
    if (venomousToxin !== undefined) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= venomousToxin.effectiveness) {
        var damageDealt = 432;
        this.dealTrueDamage(true, target, damageDealt, user, undefined, true);
        var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(Math.round(damageDealt)) + " damage from " + venomousToxin.caster + "'s effect.";

        if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);
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

    var enholy = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enholy);
    if (enholy !== undefined) {
      elementalType = ElementalTypeEnum.Holy;
    }

    var enwater = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enwater);
    if (enwater !== undefined) {
      elementalType = ElementalTypeEnum.Water;
    }

    var enearth = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enearth);
    if (enearth !== undefined) {
      elementalType = ElementalTypeEnum.Earth;
    }

    var enlightning = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enlightning);
    if (enlightning !== undefined) {
      elementalType = ElementalTypeEnum.Lightning;
    }

    var enair = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Enair);
    if (enair !== undefined) {
      elementalType = ElementalTypeEnum.Air;
    }

    return elementalType;
  }

  checkOverdriveStatus(character: Character, deltaTime: number) {
    if (character.overdriveInfo.gaugeAmount === character.overdriveInfo.gaugeTotal &&
      (character.overdriveInfo.autoMode || character.overdriveInfo.manuallyTriggered)) {
      character.overdriveInfo.isActive = true;
      character.overdriveInfo.gaugeAmount = 0;
      this.altarService.incrementAltarCount(AltarConditionEnum.OverdriveUse);

      if (this.globalService.globalVar.gameLogSettings.get("partyOverdrives")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses Overdrive: " + this.lookupService.getOverdriveName(character.overdriveInfo.selectedOverdrive) + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Overdrive, gameLogEntry);
      }
    }

    character.overdriveInfo.manuallyTriggered = false;

    if (character.overdriveInfo.isActive) {
      character.overdriveInfo.activeDuration += deltaTime;

      if (character.overdriveInfo.activeDuration >= character.overdriveInfo.activeLength) {
        character.overdriveInfo.isActive = false;
        character.overdriveInfo.activeDuration = 0;
        if (this.globalService.globalVar.gameLogSettings.get("partyOverdrives")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>'s overdrive ends.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Overdrive, gameLogEntry);
        }

        if (character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection) {
          this.gainHp(character, character.overdriveInfo.damageTaken / 2);
          character.overdriveInfo.damageTaken = 0;
        }

        if (character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Bullseye) {
          this.battle.currentEnemies.enemyList.forEach(enemy => {
            var bullseyeDamage = enemy.overdriveInfo.criticalDamageTaken.find(item => item[0] === character.type);
            if (bullseyeDamage !== undefined) {
              this.applyStatusEffect(this.globalService.createDamageOverTimeEffect(5, 5, bullseyeDamage[1], "Bullseye", dotTypeEnum.TrueDamage), enemy);
              enemy.overdriveInfo.criticalDamageTaken = enemy.overdriveInfo.criticalDamageTaken.filter(item => item[0] !== character.type);
              //this.handletargetEffects(true, [], character, enemy, this.battle.currentEnemies.enemyList, [], 0);
            }
          });
        }
      }
    }
  }

  isStatusEffectAToxin(effect: StatusEffectEnum) {
    if (effect === StatusEffectEnum.WitheringToxin || effect === StatusEffectEnum.VenomousToxin || effect === StatusEffectEnum.DebilitatingToxin ||
      effect === StatusEffectEnum.PoisonousToxin || effect === StatusEffectEnum.FlamingToxin || effect === StatusEffectEnum.ParalyzingToxin)
      return true;

    return false;
  }

  isStatusEffectAnElixir(effect: StatusEffectEnum) {
    if (effect === StatusEffectEnum.ElixirOfFortitude || effect === StatusEffectEnum.HeroicElixir || effect === StatusEffectEnum.RejuvenatingElixir ||
      effect === StatusEffectEnum.ElixirOfSpeed)
      return true;

    return false;
  }

  getBuffsOnCharacter(character: Character) {
    return character.battleInfo.statusEffects.filter(item => item.isPositive).length;
  }

  getDebuffsOnCharacter(character: Character) {
    return character.battleInfo.statusEffects.filter(item => !item.isPositive).length;
  }
}
