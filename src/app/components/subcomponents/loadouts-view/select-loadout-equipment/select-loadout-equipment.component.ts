import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ResourceViewSortEnum } from 'src/app/models/enums/resource-view-sort-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-select-loadout-equipment',
  templateUrl: './select-loadout-equipment.component.html',
  styleUrls: ['./select-loadout-equipment.component.css']
})
export class SelectLoadoutEquipmentComponent {
  @Output() selectedEquipmentEmitter = new EventEmitter<Equipment>();
  @Input() dialogRef: MatDialogRef<any, any>;
  @Input() equipmentPieceType: EquipmentTypeEnum = EquipmentTypeEnum.None;
  subscription: any;
  availableEquipment: ResourceValue[] = [];
  hoveredItem: Equipment;
  hoveredItemAsResource: ResourceValue;
  sortType: ResourceViewSortEnum = ResourceViewSortEnum.Quality;  
  ascendingSort: boolean = true; 

  constructor(private lookupService: LookupService, private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService,
    private dictionaryService: DictionaryService, private utilityService: UtilityService) {

  }
  ngOnInit(): void {    
    this.setUpAvailableEquipment();   
  }

  setUpAvailableEquipment() {    
    this.availableEquipment = [];
    this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment).forEach(equip => {
      if (equip !== undefined) {
        var equipmentPiece = this.lookupService.getEquipmentPieceByItemType(equip.item);
        if (equipmentPiece === undefined)
          return; 

        if ((equipmentPiece.equipmentType === EquipmentTypeEnum.Weapon && this.equipmentPieceType !== EquipmentTypeEnum.Weapon) ||
        (equipmentPiece.equipmentType === EquipmentTypeEnum.Shield && this.equipmentPieceType !== EquipmentTypeEnum.Shield) ||
         (equipmentPiece.equipmentType === EquipmentTypeEnum.Armor && this.equipmentPieceType !== EquipmentTypeEnum.Armor) ||
        (equipmentPiece.equipmentType === EquipmentTypeEnum.Ring && this.equipmentPieceType !== EquipmentTypeEnum.Ring) ||
        (equipmentPiece.equipmentType === EquipmentTypeEnum.Necklace && this.equipmentPieceType !== EquipmentTypeEnum.Necklace))
          return;

        this.availableEquipment.push(this.lookupService.makeResourceCopy(equip));
      }
    });

    this.availableEquipment = this.availableEquipment.filter(item => item.amount > 0).sort((a, b) => this.sortEquipment(a, b));
  }

  sortEquipment(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    if (this.sortType === ResourceViewSortEnum.Quality) {
      var equipmentA = this.lookupService.getEquipmentPieceByItemType(a.item);
      var equipmentB = this.lookupService.getEquipmentPieceByItemType(b.item);

      var qualityA = equipmentA === undefined ? 0 : equipmentA.quality;
      var qualityB = equipmentB === undefined ? 0 : equipmentB.quality;

      return qualityA < qualityB ? descending : qualityA > qualityB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.Name) {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      return nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }

    if (this.sortType === ResourceViewSortEnum.EnumValue) {      
      return a.item < b.item ? descending : a.item > b.item ? ascending : 0;
    }

    return ascending;
  }

  hoverItem(item: ResourceValue) {
    this.hoveredItemAsResource = item;
    var hoveredEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    if (hoveredEquipmentPiece !== undefined)
      this.hoveredItem = hoveredEquipmentPiece;
  }

  equipItem(item: ResourceValue) {
    var selectedEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    if (selectedEquipmentPiece === undefined)
      return;

    selectedEquipmentPiece.associatedResource = item;

    this.selectedEquipmentEmitter.emit(selectedEquipmentPiece);
    this.dialogRef.close();
  }

  getEquipmentName(equipment: ResourceValue) {
    var name = this.dictionaryService.getItemName(equipment.item);
    var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.item)?.quality);
    var extraNameAddition = this.lookupService.getEquipmentExtraNameAddition(equipment);

    return this.utilityService.getSanitizedHtml("<strong class='" + qualityClass + "'>" + name + extraNameAddition + "</strong> x" + equipment.amount);
  }

  getEquipmentNameFromEquipment(equipment: Equipment) {
    var name = this.dictionaryService.getItemName(equipment.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType)?.quality);

    return this.utilityService.getSanitizedHtml("<strong class='" + qualityClass + "'>" + name + "</strong>");
  }

  
  toggleSort() {
    this.ascendingSort = !this.ascendingSort;
    this.setUpAvailableEquipment();
  }

}
