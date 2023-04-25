import { Component, OnInit } from '@angular/core';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ResourceViewEnum } from 'src/app/models/enums/resource-view-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
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
  tooltipDirection = DirectionEnum.Down;
  slotItemsAreAvailable: boolean = false;

  resourceTabActive: ResourceViewEnum;
  resourceViewEnum = ResourceViewEnum; 
  quality = EquipmentQualityEnum;

  constructor(public lookupService: LookupService, private globalService: GlobalService, public dictionaryService: DictionaryService) { }

  ngOnInit(): void {    
    this.resourceTabActive = ResourceViewEnum.Equipment;

    this.resources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Resource || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Progression)).sort();
    this.craftingMaterials = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.CraftingMaterial)).sort();
    this.battleItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.HealingItem || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.BattleItem)).sort();
    this.equipmentItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment).sort();   
    this.slotItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.SlotItem).sort();   
    //this.progressionResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Progression).sort();
    this.smallCharmResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm && this.dictionaryService.getItemName(item.item).toLowerCase().includes("small")).sort();
    this.largeCharmResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm && this.dictionaryService.getItemName(item.item).toLowerCase().includes("large")).sort();

    this.slotItemsAreAvailable = this.slotItems.length > 0 || (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting) !== undefined && this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)!.isUnlocked);
  }

  isResourceTracked(resource: ResourceValue) {
    if (this.globalService.globalVar.trackedResources.some(item => item === resource.item))
    {
      return true;
    }

    return false;
  }  

  setTrackingResource(resource: ResourceValue) {
    if (this.globalService.globalVar.trackedResources.some(item => item === resource.item))
    {
      this.globalService.globalVar.trackedResources = this.globalService.globalVar.trackedResources.filter(item => item != resource.item);
    }
    else
    {
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
  }

  getEquipmentClass(item: ItemsEnum) {    
    if (item === undefined)
      return "";

    var equipment = this.lookupService.getEquipmentPieceByItemType(item);
    if (equipment !== undefined)
    {
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

getResourceClass(resource: ResourceValue) {
  if (resource.item === ItemsEnum.ChthonicFavor)
    return "chthonicFavorKeyword";
    if (resource.item === ItemsEnum.ChthonicPower)
    return "chthonicPowerKeyword";

  return "";
}

  isItemPercentage(resource: ItemsEnum) {
    if (resource === ItemsEnum.BoonOfOlympus)
      return true;

    return false;
  }
}
