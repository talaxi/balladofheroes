import { Injectable } from '@angular/core';
import * as pluralize from 'pluralize';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battle: Battle;
  isPaused: boolean;
  battleItemInUse: ItemsEnum;
  targetbattleItemMode: boolean = false;

  constructor(private globalService: GlobalService, private subzoneGeneratorService: SubZoneGeneratorService,
    private balladService: BalladService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService) { }

  handleBattle(deltaTime: number) {
    if (this.isPaused)
      deltaTime = 0;

    if (this.globalService.globalVar.activeBattle === undefined)
      this.initializeBattle();

    this.battle = this.globalService.globalVar.activeBattle!;
    if (this.battle === undefined)
      return;

    if (this.battle.currentEnemies === undefined || this.battle.currentEnemies.enemyList.length === 0)
      this.initializeEnemyList();

    var party = this.globalService.getActivePartyCharacters(true);
    var enemies = this.battle.currentEnemies.enemyList;

    party.forEach(partyMember => {
      //check for defeated
      var isDefeated = this.isCharacterDefeated(partyMember);
      if (!isDefeated) {
        //check for status effects
        this.handleStatusEffectDurations(partyMember, deltaTime);
        this.handleAutoAttackTimer(partyMember, enemies, deltaTime);
        this.handleAbilities(partyMember, enemies, deltaTime);
      }
    });

    enemies.forEach(enemy => {
      var isDefeated = this.isCharacterDefeated(enemy);
      if (!isDefeated) {
        this.handleStatusEffectDurations(enemy, deltaTime);
        this.handleAutoAttackTimer(enemy, party, deltaTime);
        this.handleAbilities(enemy, party, deltaTime);
      }
    });

    if (deltaTime > 0)
      this.updateBattleState(party, enemies);
  }

  initializeBattle() {
    this.globalService.globalVar.activeBattle = new Battle();
  }

  initializeEnemyList() {
    var subZone = this.balladService.getActiveSubZone();
    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subZone.type);
    var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
    this.battle.currentEnemies = randomEnemyTeam;
  }

  handleStatusEffectDurations(character: Character, deltaTime: number) {
    if (character.battleInfo.statusEffects.length === 0)
      return;

    character.battleInfo.statusEffects.forEach(effect => {
      effect.duration -= deltaTime;
    });

    character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(effect => effect.duration > 0);
  }

  handleAutoAttackTimer(character: Character, targets: Character[], deltaTime: number) {
    character.battleInfo.autoAttackTimer += deltaTime;

    var timeToAutoAttack = this.getAutoAttackTime(character);

    if (character.battleInfo.autoAttackTimer >= timeToAutoAttack) {
      this.handleAutoAttack(character, targets);
      character.battleInfo.autoAttackTimer -= timeToAutoAttack;
    }
  }

  getAutoAttackTime(character: Character) {
    var timeToAutoAttack = character.battleInfo.timeToAutoAttack;
    var adjustedAgility = this.lookupService.getAdjustedAgility(character);

    var amplifier = 120;
    var horizontalStretch = .00035;
    var horizontalPosition = 1;

    //500 * (log(.0035 * 10 + 1)) + 50      
    var modifierAmount = amplifier * Math.log10(horizontalStretch * (adjustedAgility) + horizontalPosition);

    //if it goes below 0, needs to attack multi times
    //although probably need to make it more like if it gets reduced to 33% or something like that because otherwise its a nerf       
    timeToAutoAttack -= modifierAmount;

    return timeToAutoAttack;
  }

  handleAutoAttack(character: Character, targets: Character[]) {
    //TODO: handle targetting system -- default to random but have options to target highest or lowest hp and other conditions
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));

    var target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
    var damageDealt = this.dealDamage(character, target);

    var gameLogEntry = "<strong>" + character.name + "</strong>" + " attacks <strong>" + target.name + "</strong> for " + damageDealt + " damage.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);

    if (character.type !== CharacterEnum.Enemy) {
      this.dealStagger(character, target as Enemy);
    }
  }

  handleAbilities(character: Character, targets: Character[], deltaTime: number) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.forEach(ability => {
        ability.currentCooldown -= deltaTime;
        if (ability.currentCooldown <= 0) {
          ability.currentCooldown = 0;

          if (ability.isSelected) {
            this.useAbility(ability, character, targets);
            ability.currentCooldown = ability.cooldown;
          }
        }
      });
  }

  useAbility(ability: Ability, user: Character, targets: Character[]) {
    if (ability.dealsDirectDamage) {
      var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));
      var target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
      var damageDealt = this.dealDamage(user, target, ability.damageMultiplier);
      var gameLogEntry = "<strong>" + user.name + "</strong>" + " uses " + ability.name + " on <strong>" + target.name + "</strong> for " + damageDealt + " damage.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.DealingDamage, gameLogEntry);

      if (ability.userGainsStatusEffect.length > 0) {
        ability.userGainsStatusEffect.forEach(gainedStatusEffect => {
          user.battleInfo.statusEffects.push(gainedStatusEffect.makeCopy());
        });
      }
    }
  }

  dealDamage(attacker: Character, target: Character, abilityDamageMultiplier?: number, damageMultiplier?: number) {
    //damage formula, check for shields, check for ko
    if (abilityDamageMultiplier === undefined)
      abilityDamageMultiplier = 1;

    if (damageMultiplier === undefined)
      damageMultiplier = 1;

    var adjustedStrength = attacker.battleStats.strength;
    var adjustedDefense = target.battleStats.defense;

    var damage = Math.round(damageMultiplier * abilityDamageMultiplier * (adjustedStrength * (2 / 3) -
      (adjustedDefense * (2 / 9))));

    /*
    Skill Power x ((ATK x ATK boost x 2/3) - (DEF x DEF boost x 2/9)) x (BRV DMG Reduction) x 
    (BRV DMG Dealt Multiplier) x (BRV DMG Increase Multiplier) x (Critical Damage) x (RNG)
    */

    if (damage < 0)
      damage = 0;

    target.battleStats.currentHp -= damage;

    if (target.battleStats.currentHp < 0)
      target.battleStats.currentHp = 0;

    return damage;
  }

  dealStagger(attacker: Character, target: Enemy) {
    target.currentStagger += .5;
  }

  isCharacterDefeated(character: Character) {
    if (character.battleStats.currentHp <= 0) {
      if (!character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        character.battleInfo.statusEffects.push(new StatusEffect(StatusEffectEnum.Dead));
      }

      return true;
    }
    else {
      return false;
    }
  }

  updateBattleState(party: Character[], enemies: Character[]) {
    if (this.areCharactersDefeated(party))
      this.handlePartyDefeat();

    if (this.areCharactersDefeated(enemies))
      this.moveToNextBattle();
  }

  areCharactersDefeated(characters: Character[]) {
    var areCharactersDefeated = true;

    characters.forEach(item => {
      if (!item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead)) {
        areCharactersDefeated = false;
      }
    });

    return areCharactersDefeated;
  }

  handlePartyDefeat() {
    this.isPaused = true;
    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "Your party has been defeated.");
  }

  moveToNextBattle() {
    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleUpdate, "The enemy party has been defeated.");
    var subZone = this.balladService.getActiveSubZone();
    subZone.victoryCount += 1;

    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains " + this.lookupService.getTotalXpGainFromEnemyTeam(this.battle.currentEnemies.enemyList) + " XP.");
    this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies);
    var loot = this.getLoot(this.battle.currentEnemies);
    if (loot !== undefined && loot.length > 0) {
      loot.forEach(item => {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive " + item.amount + " " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : pluralize(this.lookupService.getItemName(item.item))) + ".");
        this.addLootToResources(item);
      });
    }

    if (subZone.victoryCount >= subZone.victoriesNeededToProceed) {
      this.unlockNextSubzone(subZone.type);
    }

    this.initializeEnemyList();
  }

  getLoot(defeatedEnemies: EnemyTeam) {
    var lootGained: ResourceValue[] = [];

    if (defeatedEnemies.enemyList.length === 0)
      return;

    defeatedEnemies.enemyList.forEach(enemy => {
      if (enemy.loot !== undefined && enemy.loot.length > 0) {
        enemy.loot.forEach(loot => {
          var rng = this.utilityService.getRandomNumber(0, 1);

          if (rng <= loot.chance) {
            if (lootGained.some(item => item.item === loot.item)) {
              var existingLootItem = lootGained.find(item => item.item === loot.item);
              if (existingLootItem !== undefined)
                existingLootItem.amount += loot.amount;
            }
            else
              lootGained.push(new ResourceValue(loot.item, loot.type, loot.amount));
          }
        });
      }
    });

    return lootGained;
  }

  addLootToResources(item: ResourceValue | undefined) {
    if (item === undefined)
      return;

    var existingResource = this.globalService.globalVar.resources.find(resource => item.item === resource.item);
    if (existingResource === undefined)
    {
      this.globalService.globalVar.resources.push(item);
    }
    else
    {
      existingResource.amount += item.amount;
    }
  }

  unlockNextSubzone(type: SubZoneEnum) {
    if (type === SubZoneEnum.AigosthenaUpperCoast) {
      var subzone = this.balladService.findSubzone(SubZoneEnum.AigosthenaBay);
      if (subzone !== undefined)
        subzone.isAvailable = true;
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  useBattleItem(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
      return;

    var selectedItem = this.globalService.globalVar.itemBelt[slotNumber];

    if (selectedItem === undefined || this.lookupService.getResourceAmount(selectedItem) === 0)
      return;

    if (this.lookupService.itemDoesNotNeedSelection()) {
      //use item
    }
    else {
      if (this.targetbattleItemMode === false)
      {
        this.battleItemInUse = selectedItem;
        this.targetbattleItemMode = true;
      }   
      else
        this.targetbattleItemMode = false;   
    }
  }

  useBattleItemOnCharacter(character: Character) {
    if (!this.targetbattleItemMode || this.battleItemInUse === undefined || this.battleItemInUse === ItemsEnum.None)
      return;

    if (this.battleItemInUse === ItemsEnum.HealingHerb) {
      character.battleStats.currentHp += this.lookupService.getHealingHerbAmount();
      this.lookupService.useResource(this.battleItemInUse, 1);
    }
  }
}
