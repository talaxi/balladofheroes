import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { BattleService } from 'src/app/services/battle/battle.service';

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

  constructor(private globalService: GlobalService, private lookupService: LookupService, public battleService: BattleService) { }

  ngOnInit(): void {
    this.party = this.globalService.getActivePartyCharacters(false);
    console.log(this.party);
  }

  getCharacterHpPercent(character: Character) {
    return (character.battleStats.currentHp / character.battleStats.hp) * 100;
  }

  getCharacterMpPercent(character: Character) {
    return (character.battleStats.currentMp / character.battleStats.mp) * 100;
  }

  getCharacterAutoAttackProgress(character: Character) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  getCharacterSelectedAbilityProgress(character: Character) {
    var selectedAbility = character.abilityList.find(item => item.isSelected);
    if (selectedAbility === undefined)
      return 0;

    return 100 - ((selectedAbility.currentCooldown / selectedAbility.cooldown) * 100);
  }

  getSelectedAbilityName(character: Character) {
    var name = "";
    var selectedAbility = character.abilityList.find(item => item.isSelected);

    if (selectedAbility !== undefined)
      name = selectedAbility.name;

    return name;
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
    if (item === this.battleService.battleItemInUse)
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
}
