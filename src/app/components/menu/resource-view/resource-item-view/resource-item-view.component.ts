import { Component, Input, OnInit } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import * as pluralize from 'pluralize';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';

@Component({
  selector: 'app-resource-item-view',
  templateUrl: './resource-item-view.component.html',
  styleUrls: ['./resource-item-view.component.css']
})
export class ResourceItemViewComponent implements OnInit {
  @Input() resource: ItemsEnum;
  tooltipDirection = DirectionEnum.Up;
  showTooltip = false;

  constructor(public lookupService: LookupService) { }

  ngOnInit(): void {
  }

  
  getPluralizedItemName(type: ItemsEnum) {
    return pluralize(this.lookupService.getItemName(type));
  }

}
