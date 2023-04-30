import { Component, Input, OnInit } from '@angular/core';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-sub-zone-navigation',
  templateUrl: './sub-zone-navigation.component.html',
  styleUrls: ['./sub-zone-navigation.component.css', '../../zone-navigation.component.css']
})
export class SubZoneNavigationComponent implements OnInit {
  @Input() subzone: SubZone
  @Input() zone: Zone;

  constructor(private globalService: GlobalService, private balladService: BalladService,
    private achievementService: AchievementService, private lookupService: LookupService) { }

  ngOnInit(): void { }

  /** Occurs when subzone text button is clicked */
  onSubzoneSelect(): void {
    if (!this.subzone.isSelected) {
      this.balladService.selectSubZone(this.subzone, this.zone);
    }
  }

  /** Gets the classes used for the subzone */
  getSubzoneClass(): { [klass: string]: boolean } {
    var hasAllAchievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(this.subzone.type, this.globalService.globalVar.achievements) === 0 &&
      this.achievementService.getAchievementsBySubZone(this.subzone.type, this.globalService.globalVar.achievements).length > 0;

    if (this.subzone.type === SubZoneEnum.CalydonAltarOfAsclepius) {
      return {
        'completedSubzoneColor': this.globalService.globalVar.sidequestData.altarOfAsclepius.exp >= 4,
        'unclearedSubzoneColor': this.globalService.globalVar.sidequestData.altarOfAsclepius.exp < 4,
        'selected': this.subzone.isSelected
      }
    }

    return {
      'selected': this.subzone.isSelected,
      'unclearedSubzoneColor': this.balladService.getVictoriesNeededToProceed(this.subzone.type) > this.subzone.victoryCount,
      'clearedSubzoneColor': this.balladService.getVictoriesNeededToProceed(this.subzone.type) <= this.subzone.victoryCount && !hasAllAchievementsCompleted,
      'completedSubzoneColor': hasAllAchievementsCompleted
    };
  }

  /** Gets the subtext for a subzone */
  getSubZoneSubText(): string {
    let text = "";

    if (this.balladService.isSubZoneToBeContinued(this.subzone))
      return text;

    if (this.balladService.isSubzoneTown(this.subzone.type))
      text = "(Town)";
    else if (this.balladService.isSubzoneSideQuest(this.subzone.type)) {
      text = "(Special)";
    }
    else {
      text = "(" + this.subzone.victoryCount.toString();

      if (this.balladService.getVictoriesNeededToProceed(this.subzone.type) > this.subzone.victoryCount)
        text += "/" + this.balladService.getVictoriesNeededToProceed(this.subzone.type);

      text += (this.subzone.victoryCount === 1 && this.balladService.getVictoriesNeededToProceed(this.subzone.type) <= this.subzone.victoryCount)
        ? " win)" : " wins)";
    }

    return text;
  }

  /** Gets the name of the subzone */
  getSubzoneName(): string {
    return this.balladService.getSubZoneName(this.subzone.type);
  }

  /** Gets the quest type */
  getSubzoneNotificationType() {
    return this.balladService.shouldSubzoneShowSideQuestNotification(this.subzone.type);
  }

  /** Gets the ending icon text for a notification */
  getSubzoneNotificationStyle(): string {
    if (this.lookupService.subzoneHasObscurredPath(this.subzone.type))
      return "?";
    return "!";
  }

  /** Checks if the subzone is unfinished */
  isSubzoneToBeContinued(): boolean {
    return this.balladService.isSubZoneToBeContinued(this.subzone);
  }
}
