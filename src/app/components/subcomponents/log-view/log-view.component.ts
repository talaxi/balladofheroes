import { Component, OnInit } from '@angular/core';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { LogData } from 'src/app/models/utility/log-data.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css']
})
export class LogViewComponent implements OnInit {
  currentLogView: LogViewEnum;
  logViewEnum = LogViewEnum;
  tutorialData: LogData[];
  storyData: LogData[];
  lootData: LogData[];

  constructor(private globalService: GlobalService, private tutorialService: TutorialService, private lookupService: LookupService,
    private storyService: StoryService) { }

  ngOnInit(): void {
    this.currentLogView = LogViewEnum.Story;

    this.tutorialData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Tutorials).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? -1 : a.dateReceived < b.dateReceived ? 1 : 0;
    });
    this.storyData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Story).sort(function (a, b) {
      return a.relevantEnumValue > b.relevantEnumValue ? -1 : a.relevantEnumValue < b.relevantEnumValue ? 1 : 0;
    });
    this.lootData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? -1 : a.dateReceived < b.dateReceived ? 1 : 0;
    });
  }

  toggleDisplayStoryView() {
    this.currentLogView = LogViewEnum.Story;
  }

  toggleDisplayTutorialsView() {
    this.currentLogView = LogViewEnum.Tutorials;
  }

  toggleDisplayLootView() {
    this.currentLogView = LogViewEnum.Loot;
  }

  getTutorialData(logData: LogData) {
    return this.tutorialService.getTutorialText(logData.relevantEnumValue, undefined, undefined, false);
  }

  getStoryData(logData: LogData) {    
    var pageCount = 1;
    var newStoryText = "new";
    var totalStoryText = "";

    //pagecount < 10 is just a safeguard
    while (pageCount < 10 && newStoryText !== "")
    {      
      newStoryText = this.storyService.getStoryText(logData.relevantEnumValue, pageCount);
      if (pageCount > 1 && newStoryText !== "")
        totalStoryText += "<br/><br/>";
      pageCount += 1;
      totalStoryText += newStoryText;
    }

    return totalStoryText;
  }

  getLootData(logData: LogData) {
    return "You received " + logData.amount + " " +  this.lookupService.getItemName(logData.relevantEnumValue) + ".";
  }
}
