import { Component, Input, OnInit } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-individual-achievement-view',
  templateUrl: './individual-achievement-view.component.html',
  styleUrls: ['./individual-achievement-view.component.css']
})
export class IndividualAchievementViewComponent implements OnInit {
  @Input() achievement: Achievement;
  tooltipDirection = DirectionEnum.Down;
  rewards: ResourceValue[];

  constructor(private lookupService: LookupService, private achievementService: AchievementService, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.rewards = this.getAchievementRewards();
  }

  getAchievementRewards() {
    return this.achievementService.getAchievementReward(this.achievement.subzone, this.achievement.type);
  }

  getAchievementDescription(type: AchievementTypeEnum) {
    return this.lookupService.getAchievementDescription(type);
  }

  getAchievementReward(resource: ResourceValue) {
    var reward = "";
    var amount = resource.amount.toString();
    if (resource.item === ItemsEnum.BoonOfOlympus)
      amount = (resource.amount * 100) + "%";

    reward += amount + " " + this.dictionaryService.getItemName(resource.item);

    return reward;
  }

  getRewardDescription() {
    var description = "";
    var rewards = this.achievementService.getAchievementReward(this.achievement.subzone, this.achievement.type);    

    for (var i = 0; i < rewards.length; i++) {
      var resource = rewards[i];
      description += this.lookupService.getItemDescription(resource.item);      

      if (i < rewards.length - 1)
      {
        description += "<br/>";
      }
    }

    return description;
  }
}
