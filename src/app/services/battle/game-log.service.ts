import { Injectable } from '@angular/core';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {
  gameLog: string = "";

  constructor() { }

  updateGameLog(type: GameLogEntryEnum, entry: string) {
    if (type === GameLogEntryEnum.BattleUpdate || type === GameLogEntryEnum.BattleRewards)
    {
      entry = "<span class='battleUpdateText'>" + entry + "</span>";
    }

    this.gameLog += entry + "<br/>";
  }
}
