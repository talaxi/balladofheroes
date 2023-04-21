import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MatDialog } from '@angular/material/dialog';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

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
  @ViewChild('confirmationBox') confirmationBox: any;
  confirmationText = "";
  subscription: any;
  currentSlottedItemCount: number;

  constructor(private globalService: GlobalService, private lookupService: LookupService, public dialog: MatDialog,
    private gameLoopService: GameLoopService, private dictionaryService: DictionaryService) {

  }

  ngOnInit() {
    this.assignResource();
    this.availableGems = this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.SlotItem);
    this.removeUnavailableGems();
  }

  ngAfterViewInit() {
    this.setupClickEvent();
    this.currentSlottedItemCount = document.querySelectorAll('.removeExtra').length;

    this.subscription =  this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      var divs = document.querySelectorAll('.removeExtra');
      if (divs.length !== this.currentSlottedItemCount) {        
        this.currentSlottedItemCount = divs.length;
        this.setupClickEvent();
      }
    });
  }

  setupClickEvent() {    
    var divs = document.querySelectorAll('.removeExtra');    
    divs.forEach(el => el.removeEventListener('click', () => this.removeGem(el)));
    divs.forEach(el => el.addEventListener('click', () => this.removeGem(el)));
  }

  removeGem(el: Element) {
    var className = el.getAttribute("class");
    var itemEnumValue = className?.split(" ")[4];
    if (itemEnumValue !== undefined) {
      var gem = parseInt(itemEnumValue);

      this.confirmationText = this.getItemName(new ResourceValue(gem, 1)) + " (" + this.getItemDescription(new ResourceValue(gem, 1)) + ") will be lost forever if you remove it. Continue?";
      var dialogRef = this.openConfirmationDialog();

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.unslotItem(gem);
        }
      });
    }
  }

  getItemName(gem: ResourceValue) {
    return "<strong class='" + this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(gem.item)) + "'>" + this.dictionaryService.getItemName(gem.item) + "</strong>";
  }

  getItemNameWithCount(gem: ResourceValue) {
    return "<strong class='" + this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(gem.item)) + "'>" + this.dictionaryService.getItemName(gem.item) + "</strong> x" + gem.amount;
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
      this.resource = this.lookupService.makeResourceCopy(this.globalService.addExtraToBaseResource(this.lookupService.makeResourceCopy(this.resource), this.selectedItem.item));
      this.itemSlottedEmitter.emit(true);

      if (this.isResourceEquipped) {
        var equippedItem = undefined;
        var character = this.globalService.globalVar.characters.find(item => item.type === this.equippedCharacter);
        if (character !== undefined) {
          var equipment = this.lookupService.getEquipmentPieceByItemType(this.resource.item);
          if (equipment !== undefined) {
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

  unslotItem(itemToUnslot: ItemsEnum) {
    if (itemToUnslot !== undefined) {
      this.resource = this.lookupService.makeResourceCopy(this.globalService.removeExtraFromBaseResource(this.lookupService.makeResourceCopy(this.resource), itemToUnslot));
      this.itemSlottedEmitter.emit(true);

      if (this.isResourceEquipped) {
        var equippedItem = undefined;
        var character = this.globalService.globalVar.characters.find(item => item.type === this.equippedCharacter);
        if (character !== undefined) {
          var equipment = this.lookupService.getEquipmentPieceByItemType(this.resource.item);
          if (equipment !== undefined) {
            equippedItem = character.equipmentSet.getPieceBasedOnType(equipment.equipmentType);
            if (equippedItem !== undefined)
              equippedItem.associatedResource = this.resource;
          }
        }
      }

      this.assignResource();
    }
  }

  assignResource() {
    var resourceAsEquipment = this.lookupService.getEquipmentPieceByItemType(this.resource.item);
    if (resourceAsEquipment !== undefined)
      this.resourceAsEquipment = resourceAsEquipment;
  }

  slotsAvailable() {
    if (this.lookupService.isItemAddingASlot(this.selectedItem === undefined ? ItemsEnum.None : this.selectedItem.item))
      return (this.lookupService.getMaxSlotsPerItem(this.resource) - this.lookupService.getTotalNumberOfSlots(this.resource)) > 0;
    else
      return this.lookupService.getNumberOfOpenSlots(this.resource);
  }

  closeModal() {
    this.dialogRef.close();
  }

  removeUnavailableGems() {
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Weapon) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Shield) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorWeaponSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Ring) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorWeaponSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Necklace) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Armor) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition);
    }

    if (this.resourceAsEquipment.quality > EquipmentQualityEnum.Rare) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.MinorArmorSlotAddition);
    }
  }

  openConfirmationDialog() {
    return this.dialog.open(this.confirmationBox, { width: '40%', height: 'auto' });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
