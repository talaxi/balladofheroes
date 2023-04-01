import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Character } from 'src/app/models/character/character.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-item-belt-overview',
  templateUrl: './item-belt-overview.component.html',
  styleUrls: ['./item-belt-overview.component.css']
})
export class ItemBeltOverviewComponent {
  party: Character[];
  @ViewChild('itemMenuTrigger') itemMenu: MatMenuTrigger;
  openedSlotNumber: number = 0;
  itemMenuClass = "itemMenu";
  battleItems: ResourceValue[];
  battleItemRows: ResourceValue[][];
  battleItemCells: ResourceValue[];
  subscription: any;

  constructor(public globalService: GlobalService, private lookupService: LookupService, private battleService: BattleService,
    private gameLoopService: GameLoopService) {

  }

  ngOnInit(): void {
    this.party = this.globalService.getActivePartyCharacters(false); 
    
    this.battleItems = this.getViableBattleItems();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {  
      if (this.itemMenu !== undefined && !this.itemMenu.menuOpen)
      {
        this.battleItems = this.getViableBattleItems();   
      }

      this.removeDefaultMaterialButtonClasses();
    });

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

  preventRightClick() {
    return false;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
