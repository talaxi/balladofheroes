import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-current-equipment-view',
  templateUrl: './current-equipment-view.component.html',
  styleUrls: ['./current-equipment-view.component.css']
})
export class CurrentEquipmentViewComponent implements OnInit {
  public equipmentTypeEnum = EquipmentTypeEnum;
  @Input() characterType: CharacterEnum = CharacterEnum.Adventurer;
  @Input() canChangeEquipment: boolean = false;
  equipmentModalOpened = false;
  @Output() unequipEmitter = new EventEmitter<boolean>();

  constructor(public lookupService: LookupService, private globalService: GlobalService, public dialog: MatDialog,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  getEquippedItemNameByType(type: EquipmentTypeEnum) {
    var itemText = "";
    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      return "Unequipped";

    var itemName = this.lookupService.getItemName(item.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(item);

    itemText = "<strong class='" + qualityClass + "'>" + itemName + "</strong>";

    return itemText;
  }


  getEquippedItemByType(type: EquipmentTypeEnum) {
    var comparisonItem = undefined;
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
    if (character === undefined)
      return comparisonItem;

    comparisonItem = character.equipmentSet.getPieceBasedOnType(type);

    return comparisonItem;
  }

  openEquipmentModal(content: any) {
    this.equipmentModalOpened = true;
    this.dialog.open(content, { width: '50%', height: '55%', panelClass: 'mat-dialog-no-scroll' });
  }

  isUnequipped(type: EquipmentTypeEnum) {
    var isUnequipped = false;

    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      isUnequipped = true;


    return isUnequipped;
  }

  unequipItem(type: EquipmentTypeEnum) { 
    this.globalService.unequipItem(type, this.characterType);
    this.unequipEmitter.emit(false); 
  }
}
