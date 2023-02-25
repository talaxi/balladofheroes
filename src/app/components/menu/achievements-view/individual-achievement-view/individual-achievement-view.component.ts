import { Component, Input, OnInit } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-individual-achievement-view',
  templateUrl: './individual-achievement-view.component.html',
  styleUrls: ['./individual-achievement-view.component.css']
})
export class IndividualAchievementViewComponent implements OnInit {
  @Input() achievement: Achievement;

  constructor(private lookupService: LookupService) { }

  ngOnInit(): void {
  }

  
  getAchievementDescription(type: AchievementTypeEnum)
  {
    return this.lookupService.getAchievementDescription(type);
  }

  //you were adding bonus xp to medusa so you need to make this an ngFor and display all possible achievements
  getAchievementReward(resource: ResourceValue) {
    var reward = "";
    //this.achievement.bonusResources.forEach(resource => {
      var amount = resource.amount.toString();
      if (resource.item === ItemsEnum.BoonOfOlympus)
        amount = (resource.amount * 100) + "%";

      reward += amount + " " + this.lookupService.getItemName(resource.item);
    //});

    return reward;
  }
}
