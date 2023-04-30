import { Component, Input, OnInit } from '@angular/core';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-zone-area-navigation',
  templateUrl: './zone-area-navigation.component.html',
  styleUrls: ['./zone-area-navigation.component.css', '../../zone-navigation.component.css']
})
export class ZoneAreaNavigationComponent implements OnInit {
  @Input() zone: Zone;
  availableSubZones: SubZone[] = [];

  constructor(private globalService: GlobalService, private balladService: BalladService, private achievementService: AchievementService) { }

  ngOnInit(): void {
    this.availableSubZones = this.zone?.subzones ?? [];
  }

  /** Called when zone text button is selected */
  onZoneSelect(): void {
    if (!this.zone.isSelected) {
      this.balladService.selectZone(this.zone);
    }
  }

  /** Gets the classes to use for the zone */
  getZoneClass(): { [kclass: string]: boolean } {
    var allSubZonesCleared = true;
    var allSubZonesCompleted = true;

    this.zone.subzones.filter(item => !this.balladService.isSubzoneTown(item.type)
      && !this.balladService.isSubzoneSideQuest(item.type)).forEach(subzone => {
        if (subzone.victoryCount < this.balladService.getVictoriesNeededToProceed(subzone.type))
          allSubZonesCleared = false;
        if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) > 0
          || this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length === 0
        )
          allSubZonesCompleted = false;
      });

    return {
      'selected': this.zone.isSelected,
      'unclearedSubzoneColor': !allSubZonesCleared && !allSubZonesCompleted,
      'clearedSubzoneColor': allSubZonesCleared && !allSubZonesCompleted,
      'completedSubzoneColor': allSubZonesCompleted
    };
  }
}
