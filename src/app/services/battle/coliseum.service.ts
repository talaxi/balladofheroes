import { Injectable } from '@angular/core';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';

@Injectable({
  providedIn: 'root'
})
export class ColiseumService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private achievementService: AchievementService,
    private balladService: BalladService, private professionService: ProfessionService) { }

  getColiseumInfoFromType(type: ColiseumTournamentEnum) {
    var tournament = new ColiseumTournament();
    tournament.type = type;
    tournament.currentRound = 1;
    tournament.tournamentTimer = 0;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.UnderworldAccess, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Coin, 2500));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 8000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
    }
    if (type === ColiseumTournamentEnum.ForgottenKings) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.HeroicElixirRecipe, 1));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 15000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
    }

    return tournament;
  }

  getTournamentName(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.TournamentOfTheDead)
      return "Tournament of the Dead";
      if (type === ColiseumTournamentEnum.FlamesOfTartarus)
      return "Flames of Tartarus";
      if (type === ColiseumTournamentEnum.ForgottenKings)
      return "Forgotten Kings and Queens";
      if (type === ColiseumTournamentEnum.MonstersOfTheLethe)
      return "Monsters of the Lethe";
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
        totalHp += enemy.battleStats.maxHp + enemy.battleInfo.barrierValue;
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
      tournamentType.count += 1;

      var tournamentInfo = this.getColiseumInfoFromType(type);

      if (tournamentType.count === 1) {
        this.unlockNextColiseumTournament(type);

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
          else if (reward.item === ItemsEnum.HeroicElixirRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.HeroicElixir);
          }
          else if (reward.item === ItemsEnum.BonusXp) {
            this.globalService.giveCharactersBonusExp(this.globalService.getActivePartyCharacters(true), reward.amount);
          }
          else {
            this.lookupService.gainResource(reward);
            this.lookupService.addLootToLog(reward.item, reward.amount);            
          }

          if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : this.utilityService.handlePlural(this.lookupService.getItemName(reward.item))) + "</strong>.");
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

  unlockNextColiseumTournament(type: ColiseumTournamentEnum) {
    var tournamentType: ColiseumDefeatCount | undefined = undefined;
    
    if (type === ColiseumTournamentEnum.TournamentOfTheDead)
    {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.FlamesOfTartarus);       
    }

    if (type === ColiseumTournamentEnum.FlamesOfTartarus)
    {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.ForgottenKings);      
    }

    if (type === ColiseumTournamentEnum.ForgottenKings)
    {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.MonstersOfTheLethe);       
    }

    if (type === ColiseumTournamentEnum.MonstersOfTheLethe)
    {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HadesTrial);       
    }

    if (tournamentType !== undefined) {
      tournamentType.isAvailable = true;
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

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
            if (duplicateEnemy.abilityList.length > 0)
            {
            //go through user/target effects, look for caster, update name
              duplicateEnemy.abilityList.forEach(ability => {
                if (ability.userEffect.length > 0 && ability.userEffect.filter(item => item.caster !== "").length > 0)
                {
                  ability.userEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                    effect.caster = duplicateEnemy.name + " " + count;
                  });
                }

                if (ability.targetEffect.length > 0 && ability.targetEffect.filter(item => item.caster !== "").length > 0)
                {
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
