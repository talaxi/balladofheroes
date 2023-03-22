import { Injectable, Type } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GameLoopService } from '../game-loop/game-loop.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {
  gameLog: string[] = [];
  gameLogMaxLength = 100;
  notificationOverlayBuffer: [string, GameLogEntryEnum, number][] = [];

  constructor(private deviceDetectorService: DeviceDetectorService) {

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
    if (type === GameLogEntryEnum.Alchemy) {
      entry = "<span class='alchemyText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Overdrive) {
      entry = "<span class='overdriveText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.FollowerPrayer || type === GameLogEntryEnum.FollowerSearch) {
      entry = "<span class='followerText'>" + entry + "</span>";
    }

    this.gameLog.push(entry + "<br/>");

    if (this.gameLog.length > this.gameLogMaxLength) {
      for (var i = this.gameLog.length; i > this.gameLogMaxLength; i--) {
        this.gameLog = this.gameLog.filter(item => item != this.gameLog[0]);
      }
    }

    //add certain items to the overlay
    //TODO: add settings to hide certain items
    if (this.deviceDetectorService.isMobile())
    {
      var tutorialDuration = 30;
      var rewardDuration = 5;

      if (type === GameLogEntryEnum.Tutorial)
      {
        this.notificationOverlayBuffer.push([entry, type, tutorialDuration]);
      }
      if (type === GameLogEntryEnum.BattleRewards)
      {
        this.notificationOverlayBuffer.push([entry, type, rewardDuration]);
      }
    }
  }
}
