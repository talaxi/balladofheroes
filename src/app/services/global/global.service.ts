import { Injectable } from '@angular/core';
import { last } from 'rxjs';
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
    adventurer.baseStats = new CharacterStats(250, 12, 8, 10, 5);
    adventurer.battleStats = adventurer.baseStats.makeCopy();
    this.assignAbilityInfo(adventurer);

    this.globalVar.characters.push(adventurer);

    var archer = new Character(CharacterEnum.Archer);
    archer.name = "Archer";
    archer.type = CharacterEnum.Archer;
    archer.isAvailable = true;
    archer.baseStats = new CharacterStats(250, 10, 10, 10, 5);
    archer.battleStats = archer.baseStats.makeCopy();
    this.assignAbilityInfo(archer);

    this.globalVar.characters.push(archer);

    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = true;
    warrior.baseStats = new CharacterStats(250, 10, 10, 10, 5);
    warrior.battleStats = warrior.baseStats.makeCopy();
    this.assignAbilityInfo(warrior);

    this.globalVar.characters.push(warrior);
  }

  assignAbilityInfo(character: Character) {
    character.abilityList = [];

    if (character.type === CharacterEnum.Adventurer) {
      var quickHit = new Ability();
      quickHit.name = "Quick Hit";
      quickHit.isAvailable = true;
      quickHit.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      quickHit.damageMultiplier = 1.3;
      quickHit.cooldown = quickHit.currentCooldown = 20;
      quickHit.dealsDirectDamage = true;
      quickHit.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.1, false));
      character.abilityList.push(quickHit);

      var barrage = new Ability();
      barrage.name = "Barrage";
      barrage.damageMultiplier = .25;
      barrage.requiredLevel = this.utilityService.characterPassiveLevel;
      barrage.maxCount = 4;
      barrage.isAvailable = false;
      barrage.isPassive = true;
      character.abilityList.push(barrage);

      var thousandCuts = new Ability();
      thousandCuts.name = "Thousand Cuts";
      thousandCuts.requiredLevel = this.utilityService.characterAbility2Level;
      thousandCuts.isAvailable = false;
      thousandCuts.cooldown = thousandCuts.currentCooldown = 60;
      thousandCuts.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.ThousandCuts, 10, 1.05, false));
      character.abilityList.push(thousandCuts);
    }

    if (character.type === CharacterEnum.Archer) {
      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      sureShot.isAvailable = true;
      sureShot.damageMultiplier = 1.1;
      sureShot.cooldown = sureShot.currentCooldown = 25;
      sureShot.dealsDirectDamage = true;
      sureShot.targetGainsStatusEffect.push(this.createDamageOverTimeEffect(12, 3, .1, sureShot.name));
      character.abilityList.push(sureShot);

      var mark = new Ability();
      mark.name = "Mark";
      mark.requiredLevel = this.utilityService.characterPassiveLevel;
      mark.isAvailable = false;
      mark.isPassive = true;
      character.abilityList.push(mark);

      var pinningShot = new Ability();
      pinningShot.name = "Pinning Shot";
      pinningShot.requiredLevel = this.utilityService.characterAbility2Level;
      pinningShot.isAvailable = false;
      pinningShot.cooldown = pinningShot.currentCooldown = 45;
      pinningShot.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false));
      character.abilityList.push(pinningShot);
    }

    if (character.type === CharacterEnum.Warrior) {
      var battleCry = new Ability();
      battleCry.name = "Battlecry";
      battleCry.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      battleCry.isAvailable = true;
      battleCry.cooldown = battleCry.currentCooldown = 45;
      battleCry.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Taunt, 15, 0, false));
      character.abilityList.push(battleCry);

      var lastStand = new Ability();
      lastStand.name = "Last Stand";
      lastStand.requiredLevel = this.utilityService.characterPassiveLevel;
      lastStand.isAvailable = false;
      lastStand.isPassive = true;
      character.abilityList.push(lastStand);

      var shieldSlam = new Ability();
      shieldSlam.name = "Shield Slam";
      shieldSlam.requiredLevel = this.utilityService.characterAbility2Level;
      shieldSlam.isAvailable = false;
      shieldSlam.damageMultiplier = 1;
      shieldSlam.dealsDirectDamage = true;
      shieldSlam.cooldown = shieldSlam.currentCooldown = 25;
      character.abilityList.push(shieldSlam);
    }
  }

  initializeGods() {
    var athena = new God(GodEnum.Athena);
    athena.name = "Athena";
    this.assignGodAbilityInfo(athena);
    this.globalVar.gods.push(athena);

    var zeus = new God(GodEnum.Zeus);
    zeus.name = "Zeus";
    this.assignGodAbilityInfo(zeus);
    this.globalVar.gods.push(zeus);

    var apollo = new God(GodEnum.Apollo);
    apollo.name = "Apollo";
    this.assignGodAbilityInfo(apollo);
    this.globalVar.gods.push(apollo);

    var ares = new God(GodEnum.Ares);
    ares.name = "Ares";
    this.assignGodAbilityInfo(ares);
    this.globalVar.gods.push(ares);

    var poseidon = new God(GodEnum.Poseidon);
    poseidon.name = "Poseidon";
    this.assignGodAbilityInfo(poseidon);
    this.globalVar.gods.push(poseidon);

    var artemis = new God(GodEnum.Artemis);
    artemis.name = "Artemis";
    this.assignGodAbilityInfo(artemis);
    this.globalVar.gods.push(artemis);
  }

  assignGodAbilityInfo(god: God) {
    god.abilityList = [];

    if (god.type === GodEnum.Athena) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 35;
      divineStrike.dealsDirectDamage = true;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 60;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true));
      god.abilityList.push(secondWind);
    }
  }

  initializeItemBelt() {
    for (var i = 0; i < this.utilityService.maxItemBeltSize; i++) {
      this.globalVar.itemBelt.push(ItemsEnum.None);
    }
  }

  createStatusEffect(type: StatusEffectEnum, duration: number, multiplier: number, isInstant: boolean) {
    var statusEffect = new StatusEffect(type);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.isInstant = isInstant;

    return statusEffect;
  }

  createDamageOverTimeEffect(duration: number, tickFrequency: number, multiplier: number, associatedAbilityName: string) {
    var statusEffect = new StatusEffect(StatusEffectEnum.DamageOverTime);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.tickFrequency = tickFrequency;
    statusEffect.associatedAbilityName = associatedAbilityName;

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
    character.battleStats.attack = character.baseStats.attack;
    character.battleStats.defense = character.baseStats.defense;
    character.battleStats.agility = character.baseStats.agility;
    character.battleStats.luck = character.baseStats.luck;
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam) {
    defeatedEnemies.enemyList.forEach(enemy => {
      party.forEach(partyMember => {
        //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
        partyMember.exp += enemy.xpGainFromDefeat;
      });

      //TODO: this probably needs adjusting but for now, give XP to all gods
      this.globalVar.gods.forEach(god => {
        god.exp += enemy.xpGainFromDefeat * this.globalVar.godXpModifier;
      });
    });


    party.forEach(partyMember => {
      if (partyMember.exp >= partyMember.expToNextLevel) {
        this.levelUpPartyMember(partyMember);
      }
    });

    this.globalVar.gods.forEach(god => {
      if (god.exp >= god.expToNextLevel) {
        this.levelUpGod(god);
      }
    });
  }

  levelUpPartyMember(character: Character) {
    character.level += 1;
    character.exp -= character.expToNextLevel;

    this.getCharacterLevelStatIncrease(character);
    this.checkForNewCharacterAbilities(character);

    character.expToNextLevel = this.getCharacterXpToNextLevel(character.level);
  }

  getCharacterLevelStatIncrease(character: Character) {

  }

  checkForNewCharacterAbilities(character: Character) {
    character.abilityList.forEach(ability => {
      if (character.level >= ability.requiredLevel)
        ability.isAvailable = true;
    });
  }
  
  levelUpGod(god: God) {
    god.level += 1;
    god.exp -= god.expToNextLevel;
    god.expToNextLevel = this.getGodXpToNextLevel(god.level);
  }

  getCharacterXpToNextLevel(level: number) {
    var xpConstant = 1000;
    return xpConstant * level;
  }

  getGodXpToNextLevel(level: number) {
    var xpConstant = 1000;
    return xpConstant * level;
  }

  initializeBallads() {
    var championBallad = new Ballad(BalladEnum.Champion);
    championBallad.isSelected = true;
    championBallad.isAvailable = true;

    var camp = new Zone();

    var aigosthena = new Zone();
    aigosthena.zoneName = "Aigosthena";
    aigosthena.isAvailable = true;
    aigosthena.isSelected = true;

    var upperCoast = new SubZone(SubZoneEnum.AigosthenaUpperCoast);
    upperCoast.isSelected = true;
    upperCoast.isAvailable = true;
    aigosthena.subzones.push(upperCoast);
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaBay));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaLowerCoast));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaWesternWoodlands));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaHeartOfTheWoods));
    //aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaEasternWoodlands));

    championBallad.zones.push(aigosthena);
    this.globalVar.ballads.push(championBallad);


    this.globalVar.ballads.push(new Ballad(BalladEnum.Gorgon));
  }

  devMode() {
    this.globalVar.currentStoryId = 10000;
    this.globalVar.activePartyMember2 = CharacterEnum.Archer;
    this.globalVar.itemBeltSize = 4;

    var character1 = this.globalVar.characters.find(item => item.type === this.globalVar.activePartyMember1);
    if (character1 !== undefined) {
      character1.assignedGod1 = GodEnum.Athena;
      character1.assignedGod2 = GodEnum.Zeus;
    }

    character1?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var athena = this.globalVar.gods.find(item => item.type === GodEnum.Athena);
    athena?.abilityList.forEach(ability => {
      //ability.isAvailable = true;
    });

    this.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          subzone.isAvailable = true;
        })
      })
    })
  }
}
