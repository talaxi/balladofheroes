import { Injectable } from '@angular/core';
import { Trial } from 'src/app/models/battle/trial.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { AchievementService } from '../achievements/achievement.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { DictionaryService } from '../utility/dictionary.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AltarService } from '../altar/altar.service';

@Injectable({
  providedIn: 'root'
})
export class TrialService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private achievementService: AchievementService,
    private professionService: ProfessionService, private subZoneGeneratorService: SubZoneGeneratorService, private dictionaryService: DictionaryService,
    private altarService: AltarService) { }

  generateBattleOptions(trial: Trial) {
    var battleOptions: EnemyTeam[] = [];

    if (trial.type === TrialEnum.TrialOfEndurance) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (trial.type === TrialEnum.TrialOfSkill) {
      var trialOfSkillBattle = this.enemyGeneratorService.generateEnemy(this.getTrialOfSkillBattle());

      trialOfSkillBattle = this.scaleTrialOfSkillBattle(trialOfSkillBattle);

      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(trialOfSkillBattle);
      battleOptions.push(enemyTeam);
    }

    return battleOptions;
  }

  getTrialOfSkillBattle() {
    var availableEnums: BestiaryEnum[] = [];

    var date = new Date();
    /* var dayBreakpoint = 1; //between 4:00 AM and 11:59 AM
 
     if (date.getHours() >= this.utilityService.preferredGodStartTime2 && date.getHours() < this.utilityService.preferredGodEndTime2) //between 12 PM and 7:59 PM
       dayBreakpoint = 2;
     else if (date.getHours() >= this.utilityService.preferredGodStartTime3 || date.getHours() < this.utilityService.preferredGodEndTime3) //between 8 PM and 3:59 AM
       dayBreakpoint = 3;
 
     var seedValue = date.getDay() + date.getMonth() + date.getFullYear() + dayBreakpoint;
 
     var previousSeedValue = 0;
 
     if (dayBreakpoint === 3)
       previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + 2;
     else if (dayBreakpoint === 2)
       previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + 1;
     else if (dayBreakpoint === 1) {
       var yesterday = new Date(date);
       yesterday.setDate(yesterday.getDate() - 1);
 
       previousSeedValue = yesterday.getDay() + yesterday.getMonth() + yesterday.getFullYear() + 3;
     }
 */
    var minuteModifier = "a";
    if (date.getMinutes() >= 30)
      minuteModifier = "b";

    var seedValue = date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + minuteModifier;
    var previousSeedValue = "";
    if (minuteModifier === "b")
      previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + "a";
    else {
      if (date.getHours() - 1 < 0) {
        var yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        previousSeedValue = yesterday.getDay() + yesterday.getMonth() + yesterday.getFullYear() + "23b";
      }
      else {
        previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + (date.getHours() - 1) + "b";
      }
    }

    availableEnums = this.getAvailableBattlesForTrialOfSkill();

    var rng = this.utilityService.getRandomSeededInteger(0, availableEnums.length - 1, previousSeedValue.toString());

    var previousGod = availableEnums[rng];

    availableEnums = this.getAvailableBattlesForTrialOfSkill(previousGod);

    rng = this.utilityService.getRandomSeededInteger(0, availableEnums.length - 1, seedValue.toString());

    return availableEnums[rng];
  }

  getGodEnumFromTrialOfSkillBattle() {
    var bestiaryEnum = this.getTrialOfSkillBattle();
    var god = GodEnum.None;

    if (bestiaryEnum === BestiaryEnum.Athena)
      god = GodEnum.Athena;
    if (bestiaryEnum === BestiaryEnum.Artemis)
      god = GodEnum.Artemis;
    if (bestiaryEnum === BestiaryEnum.Hermes)
      god = GodEnum.Hermes;
    if (bestiaryEnum === BestiaryEnum.Apollo)
      god = GodEnum.Apollo;
    if (bestiaryEnum === BestiaryEnum.Hades)
      god = GodEnum.Hades;
    if (bestiaryEnum === BestiaryEnum.Ares)
      god = GodEnum.Ares;
    if (bestiaryEnum === BestiaryEnum.Nemesis)
      god = GodEnum.Nemesis;
    if (bestiaryEnum === BestiaryEnum.Dionysus)
      god = GodEnum.Dionysus;
    if (bestiaryEnum === BestiaryEnum.Zeus)
      god = GodEnum.Zeus;

    return god;
  }

  getAvailableBattlesForTrialOfSkill(previousBattle: BestiaryEnum = BestiaryEnum.None) {
    var enemyOptions: BestiaryEnum[] = [];

    enemyOptions.push(BestiaryEnum.Athena);
    enemyOptions.push(BestiaryEnum.Artemis);
    enemyOptions.push(BestiaryEnum.Ares);
    enemyOptions.push(BestiaryEnum.Apollo);
    enemyOptions.push(BestiaryEnum.Hermes);
    enemyOptions.push(BestiaryEnum.Nemesis);
    enemyOptions.push(BestiaryEnum.Hades2);
    enemyOptions.push(BestiaryEnum.Dionysus);
    enemyOptions.push(BestiaryEnum.Zeus);

    enemyOptions = enemyOptions.filter(item => item !== previousBattle);

    return enemyOptions;
  }

  scaleTrialOfSkillBattle(enemy: Enemy) {
    //get user's stats, increase this one's by a factor of that and adjust so each god is slightly unique
    var activeParty = this.globalService.getActivePartyCharacters(true);
    var partyTotalStats: number[] = [];
    var totalGodLevels = 0;

    for (var i = 0; i < activeParty.length; i++) {
      partyTotalStats[i] = 0;
      partyTotalStats[i] += activeParty[i].battleStats.maxHp / 5;
      partyTotalStats[i] += activeParty[i].battleStats.attack;
      partyTotalStats[i] += activeParty[i].battleStats.defense;
      partyTotalStats[i] += activeParty[i].battleStats.agility;
      partyTotalStats[i] += activeParty[i].battleStats.luck;
      partyTotalStats[i] += activeParty[i].battleStats.resistance;

      var god1 = this.globalService.globalVar.gods.find(item => item.type === activeParty[i].assignedGod1);
      var god2 = this.globalService.globalVar.gods.find(item => item.type === activeParty[i].assignedGod2);
      var god1Level = god1 === undefined ? 0 : god1.level;
      var god2Level = god2 === undefined ? 0 : god2.level;
      totalGodLevels += god1Level + god2Level;
    }

    var highestStatWeight = .5;
    var highestStats = partyTotalStats[0];
    var lowestStats = partyTotalStats[1] ?? 0;
    if (partyTotalStats[1] !== undefined && partyTotalStats[1] > partyTotalStats[0]) {
      highestStats = partyTotalStats[1];
      lowestStats = partyTotalStats[0];
    }

    if (partyTotalStats[1] === undefined)
      highestStatWeight = 1;
    else if (highestStats > lowestStats * 5) {
      highestStatWeight = .8;
    }

    var individualStatTotal = highestStats * highestStatWeight + lowestStats * (1 - highestStatWeight);
    individualStatTotal /= 6;
    //increase weight of the highest stats if needed
    //divide these totals by 6, maybe *5 or something, and then apply the factor from enemy generator
    //maybe give each god some secondary stats as well
    var godLevelBeforeDamageReduction = 2250;
    var hpFactor = 35;
    var attackFactor = .65;
    var defenseFactor = 7.25;
    var agilityFactor = 2.25;
    var luckFactor = 1.625;
    var resistanceFactor = 2.4;
    var defenseScalingFactor = 1 + ((totalGodLevels - godLevelBeforeDamageReduction) / godLevelBeforeDamageReduction);
    var hpScalingFactor = 1 + ((totalGodLevels - godLevelBeforeDamageReduction) / (godLevelBeforeDamageReduction * 2));

    if (defenseScalingFactor < 1)
      defenseScalingFactor = 1;
    if (hpScalingFactor < 1)
      hpScalingFactor = 1;

    enemy.battleStats.maxHp = Math.round(enemy.battleStats.maxHp * individualStatTotal * 5 * hpFactor * hpScalingFactor);
    enemy.battleStats.attack = Math.round(enemy.battleStats.attack * individualStatTotal * attackFactor);
    enemy.battleStats.defense = Math.round(enemy.battleStats.defense * individualStatTotal * defenseFactor * defenseScalingFactor);
    enemy.battleStats.luck = Math.round(enemy.battleStats.luck * individualStatTotal * luckFactor);
    enemy.battleStats.agility = Math.round(enemy.battleStats.agility * individualStatTotal * agilityFactor);
    enemy.battleStats.resistance = Math.round(enemy.battleStats.resistance * individualStatTotal * resistanceFactor);

    enemy.battleStats.currentHp = enemy.battleStats.maxHp;

    //((.0025*((x-2000)*.055) ** 1.7) + 10)
    //var divineProtectionAmountPer10 = 20000;
    if (totalGodLevels > godLevelBeforeDamageReduction) {
      var divineProtectionAmount = 1 - (((.00425 * ((totalGodLevels - godLevelBeforeDamageReduction) * .08) ** 1.588) + 5) / 100);
      //var divineProtectionAmount = ((.0025*((totalGodLevels - 2000)*.055)**1.7) + 10);
      //console.log(divineProtectionAmount);

      if (divineProtectionAmount < .2)
        divineProtectionAmount = .2;

      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.DivineProtection, -1, divineProtectionAmount, false, true));
    }

    if (enemy.bestiaryType === BestiaryEnum.Athena) {
      enemy.battleStats.hpRegen = enemy.battleStats.maxHp / 1500;
    }
    if (enemy.bestiaryType === BestiaryEnum.Nemesis) {
      var thornsEffect = enemy.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Thorns);
      if (thornsEffect !== undefined)
        thornsEffect.effectiveness = Math.round(enemy.battleStats.attack / 6);

      var noEscape = enemy.abilityList.find(item => item.name === "No Escape");
      if (totalGodLevels > 5000) {
        if (noEscape !== undefined) {
          noEscape.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
        }
      }

      if (totalGodLevels > 10000) {
        if (noEscape !== undefined) {
          noEscape.userEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
        }
      }
    }

    return enemy;
  }

  handleTrialVictory(type: TrialEnum) {
    this.globalService.resetCooldowns();
    var buffHours = 4;
    var todaysDate = new Date();
    if (todaysDate.getDay() === 6 || todaysDate.getDay() === 0)
      buffHours *= 2;

    if (type === TrialEnum.TrialOfSkill) {
      var lootUpEffect = this.globalService.createStatusEffect(StatusEffectEnum.LootRateUp, buffHours * 60 * 60, 1.25, false, true);
      var xpUpEffect = this.globalService.createStatusEffect(StatusEffectEnum.ExperienceGainUp, buffHours * 60 * 60, 1.25, false, true);
      this.globalService.globalVar.globalStatusEffects.push(lootUpEffect);
      this.globalService.globalVar.globalStatusEffects.push(xpUpEffect);

      //gain affinity for the god
      var affinityXpGain = 200;
      var godEnum = this.globalService.globalVar.activeBattle.activeTrial.godEnum;
      var god = this.globalService.globalVar.gods.find(item => item.type === godEnum);
      if (god !== undefined) {
        god.affinityExp += affinityXpGain;

        if (this.globalService.globalVar.gameLogSettings.get("battleXpRewards")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain " + affinityXpGain + " Affinity XP for <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong>.");
        }

        if (god.affinityExp >= god.affinityExpToNextLevel) {
          god.affinityExp -= god.affinityExpToNextLevel;
          god.affinityLevel += 1;
          god.affinityExpToNextLevel = this.utilityService.getFibonacciValue(god.affinityLevel + 3);

          if (this.globalService.globalVar.gameLogSettings.get("godAffinityLevelUp")) {
            var gameLogEntry = "<strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains Affinity Level " + god.affinityLevel + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry);
          }

          if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm) {
            this.lookupService.gainResource(new ResourceValue(this.altarService.getSmallCharmOfGod(god.type), 1));
          }
          else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm) {
            this.lookupService.gainResource(new ResourceValue(this.altarService.getLargeCharmOfGod(god.type), 1));
          }
        }
      }
    }
    else if (type === TrialEnum.TrialOfEndurance) {
      //TODO
    }


    //then reset
    this.globalService.globalVar.activeBattle.activeTrial = this.globalService.setNewTrial(false);
  }
}
