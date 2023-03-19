import { Injectable } from '@angular/core';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';

@Injectable({
  providedIn: 'root'
})
export class FollowersService {

  constructor(private globalService: GlobalService, private resourceGeneratorService: ResourceGeneratorService,
    private achievementService: AchievementService, private balladService: BalladService) { }

  getAssignedFollowers() {
    return this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo !== FollowerActionEnum.None).length;
  }

  getUnassignedFollowers() {
    return this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo === FollowerActionEnum.None).length;
  }

  getTotalFollowers() {
    return this.globalService.globalVar.followerData.availableFollowers;
  }

  getClearedZones() {
    var clearedZones: Zone[] = [];

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.isAvailable && !zone.subzones.some(item => !item.isTown && !item.isSubzoneSideQuest() && item.victoryCount < item.victoriesNeededToProceed)) {
          clearedZones.push(zone);
        }
      });
    });

    return clearedZones;
  }

  incrementZoneFollowers(type: ZoneEnum) {
    var unassignedFollower = this.globalService.globalVar.followerData.followers.find(follower => follower.assignedTo === FollowerActionEnum.None);

    if (unassignedFollower === undefined)
      return;

    unassignedFollower.assignedTo = FollowerActionEnum.SearchingZone;
    unassignedFollower.assignedZone = type;
    unassignedFollower.assignedPrayerType = FollowerPrayerTypeEnum.None;
    unassignedFollower.assignedAltarType = AltarEnum.None;
  }

  decrementZoneFollowers(type: ZoneEnum) {
    var assignedFollower = this.globalService.globalVar.followerData.followers
      .find(follower => follower.assignedTo === FollowerActionEnum.SearchingZone && follower.assignedZone === type);

    if (assignedFollower === undefined)
      return;

    assignedFollower.assignedTo = FollowerActionEnum.None;
    assignedFollower.assignedZone = ZoneEnum.None;
    assignedFollower.assignedPrayerType = FollowerPrayerTypeEnum.None;
    assignedFollower.assignedAltarType = AltarEnum.None;
  }

  canDecrement(type: ZoneEnum) {
    var assignedFollower = this.globalService.globalVar.followerData.followers
      .find(follower => follower.assignedTo === FollowerActionEnum.SearchingZone && follower.assignedZone === type);

    return assignedFollower !== undefined;
  }

  canIncrementZoneSearch(type: ZoneEnum) {
    var unassignedFollower = this.globalService.globalVar.followerData.followers.find(follower => follower.assignedTo === FollowerActionEnum.None);
    var assignedFollowers = this.globalService.globalVar.followerData.followers
    .filter(follower => follower.assignedTo === FollowerActionEnum.SearchingZone && follower.assignedZone === type);

    return unassignedFollower !== undefined && assignedFollowers.length < this.getMaxFollowersAssignedToZone(type);
  }

  canIncrement() {
    var unassignedFollower = this.globalService.globalVar.followerData.followers.find(follower => follower.assignedTo === FollowerActionEnum.None);

    return unassignedFollower !== undefined;
  }

  getFollowersAssignedToZone(type: ZoneEnum) {
    return this.globalService.globalVar.followerData.followers
      .filter(follower => follower.assignedTo === FollowerActionEnum.SearchingZone && follower.assignedZone === type).length;
  }

  getMaxFollowersAssignedToZone(type: ZoneEnum) {
    return this.getZoneAchievementRewardLevel(type);
  }

  getFollowersAssignedToPrayer(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    return this.globalService.globalVar.followerData.followers
      .filter(follower => follower.assignedTo === FollowerActionEnum.Praying &&
        follower.assignedPrayerType === followerPrayerType && follower.assignedAltarType === altarType).length;
  }

  getZoneAchievementRewardLevel(type: ZoneEnum) {
    var rewardLevel = 1; //should range from 1 to 3 based on achievement completion

    var achievementPercent = this.achievementService.getCompletedAchievementPercentByZone(this.balladService.findZone(type), this.globalService.globalVar.achievements);
    if (achievementPercent >= (1 / 3) && achievementPercent < (2 / 3))
      rewardLevel = 2;
    else if (achievementPercent >= (2 / 3))
      rewardLevel = 3;
    else if (achievementPercent === 1)
      rewardLevel = 4;

    return rewardLevel;
  }

  getZoneSearchRewards(type: ZoneEnum) {
    var rewardLevel = this.getZoneAchievementRewardLevel(type);

    var rewards: ResourceValue[] = [];
    if (type === ZoneEnum.Aigosthena) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.LightLeather, 3));
      if (rewardLevel >= 2)
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 5));
      if (rewardLevel >= 3)
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingHerb, 3));
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Leather, 2));
      }
    }
    if (type === ZoneEnum.Dodona) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Olive, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Leather, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 4));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.LamiaHeart, 2));
      }
    }
    if (type === ZoneEnum.Libya) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Olive, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PetrifiedBark, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PetrifiedBark, 3));
      }
    }
    if (type === ZoneEnum.Asphodel) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SoulSpark, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheLethe, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfFire, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Asphodelus, 4));
      }
    }
    if (type === ZoneEnum.Elysium) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheLethe, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Narcissus, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingSalve, 1));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SmallRuby, 1));
      }
    }
    if (type === ZoneEnum.PeloposNisos) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfLakeLerna, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SmallEmerald, 1));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SmallAmethyst, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SmallAquamarine, 2));
      }
    }
    if (type === ZoneEnum.Calydon) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Goldroot, 4));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThickLeather, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Lousewort, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Violet, 4));
      }
    }


    return rewards;
  }

  incrementPrayerFollowers(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    var unassignedFollower = this.globalService.globalVar.followerData.followers.find(follower => follower.assignedTo === FollowerActionEnum.None);

    if (unassignedFollower === undefined)
      return;

    unassignedFollower.assignedTo = FollowerActionEnum.Praying;
    unassignedFollower.assignedPrayerType = followerPrayerType;
    unassignedFollower.assignedAltarType = altarType;
    unassignedFollower.assignedZone = ZoneEnum.None;
  }

  decrementPrayerFollowers(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    var assignedFollower = this.globalService.globalVar.followerData.followers
      .find(follower => follower.assignedTo === FollowerActionEnum.Praying && follower.assignedPrayerType === followerPrayerType &&
        follower.assignedAltarType === altarType);

    if (assignedFollower === undefined)
      return;

    assignedFollower.assignedTo = FollowerActionEnum.None;
    assignedFollower.assignedZone = ZoneEnum.None;
    assignedFollower.assignedPrayerType = FollowerPrayerTypeEnum.None;
    assignedFollower.assignedAltarType = AltarEnum.None;
  }

  canDecrementPrayerFollowers(followerPrayerType: FollowerPrayerTypeEnum, altarType: AltarEnum) {
    var assignedFollower = this.globalService.globalVar.followerData.followers
      .find(follower => follower.assignedTo === FollowerActionEnum.Praying && follower.assignedPrayerType === followerPrayerType &&
        follower.assignedAltarType === altarType);

    return assignedFollower !== undefined;
  }

  getPriceForNextFollower() {
    var repeaterTotal = Math.floor(this.globalService.globalVar.followerData.numberOfFollowersPurchased / 3);
    var repeaterOrder = this.globalService.globalVar.followerData.numberOfFollowersPurchased % 3;

    if (repeaterOrder === 0)
      return 10 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 1)
      return 25 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 2)
      return 50 * Math.pow(10, 2 + repeaterTotal);

    return 0;
  }
}
