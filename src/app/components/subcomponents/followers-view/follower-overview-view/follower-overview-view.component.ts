import { Component } from '@angular/core';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { FollowersService } from 'src/app/services/followers/followers.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-follower-overview-view',
  templateUrl: './follower-overview-view.component.html',
  styleUrls: ['./follower-overview-view.component.css']
})
export class FollowerOverviewViewComponent {
  constructor(private globalService: GlobalService, private followerService: FollowersService, private balladService: BalladService,
    private utilityService: UtilityService, private lookupService: LookupService) { }

  ngOnInit(): void {
  }

  getAssignedFollowers() {
    return this.followerService.getAssignedFollowers();
  }

  getTotalFollowers() {
    return this.followerService.getTotalFollowers();
  }

  getSearchingOverviewText() {
    var zoneCounts: [ZoneEnum, number][] = [];
    this.globalService.globalVar.followerData.followers.forEach(follower => {
      if (follower.assignedTo !== FollowerActionEnum.None && follower.assignedZone !== ZoneEnum.None) {
        var match = zoneCounts.find(item => item[0] === follower.assignedZone);
        if (match !== undefined) {          
          match[1] += 1;
        }
        else {
          zoneCounts.push([follower.assignedZone, 1]);
        }
      }
    });

    var text = "";
    zoneCounts.forEach(zone => {
      var zoneModel = this.balladService.findZone(zone[0]);
      text += zone[1] + (zone[1] === 1 ? " follower is " : " followers are ") + " searching " +
      (zoneModel === undefined ? "" : zoneModel.zoneName) + " for " + this.getZoneSearchRewardText(zone[0], zone[1]) + ".<br/>";
    });

    return text;
  }

  getZoneSearchRewardText(type: ZoneEnum, count: number) {
    var rewardDescription = "";

    var rewards = this.followerService.getZoneSearchRewards(type);    
    for (var i = 0; i < rewards.length; i++) {
      var reward = rewards[i];

      rewardDescription += (count * reward.amount) + " " + ((count * reward.amount) > 1 ? this.utilityService.handlePlural(this.lookupService.getItemName(reward.item)) : this.lookupService.getItemName(reward.item));

      if (i === rewards.length - 2)
        rewardDescription += " and ";
      else if (i < rewards.length - 1)
        rewardDescription += ", ";
    }

    return rewardDescription;
  }

  unassignAll() {
    this.globalService.globalVar.followerData.followers.forEach(follower => {
      follower.assignedTo = FollowerActionEnum.None;
      follower.assignedZone = ZoneEnum.None;
    });
  }
}
