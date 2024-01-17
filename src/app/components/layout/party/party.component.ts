import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { Ability } from 'src/app/models/character/ability.model';
import { MatMenuTrigger as MatMenuTrigger } from '@angular/material/menu';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';

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
  verboseMode: boolean = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.setupKeybinds(event);
  }

  constructor(private globalService: GlobalService, public lookupService: LookupService, public battleService: BattleService,
    private gameLoopService: GameLoopService, private menuService: MenuService, private utilityService: UtilityService,
    private dpsCalculatorService: DpsCalculatorService, private keybindService: KeybindService, private tutorialService: TutorialService,
    private balladService: BalladService, private gameLogService: GameLogService) { }

  ngOnInit(): void {
    this.showPartyHpAsPercent = this.globalService.globalVar.settings.get("showPartyHpAsPercent") ?? false;
    this.verboseMode = this.globalService.globalVar.settings.get("verboseMode") ?? false;

    this.party = this.globalService.getActivePartyCharacters(false);
    this.activeCharacterCount = this.party.filter(item => item.type !== CharacterEnum.None).length;

    this.battleItems = this.getViableBattleItems();

    this.displayDps = this.globalService.globalVar.isDpsUnlocked;
    this.unlockedBattleItems = this.globalService.globalVar.areBattleItemsUnlocked;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.displayDps = this.globalService.globalVar.isDpsUnlocked;
      this.unlockedBattleItems = this.globalService.globalVar.areBattleItemsUnlocked;
      this.activeCharacterCount = this.party.filter(item => item.type !== CharacterEnum.None).length;

      if (this.itemMenu !== undefined && !this.itemMenu.menuOpen) {
        this.battleItems = this.getViableBattleItems();
      }

      this.removeDefaultMaterialButtonClasses();

      if (this.menuService.updateParty) {
        this.party = this.globalService.getActivePartyCharacters(false);
        this.menuService.updateParty = false;
      }
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
  
  notLowPerformanceMode() {
    return this.globalService.globalVar.settings.get("fps") === undefined || this.globalService.globalVar.settings.get("fps") !== this.utilityService.lowFps;
  }

  isOverdriveAvailable(character: Character) {
    if (character.level >= this.utilityService.characterOverdriveLevel &&
      !this.globalService.globalVar.logData.some(item => item.type === LogViewEnum.Tutorials && item.relevantEnumValue === TutorialTypeEnum.Overdrive)) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Overdrive, undefined, undefined, true, this.balladService.getActiveSubZone()?.type), this.globalService.globalVar);
      this.globalService.handleTutorialModal();
    }

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
    if (this.globalService.globalVar.itemBelt.length < slotNumber) {
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

    if (character !== undefined && character.abilityList.length >= abilityNumber) {
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

    if (godType !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === godType);

      if (god !== undefined && god.abilityList.length >= abilityNumber) {
        ability = god.abilityList.filter(item => !item.isPassive)[abilityNumber];
      }
    }

    if (ability === undefined)
      return false;

    return ability.isAvailable;
  }

  isOverdriveActive(character: Character) {
    return character.overdriveInfo.isActive;
  }

  getCharacterAbility(character: Character, abilityNumber: number) {
    var ability: Ability = new Ability();

    if (character !== undefined && character.abilityList.length >= abilityNumber) {
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

    if (godType !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === godType);

      if (god !== undefined && god.abilityList.length >= abilityNumber) {
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

  getCharacterRemainingLinks(character: Character) {
    return character.linkInfo.remainingLinks;
  }

  getCharacterTotalLinks(character: Character) {
    if (!this.globalService.globalVar.logData.some(item => item.type === LogViewEnum.Tutorials && item.relevantEnumValue === TutorialTypeEnum.Link) &&
      character.type === CharacterEnum.Adventurer && character.level >= this.utilityService.characterLinkLevel) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Link, undefined, undefined, true, this.balladService.getActiveSubZone()?.type), this.globalService.globalVar);
      this.globalService.handleTutorialModal();
    }

    return character.linkInfo.totalLinks;
  }

  getCharacterNextLinkDamage(character: Character) {
    var linkEffectivenessBoost = character.battleStats.linkEffectiveness;

    var linkEffectivenessBoostEffect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.LinkBoost);
    if (linkEffectivenessBoostEffect !== undefined) {
      linkEffectivenessBoost += linkEffectivenessBoostEffect.effectiveness;
    }

    return this.utilityService.genericRound(this.battleService.getLinkChainPercent(character.linkInfo, false, linkEffectivenessBoost));
  }

  isLinkOffCooldown(character: Character) {
    return character.linkInfo.cooldown <= 0;
  }

  getLinkCooldown(character: Character) {
    return Math.round(character.linkInfo.cooldown);
  }

  setupKeybinds(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("toggleAllCharactersTargetMode"))) {
      this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
      if (this.battleService.targetCharacterMode)
        this.battleService.characterInTargetMode = CharacterEnum.All;
      else
        this.battleService.characterInTargetMode = CharacterEnum.None;
    }

    //character 1
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("toggleCharacter1TargetMode"))) {
      this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
      if (this.battleService.targetCharacterMode)
        this.battleService.characterInTargetMode = this.globalService.globalVar.activePartyMember1;
      else
        this.battleService.characterInTargetMode = CharacterEnum.None;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1AutoAttack"))) {
      this.party[0].battleInfo.autoAttackManuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1Ability1"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
      if (ability !== undefined)
        ability.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1Ability2"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
      if (ability !== undefined)
        ability.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God1Ability1"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 0);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God1Ability2"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 1);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God1Ability3"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 2);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God2Ability1"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 0);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God2Ability2"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 1);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1God2Ability3"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 2);
      godAbility.manuallyTriggered = true;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1Overdrive"))) {
      this.party[0].overdriveInfo.manuallyTriggered = true;
    }
    
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter1DuoAbility"))) {
      this.triggerDuo(this.party[0]);
    }

    
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2DuoAbility"))) {
      this.triggerDuo(this.party[1]);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1AutoAttack"))) {
      this.party[0].battleInfo.autoAttackAutoMode = !this.party[0].battleInfo.autoAttackAutoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1Ability1"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1Ability2"))) {
      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God1Ability1"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 0);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God1Ability2"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 1);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God1Ability3"))) {
      var godAbility = this.getGodAbility(this.party[0], 1, 2);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God2Ability1"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 0);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God2Ability2"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 1);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1God2Ability3"))) {
      var godAbility = this.getGodAbility(this.party[0], 2, 2);
      godAbility.autoMode = !godAbility.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1Overdrive"))) {
      this.party[0].overdriveInfo.autoMode = !this.party[0].overdriveInfo.autoMode;
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter1AllAbilities"))) {
      this.party[0].battleInfo.autoAttackAutoMode = !this.party[0].battleInfo.autoAttackAutoMode;

      var ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;

      ability = this.party[0].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
      if (ability !== undefined)
        ability.autoMode = !ability.autoMode;

      var godAbility = this.getGodAbility(this.party[0], 1, 0);
      godAbility.autoMode = !godAbility.autoMode;

      godAbility = this.getGodAbility(this.party[0], 1, 1);
      godAbility.autoMode = !godAbility.autoMode;

      godAbility = this.getGodAbility(this.party[0], 1, 2);
      godAbility.autoMode = !godAbility.autoMode;

      godAbility = this.getGodAbility(this.party[0], 2, 0);
      godAbility.autoMode = !godAbility.autoMode;

      godAbility = this.getGodAbility(this.party[0], 2, 1);
      godAbility.autoMode = !godAbility.autoMode;

      godAbility = this.getGodAbility(this.party[0], 2, 2);
      godAbility.autoMode = !godAbility.autoMode;

      this.party[0].overdriveInfo.autoMode = !this.party[0].overdriveInfo.autoMode;
    }

    //Character 2
    if (this.party[1] !== undefined) {
      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("toggleCharacter2TargetMode"))) {
        this.battleService.targetCharacterMode = !this.battleService.targetCharacterMode;
        if (this.battleService.targetCharacterMode)
          this.battleService.characterInTargetMode = this.globalService.globalVar.activePartyMember2;
        else
          this.battleService.characterInTargetMode = CharacterEnum.None;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2AutoAttack"))) {
        this.party[1].battleInfo.autoAttackManuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2Ability1"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
        if (ability !== undefined)
          ability.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2Ability2"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
        if (ability !== undefined)
          ability.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God1Ability1"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 0);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God1Ability2"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 1);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God1Ability3"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 2);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God2Ability1"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 0);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God2Ability2"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 1);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2God2Ability3"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 2);
        godAbility.manuallyTriggered = true;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("useCharacter2Overdrive"))) {
        this.party[1].overdriveInfo.manuallyTriggered = true;
      }


      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2AutoAttack"))) {
        this.party[1].battleInfo.autoAttackAutoMode = !this.party[1].battleInfo.autoAttackAutoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2Ability1"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2Ability2"))) {
        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God1Ability1"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 0);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God1Ability2"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 1);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God1Ability3"))) {
        var godAbility = this.getGodAbility(this.party[1], 1, 2);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God2Ability1"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 0);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God2Ability2"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 1);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2God2Ability3"))) {
        var godAbility = this.getGodAbility(this.party[1], 2, 2);
        godAbility.autoMode = !godAbility.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2Overdrive"))) {
        this.party[1].overdriveInfo.autoMode = !this.party[1].overdriveInfo.autoMode;
      }

      if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("autoToggleCharacter2AllAbilities"))) {
        this.party[1].battleInfo.autoAttackAutoMode = !this.party[1].battleInfo.autoAttackAutoMode;

        var ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;

        ability = this.party[1].abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
        if (ability !== undefined)
          ability.autoMode = !ability.autoMode;

        var godAbility = this.getGodAbility(this.party[1], 1, 0);
        godAbility.autoMode = !godAbility.autoMode;

        godAbility = this.getGodAbility(this.party[1], 1, 1);
        godAbility.autoMode = !godAbility.autoMode;

        godAbility = this.getGodAbility(this.party[1], 1, 2);
        godAbility.autoMode = !godAbility.autoMode;

        godAbility = this.getGodAbility(this.party[1], 2, 0);
        godAbility.autoMode = !godAbility.autoMode;

        godAbility = this.getGodAbility(this.party[1], 2, 1);
        godAbility.autoMode = !godAbility.autoMode;

        godAbility = this.getGodAbility(this.party[1], 2, 2);
        godAbility.autoMode = !godAbility.autoMode;

        this.party[1].overdriveInfo.autoMode = !this.party[1].overdriveInfo.autoMode;
      }
    }
  }

  getDuoAbilityName(character: Character) {
    var gods = [];
    gods.push(character.assignedGod1);
    gods.push(character.assignedGod2);

    var ability = this.lookupService.getDuoAbility(gods);
    return ability.name;
  }

  getDuoAbilityDescription(character: Character) {
    var gods = [];
    gods.push(character.assignedGod1);
    gods.push(character.assignedGod2);

    var ability = this.lookupService.getDuoAbility(gods);

    return this.lookupService.getGodAbilityDescription(ability.name, character, ability);
  }

  getDuoAbilityRemaining(character: Character) {
    if (character.battleInfo.duoAbilityUsed || character.battleInfo.duoAbilityCooldown > 0)
      return "UNAVAILABLE";
    else
      return "AVAILABLE";
  }

  isDuoAvailable(character: Character) {
    var god1ConditionMet = false;
    var god2ConditionMet = false;
    var gods = [];
    gods.push(character.assignedGod1);
    gods.push(character.assignedGod2);
    if (gods.length < 2)
      return false;

    for (var i = 0; i < gods.length; i++) {
      var conditionMet = false;

      if (gods[i] === GodEnum.Athena && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AthenasCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AthenasSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Artemis && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ArtemissCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ArtemissSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Hermes && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HermessCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HermessSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Apollo && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ApollosCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ApollosSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Ares && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AressCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AressSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Hades && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HadessCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HadessSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Nemesis && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.NemesissCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.NemesissSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Dionysus && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DionysussCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DionysussSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Zeus && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ZeussCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ZeussSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Poseidon && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.PoseidonsCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.PoseidonsSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Aphrodite && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AphroditesCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AphroditesSigil && item.amount > 0))
        conditionMet = true;
      if (gods[i] === GodEnum.Hera && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HerasCrest && item.amount > 0) &&
        this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HerasSigil && item.amount > 0))
        conditionMet = true;

      if (i === 0)
        god1ConditionMet = conditionMet;
      else if (i === 1)
        god2ConditionMet = conditionMet;
    }

    return god1ConditionMet && god2ConditionMet;
  }

  getDuoSource(character: Character) {
    var src = "assets/svg/";
    var gods = [];
    gods.push(character.assignedGod1);
    gods.push(character.assignedGod2);

    if (character.battleInfo.duoAbilityUsed || character.battleInfo.duoAbilityCooldown > 0) {
      src += "inactiveDuo.svg";
      return src;
    }

    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Artemis))
      src += "artemisAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Hermes))
      src += "athenaHermesDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Apollo))
      src += "athenaApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Ares))
      src += "aresAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Hades))
      src += "athenaHadesDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Nemesis))
      src += "athenaNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Zeus))
      src += "zeusAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Hera))
      src += "heraAthenaDuo.svg";
    if (gods.some(item => item === GodEnum.Athena) && gods.some(item => item === GodEnum.Aphrodite))
      src += "athenaAphroditeDuo.svg";

    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Hermes))
      src += "hermesArtemisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Apollo))
      src += "artemisApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Ares))
      src += "artemisAresDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Hades))
      src += "hadesArtemisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusArtemisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Nemesis))
      src += "artemisNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Zeus))
      src += "artemisZeusDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonArtemisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Hera))
      src += "heraArtemisDuo.svg";
    if (gods.some(item => item === GodEnum.Artemis) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeArtemisDuo.svg";

    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Apollo))
      src += "hermesApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Ares))
      src += "hermesAresDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Hades))
      src += "hermesHadesDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusHermesDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Nemesis))
      src += "hermesNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Zeus))
      src += "zeusHermesDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Poseidon))
      src += "hermesPoseidonDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Hera))
      src += "hermesHeraDuo.svg";
    if (gods.some(item => item === GodEnum.Hermes) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeHermesDuo.svg";

    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Hades))
      src += "apolloHadesDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Ares))
      src += "aresApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Nemesis))
      src += "nemesisApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Zeus))
      src += "zeusApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Poseidon))
      src += "apolloPoseidonDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeApolloDuo.svg";
    if (gods.some(item => item === GodEnum.Apollo) && gods.some(item => item === GodEnum.Hera))
      src += "apolloHeraDuo.svg";

    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Ares))
      src += "hadesAresDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusHadesDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Nemesis))
      src += "hadesNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Zeus))
      src += "zeusHadesDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonAresDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Aphrodite))
      src += "hadesAphroditeDuo.svg";
    if (gods.some(item => item === GodEnum.Hades) && gods.some(item => item === GodEnum.Hera))
      src += "hadesHeraDuo.svg";

    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Dionysus))
      src += "dionysusAresDuo.svg";
    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Nemesis))
      src += "aresNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Zeus))
      src += "zeusAresDuo.svg";
    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonAresDuo.svg";
    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeAresDuo.svg";
    if (gods.some(item => item === GodEnum.Ares) && gods.some(item => item === GodEnum.Hera))
      src += "aresHeraDuo.svg";

    if (gods.some(item => item === GodEnum.Dionysus) && gods.some(item => item === GodEnum.Nemesis))
      src += "nemesisDionysusDuo.svg";
    if (gods.some(item => item === GodEnum.Dionysus) && gods.some(item => item === GodEnum.Zeus))
      src += "dionysusZeusDuo.svg";
    if (gods.some(item => item === GodEnum.Dionysus) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonDionysusDuo.svg";
    if (gods.some(item => item === GodEnum.Dionysus) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeDionysusDuo.svg";
    if (gods.some(item => item === GodEnum.Dionysus) && gods.some(item => item === GodEnum.Hera))
      src += "heraDionysusDuo.svg";

    if (gods.some(item => item === GodEnum.Nemesis) && gods.some(item => item === GodEnum.Zeus))
      src += "nemesisZeusDuo.svg";
    if (gods.some(item => item === GodEnum.Nemesis) && gods.some(item => item === GodEnum.Poseidon))
      src += "nemesisPoseidonDuo.svg";
    if (gods.some(item => item === GodEnum.Nemesis) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditeNemesisDuo.svg";
    if (gods.some(item => item === GodEnum.Nemesis) && gods.some(item => item === GodEnum.Hera))
      src += "nemesisHeraDuo.svg";

    if (gods.some(item => item === GodEnum.Zeus) && gods.some(item => item === GodEnum.Poseidon))
      src += "poseidonZeusDuo.svg";
    if (gods.some(item => item === GodEnum.Zeus) && gods.some(item => item === GodEnum.Aphrodite))
      src += "zeusAphroditeDuo.svg";
    if (gods.some(item => item === GodEnum.Zeus) && gods.some(item => item === GodEnum.Hera))
      src += "zeusHeraDuo.svg";

    if (gods.some(item => item === GodEnum.Poseidon) && gods.some(item => item === GodEnum.Aphrodite))
      src += "aphroditePoseidonDuo.svg";
    if (gods.some(item => item === GodEnum.Poseidon) && gods.some(item => item === GodEnum.Hera))
      src += "heraPoseidonDuo.svg";

    if (gods.some(item => item === GodEnum.Aphrodite) && gods.some(item => item === GodEnum.Hera))
      src += "aphroditeHeraDuo.svg";

    if (src === "assets/svg/")
      src += "inactiveDuo.svg";

    return src;
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

  characterDpsBreakdown(which: number) {
    var character = this.party[which];

    var breakdown = this.dpsCalculatorService.getCharacterDps(character.type);
    var percent = this.dpsCalculatorService.getCharacterDpsPercent(character.type);

    return "<span class='bold smallCaps " + character.name.toLowerCase() + "Color'>" + character.name + ":</span> " + this.utilityService.bigNumberReducer(breakdown) + " (" + this.utilityService.roundTo(percent * 100, 1) + "%)";
  }

  godDpsBreakdown(whichCharacter: number, whichGod: number) {
    var character = this.party[whichCharacter];
    var godEnum = GodEnum.None;

    if (whichGod === 1)
      godEnum = character.assignedGod1;
    else if (whichGod === 2)
      godEnum = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === godEnum);
    if (god === undefined)
      return "";

    var breakdown = this.dpsCalculatorService.getGodDps(godEnum);
    //var percent = this.dpsCalculatorService.getGodDpsPercent(godEnum);

    return "<span class='bold smallCaps " + god.name.toLowerCase() + "Color'>" + god.name + ":</span> " + this.utilityService.bigNumberReducer(breakdown);
  }

  triggerDuo(character: Character) {
    if (!this.isDuoAvailable(character) || character.battleInfo.duoAbilityUsed || character.battleInfo.duoAbilityCooldown > 0)
      return;

    this.battleService.useDuoAbility(character);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    /*if (this.itemMenu !== undefined) {
      this.itemMenu.ngOnDestroy();
    }*/
  }
}
