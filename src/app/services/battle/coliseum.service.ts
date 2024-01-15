import { Injectable } from '@angular/core';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { AchievementService } from '../achievements/achievement.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { PrimaryStats } from 'src/app/models/character/primary-stats.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { DictionaryService } from '../utility/dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class ColiseumService {

  weeklyMeleeReleased = true;

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private achievementService: AchievementService,
    private professionService: ProfessionService, private subZoneGeneratorService: SubZoneGeneratorService, private dictionaryService: DictionaryService) { }

  getTournamentDescription(type: ColiseumTournamentEnum) {
    var info = this.dictionaryService.getColiseumInfoFromType(type);

    if (type === ColiseumTournamentEnum.WeeklyMelee)
      return "Complete as many rounds as you can in " + info.tournamentTimerLength + " seconds. Each round is progressively more difficult. Gain one entry per day.";

    return "Complete " + info.maxRounds + " rounds in " + info.tournamentTimerLength + " seconds.";
  }

  getRequiredDps(type: ColiseumTournamentEnum) {
    var info = this.dictionaryService.getColiseumInfoFromType(type);
    var totalHp = 0;

    for (var i = 1; i <= info.maxRounds; i++) {
      var enemies = this.generateBattleOptions(type, i);
      var enemyTeam = enemies[0].enemyList;
      enemyTeam.forEach(enemy => {
        totalHp += enemy.battleStats.maxHp + enemy.battleInfo.barrierValue;
      });
    }

    return totalHp / info.tournamentTimerLength;
  }

  handleColiseumVictory(type: ColiseumTournamentEnum) {
    this.globalService.resetCooldowns();

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType !== undefined) {
      tournamentType.count += 1;

      var tournamentInfo = this.dictionaryService.getColiseumInfoFromType(type);

      if (tournamentType.count === 1) {
        this.unlockNextColiseumTournament(type);

        tournamentInfo.completionReward.forEach(reward => {
          if (reward.item === ItemsEnum.UnderworldAccess) {
            var gates = this.findSubzone(SubZoneEnum.ElysiumGatesOfHornAndIvory);
            if (gates !== undefined) {
              gates.isAvailable = true;

              this.achievementService.createDefaultAchievementsForSubzone(gates.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
          }
          else if (reward.item === ItemsEnum.HeroicElixirRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.HeroicElixir);
          }
          else if (reward.item === ItemsEnum.BonusXp) {
            this.globalService.giveCharactersBonusExp(reward.amount);
          }
          else if (reward.item === ItemsEnum.Hades) {
            var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
            if (hades !== undefined) {
              hades.isAvailable = true;
              hades.abilityList.forEach(ability => {
                if (hades!.level >= ability.requiredLevel)
                  ability.isAvailable = true;
              });
              this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your strength has impressed Hades, God of the Underworld. Hades will now assist you on your journey.", this.globalService.globalVar);
            }
          }
          else {
            this.lookupService.gainResource(reward);
            this.lookupService.addLootToLog(reward.item, reward.amount, SubZoneEnum.ElysiumColiseum);
          }

          if (this.globalService.globalVar.gameLogSettings.get("battleItemsRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item))) + "</strong>.", this.globalService.globalVar);
          }
        });
      }

      if (!tournamentType.quickVictoryCompleted && this.globalService.globalVar.activeBattle.activeTournament.tournamentTimer <= tournamentInfo.quickVictoryThreshold) {
        tournamentType.quickVictoryCompleted = true;

        tournamentInfo.quickCompletionReward.forEach(reward => {
          this.lookupService.gainResource(reward);
          this.lookupService.addLootToLog(reward.item, reward.amount, SubZoneEnum.ElysiumColiseum);
          if (this.globalService.globalVar.gameLogSettings.get("battleItemsRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item))) + "</strong>.", this.globalService.globalVar);
          }
        });
      }
    }
    //then reset
    this.globalService.globalVar.activeBattle.activeTournament = this.globalService.setNewTournament(true);
  }

  unlockNextColiseumTournament(type: ColiseumTournamentEnum) {
    var tournamentType: ColiseumDefeatCount | undefined = undefined;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.FlamesOfTartarus);
    }

    if (type === ColiseumTournamentEnum.FlamesOfTartarus) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.ForgottenKings);
    }

    if (type === ColiseumTournamentEnum.ForgottenKings) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.RiverLords);
    }

    if (type === ColiseumTournamentEnum.RiverLords) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HadesTrial);
    }

    if (type === ColiseumTournamentEnum.HadesTrial) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HeroesOfYore1);
    }

    if (type === ColiseumTournamentEnum.HeroesOfYore1) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.ElementalPressure);
    }

    if (type === ColiseumTournamentEnum.ElementalPressure) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HeroesOfYore2);
    }

    if (tournamentType !== undefined) {
      tournamentType.isAvailable = true;
    }

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      var weeklyMelee = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.WeeklyMelee);
      if (weeklyMelee !== undefined)
        weeklyMelee.isAvailable = true;
    }
  }

  generateBattleOptions(type: ColiseumTournamentEnum, round: number) {
    var battleOptions: EnemyTeam[] = [];

    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Castor));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Pollux));
      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Tantalus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Ixion));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Sisyphus));
      enemyTeam.isBossFight = true;

      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.ForgottenKings && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lycaon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Melampus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Atreus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Helenus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cassandra));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Minos));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhadamanthus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Aeacus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Acheron2));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cocytus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lethe));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Phlegethon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Styx));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Charon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Megaera));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Alecto));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Tisiphone));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thanatos));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cerberus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hades));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1 && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Perseus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1 && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bellerophon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1 && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Atalanta));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1 && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Oedipus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1 && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Theseus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ElementalPressure && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FlamingCorpse));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FlamingCorpse));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ElementalPressure && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Exploder));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Exploder));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ElementalPressure && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnflamedNightmare));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Exploder));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MalignedSpirit));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ElementalPressure && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PossessedArm));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PossessedArm));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PossessedLeg));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PossessedLeg));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ElementalPressure && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FragmentOfChaos));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2 && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Abderus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2 && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Meleager));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2 && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Jason));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2 && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Daedelus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Icarus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2 && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Heracles));
      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.WeeklyMelee)
      battleOptions.push(this.generateWeeklyMeleeOptions(round));

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

  generateWeeklyMeleeOptions(round: number) {
    var enemyCount = 3;
    if (round % 5 === 4)
      enemyCount = 4;
    else if (round % 5 === 3)
      enemyCount = 3;
    else
      enemyCount = this.utilityService.getRandomInteger(2, 3);

    var isBoss = false;
    if (round % 5 === 0)
      isBoss = true;

    var expectedCharacterStats = new PrimaryStats(3000, 181, 100, 200, 215, 250);
    var defensiveGrowthFactor = 1.24;
    var offensiveGrowthFactor = 1.11;

    expectedCharacterStats.maxHp *= defensiveGrowthFactor ** (((round - 1) % 5) + 1);
    expectedCharacterStats.defense *= defensiveGrowthFactor ** (((round - 1) % 5) + 1);
    expectedCharacterStats.resistance *= defensiveGrowthFactor ** (((round - 1) % 5) + 1);
    expectedCharacterStats.attack *= offensiveGrowthFactor ** (((round - 1) % 5) + 1);
    expectedCharacterStats.agility *= offensiveGrowthFactor ** (((round - 1) % 5) + 1);
    expectedCharacterStats.luck *= offensiveGrowthFactor ** (((round - 1) % 5) + 1);

    if (round > 5 && round <= 10) {
      defensiveGrowthFactor = 1.14;
      offensiveGrowthFactor = 1.10;
      var expectedCharacterStats = new PrimaryStats(27000, 1050, 800, 1000, 900, 1500);

      if (round === 10)
        expectedCharacterStats = new PrimaryStats(13500, 240, 192, 365, 450, 600);

      expectedCharacterStats.maxHp *= defensiveGrowthFactor ** (((round - 1) % 5));
      expectedCharacterStats.defense *= defensiveGrowthFactor ** (((round - 1) % 5));
      expectedCharacterStats.resistance *= defensiveGrowthFactor ** (((round - 1) % 5));
      expectedCharacterStats.attack *= offensiveGrowthFactor ** (((round - 1) % 5));
      expectedCharacterStats.agility *= offensiveGrowthFactor ** (((round - 1) % 5));
      expectedCharacterStats.luck *= offensiveGrowthFactor ** (((round - 1) % 5));
    }
    else if (round > 10) {
      //enemy.battleStats = new CharacterStats(37630, 530, 1670, 500, 750, 1350);
      var expectedCharacterStats = new PrimaryStats(2965, 285, 365, 530, 500, 750);

      var offsetRound = round - 9;
      defensiveGrowthFactor = 1.29;
      offensiveGrowthFactor = 1.16;
      expectedCharacterStats.maxHp *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 14);
      expectedCharacterStats.defense *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 5);
      expectedCharacterStats.resistance *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 4.5);
      expectedCharacterStats.attack *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 1.8);
      expectedCharacterStats.agility *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 3.5);
      expectedCharacterStats.luck *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 3);
    }

    //console.log("Searching for: ");
    //console.log("Is Boss: " + isBoss);
    //console.log("Enemy Count: " + enemyCount);

    var allRelevantEnemyParties: EnemyTeam[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as SubZoneEnum;

      if (!this.findSubzone(enumValue)?.isAvailable || enumValue === SubZoneEnum.NemeaCountryRoadsOne) {
        continue;
      }

      if (round <= 10) {
        if (this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Champion &&
          this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Gorgon && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Underworld) {
          continue;
        }
      }
      else if (round === 15) {
        if (this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Boar && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Argo) {
          continue;
        }
      }
      else if (round === 20) {
        if (this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Argo && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Labors) {
          continue;
        }
      }
      else if (round <= 30) {
        if (this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Olympus && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Labors) {
          continue;
        }
      }
      //eventually add round limiter here when you have more stuff
      else {
        if ((this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Olympus &&
          this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Labyrinth && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Labors)) {
          continue;
        }
      }

      var battleOptions = this.subZoneGeneratorService.generateBattleOptions(enumValue);
      battleOptions.filter(option => (!isBoss && option.enemyList.length === enemyCount && !option.isBossFight && !option.isDoubleBossFight) ||
        (isBoss && (option.isBossFight || option.isDoubleBossFight))).forEach(option => {
          allRelevantEnemyParties.push(option);
        });
    }

    if (isBoss) {
      this.getPatreonBosses(round).forEach(bossTeam => {
        allRelevantEnemyParties.push(bossTeam);
      });
    }

    var rng = this.utilityService.getRandomInteger(0, allRelevantEnemyParties.length - 1);
    var selectedEnemyTeam = allRelevantEnemyParties[rng];

    //reobtain this because boss fights have variable enemy totals
    enemyCount = selectedEnemyTeam.enemyList.length;
    //to account for multiple enemies
    var multipleEnemyModifier = 1;
    if (enemyCount === 2)
      multipleEnemyModifier = 1.25;
    if (enemyCount === 3)
      multipleEnemyModifier = 1.5;
    if (enemyCount === 4)
      multipleEnemyModifier = 1.75;

    if (isBoss) {
      if (round === 5 || round === 10)
        multipleEnemyModifier *= 3;
      else {
        if (enemyCount === 1)
          multipleEnemyModifier *= 1.15;
        if (enemyCount === 2)
          multipleEnemyModifier *= 1.325;
        if (enemyCount === 3)
          multipleEnemyModifier *= 1.5;
        if (enemyCount === 4)
          multipleEnemyModifier *= 1.625;

      }
    }

    expectedCharacterStats.maxHp *= multipleEnemyModifier;
    expectedCharacterStats.attack *= multipleEnemyModifier;
    expectedCharacterStats.defense *= multipleEnemyModifier;
    expectedCharacterStats.agility *= multipleEnemyModifier;
    expectedCharacterStats.luck *= multipleEnemyModifier;
    expectedCharacterStats.resistance *= multipleEnemyModifier;

    this.normalizeEnemyTeamStats(selectedEnemyTeam, expectedCharacterStats);

    return selectedEnemyTeam;
  }

  multiplyCharacterStats(enemy: Enemy, amount: number) {
    enemy.battleStats.maxHp *= amount;
    enemy.battleStats.attack *= amount;
    enemy.battleStats.defense *= amount;
    enemy.battleStats.agility *= amount;
    enemy.battleStats.luck *= amount;
    enemy.battleStats.resistance *= amount;

    enemy.battleStats.currentHp = enemy.battleStats.maxHp;
  }

  normalizeEnemyTeamStats(enemyTeam: EnemyTeam, expectedStats: PrimaryStats) {
    //should look at each enemy on the team and get the discrepancy of their HPs then multiply to keep the same discrepancy
    var totalHp = 0;
    var totalAttack = 0;
    var totalDefense = 0;
    var totalAgility = 0;
    var totalLuck = 0;
    var totalResistance = 0;

    enemyTeam.enemyList.forEach(enemy => {
      totalHp += enemy.battleStats.maxHp;
      totalAttack += enemy.battleStats.attack;
      totalDefense += enemy.battleStats.defense;
      totalAgility += enemy.battleStats.agility;
      totalLuck += enemy.battleStats.luck;
      totalResistance += enemy.battleStats.resistance;
    });

    enemyTeam.enemyList.forEach(enemy => {
      enemy.battleStats.maxHp = Math.round(enemy.battleStats.maxHp * (expectedStats.maxHp / totalHp));
      enemy.battleStats.attack = Math.round(enemy.battleStats.attack * (expectedStats.attack / totalAttack));
      enemy.battleStats.defense = Math.round(enemy.battleStats.defense * (expectedStats.defense / totalDefense));
      enemy.battleStats.agility = Math.round(enemy.battleStats.agility * (expectedStats.agility / totalAgility));
      enemy.battleStats.luck = Math.round(enemy.battleStats.luck * (expectedStats.luck / totalLuck));
      enemy.battleStats.resistance = Math.round(enemy.battleStats.resistance * (expectedStats.resistance / totalResistance));

      if (enemy.bestiaryType === BestiaryEnum.ColchianDragon) {
        enemy.battleStats.maxHp = Math.round(enemy.battleStats.maxHp * .6);
      }

      enemy.battleStats.currentHp = enemy.battleStats.maxHp;
    });
  }

  isTournamentTypeSpecial(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.WeeklyMelee)
      return true;

    return false;
  }

  findSubzone(type: SubZoneEnum) {
    var returnSubzone: SubZone | undefined;
    var subzoneFound = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (!subzoneFound) {
        ballad.zones.forEach(zone => {
          if (!subzoneFound) {
            zone.subzones.forEach(subzone => {
              if (subzone.type === type) {
                returnSubzone = subzone;
                subzoneFound = true;
              }
            });
          }
        });
      }
    });

    return returnSubzone;
  }

  findBalladOfSubzone(type: SubZoneEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnBallad = ballad;
        })
      })
    });

    return returnBallad;
  }

  getPatreonBosses(round: number) {
    var battleOptions: EnemyTeam[] = [];

    //List Begin 
    if (round >= 25) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ColchianDragon));
      battleOptions.push(enemyTeam);
    }
    //End of list

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
}
