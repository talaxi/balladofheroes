import { Component } from '@angular/core';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { FollowersService } from 'src/app/services/followers/followers.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-follower-prayer-view',
  templateUrl: './follower-prayer-view.component.html',
  styleUrls: ['./follower-prayer-view.component.css']
})
export class FollowerPrayerViewComponent {
  followerPrayerType = FollowerPrayerTypeEnum;
  altarType = AltarEnum;

  constructor(private globalService: GlobalService, private followerService: FollowersService) { }

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
}
