import { Component, Input, OnInit } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-item-belt-item',
  templateUrl: './item-belt-item.component.html',
  styleUrls: ['./item-belt-item.component.css']
})
export class ItemBeltItemComponent implements OnInit {
  @Input() slotNumber: number;
  item: ItemsEnum;

  constructor(public lookupService: LookupService, public battleService: BattleService, private globalService: GlobalService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.itemBelt.length < this.slotNumber)
    return;

    this.item = this.globalService.globalVar.itemBelt[this.slotNumber];
  }

  battleItemInUse(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    return;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    if (item === this.battleService.battleItemInUse && this.battleService.targetbattleItemMode)
      return true;
    else
      return false;
  }

  getItemAmount(slotNumber: number) {
    var amount = 0;

    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    return amount;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    amount = this.lookupService.getResourceAmount(item);

    return amount;
  }

  getSelectedItemImage(slotNumber: number) {
    var src = "assets/svg/";
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    {
      src += "emptyItemSlot.svg";
      return;
    }

    var item = this.globalService.globalVar.itemBelt[slotNumber];

    src = this.lookupService.getItemImage(item);

    return src;
  }

  unselectItemSlot(slotNumber: number) {
    this.globalService.globalVar.itemBelt[slotNumber] = ItemsEnum.None;    
    this.battleService.targetbattleItemMode = false;
  }
  
  getItemName() {
    return this.lookupService.getItemName(this.item);
  }
  
  getItemDescription() {
    return this.lookupService.getItemDescription(this.item);
  }
}
