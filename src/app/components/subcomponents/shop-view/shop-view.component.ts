import { Component, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { JewelcraftingService } from 'src/app/services/professions/jewelcrafting.service';
import { StoryService } from 'src/app/services/story/story.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.css']
})
export class ShopViewComponent implements OnInit {
  shopOptions: ShopOption[];
  subscription: any;
  activeSubzoneType: SubZoneEnum;
  shopTypeEnum = ShopTypeEnum;
  openShopSubscription: any;
  resetNotification = NotificationTypeEnum.Reset;
  professionNotification = NotificationTypeEnum.Profession;
  alchemy: Profession | undefined;
  jewelcrafting: Profession | undefined;
  traderLevelUpText = "Level up text";
  traderLevelUpKillsRemainingText = "Kills needed: 0/10";

  isDisplayingNewItems: boolean = true;
  shopItems: ShopItem[];
  allItems: ShopItem[];
  newItems: ShopItem[];
  shopItemRows: ShopItem[][];
  shopItemCells: ShopItem[];
  filterEquipment = false;
  filterBattleItems = false;
  toggleAscending = true;

  constructor(private subzoneGeneratorService: SubZoneGeneratorService, private balladService: BalladService, public dialog: MatDialog,
    private gameLoopService: GameLoopService, private storyService: StoryService, private battleService: BattleService,
    private lookupService: LookupService, public globalService: GlobalService, private alchemyService: AlchemyService,
    private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService, private jewelcraftingService: JewelcraftingService) { }

