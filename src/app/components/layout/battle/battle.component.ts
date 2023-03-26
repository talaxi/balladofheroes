import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import * as pluralize from 'pluralize';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  currentEnemies: EnemyTeam;
  subscription: any;
  previousLogHeight = 0;
  noTransition = false;
  showNewEnemyGroupAnimation = false;
  animationTimer = 0;
  animationTimerCap = .5;
  noTransitionTimer = 0;
  noTransitionTimerCap = this.animationTimerCap * .2;
  activeSubzone: SubZone;
  @ViewChild('scrollToTop') gameLogScroll: ElementRef;
  showDevStats: boolean = false;
  scrollButtonDelay = 0;
  scrollButtonDelayTotalCount = 5;
  showSkipButtonMessage = false;
  showStoryAnimation = false;
  storyAnimationTimerCap = .5;
  @Input() isMobile = false;
  notificationOverlayMessage = "";

  constructor(public globalService: GlobalService, private gameLoopService: GameLoopService, private battleService: BattleService,
    private utilityService: UtilityService, private gameLogService: GameLogService, public storyService: StoryService,
    private lookupService: LookupService, private balladService: BalladService, private deploymentService: DeploymentService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.currentStoryId === 0 && this.globalService.globalVar.isBattlePaused)
      this.showSkipButtonMessage = true;

    this.activeSubzone = this.balladService.getActiveSubZone();
    this.showDevStats = this.deploymentService.showStats;

    if (this.globalService.globalVar.activeBattle !== undefined)
      this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (this.isMobile) {
        this.checkForNotificationOverlayMessage(deltaTime);

        //handle auto progress here instead of zone navigation because zone navigation may not always be active
        var currentSubzone = this.balladService.getActiveSubZone();
        var autoProgress = this.globalService.globalVar.settings.get("autoProgress");

        if (autoProgress && currentSubzone !== undefined &&
          (currentSubzone.winsNeeded - currentSubzone.victoryCount <= 0 || currentSubzone.isTown)) {
          this.balladService.selectNextSubzone();
        }
      }

      if (this.globalService.globalVar.currentStoryId === 0 && this.globalService.globalVar.isBattlePaused)
        this.showSkipButtonMessage = true;
      else
        this.showSkipButtonMessage = false;

      this.activeSubzone = this.balladService.getActiveSubZone();

      if (this.globalService.globalVar.activeBattle !== undefined) {
        this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;
      }

      if (this.battleService.showNewEnemyGroup) {
        this.showNewEnemyGroupAnimation = true;
        this.noTransition = true;
        this.battleService.showNewEnemyGroup = false;
      }

      if (this.showNewEnemyGroupAnimation) {
        this.animationTimer += deltaTime;
        this.noTransitionTimer += deltaTime;

        if (this.noTransitionTimer >= this.noTransitionTimerCap) {
          this.noTransitionTimer = 0;
          this.noTransition = false;
        }

        if (this.animationTimer >= this.animationTimerCap) {
          this.animationTimer = 0;
          this.showNewEnemyGroupAnimation = false;
        }
      }

      if (this.isAtStoryScene() && this.globalService.globalVar.timers.scenePageTimer < this.storyAnimationTimerCap)
        this.showStoryAnimation = true;
      else
        this.showStoryAnimation = false;
    });
  }

  ngAfterViewInit() {
    if (this.gameLogScroll !== undefined && this.gameLogScroll.nativeElement !== undefined)
      this.skipToBottom(this.gameLogScroll.nativeElement);
  }

  skipStory() {
    this.globalService.globalVar.timers.scenePageTimer = this.globalService.globalVar.timers.scenePageLength;
  }

  isAtTown() {
    if (this.activeSubzone !== undefined) {
      return this.activeSubzone.isTown && this.globalService.globalVar.activeBattle.activeTournament.type === ColiseumTournamentEnum.None;
    }
    return false;
  }

  isAtScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene;

    return false;
  }

  doingColiseumFight() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.activeTournament.type !== ColiseumTournamentEnum.None;

    return false;
  }

  isAtStoryScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Story;

    return false;
  }

  isAtChestScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Chest;

    return false;
  }

  isAtAltarScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Altar;

    return false;
  }

  isAtSideQuestScene() {
    if (this.globalService.globalVar.activeBattle !== undefined) {
      //console.log(this.globalService.globalVar.activeBattle.atScene + " && " + (this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.SideQuest));
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.SideQuest;
    }

    return false;
  }

  displayStorySegment() {
    return this.utilityService.getSanitizedHtml(this.storyService.sceneText);
  }

  displayChestText() {
    var chestRewards = "";

    if (this.globalService.globalVar.activeBattle.chestRewards !== undefined && this.globalService.globalVar.activeBattle.chestRewards.length > 0) {
      this.globalService.globalVar.activeBattle.chestRewards.forEach(item => {
        chestRewards += + item.amount + "<strong class='" + this.lookupService.getItemTextClass(item) + "'>  " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : this.utilityService.handlePlural(this.lookupService.getItemName(item.item))) + "</strong>, ";
      });

      chestRewards = chestRewards.substring(0, chestRewards.length - 2);
    }

    var text = "You found a chest containing " + chestRewards + ".";
    return text;
  }

  getPagePercent() {
    return (this.globalService.globalVar.timers.scenePageTimer / this.globalService.globalVar.timers.scenePageLength) * 100;
  }

  getChestPercent() {
    return (this.globalService.globalVar.timers.chestTimer / this.globalService.globalVar.timers.chestLength) * 100;
  }

  displayGameUpdates() {
    var gameLogEntries = "";
    this.gameLogService.gameLog.forEach(item => {
      gameLogEntries += item;
    });

    return this.utilityService.getSanitizedHtml(gameLogEntries);
  }

  getScrollHeight(scrollToTop: any) {
    var offsetMultiplier = .95;
    if (this.previousLogHeight > 1000)
      offsetMultiplier = .97;

    if (Math.ceil(scrollToTop.scrollTop + scrollToTop.offsetHeight) >= (this.previousLogHeight * offsetMultiplier)) {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollHeight;
    }
    else {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollTop;
    }
  }

  displayScrollToBottom(scrollToTop: any) {
    var offsetMultiplier = .98;
    if (this.previousLogHeight > 1000)
      offsetMultiplier = .995;

    if (Math.ceil(scrollToTop.scrollTop + scrollToTop.offsetHeight) >= (this.previousLogHeight * offsetMultiplier)) {
      this.scrollButtonDelay = 0;
      return false;
    }
    else {
      this.scrollButtonDelay += 1;
      if (this.scrollButtonDelay >= this.scrollButtonDelayTotalCount)
        return true;
      else
        return false;
    }
  }

  skipToBottom(scrollToTop: any) {
    if (scrollToTop !== undefined)
      scrollToTop.scrollTop = scrollToTop.scrollHeight;
  }

  getExpectedExpPerSec() {
    return this.lookupService.getSubzoneExpPerSec(this.activeSubzone.type);
  }

  openGameLogEditor(content: any) {
    var dialog = this.dialog.open(content, { width: '75%', maxHeight: '75%' });
  }

  getTournamentTimeRemaining() {
    var timeRemaining = this.globalService.globalVar.activeBattle.activeTournament.tournamentTimerLength - this.globalService.globalVar.activeBattle.activeTournament.tournamentTimer;

    var value = this.utilityService.convertSecondsToMMSS(timeRemaining);

    return value;
  }

  atAltarOfAsclepius() {
    return this.activeSubzone.type === SubZoneEnum.CalydonAltarOfAsclepius;
  }

  openZoneNavigation(content: any) {
    this.dialog.open(content, { width: '95%', height: '80%' });
  }

  getSubzoneVictoryCount() {
    var text = "";

    if (this.activeSubzone.isTown)
      text = "(Town)";
    else if (this.activeSubzone.isSubzoneSideQuest(this.activeSubzone.type)) {
      text = "(Special)";
    }
    else {
      text = "(" + this.activeSubzone.victoryCount.toString();
      if (this.activeSubzone.winsNeeded > this.activeSubzone.victoryCount)
        text += "/" + this.activeSubzone.winsNeeded;
      text += this.activeSubzone.victoryCount === 1 && this.activeSubzone.winsNeeded <= this.activeSubzone.victoryCount ? " win)" : " wins)";
    }

    return text;
  }

  newSubzoneUnlocked() {
    var newSubzoneAvailable = false;
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.isAvailable) {
        ballad.zones.forEach(zone => {
          zone.subzones.forEach(subzone => {
            if (subzone.showNewNotification)
              newSubzoneAvailable = true;
          });
        });
      }
    });

    return newSubzoneAvailable;
  }

  checkForNotificationOverlayMessage(deltaTime: number) {
    if (this.globalService.globalVar.isGamePaused)
      deltaTime = 0;

    this.notificationOverlayMessage = "";

    this.pruneOverlayBuffer();

    if (this.gameLogService.notificationOverlayBuffer === undefined || this.gameLogService.notificationOverlayBuffer.length === 0)
      return;
    
    var nextMessage = this.gameLogService.notificationOverlayBuffer[0];    

    this.notificationOverlayMessage = nextMessage[0];
    nextMessage[2] -= deltaTime;

    if (nextMessage[2] <= 0)
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item !== nextMessage);

    var hardStop = 5;
    var extraItemCount = 1;
    //if the next message type matches the current one, include it
    while (extraItemCount < hardStop && this.gameLogService.notificationOverlayBuffer.length > extraItemCount &&
      this.gameLogService.notificationOverlayBuffer[extraItemCount][1] === nextMessage[1]) {
      var additionalMessage = this.gameLogService.notificationOverlayBuffer[extraItemCount];
      this.notificationOverlayMessage += "<br/>" + additionalMessage[0];
      additionalMessage[2] -= deltaTime;

      if (additionalMessage[2] <= 0)
        this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item !== additionalMessage);

      extraItemCount += 1;
    }
  }

  skipOverlayMessage() {
    if (this.gameLogService.notificationOverlayBuffer === undefined || this.gameLogService.notificationOverlayBuffer.length < 0)
      return;

    var nextMessage = this.gameLogService.notificationOverlayBuffer[0];
    nextMessage[2] = 0;

    var hardStop = 5;
    var extraItemCount = 1;
    //if the next message type matches the current one, include it
    while (extraItemCount < hardStop && this.gameLogService.notificationOverlayBuffer.length > extraItemCount &&
      this.gameLogService.notificationOverlayBuffer[extraItemCount][1] === nextMessage[1]) {
      var additionalMessage = this.gameLogService.notificationOverlayBuffer[extraItemCount];
      additionalMessage[2] = 0;
      extraItemCount += 1;
    }
  }

  pruneOverlayBuffer() {
    if (!this.globalService.globalVar.settings.get("displayOverlayTutorials"))
    {
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.Tutorial);
    }

    if (!this.globalService.globalVar.settings.get("displayOverlayBattleRewards"))
    {
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.BattleRewards);
    }
  }

  isNextSubzoneButtonAvailable() {
    var currentSubzone = this.balladService.getActiveSubZone();
    var nextSubzoneFound = false;
    var reverseOrderBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable).slice().reverse();
    reverseOrderBallads.forEach(ballad => {
      if (!nextSubzoneFound) {
        var reverseZones = ballad.zones.filter(item => item.isAvailable).slice().reverse();
        reverseZones.forEach(zone => {
          var reverseSubzones = zone.subzones.filter(item => item.isAvailable).slice().reverse();
          reverseSubzones.forEach(subzone => {
            if (currentSubzone.type !== subzone.type && !subzone.isTown && subzone.winsNeeded - subzone.victoryCount > 0) {              
              nextSubzoneFound = true;
            }
          });
        })
      }
    });

    return nextSubzoneFound;
  }

  goToNextSubzone() {
    this.balladService.selectNextSubzone();
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
