import { Component, HostListener, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { JewelcraftingService } from 'src/app/services/professions/jewelcrafting.service';
import { ProfessionService } from 'src/app/services/professions/profession.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-jewelcrafting-view',
  templateUrl: './jewelcrafting-view.component.html',
  styleUrls: ['./jewelcrafting-view.component.css']
})
export class JewelcraftingViewComponent {
  selectedRecipe: Recipe;
  createAmount = 1;
  @ViewChild('confirmationBox') confirmationBox: any;
  jewelcrafting: Profession | undefined;
  recipeList: Recipe[];
  isMobile: boolean = false;
  customCreateAmount: number = 0;
  fullRecipeList: Recipe[] = [];
  favoriteRecipeList: Recipe[] = [];

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuUp"))) {
      this.toggleSubMenuOptions(-1);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuDown"))) {
      this.toggleSubMenuOptions(1);
    }
  }

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService,
    private jewelcraftingService: JewelcraftingService, private professionService: ProfessionService, private dictionaryService: DictionaryService,
    private deviceDetectorService: DeviceDetectorService, private menuService: MenuService, private keybindService: KeybindService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    this.getFullRecipeList();
    this.favoriteRecipeList = this.getFavoriteRecipeList();

    this.getQualityTypeList().forEach(qualityType => {
      this.getRecipeList(qualityType).forEach(recipe => {
        this.fullRecipeList.push(recipe);
    });
  });
}

selectRecipe(recipe: Recipe) {
  this.selectedRecipe = recipe;
}

atMaxLevel() {
  if (this.jewelcrafting === undefined)
    return false;

  return this.jewelcrafting.level >= this.jewelcrafting.maxLevel;
}

getLevel() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.level;
}

getMaxLevel() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.maxLevel;
}

getExp() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.exp;
}

getExpToNextLevel() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.expToNextLevel;
}

getSelectedRecipeCurrentlyOwnedAmount() {
  return this.lookupService.getResourceAmount(this.selectedRecipe.createdItem).toLocaleString();
}

getCraftedItemName(recipe: Recipe) {
  return this.dictionaryService.getItemName(recipe.createdItem) + " <i class='amountAvailable'>(" + this.professionService.getAmountCanCreate(recipe) + " available)</i>";
}

getFullRecipeList() {
  if (this.jewelcrafting === undefined)
    return;

  this.recipeList = [];
  this.jewelcrafting.availableRecipeItems.forEach(item => {
    this.recipeList.push(this.jewelcraftingService.getRecipe(item));
  });
}

getRecipeList(quality: EquipmentQualityEnum) {
  if (this.jewelcrafting === undefined)
    return [];

  return this.recipeList.filter(item => item.quality === quality).sort(function (a, b) {
    return a.displayOrder > b.displayOrder ? -1 : a.displayOrder < b.displayOrder ? 1 : 0;
  });
}

getSelectedRecipeName() {
  if (this.selectedRecipe !== undefined)
    return this.dictionaryService.getItemName(this.selectedRecipe.createdItem);

  return "";
}

getCreatingRecipeName() {
  if (this.jewelcrafting !== undefined && this.jewelcrafting.creatingRecipe !== undefined)
    return this.dictionaryService.getItemName(this.jewelcrafting.creatingRecipe.createdItem);

  return "";
}

