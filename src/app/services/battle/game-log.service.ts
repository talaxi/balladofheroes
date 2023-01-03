import { Injectable } from '@angular/core';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GameLoopService } from '../game-loop/game-loop.service';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {
  gameLog: string[] = [];
  gameLogMaxLength = 100;

  constructor() {

  }

  updateGameLog(type: GameLogEntryEnum, entry: string) {
    if (type === GameLogEntryEnum.BattleUpdate || type === GameLogEntryEnum.BattleRewards) {
      entry = "<span class='battleUpdateText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.UseBattleItem) {
      entry = "<span class='battleItemText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.ChangeLocation) {
      entry = "<span class='changeLocationText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Tutorial) {
      entry = "<span class='tutorialText'>" + entry + "</span>";
    }

    this.gameLog.push(entry + "<br/>");

    if (this.gameLog.length > this.gameLogMaxLength) {
      for (var i = this.gameLog.length; i > this.gameLogMaxLength; i--) {
        this.gameLog = this.gameLog.filter(item => item != this.gameLog[0]);
      }
    }
  }
}
