import { Component } from '@angular/core';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { FollowersService } from 'src/app/services/followers/followers.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-follower-search-view',
  templateUrl: './follower-search-view.component.html',
  styleUrls: ['./follower-search-view.component.css']
})
export class FollowerSearchViewComponent {
  clearedZones: Zone[];

  constructor(private globalService: GlobalService, private followerService: FollowersService, private lookupService: LookupService,
    private utilityService: UtilityService, private balladService: BalladService, private achievementService: AchievementService) { }

  ngOnInit(): void {
  }

  getAssignedFollowers() {
    return this.followerService.getAssignedFollowers();
  }

  getUnassignedFollowers() {
    return this.followerService.getUnassignedFollowers();
  }

  getTotalFollowers() {
    return this.followerService.getTotalFollowers();
  }

  getClearedZones() {
    return this.followerService.getClearedZones();
  }

  incrementZoneFollowers(type: ZoneEnum) {
    return this.followerService.incrementZoneFollowers(type);
  }

  decrementZoneFollowers(type: ZoneEnum) {
    return this.followerService.decrementZoneFollowers(type);
  }

  canDecrement(type: ZoneEnum) {
    return this.followerService.canDecrement(type);
  }

  canIncrement(type: ZoneEnum) {
    return this.followerService.canIncrementZoneSearch(type);
  }

  getRewardLevel(type: ZoneEnum) {
    return this.followerService.getZoneAchievementRewardLevel(type);
  }

  getZoneAchievementPercent(type: ZoneEnum) {
    return this.achievementService.getCompletedAchievementPercentByZone(this.balladService.findZone(type), this.globalService.globalVar.achievements);
  }

  getFollowersAssignedToZone(type: ZoneEnum) {
    return this.followerService.getFollowersAssignedToZone(type);
  }

  getMaxFollowersAssignedToZone(type: ZoneEnum) {
    return this.followerService.getMaxFollowersAssignedToZone(type);
  }

  getZoneSearchRewards(type: ZoneEnum) {
    var rewardDescription = "Average per hour: ";

    var rewards = this.followerService.getZoneSearchRewards(type);    
    for (var i = 0; i < rewards.length; i++) {
      var reward = rewards[i];

      rewardDescription += reward.amount + " " + (reward.amount > 1 ? this.utilityService.handlePlural(this.lookupService.getItemName(reward.item)) : this.lookupService.getItemName(reward.item));

      if (i < rewards.length - 1)
        rewardDescription += ", ";
    }

    return rewardDescription;
  }

  unassignAll() {
    this.globalService.globalVar.followerData.followers.forEach(follower => {
      follower.assignedTo = FollowerActionEnum.None;
      follower.assignedZone = ZoneEnum.None;
      follower.assignedAltarType = AltarEnum.None;
      follower.assignedPrayerType = FollowerPrayerTypeEnum.None;
    });
  }
}
