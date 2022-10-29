import { Component, OnInit } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
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

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService, private battleService: BattleService,
    private utilityService: UtilityService, private gameLogService: GameLogService, private storyService: StoryService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.activeBattle !== undefined)
      this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.globalService.globalVar.activeBattle !== undefined)
        this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;
    });
  }

  isAtScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene;
    
    return false;
  }

  displayStorySegment() {
    return this.utilityService.getSanitizedHtml(this.storyService.sceneText);
  }

  getPagePercent() {
    console.log( (this.globalService.globalVar.timers.scenePageTimer / this.globalService.globalVar.timers.scenePageLength) * 100);
    return (this.globalService.globalVar.timers.scenePageTimer / this.globalService.globalVar.timers.scenePageLength) * 100;
  }

  displayGameUpdates() {
    return this.utilityService.getSanitizedHtml(this.gameLogService.gameLog);
  }

  getScrollHeight(scrollToTop: any) {
    var offsetMultiplier = .98;
    if (this.previousLogHeight > 1000)
      offsetMultiplier = .995;
    
    if (Math.ceil(scrollToTop.scrollTop + scrollToTop.offsetHeight) >= (this.previousLogHeight * offsetMultiplier))
    {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollHeight;
    }
    else
    {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollTop;
    }
  }
}
