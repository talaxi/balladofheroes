import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-ballad-navigation',
  templateUrl: './ballad-navigation.component.html',
  styleUrls: ['./ballad-navigation.component.css', '../../zone-navigation.component.css']
})

export class BalladNavigationComponent implements OnInit {
  @Input() ballad: Ballad;
  availableZones: Zone[] = [];
  isMobile: boolean = false;

  constructor(private globalService: GlobalService, private balladService: BalladService,
    private deviceDetectorService: DeviceDetectorService, private achievementService: AchievementService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();

    if (this.ballad != undefined) {
      this.availableZones = this.ballad.zones.filter(item => item.isAvailable);
    }
  }

  /** Called when a ballad text button is clicked */
  onBalladSelect(): void {
    if (!this.ballad.isSelected) {
      this.balladService.selectBallad(this.ballad);
    }
  }

  /** Gets classes used for the ballad */
  getBalladClass(): { [klass: string]: boolean } {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;

    this.ballad.zones.forEach(zone => {
      zone.subzones.filter(item => !this.balladService.isSubzoneTown(item.type)
        && !this.balladService.isSubzoneSideQuest(item.type)).forEach(subzone => {
          if (subzone.victoryCount < this.balladService.getVictoriesNeededToProceed(subzone.type))
            allSubZonesCleared = false;

          if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0
            || this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length === 0
          )
            allSubZonesCompleted = false;
        });
    });

    return {
      'selected': this.ballad.isSelected,
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,
      'completedSubzoneColor': allSubZonesCompleted
    };
  }

  /** Gets the ballad name */
  getBalladName(): string {
    return this.balladService.getBalladName(this.ballad.type);
  }
}
