import { Component } from '@angular/core';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { FollowersService } from 'src/app/services/followers/followers.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-follower-prayer-view',
  templateUrl: './follower-prayer-view.component.html',
  styleUrls: ['./follower-prayer-view.component.css']
})
export class FollowerPrayerViewComponent {
  followerPrayerType = FollowerPrayerTypeEnum;
  altarType = AltarEnum;

  constructor(private globalService: GlobalService, private followerService: FollowersService, private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  getUnassignedFollowers() {
    return this.followerService.getUnassignedFollowers();
  }

  getTotalFollowers() {
    return this.followerService.getTotalFollowers();
  }

  incrementPrayerFollowers(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.followerService.incrementPrayerFollowers(followerPrayerType, altarType);
  }

  decrementPrayerFollowers(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.followerService.decrementPrayerFollowers(followerPrayerType, altarType);
  }

  canDecrement(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.followerService.canDecrementPrayerFollowers(followerPrayerType, altarType);
  }

  canIncrement(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.followerService.canIncrement();
  }

  getFollowersAssignedToPrayer(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.followerService.getFollowersAssignedToPrayer(followerPrayerType, altarType);
  }

  getSmallAltarActivationChance() {
    return this.utilityService.smallAltarActivationChancePerFollower * 100;
  }

  getSmallAltarPrayerChance() {
    return this.utilityService.smallAltarPrayChancePerFollower * 100;
  }

  getAssignedFollowers() {
    return this.followerService.getAssignedFollowers();
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
