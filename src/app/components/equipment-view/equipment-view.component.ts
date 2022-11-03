import { Component, Input, OnInit } from '@angular/core';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.css']
})
export class EquipmentViewComponent implements OnInit {
  @Input() characterType: CharacterEnum = CharacterEnum.Adventurer;
  availableEquipment: ResourceValue[];
  hoveredItem: Equipment;
  public equipmentTypeEnum = EquipmentTypeEnum;

  constructor(private globalService: GlobalService, public lookupService: LookupService) { }

  ngOnInit(): void {
    this.availableEquipment = this.globalService.globalVar.resources.filter(item => item.type === ItemTypeEnum.Equipment);


  }

  hoverItem(item: ResourceValue) {
    var hoveredEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    if (hoveredEquipmentPiece !== undefined)
      this.hoveredItem = hoveredEquipmentPiece;
  }

  equipItem(item: ResourceValue) { 
    console.log("Equipping");
    var selectedEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    console.log(selectedEquipmentPiece);
    if (selectedEquipmentPiece === undefined)
      return;

    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
    console.log(character);
    if (character === undefined)
      return;

    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Weapon)
      character.equipmentSet.weapon = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Shield)
      character.equipmentSet.shield = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Armor)
      character.equipmentSet.armor = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Ring)
      character.equipmentSet.rightRing = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Ring)
      character.equipmentSet.leftRing = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Necklace)
      character.equipmentSet.necklace = selectedEquipmentPiece;

    console.log(character.equipmentSet);
  }

  getEquippedItemNameByType(type: EquipmentTypeEnum) {
    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      return "Unequipped";

    return this.lookupService.getItemName(item.itemType);
  }

  getEquippedComparisonItem() {
    var comparisonItem = undefined;
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
    if (character === undefined)
      return comparisonItem;

    comparisonItem = character.equipmentSet.getPieceBasedOnType(this.hoveredItem.equipmentType);

    return comparisonItem;
  }

  getEquippedItemByType(type: EquipmentTypeEnum) {
    var comparisonItem = undefined;
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
    if (character === undefined)
      return comparisonItem;

    comparisonItem = character.equipmentSet.getPieceBasedOnType(type);

    return comparisonItem;
  }
}
