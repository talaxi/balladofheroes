import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { ProfessionService } from 'src/app/services/professions/profession.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
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
  alchemy: Profession | undefined;
  recipeList: Recipe[];
  isMobile: boolean = false;
  customCreateAmount: number = 0;
  fullRecipeList: Recipe[] = [];

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
    private alchemyService: AlchemyService, private professionService: ProfessionService, private dictionaryService: DictionaryService,
    private deviceDetectorService: DeviceDetectorService, private menuService: MenuService, private keybindService: KeybindService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    this.getFullRecipeList();
    
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
    if (this.alchemy === undefined)
      return false;

    return this.alchemy.level >= this.alchemy.maxLevel;
  }

  getLevel() {
    if (this.alchemy === undefined)
    return 0;
    return this.alchemy.level;
  }

  getExp() {
    if (this.alchemy === undefined)
    return 0;
    return this.alchemy.exp;
  }

  getExpToNextLevel() {
    if (this.alchemy === undefined)
    return 0;
    return this.alchemy.expToNextLevel;
  }

  getCraftedItemName(recipe: Recipe) {
    return this.dictionaryService.getItemName(recipe.createdItem) + " <i class='amountAvailable'>(" + this.professionService.getAmountCanCreate(recipe) + " available)</i>";
  }

  getFullRecipeList() {
    if (this.alchemy === undefined)
      return;

    this.recipeList = [];
    this.alchemy.availableRecipeItems.forEach(item => {
      this.recipeList.push(this.alchemyService.getRecipe(item));
    });
  }

  getRecipeList(quality: EquipmentQualityEnum) {
    if (this.alchemy === undefined)
      return [];

    return this.recipeList.filter(item => item.quality === quality).reverse();
  }

  getSelectedRecipeName() {
    if (this.selectedRecipe !== undefined)
      return this.dictionaryService.getItemName(this.selectedRecipe.createdItem);

    return "";
  }

  getCreatingRecipeName() {
    if (this.alchemy !== undefined && this.alchemy.creatingRecipe !== undefined)
      return this.dictionaryService.getItemName(this.alchemy.creatingRecipe.createdItem);

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
    return this.alchemy !== undefined && this.alchemy.creatingRecipe !== undefined;
  }

  getStepProgress() {
    if (this.alchemy === undefined || this.alchemy.creatingRecipe === undefined)
      return 0;
    var totalLength = 0;
    var passedTime = 0;

    for (var i = 0; i < this.alchemy.creatingRecipe.steps.length; i++) {
      var actionLength = this.alchemyService.getActionLength(this.alchemy.creatingRecipe.steps[i]) * this.professionService.getDurationReduction(this.alchemy.type, this.alchemy.creatingRecipe.quality);
      totalLength += actionLength;

      if (this.alchemy.creationStep > i + 1) {
        passedTime += actionLength;
      }
    }

    passedTime += this.alchemy.creationTimer;
    return (passedTime / totalLength) * 100;
  }

  getRecipeStepName() {
    if (this.alchemy === undefined ||this.alchemy.creatingRecipe === undefined)
      return "";
    return this.lookupService.getAlchemyActionName(this.alchemy.creatingRecipe.steps[this.alchemy.creationStep - 1]);
  }

  getSelectedRecipeDescription() {
    return this.lookupService.getItemDescription(this.selectedRecipe.createdItem);
  }

  getTimeRemaining() {
    if (this.alchemy === undefined || this.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.alchemy.creationTimerLength - this.alchemy.creationTimer;

    for (var i = this.alchemy.creationStep + 1; i <= this.alchemy.creatingRecipe.numberOfSteps; i++) {
      var step = this.alchemy.creatingRecipe.steps[i - 1];
      timeRemaining += this.alchemyService.getActionLength(step) * this.professionService.getDurationReduction(this.alchemy.type, this.alchemy.creatingRecipe.quality);
    }

    if (timeRemaining > 60 * 60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  createSelectedRecipe() {
    var confirm = false;
    if (this.alchemy !== undefined && this.alchemy.creatingRecipe) {
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
    if (this.alchemy === undefined)
      return;

    var rng = this.utilityService.getRandomNumber(0, 1);
    if (rng >= this.professionService.getMaterialRetentionChance(this.alchemy.type, this.selectedRecipe.quality)) {
      this.spendResourcesOnItem();
    }
    this.professionService.initializeCreation(this.alchemy.type, this.selectedRecipe, this.createAmount);
  }

  getSelectedRecipeCurrentlyOwnedAmount() {
    return this.lookupService.getResourceAmount(this.selectedRecipe.createdItem).toLocaleString();
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
    if (this.alchemy === undefined)
    return 0;
    return this.alchemy.creationCreateAmount;
  }

  getAmountCreated() {
    if (this.alchemy === undefined)
    return 0;
    return this.alchemy.creationCurrentAmountCreated;
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

  getQualityTypeName(quality: EquipmentQualityEnum) {
    var name = this.lookupService.getQualityTypeName(quality);

    return "<span class='" + name.toLowerCase() + "Equipment bold'>" + name.toLowerCase() + " recipes</span>";
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

  getXpIncrease() {
    return this.selectedRecipe.expGain;
  }

  recipesAtQualityLevelAmount(quality: EquipmentQualityEnum) {
    if (this.alchemy === undefined)
      return 0;

    var recipeList: Recipe[] = [];
    this.alchemy.availableRecipeItems.forEach(item => {
      recipeList.push(this.alchemyService.getRecipe(item));
    });

    return recipeList.filter(item => item.quality === quality).length;
  }

  toggleQualitySection(quality: EquipmentQualityEnum) {
    var qualityToggle = this.alchemy?.recipeBookQualityToggle.find(item => item[0] === quality);

    if (qualityToggle === undefined)
    {
      this.alchemy?.recipeBookQualityToggle.push([quality, true]);
    }
    else
    {
      qualityToggle[1] = !qualityToggle[1];
    }
  }

  hideRecipesByQuality(quality: EquipmentQualityEnum) {
    var qualityToggle = this.alchemy?.recipeBookQualityToggle.find(item => item[0] === quality);

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
  
  ngOnDestroy() {
    this.menuService.inTextbox = false;
  }
}
