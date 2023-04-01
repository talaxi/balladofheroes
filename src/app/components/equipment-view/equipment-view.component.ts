import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.css']
})
export class EquipmentViewComponent implements OnInit {
  subscription: any;
  @Input() characterType: CharacterEnum = CharacterEnum.Adventurer;
  character: Character;
  availableEquipment: ResourceValue[] = [];
  hoveredItem: Equipment;
  public equipmentTypeEnum = EquipmentTypeEnum;
  public partyMembers: Character[];
  itemToSellSelected = false;
  itemToSell: Equipment;
  itemToSellPrice: number;
  sellAmount: number = 1;

  constructor(private globalService: GlobalService, public lookupService: LookupService, private gameLoopService: GameLoopService,
    private menuService: MenuService, private utilityService: UtilityService, public dialog: MatDialog, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.characterType = this.menuService.selectedCharacter === undefined ? CharacterEnum.Adventurer : this.menuService.selectedCharacter;
    this.setUpAvailableEquipment();
    if (this.globalService.globalVar.characters.some(item => item.type === this.characterType))
      this.character = this.globalService.globalVar.characters.find(item => item.type === this.characterType)!;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.characterType = this.menuService.selectedCharacter === undefined ? CharacterEnum.Adventurer : this.menuService.selectedCharacter;

      if (this.globalService.globalVar.characters.some(item => item.type === this.characterType))
        this.character = this.globalService.globalVar.characters.find(item => item.type === this.characterType)!;
    });
  }

  setUpAvailableEquipment() {
    this.availableEquipment = [];
    this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment).forEach(equip => {
      if (equip !== undefined)
        this.availableEquipment.push(equip.makeCopy());
    });

    this.globalService.globalVar.characters.forEach(character => {
      var weapon = this.availableEquipment.find(item => item.item === character.equipmentSet.weapon?.itemType);
      if (weapon !== undefined)
        weapon.amount -= 1;

      var shield = this.availableEquipment.find(item => item.item === character.equipmentSet.shield?.itemType);
      if (shield !== undefined)
        shield.amount -= 1;

      var armor = this.availableEquipment.find(item => item.item === character.equipmentSet.armor?.itemType);
      if (armor !== undefined)
        armor.amount -= 1;

      var ring = this.availableEquipment.find(item => item.item === character.equipmentSet.ring?.itemType);
      if (ring !== undefined)
        ring.amount -= 1;

      var necklace = this.availableEquipment.find(item => item.item === character.equipmentSet.necklace?.itemType);
      if (necklace !== undefined)
        necklace.amount -= 1;
    });

    this.availableEquipment = this.availableEquipment.filter(item => item.amount > 0);
  }

  hoverItem(item: ResourceValue) {
    var hoveredEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    if (hoveredEquipmentPiece !== undefined)
      this.hoveredItem = hoveredEquipmentPiece;
  }

  equipItem(item: ResourceValue) {
    var selectedEquipmentPiece = this.lookupService.getEquipmentPieceByItemType(item.item);
    if (selectedEquipmentPiece === undefined)
      return;

    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);

    if (character === undefined)
      return;

    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Weapon)
    {
      if (character.equipmentSet.weapon !== undefined)
        this.globalService.unequipItem(EquipmentTypeEnum.Weapon, character.type);
      character.equipmentSet.weapon = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Shield)
    {
      if (character.equipmentSet.shield !== undefined)
        this.globalService.unequipItem(EquipmentTypeEnum.Shield, character.type);
      character.equipmentSet.shield = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Armor)
    {
      if (character.equipmentSet.armor !== undefined)
        this.globalService.unequipItem(EquipmentTypeEnum.Armor, character.type);
      character.equipmentSet.armor = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Ring)
    {
      if (character.equipmentSet.ring !== undefined)
        this.globalService.unequipItem(EquipmentTypeEnum.Ring, character.type);
      character.equipmentSet.ring = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Necklace)
    {
      if (character.equipmentSet.necklace !== undefined)
        this.globalService.unequipItem(EquipmentTypeEnum.Necklace, character.type);
      character.equipmentSet.necklace = selectedEquipmentPiece;
    }

    if (selectedEquipmentPiece.equipmentEffect.trigger === EffectTriggerEnum.TriggersEvery &&
      selectedEquipmentPiece.equipmentEffect.triggersEveryCount === 0) {
      if (selectedEquipmentPiece.equipmentEffect.userEffect.length > 0)
        selectedEquipmentPiece.equipmentEffect.triggersEveryCount = selectedEquipmentPiece.equipmentEffect.userEffect[0].triggersEvery;
      else if (selectedEquipmentPiece.equipmentEffect.targetEffect.length > 0)
        selectedEquipmentPiece.equipmentEffect.triggersEveryCount = selectedEquipmentPiece.equipmentEffect.targetEffect[0].triggersEvery;
    }

    this.globalService.calculateCharacterBattleStats(character);
    this.setUpAvailableEquipment();
  }

  itemUnequipped($event: boolean) {
    this.setUpAvailableEquipment();
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

  getEquipmentName(equipment: ResourceValue) {
    var name = this.lookupService.getItemName(equipment.item);
    var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.item));

    return this.utilityService.getSanitizedHtml("<strong class='" + qualityClass + "'>" + name + "</strong> x" + equipment.amount);
  }
  
  getEquipmentNameFromEquipment(equipment: Equipment) {
    var name = this.lookupService.getItemName(equipment.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType));

    return this.utilityService.getSanitizedHtml("<strong class='" + qualityClass + "'>" + name + "</strong>");
  }

  equipmentGain() {
    var characterStats = new CharacterStats(this.character.equipmentSet.getTotalMaxHpGain(),
      this.character.equipmentSet.getTotalAttackGain(), this.character.equipmentSet.getTotalDefenseGain(),
      this.character.equipmentSet.getTotalAgilityGain(), this.character.equipmentSet.getTotalLuckGain(), this.character.equipmentSet.getTotalResistanceGain());
    var equipmentStats = "";

    if (characterStats.attack > 0)
      equipmentStats += "+" + characterStats.attack.toString() + " Attack<br />";
    if (characterStats.defense > 0)
      equipmentStats += "+" + characterStats.defense + " Defense<br />";
    if (characterStats.maxHp > 0)
      equipmentStats += "+" + characterStats.maxHp + " Max HP<br />";
    if (characterStats.agility > 0)
      equipmentStats += "+" + characterStats.agility + " Agility<br />";
    if (characterStats.luck > 0)
      equipmentStats += "+" + characterStats.luck + " Luck<br />";
    if (characterStats.resistance > 0)
      equipmentStats += "+" + characterStats.resistance + " Resistance<br />";

    return this.utilityService.getSanitizedHtml(equipmentStats);
  }

  setSellItem(equipment: ResourceValue) {
    var equipmentPiece = this.lookupService.getEquipmentPieceByItemType(equipment.item);

    if (!this.itemToSellSelected || this.itemToSell.itemType !== equipmentPiece?.itemType) {      
      if (equipmentPiece !== undefined) {
        this.itemToSell = equipmentPiece;
        this.itemToSellSelected = true;
        this.itemToSellPrice = this.lookupService.getItemSellPrice(equipment.item);
        this.sellAmount = 1;
      }
    }
    else {      
        this.sellAmount = 1;
        this.itemToSellSelected = false;
    }
  }

  getTotalItemToSellAmount() {
    return this.lookupService.getResourceAmount(this.itemToSell.itemType) - this.lookupService.getItemEquipCount(this.itemToSell.itemType);
  }

  changeSellAmount(amount: number) {
    this.sellAmount = amount;
  }

  sellItem() {
    if (this.getTotalItemToSellAmount() >= this.sellAmount)
    {
      this.lookupService.useResource(this.itemToSell.itemType, this.sellAmount);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, this.sellAmount * this.itemToSellPrice)); 
    }

    if (this.getTotalItemToSellAmount() <= 0)
    {
      this.sellAmount = 1;
      this.itemToSellSelected = false;
    }
    
    this.setUpAvailableEquipment();
  }

  //TODO
  equipmentPieceHasSlots(equipment: ResourceValue) {
    return true;
    //return equipment.
  }

  openSlotMenu(equipment: ResourceValue, slotMenuContent: any) {    
  if (this.deviceDetectorService.isMobile())
    this.dialog.open(slotMenuContent, { width: '95%', height: '80%' });
  else 
    this.dialog.open(slotMenuContent, { width: '75%', minHeight: '75vh', maxHeight: '75vh', id: 'dialogNoPadding' });  
  }

  closeModal() {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
