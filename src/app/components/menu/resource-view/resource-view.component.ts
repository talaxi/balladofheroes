import { Component, OnInit } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
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

  constructor(public lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.resources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && (item.type === ItemTypeEnum.Resource || item.type === ItemTypeEnum.HealingItem || item.type === ItemTypeEnum.BattleItem || item.type === ItemTypeEnum.CraftingMaterial)).sort();
    this.equipmentItems = this.globalService.globalVar.resources.filter(item => item.amount > 0 && item.type === ItemTypeEnum.Equipment).sort();   
    this.progressionResources = this.globalService.globalVar.resources.filter(item => item.amount > 0 && item.type === ItemTypeEnum.Progression).sort();
  }
}
