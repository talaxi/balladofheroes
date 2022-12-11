import { Injectable } from '@angular/core';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  showStory: boolean;
  currentPage = 1;
  pageCount: number;
  sceneText = "";

  constructor(private globalService: GlobalService, private lookupService: LookupService) { }

  checkForNewStoryScene() {    
    if (this.globalService.globalVar.currentStoryId === 0)
    {
      this.showStory = true;
    }
    else if (this.globalService.globalVar.currentStoryId === 1 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AigosthenaBay))
    {
      this.showStory = true;
    }
  }

  handleScene(deltaTime: number) {  
    if (this.globalService.globalVar.currentStoryId === 0)
    {
      this.pageCount = 2;      

      if (this.currentPage === 1)
      {
        this.sceneText = "Today is the Festival of Gods in your small village in Greece. " +
         "Musicians are performing, children are playing, men and women are eating and drinking. <br/><br/> You are racing.<br/><br/>" +
        "Every year, some set out to the Temple of Athena far inland. It is modest compared to the one in Athens, but it is the " +
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
        this.sceneText = "Next Story ID";
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
    }

    return this.showStory;
  }
}
