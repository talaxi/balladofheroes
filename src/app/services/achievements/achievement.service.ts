import { Injectable } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private lookupService: LookupService) { }

  createDefaultAchievementsForSubzone(subzoneType: SubZoneEnum) {
    var newAchievements: Achievement[] = [];

    var hundredVictories = new Achievement(AchievementTypeEnum.HundredVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 20));
    
    else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
      else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
      else if (subzoneType === SubZoneEnum.DodonaCountryside)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 25));

    if (hundredVictories.bonusResources.length > 0)
      newAchievements.push(hundredVictories);

    var thousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));

    if (thousandVictories.bonusResources.length > 0)
      newAchievements.push(thousandVictories);

    var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));

    if (thirtySecondClear.bonusResources.length > 0)
      newAchievements.push(thirtySecondClear);

    var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, .02));

    if (tenSecondClear.bonusResources.length > 0)
      newAchievements.push(tenSecondClear);

    return newAchievements;
  }

  checkForSubzoneAchievement(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var completedAchievement = undefined;
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    if (subzoneRelatedAchievements !== undefined && subzoneRelatedAchievements.length > 0) {
      var subzone = this.lookupService.getSubZoneByType(subzoneType);
      if (subzone === undefined)
        return completedAchievement;

      var hundredVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.HundredVictories);
      if (hundredVictories !== undefined && subzone.victoryCount >= 100 && !hundredVictories.completed && hundredVictories.bonusResources !== undefined) {
        completedAchievement = hundredVictories;
        hundredVictories.completed = true;
        hundredVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var thousandVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.ThousandVictories);
      if (thousandVictories !== undefined && subzone.victoryCount >= 1000 && !thousandVictories.completed && thousandVictories.bonusResources !== undefined) {
        completedAchievement = thousandVictories;
        thousandVictories.completed = true;
        thousandVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var tenThousandVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.TenThousandVictories);
      if (tenThousandVictories !== undefined && subzone.victoryCount >= 100 && !tenThousandVictories.completed && tenThousandVictories.bonusResources !== undefined) {
        completedAchievement = tenThousandVictories;
        tenThousandVictories.completed = true;
        tenThousandVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }
    }

    return completedAchievement;
  }

  getAchievementsBySubZone(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    return subzoneRelatedAchievements;
  }

  getUncompletedAchievementCountBySubZone(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    return subzoneRelatedAchievements.filter(item => !item.completed).length;
  }
}
