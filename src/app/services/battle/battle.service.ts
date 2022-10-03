import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Character } from 'src/app/models/character/character.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battle: Battle;

  constructor(private globalService: GlobalService, private subzoneGeneratorService: SubZoneGeneratorService,
    private balladService: BalladService, private utilityService: UtilityService) { }

  handleBattle(deltaTime: number) {
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
        this.handleAutoAttackTimer(partyMember, enemies, deltaTime);
        this.handleAbilities();
      }
    });

    enemies.forEach(enemy => {
      var isDefeated = this.isCharacterDefeated(enemy);
      if (!isDefeated) {
        this.handleAutoAttackTimer(enemy, party, deltaTime);
        this.handleAbilities();
      }
    });

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

  handleAutoAttackTimer(character: Character, targets: Character[], deltaTime: number) {
    character.battleInfo.autoAttackTimer += deltaTime;

    if (character.battleInfo.autoAttackTimer >= character.battleInfo.timeToAutoAttack) {
      this.handleAutoAttack(character, targets);
      character.battleInfo.autoAttackTimer -= character.battleInfo.timeToAutoAttack;
    }
  }

  handleAutoAttack(character: Character, targets: Character[]) {
    //TODO: handle targetting system -- default to random but have options to target highest or lowest hp and other conditions
    var potentialTargets = targets.filter(item => !item.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead));

    var target = potentialTargets[this.utilityService.getRandomInteger(0, potentialTargets.length - 1)];
    this.dealDamage(character, target);
  }

  handleAbilities() {

  }

  dealDamage(attacker: Character, target: Character) {
    //damage formula, check for shields, check for ko
    target.battleStats.currentHp -= attacker.battleStats.strength - target.battleStats.defense;
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

  }

  moveToNextBattle() {
    var subZone = this.balladService.getActiveSubZone();
    subZone.victoryCount += 1;

    this.globalService.giveCharactersExp(this.globalService.getActivePartyCharacters(true), this.battle.currentEnemies);

    this.initializeEnemyList();
    console.log(subZone.victoryCount);
  }
}
