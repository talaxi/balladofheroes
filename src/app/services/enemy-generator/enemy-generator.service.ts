import { Injectable } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
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
    enemy.bestiaryType = type;

    if (type === BestiaryEnum.WaterSerpent)
    {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(10, 12, 7, 5, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 22;
      enemy.coinGainFromDefeat = 0;
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(14, 10, 10, 3, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 31;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .15));
    }
    if (type === BestiaryEnum.FrenziedGull)
    {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(16, 14, 6, 6, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 33; 

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
      enemy.battleStats = new CharacterStats(17, 13, 11, 10, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 35; 
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .08));
    }
    if (type === BestiaryEnum.WildBoar)
    {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 11, 14, 5, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;      
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .1));
    }
    if (type === BestiaryEnum.KillerBees)
    {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(12, 17, 8, 15, 25, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 20; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2, .01));
    }
    if (type === BestiaryEnum.Patriarch)
    {
      enemy.name = "Patriarch";
      enemy.battleStats = new CharacterStats(125, 24, 18, 8, 5, 40); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 100; 

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1.25;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 18;
      slash = this.randomizeCooldown(slash);
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .9, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .2));
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .04));
    }
    if (type === BestiaryEnum.Bandit)
    {
      enemy.name = "Bandit";
      enemy.battleStats = new CharacterStats(35, 20, 13, 7, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Thief)
    {
      enemy.name = "Thief";
      enemy.battleStats = new CharacterStats(28, 17, 10, 35, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 3;      
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.Highwayman)
    {
      enemy.name = "Highwayman";
      enemy.battleStats = new CharacterStats(60, 18, 20, 10, 10, 20); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, 1, .01));
    }
    if (type === BestiaryEnum.Coyote)
    {
      enemy.name = "Coyote";
      enemy.battleStats = new CharacterStats(27, 19, 16, 25, 25, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 42; 
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .15));
      //chance to drop light leather
    }
    if (type === BestiaryEnum.Archer)
    {
      enemy.name = "Archer";
      enemy.battleStats = new CharacterStats(220, 29, 20, 10, 25, 60); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 120; 
      enemy.coinGainFromDefeat = 3;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 2, .125));

      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.isAvailable = true;
      sureShot.effectiveness = 1.5;
      sureShot.cooldown = sureShot.currentCooldown = 25;
      sureShot = this.randomizeCooldown(sureShot);
      sureShot.dealsDirectDamage = true;
      sureShot.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, sureShot.name));
      enemy.abilityList.push(sureShot);
    }
    if (type === BestiaryEnum.RedHarpy)
    {
      enemy.name = "Red-Feathered Harpy";
      enemy.battleStats = new CharacterStats(76, 23, 22, 25, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .2));
      //chance to drop leather

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 18;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

    }
    if (type === BestiaryEnum.BlueHarpy)
    {
      enemy.name = "Blue-Feathered Harpy";
      enemy.battleStats = new CharacterStats(85, 33, 24, 20, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 58; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .2));
      //chance to drop leather

      var enrage = new Ability();
      enrage.name = "Enrage";
      enrage.isAvailable = true;
      enrage.cooldown = enrage.currentCooldown = (this.utilityService.enemyLongAutoAttackSpeed - 1);
      enrage.dealsDirectDamage = false;
      enrage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 5, 1.25, false, true));
      enemy.abilityList.push(enrage);
    }
    if (type === BestiaryEnum.GreenHarpy)
    {
      enemy.name = "Green-Feathered Harpy";
      enemy.battleStats = new CharacterStats(78, 29, 19, 20, 20, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .2));
      //chance to drop leather
      
      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 1.8;
      ravage.cooldown = ravage.currentCooldown = 7;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      enemy.abilityList.push(ravage);
    }
    if (type === BestiaryEnum.FledglingLamia)
    {
      enemy.name = "Fledgling Lamia";
      enemy.battleStats = new CharacterStats(55, 20, 17, 75, 20, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 50; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .05));      
    }
    if (type === BestiaryEnum.Lamia)
    {
      enemy.name = "Lamia";
      enemy.battleStats = new CharacterStats(93, 35, 35, 25, 30, 30); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 60; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .1));      

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 12;
      empower = this.randomizeCooldown(empower);
      empower.dealsDirectDamage = false;
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);
    }
    if (type === BestiaryEnum.Sybaris)
    {
      enemy.name = "Sybaris";
      enemy.battleStats = new CharacterStats(700, 41, 51, 23, 20, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 150; 

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.7;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 22;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(20, 4, .2, bite.name));
      enemy.abilityList.push(bite);

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 14;
      empower.dealsDirectDamage = false;
      empower = this.randomizeCooldown(empower);
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);

      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 3, .08));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 2, .05));
      //chance to drop Poison Fang (battle item)
    }
    if (type === BestiaryEnum.LargeOctopus)
    {
      enemy.name = "Large Octopus";
      enemy.battleStats = new CharacterStats(108, 30, 31, 30, 30, 30); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      //chance to drop Lamia Scales

      var constrict = new Ability();
      constrict.name = "Constrict";
      constrict.isAvailable = true;
      constrict.cooldown = constrict.currentCooldown = 16;
      constrict = this.randomizeCooldown(constrict);
      constrict.dealsDirectDamage = false;
      constrict.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .75, false, false));      
      enemy.abilityList.push(constrict);
    }
    if (type === BestiaryEnum.UnsettlingShade)
    {
      enemy.name = "Unsettling Shade";
      enemy.battleStats = new CharacterStats(150, 64, 69, 60, 60, 25); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 70; 
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ForgottenLocket, ItemTypeEnum.Equipment, 1, .0075));

      var ethereal = new Ability();
      ethereal.name = "Ethereal";
      ethereal.isAvailable = true;
      ethereal.cooldown = ethereal.currentCooldown = 30;
      ethereal = this.randomizeCooldown(ethereal);
      ethereal.dealsDirectDamage = false;
      ethereal.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 0, false, true));      
      enemy.abilityList.push(ethereal);
    }
    if (type === BestiaryEnum.Gorgon)
    {
      enemy.name = "Gorgon";
      enemy.battleStats = new CharacterStats(120, 45, 66, 50, 35, 35); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 72; 
      enemy.coinGainFromDefeat = 2;      
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .01));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 24;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 8, 0, false, false));      
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Stheno)
    {
      enemy.name = "Stheno";
      enemy.battleStats = new CharacterStats(800, 79, 80, 100, 25, 100); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 2, .08));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 25;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 8, 0, false, false));      
      enemy.abilityList.push(gaze);

      var bite = new Ability();
      bite.name = "Snake Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.4;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .3, bite.name));
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.Euryale)
    {
      enemy.name = "Euryale";
      enemy.battleStats = new CharacterStats(700, 67, 85, 40, 100, 110); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .2));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 20;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));      
      enemy.abilityList.push(gaze);

      var feint = new Ability();
      feint.name = "Feint";
      feint.isAvailable = true;
      feint.dealsDirectDamage = false;
      feint.cooldown = feint.currentCooldown = 15;
      feint = this.randomizeCooldown(feint);
      feint.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 7, .75, false, false)); 
      enemy.abilityList.push(feint);
    }
    if (type === BestiaryEnum.Medusa)
    {
      //TODO: large XP boost on completing the first time
      enemy.name = "Medusa";
      enemy.battleStats = new CharacterStats(2000, 115, 122, 115, 67, 175); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 175; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 5, .05));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 25;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));      
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Lion)
    {      
      enemy.name = "Lion";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var swipe = new Ability();
      swipe.name = "Swipe";
      swipe.isAvailable = true;
      swipe.cooldown = swipe.currentCooldown = 13;
      swipe = this.randomizeCooldown(swipe);
      swipe.dealsDirectDamage = true;
      swipe.effectiveness = 1.4;    
      enemy.abilityList.push(swipe);
    }
    if (type === BestiaryEnum.EnceladusOne)
    {      
      enemy.name = "Enceladus";
      enemy.battleStats = new CharacterStats(250000, 415, 683, 60, 600, 1000); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 10;
      enemy.xpGainFromDefeat = 1000;       

      var smash = new Ability();
      smash.name = "Smash";
      smash.isAvailable = true;
      smash.cooldown = smash.currentCooldown = 15;
      smash = this.randomizeCooldown(smash);
      smash.dealsDirectDamage = true;
      smash.effectiveness = 2.3;    
      smash.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 5, .8, smash.name));
      enemy.abilityList.push(smash);

      var wallop = new Ability();
      wallop.name = "Wallop";
      wallop.isAvailable = true;
      wallop.cooldown = wallop.currentCooldown = 15;
      wallop = this.randomizeCooldown(wallop);
      wallop.dealsDirectDamage = true;
      wallop.effectiveness = 1.5;
      wallop.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .4, false, false));      
      enemy.abilityList.push(wallop);
    }
    if (type === BestiaryEnum.LostSoul)
    {
      //somewhat easy to rebound from resetting gods
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(513, 76, 113, 40, 40, 40); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .025));
    }
    if (type === BestiaryEnum.Wretched)
    {
      enemy.name = "Wretched";
      enemy.battleStats = new CharacterStats(563, 82, 95, 60, 60, 60); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .01));

      var deathsTouch = new Ability();
      deathsTouch.name = "Death's Touch";
      deathsTouch.isAvailable = true;
      deathsTouch.cooldown = deathsTouch.currentCooldown = 18;
      deathsTouch = this.randomizeCooldown(deathsTouch);
      deathsTouch.dealsDirectDamage = false;
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 7, .9, false, false));
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 7, .9, false, false));
      enemy.abilityList.push(deathsTouch);
    }
    if (type === BestiaryEnum.Revenant)
    {
      enemy.name = "Revenant";
      enemy.battleStats = new CharacterStats(900, 110, 110, 75, 40, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .02));

      var soulRip = new Ability();
      soulRip.name = "Soul Rip";
      soulRip.isAvailable = true;
      soulRip.cooldown = soulRip.currentCooldown = 13;
      soulRip = this.randomizeCooldown(soulRip);
      soulRip.dealsDirectDamage = true;
      soulRip.effectiveness = 1;
      soulRip.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .25, true, true));      
      enemy.abilityList.push(soulRip);
    }
    if (type === BestiaryEnum.IncoherentBanshee)
    {
      enemy.name = "Incoherent Banshee";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 1, .033));

      var rambling = new Ability();
      rambling.name = "Rambling";
      rambling.isAvailable = true;
      rambling.cooldown = rambling.currentCooldown = 16;
      rambling = this.randomizeCooldown(rambling);
      rambling.dealsDirectDamage = false;
      rambling.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 9, .7, false, false, true));
      enemy.abilityList.push(rambling);
    }
    if (type === BestiaryEnum.EngorgedShade)
    {
      enemy.name = "Engorged Shade";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 1, .01));
    }
    if (type === BestiaryEnum.CacklingSpectre)
    {
      enemy.name = "Cackling Spectre";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2, .1));
    }
    if (type === BestiaryEnum.FloatingFlame)
    {
      enemy.name = "Floating Flame";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .025));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .1));

      var burn = new Ability();
      burn.name = "Burn";
      burn.isAvailable = true;
      burn.cooldown = burn.currentCooldown = 10;
      burn = this.randomizeCooldown(burn);
      burn.dealsDirectDamage = false;      
      burn.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 5, 1.5, burn.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(burn);
    }
    if (type === BestiaryEnum.Butcher)
    {
      enemy.name = "Butcher";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .0025));
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .0025));

      var slice = new Ability();
      slice.name = "Slice";
      slice.isAvailable = true;
      slice.cooldown = slice.currentCooldown = 13;
      slice = this.randomizeCooldown(slice);
      slice.dealsDirectDamage = true;
      slice.effectiveness = 2;     
      slice.elementalType = ElementalTypeEnum.Fire; 
      slice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.1, false, true));
      enemy.abilityList.push(slice);
    }
    if (type === BestiaryEnum.WheelOfFire)
    {
      enemy.name = "Wheel of Fire";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .01));

      var rollThrough = new Ability();
      rollThrough.name = "Roll";
      rollThrough.isAvailable = true;
      rollThrough.cooldown = rollThrough.currentCooldown = 16;
      rollThrough = this.randomizeCooldown(rollThrough);
      rollThrough.dealsDirectDamage = true;
      rollThrough.isAoe = true;
      rollThrough.effectiveness = 1.4;     
      rollThrough.elementalType = ElementalTypeEnum.Fire; 
      enemy.abilityList.push(rollThrough);
    }
    if (type === BestiaryEnum.Empusa)
    {
      enemy.name = "Empusa";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, 1, .01));
      //TODO: don't forget to increase their fire damage
      enemy.battleStats.elementalDamageIncrease.fire = .25;
            
      var enfire = new Ability();
      enfire.name = "Enfire";
      enfire.isAvailable = true;
      enfire.cooldown = enfire.currentCooldown = 25;
      enfire = this.randomizeCooldown(enfire);
      enfire.dealsDirectDamage = true;
      enfire.effectiveness = 1;
      enfire.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enfire, 20, 1, true, true));      
      enemy.abilityList.push(enfire);
    }
    if (type === BestiaryEnum.InsaneSoul)
    {
      enemy.name = "Insane Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2, .02));
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .075));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .01));

      var slam = new Ability();
      slam.name = "Slam";
      slam.isAvailable = true;
      slam.cooldown = slam.currentCooldown = 8;
      slam = this.randomizeCooldown(slam);
      slam.dealsDirectDamage = true;
      slam.effectiveness = 1.25;           
      enemy.abilityList.push(slam);
    }
    if (type === BestiaryEnum.DualWieldingButcher)
    {
      enemy.name = "Dual-Wielding Butcher";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .005));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .01));
      
      var dualSlice = new Ability();
      dualSlice.name = "Dual Slice";
      dualSlice.isAvailable = true;
      dualSlice.cooldown = dualSlice.currentCooldown = 17;
      dualSlice = this.randomizeCooldown(dualSlice);
      dualSlice.dealsDirectDamage = true;
      dualSlice.effectiveness = 2.5;     
      dualSlice.elementalType = ElementalTypeEnum.Fire; 
      dualSlice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.5, false, true));
      enemy.abilityList.push(dualSlice);
    }
    if (type === BestiaryEnum.LostSoul)
    {
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2, .075));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .01));

      var slam = new Ability();
      slam.name = "Slam";
      slam.isAvailable = true;
      slam.cooldown = slam.currentCooldown = 8;
      slam = this.randomizeCooldown(slam);
      slam.dealsDirectDamage = true;
      slam.effectiveness = 1.25;           
      enemy.abilityList.push(slam);
    }
    if (type === BestiaryEnum.HellRider)
    {
      enemy.name = "Hell Rider";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .02));
      
      var trample = new Ability();
      trample.name = "Trample";
      trample.isAvailable = true;
      trample.effectiveness = 1.75;
      trample.cooldown = trample.currentCooldown = 25;
      trample = this.randomizeCooldown(trample);
      trample.dealsDirectDamage = true;
      trample.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 2, .25, trample.name));
      enemy.abilityList.push(trample);
      
      var stagger = new Ability();
      stagger.name = "Stagger";
      stagger.isAvailable = true;
      stagger.effectiveness = 1.75;
      stagger.cooldown = stagger.currentCooldown = 25;
      stagger = this.randomizeCooldown(stagger);
      stagger.dealsDirectDamage = true;
      stagger.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 8, .5, false, true));
      enemy.abilityList.push(stagger);
    }
    if (type === BestiaryEnum.FieryNewt)
    {
      enemy.name = "Fiery Newt";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .05));

      var fireBreath = new Ability();
      fireBreath.name = "Fire Breath";
      fireBreath.isAvailable = true;
      fireBreath.cooldown = fireBreath.currentCooldown = 22;
      fireBreath = this.randomizeCooldown(fireBreath);
      fireBreath.dealsDirectDamage = true;
      fireBreath.effectiveness = 1.3;     
      fireBreath.elementalType = ElementalTypeEnum.Fire; 
      fireBreath.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(fireBreath);
    }
    if (type === BestiaryEnum.EnflamedSalamander)
    {
      enemy.name = "Enflamed Salamander";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .075));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 3, .033));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .05));

      var tailSwing = new Ability();
      tailSwing.name = "Tail Swipe";
      tailSwing.isAvailable = true;
      tailSwing.cooldown = tailSwing.currentCooldown = 16;
      tailSwing = this.randomizeCooldown(tailSwing);
      tailSwing.dealsDirectDamage = true;
      tailSwing.effectiveness = 1.8;     
      tailSwing.elementalType = ElementalTypeEnum.Fire;       
      enemy.abilityList.push(tailSwing);

      var regeneration = new Ability();
      regeneration.name = "Regeneration";
      regeneration.isAvailable = true;
      regeneration.cooldown = regeneration.currentCooldown = 30;
      regeneration = this.randomizeCooldown(regeneration);
      regeneration.dealsDirectDamage = false;
      regeneration.heals = true;
      regeneration.effectiveness = 1.2;     
      enemy.abilityList.push(regeneration);
    }
    if (type === BestiaryEnum.FallenHero)
    {
      enemy.name = "Fallen Hero";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 1, .1));

      var shieldUp = new Ability();
      shieldUp.name = "Shields Up";
      shieldUp.isAvailable = true;
      shieldUp.cooldown = shieldUp.currentCooldown = 20;
      shieldUp = this.randomizeCooldown(shieldUp);
      shieldUp.dealsDirectDamage = false;    
      shieldUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.3, false, true, true));
      enemy.abilityList.push(shieldUp);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 16;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.4;         
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.TwistedSoul)
    {
      enemy.name = "Twisted Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .02));

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 8;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;      
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);
    }
    if (type === BestiaryEnum.BlessedShade)
    {
      enemy.name = "Blessed Shade";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.ExiledHoplite)
    {
      enemy.name = "Exiled Hoplite";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .1;
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 2, .025));
      enemy.loot.push(new LootItem(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1, .15));
      
      var focus = new Ability();
      focus.name = "Focus";
      focus.isAvailable = true;
      focus.cooldown = focus.currentCooldown = 20;
      focus = this.randomizeCooldown(focus);
      focus.dealsDirectDamage = false;      
      focus.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Taunt, 12, 1, false, false));
      enemy.abilityList.push(focus);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 16;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.6;         
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.Ixion)
    {
      //son of ares, maybe ramps damage or something
      enemy.name = "Ixion";
      enemy.battleStats = new CharacterStats(1000, 100, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .2;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var pathOfFlames = new Ability();
      pathOfFlames.name = "Path of Flames";
      pathOfFlames.isAvailable = true;
      pathOfFlames.effectiveness = 1.5;
      pathOfFlames.isAoe = true;
      pathOfFlames.cooldown = pathOfFlames.currentCooldown = 18;
      pathOfFlames = this.randomizeCooldown(pathOfFlames);
      pathOfFlames.dealsDirectDamage = true;
      pathOfFlames.elementalType = ElementalTypeEnum.Fire;
      pathOfFlames.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .25, pathOfFlames.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Fire));
      enemy.abilityList.push(pathOfFlames);

      var speedUp = new Ability();
      speedUp.name = "Speed Up";
      speedUp.isAvailable = true;
      speedUp.cooldown = speedUp.currentCooldown = 8;
      speedUp = this.randomizeCooldown(speedUp);
      speedUp.dealsDirectDamage = false;
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.1, false, true, false, undefined, undefined, true));
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.1, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(speedUp);
      
      var flamesOfTartarus = new Ability();
      flamesOfTartarus.name = "Flames of Tartarus";
      flamesOfTartarus.isAvailable = true;
      flamesOfTartarus.effectiveness = 3.8;
      flamesOfTartarus.cooldown = flamesOfTartarus.currentCooldown = 1000;
      flamesOfTartarus.dealsDirectDamage = true;
      flamesOfTartarus.elementalType = ElementalTypeEnum.Fire;      
      enemy.abilityList.push(flamesOfTartarus);
    }
    //these two are barrier based, can continously create barriers
    if (type === BestiaryEnum.Castor)
    {
      enemy.name = "Castor";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var geminiStrike = new Ability();
      geminiStrike.name = "Gemini Strike";
      geminiStrike.isAvailable = true;
      geminiStrike.cooldown = geminiStrike.currentCooldown = 22;
      geminiStrike = this.randomizeCooldown(geminiStrike);
      geminiStrike.dealsDirectDamage = true;
      geminiStrike.effectiveness = 1.3;         
      enemy.abilityList.push(geminiStrike);
            
      var ride = new Ability();
      ride.name = "Ride Down";
      ride.isAvailable = true;
      ride.cooldown = ride.currentCooldown = 11;
      ride = this.randomizeCooldown(ride);
      ride.dealsDirectDamage = false;
      ride.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.35, false, true, true));
      enemy.abilityList.push(ride);
    }
    if (type === BestiaryEnum.Pollux)
    {
      enemy.name = "Pollux";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var divinity = new Ability();
      divinity.name = "Divinity";
      divinity.isAvailable = true;
      divinity.cooldown = divinity.currentCooldown = 17;
      divinity = this.randomizeCooldown(divinity);
      divinity.dealsDirectDamage = false;      
      divinity.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, 1, true, true, true, enemy.name, .5));
      enemy.abilityList.push(divinity);
      
      var firePower = new Ability();
      firePower.name = "Fire Power";
      firePower.isAvailable = true;
      firePower.cooldown = firePower.currentCooldown = 14;
      firePower = this.randomizeCooldown(firePower);
      firePower.dealsDirectDamage = false;
      firePower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 6, 1.15, false, true, true));
      enemy.abilityList.push(firePower);
    }

    //probably a better way to do this... these reductions are multiplicative but enemies don't get stats calc'd so otherwise
    //it gets multiplied by 0
    enemy.battleStats.abilityCooldownReduction = 1;
    enemy.battleStats.autoAttackCooldownReduction = 1;
    enemy.battleInfo.autoAttackTimer = this.utilityService.getRandomInteger(0, enemy.battleInfo.timeToAutoAttack / 2);     
    return enemy;
  }

  randomizeCooldown(ability: Ability) {
    ability.currentCooldown = this.utilityService.getRandomInteger(Math.round(ability.cooldown / 2), ability.cooldown);    
    return ability;
  }
}
