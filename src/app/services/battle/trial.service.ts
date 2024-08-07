import { Injectable } from '@angular/core';
import { Trial } from 'src/app/models/battle/trial.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { AchievementService } from '../achievements/achievement.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { DictionaryService } from '../utility/dictionary.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AltarService } from '../altar/altar.service';
import { ZodiacService } from '../global/zodiac.service';
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';
import { TrialDefeatCount } from 'src/app/models/battle/trial-defeat-count.model';
import { DpsCalculatorService } from './dps-calculator.service';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Uniques } from 'src/app/models/resources/uniques.model';

@Injectable({
  providedIn: 'root'
})
export class TrialService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private dictionaryService: DictionaryService,
    private altarService: AltarService, private zodiacService: ZodiacService, private dpsCalculatorService: DpsCalculatorService,
    private achievementService: AchievementService, private balladService: BalladService, private tutorialService: TutorialService) { }

  generateBattleOptions(trial: Trial) {
    var battleOptions: EnemyTeam[] = [];

    if (trial.type === TrialEnum.TrialOfResolve) {
      battleOptions.push(this.getTrialOfResolveBattle());
    }
    if (trial.type === TrialEnum.TrialOfTheStarsNormal) {
      battleOptions.push(this.getTrialOfTheStarsBattle(1));
    }
    if (trial.type === TrialEnum.TrialOfTheStarsHard) {
      battleOptions.push(this.getTrialOfTheStarsBattle(2));
    }
    if (trial.type === TrialEnum.TrialOfTheStarsVeryHard) {
      battleOptions.push(this.getTrialOfTheStarsBattle(3));
    }
    if (trial.type === TrialEnum.TrialOfTheStarsUltimate) {
      battleOptions.push(this.getTrialOfTheStarsBattle(4));
    }
    if (trial.type === TrialEnum.TrialOfSkill) {
      var trialOfSkillBattle = this.enemyGeneratorService.generateEnemy(this.getTrialOfSkillBattle());
      trialOfSkillBattle = this.scaleTrialOfSkillBattle(trialOfSkillBattle);

      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(trialOfSkillBattle);

      if (trialOfSkillBattle.name === "Aphrodite") {
        var eros = this.enemyGeneratorService.generateEnemy(BestiaryEnum.Eros);
        eros = this.scaleTrialOfSkillBattle(eros);
        enemyTeam.isDoubleBossFight = true;
        enemyTeam.isBossFight = false;
        enemyTeam.enemyList.push(eros);
      }

      battleOptions.push(enemyTeam);
    }

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
            if (duplicateEnemy.abilityList.length > 0) {
              //go through user/target effects, look for caster, update name
              duplicateEnemy.abilityList.forEach(ability => {
                if (ability.userEffect.length > 0 && ability.userEffect.filter(item => item.caster !== "").length > 0) {
                  ability.userEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                      effect.caster = duplicateEnemy.name + " " + count;
                  });
                }

                if (ability.targetEffect.length > 0 && ability.targetEffect.filter(item => item.caster !== "").length > 0) {
                  ability.targetEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                      effect.caster = duplicateEnemy.name + " " + count;
                  });
                }
              })
            }
            duplicateEnemy.name += " " + count;

            var charCode = count.charCodeAt(0);
            count = String.fromCharCode(++charCode);
          })
        }
      });
    });

    return battleOptions;
  }

  getTrialOfResolveBattle() {
    var enemyTeam: EnemyTeam = new EnemyTeam();
    var stage = this.globalService.globalVar.sidequestData.trialStage;

    if (stage === 1) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineOwl));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineOwl));
    }
    if (stage === 2) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningRemnant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningRemnant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningRemnant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningRemnant));
    }
    if (stage === 3) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GargantuanCrocodile));
    }
    if (stage === 4) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OlympianAttendants));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OlympianAttendants));
    }
    if (stage === 5) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineRam));
    }
    if (stage === 6) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ErraticMachine));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ErraticMachine));
    }
    if (stage === 7) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AutoVolley));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilverAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilverAutomaton));
    }
    if (stage === 8) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireBreathingHorse));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireBreathingHorse));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireBreathingHorse));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireBreathingHorse));
    }
    if (stage === 9) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldGuardDog));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilverGuardDog));
    }
    if (stage === 10) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivinePanther));
    }
    if (stage === 11) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MountainNymph));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MountainNymph));
    }
    if (stage === 12) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurDuelist));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurDuelist));
    }
    if (stage === 13) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TricksterSpirit));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TricksterSpirit));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TricksterSpirit));
    }
    if (stage === 14) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedGolem));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurEnchanter));
    }
    if (stage === 15) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHorse));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHorse));
    }
    if (stage === 16) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Soldier));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Soldier));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TrackingHound));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TrackingHound));
    }
    if (stage === 17) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodlustedWarrior));
    }
    if (stage === 18) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Scout));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Ranger));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Swordsman));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Healer));
    }
    if (stage === 19) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChampionOfAres));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChampionOfAres));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChampionOfAres));
    }
    if (stage === 20) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineSerpent));
    }
    if (stage === 21) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RampagingCyclops));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RampagingCyclops));
    }
    if (stage === 22) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeastmasterCyclops));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LoyalWolf));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LoyalWolf));
    }
    if (stage === 23) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MassiveCyclops));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.JuvenileCyclops));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.JuvenileCyclops));
    }
    if (stage === 24) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlastingCyclops));
    }
    if (stage === 25) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineTortoise));
    }
    if (stage === 26) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingAgora));
    }
    if (stage === 27) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownSundew));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownSundew));
    }
    if (stage === 28) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VineSnapper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VineSnapper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VineSnapper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VineSnapper));
    }
    if (stage === 29) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BelligerentOak));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OakRoots));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OakRoots));
    }
    if (stage === 30) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHare));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHare));
    }
    if (stage === 31) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrunkenSatyr));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrunkenSatyr));
    }
    if (stage === 32) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Reveler));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Reveler));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Reveler));
    }
    if (stage === 33) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSatyr));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSatyr));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DancingSatyr));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DancingSatyr));
    }
    if (stage === 34) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarstruckSatyr));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarstruckSatyr));
    }
    if (stage === 35) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHawk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHawk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineHawk));
    }
    if (stage === 36) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Boreas));
    }
    if (stage === 37) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Zephyros));
    }
    if (stage === 38) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Euros));
    }
    if (stage === 39) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Notos));
    }
    if (stage === 40) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivinePeacock));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivinePeacock));
    }
    if (stage === 41) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Achelous));
    }
    if (stage === 42) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Nilus));
    }
    if (stage === 43) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Alpheous));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverCrocodile));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverCrocodile));
    }
    if (stage === 44) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Peneus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverFish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverFish));
    }
    if (stage === 45) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineBoar));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineBoar));
    }
    if (stage === 46) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OrangeFloatingFlame));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OrangeFloatingFlame));
    }
    if (stage === 47) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleFloatingFlame));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleFloatingFlame));
    }
    if (stage === 48) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhiteFloatingFlame));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhiteFloatingFlame));
    }
    if (stage === 49) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrimsonFloatingFlame));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrimsonFloatingFlame));
    }
    if (stage === 50) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineVulture));
    }    
    if (stage === 51) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Sphinx));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Sphinx));
    }
    if (stage === 52) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Griffin));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Griffin));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Griffin));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Griffin));
    }
    if (stage === 53) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Manticore));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Manticore));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Manticore));
    }
    if (stage === 54) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Pegasus));
    }
    if (stage === 55) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCicada));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCicada));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCicada));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCicada));
    }
    if (stage === 56) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolyDisciple));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolyDisciple));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolyDisciple));
    }
    if (stage === 57) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ProtectedWarrior));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ProtectedWarrior));
    }
    if (stage === 58) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RadiantSoldier));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RadiantSoldier));
    }
    if (stage === 59) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WarfareScholar));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MilitantAcolyte));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MilitantAcolyte));
    }
    if (stage === 60) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCrane));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineCrane));
    }
    if (stage === 61) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Briareus));      
    }
    if (stage === 62) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gyges));      
    }
    if (stage === 63) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cottus));      
    }
    if (stage === 64) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hecatoncheires));      
    }
    if (stage === 65) {
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineTiger));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineTiger));      
    }
    if (stage === 66) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hecate));      
    }
    if (stage === 67) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mnemosyne));      
    }
    if (stage === 68) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Metis));      
    }
    if (stage === 69) {
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Helios));      
    }
    if (stage === 70) {
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineWolf));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineWolf));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineWolf));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivineWolf));      
    }

    return enemyTeam;
  }

  //1 = normal, 2 = hard, 3 = very hard, 4 = ultimate
  getTrialOfTheStarsBattle(level: number) {
    var enemyTeam: EnemyTeam = new EnemyTeam();
    var zodiac = this.zodiacService.getCurrentZodiac();

    if (zodiac === ZodiacEnum.Libra) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThemisNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThemisHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThemisVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThemisUltimate));
    }
    if (zodiac === ZodiacEnum.Scorpio) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HardenedScorpionNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HardenedScorpionHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HardenedScorpionVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HardenedScorpionUltimate));
    }
    if (zodiac === ZodiacEnum.Sagittarius) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChironNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChironHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChironVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ChironUltimate));
    }
    if (zodiac === ZodiacEnum.Capricorn) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaGoatNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaGoatHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaGoatVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaGoatUltimate));
    }
    if (zodiac === ZodiacEnum.Aquarius) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GanymedeNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GanymedeHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GanymedeVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GanymedeUltimate));
    }
    if (zodiac === ZodiacEnum.Pisces) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RainbowScaledFishNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RainbowScaledFishHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RainbowScaledFishVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RainbowScaledFishUltimate));
    }
    if (zodiac === ZodiacEnum.Aries) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringRamNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringRamHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringRamVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringRamUltimate));
    }
    if (zodiac === ZodiacEnum.Taurus) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatBullNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatBullHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatBullVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatBullUltimate));
    }
    if (zodiac === ZodiacEnum.Gemini) {
      enemyTeam.isDoubleBossFight = true;
      if (level === 1) {
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CastorNormal));
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PolluxNormal));
      }
      if (level === 2) {
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CastorHard));
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PolluxHard));
      }
      if (level === 3) {
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CastorVeryHard));
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PolluxVeryHard));
      }
      if (level === 4) {
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CastorUltimate));
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PolluxUltimate));
      }
    }
    if (zodiac === ZodiacEnum.Cancer) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GargantuanCrabNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GargantuanCrabHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GargantuanCrabVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GargantuanCrabUltimate));
    }
    if (zodiac === ZodiacEnum.Leo) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MajesticLionNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MajesticLionHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MajesticLionVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MajesticLionUltimate));
    }
    if (zodiac === ZodiacEnum.Virgo) {
      enemyTeam.isBossFight = true;
      if (level === 1)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AstraeaNormal));
      if (level === 2)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AstraeaHard));
      if (level === 3)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AstraeaVeryHard));
      if (level === 4)
        enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AstraeaUltimate));
    }

    return enemyTeam;
  }

  getTrialOfSkillBattle() {
    var availableEnums: BestiaryEnum[] = [];

    var date = new Date();
    var minuteModifier = "a";
    if (date.getMinutes() >= 30)
      minuteModifier = "b";

    var seedValue = date.getDate().toString() + date.getMonth().toString() + date.getHours().toString() + minuteModifier + date.getFullYear().toString();
    var previousSeedValue = "";
    if (minuteModifier === "b")
      previousSeedValue = date.getDate().toString() + date.getMonth().toString() + date.getHours().toString() + "a" + date.getFullYear().toString();
    else {
      if (date.getHours() - 1 < 0) {
        var yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        previousSeedValue = yesterday.getDate().toString() + yesterday.getMonth().toString() + "23b" + yesterday.getFullYear().toString();
      }
      else {
        previousSeedValue = date.getDate().toString() + date.getMonth().toString() + (date.getHours() - 1).toString() + "b" + date.getFullYear().toString();
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
    if (bestiaryEnum === BestiaryEnum.Hades2)
      god = GodEnum.Hades;
    if (bestiaryEnum === BestiaryEnum.Ares)
      god = GodEnum.Ares;
    if (bestiaryEnum === BestiaryEnum.Nemesis)
      god = GodEnum.Nemesis;
    if (bestiaryEnum === BestiaryEnum.Dionysus)
      god = GodEnum.Dionysus;
    if (bestiaryEnum === BestiaryEnum.Zeus)
      god = GodEnum.Zeus;
    if (bestiaryEnum === BestiaryEnum.Poseidon)
      god = GodEnum.Poseidon;
    if (bestiaryEnum === BestiaryEnum.Hera)
      god = GodEnum.Hera;
    if (bestiaryEnum === BestiaryEnum.Aphrodite)
      god = GodEnum.Aphrodite;

    return god;
  }

  getAvailableBattlesForTrialOfSkill(previousBattle: BestiaryEnum = BestiaryEnum.None) {
    var enemyOptions: BestiaryEnum[] = [];

    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Athena);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Artemis);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Ares);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Apollo);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Hermes);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Nemesis);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Hades2);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Dionysus);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Zeus);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Poseidon);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hera)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Hera);
    if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Aphrodite)?.isAvailable)
      enemyOptions.push(BestiaryEnum.Aphrodite);

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
    var godLevelBeforeDamageReduction = 2350;
    var hpFactor = 42;
    var attackFactor = .65;
    var defenseFactor = 3.5;
    var agilityFactor = 2.25;
    var luckFactor = 1.625;
    var resistanceFactor = 2.2;
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
    if (enemy.bestiaryType === BestiaryEnum.Artemis) {
      if (totalGodLevels > 1000) {
        enemy.battleStats.criticalMultiplier = .25;
      }
      else if (totalGodLevels > 2000) {
        enemy.battleStats.criticalMultiplier = .35;
      }
      else if (totalGodLevels > 4000) {
        enemy.battleStats.criticalMultiplier = .45;
      }
      else if (totalGodLevels > 6000) {
        enemy.battleStats.criticalMultiplier = .55;
      }
      else if (totalGodLevels > 8000) {
        enemy.battleStats.criticalMultiplier = .65;
      }
      else if (totalGodLevels > 10000) {
        enemy.battleStats.criticalMultiplier = .75;
      }
    }

    return enemy;
  }

  handleTrialVictory(type: TrialEnum) {
    this.globalService.resetCooldowns();
    var buffHours = this.utilityService.trialOfSkillBuffHours;
    var todaysDate = new Date();
    if (todaysDate.getDay() === 6 || todaysDate.getDay() === 0)
      buffHours *= 2;

    if (this.globalService.globalVar.isSubscriber)
      buffHours *= 2;

    if (type === TrialEnum.TrialOfSkill) {
      var lootUpEffect = this.globalService.createStatusEffect(StatusEffectEnum.LootRateUp, buffHours * 60 * 60, 1.25, false, true);
      var xpUpEffect = this.globalService.createStatusEffect(StatusEffectEnum.ExperienceGainUp, buffHours * 60 * 60, 1.25, false, true);

      var existingLootUpEffect = this.globalService.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.LootRateUp);
      if (existingLootUpEffect !== undefined) {
        if (existingLootUpEffect.effectiveness < lootUpEffect.effectiveness)
          existingLootUpEffect.effectiveness = lootUpEffect.effectiveness;

        if (existingLootUpEffect.duration < lootUpEffect.duration)
          existingLootUpEffect.duration = lootUpEffect.duration;
      }
      else {
        this.globalService.globalVar.globalStatusEffects.push(lootUpEffect);
      }

      var existingXpUpEffect = this.globalService.globalVar.globalStatusEffects.find(item => item.type === StatusEffectEnum.ExperienceGainUp);
      if (existingXpUpEffect !== undefined) {
        if (existingXpUpEffect.effectiveness < xpUpEffect.effectiveness)
          existingXpUpEffect.effectiveness = xpUpEffect.effectiveness;

        if (existingXpUpEffect.duration < xpUpEffect.duration)
          existingXpUpEffect.duration = xpUpEffect.duration;
      }
      else {
        this.globalService.globalVar.globalStatusEffects.push(xpUpEffect);
      }

      //gain affinity for the god
      var affinityXpGain = this.utilityService.trialAffinityXpGain;
      var xps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculateXps();
      var dps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculatePartyDps();
      var godLevels = this.getCurrentPartyGodLevels();

      var godEnum = this.globalService.globalVar.activeBattle.activeTrial.godEnum;
      var god = this.globalService.globalVar.gods.find(item => item.type === godEnum);

      if (god !== undefined) {
        var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === type && item.godType === godEnum);
        if (trialType !== undefined) {
          trialType.count += 1;
          if (xps > trialType.highestXps)
            trialType.highestXps = xps;
          if (dps > trialType.highestDps)
            trialType.highestDps = dps;
          if (godLevels > trialType.highestGodLevelTotal)
            trialType.highestGodLevelTotal = godLevels;
          if (this.globalService.globalVar.activeBattle.activeTrial.maxHp > trialType.highestHp)
            trialType.highestHp = this.globalService.globalVar.activeBattle.activeTrial.maxHp;
        }
        else {
          var trialDefeatCount = new TrialDefeatCount(type, 1, godEnum);
          trialDefeatCount.highestXps = xps;
          trialDefeatCount.highestDps = dps;
          trialDefeatCount.highestGodLevelTotal = godLevels;
          trialDefeatCount.highestHp = this.globalService.globalVar.activeBattle.activeTrial.maxHp;
          this.globalService.globalVar.trialDefeatCount.push(trialDefeatCount);
        }

        god.affinityExp += affinityXpGain;

        if (this.globalService.globalVar.gameLogSettings.get("battleXpRewards")) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain " + affinityXpGain + " Affinity XP for <strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong>.", this.globalService.globalVar);
        }

        if (god.affinityExp >= god.affinityExpToNextLevel) {
          god.affinityExp -= god.affinityExpToNextLevel;
          god.affinityLevel += 1;
          god.affinityExpToNextLevel = this.utilityService.getFibonacciValue(god.affinityLevel + 3);

          if (this.globalService.globalVar.gameLogSettings.get("godAffinityLevelUp")) {
            var gameLogEntry = "<strong class='" + this.globalService.getGodColorClassText(god.type) + "'>" + god.name + "</strong> gains Affinity Level " + god.affinityLevel + ".";
            this.gameLogService.updateGameLog(GameLogEntryEnum.Pray, gameLogEntry, this.globalService.globalVar);
          }

          if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm) {
            this.lookupService.gainResource(new ResourceValue(this.altarService.getSmallCharmOfGod(god.type), 1));
          }
          else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm) {
            this.lookupService.gainResource(new ResourceValue(this.altarService.getLargeCharmOfGod(god.type), 1));
          }
        }

        var achievements = this.achievementService.checkForSubzoneAchievement(SubZoneEnum.MountOlympusOlympus, this.globalService.globalVar.achievements);

        if (achievements !== undefined && achievements.length > 0) {
          achievements.forEach(achievement => {
            var achievementBonus = "";
            var rewards = this.achievementService.getAchievementReward(achievement.subzone, achievement.type);
            if (rewards !== undefined && rewards.length > 0) {
              rewards.forEach(item => {
                var amount = item.amount.toString();
                achievementBonus += "<strong>" + amount + " " + (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item))) + "</strong>, ";
              });

              achievementBonus = achievementBonus.substring(0, achievementBonus.length - 2);
            }
            var gameLogUpdate = "Achievement <strong>" + this.lookupService.getAchievementName(achievement) + "</strong> completed!";
            if (achievementBonus !== "")
              gameLogUpdate += " You gain " + achievementBonus + ".";

            if (this.globalService.globalVar.gameLogSettings.get("achievementUnlocked")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, gameLogUpdate, this.globalService.globalVar);
            }
          });
        }
      }
    }
    else if (type === TrialEnum.TrialOfResolve) {
      this.handleTrialOfResolveReward();
      this.globalService.globalVar.sidequestData.trialStage += 1;

      var xps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculateXps();
      var dps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculatePartyDps();
      var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === type);
      if (trialType !== undefined) {
        trialType.count += 1;
        if (xps > trialType.highestXps)
          trialType.highestXps = xps;
        if (dps > trialType.highestDps)
          trialType.highestDps = dps;
      }
      else {
        var trialDefeatCount = new TrialDefeatCount(type, 1);
        trialDefeatCount.highestXps = xps;
        trialDefeatCount.highestDps = dps;
        this.globalService.globalVar.trialDefeatCount.push(trialDefeatCount);
      }
    }
    else {
      var xps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculateXps();
      var dps = this.lookupService.isUIHidden ? 1 : this.dpsCalculatorService.calculatePartyDps();
      var zodiacEnum = this.zodiacService.getCurrentZodiac();
      var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === type && item.zodiacType === zodiacEnum);
      if (trialType !== undefined) {
        trialType.count += 1;
        if (xps > trialType.highestXps)
          trialType.highestXps = xps;
        if (dps > trialType.highestDps)
          trialType.highestDps = dps;
      }
      else {
        var trialDefeatCount = new TrialDefeatCount(type, 1, undefined, zodiacEnum);
        trialDefeatCount.highestXps = xps;
        trialDefeatCount.highestDps = dps;
        this.globalService.globalVar.trialDefeatCount.push(trialDefeatCount);
      }
    }


    //then reset
    this.globalService.globalVar.activeBattle.activeTrial = this.globalService.setNewTrial(true);
  }

  handleTrialOfResolveReward(includeGameLog: boolean = true) {
    var stage = this.globalService.globalVar.sidequestData.trialStage;
    var reward: ResourceValue | undefined = undefined;

    if (stage === 10) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.DarkMoonPendant;

      if (this.globalService.globalVar.isSubscriber) {
        itemCount = stage * 20;
        gainedItem = ItemsEnum.Ambrosia;
      }

      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage === 20) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.BlazingSunPendant;

      if (this.globalService.globalVar.isSubscriber) {
        itemCount = stage * 20;
        gainedItem = ItemsEnum.Ambrosia;
      }

      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage === 30) {
      var aphrodite = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Aphrodite);
      if (aphrodite !== undefined && includeGameLog) {
        aphrodite.isAvailable = true;
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You have gained the powers of Aphrodite, Goddess of Love.", this.globalService.globalVar);
      }
    }
    else if (stage === 40) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.TimeFragment;
      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage === 5) {
      var itemCount = 10;
      var gainedItem = ItemsEnum.Ambrosia;
      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage === 50) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.SwordOfOlympus;

      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);

        this.globalService.globalVar.uniques.push(new Uniques(gainedItem));

        if (!this.globalService.globalVar.logData.some(item => item.type === LogViewEnum.Tutorials && item.relevantEnumValue === TutorialTypeEnum.Uniques)) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Uniques, undefined, undefined, true, this.balladService.getActiveSubZone()?.type), this.globalService.globalVar);
          this.globalService.handleTutorialModal();
        }

        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage === 60) {
      if (includeGameLog) {
        var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
        if (jewelcrafting !== undefined) {
          jewelcrafting.maxLevel += 25;

          var gameLogEntry = "Your Jewelcrafting max level increases by <strong>25</strong> to a total of <strong>" + jewelcrafting.maxLevel + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
        }
      }
    }    
    else if (stage === 70) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.ArmorOfOlympus;

      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);

        this.globalService.globalVar.uniques.push(new Uniques(gainedItem));
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage % 5 === 0) {
      var itemCount = stage * 20;
      var gainedItem = ItemsEnum.Ambrosia;
      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else if (stage <= 5) {
      var itemCount = 1;
      var gainedItem = ItemsEnum.Ambrosia;
      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }
    else {
      var itemCount = (stage - 5) * 5;
      var gainedItem = ItemsEnum.Ambrosia;
      reward = new ResourceValue(gainedItem, itemCount);

      if (includeGameLog) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive <strong>" + itemCount.toLocaleString() + " " + (itemCount === 1 ? this.dictionaryService.getItemName(gainedItem) : this.utilityService.handlePlural(this.dictionaryService.getItemName(gainedItem))) + "</strong>.", this.globalService.globalVar);
        this.globalService.gainResource(new ResourceValue(gainedItem, itemCount));
      }
    }

    return reward;
  }

  getCurrentPartyGodLevels() {
    var activeParty = this.globalService.getActivePartyCharacters(true);
    var totalGodLevels = 0;

    for (var i = 0; i < activeParty.length; i++) {
      var god1 = this.globalService.globalVar.gods.find(item => item.type === activeParty[i].assignedGod1);
      var god2 = this.globalService.globalVar.gods.find(item => item.type === activeParty[i].assignedGod2);
      var god1Level = god1 === undefined ? 0 : god1.level;
      var god2Level = god2 === undefined ? 0 : god2.level;
      totalGodLevels += god1Level + god2Level;
    }

    return totalGodLevels;
  }
}
