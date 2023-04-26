import { Component, OnInit } from '@angular/core';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { LogData } from 'src/app/models/utility/log-data.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';
import { formatDate } from '@angular/common';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

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
  ascendedSortDirection: boolean = true;

  constructor(private globalService: GlobalService, private tutorialService: TutorialService, private lookupService: LookupService,
    private storyService: StoryService, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.currentLogView = this.globalService.globalVar.settings.get("activeLog");
    if (this.currentLogView === undefined)
      this.currentLogView = LogViewEnum.Story;

    var ascending = 1;
    var descending = -1;

    if (!this.ascendedSortDirection) {
      ascending = -1;
      descending = 1;
    }

    this.tutorialData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Tutorials).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? descending : a.dateReceived < b.dateReceived ? ascending : 0;
    });
    this.storyData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Story).sort(function (a, b) {
      return a.relevantEnumValue > b.relevantEnumValue ? descending : a.relevantEnumValue < b.relevantEnumValue ? ascending : 0;
    });
    this.lootData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? descending : a.dateReceived < b.dateReceived ? ascending : 0;
    });
  }

  toggleDisplayStoryView() {
    this.currentLogView = LogViewEnum.Story;
    this.globalService.globalVar.settings.set("activeLog", this.currentLogView);
  }

  toggleDisplayTutorialsView() {
    this.currentLogView = LogViewEnum.Tutorials;
    this.globalService.globalVar.settings.set("activeLog", this.currentLogView);
  }

  toggleDisplayLootView() {
    this.currentLogView = LogViewEnum.Loot;
    this.globalService.globalVar.settings.set("activeLog", this.currentLogView);
  }

  getTutorialData(logData: LogData) {
    return this.tutorialService.getTutorialText(logData.relevantEnumValue, undefined, undefined, false);
  }

  getStoryData(logData: LogData) {
    var pageCount = 1;
    var newStoryText = "new";
    var totalStoryText = "";

    //pagecount < 10 is just a safeguard
    while (pageCount < 10 && newStoryText !== "") {
      newStoryText = this.storyService.getStoryText(logData.relevantEnumValue, pageCount);
      if (pageCount > 1 && newStoryText !== "")
        totalStoryText += "<br/><br/>";
      pageCount += 1;
      totalStoryText += newStoryText;
    }

    return totalStoryText;
  }

  getLootData(logData: LogData) {
    return "You received " + logData.amount + " " + this.dictionaryService.getItemName(logData.relevantEnumValue) + ".";
  }

  formatDate(milliseconds: number) {
    return formatDate(new Date(milliseconds), 'MMM d, y H:mm:ss', 'en');
  }
  
  toggleSort() {
    this.ascendedSortDirection = !this.ascendedSortDirection;

    var ascending = 1;
    var descending = -1;

    if (!this.ascendedSortDirection) {
      ascending = -1;
      descending = 1;
    }

    this.tutorialData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Tutorials).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? descending : a.dateReceived < b.dateReceived ? ascending : 0;
    });
    this.storyData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Story).sort(function (a, b) {
      return a.relevantEnumValue > b.relevantEnumValue ? descending : a.relevantEnumValue < b.relevantEnumValue ? ascending : 0;
    });
    this.lootData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? descending : a.dateReceived < b.dateReceived ? ascending : 0;
    });
  }
}
