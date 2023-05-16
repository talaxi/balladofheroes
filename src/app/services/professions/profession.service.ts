import { Injectable } from '@angular/core';
import { ProfessionActionsEnum } from 'src/app/models/enums/profession-actions-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';
import { AlchemyService } from './alchemy.service';
import { JewelcraftingService } from './jewelcrafting.service';
import { DictionaryService } from '../utility/dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService, private alchemyService: AlchemyService, private jewelcraftingService: JewelcraftingService,
    private dictionaryService: DictionaryService) { }

  handleProfessionTimer(type: ProfessionEnum, deltaTime: number) {
    var profession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (profession === undefined || profession.creatingRecipe === undefined || profession.creationStep === 0)
      return;

    profession.creationTimer += deltaTime;
    if (profession.creationTimer >= profession.creationTimerLength) {
      profession.creationStep += 1;
      profession.creationTimer -= profession.creationTimerLength;

      if (profession.creationStep <= profession.creatingRecipe.numberOfSteps) {
        profession.creationTimerLength = this.getActionLength(profession.type, profession.creatingRecipe.steps[profession.creationStep - 1]) * this.getDurationReduction(type, profession.creatingRecipe.quality);

        if (profession.isDurationHalved)
          profession.creationTimerLength /= 2;
      }
      else {
        //create item
        this.createItem(type);
      }
    }
  }

  createItem(type: ProfessionEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined || selectedProfession.creatingRecipe === undefined)
      return;

    var gainAmount = selectedProfession.creatingRecipe.createdAmount;
    var createdItem = selectedProfession.creatingRecipe.createdItem;

    var rng = this.utilityService.getRandomNumber(0, 1);
    if (rng < this.get5xItemChance(type, selectedProfession.creatingRecipe.quality)) {
      var gameLogEntry = "<strong>Bonus: 5X Items Created!</strong>";
      if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
      if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
      gainAmount *= 5;
    }
    else {
      var rng2 = this.utilityService.getRandomNumber(0, 1);
      if (rng2 < this.get2xItemChance(type, selectedProfession.creatingRecipe.quality)) {
        var gameLogEntry = "<strong>Bonus: 2X Items Created!</strong>";
        if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
        }
        if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
        }
        gainAmount *= 2;
      }
    }

    var rng = this.utilityService.getRandomNumber(0, 1);
    if (rng < this.getUpgradeChance(type, selectedProfession.creatingRecipe.quality)) {
      var gameLogEntry = "<strong>Bonus: " + this.dictionaryService.getItemName(selectedProfession.creatingRecipe.createdItem) + " Upgraded!</strong>";
      if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
      if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);

        createdItem = this.jewelcraftingService.getUpgradedItem(createdItem);
      }
    }

    this.lookupService.gainResource(new ResourceValue(createdItem, gainAmount));

    selectedProfession.creationStep = 0;

    if (selectedProfession.level < selectedProfession.maxLevel)
      selectedProfession.exp += selectedProfession.creatingRecipe.expGain;

    if (selectedProfession.exp >= selectedProfession.expToNextLevel) {
      selectedProfession.level += 1;
      selectedProfession.exp -= selectedProfession.expToNextLevel;
      selectedProfession.expToNextLevel = this.getExpToNextLevel(selectedProfession.level);

      if (selectedProfession.level === selectedProfession.maxLevel)
        selectedProfession.exp = 0;

      if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "Your <strong>Alchemy</strong> level increases to <strong>" + selectedProfession.level + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
      if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "Your <strong>Jewelcrafting</strong> level increases to <strong>" + selectedProfession.level + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }

      var newRecipeLearned = this.checkForNewRecipes(type);

      if (!newRecipeLearned) {
        this.getLevelUpReward(type);
      }
    }

    if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
      var gameLogEntry = "You create <strong>" + gainAmount + " " + this.dictionaryService.getItemName(createdItem) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
    }

    if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
      var gameLogEntry = "You create <strong>" + gainAmount + " " + this.dictionaryService.getItemName(createdItem) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
    }

    selectedProfession.creationCurrentAmountCreated += 1;

    if (selectedProfession.creationCurrentAmountCreated >= selectedProfession.creationCreateAmount) {
      if (selectedProfession.creationCurrentAmountCreated > 1) {
        if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyQueueEmpty")) {
          var gameLogEntry = "You finish crafting <strong>" + selectedProfession.creationCurrentAmountCreated + " " + this.dictionaryService.getItemName(selectedProfession.creatingRecipe.createdItem) + "</strong> and stop crafting.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
        }

        if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingQueueEmpty")) {
          var gameLogEntry = "You finish crafting <strong>" + selectedProfession.creationCurrentAmountCreated + " " + this.dictionaryService.getItemName(selectedProfession.creatingRecipe.createdItem) + "</strong> and stop crafting.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
        }
      }

      selectedProfession.creationCurrentAmountCreated = 0;
      selectedProfession.creatingRecipe = undefined;
      selectedProfession.creationTimer = 0;
      selectedProfession.creationTimerLength = 0;
      selectedProfession.isDurationHalved = false;
    }
    else {
      if (this.canCreateItem(selectedProfession.creatingRecipe)) {
        selectedProfession.creationStep = 1;
        selectedProfession.creationTimerLength = this.getActionLength(type, selectedProfession.creatingRecipe.steps[0]) * this.getDurationReduction(type, selectedProfession.creatingRecipe.quality);

        var durationRng = this.utilityService.getRandomNumber(0, 1);
        if (durationRng < this.getHalfDurationChance(type, selectedProfession.creatingRecipe.quality)) {
          var gameLogEntry = "<strong>Bonus: Half Duration!</strong>";
          if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
          }
          if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
          }
          selectedProfession.isDurationHalved = true;
          selectedProfession.creationTimerLength /= 2;
        }


        var rng = this.utilityService.getRandomNumber(0, 1);
        if (rng >= this.getMaterialRetentionChance(type, selectedProfession.creatingRecipe.quality)) {
          this.spendResourcesOnRecipe(selectedProfession.creatingRecipe);
        }
        else {
          var gameLogEntry = "<strong>Bonus: No Materials Used!</strong>";
          if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
          }
          if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
          }
        }
      }
      else {
        var gameLogEntry = "You no longer have enough resources and stop creating <strong>" + this.dictionaryService.getItemName(selectedProfession.creatingRecipe.createdItem) + "</strong>.";
        if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
        }
        if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
        }

        selectedProfession.creationCurrentAmountCreated = 0;
        selectedProfession.creatingRecipe = undefined;
        selectedProfession.isDurationHalved = false;
      }
    }
  }

  initializeCreation(type: ProfessionEnum, recipe: Recipe, createAmount: number) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return;

    selectedProfession.creationTimer = 0;
    selectedProfession.creationCurrentAmountCreated = 0;
    selectedProfession.creationStep = 1;
    selectedProfession.creatingRecipe = recipe;
    selectedProfession.creationCreateAmount = createAmount;
    selectedProfession.isDurationHalved = false;

    var durationRng = this.utilityService.getRandomNumber(0, 1);
    if (durationRng < this.getHalfDurationChance(type, selectedProfession.creatingRecipe.quality)) {
      var gameLogEntry = "<strong>Bonus: Half Duration!</strong>";
      if (selectedProfession.type === ProfessionEnum.Alchemy && this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
      if (selectedProfession.type === ProfessionEnum.Jewelcrafting && this.globalService.globalVar.gameLogSettings.get("jewelcraftingCreation")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
      selectedProfession.isDurationHalved = true;
    }

    if (recipe.steps.length > 0) {
      selectedProfession.creationTimerLength = this.getActionLength(type, recipe.steps[0]) * this.getDurationReduction(type, selectedProfession.creatingRecipe.quality);

      if (selectedProfession.isDurationHalved)
        selectedProfession.creationTimerLength /= 2;
    }
  }

  learnRecipe(type: ProfessionEnum, item: ItemsEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return;

    if (!selectedProfession.availableRecipes.some(recipe => recipe.createdItem === item)) {
      selectedProfession.availableRecipes.push(this.getRecipe(type, item));
    }
  }

  getDurationReduction(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 1;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 1;

    return 1 - upgrades.durationReduction;
  }

  get2xItemChance(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 0;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceTo2xItem;
  }

  get5xItemChance(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 0;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceTo5xItem;
  }

  getMaterialRetentionChance(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 0;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceToRetainMaterials;
  }

  getUpgradeChance(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 0;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceForUpgrade;
  }

  getHalfDurationChance(type: ProfessionEnum, quality: EquipmentQualityEnum) {
    var selectedProfession = this.globalService.globalVar.professions.find(item => item.type === type);
    if (selectedProfession === undefined)
      return 0;

    var upgrades = selectedProfession.upgrades.find(item => item.quality === quality);
    if (upgrades === undefined)
      return 0;

    return upgrades.chanceToHalfDuration;
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

  getExpToNextLevel(level: number) {    
    var baseAmount = 20;
    var multiplier = 25;

    return baseAmount + (multiplier * (level - 1));
  }

  checkForNewRecipes(type: ProfessionEnum) {
    if (type === ProfessionEnum.Alchemy) {
      return this.alchemyService.checkForNewRecipes();
    }
    if (type === ProfessionEnum.Jewelcrafting) {
      return this.jewelcraftingService.checkForNewRecipes();
    }

    return false;
  }

  getLevelUpReward(type: ProfessionEnum) {
    if (type === ProfessionEnum.Alchemy) {
      return this.alchemyService.getLevelUpReward();
    }
    if (type === ProfessionEnum.Jewelcrafting) {
      return this.jewelcraftingService.getLevelUpReward();
    }

    return false;
  }

  getRecipe(type: ProfessionEnum, item: ItemsEnum) {
    if (type === ProfessionEnum.Alchemy) {
      return this.alchemyService.getRecipe(item);
    }
    if (type === ProfessionEnum.Jewelcrafting) {
      return this.jewelcraftingService.getRecipe(item);
    }

    return new Recipe();
  }

  getActionLength(type: ProfessionEnum, actionEnum: ProfessionActionsEnum) {
    if (type === ProfessionEnum.Alchemy)
      return this.alchemyService.getActionLength(actionEnum);
    if (type === ProfessionEnum.Jewelcrafting)
      return this.jewelcraftingService.getActionLength(actionEnum);

    return ProfessionActionsEnum.None;
  }
}
