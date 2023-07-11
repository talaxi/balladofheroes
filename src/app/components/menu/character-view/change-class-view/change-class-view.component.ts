import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-change-class-view',
  templateUrl: './change-class-view.component.html',
  styleUrls: ['./change-class-view.component.css']
})
export class ChangeClassViewComponent implements OnInit {
  @Input() character: Character;
  currentParty: Character[];
  swappingClass: number | undefined;
  allClasses: Character[];

  classRows: Character[][];
  classCells: Character[];

  swapEquipment: boolean;
  swapGods: Boolean;

  constructor(private lookupService: LookupService, private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    var changeClassSwapEquipment = this.globalService.globalVar.settings.get("changeClassSwapEquipment");
    if (changeClassSwapEquipment !== undefined)
      this.swapEquipment = changeClassSwapEquipment;
      
    var changeClassSwapGods = this.globalService.globalVar.settings.get("changeClassSwapGods");
    if (changeClassSwapGods !== undefined)
      this.swapGods = changeClassSwapGods;

    this.currentParty = this.globalService.getActivePartyCharacters(false);

    if (this.character.type === this.currentParty[0].type)
      this.swappingClass = 1;
    if (this.character.type === this.currentParty[1].type)
      this.swappingClass = 2;        

    this.allClasses = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.setupDisplayClasses();
  }

  swapClass(whichClass: number) {
    this.swappingClass = whichClass;
  }

  swapEquipmentToggle() {
    this.globalService.globalVar.settings.set("changeClassSwapEquipment", this.swapEquipment);
  }

  swapGodsToggle() {
    this.globalService.globalVar.settings.set("changeClassSwapGods", this.swapGods);
  }

  getClassName(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.globalService.globalVar.characters.find(item => item.type === type)?.name;
  }

  getClassLevel(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return "Lv " + this.globalService.globalVar.characters.find(item => item.type === type)?.level;
  }

  currentlyAssignedToSameCharacter(type: CharacterEnum) {
    var swappingType = this.swappingClass === 1 ? this.currentParty[0].type : this.currentParty[1].type;
    
    return swappingType === type;
    //return this.character.assignedClass1 === type || this.character.assignedClass2 === type;
  }

  getClassColor(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.lookupService.getCharacterColorClass(type);
  }

  getClassDescription(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.lookupService.getCharacterDescription(type);
  }

  setupDisplayClasses(): void {
    this.classCells = [];
    this.classRows = [];

    //var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= this.allClasses.length; i++) {
      this.classCells.push(this.allClasses[i - 1]);
      if ((i % maxColumns) == 0) {
        this.classRows.push(this.classCells);
        this.classCells = [];
      }
    }

