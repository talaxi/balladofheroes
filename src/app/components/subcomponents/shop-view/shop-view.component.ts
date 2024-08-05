import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog as MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ResourceViewSortEnum } from 'src/app/models/enums/resource-view-sort-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { Profession } from 'src/app/models/professions/profession.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { JewelcraftingService } from 'src/app/services/professions/jewelcrafting.service';
import { StoryService } from 'src/app/services/story/story.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.css']
})
export class ShopViewComponent implements OnInit {
  @Input() showAllShopOptions: boolean = false;
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
  traderJewelcraftingRows: ShopItem[][];
  filterEquipment = false;
  filterBattleItems = false;
  dialogRef: MatDialogRef<any, any>;
  sortType: ResourceViewSortEnum = ResourceViewSortEnum.Type;
  ascendingSort: boolean = true;

  
  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent) {          
    if (event.key === "Shift") { //multiply by 25
      event.preventDefault();
      if (!this.utilityService.shiftPressed) {
        this.utilityService.shopBuyMultiplier *= 25;
        this.utilityService.shiftPressed = true;
      }
    }
    if (event.key === "Control") { //multiply by 10
      event.preventDefault();
      if (!this.utilityService.ctrlPressed) {        
        this.utilityService.shopBuyMultiplier *= 10;
        this.utilityService.ctrlPressed = true;
      }
    }
    if (event.key === "Alt") { //multiply by 100
      event.preventDefault();
      if (!this.utilityService.altPressed) {
        this.utilityService.shopBuyMultiplier *= 100;
        this.utilityService.altPressed = true;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) {    
    event.preventDefault();
    if (event.key === "Shift") { //divide by 25
      if (this.utilityService.shiftPressed) {
        this.utilityService.shopBuyMultiplier /= 25;
        this.utilityService.shiftPressed = false;
      }
    }
    if (event.key === "Control") { //divide by 10
      if (this.utilityService.ctrlPressed) {
        this.utilityService.shopBuyMultiplier /= 10;
        this.utilityService.ctrlPressed = false;
      }
    }
    if (event.key === "Alt") { //divide by 100
      if (this.utilityService.altPressed) {
        this.utilityService.shopBuyMultiplier /= 100;
        this.utilityService.altPressed = false;
      }
    }

    if (this.utilityService.shopBuyMultiplier < 1)
      this.utilityService.shopBuyMultiplier = 1;
  }

  constructor(private subzoneGeneratorService: SubZoneGeneratorService, private balladService: BalladService, public dialog: MatDialog,
    private gameLoopService: GameLoopService, private storyService: StoryService, private battleService: BattleService,
    private lookupService: LookupService, public globalService: GlobalService, private alchemyService: AlchemyService,
    private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService, private jewelcraftingService: JewelcraftingService,
    private enemyGeneratorService: EnemyGeneratorService, private layoutService: LayoutService, private dictionaryService: DictionaryService,
    private gameLogService: GameLogService) { }

  ngOnInit(): void {
    this.activeSubzoneType = this.balladService.getActiveSubZone().type;
    this.getShopOptions();
    this.alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    this.jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (!this.showAllShopOptions && this.activeSubzoneType !== this.balladService.getActiveSubZone().type) {
        //if (this.activeSubzoneType !== this.balladService.getActiveSubZone().type) {
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

  circeAlchemyCompleted() {
    return this.globalService.globalVar.sidequestData.circeAlchemyLevel >= 1;
  }

  circeAlchemyAvailable() {
    var straitsOfMessinaZone = this.balladService.findZone(ZoneEnum.StraitsOfMessina);
    
    if (straitsOfMessinaZone === undefined || straitsOfMessinaZone.isAvailable === undefined) {      
      return false;
    }

    return straitsOfMessinaZone?.isAvailable;
  }

  getShopOptions() {
    if (this.showAllShopOptions) {
      this.activeSubzoneType = this.balladService.getLatestSubzone();
      this.isDisplayingNewItems = false;
    }
    var cloakedStrangerFound = this.balladService.findSubzone(SubZoneEnum.TheLabyrinthCloakedStranger)?.isAvailable;

    this.shopOptions = this.subzoneGeneratorService.getShopOptions(this.activeSubzoneType, this.globalService.globalVar.sidequestData, this.showAllShopOptions, this.globalService.globalVar.ballads, this.globalService.globalVar.optionalScenesViewed, cloakedStrangerFound, this.globalService.globalVar.gods);

    if (this.balladService.findSubzone(SubZoneEnum.AsphodelTheDepths)?.isAvailable)
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.Story);

    if (this.balladService.findSubzone(SubZoneEnum.ColchisGroveOfAres)?.isAvailable)
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.StoryScene24);

    if (this.balladService.findSubzone(SubZoneEnum.HuntForYarrowMountainHike)?.isAvailable)
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.StoryZeus);

    if (this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.HephaestusJewelcrafting))
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.Hephaestus);

    if (this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.IslandOfNaxos))
      this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.IslandOfNaxos);
  }

  getShopItemTooltipDirection(index: number) {
    if (index % 4 === 0)
      return DirectionEnum.Right;
    else if (index % 4 === 1)
      return DirectionEnum.Right;
    else if (index % 4 === 2)
      return DirectionEnum.Left;
    else if (index % 4 === 3)
      return DirectionEnum.Left;

    return DirectionEnum.Right;
  }

  getOptionText(type: ShopTypeEnum) {
    return this.lookupService.getShopOptionText(type);
  }

  progressStory(type?: ShopTypeEnum) {
    if (type !== undefined && type === ShopTypeEnum.Story && this.globalService.globalVar.currentStoryId < 9) {
      this.globalService.globalVar.currentStoryId = 9;
    }

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
        this.dialog.open(content, { width: '95%', height: '90%' });
      else
        this.dialog.open(content, { width: '75%', maxHeight: '85%' });
    }
    else if (option.type === ShopTypeEnum.AugeanStables || option.type === ShopTypeEnum.CirceAlchemy) {
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

    if (option.type === ShopTypeEnum.AugeanStables || option.type === ShopTypeEnum.CirceAlchemy) {
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

      while (defeatCount >= this.lookupService.getBestiaryHuntKillCountForCurrentTraderLevel()) {
        this.globalService.globalVar.sidequestData.traderHuntLevel += 1;
        this.globalService.globalVar.sidequestData.traderBestiaryType = this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel();
        defeatCount = 0;
        var defeatStats = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.globalService.globalVar.sidequestData.traderBestiaryType);
        if (defeatStats !== undefined) {
          defeatCount = defeatStats.count;
        }
      }

      this.setTraderLevelUpText();
      if (this.atMaxTraderLevel())
        this.traderLevelUpKillsRemainingText = "";
      else
        this.traderLevelUpKillsRemainingText = this.enemyGeneratorService.generateEnemy(this.globalService.globalVar.sidequestData.traderBestiaryType).name + " Kills: " + defeatCount + " / " + this.lookupService.getBestiaryHuntKillCountForCurrentTraderLevel();
      option.availableItems = this.subzoneGeneratorService.getAvailableTraderOptions(this.globalService.globalVar.sidequestData.traderHuntLevel);
    }

    if (option.type === ShopTypeEnum.Crafter || option.type === ShopTypeEnum.General || option.type === ShopTypeEnum.Traveler ||
      option.type === ShopTypeEnum.Trader || option.type === ShopTypeEnum.AugeanStables || option.type === ShopTypeEnum.CirceAlchemy) {
      this.allItems = option.availableItems.sort((a, b) => this.sortFunction(a, b));
      this.newItems = option.availableItems.sort((a, b) => this.sortFunction(a, b)).filter(item => item.originalStore === this.activeSubzoneType);

      if (this.isDisplayingNewItems)
        this.shopItems = this.newItems;
      else
        this.shopItems = this.allItems;

      if (option.type === ShopTypeEnum.Trader)
        this.setupDisplayTraderItems();
      else
        this.setupDisplayShopItems();
    }
  }

  getTraderLevel() {
    return this.globalService.globalVar.sidequestData.traderHuntLevel;
  }

  setTraderLevelUpText() {
    if (this.globalService.globalVar.sidequestData.traderHuntLevel === 1)
      this.traderLevelUpText = "“If you could help me get back the rest of my materials, I sure would appreciate it!”";
    else if (this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel() === BestiaryEnum.None)
      this.traderLevelUpText = "“This is all I have for now, but if I get any new leads I'll let you know!”";
    else
      this.traderLevelUpText = "“If you can continue to clear the way to more materials, I'd be happy to trade for them with you!”";
  }

  atMaxTraderLevel() {
    if (this.lookupService.getBestiaryHuntTypeForCurrentTraderLevel() === BestiaryEnum.None) {
      return true;
    }

    return false;
  }

  sortFunction(a: ShopItem, b: ShopItem) {
    var positive = 1;
    var negative = -1;

    if (this.ascendingSort) {
      positive = -1;
      negative = 1;
    }

    if (this.sortType === ResourceViewSortEnum.Type) {
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
    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.shopItem);
      var nameB = this.dictionaryService.getItemName(b.shopItem);

      return nameA < nameB ? negative : nameA > nameB ? positive : 0;
    }

    if (this.sortType === ResourceViewSortEnum.EnumValue) {
      return a.shopItem < b.shopItem ? negative : a.shopItem > b.shopItem ? positive : 0;
    }

    return 0;
  }

  setupDisplayShopItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    this.shopItems = this.shopItems.filter(item => this.balladService.findSubzone(item.originalStore)?.isAvailable);
    this.shopItems.sort((a, b) => this.sortFunction(a, b));

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

  setupDisplayTraderItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];
    var traderJewelcraftingCells: ShopItem[] = [];
    this.traderJewelcraftingRows = [];

    this.shopItems = this.shopItems.filter(item => this.balladService.findSubzone(item.originalStore)?.isAvailable);
    this.shopItems.sort((a, b) => this.sortFunction(a, b));

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    var resourceItems = this.shopItems.filter(item => this.lookupService.getItemTypeFromItemEnum(item.shopItem) !== ItemTypeEnum.SlotItem && item.shopItem !== ItemsEnum.RutileRubyFragment &&
      item.shopItem !== ItemsEnum.RutileOpalFragment && item.shopItem !== ItemsEnum.RutileAquamarineFragment && item.shopItem !== ItemsEnum.RutileTopazFragment &&
      item.shopItem !== ItemsEnum.RutileAmethystFragment && item.shopItem !== ItemsEnum.RutileEmeraldFragment && item.shopItem !== ItemsEnum.PerfectRubyFragment &&
      item.shopItem !== ItemsEnum.PerfectOpalFragment && item.shopItem !== ItemsEnum.PerfectAquamarineFragment && item.shopItem !== ItemsEnum.PerfectTopazFragment &&
      item.shopItem !== ItemsEnum.PerfectAmethystFragment && item.shopItem !== ItemsEnum.PerfectEmeraldFragment);

    for (var i = 1; i <= resourceItems.length; i++) {
      this.shopItemCells.push(resourceItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.shopItemRows.push(this.shopItemCells);
        this.shopItemCells = [];
      }
    }

    if (this.shopItemCells.length !== 0)
      this.shopItemRows.push(this.shopItemCells);


    var jewelcraftingItems = this.shopItems.filter(item => this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.SlotItem || item.shopItem === ItemsEnum.RutileRubyFragment ||
      item.shopItem === ItemsEnum.RutileOpalFragment || item.shopItem === ItemsEnum.RutileAquamarineFragment || item.shopItem === ItemsEnum.RutileTopazFragment ||
      item.shopItem === ItemsEnum.RutileAmethystFragment || item.shopItem === ItemsEnum.RutileEmeraldFragment || item.shopItem === ItemsEnum.PerfectRubyFragment ||
      item.shopItem === ItemsEnum.PerfectOpalFragment || item.shopItem === ItemsEnum.PerfectAquamarineFragment || item.shopItem === ItemsEnum.PerfectTopazFragment ||
      item.shopItem === ItemsEnum.PerfectAmethystFragment || item.shopItem === ItemsEnum.PerfectEmeraldFragment);


    for (var i = 1; i <= jewelcraftingItems.length; i++) {
      traderJewelcraftingCells.push(jewelcraftingItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.traderJewelcraftingRows.push(traderJewelcraftingCells);
        traderJewelcraftingCells = [];
      }
    }

    if (traderJewelcraftingCells.length !== 0)
      this.traderJewelcraftingRows.push(traderJewelcraftingCells);
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
    var showBasicEquipment = this.globalService.globalVar.settings.get("shopShowBasicFilter") ?? true;
    var showUncommonEquipment = this.globalService.globalVar.settings.get("shopShowUncommonFilter") ?? true;
    var showRareEquipment = this.globalService.globalVar.settings.get("shopShowRareFilter") ?? true;
    var showEpicEquipment = this.globalService.globalVar.settings.get("shopShowEpicFilter") ?? true;
    var showSpecialEquipment = this.globalService.globalVar.settings.get("shopShowSpecialFilter") ?? true;
    var showExtraordinaryEquipment = this.globalService.globalVar.settings.get("shopShowExtraordinaryFilter") ?? true;
    var showUniqueEquipment = this.globalService.globalVar.settings.get("shopShowUniqueFilter") ?? true;
    var showWeaponsEquipment = this.globalService.globalVar.settings.get("shopShowWeaponsFilter") ?? true;
    var showShieldsEquipment = this.globalService.globalVar.settings.get("shopShowShieldsFilter") ?? true;
    var showArmorEquipment = this.globalService.globalVar.settings.get("shopShowArmorFilter") ?? true;
    var showNecklacesEquipment = this.globalService.globalVar.settings.get("shopShowNecklacesFilter") ?? true;
    var showRingsEquipment = this.globalService.globalVar.settings.get("shopShowRingsFilter") ?? true;
    var showEquipment = this.globalService.globalVar.settings.get("shopShowEquipmentFilter") ?? true;
    var showBattleItems = this.globalService.globalVar.settings.get("shopShowBattleItemsFilter") ?? true;
    var showHealingItems = this.globalService.globalVar.settings.get("shopShowHealingItemsFilter") ?? true;
    var showSlotItems = this.globalService.globalVar.settings.get("shopShowSlotItemsFilter") ?? true;

    var newItemList: ShopItem[] = [];

    items.forEach(item => {
      if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.Equipment) {
        var equipment = this.lookupService.getEquipmentPieceByItemType(item.shopItem);
        if (equipment === undefined || !showEquipment)
          return;

        if (!showBasicEquipment && equipment.quality === EquipmentQualityEnum.Basic)
          return;
        if (!showUncommonEquipment && equipment.quality === EquipmentQualityEnum.Uncommon)
          return;
        if (!showRareEquipment && equipment.quality === EquipmentQualityEnum.Rare)
          return;
        if (!showEpicEquipment && equipment.quality === EquipmentQualityEnum.Epic)
          return;
        if (!showSpecialEquipment && equipment.quality === EquipmentQualityEnum.Special)
          return;
        if (!showExtraordinaryEquipment && equipment.quality === EquipmentQualityEnum.Extraordinary)
          return;
        if (!showUniqueEquipment && equipment.quality === EquipmentQualityEnum.Unique)
          return;

        if (!showWeaponsEquipment && equipment.equipmentType === EquipmentTypeEnum.Weapon)
          return;
        if (!showShieldsEquipment && equipment.equipmentType === EquipmentTypeEnum.Shield)
          return;
        if (!showArmorEquipment && equipment.equipmentType === EquipmentTypeEnum.Armor)
          return;
        if (!showNecklacesEquipment && equipment.equipmentType === EquipmentTypeEnum.Necklace)
          return;
        if (!showRingsEquipment && equipment.equipmentType === EquipmentTypeEnum.Ring)
          return;
      }

      if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.BattleItem) {
        if (!showBattleItems)
          return;
      }

      if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.SlotItem) {
        if (!showSlotItems)
          return;
      }

      if (this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.HealingItem) {
        if (!showHealingItems)
          return;
      }

      newItemList.push(item.makeCopy());
    });

    /*if (!this.filterEquipment && !this.filterBattleItems)
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
    }*/

    return newItemList;
  }

  toggleSort() {
    this.ascendingSort = !this.ascendingSort;

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
    if (option.type === ShopTypeEnum.Hephaestus && this.balladService.getActiveSubZone().type === SubZoneEnum.MountOlympusOlympus &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.HephaestusJewelcrafting)) {
      scene = OptionalSceneEnum.HephaestusJewelcrafting;
    }
    if (option.type === ShopTypeEnum.IslandOfNaxos && this.balladService.getActiveSubZone().type === SubZoneEnum.CreteKnossos &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.IslandOfNaxos)) {
      scene = OptionalSceneEnum.IslandOfNaxos;
    }
    if (option.type === ShopTypeEnum.CirceAlchemy && this.globalService.globalVar.sidequestData.circeAlchemyLevel === 0 && this.balladService.getActiveSubZone().type === SubZoneEnum.AiaiaCircesHome &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.CirceAlchemy)) {
      scene = OptionalSceneEnum.CirceAlchemy;
    }
    if (option.type === ShopTypeEnum.CirceAlchemy && this.globalService.globalVar.sidequestData.circeAlchemyLevel === 0 &&
      this.globalService.globalVar.sidequestData.displayCirceAlchemyPayScene && this.balladService.getActiveSubZone().type === SubZoneEnum.AiaiaCircesHome &&
      !this.globalService.globalVar.optionalScenesViewed.some(item => item === OptionalSceneEnum.CirceAlchemy2)) {
      scene = OptionalSceneEnum.CirceAlchemy2;
    }

    return scene;
  }

  handleHephaestusJewelcrafting(option: ShopOption) {
    var optionalSceneToDisplay = this.optionalSceneToDisplay(option);
    this.storyService.displayOptionalScene(optionalSceneToDisplay);
    this.battleService.checkScene();
  }

  handleIslandOfNaxos(option: ShopOption) {
    var optionalSceneToDisplay = this.optionalSceneToDisplay(option);
    this.storyService.displayOptionalScene(optionalSceneToDisplay);
    this.battleService.checkScene();
  }

  openFilterMenu(slotMenuContent: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '60%', height: '65%', panelClass: 'mat-dialog-no-scroll' });

    this.dialogRef.afterClosed().subscribe(dialogResult => {
      this.setupDisplayShopItems();
    });
  }

  hasOlympicFavorBeenOpened() {
    var anyCharacterMaxLevelRaised = false;
    this.globalService.globalVar.characters.forEach(item => {
      if (item.maxLevel > 30)
        anyCharacterMaxLevelRaised = true;
    });

    var ambrosia = this.globalService.globalVar.resources.find(item => item.item === ItemsEnum.Ambrosia);

    return anyCharacterMaxLevelRaised || ambrosia !== undefined;
  }

  ngOnDestroy() {
    this.utilityService.shopBuyMultiplier = 1;
    this.layoutService.jumpedToColiseum = false;

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
