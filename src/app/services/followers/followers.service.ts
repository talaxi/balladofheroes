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
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';

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
        if (zone.isAvailable && !zone.subzones.some(item => !this.lookupService.isSubzoneATown(item.type) && !this.balladService.isSubzoneSideQuest(item.type) && item.type !== SubZoneEnum.NemeaCountryRoadsOne && item.victoryCount < this.balladService.getVictoriesNeededToProceed(item.type))) {
          clearedZones.push(zone);
        }
      });
    });

    return clearedZones;
  }

  getClearedZonesForBallad(type: BalladEnum) {
    var clearedZones: Zone[] = [];

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.type === type) {
        ballad.zones.forEach(zone => {
          if (zone.isAvailable && !zone.subzones.some(item => !this.lookupService.isSubzoneATown(item.type) && !this.balladService.isSubzoneSideQuest(item.type) && item.type !== SubZoneEnum.NemeaCountryRoadsOne && item.victoryCount < this.balladService.getVictoriesNeededToProceed(item.type))) {
            clearedZones.push(zone);
          }
        });
      }
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

  getFollowerCountForBallad(type: BalladEnum) {
    var ballad = this.balladService.findBallad(type);
    var followerCount = 0;

    if (ballad === undefined)
      return followerCount;

    ballad.zones.forEach(zone => {
      followerCount += this.getFollowersAssignedToZone(zone.type);
    })

    return followerCount;
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
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughRubyFragment, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingSalve, 3));
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
    if (type === ZoneEnum.Nemea) {
      if (rewardLevel === 1 || rewardLevel === 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Honey, 2));
      }
      else if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Honey, 5));
      }
      if (rewardLevel === 2 || rewardLevel === 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CoarseFur, 2));
      }
      else if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CoarseFur, 4));
      }
    }
    if (type === ZoneEnum.Lerna) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ToxicIchor, 2));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfWater, 3));
      }
      if (rewardLevel === 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SerpentScale, 2));
      }
      else if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CoarseFur, 3));
      }
    }
    if (type === ZoneEnum.Stymphalia) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SmallAnimalBones, 2));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharpFeather, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.WhiteHorn, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BronzeBeak, 1));
      }
    }
    if (type === ZoneEnum.Erymanthus) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BearHide, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalScraps, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BirchBark, 2));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Tusk, 2));
      }
    }
    if (type === ZoneEnum.CoastOfCrete) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheCretanSea, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PristineCrabClaw, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RadiatingGemstone, 1));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AnimalHide, 2));
      }
    }
    if (type === ZoneEnum.GardenOfTheHesperides) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CanineFang, 2));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ToxicIchor, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Honey, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MagicTreeBark, 2));
      }
    }
    if (type === ZoneEnum.Erytheia) {

      if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharpFeather, 5));
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CanineFang, 5));
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ToxicIchor, 5));
      }
      else {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharpFeather, 3));

        if (rewardLevel >= 2) {
          rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CanineFang, 3));
        }
        if (rewardLevel >= 3) {
          rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ToxicIchor, 2));
        }
      }
    }
    
    if (type === ZoneEnum.MountOlympus) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfFire, 4));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BlackHorn, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfEarth, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfHoly, 3));
      }
    }
    
    if (type === ZoneEnum.HuntForYarrow) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfWater, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfLightning, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EssenceOfAir, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MagicCore, 2));
      }
    }
    
    if (type === ZoneEnum.WarForTheMountain) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughOpalFragment, 6));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughRubyFragment, 6));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughTopazFragment, 6));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Nectar, 1));
      }
    }
    
    if (type === ZoneEnum.Crete) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheCretanSea, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EagleFeather, 2));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 6));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharpFeather, 3));
      }
    }
    
    if (type === ZoneEnum.Labyrinth) {
      if (rewardLevel <= 3)
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalNuggets, 2));
      else
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalNuggets, 5));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MagicDust, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 200));
      }
    }
     
    if (type === ZoneEnum.Aiaia) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfForeignWaters, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileOpalFragment, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Peony, 4));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileAmethystFragment, 3));
      }
    }
     
    if (type === ZoneEnum.StraitsOfMessina) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.UnstableElement, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileAquamarineFragment, 3));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileTopazFragment, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileEmeraldFragment, 3));
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileRubyFragment, 3));
      }
    }
    
    if (type === ZoneEnum.ReturnToColchis) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SquidInk, 3));

      if (rewardLevel >= 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileAmethystFragment, 4));
      }
      if (rewardLevel >= 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SpiderSilk, 3));
      }
      if (rewardLevel >= 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ImmortalScales, 3));        
      }
    }
    
    if (type === ZoneEnum.EscapeFromColchis) {
      if (rewardLevel === 1)
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalCore, 2));
      else if (rewardLevel === 2) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalCore, 4));
      }
      else if (rewardLevel === 3) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalCore, 6));
      }
      else if (rewardLevel === 4) {
        rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalCore, 8));
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
