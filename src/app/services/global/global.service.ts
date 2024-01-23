import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { God } from 'src/app/models/character/god.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
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
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { CharmService } from '../resources/charm.service';
import { EquipmentService } from '../resources/equipment.service';
import { UtilityService } from '../utility/utility.service';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { DictionaryService } from '../utility/dictionary.service';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { Trial } from 'src/app/models/battle/trial.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { EquipmentSetEnum } from 'src/app/models/enums/equipment-set-enum.model';
import { EquipmentSet } from 'src/app/models/resources/equipment-set.model';
import { EffectResolutionEnum } from 'src/app/models/enums/effect-resolution-enum.model';
import { MatDialog } from '@angular/material/dialog';
import { TutorialBoxComponent } from 'src/app/components/subcomponents/utility/tutorial-box/tutorial-box.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ZodiacService } from './zodiac.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  maxBankedTime = 0;
  bankedTime = 0;
  globalVar = new GlobalVariables();

  constructor(private utilityService: UtilityService, private gameLogService: GameLogService, private charmService: CharmService,
    private equipmentService: EquipmentService, private dictionaryService: DictionaryService, public dialog: MatDialog,
    private deviceDetectorService: DeviceDetectorService, private zodiacService: ZodiacService) { }

  getCurrentVersion() {
    return .8;
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

  getCharacterBaseStats(type: CharacterEnum) {
    if (type === CharacterEnum.Adventurer)
      return new CharacterStats(190, 16, 10, 0, 5, 8);
    else if (type === CharacterEnum.Archer)
      return new CharacterStats(200, 15, 6, 5, 13, 6);
    else if (type === CharacterEnum.Warrior)
      return new CharacterStats(225, 17, 12, 7, 7, 12);
    else if (type === CharacterEnum.Priest)
      return new CharacterStats(175, 17, 9, 6, 7, 15);
    else if (type === CharacterEnum.Monk)
      return new CharacterStats(210, 19, 8, 8, 10, 15);
    else if (type === CharacterEnum.Thaumaturge)
      return new CharacterStats(180, 18, 10, 10, 13, 10);

    return new CharacterStats(0, 0, 0, 0, 0, 0);
  }

  initializeCharacters() {
    var adventurer = new Character(CharacterEnum.Adventurer);
    adventurer.name = "Adventurer";
    adventurer.type = CharacterEnum.Adventurer;
    adventurer.isAvailable = true;
    adventurer.baseStats = this.getCharacterBaseStats(CharacterEnum.Adventurer);
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
    archer.baseStats = this.getCharacterBaseStats(CharacterEnum.Archer);
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
    warrior.baseStats = this.getCharacterBaseStats(CharacterEnum.Warrior);
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
    priest.baseStats = this.getCharacterBaseStats(CharacterEnum.Priest);
    priest.battleStats = priest.baseStats.makeCopy();
    priest.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;
    priest.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
    this.calculateCharacterBattleStats(priest);
    this.assignAbilityInfo(priest);

    this.globalVar.characters.push(priest);

    var monk = new Character(CharacterEnum.Monk);
    monk.name = "Monk";
    monk.type = CharacterEnum.Monk;
    monk.isAvailable = false;
    monk.baseStats = this.getCharacterBaseStats(CharacterEnum.Monk);
    monk.battleStats = monk.baseStats.makeCopy();
    monk.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;
    monk.battleInfo.autoAttackModifier = this.utilityService.strongAutoAttack;
    this.calculateCharacterBattleStats(monk);
    this.assignAbilityInfo(monk);

    this.globalVar.characters.push(monk);

    var thaumaturge = new Character(CharacterEnum.Thaumaturge);
    thaumaturge.name = "Thaumaturge";
    thaumaturge.type = CharacterEnum.Thaumaturge;
    thaumaturge.isAvailable = false;
    thaumaturge.baseStats = this.getCharacterBaseStats(CharacterEnum.Thaumaturge);
    thaumaturge.battleStats = thaumaturge.baseStats.makeCopy();
    thaumaturge.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
    thaumaturge.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
    this.calculateCharacterBattleStats(thaumaturge);
    this.assignAbilityInfo(thaumaturge);

    this.globalVar.characters.push(thaumaturge);
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
      battleCry.targetEffect.push(this.createStatusEffect(StatusEffectEnum.ThornsDamageTakenUp, 12, 1.1, false, false, false, character.name));
      battleCry.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Taunt, 12, 0, false, false, false, character.name));
      character.abilityList.push(battleCry);

      var counterattack = new Ability();
      counterattack.name = "Counterattack";
      counterattack.requiredLevel = this.utilityService.characterPassiveLevel;
      counterattack.isAvailable = false;
      counterattack.isPassive = true;
      counterattack.threshold = .5;
      counterattack.isActivatable = false;
      counterattack.effectiveness = .25;
      character.abilityList.push(counterattack);

      var shieldSlam = new Ability();
      shieldSlam.name = "Shield Slam";
      shieldSlam.requiredLevel = this.utilityService.characterAbility2Level;
      shieldSlam.isAvailable = false;
      shieldSlam.effectiveness = 1.5;
      shieldSlam.secondaryEffectiveness = .5;
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
      heal.cooldown = heal.currentCooldown = 15;
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
      barrier.threshold = 1;
      barrier.cooldown = barrier.currentCooldown = 44;
      barrier.userEffect.push(this.createStatusEffect(StatusEffectEnum.Barrier, -1, .7, true, true, true, "", 1));
      character.abilityList.push(barrier);
    }

    if (character.type === CharacterEnum.Monk) {
      var palmStrike = new Ability();
      palmStrike.name = "Palm Strike";
      palmStrike.isAvailable = false;
      palmStrike.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      palmStrike.effectiveness = .8;
      palmStrike.secondaryEffectiveness = 1.5;
      palmStrike.cooldown = palmStrike.currentCooldown = 9;
      palmStrike.dealsDirectDamage = true;
      palmStrike.targetEffect.push(this.createStatusEffect(StatusEffectEnum.PalmStrike, -1, 1, false, false, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, 3));
      character.abilityList.push(palmStrike);

      /*var insight = new Ability();
      insight.name = "Insight";
      insight.effectiveness = .2;
      insight.requiredLevel = this.utilityService.characterPassiveLevel;
      insight.maxCount = 4;
      insight.isAvailable = false;
      insight.isPassive = true;
      insight.isActivatable = false;
      insight.userEffect.push(this.createStatusEffect(StatusEffectEnum.Insight, 4, 1.05, false, true));
      character.abilityList.push(insight);*/
      
      var insight = new Ability();
      insight.name = "Insight";
      insight.effectiveness = .1;
      insight.secondaryEffectiveness = 1.5;
      insight.requiredLevel = this.utilityService.characterPassiveLevel;      
      insight.isAvailable = false;
      insight.isPassive = true;
      insight.isActivatable = false;      
      character.abilityList.push(insight);

      var spiritUnleashed = new Ability();
      spiritUnleashed.name = "Spirit Unleashed";
      spiritUnleashed.requiredLevel = this.utilityService.characterAbility2Level;
      spiritUnleashed.isAvailable = false;
      spiritUnleashed.effectiveness = 2.1;      
      spiritUnleashed.dealsDirectDamage = true;
      spiritUnleashed.cooldown = spiritUnleashed.currentCooldown = 36;
      spiritUnleashed.targetEffect.push(this.createStatusEffect(StatusEffectEnum.DamageTakenUp, 7, 1.25, false, false));
      spiritUnleashed.targetEffect.push(this.createStatusEffect(StatusEffectEnum.DamageDealtDown, 7, .75, false, false));
      spiritUnleashed.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Stagger, 7, .25, false, false));
      character.abilityList.push(spiritUnleashed);
    }

    if (character.type === CharacterEnum.Thaumaturge) {
      var elementalStrike = new Ability();
      elementalStrike.name = "Elemental Strike";
      elementalStrike.isAvailable = false;
      elementalStrike.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      elementalStrike.effectiveness = 1.9;
      elementalStrike.cooldown = elementalStrike.currentCooldown = 24;
      elementalStrike.dealsDirectDamage = true;
      character.abilityList.push(elementalStrike);

      var elementalSpirit = new Ability();
      elementalSpirit.name = "Awakened Spirit";
      elementalSpirit.requiredLevel = this.utilityService.characterPassiveLevel;
      elementalSpirit.maxCount = 4;
      elementalSpirit.isAvailable = false;
      elementalSpirit.isPassive = true;
      elementalSpirit.isActivatable = false;
      elementalSpirit.effectiveness = 1.075;
      elementalSpirit.secondaryEffectiveness = .75;
      character.abilityList.push(elementalSpirit);

      var outburst = new Ability();
      outburst.name = "Outburst";
      outburst.requiredLevel = this.utilityService.characterAbility2Level;
      outburst.isAvailable = false;
      outburst.effectiveness = 2.1;
      outburst.secondaryEffectiveness = 1.2;
      outburst.dealsDirectDamage = true;
      outburst.cooldown = outburst.currentCooldown = 45;
      character.abilityList.push(outburst);
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

    var aphrodite = new God(GodEnum.Aphrodite);
    aphrodite.name = "Aphrodite";
    aphrodite.displayOrder = 11;
    this.assignGodAbilityInfo(aphrodite);
    this.globalVar.gods.push(aphrodite);

    var hera = new God(GodEnum.Hera);
    hera.name = "Hera";
    hera.displayOrder = 12;
    this.assignGodAbilityInfo(hera);
    this.globalVar.gods.push(hera);
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
      aegis.userEffect.push(this.createStatusEffect(StatusEffectEnum.HealingReceivedUp, 8, 1.25, false, true));
      god.abilityList.push(aegis);

      var blindingLight = new Ability();
      blindingLight.name = "Blinding Light";
      blindingLight.requiredLevel = this.utilityService.godAbility3Level;
      blindingLight.isAvailable = false;
      blindingLight.cooldown = blindingLight.currentCooldown = 46;
      blindingLight.isAoe = true;
      blindingLight.dealsDirectDamage = true;
      blindingLight.effectiveness = 1;
      blindingLight.elementalType = ElementalTypeEnum.Holy;
      blindingLight.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Blind, 5, .25, false, false, true));
      god.abilityList.push(blindingLight);

      var secondWind = new Ability();
      secondWind.name = "Second Wind";
      secondWind.requiredLevel = this.utilityService.godPassiveLevel;
      secondWind.isAvailable = false;
      secondWind.isPassive = true;
      secondWind.isActivatable = false;
      secondWind.userEffect.push(this.createStatusEffect(StatusEffectEnum.InstantHealAfterAutoAttack, -1, 3, false, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Second Wind", 1));
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
      trueShot.secondaryEffectiveness = 1;
      god.abilityList.push(trueShot);
    }

    if (god.type === GodEnum.Apollo) {
      var staccato = new Ability();
      staccato.name = "Staccato";
      staccato.isAvailable = false;
      staccato.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      staccato.cooldown = staccato.currentCooldown = 38;
      staccato.dealsDirectDamage = false;
      staccato.userEffect.push(this.createStatusEffect(StatusEffectEnum.Staccato, 10, 1.2, false, true));
      god.abilityList.push(staccato);

      var fortissimo = new Ability();
      fortissimo.name = "Fortissimo";
      fortissimo.isAvailable = false;
      fortissimo.requiredLevel = this.utilityService.godAbility2Level;
      fortissimo.cooldown = fortissimo.currentCooldown = 50;
      fortissimo.dealsDirectDamage = false;
      fortissimo.secondaryEffectiveness = 1.01;
      fortissimo.userEffect.push(this.createStatusEffect(StatusEffectEnum.Fortissimo, 5, 1.1, false, true));
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
      embellish.cooldown = embellish.currentCooldown = 45;
      embellish.userEffect.push(this.createStatusEffect(StatusEffectEnum.AttackUp, 5, 1.3, false, true));
      embellish.userEffect.push(this.createStatusEffect(StatusEffectEnum.AgilityUp, 5, 1.3, false, true));
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
      hellfire.cooldown = hellfire.currentCooldown = 32;
      hellfire.dealsDirectDamage = true;
      hellfire.effectiveness = 1.3;
      hellfire.isAoe = true;
      hellfire.elementalType = ElementalTypeEnum.Fire;
      god.abilityList.push(hellfire);

      var earthquake = new Ability();
      earthquake.name = "Earthquake";
      earthquake.requiredLevel = this.utilityService.godAbility2Level;
      earthquake.isAvailable = false;
      earthquake.cooldown = earthquake.currentCooldown = 46;
      earthquake.dealsDirectDamage = true;
      earthquake.effectiveness = 1.7;
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
      lordOfTheUnderworld.maxCount = 3;
      lordOfTheUnderworld.userEffect.push(this.createStatusEffect(StatusEffectEnum.LordOfTheUnderworld, 15, 1.08, false, true, false, undefined, undefined, true, undefined, undefined, undefined, undefined, 3));
      god.abilityList.push(lordOfTheUnderworld);
    }

    if (god.type === GodEnum.Ares) {
      var rupture = new Ability();
      rupture.name = "Rupture";
      rupture.isAvailable = false;
      rupture.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      rupture.cooldown = rupture.currentCooldown = 23;
      rupture.dealsDirectDamage = false;
      rupture.targetEffect.push(this.createDamageOverTimeEffect(5, 2.5, .35, rupture.name, dotTypeEnum.BasedOnAttack));
      god.abilityList.push(rupture);

      var onslaught = new Ability();
      onslaught.name = "Onslaught";
      onslaught.requiredLevel = this.utilityService.godAbility2Level;
      onslaught.isAvailable = false;
      onslaught.dealsDirectDamage = false;
      onslaught.cooldown = onslaught.currentCooldown = 43;
      onslaught.userEffect.push(this.createStatusEffect(StatusEffectEnum.Onslaught, -1, 1, false, true));
      onslaught.targetEffect.push(this.createDamageOverTimeEffect(8, 4, .2, onslaught.name, dotTypeEnum.None));
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
      bloodlust.effectiveness = .0135;
      god.abilityList.push(bloodlust);
    }

    if (god.type === GodEnum.Dionysus) {
      var revelry = new Ability();
      revelry.name = "Revelry";
      revelry.isAvailable = true;
      revelry.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      revelry.targetType = TargetEnum.LowestHpPercent;
      revelry.dealsDirectDamage = false;
      revelry.targetsAllies = true;
      revelry.secondaryEffectiveness = 1.025;
      revelry.cooldown = revelry.currentCooldown = 37;
      revelry.userEffect.push(this.createStatusEffect(StatusEffectEnum.Barrier, -1, .65, true, true, false, "", .25));
      god.abilityList.push(revelry);

      var thyrsus = new Ability();
      thyrsus.name = "Thyrsus";
      thyrsus.requiredLevel = this.utilityService.godAbility2Level;
      thyrsus.isAvailable = false;
      thyrsus.cooldown = thyrsus.currentCooldown = 55;
      thyrsus.effectiveness = 2.1;
      thyrsus.dealsDirectDamage = true;
      thyrsus.secondaryEffectiveness = 1.1;
      thyrsus.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Thyrsus, 7, 1.03, false, false));
      god.abilityList.push(thyrsus);

      var insanity = new Ability();
      insanity.name = "Insanity";
      insanity.requiredLevel = this.utilityService.godAbility3Level;
      insanity.isAvailable = false;
      insanity.cooldown = insanity.currentCooldown = 42;
      insanity.dealsDirectDamage = false;
      insanity.targetEffect.push(this.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 8, .92, true, false));
      insanity.targetEffect.push(this.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 8, .92, true, false));
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
      chainsOfFate.effectiveness = 1.05;
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
      dispenserOfDues.effectiveness = .2;
      dispenserOfDues.secondaryEffectiveness = .2;
      dispenserOfDues.userEffect.push(this.createStatusEffect(StatusEffectEnum.DispenserOfDues, -1, 0, false, true));
      dispenserOfDues.userEffect[0].resolution = EffectResolutionEnum.AlwaysActive;
      god.abilityList.push(dispenserOfDues);
    }

    if (god.type === GodEnum.Zeus) {
      var lightningBolt = new Ability();
      lightningBolt.name = "Lightning Bolt";
      lightningBolt.isAvailable = false;
      lightningBolt.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      lightningBolt.cooldown = lightningBolt.currentCooldown = 35;
      lightningBolt.dealsDirectDamage = true;
      lightningBolt.effectiveness = 1.75;
      lightningBolt.secondaryEffectiveness = 4;
      lightningBolt.elementalType = ElementalTypeEnum.Lightning;
      lightningBolt.targetEffect.push(this.createStatusEffect(StatusEffectEnum.ChanceToStun, 0, .25, true, false));
      god.abilityList.push(lightningBolt);

      var electrify = new Ability();
      electrify.name = "Electrify";
      electrify.requiredLevel = this.utilityService.godAbility2Level;
      electrify.isAvailable = false;
      electrify.effectiveness = 3.75;
      electrify.dealsDirectDamage = true;
      electrify.cooldown = electrify.currentCooldown = 51;
      electrify.elementalType = ElementalTypeEnum.Lightning;
      electrify.targetEffect.push(this.createStatusEffect(StatusEffectEnum.LightningDamageTakenUp, 16, 1.1, false, false));
      god.abilityList.push(electrify);

      var chainLightning = new Ability();
      chainLightning.name = "Chain Lightning";
      chainLightning.requiredLevel = this.utilityService.godAbility3Level;
      chainLightning.isAvailable = false;
      chainLightning.cooldown = chainLightning.currentCooldown = 68;
      chainLightning.dealsDirectDamage = true;
      chainLightning.effectiveness = 2.75;
      chainLightning.elementalType = ElementalTypeEnum.Lightning;
      chainLightning.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatDamageAfterDelay, 10, 1, false, true));
      god.abilityList.push(chainLightning);

      var overload = new Ability();
      overload.name = "Overload";
      overload.requiredLevel = this.utilityService.godPassiveLevel;
      overload.isAvailable = false;
      overload.isPassive = true;
      overload.isActivatable = false;
      overload.dealsDirectDamage = false;
      overload.userEffect.push(this.createStatusEffect(StatusEffectEnum.Surge, -1, 1.1, false, true));
      god.abilityList.push(overload);
    }

    if (god.type === GodEnum.Poseidon) {
      var crashingWaves = new Ability();
      crashingWaves.name = "Crashing Waves";
      crashingWaves.isAvailable = false;
      crashingWaves.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      crashingWaves.cooldown = crashingWaves.currentCooldown = 28;
      crashingWaves.dealsDirectDamage = true;
      crashingWaves.effectiveness = 1.9;
      crashingWaves.secondaryEffectiveness = 4;
      crashingWaves.elementalType = ElementalTypeEnum.Water;
      crashingWaves.targetEffect.push(this.createStatusEffect(StatusEffectEnum.Unsteady, 6, .25, false, false));
      god.abilityList.push(crashingWaves);

      var whirlpool = new Ability();
      whirlpool.name = "Whirlpool";
      whirlpool.requiredLevel = this.utilityService.godAbility2Level;
      whirlpool.isAvailable = false;
      whirlpool.effectiveness = 1.6;
      whirlpool.dealsDirectDamage = true;
      whirlpool.secondaryEffectiveness = 1.3;
      whirlpool.cooldown = whirlpool.currentCooldown = 38;
      whirlpool.elementalType = ElementalTypeEnum.Water;
      whirlpool.isAoe = true;
      god.abilityList.push(whirlpool);

      var tsunami = new Ability();
      tsunami.name = "Tsunami";
      tsunami.requiredLevel = this.utilityService.godAbility3Level;
      tsunami.isAvailable = false;
      tsunami.cooldown = tsunami.currentCooldown = 55;
      tsunami.dealsDirectDamage = true;
      tsunami.effectiveness = 1.5;
      tsunami.secondaryEffectiveness = 1;
      tsunami.elementalType = ElementalTypeEnum.Water;
      tsunami.userEffect.push(this.createStatusEffect(StatusEffectEnum.KingOfTheSea, 5, 1.08, false, true));
      tsunami.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      god.abilityList.push(tsunami);

      var flow = new Ability();
      flow.name = "Flow";
      flow.requiredLevel = this.utilityService.godPassiveLevel;
      flow.isAvailable = false;
      flow.isPassive = true;
      flow.isActivatable = false;
      flow.dealsDirectDamage = false;
      flow.userEffect.push(this.createStatusEffect(StatusEffectEnum.Flow, -1, 1.01, false, true));
      god.abilityList.push(flow);
    }

    if (god.type === GodEnum.Aphrodite) {
      var fatalAttraction = new Ability();
      fatalAttraction.name = "Fatal Attraction";
      fatalAttraction.isAvailable = false;
      fatalAttraction.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      fatalAttraction.cooldown = fatalAttraction.currentCooldown = 27;
      fatalAttraction.dealsDirectDamage = false;
      fatalAttraction.userEffect.push(this.createStatusEffect(StatusEffectEnum.FatalAttraction, -1, 1.1, false, true));
      god.abilityList.push(fatalAttraction);

      var powerOfLove = new Ability();
      powerOfLove.name = "Power of Love";
      powerOfLove.requiredLevel = this.utilityService.godAbility2Level;
      powerOfLove.isAvailable = false;
      powerOfLove.dealsDirectDamage = false;
      powerOfLove.cooldown = powerOfLove.currentCooldown = 38;
      powerOfLove.userEffect.push(this.createStatusEffect(StatusEffectEnum.PowerOfLove, 10, 1.15, true, true));
      god.abilityList.push(powerOfLove);

      var kissOfDeath = new Ability();
      kissOfDeath.name = "Kiss of Death";
      kissOfDeath.requiredLevel = this.utilityService.godAbility3Level;
      kissOfDeath.isAvailable = false;
      kissOfDeath.cooldown = kissOfDeath.currentCooldown = 43;
      kissOfDeath.dealsDirectDamage = true;
      kissOfDeath.effectiveness = 1.5;
      god.abilityList.push(kissOfDeath);

      var passionateRhythm = new Ability();
      passionateRhythm.name = "Passionate Rhythm";
      passionateRhythm.requiredLevel = this.utilityService.godPassiveLevel;
      passionateRhythm.isAvailable = false;
      passionateRhythm.isPassive = true;
      passionateRhythm.isActivatable = false;
      passionateRhythm.dealsDirectDamage = false;
      passionateRhythm.userEffect.push(this.createStatusEffect(StatusEffectEnum.PassionateRhythm, -1, 1.05, false, true));
      god.abilityList.push(passionateRhythm);
    }

    if (god.type === GodEnum.Hera) {
      var strut = new Ability();
      strut.name = "Strut";
      strut.isAvailable = false;
      strut.requiredLevel = this.utilityService.defaultGodAbilityLevel;
      strut.cooldown = strut.currentCooldown = 35;
      strut.dealsDirectDamage = true;
      strut.effectiveness = 1.9;
      strut.elementalType = ElementalTypeEnum.Air;
      strut.userEffect.push(this.createStatusEffect(StatusEffectEnum.AttackUp, 14, 1.3, false, true));
      god.abilityList.push(strut);

      var espionage = new Ability();
      espionage.name = "Espionage";
      espionage.requiredLevel = this.utilityService.godAbility2Level;
      espionage.isAvailable = false;
      espionage.dealsDirectDamage = false;
      espionage.cooldown = espionage.currentCooldown = 47;
      espionage.targetEffect.push(this.createStatusEffect(StatusEffectEnum.DamageDealtDown, 14, .88, false, false));
      god.abilityList.push(espionage);

      var puncture = new Ability();
      puncture.name = "Puncture";
      puncture.requiredLevel = this.utilityService.godAbility3Level;
      puncture.isAvailable = false;
      puncture.cooldown = puncture.currentCooldown = 55;
      puncture.dealsDirectDamage = true;
      puncture.effectiveness = 1.65;
      puncture.secondaryEffectiveness = .25;
      puncture.elementalType = ElementalTypeEnum.Air;
      puncture.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      god.abilityList.push(puncture);

      var shapeshift = new Ability();
      shapeshift.name = "Shapeshift";
      shapeshift.requiredLevel = this.utilityService.godPassiveLevel;
      shapeshift.isAvailable = false;
      shapeshift.isPassive = true;
      shapeshift.isActivatable = true;
      shapeshift.dealsDirectDamage = false;
      shapeshift.effectiveness = 0;
      shapeshift.cooldown = shapeshift.currentCooldown = 15;
      shapeshift.userEffect.push(this.createStatusEffect(StatusEffectEnum.Shapeshift, -1, 1.03, false, true, false, undefined, undefined, true));
      shapeshift.userEffect[0].resolution = EffectResolutionEnum.AlwaysActive;
      god.abilityList.push(shapeshift);
    }
  }

  initializeItemBelt() {
    for (var i = 0; i < this.utilityService.maxItemBeltSize; i++) {
      this.globalVar.itemBelt.push(ItemsEnum.None);
    }
  }

  createStatusEffect(type: StatusEffectEnum, duration: number, multiplier: number, isInstant: boolean, isPositive: boolean,
    isAoe: boolean = false, caster: string = "", threshold: number = 1, effectStacks: boolean = false,
    element: ElementalTypeEnum = ElementalTypeEnum.None, triggersEvery: number = 0, targetsAllies: boolean = false, abilityName: string = "", maxCount: number = 0, addedEffect: boolean = false) {
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
    statusEffect.addedEffect = addedEffect;

    if (duration === -1)
      statusEffect.isPermanent = true;

    return statusEffect;
  }

  createDamageOverTimeEffect(duration: number, tickFrequency: number, multiplier: number, abilityName: string, dotType: dotTypeEnum = dotTypeEnum.BasedOnAttack, associatedElement: ElementalTypeEnum = ElementalTypeEnum.None, isAoe: boolean = false, caster: string = "", casterEnum: CharacterEnum = CharacterEnum.None) {
    var statusEffect = new StatusEffect(StatusEffectEnum.DamageOverTime);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.tickFrequency = tickFrequency;
    statusEffect.abilityName = abilityName;
    statusEffect.dotType = dotType;
    statusEffect.element = associatedElement;
    statusEffect.isAoe = isAoe;
    statusEffect.caster = caster;
    statusEffect.casterEnum = casterEnum;

    return statusEffect;
  }

  createHealOverTimeEffect(duration: number, tickFrequency: number, multiplier: number, abilityName: string, maxCount: number = 0, isAoe: boolean = false) {
    var statusEffect = new StatusEffect(StatusEffectEnum.HealOverTime);
    statusEffect.duration = duration;
    statusEffect.effectiveness = multiplier;
    statusEffect.tickFrequency = tickFrequency;
    statusEffect.abilityName = abilityName;
    statusEffect.maxCount = maxCount;
    statusEffect.isPositive = true;
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
      type === StatusEffectEnum.DamageDealtDown || type === StatusEffectEnum.DamageTakenDown || type === StatusEffectEnum.DamageTakenUp
      || type === StatusEffectEnum.ThousandCuts || type === StatusEffectEnum.Paralyze || type === StatusEffectEnum.ArmorPenetrationDown ||
      type === StatusEffectEnum.ReduceHealing || type === StatusEffectEnum.Stagger || type === StatusEffectEnum.ArmorPenetrationUp ||
      type === StatusEffectEnum.Unsteady || type === StatusEffectEnum.AllElementalResistanceDown || type === StatusEffectEnum.DivineProtection ||
      type === StatusEffectEnum.LordOfTheUnderworld || type === StatusEffectEnum.Onslaught || type === StatusEffectEnum.EarthDamageUp || type === StatusEffectEnum.FireDamageUp
      || type === StatusEffectEnum.AirDamageUp || type === StatusEffectEnum.HolyDamageUp || type === StatusEffectEnum.LightningDamageUp || type === StatusEffectEnum.WaterDamageUp || type === StatusEffectEnum.EarthDamageDown || type === StatusEffectEnum.FireDamageDown
      || type === StatusEffectEnum.AirDamageDown || type === StatusEffectEnum.HolyDamageDown || type === StatusEffectEnum.LightningDamageDown || type === StatusEffectEnum.WaterDamageDown || type === StatusEffectEnum.EarthDamageTakenUp || type === StatusEffectEnum.FireDamageTakenUp
      || type === StatusEffectEnum.AirDamageTakenUp || type === StatusEffectEnum.HolyDamageTakenUp || type === StatusEffectEnum.LightningDamageTakenUp || type === StatusEffectEnum.WaterDamageTakenUp || type === StatusEffectEnum.EarthDamageTakenDown || type === StatusEffectEnum.FireDamageTakenDown
      || type === StatusEffectEnum.AirDamageTakenDown || type === StatusEffectEnum.HolyDamageTakenDown || type === StatusEffectEnum.LightningDamageTakenDown || type === StatusEffectEnum.WaterDamageTakenDown ||
      type === StatusEffectEnum.AoeDamageUp || type === StatusEffectEnum.ChainsOfFate || type === StatusEffectEnum.Retribution || type === StatusEffectEnum.DamageOverTimeDamageUp ||
      type === StatusEffectEnum.AutoAttackSpeedUp || type === StatusEffectEnum.AbilitySpeedUp || type === StatusEffectEnum.PreventEscape || type === StatusEffectEnum.Thyrsus
      || type === StatusEffectEnum.AllPrimaryStatsExcludeHpUp || type === StatusEffectEnum.AllPrimaryStatsUp || type === StatusEffectEnum.Surge ||
      type === StatusEffectEnum.HpRegenUp || type === StatusEffectEnum.ThornsDamageTakenUp || type === StatusEffectEnum.GaiasBlessing || type === StatusEffectEnum.StockpileRock ||
      type === StatusEffectEnum.HealingDoneUp || type === StatusEffectEnum.ThornsDamageUp || type === StatusEffectEnum.AllElementalResistanceUp ||
      type === StatusEffectEnum.AbsorbElementalDamage || type === StatusEffectEnum.Insight || type === StatusEffectEnum.Flow ||
      type === StatusEffectEnum.Current || type === StatusEffectEnum.Cancer || type === StatusEffectEnum.HealingReceivedUp || type === StatusEffectEnum.FatalAttraction ||
      type === StatusEffectEnum.Strut || type === StatusEffectEnum.Espionage || type === StatusEffectEnum.PassionateRhythmAutoAttack || type === StatusEffectEnum.PassionateRhythm ||
      type === StatusEffectEnum.Shapeshift || type === StatusEffectEnum.Slow || type === StatusEffectEnum.BoundingBand || type === StatusEffectEnum.BoundingBandUnique ||
      type === StatusEffectEnum.ScathingBeauty || type === StatusEffectEnum.ScathingBeautyUnique || type === StatusEffectEnum.Leo || type === StatusEffectEnum.PalmStrike ||
      type === StatusEffectEnum.DivineRetribution || type === StatusEffectEnum.ReduceNextAbilityCooldown || type === StatusEffectEnum.ThunderousMelody || type === StatusEffectEnum.PassingJudgment ||
      type === StatusEffectEnum.WindAttacks || type === StatusEffectEnum.BetterTogether || type === StatusEffectEnum.PureSpeed || type === StatusEffectEnum.LightningAttacks ||
      type === StatusEffectEnum.ShieldingAttacks || type === StatusEffectEnum.BleedingAttacks || type === StatusEffectEnum.CleansingShots || type === StatusEffectEnum.LuckyShots ||
      type === StatusEffectEnum.DiscordantMelody || type === StatusEffectEnum.Flood || type === StatusEffectEnum.WildJudgment || type === StatusEffectEnum.StaggeringRiposte || type === StatusEffectEnum.ThunderousRiposte ||
      type === StatusEffectEnum.CaringGaze || type === StatusEffectEnum.MelodicMoves || type === StatusEffectEnum.BlisteringRiposte || type === StatusEffectEnum.RecedingTide ||
      type === StatusEffectEnum.WarAndLove || type === StatusEffectEnum.AllPrimaryStatsDown || type === StatusEffectEnum.AllPrimaryStatsExcludeHpDown || type === StatusEffectEnum.FieryJudgment ||
      type === StatusEffectEnum.Protector || type === StatusEffectEnum.LovingEmbrace || type === StatusEffectEnum.DefensiveShapeshifting || type === StatusEffectEnum.DamageShield ||
      type === StatusEffectEnum.FriendlyCompetition || type === StatusEffectEnum.Focus || type === StatusEffectEnum.BuzzingReminder
      || type === StatusEffectEnum.VortexPull)
      refreshes = true;

    return refreshes;
  }

  doesStatusEffectDurationStack(type: StatusEffectEnum) {
    var refreshes = false;

    if (type === StatusEffectEnum.PoisonousToxin || type === StatusEffectEnum.HeroicElixir || type === StatusEffectEnum.DebilitatingToxin ||
      type === StatusEffectEnum.RejuvenatingElixir || type === StatusEffectEnum.VenomousToxin || type === StatusEffectEnum.WitheringToxin ||
      type === StatusEffectEnum.ElixirOfFortitude || type === StatusEffectEnum.ElixirOfSpeed || type === StatusEffectEnum.FlamingToxin ||
      type === StatusEffectEnum.ParalyzingToxin || type === StatusEffectEnum.KingOfTheSea || type === StatusEffectEnum.ElixirOfFortune ||
      type === StatusEffectEnum.SandToxin || type === StatusEffectEnum.ElectrifiedToxin || type === StatusEffectEnum.MagicToxin ||
      type === StatusEffectEnum.TidalToxin || type === StatusEffectEnum.UnsteadyingToxin || type === StatusEffectEnum.ElixirOfWill)
      refreshes = true;

    return refreshes;
  }

  doesStatusEffectPersistDeath(type: StatusEffectEnum) {
    var persistsDeath = false;

    if (type === StatusEffectEnum.RecentlyDefeated || type === StatusEffectEnum.PoisonousToxin || type === StatusEffectEnum.DebilitatingToxin ||
      type === StatusEffectEnum.WitheringToxin || type === StatusEffectEnum.VenomousToxin || type === StatusEffectEnum.FlamingToxin || type === StatusEffectEnum.ParalyzingToxin ||
      type === StatusEffectEnum.Dead || type === StatusEffectEnum.ElixirOfFortitude || type === StatusEffectEnum.ElixirOfSpeed ||
      type === StatusEffectEnum.HeroicElixir || type === StatusEffectEnum.RejuvenatingElixir || type === StatusEffectEnum.ElixirOfFortune ||
      type === StatusEffectEnum.SandToxin || type === StatusEffectEnum.ElectrifiedToxin || type === StatusEffectEnum.MagicToxin ||
      type === StatusEffectEnum.TidalToxin || type === StatusEffectEnum.UnsteadyingToxin || type === StatusEffectEnum.ElixirOfWill)
      persistsDeath = true;

    return persistsDeath;
  }

  isBuffUnremovable(effect: StatusEffect) {
    var persistsDeath = false;
    var type = effect.type;

    if (type === StatusEffectEnum.RecentlyDefeated || type === StatusEffectEnum.PoisonousToxin || type === StatusEffectEnum.DebilitatingToxin ||
      type === StatusEffectEnum.WitheringToxin || type === StatusEffectEnum.VenomousToxin || type === StatusEffectEnum.FlamingToxin || type === StatusEffectEnum.ParalyzingToxin ||
      type === StatusEffectEnum.Dead || type === StatusEffectEnum.ElixirOfFortitude || type === StatusEffectEnum.ElixirOfSpeed ||
      type === StatusEffectEnum.HeroicElixir || type === StatusEffectEnum.RejuvenatingElixir || type === StatusEffectEnum.ElixirOfFortune ||
      type === StatusEffectEnum.SandToxin || type === StatusEffectEnum.ElectrifiedToxin || type === StatusEffectEnum.MagicToxin ||
      type === StatusEffectEnum.DispenserOfDues || type === StatusEffectEnum.Shapeshift ||
      type === StatusEffectEnum.TidalToxin || type === StatusEffectEnum.UnsteadyingToxin || type === StatusEffectEnum.ElixirOfWill)
      persistsDeath = true;

    if (effect.resolution === EffectResolutionEnum.AlwaysActiveEquipment)
      persistsDeath = true;

    return persistsDeath;
  }

  getActivePartyCharacters(excludeEmptySlots: boolean) {
    var characters: Character[] = [];

    if (this.globalVar.activePartyMember1 === CharacterEnum.None || this.globalVar.partyMember1Hidden) {
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

    if (this.globalVar.activePartyMember2 === CharacterEnum.None || this.globalVar.partyMember2Hidden) {
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
    character.battleStats.allyDamageBonus = this.equipmentService.getTotalAllyDamageBonusGain(character.equipmentSet);
    character.battleStats.aoeDamage = this.equipmentService.getTotalAoeDamageGain(character.equipmentSet);
    character.battleStats.thorns = this.equipmentService.getTotalThornsGain(character.equipmentSet);
    character.battleStats.tickFrequency = this.equipmentService.getTotalTickFrequencyGain(character.equipmentSet);
    character.battleStats.abilityCooldownReductionStart = (1 - this.equipmentService.getTotalAbilityCooldownReductionStartGain(character.equipmentSet));
    character.battleStats.abilityCooldownReductionWithBuffs = (1 - this.equipmentService.getTotalAbilityCooldownReductionWithBuffsGain(character.equipmentSet));
    character.battleStats.overdriveGainFromAutoAttacks = this.equipmentService.getTotalOverdriveGainFromAutoAttacksGain(character.equipmentSet);
    character.battleStats.debuffDuration = this.equipmentService.getTotalDebuffDurationGain(character.equipmentSet);
    character.battleStats.buffDuration = this.equipmentService.getTotalBuffDurationGain(character.equipmentSet);
    character.battleStats.overdriveGain = this.equipmentService.getTotalOverdriveGain(character.equipmentSet);
    character.battleStats.linkEffectiveness = this.equipmentService.getTotalLinkEffectivenessGain(character.equipmentSet);
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

    this.checkForSetBonuses(character.equipmentSet, character.battleStats);

    //gods
    var equippedGodMaxHpStatMultiplier = 1;
    var equippedGodAttackStatMultiplier = 1;
    var equippedGodAgilityStatMultiplier = 1;
    var equippedGodLuckStatMultiplier = 1;
    var equippedGodResistanceStatMultiplier = 1;
    var equippedGodDefenseStatMultiplier = 1;
    var god1ZodiacBoost = 1;
    var god2ZodiacBoost = 1;
    var zodiacGods = this.zodiacService.getBonusGods();

    var god1 = this.globalVar.gods.find(item => character.assignedGod1 === item.type);
    if (god1 !== undefined) {
      if (zodiacGods.some(item => item === god1?.type))
        god1ZodiacBoost += this.utilityService.zodiacGodStatBoost;

      character.battleStats.maxHp += (god1.statGain.maxHp + god1.permanentStatGain.maxHp) * god1ZodiacBoost;
      character.battleStats.attack += (god1.statGain.attack + god1.permanentStatGain.attack) * god1ZodiacBoost;
      character.battleStats.defense += (god1.statGain.defense + god1.permanentStatGain.defense) * god1ZodiacBoost;
      character.battleStats.agility += (god1.statGain.agility + god1.permanentStatGain.agility) * god1ZodiacBoost;
      character.battleStats.luck += (god1.statGain.luck + god1.permanentStatGain.luck) * god1ZodiacBoost;
      character.battleStats.resistance += (god1.statGain.resistance + god1.permanentStatGain.resistance) * god1ZodiacBoost;

      character.battleStats.hpRegen += god1.statGain.hpRegen + god1.permanentStatGain.hpRegen;
      character.battleStats.abilityCooldownReduction *= (1 - (god1.statGain.abilityCooldownReduction + god1.permanentStatGain.abilityCooldownReduction));
      character.battleStats.autoAttackCooldownReduction *= (1 - (god1.statGain.autoAttackCooldownReduction + god1.permanentStatGain.autoAttackCooldownReduction));
      character.battleStats.criticalMultiplier += god1.statGain.criticalMultiplier + god1.permanentStatGain.criticalMultiplier;
      character.battleStats.overdriveGain += god1.statGain.overdriveGain + god1.permanentStatGain.overdriveGain;
      character.battleStats.linkEffectiveness += god1.statGain.linkEffectiveness + god1.permanentStatGain.linkEffectiveness;
      character.battleStats.armorPenetration += god1.statGain.armorPenetration + god1.permanentStatGain.armorPenetration;
      character.battleStats.healingReceived += god1.statGain.healingReceived + god1.permanentStatGain.healingReceived;
      character.battleStats.debuffDuration += god1.statGain.debuffDuration + god1.permanentStatGain.debuffDuration;
      character.battleStats.buffDuration += god1.statGain.buffDuration + god1.permanentStatGain.buffDuration;
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

      /*equippedGodMaxHpStatMultiplier = god1.permanentStatMultiplier.maxHp;
      equippedGodAttackStatMultiplier = god1.permanentStatMultiplier.attack;
      equippedGodLuckStatMultiplier = god1.permanentStatMultiplier.luck;
      equippedGodAgilityStatMultiplier = god1.permanentStatMultiplier.agility;
      equippedGodDefenseStatMultiplier = god1.permanentStatMultiplier.defense;
      equippedGodResistanceStatMultiplier = god1.permanentStatMultiplier.resistance;*/
    }

    var god2 = this.globalVar.gods.find(item => character.assignedGod2 === item.type);
    if (god2 !== undefined) {
      if (zodiacGods.some(item => item === god2?.type))
        god2ZodiacBoost += this.utilityService.zodiacGodStatBoost;

      character.battleStats.maxHp += (god2.statGain.maxHp + god2.permanentStatGain.maxHp) * god2ZodiacBoost;
      character.battleStats.attack += (god2.statGain.attack + god2.permanentStatGain.attack) * god2ZodiacBoost;
      character.battleStats.defense += (god2.statGain.defense + god2.permanentStatGain.defense) * god2ZodiacBoost;
      character.battleStats.agility += (god2.statGain.agility + god2.permanentStatGain.agility) * god2ZodiacBoost;
      character.battleStats.luck += (god2.statGain.luck + god2.permanentStatGain.luck) * god2ZodiacBoost;
      character.battleStats.resistance += (god2.statGain.resistance + god2.permanentStatGain.resistance) * god2ZodiacBoost;

      character.battleStats.hpRegen += god2.statGain.hpRegen + god2.permanentStatGain.hpRegen;
      character.battleStats.abilityCooldownReduction *= (1 - (god2.statGain.abilityCooldownReduction + god2.permanentStatGain.abilityCooldownReduction));
      character.battleStats.autoAttackCooldownReduction *= (1 - (god2.statGain.autoAttackCooldownReduction + god2.permanentStatGain.autoAttackCooldownReduction));
      character.battleStats.criticalMultiplier += god2.statGain.criticalMultiplier + god2.permanentStatGain.criticalMultiplier;
      character.battleStats.overdriveGain += god2.statGain.overdriveGain + god2.permanentStatGain.overdriveGain;
      character.battleStats.linkEffectiveness += god2.statGain.linkEffectiveness + god2.permanentStatGain.linkEffectiveness;
      character.battleStats.armorPenetration += god2.statGain.armorPenetration + god2.permanentStatGain.armorPenetration;
      character.battleStats.healingReceived += god2.statGain.healingReceived + god2.permanentStatGain.healingReceived;
      character.battleStats.debuffDuration += god2.statGain.debuffDuration + god2.permanentStatGain.debuffDuration;
      character.battleStats.buffDuration += god2.statGain.buffDuration + god2.permanentStatGain.buffDuration;
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

      /*equippedGodMaxHpStatMultiplier += god2.permanentStatMultiplier.maxHp - 1;
      equippedGodAttackStatMultiplier += god2.permanentStatMultiplier.attack - 1;
      equippedGodLuckStatMultiplier += god2.permanentStatMultiplier.luck - 1;
      equippedGodAgilityStatMultiplier += god2.permanentStatMultiplier.agility - 1;
      equippedGodDefenseStatMultiplier += god2.permanentStatMultiplier.defense - 1;
      equippedGodResistanceStatMultiplier += god2.permanentStatMultiplier.resistance - 1;*/
    }

    this.globalVar.gods.forEach(god => {
      character.battleStats.maxHp += god.partyPermanentStatGain.maxHp;
      character.battleStats.attack += god.partyPermanentStatGain.attack;
      character.battleStats.defense += god.partyPermanentStatGain.defense;
      character.battleStats.agility += god.partyPermanentStatGain.agility;
      character.battleStats.luck += god.partyPermanentStatGain.luck;
      character.battleStats.resistance += god.partyPermanentStatGain.resistance;
    });

    //charms
    character.battleStats.maxHp += this.charmService.getTotalMaxHpAdditionFromCharms(this.globalVar.resources);
    character.battleStats.attack += this.charmService.getTotalAttackAdditionFromCharms(this.globalVar.resources);
    character.battleStats.defense += this.charmService.getTotalDefenseAdditionFromCharms(this.globalVar.resources);
    character.battleStats.agility += this.charmService.getTotalAgilityAdditionFromCharms(this.globalVar.resources);
    character.battleStats.luck += this.charmService.getTotalLuckAdditionFromCharms(this.globalVar.resources);
    character.battleStats.resistance += this.charmService.getTotalResistanceAdditionFromCharms(this.globalVar.resources);

    character.battleStats.hpRegen += this.charmService.getTotalHpRegenAdditionFromCharms(this.globalVar.resources);
    character.battleStats.criticalMultiplier += this.charmService.getTotalCriticalMultiplierAdditionFromCharms(this.globalVar.resources);
    character.battleStats.armorPenetration += this.charmService.getTotalArmorPenetrationAdditionFromCharms(this.globalVar.resources);
    character.battleStats.overdriveGain += this.charmService.getTotalOverdriveGainAdditionFromCharms(this.globalVar.resources);
    character.battleStats.abilityCooldownReduction *= (1 - this.charmService.getTotalAbilityCooldownReductionAdditionFromCharms(this.globalVar.resources));
    character.battleStats.autoAttackCooldownReduction *= (1 - this.charmService.getTotalAutoAttackCooldownReductionAdditionFromCharms(this.globalVar.resources));
    character.battleStats.healingReceived += this.charmService.getTotalHealingReceivedAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.debuffDuration += this.charmService.getTotalDebuffDurationAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.buffDuration += this.charmService.getTotalBuffDurationAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.allyDamageBonus += this.charmService.getTotalAllyDamageAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.overdriveGainFromAutoAttacks += this.charmService.getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.healingDone += this.charmService.getTotalHealingDoneAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.aoeDamage += this.charmService.getTotalAoeDamageAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.thorns += this.charmService.getTotalThornsAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.tickFrequency += this.charmService.getTotalTickFrequencyAdditionFromCharms(this.globalVar.resources, character);
    character.battleStats.abilityCooldownReductionWithBuffs *= (1 - this.charmService.getTotalAbilityCooldownReductionWithBuffsFromCharms(this.globalVar.resources, character));
    character.battleStats.abilityCooldownReductionStart *= (1 - this.charmService.getTotalAbilityCooldownReductionStartAdditionFromCharms(this.globalVar.resources, character));
    character.battleStats.elementResistanceReduction += this.charmService.getElementResistanceReductionFromCharms(this.globalVar.resources, character);

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

    //gems    
    character.battleStats.maxHp *= 1 + this.equipmentService.getTotalMaxHpMultiplierGain(character.equipmentSet);
    character.battleStats.attack *= 1 + this.equipmentService.getTotalAttackMultiplierGain(character.equipmentSet);
    character.battleStats.defense *= 1 + this.equipmentService.getTotalDefenseMultiplierGain(character.equipmentSet);
    character.battleStats.agility *= 1 + this.equipmentService.getTotalAgilityMultiplierGain(character.equipmentSet);
    character.battleStats.luck *= 1 + this.equipmentService.getTotalLuckMultiplierGain(character.equipmentSet);
    character.battleStats.resistance *= 1 + this.equipmentService.getTotalResistanceMultiplierGain(character.equipmentSet);

    //chthonic powers    
    character.battleStats.maxHp *= 1 + this.globalVar.chthonicPowers.getMaxHpBoostPercent();
    character.battleStats.attack *= 1 + this.globalVar.chthonicPowers.getAttackBoostPercent();
    character.battleStats.defense *= 1 + this.globalVar.chthonicPowers.getDefenseBoostPercent();
    character.battleStats.agility *= 1 + this.globalVar.chthonicPowers.getAgilityBoostPercent();
    character.battleStats.luck *= 1 + this.globalVar.chthonicPowers.getLuckBoostPercent();
    character.battleStats.resistance *= 1 + this.globalVar.chthonicPowers.getResistanceBoostPercent();

    //god stat multipliers
    character.battleStats.maxHp *= equippedGodMaxHpStatMultiplier;
    character.battleStats.attack *= equippedGodAttackStatMultiplier;
    character.battleStats.defense *= equippedGodDefenseStatMultiplier;
    character.battleStats.agility *= equippedGodAgilityStatMultiplier;
    character.battleStats.luck *= equippedGodLuckStatMultiplier;
    character.battleStats.resistance *= equippedGodResistanceStatMultiplier;

    var partyGodMaxHpStatMultiplier = 1;
    var partyGodAttackStatMultiplier = 1;
    var partyGodDefenseStatMultiplier = 1;
    var partyGodAgilityStatMultiplier = 1;
    var partyGodLuckStatMultiplier = 1;
    var partyGodResistanceStatMultiplier = 1;

    this.globalVar.gods.forEach(god => {
      partyGodMaxHpStatMultiplier += god.partyPermanentStatMultiplier.maxHp - 1;
      partyGodAttackStatMultiplier += god.partyPermanentStatMultiplier.attack - 1;
      partyGodAgilityStatMultiplier += god.partyPermanentStatMultiplier.agility - 1;
      partyGodDefenseStatMultiplier += god.partyPermanentStatMultiplier.defense - 1;
      partyGodLuckStatMultiplier += god.partyPermanentStatMultiplier.luck - 1;
      partyGodResistanceStatMultiplier += god.partyPermanentStatMultiplier.resistance - 1;
    });

    character.battleStats.maxHp *= partyGodMaxHpStatMultiplier;
    character.battleStats.attack *= partyGodAttackStatMultiplier;
    character.battleStats.defense *= partyGodDefenseStatMultiplier;
    character.battleStats.agility *= partyGodAgilityStatMultiplier;
    character.battleStats.luck *= partyGodLuckStatMultiplier;
    character.battleStats.resistance *= partyGodResistanceStatMultiplier;

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

  setGodStatuses(character: Character) {
    /*if ((character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis) && 
    !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", character);
      if (dispenserOfDues !== undefined) {
        this.battleService.applyStatusEffect(dispenserOfDues.userEffect[0], character);
      }
    }*/

    if (character.assignedGod1 !== GodEnum.Hera && character.assignedGod2 !== GodEnum.Hera) {
      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Shapeshift))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Shapeshift);
    }

    if (character.assignedGod1 !== GodEnum.Nemesis && character.assignedGod2 !== GodEnum.Nemesis) {
      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DispenserOfDues);

      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Retribution))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Retribution);

      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ChainsOfFate))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ChainsOfFate);
    }

    if ((character.assignedGod1 !== GodEnum.Ares && character.assignedGod2 !== GodEnum.Ares) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Onslaught)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Onslaught);
    }

    if ((character.assignedGod1 !== GodEnum.Hades && character.assignedGod2 !== GodEnum.Hades) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.LordOfTheUnderworld)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.LordOfTheUnderworld);
    }

    if ((character.assignedGod1 !== GodEnum.Zeus && character.assignedGod2 !== GodEnum.Zeus) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Surge)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Surge);
    }

    if ((character.assignedGod1 !== GodEnum.Poseidon && character.assignedGod2 !== GodEnum.Poseidon) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Flow)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Flow);
    }

    if (character.assignedGod1 !== GodEnum.Apollo && character.assignedGod2 !== GodEnum.Apollo) {
      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Staccato))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Staccato);

      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Fortissimo))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Fortissimo);

      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Coda))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Coda);
    }
  }

  giveCharactersBonusExp(bonusXp: number) {
    //bonus XP has no restrictions on being dead or activity
    this.globalVar.characters.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel).forEach(partyMember => {
      this.giveCharacterExp(partyMember, bonusXp);
    });

    //active gods
    this.globalVar.gods.filter(god => god.isAvailable).forEach(god => {
      this.giveGodExp(god, bonusXp);
    });

    this.globalVar.characters.filter(partyMember => partyMember.isAvailable).forEach(partyMember => {
      var previousXp: number | undefined = undefined;
      while (partyMember.exp >= partyMember.expToNextLevel && partyMember.level < partyMember.maxLevel && (previousXp === undefined || partyMember.exp < previousXp)) {
        previousXp = partyMember.exp;
        this.levelUpPartyMember(partyMember);
        if (partyMember.level === partyMember.maxLevel)
          partyMember.exp = 0;
      }
    });
  }

  giveCharactersExpFromBattle(party: Character[], defeatedEnemies: EnemyTeam, partySizeMultiplier: number = 1) {
    var activeParty = this.getActivePartyCharacters(true);

    defeatedEnemies.enemyList.forEach(enemy => {
      activeParty.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel
        && !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(partyMember => {
          this.giveCharacterExp(partyMember, enemy.xpGainFromDefeat * partySizeMultiplier);
        });

      //active gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type))).forEach(god => {
          this.giveGodExp(god, enemy.xpGainFromDefeat * partySizeMultiplier);
        });

      //inactive gods
      this.globalVar.gods.filter(god => god.isAvailable &&
        (!activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type)))).forEach(god => {
          var inactiveGodModifier = this.getInactiveGodXpRate();

          this.giveGodExp(god, enemy.xpGainFromDefeat * inactiveGodModifier * partySizeMultiplier);
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

  giveCharactersExp(party: Character[], xp: number) {
    var activeParty = this.getActivePartyCharacters(true);

    activeParty.filter(partyMember => partyMember.isAvailable && partyMember.level < partyMember.maxLevel
      && !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).forEach(partyMember => {
        this.giveCharacterExp(partyMember, xp);
      });

    //active gods
    this.globalVar.gods.filter(god => god.isAvailable &&
      activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type))).forEach(god => {
        this.giveGodExp(god, xp);
      });

    //inactive gods
    this.globalVar.gods.filter(god => god.isAvailable &&
      (!activeParty.some(partyMember => !partyMember.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead) && (partyMember.assignedGod1 === god.type || partyMember.assignedGod2 === god.type)))).forEach(god => {
        var inactiveGodModifier = this.getInactiveGodXpRate();

        this.giveGodExp(god, xp * inactiveGodModifier);
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

  getInactiveGodXpRate() {
    var additive = 0;
    var commendations = this.globalVar.resources.find(item => item.item === ItemsEnum.OlympicCommendation);
    if (commendations !== undefined)
      additive = commendations.amount * .05;

    return .25 + additive;
  }

  getGodExpBonus(god: God) {
    var bonus = 1;

    var expUpEffectAmount = 1;
    var expUpEffect = this.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.ExperienceGainUp);
    if (expUpEffect !== undefined) {
      expUpEffectAmount = expUpEffect.effectiveness;
    }

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

    var godLevelBonus = 1;

    this.globalVar.gods.forEach(god => {
      godLevelBonus += god.partyPermanentStatGain.xpGain;
    });

    var zodiacBonus = 1;

    var zodiacBonusGods = this.zodiacService.getBonusGods();
    if (zodiacBonusGods.some(item => item === god.type)) {
      zodiacBonus += this.utilityService.zodiacGodXpBoost;
    }

    bonus *= BoonOfOlympusValue * affinityBoost * godLevelBonus * expUpEffectAmount * zodiacBonus;
    return bonus;
  }

  giveCharacterExp(partyMember: Character, xpAmount: number) {
    var godLevelBonus = 1;

    this.globalVar.gods.forEach(god => {
      godLevelBonus += god.partyPermanentStatGain.xpGain;
    });

    var expUpEffectAmount = 1;
    var expUpEffect = this.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.ExperienceGainUp);
    if (expUpEffect !== undefined) {
      expUpEffectAmount = expUpEffect.effectiveness;
    }

    partyMember.exp += xpAmount * godLevelBonus * expUpEffectAmount;
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
    }

    this.getCharacterLevelStatIncrease(character);
    this.checkForNewCharacterAbilities(character);
    this.checkForNewCharacterLinks(character);
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
    }
  }

  checkForNewCharacterLinks(character: Character) {
    if (character.level % 10 === 6) {
      character.linkInfo.totalLinks += 1;
      character.linkInfo.remainingLinks += 1;
    }
  }

  checkForNewCharacterOverdrives(character: Character) {
    if (character.level === 20) {
      character.unlockedOverdrives.push(OverdriveNameEnum.Fervor);
    }
    else if (character.level === 30) {
      if (character.type === CharacterEnum.Adventurer)
        character.unlockedOverdrives.push(OverdriveNameEnum.Quickness);
      if (character.type === CharacterEnum.Archer)
        character.unlockedOverdrives.push(OverdriveNameEnum.Weaken);
      if (character.type === CharacterEnum.Warrior)
        character.unlockedOverdrives.push(OverdriveNameEnum.Revenge);
      if (character.type === CharacterEnum.Priest)
        character.unlockedOverdrives.push(OverdriveNameEnum.Hope);
      if (character.type === CharacterEnum.Monk)
        character.unlockedOverdrives.push(OverdriveNameEnum.Flurry);
      if (character.type === CharacterEnum.Thaumaturge)
        character.unlockedOverdrives.push(OverdriveNameEnum.Explosion);
    }
  }

  checkForNewCharacterAbilities(character: Character, level?: number) {
    if (level === undefined)
      level = character.level;

    character.abilityList.forEach(ability => {
      if (level! >= ability.requiredLevel) {
        if (!ability.isAvailable) {
          if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
            var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " learns a new " + (ability.isPassive ? " passive " : "") + " ability: <strong>" + ability.name + "</strong>." + (ability.isPassive ? " View passive ability description by hovering your character's name." : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
          }
        }
        ability.isAvailable = true;
      }
    });

    //do upgrades   
    if (level % 10 === 2) {
      var matchingCount = character.permanentAbility1GainCount.find(item => item[0] === level);
      if (matchingCount === undefined)
        character.permanentAbility1GainCount.push([level, 1]);

      if (matchingCount !== undefined && matchingCount[1] > this.utilityService.characterPermanentAbility1ObtainCap)
        this.getCharacterLevelStatIncrease(character);
      else {
        this.upgradeCharacterAbility1(character, level);

        if (matchingCount !== undefined)
          matchingCount[1] += 1;
      }
    }
    if (level % 10 === 4) {
      var matchingCount = character.permanentPassiveGainCount.find(item => item[0] === level);
      if (matchingCount === undefined)
        character.permanentPassiveGainCount.push([level, 1]);

      if (matchingCount !== undefined && matchingCount[1] > this.utilityService.characterPermanentPassiveObtainCap)
        this.getCharacterLevelStatIncrease(character);
      else {
        this.upgradeCharacterPassive(character, level);

        if (matchingCount !== undefined)
          matchingCount[1] += 1;
      }
    }
    if (level % 10 === 8) {
      var matchingCount = character.permanentAbility2GainCount.find(item => item[0] === level);
      if (matchingCount === undefined)
        character.permanentAbility2GainCount.push([level, 1]);

      if (matchingCount !== undefined && matchingCount[1] > this.utilityService.characterPermanentAbility2ObtainCap)
        this.getCharacterLevelStatIncrease(character);
      else {
        this.upgradeCharacterAbility2(character, level);

        if (matchingCount !== undefined)
          matchingCount[1] += 1;
      }
    }
  }

  getCharacterAbilityUpgrade(character: Character, newLevel: number) {
    var ability = new Ability(true);

    if (newLevel % 10 === 2) {        //ability 1 
      ability.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;

      if (character.type === CharacterEnum.Adventurer) {
        ability.effectiveness += .15 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Archer) {
        ability.effectiveness += .15 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Priest) {
        ability.effectiveness += .04 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Warrior) {
        if (ability.targetEffect.length === 0)
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));

        ability.targetEffect[0].effectiveness += .025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Monk) {
        ability.effectiveness += .075 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Thaumaturge) {
        ability.effectiveness += .15 * Math.ceil(newLevel / 10);
      }
    }
    if (newLevel % 10 === 4) {        //passive 
      ability.requiredLevel = this.utilityService.characterPassiveLevel;

      if (character.type === CharacterEnum.Adventurer) {
        ability.effectiveness += .025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Archer) {
        if (ability.targetEffect.length === 0)
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));

        var targetGainsEffect = ability.targetEffect[0];
        targetGainsEffect.effectiveness += .01 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Priest) {
        ability.effectiveness += .025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Warrior) {
        ability.effectiveness += .025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Monk) {
        ability.effectiveness += .015 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Thaumaturge) {
        ability.effectiveness += .015 * Math.ceil(newLevel / 10);
      }
    }
    if (newLevel % 10 === 8) {        //ability 2
      ability.requiredLevel = this.utilityService.characterAbility2Level;

      if (character.type === CharacterEnum.Adventurer) {
        if (ability.userEffect.length === 0)
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
        ability.userEffect[0].effectiveness += .0025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Archer) {
        ability.effectiveness += .1 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Priest) {
        ability.effectiveness += .025 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Warrior) {
        ability.effectiveness += .1 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Monk) {
        ability.effectiveness += .125 * Math.ceil(newLevel / 10);
      }
      if (character.type === CharacterEnum.Thaumaturge) {
        ability.effectiveness += .1 * Math.ceil(newLevel / 10);
      }
    }

    return ability;
  }

  handleAbilityUpgradeValues(ability: Ability, upgradedAbility: Ability) {
    ability.effectiveness += upgradedAbility.effectiveness;

    if (upgradedAbility.userEffect !== undefined && upgradedAbility.userEffect.length > 0) {
      if (ability.userEffect === undefined || ability.userEffect.length === 0) {
        ability.userEffect = upgradedAbility.userEffect;
      }
      else {
        ability.userEffect[0].effectiveness += upgradedAbility.userEffect[0].effectiveness;
        ability.userEffect[0].duration += upgradedAbility.userEffect[0].duration;

        if (ability.userEffect[1] !== undefined) {
          ability.userEffect[1].effectiveness += upgradedAbility.userEffect[1].effectiveness;
          ability.userEffect[1].duration += upgradedAbility.userEffect[1].duration;
        }
      }
    }

    if (upgradedAbility.targetEffect !== undefined && upgradedAbility.targetEffect.length > 0) {
      if (ability.targetEffect === undefined || ability.targetEffect.length === 0) {
        ability.targetEffect = upgradedAbility.targetEffect;
      }
      else {
        ability.targetEffect[0].effectiveness += upgradedAbility.targetEffect[0].effectiveness;
        ability.targetEffect[0].duration += upgradedAbility.targetEffect[0].duration;

        if (ability.targetEffect[1] !== undefined) {
          ability.targetEffect[1].effectiveness += upgradedAbility.targetEffect[1].effectiveness;
          ability.targetEffect[1].duration += upgradedAbility.targetEffect[1].duration;
        }
      }
    }


    return ability;
  }

  upgradeCharacterAbility1(character: Character, newLevel: number) {
    var ability1 = character.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);

    if (ability1 === undefined) {
      ability1 = new Ability(true);
      ability1.requiredLevel = this.utilityService.defaultCharacterAbilityLevel;
      character.permanentAbilityUpgrades.push(ability1);
    }

    ability1.abilityUpgradeLevel += 1;
    var upgradedAbilities = this.getCharacterAbilityUpgrade(character, newLevel);

    ability1 = this.handleAbilityUpgradeValues(ability1, upgradedAbilities);

    var baseAbility = character.abilityList.find(item => item.requiredLevel === ability1?.requiredLevel);

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + baseAbility?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
    }
  }

  upgradeCharacterPassive(character: Character, newLevel: number) {
    var ability1 = character.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);

    if (ability1 === undefined) {
      ability1 = new Ability(true);
      ability1.requiredLevel = this.utilityService.characterPassiveLevel;
      character.permanentAbilityUpgrades.push(ability1);
    }

    ability1.abilityUpgradeLevel += 1;
    var upgradedAbilities = this.getCharacterAbilityUpgrade(character, newLevel);

    ability1 = this.handleAbilityUpgradeValues(ability1, upgradedAbilities);

    var baseAbility = character.abilityList.find(item => item.requiredLevel === ability1?.requiredLevel);

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + baseAbility?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
    }
  }

  upgradeCharacterAbility2(character: Character, newLevel: number) {
    var ability1 = character.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);

    if (ability1 === undefined) {
      ability1 = new Ability(true);
      ability1.requiredLevel = this.utilityService.characterAbility2Level;
      character.permanentAbilityUpgrades.push(ability1);
    }

    ability1.abilityUpgradeLevel += 1;
    var upgradedAbilities = this.getCharacterAbilityUpgrade(character, newLevel);

    ability1 = this.handleAbilityUpgradeValues(ability1, upgradedAbilities);

    var baseAbility = character.abilityList.find(item => item.requiredLevel === ability1?.requiredLevel);

    if (this.globalVar.gameLogSettings.get("partyLevelUp")) {
      var gameLogEntry = "<strong class='" + this.getCharacterColorClassText(character.type) + "'>" + character.name + "</strong>" + " improves ability: <strong>" + baseAbility?.name + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
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
    if (type === CharacterEnum.Monk)
      return 'monkColor';
    if (type === CharacterEnum.Thaumaturge)
      return 'thaumaturgeColor';

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
    if (type === GodEnum.Aphrodite)
      return 'aphroditeColor';
    if (type === GodEnum.Hera)
      return 'heraColor';

    return '';
  }

  getCharacterXpToNextLevel(level: number) {
    var baseXp = 100;
    var factor = 1.333;
    if (level > 9) {
      baseXp = 1000;
    }
    if (level > 49) {
      baseXp = 100000;
      factor = 1.242;
    }
    var additive = level > 4 ? 350 * (level) : 0;
    var exponential = (baseXp * (factor ** (level - 1)));
    var multiplier = baseXp * level;

    //(100 * level) + (100 * (1.333^(level-1))) + 350*level      
    return this.utilityService.roundTo(multiplier + exponential + additive, 5);
  }

  levelUpGod(god: God, ignoreGameLogEntries: boolean = false) {
    god.level += 1;
    god.exp -= god.expToNextLevel;

    if (god.name !== undefined && this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " attains level <strong>" + god.level + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
    }

    var getLevelUpType = this.getGodLevelIncreaseTypeByLevel(god, god.level);
    if (getLevelUpType === GodLevelIncreaseEnum.Stats)
      this.doGodLevelStatIncrease(god, ignoreGameLogEntries);
    else if (getLevelUpType === GodLevelIncreaseEnum.NewAbility)
      this.checkForNewGodAbilities(god, ignoreGameLogEntries);
    else if (getLevelUpType === GodLevelIncreaseEnum.PermanentAbility)
      this.checkForNewGodPermanentAbilities(god, ignoreGameLogEntries);
    else if (getLevelUpType === GodLevelIncreaseEnum.AbilityUpgrade)
      this.checkForNewGodAbilityUpgrades(god, ignoreGameLogEntries);
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

  doGodLevelStatIncrease(god: God, ignoreGameLogEntries: boolean = false) {
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

    if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " gains <strong>" + statGainText + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
    }

    god.statGainCount += 1;
  }

  checkForNewGodAbilities(god: God, ignoreGameLogEntries: boolean = false) {
    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel) {
        if (!ability.isAvailable) {
          if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
            var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " learns a new " + (ability.isPassive ? " passive " : "") + " ability: <strong>" + ability.name + "</strong>." + (ability.isPassive ? " View passive ability description by hovering your god's name." : "");
            this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
          }
        }
        ability.isAvailable = true;
      }
    });
  }

  checkForNewGodPermanentAbilities(god: God, ignoreGameLogEntries: boolean = false) {
    if (god.level === this.utilityService.permanentPassiveGodLevel) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
      if (ability !== undefined) {
        ability.isPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility2Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
      if (ability !== undefined) {
        ability.isPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
        }
      }
    }

    if (god.level === this.utilityService.permanentGodAbility3Level) {
      var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
      if (ability !== undefined) {
        ability.isPermanent = true;
        if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
          var gameLogEntry = "<strong>" + ability.name + "</strong> is now a permanent ability for <strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " and will persist even after resetting their level.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
        }
      }
    }
  }

  checkForNewGodAbilityUpgrades(god: God, ignoreGameLogEntries: boolean = false) {
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

    if (this.globalVar.gameLogSettings.get("godLevelUp") && !ignoreGameLogEntries) {
      var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>'s ability <strong>" + ability.ability.name + "</strong> has upgraded to level " + ability.upgradeLevel + ".";
      this.gameLogService.updateGameLog(GameLogEntryEnum.LearnAbility, gameLogEntry, this.globalVar);
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
        userGainsEffect.effectiveness += .01;
    }
    else if (god.type === GodEnum.Zeus) {
      if ((ability.abilityUpgradeLevel % 7 === 0 || ability.abilityUpgradeLevel === 50) && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .05;
      else
        ability.effectiveness += .175;
    }
    else if (god.type === GodEnum.Ares) {
      //every 10 upgrades until level 100, increase duration
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .25;
      else
        targetGainsEffect.effectiveness += .015;
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
      if (ability.abilityUpgradeLevel % 45 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.maxCount += 1;
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.effectiveness -= .05;
      }
      else
        ability.effectiveness += .1;
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
    else if (god.type === GodEnum.Poseidon) {
      if (ability.abilityUpgradeLevel % 20 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .05;
      else
        ability.effectiveness += .15;
    }
    else if (god.type === GodEnum.Aphrodite) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        userGainsEffect.effectiveness += .01;
    }
    else if (god.type === GodEnum.Hera) {
      if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .05;
      else
        ability.effectiveness += .075;
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
      else if (ability.abilityUpgradeLevel % 3 === 2 && ability.abilityUpgradeLevel <= 90) {
        userGainsEffect.duration += .2;
        userGainsSecondEffect.duration += .2;
      }
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
        userGainsEffect.effectiveness += .005;
    }
    else if (god.type === GodEnum.Zeus) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.effectiveness += .04;
      else
        ability.effectiveness += .2;
    }
    else if (god.type === GodEnum.Ares) {
      //every 5 upgrades until level 100, increase duration
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .3;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        targetGainsEffect.effectiveness += .01;
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
        targetGainsEffect.effectiveness += .004;
      else if (ability.abilityUpgradeLevel % 11 === 0 && ability.abilityUpgradeLevel <= 100) {
        ability.secondaryEffectiveness += .1;
      }
      else {
        //if (ability.abilityUpgradeLevel % 10 === 3 && ability.abilityUpgradeLevel <= 100)
        //targetGainsEffect.duration += .5;

        ability.effectiveness += .15;
      }
    }
    else if (god.type === GodEnum.Poseidon) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.secondaryEffectiveness += .03;
      else
        ability.effectiveness += .05;
    }
    else if (god.type === GodEnum.Hera) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        targetGainsEffect.effectiveness -= .002;
    }
    else if (god.type === GodEnum.Aphrodite) {
      if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += .25;
      }
      else {
        userGainsEffect.effectiveness += .0075;
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
      //5, 15, 45, 75, 91 increase blind effectiveness
      else if ((ability.abilityUpgradeLevel === 5 || ability.abilityUpgradeLevel === 91 || ability.abilityUpgradeLevel % 15 === 0) && ability.abilityUpgradeLevel <= 100) {
        targetGainsEffect.effectiveness += .05;
      }
      else if ((ability.abilityUpgradeLevel === 17 || ability.abilityUpgradeLevel === 35 || ability.abilityUpgradeLevel === 53 || ability.abilityUpgradeLevel === 71 || ability.abilityUpgradeLevel === 89) && ability.abilityUpgradeLevel <= 100)
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
      else if (ability.abilityUpgradeLevel === 25 || ability.abilityUpgradeLevel === 75)
        ability.userEffect.push(this.makeStatusEffectCopy(userGainsEffect));
      else if (ability.abilityUpgradeLevel === 99)
        ability.userEffect.forEach(effect => { effect.effectiveness += .03 });
      else
        ability.userEffect.forEach(effect => { effect.effectiveness += .01 });
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100) {
        userGainsEffect.duration += .5;
      }
      else
        userGainsEffect.effectiveness += .01;
    }
    else if (god.type === GodEnum.Zeus) {
      if (ability.abilityUpgradeLevel === 45)
        ability.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatDamageAfterDelay, 20, 1, false, true));
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        ability.effectiveness += .125;
    }
    else if (god.type === GodEnum.Ares) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        targetGainsEffect.duration += .5;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        targetGainsEffect.effectiveness += .1;
    }
    else if (god.type === GodEnum.Hades) {
      //every 10 upgrades until level 100, reduce cooldown
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else
        ability.effectiveness += .03;
    }
    else if (god.type === GodEnum.Nemesis) {
      if (ability.abilityUpgradeLevel === 50 || ability.abilityUpgradeLevel === 100)
        ability.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= 1;
      else
        ability.effectiveness += .075;
    }
    else if (god.type === GodEnum.Dionysus) {
      if (ability.abilityUpgradeLevel % 12 === 0 && ability.abilityUpgradeLevel <= 100 || ability.abilityUpgradeLevel === 30 ||
        ability.abilityUpgradeLevel === 70)
        ability.targetEffect.push(this.makeStatusEffectCopy(targetGainsEffect));
      else {
        if (ability.abilityUpgradeLevel % 2 === 0 || (ability.abilityUpgradeLevel === 13 || ability.abilityUpgradeLevel === 37 ||
          ability.abilityUpgradeLevel === 61 || ability.abilityUpgradeLevel === 85 || ability.abilityUpgradeLevel === 25 ||
          ability.abilityUpgradeLevel === 43 || ability.abilityUpgradeLevel === 57 || ability.abilityUpgradeLevel === 73 ||
          ability.abilityUpgradeLevel === 95 || ability.abilityUpgradeLevel === 21)) {
          ability.targetEffect.forEach(effect => { effect.effectiveness -= .0026 });
        }
        else {
          ability.targetEffect.forEach(effect => { effect.duration += .1 });
        }
      }
    }
    else if (god.type === GodEnum.Poseidon) {
      if (ability.abilityUpgradeLevel === 75)
        ability.userEffect.push(this.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      else if (ability.abilityUpgradeLevel === 25)
        ability.secondaryEffectiveness += 1;
      else if (ability.abilityUpgradeLevel % 5 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .04;
      else
        ability.effectiveness += .125;
    }
    else if (god.type === GodEnum.Hera) {
      if (ability.abilityUpgradeLevel % 20 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.secondaryEffectiveness += .05;
      else
        ability.effectiveness += .1;
    }
    else if (god.type === GodEnum.Aphrodite) {
      if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .075;
    }
  }

  upgradeGodPassive(god: God) {
    var ability = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
    if (ability === undefined)
      return;

    ability.abilityUpgradeLevel += 1;
    var userGainsEffect = ability.userEffect[0];

    if (god.type === GodEnum.Athena) {
      if (ability.abilityUpgradeLevel === 45)
        userGainsEffect.maxCount = 2;
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness *= 2;
      else if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += ability.abilityUpgradeLevel + 2;
    }
    else if (god.type === GodEnum.Artemis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.secondaryEffectiveness += .05;
      else if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .01;
    }
    else if (god.type === GodEnum.Hermes) {
      if (ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .009;
    }
    else if (god.type === GodEnum.Apollo) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        ability.effectiveness += .015;
    }
    else if (god.type === GodEnum.Zeus) {
      if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .009;
    }
    else if (god.type === GodEnum.Ares) {
      //increase max count to 10
      if (ability.abilityUpgradeLevel % 20 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.maxCount += 1;
      else
        if (ability.abilityUpgradeLevel <= 100)
          ability.effectiveness += .0007;
    }
    else if (god.type === GodEnum.Hades) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        userGainsEffect.duration += 1.5;
      else
        userGainsEffect.effectiveness += .003;
    }
    else if (god.type === GodEnum.Nemesis) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.effectiveness += .08;
      else if (ability.abilityUpgradeLevel <= 100)
        ability.secondaryEffectiveness += .02;
    }
    else if (god.type === GodEnum.Dionysus) {
      if (ability.abilityUpgradeLevel === 44)
        ability.userEffect.push(this.makeStatusEffectCopy(userGainsEffect));
      else if (ability.abilityUpgradeLevel === 88)
        ability.cooldown -= 4;
      else if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.userEffect.forEach(effect => { effect.duration += 1 });
      else
        ability.userEffect.forEach(effect => { effect.effectiveness += .00625 });
    }
    else if (god.type === GodEnum.Poseidon) {
      if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .0019;
    }
    else if (god.type === GodEnum.Hera) {
      if (ability.abilityUpgradeLevel % 10 === 0 && ability.abilityUpgradeLevel <= 100)
        ability.cooldown -= .5;
      else
        userGainsEffect.effectiveness += .0005;
    }
    else if (god.type === GodEnum.Aphrodite) {
      if (ability.abilityUpgradeLevel <= 100)
        userGainsEffect.effectiveness += .002;
    }
  }

  getGodPermanentStatObtainCount(god: God, godLevel: number) {
    if (godLevel % 100 === 0 && godLevel <= 500) {
      var matchingCount = god.permanentStat2GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0 && godLevel <= 500) {
      var matchingCount = god.permanentStat1GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 100 === 0 && godLevel <= 1000) {
      var matchingCount = god.permanentStat4GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0 && godLevel <= 1000) {
      var matchingCount = god.permanentStat3GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 200 === 50 && godLevel <= 2000) {
      var matchingCount = god.permanentAbility1GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 200 === 100 && godLevel <= 2000) {
      var matchingCount = god.permanentPassiveGainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 200 === 150 && godLevel <= 2000) {
      var matchingCount = god.permanentAbility2GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 200 === 0 && godLevel <= 2000) {
      var matchingCount = god.permanentAbility3GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 100 === 0 && godLevel <= 3000) {
      var matchingCount = god.permanentStat6GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0 && godLevel <= 3000) {
      var matchingCount = god.permanentStat5GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 100 === 0 && godLevel <= 4000) {
      var matchingCount = god.permanentStat7GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0 && godLevel <= 4000) {
      var matchingCount = god.permanentDuoAbilityGainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }
    else if (godLevel % 50 === 0 && godLevel > 4000) {
      var matchingCount = god.permanentStat8GainCount.find(item => item[0] === godLevel);
      if (matchingCount === undefined)
        return [0, 0];
      else
        return matchingCount;
    }

    return [0, 0];
  }

  isGodPermanentStatStillObtainable(god: God, godLevel: number) {
    var count = this.getGodPermanentStatObtainCount(god, godLevel);

    if (godLevel <= 500) {
      if (godLevel % 100 === 0) {
        if (count[1] >= this.utilityService.godPermanentStatGain2ObtainCap)
          return false;
      }
      else if (godLevel % 50 === 0) {
        if (count[1] >= this.utilityService.godPermanentStatGain1ObtainCap + this.globalVar.chthonicPowers.increasedGodPrimaryStatResets) {
          return false;
        }
      }
    }
    else if (godLevel <= 1000) {
      if (godLevel % 100 === 0) {
        if (count[1] >= this.utilityService.godPermanentStatGain4ObtainCap)
          return false;
      }
      else if (godLevel % 50 === 0) {
        if (count[1] >= this.utilityService.godPermanentStatGain3ObtainCap + this.globalVar.chthonicPowers.increasedPartyPrimaryStatResets)
          return false;
      }
    }
    else {
      if (godLevel % 200 === 50) {
        if (count[1] >= this.utilityService.godPermanentAbility1ObtainCap)
          return false;
      }
      else if (godLevel % 200 === 100) {
        if (count[1] >= this.utilityService.godPermanentPassiveObtainCap)
          return false;
      }
      else if (godLevel % 200 === 150) {
        if (count[1] >= this.utilityService.godPermanentAbility2ObtainCap)
          return false;
      }
      else if (godLevel % 200 === 0) {
        if (count[1] >= this.utilityService.godPermanentAbility3ObtainCap)
          return false;
      }
    }

    return true;
  }

  getNewGodPermanentStats(god: God, godLevel: number) {
    var stats = new CharacterStats(0, 0, 0, 0, 0, 0);

    if (godLevel <= 500) {
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
        else if (god.type === GodEnum.Zeus) {
          stats.elementIncrease.lightning += godLevel / 25000; //should lead to +60% lightning damage
        }
        else if (god.type === GodEnum.Poseidon) {
          stats.elementIncrease.water += godLevel / 25000; //should lead to +60% water damage
        }
        if (god.type === GodEnum.Aphrodite) {
          stats.linkEffectiveness += godLevel / 18750; //should lead to +80% link effectiveness
        }
        if (god.type === GodEnum.Hera) {
          stats.elementIncrease.air += godLevel / 25000; //should lead to +60% air damage
        }
      }
      else if (godLevel % 50 === 0) {
        if (god.type === GodEnum.Athena || god.type === GodEnum.Dionysus) {
          stats.defense += Math.round(godLevel / (3 + (1 / 3)));
        }
        else if (god.type === GodEnum.Artemis || god.type === GodEnum.Hades) {
          stats.luck += Math.round(godLevel / (3 + (1 / 3)));
        }
        else if (god.type === GodEnum.Hermes || god.type === GodEnum.Poseidon) {
          stats.agility += Math.round(godLevel / (3 + (1 / 3)));
        }
        else if (god.type === GodEnum.Zeus || god.type === GodEnum.Hera) {
          stats.attack += Math.round(godLevel / (3 + (1 / 3)));
        }
        else if (god.type === GodEnum.Apollo || god.type === GodEnum.Nemesis) {
          stats.resistance += Math.round(godLevel / (3 + (1 / 3)));
        }
        else if (god.type === GodEnum.Ares || god.type === GodEnum.Aphrodite) {
          stats.maxHp += Math.round((godLevel / (3 + (1 / 3))) * 5);
        }
      }
    }
    else if (godLevel > 501 && godLevel <= 1000) {
      if (godLevel === 600) { //should lead to +25% party xp gain        
        stats.xpGain += .003;
      }
      else if (godLevel === 700) {
        stats.xpGain += .004;
      }
      else if (godLevel === 800) {
        stats.xpGain += .005;
      }
      else if (godLevel === 900) {
        stats.xpGain += .006;
      }
      else if (godLevel === 1000) {
        stats.xpGain += .007;
      }
      else if (godLevel % 50 === 0) {
        if (god.type === GodEnum.Athena || god.type === GodEnum.Dionysus) {
          stats.defense += (godLevel - 450) / 4;
        }
        else if (god.type === GodEnum.Artemis || god.type === GodEnum.Hades) {
          stats.luck += (godLevel - 450) / 4;
        }
        else if (god.type === GodEnum.Hermes || god.type === GodEnum.Poseidon) {
          stats.agility += (godLevel - 450) / 4;
        }
        else if (god.type === GodEnum.Zeus || god.type === GodEnum.Hera) {
          stats.attack += (godLevel - 450) / 4;
        }
        else if (god.type === GodEnum.Apollo || god.type === GodEnum.Nemesis) {
          stats.resistance += (godLevel - 450) / 4;
        }
        else if (god.type === GodEnum.Ares || god.type === GodEnum.Aphrodite) {
          stats.maxHp += (godLevel - 450) * 1.25;
        }
      }
    }
    else if (godLevel > 2001 && godLevel <= 3000) {
      if (godLevel === 2050) { //should lead to +25% party xp gain        
        stats.xpGain += .013;
      }
      else if (godLevel === 2150) {
        stats.xpGain += .014;
      }
      else if (godLevel === 2250) {
        stats.xpGain += .015;
      }
      else if (godLevel === 2350) {
        stats.xpGain += .016;
      }
      else if (godLevel === 2450) {
        stats.xpGain += .017;
      }
      else if (godLevel === 2550) {
        stats.xpGain += .018;
      }
      else if (godLevel === 2650) {
        stats.xpGain += .019;
      }
      else if (godLevel === 2750) {
        stats.xpGain += .02;
      }
      else if (godLevel === 2850) {
        stats.xpGain += .021;
      }
      else if (godLevel === 2950) {
        stats.xpGain += .022;
      }
      else if (godLevel % 100 === 0) {
        if (god.type === GodEnum.Athena || god.type === GodEnum.Dionysus) {
          stats.defense += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
        else if (god.type === GodEnum.Artemis || god.type === GodEnum.Hades) {
          stats.luck += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
        else if (god.type === GodEnum.Hermes || god.type === GodEnum.Poseidon) {
          stats.agility += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
        else if (god.type === GodEnum.Zeus || god.type === GodEnum.Hera) {
          stats.attack += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
        else if (god.type === GodEnum.Apollo || god.type === GodEnum.Nemesis) {
          stats.resistance += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
        else if (god.type === GodEnum.Ares || god.type === GodEnum.Aphrodite) {
          stats.maxHp += this.utilityService.genericRound(Math.ceil((godLevel - 2000) / 50) / 2200);
        }
      }
    }
    else if (godLevel > 3001 && godLevel <= 4000) {
      if (godLevel % 100 === 0) {
        if (god.type === GodEnum.Athena || god.type === GodEnum.Dionysus) {
          stats.defense += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
        else if (god.type === GodEnum.Artemis || god.type === GodEnum.Hades) {
          stats.luck += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
        else if (god.type === GodEnum.Hermes || god.type === GodEnum.Poseidon) {
          stats.agility += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
        else if (god.type === GodEnum.Zeus || god.type === GodEnum.Hera) {
          stats.attack += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
        else if (god.type === GodEnum.Apollo || god.type === GodEnum.Nemesis) {
          stats.resistance += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
        else if (god.type === GodEnum.Ares || god.type === GodEnum.Aphrodite) {
          stats.maxHp += this.utilityService.genericRound(Math.ceil((godLevel - 3000) / 50) / 733.33333);
        }
      }
      else if (godLevel % 50 === 0) {
        stats.duoPermanentEffectiveness += 1;
      }
    }
    else if (godLevel > 4000) {
      if (godLevel % 300 === 0) {
        stats.attack += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
      else if (godLevel % 300 === 50) {
        stats.resistance += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
      else if (godLevel % 300 === 100) {
        stats.luck += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
      else if (godLevel % 300 === 150) {
        stats.defense += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
      else if (godLevel % 300 === 200) {
        stats.agility += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
      else if (godLevel % 300 === 250) {
        stats.maxHp += 5000 + (2500 * Math.floor((godLevel - 4050) / 300));
      }
    }

    return stats;
  }

  getNewGodPermanentAbilityUpgrades(god: God, godLevel: number) {
    var ability = new Ability(true);

    if (godLevel > 1000 && godLevel <= 2000) {
      if (godLevel % 200 === 50) {        //ability 1 
        ability.requiredLevel = this.utilityService.defaultGodAbilityLevel;

        if (god.type === GodEnum.Athena) {
          ability.effectiveness += .6;
        }
        else if (god.type === GodEnum.Artemis) {
          ability.effectiveness += .6;
        }
        else if (god.type === GodEnum.Hermes) {
          ability.effectiveness += .25;
        }
        else if (god.type === GodEnum.Apollo) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .03;
        }
        else if (god.type === GodEnum.Ares) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.effectiveness = .025;
        }
        else if (god.type === GodEnum.Hades) {
          ability.effectiveness += .2;
        }
        else if (god.type === GodEnum.Dionysus) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.threshold = .015;
        }
        else if (god.type === GodEnum.Nemesis) {
          ability.effectiveness += .5;
        }
        else if (god.type === GodEnum.Zeus) {
          ability.effectiveness += .75;
        }
        else if (god.type === GodEnum.Poseidon) {
          ability.effectiveness += .5;
        }
        else if (god.type === GodEnum.Hera) {
          ability.effectiveness += .6;
        }
        else if (god.type === GodEnum.Aphrodite) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.threshold = .025;
        }
      }
      else if (godLevel % 200 === 100) //passive  
      {
        ability.requiredLevel = this.utilityService.godPassiveLevel;

        if (god.type === GodEnum.Athena) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .05;
        }
        else if (god.type === GodEnum.Artemis) {
          ability.effectiveness += .02;
        }
        else if (god.type === GodEnum.Hermes) {
          ability.effectiveness += .005;
        }
        else if (god.type === GodEnum.Apollo) {
          ability.effectiveness += .025;
        }
        else if (god.type === GodEnum.Ares) {
          ability.effectiveness += .002;
        }
        else if (god.type === GodEnum.Hades) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .005;
        }
        else if (god.type === GodEnum.Dionysus) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .02;
        }
        else if (god.type === GodEnum.Nemesis) {
          ability.secondaryEffectiveness += .04;
        }
        if (god.type === GodEnum.Zeus) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .01;
        }
        if (god.type === GodEnum.Poseidon) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .003;
        }
        if (god.type === GodEnum.Hera) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .0005;
        }
        if (god.type === GodEnum.Aphrodite) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .003;
        }
      }
      else if (godLevel % 200 === 150) //ability 2  
      {
        ability.requiredLevel = this.utilityService.godAbility2Level;

        if (god.type === GodEnum.Athena) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          var userGainsSecondEffect = ability.userEffect[1];
          userGainsEffect.duration = .1;
          userGainsSecondEffect.duration = .1;
        }
        else if (god.type === GodEnum.Artemis) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.duration = .1;
        }
        else if (god.type === GodEnum.Hermes) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          var userGainsSecondEffect = ability.userEffect[1];
          userGainsEffect.effectiveness = .015;
          userGainsSecondEffect.effectiveness = .015;
        }
        else if (god.type === GodEnum.Apollo) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .01;
        }
        else if (god.type === GodEnum.Ares) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.duration = .1;
        }
        else if (god.type === GodEnum.Hades) {
          ability.effectiveness = .25;
        }
        else if (god.type === GodEnum.Dionysus) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.effectiveness = .0016;
        }
        else if (god.type === GodEnum.Nemesis) {
          ability.effectiveness += .1;
        }
        else if (god.type === GodEnum.Zeus) {
          ability.effectiveness += .85;
        }
        else if (god.type === GodEnum.Poseidon) {
          ability.effectiveness = .2;
        }
        else if (god.type === GodEnum.Hera) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.effectiveness = .002;
        }
        else if (god.type === GodEnum.Aphrodite) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .015;
        }
      }
      else if (godLevel % 200 === 0) //ability 3
      {
        ability.requiredLevel = this.utilityService.godAbility3Level;

        if (god.type === GodEnum.Athena) {
          ability.effectiveness += .35;
        }
        else if (god.type === GodEnum.Artemis) {
          ability.effectiveness += 1;
        }
        else if (god.type === GodEnum.Hermes) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .02;
        }
        else if (god.type === GodEnum.Apollo) {
          ability.userEffect.push(new StatusEffect(StatusEffectEnum.None));
          var userGainsEffect = ability.userEffect[0];
          userGainsEffect.effectiveness = .02;
        }
        else if (god.type === GodEnum.Ares) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.effectiveness = .5;
        }
        else if (god.type === GodEnum.Hades) {
          ability.effectiveness += .1;
        }
        else if (god.type === GodEnum.Dionysus) {
          ability.targetEffect.push(new StatusEffect(StatusEffectEnum.None));
          var targetGainsEffect = ability.targetEffect[0];
          targetGainsEffect.effectiveness = -.0028;
        }
        else if (god.type === GodEnum.Nemesis) {
          ability.effectiveness += .25;
        }
        else if (god.type === GodEnum.Zeus) {
          ability.effectiveness += .4;
        }
        else if (god.type === GodEnum.Poseidon) {
          ability.effectiveness += .25;
        }
        else if (god.type === GodEnum.Hera) {
          ability.effectiveness += .3;
        }
        else if (god.type === GodEnum.Aphrodite) {
          ability.effectiveness += .5;
        }
      }
    }

    return ability;
  }

  checkForNewGodPermanentStats(god: God) {
    var upgradedStats = this.getNewGodPermanentStats(god, god.level);
    var upgradedAbilities = this.getNewGodPermanentAbilityUpgrades(god, god.level);

    if (god.level <= 500) {
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

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain1ObtainCap + this.globalVar.chthonicPowers.increasedGodPrimaryStatResets)
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
      god.permanentStatGain.linkEffectiveness += upgradedStats.linkEffectiveness;

      god.permanentStatGain = this.roundCharacterStats(god.permanentStatGain);
    }
    else if (god.level <= 1000) {
      if (god.level % 100 === 0) {
        var matchingCount = god.permanentStat4GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat4GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain4ObtainCap)
          return;
      }
      else if (god.level % 50 === 0) {
        var matchingCount = god.permanentStat3GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat3GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain3ObtainCap + this.globalVar.chthonicPowers.increasedPartyPrimaryStatResets)
          return;
      }

      god.partyPermanentStatGain.attack += upgradedStats.attack;
      god.partyPermanentStatGain.defense += upgradedStats.defense;
      god.partyPermanentStatGain.maxHp += upgradedStats.maxHp;
      god.partyPermanentStatGain.agility += upgradedStats.agility;
      god.partyPermanentStatGain.luck += upgradedStats.luck;
      god.partyPermanentStatGain.resistance += upgradedStats.resistance;
      god.partyPermanentStatGain.xpGain += upgradedStats.xpGain;

      god.permanentStatGain = this.roundCharacterStats(god.permanentStatGain);
    }
    else if (god.level <= 2000) {
      if (god.level % 200 === 50) {
        var matchingCount = god.permanentAbility1GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentAbility1GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentAbility1ObtainCap)
          return;
      }
      else if (god.level % 200 === 100) {
        var matchingCount = god.permanentPassiveGainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentPassiveGainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentPassiveObtainCap)
          return;
      }
      else if (god.level % 200 === 150) {
        var matchingCount = god.permanentAbility2GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentAbility2GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentAbility2ObtainCap)
          return;
      }
      else if (god.level % 200 === 0) {
        var matchingCount = god.permanentAbility3GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentAbility3GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentAbility3ObtainCap)
          return;
      }

      var upgradedAbility = god.permanentAbilityUpgrades.find(item => item.requiredLevel === upgradedAbilities.requiredLevel);

      if (upgradedAbility === undefined) {
        god.permanentAbilityUpgrades.push(upgradedAbilities);
      }
      else {
        upgradedAbility.effectiveness += upgradedAbilities.effectiveness;
        upgradedAbility.secondaryEffectiveness += upgradedAbilities.secondaryEffectiveness;

        if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0) {
          if (upgradedAbility.userEffect === undefined || upgradedAbility.userEffect.length === 0) {
            upgradedAbility.userEffect = upgradedAbilities.userEffect;
          }
          else {
            if ((god.type === GodEnum.Dionysus && upgradedAbilities.requiredLevel === this.utilityService.godPassiveLevel) ||
              (god.type === GodEnum.Hermes && upgradedAbilities.requiredLevel === this.utilityService.godAbility3Level)) {
              upgradedAbility.userEffect.forEach(effect => {
                effect.effectiveness += upgradedAbilities.userEffect[0].effectiveness;
              });
            }
            else {
              upgradedAbility.userEffect[0].effectiveness += upgradedAbilities.userEffect[0].effectiveness;
              upgradedAbility.userEffect[0].duration += upgradedAbilities.userEffect[0].duration;
              upgradedAbility.userEffect[0].threshold += upgradedAbilities.userEffect[0].threshold;

              if (upgradedAbility.userEffect[1] !== undefined) {
                upgradedAbility.userEffect[1].effectiveness += upgradedAbilities.userEffect[1].effectiveness;
                upgradedAbility.userEffect[1].duration += upgradedAbilities.userEffect[1].duration;
              }
            }
          }
        }

        if ((god.type === GodEnum.Dionysus && upgradedAbilities.requiredLevel === this.utilityService.godAbility3Level)) {
          upgradedAbility.targetEffect.forEach(effect => {
            effect.effectiveness += upgradedAbilities.targetEffect[0].effectiveness;
          });
        }
        else {
          if (upgradedAbilities.targetEffect !== undefined && upgradedAbilities.targetEffect.length > 0) {
            if (upgradedAbility.targetEffect === undefined || upgradedAbility.targetEffect.length === 0) {
              upgradedAbility.targetEffect = upgradedAbilities.targetEffect;
            }
            else {
              upgradedAbility.targetEffect[0].effectiveness += upgradedAbilities.targetEffect[0].effectiveness;
              upgradedAbility.targetEffect[0].duration += upgradedAbilities.targetEffect[0].duration;

              if (upgradedAbility.targetEffect[1] !== undefined) {
                upgradedAbility.targetEffect[1].effectiveness += upgradedAbilities.targetEffect[1].effectiveness;
                upgradedAbility.targetEffect[1].duration += upgradedAbilities.targetEffect[1].duration;
              }
            }
          }
        }
      }
    }
    else if (god.level <= 3000) {
      if (god.level % 100 === 0) {
        var matchingCount = god.permanentStat6GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat6GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain6ObtainCap)
          return;

        god.partyPermanentStatMultiplier.attack += upgradedStats.attack;
        god.partyPermanentStatMultiplier.defense += upgradedStats.defense;
        god.partyPermanentStatMultiplier.maxHp += upgradedStats.maxHp;
        god.partyPermanentStatMultiplier.agility += upgradedStats.agility;
        god.partyPermanentStatMultiplier.luck += upgradedStats.luck;
        god.partyPermanentStatMultiplier.resistance += upgradedStats.resistance;
      }
      else if (god.level % 50 === 0) {
        var matchingCount = god.permanentStat5GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat5GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain5ObtainCap)
          return;
      }

      god.partyPermanentStatGain.xpGain += upgradedStats.xpGain;
    }
    else if (god.level <= 4000) {
      if (god.level % 100 === 0) {
        var matchingCount = god.permanentStat7GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat7GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain7ObtainCap)
          return;

        god.partyPermanentStatMultiplier.attack += upgradedStats.attack;
        god.partyPermanentStatMultiplier.defense += upgradedStats.defense;
        god.partyPermanentStatMultiplier.maxHp += upgradedStats.maxHp;
        god.partyPermanentStatMultiplier.agility += upgradedStats.agility;
        god.partyPermanentStatMultiplier.luck += upgradedStats.luck;
        god.partyPermanentStatMultiplier.resistance += upgradedStats.resistance;
      }
      else if (god.level % 50 === 0) {
        var matchingCount = god.permanentDuoAbilityGainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentDuoAbilityGainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentDuoAbilityObtainCap)
          return;
      }

      god.permanentStatGain.duoPermanentEffectiveness += upgradedStats.duoPermanentEffectiveness;
    }
    else if (god.level > 4000) {
      if (god.level % 50 === 0) {
        var matchingCount = god.permanentStat8GainCount.find(item => item[0] === god.level);
        if (matchingCount === undefined)
          god.permanentStat8GainCount.push([god.level, 1]);
        else
          matchingCount[1] += 1;

        if (matchingCount !== undefined && matchingCount[1] > this.utilityService.godPermanentStatGain8ObtainCap)
          return;
      }

      god.permanentStatGain.attack += upgradedStats.attack;
      god.permanentStatGain.defense += upgradedStats.defense;
      god.permanentStatGain.maxHp += upgradedStats.maxHp;
      god.permanentStatGain.agility += upgradedStats.agility;
      god.permanentStatGain.luck += upgradedStats.luck;
      god.permanentStatGain.resistance += upgradedStats.resistance;

      god.permanentStatGain = this.roundCharacterStats(god.permanentStatGain);
    }

    var statGainText = "";
    if (god.level >= 2000 && god.level <= 4000) {
      if (upgradedStats.maxHp > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.maxHp * 100) + "% Max HP, ";
      if (upgradedStats.attack > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.attack * 100) + "% Attack, ";
      if (upgradedStats.agility > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.agility * 100) + "% Agility, ";
      if (upgradedStats.luck > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.luck * 100) + "% Luck, ";
      if (upgradedStats.defense > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.defense * 100) + "% Defense, ";
      if (upgradedStats.resistance > 0)
        statGainText += this.utilityService.genericRound(upgradedStats.resistance * 100) + "% Resistance, ";
    }
    else {
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
    }

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
    if (upgradedStats.elementIncrease.lightning > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.lightning * 100) + "% Lightning Damage Increase, ";
    if (upgradedStats.elementIncrease.water > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.water * 100) + "% Water Damage Increase, ";
    if (upgradedStats.overdriveGain > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.overdriveGain * 100) + "% Overdrive Gain, ";
    if (upgradedStats.linkEffectiveness > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.linkEffectiveness * 100) + "% Link Effectiveness, ";
    if (upgradedStats.armorPenetration > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.armorPenetration * 100) + "% Armor Penetration, ";
    if (upgradedStats.abilityCooldownReduction > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.abilityCooldownReduction * 100) + "% Ability Cooldown Reduction, ";
    if (upgradedStats.xpGain > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.xpGain * 100) + "% XP Gain, ";

    if (upgradedStats.duoPermanentEffectiveness > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.duoPermanentEffectiveness * 100) + "% Effectiveness, ";

    var upgradedAbilityName = god.abilityList.find(item => item.requiredLevel === upgradedAbilities.requiredLevel)?.name;
    if (upgradedAbilities.effectiveness > 0) {
      if (upgradedAbilityName === "Quicken")
        statGainText += this.utilityService.genericRound(upgradedAbilities.effectiveness * 100) + " Effectiveness, ";
      else
        statGainText += this.utilityService.genericRound(upgradedAbilities.effectiveness * 100) + "% Effectiveness, ";
    }
    if (upgradedAbilities.secondaryEffectiveness > 0) {
      statGainText += this.utilityService.genericRound(upgradedAbilities.secondaryEffectiveness * 100) + "% Additional Ability Effect Effectiveness, ";
    }
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].effectiveness > 0) {
      statGainText += this.utilityService.genericRound(upgradedAbilities.userEffect[0].effectiveness * 100) + "% Buff Effectiveness, ";
    }
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].duration > 0)
      statGainText += this.utilityService.genericRound(upgradedAbilities.userEffect[0].duration) + " Second Buff Duration, ";
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].threshold > 0)
      statGainText += this.utilityService.genericRound((upgradedAbilities.userEffect[0].threshold) * 100) + "% Threshold Increase, ";
    if (upgradedAbilities.targetEffect !== undefined && upgradedAbilities.targetEffect.length > 0 && upgradedAbilities.targetEffect[0].effectiveness > 0)
      statGainText += this.utilityService.genericRound(upgradedAbilities.targetEffect[0].effectiveness * 100) + "% Debuff Effectiveness, ";
    if (upgradedAbilities.targetEffect !== undefined && upgradedAbilities.targetEffect.length > 0 && upgradedAbilities.targetEffect[0].duration > 0)
      statGainText += this.utilityService.genericRound(upgradedAbilities.targetEffect[0].duration) + " Second Debuff Duration, ";


    if (statGainText !== "")
      statGainText = statGainText.substring(0, statGainText.length - 2);

    if (god.level <= 500) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else if (god.level <= 1000) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong> for the entire party.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else if (god.level <= 2000) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var upgradedAbilityName = god.abilityList.find(item => item.requiredLevel === upgradedAbilities.requiredLevel)?.name;

        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong> for the ability " + upgradedAbilityName + ".";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else if (god.level <= 3000) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong> for the entire party.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else if (god.level <= 4000 && god.level % 100 === 0) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong> for the entire party.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else if (god.level <= 4000 && god.level % 50 === 0) {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong> for their Duo ability.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
    }
    else {
      if (this.globalVar.gameLogSettings.get("godLevelUp")) {
        var gameLogEntry = "<strong class='" + this.getGodColorClassText(god.type) + "'>" + god.name + "</strong>" + " permanently gains <strong>" + statGainText + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.LevelUp, gameLogEntry, this.globalVar);
      }
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
    else if (level % 50 === 0) {
      if (this.isGodPermanentStatStillObtainable(god, level))
        increaseType = GodLevelIncreaseEnum.PermanentStats;
      else
        increaseType = GodLevelIncreaseEnum.Stats;
    }
    else if (level % 5 === 0) {
      var ability = this.getWhichAbilityUpgrade(god, level);

      if (ability !== undefined && ability?.upgradeLevel <= 100)
        increaseType = GodLevelIncreaseEnum.AbilityUpgrade;
      else
        increaseType = GodLevelIncreaseEnum.Stats;
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
      var maxPermanentStatLevel = 10000; //permanent stats are no longer a thing at 500 but may change in the future
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

    if (timeToAutoAttack <= 0)
      timeToAutoAttack = .001;

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
    var party = this.globalVar.characters.filter(item => item.isAvailable);

    party.forEach(member => {
      member.battleInfo.autoAttackTimer = 0;
      member.battleInfo.barrierValue = 0;
      member.battleInfo.duoAbilityUsed = false;
      member.battleStats.currentHp = member.battleStats.maxHp;
      member.linkInfo.linkChain = 0;
      member.linkInfo.bonusChain = 0;
      member.linkInfo.cooldown = 0;
      member.linkInfo.remainingLinks = member.linkInfo.totalLinks;

      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.duration <= 0 || this.isBuffUnremovable(item) || item.type === StatusEffectEnum.LordOfTheUnderworld);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Immobilize);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Surge);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageOverTime && item.abilityName !== "Strangle");
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.RepeatDamageAfterDelay);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.PassionateRhythmAutoAttack);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.PassionateRhythm);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Onslaught);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.FriendlyCompetition);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Focus);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageTakenUp);
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DamageDealtDown);

      var shapeshift = member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Shapeshift);
      if (shapeshift !== undefined) {
        var hera = this.globalVar.gods.find(item => item.type === GodEnum.Hera);
        var baseShapeshift = hera?.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);

        if (baseShapeshift !== undefined) {
          baseShapeshift.currentCooldown = baseShapeshift.cooldown;
          shapeshift.effectiveness = 1;//baseShapeshift.userEffect[0].effectiveness;          
          shapeshift.count = 0;
        }
      }

      var dispenserOfDues = member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
      if (dispenserOfDues !== undefined)
        dispenserOfDues.effectiveness = 0;
    });

    this.globalVar.characters.forEach(character => {
      if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        ability.currentCooldown = this.getAbilityCooldown(ability, character, true);
      });
    });

    this.globalVar.gods.forEach(god => {
      var equippedCharacterEnum = CharacterEnum.Adventurer;
      if (party[0].assignedGod1 === god.type || party[0].assignedGod2 === god.type) {
        equippedCharacterEnum = party[0].type;
      }
      if (party[1] !== undefined && (party[1].assignedGod1 === god.type || party[1].assignedGod2 === god.type))
      {
        equippedCharacterEnum = party[1].type;
      }
      var equippedCharacter = this.globalVar.characters.find(item => item.type === equippedCharacterEnum);

      if (god.abilityList !== undefined && god.abilityList.length > 0)
      god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        ability.currentCooldown = this.getAbilityCooldown(ability, equippedCharacter !== undefined ? equippedCharacter : new Character(), true);
      });
    });
  }

  equipItem(selectedEquipmentPiece: Equipment | undefined, character: Character) {
    if (selectedEquipmentPiece === undefined)
      return;

    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Weapon) {
      if (character.equipmentSet.weapon !== undefined)
        this.unequipItem(EquipmentTypeEnum.Weapon, character.type);
      character.equipmentSet.weapon = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Shield) {
      if (character.equipmentSet.shield !== undefined)
        this.unequipItem(EquipmentTypeEnum.Shield, character.type);
      character.equipmentSet.shield = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Armor) {
      if (character.equipmentSet.armor !== undefined)
        this.unequipItem(EquipmentTypeEnum.Armor, character.type);
      character.equipmentSet.armor = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Ring) {
      if (character.equipmentSet.ring !== undefined)
        this.unequipItem(EquipmentTypeEnum.Ring, character.type);
      character.equipmentSet.ring = selectedEquipmentPiece;
    }
    if (selectedEquipmentPiece.equipmentType === EquipmentTypeEnum.Necklace) {
      if (character.equipmentSet.necklace !== undefined)
        this.unequipItem(EquipmentTypeEnum.Necklace, character.type);
      character.equipmentSet.necklace = selectedEquipmentPiece;
    }

    if (selectedEquipmentPiece.equipmentEffects !== undefined && selectedEquipmentPiece.equipmentEffects.length > 0) {
      selectedEquipmentPiece.equipmentEffects.forEach(equipmentEffect => {
        if (equipmentEffect.trigger === EffectTriggerEnum.TriggersEvery &&
          equipmentEffect.triggersEveryCount === 0) {
          if (equipmentEffect.userEffect.length > 0)
            equipmentEffect.triggersEveryCount = equipmentEffect.userEffect[0].triggersEvery;
          else if (equipmentEffect.targetEffect.length > 0)
            equipmentEffect.triggersEveryCount = equipmentEffect.targetEffect[0].triggersEvery;
        }
      });
    }

    this.calculateCharacterBattleStats(character);
  }

  unequipItem(type: EquipmentTypeEnum | undefined, characterType: CharacterEnum) {
    var character = this.globalVar.characters.find(item => item.type === characterType);

    if (character === undefined)
      return;
    if (type === undefined)
      return;

    if (type === EquipmentTypeEnum.Weapon) {
      if (character.equipmentSet.weapon !== undefined && character.equipmentSet.weapon.equipmentEffects.length > 0) {
        character.equipmentSet.weapon.equipmentEffects.forEach(equipmentEffect => {
          if (equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
            var effect = equipmentEffect.userEffect.length > 0 ?
              equipmentEffect.userEffect[0] : equipmentEffect.targetEffect[0];
            character!.battleInfo.statusEffects = character!.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
          }
        });
      }

      character.equipmentSet.weapon = undefined;
    }
    if (type === EquipmentTypeEnum.Shield) {
      if (character.equipmentSet.shield !== undefined && character.equipmentSet.shield.equipmentEffects.length > 0) {
        character.equipmentSet.shield.equipmentEffects.forEach(equipmentEffect => {
          if (equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
            var effect = equipmentEffect.userEffect.length > 0 ?
              equipmentEffect.userEffect[0] : equipmentEffect.targetEffect[0];
            character!.battleInfo.statusEffects = character!.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
          }
        });
      }

      character.equipmentSet.shield = undefined;
    }
    if (type === EquipmentTypeEnum.Armor) {
      if (character.equipmentSet.armor !== undefined && character.equipmentSet.armor.equipmentEffects.length > 0) {
        character.equipmentSet.armor.equipmentEffects.forEach(equipmentEffect => {
          if (equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
            var effect = equipmentEffect.userEffect.length > 0 ?
              equipmentEffect.userEffect[0] : equipmentEffect.targetEffect[0];
            character!.battleInfo.statusEffects = character!.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
          }
        });
      }

      character.equipmentSet.armor = undefined;
    }
    if (type === EquipmentTypeEnum.Ring) {
      if (character.equipmentSet.ring !== undefined && character.equipmentSet.ring.equipmentEffects.length > 0) {
        character.equipmentSet.ring.equipmentEffects.forEach(equipmentEffect => {
          if (equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
            var effect = equipmentEffect.userEffect.length > 0 ?
              equipmentEffect.userEffect[0] : equipmentEffect.targetEffect[0];
            character!.battleInfo.statusEffects = character!.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
          }
        });
      }
      character.equipmentSet.ring = undefined;
    }
    if (type === EquipmentTypeEnum.Necklace) {
      if (character.equipmentSet.necklace !== undefined && character.equipmentSet.necklace.equipmentEffects.length > 0) {
        character.equipmentSet.necklace.equipmentEffects.forEach(equipmentEffect => {
          if (equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive) {
            var effect = equipmentEffect.userEffect.length > 0 ?
              equipmentEffect.userEffect[0] : equipmentEffect.targetEffect[0];
            character!.battleInfo.statusEffects = character!.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
          }
        });
      }

      if (character.equipmentSet.necklace !== undefined && character.equipmentSet.necklace.associatedResource !== undefined) {
        var associatedResource = character.equipmentSet.necklace.associatedResource;

        /*associatedResource.extras.forEach(filledSlot => {
          if () {

          }
        });*/
      }

      character.equipmentSet.necklace = undefined;
    }

    this.calculateCharacterBattleStats(character);
  }

  getSetCount(set: EquipmentSetEnum, equipmentSet: EquipmentSet) {
    var count = 0;

    if (equipmentSet.weapon?.set === set)
      count += 1;
    if (equipmentSet.shield?.set === set)
      count += 1;
    if (equipmentSet.armor?.set === set)
      count += 1;
    if (equipmentSet.ring?.set === set)
      count += 1;
    if (equipmentSet.necklace?.set === set)
      count += 1;

    return count;
  }

  getSetBonusAmount(setType: EquipmentSetEnum, setCount: number) {
    if (setType === EquipmentSetEnum.Athena) {
      if (setCount === 2)
        return .1;
      else if (setCount === 3)
        return .25;
      else if (setCount === 5)
        return .3;
    }
    if (setType === EquipmentSetEnum.Artemis) {
      if (setCount === 2)
        return .2;
      else if (setCount === 3)
        return .2;
      else if (setCount === 5)
        return .5;
    }
    if (setType === EquipmentSetEnum.Hermes) {
      if (setCount === 2)
        return .9;
      else if (setCount === 3)
        return .25;
      else if (setCount === 5)
        return .2;
    }
    if (setType === EquipmentSetEnum.Apollo) {
      if (setCount === 2)
        return 100;
      else if (setCount === 3)
        return .2;
      else if (setCount === 5)
        return .2;
    }
    if (setType === EquipmentSetEnum.Hades) {
      if (setCount === 2)
        return .2;
      else if (setCount === 3)
        return .3;
      else if (setCount === 5)
        return .2;
    }
    if (setType === EquipmentSetEnum.Ares) {
      if (setCount === 2)
        return .05;
      else if (setCount === 3)
        return .2;
    }
    if (setType === EquipmentSetEnum.Nemesis) {
      if (setCount === 2)
        return .1;
      else if (setCount === 3)
        return .25;
    }
    if (setType === EquipmentSetEnum.Dionysus) {
      if (setCount === 2)
        return .1;
      else if (setCount === 3)
        return .2;
      else if (setCount === 5)
        return .25;
    }
    if (setType === EquipmentSetEnum.Zeus) {
      if (setCount === 2)
        return .05;
      else if (setCount === 3)
        return .25;
      else if (setCount === 5)
        return 10;
    }
    if (setType === EquipmentSetEnum.Poseidon) {
      if (setCount === 2)
        return .95;
      else if (setCount === 3)
        return .25;
      else if (setCount === 5)
        return .1;
    }
    if (setType === EquipmentSetEnum.Shadow) {
      if (setCount === 2)
        return .3;
      else if (setCount === 3)
        return .5;
    }
    if (setType === EquipmentSetEnum.Hera) {
      if (setCount === 2)
        return .2;
      else if (setCount === 3)
        return .25;
    }
    if (setType === EquipmentSetEnum.Aphrodite) {
      if (setCount === 2)
        return .95;
      else if (setCount === 3)
        return .3;
    }
    if (setType === EquipmentSetEnum.Zodiac) {
      if (setCount === 2)
        return .2;
      else if (setCount === 3)
        return .5;
    }

    return 0;
  }

  checkForSetBonuses(equipmentSet: EquipmentSet, stats?: CharacterStats) {
    if (stats === undefined)
      stats = new CharacterStats(0, 0, 0, 0, 0, 0);

    var setCounts = equipmentSet.getAllSetCounts();

    if (setCounts.length === 0)
      return;

    setCounts.forEach(setCount => {
      if (setCount[0] === EquipmentSetEnum.Athena) {
        if (setCount[1] >= 2)
          stats!.healingReceived += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.elementIncrease.holy += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Artemis) {
        if (setCount[1] >= 2)
          stats!.criticalMultiplier += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.debuffDuration += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Hermes) {
        if (setCount[1] >= 2)
          stats!.autoAttackCooldownReduction *= this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.elementIncrease.air += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Apollo) {
        if (setCount[1] >= 2)
          stats!.hpRegen += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.buffDuration += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Hades) {
        if (setCount[1] >= 2)
          stats!.criticalMultiplier += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.aoeDamage += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Ares) {
        if (setCount[1] >= 2)
          stats!.tickFrequency += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.debuffDuration += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Nemesis) {
        if (setCount[1] >= 2) {
          stats!.elementResistance.holy += this.getSetBonusAmount(setCount[0], 2);
          stats!.elementResistance.earth += this.getSetBonusAmount(setCount[0], 2);
        }
        if (setCount[1] >= 3)
          stats!.thorns = this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Dionysus) {
        if (setCount[1] >= 2)
          stats!.debuffDuration += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.buffDuration += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Zeus) {
        if (setCount[1] >= 2)
          stats!.armorPenetration += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.elementIncrease.lightning += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Poseidon) {
        if (setCount[1] >= 2)
          stats!.abilityCooldownReduction *= this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.elementIncrease.water += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Shadow) {
        if (setCount[1] >= 2)
          stats!.aoeDamage += this.getSetBonusAmount(setCount[0], 2);
      }

      if (setCount[0] === EquipmentSetEnum.Hera) {
        if (setCount[1] >= 2)
          stats!.criticalMultiplier += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.elementIncrease.air += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Aphrodite) {
        if (setCount[1] >= 2)
          stats!.abilityCooldownReduction *= this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.allyDamageBonus += this.getSetBonusAmount(setCount[0], 3);
      }

      if (setCount[0] === EquipmentSetEnum.Zodiac) {
        if (setCount[1] >= 2)
          stats!.overdriveGain += this.getSetBonusAmount(setCount[0], 2);
        if (setCount[1] >= 3)
          stats!.criticalMultiplier += this.getSetBonusAmount(setCount[0], 3);
      }
    });

    return stats;
  }

  getAchievementsForNextFollower() {
    if (this.globalVar.followerData.numberOfFollowersGainedFromAchievements === 0)
      return 1;
    else
      return 12;
  }

  setAsSubscriber(date: Date) {
    var dionysus = this.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
    var nemesis = this.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
    var ambrosiaCost = 10;

    if (dionysus !== undefined) {
      if (dionysus.isAvailable) {
        var ambrosia = this.globalVar.resources.find(item => item.item === ItemsEnum.Ambrosia);
        if (ambrosia !== undefined)
          ambrosia.amount += ambrosiaCost;
        else
          this.globalVar.resources.push(new ResourceValue(ItemsEnum.Ambrosia, ambrosiaCost));
      }
      else
        dionysus.isAvailable = true;
    }
    if (nemesis !== undefined) {
      if (nemesis.isAvailable) {
        var ambrosia = this.globalVar.resources.find(item => item.item === ItemsEnum.Ambrosia);
        if (ambrosia !== undefined)
          ambrosia.amount += ambrosiaCost;
        else
          this.globalVar.resources.push(new ResourceValue(ItemsEnum.Ambrosia, ambrosiaCost));
      }
      else
        nemesis.isAvailable = true;
    }

    if (this.globalVar.resources.find(item => item.item === ItemsEnum.BlazingSunPendant) === undefined || this.globalVar.resources.find(item => item.item === ItemsEnum.BlazingSunPendant)?.amount === 0)
      this.globalVar.resources.push(new ResourceValue(ItemsEnum.BlazingSunPendant, 1));
    if (this.globalVar.resources.find(item => item.item === ItemsEnum.DarkMoonPendant) === undefined || this.globalVar.resources.find(item => item.item === ItemsEnum.DarkMoonPendant)?.amount === 0)
      this.globalVar.resources.push(new ResourceValue(ItemsEnum.DarkMoonPendant, 1));

    if (!this.globalVar.isSubscriber) {
      this.globalVar.isSubscriber = true;
      this.globalVar.subscribedDate = date;

      var coinBonus = 100000;
      var coins = this.globalVar.resources.find(item => item.item === ItemsEnum.Coin);
      if (coins !== undefined)
        coins.amount += coinBonus;
      else
        this.globalVar.resources.push(new ResourceValue(ItemsEnum.Coin, coinBonus));

      var fragmentCount = 2;
      var timeFragments = this.globalVar.resources.find(item => item.item === ItemsEnum.TimeFragment);
      if (timeFragments !== undefined)
        timeFragments.amount += fragmentCount;
      else
        this.globalVar.resources.push(new ResourceValue(ItemsEnum.TimeFragment, fragmentCount));
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.ColiseumUpdate, "You leave the Coliseum. You finished in round " + this.globalVar.activeBattle.activeTournament.currentRound + (this.globalVar.activeBattle.activeTournament.maxRounds !== -1 ? " of " + this.globalVar.activeBattle.activeTournament.maxRounds : "") + ".", this.globalVar);
      this.handleColiseumLoss(this.globalVar.activeBattle.activeTournament.type, this.globalVar.activeBattle.activeTournament.currentRound);
    }

    this.globalVar.activeBattle.activeTournament = this.setNewTournament(false);
  }

  handleColiseumLoss(type: ColiseumTournamentEnum, losingRound: number) {
    this.resetCooldowns();

    if (type === ColiseumTournamentEnum.WeeklyMelee) {
      if ((losingRound - 1) > this.globalVar.sidequestData.highestWeeklyMeleeRound)
        this.globalVar.sidequestData.highestWeeklyMeleeRound = (losingRound - 1);

      var bonusXpBase = 3250;
      var growthFactor = 1.205;
      var additive = Math.floor(losingRound / 5) * 500000;

      var bonusXp = Math.round((bonusXpBase * (growthFactor ** (losingRound - 1))) + (((losingRound - 1) * 5) * bonusXpBase) + additive);

      var bonusCoinBase = 95;
      var growthFactor = 1.14;

      var bonusCoins = Math.round((bonusCoinBase * (growthFactor ** (losingRound - 1))) + (((losingRound - 1) * 5) * bonusCoinBase));

      if (this.globalVar.gameLogSettings.get("battleXpRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your party gains <strong>" + bonusXp.toLocaleString() + " XP</strong>.", this.globalVar);
      }

      if (this.globalVar.gameLogSettings.get("battleCoinsRewards")) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + bonusCoins.toLocaleString() + " Coins</strong>.", this.globalVar);
      }

      //every 5 rounds, chance of items
      this.handleEternalMeleeBossRewards(losingRound);

      this.giveCharactersBonusExp(bonusXp);
      this.gainResource(new ResourceValue(ItemsEnum.Coin, bonusCoins));
    }
  }

  handleEternalMeleeBossRewards(round: number) {
    if (round > 5) {
      var rng = this.utilityService.getRandomInteger(10, 50);
      var gainedItem = this.getRandomBasicMaterial();

      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
      this.gainResource(new ResourceValue(gainedItem, rng));
    }

    if (round > 10) {
      var rng = this.utilityService.getRandomInteger(30, 70);
      var gainedItem = this.getRandomGem();

      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
      this.gainResource(new ResourceValue(gainedItem, rng));
    }

    if (round > 15) {
      var rng = this.utilityService.getRandomInteger(25, 100);
      var gainedItem = ItemsEnum.MetalScraps;
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
      this.gainResource(new ResourceValue(gainedItem, rng));
    }

    if (round > 20) {
      var rng = this.utilityService.getRandomInteger(25, 150);
      var gainedItem = ItemsEnum.ChthonicFavor;

      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
      this.gainResource(new ResourceValue(gainedItem, rng));
    }

    if (round > 25) {
      var rng = this.utilityService.getRandomInteger(30, 70);
      var gainedItem = this.getRandomUncommonMaterial();

      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
      this.gainResource(new ResourceValue(gainedItem, rng));
    }

    var remainingRounds = round - 25;

    while (remainingRounds > 5) {
      if (round > 20) {
        var rng = 100;
        var gainedItem = this.getRandomGem();

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + rng.toLocaleString() + " " + (rng === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalVar);
        this.gainResource(new ResourceValue(gainedItem, rng));
      }

      remainingRounds -= 5;
    }
  }

  setNewTournament(canRepeat: boolean = false) {
    var repeatColiseumFight = this.globalVar.settings.get("repeatColiseumFight") ?? false;

    if (!repeatColiseumFight || !canRepeat) {      
      return new ColiseumTournament();
    }

    var type = this.dictionaryService.getColiseumInfoFromType(this.globalVar.activeBattle.activeTournament.type);
    
    return this.startColiseumTournament(type);
  }

  startColiseumTournament(tournament: ColiseumTournament) {
    var battle = new Battle();
    battle.activeTournament = tournament;

    if (battle.activeTournament.type === ColiseumTournamentEnum.WeeklyMelee) {
      if (!this.canEnterWeeklyMelee())
        return new ColiseumTournament();
      this.globalVar.sidequestData.weeklyMeleeEntries -= 1;
    }

    this.globalVar.activeBattle = battle;

    return battle.activeTournament;
  }

  canEnterWeeklyMelee() {
    return this.globalVar.sidequestData.weeklyMeleeEntries > 0;
  }

  ResetTrialInfoAfterChangingSubzone() {
    this.globalVar.activeBattle.activeTrial = this.setNewTrial(false);
  }

  setNewTrial(canRepeat: boolean = false) {
    var repeatTrialFight = false;
    if (this.globalVar.activeBattle.activeTrial.type === TrialEnum.TrialOfSkill) {
      repeatTrialFight = this.globalVar.settings.get("repeatTrialFight") ?? false;
    }
    else if (this.globalVar.activeBattle.activeTrial.type === TrialEnum.TrialOfTheStarsNormal ||
      this.globalVar.activeBattle.activeTrial.type === TrialEnum.TrialOfTheStarsHard ||
      this.globalVar.activeBattle.activeTrial.type === TrialEnum.TrialOfTheStarsVeryHard) {
      repeatTrialFight = this.globalVar.settings.get("repeatStarTrialFight") ?? false;
    }

    if (!repeatTrialFight || !canRepeat)
      return new Trial();

    var type = this.dictionaryService.getTrialInfoFromType(this.globalVar.activeBattle.activeTrial.type);

    return this.startTrial(type);
  }

  startTrial(trial: Trial) {
    var battle = new Battle();
    battle.activeTrial = trial;

    this.globalVar.activeBattle = battle;

    return battle.activeTrial;
  }

  handleTrialLoss(type: TrialEnum) {
    this.resetCooldowns();
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

  getRandomBasicMaterial() {
    var items: ItemsEnum[] = [];
    items.push(ItemsEnum.Olive);
    items.push(ItemsEnum.Fennel);
    items.push(ItemsEnum.SoulSpark);
    items.push(ItemsEnum.Asphodelus);
    items.push(ItemsEnum.EssenceOfFire);
    items.push(ItemsEnum.PoisonFang);

    var rng = this.utilityService.getRandomInteger(0, items.length - 1);

    return items[rng];
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

  getRandomUncommonMaterial() {
    var items: ItemsEnum[] = [];
    items.push(ItemsEnum.EssenceOfWater);
    items.push(ItemsEnum.ThickLeather);
    items.push(ItemsEnum.Lousewort);
    items.push(ItemsEnum.Sorrel);
    items.push(ItemsEnum.SharkTeeth);
    items.push(ItemsEnum.Seashell);

    var rng = this.utilityService.getRandomInteger(0, items.length - 1);

    return items[rng];
  }

  getAbilityCooldown(ability: Ability, character: Character, starting: boolean = false) {
    if (ability.name === "Shapeshift")
      return ability.cooldown;

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

  getVictoriesNeededForAllAchievements(type: SubZoneEnum) {
    var victoryCount = 0;
    var relevantAchievements = this.globalVar.achievements.filter(item => item.subzone === type);
    if (relevantAchievements.some(item => item.type === AchievementTypeEnum.HundredVictories))
      victoryCount = 100;
    if (relevantAchievements.some(item => item.type === AchievementTypeEnum.ThousandVictories))
      victoryCount = 500;
    if (relevantAchievements.some(item => item.type === AchievementTypeEnum.TenThousandVictories))
      victoryCount = 2500;
    if (relevantAchievements.some(item => item.type === AchievementTypeEnum.FiveThousandVictories))
      victoryCount = 5000;

    return victoryCount;
  }

  getUncompletedAchievementCountBySubZone(subzoneType: SubZoneEnum) {
    var subzoneRelatedAchievements = this.globalVar.achievements.filter(item => item.subzone === subzoneType);

    return subzoneRelatedAchievements.filter(item => !item.completed).length;
  }

  makeStatusEffectCopy(effect: StatusEffect) {
    var copy = new StatusEffect(effect.type);

    copy.duration = effect.duration;
    //copy.maxDuration = effect.duration;
    copy.effectiveness = effect.effectiveness;
    copy.isPermanent = effect.isPermanent;
    copy.isInstant = effect.isInstant;
    copy.isPositive = effect.isPositive;
    copy.isAoe = effect.isAoe;
    copy.count = effect.count;
    copy.maxCount = effect.maxCount;
    copy.caster = effect.caster;
    copy.effectStacks = effect.effectStacks;
    copy.casterEnum = effect.casterEnum;
    copy.threshold = effect.threshold;
    copy.targetsAllies = effect.targetsAllies;
    copy.addedEffect = effect.addedEffect;
    copy.resolution = effect.resolution;

    copy.abilityName = effect.abilityName;
    copy.tickFrequency = effect.tickFrequency;
    copy.tickTimer = effect.tickTimer;
    copy.dotType = effect.dotType;
    copy.element = effect.element;
    copy.triggersEvery = effect.triggersEvery;
    copy.target = effect.target;

    return copy;
  }

  handleTutorialModal() {
    if (!this.globalVar.settings.get("showTutorialsAsModals"))
      return;

    //make a TutorialBoxComponent that handles skipping tutorials
    //need to figure out how to pass inputs    
    if (this.deviceDetectorService.isMobile())
      return this.dialog.open(TutorialBoxComponent, { width: '80%', height: 'auto' });
    else
      return this.dialog.open(TutorialBoxComponent, { width: '40%', height: 'auto' });
  }
}
