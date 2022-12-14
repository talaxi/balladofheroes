import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { StoryService } from 'src/app/services/story/story.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';

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
    private lookupService: LookupService, private globalService: GlobalService, private alchemyService: AlchemyService) { }

  ngOnInit(): void {
    this.activeSubzoneType = this.balladService.getActiveSubZone().type;
    this.getShopOptions();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.activeSubzoneType !== this.balladService.getActiveSubZone().type) {
        this.activeSubzoneType = this.balladService.getActiveSubZone().type;
        this.getShopOptions();
      }
    });
  }

  getShopOptions() {
    this.shopOptions = this.subzoneGeneratorService.getShopOptions(this.activeSubzoneType);
  }

  getOptionText(type: ShopTypeEnum) {
    var text = "";

    if (type === ShopTypeEnum.General) {
      text = "General";
    }
    if (type === ShopTypeEnum.Crafter) {
      text = "Crafter";
    }
    if (type === ShopTypeEnum.Alchemist) {
      text = "Alchemist";
    }
    if (type === ShopTypeEnum.ChthonicFavor) {
      text = "Chthonic Favor";
    }

    return text;
  }

  progressStory() {
    this.storyService.showStory = true;
    this.battleService.checkScene();
  }

  openShop(option: ShopOption, content: any) {
    this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });

    //TODO: prob better way to do this
    if (option.type === ShopTypeEnum.Alchemist && this.globalService.globalVar.alchemy.level === 0)
    {
      this.globalService.globalVar.alchemy.level = 1;
      this.alchemyService.checkForNewRecipes();
    }

    if (option.type === ShopTypeEnum.Crafter || option.type === ShopTypeEnum.General) {
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
          }}
        }
      }
      else
        return a.shopItem > b.shopItem ? negative : a.shopItem < b.shopItem ? positive : 0;
    }
  }

  setupDisplayShopItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = 4;

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
      console.log("Filter equipment: " + this.filterEquipment);
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

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
