import { Injectable } from '@angular/core';
import { AlchemyActionsEnum } from 'src/app/models/enums/alchemy-actions-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { AlchemyUpgrades } from 'src/app/models/professions/alchemy-upgrades.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AlchemyService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService) { }

  handleAlchemyTimer(deltaTime: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined || alchemy.alchemyStep === 0)
      return;

    alchemy.alchemyTimer += deltaTime;

    if (alchemy.alchemyTimer >= alchemy.alchemyTimerLength) {
      alchemy.alchemyStep += 1;
      alchemy.alchemyTimer -= alchemy.alchemyTimerLength;

      if (alchemy.alchemyStep <= alchemy.creatingRecipe.numberOfSteps) {
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[alchemy.alchemyStep - 1]) * this.getDurationReduction(alchemy.creatingRecipe.quality);
      }
      else {
        //create item
        this.createItem();
      }
    }
  }

  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AsphodelPalaceOfHades) {
      if (!this.globalService.globalVar.alchemy.isUnlocked) {
        this.globalService.globalVar.alchemy.isUnlocked = true;
        this.globalService.globalVar.alchemy.level = 1;
        this.globalService.globalVar.alchemy.maxLevel = this.utilityService.firstAlchemyLevelCap;
      }
    }
  }

  getActionLength(action: AlchemyActionsEnum) {
    var duration = 0;

    if (action === AlchemyActionsEnum.PrepareWaterSmallPot)
      duration = 1 * 20;
    if (action === AlchemyActionsEnum.CombineIngredientsPot)
      duration = 1 * 10;
    if (action === AlchemyActionsEnum.CombineIngredientsPotion)
      duration = 1 * 15;
    if (action === AlchemyActionsEnum.HeatMixture)
      duration = 1 * 30;
    if (action === AlchemyActionsEnum.CrushIngredients)
      duration = 1 * 75;
    if (action === AlchemyActionsEnum.CombineIngredients)
      duration = 1 * 15;
    if (action === AlchemyActionsEnum.MixOil)
      duration = 1 * 10;
    if (action === AlchemyActionsEnum.MeltWax)
      duration = 1 * 20;
    if (action === AlchemyActionsEnum.StrainMixture)
      duration = 1 * 10;

    return duration;
  }

  createItem() {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined)
      return;

    var gainAmount = alchemy.creatingRecipe.createdAmount;
    var rng = this.utilityService.getRandomNumber(0, 1);    
    if (rng < this.get5xItemChance(alchemy.creatingRecipe.quality)) {
      var gameLogEntry = "<strong>Bonus: 5X Items Created!</strong>";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      gainAmount *= 5;
    }
    else {
      var rng2 = this.utilityService.getRandomNumber(0, 1);
      if (rng2 < this.get2xItemChance(alchemy.creatingRecipe.quality)) {
        var gameLogEntry = "<strong>Bonus: 2X Items Created!</strong>";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
        gainAmount *= 2;
      }
    }

    this.lookupService.gainResource(new ResourceValue(alchemy.creatingRecipe.createdItem, alchemy.creatingRecipe.createdItemType,
      gainAmount));

    alchemy.alchemyStep = 0;

    if (alchemy.level < alchemy.maxLevel)
      alchemy.exp += alchemy.creatingRecipe.expGain;

    if (alchemy.exp >= alchemy.expToNextLevel) {
      alchemy.level += 1;
      alchemy.exp -= alchemy.expToNextLevel;
      alchemy.expToNextLevel = this.getExpToNextLevel(alchemy.level);

      if (alchemy.level === alchemy.maxLevel)
        alchemy.exp = 0;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "Your <strong>Alchemy</strong> level increases to <strong>" + alchemy.level + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }

      var newRecipeLearned = this.checkForNewRecipes();

      if (!newRecipeLearned) {
        this.getLevelUpReward();
      }
    }

    if (this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
      var gameLogEntry = "You create <strong>" + gainAmount + " " + this.lookupService.getItemName(alchemy.creatingRecipe.createdItem) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
    }

    alchemy.alchemyCurrentAmountCreated += 1;

    if (alchemy.alchemyCurrentAmountCreated >= alchemy.alchemyCreateAmount) {
      alchemy.alchemyCurrentAmountCreated = 0;
      alchemy.creatingRecipe = undefined;
      alchemy.alchemyTimer = 0;
      alchemy.alchemyTimerLength = 0;
    }
    else {
      if (this.canCreateItem(alchemy.creatingRecipe)) {
        alchemy.alchemyStep = 1;
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[0]) * this.getDurationReduction(alchemy.creatingRecipe.quality);

        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng >= this.getMaterialRetentionChance(alchemy.creatingRecipe.quality)) {
          this.spendResourcesOnRecipe(alchemy.creatingRecipe);
        }
        else
        {
          var gameLogEntry = "<strong>Bonus: No Materials Used!</strong>";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
        }
      }
      else {
        if (this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
          var gameLogEntry = "You no longer have enough resources and stop creating <strong>" + this.lookupService.getItemName(alchemy.creatingRecipe.createdItem) + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);

          alchemy.alchemyCurrentAmountCreated = 0;
          alchemy.creatingRecipe = undefined;
        }
      }
    }
  }

  initializeCreation(recipe: Recipe, createAmount: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    alchemy.alchemyTimer = 0;
    alchemy.alchemyCurrentAmountCreated = 0;
    alchemy.alchemyStep = 1;
    alchemy.creatingRecipe = recipe;
    alchemy.alchemyCreateAmount = createAmount;
    if (recipe.steps.length > 0)
      alchemy.alchemyTimerLength = this.getActionLength(recipe.steps[0]) * this.getDurationReduction(alchemy.creatingRecipe.quality);
  }

  learnRecipe(item: ItemsEnum) {
    if (!this.globalService.globalVar.alchemy.availableRecipes.some(recipe => recipe.createdItem === item)) {
      this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(item));
    }
  }

  checkForNewRecipes() {
    var newRecipeLearned = false;

    if (this.globalService.globalVar.alchemy.level >= 1) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingPoultice)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingPoultice));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 2) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.ExplodingPotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.ExplodingPotion));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 4) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.DebilitatingToxin)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.DebilitatingToxin));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 7) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingSalve)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingSalve));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 10) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.FirePotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.FirePotion));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 15) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.PoisonousToxin)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.PoisonousToxin));
        newRecipeLearned = true;
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 20) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.StranglingGasPotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.StranglingGasPotion));
        newRecipeLearned = true;
      }
    }

    return newRecipeLearned;
  }

  getLevelUpReward() {
    var upgrades: AlchemyUpgrades | undefined = undefined;
    var additionalChanceTo2x = .05;
    var additionalChanceTo5x = .025;
    var additionalChanceToRetainMaterials = .05;
    var additionalDurationReduction = .04;

    if (this.globalService.globalVar.alchemy.level <= 25)
      upgrades = this.globalService.globalVar.alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);

    if (upgrades === undefined)
      return;

    if (this.globalService.globalVar.alchemy.level === 3 || this.globalService.globalVar.alchemy.level === 6 ||
      this.globalService.globalVar.alchemy.level === 11 || this.globalService.globalVar.alchemy.level === 14 ||
      this.globalService.globalVar.alchemy.level === 16 || this.globalService.globalVar.alchemy.level === 23)
      upgrades.chanceTo2xItem += additionalChanceTo2x;

    if (this.globalService.globalVar.alchemy.level === 5 || this.globalService.globalVar.alchemy.level === 8 ||
      this.globalService.globalVar.alchemy.level === 13 || this.globalService.globalVar.alchemy.level === 19 ||
      this.globalService.globalVar.alchemy.level === 21)
      upgrades.durationReduction += additionalDurationReduction;

    if (this.globalService.globalVar.alchemy.level === 9 || this.globalService.globalVar.alchemy.level === 12 ||
      this.globalService.globalVar.alchemy.level === 17 || this.globalService.globalVar.alchemy.level === 22 ||
      this.globalService.globalVar.alchemy.level === 24)
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

    if (this.globalService.globalVar.alchemy.level === 18 || this.globalService.globalVar.alchemy.level === 25)
      upgrades.chanceTo5xItem += additionalChanceTo5x;

  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.HealingPoultice) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPot);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.ExplodingPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 5;
    }

    if (item === ItemsEnum.DebilitatingToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(AlchemyActionsEnum.CrushIngredients);

      recipe.expGain = 8;
    }

    if (item === ItemsEnum.HealingSalve) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 4;
      recipe.steps.push(AlchemyActionsEnum.MixOil);
      recipe.steps.push(AlchemyActionsEnum.StrainMixture);
      recipe.steps.push(AlchemyActionsEnum.MeltWax);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPot);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.FirePotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.PoisonousToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(AlchemyActionsEnum.CrushIngredients);

      recipe.expGain = 12;
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 12;
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 15;
    }
    if (item === ItemsEnum.HeroicElixir) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 15;
    }

    return recipe;
  }

  canCreateItem(recipe: Recipe) {
    var canBuy = true;

    recipe.ingredients.forEach(resource => {
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      if (userResourceAmount < resource.amount)
        canBuy = false;
    });

    return canBuy;
  }

  spendResourcesOnRecipe(recipe: Recipe) {
    recipe.ingredients.forEach(resource => {
      this.lookupService.useResource(resource.item, resource.amount);
    });
  }

  getAmountCanCreate(recipe: Recipe) {
    var creationAmount = -1;

    //you're never actually setting it to a value higher than 0
    recipe.ingredients.forEach(resource => {
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      var totalCreationAmount = Math.floor(userResourceAmount / resource.amount);
      if (creationAmount === -1 || totalCreationAmount < creationAmount)
        creationAmount = totalCreationAmount;
    });

    if (creationAmount === -1)
      creationAmount = 0;

    return creationAmount;
  }

  getDurationReduction(quality: EquipmentQualityEnum) {
    var upgrades = this.globalService.globalVar.alchemy.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 1;

    return 1 - upgrades.durationReduction;
  }

  get2xItemChance(quality: EquipmentQualityEnum) {
    var upgrades = this.globalService.globalVar.alchemy.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceTo2xItem;
  }

  get5xItemChance(quality: EquipmentQualityEnum) {
    var upgrades = this.globalService.globalVar.alchemy.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceTo5xItem;
  }

  getMaterialRetentionChance(quality: EquipmentQualityEnum) {
    var upgrades = this.globalService.globalVar.alchemy.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceToRetainMaterials;
  }

  getExpToNextLevel(level: number) {
    var baseAmount = 20;
    var multiplier = 30;

    return baseAmount + (multiplier * (level-1));
  }
}
