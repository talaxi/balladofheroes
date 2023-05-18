import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { Profession } from 'src/app/models/professions/profession.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
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
  sideQuestNotification = NotificationTypeEnum.SideQuest;
  alchemy: Profession | undefined;
  jewelcrafting: Profession | undefined;
  traderLevelUpText = "";
  traderLevelUpKillsRemainingText = "";
  @ViewChild('coliseumModal') coliseumModal: any;

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
    private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService, private jewelcraftingService: JewelcraftingService,
    private enemyGeneratorService: EnemyGeneratorService, private layoutService: LayoutService) { }

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

  ngAfterViewInit() {
    if (this.layoutService.jumpedToColiseum && this.shopOptions.some(item => item.type === ShopTypeEnum.Coliseum)) {
      this.openShop(this.shopOptions.find(item => item.type === ShopTypeEnum.Coliseum)!, this.coliseumModal);
      this.layoutService.jumpedToColiseum = false;
    }
  }

  augeanStablesCompleted() {
    return this.globalService.globalVar.sidequestData.augeanStablesLevel >= this.globalService.globalVar.sidequestData.maxAugeanStablesLevel; 
  }

  getShopOptions() {
    this.shopOptions = this.subzoneGeneratorService.getShopOptions(this.activeSubzoneType, this.globalService.globalVar.sidequestData);

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

    if (option.type === ShopTypeEnum.Coliseum || option.type === ShopTypeEnum.Trader) {
      if (this.deviceDetectorService.isMobile())
        this.dialog.open(content, { width: '95%', height: '85%' });
      else
        this.dialog.open(content, { width: '75%', minHeight: '85vh', maxHeight: '85%' });
    }
    else if (option.type === ShopTypeEnum.AugeanStables) {
      if (this.deviceDetectorService.isMobile())
        dialogRef = this.dialog.open(content, { width: '95%', minHeight: '60vh', height: '60%', id: "dialogNoPadding" });
      else
        dialogRef = this.dialog.open(content, { width: '75%', minHeight: '55vh', maxHeight: '55%', id: 'dialogNoPadding' });
    }
    else {
      if (this.deviceDetectorService.isMobile())
        dialogRef = this.dialog.open(content, { width: '95%', height: '80%', id: "dialogNoPadding" });
      else
        dialogRef = this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });
    }

    if (option.type === ShopTypeEnum.Alchemist) {
      this.alchemyService.handleShopOpen(this.activeSubzoneType);
      this.alchemyService.checkForNewRecipes();
    }

    if (option.type === ShopTypeEnum.Jewelcrafter) {
      this.jewelcraftingService.handleShopOpen(this.activeSubzoneType);
      this.jewelcraftingService.checkForNewRecipes();
    }
    
    if (option.type === ShopTypeEnum.AugeanStables) {     
      this.isDisplayingNewItems = false;
    }

    if (option.type === ShopTypeEnum.Trader) {     
      this.isDisplayingNewItems = false;

      this.globalService.globalVar.sidequestData.traderBestiaryType = this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel();
      var defeatCount = 0;
      var defeatStats = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.globalService.globalVar.sidequestData.traderBestiaryType);
      if (defeatStats !== undefined) {        
        defeatCount = defeatStats.count;
      }

      while (defeatCount >= this.lookupService.getBestiaryHuntKillCountForCurrentTraderLevel())
      {                
        this.globalService.globalVar.sidequestData.traderHuntLevel += 1;
        this.globalService.globalVar.sidequestData.traderBestiaryType = this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel();
        defeatCount = 0;
        var defeatStats = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.globalService.globalVar.sidequestData.traderBestiaryType);
        if (defeatStats !== undefined) {          
          defeatCount = defeatStats.count;
        }
      }

      this.setTraderLevelUpText();
      this.traderLevelUpKillsRemainingText = this.enemyGeneratorService.generateEnemy(this.globalService.globalVar.sidequestData.traderBestiaryType).name + " Kills: " + defeatCount + " / " + this.lookupService.getBestiaryHuntKillCountForCurrentTraderLevel();
      option.availableItems = this.subzoneGeneratorService.getAvailableTraderOptions(this.globalService.globalVar.sidequestData.traderHuntLevel);
    }

    if (option.type === ShopTypeEnum.Crafter || option.type === ShopTypeEnum.General || option.type === ShopTypeEnum.Traveler || 
      option.type === ShopTypeEnum.Trader || option.type === ShopTypeEnum.AugeanStables) {        
      this.allItems = option.availableItems.sort((a, b) => this.sortFunction(a, b));
      this.newItems = option.availableItems.sort((a, b) => this.sortFunction(a, b)).filter(item => item.originalStore === this.activeSubzoneType);

      if (this.isDisplayingNewItems)
        this.shopItems = this.newItems;
      else
        this.shopItems = this.allItems;

      this.setupDisplayShopItems();
    }
  }

  getTraderLevel() {
    return this.globalService.globalVar.sidequestData.traderHuntLevel;
  }

  setTraderLevelUpText() {    
    if (this.globalService.globalVar.sidequestData.traderHuntLevel === 1)
      this.traderLevelUpText = "“If you could help me get back the rest of my materials, I sure would appreciate it!”";
    else
      this.traderLevelUpText = "“If you can continue to clear the way to more materials, I'd be happy to trade it with you!”";
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
    if (option.type === ShopTypeEnum.Trader && this.balladService.getActiveSubZone().type === SubZoneEnum.NemeaCleonea &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.TraderIntro)) {
      scene = OptionalSceneEnum.TraderIntro;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 0 && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables1)) {
      scene = OptionalSceneEnum.AugeanStables1;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 0 &&
      this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables2)) {
      scene = OptionalSceneEnum.AugeanStables2;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 1 && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables3)) {
      scene = OptionalSceneEnum.AugeanStables3;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 1 &&
      this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables4)) {
      scene = OptionalSceneEnum.AugeanStables4;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 2 && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables5)) {
      scene = OptionalSceneEnum.AugeanStables5;
    }
    if (option.type === ShopTypeEnum.AugeanStables && this.globalService.globalVar.sidequestData.augeanStablesLevel === 2 &&
      this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteElis &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables6)) {
      scene = OptionalSceneEnum.AugeanStables6;
    }

    return scene;
  }

  ngOnDestroy() {
    this.layoutService.jumpedToColiseum = false;

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
