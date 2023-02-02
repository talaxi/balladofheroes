import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { ColiseumService } from 'src/app/services/battle/coliseum.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-coliseum-view',
  templateUrl: './coliseum-view.component.html',
  styleUrls: ['./coliseum-view.component.css']
})
export class ColiseumViewComponent implements OnInit {
  selectedTournament: ColiseumTournament;

  constructor(private coliseumService: ColiseumService, private globalService: GlobalService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedTournament = this.coliseumService.getColiseumInfoFromType(ColiseumTournamentEnum.HadesTrial);
  }

  getColiseumTournaments() {
    var tournaments: ColiseumTournamentEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ColiseumTournamentEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ColiseumTournamentEnum;
      if (enumValue !== ColiseumTournamentEnum.None)
        tournaments.push(enumValue);
    }

    return tournaments;
  }

  chooseColiseumTournament(tournament: ColiseumTournamentEnum) {
    this.selectedTournament = this.coliseumService.getColiseumInfoFromType(tournament);
  }

  getTournamentName(type?: ColiseumTournamentEnum)
  {
    if (type === undefined)
    {
      return this.coliseumService.getTournamentName(this.selectedTournament.type);
    }
    else
      return this.coliseumService.getTournamentName(type);
  }

  getTournamentDescription() {
    return this.coliseumService.getTournamentDescription(this.selectedTournament.type);
  }

  startTournament() {
    var battle = new Battle();
    battle.activeTournament = this.selectedTournament;

    this.globalService.globalVar.activeBattle = battle;  
    this.dialog.closeAll();  
  }
}
