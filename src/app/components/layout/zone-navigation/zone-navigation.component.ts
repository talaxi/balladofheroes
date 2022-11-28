import { Component, Input, OnInit } from '@angular/core';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
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

  constructor(private globalService: GlobalService, public balladService: BalladService, private subzoneGeneratorService: SubZoneGeneratorService,
    private utilityService: UtilityService, private gameLoopService: GameLoopService, private gameLogService: GameLogService,
    private achievementService: AchievementService) { }

  ngOnInit(): void {
    var autoProgress = this.globalService.globalVar.settings.get("autoProgress");
    if (autoProgress === undefined)
      this.autoProgress = false;
    else
      this.autoProgress = autoProgress;

    this.availableBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);
    var selectedBallad = this.balladService.getActiveBallad();
    if (selectedBallad !== undefined)
      this.availableZones = selectedBallad.zones.filter(item => item.isAvailable);;
    var selectedZone = this.balladService.getActiveZone();
    if (selectedZone !== undefined)
      this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.availableBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);
      var selectedBallad = this.balladService.getActiveBallad();
      if (selectedBallad !== undefined)
        this.availableZones = selectedBallad.zones.filter(item => item.isAvailable);
      var selectedZone = this.balladService.getActiveZone();
      if (selectedZone !== undefined)
        this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);

      var currentSubzone = this.availableSubZones.find(item => item.isSelected);
      if (this.autoProgress && currentSubzone !== undefined && currentSubzone.victoriesNeededToProceed - currentSubzone.victoryCount <= 0)
      {
        this.selectNextSubzone();        
      }
    });
  }

  selectNextSubzone() {
    var currentBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);

    if (currentBallad !== undefined) {
      var currentZone = currentBallad.zones.find(item => item.isSelected);

      if (currentZone !== undefined)
      {
        var incompleteSubzone = currentZone.subzones.find(item => item.victoriesNeededToProceed - item.victoryCount > 0);
        
        if (incompleteSubzone !== undefined)
          this.selectSubZone(incompleteSubzone, currentZone);
      }
    }
  }

  selectBallad(ballad: Ballad) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
    });

    ballad.isSelected = true;
    ballad.showNewNotification = false;
    this.availableZones = ballad.zones;
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
    this.availableSubZones = zone.subzones;
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

    var gameLogEntry = "You move to <strong>" + zone.zoneName + " - " + subzone.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);


    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
    if (enemyOptions.length > 0) {
      var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
      this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
    }
  }

  getBalladClass(ballad: Ballad) {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;

    ballad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        if (subzone.victoryCount < subzone.victoriesNeededToProceed)
          allSubZonesCleared = false;
        if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0)
          allSubZonesCompleted = false;
      });
    });

    return {
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,      
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,  
      'completedSubzoneColor': allSubZonesCompleted      
    };
  }

  getZoneClass(zone: Zone) {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;
    zone.subzones.forEach(subzone => {
      if (subzone.victoryCount < subzone.victoriesNeededToProceed)
        allSubZonesCleared = false;
      if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0)
        allSubZonesCompleted = false;
    });

    return {
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,      
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,  
      'completedSubzoneColor': allSubZonesCompleted      
    };
  }

  getSubzoneClass(subzone: SubZone) {
    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) === 0;
    return {
      'unclearedSubzoneColor': subzone.victoriesNeededToProceed > subzone.victoryCount,      
      'clearedSubzoneColor': subzone.victoriesNeededToProceed <= subzone.victoryCount && !achievementsCompleted,  
      'completedSubzoneColor': achievementsCompleted      
    };
  }

  autoProgressToggle() {
    this.globalService.globalVar.settings.set("autoProgress", this.autoProgress);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
