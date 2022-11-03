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
        this.sceneText = "Test Page 1";
      }
      else if (this.currentPage === 2)
      {
        this.sceneText = "Test Page 2";
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
      console.log("Go to page " + this.currentPage + " with pageCount of " + this.pageCount);
    }

    if (this.currentPage > this.pageCount)
    {
      console.log("Change ID");
      this.globalService.globalVar.currentStoryId += 1;
      this.currentPage = 1;
      this.showStory = false;
    }

    return this.showStory;
  }
}
