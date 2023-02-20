import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-zone-navigation',
  templateUrl: './zone-navigation.component.html',
  styleUrls: ['./zone-navigation.component.css']
})
export class ZoneNavigationComponent implements OnInit {
  availableBallads: Ballad[];
  availableZones: Zone[];
  availableSubZones: SubZone[];
  subscription: any;
  autoProgress: boolean = false;
  itemsEnum = ItemsEnum;
  townsAvailable = false;
  quickView: QuickViewEnum = QuickViewEnum.Overview;
  quickViewEnum = QuickViewEnum;
  trackedResourcesColumn1: ItemsEnum[] = [];
  trackedResourcesColumn2: ItemsEnum[] = [];
  tooltipDirection = DirectionEnum.Up;
  quickLinksUnlocked = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.setupKeybinds(event);
  }

  constructor(public globalService: GlobalService, public balladService: BalladService, private subzoneGeneratorService: SubZoneGeneratorService,
    private utilityService: UtilityService, private gameLoopService: GameLoopService, private gameLogService: GameLogService,
    private achievementService: AchievementService, public lookupService: LookupService, private layoutService: LayoutService,
    private menuService: MenuService, private dpsCalculatorService: DpsCalculatorService, public dialog: MatDialog,
    private alchemyService: AlchemyService, private keybindService: KeybindService) { }

  ngOnInit(): void {
    var autoProgress = this.globalService.globalVar.settings.get("autoProgress");
    if (autoProgress === undefined)
      this.autoProgress = false;
    else
      this.autoProgress = autoProgress;

    var activeOverview = this.globalService.globalVar.settings.get("activeOverview");
    if (activeOverview !== undefined)
      this.quickView = activeOverview;

    this.availableBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);
    var selectedBallad = this.balladService.getActiveBallad();
    if (selectedBallad !== undefined)
      this.availableZones = selectedBallad.zones.filter(item => item.isAvailable);
    var selectedZone = this.balladService.getActiveZone();
    if (selectedZone !== undefined)
      this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);

    if (this.balladService.findSubzone(SubZoneEnum.DodonaDelphi)?.isAvailable)
      this.townsAvailable = true;

    if (this.balladService.findSubzone(SubZoneEnum.AigosthenaLowerCoast)?.isAvailable)
      this.quickLinksUnlocked = true;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.autoProgress = this.globalService.globalVar.settings.get("autoProgress");
      if (!this.townsAvailable && this.balladService.findSubzone(SubZoneEnum.DodonaDelphi)?.isAvailable)
        this.townsAvailable = true;

      if (this.balladService.findSubzone(SubZoneEnum.AigosthenaLowerCoast)?.isAvailable)
        this.quickLinksUnlocked = true;

      this.availableBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);
      var selectedBallad = this.balladService.getActiveBallad();
      if (selectedBallad !== undefined)
        this.availableZones = selectedBallad.zones.filter(item => item.isAvailable);
      var selectedZone = this.balladService.getActiveZone();
      if (selectedZone !== undefined)
        this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);

      var currentSubzone = this.availableSubZones.find(item => item.isSelected);
      if (this.autoProgress && currentSubzone !== undefined &&
        (currentSubzone.victoriesNeededToProceed - currentSubzone.victoryCount <= 0 || currentSubzone.isTown)) {
        this.selectNextSubzone();
      }

      this.trackedResourcesColumn1 = this.globalService.globalVar.trackedResources.slice(0, 5);
      if (this.globalService.globalVar.trackedResources.length > 5)
        this.trackedResourcesColumn2 = this.globalService.globalVar.trackedResources.slice(5, 10);
    });
  }

  selectNextSubzone() {
    var nextSubzoneFound = false;
    var reverseOrderBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable).slice().reverse();
    reverseOrderBallads.forEach(ballad => {
      if (!nextSubzoneFound) {
        var reverseZones = ballad.zones.filter(item => item.isAvailable).slice().reverse();
        reverseZones.forEach(zone => {
          var reverseSubzones = zone.subzones.filter(item => item.isAvailable).slice().reverse();
          reverseSubzones.forEach(subzone => {
            if (!nextSubzoneFound && !subzone.isTown && subzone.victoriesNeededToProceed - subzone.victoryCount > 0) {
              nextSubzoneFound = true;
              this.selectBallad(ballad)
              this.selectZone(zone);
              this.selectSubZone(subzone, zone);
            }
          });
        })
      }
    });

    /*var currentBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);

    if (currentBallad !== undefined) {
      var currentZone = currentBallad.zones.find(item => item.isSelected);

      if (currentZone !== undefined)
      {
        var incompleteSubzone = currentZone.subzones.find(item => !item.isTown && item.victoriesNeededToProceed - item.victoryCount > 0);
        
        if (incompleteSubzone !== undefined)
          this.selectSubZone(incompleteSubzone, currentZone);
      }
    }*/
  }

  selectBallad(ballad: Ballad) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
    });

    ballad.isSelected = true;
    ballad.showNewNotification = false;
    this.availableZones = ballad.zones.filter(item => item.isAvailable);
  }

  selectZone(zone: Zone) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          zone.isSelected = false;
        });
    });

    zone.isSelected = true;
    zone.showNewNotification = false;
    this.availableSubZones = zone.subzones.filter(item => item.isAvailable);
  }

  selectSubZone(subzone: SubZone, zone: Zone) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.forEach(subzone => {
              subzone.isSelected = false;
            });
        });
    });

    subzone.isSelected = true;
    subzone.showNewNotification = false;
    this.globalService.globalVar.playerNavigation.currentSubzone = subzone;
    this.globalService.resetCooldowns(); //todo: maybe?

    var gameLogEntry = "You move to <strong>" + zone.zoneName + " - " + subzone.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);
    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;

    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
    if (enemyOptions.length > 0) {
      var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
      this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
    }
  }

  jumpToLatestShop() {
    var latestShop: SubZone = this.balladService.getActiveSubZone();
    var relatedZone: Zone | undefined = this.balladService.getActiveZone();
    var relatedBallad: Ballad | undefined = this.balladService.getActiveBallad();

    this.globalService.globalVar.ballads.filter(item => item.isAvailable).forEach(ballad => {
      ballad.isSelected = false;
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.filter(item => item.isAvailable).forEach(zone => {
          zone.isSelected = false;
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.filter(item => item.isAvailable).forEach(subzone => {
              subzone.isSelected = false;
              if (subzone.isTown) {
                latestShop = subzone;
                relatedZone = zone;
                relatedBallad = ballad;
              }
            });
        });
    });

    latestShop.isSelected = true;
    latestShop.showNewNotification = false;
    if (relatedZone !== undefined)
      relatedZone.isSelected = true;
    if (relatedBallad !== undefined)
      relatedBallad.isSelected = true;
    this.globalService.globalVar.playerNavigation.currentSubzone = latestShop;
    this.globalService.resetCooldowns(); //todo: maybe?

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + latestShop.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.globalService.globalVar.settings.set("autoProgress", false);
  }

  jumpToLatestGeneralStore() {
    var latestShop: SubZone = this.balladService.getActiveSubZone();
    var relatedZone: Zone | undefined = this.balladService.getActiveZone();
    var relatedBallad: Ballad | undefined = this.balladService.getActiveBallad();

    this.globalService.globalVar.ballads.filter(item => item.isAvailable).forEach(ballad => {
      ballad.isSelected = false;
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.filter(item => item.isAvailable).forEach(zone => {
          zone.isSelected = false;
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.filter(item => item.isAvailable).forEach(subzone => {
              subzone.isSelected = false;
              if (subzone.isGeneralStore()) {
                latestShop = subzone;
                relatedZone = zone;
                relatedBallad = ballad;
              }
            });
        });
    });

    latestShop.isSelected = true;
    latestShop.showNewNotification = false;
    if (relatedZone !== undefined)
      relatedZone.isSelected = true;
    if (relatedBallad !== undefined)
      relatedBallad.isSelected = true;
    this.globalService.globalVar.playerNavigation.currentSubzone = latestShop;
    this.globalService.resetCooldowns(); //todo: maybe?

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + latestShop.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.globalService.globalVar.settings.set("autoProgress", false);
  }

  jumpToPalaceOfHades() {
    var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
    }

    this.globalService.globalVar.settings.set("autoProgress", false);
  }

  getBalladClass(ballad: Ballad) {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;

    ballad.zones.forEach(zone => {
      zone.subzones.filter(item => !item.isTown).forEach(subzone => {
        if (subzone.victoryCount < subzone.victoriesNeededToProceed)
          allSubZonesCleared = false;
        if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0 ||
          this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length === 0)
          allSubZonesCompleted = false;
      });
    });

    return {
      'selected': ballad.isSelected,
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,
      'completedSubzoneColor': allSubZonesCompleted
    };
  }

  getZoneClass(zone: Zone) {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;
    zone.subzones.filter(item => !item.isTown).forEach(subzone => {
      if (subzone.victoryCount < subzone.victoriesNeededToProceed)
        allSubZonesCleared = false;
      if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0 ||
        this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length === 0)
        allSubZonesCompleted = false;
    });

    return {
      'selected': zone.isSelected,
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,
      'completedSubzoneColor': allSubZonesCompleted
    };
  }

  getSubzoneClass(subzone: SubZone) {
    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) === 0 &&
      this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length > 0;

    return {
      'selected': subzone.isSelected,
      'unclearedSubzoneColor': subzone.victoriesNeededToProceed > subzone.victoryCount,
      'clearedSubzoneColor': subzone.victoriesNeededToProceed <= subzone.victoryCount && !achievementsCompleted,
      'completedSubzoneColor': achievementsCompleted
    };
  }

  autoProgressToggle() {
    this.globalService.globalVar.settings.set("autoProgress", this.autoProgress);
  }

  getSubZoneSubText(subzone: SubZone) {
    var text = "";

    if (subzone.isTown)
      text = "(Town)";
    else {
      text = "(" + subzone.victoryCount.toString();
      if (subzone.victoriesNeededToProceed > subzone.victoryCount)
        text += "/" + subzone.victoriesNeededToProceed;
      text += " wins)";
    }

    return text;
  }

  goToResourceView() {
    this.layoutService.changeLayout(NavigationEnum.Menu);
    this.menuService.selectedMenuDisplay = MenuEnum.Resources;
  }

  setQuickView(type: QuickViewEnum) {
    this.quickView = type;

    if (type === QuickViewEnum.Altars)
      this.globalService.globalVar.altars.showNewNotification = false;
  }

  getQuickViewTitleName() {
    var name = "";
    if (this.quickView === QuickViewEnum.Alchemy)
      name = "Alchemy ";
    else if (this.quickView === QuickViewEnum.Jump)
      name = "Travel ";
    else if (this.quickView === QuickViewEnum.Resources)
      name = "Resources ";
    if (this.quickView === QuickViewEnum.Overview)
      name = "Overview ";

    return name;
  }

  openAlchemy(content: any) {
    this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });
  }

  getCreatingRecipeName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe !== undefined)
      return this.lookupService.getItemName(this.globalService.globalVar.alchemy.creatingRecipe.createdItem);

    return "";
  }

  creatingRecipe() {
    return this.globalService.globalVar.alchemy.creatingRecipe !== undefined;
  }

  getStepProgress() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return 0;
    var totalLength = 0;
    var passedTime = 0;

    for (var i = 0; i < this.globalService.globalVar.alchemy.creatingRecipe.steps.length; i++) {
      var actionLength = this.alchemyService.getActionLength(this.globalService.globalVar.alchemy.creatingRecipe.steps[i]);
      totalLength += actionLength;

      if (this.globalService.globalVar.alchemy.alchemyStep > i + 1) {
        passedTime += actionLength;
      }
    }

    passedTime += this.globalService.globalVar.alchemy.alchemyTimer;
    return (passedTime / totalLength) * 100;
    //return (this.globalService.globalVar.alchemy.alchemyTimer / this.globalService.globalVar.alchemy.alchemyTimerLength) * 100;
  }

  getRecipeStepName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";
    return this.lookupService.getAlchemyActionName(this.globalService.globalVar.alchemy.creatingRecipe.steps[this.globalService.globalVar.alchemy.alchemyStep - 1]);
  }

  getTimeRemaining() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.globalService.globalVar.alchemy.alchemyTimerLength - this.globalService.globalVar.alchemy.alchemyTimer;

    for (var i = this.globalService.globalVar.alchemy.alchemyStep + 1; i <= this.globalService.globalVar.alchemy.creatingRecipe.numberOfSteps; i++) {
      var step = this.globalService.globalVar.alchemy.creatingRecipe.steps[i - 1];
      timeRemaining += this.alchemyService.getActionLength(step);
    }

    if (timeRemaining > 60 * 60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  getTotalAmountToCreate() {
    return this.globalService.globalVar.alchemy.alchemyCreateAmount;
  }

  getAmountCreated() {
    return this.globalService.globalVar.alchemy.alchemyCurrentAmountCreated;
  }

  isAlchemyAvailable() {
    return this.globalService.globalVar.alchemy.isUnlocked;
  }

  areAltarsAvailable() {
    return this.globalService.globalVar.altars.isUnlocked;
  }

  isPalaceOfHadesAvailable() {
    var underworld = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld);
    if (underworld !== undefined && underworld.isAvailable) {
      return true;
    }
    return false;
  }

  setupKeybinds(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openOverviewQuickView"))) {
      this.setQuickView(QuickViewEnum.Overview);
    }
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openResourcesQuickView"))) {
      this.setQuickView(QuickViewEnum.Resources);
    }
    if (this.globalService.globalVar.alchemy.isUnlocked && this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openAlchemyQuickView"))) {
      this.setQuickView(QuickViewEnum.Alchemy);
    }
    if (this.globalService.globalVar.altars.isUnlocked && this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openAltarsQuickView"))) {
      this.setQuickView(QuickViewEnum.Altars);
      this.globalService.globalVar.altars.showNewNotification = false;
    }

    this.globalService.globalVar.settings.set("activeOverview", this.quickView);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
