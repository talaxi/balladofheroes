import { Injectable, Type } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AnimationStateEnum } from 'src/app/models/enums/animation-state-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GameLoopService } from '../game-loop/game-loop.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {
  gameLog: string[] = [];
  gameLogMaxLength = 200;
  //event text, entry type, remaining duration, animation state, time the item was added to log
  notificationOverlayBuffer: [string, GameLogEntryEnum, number, AnimationStateEnum, number][] = [];
  disableOverlayBuffer: boolean = false;

  constructor(private deviceDetectorService: DeviceDetectorService) {

  }

  updateGameLog(type: GameLogEntryEnum, entry: string) {
    if (type === GameLogEntryEnum.BattleUpdate || type === GameLogEntryEnum.BattleRewards || type === GameLogEntryEnum.ColiseumUpdate) {
      entry = "<span class='gameText battleUpdateText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.UseBattleItem) {
      entry = "<span class='gameText battleItemText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.ChangeLocation) {
      entry = "<span class='gameText changeLocationText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Tutorial) {
      entry = "<span class='gameText tutorialText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Alchemy) {
      entry = "<span class='gameText alchemyText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Jewelcrafting) {
      entry = "<span class='gameText jewelcraftingText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.Overdrive) {
      entry = "<span class='gameText overdriveText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.SideQuest) {
      entry = "<span class='gameText sidequestText'>" + entry + "</span>";
    }
    if (type === GameLogEntryEnum.FollowerPrayer || type === GameLogEntryEnum.FollowerSearch) {
      entry = "<span class='gameText followerText'>" + entry + "</span>";
    }
    else 
    {
      entry = "<span class='gameText'>" + entry + "</span>";
    }

    this.gameLog.push(entry + "<br/>");

    if (this.gameLog.length > this.gameLogMaxLength) {
      for (var i = this.gameLog.length; i > this.gameLogMaxLength; i--) {        
        this.gameLog = this.gameLog.slice(1);
      }
    }

    //add certain items to the overlay
    var overlayTotalThreshold = 5;
    if (this.deviceDetectorService.isMobile() && !this.disableOverlayBuffer && 
    this.notificationOverlayBuffer.length < overlayTotalThreshold)
    {
      var tutorialDuration = 20;
      var rewardDuration = 2;
      var altarDuration = 4;

      //set time to be within .5s of each other
      if (type === GameLogEntryEnum.Tutorial)
      {
        this.notificationOverlayBuffer.push([entry, type, tutorialDuration, AnimationStateEnum.Initial, Math.ceil(new Date().getTime()/500)]);
      }
      if (type === GameLogEntryEnum.BattleRewards)
      {
        this.notificationOverlayBuffer.push([entry, type, rewardDuration, AnimationStateEnum.Initial, Math.ceil(new Date().getTime()/500)]);
      }
      if (type === GameLogEntryEnum.ColiseumUpdate)
      {
        this.notificationOverlayBuffer.push([entry, type, rewardDuration, AnimationStateEnum.Initial, Math.ceil(new Date().getTime()/500)]);
      }
      if (type === GameLogEntryEnum.Pray)
      {
        this.notificationOverlayBuffer.push([entry, type, altarDuration, AnimationStateEnum.Initial, Math.ceil(new Date().getTime()/500)]);
      }
      if (type === GameLogEntryEnum.SideQuest)
      {
        this.notificationOverlayBuffer.push([entry, type, tutorialDuration, AnimationStateEnum.Initial, Math.ceil(new Date().getTime()/500)]);
      }
    }
  }
}
