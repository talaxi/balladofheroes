import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import * as pluralize from 'pluralize';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { AnimationStateEnum } from 'src/app/models/enums/animation-state-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { EffectResolutionEnum } from 'src/app/models/enums/effect-resolution-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { StoryService } from 'src/app/services/story/story.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
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
  repeatColiseumFight: boolean = false;

  constructor(public globalService: GlobalService, private gameLoopService: GameLoopService, private battleService: BattleService,
    private utilityService: UtilityService, private gameLogService: GameLogService, public storyService: StoryService,
    private lookupService: LookupService, private balladService: BalladService, private deploymentService: DeploymentService,
    public dialog: MatDialog, private dictionaryService: DictionaryService, private layoutService: LayoutService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.currentStoryId === 0 && this.globalService.globalVar.isBattlePaused)
      this.showSkipButtonMessage = true;

    this.activeSubzone = this.balladService.getActiveSubZone();
    this.showDevStats = this.deploymentService.showStats;
    this.repeatColiseumFight = this.globalService.globalVar.settings.get("repeatColiseumFight") ?? false;

    if (this.globalService.globalVar.activeBattle !== undefined)
      this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (this.isMobile) {
        this.checkForNotificationOverlayMessage(deltaTime);
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

  
  repeatColiseumFightToggle() {
    this.globalService.globalVar.settings.set("repeatColiseumFight", this.repeatColiseumFight);
  }

  skipStory() {
    this.globalService.globalVar.timers.scenePageTimer = this.globalService.globalVar.timers.scenePageLength;
  }

  isAtTown() {
    if (this.activeSubzone !== undefined) {
      return this.balladService.isSubzoneTown(this.activeSubzone.type) && this.lookupService.userNotInTownBattle();
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

  doingColiseumOrTrialFight() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.activeTournament.type !== ColiseumTournamentEnum.None ||
        this.globalService.globalVar.activeBattle.activeTrial.type !== TrialEnum.None;

    return false;
  }
  
  doingEternalMeleeFight() {    
    this.repeatColiseumFight = this.globalService.globalVar.settings.get("repeatColiseumFight") ?? false;
    return this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.activeTournament.type === ColiseumTournamentEnum.WeeklyMelee;        
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
        chestRewards += + item.amount + "<strong class='" + this.lookupService.getItemTextClass(item) + "'>  " + (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item))) + "</strong>, ";
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

  clearGameLog() {
    this.gameLogService.gameLog = [];
  }

  getExpectedExpPerSec() {
    return this.lookupService.getSubzoneExpPerSec(this.activeSubzone.type);
  }

  openGameLogEditor(content: any) {
    var dialog = this.dialog.open(content, { width: '75%', maxHeight: '75%' });
  }

  getTournamentTimeRemaining() {
    var timeRemaining = 0;

    if (this.globalService.globalVar.activeBattle.activeTournament.type !== ColiseumTournamentEnum.None)
      timeRemaining = this.globalService.globalVar.activeBattle.activeTournament.tournamentTimerLength - this.globalService.globalVar.activeBattle.activeTournament.tournamentTimer;
    else if (this.globalService.globalVar.activeBattle.activeTrial.type !== TrialEnum.None)
      timeRemaining = this.globalService.globalVar.activeBattle.activeTrial.timerLength - this.globalService.globalVar.activeBattle.activeTrial.timer;

    var value = this.utilityService.convertSecondsToMMSS(timeRemaining);

    return value;
  }

  atAltarOfAsclepius() {
    return this.activeSubzone.type === SubZoneEnum.CalydonAltarOfAsclepius;
  }

  openZoneNavigation(content: any) {
    this.dialog.open(content, { width: '95%', height: '80%' });
  }

  getActiveSubzoneName() {
    return this.balladService.getSubZoneName(this.activeSubzone.type);
  }

  getSubzoneVictoryCount() {
    var text = "";

    if (this.balladService.isSubzoneTown(this.activeSubzone.type))
      text = "(Town)";
    else if (this.balladService.isSubzoneSideQuest(this.activeSubzone.type)) {
      text = "(Special)";
    }
    else {
      text = "(" + this.activeSubzone.victoryCount.toString();
      if (this.balladService.getVictoriesNeededToProceed(this.activeSubzone.type) > this.activeSubzone.victoryCount)
        text += "/" + this.balladService.getVictoriesNeededToProceed(this.activeSubzone.type);
      text += this.activeSubzone.victoryCount === 1 && this.balladService.getVictoriesNeededToProceed(this.activeSubzone.type) <= this.activeSubzone.victoryCount ? " win)" : " wins)";
    }

    return text;
  }

  newSubzoneUnlocked() {
    var newSubzoneAvailable = false;
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.isAvailable) {
        ballad.zones.forEach(zone => {
          zone.subzones.forEach(subzone => {
            if (subzone.notify)
              newSubzoneAvailable = true;
          });
        });
      }
    });

    return newSubzoneAvailable;
  }

  checkForNotificationOverlayMessage(deltaTime: number) {
    var removeMessage = false;

    if (this.globalService.globalVar.isGamePaused)
      deltaTime = 0;

    this.notificationOverlayMessage = "";

    this.pruneOverlayBuffer();

    if (this.gameLogService.notificationOverlayBuffer === undefined || this.gameLogService.notificationOverlayBuffer.length === 0)
      return;

    var nextMessage = this.gameLogService.notificationOverlayBuffer[0];
    //if you want to do some sort of initial animation, do it now
    if (nextMessage[3] === AnimationStateEnum.Initial)
      nextMessage[3] = AnimationStateEnum.Display;

    this.notificationOverlayMessage = nextMessage[0];
    nextMessage[2] -= deltaTime;

    //first animate
    if (nextMessage[2] <= 0 && nextMessage[3] === AnimationStateEnum.Display) {
      nextMessage[2] = .3; //this is the duration of the fade out hiding animation
      nextMessage[3] = AnimationStateEnum.Hiding;
      nextMessage[0] = nextMessage[0].replace("gameText", "fading gameText");
    }

    if (nextMessage[2] <= 0 && nextMessage[3] === AnimationStateEnum.Hiding) {      
      removeMessage = true;
    }

    var hardStop = 5;
    var extraItemCount = 1;
    //if the next message type matches the current one, include it
    if (nextMessage[1] === GameLogEntryEnum.BattleRewards) {
      while (extraItemCount < hardStop && this.gameLogService.notificationOverlayBuffer.length > extraItemCount &&
        this.gameLogService.notificationOverlayBuffer[extraItemCount][1] === nextMessage[1] && //same type
        this.gameLogService.notificationOverlayBuffer[extraItemCount][4] === nextMessage[4]) { //same time
        var additionalMessage = this.gameLogService.notificationOverlayBuffer[extraItemCount];
        this.notificationOverlayMessage += "<br/>" + additionalMessage[0];
        if (additionalMessage[3] === AnimationStateEnum.Initial)
          additionalMessage[3] = AnimationStateEnum.Display;
        additionalMessage[2] -= deltaTime;

        //first animate
        if (additionalMessage[2] <= 0 && additionalMessage[3] === AnimationStateEnum.Display) {
          additionalMessage[2] = .3; //this is the duration of the fade out hiding animation
          additionalMessage[3] = AnimationStateEnum.Hiding;
          additionalMessage[0] = additionalMessage[0].replace("gameText", "fading gameText");
        }

        if (additionalMessage[2] <= 0 && additionalMessage[3] === AnimationStateEnum.Hiding) {
          this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item !== additionalMessage);          
        }
        else
          extraItemCount += 1;
      }
    }

    if (removeMessage)
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item !== nextMessage);
  }

  skipOverlayMessage() {
    if (this.gameLogService.notificationOverlayBuffer === undefined || this.gameLogService.notificationOverlayBuffer.length <= 0)
      return;

    var nextMessage = this.gameLogService.notificationOverlayBuffer[0];
    nextMessage[2] = 0;

    var hardStop = 5;
    var extraItemCount = 1;
    //if the next message type matches the current one, include it

    if (nextMessage[1] === GameLogEntryEnum.BattleRewards) {
      while (extraItemCount < hardStop && this.gameLogService.notificationOverlayBuffer.length > extraItemCount &&
        this.gameLogService.notificationOverlayBuffer[extraItemCount][1] === nextMessage[1] && //same type
        this.gameLogService.notificationOverlayBuffer[extraItemCount][4] === nextMessage[4]) { //same time
        var additionalMessage = this.gameLogService.notificationOverlayBuffer[extraItemCount];
        additionalMessage[2] = 0;
        extraItemCount += 1;
      }
    }
  }

  pruneOverlayBuffer() {
    if (!this.globalService.globalVar.settings.get("displayOverlayTutorials")) {
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.Tutorial);
    }

    if (!this.globalService.globalVar.settings.get("displayOverlayBattleRewards")) {
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.BattleRewards);
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.SideQuest);
    }

    if (!this.globalService.globalVar.settings.get("displayOverlayPray")) {
      this.gameLogService.notificationOverlayBuffer = this.gameLogService.notificationOverlayBuffer.filter(item => item[1] !== GameLogEntryEnum.Pray);
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
            if (currentSubzone.type !== subzone.type && !this.balladService.isSubzoneTown(subzone.type) && this.balladService.getVictoriesNeededToProceed(subzone.type) - subzone.victoryCount > 0) {
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

  jumpToBestiary() {
    this.layoutService.changeLayout(NavigationEnum.Menu);
    this.menuService.selectedMenuDisplay = MenuEnum.Bestiary;
    this.menuService.setBestiaryPresets(this.balladService.getActiveBallad(), this.balladService.getActiveZone(), this.balladService.getActiveSubZone());
  }

  globalStatusEffectsActive() {
    return this.globalService.globalVar.globalStatusEffects.length > 0;
  }

  preventRightClick() {
    return false;
  }

  getStatusEffectDuration(effect: StatusEffect) {
    if (effect.duration < 0) {
      if (effect.resolution !== undefined) {
        if (effect.resolution === EffectResolutionEnum.AlwaysActiveEquipment)
          return "Always Active - " + this.dictionaryService.getItemName(Number(effect.caster));
          else if (effect.resolution === EffectResolutionEnum.AlwaysActive)
          return "Always Active";
      }
      else
        return "Resolves Upon Effect Condition";
    }

    var duration = Math.round(effect.duration);
    var durationString = "";
    if (duration < 60)
      durationString = duration + " seconds";
    else if (duration < 60 * 60)
      durationString = Math.ceil(duration / 60) + " minutes";
    else
      durationString = Math.ceil(duration / (60 * 60)) + " hours";

    return "Remaining Duration: " + durationString;
  }

  getAllGlobalEffects() {
    var description = "";

    this.globalService.globalVar.globalStatusEffects.forEach(effect => {
      description += this.lookupService.getStatusEffectDescription(effect) + "<br/><br/>" + this.getStatusEffectDuration(effect) + "<hr/>";
    });

    return description;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
