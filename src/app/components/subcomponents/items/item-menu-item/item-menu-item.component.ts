import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ToolTipRendererDirective } from '../../custom-tooltip/tool-tip-renderer.directive';
import { OverlayRef } from '@angular/cdk/overlay';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

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
  overlayRef: OverlayRef;

  constructor(public lookupService: LookupService, private globalService: GlobalService, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
  }

  getItemName() {
    return this.dictionaryService.getItemName(this.item);
  }
  
  getItemDescription() {
    return this.lookupService.getItemDescription(this.item);
  }

  selectItemFromMenu(type: ItemsEnum) {
    this.globalService.globalVar.itemBelt[this.openedSlotNumber] = type;    
    this.customTooltip.closeToolTip();
  }

  preventRightClick() {
    return false;
  }

  overlayEmitter(overlayRef: OverlayRef) {    
    if (this.overlayRef !== undefined) {      
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }
  
  ngOnDestroy() {
      if (this.overlayRef !== undefined) {         
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
  }
}
