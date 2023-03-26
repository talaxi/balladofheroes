import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
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
  @ViewChild('confirmationBox') confirmationBox: any;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService,
    private alchemyService: AlchemyService) { }

  ngOnInit(): void {
  }

  selectRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }

  atMaxLevel() {
    return this.globalService.globalVar.alchemy.level >= this.globalService.globalVar.alchemy.maxLevel;
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
    return this.lookupService.getItemName(recipe.createdItem) + " <i class='amountAvailable'>(" + this.alchemyService.getAmountCanCreate(recipe) + " available)</i>";
  }

  getRecipeList(quality: EquipmentQualityEnum) {
    return this.globalService.globalVar.alchemy.availableRecipes.filter(item => item.quality === quality);
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
      var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

      ingredients += "<span class='" + this.getItemKeywordClass(resource.type, resource.item, resource.amount, userResourceAmount) + "'>" + (resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";
    });

    if (ingredients.length > 0) {
      ingredients = this.utilityService.getSanitizedHtml(ingredients);
    }

    return ingredients;
  }

  getSelectedRecipeIngredient(resource: ResourceValue) {
    var ingredient = "";

    var displayName = this.lookupService.getItemName(resource.item);
    var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
    var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

    ingredient += "<span class='" + this.getItemKeywordClass(resource.type, resource.item, resource.amount, userResourceAmount) + "'>" + (resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";

    if (ingredient.length > 0) {
      ingredient = this.utilityService.getSanitizedHtml(ingredient);
    }

    return ingredient;
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

    for (var i = 0; i < this.globalService.globalVar.alchemy.creatingRecipe.steps.length; i++) {
      var actionLength = this.alchemyService.getActionLength(this.globalService.globalVar.alchemy.creatingRecipe.steps[i]) * this.alchemyService.getDurationReduction(this.globalService.globalVar.alchemy.creatingRecipe.quality);
      totalLength += actionLength;

      if (this.globalService.globalVar.alchemy.alchemyStep > i + 1) {
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
    return this.lookupService.getAlchemyActionName(this.globalService.globalVar.alchemy.creatingRecipe.steps[this.globalService.globalVar.alchemy.alchemyStep - 1]);
  }

  getSelectedRecipeDescription() {
    return this.lookupService.getItemDescription(this.selectedRecipe.createdItem);
  }

  getTimeRemaining() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.globalService.globalVar.alchemy.alchemyTimerLength - this.globalService.globalVar.alchemy.alchemyTimer;

    for (var i = this.globalService.globalVar.alchemy.alchemyStep + 1; i <= this.globalService.globalVar.alchemy.creatingRecipe.numberOfSteps; i++) {
      var step = this.globalService.globalVar.alchemy.creatingRecipe.steps[i - 1];
      timeRemaining += this.alchemyService.getActionLength(step) * this.alchemyService.getDurationReduction(this.globalService.globalVar.alchemy.creatingRecipe.quality);
    }

    if (timeRemaining > 60 * 60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  createSelectedRecipe() {
    var confirm = false;
    if (this.globalService.globalVar.alchemy.creatingRecipe) {
      confirm = true;
    }
    
    if (confirm) {
      var dialogRef = this.utilityService.openConfirmationDialog();

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult && this.canCreateItem())
          this.startRecipe();
      });
    }
    else {
      if (this.canCreateItem()) {
        this.startRecipe();
      }
    }
  }

  startRecipe() {
    var rng = this.utilityService.getRandomNumber(0, 1);
    if (rng >= this.alchemyService.getMaterialRetentionChance(this.selectedRecipe.quality)) {
      this.spendResourcesOnItem();
    }
    this.alchemyService.initializeCreation(this.selectedRecipe, this.createAmount);
  }

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

  getTotalItemToCreateAmount() {
    return this.alchemyService.getAmountCanCreate(this.selectedRecipe);
  }

  getSelectedRecipeQualityStars() {
    return this.lookupService.getQualityStars(this.selectedRecipe.quality);
  }

  getQualityTypeList() {
    return this.lookupService.getQualityEnumList().sort(function (a, b) {
      return a > b ? -1 : a < b ? 1 : 0;
    });
  }

  getQualityTypeName(quality: EquipmentQualityEnum) {
    var name = this.lookupService.getQualityTypeName(quality);

    return "<span class='" + name.toLowerCase() + "Equipment bold'>" + name.toUpperCase() + " RECIPES</span>";
  }

  recipesAtQualityLevelAmount(quality: EquipmentQualityEnum) {
    return this.globalService.globalVar.alchemy.availableRecipes.filter(item => item.quality === quality).length;
  }

  toggleQualitySection(quality: EquipmentQualityEnum) {
    var qualityToggle = this.globalService.globalVar.alchemy.recipeBookQualityToggle.find(item => item[0] === quality);

    if (qualityToggle === undefined)
    {
      this.globalService.globalVar.alchemy.recipeBookQualityToggle.push([quality, true]);
    }
    else
    {
      qualityToggle[1] = !qualityToggle[1];
    }
  }

  hideRecipesByQuality(quality: EquipmentQualityEnum) {
    var qualityToggle = this.globalService.globalVar.alchemy.recipeBookQualityToggle.find(item => item[0] === quality);

    if (qualityToggle === undefined)
      return false;
    else 
      return qualityToggle[1];
  }
}