  ngOnInit(): void {
    this.activeSubzoneType = this.balladService.getActiveSubZone().type;
    this.getShopOptions();
    this.alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    this.jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.activeSubzoneType !== this.balladService.getActiveSubZone().type) {
        this.activeSubzoneType = this.balladService.getActiveSubZone().type;
        this.getShopOptions();
      }
    });
  }

  getShopOptions() {
    this.shopOptions = this.subzoneGeneratorService.getShopOptions(this.activeSubzoneType, this.globalService.globalVar.sidequestData.traderHuntLevel);

    if (this.balladService.findSubzone(SubZoneEnum.AsphodelTheDepths)?.isAvailable)
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.Story);

      if (this.balladService.findSubzone(SubZoneEnum.ColchisGroveOfAres)?.isAvailable)
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.StoryScene24);
  }

  getOptionText(type: ShopTypeEnum) {    
    return this.lookupService.getShopOptionText(type);
  }

  progressStory() {
    this.storyService.showStory = true;
    this.battleService.checkScene();
  }

  showTraderSidequestNotification() {
    return this.globalService.globalVar.sidequestData.traderHuntLevel === 0;
  }

  openShop(option: ShopOption, content: any) {
    var optionalSceneToDisplay = this.optionalSceneToDisplay(option);
    if (optionalSceneToDisplay !== OptionalSceneEnum.None) {
      //display optional scene from shop 
      this.storyService.displayOptionalScene(optionalSceneToDisplay);
      this.battleService.checkScene();
      //subscribe to story service
      this.openShopSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
        if (this.storyService.returnedFromOptionalScene) {
          this.openShop(option, content);
          this.openShopSubscription.unsubscribe();
        }
      });
      //when given the okay, call this function again
      return;
    }

    var dialogRef: any;

    if (option.type === ShopTypeEnum.Coliseum) {
      if (this.deviceDetectorService.isMobile())
        this.dialog.open(content, { width: '95%', height: '80%' });
      else
        this.dialog.open(content, { width: '75%', maxHeight: '75%' });
    }
    else {
      if (this.deviceDetectorService.isMobile())
        dialogRef = this.dialog.open(content, { width: '95%', height: '80%', id: "dialogNoPadding" });
      else
        dialogRef = this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });
    }

    if (dialogRef !== undefined) {

    }

    if (option.type === ShopTypeEnum.Alchemist) {
      this.alchemyService.handleShopOpen(this.activeSubzoneType);
      this.alchemyService.checkForNewRecipes();
    }

    if (option.type === ShopTypeEnum.Jewelcrafter) {
      this.jewelcraftingService.handleShopOpen(this.activeSubzoneType);
      this.jewelcraftingService.checkForNewRecipes();
    }

    if (option.type === ShopTypeEnum.Trader) {
      this.isDisplayingNewItems = false;
      if (this.globalService.globalVar.sidequestData.traderHuntLevel === 0)
      {
        //trigger sidequest text
        this.globalService.globalVar.sidequestData.traderHuntLevel = 1;
      }      

      this.globalService.globalVar.sidequestData.traderBestiaryType = this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel();
      var defeatCount = 0;

      while (defeatCount >= this.lookupService.getBestiaryHuntKillCountForCurrentTraderLevel())
      {        
        this.globalService.globalVar.sidequestData.traderHuntLevel += 1;
        this.globalService.globalVar.sidequestData.traderBestiaryType = this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel();
        defeatCount = 0;
        var defeatStats = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.globalService.globalVar.sidequestData.traderBestiaryType);
        if (defeatStats !== undefined)
          defeatCount = defeatStats.count;
      }
    }

    if (option.type === ShopTypeEnum.Crafter || option.type === ShopTypeEnum.General || option.type === ShopTypeEnum.Traveler || 
      option.type === ShopTypeEnum.Trader) {
      this.allItems = option.availableItems.sort((a, b) => this.sortFunction(a, b));
      this.newItems = option.availableItems.sort((a, b) => this.sortFunction(a, b)).filter(item => item.originalStore === this.activeSubzoneType);

      if (this.isDisplayingNewItems)
        this.shopItems = this.newItems;

      this.setupDisplayShopItems();
    }
  }

  sortFunction(a: ShopItem, b: ShopItem) {
    var positive = 1;
    var negative = -1;

    if (this.toggleAscending) {
      positive = -1;
      negative = 1;
    }

    if (this.lookupService.getItemTypeFromItemEnum(a.shopItem) > this.lookupService.getItemTypeFromItemEnum(b.shopItem))
      return positive;
    else if (this.lookupService.getItemTypeFromItemEnum(a.shopItem) < this.lookupService.getItemTypeFromItemEnum(b.shopItem))
      return negative;
    else {
      if (this.lookupService.getItemTypeFromItemEnum(a.shopItem) === ItemTypeEnum.Equipment) {
        var equipmentA = this.lookupService.getEquipmentPieceByItemType(a.shopItem);
        var equipmentB = this.lookupService.getEquipmentPieceByItemType(b.shopItem);

        if (equipmentA === undefined || equipmentB === undefined)
          return a.shopItem > b.shopItem ? negative : a.shopItem < b.shopItem ? positive : 0;

        if (equipmentA.equipmentType > equipmentB.equipmentType)
          return negative;
        else if (equipmentA.equipmentType < equipmentB.equipmentType)
          return positive;
        else {
          if (equipmentA.weaponType > equipmentB.weaponType)
            return negative;
          else if (equipmentA.weaponType < equipmentB.weaponType)
            return positive;
          else {
            if (equipmentA.quality > equipmentB.quality)
              return positive;
            else if (equipmentA.quality < equipmentB.quality)
              return negative;
            else {
              return 0;
            }
          }
        }
      }
      else
        return a.shopItem > b.shopItem ? negative : a.shopItem < b.shopItem ? positive : 0;
    }
  }

  setupDisplayShopItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    this.shopItems = this.shopItems.filter(item => this.balladService.findSubzone(item.originalStore)?.isAvailable);

    var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= filteredItems.length; i++) {
      this.shopItemCells.push(filteredItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.shopItemRows.push(this.shopItemCells);
        this.shopItemCells = [];
      }
    }

    if (this.shopItemCells.length !== 0)
      this.shopItemRows.push(this.shopItemCells);
  }

  toggleDisplayNewItemsView() {
    this.isDisplayingNewItems = !this.isDisplayingNewItems;

    if (this.isDisplayingNewItems) {
      this.shopItems = this.newItems;
    }
    else {
      this.shopItems = this.allItems;
    }

    this.setupDisplayShopItems();
  }

  resetFilters() {
    this.filterEquipment = false;
    this.filterBattleItems = false;

    this.setupDisplayShopItems();
  }

  changeFilter(filter: string) {
    if (filter === "Equipment") {
      this.filterEquipment = !this.filterEquipment;
    }
    if (filter === "Battle Items")
      this.filterBattleItems = !this.filterBattleItems;

    this.setupDisplayShopItems();
  }

  filterItems(items: ShopItem[]) {
    var newItemList: ShopItem[] = [];

    if (!this.filterEquipment && !this.filterBattleItems)
      return items;

    if (this.filterEquipment) {
      items.forEach(item => {
        if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.Equipment)
          newItemList.push(item.makeCopy());
      });
    }

    if (this.filterBattleItems) {
      items.forEach(item => {
        if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.BattleItem ||
          this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.HealingItem)
          newItemList.push(item.makeCopy());
      });
    }

    return newItemList;
  }

  toggleSort() {
    this.toggleAscending = !this.toggleAscending;

    this.newItems.sort((a, b) => this.sortFunction(a, b));
    this.allItems.sort((a, b) => this.sortFunction(a, b));
    this.shopItems.sort((a, b) => this.sortFunction(a, b));

    this.setupDisplayShopItems();
  }

  optionalSceneToDisplay(option: ShopOption) {
    var scene = OptionalSceneEnum.None;

    if (option.type === ShopTypeEnum.Alchemist && this.balladService.getActiveSubZone().type === SubZoneEnum.AsphodelPalaceOfHades &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.HecateAlchemy)) {
      scene = OptionalSceneEnum.HecateAlchemy;
    }
    if (option.type === ShopTypeEnum.ChthonicFavor && this.balladService.getActiveSubZone().type === SubZoneEnum.AsphodelPalaceOfHades &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavor)) {
      scene = OptionalSceneEnum.ChthonicFavor;
    }
    if (option.type === ShopTypeEnum.Jewelcrafter && this.balladService.getActiveSubZone().type === SubZoneEnum.AegeanSeaIolcus &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.Jewelcrafting)) {
      scene = OptionalSceneEnum.Jewelcrafting;
    }

    return scene;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
