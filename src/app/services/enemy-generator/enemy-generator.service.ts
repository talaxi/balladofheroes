import { Injectable } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor() { }

  generateEnemy(type: BestiaryEnum)
  {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;

    if (type === BestiaryEnum.WaterSerpent)
    {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(15, 10, 13, 1, 1, 120, 10, 15); 
      enemy.xpGainFromDefeat = 500;
      enemy.currentStagger = enemy.baseStagger = 100;
      enemy.breakPoint = 200; 
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 1, .5));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, 1, .5));
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(25, 10, 13, 1, 1, 120, 10, 15); 
      enemy.xpGainFromDefeat = 500;
      enemy.currentStagger = enemy.baseStagger = 100;
      enemy.breakPoint = 200;  
      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, .5));
    }

    return enemy;
  }
}
