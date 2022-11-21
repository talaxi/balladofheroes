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

    if (subzoneType === SubZoneEnum.AigosthenaLowerCoast) {
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    }

    newAchievements.push(hundredVictories);

    var ThousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);
    newAchievements.push(ThousandVictories);

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
      if (hundredVictories !== undefined && subzone.victoryCount >= 1 && !hundredVictories.completed && hundredVictories.bonusResources !== undefined) {                        
          hundredVictories.bonusResources.forEach(bonus => {
            this.lookupService.gainResource(bonus);
          });        
      }
    }

    return completedAchievement;
  }
}
