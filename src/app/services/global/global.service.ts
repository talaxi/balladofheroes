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
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalVar = new GlobalVariables();

  constructor(private utilityService: UtilityService, private gameLogService: GameLogService) { }

  initializeGlobalVariables() {
    this.globalVar = new GlobalVariables();
    this.globalVar.lastTimeStamp = Date.now();
    this.globalVar.characters = [];
    this.globalVar.ballads = [];
    this.globalVar.itemBelt = [];
    //this.globalVar.activeBattle = new Battle();

    this.initializeCharacters();
    this.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
    this.globalVar.activePartyMember2 = CharacterEnum.None;

    this.initializeGods();

    this.initializeItemBelt();
  }

  initializeCharacters() {
    var adventurer = new Character(CharacterEnum.Adventurer);
    adventurer.name = "Adventurer";
    adventurer.type = CharacterEnum.Adventurer;
    adventurer.isAvailable = true;
    adventurer.baseStats = new CharacterStats(250, 12, 8, 10, 5, 5);
    adventurer.battleStats = adventurer.baseStats.makeCopy();
    adventurer.battleInfo.timeToAutoAttack = this.utilityService.quickAutoAttackSpeed;
    this.assignAbilityInfo(adventurer);

    this.globalVar.characters.push(adventurer);

    var archer = new Character(CharacterEnum.Archer);
    archer.name = "Archer";
    archer.type = CharacterEnum.Archer;
    archer.isAvailable = true;
    archer.baseStats = new CharacterStats(250, 10, 10, 10, 5, 5);
    archer.battleStats = archer.baseStats.makeCopy();
    archer.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    this.assignAbilityInfo(archer);

    this.globalVar.characters.push(archer);

    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = true;
    warrior.baseStats = new CharacterStats(250, 10, 10, 10, 5, 5);
    warrior.battleStats = warrior.baseStats.makeCopy();
    warrior.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    this.assignAbilityInfo(warrior);

    this.globalVar.characters.push(warrior);

    var priest = new Character(CharacterEnum.Priest);
    priest.name = "Priest";
    priest.type = CharacterEnum.Priest;
    priest.isAvailable = true;
    priest.baseStats = new CharacterStats(250, 10, 10, 10, 5, 5);
    priest.battleStats = priest.baseStats.makeCopy();
    priest.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;
    this.assignAbilityInfo(priest);

    this.globalVar.characters.push(priest);
  }

  assignAbilityInfo(character: Character) {
    character.abilityList = [];

    if (character.type === CharacterEnum.Adventurer) {
      var quickHit = new Ability();
      quickHit.name = "Quick Hit";
      quickHit.isAvailable = false;
      quickHit.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      quickHit.effectiveness = 1.5;
      quickHit.cooldown = quickHit.currentCooldown = 20;
      quickHit.dealsDirectDamage = true;
      quickHit.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true));
      character.abilityList.push(quickHit);

      var barrage = new Ability();
      barrage.name = "Barrage";
      barrage.effectiveness = .25;
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
      thousandCuts.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.ThousandCuts, 10, .05, false, true));
      character.abilityList.push(thousandCuts);
    }

    if (character.type === CharacterEnum.Archer) {
      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      sureShot.isAvailable = false;
      sureShot.effectiveness = 1.2;
      sureShot.cooldown = sureShot.currentCooldown = 25;
      sureShot.dealsDirectDamage = true;
      sureShot.targetGainsStatusEffect.push(this.createDamageOverTimeEffect(12, 3, .2, sureShot.name));
      character.abilityList.push(sureShot);

      var mark = new Ability();
      mark.name = "Mark";
      mark.requiredLevel = this.utilityService.characterPassiveLevel;
      mark.isAvailable = false;
      mark.isPassive = true;
      mark.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Mark, 10, 1.1, false, false));
      character.abilityList.push(mark);

      var pinningShot = new Ability();
      pinningShot.name = "Pinning Shot";
      pinningShot.requiredLevel = this.utilityService.characterAbility2Level;
      pinningShot.isAvailable = false;
      pinningShot.cooldown = pinningShot.currentCooldown = 35;
      pinningShot.dealsDirectDamage = true;
      pinningShot.effectiveness = 1.25;
      pinningShot.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false));
      character.abilityList.push(pinningShot);
    }

    if (character.type === CharacterEnum.Warrior) {
      var battleCry = new Ability();
      battleCry.name = "Battle Cry";
      battleCry.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      battleCry.isAvailable = false;
      battleCry.cooldown = battleCry.currentCooldown = 10;
      battleCry.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Taunt, 15, 0, false, false, true, character.name));
      character.abilityList.push(battleCry);

      var lastStand = new Ability();
      lastStand.name = "Last Stand";
      lastStand.requiredLevel = this.utilityService.characterPassiveLevel;
      lastStand.isAvailable = false;
      lastStand.isPassive = true;
      lastStand.threshold = .25;
      lastStand.effectiveness = 1.25;
      character.abilityList.push(lastStand);

      var shieldSlam = new Ability();
      shieldSlam.name = "Shield Slam";
      shieldSlam.requiredLevel = this.utilityService.characterAbility2Level;
      shieldSlam.isAvailable = false;
      shieldSlam.effectiveness = 1;
      shieldSlam.secondaryEffectiveness = .25;
      shieldSlam.dealsDirectDamage = true;
      shieldSlam.cooldown = shieldSlam.currentCooldown = 5;
      character.abilityList.push(shieldSlam);
    }

    if (character.type === CharacterEnum.Priest) {
      var heal = new Ability();
      heal.name = "Heal";
      heal.requiredLevel = this.utilityService.characterAbility2Level;
      heal.targetType = TargetEnum.LowestHpPercent;
      heal.isAvailable = false;
      heal.effectiveness = 1;
      heal.heals = true;
      heal.targetsAllies = true;
      heal.dealsDirectDamage = false;
      heal.cooldown = heal.currentCooldown = 5;
      character.abilityList.push(heal);

      var faith = new Ability();
      faith.name = "Faith";
      faith.requiredLevel = this.utilityService.characterPassiveLevel;
      faith.isAvailable = false;
      faith.isPassive = true;
      faith.effectiveness = 1.25;
      character.abilityList.push(faith);

      var barrier = new Ability();
      barrier.name = "Pray";
      barrier.requiredLevel = this.utilityService.characterAbility2Level;
      barrier.isAvailable = false;
      barrier.dealsDirectDamage = false;
      barrier.isAoe = true;
      barrier.targetsAllies = true;
      barrier.effectiveness = .6;
      barrier.threshold = .10;
      barrier.cooldown = barrier.currentCooldown = 5;
      character.abilityList.push(barrier);
    }
  }

  initializeGods() {
    var athena = new God(GodEnum.Athena);
    athena.name = "Athena";
    this.assignGodAbilityInfo(athena);
    this.globalVar.gods.push(athena);

    var artemis = new God(GodEnum.Artemis);
    artemis.name = "Artemis";
    this.assignGodAbilityInfo(artemis);
    this.globalVar.gods.push(artemis);

    var apollo = new God(GodEnum.Apollo);
    apollo.name = "Apollo";
    this.assignGodAbilityInfo(apollo);
    this.globalVar.gods.push(apollo);

    var hermes = new God(GodEnum.Hermes);
    hermes.name = "Hermes";
    this.assignGodAbilityInfo(hermes);
    this.globalVar.gods.push(hermes);

    var zeus = new God(GodEnum.Zeus);
    zeus.name = "Zeus";
    this.assignGodAbilityInfo(zeus);
    this.globalVar.gods.push(zeus);

    var ares = new God(GodEnum.Ares);
    ares.name = "Ares";
    this.assignGodAbilityInfo(ares);
    this.globalVar.gods.push(ares);

    var poseidon = new God(GodEnum.Poseidon);
    poseidon.name = "Poseidon";
    this.assignGodAbilityInfo(poseidon);
    this.globalVar.gods.push(poseidon);

  }

  assignGodAbilityInfo(god: God) {
    god.abilityList = [];

    if (god.type === GodEnum.Athena) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 30;
      divineStrike.dealsDirectDamage = true;
      divineStrike.effectiveness = 1.6;
      divineStrike.elementalType = ElementalTypeEnum.Holy;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 60;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
      god.abilityList.push(secondWind);
    }

    if (god.type === GodEnum.Artemis) {
      var woundingArrow = new Ability();
      woundingArrow.name = "Wounding Arrow";
      woundingArrow.isAvailable = false;
      woundingArrow.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      woundingArrow.cooldown = woundingArrow.currentCooldown = 18;
      woundingArrow.effectiveness = 1.2;
      woundingArrow.dealsDirectDamage = true;
      woundingArrow.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AttackDown, 6, .9, false, false));
      god.abilityList.push(woundingArrow);

      var electricVolley = new Ability();
      electricVolley.name = "Electric Volley";
      electricVolley.isAvailable = false;
      electricVolley.requiredLevel = this.utilityService.godAbility2Level;
      electricVolley.cooldown = electricVolley.currentCooldown = 40;
      electricVolley.effectiveness = .35;
      electricVolley.isAoe = true;
      electricVolley.dealsDirectDamage = true;
      electricVolley.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Paralyze, 12, 0, false, false, true));
      god.abilityList.push(electricVolley);

      var exposeWeakness = new Ability();
      exposeWeakness.name = "Expose Weakness";
      exposeWeakness.isAvailable = false;
      exposeWeakness.requiredLevel = this.utilityService.godAbility3Level;
      exposeWeakness.cooldown = exposeWeakness.currentCooldown = 55;      
      exposeWeakness.dealsDirectDamage = true;
      exposeWeakness.effectiveness = 1.8;
      exposeWeakness.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DebuffDurationIncrease, 0, 1.2, true, true));
      god.abilityList.push(exposeWeakness);

      var trueShot = new Ability();
      trueShot.name = "True Shot";
      trueShot.isAvailable = false;
      trueShot.requiredLevel = this.utilityService.godPassiveLevel;      
      trueShot.isPassive = true;
      trueShot.effectiveness = 1.1;
      god.abilityList.push(trueShot);
    }
    
    if (god.type === GodEnum.Apollo) {
      var staccato = new Ability();
      staccato.name = "Staccato";
      staccato.isAvailable = false;
      staccato.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      staccato.cooldown = staccato.currentCooldown = 45;      
      staccato.dealsDirectDamage = false;
      staccato.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.1, false, true, true));
      god.abilityList.push(staccato);

      var fortissimo = new Ability();
      fortissimo.name = "Fortissimo";
      fortissimo.isAvailable = false;
      fortissimo.requiredLevel = this.utilityService.godAbility2Level;
      fortissimo.cooldown = fortissimo.currentCooldown = 45;      
      fortissimo.dealsDirectDamage = false;
      fortissimo.secondaryEffectiveness = 1.01;
      fortissimo.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AttackUp, 8, 1.1, false, true, true));
      god.abilityList.push(fortissimo);

      var allegro = new Ability();
      allegro.name = "Allegro";
      allegro.isAvailable = false;
      allegro.requiredLevel = this.utilityService.godAbility3Level;
      allegro.cooldown = allegro.currentCooldown = 60;      
      allegro.dealsDirectDamage = true;
      allegro.effectiveness = 1.8;
      allegro.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.LuckUp, 5, 1.1, false, true, true));
      god.abilityList.push(allegro);

      var ostinato = new Ability();
      ostinato.name = "Ostinato";
      ostinato.isAvailable = false;
      ostinato.requiredLevel = this.utilityService.godPassiveLevel;      
      ostinato.isPassive = true;
      ostinato.effectiveness = .8;
      ostinato.cooldown = ostinato.currentCooldown = 40;
      god.abilityList.push(ostinato);
    }
    
    if (god.type === GodEnum.Hermes) {
      var trickShot = new Ability();
      trickShot.name = "Trick Shot";
      trickShot.isAvailable = false;
      trickShot.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      trickShot.cooldown = trickShot.currentCooldown = 8;
      trickShot.dealsDirectDamage = true;
      trickShot.effectiveness = 1.2;
      god.abilityList.push(trickShot);

      var embellish = new Ability();
      embellish.name = "Embellish";
      embellish.requiredLevel = this.utilityService.godAbility2Level;
      embellish.isAvailable = false;
      embellish.dealsDirectDamage = false;
      embellish.cooldown = embellish.currentCooldown = 40;
      embellish.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AttackUp, 6, 1.3, false, true));
      embellish.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.3, false, true));
      god.abilityList.push(embellish);

      var specialDelivery = new Ability();
      specialDelivery.name = "Special Delivery";
      specialDelivery.requiredLevel = this.utilityService.godAbility3Level;
      specialDelivery.isAvailable = false;
      specialDelivery.cooldown = specialDelivery.currentCooldown = 35;
      specialDelivery.dealsDirectDamage = false;
      specialDelivery.effectiveness = 1.1;
      specialDelivery.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      specialDelivery.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      specialDelivery.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      god.abilityList.push(specialDelivery);

      var quicken = new Ability();
      quicken.name = "Quicken";
      quicken.requiredLevel = this.utilityService.godPassiveLevel;
      quicken.isAvailable = false;
      quicken.isPassive = true;
      quicken.dealsDirectDamage = false;
      quicken.effectiveness = .1;      
      god.abilityList.push(quicken);
    }

    if (god.type === GodEnum.Zeus) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 30;
      divineStrike.dealsDirectDamage = true;
      divineStrike.effectiveness = 1.6;
      divineStrike.elementalType = ElementalTypeEnum.Holy;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
      god.abilityList.push(secondWind);
    }

    if (god.type === GodEnum.Ares) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 30;
      divineStrike.dealsDirectDamage = true;
      divineStrike.effectiveness = 1.6;
      divineStrike.elementalType = ElementalTypeEnum.Holy;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
      god.abilityList.push(secondWind);
    }

    if (god.type === GodEnum.Poseidon) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 30;
      divineStrike.dealsDirectDamage = true;
      divineStrike.effectiveness = 1.6;
      divineStrike.elementalType = ElementalTypeEnum.Holy;
      divineStrike.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userGainsStatusEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
      god.abilityList.push(secondWind);
    }

  }

  initializeItemBelt() {
    for (var i = 0; i < this.utilityService.maxItemBeltSize; i++) {
      this.globalVar.itemBelt.push(ItemsEnum.None);
    }
  }

  createStatusEffect(type: StatusEffectEnum, duration: number, multiplier: number, isInstant: boolean, isPositive: boolean, isAoe: boolean = false, caster: string = "") {
    var statusEffect = new StatusEffect(type);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.isInstant = isInstant;
    statusEffect.isPositive = isPositive;
    statusEffect.isAoe = isAoe;
    statusEffect.caster = caster;
    statusEffect.refreshes = false;

    if (duration === -1)
      statusEffect.isPermanent = true;

    if (type === StatusEffectEnum.Taunt || type === StatusEffectEnum.Mark)
      statusEffect.refreshes = true;


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

    if (this.globalVar.activePartyMember1 === CharacterEnum.None) {
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

    if (this.globalVar.activePartyMember2 === CharacterEnum.None) {
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

    return characters;
  }

  calculateCharacterBattleStats(character: Character, inBattle: boolean = true) {
    character.battleStats.maxHp = character.baseStats.maxHp;
    character.battleStats.attack = character.baseStats.attack;
    character.battleStats.defense = character.baseStats.defense;
    character.battleStats.agility = character.baseStats.agility;
    character.battleStats.luck = character.baseStats.luck;

    if (!inBattle)
      character.battleStats.currentHp = character.battleStats.maxHp;

    character.battleStats.maxHp += character.equipmentSet.getTotalMaxHpGain();
    character.battleStats.attack += character.equipmentSet.getTotalAttackGain();
    character.battleStats.defense += character.equipmentSet.getTotalDefenseGain();
    character.battleStats.agility += character.equipmentSet.getTotalAgilityGain();
    character.battleStats.luck += character.equipmentSet.getTotalLuckGain();
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam) {
    defeatedEnemies.enemyList.forEach(enemy => {
      party.filter(partyMember => partyMember.level < partyMember.maxLevel).forEach(partyMember => {
        //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
        partyMember.exp += enemy.xpGainFromDefeat;
      });

      //TODO: this probably needs adjusting but for now, give XP to all gods
      this.globalVar.gods.forEach(god => {
        god.exp += enemy.xpGainFromDefeat * this.globalVar.godXpModifier;
      });
    });


    party.forEach(partyMember => {
      if (partyMember.exp >= partyMember.expToNextLevel && partyMember.level < partyMember.maxLevel) {
        this.levelUpPartyMember(partyMember);
        if (partyMember.level === partyMember.maxLevel)
          partyMember.exp = 0;
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

    var gameLogEntry = "<strong>" + character.name + "</strong>" + " attains level <strong>" + character.level + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);

    this.getCharacterLevelStatIncrease(character);
    this.checkForNewCharacterAbilities(character);

    character.expToNextLevel = this.getCharacterXpToNextLevel(character.level);
  }

  getCharacterLevelStatIncrease(character: Character) {
    var statIncrease = 2; /* For levels 1-10 */

    character.baseStats.attack += statIncrease;
    character.baseStats.agility += statIncrease;
    character.baseStats.defense += statIncrease;
    character.baseStats.luck += statIncrease;
    character.baseStats.resistance += statIncrease;
    character.baseStats.maxHp += statIncrease * 5;
  }

  checkForNewCharacterAbilities(character: Character) {
    character.abilityList.forEach(ability => {
      if (character.level >= ability.requiredLevel) {
        if (!ability.isAvailable) {
          var gameLogEntry = "<strong>" + character.name + "</strong>" + " learns a new ability: <strong>" + ability.name + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
        }
        ability.isAvailable = true;
      }
    });
  }

  getCharacterXpToNextLevel(level: number) {
    var baseXp = 200;

    if (level < 20) {
      var factor = 1.4;

      return (baseXp) * level + (baseXp * (factor ** (level-1)));
    }
    else {
      //TODO: depends on what kind of XP you're getting at this reset
      var factor = 1.09;
      var additive = 1500;

      return baseXp * (factor ** level) + (additive * (level - 1));
    }
  }

  levelUpGod(god: God) {
    god.level += 1;
    god.exp -= god.expToNextLevel;

    this.getGodLevelStatIncrease(god);
    this.checkForNewGodAbilities(god);

    god.expToNextLevel = this.getGodXpToNextLevel(god.level);
  }

  getGodLevelStatIncrease(god: God) {

  }

  checkForNewGodAbilities(god: God) {
    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel)
        ability.isAvailable = true;
    });
  }

  getGodXpToNextLevel(level: number) {
    var xpConstant = 1000;
    return xpConstant * level;
  }
}
