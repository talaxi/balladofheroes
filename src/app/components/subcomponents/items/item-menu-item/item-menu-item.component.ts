import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ToolTipRendererDirective } from '../../custom-tooltip/tool-tip-renderer.directive';

@Component({
  selector: 'app-item-menu-item',
  templateUrl: './item-menu-item.component.html',
  styleUrls: ['./item-menu-item.component.css']
})
export class ItemMenuItemComponent implements OnInit {
  @Input() totalItemAmount: number;
  @Input() item: ItemsEnum;
  @Input() openedSlotNumber: number;
  showTooltip = true;
  @ViewChild(ToolTipRendererDirective) customTooltip: ToolTipRendererDirective;

  constructor(public lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  getItemName() {
    return this.lookupService.getItemName(this.item);
  }
  
  getItemDescription() {
    return this.lookupService.getItemDescription(this.item);
  }

  selectItemFromMenu(type: ItemsEnum) {
    this.globalService.globalVar.itemBelt[this.openedSlotNumber] = type;    
    this.customTooltip.closeToolTip();
  }
}