listSelectedRecipeIngredients() {
  var ingredients = "";

  if (this.selectedRecipe === undefined)
    return "";

  this.selectedRecipe.ingredients.forEach(resource => {
    var displayName = this.dictionaryService.getItemName(resource.item);
    var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
    var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

    ingredients += "<span class='" + this.getItemKeywordClass(this.lookupService.getItemTypeFromItemEnum(resource.item), resource.item, resource.amount, userResourceAmount) + "'>" + (resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";
  });

  if (ingredients.length > 0) {
    ingredients = this.utilityService.getSanitizedHtml(ingredients);
  }

  return ingredients;
}

getSelectedRecipeIngredient(resource: ResourceValue) {
  var ingredient = "";

  var displayName = this.dictionaryService.getItemName(resource.item);
  var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
  var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

  ingredient += "<span class='" + this.getItemKeywordClass(this.lookupService.getItemTypeFromItemEnum(resource.item), resource.item, resource.amount, userResourceAmount) + "'>" + (resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";

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
  return this.jewelcrafting !== undefined && this.jewelcrafting.creatingRecipe !== undefined;
}

getStepProgress() {
  if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
    return 0;
  var totalLength = 0;
  var passedTime = 0;

  for (var i = 0; i < this.jewelcrafting.creatingRecipe.steps.length; i++) {
    var durationHalved = 1;
    if (this.jewelcrafting.isDurationHalved)
      durationHalved = .5;

    var actionLength = this.jewelcraftingService.getActionLength(this.jewelcrafting.creatingRecipe.steps[i]) * durationHalved * this.professionService.getDurationReduction(this.jewelcrafting.type, this.jewelcrafting.creatingRecipe.quality);
    totalLength += actionLength;

    if (this.jewelcrafting.creationStep > i + 1) {
      passedTime += actionLength;
    }
  }

  passedTime += this.jewelcrafting.creationTimer;
  return (passedTime / totalLength) * 100;
}

getRecipeStepName() {
  if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
    return "";
  return this.lookupService.getAlchemyActionName(this.jewelcrafting.creatingRecipe.steps[this.jewelcrafting.creationStep - 1]);
}

getSelectedRecipeDescription() {
  return this.lookupService.getItemDescription(this.selectedRecipe.createdItem);
}

getTimeRemaining() {
  if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
    return "";

  var timeRemaining = this.jewelcrafting.creationTimerLength - this.jewelcrafting.creationTimer;

  for (var i = this.jewelcrafting.creationStep + 1; i <= this.jewelcrafting.creatingRecipe.numberOfSteps; i++) {
    var step = this.jewelcrafting.creatingRecipe.steps[i - 1];
    var durationHalved = 1;
    if (this.jewelcrafting.isDurationHalved)
      durationHalved = .5;

    timeRemaining += this.jewelcraftingService.getActionLength(step) * durationHalved * this.professionService.getDurationReduction(this.jewelcrafting.type, this.jewelcrafting.creatingRecipe.quality);
  }

  if (timeRemaining > 60 * 60)
    return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

  return this.utilityService.convertSecondsToMMSS(timeRemaining);
}

createSelectedRecipe() {
  var confirm = false;
  if (this.jewelcrafting !== undefined && this.jewelcrafting.creatingRecipe) {
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
  if (this.jewelcrafting === undefined)
    return;

  var rng = this.utilityService.getRandomNumber(0, 1);
  if (rng >= this.professionService.getMaterialRetentionChance(this.jewelcrafting.type, this.selectedRecipe.quality)) {
    this.spendResourcesOnItem();
  }
  this.professionService.initializeCreation(this.jewelcrafting.type, this.selectedRecipe, this.createAmount);
}

canCreateItem() {
  var canBuy = this.professionService.canCreateItem(this.selectedRecipe);

  return canBuy;
}

spendResourcesOnItem() {
  this.professionService.spendResourcesOnRecipe(this.selectedRecipe);
}

changeCreateAmount(amount: number, resetCustomAmount: boolean = false) {
  this.createAmount = amount;
  if (resetCustomAmount)
    this.customCreateAmount = 0;
}

getTotalAmountToCreate() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.creationCreateAmount;
}

getAmountCreated() {
  if (this.jewelcrafting === undefined)
    return 0;
  return this.jewelcrafting.creationCurrentAmountCreated;
}

getTotalItemToCreateAmount() {
  return this.professionService.getAmountCanCreate(this.selectedRecipe);
}

getSelectedRecipeQualityStars() {
  return this.lookupService.getQualityStars(this.selectedRecipe.quality);
}

getQualityTypeList() {
  return this.lookupService.getQualityEnumList().sort(function (a, b) {
    return a > b ? -1 : a < b ? 1 : 0;
  });
}

getXpIncrease() {
  return this.selectedRecipe.expGain;
}

inTextbox() {
  this.menuService.inTextbox = true;
}

outOfTextbox() {
  this.menuService.inTextbox = false;
}

useCustomAmount() {
  if (this.customCreateAmount > 0 && this.customCreateAmount <= this.getTotalItemToCreateAmount())
    this.changeCreateAmount(this.customCreateAmount);
}


getQualityTypeName(quality: EquipmentQualityEnum) {
  var name = this.lookupService.getQualityTypeName(quality);

  return "<span class='" + name.toLowerCase() + "Equipment bold'>" + name.toLowerCase() + " recipes</span>";
}

recipesAtQualityLevelAmount(quality: EquipmentQualityEnum) {
  if (this.jewelcrafting === undefined)
    return [];

  var recipeList: Recipe[] = [];
  this.jewelcrafting.availableRecipeItems.forEach(item => {
    recipeList.push(this.jewelcraftingService.getRecipe(item));
  });

  return recipeList.filter(item => item.quality === quality).length;
}

toggleQualitySection(quality: EquipmentQualityEnum) {
  var qualityToggle = this.jewelcrafting?.recipeBookQualityToggle.find(item => item[0] === quality);

  if (qualityToggle === undefined) {
    this.jewelcrafting?.recipeBookQualityToggle.push([quality, true]);
  }
  else {
    qualityToggle[1] = !qualityToggle[1];
  }
}

hideRecipesByQuality(quality: EquipmentQualityEnum) {
  var qualityToggle = this.jewelcrafting?.recipeBookQualityToggle.find(item => item[0] === quality);

  if (qualityToggle === undefined)
    return false;
  else
    return qualityToggle[1];
}

toggleSubMenuOptions(direction: number) {  
  var currentIndex = this.fullRecipeList.findIndex(item => item === this.selectedRecipe);
  currentIndex += direction;

  if (currentIndex < 0)
    currentIndex = this.fullRecipeList.length - 1;
  if (currentIndex > this.fullRecipeList.length - 1)
    currentIndex = 0;

  this.selectRecipe(this.fullRecipeList[currentIndex]);
}

favoriteRecipeAmount() {
  if (this.jewelcrafting === undefined)
    return 0;

  var recipeList: Recipe[] = [];
  this.jewelcrafting.favoritedRecipeItems.forEach(item => {
    recipeList.push(this.jewelcraftingService.getRecipe(item));
  });

  return recipeList.length;
}

toggleFavorites() {
  if (this.jewelcrafting !== undefined)
    this.jewelcrafting.favoriteToggle = !this.jewelcrafting.favoriteToggle;
}

hideFavoriteRecipes() {
  if (this.jewelcrafting !== undefined)
    return this.jewelcrafting.favoriteToggle;
  else 
  return false;
}

getFavoriteRecipeList() {
  if (this.jewelcrafting === undefined)
    return [];

    var recipeList: Recipe[] = [];
    this.jewelcrafting.favoritedRecipeItems.forEach(item => {
      recipeList.push(this.jewelcraftingService.getRecipe(item));
    });

  return recipeList;
}

favoriteRecipe(recipe: Recipe) {        
  if (this.jewelcrafting === undefined)
    return;

  if (this.jewelcrafting.favoritedRecipeItems.some(item => item === recipe.createdItem)) {
    this.jewelcrafting.favoritedRecipeItems = this.jewelcrafting.favoritedRecipeItems.filter(item => item !== recipe.createdItem);
  }
  else
  {
    this.jewelcrafting.favoritedRecipeItems.push(recipe.createdItem);
  }

  this.favoriteRecipeList = this.getFavoriteRecipeList();
}

getFavoriteIcon(recipe: Recipe) {
  var src = "";
  
  if  (this.jewelcrafting !== undefined && this.jewelcrafting.favoritedRecipeItems.some(item => item === recipe.createdItem))
    src = "assets/svg/favoriteActive.svg";
  else
    src = "assets/svg/favoriteInactive.svg";

  return src;
}

ngOnDestroy() {
  this.menuService.inTextbox = false;
}
}
