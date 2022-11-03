import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})

export class PartyComponent implements OnInit {
  party: Character[];
  public characterEnum: CharacterEnum;
  public noCharacter = CharacterEnum.none;
  public noGod = GodEnum.None;

  constructor(private globalService: GlobalService, public lookupService: LookupService, public battleService: BattleService) { }

  ngOnInit(): void {
    this.party = this.globalService.getActivePartyCharacters(false);    
  }

  getCharacterHpPercent(character: Character) {
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
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

    if (item === ItemsEnum.HealingHerb) {
      src += "healingHerb.svg";
    }

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

    //simulating selecting the healing herb
    this.globalService.globalVar.itemBelt[slotNumber] = ItemsEnum.HealingHerb;
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

    if (this.battleService.targetbattleItemMode) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }

  isCharacterAbilityAvailable(character: Character, abilityNumber: number) {
    var ability: Ability = new Ability();

    if (character !== undefined && character.abilityList.length >= abilityNumber)
    {
      ability = character.abilityList[abilityNumber];
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
        ability = god.abilityList[abilityNumber];
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
      ability = character.abilityList[abilityNumber];
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
        ability = god.abilityList[abilityNumber];
      }
    }

    return ability;
  }
}
