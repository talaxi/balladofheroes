import { Injectable } from '@angular/core';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { GlobalService } from './global/global.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private globalService: GlobalService) { }

  getTotalXpGainFromEnemyTeam(enemyTeam: Enemy[]) {
    var totalXp = 0;

    enemyTeam.forEach(enemy => {
      totalXp += enemy.xpGainFromDefeat;
    });

    return totalXp;
  }

  getItemName(type: ItemsEnum) {
    var name = "";

    if (type === ItemsEnum.HealingHerb) {
      name = "Healing Herb";
    }

    return name;
  }

  getResourceAmount(type: ItemsEnum) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type);
    if (resource === undefined)
      return 0;

    return resource.amount;
  }

  useResource(type: ItemsEnum, amount: number) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type);
    if (resource === undefined)
      return;

    resource.amount -= amount;

    if (resource.amount < 0)
      resource.amount = 0;
  }

  itemDoesNotNeedSelection() {
    var doesNotNeedSelection = false;

    return doesNotNeedSelection;
  }

  getHealingHerbAmount() {
    return 50;
  }

  getAdjustedAgility(character: Character)
  {
    var agility = character.battleStats.agility;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0)
    {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AgilityUp ||
        effect.type === StatusEffectEnum.AgilityDown);

      if (relevantStatusEffects.length > 0)
      {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AgilityUp || effect.type === StatusEffectEnum.AgilityDown)
          {
            agility *= effect.effectiveness;
          }
        });
      }
    }

    return agility;
  }
}
