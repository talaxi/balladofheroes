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
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private lookupService: LookupService) { }

  generateEnemy(type: BestiaryEnum)
  {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;

    if (type === BestiaryEnum.WaterSerpent)
    {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(10, 12, 4, 5, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 22000;
      enemy.coinGainFromDefeat = 0;
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(14, 10, 7, 3, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 31;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .15));
    }
    if (type === BestiaryEnum.FrenziedGull)
    {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(16, 15, 3, 6, 5, 5); 
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
      enemy.battleStats = new CharacterStats(17, 12, 4, 10, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 35; 
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .08));
    }
    if (type === BestiaryEnum.WildBoar)
    {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 10, 10, 5, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;      
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .1));
    }
    if (type === BestiaryEnum.KillerBees)
    {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(12, 18, 4, 15, 25, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 20; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2, .01));
    }
    if (type === BestiaryEnum.Patriarch)
    {
      enemy.name = "Patriarch";
      enemy.battleStats = new CharacterStats(125, 24, 8, 8, 5, 40); 
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
      slash.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .9, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .2));
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .04));
    }
    if (type === BestiaryEnum.Bandit)
    {
      enemy.name = "Bandit";
      enemy.battleStats = new CharacterStats(35, 20, 6, 7, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Thief)
    {
      enemy.name = "Thief";
      enemy.battleStats = new CharacterStats(28, 17, 5, 35, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 3;      
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.Highwayman)
    {
      enemy.name = "Highwayman";
      enemy.battleStats = new CharacterStats(60, 18, 10, 10, 10, 20); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, 1, .01));
    }
    if (type === BestiaryEnum.Coyote)
    {
      enemy.name = "Coyote";
      enemy.battleStats = new CharacterStats(27, 19, 8, 25, 25, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 42; 
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .15));
      //chance to drop light leather
    }
    if (type === BestiaryEnum.Archer)
    {
      enemy.name = "Archer";
      enemy.battleStats = new CharacterStats(220, 29, 10, 10, 25, 60); 
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
      sureShot.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, sureShot.name));
      enemy.abilityList.push(sureShot);
    }
    if (type === BestiaryEnum.RedHarpy)
    {
      enemy.name = "Red-Feathered Harpy";
      enemy.battleStats = new CharacterStats(72, 23, 15, 25, 10, 10); 
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
      claw.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

    }
    if (type === BestiaryEnum.BlueHarpy)
    {
      enemy.name = "Blue-Feathered Harpy";
      enemy.battleStats = new CharacterStats(75, 30, 19, 20, 10, 10); 
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
      enrage.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 5, 1.25, false, true));
      enemy.abilityList.push(enrage);
    }
    if (type === BestiaryEnum.GreenHarpy)
    {
      enemy.name = "Green-Feathered Harpy";
      enemy.battleStats = new CharacterStats(68, 26, 13, 20, 20, 10); 
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
      enemy.battleStats = new CharacterStats(50, 20, 10, 75, 20, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 50; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .05));      
    }
    if (type === BestiaryEnum.Lamia)
    {
      enemy.name = "Lamia";
      enemy.battleStats = new CharacterStats(85, 32, 25, 25, 30, 30); 
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
      empower.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);
    }
    if (type === BestiaryEnum.Sybaris)
    {
      enemy.name = "Sybaris";
      enemy.battleStats = new CharacterStats(700, 41, 37, 23, 20, 75); 
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
      bite.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(20, 4, .2, bite.name));
      enemy.abilityList.push(bite);

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 14;
      empower.dealsDirectDamage = false;
      empower = this.randomizeCooldown(empower);
      empower.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);

      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 3, .08));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 2, .05));
      //chance to drop Poison Fang (battle item)
    }
    if (type === BestiaryEnum.LargeOctopus)
    {
      enemy.name = "Large Octopus";
      enemy.battleStats = new CharacterStats(100, 28, 20, 30, 30, 30); 
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
      constrict.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .75, false, false));      
      enemy.abilityList.push(constrict);
    }
    if (type === BestiaryEnum.UnsettlingShade)
    {
      enemy.name = "Unsettling Shade";
      enemy.battleStats = new CharacterStats(150, 60, 40, 60, 40, 20); 
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
      ethereal.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 0, false, true));      
      enemy.abilityList.push(ethereal);
    }
    if (type === BestiaryEnum.Gorgon)
    {
      enemy.name = "Gorgon";
      enemy.battleStats = new CharacterStats(120, 45, 40, 50, 35, 35); 
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
      gaze.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 8, 0, false, false));      
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Stheno)
    {
      enemy.name = "Stheno";
      enemy.battleStats = new CharacterStats(800, 75, 50, 100, 25, 100); 
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
      gaze.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 8, 0, false, false));      
      enemy.abilityList.push(gaze);

      var bite = new Ability();
      bite.name = "Snake Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.4;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .3, bite.name));
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.Euryale)
    {
      enemy.name = "Euryale";
      enemy.battleStats = new CharacterStats(700, 62, 60, 40, 100, 110); 
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
      gaze.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));      
      enemy.abilityList.push(gaze);

      var feint = new Ability();
      feint.name = "Feint";
      feint.isAvailable = true;
      feint.dealsDirectDamage = false;
      feint.cooldown = feint.currentCooldown = 15;
      feint = this.randomizeCooldown(feint);
      feint.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 7, .75, false, false)); 
      enemy.abilityList.push(feint);
    }
    if (type === BestiaryEnum.Medusa)
    {
      //TODO: large XP boost on completing the first time
      enemy.name = "Medusa";
      enemy.battleStats = new CharacterStats(2000, 115, 83, 115, 67, 175); 
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
      gaze.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));      
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
      swipe.dealsDirectDamage = false;
      swipe.effectiveness = 1.4;    
      enemy.abilityList.push(swipe);
    }
    if (type === BestiaryEnum.EnceladusOne)
    {      
      enemy.name = "Enceladus";
      enemy.battleStats = new CharacterStats(250000, 415, 383, 60, 600, 1000); 
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
      smash.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(15, 5, .8, smash.name));
      enemy.abilityList.push(smash);

      var wallop = new Ability();
      wallop.name = "Wallop";
      wallop.isAvailable = true;
      wallop.cooldown = wallop.currentCooldown = 15;
      wallop = this.randomizeCooldown(wallop);
      wallop.dealsDirectDamage = true;
      wallop.effectiveness = 1.5;
      wallop.targetGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .4, false, false));      
      enemy.abilityList.push(wallop);
    }
    if (type === BestiaryEnum.LostSoul)
    {
      //somewhat easy to rebound from resetting gods
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.Wretched)
    {
      enemy.name = "Wretched";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.IncoherentBanshee)
    {
      enemy.name = "Inchoerent Banshee";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.EngorgedShade)
    {
      enemy.name = "Engorged Shade";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.CacklingSpectre)
    {
      enemy.name = "Cackling Spectre";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.FloatingFlame)
    {
      enemy.name = "Floating Flame";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.Butcher)
    {
      enemy.name = "Butcher";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.WheelOfFire)
    {
      enemy.name = "Wheel of Fire";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.Empusa)
    {
      enemy.name = "Empusa";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.InsaneSoul)
    {
      enemy.name = "Insane Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.DualWieldingButcher)
    {
      enemy.name = "Dual-Wielding Butcher";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.LostSoul)
    {
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.HellRider)
    {
      enemy.name = "Hell Rider";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.FierySalamander)
    {
      enemy.name = "Fiery Salamander";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }

    enemy.battleInfo.autoAttackTimer = this.utilityService.getRandomInteger(0, this.lookupService.getAutoAttackTime(enemy) / 2);     
    return enemy;
  }

  randomizeCooldown(ability: Ability) {
    ability.currentCooldown = this.utilityService.getRandomInteger(Math.round(ability.cooldown / 2), ability.cooldown);    
    return ability;
  }
}
