import { Injectable } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { GlobalService } from '../global/global.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService) { }

  generateEnemy(type: BestiaryEnum)
  {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;

    if (type === BestiaryEnum.WaterSerpent)
    {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(12, 12, 4, 5, 0, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 37;
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 1, .5));
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, 1));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, 1, .5));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, 1));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, 1, 1));
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(20, 10, 8, 3, 1, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45;
      enemy.loot.push(new LootItem(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, 1, 1));
    }
    if (type === BestiaryEnum.FrenziedGull)
    {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(18, 15, 3, 6, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = .5;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 5;
      enemy.abilityList.push(peck);

      enemy.loot.push(new LootItem(ItemsEnum.ShortBow, ItemTypeEnum.Equipment, 1, 1));
    }
    if (type === BestiaryEnum.StarvingMongrel)
    {
      enemy.name = "Starving Mongrel";
      enemy.battleStats = new CharacterStats(17, 12, 4, 10, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 50; 
      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, .5));
    }
    if (type === BestiaryEnum.WildBoar)
    {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 10, 10, 5, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, .5));
    }
    if (type === BestiaryEnum.KillerBees)
    {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, .5));
    }
    if (type === BestiaryEnum.Matriarch)
    {
      enemy.name = "Matriarch";
      enemy.battleStats = new CharacterStats(100, 25, 8, 8, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 100; 

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1.25;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 18;
      slash.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1, .5));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, 1, 1));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, 1, 1));
      enemy.loot.push(new LootItem(ItemsEnum.ShortBow, ItemTypeEnum.Equipment, 1, 1));
    }

    return enemy;
  }
}
