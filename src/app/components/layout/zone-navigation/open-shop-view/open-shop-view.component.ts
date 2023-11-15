import { Component, ElementRef, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { TrialService } from 'src/app/services/battle/trial.service';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Zone } from 'src/app/models/zone/zone.model';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';

@Component({
  selector: 'app-open-shop-view',
  templateUrl: './open-shop-view.component.html',
  styleUrls: ['./open-shop-view.component.css']
})
export class OpenShopViewComponent {
  @ViewChild('shopView') shopView: ElementRef;
  shopTypeEnum = ShopTypeEnum;
  isMobile = false;

  constructor(private balladService: BalladService, private globalService: GlobalService, private utilityService: UtilityService,
    private enemyGeneratorService: EnemyGeneratorService, private trialService: TrialService, private dpsCalculatorService: DpsCalculatorService,
    private menuService: MenuService, private gameLogService: GameLogService, private deviceDetectorService: DeviceDetectorService,
    private dialog: MatDialog, private layoutService: LayoutService) {

  }
  
  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  openShop(type: ShopTypeEnum) {
    /*if (this.deviceDetectorService.isMobile())
      this.dialog.open(shopView, { width: '95%', height: '80%' });
    else
      this.dialog.open(shopView, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });*/
  }

  isColiseumAvailable() {
    var coliseum = this.balladService.findSubzone(SubZoneEnum.ElysiumColiseum);
    if (coliseum !== undefined && coliseum.isAvailable) {
      return true;
    }
    return false;
  }

  isOlympusAvailable() {
    var coliseum = this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus);
    if (coliseum !== undefined && coliseum.isAvailable) {
      return true;
    }
    return false;
  }

  getGodTrialName() {
    var boss = this.enemyGeneratorService.generateEnemy(this.trialService.getTrialOfSkillBattle());

    return boss.name;
  }

  getGodColorClass(name: string) {
    return {
      'athenaColor': name === "Athena",
      'zeusColor': name === "Zeus",
      'apolloColor': name === "Apollo",
      'aresColor': name === "Ares",
      'poseidonColor': name === "Poseidon",
      'artemisColor': name === "Artemis",
      'hermesColor': name === "Hermes",
      'hadesColor': name === "Hades",
      'dionysusColor': name === "Dionysus",
      'aphroditeColor': name === "Aphrodite",      
      'heraColor': name === "Hera"
    };
  }

  getEternalMeleeTickets() {
    return this.getWeeklyEntries() + " / " + this.getWeeklyEntryCap();
  }

  getWeeklyEntries() {
    return this.globalService.globalVar.sidequestData.weeklyMeleeEntries;
  }

  getWeeklyEntryCap() {
    var ticketMultiplier = 1;
      if (this.globalService.globalVar.isSubscriber)
        ticketMultiplier = 2;

    return this.utilityService.weeklyMeleeEntryCap * ticketMultiplier;
  }

  
  isPalaceOfHadesAvailable() {
    var underworld = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld);
    if (underworld !== undefined && underworld.isAvailable) {
      return true;
    }
    return false;
  }

  jumpToLatestShop() {
    var latestShop: SubZone = this.balladService.getActiveSubZone();
    var relatedZone: Zone | undefined = this.balladService.getActiveZone();
    var relatedBallad: Ballad | undefined = this.balladService.getActiveBallad();

    this.globalService.globalVar.ballads.filter(item => item.isAvailable).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }).forEach(ballad => {
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
    this.dpsCalculatorService.xpGain = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();
    this.globalService.ResetTrialInfoAfterChangingSubzone();

    this.globalService.globalVar.partyMember2Hidden = false;
    this.menuService.updateParty = true;
    this.globalService.globalVar.partyMember1Hidden = false;
    this.menuService.updateParty = true;

    if (this.globalService.globalVar.gameLogSettings.get("moveLocations")) {
      var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + this.balladService.getSubZoneName(latestShop.type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);
    }

    this.globalService.globalVar.settings.set("autoProgress", false);

    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }

  isSubZoneChangingDisabled() {
    return this.globalService.getActivePartyCharacters(true).some(item => item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.PreventEscape));
  }

  jumpToPalaceOfHades() {
    var startingPoint = this.balladService.findSubzone(SubZoneEnum.AsphodelPalaceOfHades);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;

      this.dpsCalculatorService.rollingAverageTimer = 0;
      this.dpsCalculatorService.partyDamagingActions = [];
      this.dpsCalculatorService.enemyDamagingActions = [];
      this.dpsCalculatorService.xpGain = [];
      this.globalService.globalVar.activeBattle.battleDuration = 0;
      this.globalService.ResetTournamentInfoAfterChangingSubzone();
      this.globalService.ResetTrialInfoAfterChangingSubzone();

      //var gameLogEntry = "You move to <strong>" + "Asphodel" + " - " + this.balladService.getSubZoneName(startingPoint.type) + "</strong>.";
      //this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

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
      this.dpsCalculatorService.xpGain = [];
      this.globalService.globalVar.activeBattle.battleDuration = 0;
      this.globalService.ResetTournamentInfoAfterChangingSubzone();
      this.globalService.ResetTrialInfoAfterChangingSubzone();
      
      this.globalService.globalVar.settings.set("autoProgress", false);
    }
    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }

  jumpToOlympus() {
    var startingPoint = this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;

      this.dpsCalculatorService.rollingAverageTimer = 0;
      this.dpsCalculatorService.partyDamagingActions = [];
      this.dpsCalculatorService.enemyDamagingActions = [];
      this.dpsCalculatorService.xpGain = [];
      this.globalService.globalVar.activeBattle.battleDuration = 0;
      this.globalService.ResetTournamentInfoAfterChangingSubzone();
      this.globalService.ResetTrialInfoAfterChangingSubzone();

      this.layoutService.jumpedToColiseum = true;
      this.globalService.globalVar.settings.set("autoProgress", false);
    }
    if (this.isMobile) {
      this.dialog.closeAll();
    }
  }
}
