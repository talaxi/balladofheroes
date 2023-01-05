import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { Ability } from 'src/app/models/character/ability.model';
import { God } from 'src/app/models/character/god.model';
import { matMenuAnimations, MatMenuTrigger } from '@angular/material/menu';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})

export class PartyComponent implements OnInit {
  party: Character[];
  public characterEnum: CharacterEnum;
  public noCharacter = CharacterEnum.None;
  public noGod = GodEnum.None;
  @ViewChild('itemMenu') itemMenu: MatMenuTrigger;
  openedSlotNumber: number = 0;
  itemMenuClass = "itemMenu";
  battleItems: ResourceValue[];
  battleItemRows: ResourceValue[][];
  battleItemCells: ResourceValue[];
  activeCharacterCount: number;
  subscription: any;
  partyMember1CheckSubscription: any;
  partyMember2CheckSubscription: any;

  constructor(private globalService: GlobalService, public lookupService: LookupService, public battleService: BattleService,
    private gameLoopService: GameLoopService, private menuService: MenuService, private utilityService: UtilityService,
    private dpsCalculatorService: DpsCalculatorService) { }

  ngOnInit(): void {
    this.party = this.globalService.getActivePartyCharacters(false);   
    this.activeCharacterCount = this.party.filter(item => item.type !== CharacterEnum.None).length;
        
    this.battleItems = this.globalService.globalVar.resources.filter(item => item.type === ItemTypeEnum.HealingItem || item.type === ItemTypeEnum.BattleItem);   

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      if (!this.itemMenu.menuOpen)
      {
        this.battleItems = this.globalService.globalVar.resources.filter(item => item.type === ItemTypeEnum.HealingItem || item.type === ItemTypeEnum.BattleItem);   
      }

      this.removeDefaultMaterialButtonClasses();
    });

    this.partyMember1CheckSubscription = this.menuService.getNewPartyMember1().subscribe((value) => {      
      this.party = this.globalService.getActivePartyCharacters(false);   
    });

    this.partyMember1CheckSubscription = this.menuService.getNewPartyMember2().subscribe((value) => {      
      this.party = this.globalService.getActivePartyCharacters(false);   
    });
  }

  ngAfterViewInit() {
    this.removeDefaultMaterialButtonClasses();   
  }

  removeDefaultMaterialButtonClasses() {
    var elements = document.getElementsByClassName('mat-icon-button');
    var elementLength = elements.length;
    
    if (elements !== null && elements !== undefined && elementLength > 0) {
      for (var i = 0; i < elementLength; i++) {        
        elements[0].removeAttribute("class");
      }
    } 
  }

  isOverdriveAvailable(character: Character) {
    return character.level >= this.utilityService.characterOverdriveLevel;
  }

  getCharacterHpPercent(character: Character) {    
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
  }

  getCharacterBarrierValue(character: Character) {    
    return character.battleInfo.barrierValue;
  }

  getCharacterOverdrivePercent(character: Character) {
    return (character.overdriveInfo.overdriveGaugeAmount / character.overdriveInfo.overdriveGaugeTotal) * 100;
  }

  getCharacterGodName(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return god.name;
    }

    return "";
  }

  getCharacterGodLevel(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return god.level;
    }

    return "";
  }

  getSelectedItemImage(slotNumber: number) {
    var src = "assets/svg/";
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    {
      src += "emptyItemSlot.svg";
      return;
    }

    var item = this.globalService.globalVar.itemBelt[slotNumber];

    src = this.lookupService.getItemImage(item);

    return src;
  }

  getItemBeltCount() {
    return this.globalService.globalVar.itemBeltSize;
  }

  isBattleItemSlotUnequipped(slotNumber: number) {
    if (this.globalService.globalVar.itemBeltSize < slotNumber || this.globalService.globalVar.itemBelt.length < slotNumber)
      return true;
    
    var item = this.globalService.globalVar.itemBelt[slotNumber];
    //console.log(slotNumber +" : " + item);
    if (item === ItemsEnum.None)
      return true;
    else
      return false;
  }

  openItemModal(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
      return;

    this.openedSlotNumber = slotNumber;

    this.battleItems = this.globalService.globalVar.resources.filter(item => item.type === ItemTypeEnum.HealingItem || item.type === ItemTypeEnum.BattleItem); 

    this.setupDisplayBattleItems();
  }

  unselectItemSlot(slotNumber: number) {
    this.globalService.globalVar.itemBelt[slotNumber] = ItemsEnum.None;    
    this.battleService.targetbattleItemMode = false;
  }

  getItemAmount(slotNumber: number) {
    var amount = 0;

    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    return amount;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    amount = this.lookupService.getResourceAmount(item);

    return amount;
  }

  battleItemInUse(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
    return;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    if (item === this.battleService.battleItemInUse && this.battleService.targetbattleItemMode)
      return true;
    else
      return false;
  }

  targetCharacterWithItem(character: Character) {
    var isTargeted = false;

    var isTargetable = this.battleService.isTargetableWithItem(character, false);

    if (this.battleService.targetbattleItemMode && isTargetable) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnCharacter(character: Character) {
    if (this.targetCharacterWithItem(character))
      this.battleService.useBattleItemOnCharacter(character);
  }

  isCharacterAbilityAvailable(character: Character, abilityNumber: number) {
    var ability: Ability = new Ability();

    if (character !== undefined && character.abilityList.length >= abilityNumber)
    {
      ability = character.abilityList.filter(item => !item.isPassive)[abilityNumber];
    }

    if (ability === undefined)
      return false;
      
    return ability.isAvailable;
  }

  isGodAbilityAvailable(character: Character, assignedGodNumber: number, abilityNumber: number) {
    var ability: Ability = new Ability();
    var godType: GodEnum = GodEnum.None;
    
    if (assignedGodNumber === 1)
    godType = character.assignedGod1;
    else if (assignedGodNumber === 2)
    godType = character.assignedGod2;

    if (godType !== GodEnum.None)
    {
      var god = this.globalService.globalVar.gods.find(item => item.type === godType);

      if (god !== undefined && god.abilityList.length >= abilityNumber)
      {
        ability = god.abilityList.filter(item => !item.isPassive)[abilityNumber];
      }
    }

    if (ability === undefined)
      return false;

    return ability.isAvailable;
  }

  getCharacterAbility(character: Character, abilityNumber: number) {
    var ability: Ability = new Ability();

    if (character !== undefined && character.abilityList.length >= abilityNumber)
    {
      ability = character.abilityList.filter(item => !item.isPassive)[abilityNumber];
    }

    return ability;
  }

  getGodAbility(character: Character, assignedGodNumber: number, abilityNumber: number) {
    var ability: Ability = new Ability();
    var godType: GodEnum = GodEnum.None;
    
    if (assignedGodNumber === 1)
    godType = character.assignedGod1;
    else if (assignedGodNumber === 2)
    godType = character.assignedGod2;

    if (godType !== GodEnum.None)
    {
      var god = this.globalService.globalVar.gods.find(item => item.type === godType);

      if (god !== undefined && god.abilityList.length >= abilityNumber)
      {
        ability = god.abilityList.filter(item => !item.isPassive)[abilityNumber];
      }
    }

    return ability;
  }

  setupDisplayBattleItems(): void {
    this.battleItemCells = [];
    this.battleItemRows = [];

    var maxColumns = 3;
    
    for (var i = 1; i <= this.battleItems.length; i++) {
      this.battleItemCells.push(this.battleItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.battleItemRows.push(this.battleItemCells);
        this.battleItemCells = [];
      }
    }

    if (this.battleItemCells.length !== 0)
      this.battleItemRows.push(this.battleItemCells);
  }

  toggleAuto(character: Character) {
    character.overdriveInfo.overdriveAutoMode = !character.overdriveInfo.overdriveAutoMode; 
    
    return false;
  }

  manuallyTrigger(character: Character) {
    character.overdriveInfo.manuallyTriggered = true;
  }

  getPartyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculatePartyDps();

    return dps;
  }

  getEnemyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculateEnemyDps();

    return dps;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
