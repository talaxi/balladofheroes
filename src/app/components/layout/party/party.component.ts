import { Component, HostListener, Input, OnInit, QueryList, ViewChild } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { Ability } from 'src/app/models/character/ability.model';
import { God } from 'src/app/models/character/god.model';
import { matMenuAnimations as matMenuAnimations, MatMenuTrigger as MatMenuTrigger } from '@angular/material/menu';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';

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
  @ViewChild('itemMenuTrigger') itemMenu: MatMenuTrigger;
  openedSlotNumber: number = 0;
  itemMenuClass = "itemMenu";
  battleItems: ResourceValue[];
  battleItemRows: ResourceValue[][];
  battleItemCells: ResourceValue[];
  activeCharacterCount: number;
  subscription: any;
  partyMember1CheckSubscription: any;
  partyMember2CheckSubscription: any;
  displayDps = false;
  unlockedBattleItems = false;
  @Input() isMobile = false;
  showPartyHpAsPercent: boolean = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    this.setupKeybinds(event);    
  }

  constructor(private globalService: GlobalService, public lookupService: LookupService, public battleService: BattleService,
    private gameLoopService: GameLoopService, private menuService: MenuService, private utilityService: UtilityService,
    private dpsCalculatorService: DpsCalculatorService, private keybindService: KeybindService) { }

  ngOnInit(): void {
    this.showPartyHpAsPercent = this.globalService.globalVar.settings.get("showPartyHpAsPercent") ?? false;

    this.party = this.globalService.getActivePartyCharacters(false);   
    this.activeCharacterCount = this.party.filter(item => item.type !== CharacterEnum.None).length;
        
    this.battleItems = this.getViableBattleItems();

    this.displayDps = this.globalService.globalVar.isDpsUnlocked;
    this.unlockedBattleItems = this.globalService.globalVar.areBattleItemsUnlocked;
      
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {  
      this.displayDps = this.globalService.globalVar.isDpsUnlocked;
      this.unlockedBattleItems = this.globalService.globalVar.areBattleItemsUnlocked;
      this.activeCharacterCount = this.party.filter(item => item.type !== CharacterEnum.None).length;

      if (this.itemMenu !== undefined && !this.itemMenu.menuOpen)
      {
        this.battleItems = this.getViableBattleItems();   
      }

      this.removeDefaultMaterialButtonClasses();
    });

    this.partyMember1CheckSubscription = this.menuService.getNewPartyMember1().subscribe(() => {      
      this.party = this.globalService.getActivePartyCharacters(false);      
    });

    this.partyMember2CheckSubscription = this.menuService.getNewPartyMember2().subscribe(() => {      
      this.party = this.globalService.getActivePartyCharacters(false);         
    });
  }

  getViableBattleItems() {
    return this.globalService.globalVar.resources.filter(item => (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.HealingItem || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.BattleItem ||
    this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Toxin || this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Elixir) && item.amount > 0);   
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
    return (character.battleStats.currentHp / this.lookupService.getAdjustedMaxHp(character)) * 100;
  }

  getCharacterBarrierValue(character: Character) {    
    return character.battleInfo.barrierValue;
  }

  getCharacterOverdrivePercent(character: Character) {
    return (character.overdriveInfo.gaugeAmount / character.overdriveInfo.gaugeTotal) * 100;
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

    this.battleItems = this.getViableBattleItems();   

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
      this.battleService.useBattleItemOnCharacter(character, this.party);
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
    character.overdriveInfo.autoMode = !character.overdriveInfo.autoMode; 
    
    return false;
  }

  manuallyTrigger(character: Character) {
    character.overdriveInfo.manuallyTriggered = true;
  }

  getPartyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculatePartyDps();

    return this.utilityService.bigNumberReducer(Math.round(dps));
  }

  getEnemyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculateEnemyDps();

    return this.utilityService.bigNumberReducer(Math.round(dps));
  }

  getXps() {
    var xps = 0;

    xps = this.dpsCalculatorService.calculateXps();

    return this.utilityService.bigNumberReducer(Math.round(xps));
  }

  setupKeybinds(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;    
    console.log(event.code + " " + event.altKey + " " + event.shiftKey);

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("toggleAllCharactersTargetMode"))) {
      this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
      if (this.battleService.targetCharacterMode)
        this.battleService.characterInTargetMode = CharacterEnum.All;
      else
        this.battleService.characterInTargetMode = CharacterEnum.None;
    }

    //character 1
    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("toggleCharacter1TargetMode"))) {
      this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
      if (this.battleService.targetCharacterMode)
        this.battleService.characterInTargetMode = this.globalService.globalVar.activePartyMember1;
      else
        this.battleService.characterInTargetMode = CharacterEnum.None;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1AutoAttack"))) {
      this.party[0].battleInfo.autoAttackManuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1Ability1"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
      if (ability !== undefined)
        ability.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1Ability2"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
      if (ability !== undefined)
        ability.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God1Ability1"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 0);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God1Ability2"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 1);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God1Ability3"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 2);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God2Ability1"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 0);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God2Ability2"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 1);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1God2Ability3"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 2);       
        godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter1Overdrive"))) {
      this.party[0].overdriveInfo.manuallyTriggered = true;
    }


    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1AutoAttack"))) {
      this.party[0].battleInfo.autoAttackAutoMode = !this.party[0].battleInfo.autoAttackAutoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1Ability1"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1Ability2"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God1Ability1"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 0);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God1Ability2"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 1);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God1Ability3"))) {      
      var godAbility = this.getGodAbility(this.party[0], 1, 2);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God2Ability1"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 0);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God2Ability2"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 1);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1God2Ability3"))) {      
      var godAbility = this.getGodAbility(this.party[0], 2, 2);       
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter1Overdrive"))) {
      this.party[0].overdriveInfo.autoMode = !this.party[0].overdriveInfo.autoMode;
    }

    //Character 2
    if (this.party[1] !== undefined) {
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("toggleCharacter2TargetMode"))) {
        this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
        if (this.battleService.targetCharacterMode)
          this.battleService.characterInTargetMode = this.globalService.globalVar.activePartyMember2;
        else
          this.battleService.characterInTargetMode = CharacterEnum.None;
      }

      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2AutoAttack"))) {
        this.party[1].battleInfo.autoAttackManuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2Ability1"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
        if (ability !== undefined)
          ability.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2Ability2"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
        if (ability !== undefined)
          ability.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God1Ability1"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 0);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God1Ability2"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 1);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God1Ability3"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 2);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God2Ability1"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 0);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God2Ability2"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 1);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2God2Ability3"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 2);       
          godAbility.manuallyTriggered = true;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("useCharacter2Overdrive"))) {
        this.party[1].overdriveInfo.manuallyTriggered = true;
      }
  
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2AutoAttack"))) {
        this.party[1].battleInfo.autoAttackAutoMode = !this.party[1].battleInfo.autoAttackAutoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2Ability1"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2Ability2"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God1Ability1"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 0);       
        godAbility.autoMode = !godAbility.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God1Ability2"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 1);       
        godAbility.autoMode = !godAbility.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God1Ability3"))) {      
        var godAbility = this.getGodAbility(this.party[1], 1, 2);       
        godAbility.autoMode = !godAbility.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God2Ability1"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 0);       
        godAbility.autoMode = !godAbility.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God2Ability2"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 1);       
        godAbility.autoMode = !godAbility.autoMode;
      }
  
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2God2Ability3"))) {      
        var godAbility = this.getGodAbility(this.party[1], 2, 2);       
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("autoToggleCharacter2Overdrive"))) {
        this.party[1].overdriveInfo.autoMode = !this.party[1].overdriveInfo.autoMode;
      }
    }
  }

  getCharacterBarrierPercent(character: Character) {
    return (character.battleInfo.barrierValue / this.lookupService.getAdjustedMaxHp(character)) * 100;
  }

  getCurrentHp(character: Character) {
    return this.utilityService.bigNumberReducer(Math.ceil(character.battleStats.currentHp + this.getCharacterBarrierValue(character)));
  }

  getMaxHp(character: Character) {
    return this.utilityService.bigNumberReducer(Math.ceil(this.lookupService.getAdjustedMaxHp(character)));
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    /*if (this.itemMenu !== undefined) {
      this.itemMenu.ngOnDestroy();
    }*/
  }
}
