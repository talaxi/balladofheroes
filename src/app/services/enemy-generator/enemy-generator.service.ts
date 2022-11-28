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
      enemy.battleStats = new CharacterStats(10, 12, 4, 5, 0, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 37;
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(18, 10, 7, 3, 1, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45;
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .15));
    }
    if (type === BestiaryEnum.FrenziedGull)
    {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(16, 15, 3, 6, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 40; 

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = .5;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 5;
      enemy.abilityList.push(peck);
    }
    if (type === BestiaryEnum.StarvingMongrel)
    {
      enemy.name = "Starving Mongrel";
      enemy.battleStats = new CharacterStats(17, 12, 4, 10, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 50; 
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 1, .1));
    }
    if (type === BestiaryEnum.WildBoar)
    {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 10, 10, 5, 5, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;      
      //chance to drop light leather
    }
    if (type === BestiaryEnum.KillerBees)
    {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Matriarch)
    {
      enemy.name = "Matriarch";
      enemy.battleStats = new CharacterStats(100, 25, 8, 8, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 100; 

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1.25;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 18;
      slash.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .2));
    }
    if (type === BestiaryEnum.Bandit)
    {
      enemy.name = "Bandit";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Thief)
    {
      enemy.name = "Thief";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Highwayman)
    {
      enemy.name = "Highwayman";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Coyote)
    {
      enemy.name = "Coyote";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop light leather
    }
    if (type === BestiaryEnum.Archer)
    {
      enemy.name = "Archer";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.RedHarpy)
    {
      enemy.name = "Red-Feathered Harpy";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop leather

    }
    if (type === BestiaryEnum.BlueHarpy)
    {
      enemy.name = "Blue-Feathered Harpy";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop leather
    }
    if (type === BestiaryEnum.GreenHarpy)
    {
      enemy.name = "Green-Feathered Harpy";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop leather
    }
    if (type === BestiaryEnum.FledglingLamia)
    {
      enemy.name = "Fledgling Lamia";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop Lamia Scales
    }
    if (type === BestiaryEnum.Lamia)
    {
      enemy.name = "Lamia";
      enemy.battleStats = new CharacterStats(10, 9, 4, 15, 15, 0); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 30; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
      //chance to drop Lamia Scales
    }
    if (type === BestiaryEnum.Sybaris)
    {
      enemy.name = "Sybaris";
      enemy.battleStats = new CharacterStats(100, 25, 8, 8, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 100; 

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1.25;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 18;
      slash.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.LamiaFang, ItemTypeEnum.CraftingMaterial, 1, .2));
      //chance to drop Poison Fang (battle item)
    }

    return enemy;
  }
}
