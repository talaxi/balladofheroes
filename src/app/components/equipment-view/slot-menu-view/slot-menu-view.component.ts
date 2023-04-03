import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MatDialog } from '@angular/material/dialog';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';

@Component({
  selector: 'app-slot-menu-view',
  templateUrl: './slot-menu-view.component.html',
  styleUrls: ['./slot-menu-view.component.css']
})
export class SlotMenuViewComponent {
  @Input() resource: ResourceValue;
  @Input() dialogRef: any;
  resourceAsEquipment: Equipment;
  availableGems: ResourceValue[] = [];
  hoveredItem: ResourceValue;
  selectedItem: ResourceValue | undefined;
  @Output() itemSlottedEmitter = new EventEmitter<boolean>();
  @Input() isResourceEquipped: boolean = false;
  @Input() equippedCharacter: CharacterEnum;

  constructor(private globalService: GlobalService, private lookupService: LookupService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.assignResource();
    this.availableGems = this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.SlotItem)
  }

  getItemName(gem: ResourceValue) {
    return "<strong class='" + this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(gem.item)) + "'>" + this.lookupService.getItemName(gem.item) + "</strong> x" + gem.amount;
  }

  hoverGem(gem: ResourceValue) {
    this.hoveredItem = gem;
  }

  selectGem(gem: ResourceValue) {
    this.selectedItem = gem;
  }

  getItemDescription(gem: ResourceValue) {
    return this.lookupService.getItemDescription(gem.item);
  }

  slotItem() {
    if (this.selectedItem !== undefined) {
      this.resource = this.globalService.addExtraToBaseResource(this.resource.makeCopy(), this.selectedItem.item).makeCopy();
      this.itemSlottedEmitter.emit(true);

      if (this.isResourceEquipped) {
        var equippedItem = undefined;
        var character = this.globalService.globalVar.characters.find(item => item.type === this.equippedCharacter);
        if (character !== undefined)
        {
          var equipment = this.lookupService.getEquipmentPieceByItemType(this.resource.item);
          if (equipment !== undefined)
          {
            equippedItem = character.equipmentSet.getPieceBasedOnType(equipment.equipmentType);
            if (equippedItem !== undefined)
              equippedItem.associatedResource = this.resource;            
          }
        }
      }

      this.selectedItem = undefined;
      this.assignResource();
    }
  }

  assignResource() {
    var resourceAsEquipment = this.lookupService.getEquipmentPieceByItemType(this.resource.item);
    if (resourceAsEquipment !== undefined)
      this.resourceAsEquipment = resourceAsEquipment;
  }

  slotsAvailable() {
    return this.lookupService.getNumberOfOpenSlots(this.resource);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
