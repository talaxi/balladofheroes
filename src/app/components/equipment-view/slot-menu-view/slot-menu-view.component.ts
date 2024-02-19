import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
import { ResourceViewSortEnum } from 'src/app/models/enums/resource-view-sort-enum.model';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  sortType: ResourceViewSortEnum = ResourceViewSortEnum.Quality;
  ascendingSort: boolean = true;

  constructor(private globalService: GlobalService, private lookupService: LookupService, public dialog: MatDialog,
    private gameLoopService: GameLoopService, private dictionaryService: DictionaryService, private deviceDetectorService: DeviceDetectorService) {

  }

  ngOnInit() {
    if (this.globalService.globalVar.settings.get("slotsSortType") !== undefined && this.globalService.globalVar.settings.get("slotsSortType") !== "") 
      this.sortType = this.globalService.globalVar.settings.get("slotsSortType");
      if (this.globalService.globalVar.settings.get("slotsSort") !== undefined && this.globalService.globalVar.settings.get("slotsSort") !== "") 
      this.ascendingSort = this.globalService.globalVar.settings.get("slotsSort");

    this.assignResource();
    this.setupAvailableGems();
  }

  setupAvailableGems() {
    this.globalService.globalVar.settings.set("slotsSortType", this.sortType);

    var showBasicEquipment = this.globalService.globalVar.settings.get("slotsShowBasicFilter") ?? true;
    var showUncommonEquipment = this.globalService.globalVar.settings.get("slotsShowUncommonFilter") ?? true;
    var showRareEquipment = this.globalService.globalVar.settings.get("slotsShowRareFilter") ?? true;
    var showEpicEquipment = this.globalService.globalVar.settings.get("slotsShowEpicFilter") ?? true;
    var showSpecialEquipment = this.globalService.globalVar.settings.get("slotsShowSpecialFilter") ?? true;
    var showExtraordinaryEquipment = this.globalService.globalVar.settings.get("slotsShowExtraordinaryFilter") ?? true;
    var showUniqueEquipment = this.globalService.globalVar.settings.get("slotsShowUniqueFilter") ?? true;

    this.availableGems = this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.SlotItem);

    if (!showBasicEquipment)
      this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Basic);
    if (!showUncommonEquipment)
      this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Uncommon);
    if (!showRareEquipment)
      this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Rare);
    /*if (!showEpicEquipment)
    this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Epic);
    if (!showSpecialEquipment)
    this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Special);
    if (!showExtraordinaryEquipment)
    this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Extraordinary);
    if (!showUniqueEquipment)
    this.availableGems = this.availableGems.filter(item => this.lookupService.getSlotItemQuality(item.item) !== EquipmentQualityEnum.Unique);*/

    this.removeUnavailableGems();

    this.availableGems.sort((a, b) => this.sortSlotItems(a, b));
  }

  toggleSort() {
    this.ascendingSort = !this.ascendingSort;
    this.globalService.globalVar.settings.set("slotsSort", this.ascendingSort);
    this.setupAvailableGems();
  }

  sortSlotItems(a: ResourceValue, b: ResourceValue) {
    var ascending = 1;
    var descending = -1;

    if (!this.ascendingSort) {
      ascending = -1;
      descending = 1;
    }

    if (this.sortType === ResourceViewSortEnum.Quality) {
    var itemA = this.lookupService.getSlotItemQuality(a.item);
    var itemB = this.lookupService.getSlotItemQuality(b.item);

    //if they are the same, sort by name secondarily
    var matchingValue = 0;
    if  (itemA === itemB)
    {
      var nameA = this.dictionaryService.getItemName(a.item);
      var nameB = this.dictionaryService.getItemName(b.item);

      matchingValue = nameA < nameB ? descending : nameA > nameB ? ascending : 0;
    }

    return itemA < itemB ? descending : itemA > itemB ? ascending : matchingValue;
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

  ngAfterViewInit() {
    this.setupClickEvent();
    this.currentSlottedItemCount = document.querySelectorAll('.removeExtra').length;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
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

      this.assignResource();
      this.availableGems = this.availableGems.filter(item => item.amount > 0);
      this.removeUnavailableGems();
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
      this.availableGems = this.availableGems.filter(item => item.amount > 0);
      this.removeUnavailableGems();
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
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.ArmorSlotAddition && item.item !== ItemsEnum.RingSlotAddition &&
        item.item !== ItemsEnum.NecklaceSlotAddition && item.item !== ItemsEnum.ShieldSlotAddition && item.item !== ItemsEnum.MajorArmorSlotAddition && item.item !== ItemsEnum.MajorRingSlotAddition &&
        item.item !== ItemsEnum.MajorNecklaceSlotAddition && item.item !== ItemsEnum.MajorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Shield) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.ArmorSlotAddition && item.item !== ItemsEnum.RingSlotAddition &&
        item.item !== ItemsEnum.NecklaceSlotAddition && item.item !== ItemsEnum.WeaponSlotAddition && item.item !== ItemsEnum.MajorArmorSlotAddition && item.item !== ItemsEnum.MajorRingSlotAddition &&
        item.item !== ItemsEnum.MajorNecklaceSlotAddition && item.item !== ItemsEnum.MajorWeaponSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Ring) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorWeaponSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.ArmorSlotAddition && item.item !== ItemsEnum.WeaponSlotAddition &&
        item.item !== ItemsEnum.NecklaceSlotAddition && item.item !== ItemsEnum.ShieldSlotAddition && item.item !== ItemsEnum.MajorArmorSlotAddition && item.item !== ItemsEnum.MajorWeaponSlotAddition &&
        item.item !== ItemsEnum.MajorNecklaceSlotAddition && item.item !== ItemsEnum.MajorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Necklace) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorArmorSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.ArmorSlotAddition && item.item !== ItemsEnum.RingSlotAddition &&
        item.item !== ItemsEnum.WeaponSlotAddition && item.item !== ItemsEnum.ShieldSlotAddition && item.item !== ItemsEnum.MajorArmorSlotAddition && item.item !== ItemsEnum.MajorRingSlotAddition &&
        item.item !== ItemsEnum.MajorWeaponSlotAddition && item.item !== ItemsEnum.MajorShieldSlotAddition);
    }
    if (this.resourceAsEquipment.equipmentType === EquipmentTypeEnum.Armor) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.WeaponSlotAddition && item.item !== ItemsEnum.RingSlotAddition &&
        item.item !== ItemsEnum.NecklaceSlotAddition && item.item !== ItemsEnum.ShieldSlotAddition && item.item !== ItemsEnum.MajorWeaponSlotAddition && item.item !== ItemsEnum.MajorRingSlotAddition &&
        item.item !== ItemsEnum.MajorNecklaceSlotAddition && item.item !== ItemsEnum.MajorShieldSlotAddition);
    }

    if (this.lookupService.getTotalNumberOfSlots(this.resource) >= 3) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MinorWeaponSlotAddition && item.item !== ItemsEnum.MinorRingSlotAddition &&
        item.item !== ItemsEnum.MinorNecklaceSlotAddition && item.item !== ItemsEnum.MinorShieldSlotAddition && item.item !== ItemsEnum.MinorArmorSlotAddition);

      if (this.selectedItem !== undefined && (this.selectedItem.item === ItemsEnum.MinorWeaponSlotAddition || this.selectedItem.item === ItemsEnum.MinorRingSlotAddition ||
        this.selectedItem.item === ItemsEnum.MinorNecklaceSlotAddition || this.selectedItem.item === ItemsEnum.MinorShieldSlotAddition || this.selectedItem.item === ItemsEnum.MinorArmorSlotAddition))
        this.selectedItem = undefined;
    }

    if (this.lookupService.getTotalNumberOfSlots(this.resource) >= 5) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.WeaponSlotAddition && item.item !== ItemsEnum.RingSlotAddition &&
        item.item !== ItemsEnum.NecklaceSlotAddition && item.item !== ItemsEnum.ShieldSlotAddition && item.item !== ItemsEnum.ArmorSlotAddition);
        
      if (this.selectedItem !== undefined && (this.selectedItem.item === ItemsEnum.WeaponSlotAddition || this.selectedItem.item === ItemsEnum.RingSlotAddition ||
        this.selectedItem.item === ItemsEnum.NecklaceSlotAddition || this.selectedItem.item === ItemsEnum.ShieldSlotAddition || this.selectedItem.item === ItemsEnum.ArmorSlotAddition))      
        this.selectedItem = undefined;
    }

    if (this.lookupService.getTotalNumberOfSlots(this.resource) >= 7) {
      this.availableGems = this.availableGems.filter(item => item.item !== ItemsEnum.MajorWeaponSlotAddition && item.item !== ItemsEnum.MajorRingSlotAddition &&
        item.item !== ItemsEnum.MajorNecklaceSlotAddition && item.item !== ItemsEnum.MajorShieldSlotAddition && item.item !== ItemsEnum.MajorArmorSlotAddition);
        
      if (this.selectedItem !== undefined && (this.selectedItem.item === ItemsEnum.MajorWeaponSlotAddition || this.selectedItem.item === ItemsEnum.MajorRingSlotAddition ||
        this.selectedItem.item === ItemsEnum.MajorNecklaceSlotAddition || this.selectedItem.item === ItemsEnum.MajorShieldSlotAddition || this.selectedItem.item === ItemsEnum.MajorArmorSlotAddition))      
        this.selectedItem = undefined;
    }

    this.availableGems = this.availableGems.filter(item => item.amount > 0);
  }

  openConfirmationDialog() {
    return this.dialog.open(this.confirmationBox, { width: '40%', height: 'auto' });
  }

  openFilterMenu(slotMenuContent: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialogRef = this.dialog.open(slotMenuContent, { width: '60%', height: '65%', panelClass: 'mat-dialog-no-scroll' });

    this.dialogRef.afterClosed().subscribe(() => {
      this.setupAvailableGems();
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
