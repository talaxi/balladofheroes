import { Injectable } from '@angular/core';
import { last } from 'rxjs';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { God } from 'src/app/models/character/god.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
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
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { CharmService } from '../resources/charm.service';
import { EquipmentService } from '../resources/equipment.service';
import { UtilityService } from '../utility/utility.service';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { DictionaryService } from '../utility/dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  maxBankedTime = 0;
  bankedTime = 0;
  globalVar = new GlobalVariables();

  constructor(private utilityService: UtilityService, private gameLogService: GameLogService, private charmService: CharmService,
    private equipmentService: EquipmentService, private dictionaryService: DictionaryService) { }

  getCurrentVersion() {
    return .45;
  }

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
    adventurer.baseStats = new CharacterStats(190, 16, 10, 0, 5, 8);
    adventurer.battleStats = adventurer.baseStats.makeCopy();
    adventurer.battleInfo.timeToAutoAttack = this.utilityService.quickAutoAttackSpeed;
    adventurer.battleInfo.autoAttackModifier = this.utilityService.weakAutoAttack;
    this.assignAbilityInfo(adventurer);
    this.calculateCharacterBattleStats(adventurer);

    this.globalVar.characters.push(adventurer);

    var archer = new Character(CharacterEnum.Archer);
    archer.name = "Archer";
    archer.type = CharacterEnum.Archer;
    archer.isAvailable = false;
    archer.baseStats = new CharacterStats(200, 15, 6, 5, 13, 6);
    archer.battleStats = archer.baseStats.makeCopy();
    archer.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    archer.battleInfo.autoAttackModifier = this.utilityService.weakAutoAttack;
    this.calculateCharacterBattleStats(archer);
    this.assignAbilityInfo(archer);

    this.globalVar.characters.push(archer);

    var warrior = new Character(CharacterEnum.Warrior);
    warrior.name = "Warrior";
    warrior.type = CharacterEnum.Warrior;
    warrior.isAvailable = false;
    warrior.baseStats = new CharacterStats(225, 17, 12, 8, 8, 12);
    warrior.battleStats = warrior.baseStats.makeCopy();
    warrior.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    warrior.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
    this.calculateCharacterBattleStats(warrior);
    this.assignAbilityInfo(warrior);

    this.globalVar.characters.push(warrior);

    var priest = new Character(CharacterEnum.Priest);
    priest.name = "Priest";
    priest.type = CharacterEnum.Priest;
    priest.isAvailable = false;
    priest.baseStats = new CharacterStats(175, 17, 9, 6, 7, 10);
    priest.battleStats = priest.baseStats.makeCopy();
    priest.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;
    priest.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
    this.calculateCharacterBattleStats(priest);
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
      barrage.effectiveness = .2;
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
      pinningShot.cooldown = pinningShot.currentCooldown = 36;
      pinningShot.dealsDirectDamage = true;
      pinningShot.effectiveness = 1.6;
      pinningShot.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false));
      character.abilityList.push(pinningShot);
    }

    if (character.type === CharacterEnum.Warrior) {
      var battleCry = new Ability();
      battleCry.name = "Battle Cry";
      battleCry.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      battleCry.isAvailable = false;
      battleCry.cooldown = battleCry.currentCooldown = 16;
      battleCry.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Taunt, 10, 0, false, false, false, character.name));
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
      shieldSlam.effectiveness = 1.5;
      shieldSlam.secondaryEffectiveness = .4;
      shieldSlam.dealsDirectDamage = true;
      shieldSlam.cooldown = shieldSlam.currentCooldown = 43;
      character.abilityList.push(shieldSlam);
    }

    if (character.type === CharacterEnum.Priest) {
      var heal = new Ability();
      heal.name = "Heal";
      heal.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      heal.targetType = TargetEnum.LowestHpPercent;
      heal.isAvailable = false;
      heal.effectiveness = .3;
      heal.heals = true;
      heal.targetsAllies = true;
      heal.dealsDirectDamage = false;
      heal.cooldown = heal.currentCooldown = 13;
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
      barrier.cooldown = barrier.currentCooldown = 44;
      barrier.userEffect.push(this.createStatusEffect(StatusEffectEnum.Barrier, -1, .7, true, true, true, "", .1));
      character.abilityList.push(barrier);
    }
  }

  initializeGods() {
    var athena = new God(GodEnum.Athena);
    athena.name = "Athena";
    athena.displayOrder = 1;
    this.assignGodAbilityInfo(athena);
    this.globalVar.gods.push(athena);

    var artemis = new God(GodEnum.Artemis);
    artemis.name = "Artemis";
    artemis.displayOrder = 2;
    this.assignGodAbilityInfo(artemis);
    this.globalVar.gods.push(artemis);

    var apollo = new God(GodEnum.Apollo);
    apollo.name = "Apollo";
    apollo.displayOrder = 4;
    this.assignGodAbilityInfo(apollo);
    this.globalVar.gods.push(apollo);

    var hermes = new God(GodEnum.Hermes);
    hermes.name = "Hermes";
    hermes.displayOrder = 3;
    this.assignGodAbilityInfo(hermes);
    this.globalVar.gods.push(hermes);

    var zeus = new God(GodEnum.Zeus);
    zeus.name = "Zeus";
    zeus.displayOrder = 9;
    this.assignGodAbilityInfo(zeus);
    this.globalVar.gods.push(zeus);

    var ares = new God(GodEnum.Ares);
    ares.name = "Ares";
    ares.displayOrder = 5;
    this.assignGodAbilityInfo(ares);
    this.globalVar.gods.push(ares);

    var poseidon = new God(GodEnum.Poseidon);
    poseidon.name = "Poseidon";
    poseidon.displayOrder = 10;
    this.assignGodAbilityInfo(poseidon);
    this.globalVar.gods.push(poseidon);

    var hades = new God(GodEnum.Hades);
    hades.name = "Hades";
    hades.displayOrder = 6;
    this.assignGodAbilityInfo(hades);
    this.globalVar.gods.push(hades);

    var dionysus = new God(GodEnum.Dionysus);
    dionysus.name = "Dionysus";
    dionysus.displayOrder = 8;
    this.assignGodAbilityInfo(dionysus);
    this.globalVar.gods.push(dionysus);

    var nemesis = new God(GodEnum.Nemesis);
    nemesis.name = "Nemesis";
    nemesis.displayOrder = 7;
    this.assignGodAbilityInfo(nemesis);
    this.globalVar.gods.push(nemesis);
  }

  assignGodAbilityInfo(god: God) {
    god.abilityList = [];

    if (god.type === GodEnum.Athena) {
      var divineStrike = new Ability();
      divineStrike.name = "Divine Strike";
      divineStrike.isAvailable = false;
      divineStrike.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      divineStrike.cooldown = divineStrike.currentCooldown = 33;
      divineStrike.dealsDirectDamage = true;
      divineStrike.effectiveness = 1.8;
      divineStrike.elementalType = ElementalTypeEnum.Holy;
      divineStrike.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .05, true, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Divine Strike"));
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
      blindingLight.cooldown = blindingLight.currentCooldown = 51;
      blindingLight.isAoe = true;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = .6;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 5, .25, false, false, true));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.isActivatable = false;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, -1, 3, false, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Second Wind"));
      god.abilityList.push(secondWind);
    }

    if (god.type === GodEnum.Artemis) {
      var woundingArrow = new Ability();
      woundingArrow.name = "Wounding Arrow";
      woundingArrow.isAvailable = false;
      woundingArrow.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      woundingArrow.cooldown = woundingArrow.currentCooldown = 38;
      woundingArrow.effectiveness = 2;
      woundingArrow.dealsDirectDamage = true;
      woundingArrow.targetEffect.push(this.createStatusEffect(StatusEffectEnum.AttackDown, 7, .9, false, false));
      god.abilityList.push(woundingArrow);

      var electricVolley = new Ability();
      electricVolley.name = "Paralyzing Volley";
      electricVolley.isAvailable = false;
      electricVolley.requiredLevel = this.utilityService.godAbility2Level;
      electricVolley.cooldown = electricVolley.currentCooldown = 55;
      electricVolley.effectiveness = .5;
      electricVolley.isAoe = true;
      electricVolley.dealsDirectDamage = true;
      electricVolley.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Paralyze, 12, 0, false, false, true));
      god.abilityList.push(electricVolley);

      var exposeWeakness = new Ability();
      exposeWeakness.name = "Expose Weakness";
      exposeWeakness.isAvailable = false;
      exposeWeakness.requiredLevel = this.utilityService.godAbility3Level;
      exposeWeakness.cooldown = exposeWeakness.currentCooldown = 62;
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
      staccato.userEffect.push(this.createStatusEffect(StatusEffectEnum.Staccato, 10, 1.15, false, true));
      god.abilityList.push(staccato);

      var fortissimo = new Ability();
      fortissimo.name = "Fortissimo";
      fortissimo.isAvailable = false;
      fortissimo.requiredLevel = this.utilityService.godAbility2Level;
      fortissimo.cooldown = fortissimo.currentCooldown = 45;
      fortissimo.dealsDirectDamage = false;
      fortissimo.secondaryEffectiveness = 1.01;
      fortissimo.userEffect.push(this.createStatusEffect(StatusEffectEnum.Fortissimo, 8, 1.15, false, true));
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
      ostinato.effectiveness = .4;
      ostinato.heals = true;
      ostinato.targetsAllies = true;
      ostinato.targetType = TargetEnum.LowestHpPercent;
      ostinato.cooldown = ostinato.currentCooldown = 20;
      god.abilityList.push(ostinato);
    }

    if (god.type === GodEnum.Hermes) {
      var trickShot = new Ability();
      trickShot.name = "Nimble Strike";
      trickShot.isAvailable = false;
      trickShot.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      trickShot.cooldown = trickShot.currentCooldown = 15;
      trickShot.dealsDirectDamage = true;
      trickShot.effectiveness = 1.1;
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
      specialDelivery.cooldown = specialDelivery.currentCooldown = 54;
      specialDelivery.dealsDirectDamage = false;
      specialDelivery.effectiveness = 1.1;
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

    if (god.type === GodEnum.Hades) {
      var hellfire = new Ability();
      hellfire.name = "Hellfire";
      hellfire.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      hellfire.isAvailable = false;
      hellfire.cooldown = hellfire.currentCooldown = 26;
      hellfire.dealsDirectDamage = true;
      hellfire.effectiveness = 1.3;
      hellfire.isAoe = true;
      hellfire.elementalType = ElementalTypeEnum.Fire;
      god.abilityList.push(hellfire);

      var earthquake = new Ability();
      earthquake.name = "Earthquake";
      earthquake.requiredLevel = this.utilityService.godAbility2Level;
      earthquake.isAvailable = false;
      earthquake.cooldown = earthquake.currentCooldown = 41;
      earthquake.dealsDirectDamage = true;
      earthquake.effectiveness = 1.75;
      earthquake.isAoe = true;
      earthquake.elementalType = ElementalTypeEnum.Earth;
      god.abilityList.push(earthquake);

      var disaster = new Ability();
      disaster.name = "Natural Disaster";
      disaster.requiredLevel = this.utilityService.godAbility3Level;
      disaster.isAvailable = false;
      disaster.cooldown = disaster.currentCooldown = 70;
      disaster.dealsDirectDamage = true;
      disaster.effectiveness = 1.4;
      disaster.isAoe = true;
      god.abilityList.push(disaster);

      var lordOfTheUnderworld = new Ability();
      lordOfTheUnderworld.name = "Lord of the Underworld";
      lordOfTheUnderworld.requiredLevel = this.utilityService.godPassiveLevel;
      lordOfTheUnderworld.isAvailable = false;
      lordOfTheUnderworld.isPassive = true;
      lordOfTheUnderworld.isActivatable = false;
      lordOfTheUnderworld.dealsDirectDamage = false;
      lordOfTheUnderworld.maxCount = 5;
      lordOfTheUnderworld.userEffect.push(this.createStatusEffect(StatusEffectEnum.LordOfTheUnderworld, 15, 1.02, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 5));
      god.abilityList.push(lordOfTheUnderworld);
    }

    if (god.type === GodEnum.Ares) {
      var rupture = new Ability();
      rupture.name = "Rupture";
      rupture.isAvailable = false;
      rupture.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      rupture.cooldown = rupture.currentCooldown = 21;
      rupture.dealsDirectDamage = false;
      rupture.targetEffect.push(this.createDamageOverTimeEffect(10, 2.5, .3, rupture.name, dotTypeEnum.BasedOnAttack));
      god.abilityList.push(rupture);

      var onslaught = new Ability();
      onslaught.name = "Onslaught";
      onslaught.requiredLevel = this.utilityService.godAbility2Level;
      onslaught.isAvailable = false;
      onslaught.dealsDirectDamage = false;
      onslaught.cooldown = onslaught.currentCooldown = 32;
      onslaught.userEffect.push(this.createStatusEffect(StatusEffectEnum.Onslaught, -1, 1, false, true));
      onslaught.targetEffect.push(this.createDamageOverTimeEffect(8, 4, .25, onslaught.name, dotTypeEnum.None));
      god.abilityList.push(onslaught);

      var revelInBlood = new Ability();
      revelInBlood.name = "Revel in Blood";
      revelInBlood.requiredLevel = this.utilityService.godAbility3Level;
      revelInBlood.isAvailable = false;
      revelInBlood.cooldown = revelInBlood.currentCooldown = 44;
      revelInBlood.dealsDirectDamage = false;
      revelInBlood.isAoe = true;
      revelInBlood.targetEffect.push(this.createDamageOverTimeEffect(15, 5, 2, revelInBlood.name, dotTypeEnum.None, undefined, true));
      god.abilityList.push(revelInBlood);

      var bloodlust = new Ability();
      bloodlust.name = "Bloodlust";
      bloodlust.requiredLevel = this.utilityService.godPassiveLevel;
      bloodlust.isAvailable = false;
      bloodlust.isPassive = true;
      bloodlust.isActivatable = false;
      bloodlust.dealsDirectDamage = false;
      bloodlust.maxCount = 5;
      bloodlust.effectiveness = .01;
      god.abilityList.push(bloodlust);
    }

    if (god.type === GodEnum.Dionysus) {
      var revelry = new Ability();
      revelry.name = "Revelry";
      revelry.isAvailable = true;
      revelry.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      revelry.dealsDirectDamage = false;
      revelry.targetsAllies = true;
      revelry.secondaryEffectiveness = 1.025;
      revelry.cooldown = revelry.currentCooldown = 31;
      revelry.userEffect.push(this.createStatusEffect(StatusEffectEnum.Barrier, -1, .65, true, true, false, "", .25));
      god.abilityList.push(revelry);

      var thyrsus = new Ability();
      thyrsus.name = "Thyrsus";
      thyrsus.requiredLevel = this.utilityService.godAbility2Level;
      thyrsus.isAvailable = false;
      thyrsus.cooldown = thyrsus.currentCooldown = 45;
      thyrsus.effectiveness = 2.1;
      thyrsus.dealsDirectDamage = true;
      thyrsus.secondaryEffectiveness = 1.1;
      thyrsus.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Thyrsus, 6, 1.02, false, false));
      god.abilityList.push(thyrsus);

      var insanity = new Ability();
      insanity.name = "Insanity";
      insanity.requiredLevel = this.utilityService.godAbility3Level;
      insanity.isAvailable = false;
      insanity.cooldown = insanity.currentCooldown = 42;
      insanity.dealsDirectDamage = false;
      insanity.targetEffect.push(this.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 10, .92, true, false));
      insanity.targetEffect.push(this.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 10, .92, true, false));
      god.abilityList.push(insanity);

      var haveADrink = new Ability();
      haveADrink.name = "Have a Drink";
      haveADrink.requiredLevel = this.utilityService.godPassiveLevel;
      haveADrink.isAvailable = false;
      haveADrink.isPassive = true;
      haveADrink.isActivatable = true;
      haveADrink.dealsDirectDamage = false;
      haveADrink.userEffect.push(this.createStatusEffect(StatusEffectEnum.RandomPrimaryStatUp, 15, 1.25, true, true));
      haveADrink.cooldown = haveADrink.currentCooldown = 40;
      god.abilityList.push(haveADrink);
    }

    if (god.type === GodEnum.Nemesis) {
      var retribution = new Ability();
      retribution.name = "Retribution";
      retribution.isAvailable = true;
      retribution.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      retribution.cooldown = retribution.currentCooldown = 22;
      retribution.dealsDirectDamage = false;
      retribution.effectiveness = 2.1;
      retribution.maxCount = 1;
      retribution.userEffect.push(this.createStatusEffect(StatusEffectEnum.Retribution, 20, .95, false, true));
      god.abilityList.push(retribution);

      var chainsOfFate = new Ability();
      chainsOfFate.name = "Chains of Fate";
      chainsOfFate.requiredLevel = this.utilityService.godAbility2Level;
      chainsOfFate.isAvailable = false;
      chainsOfFate.dealsDirectDamage = false;
      chainsOfFate.effectiveness = 1.01;
      chainsOfFate.cooldown = chainsOfFate.currentCooldown = 36;
      chainsOfFate.userEffect.push(this.createStatusEffect(StatusEffectEnum.ChainsOfFate, 15, 1, false, true));
      chainsOfFate.targetEffect.push(this.createStatusEffect(StatusEffectEnum.ChainsOfFate, 15, 1, false, false));
      god.abilityList.push(chainsOfFate);

      var noEscape = new Ability();
      noEscape.name = "No Escape";
      noEscape.requiredLevel = this.utilityService.godAbility3Level;
      noEscape.isAvailable = false;
      noEscape.cooldown = noEscape.currentCooldown = 58;
      noEscape.dealsDirectDamage = true;
      noEscape.effectiveness = 1.65;
      noEscape.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      noEscape.userEffect.push(this.createStatusEffect(StatusEffectEnum.KeepDues, -1, 1, true, true));
      god.abilityList.push(noEscape);

      var dispenserOfDues = new Ability();
      dispenserOfDues.name = "Dispenser of Dues";
      dispenserOfDues.requiredLevel = this.utilityService.godPassiveLevel;
      dispenserOfDues.isAvailable = false;
      dispenserOfDues.isPassive = true;
      dispenserOfDues.isActivatable = false;
      dispenserOfDues.dealsDirectDamage = false;
      dispenserOfDues.effectiveness = .05;
      dispenserOfDues.userEffect.push(this.createStatusEffect(StatusEffectEnum.DispenserOfDues, -1, 0, false, true));
      god.abilityList.push(dispenserOfDues);
    }

    if (god.type === GodEnum.Zeus) {
      /*var divineStrike = new Ability();
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
      god.abilityList.push(secondWind);*/
    }

    if (god.type === GodEnum.Poseidon) {
      /*var divineStrike = new Ability();
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
      god.abilityList.push(secondWind);*/
    }

  }

  initializeItemBelt() {
    for (var i = 0; i < this.utilityService.maxItemBeltSize; i++) {
      this.globalVar.itemBelt.push(ItemsEnum.None);
    }
  }

  createStatusEffect(type: StatusEffectEnum, duration: number, multiplier: number, isInstant: boolean, isPositive: boolean,
    isAoe: boolean = false, caster: string = "", threshold: number = 1, effectStacks: boolean = false,
    element: ElementalTypeEnum = ElementalTypeEnum.None, triggersEvery: number = 0, targetsAllies: boolean = false, abilityName: string = "", maxCount: number = 0) {
    var statusEffect = new StatusEffect(type);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.isInstant = isInstant;
    statusEffect.isPositive = isPositive;
    statusEffect.isAoe = isAoe;
    statusEffect.caster = caster;
    statusEffect.threshold = threshold;
    statusEffect.effectStacks = effectStacks;
    statusEffect.element = element;
    statusEffect.triggersEvery = triggersEvery;
    statusEffect.targetsAllies = targetsAllies;
    statusEffect.abilityName = abilityName;
    statusEffect.maxCount = maxCount;

    if (duration === -1)
      statusEffect.isPermanent = true;

    return statusEffect;
  }

  createDamageOverTimeEffect(duration: number, tickFrequency: number, multiplier: number, abilityName: string, dotType: dotTypeEnum = dotTypeEnum.BasedOnAttack, associatedElement: ElementalTypeEnum = ElementalTypeEnum.None, isAoe: boolean = false) {
    var statusEffect = new StatusEffect(StatusEffectEnum.DamageOverTime);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.tickFrequency = tickFrequency;
    statusEffect.abilityName = abilityName;
    statusEffect.dotType = dotType;
    statusEffect.element = associatedElement;
    statusEffect.isAoe = isAoe;

    return statusEffect;
  }

  doesStatusEffectRefresh(type: StatusEffectEnum) {
    var refreshes = false;

    if (type === StatusEffectEnum.Taunt || type === StatusEffectEnum.Mark || type === StatusEffectEnum.Stun || type === StatusEffectEnum.Blind ||
      type === StatusEffectEnum.RecentlyDefeated || type === StatusEffectEnum.InstantHealAfterAutoAttack || type === StatusEffectEnum.AgilityDown ||
      type === StatusEffectEnum.AgilityUp || type === StatusEffectEnum.AttackDown || type === StatusEffectEnum.AttackUp ||
      type === StatusEffectEnum.DefenseDown || type === StatusEffectEnum.DefenseUp || type === StatusEffectEnum.ResistanceDown || type === StatusEffectEnum.ResistanceUp ||
      type === StatusEffectEnum.MaxHpDown || type === StatusEffectEnum.MaxHpUp || type === StatusEffectEnum.LuckDown || type === StatusEffectEnum.LuckUp ||
      type === StatusEffectEnum.Coda || type === StatusEffectEnum.Fortissimo || type === StatusEffectEnum.Staccato || type === StatusEffectEnum.DamageDealtUp ||
      type === StatusEffectEnum.DamageDealtDown || type === StatusEffectEnum.DamageTakenDown || type === StatusEffectEnum.DamageTakenUp || type === StatusEffectEnum.DebilitatingToxin
      || type === StatusEffectEnum.PoisonousToxin || type === StatusEffectEnum.HeroicElixir || type === StatusEffectEnum.ThousandCuts ||
      type === StatusEffectEnum.RejuvenatingElixir || type === StatusEffectEnum.ReduceHealing || type === StatusEffectEnum.WitheringToxin ||
      type === StatusEffectEnum.VenomousToxin || type === StatusEffectEnum.Unsteady || type === StatusEffectEnum.AllElementalResistanceDown ||
      type === StatusEffectEnum.LordOfTheUnderworld || type === StatusEffectEnum.Onslaught || type === StatusEffectEnum.EarthDamageUp || type === StatusEffectEnum.FireDamageUp
      || type === StatusEffectEnum.AirDamageUp || type === StatusEffectEnum.HolyDamageUp || type === StatusEffectEnum.LightningDamageUp || type === StatusEffectEnum.WaterDamageUp || type === StatusEffectEnum.EarthDamageDown || type === StatusEffectEnum.FireDamageDown
      || type === StatusEffectEnum.AirDamageDown || type === StatusEffectEnum.HolyDamageDown || type === StatusEffectEnum.LightningDamageDown || type === StatusEffectEnum.WaterDamageDown || type === StatusEffectEnum.EarthDamageTakenUp || type === StatusEffectEnum.FireDamageTakenUp
      || type === StatusEffectEnum.AirDamageTakenUp || type === StatusEffectEnum.HolyDamageTakenUp || type === StatusEffectEnum.LightningDamageTakenUp || type === StatusEffectEnum.WaterDamageTakenUp || type === StatusEffectEnum.EarthDamageTakenDown || type === StatusEffectEnum.FireDamageTakenDown
      || type === StatusEffectEnum.AirDamageTakenDown || type === StatusEffectEnum.HolyDamageTakenDown || type === StatusEffectEnum.LightningDamageTakenDown || type === StatusEffectEnum.WaterDamageTakenDown ||
      type === StatusEffectEnum.AoeDamageUp || type === StatusEffectEnum.ChainsOfFate || type === StatusEffectEnum.Retribution)
      refreshes = true;

    return refreshes;
  }

  doesStatusEffectPersistDeath(type: StatusEffectEnum) {
    var persistsDeath = false;

    if (type === StatusEffectEnum.RecentlyDefeated || type === StatusEffectEnum.PoisonousToxin || type === StatusEffectEnum.DebilitatingToxin ||
      type === StatusEffectEnum.WitheringToxin || type === StatusEffectEnum.VenomousToxin || type === StatusEffectEnum.Dead)
      persistsDeath = true;

    return persistsDeath;
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

    //equipment
    character.battleStats.maxHp += this.equipmentService.getTotalMaxHpGain(character.equipmentSet);
    character.battleStats.attack += this.equipmentService.getTotalAttackGain(character.equipmentSet);
    character.battleStats.defense += this.equipmentService.getTotalDefenseGain(character.equipmentSet);
    character.battleStats.agility += this.equipmentService.getTotalAgilityGain(character.equipmentSet);
    character.battleStats.luck += this.equipmentService.getTotalLuckGain(character.equipmentSet);
    character.battleStats.resistance += this.equipmentService.getTotalResistanceGain(character.equipmentSet);
    character.battleStats.hpRegen = this.equipmentService.getTotalHpRegenGain(character.equipmentSet);
    character.battleStats.criticalMultiplier = this.equipmentService.getTotalCriticalMultiplierGain(character.equipmentSet);
    character.battleStats.armorPenetration = this.equipmentService.getTotalArmorPenetrationGain(character.equipmentSet);
    character.battleStats.healingReceived = this.equipmentService.getTotalHealingReceivedGain(character.equipmentSet);
    character.battleStats.healingDone = this.equipmentService.getTotalHealingDoneGain(character.equipmentSet);
    character.battleStats.aoeDamage = this.equipmentService.getTotalAoeDamageGain(character.equipmentSet);
    character.battleStats.thorns = this.equipmentService.getTotalThornsGain(character.equipmentSet);
    character.battleStats.tickFrequency = this.equipmentService.getTotalTickFrequencyGain(character.equipmentSet);
    character.battleStats.abilityCooldownReductionStart = (1 - this.equipmentService.getTotalAbilityCooldownReductionStartGain(character.equipmentSet));
    character.battleStats.abilityCooldownReductionWithBuffs = (1 - this.equipmentService.getTotalAbilityCooldownReductionWithBuffsGain(character.equipmentSet));
    character.battleStats.overdriveGainFromAutoAttacks = this.equipmentService.getTotalOverdriveGainFromAutoAttacksGain(character.equipmentSet);
    character.battleStats.debuffDuration = this.equipmentService.getTotalDebuffDurationGain(character.equipmentSet);
    character.battleStats.overdriveGain = this.equipmentService.getTotalOverdriveGain(character.equipmentSet);
    character.battleStats.abilityCooldownReduction = (1 - this.equipmentService.getTotalAbilityCooldownReductionGain(character.equipmentSet));
    character.battleStats.autoAttackCooldownReduction = (1 - this.equipmentService.getTotalAutoAttackCooldownReductionGain(character.equipmentSet));
    character.battleStats.elementIncrease.holy = this.equipmentService.getTotalHolyDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementIncrease.fire = this.equipmentService.getTotalFireDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementIncrease.water = this.equipmentService.getTotalWaterDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementIncrease.lightning = this.equipmentService.getTotalLightningDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementIncrease.air = this.equipmentService.getTotalAirDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementIncrease.earth = this.equipmentService.getTotalEarthDamageIncreaseGain(character.equipmentSet);
    character.battleStats.elementResistance.holy = this.equipmentService.getTotalHolyDamageResistanceGain(character.equipmentSet);
    character.battleStats.elementResistance.fire = this.equipmentService.getTotalFireDamageResistanceGain(character.equipmentSet);
    character.battleStats.elementResistance.water = this.equipmentService.getTotalWaterDamageResistanceGain(character.equipmentSet);
    character.battleStats.elementResistance.lightning = this.equipmentService.getTotalLightningDamageResistanceGain(character.equipmentSet);
    character.battleStats.elementResistance.air = this.equipmentService.getTotalAirDamageResistanceGain(character.equipmentSet);
    character.battleStats.elementResistance.earth = this.equipmentService.getTotalEarthDamageResistanceGain(character.equipmentSet);

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
      character.battleStats.abilityCooldownReduction *= (1 - (god1.statGain.abilityCooldownReduction + god1.permanentStatGain.abilityCooldownReduction));
      character.battleStats.autoAttackCooldownReduction *= (1 - (god1.statGain.autoAttackCooldownReduction + god1.permanentStatGain.autoAttackCooldownReduction));
      character.battleStats.criticalMultiplier += god1.statGain.criticalMultiplier + god1.permanentStatGain.criticalMultiplier;
      character.battleStats.overdriveGain += god1.statGain.overdriveGain + god1.permanentStatGain.overdriveGain;
      character.battleStats.armorPenetration += god1.statGain.armorPenetration + god1.permanentStatGain.armorPenetration;
      character.battleStats.healingReceived += god1.statGain.healingReceived + god1.permanentStatGain.healingReceived;
      character.battleStats.debuffDuration += god1.statGain.debuffDuration + god1.permanentStatGain.debuffDuration;
      character.battleStats.overdriveGainFromAutoAttacks += god1.statGain.overdriveGainFromAutoAttacks + god1.permanentStatGain.overdriveGainFromAutoAttacks;
      character.battleStats.healingDone += god1.statGain.healingDone + god1.permanentStatGain.healingDone;
      character.battleStats.aoeDamage += god1.statGain.aoeDamage + god1.permanentStatGain.aoeDamage;
      character.battleStats.tickFrequency += god1.statGain.tickFrequency + god1.permanentStatGain.tickFrequency;
      character.battleStats.thorns += god1.statGain.thorns + god1.permanentStatGain.thorns;
      character.battleStats.abilityCooldownReductionStart *= (1 - (god1.statGain.abilityCooldownReductionStart + god1.permanentStatGain.abilityCooldownReductionStart));
      character.battleStats.abilityCooldownReductionWithBuffs *= (1 - (god1.statGain.abilityCooldownReductionWithBuffs + god1.permanentStatGain.abilityCooldownReductionWithBuffs));
      character.battleStats.elementIncrease.increaseByStatArray(god1.statGain.elementIncrease);
      character.battleStats.elementIncrease.increaseByStatArray(god1.permanentStatGain.elementIncrease);
      character.battleStats.elementResistance.increaseByStatArray(god1.statGain.elementResistance);
      character.battleStats.elementResistance.increaseByStatArray(god1.permanentStatGain.elementResistance);
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
      character.battleStats.abilityCooldownReduction *= (1 - (god2.statGain.abilityCooldownReduction + god2.permanentStatGain.abilityCooldownReduction));
      character.battleStats.autoAttackCooldownReduction *= (1 - (god2.statGain.autoAttackCooldownReduction + god2.permanentStatGain.autoAttackCooldownReduction));
      character.battleStats.criticalMultiplier += god2.statGain.criticalMultiplier + god2.permanentStatGain.criticalMultiplier;
      character.battleStats.overdriveGain += god2.statGain.overdriveGain + god2.permanentStatGain.overdriveGain;
      character.battleStats.armorPenetration += god2.statGain.armorPenetration + god2.permanentStatGain.armorPenetration;
      character.battleStats.healingReceived += god2.statGain.healingReceived + god2.permanentStatGain.healingReceived;
      character.battleStats.debuffDuration += god2.statGain.debuffDuration + god2.permanentStatGain.debuffDuration;
      character.battleStats.overdriveGainFromAutoAttacks += god2.statGain.overdriveGainFromAutoAttacks + god2.permanentStatGain.overdriveGainFromAutoAttacks;
      character.battleStats.healingDone += god2.statGain.healingDone + god2.permanentStatGain.healingDone;
      character.battleStats.aoeDamage += god2.statGain.aoeDamage + god2.permanentStatGain.aoeDamage;
      character.battleStats.thorns += god2.statGain.thorns + god2.permanentStatGain.thorns;
      character.battleStats.tickFrequency += god2.statGain.tickFrequency + god2.permanentStatGain.tickFrequency;
      character.battleStats.abilityCooldownReductionWithBuffs *= (1 - (god2.statGain.abilityCooldownReductionWithBuffs + god2.permanentStatGain.abilityCooldownReductionWithBuffs));
      character.battleStats.abilityCooldownReductionStart *= (1 - (god2.statGain.abilityCooldownReductionStart + god2.permanentStatGain.abilityCooldownReductionStart));
      character.battleStats.elementIncrease.increaseByStatArray(god2.statGain.elementIncrease);
      character.battleStats.elementIncrease.increaseByStatArray(god2.permanentStatGain.elementIncrease);
      character.battleStats.elementResistance.increaseByStatArray(god2.statGain.elementResistance);
      character.battleStats.elementResistance.increaseByStatArray(god2.permanentStatGain.elementResistance);
    }

    //charms
    character.battleStats.hpRegen += this.charmService.getTotalHpRegenAdditionFromCharms(this.globalVar.resources);
    character.battleStats.criticalMultiplier += this.charmService.getTotalCriticalMultiplierAdditionFromCharms(this.globalVar.resources);
    character.battleStats.armorPenetration += this.charmService.getTotalArmorPenetrationAdditionFromCharms(this.globalVar.resources);
    character.battleStats.overdriveGain += this.charmService.getTotalOverdriveGainAdditionFromCharms(this.globalVar.resources);
    character.battleStats.abilityCooldownReduction *= (1 - this.charmService.getTotalAbilityCooldownReductionAdditionFromCharms(this.globalVar.resources));
    character.battleStats.autoAttackCooldownReduction *= (1 - this.charmService.getTotalAutoAttackCooldownReductionAdditionFromCharms(this.globalVar.resources));
    character.battleStats.healingReceived += this.charmService.getTotalHealingReceivedAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.debuffDuration += this.charmService.getTotalDebuffDurationAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.overdriveGainFromAutoAttacks += this.charmService.getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.healingDone += this.charmService.getTotalHealingDoneAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.aoeDamage += this.charmService.getTotalAoeDamageAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.thorns += this.charmService.getTotalThornsAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.tickFrequency += this.charmService.getTotalTickFrequencyAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.abilityCooldownReductionWithBuffs *= (1 - this.charmService.getTotalAbilityCooldownReductionWithBuffsFromCharms(this.globalVar.resources, character));
    character.battleStats.abilityCooldownReductionStart *= (1 - this.charmService.getTotalAbilityCooldownReductionStartAdditionFromCharms(this.globalVar.resources, character));

    character.battleStats.elementIncrease.holy += this.charmService.getTotalHolyDamageIncreaseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementIncrease.fire += this.charmService.getTotalFireDamageIncreaseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementIncrease.lightning += this.charmService.getTotalLightningDamageIncreaseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementIncrease.water += this.charmService.getTotalWaterDamageIncreaseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementIncrease.air += this.charmService.getTotalAirDamageIncreaseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementIncrease.earth += this.charmService.getTotalEarthDamageIncreaseAdditionFromCharms(this.globalVar.resources);

    character.battleStats.elementResistance.holy += this.charmService.getTotalHolyDamageResistanceAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementResistance.fire += this.charmService.getTotalFireDamageResistanceAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementResistance.lightning += this.charmService.getTotalLightningDamageResistanceAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementResistance.water += this.charmService.getTotalWaterDamageResistanceAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementResistance.air += this.charmService.getTotalAirDamageResistanceAdditionFromCharms(this.globalVar.resources);
    character.battleStats.elementResistance.earth += this.charmService.getTotalEarthDamageResistanceAdditionFromCharms(this.globalVar.resources);


    //chthonic powers    
    character.battleStats.maxHp *= 1 + this.globalVar.chthonicPowers.getMaxHpBoostPercent();
    character.battleStats.attack *= 1 + this.globalVar.chthonicPowers.getAttackBoostPercent();
    character.battleStats.defense *= 1 + this.globalVar.chthonicPowers.getDefenseBoostPercent();
    character.battleStats.agility *= 1 + this.globalVar.chthonicPowers.getAgilityBoostPercent();
    character.battleStats.luck *= 1 + this.globalVar.chthonicPowers.getLuckBoostPercent();
    character.battleStats.resistance *= 1 + this.globalVar.chthonicPowers.getResistanceBoostPercent();

    if (inBattle)
      character.battleStats.currentHp = currentHp;
    else
      character.battleStats.currentHp = character.battleStats.maxHp;

    //round to save data space
    character.battleStats = this.roundCharacterStats(character.battleStats);
  }

  roundCharacterStats(stats: CharacterStats, roundAmount?: number) {
    if (roundAmount === undefined)
      roundAmount = this.utilityService.genericRoundTo;

    stats.maxHp = this.utilityService.roundTo(stats.maxHp, roundAmount);
    stats.currentHp = this.utilityService.roundTo(stats.currentHp, roundAmount);
    stats.attack = this.utilityService.roundTo(stats.attack, roundAmount);
    stats.agility = this.utilityService.roundTo(stats.agility, roundAmount);
    stats.luck = this.utilityService.roundTo(stats.luck, roundAmount);
    stats.defense = this.utilityService.roundTo(stats.defense, roundAmount);
    stats.resistance = this.utilityService.roundTo(stats.resistance, roundAmount);

    //do secondary stuff too
    stats.elementIncrease.fire = this.utilityService.roundTo(stats.elementIncrease.fire, roundAmount);
    stats.elementIncrease.holy = this.utilityService.roundTo(stats.elementIncrease.holy, roundAmount);
    stats.elementIncrease.earth = this.utilityService.roundTo(stats.elementIncrease.earth, roundAmount);
    stats.elementIncrease.water = this.utilityService.roundTo(stats.elementIncrease.water, roundAmount);
    stats.elementIncrease.lightning = this.utilityService.roundTo(stats.elementIncrease.lightning, roundAmount);
    stats.elementIncrease.air = this.utilityService.roundTo(stats.elementIncrease.air, roundAmount);

    stats.elementResistance.fire = this.utilityService.roundTo(stats.elementResistance.fire, roundAmount);
    stats.elementResistance.holy = this.utilityService.roundTo(stats.elementResistance.holy, roundAmount);
    stats.elementResistance.earth = this.utilityService.roundTo(stats.elementResistance.earth, roundAmount);
    stats.elementResistance.water = this.utilityService.roundTo(stats.elementResistance.water, roundAmount);
    stats.elementResistance.lightning = this.utilityService.roundTo(stats.elementResistance.lightning, roundAmount);
    stats.elementResistance.air = this.utilityService.roundTo(stats.elementResistance.air, roundAmount);

    return stats;
  }

  giveCharactersBonusExp(party: Character[], bonusXp: number) {
    var activeParty = this.getActivePartyCharacters(true);

    //bonus XP has no restrictions on being dead
    activeParty.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel).forEach(partyMember => {
      partyMember.exp += bonusXp;
    });

    //active gods
    this.globalVar.gods.filter(god => god.isAvailable &&
      activeParty.some(partyMember => (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type))).forEach(god => {
        this.giveGodExp(god, bonusXp);
      });

    //inactive gods
    this.globalVar.gods.filter(god => god.isAvailable &&
      (!activeParty.some(partyMember => (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type)))).forEach(god => {
        var inactiveGodModifier = .25; //this can be increased maybe with future items

        this.giveGodExp(god, bonusXp * inactiveGodModifier);
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
  }

  giveCharactersExp(party: Character[], defeatedEnemies: EnemyTeam) {
    var activeParty = this.getActivePartyCharacters(true);

    defeatedEnemies.enemyList.forEach(enemy => {
      activeParty.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel
        && !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(partyMember => {
          //needs to have some sort of modification factor on beating enemies at a certain lvl compared to you
          partyMember.exp += enemy.xpGainFromDefeat;
        });

      //active gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type))).forEach(god => {
          this.giveGodExp(god, enemy.xpGainFromDefeat);
        });

      //inactive gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        (!activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type)))).forEach(god => {
          var inactiveGodModifier = .25; //this can be increased maybe with future items

          this.giveGodExp(god, enemy.xpGainFromDefeat * inactiveGodModifier);
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
    });
  }

  getGodExpBonus(god: God) {
    var bonus = 1;
    var BoonOfOlympus = this.globalVar.resources.find(item => item.item === ItemsEnum.BoonOfOlympus);
    var BoonOfOlympusValue = 1;
    if (BoonOfOlympus !== undefined)
      BoonOfOlympusValue += BoonOfOlympus.amount;

    var affinityBoost = 1;

    //repeats every 4 levels, duration increase is at level X3
    var affinityIncreaseCount = Math.floor(god.affinityLevel / 4);
    if (god.affinityLevel % 4 >= 3)
      affinityIncreaseCount += 1;

    affinityBoost = 1 + (affinityIncreaseCount * this.utilityService.affinityRewardGodXpBonus);

    bonus *= BoonOfOlympusValue * affinityBoost;
    return bonus;
  }

  giveGodExp(god: God, xpAmount: number) {
    god.exp += xpAmount * this.getGodExpBonus(god);

    var previousXp: number | undefined = undefined;
    while (god.exp >= god.expToNextLevel && (previousXp === undefined || god.exp < previousXp)) {
      previousXp = god.exp;
      this.levelUpGod(god);
    }
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
    var statIncrease = 1; /* For levels 1-20 */
    var maxHpBonusMultiplier = 5;

    statIncrease *= Math.ceil(character.level / 10);
    if (character.level % 10 === 6)
      statIncrease *= 3;

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
    if (character.level === 20) {
      character.unlockedOverdrives.push(OverdriveNameEnum.Fervor);
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

    ability1.abilityUpgradeLevel += 1;
    if (character.type === CharacterEnum.Adventurer) {
      ability1.effectiveness += .5;
    }
    if (character.type === CharacterEnum.Archer) {
      ability1.effectiveness += .4;
    }
    if (character.type === CharacterEnum.Priest) {
      ability1.effectiveness += .1;
    }
    if (character.type === CharacterEnum.Warrior) {
      ability1.cooldown -= .5;
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

    ability.abilityUpgradeLevel += 1;

    var targetGainsEffect = ability.targetEffect[0];

    if (character.type === CharacterEnum.Adventurer) {
      ability.effectiveness += .1;
    }
    if (character.type === CharacterEnum.Archer) {
      targetGainsEffect.effectiveness += .025;
    }
    if (character.type === CharacterEnum.Priest) {
      ability.effectiveness += .1;
    }
    if (character.type === CharacterEnum.Warrior) {
      ability.effectiveness += .1;
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

    ability1.abilityUpgradeLevel += 1;
    if (character.type === CharacterEnum.Adventurer) {
      ability1.userEffect[0].effectiveness += .025;
    }
    if (character.type === CharacterEnum.Archer) {
      ability1.effectiveness += .4;
    }
    if (character.type === CharacterEnum.Priest) {
      ability1.effectiveness += .1;
    }
    if (character.type === CharacterEnum.Warrior) {
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
    if (type === GodEnum.Hades)
      return 'hadesColor';
    if (type === GodEnum.Dionysus)
      return 'dionysusColor';
    if (type === GodEnum.Nemesis)
      return 'nemesisColor';

    return '';
  }

  getCharacterXpToNextLevel(level: number) {
    var baseXp = 100;
    var factor = 1.333;
    //if (level < 30) {            
    if (level > 9) {
      baseXp = 1000;
    }
    if (level > 49) {
      baseXp = 100000;
      factor = 1.165;
    }
    var additive = level > 4 ? 350 * (level) : 0;
    var exponential = (baseXp * (factor ** (level - 1)));
    var multiplier = baseXp * level;

    //(100 * level) + (100 * (1.333^(level-1))) + 350*level      
    return this.utilityService.roundTo(multiplier + exponential + additive, 5);
  }

  levelUpGod(god: God) {
    god.level += 1;
    god.exp -= god.expToNextLevel;

    if (god.name !== undefined && this.globalVar.gameLogSettings.get("godLevelUp")) {
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

    god.statGain = this.roundCharacterStats(god.statGain);

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
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
      if (ability !== undefined) {
        ability.isPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp")) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility2Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
      if (ability !== undefined) {
        ability.isPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp")) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry);
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility3Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
      if (ability !== undefined) {
        ability.isPermanent = true;
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
      //every 10 upgrades, increase heal amount    
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .02;
      else
        ability.effectiveness += .15;
    }
    else if (god.type === GodEnum.Artemis) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        //alternate increasing wounding arrow effect and duration every 5 levels until level 100
        if (ability.abilityUpgradeLevel % 15 === 0)
          targetGainsEffect.effectiveness -= .05;
        else
          targetGainsEffect.duration += 1;
      }
      else
        ability.effectiveness += .20;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .25;
      else
        ability.effectiveness += .075;
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += 1;
      }
      else
        userGainsEffect.effectiveness += .02;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {
      //every 5 upgrades until level 100, increase duration
      if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .5;
      else
        targetGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Hades) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        ability.effectiveness += .06;
    }
    else if (god.type === GodEnum.Nemesis) {
      //every 33 upgrades until level 100, add extra hit
      if (ability.abilityUpgradeLevel % 33 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.maxCount += 1;
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.effectiveness -= .05;
      }
      else
        ability.effectiveness += .20;
    }
    else if (god.type === GodEnum.Dionysus) {
      //every 33 upgrades until level 100, add extra hit
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.threshold += .05;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        ability.secondaryEffectiveness += .0075;
      }
      else
        userGainsEffect.effectiveness += .025;
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
      //30 levels of increasing duration to 14 seconds
      else if (ability.abilityUpgradeLevel % 3 === 2 && ability.abilityUpgradeLevel <= 90)
        userGainsEffect.duration += .2;
      else
        //40 levels of increasing effectiveness to 70% reduction
        userGainsEffect.effectiveness -= .0125;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 10 === 5 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += 1;
      else
        ability.effectiveness += .075;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += .5;
        userGainsSecondEffect.duration += .5;
      }
      else {
        userGainsEffect.effectiveness += .0075;
        userGainsSecondEffect.effectiveness += .0075;
      }
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel === 33 || ability.abilityUpgradeLevel === 66)
        ability.secondaryEffectiveness += .02;
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += 1;
      }
      else
        userGainsEffect.effectiveness += .02;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {
      //every 5 upgrades until level 100, increase duration
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .25;
      else
        targetGainsEffect.effectiveness += .025;
    }
    else if (god.type === GodEnum.Hades) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        ability.effectiveness += .075;
    }
    else if (god.type === GodEnum.Nemesis) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        ability.effectiveness += .03;
    }
    else if (god.type === GodEnum.Dionysus) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .008;
      else if (ability.abilityUpgradeLevel % 11 === 0 && ability.abilityUpgradeLevel <= 100) {
        ability.secondaryEffectiveness += .1;
      }
      else {
        if (ability.abilityUpgradeLevel % 12 === 1 && ability.abilityUpgradeLevel <= 100)
          targetGainsEffect.duration += .5;

        ability.effectiveness += .15;
      }
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
      else if ((ability.abilityUpgradeLevel === 5 || ability.abilityUpgradeLevel % 15 === 0) && ability.abilityUpgradeLevel <= 100) {
        targetGainsEffect.effectiveness += .05;
      }
      else if ((ability.abilityUpgradeLevel === 35 || ability.abilityUpgradeLevel === 70) && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += 1;
      else
        ability.effectiveness += .05;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .01;
      else
        ability.effectiveness += .35;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1.2;
      else if (ability.abilityUpgradeLevel === 15 || ability.abilityUpgradeLevel === 45 || ability.abilityUpgradeLevel === 75)
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
        userGainsEffect.effectiveness += .02;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        targetGainsEffect.effectiveness += .05;
    }
    else if (god.type === GodEnum.Hades) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else
        ability.effectiveness += .025;
    }
    else if (god.type === GodEnum.Nemesis) {
      if (ability.abilityUpgradeLevel === 50 || ability.abilityUpgradeLevel === 100)
        ability.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .8;
      else
        ability.effectiveness += .075;
    }
    else if (god.type === GodEnum.Dionysus) {
      if (ability.abilityUpgradeLevel % 12 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.targetEffect.push(targetGainsEffect.makeCopy());
      else {
        if (ability.abilityUpgradeLevel % 2 === 0 || (ability.abilityUpgradeLevel === 13 || ability.abilityUpgradeLevel === 37 ||
          ability.abilityUpgradeLevel === 61 || ability.abilityUpgradeLevel === 85)) {
          ability.targetEffect.forEach(effect => { effect.effectiveness -= .005 });
        }
        else {
          ability.targetEffect.forEach(effect => { effect.duration += .25 });
        }
      }
    }
  }

  upgradeGodPassive(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];

    if (god.type === GodEnum.Athena) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness *= 2;
      else if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += ability.abilityUpgradeLevel + 2;
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
        ability.cooldown -= .5;
      else
        ability.effectiveness += .035;
    }
    else if (god.type === GodEnum.Zeus) {

    }
    else if (god.type === GodEnum.Ares) {
      //increase max count to 10
      if (ability.abilityUpgradeLevel % 20 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.maxCount += 1;
      else
        if (ability.abilityUpgradeLevel <= 100)
          ability.effectiveness += .005;
    }
    else if (god.type === GodEnum.Hades) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.duration += 1.5;
      else
        userGainsEffect.effectiveness += .015;
    }
    else if (god.type === GodEnum.Nemesis) {
      if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .025;
    }
    else if (god.type === GodEnum.Dionysus) {
      if (ability.abilityUpgradeLevel === 45)
        ability.userEffect.push(userGainsEffect.makeCopy());
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.userEffect.forEach(effect => { effect.duration += 1 });
      else
        ability.userEffect.forEach(effect => { effect.effectiveness += .0075 });
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
        stats.elementIncrease.holy += godLevel / 25000; //should lead to +60% holy damage
      }
      else if (god.type === GodEnum.Artemis) {
        stats.criticalMultiplier += godLevel / 20000; //should lead to +75% crit damage increase
      }
      else if (god.type === GodEnum.Hermes) {
        stats.autoAttackCooldownReduction += godLevel / 100000; //should lead to +15% auto attack CD reduction
      }
      else if (god.type === GodEnum.Apollo) {
        stats.hpRegen += godLevel / 250; //should lead to 60 hp per 5 sec
      }
      else if (god.type === GodEnum.Ares) {
        stats.overdriveGain += godLevel / 60000; //should lead to +25% overdrive gain
      }
      else if (god.type === GodEnum.Hades) {
        stats.elementIncrease.fire += godLevel / 25000; //should lead to +60% fire damage
      }
      else if (god.type === GodEnum.Dionysus) {
        stats.abilityCooldownReduction += godLevel / 100000; //should lead to +15% ability CD reduction
      }
      else if (god.type === GodEnum.Nemesis) {
        stats.armorPenetration += godLevel / 75000; //should lead to +20% armor penetration
      }
    }
    else if (godLevel % 50 === 0) {
      if (god.type === GodEnum.Athena || god.type === GodEnum.Dionysus) {
        stats.defense += Math.round(godLevel / (3 + (1 / 3)));
      }
      else if (god.type === GodEnum.Artemis || god.type === GodEnum.Hades) {
        stats.luck += Math.round(godLevel / (3 + (1 / 3)));
      }
      else if (god.type === GodEnum.Hermes) {
        stats.agility += Math.round(godLevel / (3 + (1 / 3)));
      }
      else if (god.type === GodEnum.Apollo || god.type === GodEnum.Nemesis) {
        stats.resistance += Math.round(godLevel / (3 + (1 / 3)));
      }
      else if (god.type === GodEnum.Ares) {
        stats.maxHp += Math.round((godLevel / (3 + (1 / 3))) * 5);
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
    god.permanentStatGain.elementIncrease.increaseByStatArray(upgradedStats.elementIncrease);
    god.permanentStatGain.elementResistance.increaseByStatArray(upgradedStats.elementResistance);
    god.permanentStatGain.criticalMultiplier += upgradedStats.criticalMultiplier;
    god.permanentStatGain.abilityCooldownReduction += upgradedStats.abilityCooldownReduction;
    god.permanentStatGain.autoAttackCooldownReduction += upgradedStats.autoAttackCooldownReduction;
    god.permanentStatGain.armorPenetration += upgradedStats.armorPenetration;
    god.permanentStatGain.overdriveGain += upgradedStats.overdriveGain;

    god.permanentStatGain = this.roundCharacterStats(god.permanentStatGain);

    var statGainText = "";
    if (upgradedStats.maxHp > 0)
      statGainText += Math.round(upgradedStats.maxHp) + " Max HP, ";
    if (upgradedStats.attack > 0)
      statGainText += Math.round(upgradedStats.attack) + " Attack, ";
    if (upgradedStats.agility > 0)
      statGainText += Math.round(upgradedStats.agility) + " Agility, ";
    if (upgradedStats.luck > 0)
      statGainText += Math.round(upgradedStats.luck) + " Luck, ";
    if (upgradedStats.defense > 0)
      statGainText += Math.round(upgradedStats.defense) + " Defense, ";
    if (upgradedStats.resistance > 0)
      statGainText += Math.round(upgradedStats.resistance) + " Resistance, ";

    if (upgradedStats.hpRegen > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.hpRegen) + " HP Regen per 5 sec, ";
    if (upgradedStats.criticalMultiplier > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.criticalMultiplier * 100) + "% Critical Multiplier, ";
    if (upgradedStats.autoAttackCooldownReduction > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.autoAttackCooldownReduction * 100) + "% Auto Attack Cooldown Reduction, ";
    if (upgradedStats.healingDone > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.healingDone * 100) + "% Healing Done, ";
    if (upgradedStats.elementIncrease.holy > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.holy * 100) + "% Holy Damage Increase, ";
    if (upgradedStats.elementIncrease.fire > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.fire * 100) + "% Fire Damage Increase, ";
    if (upgradedStats.overdriveGain > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.overdriveGain * 100) + "% Overdrive Gain, ";
    if (upgradedStats.armorPenetration > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.armorPenetration * 100) + "% Armor Penetration, ";
    if (upgradedStats.abilityCooldownReduction > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.abilityCooldownReduction * 100) + "% Ability Cooldown Reduction, ";

    if (statGainText !== "")
      statGainText = statGainText.substring(0, statGainText.length - 2);

    if (this.globalVar.gameLogSettings.get("godLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry);
    }

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
    //TODO: just make this %50 up to whatever level you have permanent stats (will be 1500 for now)
    //else if ((level === 50 || level === 100 || level === 150 || level === 200 ||
      //(level > 200 && level <= 500 && level % 50 === 0))) {
    else if (level % 50 === 0 && level <= 2000) {
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
      ability = defaultAbility;
      upgradeLevel = 2;
    }
    else if (godLevel === 30) {
      ability = ability2;
    }
    else if (godLevel === 35) {
      ability = passiveAbility;
      upgradeLevel = 2;
    }
    else if (godLevel === 40) {
      ability = ability2;
      upgradeLevel = 2;
    }
    else if (godLevel === 45) {
      ability = defaultAbility;
      upgradeLevel = 3;
    }
    else if (godLevel === 55) {
      ability = ability2;
      upgradeLevel = 3;
    }
    else if (godLevel === 60) {
      ability = defaultAbility;
      upgradeLevel = 4;
    }
    else if (godLevel === 65) {
      ability = passiveAbility;
      upgradeLevel = 3;
    }
    else if (godLevel === 70) {
      ability = defaultAbility;
      upgradeLevel = 5;
    }
    else {
      var repeaterLevelStart = 75;

      //5 3 3 1 at this point
      //needs to rotate 3 abilities twice then passive, then repeat
      var repeaterLevel = (godLevel - repeaterLevelStart) % 35;
      var repeaterCount = Math.ceil((godLevel - repeaterLevelStart) / 35);
      var permanentStatSlotCount = 0;//ability upgrades are ignored and permanent stats are gained instead
      var maxPermanentStatLevel = 500; //permanent stats are no longer a thing at 500 but may change in the future
      var repeaterCheck1 = 0;
      var repeaterCheck2 = 0;

      //repeater levels 10 and 25
      //does not match on god level 100 (30) and does match on 150 (80)

      //starts at 75 aka 5 here
      //a1 upgrade at 5 and 20, a2 at 10 and 25, a3 at 15 and 30, passive at 35 (or 0 for mod)
      //at a certain cut off level this might change because certain abilities can only grow so much like athena a2
      if (repeaterLevel === 0) {
        ability = passiveAbility;
        upgradeLevel = repeaterCount + 3;

        repeaterCheck1 = 0;
        repeaterCheck2 = -100; //doesn't repeat a second time
      }
      else if (repeaterLevel === 5 || repeaterLevel === 20) {
        ability = defaultAbility;
        upgradeLevel = repeaterLevel === 5 ? ((repeaterCount - 1) * 2) + 6 : ((repeaterCount - 1) * 2) + 7;

        repeaterCheck1 = 5;
        repeaterCheck2 = 20;
      }
      else if (repeaterLevel === 10 || repeaterLevel === 25) {
        ability = ability2;
        upgradeLevel = repeaterLevel === 10 ? ((repeaterCount - 1) * 2) + 4 : ((repeaterCount - 1) * 2) + 5;

        repeaterCheck1 = 10;
        repeaterCheck2 = 25;
      }
      else if (repeaterLevel === 15 || repeaterLevel === 30) {
        ability = ability3;
        upgradeLevel = repeaterLevel === 15 ? ((repeaterCount - 1) * 2) + 1 : ((repeaterCount - 1) * 2) + 2;

        repeaterCheck1 = 15;
        repeaterCheck2 = 30;
      }

      for (var i = 100; i <= maxPermanentStatLevel; i += 50) {
        var adjustedLevel = i - repeaterLevelStart;
        if (godLevel >= i && (adjustedLevel % 35 === repeaterCheck1 || adjustedLevel % 35 === repeaterCheck2))
          permanentStatSlotCount += 1;
      }

      //check for matching permanent abilitys
      if (godLevel >= this.utilityService.permanentGodAbility2Level &&
        ((this.utilityService.permanentGodAbility2Level - repeaterLevelStart) % 35 === repeaterCheck1 || (this.utilityService.permanentGodAbility2Level - repeaterLevelStart) % 35 === repeaterCheck2))
        permanentStatSlotCount += 1;
      if (godLevel >= this.utilityService.permanentGodAbility3Level &&
        ((this.utilityService.permanentGodAbility3Level - repeaterLevelStart) % 35 === repeaterCheck1 || (this.utilityService.permanentGodAbility3Level - repeaterLevelStart) % 35 === repeaterCheck2))
        permanentStatSlotCount += 1;
      if (godLevel >= this.utilityService.permanentPassiveGodLevel &&
        ((this.utilityService.permanentPassiveGodLevel - repeaterLevelStart) % 35 === repeaterCheck1 || (this.utilityService.permanentPassiveGodLevel - repeaterLevelStart) % 35 === repeaterCheck2))
        permanentStatSlotCount += 1;

      upgradeLevel -= permanentStatSlotCount;
    }

    return { ability, upgradeLevel };
  }

  getGodXpToNextLevel(level: number) {
    var baseXp = 200;
    var tier1Breakpoint = 500;

    if (level < 15)
      baseXp += level * 10;
    else if (level < 200)
      baseXp = 350;
    else
      baseXp = 500;

    //(350 * (1.0155 ^ level)) + (350 * (level - 1))
    var tier1Xp = 0;
    var factor = 1.0155;
    var tier1Level = level > tier1Breakpoint ? tier1Breakpoint : level;
    var additive = (baseXp) * (tier1Level - 1);
    var exponential = (baseXp * (factor ** (tier1Level)));
    tier1Xp = this.utilityService.roundTo(exponential + additive, 5);

    var tier2Xp = 0;
    if (level > tier1Breakpoint) {
      baseXp = 50000;
      var factor = 1.0038;
      var tier2Level = level - (tier1Breakpoint);
      var exponential = (baseXp * (factor ** (tier2Level)));
      var additive = tier2Level * (baseXp / 10);
      tier2Xp = this.utilityService.roundTo(exponential + additive, 5);
    }

    return tier1Xp + tier2Xp;
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

  getAutoAttackTime(character: Character) {
    var timeToAutoAttack = character.battleInfo.timeToAutoAttack * (character.battleStats.autoAttackCooldownReduction);
    if (character.overdriveInfo.isActive && character.overdriveInfo.selectedOverdrive === OverdriveNameEnum.Fervor)
      timeToAutoAttack *= .67;

    if (character.type !== CharacterEnum.Enemy && this.getAltarEffectWithEffect(AltarEffectsEnum.HermesRareReduceAutoAttackCooldown) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.HermesRareReduceAutoAttackCooldown);
      timeToAutoAttack *= relevantAltarEffect!.effectiveness;
    }

    return this.utilityService.roundTo(timeToAutoAttack, 4);
  }

  getAltarEffectWithEffect(effect: AltarEffectsEnum) {
    if (this.globalVar.altars.activeAltarEffect1 !== undefined &&
      this.globalVar.altars.activeAltarEffect1.type === effect)
      return this.globalVar.altars.activeAltarEffect1;

    if (this.globalVar.altars.activeAltarEffect2 !== undefined &&
      this.globalVar.altars.activeAltarEffect2.type === effect)
      return this.globalVar.altars.activeAltarEffect2;

    if (this.globalVar.altars.activeAltarEffect3 !== undefined &&
      this.globalVar.altars.activeAltarEffect3.type === effect)
      return this.globalVar.altars.activeAltarEffect3;

    if (this.globalVar.altars.additionalAltarEffects !== undefined &&
      this.globalVar.altars.additionalAltarEffects.some(item => item.type === effect))
      return this.globalVar.altars.additionalAltarEffects.find(item => item.type === effect);

    return undefined;
  }

  resetCooldowns() {
    var party = this.getActivePartyCharacters(true);

    party.forEach(member => {
      member.battleInfo.autoAttackTimer = 0;//this.getAutoAttackTime(member);
      member.battleInfo.barrierValue = 0;

      if (member.abilityList !== undefined && member.abilityList.length > 0)
        member.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
          ability.currentCooldown = this.getAbilityCooldown(ability, member, true);
        });

      if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
        var god = this.globalVar.gods.find(item => item.type === member.assignedGod1);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown = this.getAbilityCooldown(ability, member, true);
            });
        }
      }

      if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
        var god = this.globalVar.gods.find(item => item.type === member.assignedGod2);
        if (god !== undefined) {
          if (god.abilityList !== undefined && god.abilityList.length > 0)
            god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown = this.getAbilityCooldown(ability, member, true);
            });
        }
      }
    });
  }

  unequipItem(type: EquipmentTypeEnum | undefined, characterType: CharacterEnum) {
    var character = this.globalVar.characters.find(item => item.type === characterType);

    if (character === undefined || type === undefined)
      return;

    if (type === EquipmentTypeEnum.Weapon) {
      if (character.equipmentSet.weapon?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
        var effect = character.equipmentSet.weapon.equipmentEffect.userEffect.length > 0 ?
          character.equipmentSet.weapon.equipmentEffect.userEffect[0] : character.equipmentSet.weapon.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.weapon = undefined;
    }
    if (type === EquipmentTypeEnum.Shield) {
      if (character.equipmentSet.shield?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
        var effect = character.equipmentSet.shield.equipmentEffect.userEffect.length > 0 ?
          character.equipmentSet.shield.equipmentEffect.userEffect[0] : character.equipmentSet.shield.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.shield = undefined;
    }
    if (type === EquipmentTypeEnum.Armor) {
      if (character.equipmentSet.armor?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
        var effect = character.equipmentSet.armor.equipmentEffect.userEffect.length > 0 ?
          character.equipmentSet.armor.equipmentEffect.userEffect[0] : character.equipmentSet.armor.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.armor = undefined;
    }
    if (type === EquipmentTypeEnum.Ring) {
      if (character.equipmentSet.ring?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
        var effect = character.equipmentSet.ring.equipmentEffect.userEffect.length > 0 ?
          character.equipmentSet.ring.equipmentEffect.userEffect[0] : character.equipmentSet.ring.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.ring = undefined;
    }
    if (type === EquipmentTypeEnum.Necklace) {
      if (character.equipmentSet.necklace?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
        var effect = character.equipmentSet.necklace.equipmentEffect.userEffect.length > 0 ?
          character.equipmentSet.necklace.equipmentEffect.userEffect[0] : character.equipmentSet.necklace.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.necklace = undefined;
    }

    this.calculateCharacterBattleStats(character);
  }

  getAchievementsForNextFollower() {
    if (this.globalVar.followerData.numberOfFollowersGainedFromAchievements === 0)
      return 1;
    else
      return 12;
  }

  setAsSubscriber(date: Date) {
    if (!this.globalVar.isSubscriber) {
      this.globalVar.isSubscriber = true;
      this.globalVar.subscribedDate = date;

      var dionysus = this.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
      var nemesis = this.globalVar.gods.find(item => item.type === GodEnum.Nemesis);

      //TODO: once currency is implemented, check if they are already obtained and give currency instead
      if (dionysus !== undefined)
        dionysus.isAvailable = true;
      if (nemesis !== undefined)
        nemesis.isAvailable = true;

      this.globalVar.resources.push(new ResourceValue(ItemsEnum.BlazingSunPendant, 1));
      this.globalVar.resources.push(new ResourceValue(ItemsEnum.DarkMoonPendant, 1));

      var coinBonus = 100000;
      var coins = this.globalVar.resources.find(item => item.item === ItemsEnum.Coin);
      if (coins !== undefined)
        coins.amount += coinBonus;
      else
        this.globalVar.resources.push(new ResourceValue(ItemsEnum.Coin, coinBonus));
    }
  }

  isGodEquipped(type: GodEnum) {
    var isEquipped = false;

    this.getActivePartyCharacters(true).forEach(member => {
      if (member.assignedGod1 === type || member.assignedGod2 === type)
        isEquipped = true;
    });

    return isEquipped;
  }

  addExtraToBaseResource(resourceToChange: ResourceValue, extraToAdd: ItemsEnum) {
    //check if item exists, remove 1 from the existing amount of the resource
    //create a second instance of the resource with the extra included, initialize extras array
    //you will want to differentiate them in name
    var modifiedResource: ResourceValue = new ResourceValue(resourceToChange.item, 1);
    var existingResourcePool = this.globalVar.resources.find(item => item.item === resourceToChange.item && this.extraItemsAreEqual(item.extras, resourceToChange.extras));

    if (existingResourcePool !== undefined && existingResourcePool.amount > 0) {
      existingResourcePool.amount -= 1;
      //console.log("Existing Resource Pool now has " + existingResourcePool.amount);
      this.globalVar.resources = this.globalVar.resources.filter(item => item.amount > 0);

      var extraToAddList: ItemsEnum[] = resourceToChange.makeCopy().extras;
      if (extraToAddList === undefined)
        extraToAddList = [];
      extraToAddList.push(extraToAdd);

      var existingModifiedResourcePool = this.globalVar.resources.find(item => item.item === resourceToChange.item && this.extraItemsAreEqual(item.extras, extraToAddList));

      if (existingModifiedResourcePool) //if a resource already exists that perfectly matches what you are trying to do, just add to that
      {
        //console.log("New Resource Pool already exists with amount " + existingModifiedResourcePool.amount);
        existingModifiedResourcePool.amount += 1;
        modifiedResource = new ResourceValue(existingModifiedResourcePool.item, 1);
        modifiedResource.extras = extraToAddList;
        //console.log("New Resource Pool new amount is " + existingModifiedResourcePool.amount);
      }
      else //else create a brand new resource
      {
        //console.log("Create brand new resource");
        var newResource = new ResourceValue(resourceToChange.item, 1);
        newResource.extras = [];
        newResource.extras = extraToAddList;
        modifiedResource = newResource;
        this.globalVar.resources.push(modifiedResource);
      }

      //deduct the extra from resources
      var extraItemResource = this.globalVar.resources.find(item => item.item === extraToAdd);
      if (extraItemResource !== undefined && extraItemResource.amount > 0) {
        extraItemResource.amount -= 1;
      }
    }

    return modifiedResource;
  }

  removeExtraFromBaseResource(resourceToChange: ResourceValue, extraToRemove: ItemsEnum) {
    //check if item exists, remove 1 from the existing amount of the resource
    //create a second instance of the resource with the extra included, initialize extras array
    //you will want to differentiate them in name
    var modifiedResource: ResourceValue = new ResourceValue(resourceToChange.item, 1);
    var existingResourcePool = this.globalVar.resources.find(item => item.item === resourceToChange.item && this.extraItemsAreEqual(item.extras, resourceToChange.extras));

    if (existingResourcePool !== undefined && existingResourcePool.amount > 0) {
      existingResourcePool.amount -= 1;
      //console.log("Existing Resource Pool now has " + existingResourcePool.amount);
      this.globalVar.resources = this.globalVar.resources.filter(item => item.amount > 0);

      var extraToRemoveList: ItemsEnum[] = resourceToChange.makeCopy().extras;
      if (extraToRemoveList !== undefined) {
        var firstInstance = extraToRemoveList.lastIndexOf(extraToRemove);
        extraToRemoveList.splice(firstInstance, 1);

        var existingModifiedResourcePool = this.globalVar.resources.find(item => item.item === resourceToChange.item && this.extraItemsAreEqual(item.extras, extraToRemoveList));

        if (existingModifiedResourcePool) //if a resource already exists that perfectly matches what you are trying to do, just add to that
        {
          //console.log("New Resource Pool already exists with amount " + existingModifiedResourcePool.amount);
          existingModifiedResourcePool.amount += 1;
          modifiedResource = new ResourceValue(existingModifiedResourcePool.item, 1);
          modifiedResource.extras = extraToRemoveList;
          //console.log("New Resource Pool new amount is " + existingModifiedResourcePool.amount);
        }
        else //else create a brand new resource
        {
          //console.log("Create brand new resource");
          var newResource = new ResourceValue(resourceToChange.item, 1);
          newResource.extras = [];
          newResource.extras = extraToRemoveList;
          modifiedResource = newResource;
          this.globalVar.resources.push(modifiedResource);
        }
      }
    }

    return modifiedResource;
  }

  extraItemsAreEqual(existingExtras?: ItemsEnum[], comparedExtras?: ItemsEnum[]) {
    var areEqual = true;

    if ((existingExtras === undefined || existingExtras.length === 0) && (comparedExtras === undefined || comparedExtras.length === 0)) {
      return areEqual;
    }

    if ((existingExtras === undefined && comparedExtras !== undefined) ||
      (existingExtras !== undefined && comparedExtras === undefined) || existingExtras!.length !== comparedExtras!.length) {
      areEqual = false;
      return areEqual;
    }

    for (var i = 0; i < existingExtras!.length; i++) {
      if (existingExtras!.sort()[i] !== comparedExtras!.sort()[i]) {
        areEqual = false;
      }
    }

    return areEqual;
  }

  //these two functions have to be here to prevent circular dependencies
  ResetTournamentInfoAfterChangingSubzone() {
    if (this.globalVar.activeBattle.activeTournament.type === ColiseumTournamentEnum.WeeklyMelee) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You leave the Coliseum. You finished in round " + this.globalVar.activeBattle.activeTournament.currentRound + (this.globalVar.activeBattle.activeTournament.maxRounds !== -1 ? " of " + this.globalVar.activeBattle.activeTournament.maxRounds : "") + ".");
      this.handleColiseumLoss(this.globalVar.activeBattle.activeTournament.type, this.globalVar.activeBattle.activeTournament.currentRound);
    }

    this.globalVar.activeBattle.activeTournament = new ColiseumTournament();
  }

  handleColiseumLoss(type: ColiseumTournamentEnum, losingRound: number) {
    this.resetCooldowns();

    if (type === ColiseumTournamentEnum.WeeklyMelee) {
      if ((losingRound - 1) > this.globalVar.sidequestData.highestWeeklyMeleeRound)
        this.globalVar.sidequestData.highestWeeklyMeleeRound = (losingRound - 1);

      var bonusXpBase = 3250;
      var growthFactor = 1.33;

      var bonusXp = Math.round((bonusXpBase * (growthFactor ** (losingRound - 1))) + (((losingRound - 1) * 5) * bonusXpBase));

      var bonusCoinBase = 95;
      var growthFactor = 1.14;

      var bonusCoins = Math.round((bonusCoinBase * (growthFactor ** (losingRound - 1))) + (((losingRound - 1) * 5) * bonusCoinBase));

      if (this.globalVar.gameLogSettings.get("battleRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + bonusXp.toLocaleString() + " XP</strong>.");
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + bonusCoins.toLocaleString() + " Coins</strong>.");
      }

      //every 10 rounds, chance of items
      if (losingRound > 10) {
        var rng = this.utilityService.getRandomInteger(30, 70);
        var randomGem = this.getRandomGem();

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(randomGem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(randomGem))) + "</strong>.");
        this.gainResource(new ResourceValue(randomGem, rng));
      }


      this.giveCharactersBonusExp(this.getActivePartyCharacters(true), bonusXp);
      this.gainResource(new ResourceValue(ItemsEnum.Coin, bonusCoins));
    }
  }

  gainResource(item: ResourceValue) {
    if (item === undefined)
      return;

    var existingResource = this.globalVar.resources.find(resource => item.item === resource.item);
    if (existingResource === undefined) {
      this.globalVar.resources.push(item);
    }
    else {
      existingResource.amount += item.amount;
    }
  }

  getRandomGem() {
    var items: ItemsEnum[] = [];
    items.push(ItemsEnum.RoughTopazFragment);
    items.push(ItemsEnum.RoughRubyFragment);
    items.push(ItemsEnum.RoughOpalFragment);
    items.push(ItemsEnum.RoughAmethystFragment);
    items.push(ItemsEnum.RoughEmeraldFragment);
    items.push(ItemsEnum.RoughAquamarineFragment);

    var rng = this.utilityService.getRandomInteger(0, items.length - 1);

    return items[rng];
  }

  getAbilityCooldown(ability: Ability, character: Character, starting: boolean = false) {
    var cooldownReductionWithBuffs = 1;
    if (character.battleInfo.statusEffects.filter(item => item.isPositive).length > 0) {
      cooldownReductionWithBuffs = character.battleStats.abilityCooldownReductionWithBuffs;
    }

    var cooldownReductionStart = 1;
    if (starting) {
      cooldownReductionStart = character.battleStats.abilityCooldownReductionStart;
    }

    return this.utilityService.roundTo(ability.cooldown * (character.battleStats.abilityCooldownReduction * cooldownReductionWithBuffs * cooldownReductionStart), this.utilityService.genericRoundTo);
  }

  getAutoAttackCooldown(character: Character) {
    return this.getAutoAttackTime(character);
  }
}
