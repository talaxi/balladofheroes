import { Component, OnInit } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-achievements-view',
  templateUrl: './achievements-view.component.html',
  styleUrls: ['./achievements-view.component.css']
})
export class AchievementsViewComponent implements OnInit {  
  achievementsBySubZone: Achievement[][] = [];
  cellsPerRow = 3;

  ballads: Ballad[] = [];
  zones: Zone[] = [];
  subzones: SubZone[] = [];
  selectedBallad: BalladEnum = BalladEnum.None;
  selectedZone: ZoneEnum = ZoneEnum.None;
  selectedSubzone: SubZoneEnum = SubZoneEnum.None;
  showUncompleted = false;

  constructor(private globalService: GlobalService, public balladService: BalladService, private lookupService: LookupService,
    private achievementService: AchievementService) { }

  ngOnInit(): void {    
    this.ballads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);  
    this.ballads.unshift(new Ballad());  
    this.zones.push(new Zone());
    this.subzones.push(new SubZone());

    this.globalService.globalVar.achievements.forEach(achievement => {
      var achievementSubsection = this.achievementsBySubZone.find(item => item[0].relatedSubzone === achievement.relatedSubzone)
      if (achievementSubsection !== undefined)
      {
        achievementSubsection.push(achievement);
      }
      else
      {
        var newSubsection = [];
        newSubsection.push(achievement);
        this.achievementsBySubZone.push(newSubsection);
      }
    });    
  }

  getSubZoneBalladName(type: SubZoneEnum) {
    var ballad = this.balladService.findBalladOfSubzone(type);

    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(type, this.globalService.globalVar.achievements) === 0;
    var className = "";

    if (achievementsCompleted)
      className = 'completedSubzoneColor';

    if (ballad !== undefined)
      return "<span class='" + className + "'>" + this.balladService.getBalladName(ballad.type) + "</span>";

    return "";
  }

  getSubZoneName(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);

    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(type, this.globalService.globalVar.achievements) === 0;
    var className = "";

    if (achievementsCompleted)
      className = 'completedSubzoneColor';

    if (subzone !== undefined)
      return "<span class='" + className + "'>" + subzone.name + "</span>";

    return "";
  }

  getSubZoneRows(section: Achievement[]) {
    var rows = 0;

    rows = Math.ceil(section.length / this.cellsPerRow);

    return rows;
  }

  getSubZoneColumnsPerRow(section: Achievement[], rowCount: number) {
    var columns = 0;

    var totalRows = this.getSubZoneRows(section);        
    if (rowCount < totalRows - 1)
    {
      if (totalRows > 1)
        columns = this.cellsPerRow;
      else
        columns = section.length;
    }
    else
    {
      columns = section.length % 3;
      if (columns === 0)
        columns = this.cellsPerRow;
    } 

    return columns;
  }

  getAchievement(section: Achievement[], rowCount: number, columnCount: number) {
    if (section.length > rowCount * this.cellsPerRow + columnCount)
      return section[rowCount * this.cellsPerRow + columnCount];

    return new Achievement(AchievementTypeEnum.None);
  }

  getAchievementStatus(section: Achievement[], rowCount: number, columnCount: number) {   
    var achievement = this.getAchievement(section, rowCount, columnCount);
    
    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(achievement.relatedSubzone, this.globalService.globalVar.achievements) === 0;

    return {
      'achievementUncompleted': !achievement.completed && !achievementsCompleted,
      'achievementCompleted': achievement.completed && !achievementsCompleted,
      'subzoneAchievementsCompleted': achievementsCompleted
    };    
  }

  populateZones() {
    this.zones = [];
    this.subzones = [];

    var selectedBallad = this.balladService.findBallad(parseInt(this.selectedBallad.toString()));
    //TODO: you have to make copies here (?? what does this mean?)
    if (selectedBallad !== undefined)
      this.zones = selectedBallad?.zones;

    this.zones.unshift(new Zone());
    this.subzones.unshift(new SubZone()); 

    if (parseInt(this.selectedBallad.toString()) === BalladEnum.None)
    {
      this.selectedZone = this.zones[0].type;
      this.selectedSubzone = this.subzones[0].type;
    }
  }

  populateSubzones() {
    this.subzones = [];

    var selectedZone = this.balladService.findZone(parseInt(this.selectedZone.toString()));
    //TODO: you have to make copies here
    if (selectedZone !== undefined)
      this.subzones = selectedZone?.subzones;

    this.subzones.unshift(new SubZone()); 

    if (parseInt(this.selectedZone.toString()) === ZoneEnum.None)
    {      
      this.selectedSubzone = this.subzones[0].type;
    }
  }

  showUncompletedToggle() {
    this.filterList();
  }

  filterList() {
    this.achievementsBySubZone = [];
    var mainList = this.globalService.globalVar.achievements;    

    if (this.selectedBallad !== undefined && parseInt(this.selectedBallad.toString()) !== BalladEnum.None)
    {
      mainList = mainList.filter(item => this.balladService.isSubzoneInBallad(item.relatedSubzone, this.selectedBallad));     
    }

    if (this.selectedZone !== undefined && parseInt(this.selectedZone.toString()) !== ZoneEnum.None)
    {
      mainList = mainList.filter(item => this.balladService.isSubzoneInZone(item.relatedSubzone, this.selectedZone));
    }

    if (this.selectedSubzone !== undefined && parseInt(this.selectedSubzone.toString()) !== SubZoneEnum.None)
    {      
      mainList = mainList.filter(item => item.relatedSubzone === parseInt(this.selectedSubzone.toString()));      
    }

    if (this.showUncompleted)
    {      
      mainList = mainList.filter(item => !item.completed);      
    }

    mainList.forEach(achievement => {
      var achievementSubsection = this.achievementsBySubZone.find(item => item[0].relatedSubzone === achievement.relatedSubzone)
      if (achievementSubsection !== undefined)
      {
        achievementSubsection.push(achievement);
      }
      else
      {
        var newSubsection = [];
        newSubsection.push(achievement);
        this.achievementsBySubZone.push(newSubsection);
      }
    });  
  }
}
