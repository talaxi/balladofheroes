import { Component, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ColiseumService } from 'src/app/services/battle/coliseum.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-coliseum-view',
  templateUrl: './coliseum-view.component.html',
  styleUrls: ['./coliseum-view.component.css']
})
export class ColiseumViewComponent implements OnInit {
  selectedTournament: ColiseumTournament;

  constructor(private coliseumService: ColiseumService, private globalService: GlobalService, public dialog: MatDialog,
    private lookupService: LookupService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.selectedTournament = this.coliseumService.getColiseumInfoFromType(ColiseumTournamentEnum.TournamentOfTheDead);
  }

  getColiseumTournaments() {
    var tournaments: ColiseumTournamentEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ColiseumTournamentEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ColiseumTournamentEnum;
      if (enumValue !== ColiseumTournamentEnum.None && enumValue !== ColiseumTournamentEnum.MonstersOfTheLethe) { //TODO: when monsters of the lethe implemented, remove it from this
        if (enumValue === ColiseumTournamentEnum.TournamentOfTheDead)
          tournaments.push(enumValue)
        else {
          var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === enumValue);
          if (tournamentType !== undefined && tournamentType.isAvailable) {
            tournaments.push(enumValue);
          }
        }
      }
    }

    return tournaments;
  }

  chooseColiseumTournament(tournament: ColiseumTournamentEnum) {
    this.selectedTournament = this.coliseumService.getColiseumInfoFromType(tournament);
  }

  getTournamentName(type?: ColiseumTournamentEnum) {
    if (type === undefined) {
      return this.coliseumService.getTournamentName(this.selectedTournament.type);
    }
    else
      return this.coliseumService.getTournamentName(type);
  }

  getTournamentDescription() {
    return this.coliseumService.getTournamentDescription(this.selectedTournament.type);
  }

  getRequiredDpsForSelectedTournament() {
    return this.utilityService.roundTo(this.coliseumService.getRequiredDps(this.selectedTournament.type), 0);
  }

  getFirstTimeCompletionRewards() {
    var reward = "";

    this.selectedTournament.completionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.lookupService.getItemName(item.item) : this.utilityService.handlePlural(this.lookupService.getItemName(item.item)));
      if (item.type === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item));

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount + " " + itemName;
    });

    return reward;
  }

  firstTimeRewardAlreadyObtained() {
    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === this.selectedTournament.type);
    if (tournamentType?.defeatCount !== undefined && tournamentType?.defeatCount >= 1)
      return true;

    return false;
  }

  getQuickCompletionRewards() {
    var reward = "";

    this.selectedTournament.quickCompletionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.lookupService.getItemName(item.item) : this.utilityService.handlePlural(this.lookupService.getItemName(item.item)));
      if (item.type === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item));

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount + " " + itemName;
    });

    return reward;
  }

  quickCompletionRewardAlreadyObtained() {
    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === this.selectedTournament.type);
    if (tournamentType?.quickVictoryCompleted)
      return true;

    return false;
  }

  startTournament() {
    var battle = new Battle();
    battle.activeTournament = this.selectedTournament;

    this.globalService.globalVar.activeBattle = battle;
    this.dialog.closeAll();
  }
}
