import { Component, OnInit } from '@angular/core';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.css']
})
export class ResourceViewComponent implements OnInit {  
  resources: ResourceValue[] = [];
  equipmentItems: ResourceValue[] = [];
  progressionResources: ResourceValue[] = [];
  charmResources: ResourceValue[] = [];
  tooltipDirection = DirectionEnum.Down;

  constructor(public lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.resources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Resource || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.HealingItem || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.BattleItem || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.CraftingMaterial)).sort();
    this.equipmentItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment).sort();   
    this.progressionResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Progression).sort();
    this.charmResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm).sort();
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

  getCharmDescription(charm: ResourceValue) {
    var description = this.lookupService.getItemDescription(charm.item);
    return description;
  }

  isItemPercentage(resource: ItemsEnum) {
    if (resource === ItemsEnum.BoonOfOlympus)
      return true;

    return false;
  }
}
