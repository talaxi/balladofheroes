import { Injectable } from '@angular/core';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';

@Injectable({
  providedIn: 'root'
})
export class ColiseumService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private achievementService: AchievementService,
    private balladService: BalladService) { }

  getColiseumInfoFromType(type: ColiseumTournamentEnum) {
    var tournament = new ColiseumTournament();
    tournament.type = type;
    tournament.currentRound = 1;
    tournament.tournamentTimer = 0;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 180;
      tournament.quickVictoryThreshold = 60;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.UnderworldAccess, ItemTypeEnum.Progression, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    }

    return tournament;
  }

  getTournamentName(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.TournamentOfTheDead)
      return "Tournament of the Dead";
    else if (type === ColiseumTournamentEnum.HadesTrial)
      return "Hades' Trial";
    return "";
  }

  getTournamentDescription(type: ColiseumTournamentEnum) {
    var info = this.getColiseumInfoFromType(type);

    return "Complete " + info.maxRounds + " rounds in " + info.tournamentTimerLength + " seconds.";
  }

  getRequiredDps(type: ColiseumTournamentEnum) {
    var info = this.getColiseumInfoFromType(type);
    var totalHp = 0;

    for (var i = 1; i <= info.maxRounds; i++) {
      var enemies = this.generateBattleOptions(type, i);
      var enemyTeam = enemies[0].enemyList;
      enemyTeam.forEach(enemy => {
        totalHp += enemy.battleStats.maxHp;
      });
    }

    return totalHp / info.tournamentTimerLength;
  }

  handleColiseumLoss() {
    this.globalService.resetCooldowns();
  }

  handleColiseumVictory(type: ColiseumTournamentEnum) {
    this.globalService.resetCooldowns();

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType !== undefined) {
      tournamentType.defeatCount += 1;

      var tournamentInfo = this.getColiseumInfoFromType(type);

      if (tournamentType.defeatCount === 1) {
        tournamentInfo.completionReward.forEach(reward => {
          if (reward.item === ItemsEnum.UnderworldAccess) {
            var gates = this.balladService.findSubzone(SubZoneEnum.ElysiumGatesOfHornAndIvory);
            if (gates !== undefined) {
              gates.isAvailable = true;

              this.achievementService.createDefaultAchievementsForSubzone(gates.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
          }
          else {
            this.lookupService.gainResource(reward);
            this.lookupService.addLootToLog(reward.item, reward.amount);
            if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : this.utilityService.handlePlural(this.lookupService.getItemName(reward.item))) + "</strong>.");
            }
          }
        });
      }

      if (!tournamentType.quickVictoryCompleted && this.globalService.globalVar.activeBattle.activeTournament.tournamentTimer <= tournamentInfo.quickVictoryThreshold) {
        tournamentType.quickVictoryCompleted = true;

        tournamentInfo.quickCompletionReward.forEach(reward => {
          this.lookupService.gainResource(reward);
          this.lookupService.addLootToLog(reward.item, reward.amount);
          if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : this.utilityService.handlePlural(this.lookupService.getItemName(reward.item))) + "</strong>.");
          }
        });
      }
    }
    //then reset
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();
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

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
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
