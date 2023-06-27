import { Component } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { Zone } from 'src/app/models/zone/zone.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-main-overview',
  templateUrl: './main-overview.component.html',
  styleUrls: ['./main-overview.component.css']
})
export class MainOverviewComponent {
  itemsEnum = ItemsEnum;
  townsAvailable = false;
  
  constructor(public globalService: GlobalService, public lookupService: LookupService, private balladService: BalladService,
    private dpsCalculatorService: DpsCalculatorService, private gameLogService: GameLogService, public dialog: MatDialog,
    private deviceDetectorService: DeviceDetectorService, private layoutService: LayoutService, private menuService: MenuService) {

  }
  
  ngOnInit(): void {    
    if (this.balladService.findSubzone(SubZoneEnum.DodonaDelphi)?.isAvailable)
      this.townsAvailable = true;
  }

  meleteFunctionalityAvailable() {
    return this.lookupService.isMeleteAvailable();
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
  }

  /*jumpToLatestGeneralStore() {
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
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + latestShop.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.globalService.globalVar.settings.set("autoProgress", false);
  }*/

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
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();

    /*if (this.globalService.globalVar.gameLogSettings.get("moveLocations")) {
    var gameLogEntry = "You move to <strong>" + "Asphodel" + " - " + this.balladService.getSubZoneName(startingPoint.type) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);
    }*/

    this.globalService.globalVar.settings.set("autoProgress", false);
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
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();

    /*var gameLogEntry = "You move to <strong>" + "Elysium" + " - " + this.balladService.getSubZoneName(startingPoint.type) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);
*/
    this.layoutService.jumpedToColiseum = true;
    this.globalService.globalVar.settings.set("autoProgress", false);
    }
  }

  viewFollowers(content: any) {
    if (this.deviceDetectorService.isMobile())
    this.dialog.open(content, { width: '95%', height: '80%', id: 'dialogNoPadding' });
  else 
    this.dialog.open(content, { width: '90%', minHeight: '75vh', maxHeight: '75vh', id: 'dialogNoPadding' });
  }
  
  viewLoadouts(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '75%', minHeight: '85vh', maxHeight: '85vh' });
  }
  
  areLoadoutsAvailable() {
    return this.globalService.globalVar.characters.filter(item => item.isAvailable).length > 2 || this.globalService.globalVar.gods.filter(item => item.isAvailable).length > 4;
  }

}
