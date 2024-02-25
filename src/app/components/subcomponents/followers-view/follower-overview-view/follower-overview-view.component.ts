import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { FollowersService } from 'src/app/services/followers/followers.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-follower-overview-view',
  templateUrl: './follower-overview-view.component.html',
  styleUrls: ['./follower-overview-view.component.css']
})
export class FollowerOverviewViewComponent {
  isMobile = false;

  constructor(private globalService: GlobalService, private followerService: FollowersService, private balladService: BalladService,
    private utilityService: UtilityService, private lookupService: LookupService, private deviceDetectorService: DeviceDetectorService,
    private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();    
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

    if (text === "")
      text = "No followers are currently searching.";

    return text;
  }

  getZoneSearchRewardText(type: ZoneEnum, count: number) {
    var rewardDescription = "";

    var rewards = this.followerService.getZoneSearchRewards(type);
    for (var i = 0; i < rewards.length; i++) {
      var reward = rewards[i];

      rewardDescription += (count * reward.amount) + " " + ((count * reward.amount) > 1 ? this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item)) : this.dictionaryService.getItemName(reward.item));

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
      follower.assignedAltarType = AltarEnum.None;
      follower.assignedPrayerType = FollowerPrayerTypeEnum.None;
    });
  }

  getPrayerOverviewText() {
    var overviewText = "";
    var prayerCounts: [FollowerPrayerTypeEnum, AltarEnum, number][] = [];

    this.globalService.globalVar.followerData.followers.forEach(follower => {
      if (follower.assignedTo !== FollowerActionEnum.None && follower.assignedPrayerType !== FollowerPrayerTypeEnum.None) {
        var match = prayerCounts.find(item => item[0] === follower.assignedPrayerType && item[1] === follower.assignedAltarType);
        if (match !== undefined) {
          match[2] += 1;
        }
        else {
          prayerCounts.push([follower.assignedPrayerType, follower.assignedAltarType, 1]);
        }
      }
    });

    prayerCounts.sort();

    prayerCounts.forEach(item => {
      if (item[0] === FollowerPrayerTypeEnum.Activate) {
        if (item[1] === AltarEnum.Small) {
          overviewText += item[2] + (item[2] === 1 ? " follower is " : " followers are ") + " attempting to activate Small Altars that your party " +
            "has fulfilled the conditions for, each providing a " + Math.round(this.utilityService.smallAltarActivationChancePerFollower * 100) + "% chance to activate any Small Altar among your Activatable Altars every minute.<br/>";
        }
        if (item[1] === AltarEnum.Large) {
          overviewText += item[2] + (item[2] === 1 ? " follower is " : " followers are ") + " attempting to activate Large Altars that your party " +
            "has fulfilled the conditions for, each providing a " + Math.round(this.utilityService.largeAltarActivationChancePerFollower * 100) + "% chance to activate any Large Altar among your Activatable Altars every minute.<br/>";
        }
      }

      if (item[0] === FollowerPrayerTypeEnum.Pray) {
        if (item[1] === AltarEnum.Small) {
          overviewText += item[2] + (item[2] === 1 ? " follower is " : " followers are ") + " praying to the gods for Small Altar boons, each providing a " + Math.round(this.utilityService.smallAltarPrayChancePerFollower * 100) + "% chance to receive a random god's Small Altar boon every minute.<br/>";
        }
        if (item[1] === AltarEnum.Large) {
          overviewText += item[2] + (item[2] === 1 ? " follower is " : " followers are ") + " praying to the gods for Large Altar boons, each providing a " + Math.round(this.utilityService.largeAltarPrayChancePerFollower * 100) + "% chance to receive a random god's Large Altar boon every minute.<br/>";
        }
      }
    });

    if (overviewText === "")
      overviewText = "No followers are currently praying.";

    return overviewText;
  }

  getFollowerPurchasePrice() {
    var userResourceAmount = this.lookupService.getResourceAmount(ItemsEnum.Coin);
    return "<span class='" + this.getItemKeywordClass(this.followerService.getPriceForNextFollower(), userResourceAmount) + "'>" + this.followerService.getPriceForNextFollower().toLocaleString() + " <span>Coins</span> <i>(" + userResourceAmount.toLocaleString() + " owned)</i></span>";
  }

  getFollowerAchievementPrice() {
    var neededAchievements = this.globalService.getAchievementsForNextFollower() - this.globalService.globalVar.followerData.achievementCompletionCounter;
    return neededAchievements + " more " + (neededAchievements === 1 ? "achievement" : "achievements") + " needed<br/>for a new follower.";    
  }

  buyFollower() {
    var price = this.followerService.getPriceForNextFollower();

    if (!this.canBuyFollower())
      return;

    this.lookupService.useResource(ItemsEnum.Coin, price);
    this.globalService.globalVar.followerData.numberOfFollowersPurchased += 1;
    this.globalService.globalVar.followerData.availableFollowers += 1;
    this.globalService.globalVar.followerData.followers.push(new IndividualFollower());

  }

  canBuyFollower() {
    var price = this.followerService.getPriceForNextFollower();
    var canBuy = true;    

    var userResourceAmount = this.lookupService.getResourceAmount(ItemsEnum.Coin);
    if (userResourceAmount < price)
      canBuy = false;

    return canBuy;
  }

  getItemKeywordClass(amountNeeded: number, amountOwned: number) {
    var classText = "resourceKeyword";

    if (amountOwned < amountNeeded)
      classText = "insufficientResourcesKeyword";

    return classText;
  }
}
