import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
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
    this.dialog.open(content, { width: '50%', height: '50%', panelClass: 'mat-dialog-no-scroll' });

    /*dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  isUnequipped(type: EquipmentTypeEnum) {
    var isUnequipped = false;

    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      isUnequipped = true;


    return isUnequipped;
  }

  unequipItem(type: EquipmentTypeEnum) {   
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);

    if (character === undefined)
      return;

    if (type === EquipmentTypeEnum.Weapon)
      character.equipmentSet.weapon = undefined;
    if (type === EquipmentTypeEnum.Shield)
      character.equipmentSet.shield = undefined;
    if (type === EquipmentTypeEnum.Armor)
      character.equipmentSet.armor = undefined;
    if (type === EquipmentTypeEnum.Ring)
      character.equipmentSet.rightRing = undefined;
    if (type === EquipmentTypeEnum.Ring)
      character.equipmentSet.leftRing = undefined;
    if (type === EquipmentTypeEnum.Necklace)
      character.equipmentSet.necklace = undefined;

    this.globalService.calculateCharacterBattleStats(character); 
    this.unequipEmitter.emit(false); 
  }
}
