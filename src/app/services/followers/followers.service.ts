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
import { LookupService } from '../lookup.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';

@Injectable({
  providedIn: 'root'
})
export class FollowersService {

  constructor(private globalService: GlobalService, private resourceGeneratorService: ResourceGeneratorService,
    private lookupService: LookupService, private balladService: BalladService, private achievementService: AchievementService) { }

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
        if (zone.isAvailable && !zone.subzones.some(item => !this.lookupService.isSubzoneATown(item.type) && !this.balladService.isSubzoneSideQuest(item.type) && item.victoryCount < this.balladService.getVictoriesNeededToProceed(item.type))) {
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
    var rewardLevel = 1;

    var achievementPercent = this.achievementService.getCompletedAchievementPercentByZone(this.balladService.findZone(type), this.globalService.globalVar.achievements);
    if (achievementPercent >= (1 / 3) && achievementPercent < (2 / 3))
      rewardLevel = 2;
    else if (achievementPercent >= (2 / 3) && achievementPercent < 1)
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
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Wax, 2));
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
      if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PetrifiedBark, 5));
      }
      if (rewardLevel === 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PetrifiedBark, 2));
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
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughRubyFragment, 2));
      }
    }
    if (type === ZoneEnum.PeloposNisos) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfLakeLerna, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughTopazFragment, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAmethystFragment, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughOpalFragment, 2));
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
    if (type === ZoneEnum.TheLethe) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SpiritEssence, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughEmeraldFragment, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalScraps, 2));
      }
    }
    if (type === ZoneEnum.AegeanSea) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Lousewort, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharkTeeth, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.FishScales, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 2));
      }
    }
    if (type === ZoneEnum.BlackSea) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.FishScales, 2));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Seashell, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheBlackSea, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Sorrel, 4));
      }
    }
    if (type === ZoneEnum.Colchis) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SpiritEssence, 3));
      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughEmeraldFragment, 2));
      }
      if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalScraps, 5));
      }
      if (rewardLevel === 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalScraps, 2));
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
    var repeaterTotal = Math.floor(this.globalService.globalVar.followerData.numberOfFollowersPurchased / 4);
    var repeaterOrder = this.globalService.globalVar.followerData.numberOfFollowersPurchased % 4;

    if (repeaterOrder === 0)
      return 10 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 1)
      return 25 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 2)
      return 50 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 3)
      return 75 * Math.pow(10, 2 + repeaterTotal);

    return 0;
  }
}
