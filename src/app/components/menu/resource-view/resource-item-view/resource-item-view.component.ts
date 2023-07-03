import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import * as pluralize from 'pluralize';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-resource-item-view',
  templateUrl: './resource-item-view.component.html',
  styleUrls: ['./resource-item-view.component.css']
})
export class ResourceItemViewComponent implements OnInit {
  @Input() resource: ItemsEnum;
  tooltipDirection = DirectionEnum.Up;
  showTooltip = false;
  @Input() canSetTrackingResource: boolean = false;
  @Input() displayItemQualityColor: boolean = false;
  @Input() flipToolTip: boolean = false;
  @ViewChild('spanElement') spanElementRef: ElementRef;

  constructor(public lookupService: LookupService, public globalService: GlobalService, private utilityService: UtilityService,
    private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
  }

  
  getPluralizedItemName(type: ItemsEnum) {
    return this.utilityService.handlePlural(this.dictionaryService.getItemName(type));
  }

  setTrackingResource() {
    if (!this.canSetTrackingResource)
      return;

    if (this.globalService.globalVar.trackedResources.some(item => item === this.resource))
    {
      this.globalService.globalVar.trackedResources = this.globalService.globalVar.trackedResources.filter(item => item != this.resource);
    }
    else
    {
      this.globalService.globalVar.trackedResources.push(this.resource);
    }
  }

  getEquipmentClass() {    
    if (this.resource === undefined)
      return "";

    var qualityClass = "bold " + this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(this.resource));

    return qualityClass;    
  }
  
  shouldShowTooltip(show: boolean) {
    this.showTooltip = show;    

    if (!show)
      this.globalService.globalVar.settings.set("viewAllResourceLocations", false);
  }
}
