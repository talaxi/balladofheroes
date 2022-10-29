import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { God } from 'src/app/models/character/god.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { BalladService } from '../ballad/ballad.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalVar = new GlobalVariables();

  constructor(private utilityService: UtilityService) { }

  initializeGlobalVariables() {
    this.globalVar = new GlobalVariables();
    this.globalVar.lastTimeStamp = Date.now();
    this.globalVar.characters = [];
    this.globalVar.ballads = [];
    this.globalVar.itemBelt = [];
    this.globalVar.activeBattle = new Battle();

    this.initializeCharacters();
    this.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
    this.globalVar.activePartyMember2 = CharacterEnum.none;    

    this.initializeGods();

    this.initializeBallads(); //need to initialize the connections and names so you have a place to store kill count

    this.initializeItemBelt();
  }

  initializeCharacters() {
    var adventurer = new Character(CharacterEnum.Adventurer);
    adventurer.name = "Adventurer";
    adventurer.type = CharacterEnum.Adventurer;
    adventurer.isAvailable = true;
    adventurer.baseStats = new CharacterStats(520, 12, 15, 5, 5, 5, 10, 18);
    adventurer.battleStats = adventurer.baseStats.makeCopy();
    this.assignAbilityInfo(adventurer);

    this.globalVar.characters.push(adventurer);

    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = true;
    warrior.baseStats = new CharacterStats(520, 12, 15, 5, 5, 5, 10, 18);
    warrior.battleStats = warrior.baseStats.makeCopy();
    this.assignAbilityInfo(warrior);

    this.globalVar.characters.push(warrior);
  }

  assignAbilityInfo(character: Character) {
    character.abilityList = [];

    if (character.type === CharacterEnum.Adventurer) {
      var quickHit = new Ability();
      quickHit.name = "Quick Hit";
      quickHit.isSelected = true;
      quickHit.isAvailable = true;
      quickHit.damageMultiplier = 1.25;
      quickHit.cooldown = quickHit.currentCooldown = 20;
      quickHit.dealsDirectDamage = true;
      quickHit.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.1, false));
      character.abilityList.push(quickHit);
    }
  }

  initializeGods() {
    var athena = new God(GodEnum.Athena);
    athena.name = "Athena";
    this.assignGodAbilityInfo(athena);
    this.globalVar.gods.push(athena);    
  }

  assignGodAbilityInfo(god: God) {
    god.abilityList = [];

    if (god.type === GodEnum.Athena) {
      var divineStrike = new Ability(); 
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.cooldown = divineStrike.currentCooldown = 35;
      divineStrike.dealsDirectDamage = true;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true));
      god.abilityList.push(divineStrike);
    }

    if (god.type === GodEnum.Athena) {
      var aegis = new Ability(); 
      aegis.name = "Aegis";
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 60;
      aegis.dealsDirectDamage = true;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false));
      god.abilityList.push(aegis);
    }

    if (god.type === GodEnum.Athena) {
      var blindingLight = new Ability(); 
      blindingLight.name = "Blinding Light";
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false));
      god.abilityList.push(blindingLight);
    }

    if (god.type === GodEnum.Athena) {
      var secondWind = new Ability(); 
      secondWind.name = "Second Wind";
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true));
      god.abilityList.push(secondWind);
    }
  }

  initializeItemBelt() {
    for (var i = 0; i < this.utilityService.maxItemBeltSize; i++)
    {
      this.globalVar.itemBelt.push(ItemsEnum.None);
    }
  }

  createStatusEffect(type: StatusEffectEnum, duration: number, multiplier: number, isInstant: boolean)
  {
    var statusEffect = new StatusEffect(type);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.isInstant = isInstant;

    return statusEffect;
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
    character.battleStats.maxHp = character.baseStats.maxHp;
    character.battleStats.currentHp = character.baseStats.currentHp;
    character.battleStats.mp = character.baseStats.mp;
    character.battleStats.currentMp = character.baseStats.currentMp;
    character.battleStats.strength = character.baseStats.strength;
    character.battleStats.defense = character.baseStats.defense;
    character.battleStats.magic = character.baseStats.magic;
    character.battleStats.magicDefense = character.baseStats.magicDefense;
    character.battleStats.agility = character.baseStats.agility;
    character.battleStats.luck = character.baseStats.luck;
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam) {
    defeatedEnemies.enemyList.forEach(enemy => {
      party.forEach(partyMember => {
        //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
        partyMember.exp += enemy.xpGainFromDefeat;
      });
    });

    party.forEach(partyMember => {
      if (partyMember.exp >= partyMember.expToNextLevel) {
        this.levelUpPartyMember(partyMember);
      }
    });
  }

  levelUpPartyMember(character: Character) {
    character.level += 1;
    character.exp -= character.expToNextLevel;
  }

  initializeBallads() {
    var championBallad = new Ballad(BalladEnum.Champion);
    championBallad.isSelected = true;

    var camp = new Zone();

    var aigosthena = new Zone();
    aigosthena.zoneName = "Aigosthena";
    aigosthena.isSelected = true;

    var upperCoast = new SubZone(SubZoneEnum.AigosthenaUpperCoast);
    upperCoast.isSelected = true;
    upperCoast.isAvailable = true;
    aigosthena.subzones.push(upperCoast);
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaBay));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaLowerCoast));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaWesternWoodlands));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaHeartOfTheWoods));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaEasternWoodlands));

    championBallad.zones.push(aigosthena);
    this.globalVar.ballads.push(championBallad);


    this.globalVar.ballads.push(new Ballad(BalladEnum.Gorgon));
  }

  devMode() {
    this.globalVar.currentStoryId = 10000;  
    var character1 = this.globalVar.characters.find(item => item.type === this.globalVar.activePartyMember1);
    if (character1 !== undefined)
    {
      character1.assignedGod1 = GodEnum.Athena;      
    }

    var athena = this.globalVar.gods.find(item => item.type === GodEnum.Athena);    
    athena?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });
  }
}
