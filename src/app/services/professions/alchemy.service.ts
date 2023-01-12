import { Injectable } from '@angular/core';
import { AlchemyActionsEnum } from 'src/app/models/enums/alchemy-actions-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class AlchemyService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService) { }

  handleAlchemyTimer(deltaTime: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined || alchemy.alchemyStep === 0)
      return;

    alchemy.alchemyTimer += deltaTime;

    if (alchemy.alchemyTimer >= alchemy.alchemyTimerLength) {
      alchemy.alchemyStep += 1;
      alchemy.alchemyTimer -= alchemy.alchemyTimerLength;

      if (alchemy.alchemyStep <= alchemy.creatingRecipe.numberOfSteps) {
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[alchemy.alchemyStep - 1]);
      }
      else {
        //create item
        this.createItem();
      }
    }
  }

  getActionLength(action: AlchemyActionsEnum) {
    var duration = 0;

    if (action === AlchemyActionsEnum.PrepareWaterSmallPot)
      duration = 10;//2 * 60;
    if (action === AlchemyActionsEnum.CombineIngredients)
      duration = 10;//1 * 60;

    return duration;
  }

  createItem() {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined)
      return;

    this.lookupService.gainResource(new ResourceValue(alchemy.creatingRecipe.createdItem, alchemy.creatingRecipe.createdItemType,
      alchemy.creatingRecipe.createdAmount));

    alchemy.alchemyStep = 0;
    alchemy.alchemyTimer = 0;
    alchemy.alchemyTimerLength = 0;
    alchemy.exp += alchemy.creatingRecipe.expGain;    

    if (alchemy.exp >= alchemy.expToNextLevel) {
      alchemy.level += 1;
      alchemy.exp -= alchemy.expToNextLevel;
      this.checkForNewRecipes();
    }
    
    var gameLogEntry = "You create <strong>" + this.lookupService.getItemName(alchemy.creatingRecipe.createdItem) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);

    alchemy.alchemyCurrentAmountCreated += 1;      

    if (alchemy.alchemyCurrentAmountCreated >= alchemy.alchemyCreateAmount)
    {
      alchemy.alchemyCurrentAmountCreated = 0;
      alchemy.creatingRecipe = undefined;
    }
    else
    {
      if (this.canCreateItem(alchemy.creatingRecipe))
      {
        alchemy.alchemyStep = 1;
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[0]);
        this.spendResourcesOnRecipe(alchemy.creatingRecipe);              
      }
      else
      {
        //message in gamelog about not having enough resources
      }
    }
  }

  initializeCreation(recipe: Recipe, createAmount: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    alchemy.alchemyStep = 1;
    alchemy.creatingRecipe = recipe;
    alchemy.alchemyCreateAmount = createAmount;
    if (recipe.steps.length > 0)
      alchemy.alchemyTimerLength = this.getActionLength(recipe.steps[0]);
  }

  checkForNewRecipes() {
    if (this.globalService.globalVar.alchemy.level >= 1) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingPoultice)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingPoultice));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 2) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.ExplodingVial)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.ExplodingVial));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 4) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.DebilitatingToxin)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.DebilitatingToxin));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 7) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingSalve)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingSalve));
      }
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.HealingPoultice) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredients);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.PoisonousToxin) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));

      recipe.steps.push(AlchemyActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredients);
      recipe.steps.push(AlchemyActionsEnum.StrainMixture);
    }
    if (item === ItemsEnum.HealingSalve) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));
    }
    if (item === ItemsEnum.DebilitatingToxin) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));
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

  spendResourcesOnRecipe(recipe: Recipe)
  {
    recipe.ingredients.forEach(resource => {
      this.lookupService.useResource(resource.item, resource.amount);
    });
  }
}
