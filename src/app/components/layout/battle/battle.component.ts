import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as pluralize from 'pluralize';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
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
  showNewEnemyGroupAnimation = false;
  animationTimer = 0;
  animationTimerCap = .5;
  activeSubzone: SubZone;
  @ViewChild('scrollToTop') gameLogScroll: ElementRef;
  showDevStats: boolean = false;

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService, private battleService: BattleService,
    private utilityService: UtilityService, private gameLogService: GameLogService, private storyService: StoryService,
    private lookupService: LookupService, private balladService: BalladService, private deploymentService: DeploymentService) { }

  ngOnInit(): void {
    this.activeSubzone = this.balladService.getActiveSubZone();          
    this.showDevStats = this.deploymentService.showStats;

    if (this.globalService.globalVar.activeBattle !== undefined)
      this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      this.activeSubzone = this.balladService.getActiveSubZone();

      if (this.globalService.globalVar.activeBattle !== undefined)
        this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

      if (this.battleService.showNewEnemyGroup) {
        this.showNewEnemyGroupAnimation = true;
        this.battleService.showNewEnemyGroup = false;
      }

      if (this.showNewEnemyGroupAnimation) {        
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationTimerCap) {
          this.animationTimer = 0;
          this.showNewEnemyGroupAnimation = false;
        }
      }
    });
  }

  ngAfterViewInit() {
    console.log("Skip to bottom");
    console.log(this.gameLogScroll.nativeElement);
    this.skipToBottom(this.gameLogScroll.nativeElement);
  }

  skipStory() {
    this.globalService.globalVar.timers.scenePageTimer = this.globalService.globalVar.timers.scenePageLength;
  }

  isAtTown() {    
    if (this.activeSubzone !== undefined) {          
      return this.activeSubzone.isTown;
    }
    return false;
  }

  isAtScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene;

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

  displayStorySegment() {
    return this.utilityService.getSanitizedHtml(this.storyService.sceneText);
  }

  displayChestText() {
    var chestRewards = "";

    if (this.globalService.globalVar.activeBattle.chestRewards !== undefined && this.globalService.globalVar.activeBattle.chestRewards.length > 0) {
      this.globalService.globalVar.activeBattle.chestRewards.forEach(item => {
        chestRewards += + item.amount + "<strong class='" + this.lookupService.getItemTextClass(item) + "'>  " + (item.amount === 1 ? this.lookupService.getItemName(item.item) : pluralize(this.lookupService.getItemName(item.item))) + "</strong>, ";
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
      return false;
    }
    else {
      return true;
    }
  }

  skipToBottom(scrollToTop: any) {    
    if (scrollToTop !== undefined)
      scrollToTop.scrollTop = scrollToTop.scrollHeight;
  }

  getExpectedExpPerSec() {
    return this.lookupService.getSubzoneExpPerSec(this.activeSubzone.type);
  }
  
  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
