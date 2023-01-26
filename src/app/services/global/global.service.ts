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
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GodLevelIncreaseEnum } from 'src/app/models/enums/god-level-increase-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { CharmService } from '../resources/charm.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';
import { TutorialService } from './tutorial.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalVar = new GlobalVariables();

  constructor(private utilityService: UtilityService, private gameLogService: GameLogService, private charmService: CharmService) { }

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
    adventurer.baseStats = new CharacterStats(250, 12, 8, 0, 5, 10);
    adventurer.battleStats = adventurer.baseStats.makeCopy();
    adventurer.battleInfo.timeToAutoAttack = this.utilityService.quickAutoAttackSpeed;
    this.assignAbilityInfo(adventurer);

    this.globalVar.characters.push(adventurer);

    var archer = new Character(CharacterEnum.Archer);
    archer.name = "Archer";
    archer.type = CharacterEnum.Archer;
    archer.isAvailable = false;
    archer.baseStats = new CharacterStats(220, 12, 10, 10, 15, 5);
    archer.battleStats = archer.baseStats.makeCopy();
    archer.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    this.assignAbilityInfo(archer);

    this.globalVar.characters.push(archer);

    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = false;
    warrior.baseStats = new CharacterStats(250, 10, 10, 10, 5, 5);
    warrior.battleStats = warrior.baseStats.makeCopy();
    warrior.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    this.assignAbilityInfo(warrior);

    this.globalVar.characters.push(warrior);

    var priest = new Character(CharacterEnum.Priest);
    priest.name = "Priest";
    priest.type = CharacterEnum.Priest;
    priest.isAvailable = false;
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
      quickHit.effectiveness = 1.75;
      quickHit.cooldown = quickHit.currentCooldown = 18;
      quickHit.dealsDirectDamage = true;
      quickHit.userEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 8, 1.25, false, true));
      character.abilityList.push(quickHit);

      var barrage = new Ability();
      barrage.name = "Barrage";
      barrage.effectiveness = .25;
      barrage.requiredLevel = this.utilityService.characterPassiveLevel;
      barrage.maxCount = 4;
      barrage.isAvailable = false;
      barrage.isPassive = true;
      barrage.isActivatable = false;
      character.abilityList.push(barrage);

      var thousandCuts = new Ability();
      thousandCuts.name = "Thousand Cuts";
      thousandCuts.requiredLevel = this.utilityService.characterAbility2Level;
      thousandCuts.isAvailable = false;
      thousandCuts.cooldown = thousandCuts.currentCooldown = 60;
      thousandCuts.userEffect.push(this.createStatusEffect(StatusEffectEnum.ThousandCuts, 10, .05, false, true));
      character.abilityList.push(thousandCuts);
    }

    if (character.type === CharacterEnum.Archer) {
      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      sureShot.isAvailable = false;
      sureShot.effectiveness = 1.3;
      sureShot.cooldown = sureShot.currentCooldown = 24;
      sureShot.dealsDirectDamage = true;
      sureShot.targetEffect.push(this.createDamageOverTimeEffect(12, 3, .2, sureShot.name, dotTypeEnum.BasedOnDamage));
      character.abilityList.push(sureShot);

      var mark = new Ability();
      mark.name = "Mark";
      mark.requiredLevel = this.utilityService.characterPassiveLevel;
      mark.isAvailable = false;
      mark.isPassive = true;
      mark.isActivatable = false;
      mark.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Mark, 10, 1.05, false, false));
      character.abilityList.push(mark);

      var pinningShot = new Ability();
      pinningShot.name = "Pinning Shot";
      pinningShot.requiredLevel = this.utilityService.characterAbility2Level;
      pinningShot.isAvailable = false;
      pinningShot.cooldown = pinningShot.currentCooldown = 35;
      pinningShot.dealsDirectDamage = true;
      pinningShot.effectiveness = 1.6;
      pinningShot.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Stun, 2, 0, false, false));
      character.abilityList.push(pinningShot);
    }

    if (character.type === CharacterEnum.Warrior) {
      var battleCry = new Ability();
      battleCry.name = "Battle Cry";
      battleCry.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      battleCry.isAvailable = false;
      battleCry.cooldown = battleCry.currentCooldown = 40;
      battleCry.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Taunt, 15, 0, false, false, true, character.name));
      character.abilityList.push(battleCry);

      var lastStand = new Ability();
      lastStand.name = "Last Stand";
      lastStand.requiredLevel = this.utilityService.characterPassiveLevel;
      lastStand.isAvailable = false;
      lastStand.isPassive = true;
      lastStand.threshold = .25;
      lastStand.isActivatable = false;
      lastStand.effectiveness = 1.25;
      character.abilityList.push(lastStand);

      var shieldSlam = new Ability();
      shieldSlam.name = "Shield Slam";
      shieldSlam.requiredLevel = this.utilityService.characterAbility2Level;
      shieldSlam.isAvailable = false;
      shieldSlam.effectiveness = 1.4;
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
      heal.effectiveness = 1.4;
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
      faith.isActivatable = false;
      faith.effectiveness = 1.25;
      character.abilityList.push(faith);

      var barrier = new Ability();
      barrier.name = "Pray";
      barrier.requiredLevel = this.utilityService.characterAbility2Level;
      barrier.isAvailable = false;
      barrier.dealsDirectDamage = false;
      barrier.isAoe = true;
      barrier.targetsAllies = true;
      barrier.effectiveness = .7;
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
      divineStrike.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.name = "Heavenly Shield";
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 60;
      aegis.userEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 50;
      blindingLight.isAoe = true;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .6;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 5, 1.25, false, false, true));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.isActivatable = false;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, -1, .05, false, true));
      god.abilityList.push(secondWind);
    }

    if (god.type === GodEnum.Artemis) {
      var woundingArrow = new Ability();
      woundingArrow.name = "Wounding Arrow";
      woundingArrow.isAvailable = false;
      woundingArrow.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      woundingArrow.cooldown = woundingArrow.currentCooldown = 24;
      woundingArrow.effectiveness = 2;
      woundingArrow.dealsDirectDamage = true;
      woundingArrow.targetEffect.push(this.createStatusEffect(StatusEffectEnum.AttackDown, 6, .9, false, false));
      god.abilityList.push(woundingArrow);

      var electricVolley = new Ability();
      electricVolley.name = "Paralyzing Volley";
      electricVolley.isAvailable = false;
      electricVolley.requiredLevel = this.utilityService.godAbility2Level;
      electricVolley.cooldown = electricVolley.currentCooldown = 60;
      electricVolley.effectiveness = .5;
      electricVolley.isAoe = true;
      electricVolley.dealsDirectDamage = true;
      electricVolley.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Paralyze, 12, 0, false, false, true));
      god.abilityList.push(electricVolley);

      var exposeWeakness = new Ability();
      exposeWeakness.name = "Expose Weakness";
      exposeWeakness.isAvailable = false;
      exposeWeakness.requiredLevel = this.utilityService.godAbility3Level;
      exposeWeakness.cooldown = exposeWeakness.currentCooldown = 60;
      exposeWeakness.dealsDirectDamage = true;
      exposeWeakness.effectiveness = 2.3;
      exposeWeakness.targetEffect.push(this.createStatusEffect(StatusEffectEnum.DebuffDurationIncrease, 0, 1.2, true, true));
      god.abilityList.push(exposeWeakness);

      var trueShot = new Ability();
      trueShot.name = "True Shot";
      trueShot.isAvailable = false;
      trueShot.requiredLevel = this.utilityService.godPassiveLevel;
      trueShot.isPassive = true;
      trueShot.isActivatable = false;
      trueShot.dealsDirectDamage = false;
      trueShot.effectiveness = 1.1;
      god.abilityList.push(trueShot);
    }

    if (god.type === GodEnum.Apollo) {
      var staccato = new Ability();
      staccato.name = "Staccato";
      staccato.isAvailable = false;
      staccato.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      staccato.cooldown = staccato.currentCooldown = 35;
      staccato.dealsDirectDamage = false;
      staccato.userEffect.push(this.createStatusEffect(StatusEffectEnum.Staccato, 10, 1.2, false, true));
      god.abilityList.push(staccato);

      var fortissimo = new Ability();
      fortissimo.name = "Fortissimo";
      fortissimo.isAvailable = false;
      fortissimo.requiredLevel = this.utilityService.godAbility2Level;
      fortissimo.cooldown = fortissimo.currentCooldown = 45;
      fortissimo.dealsDirectDamage = false;
      fortissimo.secondaryEffectiveness = 1.01;
      fortissimo.userEffect.push(this.createStatusEffect(StatusEffectEnum.Fortissimo, 8, 1.2, false, true));
      god.abilityList.push(fortissimo);

      var coda = new Ability();
      coda.name = "Coda";
      coda.isAvailable = false;
      coda.requiredLevel = this.utilityService.godAbility3Level;
      coda.cooldown = coda.currentCooldown = 60;
      coda.dealsDirectDamage = false;
      coda.userEffect.push(this.createStatusEffect(StatusEffectEnum.Coda, 5, 1.2, false, true));
      god.abilityList.push(coda);

      var ostinato = new Ability();
      ostinato.name = "Ostinato";
      ostinato.isAvailable = false;
      ostinato.requiredLevel = this.utilityService.godPassiveLevel;
      ostinato.isPassive = true;
      ostinato.effectiveness = .8;
      ostinato.heals = true;
      ostinato.targetsAllies = true;
      ostinato.targetType = TargetEnum.LowestHpPercent;
      ostinato.cooldown = ostinato.currentCooldown = 40;
      god.abilityList.push(ostinato);
    }

    if (god.type === GodEnum.Hermes) {
      var trickShot = new Ability();
      trickShot.name = "Nimble Strike";
      trickShot.isAvailable = false;
      trickShot.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      trickShot.cooldown = trickShot.currentCooldown = 8;
      trickShot.dealsDirectDamage = true;
      trickShot.effectiveness = 1.2;
      god.abilityList.push(trickShot);

      var embellish = new Ability();
      embellish.name = "Take Flight";
      embellish.requiredLevel = this.utilityService.godAbility2Level;
      embellish.isAvailable = false;
      embellish.dealsDirectDamage = false;
      embellish.cooldown = embellish.currentCooldown = 40;
      embellish.userEffect.push(this.createStatusEffect(StatusEffectEnum.AttackUp, 6, 1.3, false, true));
      embellish.userEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.3, false, true));
      god.abilityList.push(embellish);

      var specialDelivery = new Ability();
      specialDelivery.name = "Special Delivery";
      specialDelivery.requiredLevel = this.utilityService.godAbility3Level;
      specialDelivery.isAvailable = false;
      specialDelivery.cooldown = specialDelivery.currentCooldown = 35;
      specialDelivery.dealsDirectDamage = false;
      specialDelivery.effectiveness = 1.1;
      specialDelivery.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      specialDelivery.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      specialDelivery.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantAutoAttack, 0, 1.1, true, true));
      god.abilityList.push(specialDelivery);

      var quicken = new Ability();
      quicken.name = "Quicken";
      quicken.requiredLevel = this.utilityService.godPassiveLevel;
      quicken.isAvailable = false;
      quicken.isPassive = true;
      quicken.isActivatable = false;
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
      divineStrike.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
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
      divineStrike.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
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
      divineStrike.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .1, true, true));
      god.abilityList.push(divineStrike);

      var aegis = new Ability();
      aegis.name = "Heavenly Shield";
      aegis.requiredLevel = this.utilityService.godAbility2Level;
      aegis.isAvailable = false;
      aegis.cooldown = aegis.currentCooldown = 6;
      aegis.userEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .8, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 25;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .5;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 6, 1.25, false, false));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.dealsDirectDamage = true;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, 0, .05, true, true));
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

    if (type === StatusEffectEnum.Taunt || type === StatusEffectEnum.Mark || type === StatusEffectEnum.Stun || type === StatusEffectEnum.Blind ||
      type === StatusEffectEnum.RecentlyDefeated || type === StatusEffectEnum.InstantHealAfterAutoAttack)
      statusEffect.refreshes = true;

    if (type === StatusEffectEnum.RecentlyDefeated)
      statusEffect.persistsDeath = true;

    return statusEffect;
  }

  createDamageOverTimeEffect(duration: number, tickFrequency: number, multiplier: number, associatedAbilityName: string, dotType: dotTypeEnum = dotTypeEnum.BasedOnAttack) {
    var statusEffect = new StatusEffect(StatusEffectEnum.DamageOverTime);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.tickFrequency = tickFrequency;
    statusEffect.associatedAbilityName = associatedAbilityName;
    statusEffect.dotType = dotType;

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
    var currentHp = character.battleStats.currentHp;

    character.battleStats = character.baseStats.makeCopy(inBattle);

    if (inBattle)
      character.battleStats.currentHp = currentHp;

    //equipment
    character.battleStats.maxHp += character.equipmentSet.getTotalMaxHpGain();
    character.battleStats.attack += character.equipmentSet.getTotalAttackGain();
    character.battleStats.defense += character.equipmentSet.getTotalDefenseGain();
    character.battleStats.agility += character.equipmentSet.getTotalAgilityGain();
    character.battleStats.luck += character.equipmentSet.getTotalLuckGain();
    character.battleStats.resistance += character.equipmentSet.getTotalResistanceGain();
    character.battleStats.hpRegen = character.equipmentSet.getTotalHpRegenGain();
    character.battleStats.criticalMultiplier = character.equipmentSet.getTotalCriticalMultiplierGain();
    character.battleStats.abilityCooldownReduction = character.equipmentSet.getTotalAbilityCooldownReductionGain();
    character.battleStats.autoAttackCooldownReduction = character.equipmentSet.getTotalAutoAttackCooldownReductionGain();
    character.battleStats.elementalDamageIncrease.holy = character.equipmentSet.getTotalHolyDamageIncreaseGain();
    character.battleStats.elementalDamageIncrease.fire = character.equipmentSet.getTotalFireDamageIncreaseGain();
    character.battleStats.elementalDamageIncrease.water = character.equipmentSet.getTotalWaterDamageIncreaseGain();
    character.battleStats.elementalDamageIncrease.lightning = character.equipmentSet.getTotalLightningDamageIncreaseGain();
    character.battleStats.elementalDamageIncrease.air = character.equipmentSet.getTotalAirDamageIncreaseGain();
    character.battleStats.elementalDamageIncrease.earth = character.equipmentSet.getTotalEarthDamageIncreaseGain();
    character.battleStats.elementalDamageResistance.holy = character.equipmentSet.getTotalHolyDamageResistanceGain();
    character.battleStats.elementalDamageResistance.fire = character.equipmentSet.getTotalFireDamageResistanceGain();
    character.battleStats.elementalDamageResistance.water = character.equipmentSet.getTotalWaterDamageResistanceGain();
    character.battleStats.elementalDamageResistance.lightning = character.equipmentSet.getTotalLightningDamageResistanceGain();
    character.battleStats.elementalDamageResistance.air = character.equipmentSet.getTotalAirDamageResistanceGain();
    character.battleStats.elementalDamageResistance.earth = character.equipmentSet.getTotalEarthDamageResistanceGain();

    //gods
    var god1 = this.globalVar.gods.find(item => character.assignedGod1 === item.type);
    if (god1 !== undefined) {
      character.battleStats.maxHp += god1.statGain.maxHp + god1.permanentStatGain.maxHp;
      character.battleStats.attack += god1.statGain.attack + god1.permanentStatGain.attack;
      character.battleStats.defense += god1.statGain.defense + god1.permanentStatGain.defense;
      character.battleStats.agility += god1.statGain.agility + god1.permanentStatGain.agility;
      character.battleStats.luck += god1.statGain.luck + god1.permanentStatGain.luck;
      character.battleStats.resistance += god1.statGain.resistance + god1.permanentStatGain.resistance;

      character.battleStats.hpRegen += god1.statGain.hpRegen + god1.permanentStatGain.hpRegen;
      character.battleStats.abilityCooldownReduction += god1.statGain.abilityCooldownReduction + god1.permanentStatGain.abilityCooldownReduction;
      character.battleStats.autoAttackCooldownReduction += god1.statGain.autoAttackCooldownReduction + god1.permanentStatGain.autoAttackCooldownReduction;
      character.battleStats.criticalMultiplier += god1.statGain.criticalMultiplier + god1.permanentStatGain.criticalMultiplier;
      character.battleStats.elementalDamageIncrease.increaseByStatArray(god1.statGain.elementalDamageIncrease);
      character.battleStats.elementalDamageIncrease.increaseByStatArray(god1.permanentStatGain.elementalDamageIncrease);
      character.battleStats.elementalDamageResistance.increaseByStatArray(god1.statGain.elementalDamageResistance);
      character.battleStats.elementalDamageResistance.increaseByStatArray(god1.permanentStatGain.elementalDamageResistance);
    }

    var god2 = this.globalVar.gods.find(item => character.assignedGod2 === item.type);
    if (god2 !== undefined) {
      character.battleStats.maxHp += god2.statGain.maxHp + god2.permanentStatGain.maxHp;
      character.battleStats.attack += god2.statGain.attack + god2.permanentStatGain.attack;
      character.battleStats.defense += god2.statGain.defense + god2.permanentStatGain.defense;
      character.battleStats.agility += god2.statGain.agility + god2.permanentStatGain.agility;
      character.battleStats.luck += god2.statGain.luck + god2.permanentStatGain.luck;
      character.battleStats.resistance += god2.statGain.resistance + god2.permanentStatGain.resistance;

      character.battleStats.hpRegen += god2.statGain.hpRegen + god2.permanentStatGain.hpRegen;
      character.battleStats.abilityCooldownReduction += god2.statGain.abilityCooldownReduction + god2.permanentStatGain.abilityCooldownReduction;
      character.battleStats.autoAttackCooldownReduction += god2.statGain.autoAttackCooldownReduction + god2.permanentStatGain.autoAttackCooldownReduction;
      character.battleStats.criticalMultiplier += god2.statGain.criticalMultiplier + god2.permanentStatGain.criticalMultiplier;
      character.battleStats.elementalDamageIncrease.increaseByStatArray(god2.statGain.elementalDamageIncrease);
      character.battleStats.elementalDamageIncrease.increaseByStatArray(god2.permanentStatGain.elementalDamageIncrease);
      character.battleStats.elementalDamageResistance.increaseByStatArray(god2.statGain.elementalDamageResistance);
      character.battleStats.elementalDamageResistance.increaseByStatArray(god2.permanentStatGain.elementalDamageResistance);
    }

    //charms
    character.battleStats.hpRegen += this.charmService.getTotalHpRegenAdditionFromCharms(this.globalVar.resources);

    //chthonic powers    
    character.battleStats.maxHp *= 1 + this.globalVar.chthonicPowers.getMaxHpBoostPercent();
    character.battleStats.attack *= 1 + this.globalVar.chthonicPowers.getAttackBoostPercent();
    character.battleStats.defense *= 1 + this.globalVar.chthonicPowers.getDefenseBoostPercent();
    character.battleStats.agility *= 1 + this.globalVar.chthonicPowers.getAgilityBoostPercent();
    character.battleStats.luck *= 1 + this.globalVar.chthonicPowers.getLuckBoostPercent();
    character.battleStats.resistance *= 1 + this.globalVar.chthonicPowers.getResistanceBoostPercent();
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam) {
    var activeParty = this.getActivePartyCharacters(true);
    var BoonOfOlympus = this.globalVar.resources.find(item => item.item === ItemsEnum.BoonOfOlympus);
    var BoonOfOlympusValue = 1;
    if (BoonOfOlympus !== undefined)
      BoonOfOlympusValue += BoonOfOlympus.amount;

    defeatedEnemies.enemyList.forEach(enemy => {
      activeParty.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel
        && !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(partyMember => {
          //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
          partyMember.exp += enemy.xpGainFromDefeat;
        });

      //active gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type))).forEach(god => {          
          god.exp += enemy.xpGainFromDefeat * BoonOfOlympusValue;          
        });

      //inactive gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        (!activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type)))).forEach(god => {
          god.exp += enemy.xpGainFromDefeat;
        });
    });


    party.forEach(partyMember => {
      var previousXp: number | undefined = undefined;
      while (partyMember.exp >= partyMember.expToNextLevel && partyMember.level < partyMember.maxLevel && (previousXp === undefined || partyMember.exp < previousXp)) {
        previousXp = partyMember.exp;
        this.levelUpPartyMember(partyMember);
        if (partyMember.level === partyMember.maxLevel)
          partyMember.exp = 0;
      }
    });

    this.globalVar.gods.forEach(god => {
      var previousXp: number | undefined = undefined;
      while (god.exp >= god.expToNextLevel && (previousXp === undefined || god.exp < previousXp)) {
        previousXp = god.exp;
        this.levelUpGod(god);
      }
    });
  }

  levelUpPartyMember(character: Character) {
    character.level += 1;
    character.exp -= character.expToNextLevel;

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " attains level <strong>" + character.level + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);
    }

    this.getCharacterLevelStatIncrease(character);
    this.checkForNewCharacterAbilities(character);
    this.checkForNewCharacterOverdrives(character);

    this.calculateCharacterBattleStats(character);
    character.battleStats.currentHp = character.battleStats.maxHp;

    character.expToNextLevel = this.getCharacterXpToNextLevel(character.level);
  }

  getCharacterLevelStatIncrease(character: Character) {
    var statIncrease = 2; /* For levels 1-20 */
    var maxHpBonusMultiplier = 5;

    if (character.level % 10 === 6)
      statIncrease = 5;

    character.baseStats.attack += statIncrease;
    character.baseStats.agility += statIncrease;
    character.baseStats.defense += statIncrease;
    character.baseStats.luck += statIncrease;
    character.baseStats.resistance += statIncrease;
    character.baseStats.maxHp += statIncrease * maxHpBonusMultiplier;
    
    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {      
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " gains <strong>" + (maxHpBonusMultiplier * statIncrease) + " Max HP</strong> and <strong>" + statIncrease + " to all other primary stats</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);
    }
  }

  checkForNewCharacterOverdrives(character: Character) {
    if (character.level === 20)
    {
      character.unlockedOverdrives.push(OverdriveNameEnum.Smash);
    }
  }

  checkForNewCharacterAbilities(character: Character) {
    character.abilityList.forEach(ability => {
      if (character.level >= ability.requiredLevel) {
        if (!ability.isAvailable) {
          if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
            var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " learns a new " + (ability.isPassive ? " passive " : "") + " ability: <strong>" + ability.name + "</strong>." + (ability.isPassive ? " View passive ability description by hovering your character's name." : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
          }
        }
        ability.isAvailable = true;
      }
    });

    //do upgrades
    if (character.level > 10) {
      if (character.level % 10 === 2) {
        this.upgradeCharacterAbility1(character, character.level);
      }
      if (character.level % 10 === 4) {
        this.upgradeCharacterPassive(character, character.level);
      }
      if (character.level % 10 === 8) {
        this.upgradeCharacterAbility2(character, character.level);
      }
    }
  }

  upgradeCharacterAbility1(character: Character, newLevel: number) {
    var ability1 = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
    if (ability1 === undefined)
      return;

    if (character.type === CharacterEnum.Adventurer) {
      ability1.effectiveness += .25;
    }
    if (character.type === CharacterEnum.Archer) {
      ability1.effectiveness += .2;
    }

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + ability1?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
    }
  }

  upgradeCharacterPassive(character: Character, newLevel: number) {
    var ability = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterPassiveLevel);
    if (ability === undefined)
      return;

    if (character.type === CharacterEnum.Adventurer) {
      ability.effectiveness += .05;
    }
    if (character.type === CharacterEnum.Archer) {
      ability.effectiveness += .025;
    }

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + ability?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
    }
  }

  upgradeCharacterAbility2(character: Character, newLevel: number) {
    var ability1 = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterAbility2Level);
    if (ability1 === undefined)
      return;

    if (character.type === CharacterEnum.Adventurer) {
      ability1.effectiveness += .025;
    }
    if (character.type === CharacterEnum.Archer) {
      ability1.effectiveness += .3;
    }

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + ability1?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
    }
  }

  getCharacterColorClassText(type: CharacterEnum) {
    if (type === CharacterEnum.Adventurer)
      return 'adventurerColor';
    if (type === CharacterEnum.Archer)
      return 'archerColor';
    if (type === CharacterEnum.Warrior)
      return 'warriorColor';
    if (type === CharacterEnum.Priest)
      return 'priestColor';

    return '';
  }

  getGodColorClassText(type: GodEnum) {
    if (type === GodEnum.Athena)
      return 'athenaColor';
    if (type === GodEnum.Artemis)
      return 'artemisColor';
    if (type === GodEnum.Hermes)
      return 'hermesColor';
    if (type === GodEnum.Apollo)
      return 'apolloColor';
    if (type === GodEnum.Ares)
      return 'aresColor';
    if (type === GodEnum.Zeus)
      return 'zeusColor';
    if (type === GodEnum.Poseidon)
      return 'poseidonColor';

    return '';
  }

  getCharacterXpToNextLevel(level: number) {
    var baseXp = 100;

    if (level < 20) {
      var factor = 1.333;
      if (level > 9)
        factor = 1.52;
      var additive = level > 4 ? 350 * (level) : 0;
      var exponential = (baseXp * (factor ** (level - 1)));
      var multiplier = baseXp * level;

      return multiplier + exponential + additive;
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

    if (this.globalVar.gameLogSettings.get("godLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " attains level <strong>" + god.level + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);
    }

    var getLevelUpType = this.getGodLevelIncreaseTypeByLevel(god, god.level);
    if (getLevelUpType === GodLevelIncreaseEnum.Stats)
      this.doGodLevelStatIncrease(god);
    else if (getLevelUpType === GodLevelIncreaseEnum.NewAbility)
      this.checkForNewGodAbilities(god);
    else if (getLevelUpType === GodLevelIncreaseEnum.PermanentAbility)
      this.checkForNewGodPermanentAbilities(god);
    else if (getLevelUpType === GodLevelIncreaseEnum.AbilityUpgrade)
      this.checkForNewGodAbilityUpgrades(god);
    else if (getLevelUpType === GodLevelIncreaseEnum.PermanentStats)
      this.checkForNewGodPermanentStats(god);

    god.expToNextLevel = this.getGodXpToNextLevel(god.level);

    this.globalVar.characters.filter(item => item.isAvailable).forEach(character => {
      this.calculateCharacterBattleStats(character);
    });
  }

  //certain levels give something other than stat increases -- new abilities, permanent upgrades, etc
  isGodSpecialLevel(level: number) {
    return level % 5 === 0;
  }

  getGodLevelStatIncreaseValues(god: God, statToIncrease: CharacterStatEnum, statGainAmount: number) {
    var hpModifier = 5;

    var maxHpGain = statToIncrease === CharacterStatEnum.MaxHp ? statGainAmount * god.gainModifiers.maxHp : 0;
    var attackGain = statToIncrease === CharacterStatEnum.Attack ? statGainAmount * god.gainModifiers.attack : 0;
    var defenseGain = statToIncrease === CharacterStatEnum.Defense ? statGainAmount * god.gainModifiers.defense : 0;
    var agilityGain = statToIncrease === CharacterStatEnum.Agility ? statGainAmount * god.gainModifiers.agility : 0;
    var luckGain = statToIncrease === CharacterStatEnum.Luck ? statGainAmount * god.gainModifiers.luck : 0;
    var resistanceGain = statToIncrease === CharacterStatEnum.Resistance ? statGainAmount * god.gainModifiers.resistance : 0;

    return new CharacterStats(maxHpGain * hpModifier, attackGain, defenseGain, agilityGain, luckGain, resistanceGain);
  }

  doGodLevelStatIncrease(god: God) {
    var statToIncrease = this.getNextStatToIncrease(god.lastStatGain);
    god.lastStatGain = statToIncrease;
    var statGainAmount = this.utilityService.godStatGainBaseAmount + (god.statGainCount * this.utilityService.godStatGainLevelIncrement);

    var increaseValues = this.getGodLevelStatIncreaseValues(god, statToIncrease, statGainAmount);

    god.statGain.maxHp += increaseValues.maxHp;
    god.statGain.attack += increaseValues.attack;
    god.statGain.defense += increaseValues.defense;
    god.statGain.agility += increaseValues.agility;
    god.statGain.luck += increaseValues.luck;
    god.statGain.resistance += increaseValues.resistance;

    var statGainText = "";
    if (increaseValues.maxHp > 0)
      statGainText += Math.round(increaseValues.maxHp) + " Max HP, ";
    if (increaseValues.attack > 0)
      statGainText += Math.round(increaseValues.attack) + " Attack, ";
    if (increaseValues.agility > 0)
      statGainText += Math.round(increaseValues.agility) + " Agility, ";
    if (increaseValues.luck > 0)
      statGainText += Math.round(increaseValues.luck) + " Luck, ";
    if (increaseValues.defense > 0)
      statGainText += Math.round(increaseValues.defense) + " Defense, ";
    if (increaseValues.resistance > 0)
      statGainText += Math.round(increaseValues.resistance) + " Resistance, ";

    if (statGainText !== "")
      statGainText = statGainText.substring(0, statGainText.length - 2);

    if (this.globalVar.gameLogSettings.get("godLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " gains <strong>" + statGainText + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);
    }

    god.statGainCount += 1;
  }

  checkForNewGodAbilities(god: God) {
    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel) {
        if (!ability.isAvailable) {
          if (this.globalVar.gameLogSettings.get("godLevelUp")) {
            var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " learns a new " + (ability.isPassive ? " passive " : "") + " ability: <strong>" + ability.name + "</strong>." + (ability.isPassive ? " View passive ability description by hovering your god's name." : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
          }
        }
        ability.isAvailable = true;
      }
    });
  }

  checkForNewGodPermanentAbilities(god: God) {
    if (god.level === this.utilityService.permanentPassiveGodLevel) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.permanentPassiveGodLevel);
      if (ability !== undefined) {
        ability.isAbilityPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp")) {
          if (this.globalVar.gameLogSettings.get("godLevelUp")) {
            var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
            this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
          }
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility2Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.permanentGodAbility2Level);
      if (ability !== undefined) {
        ability.isAbilityPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp")) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility3Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.permanentGodAbility3Level);
      if (ability !== undefined) {
        ability.isAbilityPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp")) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
        }
      }
    }
  }

  checkForNewGodAbilityUpgrades(god: God) {
    var ability = this.getWhichAbilityUpgrade(god, god.level);
    if (ability === undefined)
      return;

    //function for each individual ability type
    //in those functions, break it down by god and give whatever based on upgrade level
    if (ability.ability.requiredLevel === this.utilityService.defaultGodAbilityLevel) {
      this.upgradeGodAbility1(god);
    }
    else if (ability.ability.requiredLevel === this.utilityService.godAbility2Level) {
      this.upgradeGodAbility2(god);
    }
    else if (ability.ability.requiredLevel === this.utilityService.godAbility3Level) {
      this.upgradeGodAbility3(god);
    }
    else if (ability.ability.requiredLevel === this.utilityService.godPassiveLevel) {
      this.upgradeGodPassive(god);
    }

    if (this.globalVar.gameLogSettings.get("godLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>'s ability <strong>" + ability.ability.name + "</strong> has upgraded to level " + ability.upgradeLevel + ".";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
    }
  }

  upgradeGodAbility1(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.defaultGodAbilityLevel);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];
    var targetGainsEffect = ability.targetEffect[0];

    if (god.type === GodEnum.Athena) {
      //every 5 upgrades, increase heal amount    
      if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 40)
        userGainsEffect.effectiveness += .05;
      else
        ability.effectiveness += .3;
    }
    else if (god.type === GodEnum.Artemis) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        //alternate increasing wounding arrow effect and duration every 5 levels until level 100
        if (ability.abilityUpgradeLevel % 15 === 0)
          targetGainsEffect.effectiveness += .05;
        else
          targetGainsEffect.duration += 1;
      }
      else
        ability.effectiveness += .35;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .25;
      else
        ability.effectiveness += .1;
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += 1;
      }
      else
        userGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {

    }
  }

  upgradeGodAbility2(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];
    var userGainsSecondEffect = ability.userEffect[1];
    var targetGainsEffect = ability.targetEffect[0];

    if (god.type === GodEnum.Athena) {
      //30 levels of reducing cooldown to 45 seconds
      if (ability.abilityUpgradeLevel % 3 === 1 && ability.abilityUpgradeLevel <= 90)
        ability.cooldown -= .5;
      //30 levels of increasuing duration to 14 seconds
      else if (ability.abilityUpgradeLevel % 3 === 2 && ability.abilityUpgradeLevel <= 90)
        userGainsEffect.duration += .2;
      else
        //40 levels of increasing effectiveness to 60% reduction
        userGainsEffect.effectiveness += .1;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 10 === 5 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += 1;
      else
        ability.effectiveness += .15;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += .5;
        userGainsSecondEffect.duration += .5;
      }
      else {
        userGainsEffect.effectiveness += .025;
        userGainsSecondEffect.effectiveness += .025;
      }
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += 1;
      }
      else
        userGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {

    }
  }

  upgradeGodAbility3(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];
    var targetGainsEffect = ability.targetEffect[0];

    if (god.type === GodEnum.Athena) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      //5, 15, 45, 75, 90 increase blind effectiveness
      else if ((ability.abilityUpgradeLevel === 5 || ability.abilityUpgradeLevel % 15 === 0) && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .05;
      else if ((ability.abilityUpgradeLevel === 35 || ability.abilityUpgradeLevel === 70) && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += 1;
      else
        ability.effectiveness += .2;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .01;
      else
        ability.effectiveness += .4;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if ((ability.abilityUpgradeLevel === 45 || ability.abilityUpgradeLevel === 90) && ability.abilityUpgradeLevel <= 100)
        ability.userEffect.push(userGainsEffect.makeCopy());
      else
        ability.userEffect.forEach(effect => { effect.effectiveness += .01 });
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += 1;
      }
      else
        userGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {

    }
  }

  upgradeGodPassive(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];

    if (god.type === GodEnum.Athena) {
      if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .1;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .009;
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 2;
      else
        ability.effectiveness += .3;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {

    }
  }

  getGodPermanentStatObtainCount(god: God, godLevel: number) {
    if (godLevel % 100 === 0) {
      var matchingCount = god.permanentStat2GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0) {
      var matchingCount = god.permanentStat1GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }

    return [0, 0];
  }

  isGodPermanentStatStillObtainable(god: God, godLevel: number) {
    var count = this.getGodPermanentStatObtainCount(god, godLevel);

    if (godLevel % 100 === 0) {
      if (count[1] >= this.utilityService.godPermanentStatGain2ObtainCap)
        return false;
    }
    else if (godLevel % 50 === 0) {
      if (count[1] >= this.utilityService.godPermanentStatGain1ObtainCap)
        return false;
    }
    return true;
  }

  getNewGodPermanentStats(god: God, godLevel: number) {
    var stats = new CharacterStats(0, 0, 0, 0, 0, 0);

    if (godLevel % 100 === 0) {
      if (god.type === GodEnum.Athena) {
        stats.elementalDamageIncrease.holy += .05;
      }
      else if (god.type === GodEnum.Artemis) {
        stats.criticalMultiplier += .1;
      }
      else if (god.type === GodEnum.Hermes) {
        stats.autoAttackCooldownReduction += .05;
      }
      else if (god.type === GodEnum.Apollo) {
        stats.hpRegen += 5;
      }
    }
    else if (godLevel % 50 === 0) {
      if (god.type === GodEnum.Athena) {
        stats.defense += godLevel;
      }
      else if (god.type === GodEnum.Artemis) {
        stats.luck += godLevel;
      }
      else if (god.type === GodEnum.Hermes) {
        stats.agility += godLevel;
      }
      else if (god.type === GodEnum.Apollo) {
        stats.resistance += godLevel;
      }
    }

    return stats;
  }

  checkForNewGodPermanentStats(god: God) {
    var upgradedStats = this.getNewGodPermanentStats(god, god.level);

    if (god.level % 100 === 0) {
      var matchingCount = god.permanentStat2GainCount.find(item => item[0] === god.level);
      if (matchingCount === undefined)
        god.permanentStat2GainCount.push([god.level, 1]);
      else
        matchingCount[1] += 1;

      if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain2ObtainCap)
        return;
    }
    else if (god.level % 50 === 0) {
      var matchingCount = god.permanentStat1GainCount.find(item => item[0] === god.level);
      if (matchingCount === undefined)
        god.permanentStat1GainCount.push([god.level, 1]);
      else
        matchingCount[1] += 1;

      if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain1ObtainCap)
        return;
    }

    god.permanentStatGain.attack += upgradedStats.attack;
    god.permanentStatGain.defense += upgradedStats.defense;
    god.permanentStatGain.maxHp += upgradedStats.maxHp;
    god.permanentStatGain.agility += upgradedStats.agility;
    god.permanentStatGain.luck += upgradedStats.luck;
    god.permanentStatGain.resistance += upgradedStats.resistance;

    god.permanentStatGain.hpRegen += upgradedStats.hpRegen;
    god.permanentStatGain.elementalDamageIncrease.increaseByStatArray(upgradedStats.elementalDamageIncrease);
    god.permanentStatGain.elementalDamageResistance.increaseByStatArray(upgradedStats.elementalDamageResistance);
    god.permanentStatGain.criticalMultiplier += upgradedStats.criticalMultiplier;
    god.permanentStatGain.abilityCooldownReduction += upgradedStats.abilityCooldownReduction;
    god.permanentStatGain.autoAttackCooldownReduction += upgradedStats.autoAttackCooldownReduction;
  }

  //set this up entirely so you can tell what is going on. when leveling up, consult this before calling any function
  //and each type should have its own function
  //ability upgrades will need to be further broken down to follow the excel guide up to level 100 or so then you can automate it
  //the lookup function will also use this, display X number of each type and keep iterating until you get what you need
  getGodLevelIncreaseTypeByLevel(god: God, level: number) {
    var increaseType = GodLevelIncreaseEnum.Stats;

    if (level === this.utilityService.defaultGodAbilityLevel || level === this.utilityService.godPassiveLevel ||
      level === this.utilityService.godAbility2Level || level === this.utilityService.godAbility3Level) {
      increaseType = GodLevelIncreaseEnum.NewAbility;
    }
    else if (level === this.utilityService.permanentPassiveGodLevel ||
      level === this.utilityService.permanentGodAbility2Level || level === this.utilityService.permanentGodAbility3Level) {
      increaseType = GodLevelIncreaseEnum.PermanentAbility;
    }
    else if ((level === 50 || level === 100 || level === 150 || level === 200 ||
      (level > 200 && level <= 500 && level % 25 === 0))) {
      if (this.isGodPermanentStatStillObtainable(god, level))
        increaseType = GodLevelIncreaseEnum.PermanentStats;
      else
        increaseType = GodLevelIncreaseEnum.Stats;
    }
    else if (level % 5 === 0) {
      increaseType = GodLevelIncreaseEnum.AbilityUpgrade;
    }

    return increaseType;
  }

  getWhichAbilityUpgrade(god: God, godLevel: number) {
    var ability = new Ability();
    var upgradeLevel = 1;

    var defaultAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.defaultGodAbilityLevel);
    var passiveAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
    var ability2 = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
    var ability3 = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);

    if (defaultAbility === undefined || passiveAbility === undefined || ability2 === undefined || ability3 === undefined)
      return undefined;

    //only need to map out the first 100 lvls or so
    if (godLevel === 10) {
      ability = defaultAbility;
    }
    else if (godLevel === 15) {
      ability = passiveAbility;
    }
    else if (godLevel === 25) {
      ability = passiveAbility;
      upgradeLevel = 2;
    }
    else if (godLevel === 30) {
      ability = ability2;
      upgradeLevel = 2;
    }
    else if (godLevel === 35) {
      ability = passiveAbility;
      upgradeLevel = 2;
    }
    else if (godLevel === 45) {
      ability = ability2;
      upgradeLevel = 2;
    }
    else if (godLevel === 55) {
      ability = defaultAbility;
      upgradeLevel = 3;
    }
    else if (godLevel === 60) {
      ability = ability2;
      upgradeLevel = 3;
    }
    else if (godLevel === 65) {
      ability = defaultAbility;
      upgradeLevel = 4;
    }
    else if (godLevel === 70) {
      ability = passiveAbility;
      upgradeLevel = 3;
    }
    else {
      //4 3 3 1 at this point
      //needs to rotate 3 abilities twice then passive, then repeat
      var repeaterLevel = (godLevel - 70) % 35;
      var repeaterCount = Math.ceil((godLevel - 70) / 35);
      //starts at 75 aka 5 here
      //a1 upgrade at 5 and 20, a2 at 10 and 25, a3 at 15 and 30, passive at 35 (or 0 for mod)
      //at a certain cut off level this might change because certain abilities can only grow so much like athena a2
      if (repeaterLevel === 0) {
        ability = passiveAbility;
        upgradeLevel = repeaterCount + 3;
      }
      else if (repeaterLevel === 5 || repeaterLevel === 20) {
        ability = defaultAbility;
        upgradeLevel = repeaterLevel === 5 ? repeaterCount + 4 : repeaterCount + 5;
      }
      else if (repeaterLevel === 10 || repeaterLevel === 25) {
        ability = ability2;
        upgradeLevel = repeaterLevel === 10 ? repeaterCount + 3 : repeaterCount + 4;
      }
      else if (repeaterLevel === 15 || repeaterLevel === 30) {
        ability = ability3;
        upgradeLevel = repeaterLevel === 15 ? repeaterCount + 1 : repeaterCount + 2;
      }
    }

    return { ability, upgradeLevel };
  }

  getGodXpToNextLevel(level: number) {
    var baseXp = 500;

    var factor = 1.021;
    var additive = baseXp * (level - 1);
    var exponential = (baseXp * (factor ** (level)));

    //
    return exponential + additive;
  }

  getNextStatToIncrease(lastStat: CharacterStatEnum) {
    var nextStat = CharacterStatEnum.Attack;

    if (lastStat === CharacterStatEnum.Resistance)
      nextStat = CharacterStatEnum.Attack;
    else if (lastStat === CharacterStatEnum.Attack)
      nextStat = CharacterStatEnum.MaxHp;
    else if (lastStat === CharacterStatEnum.MaxHp)
      nextStat = CharacterStatEnum.Agility;
    else if (lastStat === CharacterStatEnum.Agility)
      nextStat = CharacterStatEnum.Defense;
    else if (lastStat === CharacterStatEnum.Defense)
      nextStat = CharacterStatEnum.Luck;
    else if (lastStat === CharacterStatEnum.Luck)
      nextStat = CharacterStatEnum.Resistance;

    return nextStat;
  }
}
