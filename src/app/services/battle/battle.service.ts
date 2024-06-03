import { Injectable } from '@angular/core';
import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
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
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { MenuService } from '../menu/menu.service';
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
import { EquipmentSetEnum } from 'src/app/models/enums/equipment-set-enum.model';
import { LinkInfo } from 'src/app/models/character/link-info.model';
import { Uniques } from 'src/app/models/resources/uniques.model';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';

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
    private professionService: ProfessionService, private dictionaryService: DictionaryService, private trialService: TrialService,
    private enemyGeneratorService: EnemyGeneratorService) { }

  handleBattle(deltaTime: number, loadingContent: any) {
    deltaTime = this.utilityService.roundTo(deltaTime, this.utilityService.genericRoundTo);
    var lastPerformanceNow = performance.now();
    var subZone = this.balladService.getActiveSubZone();

    if (this.currentSubzoneType !== undefined && this.currentSubzoneType !== subZone.type) {
      var party = this.globalService.getActivePartyCharacters(true);
      party.forEach(member => {
        this.checkForEquipmentEffect(EffectTriggerEnum.WhenEnteringBattle, member, undefined, party, []);
        this.handleUserEffects(true, [], member, party, [], 0);
      });
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

        party.forEach(member => {
          this.checkForEquipmentEffect(EffectTriggerEnum.AfterTime, member, this.getTarget(member, enemies), party, enemies, this.battle.battleDuration);
        });

        this.updateBattleState(party, enemies);

        if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
          this.battle.activeTournament.tournamentTimer += deltaTime;

          if (this.battle.activeTournament.tournamentTimer >= this.battle.activeTournament.tournamentTimerLength) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You ran out of time before successfully completing your coliseum fight. You finished in round " + this.battle.activeTournament.currentRound + (this.battle.activeTournament.maxRounds !== -1 ? " of " + this.battle.activeTournament.maxRounds : "") + ".", this.globalService.globalVar);
            this.globalService.handleColiseumLoss(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
            this.battle.activeTournament = this.globalService.setNewTournament(true);
          }
        }

        if (this.battle.activeTrial.type !== TrialEnum.None) {
          this.battle.activeTrial.timer += deltaTime;

          if (this.battle.activeTrial.timer >= this.battle.activeTrial.timerLength) {
            var additionalGodText = "";
            if (this.battle.activeTrial.godEnum !== GodEnum.None)
              additionalGodText = " against " + this.lookupService.getGodNameByType(this.battle.activeTrial.godEnum);
            this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You ran out of time before successfully completing your trial" + additionalGodText + ".", this.globalService.globalVar);
            this.globalService.handleTrialLoss(this.battle.activeTrial.type);
            this.battle.activeTrial = this.globalService.setNewTrial(true);
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
        this.handleStatusEffectDurations(false, enemy, party, enemies, deltaTime);
        this.handleAutoAttackTimer(enemy, deltaTime);
        this.checkAutoAttackTimer(false, enemy, party, enemies, deltaTime);
        this.handleAbilities(false, enemy, party, enemies, deltaTime, true);
        this.handleHpRegen(enemy, deltaTime, true);
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Altars, undefined, undefined, true, subzone.type), this.globalService.globalVar);
      this.globalService.handleTutorialModal();
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.ObscurredNotification, undefined, undefined, true, subzone.type), this.globalService.globalVar);
      this.globalService.handleTutorialModal();
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

    if (this.lookupService.getSubZoneCompletionByType(SubZoneEnum.LernaSpringOfAmymone) &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.TimeFragmentInTheSwamp)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.TimeFragmentInTheSwamp);
    }

    if (this.lookupService.getSubZoneCompletionByType(SubZoneEnum.StraitsOfMessinaMawOfTheMonster) &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.CharybdisJewelcrafting)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.CharybdisJewelcrafting);
    }

    /*if (this.lookupService.getSubZoneCompletionByType(SubZoneEnum.EscapeFromColchisBackAgainstTheWall) &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.BrokenHuskJewelcrafting)) {
      this.storyService.displayOptionalScene(OptionalSceneEnum.BrokenHuskJewelcrafting);
    }*/
  }

  checkScene() {
    var subzone = this.balladService.getActiveSubZone();
    this.storyService.checkForNewStoryScene();

    if (this.globalService.globalVar.activeBattle !== undefined) {
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Equipment, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }

      //auto gain healing herbs in aigosthena lower coast
      if (subzone.type === SubZoneEnum.AigosthenaLowerCoast && subzone.victoryCount >= 5 &&
        !this.globalService.globalVar.freeTreasureChests.aigosthenaLowerCoastAwarded) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.aigosthenaLowerCoastAwarded = true;
      }

      //auto gain 2x speed in delphi outskirts
      /*if (subzone.type === SubZoneEnum.DodonaDelphiOutskirts && subzone.victoryCount >= 0 &&
        !this.globalService.globalVar.freeTreasureChests.delphiOutskirts) {
        treasureChestChance = 1;
        this.globalService.globalVar.freeTreasureChests.delphiOutskirts = true;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.ExtraSpeed, undefined, undefined, true, subzone.type));
      }*/

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
          var itemName = "";
          if (reward.item === ItemsEnum.ExtraSpeed1Hour) {
            itemName = "Hour of Extra Speed";
            this.globalService.globalVar.extraSpeedTimeRemaining += 1 * 60 * 60;
          }
          else {
            this.lookupService.gainResource(reward);
            this.lookupService.addLootToLog(reward.item, reward.amount, subzone.type);

            itemName = (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item)));
            if (this.lookupService.getItemTypeFromItemEnum(reward.item) === ItemTypeEnum.Equipment) {
              var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(reward.item)?.quality);
              itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
            }

            if (this.globalService.globalVar.gameLogSettings.get("foundTreasureChest")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.TreasureChestRewards, "You find a treasure chest containing <strong>" + reward.amount + " " + itemName + "</strong>.", this.globalService.globalVar);
            }
          }
        });

        if (showBattleItemTutorial) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.BattleItems, undefined, undefined, true, subzone.type), this.globalService.globalVar);
          this.globalService.handleTutorialModal();
        }
      }
    }
  }

  initializeEnemyList() {
    var subZone = this.balladService.getActiveSubZone();
    var enemyOptions: EnemyTeam[] = [];

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      //tournament battles
      //console.log("Get " + this.battle.activeTournament.type + " enemy options for round " + this.battle.activeTournament.currentRound);
      if (this.battle.activeTournament.type === ColiseumTournamentEnum.FriendlyCompetition) {
        enemyOptions = this.coliseumService.parseFriendlyCompetitionData(this.battle.activeTournament);
        this.globalService.getActivePartyCharacters(true).forEach(member => {
          member.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.FriendlyCompetition, -1, this.utilityService.friendlyCompetitionDamageReduction, false, true));
          //this.globalService.calculateCharacterBattleStats(member, false);
          member.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(member, true, false);
        });
        if (enemyOptions.length > 0) {
          enemyOptions[0].enemyList.forEach(member => {
            //this.globalService.calculateCharacterBattleStats(member, false);
            member.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(member, false, false);
          });
        }
      }
      else
        enemyOptions = this.coliseumService.generateBattleOptions(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
    }
    else if (this.battle.activeTrial.type !== TrialEnum.None) {
      enemyOptions = this.trialService.generateBattleOptions(this.battle.activeTrial);
    }
    else {
      //all standard battles
      enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subZone.type);
    }

    //console.log("Enemy options");
    //console.log(enemyOptions);
    var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
    if (subZone.type === SubZoneEnum.AigosthenaUpperCoast && subZone.victoryCount < 2)
      this.battle.currentEnemies = enemyOptions[0];
    else if (subZone.type === SubZoneEnum.AigosthenaUpperCoast && (subZone.victoryCount === 2 || subZone.victoryCount === 4))
      this.battle.currentEnemies = enemyOptions[1];
    else
      this.battle.currentEnemies = randomEnemyTeam;
    this.battle.battleDuration = 0;


    if (this.battle.activeTrial.type === TrialEnum.TrialOfSkill) {
      var bestiaryEnum: BestiaryEnum | undefined = undefined;
      if (this.battle.currentEnemies !== undefined && this.battle.currentEnemies.enemyList.length > 0) {
        bestiaryEnum = this.battle.currentEnemies.enemyList[0].bestiaryType;
      }

      this.battle.activeTrial.godEnum = this.getGodEnumFromTrialOfSkillBattle(bestiaryEnum);
      this.battle.activeTrial.maxHp = 0;
      this.battle.currentEnemies.enemyList.forEach(enemy => {
        this.battle.activeTrial.maxHp += enemy.battleStats.maxHp;
      });
    }
  }

  getGodEnumFromTrialOfSkillBattle(bestiaryEnum: BestiaryEnum | undefined) {
    var god = GodEnum.None;

    if (bestiaryEnum === BestiaryEnum.Athena)
      god = GodEnum.Athena;
    if (bestiaryEnum === BestiaryEnum.Artemis)
      god = GodEnum.Artemis;
    if (bestiaryEnum === BestiaryEnum.Hermes)
      god = GodEnum.Hermes;
    if (bestiaryEnum === BestiaryEnum.Apollo)
      god = GodEnum.Apollo;
    if (bestiaryEnum === BestiaryEnum.Hades2)
      god = GodEnum.Hades;
    if (bestiaryEnum === BestiaryEnum.Ares)
      god = GodEnum.Ares;
    if (bestiaryEnum === BestiaryEnum.Nemesis)
      god = GodEnum.Nemesis;
    if (bestiaryEnum === BestiaryEnum.Dionysus)
      god = GodEnum.Dionysus;
    if (bestiaryEnum === BestiaryEnum.Zeus)
      god = GodEnum.Zeus;
    if (bestiaryEnum === BestiaryEnum.Poseidon)
      god = GodEnum.Poseidon;
    if (bestiaryEnum === BestiaryEnum.Aphrodite)
      god = GodEnum.Aphrodite;
    if (bestiaryEnum === BestiaryEnum.Hera)
      god = GodEnum.Hera;

    return god;
  }

  handleStatusEffectDurations(isPartyMember: boolean, character: Character, targets: Character[], party: Character[], deltaTime: number) {
    if (character.battleInfo.statusEffects.length === 0)
      return;

    var fastDebuffSpeed = 1;
    if (isPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.DionysusRareFastDebuffs) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.DionysusRareFastDebuffs);
      fastDebuffSpeed = 1 / (1 - (relevantAltarEffect!.effectiveness - 1));
    }

    var fastDebuffSpeedStatus = 1;
    var fastDebuffEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FastDebuffs);
    if (fastDebuffEffect !== undefined) {
      fastDebuffSpeedStatus = 1 / (1 - (fastDebuffEffect.effectiveness - 1));
    }

    var sturdyShell = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.SturdyShell);
    if (sturdyShell !== undefined) {
      fastDebuffSpeedStatus = 1 / (1 - sturdyShell.count);
    }

    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Break)) {
      var breakConditionMet = true;
      var breakConditionCount = 5;
      var effectiveness = 300000;
      party.forEach(partyMember => {
        if (!partyMember.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Break) ||
          partyMember.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Break)!.stackCount < breakConditionCount)
          breakConditionMet = false;
      });

      if (breakConditionMet) {
        party.forEach(partyMember => {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, -1, effectiveness, true, false, false), partyMember);
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AllPrimaryStatsExcludeHpDown, 15, .5, false, false, false), partyMember);
          partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Break);
          this.handleTargetEffects(isPartyMember, [], partyMember, partyMember, targets, party, 0);
        });
      }
    }

    character.battleInfo.statusEffects.forEach(effect => {
      var previousDuration = effect.duration;

      if (!effect.isPositive)
        effect.duration -= deltaTime * fastDebuffSpeed * fastDebuffSpeedStatus;
      else
        effect.duration -= deltaTime;

      //a second has passed
      if (Math.ceil(previousDuration) > Math.ceil(effect.duration)) {
        if (effect.type === StatusEffectEnum.Paralyze) {
          var stunChance = .1;
          var rng = this.utilityService.getRandomNumber(0, 1);
          if (rng < stunChance) {
            this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 2, 0, false, false), character);

            if (effect.abilityName === "Uneasy Waters") {
              this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 10, .25, false, false), character);
              this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 10, .25, false, false), character);
            }
          }
        }

        if (effect.type === StatusEffectEnum.VortexPull) {
          effect.effectiveness += .05;

          if (effect.effectiveness >= 1) {
            this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 8, 0, false, false), character);
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.VortexPull);
          }
        }
      }

      if (effect.type === StatusEffectEnum.DamageOverTime) {
        //check tick time
        effect.tickTimer += deltaTime;

        if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
          var caster: Character | undefined = undefined;

          if (effect.casterEnum !== CharacterEnum.None) {
            if (effect.casterEnum === CharacterEnum.Enemy && this.battle !== undefined && this.battle.currentEnemies !== undefined) {
              caster = this.battle.currentEnemies.enemyList.find(item => item.name === effect.caster);
            }
            else {
              caster = this.globalService.globalVar.characters.find(item => item.type === effect.casterEnum);
            }
          }

          var criticalDamageBonus = 1;
          if (caster !== undefined && this.globalService.getSetCount(EquipmentSetEnum.Ares, caster.equipmentSet) === 5) {
            //check if crit, then apply damage bonus and multiply it to effectiveness below
            var isCritical = this.isDamageCritical(caster, character);
            if (isCritical) {
              criticalDamageBonus = this.lookupService.getAdjustedCriticalMultiplier(caster, true, undefined, character);
              this.checkForArtemisSetBonus(caster, character);
            }
          }

          //deal damage
          var godType = GodEnum.None;
          if (effect.abilityName === "Rupture" || effect.abilityName === "Onslaught" || effect.abilityName === "Revel in Blood")
            godType = GodEnum.Ares;
          else if (effect.abilityName === "Puncture")
            godType = GodEnum.Hera;

          var damageDealt = this.dealTrueDamage(!isPartyMember, character, effect.effectiveness * criticalDamageBonus, caster, effect.element, false, true, godType);
          var elementalText = "";
          if (effect.element !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(effect.element);

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(damageDealt)) + elementalText + " damage from " + effect.abilityName + "'s effect." + (criticalDamageBonus > 1 ? " <strong> Critical tick!</strong>" : "");

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }

          effect.tickTimer -= effect.tickFrequency;
          if (isPartyMember)
            this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnDotTick, caster, character, party, targets);
        }
      }

      if (effect.type === StatusEffectEnum.HealOverTime || effect.type === StatusEffectEnum.ScathingBeauty) {
        //check tick time
        effect.tickTimer += deltaTime;

        if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
          var caster: Character | undefined = undefined;

          if (effect.casterEnum !== CharacterEnum.None) {
            if (effect.casterEnum === CharacterEnum.Enemy && this.battle !== undefined && this.battle.currentEnemies !== undefined) {
              caster = this.battle.currentEnemies.enemyList.find(item => item.name === effect.caster);
            }
            else {
              caster = this.globalService.globalVar.characters.find(item => item.type === effect.casterEnum);
            }
          }

          var amountHealed = 0;

          if (effect.type === StatusEffectEnum.ScathingBeauty) {
            effect.abilityName = "Scathing Beauty";
            amountHealed = this.gainHp(character, effect.effectiveness * this.lookupService.getAdjustedResistance(character, true));
          }
          else {
            amountHealed = this.gainHp(character, effect.effectiveness);
          }

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(amountHealed)) + " HP from " + effect.abilityName + "'s effect.";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }

          effect.tickTimer -= effect.tickFrequency;
        }
      }

      if (effect.type === StatusEffectEnum.ScathingBeautyUnique) {
        //check tick time
        effect.tickTimer += deltaTime;

        if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
          var caster: Character | undefined = undefined;

          if (effect.casterEnum !== CharacterEnum.None) {
            if (effect.casterEnum === CharacterEnum.Enemy && this.battle !== undefined && this.battle.currentEnemies !== undefined) {
              caster = this.battle.currentEnemies.enemyList.find(item => item.name === effect.caster);
            }
            else {
              caster = this.globalService.globalVar.characters.find(item => item.type === effect.casterEnum);
            }
          }

          var amountHealed = this.gainHp(character, effect.effectiveness * effect.stackCount * this.lookupService.getAdjustedResistance(character, true));
          effect.count += amountHealed;

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(amountHealed)) + " HP from Scathing Beauty's effect.";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }

          effect.tickTimer -= effect.tickFrequency;
        }

        if (effect.duration <= 0) {
          targets.forEach(member => {
            var damage = this.dealTrueDamage(true, member, effect.count, undefined, undefined, true);

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>'s Scathing Beauty effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }
      }

      if (effect.type === StatusEffectEnum.RepeatDamageAfterDelay && effect.duration <= 0) {
        var target = this.getTarget(character, targets);
        if (target !== undefined) {
          var damageDealt = this.dealTrueDamage(isPartyMember, target, effect.effectiveness, character, effect.element, false, false, GodEnum.Zeus);
          var elementalText = "";
          if (effect.element !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(effect.element);

          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " repeats their previous damage, dealing " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(damageDealt)) + elementalText + " damage to " + target.name + ".";

          if ((isPartyMember && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyMember && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }

      if (effect.type === StatusEffectEnum.DealMissingHpPercentAfterTime && effect.duration <= 0) {
        var missingHp = (this.lookupService.getAdjustedMaxHp(character, true) - character.battleStats.currentHp);
        var damageAmount = missingHp * effect.effectiveness;
        this.dealTrueDamage(isPartyMember, character, damageAmount, undefined, undefined, true);
        if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
          var effectGameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " loses " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damageAmount) + " HP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, effectGameLogEntry, this.globalService.globalVar);
        }
      }

      if (effect.type === StatusEffectEnum.HighTide && effect.duration <= 0) {
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Cancer, -1, 1, false, true, false, character.name, undefined, true), character, undefined, undefined, undefined, false);
      }

      if (effect.type === StatusEffectEnum.OstinatoAfter && effect.duration <= 0) {
        var ostinato = this.lookupService.characterHasAbility("Ostinato", character);
        if (ostinato !== undefined && this.battle !== undefined) {
          this.useAbility(true, ostinato, character, targets, party, true, effect.effectiveness, undefined, false);
        }
      }

      if (effect.type === StatusEffectEnum.HealAfterDuration && effect.duration <= 0) {
        this.gainHp(character, this.lookupService.getAdjustedMaxHp(character, true, false) * effect.effectiveness);
      }

      if (effect.type === StatusEffectEnum.Submerge && effect.duration <= 0) {
        //may need to change on a case by case basis
        this.gainHp(character, character.battleStats.maxHp * .15);
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 20, 2, false, true, false), character, undefined, undefined, undefined, false);
      }
    });

    character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(effect => effect.isPermanent || effect.duration > 0);

    if (character.name === "Athena" || character.name.includes("Protected Warrior")) { //Trial of Skill
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

    var luckyShots = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.LuckyShots);
    if (luckyShots !== undefined) {
      deltaTime *= luckyShots.effectiveness;
    }

    var cleansingShots = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.CleansingShots);
    if (cleansingShots !== undefined) {
      deltaTime *= cleansingShots.effectiveness;
    }

    var lightningAttacks = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.LightningAttacks);
    if (lightningAttacks !== undefined) {
      deltaTime *= lightningAttacks.effectiveness;
    }

    var pureSpeed = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.PureSpeed);
    if (pureSpeed !== undefined) {
      deltaTime *= pureSpeed.effectiveness;
    }

    var bleedingAttacks = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.BleedingAttacks);
    if (bleedingAttacks !== undefined) {
      deltaTime *= bleedingAttacks.effectiveness;
    }

    var shieldingAttacks = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ShieldingAttacks);
    if (shieldingAttacks !== undefined) {
      deltaTime *= shieldingAttacks.effectiveness;
    }

    var betterTogether = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.BetterTogether);
    if (betterTogether !== undefined) {
      deltaTime *= betterTogether.effectiveness;
    }

    var windAttacks = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.WindAttacks);
    if (windAttacks !== undefined) {
      deltaTime *= windAttacks.effectiveness;
    }

    var boundingBand = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.BoundingBand || (effect.type === StatusEffectEnum.BoundingBandUnique && effect.count >= 4));
    if (boundingBand !== undefined) {
      deltaTime *= ((boundingBand.effectiveness - 1) / 10) + 1;
    }

    var boundingBandSignificant = character.battleInfo.statusEffects.find(effect => (effect.type === StatusEffectEnum.BoundingBandUnique && effect.count >= 10));
    if (boundingBandSignificant !== undefined) {
      var durationRemaining = boundingBandSignificant.duration / boundingBandSignificant.maxCount;
      var adjustedEffectiveness = (boundingBandSignificant.effectiveness * 2) * durationRemaining;
      if (adjustedEffectiveness < 1)
        adjustedEffectiveness = 1;

      deltaTime *= adjustedEffectiveness;
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

  handleAutoAttack(isPartyAttacking: boolean, character: Character, targets: Character[], party: Character[], additionalDamageMultiplier?: number, canTriggerInstantAutoAttack: boolean = true, fromSpecialDelivery: boolean = false) {
    var target = this.getTarget(character, targets);
    var ally = party.find(item => item.type !== character.type);
    var luckyShots = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LuckyShots);
    var cleansingShots = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.CleansingShots);
    var bleedingAttacks = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BleedingAttacks);
    var shieldingAttacks = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ShieldingAttacks);

    if (target === undefined)
      return false;

    if (this.doesAutoAttackMiss(character, target, isPartyAttacking)) {
      return true;
    }

    var damageShield = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageShield);
    if (damageShield !== undefined) {
      damageShield.count += 1;

      var gameLogEntry = "";
      if (damageShield.count === damageShield.maxCount)
        gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack is blocked by <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s damage shield, breaking the shield.";
      else
        gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack is blocked by <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s damage shield. The shield can block " + (damageShield.maxCount - damageShield.count) + " more attack" + (damageShield.maxCount - damageShield.count > 1 ? "s" : "") + ".";
      if (isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.PartyAutoAttacks, gameLogEntry, this.globalService.globalVar);
      }
      else if (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.EnemyAutoAttacks, gameLogEntry, this.globalService.globalVar);
      }


      if (damageShield.count >= damageShield.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageShield);
        damageShield.count = 0;
      }

      return true;
    }

    var allyAgilityAddition = 0;
    var betterTogether = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BetterTogether);
    if (ally !== undefined && betterTogether !== undefined)
      allyAgilityAddition = betterTogether.maxCount * this.lookupService.getAdjustedAgility(ally, isPartyAttacking);

    var totalAutoAttackCount = this.lookupService.getTotalAutoAttackCount(character, isPartyAttacking, undefined, allyAgilityAddition);
    var isCritical = false;
    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.LuckyShots))
      isCritical = true;
    else
      isCritical = this.isDamageCritical(character, target);
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

    var elementalText = "";
    if (elementalType !== ElementalTypeEnum.None) {
      elementalText = this.getElementalDamageText(elementalType);

      var disaster = this.lookupService.characterHasAbility("Natural Disaster", character);
      if (disaster !== undefined && (character.battleInfo.elementsUsed === undefined || !character.battleInfo.elementsUsed.some(item => item === elementalType))) {
        if (character.battleInfo.elementsUsed === undefined)
          character.battleInfo.elementsUsed = [];

        character.battleInfo.elementsUsed.push(elementalType);
      }

      var outburst = this.lookupService.characterHasAbility("Outburst", character);
      if (outburst !== undefined && (character.battleInfo.outburstElementsUsed === undefined || !character.battleInfo.outburstElementsUsed.some(item => item === elementalType))) {

        if (character.battleInfo.outburstElementsUsed === undefined)
          character.battleInfo.outburstElementsUsed = [];

        character.battleInfo.outburstElementsUsed.push(elementalType);
      }
    }

    if (isPartyAttacking)
      this.altarService.incrementAltarCount(AltarConditionEnum.AutoAttackUse);

    var damageMultiplier = this.getDamageMultiplier(isPartyAttacking, character, target, additionalDamageMultiplier, true, elementalType, undefined, undefined, undefined, undefined, undefined, ally) * totalAutoAttackCount;

    var allDamageDealt = this.dealDamage(isPartyAttacking, character, target, isCritical, autoAttackMultiplier, damageMultiplier, undefined, elementalType, fromSpecialDelivery ? GodEnum.Hermes : undefined, party, targets);
    var damageDealt = allDamageDealt[0];

    var additionalDamageTargets = "";
    if (allDamageDealt[1] !== undefined && allDamageDealt[1] > 0) {
      additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[1]) + " blocked by barrier)</i>";
    }
    if (allDamageDealt[2] !== undefined && allDamageDealt[2] > 0) {
      additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[2]) + " absorbed)</i>";
    }

    var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " attacks <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "") + additionalDamageTargets;
    if (isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.PartyAutoAttacks, gameLogEntry, this.globalService.globalVar);
    }
    else if (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.EnemyAutoAttacks, gameLogEntry, this.globalService.globalVar);
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

    if (luckyShots !== undefined) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DebuffDurationIncrease, 0, luckyShots.maxCount, true, true), target, undefined, character);
    }

    if (bleedingAttacks !== undefined) {
      this.applyStatusEffect(this.globalService.createDamageOverTimeEffect(6, 3, bleedingAttacks.maxCount * damageDealt, "Bleeding Attacks", dotTypeEnum.TrueDamage), target, undefined, character);
    }

    if (shieldingAttacks !== undefined) {
      var barrierEffect = this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, shieldingAttacks.maxCount, true, true, false, "", 1, undefined, undefined, undefined, undefined, "Shielding Attacks");
      barrierEffect.target = TargetEnum.Random;
      this.applyStatusEffect(barrierEffect, character, party, character);
    }

    if (cleansingShots !== undefined) {
      var cleanseRng = this.utilityService.getRandomNumber(0, 1);
      if (cleanseRng <= cleansingShots.maxCount) {
        var negativeStatusEffects: StatusEffect[] = [];
        character.battleInfo.statusEffects.filter(item => !item.isPositive).forEach(effect => {
          negativeStatusEffects.push(effect);
        });

        if (negativeStatusEffects.length > 0) {
          var rng = this.utilityService.getRandomInteger(0, negativeStatusEffects.length - 1);
          negativeStatusEffects[rng].duration = 0;
        }
      }
    }

    var passionateRhythm = this.lookupService.characterHasAbility("Passionate Rhythm", character);
    if (passionateRhythm !== undefined) {
      var copy = this.globalService.makeStatusEffectCopy(passionateRhythm.userEffect[0]);
      copy.type = StatusEffectEnum.PassionateRhythmAutoAttack;
      var aphrodite = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Aphrodite);
      if (aphrodite !== undefined) {
        var passionateRhythmUpgrade = aphrodite.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
        if (passionateRhythmUpgrade !== undefined && passionateRhythmUpgrade.userEffect.length > 0)
          copy.effectiveness += passionateRhythmUpgrade.userEffect[0].effectiveness;
      }

      if (ally !== undefined)
        this.applyStatusEffect(copy, ally, party, character);

      if (this.checkForAphroditeSetBonus(character)) {
        var newCopy = this.globalService.makeStatusEffectCopy(passionateRhythm.userEffect[0]);
        newCopy.type = StatusEffectEnum.PassionateRhythm;
        if (aphrodite !== undefined) {
          var passionateRhythmUpgrade = aphrodite.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (passionateRhythmUpgrade !== undefined && passionateRhythmUpgrade.userEffect.length > 0)
            newCopy.effectiveness += passionateRhythmUpgrade.userEffect[0].effectiveness;
        }

        if (ally !== undefined)
          this.applyStatusEffect(newCopy, ally, party, character);
      }
    }

    this.checkForHermesSetBonus(character, target);

    var divineSpeed = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AutoAttackDealsElementalDamage || item.type === StatusEffectEnum.LightningAttacks || item.type === StatusEffectEnum.WindAttacks);
    if (divineSpeed !== undefined) {
      var element = divineSpeed.element;

      if (element === ElementalTypeEnum.Random) {
        element = this.lookupService.getRandomElement();
      }

      var trueDamageDealt = this.dealTrueDamage(true, target, this.lookupService.getAdjustedAttack(character) * divineSpeed.effectiveness, character, element, true);
      if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
        (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " " + this.lookupService.getElementName(element, undefined, true) + " damage from " + character.name + "'s effect.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }

      if (trueDamageDealt > 0 && divineSpeed.type === StatusEffectEnum.AutoAttackDealsElementalDamage) {
        var healAmount = trueDamageDealt * .1 * (1 + character.battleStats.healingDone);

        healAmount = this.gainHp(character, healAmount);

        if (Math.round(healAmount) > 0) {
          if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong> gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, healAmount) + " HP from Divine Speed's effect.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    var boundingBand = character.battleInfo.statusEffects.find(item => (item.type === StatusEffectEnum.BoundingBandUnique && item.count >= 9));
    if (boundingBand !== undefined) {
      var trueDamageDealt = this.dealTrueDamage(true, target, this.lookupService.getAdjustedAttack(character) * (boundingBand.effectiveness - 1), character, undefined, true);
      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " Water damage from " + character.name + "'s effect.";

      if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (isPartyAttacking) {
      this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, target, party, targets, undefined, undefined, Math.floor(totalAutoAttackCount), !canTriggerInstantAutoAttack);
      this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAutoAttack, character, target, party, targets, undefined, undefined, Math.floor(totalAutoAttackCount), !canTriggerInstantAutoAttack);
      if (isCritical)
        this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnCriticalHit, character, target, party, targets);

      this.applyToxin(character, target, party, targets, Math.floor(totalAutoAttackCount));
    }
    else {
      this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenDamageTaken, target, character, targets, party);
      if (!isCritical) {
        this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken, target, character, targets, party);

        var scathingBeauty = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique);
        if (scathingBeauty !== undefined) {
          var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.ScathingBeautyUnique);
          if (uniqueEffect !== undefined && scathingBeauty.stackCount < uniqueEffect.getMajorEffectLevel()) {
            scathingBeauty.stackCount += 1;
          }
        }
      }
    }

    if (!fromSpecialDelivery) {
      this.handleUserEffects(isPartyAttacking, [], character, party, targets, damageDealt);
      this.handleTargetEffects(isPartyAttacking, targetEffects, character, target, targets, party, damageDealt);
    }

    var invulnerability = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Invulnerable);
    if (invulnerability === undefined) {
      var reprisalThornsBonus = 1;
      var reprisalThorns = 0;
      if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Reprisal) {
        reprisalThorns = this.utilityService.reprisalAmount;
        reprisalThornsBonus = this.utilityService.reprisalBonus;
      }

      var thornsDamageUp = 1;
      var thornsDamageUpEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThornsDamageUp);
      if (thornsDamageUpEffect !== undefined) {
        thornsDamageUp = thornsDamageUpEffect.effectiveness;
      }

      var metalElixirBonus = 0;
      var metalElixir = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.MetalElixir);
      if (metalElixir !== undefined) {
        metalElixirBonus = metalElixir.effectiveness;
      }

      var unendingFlamesMultiplier = 0;
      var unendingFlames = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.UnendingFlames);
      if (unendingFlames !== undefined) {
        unendingFlamesMultiplier = unendingFlames.effectiveness;
      }

      var dispenserOfDuesBonusThorns = this.checkForNemesisSetBonus(target);

      var includeAltars = false;
      if (target.type !== CharacterEnum.Enemy)
        includeAltars = true;

      var counterattack = this.lookupService.characterHasAbility("Counterattack", target);
      var thorns = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
      if (thorns !== undefined || target.battleStats.thorns > 0 || reprisalThorns > 0 || dispenserOfDuesBonusThorns > 0 ||
        metalElixirBonus > 0 || unendingFlamesMultiplier > 0 ||
        (includeAltars && (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns) !== undefined ||
          this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns) !== undefined)) ||
        (counterattack !== undefined && this.warriorCounterattackActive(target, character))) {
        var thornsPercentDamage = damageDealt * target.battleStats.thorns;
        thornsPercentDamage += damageDealt * reprisalThorns;
        thornsPercentDamage += damageDealt * metalElixirBonus;
        thornsPercentDamage += damageDealt * unendingFlamesMultiplier;

        if (counterattack !== undefined && this.warriorCounterattackActive(target, character)) {
          var counterAttackEffectiveness = counterattack.effectiveness;
          var permanentUpgrades = target.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
          if (permanentUpgrades !== undefined)
            counterAttackEffectiveness += permanentUpgrades.effectiveness;

          thornsPercentDamage += damageDealt * counterAttackEffectiveness;
        }

        var thornsEffectiveness = 0;
        if (thorns !== undefined) {
          target.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.Thorns).forEach(thornEffect => {
            thornsEffectiveness += thornEffect.effectiveness;
          });
        }

        var altarThornsDamage = 0;
        if (includeAltars && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisThorns);
          altarThornsDamage += damageDealt * (relevantAltarEffect!.effectiveness - 1);
        }
        if (includeAltars && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareThorns);
          altarThornsDamage += damageDealt * (relevantAltarEffect!.effectiveness - 1);
        }

        //console.log(thornsEffectiveness + " + " + thornsPercentDamage + " + " + altarThornsDamage + " + " + dispenserOfDuesBonusThorns + " * " + reprisalThornsBonus + " * " + thornsDamageUp);
        var totalThornsDamage = (thornsEffectiveness + thornsPercentDamage + altarThornsDamage + dispenserOfDuesBonusThorns) * reprisalThornsBonus * thornsDamageUp;
        var thornsDamageTakenUpEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThornsDamageTakenUp);
        if (thornsDamageTakenUpEffect !== undefined)
          totalThornsDamage *= thornsDamageTakenUpEffect.effectiveness;

        var thornsDamageDealt = Math.round(this.dealTrueDamage(!isPartyAttacking, character, totalThornsDamage, undefined, undefined, false));
        if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
          (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, thornsDamageDealt) + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Thorns effect.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
        }
      }
    }

    var insight = this.lookupService.characterHasAbility("Insight", character);
    if (insight !== undefined) {
      var insightEffectiveness = insight.effectiveness;

      var permanentCharacterAbilityUpgrades = this.getCharacterPermanentAbilityUpgrades(insight, character);
      if (permanentCharacterAbilityUpgrades !== undefined) {
        insightEffectiveness += permanentCharacterAbilityUpgrades.effectiveness;
      }

      if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.PalmStrike)) {
        insightEffectiveness *= insight.secondaryEffectiveness;
      }

      var adjustedHealingDone = character.battleStats.healingDone;

      var healingDoneModifier = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
      if (healingDoneModifier !== undefined)
        adjustedHealingDone *= healingDoneModifier.effectiveness;

      var scathedBeautyUniqueEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
      if (scathedBeautyUniqueEffect !== undefined)
        adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

      party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(potentialTarget => {
        var healAmount = 0;

        healAmount = (((insightEffectiveness / 2) * this.lookupService.getAdjustedAttack(character, undefined, true)) +
          ((insightEffectiveness / 2) * this.lookupService.getAdjustedResistance(character, true)))
          * (1 + adjustedHealingDone);

        //console.log(((insightEffectiveness / 2) * this.lookupService.getAdjustedAttack(character, undefined, true)) + " + " +  ((insightEffectiveness / 2) * this.lookupService.getAdjustedResistance(character, true)) 
        //+ " * " + (1 + adjustedHealingDone) + " = " + healAmount);

        if (character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Preservation)
          healAmount *= 1.5;

        if (character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Harmony) {
          var harmonyEffect = this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true)
          this.applyStatusEffect(harmonyEffect, potentialTarget, targets, character);
        }

        var adjustedCriticalMultiplier = 1;
        var isCritical = this.isHealCritical(character);
        if (isCritical)
          adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(character, true, true);
        healAmount *= adjustedCriticalMultiplier;

        var healedAmount = this.gainHp(potentialTarget, healAmount);

        character.trackedStats.healingDone += healedAmount;
        if (character.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
          !character.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
          character.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

        character.trackedStats.healsMade += 1;
        if (character.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
          !character.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
          character.unlockedOverdrives.push(OverdriveNameEnum.Harmony);

        if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse") && Math.round(healedAmount) > 0) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses Insight, restoring " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP to " + potentialTarget.name + "." + (isCritical ? " <strong>Critical heal!</strong>" : "");
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
        }
      });
    }

    var barrage = this.lookupService.characterHasAbility("Barrage", character);
    if (barrage !== undefined) {
      barrage.count += 1;

      if (barrage.count >= barrage.maxCount) {
        var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Invulnerable || item.type === StatusEffectEnum.AutoAttackInvulnerable));
        var additionalTargets = potentialTargets.filter(item => item !== target);
        if (additionalTargets.length > 0) {
          additionalTargets.forEach(additionalTarget => {
            //var additionalDamageDealt = this.dealDamage(isPartyAttacking, character, additionalTarget, false, undefined, this.getAbilityEffectiveness(barrage!, 1, character, false));
            var additionalDamageDealt = this.dealTrueDamage(!isPartyAttacking, additionalTarget, damageDealt * this.getAbilityEffectiveness(barrage!, 1, character, false), character, undefined, false);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack hits <strong>" + additionalTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, additionalDamageDealt) + " damage as well.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
            this.checkForEquipmentEffect(EffectTriggerEnum.OnAutoAttack, character, additionalTarget, party, targets);

            var thorns = additionalTarget.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
            if (thorns !== undefined) {
              this.dealTrueDamage(!isPartyAttacking, character, thorns.effectiveness, undefined, undefined, false);
              if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
                (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " takes <strong>" + thorns.effectiveness + "</strong> damage from <strong class='" + this.globalService.getCharacterColorClassText(additionalTarget.type) + "'>" + additionalTarget.name + "</strong>'s Thorns effect.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
              }
            }
          });
        }
        barrage.count = 0;
      }
    }


    var blindedByLove = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlindedByLove);
    if (blindedByLove !== undefined) {
      var blind = this.globalService.createStatusEffect(StatusEffectEnum.Blind, 6, .5, false, false, false);
      this.applyStatusEffect(blind, target, targets, character);
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

      this.reduceCharacterCooldowns(character, effectiveness);
    }

    if (character.name === "Hermes") { //assumed to be Hermes in the Trial of Skill
      var abilitySpeedUp = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AbilitySpeedUp);
      if (abilitySpeedUp !== undefined)
        abilitySpeedUp.effectiveness += .01;
    }

    var instantHeal = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack);
    if (instantHeal !== undefined) {
      var healAmount = instantHeal.effectiveness * (1 + character.battleStats.healingDone);

      if (character !== undefined) {
        healAmount = this.gainHp(character, healAmount);
        instantHeal.count -= 1;
        if (instantHeal.count <= 0)
          character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.InstantHealAfterAutoAttack);

        if (Math.round(healAmount) > 0) {
          if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) ||
            (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong> gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, healAmount) + " HP" + (instantHeal.abilityName !== undefined && instantHeal.abilityName !== "" ? " from " + instantHeal.abilityName : "") + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    if (character.level >= this.utilityService.characterOverdriveLevel) {
      character.overdriveInfo.gaugeAmount += character.overdriveInfo.gainPerAutoAttack * this.lookupService.getOverdriveGainMultiplier(character, true);
      if (character.overdriveInfo.gaugeAmount > character.overdriveInfo.gaugeTotal)
        character.overdriveInfo.gaugeAmount = character.overdriveInfo.gaugeTotal;
    }

    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ThousandCuts) && !fromSpecialDelivery) {
      var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThousandCuts)!;
      if (effect !== undefined && effect.count < 20)
        effect.count += 1;
    }

    return true;
  }

  reduceCharacterCooldowns(character: Character, effectiveness: number, isMultiplicative: boolean = false) {
    if (isMultiplicative) {
      if (character.abilityList !== undefined && character.abilityList.length > 0)
        character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
          ability.currentCooldown *= effectiveness;
        });

      if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable && ability.name !== "Shapeshift").forEach(ability => {
              ability.currentCooldown *= effectiveness;
            });
        }
      }

      if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable && ability.name !== "Shapeshift").forEach(ability => {
              ability.currentCooldown *= effectiveness;
            });
        }
      }
    }
    else {
      if (character.abilityList !== undefined && character.abilityList.length > 0)
        character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
          ability.currentCooldown -= effectiveness;
        });

      if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable && ability.name !== "Shapeshift").forEach(ability => {
              ability.currentCooldown -= effectiveness;
            });
        }
      }

      if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
        var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable && ability.name !== "Shapeshift").forEach(ability => {
              ability.currentCooldown -= effectiveness;
            });
        }
      }
    }
  }

  warriorCounterattackActive(warrior: Character, attacker: Character) {
    if (warrior.type !== CharacterEnum.Warrior)
      return false;

    var taunted = attacker.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Taunt);
    if (taunted !== undefined && taunted.caster === warrior.name) {
      return true;
    }

    var chainsOfFate = attacker.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);

    if (chainsOfFate !== undefined && chainsOfFate.caster === warrior.name) {
      return true;
    }

    return false;
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
        }

        if (blind.abilityName === "Thunderclap" && !target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.StunImmunity)) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, blind.maxCount, 0, false, false), character, undefined, target);
        }

        return true;
      }
    }

    var dodge = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Dodge);
    if (dodge !== undefined) {
      if ((isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) ||
        (!isPartyAttacking && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + "'s attack misses!";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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
        this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets, false);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (handleCooldown)
              this.handleAbilityCooldown(character, ability, deltaTime);
            this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets, true, god!.type);
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
            this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets, true, god!.type);
          });
      }
    }
  }

  handleAbilityCooldown(character: Character, ability: Ability, deltaTime: number) {
    if (character.name === "Porphyrion") {
      var blitz = this.lookupService.characterHasAbility("Blitz", character);
      var maim = this.lookupService.characterHasAbility("Maim", character);
      var pointedStones = this.lookupService.characterHasAbility("Pointed Stones", character);
      var glancingBlow = this.lookupService.characterHasAbility("Glancing Blow", character);

      if (character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.EarthenOffense) !== undefined) {
        if (blitz !== undefined)
          blitz.isActivatable = true;
        if (maim !== undefined)
          maim.isActivatable = true;
        if (pointedStones !== undefined)
          pointedStones.isActivatable = false;
        if (glancingBlow !== undefined)
          glancingBlow.isActivatable = false;
      }
      else if (character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.EarthenDefense) !== undefined) {
        if (blitz !== undefined)
          blitz.isActivatable = false;
        if (maim !== undefined)
          maim.isActivatable = false;
        if (pointedStones !== undefined)
          pointedStones.isActivatable = true;
        if (glancingBlow !== undefined)
          glancingBlow.isActivatable = true;
      }
    }

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

    if (ability.name === "Strangle" || ability.name === "Strangle Hold") {
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

    var vortexPull = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.VortexPull);
    if (vortexPull !== undefined) {
      deltaTime *= 1 - vortexPull.effectiveness;
    }

    this.globalService.getActivePartyCharacters(true).forEach(partyMember => {
      var recedingTide = partyMember.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.RecedingTide);
      if (recedingTide !== undefined) {
        deltaTime *= 1 - recedingTide.effectiveness;
      }
    });

    var abilitySpeedUp = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.AbilitySpeedUp);
    if (abilitySpeedUp !== undefined) {
      deltaTime *= abilitySpeedUp.effectiveness;
    }

    var pureSpeed = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.PureSpeed);
    if (pureSpeed !== undefined) {
      deltaTime *= pureSpeed.effectiveness;
    }

    if (!character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Stun || effect.type === StatusEffectEnum.Immobilize))
      ability.currentCooldown -= deltaTime;
  }

  checkAbilityCooldown(isPartyUsing: boolean, character: Character, ability: Ability, deltaTime: number, partyMembers: Character[], targets: Character[], isGodAbility: boolean, godType?: GodEnum, fromFatalAttractionModifier: number = 1) {
    if (ability.currentCooldown <= 0) {
      if (targets !== undefined && targets.length > 0 && (ability.autoMode || ability.manuallyTriggered) &&
        this.avoidAbilityRedundancy(ability, character, partyMembers)) {
        ability.currentCooldown = 0;

        var abilityUsed = this.useAbility(isPartyUsing, ability, character, targets, partyMembers, isGodAbility, undefined, undefined, undefined, undefined, godType, fromFatalAttractionModifier);

        if (abilityUsed) {
          ability.currentCooldown = this.globalService.getAbilityCooldown(ability, character);

          var flowEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Flow);
          if (flowEffect !== undefined && (flowEffect.count === 2 || flowEffect.count === 3)) {
            ability.currentCooldown *= 1 - (flowEffect.effectiveness - 1);
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.Flow && item.count === 2));
          }

          var reduceNextAbilityCooldown = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceNextAbilityCooldown);
          if (reduceNextAbilityCooldown !== undefined) {
            ability.currentCooldown *= 1 - (reduceNextAbilityCooldown.effectiveness - 1);
            character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.ReduceNextAbilityCooldown));
          }

          var ally = partyMembers.find(item => item.type !== character.type || character.type === CharacterEnum.Enemy);
          if (ally !== undefined) {
            var fatalAttraction = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FatalAttraction);
            if (fatalAttraction !== undefined && fatalAttraction.count === 2 && ability.name !== "Kiss of Death") {
              var fatalAttractionModifier = fatalAttraction.effectiveness;
              ally.battleInfo.statusEffects = ally.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.FatalAttraction);
              ability.currentCooldown = 0;
              this.checkAbilityCooldown(isPartyUsing, character, ability, deltaTime, partyMembers, targets, isGodAbility, godType, fatalAttractionModifier);
            }
          }

          ability.manuallyTriggered = false;
        }
      }

      this.handlePostAbilityUseEffects(ability, character);
    }
  }

  avoidAbilityRedundancy(ability: Ability, user: Character, partyMembers: Character[]) {
    var partyNotFullHp = partyMembers.some(member => member.battleStats.currentHp !== this.lookupService.getAdjustedMaxHp(member, true, false));

    if (!ability.manuallyTriggered && (!ability.isActivatable || (!partyNotFullHp && ability.name === "Heal")))
      return false;

    //foresight from the furies
    if (ability.name === "Fate Foretold" &&
      partyMembers.some(member => member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns) !== undefined)) {
      return false;
    }

    //used conditionally
    if (ability.name === "Immortality")
      return false;

    return true;
  }

  //isPartyUsing = is the character using the ability a party member or enemy
  useAbility(isPartyUsing: boolean, ability: Ability, user: Character, targets: Character[], party: Character[], isGodAbility: boolean, effectivenessModifier: number = 1, abilityWillRepeat: boolean = false, effectShouldRepeat: boolean = true, fromRepeat: boolean = false, godType?: GodEnum, fromFatalAttractionModifier: number = 1) {
    var abilityCopy = ability.makeCopy();
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Invulnerable));
    var target = this.getTarget(user, abilityCopy.targetsAllies ? party : targets, abilityCopy.targetType !== undefined ? abilityCopy.targetType : TargetEnum.Random);
    var damageDealt = 0;
    var healedAmount = 0;
    var elementalText = "";
    var elementalType = abilityCopy.elementalType;
    var userEffects: StatusEffect[] = [];
    var targetEffects: StatusEffect[] = [];
    var wasDamageCritical: boolean = false;

    if (target !== undefined) {
      var illusion = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Illusion);
      if (illusion !== undefined) {
        var rng = this.utilityService.getRandomInteger(0, 1);
        if (rng <= illusion.effectiveness) {
          if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) ||
            (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + "'s ability misses!";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }

          return true;
        }
      }
    }

    var keepFlow = false;
    this.handleConditionalAbilityChanges(abilityCopy, user, party, fromRepeat, target);
    var ally = party.find(item => item.type !== user.type);

    if (abilityCopy.name === "Mark Target" && abilityCopy.userEffect.length > 0 && target !== undefined) {
      abilityCopy.userEffect[0].caster = target.name;
    }

    if (abilityCopy.name === "Sun and Moon") {
      abilityCopy.userEffect = abilityCopy.userEffect.filter(item => item.type !== StatusEffectEnum.InstantOstinato);
    }

    if ((abilityCopy.name === "Solar Flare" || abilityCopy.name === "Raid") && !fromRepeat) {
      ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
    }

    if (abilityCopy.name === "Raging Fireball" && ability.cooldown > 2) {
      ability.cooldown -= 2;
    }

    if (abilityCopy.name === "Mix Herb") {
      var rng = this.utilityService.getRandomInteger(0, 2);

      if (rng === 0)
      abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RedHerb, -1, 1, false, true, false));
      else if (rng === 1)
        abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.GreenHerb, -1, 1, false, true, false));
      else if (rng === 2)
        abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.YellowHerb, -1, 1, false, true, false));
    }

    if (abilityCopy.name === "Prophecy") {
      var rng = this.utilityService.getRandomInteger(0, 2);

      if (rng === 0) {
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 2, false, true));
      }
      else if (rng === 1) {
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.DamageOverTimeTakenDown, 15, .2, false, true));
      }
      else if (rng === 2) {
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.AirDamageTakenDown, 15, .2, false, true));
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.FireDamageTakenDown, 15, .2, false, true));
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.WaterDamageTakenDown, 15, .2, false, true));
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.LightningDamageTakenDown, 15, .2, false, true));
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.HolyDamageTakenDown, 15, .2, false, true));
        abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageTakenDown, 15, .2, false, true));
      }
    }

    if (abilityCopy.name === "Upstream") {
      var current = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Current);
      var currentCount = 0;
      if (current !== undefined) {
        currentCount = current.stackCount;
      }

      this.battle.currentEnemies.enemyList.filter(item => item.bestiaryType !== BestiaryEnum.Peneus && !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead || effect.type === StatusEffectEnum.Stun)).forEach(enemy => {
        var rush = this.lookupService.characterHasAbility("Rush", enemy);

        if (rush !== undefined) {
          this.useAbility(true, rush, enemy, targets, party, true, undefined, undefined, false);

          for (var i = 0; i < currentCount; i++) {
            this.useAbility(true, rush, enemy, targets, party, true, undefined, undefined, false);
          }
        }
      });
    }

    if (abilityCopy.name === "Raise") {
      if (this.battle.currentEnemies.enemyList.length === 1) {
        var rng = this.utilityService.getRandomInteger(0, 2);
        if (rng === 0) {
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingHusk));
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingHusk));
        }
        else if (rng === 1) {
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DiseasedHusk));
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DiseasedHusk));
        }
        else if (rng === 2) {
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHusk));
          this.battle.currentEnemies.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHusk));
        }
      }
      else {
        this.battle.currentEnemies.enemyList.filter(item => item.bestiaryType !== BestiaryEnum.Aeetes).forEach(enemy => {
          enemy.battleInfo.statusEffects = [];
          enemy.battleStats.currentHp = enemy.battleStats.maxHp;
        });
      }
    }


    if (target === undefined)
      return false;

    if (elementalType === ElementalTypeEnum.Random) {
      elementalType = this.lookupService.getRandomElement();
    }

    var flamingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FlamingToxin);
    if (flamingToxin !== undefined) {
      elementalType = ElementalTypeEnum.Fire;
    }
    var sandToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.SandToxin);
    if (sandToxin !== undefined) {
      elementalType = ElementalTypeEnum.Earth;
    }
    var electrifiedToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ElectrifiedToxin);
    if (electrifiedToxin !== undefined) {
      elementalType = ElementalTypeEnum.Lightning;
    }
    var tidalToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.TidalToxin);
    if (tidalToxin !== undefined) {
      elementalType = ElementalTypeEnum.Water;
    }
    var lightToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LightToxin);
    if (lightToxin !== undefined) {
      elementalType = ElementalTypeEnum.Holy;
    }
    var tempestToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.TempestToxin);
    if (tempestToxin !== undefined) {
      elementalType = ElementalTypeEnum.Air;
    }

    if (user.battleInfo.lastUsedPoseidonAbility && !fromRepeat && (abilityCopy.name === "Crashing Waves" || abilityCopy.name === "Whirlpool" || abilityCopy.name === "Tsunami")) {
      this.handleExtraPoseidonFunctionality(user, abilityCopy);
    }

    if (abilityCopy.name === "Colossal Focus" || abilityCopy.name === "Burning Focus") {
      if (targets.some(item => item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Focus))) {
        var otherTarget = targets.find(item => !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Focus));
        if (otherTarget !== undefined)
          target = otherTarget;
      }
    }

    var vortexPull = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.VortexPull);
    if (vortexPull !== undefined) {
      vortexPull.effectiveness -= .2;

      if (vortexPull.effectiveness <= 0)
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.VortexPull);
    }

    //console.log(ability.name + ": " + (!ability.heals || ability.heals === undefined) + " + " + (!ability.dealsDirectDamage || ability.dealsDirectDamage === undefined) + " + " + ability.manuallyTriggered);
    if ((!ability.heals || ability.heals === undefined) && (!ability.dealsDirectDamage || ability.dealsDirectDamage === undefined) && ability.manuallyTriggered &&
      user.linkInfo.cooldown <= 0) {
      //console.log(ability.name + " Non DD Link");
      user.linkInfo.remainingLinks -= 1;
      user.linkInfo.linkChain += 1;

      var linkEffectivenessBoost = user.battleStats.linkEffectiveness;
      var linkEffectivenessBoostEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LinkBoost);
      if (linkEffectivenessBoostEffect !== undefined)
        linkEffectivenessBoost += linkEffectivenessBoostEffect.effectiveness;

      user.linkInfo.bonusChain += this.utilityService.nonDamageLinkBoost * (1 + linkEffectivenessBoost);

      if (user.linkInfo.remainingLinks <= 0) {
        user.linkInfo.linkChain = 0;
        user.linkInfo.bonusChain = 0;
        user.linkInfo.cooldown = this.utilityService.linkCooldown;

        if (linkEffectivenessBoostEffect !== undefined && linkEffectivenessBoostEffect.count > 0)
          user.linkInfo.cooldown -= linkEffectivenessBoostEffect.count;
      }
    }

    var invulnerability = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Invulnerable);
    if (invulnerability !== undefined) {
      if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>, but it has no effect due to their invulnerability!";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }
      return true;
    }

    if (elementalType === ElementalTypeEnum.None) {
      elementalType = this.checkUserForEnElement(user);
    }

    if (abilityCopy.name === "Elemental Strike") {
      elementalType = this.lookupService.getRandomElement();
    }

    if (abilityCopy.name === "Sun and Moon" && fromRepeat) {
      abilityCopy.isAoe = true;
    }

    if (abilityCopy.name === "Warming Brew") {
      party.forEach(member => {
        member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Dead);
        this.gainHp(member, 1);
      });
    }

    if (abilityCopy.name === "Warming Brew" || abilityCopy.name === "Revelry and Blood") {
      var warmingBrew = abilityCopy.userEffect[0];
      this.applyStatusEffect(warmingBrew, user, party, user);
    }

    if (abilityCopy.name === "Discordant Melody" || abilityCopy.name === "Lords Above and Below") {
      var lordOfTheUnderworld = this.lookupService.characterHasAbility("Lord of the Underworld", user);

      if (lordOfTheUnderworld !== undefined) {
        var copy = this.globalService.makeStatusEffectCopy(lordOfTheUnderworld.userEffect[0]);
        var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
        if (hades !== undefined) {
          var lordOfTheUnderworldUpgrade = hades.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (lordOfTheUnderworldUpgrade !== undefined && lordOfTheUnderworldUpgrade.userEffect.length > 0)
            copy.effectiveness += lordOfTheUnderworldUpgrade.userEffect[0].effectiveness;
        }

        this.applyStatusEffect(copy, user);
        this.applyStatusEffect(copy, user);
        this.applyStatusEffect(copy, user);
      }
    }

    if (abilityCopy.name === "Love to Death") {
      var lordOfTheUnderworld = this.lookupService.characterHasAbility("Lord of the Underworld", user);

      if (lordOfTheUnderworld !== undefined) {
        var copy = this.globalService.makeStatusEffectCopy(lordOfTheUnderworld.userEffect[0]);
        var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
        if (hades !== undefined) {
          var lordOfTheUnderworldUpgrade = hades.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (lordOfTheUnderworldUpgrade !== undefined && lordOfTheUnderworldUpgrade.userEffect.length > 0)
            copy.effectiveness += lordOfTheUnderworldUpgrade.userEffect[0].effectiveness;

          copy.duration += abilityCopy.secondaryEffectiveness;
        }

        this.applyStatusEffect(copy, user);
        this.applyStatusEffect(copy, user);
        this.applyStatusEffect(copy, user);

        if (ally !== undefined) {
          this.applyStatusEffect(copy, ally);
          this.applyStatusEffect(copy, ally);
          this.applyStatusEffect(copy, ally);
        }
      }
    }

    if (abilityCopy.name === "Palm Strike" && target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.PalmStrike && item.stackCount === 2)) {
      abilityCopy.targetEffect = [];
      abilityCopy.isAoe = true;
      if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Flurry)
        abilityCopy.effectiveness *= (2 * abilityCopy.secondaryEffectiveness);
      else
        abilityCopy.effectiveness *= abilityCopy.secondaryEffectiveness;
      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.PalmStrike);
    }

    if (abilityCopy.name === "Spirit Unleashed") {
      if (ability.count === undefined || ability.count <= 1) {
        abilityCopy.targetEffect = abilityCopy.targetEffect.filter(item => item.type === StatusEffectEnum.DamageTakenUp);
      }
      else if (ability.count === 2) {
        abilityCopy.targetEffect = abilityCopy.targetEffect.filter(item => item.type === StatusEffectEnum.DamageDealtDown);
      }
      else if (ability.count === 3) {
        abilityCopy.targetEffect = abilityCopy.targetEffect.filter(item => item.type === StatusEffectEnum.Stagger);
      }

      ability.count += 1;
      if (ability.count >= 4 || ability.count <= 1)
        ability.count = 1;
    }

    var disaster = this.lookupService.characterHasAbility("Natural Disaster", user);
    if (elementalType !== ElementalTypeEnum.None && disaster !== undefined && (user.battleInfo.elementsUsed === undefined || !user.battleInfo.elementsUsed.some(item => item === elementalType)) &&
      abilityCopy.name !== "Natural Disaster") { //avoid an infinite loop by not including itself

      if (user.battleInfo.elementsUsed === undefined)
        user.battleInfo.elementsUsed = [];

      user.battleInfo.elementsUsed.push(elementalType);
    }

    var outburst = this.lookupService.characterHasAbility("Outburst", user);
    if (elementalType !== ElementalTypeEnum.None && outburst !== undefined && (user.battleInfo.outburstElementsUsed === undefined || !user.battleInfo.outburstElementsUsed.some(item => item === elementalType)) &&
      abilityCopy.name !== "Outburst") { //avoid an infinite loop by not including itself

      if (user.battleInfo.outburstElementsUsed === undefined)
        user.battleInfo.outburstElementsUsed = [];

      user.battleInfo.outburstElementsUsed.push(elementalType);
    }

    var abilityEffectiveness = this.getAbilityEffectiveness(abilityCopy, effectivenessModifier, user, isGodAbility);
    var onslaughtUsed = false;

    if (user.name === "Soaring Ram" && abilityCopy.name === "Battering Ram") {
      abilityEffectiveness *= 2 ** user.battleInfo.specialAbilityUseCount;
      user.battleInfo.specialAbilityUseCount += 1;
    }

    var applyStatusEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AbilityAppliesDebuff);
    if (applyStatusEffect !== undefined) {
      abilityCopy.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDown, 20, .75, true, false, false));
    }

    if (abilityCopy.dealsDirectDamage) {
      var damageIsBlocked = false;
      var damageShield = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageShield);
      if (damageShield !== undefined) {
        damageShield.count += 1;

        var gameLogEntry = "";
        if (damageShield.count === damageShield.maxCount)
          gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + "'s attack is blocked by <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s damage shield, breaking the shield.";
        else
          gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + "'s attack is blocked by <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s damage shield. The shield can block " + (damageShield.maxCount - damageShield.count) + " more attack" + (damageShield.maxCount - damageShield.count > 1 ? "s" : "") + ".";
        if (isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.PartyAutoAttacks, gameLogEntry, this.globalService.globalVar);
        }
        else if (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.EnemyAutoAttacks, gameLogEntry, this.globalService.globalVar);
        }


        if (damageShield.count >= damageShield.maxCount) {
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageShield);
        }

        damageIsBlocked = true;
      }

      if (elementalType !== ElementalTypeEnum.None)
        elementalText = this.getElementalDamageText(elementalType);

      var linkEffectivenessBoost = user.battleStats.linkEffectiveness;
      var linkEffectivenessBoostEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LinkBoost);
      if (linkEffectivenessBoostEffect !== undefined) {
        linkEffectivenessBoost += linkEffectivenessBoostEffect.effectiveness;
        //console.log("From effect: " + linkEffectivenessBoostEffect.effectiveness);
      }

      // console.log("Link Effectiveness: " + linkEffectivenessBoost);
      var linkMultiplier = this.handleDamageDealingLink(user.linkInfo, ability, abilityCopy.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) || abilityWillRepeat, linkEffectivenessBoost, linkEffectivenessBoostEffect !== undefined ? linkEffectivenessBoostEffect.count : undefined);
      abilityEffectiveness *= linkMultiplier;

      var flowEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Flow);
      if (flowEffect !== undefined) {
        flowEffect.count = 2;
      }

      var flow = this.lookupService.characterHasAbility("Flow", user);
      if (flow !== undefined && elementalType === ElementalTypeEnum.Water) {
        keepFlow = true;
        if (flowEffect !== undefined)
          flowEffect.count = 3;
        var flowStatus = this.globalService.makeStatusEffectCopy(flow.userEffect[0]);

        var poseidon = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon);
        if (poseidon !== undefined) {
          var flowUpgrade = poseidon.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (flowUpgrade !== undefined && flowUpgrade.userEffect.length > 0)
            flowStatus.effectiveness += flowUpgrade.userEffect[0].effectiveness;
        }

        if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonRareFlow) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonRareFlow);
          if (relevantAltarEffect !== undefined)
            flowStatus.effectiveness = ((flowStatus.effectiveness - 1) * relevantAltarEffect.effectiveness) + 1;
        }

        userEffects.push(flowStatus);
      }

      var fatalAttractionModifier = fromFatalAttractionModifier > 1 ? fromFatalAttractionModifier : this.checkForFatalAttraction(user, party.find(item => item.type !== user.type || item.type === CharacterEnum.Enemy));
      var warAndLoveModifier = 1;
      if (ally !== undefined) {
        var warAndLove = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WarAndLove);
        if (warAndLove !== undefined) {
          warAndLoveModifier = warAndLove.effectiveness;
          abilityCopy.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 4, warAndLove.maxCount, ability.name, dotTypeEnum.BasedOnDamage));

          if (!abilityWillRepeat && !abilityCopy.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) && !ally.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.FatalAttraction))
            ally.battleInfo.statusEffects = ally.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.WarAndLove);
        }
      }

      var barrierPiercingModifier = 1;
      if (abilityCopy.name === "Spike Shot" || abilityCopy.name === "Jet Stream") {
        barrierPiercingModifier = 2;
      }

      if (abilityCopy.isAoe) {
        potentialTargets.forEach((potentialTarget, index, array) => {
          var isLastInList = false;
          if (index === array.length - 1)
            isLastInList = true;

          var damageMultiplier = this.getDamageMultiplier(isPartyUsing, user, potentialTarget, undefined, false, elementalType, abilityCopy.name, abilityCopy.isAoe, abilityCopy.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) || abilityWillRepeat, isLastInList, abilityCopy, ally);
          damageMultiplier *= fatalAttractionModifier;
          damageMultiplier *= warAndLoveModifier;
          var isCritical = this.isDamageCritical(user, potentialTarget, abilityCopy, party.find(item => item.type !== user.type));

          if (potentialTarget.battleInfo.barrierValue > 0)
            damageMultiplier *= barrierPiercingModifier;

          if (isCritical) {
            wasDamageCritical = true;

            if (abilityCopy.name === "Sun and Moon") {
              damageMultiplier *= abilityCopy.secondaryEffectiveness;
              abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.InstantOstinato, 0, .2, true, true));
            }

            if (abilityCopy.name === "Nature's Fury") {
              damageMultiplier *= abilityCopy.secondaryEffectiveness;
              abilityCopy.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 1, false, false));
            }

            if (abilityCopy.name === "Infectious Flames" && abilityCopy.targetEffect.length > 0) {
              var allDown = this.globalService.createStatusEffect(StatusEffectEnum.AllPrimaryStatsExcludeHpDown, abilityCopy.targetEffect[0].duration, abilityCopy.targetEffect[0].effectiveness, false, false, true);
              abilityCopy.targetEffect = [];
              abilityCopy.targetEffect.push(allDown);
            }
          }

          if (damageIsBlocked)
            damageMultiplier = 0;

          var allDamageDealt = this.dealDamage(isPartyUsing, user, potentialTarget, isCritical, abilityEffectiveness, damageMultiplier, abilityCopy, elementalType, godType, party, targets);
          damageDealt = allDamageDealt[0];

          if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
            (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {

            var additionalDamageTargets = "";
            if (allDamageDealt[1] !== undefined && allDamageDealt[1] > 0) {
              additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[1]) + " blocked by barrier)</i>";
            }
            if (allDamageDealt[2] !== undefined && allDamageDealt[2] > 0) {
              additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[2]) + " absorbed)</i>";
            }

            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(potentialTarget.type) + "'>" + potentialTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "") + additionalDamageTargets;
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
          onslaughtUsed = this.checkForOnslaught(damageDealt, user, potentialTarget, potentialTargets, abilityCopy, abilityWillRepeat);
        });
      }
      else {
        var damageMultiplier = this.getDamageMultiplier(isPartyUsing, user, target, undefined, false, elementalType, abilityCopy.name, abilityCopy.isAoe, abilityCopy.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) || abilityWillRepeat, undefined, abilityCopy, ally);
        damageMultiplier *= fatalAttractionModifier;
        damageMultiplier *= warAndLoveModifier;
        var isCritical = this.isDamageCritical(user, target, abilityCopy, party.find(item => item.type !== user.type));

        if (target.battleInfo.barrierValue > 0)
          damageMultiplier *= barrierPiercingModifier;

        if (isCritical) {
          wasDamageCritical = true;
          if (abilityCopy.name === "Blinding Arrow") {
            damageMultiplier *= abilityCopy.secondaryEffectiveness;
            abilityCopy.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 8, 1, false, false, false));
          }
          if (abilityCopy.name === "Sun and Moon") {
            damageMultiplier *= abilityCopy.secondaryEffectiveness;
            abilityCopy.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.InstantOstinato, 0, .2, true, true));
          }
        }

        if (damageIsBlocked)
          damageMultiplier = 0;

        var allDamageDealt = this.dealDamage(isPartyUsing, user, target, isCritical, abilityEffectiveness, damageMultiplier, abilityCopy, elementalType, godType, party, targets);
        damageDealt = allDamageDealt[0];

        var additionalDamageTargets = "";
        if (allDamageDealt[1] !== undefined && allDamageDealt[1] > 0) {
          additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[1]) + " blocked by barrier)</i>";
        }
        if (allDamageDealt[2] !== undefined && allDamageDealt[2] > 0) {
          additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[2]) + " absorbed)</i>";
        }

        if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
          (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong> for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damageDealt) + elementalText + " damage." + (isCritical ? " <strong>Critical hit!</strong>" : "") + additionalDamageTargets;
          this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
        }
        onslaughtUsed = this.checkForOnslaught(damageDealt, user, target, potentialTargets, abilityCopy, abilityWillRepeat);
      }
    }
    else if (abilityCopy.heals) {
      if (abilityCopy.isAoe) {
        party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(potentialTarget => {
          var linkEffectivenessBoost = user.battleStats.linkEffectiveness;
          var linkEffectivenessBoostEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LinkBoost);
          if (linkEffectivenessBoostEffect !== undefined)
            linkEffectivenessBoost += linkEffectivenessBoostEffect.effectiveness;

          var linkMultiplier = this.handleDamageDealingLink(user.linkInfo, ability, false, linkEffectivenessBoost, linkEffectivenessBoostEffect !== undefined ? linkEffectivenessBoostEffect.count : undefined);
          abilityEffectiveness *= linkMultiplier;

          var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
          var adjustedHealingDone = user.battleStats.healingDone;
          if (healingDoneModifier !== undefined)
            adjustedHealingDone *= healingDoneModifier.effectiveness;

          var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
          if (scathedBeautyUniqueEffect !== undefined)
            adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

          var healAmount = 0;

          if (abilityCopy.name === "Cleansing Rain")
            healAmount = (((abilityEffectiveness / 2) * this.lookupService.getAdjustedAttack(user, abilityCopy, isPartyUsing)) +
              ((abilityEffectiveness / 2) * this.lookupService.getAdjustedResistance(user, isPartyUsing)))
              * (1 + adjustedHealingDone);
          else
            //healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user, abilityCopy, isPartyUsing) * (1 + adjustedHealingDone);*/
            healAmount = abilityEffectiveness * this.lookupService.getAdjustedResistance(user, isPartyUsing) * (1 + adjustedHealingDone);

          if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Preservation)
            healAmount *= 1.5;

          if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Harmony) {
            targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true));
          }

          var adjustedCriticalMultiplier = 1;
          var isCritical = this.isHealCritical(user);
          if (isCritical)
            adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user, isPartyUsing, true);
          healAmount *= adjustedCriticalMultiplier;

          healedAmount = this.gainHp(potentialTarget, healAmount);

          user.trackedStats.healingDone += healedAmount;
          if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
            !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
            user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

          user.trackedStats.healsMade += 1;
          if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
            !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
            user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);

          if (healedAmount > 0 && (isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
            (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on " + potentialTarget.name + ", restoring " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
          }
        });
      }
      else {
        var linkEffectivenessBoost = user.battleStats.linkEffectiveness;
        var linkEffectivenessBoostEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LinkBoost);
        if (linkEffectivenessBoostEffect !== undefined)
          linkEffectivenessBoost += linkEffectivenessBoostEffect.effectiveness;

        var linkMultiplier = this.handleDamageDealingLink(user.linkInfo, ability, false, linkEffectivenessBoost, linkEffectivenessBoostEffect !== undefined ? linkEffectivenessBoostEffect.count : undefined);
        abilityEffectiveness *= linkMultiplier;

        var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
        var adjustedHealingDone = user.battleStats.healingDone;
        if (healingDoneModifier !== undefined)
          adjustedHealingDone *= healingDoneModifier.effectiveness;

        var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
        if (scathedBeautyUniqueEffect !== undefined)
          adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

        var healAmount = 0;

        //console.log(abilityEffectiveness + " * " + this.lookupService.getAdjustedResistance(user, isPartyUsing) + " * " + (1 + adjustedHealingDone))

        if (abilityCopy.name === "Cleansing Rain")
          healAmount = (((abilityEffectiveness / 2) * this.lookupService.getAdjustedAttack(user, abilityCopy, isPartyUsing)) +
            ((abilityEffectiveness / 2) * this.lookupService.getAdjustedResistance(user, isPartyUsing)))
            * (1 + adjustedHealingDone);
        else
          //healAmount = abilityEffectiveness * this.lookupService.getAdjustedAttack(user, abilityCopy, isPartyUsing) * (1 + adjustedHealingDone);
          healAmount = abilityEffectiveness * this.lookupService.getAdjustedResistance(user, isPartyUsing) * (1 + adjustedHealingDone);

        if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Preservation)
          healAmount *= 1.5;

        if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Harmony) {
          targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true));
        }

        var adjustedCriticalMultiplier = 1;
        var isCritical = this.isHealCritical(user);
        if (isCritical)
          adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(user, isPartyUsing, true);
        healAmount *= adjustedCriticalMultiplier;

        //console.log("Final: " + healAmount);
        healedAmount = this.gainHp(target, healAmount);

        user.trackedStats.healingDone += healedAmount;
        if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
          !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
          user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

        user.trackedStats.healsMade += 1;
        if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
          !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
          user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);

        if (healedAmount > 0 && (isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
          (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + " on " + target.name + ", restoring " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP." + (isCritical ? " <strong>Critical heal!</strong>" : "");
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
        }
      }



      //check Apollo conditions
      if (abilityCopy.name === "Ostinato") {
        if (effectShouldRepeat)
          this.checkForApolloSetBonus(user);
        var staccato = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        var fortissimo = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        var coda = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (staccato !== undefined) {
          party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead || effect.type === StatusEffectEnum.Stun || effect.type === StatusEffectEnum.Immobilize)).forEach(member => {
            var instantAttack = this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, 1, true, true);
            this.applyStatusEffect(instantAttack, member, party, user);
          });
        }

        var dispenserOfDuesEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
        var passingJudgmentEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PassingJudgment);
        if (dispenserOfDuesEffect !== undefined && passingJudgmentEffect !== undefined) {
          dispenserOfDuesEffect.effectiveness *= passingJudgmentEffect.effectiveness;
        }

        var shapeshiftEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
        var melodicMoves = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.MelodicMoves);
        if (shapeshiftEffect !== undefined && melodicMoves !== undefined) {
          shapeshiftEffect.effectiveness += melodicMoves.effectiveness;
        }

        var thunderousMelody = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThunderousMelody);
        if (thunderousMelody !== undefined) {
          targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, thunderousMelody.effectiveness, 0, false, false, true));
        }

        var flood = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Flood);
        if (flood !== undefined) {
          targets.forEach(newTarget => {
            var trueDamageDealt = this.dealTrueDamage(isPartyUsing, newTarget, flood!.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, true), user, ElementalTypeEnum.Water, true);
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + elementalText + " Water damage from Flood's effect.";
            if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }

        if (fortissimo !== undefined) {
          var fortissimoAbility = this.lookupService.characterHasAbility("Fortissimo", user);
          party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(member => {
            this.reduceCharacterCooldowns(member, 1 - (fortissimoAbility!.secondaryEffectiveness - 1), true);
          });
        }

        if (coda !== undefined) {
          var negativeStatusEffects: StatusEffect[] = [];
          party.filter(character => !character.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(member => {
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
        }

        var mainHead = this.battle.currentEnemies.enemyList.find(item => item.bestiaryType === BestiaryEnum.LerneanHydra);
        if (mainHead !== undefined && !mainHead.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Invulnerable))
          mainHead.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Invulnerable, -1, 1, false, true, false));
      }
      if (abilityCopy.name === "Grow Root") //Belligerent Oak Ability
      {
        var rootsRevived = 0;
        var affectedEnemy = this.battle.currentEnemies.enemyList.filter(item => item.bestiaryType === BestiaryEnum.OakRoots)[0];

        this.battle.currentEnemies.enemyList.filter(item => item.bestiaryType === BestiaryEnum.OakRoots).forEach(enemy => {
          if (rootsRevived === 0 && enemy.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
            enemy.battleInfo.statusEffects = [];
            enemy.battleStats.currentHp = enemy.battleStats.maxHp;
            affectedEnemy = enemy;
            rootsRevived += 1;
          }
        });

        if (rootsRevived === 0) {
          this.battle.currentEnemies.enemyList.filter(item => item.bestiaryType === BestiaryEnum.OakRoots).forEach(enemy => {
            var CharAHpPercent = (affectedEnemy.battleStats.currentHp + affectedEnemy.battleInfo.barrierValue) / (this.lookupService.getAdjustedMaxHp(affectedEnemy, false, false));
            var CharBHpPercent = (enemy.battleStats.currentHp + enemy.battleInfo.barrierValue) / (this.lookupService.getAdjustedMaxHp(enemy, false, false));

            if (CharBHpPercent < CharAHpPercent) {
              affectedEnemy = enemy;
            }
          });

          affectedEnemy.battleInfo.statusEffects = [];
          affectedEnemy.battleStats.currentHp = affectedEnemy.battleStats.maxHp;
        }

        if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", bringing " + affectedEnemy.name + " back to full HP and remove all of its debuffs.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
        }
      }
      else if (abilityCopy.name === "Ground" && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) { //Enceladus ability
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", preventing you from escaping the battle.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
      }
      else if (((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
        (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) &&
        (abilityCopy.name !== "Revel in Blood" || !isPartyUsing)) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
      }
    }

    //check Hera conditions
    var shapeshiftEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
    if (abilityCopy.name === "Shapeshift") {
      var defensiveShapeshifting = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DefensiveShapeshifting);
      if (defensiveShapeshifting !== undefined) {
        var retribution = this.lookupService.characterHasAbility("Retribution", user);
        if (retribution !== undefined)
          this.useAbility(true, retribution, user, targets, party, true, undefined, undefined, false);

        var shapeshiftDamage = this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, -1, defensiveShapeshifting.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, true), true, false, true, "Defensive Shapeshifting", 0, false, ElementalTypeEnum.Air);
        abilityCopy.targetEffect.push(shapeshiftDamage);
      }

      var lovingEmbrace = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LovingEmbrace);
      if (lovingEmbrace !== undefined) {
        abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AllPrimaryStatsUp, lovingEmbrace.maxCount, lovingEmbrace.effectiveness, false, true, true, undefined, undefined, true));
      }

      if (shapeshiftEffect !== undefined) {
        if (shapeshiftEffect.count === 3 || shapeshiftEffect.count === undefined)
          shapeshiftEffect.count = 1;
        else
          shapeshiftEffect.count += 1;

        var hera = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hera);
        if (hera !== undefined && isPartyUsing) {
          if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraRareShapeshift) !== undefined) {
            var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraRareShapeshift);
            shapeshiftEffect.effectiveness += relevantAltarEffect!.effectiveness - 1;
          }
        }

        var melodicMoves = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.MelodicMoves);
        if (melodicMoves !== undefined) {
          var rng = this.utilityService.getRandomInteger(1, 3);

          if (rng === 1) {
            var staccatoAbility = this.lookupService.characterHasAbility("Staccato", user);
            if (staccatoAbility !== undefined) {
              this.useAbility(true, staccatoAbility, user, targets, party, true, undefined, undefined, false);
            }
          }
          else if (rng === 2) {
            var fortissimoAbility = this.lookupService.characterHasAbility("Fortissimo", user);
            if (fortissimoAbility !== undefined) {
              this.useAbility(true, fortissimoAbility, user, targets, party, true, undefined, undefined, false);
            }
          }
          else if (rng === 3) {
            var codaAbility = this.lookupService.characterHasAbility("Coda", user);
            if (codaAbility !== undefined) {
              this.useAbility(true, codaAbility, user, targets, party, true, undefined, undefined, false);
            }
          }
        }
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
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>" + " uses " + abilityCopy.name + ", losing " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.abs(hpLoss)) + " HP and applying a damage over time effect on all enemies.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
        }
      }
    }

    if (onslaughtUsed)
      user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Onslaught);

    this.handleEnemySpecificAbilityFunctionality(user, abilityCopy, wasDamageCritical);

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

    var shapeshift = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
    if (shapeshift !== undefined) {
      if (abilityCopy.name === "Soaring Strike") {
        if (shapeshift.count === 1) {
          userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.AirDamageUp, 20, 1 + abilityCopy.secondaryEffectiveness * .1, false, true, false));
          userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.HolyDamageUp, 20, 1 + abilityCopy.secondaryEffectiveness * .1, false, true, false));
        }
        else if (shapeshift.count === 2) {
          targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, abilityCopy.secondaryEffectiveness, 1, false, false, false));
        }
        else if (shapeshift.count === 3 && !fromRepeat) {
          //have to do it in both places for it to trigger
          userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true, undefined, undefined, undefined, undefined, ElementalTypeEnum.Holy));
          abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true, undefined, undefined, undefined, undefined, ElementalTypeEnum.Holy));
        }
      }
    }

    var blindedByLove = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlindedByLove);
    if (blindedByLove !== undefined) {
      targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, blindedByLove.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, true), true, false, false, undefined, undefined, undefined, ElementalTypeEnum.Holy));
    }

    if (abilityCopy.name === "Strut" && shapeshiftEffect !== undefined && shapeshiftEffect.count === 1) {
      var originalEffect = userEffects.find(item => item.type === StatusEffectEnum.AttackUp);
      if (originalEffect !== undefined) {
        userEffects = userEffects.filter(item => item.type !== originalEffect?.type);
        userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Strut, originalEffect.duration, originalEffect.effectiveness, false, true));
      }
    }

    if (abilityCopy.name === "Espionage" && shapeshiftEffect !== undefined && shapeshiftEffect.count === 2) {
      var originalEffect = targetEffects.find(item => item.type === StatusEffectEnum.DamageDealtDown);
      if (originalEffect !== undefined) {
        targetEffects = targetEffects.filter(item => item.type !== originalEffect?.type);
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Espionage, originalEffect.duration, originalEffect.effectiveness, false, false));
      }
    }

    if (abilityCopy.name === "Puncture" && shapeshiftEffect !== undefined && shapeshiftEffect.count === 3) {
      var punctureUpgrade = this.lookupService.characterHasAbility("Puncture", user);
      if (punctureUpgrade !== undefined)
        targetEffects.push(this.globalService.createDamageOverTimeEffect(8, 2, punctureUpgrade.secondaryEffectiveness, "Puncture", dotTypeEnum.BasedOnDamage));
    }

    if (abilityCopy.name === "Properly Balanced") {
      targetEffects = [];

      var healingDownOriginalEffect = abilityCopy.targetEffect.find(item => item.type === StatusEffectEnum.ReduceHealing);
      var damageDealtDownOriginalEffect = abilityCopy.targetEffect.find(item => item.type === StatusEffectEnum.DamageDealtDown);

      if (healingDownOriginalEffect !== undefined && damageDealtDownOriginalEffect !== undefined) {
        var healingDownEffect = this.globalService.makeStatusEffectCopy(healingDownOriginalEffect);
        var damageDealtDownEffect = this.globalService.makeStatusEffectCopy(damageDealtDownOriginalEffect);

        var rng = this.utilityService.getRandomInteger(0, potentialTargets.length - 1);
        var healingDownTarget = potentialTargets[rng];
        var damageDealtDownTarget = potentialTargets[rng];
        if (potentialTargets.length > 1) {
          if (rng === 0)
            damageDealtDownTarget = potentialTargets[1];
          else
            damageDealtDownTarget = potentialTargets[0];
        }

        this.applyStatusEffect(healingDownEffect, healingDownTarget, potentialTargets, user, abilityCopy);
        this.applyStatusEffect(damageDealtDownEffect, damageDealtDownTarget, potentialTargets, user, abilityCopy);
      }
    }

    if (user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ThousandCuts) && !abilityWillRepeat) {
      var effect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThousandCuts)!;
      if (effect !== undefined && effect.count < 20)
        effect.count += 1;
    }

    if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Quickness && abilityCopy.name === "Quick Hit") {
      this.reduceCharacterCooldowns(user, this.utilityService.quicknessCooldownReduction);
    }

    var windAttacks = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WindAttacks);
    if (abilityCopy.name === "Shapeshift" && windAttacks !== undefined) {
      this.reduceCharacterCooldowns(user, windAttacks.maxCount);
    }

    if (abilityCopy.name === "Firestorm" && !fromRepeat) {
      var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
      if (hades !== undefined) {
        if (hades.abilityList !== undefined && hades.abilityList.length > 0) {
          var hellfire = hades.abilityList.find(ability => ability.name === "Hellfire");
          if (hellfire !== undefined) {
            hellfire.currentCooldown *= 1 - (abilityCopy.secondaryEffectiveness - 1);
          }

          var earthquake = hades.abilityList.find(ability => ability.name === "Earthquake");
          if (earthquake !== undefined)
            earthquake.currentCooldown *= 1 - (abilityCopy.secondaryEffectiveness - 1);
        }
      }

      var poseidon = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon);
      if (poseidon !== undefined) {
        if (poseidon.abilityList !== undefined && poseidon.abilityList.length > 0) {
          var rng = this.utilityService.getRandomInteger(1, 3);
          if (rng === 1) {
            var crashingWaves = poseidon.abilityList.find(ability => ability.name === "Crashing Waves");
            if (crashingWaves !== undefined)
              crashingWaves.currentCooldown *= 1 - (abilityCopy.secondaryEffectiveness - 1);
          }
          else if (rng === 2) {
            var whirlpool = poseidon.abilityList.find(ability => ability.name === "Whirlpool");
            if (whirlpool !== undefined)
              whirlpool.currentCooldown *= 1 - (abilityCopy.secondaryEffectiveness - 1);
          }
          else if (rng === 3) {
            var tsunami = poseidon.abilityList.find(ability => ability.name === "Tsunami");
            if (tsunami !== undefined)
              tsunami.currentCooldown *= 1 - (abilityCopy.secondaryEffectiveness - 1);
          }
        }
      }
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
        userEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true));

      if (targetBarrier !== undefined)
        targetEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true));
    }

    if (user.name === "Hermes") { //assumed to be Hermes in the Trial of Skill
      var attackSpeedUp = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AutoAttackSpeedUp);
      if (attackSpeedUp !== undefined)
        attackSpeedUp.effectiveness += .02;
    }

    if (user.name === "Poseidon") { //assumed to be Poseidon in the Trial of Skill
      var waterDamageUp = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WaterDamageUp);
      if (waterDamageUp !== undefined)
        waterDamageUp.effectiveness += .02;
    }

    if (abilityCopy.name === "Lightning Storm" && ally !== undefined && (user.assignedGod1 === GodEnum.Aphrodite || user.assignedGod2 === GodEnum.Aphrodite)) {
      this.useAbility(true, abilityCopy, ally, targets, party, true, undefined, undefined, false);
    }

    if (abilityCopy.name === "Chain Lightning" || abilityCopy.name === "Brotherly Contest" || abilityCopy.name === "Destruction" || abilityCopy.name === "Lightning Storm") {
      if (userEffects.some(item => item.type === StatusEffectEnum.RepeatDamageAfterDelay)) {
        userEffects.filter(item => item.type === StatusEffectEnum.RepeatDamageAfterDelay).forEach(effect => {
          effect.effectiveness = damageDealt;
        });
      }
    }

    var passionateRhythm = this.lookupService.characterHasAbility("Passionate Rhythm", user);
    if (passionateRhythm !== undefined) {
      var copy = this.globalService.makeStatusEffectCopy(passionateRhythm.userEffect[0]);
      var aphrodite = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Aphrodite);
      if (aphrodite !== undefined) {
        var passionateRhythmUpgrade = aphrodite.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
        if (passionateRhythmUpgrade !== undefined && passionateRhythmUpgrade.userEffect.length > 0)
          copy.effectiveness += passionateRhythmUpgrade.userEffect[0].effectiveness;
      }

      if (ally !== undefined)
        this.applyStatusEffect(copy, ally, party, user);

      if (this.checkForAphroditeSetBonus(user)) {
        var newCopy = this.globalService.makeStatusEffectCopy(passionateRhythm.userEffect[0]);
        newCopy.type = StatusEffectEnum.PassionateRhythmAutoAttack;
        if (aphrodite !== undefined) {
          var passionateRhythmUpgrade = aphrodite.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
          if (passionateRhythmUpgrade !== undefined && passionateRhythmUpgrade.userEffect.length > 0)
            newCopy.effectiveness += passionateRhythmUpgrade.userEffect[0].effectiveness;
        }

        if (ally !== undefined)
          this.applyStatusEffect(newCopy, ally, party, user);
      }
    }

    if (abilityCopy.name === "Lightning Barrage") {
      var onslaught = this.lookupService.characterHasAbility("Onslaught", user);
      if (onslaught !== undefined)
        this.useAbility(true, onslaught, user, targets, party, true, undefined, undefined, false);
    }

    if (abilityCopy.name === "War and Love") {
      var onslaught = this.lookupService.characterHasAbility("Onslaught", user);
      if (onslaught !== undefined)
        this.useAbility(true, onslaught, user, targets, party, true, undefined, undefined, false);
    }

    if (abilityCopy.name === "Course of Battle") {
      var onslaught = this.lookupService.characterHasAbility("Onslaught", user);
      if (onslaught !== undefined)
        this.useAbility(true, onslaught, user, targets, party, true, undefined, undefined, false);

      var ostinato = this.lookupService.characterHasAbility("Ostinato", user);
      if (ostinato !== undefined && this.battle !== undefined) {
        this.useAbility(true, ostinato, user, targets, party, true, undefined, undefined, false);
      }
    }

    if (abilityCopy.name === "Passing Judgment") {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", user);
      if (ostinato !== undefined && this.battle !== undefined) {
        this.useAbility(true, ostinato, user, targets, party, true, undefined, undefined, false);

        var dispenserOfDuesEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
        if (dispenserOfDuesEffect !== undefined) {
          dispenserOfDuesEffect.effectiveness += abilityCopy.effectiveness;
        }
      }
    }

    if (abilityCopy.name === "Animal Instincts") {
      var shapeshift = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
      if (shapeshift !== undefined) {
        if (shapeshift.count === 1) {
          var strut = this.lookupService.characterHasAbility("Strut", user);
          if (strut !== undefined)
            this.useAbility(true, strut, user, targets, party, true, undefined, undefined, false);
        }
        if (shapeshift.count === 2) {
          var espionage = this.lookupService.characterHasAbility("Espionage", user);
          if (espionage !== undefined)
            this.useAbility(true, espionage, user, targets, party, true, undefined, undefined, false);
        }
        if (shapeshift.count === 3) {
          var puncture = this.lookupService.characterHasAbility("Puncture", user);
          if (puncture !== undefined)
            this.useAbility(true, puncture, user, targets, party, true, undefined, undefined, false);
        }
      }
    }

    var lordOfTheUnderworldEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LordOfTheUnderworld);
    var discordantMelody = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DiscordantMelody);
    if (lordOfTheUnderworldEffect !== undefined && discordantMelody !== undefined)
      lordOfTheUnderworldEffect.duration += discordantMelody.maxCount;

    if (isPartyUsing && abilityCopy.name === "Hellfire") {
      this.checkForHadesSetBonus(user, potentialTargets, party);
    }

    if (isPartyUsing && !fromRepeat) {
      this.checkForPoseidonSetBonus(user, potentialTargets, party, abilityCopy);
    }

    if (isPartyUsing && damageDealt > 0)
      this.checkForZeusSetBonus(user, target, damageDealt);

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

      if (rng <= chanceToStun.effectiveness && !target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.StunImmunity)) {
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

    if (user.name === "Rainbow-Scaled Fish" && abilityCopy.name === "Wild Rush" && !fromRepeat) {
      var current = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Current);
      if (current !== undefined) {
        for (var i = 0; i < current.stackCount; i++) {
          abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true, undefined, undefined, undefined, undefined, ElementalTypeEnum.Water));
        }
      }
    }

    if (user.name === "Gargantuan Crab" && abilityCopy.name === "March of the Crabs" && !fromRepeat) {
      var current = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Cancer);
      if (current !== undefined) {
        for (var i = 0; i < current.stackCount; i++) {
          abilityCopy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
        }
      }
    }

    this.handleUserEffects(isPartyUsing, userEffects, user, party, potentialTargets, damageDealt, abilityCopy, healedAmount, isGodAbility);
    this.handleTargetEffects(isPartyUsing, targetEffects, user, target, potentialTargets, party, damageDealt, abilityCopy.targetsAllies, abilityCopy);

    if (isPartyUsing) {
      this.checkForEquipmentEffect(EffectTriggerEnum.OnAbilityUse, user, target, party, targets, undefined, abilityCopy.targetsAllies);
      this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnAbilityUse, user, target, party, targets, undefined, abilityCopy.targetsAllies, undefined, undefined, damageDealt);
      this.checkForEquipmentEffect(EffectTriggerEnum.TargetAboveHpPercentAbility, user, target, party, targets, undefined, abilityCopy.targetsAllies, undefined, undefined, damageDealt);
      if (wasDamageCritical)
        this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnCriticalHit, user, target, party, targets, undefined, abilityCopy.targetsAllies);
      if (abilityCopy.heals)
        this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnHeal, user, target, party, targets, undefined, abilityCopy.targetsAllies, undefined, undefined, undefined, healedAmount);
    }
    else {
      if (abilityCopy.dealsDirectDamage) {
        if (abilityCopy.isAoe) {
          targets.forEach(potentialTarget => {
            this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenDamageTaken, potentialTarget, user, targets, party, undefined, abilityCopy.targetsAllies);

            if (!wasDamageCritical) {
              var scathingBeauty = potentialTarget.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique);
              if (scathingBeauty !== undefined) {
                var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.ScathingBeautyUnique);
                if (uniqueEffect !== undefined && scathingBeauty.stackCount < uniqueEffect.getMajorEffectLevel()) {
                  scathingBeauty.stackCount += 1;
                }
              }

              this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken, potentialTarget, user, targets, party);
            }
          });
        }
        else {
          this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenDamageTaken, target, user, targets, party, undefined, abilityCopy.targetsAllies);

          if (!wasDamageCritical) {
            var scathingBeauty = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeauty);
            if (scathingBeauty !== undefined) {
              var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.ScathingBeautyUnique);
              if (uniqueEffect !== undefined && scathingBeauty.stackCount < uniqueEffect.getMajorEffectLevel()) {
                scathingBeauty.stackCount += 1;
              }
            }

            this.checkForEquipmentEffect(EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken, target, user, targets, party);
          }
        }
      }
    }

    if (isPartyUsing)
      this.altarService.incrementAltarCount(AltarConditionEnum.AbilityUse);

    //code specific to Hecate
    if (user.name === "Hecate" && user.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.RedHerb || item.type === StatusEffectEnum.YellowHerb || item.type === StatusEffectEnum.GreenHerb).length >= 2) {
      var redHerbCount = user.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.RedHerb).length;
      var greenHerbCount = user.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.GreenHerb).length;
      var yellowHerbCount = user.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.YellowHerb).length;
      var herbsUsed = false;

      if (redHerbCount === 1 && greenHerbCount === 1) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);
        
        var mixRedHerb = new Ability();
        mixRedHerb.name = "Red Green Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;               
        mixRedHerb.dealsDirectDamage = false;
        mixRedHerb.heals = true;
        mixRedHerb.effectiveness = 15;
        mixRedHerb.targetsAllies = true;
        mixRedHerb.targetType = TargetEnum.Self;
        mixRedHerb.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 45, 3, false, true, false));
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }
      else if (redHerbCount === 1 && yellowHerbCount === 1) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);
        
        var mixRedHerb = new Ability();
        mixRedHerb.name = "Yellow Red Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;        
        mixRedHerb.dealsDirectDamage = true;
        mixRedHerb.effectiveness = 45;        
        mixRedHerb.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 45, 1.5, false, true, false));
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }

      else if (yellowHerbCount === 1 && greenHerbCount === 1) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);
        
        var mixRedHerb = new Ability();
        mixRedHerb.name = "Yellow Green Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;               
        mixRedHerb.dealsDirectDamage = false;
        mixRedHerb.heals = true;
        mixRedHerb.effectiveness = 12;
        mixRedHerb.targetsAllies = true;
        mixRedHerb.targetType = TargetEnum.Self;
        mixRedHerb.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 45, .7, false, true, false));
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }

      else if (redHerbCount >= 2) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);

        var mixRedHerb = new Ability();
        mixRedHerb.name = "Double Red Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;        
        mixRedHerb.dealsDirectDamage = true;
        mixRedHerb.effectiveness = 45;
        mixRedHerb.isAoe = true;
        mixRedHerb.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DealMissingHpPercent, 0, .5, true, false, true));
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }
      else if (greenHerbCount >= 2) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);
        
        var mixRedHerb = new Ability();
        mixRedHerb.name = "Double Green Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;               
        mixRedHerb.dealsDirectDamage = false;
        mixRedHerb.heals = true;
        mixRedHerb.effectiveness = 30;
        mixRedHerb.targetsAllies = true;
        mixRedHerb.targetType = TargetEnum.Self;
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }
      else if (yellowHerbCount >= 2) {        
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RedHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.GreenHerb);
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.YellowHerb);
        
        var mixRedHerb = new Ability();
        mixRedHerb.name = "Double Yellow Herb";
        mixRedHerb.isAvailable = true;
        mixRedHerb.cooldown = mixRedHerb.currentCooldown = 0;        
        mixRedHerb.dealsDirectDamage = false;        
        mixRedHerb.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 45, .5, false, true, false));
        mixRedHerb.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 45, 2, false, true, false));
        this.useAbility(isPartyUsing, mixRedHerb, user, targets, party, isGodAbility);
      }
    }

    //code specific to Ixion
    if (user.name === "Ixion" && user.battleInfo.statusEffects.some(item => (item.type === StatusEffectEnum.AgilityUp || item.type === StatusEffectEnum.AttackUp) && item.stackCount > 3)) {
      var flamesOfTartarus = user.abilityList.find(item => item.name === "Flames of Tartarus");
      if (flamesOfTartarus !== undefined) {
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item =>
          !((item.type === StatusEffectEnum.AgilityUp || item.type === StatusEffectEnum.AttackUp) && item.stackCount > 3));

        this.useAbility(isPartyUsing, flamesOfTartarus, user, targets, party, isGodAbility);
      }
    }

    if (user.name === "Mimas") {
      var rockCount = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock)?.stackCount;
      if (rockCount !== undefined && rockCount >= 5) {
        var shatter = user.abilityList.find(item => item.name === "Shatter");
        if (shatter !== undefined) {
          user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.StockpileRock);
          this.useAbility(isPartyUsing, shatter, user, targets, party, isGodAbility);
        }
      }
    }

    if (user.name === "Porphyrion") {
      if (abilityCopy.name === "Earthen Offense") {
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.EarthenDefense);

        var rockfall = user.abilityList.find(item => item.name === "Rockfall");
        if (rockfall !== undefined) {
          this.useAbility(isPartyUsing, rockfall, user, targets, party, isGodAbility);
          user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.StockpileRock);
        }

      }
      if (abilityCopy.name === "Earthen Defense") {
        user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.EarthenOffense);
        var rocks = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock);
        if (rocks === undefined) {
          user.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.StockpileRock, -1, 1, false, true, false, undefined, undefined, true));
          user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock)!.stackCount = 5;
        }
        else
          rocks.stackCount += 5;
      }
    }

    var secondWind = this.lookupService.characterHasAbility("Second Wind", user);

    if (secondWind !== undefined) {
      var statusEffect = this.globalService.makeStatusEffectCopy(secondWind.userEffect[0]);

      if (!user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack)) {
        var permanentUpgrades = this.getGodPermanentAbilityUpgrades(secondWind, user);

        if (permanentUpgrades !== undefined && permanentUpgrades.userEffect.length > 0)
          statusEffect.effectiveness *= 1 + permanentUpgrades.userEffect[0].effectiveness;

        statusEffect.count = statusEffect.maxCount;
        this.applyStatusEffect(statusEffect, user, party, user);
      }
      else {
        var appliedEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack);
        if (appliedEffect !== undefined) {
          appliedEffect.count = statusEffect.maxCount;
        }
      }
    }

    if (abilityCopy.name === "Crashing Waves" || abilityCopy.name === "Whirlpool" || abilityCopy.name === "Tsunami")
      user.battleInfo.lastUsedPoseidonAbility = true;
    else
      user.battleInfo.lastUsedPoseidonAbility = false;

    if (this.battle !== undefined)
      this.battle.firstAbilityUsed = true;

    if (!keepFlow) {
      user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Flow);
    }

    if (user.level >= this.utilityService.characterOverdriveLevel) {
      user.overdriveInfo.gaugeAmount += user.overdriveInfo.gainPerAbility * this.lookupService.getOverdriveGainMultiplier(user);
      if (user.overdriveInfo.gaugeAmount > user.overdriveInfo.gaugeTotal)
        user.overdriveInfo.gaugeAmount = user.overdriveInfo.gaugeTotal;
    }
    return true;
  }

  handleEnemySpecificAbilityFunctionality(character: Character, ability: Ability, wasDamageCritical: boolean) {
    //Mimon ability Landslide    
    if (ability.name === "Landslide") {
      var rockCount = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock)?.stackCount;
      if (rockCount !== undefined && rockCount >= 3) {
        ability.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 10, .25, false, false, true));
      }
    }

    if (character.name === "Porphyrion") {
      if (wasDamageCritical && (ability.name === "Blitz" || ability.name === "Maim")) {
        ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.StockpileRock, -1, 1, false, true, false, undefined, undefined, true));
      }
    }
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
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
            }

            var willAbilityRepeat = ability.userEffect.some(effect => effect.type === StatusEffectEnum.RepeatAbility) || willAbilityRepeat;

            return !willAbilityRepeat;
          }
        }
      }
    }

    return false;
  }

  checkForFatalAttraction(user: Character, ally?: Character) {
    if (ally === undefined)
      return 1;

    var fatalAttraction = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FatalAttraction);
    if (fatalAttraction === undefined)
      return 1;

    fatalAttraction.count = 2;

    return fatalAttraction.effectiveness;
  }

  handleUserEffects(isPartyUsing: boolean, userEffect: StatusEffect[], user: Character, party: Character[], targets: Character[], damageDealt: number = 0, originalAbility?: Ability, healingDone: number = 0, fromGodAbility: boolean = false) {
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
          else if (appliedStatusEffect.dotType === dotTypeEnum.ScorpionStinger)
            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedMaxHp(user, true) * appliedStatusEffect.effectiveness;
        }

        if (appliedStatusEffect.type === StatusEffectEnum.HealOverTime) {
          if (originalAbility !== undefined && originalAbility.name === "Course of Battle")
            appliedStatusEffect.effectiveness = ((this.lookupService.getAdjustedResistance(user, true) / 2) + (this.lookupService.getAdjustedAttack(user, originalAbility, true) / 2)) * appliedStatusEffect.effectiveness;
          else
            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedResistance(user, true) * appliedStatusEffect.effectiveness;
        }

        if (appliedStatusEffect.dotType !== dotTypeEnum.None)
          this.applyStatusEffect(appliedStatusEffect, user, party, user, originalAbility);
      });
    }

    party.forEach(member => {
      if (member.battleInfo.statusEffects.some(item => item.isInstant)) {
        member.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDown) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDown); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHp) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(true), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHp); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHpAvoidDuplicate) {
            var randomStatus = this.getRandomPrimaryStatDownStatusEffectExcludeDuplicate(true, user);
            if (randomStatus !== undefined) {
              var statusEffect = this.globalService.createStatusEffect(randomStatus, instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks);
              this.applyStatusEffect(statusEffect, user, party, user);
            }
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHpAvoidDuplicate); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatUp) {
            var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatUpStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, true, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks);
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatUp); });
          }
          if (instantEffect.type === StatusEffectEnum.RandomElementalAbsorption) {
            var statusEffect = this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, instantEffect.duration, instantEffect.effectiveness, false, true, instantEffect.isAoe, undefined, undefined, undefined, this.lookupService.getRandomElement());
            this.applyStatusEffect(statusEffect, user, party, user);
            party.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomElementalAbsorption); });
          }

          if (instantEffect.type === StatusEffectEnum.PowerOfLove) {
            party.forEach(partyMember => {
              var highestStatBuff = this.getHighestStatBuff(partyMember, true, instantEffect.duration, instantEffect.effectiveness);
              if (highestStatBuff !== undefined)
                this.applyStatusEffect(highestStatBuff, partyMember, party, user);
            });
          }

          if (instantEffect.type === StatusEffectEnum.FreeAbilityCastChance) {
            var abilityList: Ability[] = [];
            var rng = this.utilityService.getRandomNumber(0, 1);
            if (rng <= instantEffect.effectiveness) {

              user.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
                abilityList.push(ability);
              });

              if (user.assignedGod1 !== undefined && user.assignedGod1 !== GodEnum.None) {
                var god = this.globalService.globalVar.gods.find(item => item.type === user!.assignedGod1);
                if (god !== undefined) {
                  if (god.abilityList !== undefined && god.abilityList.length > 0)
                    god.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
                      abilityList.push(ability);
                    });
                }
              }

              if (user.assignedGod2 !== undefined && user.assignedGod2 !== GodEnum.None) {
                var god = this.globalService.globalVar.gods.find(item => item.type === user!.assignedGod2);
                if (god !== undefined) {
                  if (god.abilityList !== undefined && god.abilityList.length > 0)
                    god.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
                      abilityList.push(ability);
                    });
                }
              }

              instantEffect.type = StatusEffectEnum.None;
              var abilityRng = this.utilityService.getRandomInteger(0, abilityList.length - 1);
              this.useAbility(isPartyUsing, abilityList[abilityRng], user, targets, party, false);
            }
          }

          if (instantEffect.type === StatusEffectEnum.Overheal) {
            var adjustedHealingDone = user.battleStats.healingDone;

            var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
            if (healingDoneModifier !== undefined)
              adjustedHealingDone *= healingDoneModifier.effectiveness;

            var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
            if (scathedBeautyUniqueEffect !== undefined)
              adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

            var healAmount = instantEffect.effectiveness * (1 + adjustedHealingDone);
            var currentBarrierAmount = member.battleInfo.barrierValue;
            var overHealedAmount = 0;

            if (member !== undefined) {
              healAmount = this.gainHp(member, healAmount, true, instantEffect.threshold);
              overHealedAmount = member.battleInfo.barrierValue - currentBarrierAmount;
            }

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong> gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healAmount)) + " HP" + (overHealedAmount > 0 ? " and a " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(overHealedAmount)) + " HP barrier" : "") + (instantEffect.abilityName !== undefined && instantEffect.abilityName !== "" ? " from " + instantEffect.abilityName : "") + ".";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          }

          if (instantEffect.type === StatusEffectEnum.InstantHeal) {
            var adjustedHealingDone = user.battleStats.healingDone;

            var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
            if (healingDoneModifier !== undefined)
              adjustedHealingDone *= healingDoneModifier.effectiveness;

            var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
            if (scathedBeautyUniqueEffect !== undefined)
              adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

            var healAmount = damageDealt * instantEffect.effectiveness * (1 + adjustedHealingDone);

            if (member !== undefined) {
              healAmount = this.gainHp(member, healAmount);
            }

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong> gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healAmount)) + " HP" + (instantEffect.abilityName !== undefined && instantEffect.abilityName !== "" ? " from " + instantEffect.abilityName : "") + ".";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          }

          if (instantEffect.type === StatusEffectEnum.InstantHealBasedOnMaxHpPercent) {
            var adjustedHealingDone = user.battleStats.healingDone;

            var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
            if (healingDoneModifier !== undefined)
              adjustedHealingDone *= healingDoneModifier.effectiveness;

            var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
            if (scathedBeautyUniqueEffect !== undefined)
              adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

            var healAmount = this.lookupService.getAdjustedMaxHp(member, true, false) * instantEffect.effectiveness * (1 + adjustedHealingDone);

            if (member !== undefined)
              healAmount = this.gainHp(member, healAmount);

            if (this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong> gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healAmount)) + " HP" + (instantEffect.abilityName !== undefined && instantEffect.abilityName !== "" ? " from " + instantEffect.abilityName : "") + ".";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          }


          if (instantEffect.type === StatusEffectEnum.InstantOstinato) {
            var ostinato = this.lookupService.characterHasAbility("Ostinato", user);
            if (ostinato !== undefined && this.battle !== undefined) {
              user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.InstantOstinato);
              this.useAbility(true, ostinato, user, targets, party, true, instantEffect.effectiveness, undefined, false);
            }
          }

          if (instantEffect.type === StatusEffectEnum.DebuffDurationIncrease) {
            if (member !== undefined && member.battleInfo.statusEffects.length > 0) {
              member.battleInfo.statusEffects.filter(item => !item.isPositive && item.duration > 0).forEach(effect => {
                effect.duration *= instantEffect.effectiveness;
              });
            }
          }

          if (instantEffect.type === StatusEffectEnum.ReduceCooldowns) {
            var isMultiplicative = false;
            if (originalAbility !== undefined && originalAbility.name === "Warming Waters")
              isMultiplicative = true;
            else {
              if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong>'s cooldowns are reduced from " + (Number.isNaN(instantEffect.caster) ? "" : this.dictionaryService.getItemName(Number(instantEffect.caster))) + "'s effect.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
              }
            }
            this.reduceCharacterCooldowns(user, 1 - (instantEffect.effectiveness - 1), isMultiplicative);
          }

          if (instantEffect.type === StatusEffectEnum.InstantAutoAttack) {
            instantEffect.type = StatusEffectEnum.None; //because handleAutoAttack calls this method as well, need to prevent this from being recast
            var fromSpecialDelivery = false;
            if (originalAbility !== undefined && originalAbility.name === "Special Delivery")
              fromSpecialDelivery = true;

            this.handleAutoAttack(isPartyUsing, member, targets, party, instantEffect.effectiveness, false, fromSpecialDelivery); //prevent it from infinite looping itself
          }

          if (instantEffect.type === StatusEffectEnum.RepeatAbility && originalAbility !== undefined) {
            var repeatCount = originalAbility.userEffect.filter(effect => effect.type === StatusEffectEnum.RepeatAbility).length;

            var elements: ElementalTypeEnum[] = [];
            if (instantEffect.element !== undefined) {
              originalAbility.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).forEach(repeat => {
                elements.push(repeat.element);
              });
            }

            originalAbility.userEffect = originalAbility.userEffect.filter(item => item.type !== StatusEffectEnum.RepeatAbility);
            for (var i = 0; i < repeatCount; i++) {
              if (elements.length > 0 && elements[i] !== undefined) {
                originalAbility.elementalType = elements[i];
              }

              this.useAbility(isPartyUsing, originalAbility, user, targets, party, fromGodAbility, undefined, i < repeatCount - 1, undefined, true);
            }
          }

          if (instantEffect.type === StatusEffectEnum.Sap) {
            var sapDamage = instantEffect.effectiveness * this.lookupService.getAdjustedAttack(member, undefined, isPartyUsing);

            var target = this.getTarget(user, targets, TargetEnum.Random);
            if (target !== undefined) {
              sapDamage = this.dealTrueDamage(isPartyUsing, target, sapDamage, undefined, undefined, true);

              var healAmount = this.gainHp(user, sapDamage);

              if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong> deals " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(sapDamage)) + " damage to " + target.name + " and gains " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healAmount)) + " HP" + (instantEffect.abilityName !== undefined && instantEffect.abilityName !== "" ? " from " + instantEffect.abilityName : "") + ".";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
              }
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
            var barrierAmount = 0;
            barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedResistance(user, isPartyUsing));

            if (instantEffect.dotType === dotTypeEnum.BasedOnHeal)
              barrierAmount = Math.round(instantEffect.effectiveness * healingDone);
            if (instantEffect.dotType === dotTypeEnum.UserCurrentMaxHpPercent)
              barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedMaxHp(user, true));

            if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Hope) {
              instantEffect.threshold *= this.utilityService.hopeThresholdMultiplier;
            }

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

                if (partyMember.battleInfo.barrierValue < this.lookupService.getAdjustedMaxHp(partyMember, true, false) * instantEffect.threshold) {
                  partyMember.battleInfo.barrierValue += barrierAmount;

                  //if you went over threshold, set it back down 
                  if (partyMember.battleInfo.barrierValue > this.lookupService.getAdjustedMaxHp(partyMember, true, false) * instantEffect.threshold) {
                    partyMember.battleInfo.barrierValue = Math.round(this.lookupService.getAdjustedMaxHp(partyMember, true, false) * instantEffect.threshold);
                  }
                }

                partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Barrier);
              });
              if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
                (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields allies for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, barrierAmount) + " damage.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
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
              if ((originalAbility !== undefined && originalAbility?.targetType === TargetEnum.Random) || (instantEffect.target === TargetEnum.Random))
                barrierTarget = this.lookupService.getRandomPartyMember(party);
              else
                barrierTarget = this.getTarget(user, party, TargetEnum.LowestHpPercent);

              if (barrierTarget === undefined)
                return;

              if (barrierTarget.battleInfo.barrierValue < this.lookupService.getAdjustedMaxHp(barrierTarget, true, false) * instantEffect.threshold) {
                barrierTarget.battleInfo.barrierValue += barrierAmount;

                //if you went over threshold, set it back down                 
                if (barrierTarget.battleInfo.barrierValue > this.lookupService.getAdjustedMaxHp(barrierTarget, true, false) * instantEffect.threshold) {
                  barrierTarget.battleInfo.barrierValue = Math.round(this.lookupService.getAdjustedMaxHp(barrierTarget, true, false) * instantEffect.threshold);
                }
              }

              if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
                (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields " + "<strong class='" + this.globalService.getCharacterColorClassText(barrierTarget.type) + "'>" + barrierTarget.name + "</strong> for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, barrierAmount) + " damage.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
              }
            }
          }

          if (instantEffect.type === StatusEffectEnum.SelfBarrier) {
            var barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing));
            if (instantEffect.dotType === dotTypeEnum.BasedOnHeal)
              barrierAmount = Math.round(instantEffect.effectiveness * healingDone);
            if (instantEffect.dotType === dotTypeEnum.UserCurrentMaxHpPercent)
              barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedMaxHp(user, true));
            if (instantEffect.dotType === dotTypeEnum.BasedOnResistance)
              barrierAmount = Math.round(instantEffect.effectiveness * this.lookupService.getAdjustedResistance(user, isPartyUsing));

            user.trackedStats.healsMade += 1;
            user.trackedStats.healingDone += barrierAmount;

            if (user.trackedStats.healsMade >= this.utilityService.overdriveHealsNeededToUnlockHarmony &&
              !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Harmony))
              user.unlockedOverdrives.push(OverdriveNameEnum.Harmony);
            if (user.trackedStats.healingDone >= this.utilityService.overdriveHealingNeededToUnlockPreservation &&
              !user.unlockedOverdrives.some(item => item === OverdriveNameEnum.Preservation))
              user.unlockedOverdrives.push(OverdriveNameEnum.Preservation);

            if (user.battleInfo.barrierValue < this.lookupService.getAdjustedMaxHp(user, true, false) * instantEffect.threshold) {
              user.battleInfo.barrierValue += barrierAmount;

              //if you went over threshold, set it back down 
              if (user.battleInfo.barrierValue > this.lookupService.getAdjustedMaxHp(user, true, false) * instantEffect.threshold) {
                user.battleInfo.barrierValue = Math.round(this.lookupService.getAdjustedMaxHp(user, true, false) * instantEffect.threshold);
              }
            }

            if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
              (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(user.type) + "'>" + user.name + "</strong> shields themselves for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, barrierAmount) + " damage.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseAbility, gameLogEntry, this.globalService.globalVar);
            }
          }
        });
      }

      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => !item.isInstant);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.None);
    });
  }

  handleTargetEffects(isPartyUsing: boolean, targetEffect: StatusEffect[], user: Character, target: Character, potentialTargets: Character[], party: Character[], damageDealt: number = 0, abilityTargetedAllies: boolean = false, originalAbility?: Ability) {
    if (targetEffect.length > 0) {
      var resetTarget: Character | undefined = undefined;
      var shouldResetTarget = false;
      targetEffect.forEach(gainedStatusEffect => {
        var appliedStatusEffect = this.globalService.makeStatusEffectCopy(gainedStatusEffect);

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (abilityTargetedAllies && !gainedStatusEffect.targetsAllies) {
            shouldResetTarget = true;
            resetTarget = this.getTarget(user, potentialTargets, TargetEnum.Random);
          }

          if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnAttack) {

            if (originalAbility !== undefined && originalAbility.name === "Rupture") {
              var permanentAbilityUpgrades = this.getGodPermanentAbilityUpgrades(originalAbility, user);
              if (permanentAbilityUpgrades !== undefined && permanentAbilityUpgrades.targetEffect !== undefined &&
                permanentAbilityUpgrades.targetEffect.length > 0) {
                appliedStatusEffect.effectiveness += permanentAbilityUpgrades.targetEffect[0].effectiveness;
              }
            }

            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedAttack(user, undefined, isPartyUsing) * appliedStatusEffect.effectiveness;
          }
          else if (appliedStatusEffect.dotType === dotTypeEnum.BasedOnDamage) {
            appliedStatusEffect.effectiveness = damageDealt * appliedStatusEffect.effectiveness;
          }
          else if (appliedStatusEffect.dotType === dotTypeEnum.UserCurrentMaxHpPercent)
            appliedStatusEffect.effectiveness = user.battleStats.currentHp * appliedStatusEffect.effectiveness;
          else if (appliedStatusEffect.dotType === dotTypeEnum.ScorpionStinger) {
            appliedStatusEffect.effectiveness = this.lookupService.getAdjustedMaxHp(user, true) * appliedStatusEffect.effectiveness;
            var count = target.battleInfo.stingerCount.find(item => item[0] === user.type);
            if (count === undefined) {
              target.battleInfo.stingerCount.push([user.type, 1]);
            }
            else {
              appliedStatusEffect.effectiveness *= 1 + (count[1] * (1 / 10));
              count[1] += 1;
            }
          }
          else if (appliedStatusEffect.dotType === dotTypeEnum.ScorpionStingerUnique) {
            var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.ScorpionStingerUnique);
            if (uniqueEffect !== undefined) {
              appliedStatusEffect.effectiveness = this.lookupService.getAdjustedMaxHp(user, true) * (appliedStatusEffect.effectiveness * (uniqueEffect.getMinorEffectLevel() * .1));
              var count = target.battleInfo.stingerCount.find(item => item[0] === user.type);

              if (count === undefined)
                target.battleInfo.stingerCount.push([user.type, 1]);
              else {
                appliedStatusEffect.effectiveness *= 1 + (count[1] * ((1 / 10) * uniqueEffect.getMajorEffectLevel()));
                count[1] += 1;
              }
            }
          }
        }

        if (appliedStatusEffect.type === StatusEffectEnum.HealOverTime) {
          appliedStatusEffect.effectiveness = this.lookupService.getAdjustedResistance(user, true) * appliedStatusEffect.effectiveness;
        }

        if (target !== undefined && appliedStatusEffect.dotType !== dotTypeEnum.None && (!shouldResetTarget ||
          (shouldResetTarget && resetTarget !== undefined))) {
          this.applyStatusEffect(appliedStatusEffect, resetTarget !== undefined ? resetTarget : target, potentialTargets, user, originalAbility);
        }

        var mark = user.abilityList.find(item => item.name === "Mark" && item.isAvailable);
        if (!abilityTargetedAllies && mark !== undefined) {
          var markEffect = this.globalService.makeStatusEffectCopy(mark.targetEffect[0]);
          markEffect.duration = gainedStatusEffect.duration;
          markEffect.isAoe = gainedStatusEffect.isAoe;

          if (target !== undefined)
            this.applyStatusEffect(markEffect, target, potentialTargets, user, mark);
        }
      });
    }

    //check all instant effects (maybe make its own function?)    
    var totalTrueDamageDealt = 0;
    var totalTrueDamageHitCount = 0;

    if (target.battleInfo.statusEffects.some(item => item.isInstant)) {
      target.battleInfo.statusEffects.filter(item => item.isInstant).forEach(instantEffect => {
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDown) {
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks, undefined, undefined, undefined, undefined, undefined, true);
          this.applyStatusEffect(statusEffect, target, potentialTargets, user);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDown); });
        }
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHp) {
          var randomTarget: Character | undefined = target;
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(true), instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks, undefined, undefined, undefined, undefined, undefined, true);

          if (originalAbility !== undefined && originalAbility.name === "Insanity") {
            randomTarget = this.getTarget(user, potentialTargets);
            if (randomTarget === undefined)
              randomTarget = target;
          }

          this.applyStatusEffect(statusEffect, randomTarget, potentialTargets, user, originalAbility);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHp); });
        }

        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHpAvoidDuplicate) {
          var randomTarget: Character | undefined = target;
          var randomStatus = this.getRandomPrimaryStatDownStatusEffectExcludeDuplicate(true, randomTarget);
          if (randomStatus !== undefined) {
            var statusEffect = this.globalService.createStatusEffect(randomStatus, instantEffect.duration, instantEffect.effectiveness, false, false, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks, undefined, undefined, undefined, undefined, undefined, true);
            this.applyStatusEffect(statusEffect, randomTarget, potentialTargets, user, originalAbility);
          }
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatDownExcludeHpAvoidDuplicate); });
        }
        if (instantEffect.type === StatusEffectEnum.RandomPrimaryStatUp) {
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatUpStatusEffect(), instantEffect.duration, instantEffect.effectiveness, false, true, instantEffect.isAoe, undefined, undefined, instantEffect.effectStacks, undefined, undefined, undefined, undefined, undefined, true);
          this.applyStatusEffect(statusEffect, target, potentialTargets, user);
          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RandomPrimaryStatUp); });
        }

        if (instantEffect.type === StatusEffectEnum.InstantHeal) {
          var adjustedHealingDone = user.battleStats.healingDone;

          var healingDoneModifier = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingDoneUp);
          if (healingDoneModifier !== undefined)
            adjustedHealingDone *= healingDoneModifier.effectiveness;

          var scathedBeautyUniqueEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique && item.stackCount >= 4);
          if (scathedBeautyUniqueEffect !== undefined)
            adjustedHealingDone *= 1 + (scathedBeautyUniqueEffect.effectiveness / 10);

          var healAmount = damageDealt * instantEffect.effectiveness * (1 + adjustedHealingDone);

          if (target !== undefined)
            this.gainHp(target, healAmount);
        }

        if (instantEffect.type === StatusEffectEnum.BalanceHp) {
          var maxHpAggregate = 0;
          potentialTargets.forEach(potentialTarget => maxHpAggregate += potentialTarget.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(potentialTarget));
          maxHpAggregate /= potentialTargets.length;
          potentialTargets.forEach(potentialTarget => potentialTarget.battleStats.currentHp = maxHpAggregate * this.lookupService.getAdjustedMaxHp(potentialTarget));
        }

        if (instantEffect.type === StatusEffectEnum.RemoveBuff) {
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
              var potentialTargetBuffs = newTarget.battleInfo.statusEffects.filter(item => item.isPositive && !this.globalService.isBuffUnremovable(item));
              if (potentialTargetBuffs.length === 0)
                return;

              var randomBuff = potentialTargetBuffs[this.utilityService.getRandomInteger(0, potentialTargetBuffs.length - 1)];

              if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
                var effectGameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " loses " + this.lookupService.getStatusEffectName(randomBuff.type) + "!";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, effectGameLogEntry, this.globalService.globalVar);

              }
              newTarget.battleInfo.statusEffects = newTarget.battleInfo.statusEffects.filter(item => item !== randomBuff);
            });
          }
        }

        if (instantEffect.type === StatusEffectEnum.TransferStatusEffect) {
          var negativeStatusEffects = user.battleInfo.statusEffects.filter(item => !item.isPositive);
          var rng = this.utilityService.getRandomInteger(0, negativeStatusEffects.length - 1);
          target.battleInfo.statusEffects.push(negativeStatusEffects[rng]);
          user.battleInfo.statusEffects = user.battleInfo.statusEffects.filter(item => item !== negativeStatusEffects[rng]);
        }

        if (instantEffect.type === StatusEffectEnum.ResetRandomCooldown) {
          var abilityList: Ability[] = [];

          if (target !== undefined) {
            target.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
              abilityList.push(ability);
            });

            if (target.assignedGod1 !== undefined && target.assignedGod1 !== GodEnum.None) {
              var god = this.globalService.globalVar.gods.find(item => item.type === target!.assignedGod1);
              if (god !== undefined) {
                if (god.abilityList !== undefined && god.abilityList.length > 0)
                  god.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
                    abilityList.push(ability);
                  });
              }
            }

            if (target.assignedGod2 !== undefined && target.assignedGod2 !== GodEnum.None) {
              var god = this.globalService.globalVar.gods.find(item => item.type === target!.assignedGod2);
              if (god !== undefined) {
                if (god.abilityList !== undefined && god.abilityList.length > 0)
                  god.abilityList.filter(ability => ability.isAvailable && ability.isActivatable).forEach(ability => {
                    abilityList.push(ability);
                  });
              }
            }

            var rng = this.utilityService.getRandomInteger(0, abilityList.length - 1);
            abilityList[rng].currentCooldown = this.globalService.getAbilityCooldown(abilityList[rng], target, true);
          }
        }

        if (instantEffect.type === StatusEffectEnum.DealMissingHpPercent) {
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
              var missingHp = (this.lookupService.getAdjustedMaxHp(newTarget, true) - newTarget.battleStats.currentHp);
              var damageAmount = missingHp * instantEffect.effectiveness;
              this.dealTrueDamage(isPartyUsing, newTarget, damageAmount, undefined, undefined, true);
              if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
                var effectGameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " loses " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damageAmount) + " HP.";
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, effectGameLogEntry, this.globalService.globalVar);
              }
            })
          }
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
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect") && trueDamageDealt > 0) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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

                  var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect") && totalTrueDamageDealt > 0) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
                  }
                }
              }
            });
          }

          potentialTargets.forEach(partyMember => { partyMember.battleInfo.statusEffects = partyMember.battleInfo.statusEffects.filter(item => !(item.type === StatusEffectEnum.InstantTrueDamage && item.caster === instantEffect.caster)); });
        }

        if (instantEffect.type === StatusEffectEnum.DebuffDurationIncrease) {
          if (target !== undefined && target.battleInfo.statusEffects.length > 0) {
            target.battleInfo.statusEffects.filter(item => !item.isPositive && item.duration > 0).forEach(effect => {
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

              var effectiveness = this.lookupService.getAdjustedMaxHp(newTarget, false) * instantEffect.effectiveness;

              if (instantEffect.threshold !== undefined && instantEffect.threshold !== 1 && effectiveness > instantEffect.threshold)
                effectiveness = instantEffect.threshold;

              var trueDamageDealt = this.dealTrueDamage(isPartyUsing, newTarget, effectiveness, user, instantEffect.element, true);

              if (totalHits === 1) {
                var elementalText = "";
                if (instantEffect.element !== ElementalTypeEnum.None)
                  elementalText = this.getElementalDamageText(instantEffect.element);
                var gameLogEntry = "<strong>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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

                  var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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
                var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(newTarget.type) + "'>" + newTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + elementalText + " damage";
                if (instantEffect.caster === "")
                  gameLogEntry += ".";
                else
                  gameLogEntry += " from " + instantEffect.caster + "'s effect.";

                if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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

                  var gameLogEntry = "<strong>" + newTarget.name + "</strong>" + " takes " + totalHits + " hits from " + castEffect + " for a total of " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(totalTrueDamageDealt)) + elementalText + " damage.";

                  if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
                    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
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

            if (originalAttacker.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ThunderousRiposte))
              elementalType = ElementalTypeEnum.Lightning;

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

            var outburst = this.lookupService.characterHasAbility("Outburst", target);
            if (elementalType !== ElementalTypeEnum.None && outburst !== undefined && (target.battleInfo.outburstElementsUsed === undefined || !target.battleInfo.outburstElementsUsed.some(item => item === elementalType))) { //avoid an infinite loop by not including itself

              if (target.battleInfo.outburstElementsUsed === undefined)
                target.battleInfo.outburstElementsUsed = [];

              target.battleInfo.outburstElementsUsed.push(elementalType);
            }

            var abilityEffectiveness = instantEffect.effectiveness;
            var ally = party.find(item => item.type !== user.type);

            if (elementalType !== ElementalTypeEnum.None)
              elementalText = this.getElementalDamageText(elementalType);
            var damageMultiplier = this.getDamageMultiplier(isPartyUsing, target, targetedEnemy, undefined, false, elementalType, undefined, undefined, undefined, undefined, undefined, ally);
            var isCritical = this.isDamageCritical(target, targetedEnemy);

            var allDamageDealt = this.dealDamage(!isPartyUsing, target, targetedEnemy, isCritical, abilityEffectiveness, damageMultiplier, abilityThatTriggeredCounter, elementalType, GodEnum.Nemesis, party, potentialTargets);
            counterDamageDealt = allDamageDealt[0];

            var additionalDamageTargets = "";
            if (allDamageDealt[1] !== undefined && allDamageDealt[1] > 0) {
              additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[1]) + " blocked by barrier)</i>";
            }
            if (allDamageDealt[2] !== undefined && allDamageDealt[2] > 0) {
              additionalDamageTargets += "<i> (" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, allDamageDealt[2]) + " absorbed)</i>";
            }

            if ((isPartyUsing && this.globalService.globalVar.gameLogSettings.get("partyAbilityUse")) ||
              (!isPartyUsing && this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse"))) {
              var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " counters for " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, counterDamageDealt) + elementalText + " damage on <strong class='" + this.globalService.getCharacterColorClassText(targetedEnemy.type) + "'>" + targetedEnemy.name + "</strong>." + (isCritical ? " <strong>Critical hit!</strong>" : "") + additionalDamageTargets;
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }

            var blisteringRiposte = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlisteringRiposte);
            if (blisteringRiposte !== undefined) {
              this.applyStatusEffect(this.globalService.createDamageOverTimeEffect(9, 3, counterDamageDealt * blisteringRiposte.effectiveness, "Blistering Riposte", dotTypeEnum.TrueDamage), targetedEnemy);
            }

            this.checkForEquipmentEffect(EffectTriggerEnum.TargetAboveHpPercentAbility, target, targetedEnemy, party, potentialTargets, undefined, undefined, undefined, undefined, damageDealt);
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

    if (ability.name === "Overindulge" && user.name === "Man-Eating Agora") {
      var overindulge = this.lookupService.characterHasAbility("Overindulge", user);
      if (overindulge !== undefined) {
        overindulge.currentCooldown = 30;
      }
    }

    if (ability.name === "Engulf") {
      var engulf = this.lookupService.characterHasAbility("Engulf", user);
      if (engulf !== undefined)
        engulf.currentCooldown = 30;
    }
  }

  getHighestStatBuff(character: Character, excludeHp: boolean = false, duration: number, effectiveness: number) {
    var attack = character.battleStats.attack; //this.lookupService.getAdjustedAttack(character);
    var agility = character.battleStats.agility; //this.lookupService.getAdjustedAgility(character);
    var luck = character.battleStats.luck; // this.lookupService.getAdjustedLuck(character);
    var defense = character.battleStats.defense; // this.lookupService.getAdjustedDefense(character);
    var resistance = character.battleStats.resistance; // this.lookupService.getAdjustedResistance(character);
    var maxHp = character.battleStats.maxHp; // this.lookupService.getAdjustedMaxHp(character);
    var fullList = [];
    if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.AttackUp && item.effectiveness > effectiveness))
      fullList.push(attack);
    if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.LuckUp && item.effectiveness > effectiveness))
      fullList.push(luck);
    if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DefenseUp && item.effectiveness > effectiveness))
      fullList.push(defense);
    if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.AgilityUp && item.effectiveness > effectiveness))
      fullList.push(agility);
    if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ResistanceUp && item.effectiveness > effectiveness))
      fullList.push(resistance);
    if (!excludeHp && !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.MaxHpUp && item.effectiveness > effectiveness))
      fullList.push(maxHp);

    fullList.sort(function (a, b) {
      return a - b;
    });

    if (fullList[fullList.length - 1] === maxHp && !excludeHp) {
      return this.globalService.createStatusEffect(StatusEffectEnum.MaxHpUp, duration, effectiveness, false, true);
    }
    else if (fullList[fullList.length - 1] === attack) {
      return this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, duration, effectiveness, false, true);
    }
    else if (fullList[fullList.length - 1] === defense) {
      return this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, duration, effectiveness, false, true);
    }
    else if (fullList[fullList.length - 1] === agility) {
      return this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, duration, effectiveness, false, true);
    }
    else if (fullList[fullList.length - 1] === luck) {
      return this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, duration, effectiveness, false, true);
    }
    else if (fullList[fullList.length - 1] === resistance) {
      return this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, duration, effectiveness, false, true);
    }

    return undefined;
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

  getRandomPrimaryStatDownStatusEffectExcludeDuplicate(excludeHp: boolean = false, target: Character) {
    var options = [];
    if (!target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.AgilityDown))
      options.push(StatusEffectEnum.AgilityDown);
    if (!target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.AttackDown))
      options.push(StatusEffectEnum.AttackDown);
    if (!target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ResistanceDown))
      options.push(StatusEffectEnum.ResistanceDown);
    if (!excludeHp && !target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.MaxHpDown))
      options.push(StatusEffectEnum.MaxHpDown);
    if (!target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DefenseDown))
      options.push(StatusEffectEnum.DefenseDown);
    if (!target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.LuckDown))
      options.push(StatusEffectEnum.LuckDown);

    if (options.length === 0)
      return undefined;

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

  handleConditionalAbilityChanges(ability: Ability, user: Character, party: Character[], fromRepeat: boolean, target?: Character) {
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

    if (ability.name === "First Blood" && !this.battle.firstAbilityUsed && ability.targetEffect.length > 0) {
      ability.targetEffect[0].effectiveness *= ability.secondaryEffectiveness;
    }

    if (ability.name === "Wild Assault" && target !== undefined && !fromRepeat) {
      var debuffCount = this.getUniqueDebuffsOnCharacter(target);

      for (var i = 0; i < debuffCount; i++) {
        ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true, undefined, undefined, undefined, undefined, ElementalTypeEnum.Air));
      }
    }

    if (ability.name === "Outburst" && (user.type === CharacterEnum.Thaumaturge)) {
      var elementsUsed = user.battleInfo.outburstElementsUsed === undefined ? 0 : user.battleInfo.outburstElementsUsed.length;
      user.battleInfo.outburstElementsUsed = [];

      if (elementsUsed > 0) {
        if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Explosion)
          ability.effectiveness *= (elementsUsed * .5) + 1;
        else
          ability.effectiveness *= (elementsUsed * (ability.secondaryEffectiveness - 1)) + 1;
      }
    }

    if (!fromRepeat && this.checkForHeraSetBonus(user) && ability.name === "Puncture" && user.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Strut)) {
      ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
    }

    if (user.overdriveInfo.isActive && user.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Flurry && ability.name === "Palm Strike" && !fromRepeat) {
      ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
    }

    if (ability.name === "Rampage Combo") {
      var craftWeapon = this.lookupService.characterHasAbility("Craft Weapon", user);
      var rampageSmash = this.lookupService.characterHasAbility("Rampage Smash", user);
      if (craftWeapon !== undefined)
        craftWeapon.currentCooldown = 20;
      if (rampageSmash !== undefined)
        rampageSmash.currentCooldown = 20;
    }

    if (ability.name === "Blast Wave") {
      var craftFireLaser = this.lookupService.characterHasAbility("Craft Fire Laser", user);
      var blasting = this.lookupService.characterHasAbility("Blasting", user);
      if (craftFireLaser !== undefined)
        craftFireLaser.currentCooldown = 20;
      if (blasting !== undefined)
        blasting.currentCooldown = 20;
    }
    
    if (ability.name === "Final Wallop") {
      var openingWallop = this.lookupService.characterHasAbility("Opening Wallop", user);
      var thwack = this.lookupService.characterHasAbility("Thwack", user);
      if (openingWallop !== undefined)
        openingWallop.currentCooldown = 10;
      if (thwack !== undefined)
        thwack.currentCooldown = 12;
    }
  }

  handleExtraPoseidonFunctionality(user: Character, ability: Ability) {
    if (ability.name === "Crashing Waves") {
      var effect = ability.targetEffect[0];
      effect.duration += ability.secondaryEffectiveness;
    }

    if (ability.name === "Whirlpool") {
      ability.effectiveness *= ability.secondaryEffectiveness;
    }

    if (ability.name === "Tsunami") {
      for (var i = 0; i < ability.secondaryEffectiveness; i++) {
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

  getCharacterPermanentAbilityUpgrades(baseAbility?: Ability, user?: Character) {
    if (baseAbility === undefined || user === undefined)
      return undefined;

    var permanentUpgrades = user.permanentAbilityUpgrades.find(item => item.requiredLevel === baseAbility.requiredLevel);

    return permanentUpgrades;
  }

  getAbilityEffectiveness(ability: Ability, effectivenessModifier: number, user: Character, isGodAbility: boolean = false) {
    var permanentEffectivenessIncrease = 0;

    if (isGodAbility) {
      var permanentAbilityUpgrades = this.getGodPermanentAbilityUpgrades(ability, user);
      if (permanentAbilityUpgrades !== undefined)
        permanentEffectivenessIncrease = permanentAbilityUpgrades.effectiveness;
    }
    else {
      var permanentCharacterAbilityUpgrades = this.getCharacterPermanentAbilityUpgrades(ability, user);
      if (permanentCharacterAbilityUpgrades !== undefined)
        permanentEffectivenessIncrease = permanentCharacterAbilityUpgrades.effectiveness;
    }

    var effectiveness = (ability.effectiveness + permanentEffectivenessIncrease) * effectivenessModifier;

    return effectiveness;
  }

  handleDamageDealingLink(linkInfo: LinkInfo, ability: Ability, abilityRepeats: boolean = false, linkEffectivenessBonus: number, linkEffectivenessCooldownReduction?: number) {
    var linkMultiplier = 1;

    if (ability.name !== "Barrage" && ability.manuallyTriggered && linkInfo.remainingLinks > 0 && linkInfo.cooldown <= 0) {
      if (!abilityRepeats) {
        linkInfo.remainingLinks -= 1;
        linkInfo.linkChain += 1;
      }

      linkMultiplier = 1 + (this.getLinkChainPercent(linkInfo, abilityRepeats, linkEffectivenessBonus) / 100);

      if (linkInfo.remainingLinks <= 0) {
        linkInfo.linkChain = 0;
        linkInfo.bonusChain = 0;
        linkInfo.cooldown = this.utilityService.linkCooldown;

        if (linkEffectivenessCooldownReduction !== undefined && linkEffectivenessCooldownReduction > 0)
          linkInfo.cooldown -= linkEffectivenessCooldownReduction;
      }
    }

    return linkMultiplier;
  }

  getLinkChainPercent(linkInfo: LinkInfo, abilityRepeats: boolean = false, linkEffectivenessBonus: number) {
    var repeaterBonus = 0; //if an ability repeats, add 1 temporarily so that it doesn't add it every time on repeat

    if (abilityRepeats)
      repeaterBonus += 1;

    //console.log("10 + (" + linkInfo.linkChain + " + " + repeaterBonus + ") * " + this.utilityService.damageLinkBoost + " * (1 + " + linkEffectivenessBonus + ") + " + (linkInfo.bonusChain));
    return 10 + ((linkInfo.linkChain + repeaterBonus) * this.utilityService.damageLinkBoost * (1 + linkEffectivenessBonus)) + (linkInfo.bonusChain);
  }

  getDamageMultiplier(isPartyAttacking: boolean, character: Character, target: Character, additionalDamageMultiplier?: number, isAutoAttack: boolean = false, elementalType: ElementalTypeEnum = ElementalTypeEnum.None, abilityName: string = "", isAoe: boolean = false, willAbilityRepeat: boolean = false, lastOfMultiTarget: boolean = true, ability?: Ability, ally?: Character) {
    var overallDamageMultiplier = 1;

    if (additionalDamageMultiplier !== undefined)
      overallDamageMultiplier *= additionalDamageMultiplier;

    var allyDamageBonus = 1;
    if (ally !== undefined) {
      allyDamageBonus *= 1 + ally.battleStats.allyDamageBonus;

      var protector = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Protector);
      if (protector !== undefined) {
        overallDamageMultiplier *= protector.effectiveness;
      }
    }
    //console.log("ODM after random stuff: " + overallDamageMultiplier);

    var altarMultiplier = 1;
    if (isAutoAttack && isPartyAttacking) {
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
      if (isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesAoeDamageUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesAoeDamageUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HadesRareAoeDamageUp) !== undefined) {
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

    if (isPartyAttacking) {
      if (elementalType === ElementalTypeEnum.Holy && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaRareHolyDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaRareHolyDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Lightning && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusLightningDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusLightningDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Air && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraAirDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraAirDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Lightning && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusRareLightningDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ZeusRareLightningDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Air && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraRareAirDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HeraRareAirDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Water && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonWaterDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonWaterDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (elementalType === ElementalTypeEnum.Water && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonRareWaterDamageIncrease) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.PoseidonRareWaterDamageIncrease);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }

      if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AphroditeRareDamageUp) !== undefined) {
        var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AphroditeRareDamageUp);
        altarMultiplier *= relevantAltarEffect!.effectiveness;
      }
    }

    //check for basic damage up/down buffs
    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageDealtDown ||
        effect.type === StatusEffectEnum.DamageDealtUp ||
        (elementalType === ElementalTypeEnum.Holy && (effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageDown)) ||
        (elementalType === ElementalTypeEnum.Fire && (effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageDown)) ||
        (elementalType === ElementalTypeEnum.Lightning && (effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageDown)) ||
        (elementalType === ElementalTypeEnum.Air && (effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageDown || effect.type === StatusEffectEnum.Shapeshift)) ||
        (elementalType === ElementalTypeEnum.Water && (effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageDown)) ||
        (elementalType === ElementalTypeEnum.Earth && (effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageDown)));

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          overallDamageMultiplier *= effect.effectiveness;
          //console.log("ODM after eles: " + overallDamageMultiplier);
        });
      }
    }

    var energyShield = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.EnergyShield || item.type === StatusEffectEnum.EnergyShieldUnique);
    if (energyShield !== undefined && character.battleInfo.barrierValue > 0) {
      overallDamageMultiplier *= 1 + energyShield.effectiveness;
    }

    var boundingBand = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BoundingBand || (item.type === StatusEffectEnum.BoundingBandUnique && item.count >= 1));
    if (boundingBand !== undefined && isAutoAttack) {
      overallDamageMultiplier *= boundingBand.effectiveness;
    }

    var boundingBandAllAttack = character.battleInfo.statusEffects.find(item => (item.type === StatusEffectEnum.BoundingBandUnique && item.count >= 8));
    if (boundingBandAllAttack !== undefined) {
      overallDamageMultiplier *= boundingBandAllAttack.effectiveness;
    }

    var passionateRhythmAutoAttack = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PassionateRhythmAutoAttack);
    var passionateRhythm = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PassionateRhythm);
    if (passionateRhythmAutoAttack !== undefined && isAutoAttack) {
      overallDamageMultiplier *= passionateRhythmAutoAttack.effectiveness;

      if (!willAbilityRepeat && lastOfMultiTarget)
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.PassionateRhythmAutoAttack);
    }

    if (passionateRhythm !== undefined && !isAutoAttack) {
      overallDamageMultiplier *= passionateRhythm.effectiveness;

      if (!willAbilityRepeat && lastOfMultiTarget)
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.PassionateRhythm);
    }

    var surge = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Surge);
    if (surge !== undefined && !isAutoAttack) {
      overallDamageMultiplier *= surge.effectiveness;

      if (!willAbilityRepeat && lastOfMultiTarget)
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Surge);
    }

    if (target.battleInfo !== undefined && target.battleInfo.statusEffects.length > 0) {
      var damageTakenAggregate = 1;

      var relevantStatusEffects = target.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DamageTakenDown || effect.type === StatusEffectEnum.GaiasBlessing ||
        effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.Retribution || effect.type === StatusEffectEnum.DivineProtection || effect.type === StatusEffectEnum.FriendlyCompetition ||
        (elementalType === ElementalTypeEnum.Holy && (effect.type === StatusEffectEnum.HolyDamageTakenUp || effect.type === StatusEffectEnum.HolyDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Fire && (effect.type === StatusEffectEnum.FireDamageTakenUp || effect.type === StatusEffectEnum.FireDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Lightning && (effect.type === StatusEffectEnum.LightningDamageTakenUp || effect.type === StatusEffectEnum.LightningDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Air && (effect.type === StatusEffectEnum.AirDamageTakenUp || effect.type === StatusEffectEnum.AirDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Water && (effect.type === StatusEffectEnum.WaterDamageTakenUp || effect.type === StatusEffectEnum.WaterDamageTakenDown)) ||
        (elementalType === ElementalTypeEnum.Earth && (effect.type === StatusEffectEnum.EarthDamageTakenUp || effect.type === StatusEffectEnum.EarthDamageTakenDown)));

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          overallDamageMultiplier *= effect.effectiveness;
        });
      }

      var warriorDefend = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WarriorDefend);
      if (this.warriorCounterattackActive(target, character) && warriorDefend !== undefined) {
        overallDamageMultiplier *= warriorDefend.effectiveness;
      }

      if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DivineRetribution))
        overallDamageMultiplier = 0;

      if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.InstantHealAfterAutoAttack) &&
        this.globalService.getSetCount(EquipmentSetEnum.Athena, target.equipmentSet) === 5) {
        damageTakenAggregate *= 1 - this.globalService.getSetBonusAmount(EquipmentSetEnum.Athena, 5);
      }
    }

    //each unique status effect is its own multiplier. or perhaps they should be additive, i'm not sure
    var thousandCutsDamageIncrease = 1;
    if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ThousandCuts)) {
      var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThousandCuts)!;
      thousandCutsDamageIncrease += effect.effectiveness * effect.count;
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
    if (abilityName === "Dreameater") {
      var dreameaterMultiplierAmount = .2;
      enemySpecificAbilityIncrease += dreameaterMultiplierAmount * target.battleInfo.statusEffects.filter(item => !item.isPositive).length;
    }

    //Mimon ability Landslide    
    if (abilityName === "Landslide") {
      var landslideMultiplierAmount = .2;
      var rockCount = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock)?.stackCount;
      if (rockCount !== undefined)
        enemySpecificAbilityIncrease += landslideMultiplierAmount * rockCount;
    }

    //Porphyrion ability Landslide    
    if (abilityName === "Rockfall") {
      var rockfallMultiplierAmount = .25;
      var rockCount = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock)?.stackCount;
      if (rockCount !== undefined)
        enemySpecificAbilityIncrease += rockfallMultiplierAmount * rockCount;
    }

    var insight = character.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Insight);
    if (insight !== undefined && ability !== undefined) {
      overallDamageMultiplier *= insight.effectiveness;
    }

    return overallDamageMultiplier * thousandCutsDamageIncrease * markDamageIncrease * thyrsusDamageIncrease * enemySpecificAbilityIncrease * altarMultiplier * aoeIncrease * allyDamageBonus;
  }

  applyStatusEffect(appliedStatusEffect: StatusEffect, target: Character, potentialTargets?: Character[], castingCharacter?: Character, originalAbility?: Ability, canRepeat: boolean = true) {
    if (!appliedStatusEffect.addedEffect) {
      var permanentAbilityUpgrades = this.getGodPermanentAbilityUpgrades(originalAbility, castingCharacter);
      if (originalAbility !== undefined && permanentAbilityUpgrades !== undefined) {
        if (permanentAbilityUpgrades.userEffect !== undefined && permanentAbilityUpgrades.userEffect.length > 0) {
          appliedStatusEffect.effectiveness += permanentAbilityUpgrades.userEffect[0].effectiveness;
          appliedStatusEffect.duration += permanentAbilityUpgrades.userEffect[0].duration;
          appliedStatusEffect.threshold += permanentAbilityUpgrades.userEffect[0].threshold;
        }
        if (permanentAbilityUpgrades.targetEffect !== undefined && permanentAbilityUpgrades.targetEffect.length > 0) {

          if (appliedStatusEffect.type === StatusEffectEnum.Thyrsus || (originalAbility !== undefined && originalAbility.name === "Insanity"))
            appliedStatusEffect.effectiveness += permanentAbilityUpgrades.targetEffect[0].effectiveness;
          else if (permanentAbilityUpgrades.targetEffect[0].effectiveness < 1) {
            appliedStatusEffect.effectiveness -= permanentAbilityUpgrades.targetEffect[0].effectiveness;
          }
          else {
            appliedStatusEffect.effectiveness += permanentAbilityUpgrades.targetEffect[0].effectiveness;
          }
          appliedStatusEffect.duration += permanentAbilityUpgrades.targetEffect[0].duration;
          appliedStatusEffect.threshold += permanentAbilityUpgrades.targetEffect[0].threshold;
        }
      }

      var permanentCharacterAbilityUpgrades = this.getCharacterPermanentAbilityUpgrades(originalAbility, castingCharacter);
      if (originalAbility !== undefined && permanentCharacterAbilityUpgrades !== undefined) {
        if (permanentCharacterAbilityUpgrades.userEffect !== undefined && permanentCharacterAbilityUpgrades.userEffect.length > 0) {
          appliedStatusEffect.effectiveness += permanentCharacterAbilityUpgrades.userEffect[0].effectiveness;
          appliedStatusEffect.duration += permanentCharacterAbilityUpgrades.userEffect[0].duration;
        }
        if (permanentCharacterAbilityUpgrades.targetEffect !== undefined && permanentCharacterAbilityUpgrades.targetEffect.length > 0) {
          appliedStatusEffect.effectiveness += permanentCharacterAbilityUpgrades.targetEffect[0].effectiveness;
          appliedStatusEffect.duration += permanentCharacterAbilityUpgrades.targetEffect[0].duration;
        }
      }
    }

    if (castingCharacter !== undefined && appliedStatusEffect.type === StatusEffectEnum.ChainsOfFate) {
      appliedStatusEffect.caster = castingCharacter.name;
    }

    if (target !== undefined && target.battleInfo !== undefined) {
      var fadingBlind = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Blind && item.abilityName === "Fading");
      if (fadingBlind !== undefined) {
        fadingBlind.duration += fadingBlind.maxCount;
      }
    }

    if (originalAbility !== undefined && originalAbility.name === "Revelry" && appliedStatusEffect.type === StatusEffectEnum.Barrier && castingCharacter !== undefined) {
      var buffCount = this.getBuffsOnCharacter(castingCharacter);
      var effectivenessMultiplier = 1;
      effectivenessMultiplier += buffCount * (originalAbility.secondaryEffectiveness - 1);
      appliedStatusEffect.effectiveness *= effectivenessMultiplier;
    }

    if (originalAbility !== undefined && originalAbility.name === "Thyrsus" && appliedStatusEffect.type === StatusEffectEnum.Thyrsus && castingCharacter !== undefined) {
      if (castingCharacter.type !== CharacterEnum.Enemy) {
        var debuffCount = this.getUniqueDebuffsOnCharacter(target);
        if (debuffCount > 15)
          debuffCount = 15;
        appliedStatusEffect.effectiveness -= 1;
        var effectivenessMultiplier = 1;
        effectivenessMultiplier += debuffCount * (originalAbility.secondaryEffectiveness - 1);
        appliedStatusEffect.effectiveness *= effectivenessMultiplier;
        appliedStatusEffect.effectiveness += 1;
      }
      else {
        var debuffCount = 0;//this.getDebuffsOnCharacter(target);
        if (potentialTargets !== undefined) {
          potentialTargets.forEach(potentialTarget => {
            debuffCount += this.getUniqueDebuffsOnCharacter(potentialTarget);
          });
        }

        appliedStatusEffect.effectiveness -= 1;
        var effectivenessMultiplier = 1;
        effectivenessMultiplier += debuffCount * (originalAbility.secondaryEffectiveness - 1);
        appliedStatusEffect.effectiveness *= effectivenessMultiplier;
        appliedStatusEffect.effectiveness += 1;
      }
    }

    if (castingCharacter !== undefined) {
      var caringGaze = castingCharacter.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.CaringGaze);
      if (appliedStatusEffect.isPositive && !appliedStatusEffect.isInstant &&
        caringGaze !== undefined) {
        appliedStatusEffect.duration *= caringGaze.effectiveness;
      }
    }

    if (appliedStatusEffect.isPositive && !appliedStatusEffect.isInstant &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloBuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (appliedStatusEffect.isPositive && !appliedStatusEffect.isInstant &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareBuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareBuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (!appliedStatusEffect.isPositive && !appliedStatusEffect.isInstant &&
      this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareDebuffDurationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareDebuffDurationUp);
      appliedStatusEffect.duration *= relevantAltarEffect!.effectiveness;
    }

    if (!appliedStatusEffect.isPositive && castingCharacter !== undefined &&
      castingCharacter.overdriveInfo.isActive && castingCharacter.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Weaken) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtUp, 15, 1.1, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 10, true), castingCharacter);
    }

    if (!appliedStatusEffect.isPositive && castingCharacter !== undefined && !appliedStatusEffect.isInstant &&
      castingCharacter.battleStats.debuffDuration > 0) {
      appliedStatusEffect.duration *= 1 + castingCharacter.battleStats.debuffDuration;
    }

    if (appliedStatusEffect.isPositive && castingCharacter !== undefined && !appliedStatusEffect.isInstant &&
      castingCharacter.battleStats.buffDuration > 0) {
      appliedStatusEffect.duration *= 1 + castingCharacter.battleStats.buffDuration;
    }

    if (castingCharacter !== undefined && castingCharacter.battleStats.tickFrequency > 0 && appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
      appliedStatusEffect.tickFrequency *= (1 - castingCharacter.battleStats.tickFrequency);
    }

    if (!appliedStatusEffect.isPositive && castingCharacter !== undefined)
      this.checkForEquipmentEffect(EffectTriggerEnum.ChanceOnDebuff, castingCharacter, target, [], potentialTargets ?? [], undefined, originalAbility?.targetsAllies);

    if (castingCharacter !== undefined && canRepeat && this.checkForDionysusSetBonus(castingCharacter)) {
      var rng = this.utilityService.getRandomNumber(0, 1);
      if (rng <= .2) {
        if (this.battle !== undefined && this.battle.currentEnemies !== undefined && this.battle.currentEnemies.enemyList !== undefined && appliedStatusEffect.isPositive) {
          //this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 8, .75, true, false, false), this.lookupService.getRandomPartyMember(this.battle.currentEnemies.enemyList), undefined, undefined, undefined, false);
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatDownStatusEffect(true), 8, .75, false, false, false);
          this.applyStatusEffect(statusEffect, this.lookupService.getRandomPartyMember(this.battle.currentEnemies.enemyList), undefined, undefined, undefined, false);
        }
        else if (!appliedStatusEffect.isPositive) {
          //this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatUp, 8, 1.25, true, true, false), this.lookupService.getRandomPartyMember(this.globalService.getActivePartyCharacters(true)), undefined, undefined, undefined, false);
          var statusEffect = this.globalService.createStatusEffect(this.getRandomPrimaryStatUpStatusEffect(), 8, 1.25, false, true, false);
          this.applyStatusEffect(statusEffect, this.lookupService.getRandomPartyMember(this.globalService.getActivePartyCharacters(true)), undefined, undefined, undefined, false);
        }
      }
    }

    if (appliedStatusEffect.type === StatusEffectEnum.BuzzingReminder) {
      var rhoecus = this.battle.currentEnemies.enemyList.find(item => item.name === "Rhoecus");
      if (rhoecus !== undefined && !rhoecus.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, -1, 2.5, false, true, false), rhoecus, undefined, undefined, undefined, false);
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, -1, 2.5, false, true, false), rhoecus, undefined, undefined, undefined, false);
      }
    }

    //this is used by Melampus from the Forgotten Kings trial
    if (target !== undefined) {
      var blessingOfDionysus = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlessingOfDionysus);
      if (blessingOfDionysus !== undefined && !appliedStatusEffect.isPositive && appliedStatusEffect.duration > 0 && !appliedStatusEffect.isInstant) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= blessingOfDionysus.effectiveness) //status effect not applied
        {
          if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " avoids the status effect due to their blessing from Dionysus.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }

          return;
        }
      }

      var blessingOfDionysus = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BlessingOfDionysus);
      if (!appliedStatusEffect.isPositive && target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.HealOverTime && item.abilityName === "Cleansing Rain")) {
        return;
      }


      if ((appliedStatusEffect.type === StatusEffectEnum.Stun || appliedStatusEffect.type === StatusEffectEnum.Paralyze) &&
        target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.StunImmunity))
        return;

      if (!appliedStatusEffect.isPositive && target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DebuffImmunity))
        return;
    }

    if (appliedStatusEffect.type === StatusEffectEnum.Retribution && originalAbility !== undefined) {
      appliedStatusEffect.count = originalAbility.maxCount;
    }

    if (appliedStatusEffect.type === StatusEffectEnum.BoundingBandUnique) {
      appliedStatusEffect.maxCount = appliedStatusEffect.duration;
    }

    if (appliedStatusEffect.isAoe && potentialTargets !== undefined) {
      potentialTargets.filter(potentialTarget => !(appliedStatusEffect.type === StatusEffectEnum.BlindedByLove && castingCharacter !== undefined && castingCharacter.type === potentialTarget.type)).forEach(enemy => {

        if (appliedStatusEffect.type === StatusEffectEnum.DamageOverTime) {
          if (appliedStatusEffect.dotType === dotTypeEnum.EnemyMaxHpPercent)
            appliedStatusEffect.effectiveness = appliedStatusEffect.effectiveness * this.lookupService.getAdjustedMaxHp(enemy, false);

          if (appliedStatusEffect.casterEnum === CharacterEnum.None && castingCharacter !== undefined)
            appliedStatusEffect.casterEnum = castingCharacter.type;
        }

        var existingApplication = enemy.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (existingApplication !== undefined) {
          //console.log(appliedStatusEffect.type + " = " + appliedStatusEffect.effectStacks + " && (" + (appliedStatusEffect.maxCount === 0) + " || " + existingApplication.stackCount + " < " + appliedStatusEffect.maxCount +")");
          if (appliedStatusEffect.effectStacks && (appliedStatusEffect.maxCount === 0 || existingApplication.stackCount < appliedStatusEffect.maxCount)) {
            existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
            existingApplication.stackCount += 1;
          }

          if (this.globalService.doesStatusEffectRefresh(appliedStatusEffect.type, appliedStatusEffect.caster, existingApplication.caster)) {
            if (existingApplication.stackCount > 1 || appliedStatusEffect.effectiveness === existingApplication.effectiveness) {
              if (appliedStatusEffect.duration > existingApplication.duration) {
                existingApplication.duration = appliedStatusEffect.duration;

                if (existingApplication.type === StatusEffectEnum.Retribution)
                  existingApplication.count = appliedStatusEffect.count;
              }
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

        if (appliedStatusEffect.casterEnum === CharacterEnum.None && castingCharacter !== undefined)
          appliedStatusEffect.casterEnum = castingCharacter.type;
      }

      if (target !== undefined) {
        var existingApplication = target.battleInfo.statusEffects.find(application => application.type === appliedStatusEffect.type);
        if (existingApplication !== undefined) {
          if (appliedStatusEffect.effectStacks && (appliedStatusEffect.maxCount === 0 || existingApplication.stackCount < appliedStatusEffect.maxCount)) {
            existingApplication.effectiveness += appliedStatusEffect.effectiveness - 1;
            existingApplication.stackCount += 1;
          }

          if (this.globalService.doesStatusEffectRefresh(appliedStatusEffect.type, appliedStatusEffect.caster, existingApplication.caster)) {
            if (originalAbility !== undefined && originalAbility.name === "Insanity") {
              existingApplication.duration += appliedStatusEffect.duration;
            }
            else {
              if (existingApplication.stackCount > 1 || appliedStatusEffect.effectiveness === existingApplication.effectiveness) {
                if (appliedStatusEffect.duration > existingApplication.duration) {
                  existingApplication.duration = appliedStatusEffect.duration;

                  if (existingApplication.type === StatusEffectEnum.Retribution)
                    existingApplication.count = appliedStatusEffect.count;
                }
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
  }

  getTarget(user: Character, targets: Character[], targetType: TargetEnum = TargetEnum.Random) {
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead || item.type === StatusEffectEnum.Untargetable || item.type === StatusEffectEnum.Submerge));
    if (potentialTargets.length === 0)
      return undefined;

    var target = potentialTargets[0];

    if (user.targeting !== undefined && targetType !== TargetEnum.LowestHpPercent && targetType !== TargetEnum.ForcedRandom && potentialTargets.some(item => item === user.targeting)) {
      target = user.targeting;

      var chainsOfFateAttacker = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
      potentialTargets.forEach(item => {
        var chainsOfFateEnemy = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
        var focus = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Focus && effect.caster === user.name);

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
          var focus = item.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Focus && effect.caster === user.name);

          //messenger takes priority
          if (chainsOfFateEnemy !== undefined && chainsOfFateAttacker !== undefined) {
            //console.log(user.name + " chained to " + item.name)
            target = item;
          }
          else if (focus !== undefined)
            target = item;
        });
      }
      else if (targetType === TargetEnum.LowestHpPercent) {
        var lowestHpPartyMember: Character = potentialTargets[0];
        potentialTargets.forEach(member => {
          var CharAHpPercent = (lowestHpPartyMember.battleStats.currentHp + lowestHpPartyMember.battleInfo.barrierValue) / (this.lookupService.getAdjustedMaxHp(lowestHpPartyMember, false, false));
          var CharBHpPercent = (member.battleStats.currentHp + member.battleInfo.barrierValue) / (this.lookupService.getAdjustedMaxHp(member, false, false));

          if (CharBHpPercent < CharAHpPercent) {
            lowestHpPartyMember = member;
          }
        });

        target = lowestHpPartyMember;
      }
      else if (targetType === TargetEnum.Self) {
        target = user;
      }
    }

    var taunted = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.Taunt);
    if (taunted !== undefined && targetType !== TargetEnum.ForcedRandom && targetType !== TargetEnum.LowestHpPercent) {
      var tauntCaster = targets.find(caster => caster.name === taunted!.caster);
      if (tauntCaster !== undefined && !tauntCaster.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
        //console.log(user.name + " taunted by " + tauntCaster.name)
        target = tauntCaster;
      }
    }

    //messenger takes priority
    var chainsOfFate = user.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ChainsOfFate);
    if (chainsOfFate !== undefined && targetType !== TargetEnum.ForcedRandom && targetType !== TargetEnum.LowestHpPercent) {
      var caster = targets.find(caster => caster.name === chainsOfFate!.caster);
      if (caster !== undefined && !caster.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)) {
        //console.log(user.name + " chained to at the end by " + caster.name)
        target = caster;
      }
    }

    //console.log("Target is gonna be " + target.name);
    return target;
  }

  applyAwakenedSpirit(character: Character, element: ElementalTypeEnum, awakenedSpirit: Ability) {
    var damageDealtEffectiveness = this.getAbilityEffectiveness(awakenedSpirit, 1, character, false);
    var damageTakenEffectiveness = awakenedSpirit.secondaryEffectiveness;

    if (element === ElementalTypeEnum.Fire) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.FireDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.FireDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
    if (element === ElementalTypeEnum.Holy) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.HolyDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.HolyDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
    if (element === ElementalTypeEnum.Air) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AirDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AirDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
    if (element === ElementalTypeEnum.Water) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.WaterDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.WaterDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
    if (element === ElementalTypeEnum.Earth) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
    if (element === ElementalTypeEnum.Lightning) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LightningDamageUp, 7, damageDealtEffectiveness, false, true), character, undefined, character);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LightningDamageTakenDown, 7, damageTakenEffectiveness, false, true), character, undefined, character);
    }
  }

  dealDamage(isPartyAttacking: boolean, attacker: Character, target: Character, isCritical: boolean, abilityDamageMultiplier?: number, damageMultiplier?: number, ability?: Ability, elementalType?: ElementalTypeEnum, godType?: GodEnum, partyMembers?: Character[], targets?: Character[]): [number, number, number] {
    //damage formula, check for shields, check for ko
    if (abilityDamageMultiplier === undefined)
      abilityDamageMultiplier = 1;

    if (damageMultiplier === undefined)
      damageMultiplier = 1;

    if (elementalType === undefined)
      elementalType = ElementalTypeEnum.None;

    //var adjustedAttack = this.lookupService.getAdjustedAttack(attacker, ability, isPartyAttacking);
    var adjustedAttack = attacker.battleStats.attack;
    var adjustedAllyAttack = 0;
    var adjustedAllyAttackModifier = 0; //used specifically for Kiss of Death

    if (ability !== undefined) {
      if ((ability.name === "Kiss of Death" || ability.name === "Love to Death" || ability.name === "Begrudging Alliance" || ability.name === "Heavy Waves") && partyMembers !== undefined) {
        var ally = partyMembers.find(item => item.type !== attacker.type || item.type === CharacterEnum.Enemy);
        if (ally !== undefined) {
          adjustedAllyAttack = ally.battleStats.attack;
          adjustedAllyAttackModifier = this.lookupService.getAdjustedAttackModifier(ally, ability, isPartyAttacking);
        }
      }

      if (ability.name === "Shield Slam") {
        adjustedAttack += this.lookupService.getAdjustedDefense(attacker) * ability.secondaryEffectiveness;
      }

      if (ability.name === "Just Strike") {
        adjustedAttack += this.lookupService.getAdjustedAgility(attacker) * .5;
      }
    }

    var adjustedAttackModifier = this.lookupService.getAdjustedAttackModifier(attacker, ability, isPartyAttacking);
    var adjustedDefense = this.lookupService.getAdjustedDefense(target, !isPartyAttacking) * this.lookupService.getArmorPenetrationMultiplier(attacker);
    var adjustedCriticalMultiplier = 1;
    if (isCritical) {
      adjustedCriticalMultiplier = this.lookupService.getAdjustedCriticalMultiplier(attacker, isPartyAttacking, undefined, target);
      this.checkForArtemisSetBonus(attacker, target);
    }

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

      var awakenedSpirit = this.lookupService.characterHasAbility("Awakened Spirit", attacker);
      if (awakenedSpirit !== undefined) {
        this.applyAwakenedSpirit(attacker, elementalType, awakenedSpirit);
      }
    }

    adjustedDefense *= 3;

    //separate out multipliers to attack from the exponent or things get too wild
    //adjusted ally attack will add 0 unless it's kiss of death
    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * adjustedCriticalMultiplier
      * elementIncrease * elementalDamageDecrease
      * Math.ceil(((adjustedAttackModifier * Math.pow(adjustedAttack, 2)) + (adjustedAllyAttackModifier * Math.pow(adjustedAllyAttack, 2))) / ((adjustedAttackModifier * adjustedAttack) + (adjustedAllyAttackModifier * adjustedAllyAttack) + adjustedDefense)));

    /*if (ability !== undefined)
      console.log("Ability name: " + ability.name);
    else
      console.log("Auto Attack");
    console.log(attacker.name + ": " + damageMultiplier + " * " + abilityDamageMultiplier + " * " + adjustedCriticalMultiplier + " * " + elementIncrease
      + " * " + elementalDamageDecrease + " * Math.ceil((" + adjustedAttackModifier + " * " + adjustedAttack + " ^2) / (" + adjustedAttackModifier + " * " + adjustedAttack + " + " + adjustedDefense + " ) = " + damage);*/
    var dispenserOfDuesEffect = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
    if (dispenserOfDuesEffect !== undefined && ability !== undefined) {
      damage += dispenserOfDuesEffect.effectiveness;
      if (!ability?.userEffect.some(item => item.type === StatusEffectEnum.KeepDues)) {
        dispenserOfDuesEffect.effectiveness = 0;
      }

      if (ability !== undefined && ability.name === "Just Strike") {
        dispenserOfDuesEffect.effectiveness += damage * ability.secondaryEffectiveness;
        if (dispenserOfDuesEffect.effectiveness > this.lookupService.getAdjustedMaxHp(attacker, true, false) * dispenserOfDuesEffect.maxCount)
          dispenserOfDuesEffect.effectiveness = this.lookupService.getAdjustedMaxHp(attacker, true, false) * dispenserOfDuesEffect.maxCount;
      }
    }

    if (partyMembers !== undefined) {
      var ally = partyMembers.find(item => item.type !== attacker.type || item.type === CharacterEnum.Enemy);
      if (ally !== undefined) {
        var allyDispenserOfDuesEffect = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
        var protector = ally.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Protector);
        if (allyDispenserOfDuesEffect !== undefined && protector !== undefined) {
          allyDispenserOfDuesEffect.effectiveness += damage * protector.maxCount;
          if (allyDispenserOfDuesEffect.effectiveness > this.lookupService.getAdjustedMaxHp(attacker, true, false) * allyDispenserOfDuesEffect.maxCount)
            allyDispenserOfDuesEffect.effectiveness = this.lookupService.getAdjustedMaxHp(attacker, true, false) * allyDispenserOfDuesEffect.maxCount;
        }
      }
    }
    //console.log("Damage post dues: " + damage);

    if (ability?.damageModifierRange !== undefined) {
      var rng = this.utilityService.getRandomNumber(1 - ability.damageModifierRange, 1 + ability.damageModifierRange);
      damage = Math.round(damage * rng);
    }

    var reduceDamage = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceDirectDamage);
    if (reduceDamage !== undefined)
      damage -= reduceDamage.effectiveness;

    var sturdyShell = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.SturdyShell);
    if (sturdyShell !== undefined)
      damage -= sturdyShell.effectiveness * this.lookupService.getAdjustedDefense(target, true);

    if (damage < 0)
      damage = 0;

    var totalDamageDealt = damage;

    //could probably make a unique ability check method
    if (target.name === "Sea-Goat" && target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.AutoAttackSpeedUp)) {
      var autoAttackSpeedUp = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AutoAttackSpeedUp);
      if (autoAttackSpeedUp !== undefined) {
        autoAttackSpeedUp.effectiveness -= .2;

        if (autoAttackSpeedUp.effectiveness <= 1)
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.AutoAttackSpeedUp);
      }
    }

    if (target.name === "Ganymede" && target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.HealOverTime)) {
      var healOverTime = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealOverTime);
      if (healOverTime !== undefined) {
        healOverTime.count += totalDamageDealt;

        if (healOverTime.count >= healOverTime.maxCount)
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.HealOverTime);
      }
    }

    var foresight = this.lookupService.characterHasAbility("Foresight", target);
    var waterShield = this.lookupService.characterHasAbility("Water Shield", target);
    if (foresight !== undefined || waterShield !== undefined) { //This is assumed to be used by Helenus from Forgotten Kings trial
      var definedEffect = foresight !== undefined ? foresight : waterShield;
      if (definedEffect !== undefined) {
        var barrierAmount = Math.round(definedEffect.userEffect[0].effectiveness * this.lookupService.getAdjustedAttack(target, undefined, !isPartyAttacking));

        if (target.battleInfo.barrierValue < this.lookupService.getAdjustedMaxHp(target, true, false) * definedEffect.userEffect[0].threshold) {
          target.battleInfo.barrierValue += barrierAmount;

          //if you went over threshold, set it back down 
          if (target.battleInfo.barrierValue > this.lookupService.getAdjustedMaxHp(target, true, false) * definedEffect.userEffect[0].threshold) {
            target.battleInfo.barrierValue = Math.round(this.lookupService.getAdjustedMaxHp(target, true, false) * definedEffect.userEffect[0].threshold);
          }

          if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " uses " + definedEffect.name + ", gaining a barrier of " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, barrierAmount) + " HP before being attacked.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    var perfectVision = this.lookupService.characterHasAbility("Perfect Vision", target);
    if (perfectVision !== undefined) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, perfectVision.effectiveness, true, true, true, attacker.name), target, undefined, attacker);
    }

    var flamingMane = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FlamingMane);
    if (flamingMane !== undefined) {
      this.applyStatusEffect(this.globalService.createDamageOverTimeEffect(16, 4, totalDamageDealt / 4, "Flaming Mane", dotTypeEnum.TrueDamage, ElementalTypeEnum.Fire), target);
    }

    if (isCritical && target.name === "Porphyrion") {
      var rocks = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StockpileRock);
      if (rocks !== undefined) {
        rocks.stackCount -= 1;

        if (rocks.stackCount <= 0)
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.StockpileRock);
      }
    }


    target.trackedStats.damageTaken += totalDamageDealt;

    if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Revenge && target.overdriveInfo.revengeTime <= 0) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, 1, true, true, true, attacker.name), target, undefined, attacker);
      target.overdriveInfo.revengeTime = 1;
    }

    var counterStun = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.CounterStun);
    if (counterStun !== undefined) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 1, false, false, false, attacker.name), attacker, undefined, attacker);
    }

    var counterattack = this.lookupService.characterHasAbility("Counterattack", target);
    if (counterattack !== undefined && this.warriorCounterattackActive(target, attacker) && (target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target, true) <= counterattack.threshold)) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantAutoAttack, -1, 1, true, true, true, attacker.name), target, undefined, attacker);
    }

    var BucklerOfPerfectHarmony = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BucklerOfPerfectHarmonyAttack);
    if (BucklerOfPerfectHarmony !== undefined) {
      BucklerOfPerfectHarmony.count -= 1;
      if (BucklerOfPerfectHarmony.count <= 0 && partyMembers !== undefined) {
        partyMembers.forEach(member => {
          var damage = this.dealTrueDamage(true, member, this.lookupService.getAdjustedDefense(target) * (this.lookupService.getAdjustedDefense(target) * BucklerOfPerfectHarmony!.effectiveness), undefined, undefined, true);

          if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
            var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Buckler of Perfect Harmony effect.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        });

        BucklerOfPerfectHarmony.count = BucklerOfPerfectHarmony.maxCount;
      }
    }

    var BucklerOfPerfectHarmony = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BucklerOfPerfectHarmonyAttackUnique);
    if (BucklerOfPerfectHarmony !== undefined) {
      BucklerOfPerfectHarmony.count -= 1;
      if (BucklerOfPerfectHarmony.count <= 0 && partyMembers !== undefined) {
        var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.BucklerOfPerfectHarmonyUnique);

        if (uniqueEffect !== undefined) {
          partyMembers.forEach(member => {
            var damage = this.dealTrueDamage(true, member, this.lookupService.getAdjustedDefense(target) * (BucklerOfPerfectHarmony!.effectiveness + (uniqueEffect!.getMinorEffectLevel() / 20)), undefined, undefined, true);

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Buckler of Perfect Harmony effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }

        BucklerOfPerfectHarmony.count = BucklerOfPerfectHarmony.maxCount;
      }
    }

    var swordOfOlympus = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.SwordOfOlympus);
    if (swordOfOlympus !== undefined) {
      swordOfOlympus.count -= 1;
      if (swordOfOlympus.count <= 0 && targets !== undefined) {
        var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.SwordOfOlympus);

        if (uniqueEffect !== undefined) {
          targets.forEach(member => {
            var damage = this.dealTrueDamage(true, member, this.lookupService.getAdjustedAttack(attacker, undefined, true) * (swordOfOlympus!.effectiveness), undefined, undefined, true);

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Sword of Olympus effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }

        swordOfOlympus.count = swordOfOlympus.maxCount;
      }
    }

    var armorOfOlympus = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ArmorOfOlympus);
    if (armorOfOlympus !== undefined && isCritical) {
      if (armorOfOlympus.count > 0 && targets !== undefined) {
        var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.ArmorOfOlympus);

        if (uniqueEffect !== undefined) {
          targets.forEach(member => {
            var damage = this.dealTrueDamage(true, member, armorOfOlympus!.count, undefined, undefined, true);

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(attacker.type) + "'>" + attacker.name + "</strong>'s Armor of Olympus effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }

        armorOfOlympus.count = 0;
      }
    }

    var scathingBeauty = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique);
    if (scathingBeauty !== undefined) {
      if (isCritical) {
        if (partyMembers !== undefined && scathingBeauty.count > 0) {
          partyMembers.forEach(member => {
            var damage = this.dealTrueDamage(true, member, scathingBeauty!.count, undefined, undefined, true);

            if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + " damage from <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>'s Scathing Beauty effect.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          });
        }

        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ScathingBeautyUnique);
      }
      else {
        if (scathingBeauty.stackCount >= 8) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtDown, 10, 1 - (scathingBeauty.effectiveness / 10), false, false), attacker, undefined, target);
        }
      }
    }

    var fieryJudgment = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FieryJudgment);
    if (fieryJudgment !== undefined) {
      var gods = [];
      gods.push(GodEnum.Hades);
      gods.push(GodEnum.Nemesis);
      var fjAbility = this.lookupService.getDuoAbility(gods);
      if (fjAbility !== undefined && partyMembers !== undefined) {
        fjAbility.userEffect = fjAbility.userEffect.filter(item => item.type !== StatusEffectEnum.FieryJudgment);
        this.useAbility(true, fjAbility, target, this.battle.currentEnemies.enemyList, partyMembers, true, undefined, undefined, false);
      }
      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.FieryJudgment);
    }

    var wildJudgmentEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WildJudgment);
    if (wildJudgmentEffect !== undefined && target.battleInfo.barrierValue > 0) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, wildJudgmentEffect.effectiveness, true, true, true, attacker.name), target, undefined, attacker);
      wildJudgmentEffect.count -= 1;

      if (wildJudgmentEffect.count <= 0)
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.WildJudgment);
    }

    var thunderousRiposteEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ThunderousRiposte);
    if (thunderousRiposteEffect !== undefined) {
      var trueDamageDealt = this.dealTrueDamage(true, attacker, this.lookupService.getAdjustedAttack(target) * thunderousRiposteEffect.effectiveness, target, ElementalTypeEnum.Lightning, true, undefined, undefined, ally);
      if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(attacker.type) + "'>" + attacker.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " " + this.lookupService.getElementName(ElementalTypeEnum.Lightning, undefined, true) + " damage from Thunderous Riposte's effect.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }
    }

    var staggeringRiposteEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.StaggeringRiposte);
    if (staggeringRiposteEffect !== undefined) {
      var trueDamageDealt = this.dealTrueDamage(true, attacker, this.lookupService.getAdjustedAttack(target) * staggeringRiposteEffect.effectiveness, target, ElementalTypeEnum.Water, true, undefined, undefined, ally);
      if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(attacker.type) + "'>" + attacker.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " " + this.lookupService.getElementName(ElementalTypeEnum.Water, undefined, true) + " damage from Staggering Riposte's effect.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }


      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 10, .25, false, false), attacker);
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 10, .25, false, false), attacker);
    }

    var retributionEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Retribution);
    if (retributionEffect !== undefined) {
      var retribution = this.lookupService.characterHasAbility("Retribution", target);
      if (retribution !== undefined) {
        var permanentEffectiveness = 0;
        if (target.type !== CharacterEnum.Enemy) {
          var nemesis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
          if (nemesis !== undefined) {
            var permanentUpgrade = nemesis.permanentAbilityUpgrades.find(item => item.requiredLevel === retribution!.requiredLevel);
            if (permanentUpgrade !== undefined) {
              permanentEffectiveness += permanentUpgrade.effectiveness;
            }
          }
        }

        //ability.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, retribution.effectiveness, true, true, true, attacker.name));
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, retribution.effectiveness + permanentEffectiveness, true, true, true, attacker.name), target, undefined, attacker);
        retributionEffect.count -= 1;

        if (retributionEffect.count <= 0)
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Retribution);
      }
    }

    var divineRetributionEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DivineRetribution);
    if (divineRetributionEffect !== undefined) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantCounter, -1, divineRetributionEffect.effectiveness, true, true, true, attacker.name), target, undefined, attacker);
      target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DivineRetribution);
    }

    var dispenserOfDuesEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
    if (dispenserOfDuesEffect !== undefined) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", target);
      if (dispenserOfDues !== undefined) {
        var nemesis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
        var permanentEffectiveness = 0;
        var chainsMultiplier = 1;
        if (nemesis !== undefined) {
          var permanentUpgrade = nemesis.permanentAbilityUpgrades.find(item => item.requiredLevel === dispenserOfDues!.requiredLevel);

          if (permanentUpgrade !== undefined && target.type !== CharacterEnum.Enemy) {
            permanentEffectiveness += permanentUpgrade.effectiveness;
          }

          var chains = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ChainsOfFate);
          if (chains !== undefined) {
            var chainsOfFate = this.lookupService.characterHasAbility("Chains of Fate", target);
            if (chainsOfFate !== undefined) {
              var permanentChainsUpgrade = nemesis.permanentAbilityUpgrades.find(item => item.requiredLevel === chainsOfFate!.requiredLevel);
              chainsMultiplier = chainsOfFate.effectiveness;
              if (permanentChainsUpgrade !== undefined && target.type !== CharacterEnum.Enemy)
                chainsMultiplier += permanentChainsUpgrade.effectiveness;
            }
          }


          //update dues buff in case of level up
          if (target.type !== CharacterEnum.Enemy) {
            dispenserOfDuesEffect.maxCount = dispenserOfDues.secondaryEffectiveness;

            if (permanentUpgrade !== undefined) {
              dispenserOfDuesEffect.maxCount += permanentUpgrade.secondaryEffectiveness;
            }
          }
        }

        dispenserOfDuesEffect.effectiveness += Math.round(totalDamageDealt * (dispenserOfDues.effectiveness + permanentEffectiveness) * chainsMultiplier);

        if (dispenserOfDuesEffect.effectiveness > this.lookupService.getAdjustedMaxHp(target, true, false) * dispenserOfDuesEffect.maxCount)
          dispenserOfDuesEffect.effectiveness = this.lookupService.getAdjustedMaxHp(target, true, false) * dispenserOfDuesEffect.maxCount;
      }
    }

    var armorOfOlympusEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ArmorOfOlympus);
    if (armorOfOlympusEffect !== undefined) {
      armorOfOlympusEffect.count += Math.round(totalDamageDealt * armorOfOlympusEffect.threshold);
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

    var highTide = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HighTide);
    if (highTide !== undefined) {
      highTide.count += totalDamageDealt;

      if (highTide.count > highTide.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.HighTide);
        highTide.count = 0;
      }
    }

    var tentative = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Tentative);
    if (tentative !== undefined) {
      tentative.count += totalDamageDealt;

      if (tentative.count > tentative.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Tentative);
        tentative.count = 0;
        this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 15, .2, false, true), target, undefined, target);
      }
    }

    var buzzingReminder = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BuzzingReminder);
    if (buzzingReminder !== undefined) {
      buzzingReminder.count += totalDamageDealt;

      if (buzzingReminder.count > buzzingReminder.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.BuzzingReminder);
        buzzingReminder.count = 0;

        var rhoecus = this.battle.currentEnemies.enemyList.find(item => item.name === "Rhoecus");
        if (rhoecus !== undefined) {
          rhoecus.battleInfo.statusEffects = rhoecus.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DefenseUp);
          rhoecus.battleInfo.statusEffects = rhoecus.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ResistanceUp);
        }
      }
    }

    var submergeEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Submerge);
    if (submergeEffect !== undefined) {
      submergeEffect.count += totalDamageDealt;

      if (submergeEffect.count > submergeEffect.maxCount) {
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Submerge);
        submergeEffect.count = 0;
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

    if (ability !== undefined)
      this.checkForShadowSetBonus(attacker, target);

    var absorptionDamage = 0;
    var matchingAbsorption = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AbsorbElementalDamage && item.element === elementalType)
    if (matchingAbsorption !== undefined) {
      if (matchingAbsorption.effectiveness > 0) {
        absorptionDamage = matchingAbsorption.effectiveness;
        matchingAbsorption.effectiveness -= damage;
        damage = 0;

        if (matchingAbsorption.effectiveness < 0) {
          //deal remaining damage to hp          
          damage = -matchingAbsorption.effectiveness;
          matchingAbsorption.effectiveness = 0;
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item !== matchingAbsorption);
        }
        else
          absorptionDamage -= matchingAbsorption.effectiveness;
      }
    }

    var matchingRainbowScaledPlating = target.battleInfo.statusEffects.find(item => (item.type === StatusEffectEnum.RainbowPlating || item.type === StatusEffectEnum.RainbowPlatingUnique) && item.element === elementalType);
    if (matchingRainbowScaledPlating !== undefined) {
      var absorptionEffectiveness = matchingRainbowScaledPlating.effectiveness;

      if (matchingRainbowScaledPlating.type === StatusEffectEnum.RainbowPlatingUnique) {
        var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.RainbowScaledPlatingUnique);
        if (uniqueEffect !== undefined) {
          absorptionEffectiveness += uniqueEffect.getMinorEffectLevel() * .002;
        }
      }

      var absorptionAmount = this.lookupService.getAdjustedDefense(target, true) * absorptionEffectiveness;
      var additionalAbsorptionDamage = 0;

      if (absorptionAmount !== undefined && absorptionAmount > 0) {
        additionalAbsorptionDamage = absorptionAmount;
        absorptionAmount -= damage;
        damage = 0;

        if (absorptionAmount < 0) {
          //deal remaining damage to hp          
          damage = -absorptionAmount;
          absorptionAmount = 0;
        }
        else
          additionalAbsorptionDamage -= absorptionAmount;
      }

      absorptionDamage += additionalAbsorptionDamage;
    }

    var barrierDamage = 0;
    if (target.battleInfo.barrierValue > 0) {
      barrierDamage = target.battleInfo.barrierValue;
      target.battleInfo.barrierValue -= damage;
      damage = 0;

      if (target.battleInfo.barrierValue < 0) {
        //deal remaining damage to hp
        damage = -target.battleInfo.barrierValue;
        target.battleInfo.barrierValue = 0;
      }
      else
        barrierDamage -= target.battleInfo.barrierValue;
    }

    target.battleStats.currentHp -= damage;

    if (target.battleStats.currentHp < 0)
      target.battleStats.currentHp = 0;

    if (isPartyAttacking) {
      this.dpsCalculatorService.addPartyDamageAction(totalDamageDealt, attacker, godType);
    }
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

    if (target.name === "Khronos") {
      var finalHour = this.lookupService.characterHasAbility("Final Hour", target);
      if (finalHour !== undefined) {
        if (!target.battleInfo.finalHourUsed && target.battleStats.currentHp <= target.battleStats.maxHp * .5) {
          this.useAbility(false, finalHour, target, this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies.enemyList, false, undefined, undefined, false);
          var enrage = this.lookupService.characterHasAbility("Enrage", target);
          if (enrage !== undefined) {
            enrage.cooldown = 10;
            if (enrage.currentCooldown > enrage.cooldown)
              enrage.currentCooldown = enrage.cooldown;
          }
          target.battleInfo.finalHourUsed = true;
        }
      }
    }

    if ((target.name === "The Colchian Dragon" || target.name === "Guardian of the Grove") && (target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target, false, false)) < .2) {
      var immortality = this.lookupService.characterHasAbility("Immortality", target);
      if (immortality !== undefined && target.battleInfo.immortalityCount === 0) {
        target.battleInfo.immortalityCount = 1;
        target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Dead);
        this.useAbility(false, immortality, target, this.battle.currentEnemies.enemyList, this.battle.currentEnemies.enemyList, false, undefined, undefined, false);
      }
    }

    if (target.name === "Great Bull") {
      var damageUpEffect = target.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.DamageDealtUp);
      if (damageUpEffect !== undefined) {
        if (target.battleStats.currentHp <= target.battleStats.maxHp * .3333) {
          damageUpEffect.effectiveness = 2;
        }
        else if (target.battleStats.currentHp <= target.battleStats.maxHp * .6666) {
          damageUpEffect.effectiveness = 1.5;
        }
      }
    }

    if (target.name === "Bellerophon") {
      var fromTheSkies = this.lookupService.characterHasAbility("From The Skies", target);
      if (fromTheSkies !== undefined && target.battleStats.currentHp <= target.battleStats.maxHp * .65 && fromTheSkies.cooldown > 5) {
        fromTheSkies.cooldown = fromTheSkies.currentCooldown = 5;
      }
    }

    return [totalDamageDealt, barrierDamage, absorptionDamage];
  }

  //DoTs
  dealTrueDamage(isPartyAttacking: boolean, target: Character, damage: number, attacker?: Character, elementalType: ElementalTypeEnum = ElementalTypeEnum.None, isReducable: boolean = true, isDamageOverTime: boolean = false, godType?: GodEnum, ally?: Character) {
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

    var bloodlustEffectiveness = 1;
    if (bloodlust !== undefined) {
      var bloodlustEffectiveness = bloodlust.effectiveness;

      var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
      if (ares !== undefined) {
        var bloodlustUpgrade = ares.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
        if (bloodlustUpgrade !== undefined)
          bloodlustEffectiveness += bloodlustUpgrade.effectiveness;
      }
    }

    if (isDamageOverTime && attacker !== undefined &&
      attacker.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DamageOverTimeDamageUp)) {
      var effect = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageOverTimeDamageUp)!;
      statusEffectDamageBonus *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DamageOverTimeTakenDown)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageOverTimeTakenDown)!;
      statusEffectDamageReduction *= effect.effectiveness;
    }

    if (isDamageOverTime && attacker !== undefined &&
      attacker.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DamageDealtDown)) {
      var effect = attacker.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DamageDealtDown)!;
      statusEffectDamageReduction *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Mark)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Mark)!;
      statusEffectDamageBonus *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Thyrsus)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thyrsus)!;
      statusEffectDamageBonus *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DivineProtection)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DivineProtection)!;
      statusEffectDamageReduction *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.FriendlyCompetition)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FriendlyCompetition)!;
      statusEffectDamageReduction *= effect.effectiveness;
    }

    if (isDamageOverTime && target !== undefined &&
      target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.GaiasBlessing)) {
      var effect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.GaiasBlessing)!;
      statusEffectDamageReduction *= effect.effectiveness;
    }

    if (isDamageOverTime && target.type === CharacterEnum.Enemy && bloodlust !== undefined && this.battle !== undefined && this.battle.currentEnemies !== undefined) {
      var totalDots = 0;
      this.battle.currentEnemies.enemyList.forEach(enemy => {
        totalDots += enemy.battleInfo.statusEffects.filter(item => item.type === StatusEffectEnum.DamageOverTime).length;
      })

      if (totalDots > bloodlust.maxCount)
        totalDots = bloodlust.maxCount;

      bloodlustDamageBonus += totalDots * bloodlustEffectiveness;
    }

    var allyDamageBonus = 1;
    if (ally !== undefined) {
      allyDamageBonus *= 1 + ally.battleStats.allyDamageBonus;
    }

    var altarIncrease = 1;
    if (isPartyAttacking && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage);
      altarIncrease *= relevantAltarEffect!.effectiveness;
    }

    //console.log("Pre multi dmg for: " + damage);
    //console.log(damage + " * " + elementIncrease + " * " + elementalDamageDecrease + " * " + bloodlustDamageBonus + " * " + altarIncrease + " * " + statusEffectDamageBonus + " * " + statusEffectDamageReduction);
    var totalDamageDealt = damage * allyDamageBonus * elementIncrease * elementalDamageDecrease * bloodlustDamageBonus * altarIncrease * statusEffectDamageBonus * statusEffectDamageReduction;

    //console.log("TDD: " + totalDamageDealt);

    if (target !== undefined) {
      var reduceDamage = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceDirectDamage);
      if (reduceDamage !== undefined && isReducable)
        totalDamageDealt -= reduceDamage.effectiveness;
    }

    if (totalDamageDealt < 0)
      totalDamageDealt = 0;

    if (attacker !== undefined && elementalType !== ElementalTypeEnum.None) {
      attacker.trackedStats.elementalDamageDealt += totalDamageDealt;
      if (attacker.trackedStats.elementalDamageDealt >= this.utilityService.overdriveAttacksNeededToUnlockNature &&
        !attacker.unlockedOverdrives.some(item => item === OverdriveNameEnum.Nature))
        attacker.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    }

    if (target !== undefined) {
      target.trackedStats.damageTaken += totalDamageDealt;
      if (target.trackedStats.damageTaken >= this.utilityService.overdriveDamageNeededToUnlockProtection &&
        !target.unlockedOverdrives.some(item => item === OverdriveNameEnum.Protection))
        target.unlockedOverdrives.push(OverdriveNameEnum.Protection);
      if (target.overdriveInfo.isActive && target.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Protection)
        target.overdriveInfo.damageTaken += totalDamageDealt;

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

      var highTide = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HighTide);
      if (highTide !== undefined) {
        highTide.count += totalDamageDealt;

        if (highTide.count > highTide.maxCount) {
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.HighTide);
          highTide.count = 0;
        }
      }

      var buzzingReminder = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.BuzzingReminder);
      if (buzzingReminder !== undefined) {
        buzzingReminder.count += totalDamageDealt;

        if (buzzingReminder.count > buzzingReminder.maxCount) {
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.BuzzingReminder);
          buzzingReminder.count = 0;

          var rhoecus = this.battle.currentEnemies.enemyList.find(item => item.name === "Rhoecus");
          if (rhoecus !== undefined) {
            rhoecus.battleInfo.statusEffects = rhoecus.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DefenseUp);
            rhoecus.battleInfo.statusEffects = rhoecus.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ResistanceUp);
          }
        }
      }

      var submergeEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Submerge);
      if (submergeEffect !== undefined) {
        submergeEffect.count += totalDamageDealt;

        if (submergeEffect.count > submergeEffect.maxCount) {
          target.battleInfo.statusEffects = target.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Submerge);
          submergeEffect.count = 0;
        }
      }
    }

    var actualDamageDealt = totalDamageDealt; //otherwise you return a reduced value from barrier
    if (target !== undefined) {
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

    }

    if (isPartyAttacking)
      this.dpsCalculatorService.addPartyDamageAction(totalDamageDealt, attacker, godType);
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

    var rainbowIncrease = 1;
    var matchingRainbowScaledPlating = attacker.battleInfo.statusEffects.find(item => (item.type === StatusEffectEnum.RainbowPlating || item.type === StatusEffectEnum.RainbowPlatingUnique) && item.element === element);
    if (matchingRainbowScaledPlating !== undefined) {
      var effectiveness = matchingRainbowScaledPlating.effectiveness;

      if (matchingRainbowScaledPlating.type === StatusEffectEnum.RainbowPlatingUnique) {
        var uniqueEffect = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.RainbowScaledPlatingUnique);
        if (uniqueEffect !== undefined) {
          effectiveness += uniqueEffect.getMajorEffectLevel() * .1;
        }
      }

      rainbowIncrease += effectiveness;
    }

    return 1 + (increase * altarIncrease * rainbowIncrease);
  }

  getElementalDamageDecrease(element: ElementalTypeEnum, target: Character, attacker?: Character) {
    var decrease = 0;
    var elementalReduction = 0;
    var elementalIncrease = 0;

    if (target === undefined)
      return 1;

    var resistanceDown = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AllElementalResistanceDown)
    if (resistanceDown !== undefined) {
      elementalReduction += resistanceDown.effectiveness;
    }

    var resistanceUp = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AllElementalResistanceUp)
    if (resistanceUp !== undefined) {
      elementalIncrease += resistanceUp.effectiveness;
    }

    if (attacker !== undefined)
      elementalReduction -= attacker.battleStats.elementResistanceReduction;

    if (element === ElementalTypeEnum.Holy)
      decrease = target.battleStats.elementResistance.holy + elementalIncrease + elementalReduction;
    if (element === ElementalTypeEnum.Fire)
      decrease = target.battleStats.elementResistance.fire + elementalIncrease + elementalReduction;
    if (element === ElementalTypeEnum.Lightning)
      decrease = target.battleStats.elementResistance.lightning + elementalIncrease + elementalReduction;
    if (element === ElementalTypeEnum.Air)
      decrease = target.battleStats.elementResistance.air + elementalIncrease + elementalReduction;
    if (element === ElementalTypeEnum.Water)
      decrease = target.battleStats.elementResistance.water + elementalIncrease + elementalReduction;
    if (element === ElementalTypeEnum.Earth)
      decrease = target.battleStats.elementResistance.earth + elementalIncrease + elementalReduction;

    return 1 - decrease;
  }

  //check for upper limits and any weird logic
  gainHp(character: Character, healAmount: number, convertOverhealToBarrier: boolean = false, barrierThreshold?: number) {
    var healModifier = 1;
    var healingReceivedUpModifier = 0;

    var healingReceivedUp = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HealingReceivedUp);
    if (healingReceivedUp !== undefined)
      healingReceivedUpModifier = healingReceivedUp.effectiveness - 1;

    if (character.battleStats.healingReceived > 0)
      healModifier = 1 + character.battleStats.healingReceived + healingReceivedUpModifier;

    var reduceHealingDebuff = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ReduceHealing);
    if (reduceHealingDebuff !== undefined)
      healModifier *= reduceHealingDebuff.effectiveness;

    /*var friendlyCompetition = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FriendlyCompetition);
    if (friendlyCompetition !== undefined)
      healModifier *= (friendlyCompetition.effectiveness * 2);*/

    healAmount = healAmount * healModifier;

    character.battleStats.currentHp += healAmount;
    var maxHp = this.lookupService.getAdjustedMaxHp(character, true, false);

    if (Math.ceil(character.battleStats.currentHp) > Math.ceil(maxHp)) {
      var overhealAmount = character.battleStats.currentHp - maxHp;
      healAmount -= character.battleStats.currentHp - maxHp;
      character.battleStats.currentHp = maxHp;

      if (convertOverhealToBarrier && barrierThreshold !== undefined && overhealAmount > 0) {
        if (character.battleInfo.barrierValue < maxHp * barrierThreshold) {
          character.battleInfo.barrierValue += overhealAmount;

          //if you went over threshold, set it back down 
          if (character.battleInfo.barrierValue > maxHp * barrierThreshold) {
            character.battleInfo.barrierValue = Math.round(maxHp * barrierThreshold);
          }
        }
      }
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

  isDamageCritical(attacker: Character, target: Character, ability?: Ability, ally?: Character) {
    var isCritical = false;

    if (ability !== undefined) {
      if (ability.userEffect.length > 0 && ability.userEffect.some(item => item.type === StatusEffectEnum.AutomaticCritical))
        return true;
    }

    var criticalChance = .05;
    var rng = this.utilityService.getRandomNumber(0, 1);

    criticalChance = this.lookupService.getDamageCriticalChance(attacker, target, ability?.name === "Kiss of Death", ally);

    if (rng <= criticalChance) {
      isCritical = true;
    }

    return isCritical;
  }

  checkForArtemisSetBonus(attacker: Character, target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Artemis, attacker.equipmentSet) !== 5)
      return;

    if (target.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.StunImmunity))
      return;

    this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Stun, this.globalService.getSetBonusAmount(EquipmentSetEnum.Artemis, 5), 1, false, false), target, undefined, attacker);
  }

  checkForHermesSetBonus(attacker: Character, target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Hermes, attacker.equipmentSet) !== 5)
      return;

    var rng = this.utilityService.getRandomNumber(0, 1);

    if (rng <= this.globalService.getSetBonusAmount(EquipmentSetEnum.Hermes, 5)) {
      var trueDamageDealt = this.dealTrueDamage(true, target, this.lookupService.getAdjustedAttack(attacker), attacker, undefined, true);
      var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " Air damage from " + attacker.name + "'s effect.";

      if (this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
      }
    }
  }

  checkForApolloSetBonus(attacker: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Apollo, attacker.equipmentSet) !== 5)
      return;

    var effect = this.globalService.createStatusEffect(StatusEffectEnum.OstinatoAfter, 5, .2, false, true);
    this.applyStatusEffect(effect, attacker, undefined, attacker);
  }

  checkForHadesSetBonus(attacker: Character, potentialTargets: Character[], party: Character[]) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Hades, attacker.equipmentSet) !== 5)
      return;


    var rng = this.utilityService.getRandomNumber(0, 1);

    if (rng <= this.globalService.getSetBonusAmount(EquipmentSetEnum.Hades, 5)) {
      var earthquake = this.lookupService.characterHasAbility("Earthquake", attacker);
      if (earthquake !== undefined)
        this.useAbility(true, earthquake, attacker, potentialTargets, party, true);
    }
  }

  checkForPoseidonSetBonus(attacker: Character, potentialTargets: Character[], party: Character[], ability: Ability) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Poseidon, attacker.equipmentSet) !== 5)
      return;

    var rng = this.utilityService.getRandomNumber(0, 1);

    if (rng <= this.globalService.getSetBonusAmount(EquipmentSetEnum.Poseidon, 5)) {
      ability.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
    }
  }

  checkForNemesisSetBonus(target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Nemesis, target.equipmentSet) !== 5)
      return 0;

    var dispenserOfDuesEffect = target.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
    if (dispenserOfDuesEffect !== undefined)
      return dispenserOfDuesEffect.effectiveness * .25;

    return 0;
  }

  checkForHeraSetBonus(target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Hera, target.equipmentSet) !== 5)
      return false;

    return true;
  }

  checkForDionysusSetBonus(target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Dionysus, target.equipmentSet) === 5)
      return true;

    return false;
  }

  checkForAphroditeSetBonus(target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Aphrodite, target.equipmentSet) === 5)
      return true;

    return false;
  }

  checkForZeusSetBonus(attacker: Character, target: Character, damageDealt: number) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Zeus, attacker.equipmentSet) !== 5)
      return;

    var rng = this.utilityService.getRandomNumber(0, 1);

    if (rng <= .2) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.RepeatDamageAfterDelay, this.globalService.getSetBonusAmount(EquipmentSetEnum.Zeus, 5), damageDealt, false, true), attacker, undefined, attacker);
    }
  }

  checkForShadowSetBonus(attacker: Character, target: Character) {
    if (this.globalService.getSetCount(EquipmentSetEnum.Shadow, target.equipmentSet) !== 3)
      return;

    var rng = this.utilityService.getRandomNumber(0, 1);

    if (rng <= .5) {
      this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 6, 0, false, true), target, undefined, target);
    }
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
          var teammate = this.battle.currentEnemies.enemyList.find(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));

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

        var lastGasp = this.lookupService.characterHasAbility("Last Gasp", character);
        if (lastGasp !== undefined) //this is assumed to be Divine Owl from Trial of Resolve
        {
          var teammate = this.battle.currentEnemies.enemyList.find(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));

          if (teammate !== undefined) {
            this.applyStatusEffect(lastGasp.userEffect[0], teammate, undefined);
          }
        }

        var forgottenPromise = this.lookupService.characterHasAbility("Forgotten Promise", character);
        if (forgottenPromise !== undefined) //this is assumed to be The Bee from the Eternal Melee
        {
          var teammate = this.battle.currentEnemies.enemyList.find(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
          if (teammate !== undefined) {
            this.applyStatusEffect(forgottenPromise.userEffect[0], teammate, undefined);
          }
        }

        var vengeanceOfTheWoods = this.lookupService.characterHasAbility("Vengeance of the Woods", character);
        if (vengeanceOfTheWoods !== undefined) //this is assumed to be Rhoecus from the Eternal Melee
        {
          var party = this.globalService.getActivePartyCharacters(true);
          var potentialTargets = party.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));

          if (potentialTargets.length > 0 && vengeanceOfTheWoods.targetEffect.length > 0) {
            potentialTargets.forEach(potentialTarget => {
              var effectiveness = this.lookupService.getAdjustedMaxHp(potentialTarget, false) * vengeanceOfTheWoods!.targetEffect[0].effectiveness;

              var trueDamageDealt = this.dealTrueDamage(false, potentialTarget, effectiveness, character, undefined, true);

              var gameLogEntry = "<strong>" + potentialTarget.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(trueDamageDealt)) + " damage";
              gameLogEntry += " from Vegeance of the Wood's effect.";

              if (this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse")) {
                this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
              }
            });
          }
        }

        if (character.name === "Ladon" || character.name === "Heracles") {
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
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, "With one final angry snarl, <strong>" + character.name + "</strong> uses Khalkotauroi Fury on <strong class='" + this.globalService.getCharacterColorClassText(target.type) + "'>" + target.name + "</strong>.", this.globalService.globalVar);
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
      this.moveToNextBattle(enemies);
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
      if (this.battle.activeTournament.type === ColiseumTournamentEnum.FriendlyCompetition)
        this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You have been defeated in the Coliseum.", this.globalService.globalVar);
      else
        this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You have been defeated in the Coliseum. You finished in round " + this.battle.activeTournament.currentRound + (this.battle.activeTournament.maxRounds !== -1 ? " of " + this.battle.activeTournament.maxRounds : "") + ".", this.globalService.globalVar);
      this.globalService.handleColiseumLoss(this.battle.activeTournament.type, this.battle.activeTournament.currentRound);
      this.battle.activeTournament = this.globalService.setNewTournament(this.battle.activeTournament.type === ColiseumTournamentEnum.WeeklyMelee);
    }
    else if (this.battle.activeTrial.type === TrialEnum.TrialOfSkill) {
      this.globalService.handleTrialLoss(this.battle.activeTrial.type);
      this.battle.activeTrial = this.globalService.setNewTrial(true);
    }
    else if (underworld !== undefined && underworld.isAvailable) {
      //send you to the underworld
      var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
      if (startingPoint !== undefined) {
        this.balladService.setActiveSubZone(startingPoint.type);
        this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
      }

      if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. You hurry back to the safety of town.", this.globalService.globalVar);
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated. You hurry back to the safety of town.", this.globalService.globalVar);
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "You have been defeated. You quickly retreat and regroup.", this.globalService.globalVar);
        }
      }
    }

    this.applyStatusEffect(recentlyDefeatedDebuff, party[0], party);
  }

  moveToNextBattle(enemies: Character[]) {
    this.showNewEnemyGroup = true;
    if (this.globalService.globalVar.gameLogSettings.get("battleUpdates")) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "The enemy party has been defeated.", this.globalService.globalVar);
    }
    var subZone = this.balladService.getActiveSubZone();
    subZone.victoryCount += 1;
    this.altarService.incrementAltarCount(AltarConditionEnum.Victories);

    //console.log("Completed in: " + this.battle.battleDuration);
    if (subZone.fastestCompletion === undefined || this.battle.battleDuration < subZone.fastestCompletion) {
      subZone.fastestCompletion = this.utilityService.roundTo(this.battle.battleDuration, 5);
    }

    var xps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculateXps();
    if (subZone !== undefined && (subZone.maxXps === undefined || subZone.maxXps < Math.round(xps)))
      subZone.maxXps = Math.round(xps);

    var dps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculatePartyDps();
    if (subZone !== undefined && (subZone.maxDps === undefined || subZone.maxDps < Math.round(dps)))
      subZone.maxDps = Math.round(dps);

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      member.battleInfo.duoAbilityUsed = false;
      var shapeshift = member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
      if (shapeshift !== undefined) {
        var hera = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hera);
        var baseShapeshift = hera?.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);

        if (baseShapeshift !== undefined) {
          baseShapeshift.currentCooldown = baseShapeshift.cooldown;
          shapeshift.effectiveness = 1;
          shapeshift.count = 0;
        }
      }

      if (enemies.some(item => item.name === "Orange-Flowered Colossus")) {
        member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Focus);
        member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageTakenUp);
        member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageDealtDown);
      }

      if (enemies.some(item => item.name === "Aeëtes")) {
        member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.MaxHpDown);
      }
    });

    var achievements = this.achievementService.checkForSubzoneAchievement(subZone.type, this.globalService.globalVar.achievements);

    if (achievements !== undefined && achievements.length > 0) {
      this.addAchievementToGameLog(achievements);
    }

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.WeeklyMelee && this.battle.activeTournament.type !== ColiseumTournamentEnum.FriendlyCompetition) { //don't get xp/coins/items until you finish the melee
      //gain bonus XP depending on enemy party size
      var partySizeXpMultiplier = 1;
      if (this.battle.currentEnemies.enemyList.length === 2)
        partySizeXpMultiplier = 1.15;
      if (this.battle.currentEnemies.enemyList.length === 3)
        partySizeXpMultiplier = 1.3;
      if (this.battle.currentEnemies.enemyList.length === 4)
        partySizeXpMultiplier = 1.45;


      if (this.globalService.globalVar.gameLogSettings.get("battleXpRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + Math.round(this.lookupService.getTotalXpGainFromEnemyTeam(this.battle.currentEnemies.enemyList, partySizeXpMultiplier)).toLocaleString() + " XP</strong>.", this.globalService.globalVar);
      }

      this.battle.currentEnemies.enemyList.forEach(enemy => {
        this.dpsCalculatorService.addXpGain(enemy.xpGainFromDefeat * partySizeXpMultiplier);
      });

      this.globalService.giveCharactersExpFromBattle(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies, partySizeXpMultiplier);
      this.updateEnemyDefeatCount(this.battle.currentEnemies);

      var loot = this.getLoot(this.battle.currentEnemies);
      this.getCoinRewards(this.battle.currentEnemies);
      if (loot !== undefined && loot.length > 0) {
        loot.forEach(item => {
          var itemCopy = this.lookupService.makeResourceCopy(item);
          if (this.globalService.globalVar.gameLogSettings.get("battleItemsRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCopy.amount + " " + (itemCopy.amount === 1 ? this.dictionaryService.getItemName(itemCopy.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(itemCopy.item))) + "</strong>.", this.globalService.globalVar);
          }

          this.lookupService.addLootToLog(itemCopy.item, itemCopy.amount, subZone.type);

          if (itemCopy.item === ItemsEnum.FocusPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.FocusPotion);
          }
          else if (itemCopy.item === ItemsEnum.PotentConcoctionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.PotentConcoction);
          }
          else if (itemCopy.item === ItemsEnum.FireAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.FireAbsorptionPotion);
          }
          else if (itemCopy.item === ItemsEnum.HolyAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.HolyAbsorptionPotion);
          }
          else if (itemCopy.item === ItemsEnum.EarthAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.EarthAbsorptionPotion);
          }
          else if (itemCopy.item === ItemsEnum.LightningAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.LightningAbsorptionPotion);
          }
          else if (itemCopy.item === ItemsEnum.AirAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.AirAbsorptionPotion);
          }
          else if (itemCopy.item === ItemsEnum.WaterAbsorptionPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.WaterAbsorptionPotion);
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
          else if (itemCopy.item === ItemsEnum.PerfectGemstone && this.lookupService.getResourceAmount(ItemsEnum.PerfectGemstone) < 1) {
            var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
            if (jewelcrafting !== undefined) {
              jewelcrafting.maxLevel += 25;
              this.addLootToResources(new ResourceValue(item.item, 1));
            }
          }
          else if (itemCopy.item === ItemsEnum.MagicalVial && this.lookupService.getResourceAmount(ItemsEnum.MagicalVial) < 1) {
            var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
            if (alchemy !== undefined) {
              alchemy.maxLevel += 25;
              this.addLootToResources(new ResourceValue(item.item, 1));
            }
          }
          else {
            var isItemUnique = this.lookupService.isItemUnique(itemCopy.item);
            var existingUnique = this.globalService.globalVar.uniques.find(item => item.type === itemCopy.item);

            if (!isItemUnique || existingUnique === undefined)
              this.addLootToResources(itemCopy);


            if (isItemUnique) {
              if (existingUnique !== undefined) {
                this.lookupService.giveUniqueXp(existingUnique, item.amount);
              }
              else {
                this.globalService.globalVar.uniques.push(new Uniques(itemCopy.item));

                if (!this.globalService.globalVar.logData.some(item => item.type === LogViewEnum.Tutorials && item.relevantEnumValue === TutorialTypeEnum.Uniques)) {
                  this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Uniques, undefined, undefined, true, subZone.type), this.globalService.globalVar);
                  this.globalService.handleTutorialModal();
                }
              }
            }
          }
        });
      }
    }

    if (subZone.victoryCount >= this.balladService.getVictoriesNeededToProceed(subZone.type)) {
      this.unlockNextSubzone(subZone);
    }

    if (this.battle.activeTournament.type !== ColiseumTournamentEnum.None) {
      if ((this.battle.activeTournament.maxRounds !== -1 && this.battle.activeTournament.currentRound >= this.battle.activeTournament.maxRounds) ||
        this.battle.activeTournament.type === ColiseumTournamentEnum.FriendlyCompetition) {
        //handle victory situation
        this.coliseumService.handleColiseumVictory(this.battle.activeTournament.type);
      }
      else
        this.battle.activeTournament.currentRound += 1;
    }

    if (this.battle.activeTrial.type !== TrialEnum.None) {
      this.trialService.handleTrialVictory(this.battle.activeTrial.type);
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
          if (loot.item === ItemsEnum.PerfectGemstone && this.lookupService.getResourceAmount(ItemsEnum.PerfectGemstone) >= 1)
            return;
          if (loot.item === ItemsEnum.MagicalVial && this.lookupService.getResourceAmount(ItemsEnum.MagicalVial) >= 1)
            return;

          var rng = this.utilityService.getRandomNumber(0, 1);
          var lootChance = loot.chance;

          var lootRateEffect = this.globalService.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.LootRateUp);
          if (lootRateEffect !== undefined) {
            lootChance = lootChance * lootRateEffect.effectiveness;
          }

          if (rng <= lootChance) {
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain <strong>" + Math.round(coin) + " " + (Math.round(coin) === 1 ? this.dictionaryService.getItemName(ItemsEnum.Coin) : this.utilityService.handlePlural(this.dictionaryService.getItemName(ItemsEnum.Coin))) + "</strong>.", this.globalService.globalVar);
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, gameLogUpdate, this.globalService.globalVar);
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
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.NewSubzone, undefined, undefined, true, subZone), this.globalService.globalVar);
            this.globalService.handleTutorialModal();
          }
          if (unlockedSubZone.type === SubZoneEnum.AigosthenaWesternWoodlands) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.QuickView, undefined, undefined, true, subZone), this.globalService.globalVar);
            this.globalService.handleTutorialModal();
          }
          if (unlockedSubZone.type === SubZoneEnum.PeloposNisosArcadianRoads && !this.globalService.globalVar.isSubscriber) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.GameReview, undefined, undefined, true, subZone), this.globalService.globalVar);
            this.globalService.handleTutorialModal();
          }
        }
      });
    }
  }

  togglePause() {
    this.globalService.globalVar.isGamePaused = !this.globalService.globalVar.isGamePaused;
  }

  useDuoAbility(character: Character) {
    var gods = [];
    gods.push(character.assignedGod1);
    gods.push(character.assignedGod2);

    var ability = this.lookupService.getDuoAbility(gods);
    this.useAbility(true, ability, character, this.battle.currentEnemies.enemyList, this.globalService.getActivePartyCharacters(true), true);

    character.battleInfo.duoAbilityUsed = true;
    character.battleInfo.duoAbilityCooldown = this.utilityService.duoAbilityCooldown;
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
      if (isEnemy || (isCharacterDead && this.battleItemInUse !== ItemsEnum.MagicRevivify))
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

      var itemBoostEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ItemBoost);
      if (itemBoostEffect !== undefined) {
        damageMultiplier += itemBoostEffect.effectiveness;
        healingMultiplier += itemBoostEffect.effectiveness;
      }
    });

    if (this.battleItemInUse === ItemsEnum.HealingHerb || this.battleItemInUse === ItemsEnum.HealingPoultice
      || this.battleItemInUse === ItemsEnum.RestorativeHerb || this.battleItemInUse === ItemsEnum.RestorativePoultice
      || this.battleItemInUse === ItemsEnum.HoneyPoultice || this.battleItemInUse === ItemsEnum.PeonyPoultice
      || this.battleItemInUse === ItemsEnum.SoothingHerb || this.battleItemInUse === ItemsEnum.InkPoultice) {
      if (character.battleStats.currentHp === this.lookupService.getAdjustedMaxHp(character))
        return;

      var additionalPercentValue = 0;
      if (effect.healPercent > 0)
        additionalPercentValue = effect.healPercent * this.lookupService.getAdjustedMaxHp(character);

      var healedAmount = this.gainHp(character, (effect.healAmount + additionalPercentValue) * healingMultiplier);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        if (character.name === "Asclepius") {
          var gameLogEntry = "You leave one " + itemName + " worth " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP at the altar in honor of <strong>Asclepius</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
        else {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses " + itemName + ", gaining " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, healedAmount) + " HP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
      }
    }

    if (this.battleItemInUse === ItemsEnum.MagicRevivify) {
      if (character.battleStats.currentHp > 0)
        return;

      var healedAmount = this.gainHp(character, effect.healAmount * this.lookupService.getAdjustedMaxHp(character))
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        if (character.name === "Asclepius") {
          var gameLogEntry = "You leave one " + itemName + " worth " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP at the altar in honor of <strong>Asclepius</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
        else {
          var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses " + itemName + ", gaining " + Math.round(healedAmount) + " HP.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
      }
    }

    if (this.battleItemInUse === ItemsEnum.TokenOfSupport) {
      this.globalService.globalVar.gods.filter(item => item.isAvailable).forEach(god => {
        var altar = this.altarService.getNewAltar(AltarEnum.Small, god.type, false);
        this.altarService.pray(altar, false, false, true);
      });

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    if (this.battleItemInUse === ItemsEnum.TokenOfFavor) {
      this.globalService.globalVar.gods.filter(item => item.isAvailable).forEach(god => {
        var altar = this.altarService.getNewAltar(AltarEnum.Large, god.type, false);
        this.altarService.pray(altar, false, false, true);
      });

      this.lookupService.useResource(this.battleItemInUse, 1);
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (this.battleItemInUse === ItemsEnum.FireAbsorptionPotion || this.battleItemInUse === ItemsEnum.WaterAbsorptionPotion ||
      this.battleItemInUse === ItemsEnum.HolyAbsorptionPotion || this.battleItemInUse === ItemsEnum.LightningAbsorptionPotion ||
      this.battleItemInUse === ItemsEnum.EarthAbsorptionPotion || this.battleItemInUse === ItemsEnum.AirAbsorptionPotion) {
      if (character.battleStats.currentHp <= 0)
        return;

      effect.userEffect[0].effectiveness += (damageMultiplier - 1);
      effect.userEffect[0].effectiveness = effect.userEffect[0].effectiveness * this.lookupService.getAdjustedMaxHp(character);

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " gains elemental absorption from " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HealingSalve || this.battleItemInUse === ItemsEnum.RestorativeSalve ||
      this.battleItemInUse === ItemsEnum.HoneySalve || this.battleItemInUse === ItemsEnum.MagicSalve || this.battleItemInUse === ItemsEnum.PeonySalve ||
      this.battleItemInUse === ItemsEnum.InkSalve) {
      var itemUsed = false;

      if (character.name === "Asclepius") {
        itemUsed = true;
        var healedAmount = this.gainHp(character, effect.healAmount * healingMultiplier);
        if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
          var gameLogEntry = "You leave one " + itemName + " worth " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP at the altar in honor of <strong>Asclepius</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
      }

      party.forEach(member => {
        if (!member.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)
          && member.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(member)) {
          itemUsed = true;

          var additionalPercentValue = 0;
          if (effect.healPercent > 0)
            additionalPercentValue = effect.healPercent * this.lookupService.getAdjustedMaxHp(member);

          var healedAmount = this.gainHp(member, (effect.healAmount + additionalPercentValue) * healingMultiplier)

          if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
            var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(member.type) + "'>" + member.name + "</strong>" + " uses " + itemName + ", gaining " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(healedAmount)) + " HP.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
          }
        }
      })

      if (!itemUsed)
        return;

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    if (this.battleItemInUse === ItemsEnum.ThrowingStone || this.battleItemInUse === ItemsEnum.ExplodingPotion ||
      this.battleItemInUse === ItemsEnum.FirePotion || this.battleItemInUse === ItemsEnum.HeftyStone ||
      this.battleItemInUse === ItemsEnum.PotentConcoction || this.battleItemInUse === ItemsEnum.PiercingPotion ||
      this.battleItemInUse === ItemsEnum.BouncingPotion || this.battleItemInUse === ItemsEnum.BurstingPotion ||
      this.battleItemInUse === ItemsEnum.EndlessPotion) {
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

      var baseDamage = effect.trueDamageAmount;

      if (effect.trueDamagePercent > 0) {
        effect.trueDamageAmount = effect.trueDamagePercent * character.battleStats.maxHp;

        if (effect.maxThreshold > 0 && effect.trueDamageAmount > effect.maxThreshold)
          effect.trueDamageAmount = effect.maxThreshold;

        effect.trueDamageAmount += baseDamage;
      }

      var hitCount = 1;
      if (this.battleItemInUse === ItemsEnum.BouncingPotion)
        hitCount = 2;
      if (this.battleItemInUse === ItemsEnum.BurstingPotion)
        hitCount = 3;
      if (this.battleItemInUse === ItemsEnum.EndlessPotion)
        hitCount = 10;

      for (var i = 0; i < hitCount; i++) {
        var damage = this.dealTrueDamage(true, character, effect.trueDamageAmount * damageMultiplier, undefined, elementalType, true);

        if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
          var gameLogEntry = "<strong>" + character.name + "</strong>" + " is hit by " + itemName + ", dealing " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + elementalText + " damage.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
        }
      }

      this.lookupService.useResource(this.battleItemInUse, 1);
    }

    //aoe damage
    if (this.battleItemInUse === ItemsEnum.UnstablePotion || this.battleItemInUse === ItemsEnum.WildPotion ||
      this.battleItemInUse === ItemsEnum.ShatteringPotion) {
      var itemUsed = false;
      var hitCount = 1;
      if (this.battleItemInUse === ItemsEnum.WildPotion)
        hitCount = 2;
      if (this.battleItemInUse === ItemsEnum.ShatteringPotion)
        hitCount = 3;

      var baseDamage = effect.trueDamageAmount;

      party.forEach(member => {
        if (member.battleStats.currentHp > 0) {
          itemUsed = true;

          var elementalText = "";
          if (elementalType !== ElementalTypeEnum.None)
            elementalText = this.getElementalDamageText(elementalType);

          if (effect.trueDamagePercent > 0) {
            effect.trueDamageAmount = effect.trueDamagePercent * member.battleStats.maxHp;

            if (effect.maxThreshold > 0 && effect.trueDamageAmount > effect.maxThreshold)
              effect.trueDamageAmount = effect.maxThreshold;

            effect.trueDamageAmount += baseDamage;
          }

          for (var i = 0; i < hitCount; i++) {
            var damage = this.dealTrueDamage(true, member, effect.trueDamageAmount * damageMultiplier, undefined, elementalType, true);

            if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
              var gameLogEntry = "<strong>" + member.name + "</strong>" + " is hit by " + itemName + ", dealing " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, damage) + elementalText + " damage.";
              this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
            }
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
            this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (this.battleItemInUse === ItemsEnum.PoisonousToxin || this.battleItemInUse === ItemsEnum.DebilitatingToxin ||
      this.battleItemInUse === ItemsEnum.WitheringToxin || this.battleItemInUse === ItemsEnum.VenomousToxin ||
      this.battleItemInUse === ItemsEnum.FlamingToxin || this.battleItemInUse === ItemsEnum.ParalyzingToxin ||
      this.battleItemInUse === ItemsEnum.SandToxin || this.battleItemInUse === ItemsEnum.ElectrifiedToxin ||
      this.battleItemInUse === ItemsEnum.MagicToxin || this.battleItemInUse === ItemsEnum.TidalToxin ||
      this.battleItemInUse === ItemsEnum.UnsteadyingToxin || this.battleItemInUse === ItemsEnum.AgonizingToxin ||
      this.battleItemInUse === ItemsEnum.CorrosiveToxin || this.battleItemInUse === ItemsEnum.TempestToxin ||
      this.battleItemInUse === ItemsEnum.LightToxin) {
      if (character.battleStats.currentHp <= 0)
        return;

      var matchingStatusEffect = this.getMatchingStatusEffectFromItem(this.battleItemInUse);

      //remove any other existing toxin
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type === matchingStatusEffect || !this.isStatusEffectAToxin(item.type));

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " applies " + itemName + " to their weapon.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (this.battleItemInUse === ItemsEnum.HeroicElixir || this.battleItemInUse === ItemsEnum.RejuvenatingElixir ||
      this.battleItemInUse === ItemsEnum.ElixirOfFortitude || this.battleItemInUse === ItemsEnum.ElixirOfSpeed ||
      this.battleItemInUse === ItemsEnum.ElixirOfFortune || this.battleItemInUse === ItemsEnum.ElixirOfWill ||
      this.battleItemInUse === ItemsEnum.MetalElixir || this.battleItemInUse === ItemsEnum.RestorativeElixir ||
      this.battleItemInUse === ItemsEnum.ElixirOfPower) {
      if (character.battleStats.currentHp <= 0)
        return;

      var matchingStatusEffect = this.getMatchingStatusEffectFromItem(this.battleItemInUse);

      //remove any other existing elixir
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type === matchingStatusEffect || !this.isStatusEffectAnElixir(item.type));

      this.applyStatusEffect(effect.userEffect[0], character);
      this.lookupService.useResource(this.battleItemInUse, 1);

      if (this.globalService.globalVar.gameLogSettings.get("useBattleItem")) {
        var gameLogEntry = "<strong>" + character.name + "</strong>" + " uses " + itemName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.UseBattleItem, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (effect.cooldown > 0) {
      var itemCooldown = effect.cooldown;

      this.globalService.getActivePartyCharacters(true).forEach(member => {
        var itemBoostEffect = member.battleInfo.statusEffects.find(effect => effect.type === StatusEffectEnum.ItemBoost);
        if (itemBoostEffect !== undefined)
          itemCooldown *= 1 - itemBoostEffect.count;
      });

      this.globalService.globalVar.timers.itemCooldowns.push([this.battleItemInUse, itemCooldown]);
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
    if (type === ItemsEnum.AgonizingToxin) {
      return StatusEffectEnum.AgonizingToxin;
    }
    if (type === ItemsEnum.PoisonousToxin) {
      return StatusEffectEnum.PoisonousToxin;
    }
    if (type === ItemsEnum.FlamingToxin) {
      return StatusEffectEnum.FlamingToxin;
    }
    if (type === ItemsEnum.CorrosiveToxin) {
      return StatusEffectEnum.CorrosiveToxin;
    }
    if (type === ItemsEnum.LightToxin) {
      return StatusEffectEnum.LightToxin;
    }
    if (type === ItemsEnum.TempestToxin) {
      return StatusEffectEnum.TempestToxin;
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
    if (type === ItemsEnum.ElixirOfFortune) {
      return StatusEffectEnum.ElixirOfFortune;
    }
    if (type === ItemsEnum.ElixirOfPower) {
      return StatusEffectEnum.ElixirOfPower;
    }
    if (type === ItemsEnum.MetalElixir) {
      return StatusEffectEnum.MetalElixir;
    }
    if (type === ItemsEnum.RestorativeElixir) {
      return StatusEffectEnum.RestorativeElixir;
    }
    if (type === ItemsEnum.MagicToxin) {
      return StatusEffectEnum.MagicToxin;
    }
    if (type === ItemsEnum.SandToxin) {
      return StatusEffectEnum.SandToxin;
    }
    if (type === ItemsEnum.ElectrifiedToxin) {
      return StatusEffectEnum.ElectrifiedToxin;
    }
    if (type === ItemsEnum.TidalToxin) {
      return StatusEffectEnum.TidalToxin;
    }
    if (type === ItemsEnum.UnsteadyingToxin) {
      return StatusEffectEnum.UnsteadyingToxin;
    }
    if (type === ItemsEnum.ElixirOfWill) {
      return StatusEffectEnum.ElixirOfWill;
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

  handleHpRegen(character: Character, deltaTime: number, isEnemy: boolean = false) {
    var runCount = 0;
    var maxRunCount = 50;
    if (isEnemy) {
      var gaiasBlessing = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.GaiasBlessing);
      if (gaiasBlessing !== undefined) {
        character.battleInfo.hpRegenTimerLength = 30;
        character.battleInfo.hpRegenTimer += this.utilityService.roundTo(deltaTime, this.utilityService.genericRoundTo);

        while (character.battleInfo.hpRegenTimer >= character.battleInfo.hpRegenTimerLength && runCount < maxRunCount) {
          runCount += 1;
          var hpRegen = character.battleStats.maxHp * .05;
          this.gainHp(character, hpRegen);
          character.battleInfo.hpRegenTimer -= character.battleInfo.hpRegenTimerLength;
        }
      }
    }
    else {
      character.battleInfo.hpRegenTimer += this.utilityService.roundTo(deltaTime, this.utilityService.genericRoundTo);
      //console.log(character.name + " " + character.battleInfo.hpRegenTimer);
      while (character.battleInfo.hpRegenTimer >= character.battleInfo.hpRegenTimerLength && runCount < maxRunCount) {
        runCount += 1;
        var totalHpRegen = character.battleStats.hpRegen;

        var rejuvenatingElixir = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.RejuvenatingElixir);
        if (rejuvenatingElixir !== undefined) {
          totalHpRegen += rejuvenatingElixir.effectiveness;
        }

        var restorativeElixir = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.RestorativeElixir);
        if (restorativeElixir !== undefined) {
          totalHpRegen += restorativeElixir.effectiveness * this.lookupService.getAdjustedMaxHp(character);
        }

        if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareHpRegenIncrease) !== undefined) {
          var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloRareHpRegenIncrease);
          totalHpRegen *= relevantAltarEffect!.effectiveness;
        }

        var hpRegenUp = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.HpRegenUp);
        if (hpRegenUp !== undefined) {
          totalHpRegen *= hpRegenUp.effectiveness;
        }

        //console.log("Character HP Regen");
        this.gainHp(character, totalHpRegen);
        character.battleInfo.hpRegenTimer -= character.battleInfo.hpRegenTimerLength;
        character.battleInfo.hpRegenTimer = this.utilityService.roundTo(character.battleInfo.hpRegenTimer, this.utilityService.genericRoundTo);
      }
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

  checkForEquipmentEffect(trigger: EffectTriggerEnum, user: Character | undefined, target: Character | undefined, party: Character[], targets: Character[], deltaTime: number = 0, originalTriggerTargetedAllies: boolean = false, totalAttempts: number = 1, removeInstantAutoAttack: boolean = false, damageDealt?: number, healingDone?: number) {
    var userGainsEffects: StatusEffect[] = [];
    var targetGainsEffects: StatusEffect[] = [];
    var rng = 0;

    if (user === undefined)
      return;

    //go through each equipment piece
    if (user.equipmentSet.weapon !== undefined) {
      user.equipmentSet.weapon.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === trigger) {

          equipmentEffect.userEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else {
              for (var i = 0; i < totalAttempts; i++)
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            }
          });

          equipmentEffect.targetEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else {
              for (var i = 0; i < totalAttempts; i++)
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
            }
          });
        }
      });
    }


    if (user.equipmentSet.shield !== undefined) {
      user.equipmentSet.shield.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === trigger) {
          equipmentEffect.userEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });

          equipmentEffect.targetEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });
        }
      });
    }

    if (user.equipmentSet.armor !== undefined) {
      user.equipmentSet.armor.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === trigger) {

          equipmentEffect.userEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });

          equipmentEffect.targetEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });
        }
      });
    }

    if (user.equipmentSet.ring !== undefined) {
      user.equipmentSet.ring.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === trigger) {

          equipmentEffect.userEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });

          equipmentEffect.targetEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });
        }
      });
    }

    if (user.equipmentSet.necklace !== undefined) {
      user.equipmentSet.necklace.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === trigger) {

          equipmentEffect.userEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              userGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });

          equipmentEffect.targetEffect.forEach(effect => {
            if (trigger === EffectTriggerEnum.ChanceOnAutoAttack || trigger === EffectTriggerEnum.ChanceOnAbilityUse || trigger === EffectTriggerEnum.ChanceOnCriticalHit ||
              trigger === EffectTriggerEnum.ChanceWhenDamageTaken || trigger === EffectTriggerEnum.ChanceOnHeal || trigger === EffectTriggerEnum.ChanceOnDotTick ||
              trigger === EffectTriggerEnum.ChanceOnDebuff || trigger === EffectTriggerEnum.ChanceWhenNonCriticalDamageTaken) {
              for (var i = 0; i < totalAttempts; i++) {
                rng = this.utilityService.getRandomNumber(0, 1);
                if (rng <= equipmentEffect.chance)
                  targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TriggersEvery) {
              equipmentEffect.triggersEveryCount += deltaTime;

              if (equipmentEffect.triggersEveryCount >= effect.triggersEvery) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
                equipmentEffect.triggersEveryCount = 0;
              }
            }
            else if (trigger === EffectTriggerEnum.AfterTime) {
              if (effect.maxCount < deltaTime) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else if (trigger === EffectTriggerEnum.TargetAboveHpPercentAbility) {
              if (target !== undefined && target.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(target) > equipmentEffect.maxThreshold) {
                targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
              }
            }
            else
              targetGainsEffects.push(this.globalService.makeStatusEffectCopy(effect));
          });
        }
      });
    }

    if (userGainsEffects.length > 0) {
      var boundingBandUnique = userGainsEffects.find(item => item.type === StatusEffectEnum.BoundingBandUnique);
      if (boundingBandUnique !== undefined) {
        boundingBandUnique.count = this.lookupService.getTotalAutoAttackCount(user, true);
      }

      var scathingBeautyUnique = userGainsEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique);
      if (scathingBeautyUnique !== undefined) {
        var scathingBeautyEffect = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ScathingBeautyUnique);
        if (scathingBeautyEffect === undefined) {
          scathingBeautyUnique.stackCount = 1;
        }
        else {
          userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.ScathingBeautyUnique);
        }
      }

      var overheal = userGainsEffects.find(item => item.type === StatusEffectEnum.Overheal);
      if (overheal !== undefined) {
        overheal.effectiveness = overheal.effectiveness * this.lookupService.getAdjustedResistance(user, true);
      }

      //if it's already active, don't reapply
      if (trigger === EffectTriggerEnum.AlwaysActive) {
        userGainsEffects.forEach(effect => {
          if (user.battleInfo.statusEffects.some(existingEffect => existingEffect.caster === effect.caster)) {
            effect.type = StatusEffectEnum.None;
          }
        });

        userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.None);
      }

      if (removeInstantAutoAttack) {
        userGainsEffects = userGainsEffects.filter(item => item.type !== StatusEffectEnum.InstantAutoAttack);
      }

      //console.log("Effect  " + userGainsEffects[0].type);      
      this.handleUserEffects(true, userGainsEffects, user, party, targets, damageDealt, undefined, healingDone);
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
        if (effect.dotType === dotTypeEnum.BasedOnAttack && effect.abilityName !== "Stingray Tip") //reusing this enum
        {
          effect.effectiveness *= this.lookupService.getAdjustedAttack(user);
        }

        if (effect.dotType === dotTypeEnum.BasedOnDamage && damageDealt === 0) {
          effect.isInstant = true;
        }

        if (effect.type === StatusEffectEnum.InstantTrueDamage && effect.dotType === dotTypeEnum.EnemyMaxHpPercent && damageDealt !== undefined)
          effect.effectiveness *= damageDealt!;
      });

      if (removeInstantAutoAttack) {
        targetGainsEffects = targetGainsEffects.filter(item => item.type !== StatusEffectEnum.InstantAutoAttack);
      }

      this.handleTargetEffects(true, targetGainsEffects, user, target, targets, party, damageDealt, originalTriggerTargetedAllies);
    }
  }

  applyToxin(user: Character, target: Character, party: Character[], targets: Character[], totalAttempts: number = 1) {
    //check if user has toxin buff
    //handle based on what it is    
    var poisonousToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.PoisonousToxin);
    if (poisonousToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= poisonousToxin.effectiveness) {
          var damageDealt = 265;
          this.dealTrueDamage(true, target, damageDealt, user, undefined, true);
          var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(damageDealt)) + " damage from " + poisonousToxin.caster + "'s effect.";

          if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    var debilitatingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DebilitatingToxin);
    if (debilitatingToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= debilitatingToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 14, .8, false, false), target, undefined, user);
        }
      }
    }

    var witheringToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.WitheringToxin);
    if (witheringToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= witheringToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 16, .8, false, false), target, undefined, user);
        }
      }
    }

    var corrosiveToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.CorrosiveToxin);
    if (corrosiveToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= corrosiveToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 16, .8, false, false), target, undefined, user);
        }
      }
    }

    var paralyzingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ParalyzingToxin);
    if (paralyzingToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= paralyzingToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Paralyze, 20, 0, false, false), target, undefined, user);
        }
      }
    }

    var venomousToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.VenomousToxin);
    if (venomousToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= venomousToxin.effectiveness) {
          var damageDealt = 982;
          this.dealTrueDamage(true, target, damageDealt, user, undefined, true);
          var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(damageDealt)) + " damage from " + venomousToxin.caster + "'s effect.";

          if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    var agonizingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.AgonizingToxin);
    if (agonizingToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= agonizingToxin.effectiveness) {
          var damageDealt = 185000;
          this.dealTrueDamage(true, target, damageDealt, user, undefined, true);
          var gameLogEntry = "<strong>" + target.name + "</strong>" + " takes " + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, Math.round(damageDealt)) + " damage from " + agonizingToxin.caster + "'s effect.";

          if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
          }
        }
      }
    }

    var magicToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.MagicToxin);
    if (magicToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= magicToxin.effectiveness) {
          var enemyType = this.battle.currentEnemies.enemyList.find(item => item.name === target.name);
          if (enemyType !== undefined) {
            this.globalService.giveCharactersBonusExp(enemyType.xpGainFromDefeat * .2);

            var gameLogEntry = "You steal <strong>" + Math.round(enemyType.xpGainFromDefeat * .2) + "</strong>" + " XP from <strong>" + target.name + "</strong>.";

            if (this.globalService.globalVar.gameLogSettings.get("partyStatusEffect")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry, this.globalService.globalVar);
            }
          }
        }
      }
    }

    var unsteadyingToxin = user.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.UnsteadyingToxin);
    if (unsteadyingToxin !== undefined) {
      for (var i = 0; i < totalAttempts; i++) {
        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng <= unsteadyingToxin.effectiveness) {
          this.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 15, .2, false, false), target, undefined, user);
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


    var flamingToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.FlamingToxin);
    if (flamingToxin !== undefined) {
      elementalType = ElementalTypeEnum.Fire;
    }
    var sandToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.SandToxin);
    if (sandToxin !== undefined) {
      elementalType = ElementalTypeEnum.Earth;
    }
    var electrifiedToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.ElectrifiedToxin);
    if (electrifiedToxin !== undefined) {
      elementalType = ElementalTypeEnum.Lightning;
    }
    var tidalToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.TidalToxin);
    if (tidalToxin !== undefined) {
      elementalType = ElementalTypeEnum.Water;
    }
    var tempestToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.TempestToxin);
    if (tempestToxin !== undefined) {
      elementalType = ElementalTypeEnum.Air;
    }
    var lightToxin = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LightToxin);
    if (lightToxin !== undefined) {
      elementalType = ElementalTypeEnum.Holy;
    }

    if (elementalType === ElementalTypeEnum.None && character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Nature) {
      elementalType = character.overdriveInfo.lastUsedElement;
    }

    return elementalType;
  }

  checkOverdriveStatus(character: Character, deltaTime: number) {
    if (character.overdriveInfo.gaugeAmount === character.overdriveInfo.gaugeTotal &&
      (character.overdriveInfo.autoMode || character.overdriveInfo.manuallyTriggered)) {
      character.overdriveInfo.isActive = true;
      character.overdriveInfo.gaugeAmount = 0;
      character.overdriveInfo.activeDuration = 0;
      this.altarService.incrementAltarCount(AltarConditionEnum.OverdriveUse);

      if (this.globalService.globalVar.gameLogSettings.get("partyOverdrives")) {
        var gameLogEntry = "<strong class='" + this.globalService.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " uses Overdrive: " + this.lookupService.getOverdriveName(character.overdriveInfo.selectedOverdrive) + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Overdrive, gameLogEntry, this.globalService.globalVar);
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
          this.gameLogService.updateGameLog(GameLogEntryEnum.Overdrive, gameLogEntry, this.globalService.globalVar);
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
              //this.handleTargetEffects(true, [], character, enemy, this.battle.currentEnemies.enemyList, [], 0);
            }
          });
        }
      }
    }
  }

  isStatusEffectAToxin(effect: StatusEffectEnum) {
    if (effect === StatusEffectEnum.WitheringToxin || effect === StatusEffectEnum.VenomousToxin || effect === StatusEffectEnum.DebilitatingToxin ||
      effect === StatusEffectEnum.PoisonousToxin || effect === StatusEffectEnum.FlamingToxin || effect === StatusEffectEnum.ParalyzingToxin ||
      effect === StatusEffectEnum.SandToxin || effect === StatusEffectEnum.ElectrifiedToxin || effect === StatusEffectEnum.MagicToxin ||
      effect === StatusEffectEnum.TidalToxin || effect === StatusEffectEnum.UnsteadyingToxin || effect === StatusEffectEnum.AgonizingToxin ||
      effect === StatusEffectEnum.CorrosiveToxin || effect === StatusEffectEnum.LightToxin || effect === StatusEffectEnum.TempestToxin)
      return true;

    return false;
  }

  isStatusEffectAnElixir(effect: StatusEffectEnum) {
    if (effect === StatusEffectEnum.ElixirOfFortitude || effect === StatusEffectEnum.HeroicElixir || effect === StatusEffectEnum.RejuvenatingElixir ||
      effect === StatusEffectEnum.ElixirOfSpeed || effect === StatusEffectEnum.ElixirOfFortune || effect === StatusEffectEnum.ElixirOfWill ||
      effect === StatusEffectEnum.ElixirOfPower || effect === StatusEffectEnum.MetalElixir || effect === StatusEffectEnum.RestorativeElixir)
      return true;

    return false;
  }

  getBuffsOnCharacter(character: Character) {
    return character.battleInfo.statusEffects.filter(item => item.isPositive).length;
  }

  getDebuffsOnCharacter(character: Character) {
    return character.battleInfo.statusEffects.filter(item => !item.isPositive).length;
  }

  getUniqueDebuffsOnCharacter(character: Character) {
    var debuffs = character.battleInfo.statusEffects.filter(item => !item.isPositive);

    var uniqueCount = Array.from(new Set(debuffs.map(x => x.type))).length;

    return uniqueCount;
  }

  handleAfterTimeEquipment(party: Character[], enemies: Character[], deltaTime: number) {

  }
}
