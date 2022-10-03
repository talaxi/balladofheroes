import { Injectable } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { BalladService } from '../ballad/ballad.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalVar = new GlobalVariables();

  constructor() { }

  initializeGlobalVariables() {    
    this.globalVar.lastTimeStamp = Date.now();
    this.globalVar.characters = [];

    this.initializeCharacters();
    this.globalVar.activePartyMember1 = CharacterEnum.Warrior;
    this.globalVar.activePartyMember2 = CharacterEnum.none;
    this.globalVar.activePartyMember3 = CharacterEnum.none;
  }

  initializeCharacters() {
    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = true;
    warrior.baseStats = new CharacterStats(520, 12, 15, 5, 5, 5, 10, 18, 10, 10);
    warrior.battleStats = warrior.baseStats.makeCopy();
    this.globalVar.characters.push(warrior);
  }

  getActivePartyCharacters(excludeEmptySlots: boolean) {
    var characters: Character[] = [];

    if (this.globalVar.activePartyMember1 === CharacterEnum.none) {
      if (!excludeEmptySlots)
        characters.push(new Character());
    }
    else {
      var character1 = this.globalVar.characters.find(item => item.type === this.globalVar.activePartyMember1);
      if (character1 === undefined)
        characters.push(new Character());
      else
        characters.push(character1);
    }

    if (this.globalVar.activePartyMember2 === CharacterEnum.none) {
      if (!excludeEmptySlots)
        characters.push(new Character());
    }
    else {
      var character2 = this.globalVar.characters.find(item => item.type === this.globalVar.activePartyMember2);
      if (character2 === undefined)
        characters.push(new Character());
      else
        characters.push(character2);
    }

    /*if (this.globalVar.activePartyMember3 === CharacterEnum.none) {
      if (!excludeEmptySlots)
        characters.push(new Character());
    }
    else {
      var character3 = this.globalVar.characters.find(item => item.type === this.globalVar.activePartyMember3);
      if (character3 === undefined)
        characters.push(new Character());
      else
        characters.push(character3);
    }*/

    return characters;
  }

  calculateCharacterBattleStats(character: Character) {
    character.battleStats.hp = character.baseStats.hp;
    character.battleStats.currentHp = character.baseStats.currentHp;
    character.battleStats.mp = character.baseStats.mp;
    character.battleStats.currentMp = character.baseStats.currentMp;
    character.battleStats.strength = character.baseStats.strength;
    character.battleStats.defense = character.baseStats.defense;
    character.battleStats.magic = character.baseStats.magic;
    character.battleStats.magicDefense = character.baseStats.magicDefense;
    character.battleStats.agility = character.baseStats.agility;
    character.battleStats.accuracy = character.baseStats.accuracy;
    character.battleStats.evasion = character.baseStats.evasion;
    character.battleStats.luck = character.baseStats.luck;
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam)
  {
    defeatedEnemies.enemyList.forEach(enemy => {
      party.forEach(partyMember => {
        //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
        partyMember.exp += enemy.xpGainFromDefeat;        
      });
    });

    party.forEach(partyMember => {      
      if (partyMember.exp >= partyMember.expToNextLevel)
      {
        this.levelUpPartyMember(partyMember);
        //partyMember.levelUp();
      }
    });
  }

  levelUpPartyMember(character: Character)
  {
    character.level += 1;
    character.exp -= character.expToNextLevel;
  }
}
