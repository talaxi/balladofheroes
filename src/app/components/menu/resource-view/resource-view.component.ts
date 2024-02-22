import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ResourceViewEnum } from 'src/app/models/enums/resource-view-enum.model';
import { ResourceViewSortEnum } from 'src/app/models/enums/resource-view-sort-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.css']
})
export class ResourceViewComponent implements OnInit {
  resources: ResourceValue[] = [];
  craftingMaterials: ResourceValue[] = [];
  battleItems: ResourceValue[] = [];
  slotItems: ResourceValue[] = [];
  equipmentItems: ResourceValue[] = [];
  progressionResources: ResourceValue[] = [];
  smallCharmResources: ResourceValue[] = [];
  largeCharmResources: ResourceValue[] = [];
  kantharosResources: ResourceValue[] = [];
  tooltipDirection = DirectionEnum.Down;
  slotItemsAreAvailable: boolean = false;
  subscription: any;
  isMobile: boolean = false;

  resourceTabActive: ResourceViewEnum;
  resourceViewEnum = ResourceViewEnum;
  quality = EquipmentQualityEnum;

  sortType: ResourceViewSortEnum = ResourceViewSortEnum.Quality;   
  resourceViewSortEnum = ResourceViewSortEnum;
  ascendingSort: boolean = true;

  constructor(public lookupService: LookupService, private globalService: GlobalService, public dictionaryService: DictionaryService,
    private gameLoopService: GameLoopService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.settings.get("resourcesTabActive") !== undefined && this.globalService.globalVar.settings.get("resourcesTabActive") !== "") 
      this.resourceTabActive = this.globalService.globalVar.settings.get("resourcesTabActive");
    if (this.globalService.globalVar.settings.get("resourcesSortType") !== undefined && this.globalService.globalVar.settings.get("resourcesSortType") !== "") 
      this.sortType = this.globalService.globalVar.settings.get("resourcesSortType");
      if (this.globalService.globalVar.settings.get("resourcesSort") !== undefined && this.globalService.globalVar.settings.get("resourcesSort") !== "") 
      this.ascendingSort = this.globalService.globalVar.settings.get("resourcesSort");

    this.resourceTabActive = ResourceViewEnum.Equipment;
    this.setupResources();
    this.slotItemsAreAvailable = this.slotItems.length > 0 || (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting) !== undefined && this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)!.isUnlocked);
    this.isMobile = this.deviceDetectorService.isMobile();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.setupResources();
    });
  }

  setupResources() {        
    this.globalService.globalVar.settings.set("resourcesSortType", this.sortType);

    this.resources = this.globalService.globalVar.resources.filter(item => (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Resource || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Progression)).sort((a, b) => this.sortResources(a, b));
    this.craftingMaterials = this.globalService.globalVar.resources.filter(item => (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.CraftingMaterial)).sort((a, b) => this.sortCraftingMaterials(a, b));
    this.battleItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.HealingItem || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.BattleItem)).sort((a, b) => this.sortBattleItems(a, b));
    this.equipmentItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment).sort((a, b) => this.sortEquipment(a, b));
    this.slotItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.SlotItem).sort((a, b) => this.sortSlotItems(a, b));
    this.smallCharmResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm && this.dictionaryService.getItemName(item.item).toLowerCase().includes("small")).sort((a, b) => this.sortCharms(a, b));
    this.largeCharmResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm && this.dictionaryService.getItemName(item.item).toLowerCase().includes("large")).sort((a, b) => this.sortCharms(a, b));    

    var coins = this.resources.find(item => item.item === ItemsEnum.Coin);
    if (coins !== undefined)
      coins.amount = Math.round(coins.amount);
  }

  sortEquipment(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    if (this.sortType === ResourceViewSortEnum.Quality) {
      var equipmentA = this.lookupService.getEquipmentPieceByItemType(a.item);
      var equipmentB = this.lookupService.getEquipmentPieceByItemType(b.item);

      var qualityA = equipmentA === undefined ? 0 : equipmentA.quality;
      var qualityB = equipmentB === undefined ? 0 : equipmentB.quality;

      return qualityA < qualityB ? descending : qualityA > qualityB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  sortSlotItems(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    return itemA < itemB ? descending : itemA > itemB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  sortResources(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    /*if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    return itemA < itemB ? descending : itemA > itemB ? ascending : 0;
    }*/

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }
    
    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  sortCraftingMaterials(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    /*if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    return itemA < itemB ? descending : itemA > itemB ? ascending : 0;
    }*/

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }
    
    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  sortBattleItems(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    /*if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    return itemA < itemB ? descending : itemA > itemB ? ascending : 0;
    }*/

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }
    
    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  sortCharms(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    /*if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    return itemA < itemB ? descending : itemA > itemB ? ascending : 0;
    }*/

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }
    
    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  isResourceTracked(resource: ResourceValue) {
    if (this.globalService.globalVar.trackedResources.some(item => item === resource.item)) {
      return true;
    }

    return false;
  }

  setTrackingResource(resource: ResourceValue) {
    if (this.globalService.globalVar.trackedResources.some(item => item === resource.item)) {
      this.globalService.globalVar.trackedResources = this.globalService.globalVar.trackedResources.filter(item => item != resource.item);
    }
    else {
      this.globalService.globalVar.trackedResources.push(resource.item);
    }
  }

  getProgressionDescription(progression: ResourceValue) {
    var description = this.lookupService.getItemDescription(progression.item);
    return description;
  }

  getCharmDescription(charm: ResourceValue) {
    var description = this.lookupService.getItemDescription(charm.item);
    return description;
  }

  toggleDisplayView(type: ResourceViewEnum) {
    this.resourceTabActive = type;

    if (type !== ResourceViewEnum.Equipment && this.sortType === ResourceViewSortEnum.Quality) {
      this.sortType = ResourceViewSortEnum.Name;
      this.globalService.globalVar.settings.set("resourcesSortType", this.sortType);
    }

    this.globalService.globalVar.settings.set("resourcesTabActive", this.resourceTabActive);
  }

  getEquipmentClass(item: ItemsEnum) {
    if (item === undefined)
      return "";

    var equipment = this.lookupService.getEquipmentPieceByItemType(item);
    if (equipment !== undefined) {
      var qualityClass = "bold " + this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType)?.quality);

      return qualityClass;
    }

    return "";
  }

  get2ColumnClass(index: number, totalColumns: number) {
    return {
      'column1': (index + 1) % totalColumns === 1,
      'column2': (index + 1) % totalColumns === 0,
    };
  }

  shouldFlipMaterial(index: number, totalColumns: number) {
    if ((index + 1) % totalColumns === 0)
      return true;

    return false;
  }

  getResourceClass(resource: ResourceValue) {
    if (resource.item === ItemsEnum.ChthonicFavor)
      return "chthonicFavorKeyword";
    if (resource.item === ItemsEnum.ChthonicPower)
      return "chthonicPowerKeyword";
      if (resource.item === ItemsEnum.Ambrosia)
      return "ambrosiaKeyword";
      if (resource.item === ItemsEnum.Coin)
      return "coinKeyword";

    return "";
  }

  isItemPercentage(resource: ItemsEnum) {
    if (resource === ItemsEnum.BoonOfOlympus)
      return true;

    return false;
  }

  toggleSort() {
    this.ascendingSort = !this.ascendingSort;
    this.globalService.globalVar.settings.set("resourcesSort", this.ascendingSort);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
