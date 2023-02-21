import { Injectable } from '@angular/core';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';

@Injectable({
  providedIn: 'root'
})
export class ColiseumService {

  constructor(private enemyGeneratorService: EnemyGeneratorService) { }

  getColiseumInfoFromType(type: ColiseumTournamentEnum) {
    var tournament = new ColiseumTournament();
    tournament.type = type;
    tournament.currentRound = 1;
    tournament.tournamentTimer = 0;

    if (type === ColiseumTournamentEnum.HadesTrial) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 120;
    }

    return tournament;
  }

  getTournamentName(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.HadesTrial)
      return "Hades' Trial";
    return "";
  }

  getTournamentDescription(type: ColiseumTournamentEnum) {
    var info = this.getColiseumInfoFromType(type);

    return "Complete " + info.maxRounds + " rounds in " + info.tournamentTimerLength + " seconds.";
  }

  generateBattleOptions(type: ColiseumTournamentEnum, round: number) {
    var battleOptions: EnemyTeam[] = [];

    if (type === ColiseumTournamentEnum.HadesTrial && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Ixion));      
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 5) {
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