    if (this.classCells.length !== 0)
      this.classRows.push(this.classCells);
  }

  selectNewClass(type: CharacterEnum) {    
    if (this.swappingClass === undefined)
      return;

    var swappingType = 1;
    if (this.swappingClass === 1)
      swappingType = this.globalService.globalVar.activePartyMember1;
    if (this.swappingClass === 2)
      swappingType = this.globalService.globalVar.activePartyMember2;
    var swappingCharacter = this.globalService.globalVar.characters.find(item => item.type === swappingType);    
    var currentHpPercent = 1;
    if (swappingCharacter !== undefined)
      currentHpPercent = swappingCharacter.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(swappingCharacter, true);

    if (this.swapEquipment)    
      this.swapCharacterEquipment(type, swappingType);      
    if (this.swapGods)    
      this.swapCharacterGods(type, swappingType);    
      
    if (this.globalService.globalVar.activePartyMember1 === type && this.swappingClass === 2)
    {      
      this.globalService.globalVar.activePartyMember1 = this.globalService.globalVar.activePartyMember2;
    }

    if (this.globalService.globalVar.activePartyMember2 === type && this.swappingClass === 1)
    {      
      this.globalService.globalVar.activePartyMember2 = this.globalService.globalVar.activePartyMember1;
    }

    if (this.swappingClass === 1)
      this.globalService.globalVar.activePartyMember1 = type;
    else if (this.swappingClass === 2)
      this.globalService.globalVar.activePartyMember2 = type;

    this.menuService.setSelectedCharacter(type);

    this.swappingClass = undefined;
    this.currentParty = this.globalService.getActivePartyCharacters(false);
    this.setupDisplayClasses();

    this.currentParty.forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });

    var swappedToCharacter = this.globalService.globalVar.characters.find(item => item.type === type);
    if (swappedToCharacter !== undefined)
      swappedToCharacter.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(swappedToCharacter, true) * currentHpPercent;
  }

  swapCharacterEquipment(newType: CharacterEnum, oldType: CharacterEnum) {
    var character1 = this.globalService.globalVar.characters.find(item => item.type === newType);
    var character2 = this.globalService.globalVar.characters.find(item => item.type === oldType);

    if (character1 === undefined || character2 === undefined)
      return;

    var character1Weapon = character1.equipmentSet.weapon;
    var character2Weapon = character2.equipmentSet.weapon;
    //character1.equipmentSet.weapon = character2Weapon;
    //character2.equipmentSet.weapon = character1Weapon;
    this.globalService.unequipItem(EquipmentTypeEnum.Weapon, character1.type);
    this.globalService.unequipItem(EquipmentTypeEnum.Weapon, character2.type);
    this.globalService.equipItem(character2Weapon, character1);
    this.globalService.equipItem(character1Weapon, character2);

    var character1Armor = character1.equipmentSet.armor;
    var character2Armor = character2.equipmentSet.armor;
    //character1.equipmentSet.armor = character2Armor;
    //character2.equipmentSet.armor = character1Armor;
    this.globalService.unequipItem(EquipmentTypeEnum.Armor, character1.type);
    this.globalService.unequipItem(EquipmentTypeEnum.Armor, character2.type);
    this.globalService.equipItem(character2Armor, character1);
    this.globalService.equipItem(character1Armor, character2);

    var character1Shield = character1.equipmentSet.shield;
    var character2Shield = character2.equipmentSet.shield;
    //character1.equipmentSet.shield = character2Shield;
    //character2.equipmentSet.shield = character1Shield;
    this.globalService.unequipItem(EquipmentTypeEnum.Shield, character1.type);
    this.globalService.unequipItem(EquipmentTypeEnum.Shield, character2.type);
    this.globalService.equipItem(character2Shield, character1);
    this.globalService.equipItem(character1Shield, character2);

    var character1Ring = character1.equipmentSet.ring;
    var character2Ring = character2.equipmentSet.ring;
    //character1.equipmentSet.ring = character2Ring;
    //character2.equipmentSet.ring = character1Ring;
    
    this.globalService.unequipItem(EquipmentTypeEnum.Ring, character1.type);
    this.globalService.unequipItem(EquipmentTypeEnum.Ring, character2.type);
    this.globalService.equipItem(character2Ring, character1);
    this.globalService.equipItem(character1Ring, character2);

    var character1Necklace = character1.equipmentSet.necklace;
    var character2Necklace = character2.equipmentSet.necklace;
    //character1.equipmentSet.necklace = character2Necklace;
    //character2.equipmentSet.necklace = character1Necklace;
    
    this.globalService.unequipItem(EquipmentTypeEnum.Necklace, character1.type);
    this.globalService.unequipItem(EquipmentTypeEnum.Necklace, character2.type);
    this.globalService.equipItem(character2Necklace, character1);
    this.globalService.equipItem(character1Necklace, character2);
  }

  swapCharacterGods(newType: CharacterEnum, oldType: CharacterEnum) {
    var character1 = this.globalService.globalVar.characters.find(item => item.type === newType);
    var character2 = this.globalService.globalVar.characters.find(item => item.type === oldType);

    if (character1 === undefined || character2 === undefined)
      return;

      
    var character1God1 = character1.assignedGod1;
    var character2God1 = character2.assignedGod1;
    character1.assignedGod1 = character2God1;
    character2.assignedGod1 = character1God1;

    var character1God2 = character1.assignedGod2;
    var character2God2 = character2.assignedGod2;
    character1.assignedGod2 = character2God2;
    character2.assignedGod2 = character1God2;
  }
}
