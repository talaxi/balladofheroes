import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog as MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
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
  dialogRef: MatDialogRef<any, any>;
  @Input() character: Character | undefined;

  constructor(public lookupService: LookupService, private globalService: GlobalService, public dialog: MatDialog,
    private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    if (this.character === undefined)
      this.character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
  }

  getEquippedItemResourceByType(type: EquipmentTypeEnum) {
    var item = this.getEquippedItemByType(type);    
    return item?.associatedResource;
  }

  slottingAvailable(type: EquipmentTypeEnum) {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);      
    return (jewelcrafting !== undefined && jewelcrafting.isUnlocked) || this.equipmentPieceHasSlots(type);
  }

  equipmentPieceHasSlots(type: EquipmentTypeEnum) {
    var item = this.getEquippedItemByType(type);    
    return this.lookupService.equipmentPieceHasSlots(item?.associatedResource);
  }

  getEquippedItemNameByType(type: EquipmentTypeEnum) {
    var itemText = "";
    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      return "Unequipped";

    var itemName = this.dictionaryService.getItemName(item.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(item.quality);
    var extraNameAddition = this.lookupService.getEquipmentExtraNameAddition(item.associatedResource);

    itemText = "<strong class='" + qualityClass + "'>" + itemName + extraNameAddition + "</strong>";

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

  openSlotMenu(slotMenuContent: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '60%', height: '65%', panelClass: 'mat-dialog-no-scroll' });
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

  itemSlotted(slotted: boolean) {
    //this.setUpAvailableEquipment();
  }
  
  enterHoverable(event: any) {    
    this.utilityService.enterHoverable(event);
  }

  leaveHoverable() {    
    this.utilityService.leaveHoverable();
  }
}
