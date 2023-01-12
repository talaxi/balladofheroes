import { Component, OnInit } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-alchemy-view',
  templateUrl: './alchemy-view.component.html',
  styleUrls: ['./alchemy-view.component.css']
})
export class AlchemyViewComponent implements OnInit {
  selectedRecipe: Recipe;
  createAmount = 1;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService,
    private alchemyService: AlchemyService) { }

  ngOnInit(): void {
  }

  selectRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }

  getLevel() {
    return this.globalService.globalVar.alchemy.level;
  }

  getExp() {
    return this.globalService.globalVar.alchemy.exp;
  }

  getExpToNextLevel() {
    return this.globalService.globalVar.alchemy.expToNextLevel;
  }

  getCraftedItemName(recipe: Recipe) {
    return this.lookupService.getItemName(recipe.createdItem);
  }

  getRecipeList() {
    return this.globalService.globalVar.alchemy.availableRecipes;
  }

  getSelectedRecipeName() {
    if (this.selectedRecipe !== undefined)
      return this.lookupService.getItemName(this.selectedRecipe.createdItem);

    return "";
  }

  getCreatingRecipeName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe !== undefined)
      return this.lookupService.getItemName(this.globalService.globalVar.alchemy.creatingRecipe.createdItem);

    return "";
  }

  listSelectedRecipeIngredients() {
    var ingredients = "";

    if (this.selectedRecipe === undefined)
      return "";

      this.selectedRecipe.ingredients.forEach(resource => {
        var displayName = this.lookupService.getItemName(resource.item);
        var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
        var insufficientText = "";
        if (userResourceAmount < resource.amount)
          insufficientText = " (" + userResourceAmount + " owned)";  
  
        ingredients += "<span class='" + this.getItemKeywordClass(resource.type, resource.item, resource.amount, userResourceAmount) + "'>" +(resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";      
      });
  
      if (ingredients.length > 0) {
        ingredients = this.utilityService.getSanitizedHtml(ingredients);
      }   

      return ingredients;
  }

  getItemKeywordClass(type: ItemTypeEnum, item: ItemsEnum, amountNeeded: number, amountOwned: number) {
    var classText = "resourceKeyword";
    
    if (amountOwned < amountNeeded)
      classText = "insufficientResourcesKeyword";  

    return classText;
  }

  creatingRecipe() {
    return this.globalService.globalVar.alchemy.creatingRecipe !== undefined;
  }

  getStepProgress() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return 0;
    var totalLength = 0;
    var passedTime = 0;

    for (var i = 0; i < this.globalService.globalVar.alchemy.creatingRecipe.steps.length; i++) 
    {
      var actionLength = this.alchemyService.getActionLength(this.globalService.globalVar.alchemy.creatingRecipe.steps[i]);
      totalLength += actionLength;

      if (this.globalService.globalVar.alchemy.alchemyStep > i + 1)
      {
        passedTime += actionLength;
      }
    }

    passedTime += this.globalService.globalVar.alchemy.alchemyTimer;
    return (passedTime / totalLength) * 100;
    //return (this.globalService.globalVar.alchemy.alchemyTimer / this.globalService.globalVar.alchemy.alchemyTimerLength) * 100;
  }

  getRecipeStepName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";
    return this.lookupService.getAlchemyActionName(this.globalService.globalVar.alchemy.creatingRecipe.steps[this.globalService.globalVar.alchemy.alchemyStep-1]);
  }

  getSelectedRecipeDescription() {
    return this.lookupService.getItemDescription(this.selectedRecipe.createdItem);
  }

  getTimeRemaining() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.globalService.globalVar.alchemy.alchemyTimerLength - this.globalService.globalVar.alchemy.alchemyTimer;

    for (var i = this.globalService.globalVar.alchemy.alchemyStep + 1; i <= this.globalService.globalVar.alchemy.creatingRecipe.numberOfSteps; i++)
    {
      var step = this.globalService.globalVar.alchemy.creatingRecipe.steps[i-1];
      timeRemaining += this.alchemyService.getActionLength(step);
    }

    if (timeRemaining > 60*60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  createSelectedRecipe() {
    if (this.canCreateItem())
    {
      this.spendResourcesOnItem();
    }

    this.alchemyService.initializeCreation(this.selectedRecipe, this.createAmount);
  }

  //TODO: move these to service, check them every time you start a new one
  canCreateItem() {
    var canBuy = this.alchemyService.canCreateItem(this.selectedRecipe);
   
    return canBuy;
  }

  spendResourcesOnItem() {
    this.alchemyService.spendResourcesOnRecipe(this.selectedRecipe);
    
  }

  changeCreateAmount(amount: number) {
    this.createAmount = amount;
  }

  getTotalAmountToCreate() {
    return this.globalService.globalVar.alchemy.alchemyCreateAmount;
  }

  getAmountCreated() {
    return this.globalService.globalVar.alchemy.alchemyCurrentAmountCreated;
  }
}
