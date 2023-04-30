import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { FollowerData } from 'src/app/models/followers/follower-data.model';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { ColiseumService } from 'src/app/services/battle/coliseum.service';
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
  isMobile = false;

  displayQuickViewOverview: boolean;
  displayQuickViewResources: boolean;
  displayQuickViewGameText: boolean;
  displayQuickViewItemBelt: boolean;
  displayQuickViewAltars: boolean;
  displayQuickViewAlchemy: boolean;
  displayQuickViewJewelcrafting: boolean;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.setupKeybinds(event);
  }

  constructor(public globalService: GlobalService, public balladService: BalladService,
    private utilityService: UtilityService, private gameLoopService: GameLoopService, private gameLogService: GameLogService,
    private achievementService: AchievementService, public lookupService: LookupService, private layoutService: LayoutService,
    private menuService: MenuService, private dpsCalculatorService: DpsCalculatorService, public dialog: MatDialog,
    private keybindService: KeybindService, private deviceDetectorService: DeviceDetectorService, private coliseumService: ColiseumService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();

    this.displayQuickViewOverview = this.globalService.globalVar.settings.get("displayQuickViewOverview") ?? false;
    this.displayQuickViewResources = this.globalService.globalVar.settings.get("displayQuickViewResources") ?? false;
    this.displayQuickViewGameText = this.globalService.globalVar.settings.get("displayQuickViewGameText") ?? false;
    this.displayQuickViewItemBelt = this.globalService.globalVar.settings.get("displayQuickViewItemBelt") ?? false;
    this.displayQuickViewAltars = this.globalService.globalVar.settings.get("displayQuickViewAltars") ?? false;
    this.displayQuickViewAlchemy = this.globalService.globalVar.settings.get("displayQuickViewAlchemy") ?? false;
    this.displayQuickViewJewelcrafting = this.globalService.globalVar.settings.get("displayQuickViewJewelcrafting") ?? false;

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

      var currentSubzone = this.availableSubZones?.find(item => item.isSelected);

      if (this.autoProgress && currentSubzone !== undefined &&
        (this.balladService.getVictoriesNeededToProceed(currentSubzone.type) - currentSubzone.victoryCount <= 0 || this.balladService.isSubzoneTown(currentSubzone.type))) {
        this.balladService.selectNextSubzone();
      }

      this.trackedResourcesColumn1 = this.globalService.globalVar.trackedResources.slice(0, 5);
      if (this.globalService.globalVar.trackedResources.length > 5)
        this.trackedResourcesColumn2 = this.globalService.globalVar.trackedResources.slice(5, 10);
    });
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
              if (this.balladService.isSubzoneTown(subzone.type)) {
                latestShop = subzone;
                relatedZone = zone;
                relatedBallad = ballad;
              }
            });
        });
    });

    latestShop.isSelected = true;
    latestShop.notify = false;
    if (relatedZone !== undefined)
      relatedZone.isSelected = true;
    if (relatedBallad !== undefined)
      relatedBallad.isSelected = true;
    this.globalService.globalVar.playerNavigation.currentSubzone = latestShop;
    this.globalService.resetCooldowns();
    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + this.balladService.getSubZoneName(latestShop.type) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.globalService.globalVar.settings.set("autoProgress", false);

    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }

  jumpToPalaceOfHades() {
    var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;

      this.dpsCalculatorService.rollingAverageTimer = 0;
      this.dpsCalculatorService.partyDamagingActions = [];
      this.dpsCalculatorService.enemyDamagingActions = [];
      this.globalService.globalVar.activeBattle.battleDuration = 0;
      this.globalService.ResetTournamentInfoAfterChangingSubzone();

      var gameLogEntry = "You move to <strong>" + "Asphodel" + " - " + this.balladService.getSubZoneName(startingPoint.type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

      this.globalService.globalVar.settings.set("autoProgress", false);
    }
    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }

  jumpToColiseum() {
    var startingPoint = this.balladService.findSubzone(SubZoneEnum.ElysiumColiseum);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;

      this.dpsCalculatorService.rollingAverageTimer = 0;
      this.dpsCalculatorService.partyDamagingActions = [];
      this.dpsCalculatorService.enemyDamagingActions = [];
      this.globalService.globalVar.activeBattle.battleDuration = 0;
      this.globalService.ResetTournamentInfoAfterChangingSubzone();

      var gameLogEntry = "You move to <strong>" + "Elysium" + " - " + this.balladService.getSubZoneName(startingPoint.type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

      this.globalService.globalVar.settings.set("autoProgress", false);
    }
    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }

  viewFollowers(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh', id: 'dialogNoPadding' });
  }

  autoProgressToggle() {
    this.globalService.globalVar.settings.set("autoProgress", this.autoProgress);
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
    if (this.quickView === QuickViewEnum.Jewelcrafting)
      name = "Jewelcrafting ";
    else if (this.quickView === QuickViewEnum.Jump)
      name = "Travel ";
    else if (this.quickView === QuickViewEnum.Resources)
      name = "Resources ";
    if (this.quickView === QuickViewEnum.Overview)
      name = "Overview ";

    return name;
  }

  isAlchemyAvailable() {
    return this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)?.isUnlocked;
  }

  isJewelcraftingAvailable() {
    return this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)?.isUnlocked;
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

  isColiseumAvailable() {
    var coliseum = this.balladService.findSubzone(SubZoneEnum.ElysiumColiseum);
    if (coliseum !== undefined && coliseum.isAvailable) {
      return true;
    }
    return false;
  }

  areFollowersAvailable() {
    return this.globalService.globalVar.followerData.availableFollowers > 0;
  }

  setupKeybinds(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openOverviewQuickView"))) {
      this.setQuickView(QuickViewEnum.Overview);
    }
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openResourcesQuickView"))) {
      this.setQuickView(QuickViewEnum.Resources);
    }
    if (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)?.isUnlocked && this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openAlchemyQuickView"))) {
      this.setQuickView(QuickViewEnum.Alchemy);
    }
    if (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)?.isUnlocked && this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openJewelcraftingQuickView"))) {
      this.setQuickView(QuickViewEnum.Jewelcrafting);
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
