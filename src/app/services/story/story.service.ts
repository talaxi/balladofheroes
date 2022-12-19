import { Injectable } from '@angular/core';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  showStory: boolean;
  currentPage = 1;
  pageCount: number;
  sceneText = "";

  constructor(private globalService: GlobalService, private lookupService: LookupService, private balladService: BalladService,
    private utilityService: UtilityService, private tutorialService: TutorialService, private gameLogService: GameLogService) { }

  checkForNewStoryScene() {  
    if (this.globalService.globalVar.currentStoryId === 0)    
      this.showStory = true;    
    else if (this.globalService.globalVar.currentStoryId === 1 && this.balladService.getActiveSubZone().type === SubZoneEnum.AigosthenaHeartOfTheWoods)        
      this.showStory = true;        
    else if (this.globalService.globalVar.currentStoryId === 2 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AigosthenaHeartOfTheWoods))
      this.showStory = true;
  }

  handleScene(deltaTime: number) {      
    if (this.globalService.globalVar.currentStoryId === 0)
    {
      this.utilityService.isBattlePaused = true;
      this.pageCount = 2;      

      if (this.currentPage === 1)
      {
        this.sceneText = "Today is the Festival of Gods in your small village in Greece. " +
         "Musicians are performing, children are playing, men and women are eating and drinking. <br/><br/> <strong>You</strong> are racing.<br/><br/>" +
        "Every year, some set out inland to the Temple of Athena. It is modest compared to the one in Athens, but it is the " +
        "largest most people in your village will ever see. From generation to generation, the story has held that the first person to reach the temple on the day of the Festival will be granted an audience with Athena herself.";
      }
      else if (this.currentPage === 2)
      {
        this.sceneText = "Some believe the stories and race to prove their piety. Others race to prove their skill and honor Athena in their own way. You race simply because every year you have tried, and every year you have failed. You have always yearned for greatness, but come up short. This year was going to be different.";
        //"To reach the Temple of Athena, you first must travel down the coast of Aigosthena and through the woodlands inland. At the far edge of the woodlands, you will find the Temple. The competition is not difficult for its length, but for the treacherous monsters barring the way.";
        
      }
    }
    if (this.globalService.globalVar.currentStoryId === 1)
    {
      this.pageCount = 1;

      if (this.currentPage === 1)
      {
        this.sceneText = "Before the Patriarch";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 2)
    {
      this.pageCount = 1;

      if (this.currentPage === 1)
      {
        this.sceneText = "After the Patriarch";
      }
    }

    this.globalService.globalVar.timers.scenePageTimer += deltaTime;
    if (this.globalService.globalVar.timers.scenePageTimer >= this.globalService.globalVar.timers.scenePageLength)
    {
      this.globalService.globalVar.timers.scenePageTimer = 0;
      this.currentPage += 1;
    }

    if (this.currentPage > this.pageCount)
    {
      this.globalService.globalVar.currentStoryId += 1;
      this.currentPage = 1;
      this.showStory = false;      

      //post story events, if any
      if (this.globalService.globalVar.currentStoryId === 1) 
      {        
        this.utilityService.isBattlePaused = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.AutoAttack));
      }
      if (this.globalService.globalVar.currentStoryId === 3)
      {
        this.balladService.setActiveSubZone(SubZoneEnum.DodonaDelphi);
      }
    }

    return this.showStory;
  }
}
