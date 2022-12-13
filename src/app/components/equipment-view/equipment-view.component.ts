import { Component, Input, OnInit } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
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

  constructor(private globalService: GlobalService, public lookupService: LookupService, private gameLoopService: GameLoopService,
    private menuService: MenuService, private utilityService: UtilityService) { }

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
    this.globalService.globalVar.resources.filter(item => item.type === ItemTypeEnum.Equipment).forEach(equip => {
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
      character.equipmentSet.weapon = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Shield)
      character.equipmentSet.shield = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Armor)
      character.equipmentSet.armor = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Ring)
      character.equipmentSet.ring = selectedEquipmentPiece;
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Necklace)
      character.equipmentSet.necklace = selectedEquipmentPiece;

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

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
