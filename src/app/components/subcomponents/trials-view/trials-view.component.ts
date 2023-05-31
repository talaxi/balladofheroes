import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Trial } from 'src/app/models/battle/trial.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { TrialService } from 'src/app/services/battle/trial.service';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-trials-view',
  templateUrl: './trials-view.component.html',
  styleUrls: ['./trials-view.component.css']
})
export class TrialsViewComponent {
  selectedTrial: Trial;
  repeatColiseumFight: boolean = false;
  tooltipDirection = DirectionEnum.Left;

  constructor(private trialService: TrialService, private globalService: GlobalService, public dialog: MatDialog,
    private lookupService: LookupService, private utilityService: UtilityService, private dictionaryService: DictionaryService,
    private enemyGeneratorService: EnemyGeneratorService) { }

  ngOnInit(): void { 
    var standardTrials = this.getStandardTrials();
    if (standardTrials.length > 0)
      this.selectedTrial = this.dictionaryService.getTrialInfoFromType(standardTrials[0]);
  }

  getStandardTrials() {
    var Trials: TrialEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(TrialEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as TrialEnum;
      if (enumValue !== TrialEnum.None) {
          Trials.push(enumValue)      
      }
    }

    return Trials;
  }

  chooseTrial(trial: TrialEnum) {
    this.selectedTrial = this.dictionaryService.getTrialInfoFromType(trial);
  }

  getTrialName(type?: TrialEnum) {
    if (type === undefined) {
      return this.dictionaryService.getTrialName(this.selectedTrial.type);
    }
    else
      return this.dictionaryService.getTrialName(type);
  }

  getTrialDescription() {
    return "Do battle with a random god of Olympus. If you succeed, you will receive a buff increasing XP and Item Drop Rate for a duration of time.";
  }

  getEnemyTrialBoss() {
    return this.enemyGeneratorService.generateEnemy(this.trialService.getTrialOfSkillBattle());
  }

  getTrialBossName() {
    var boss = this.enemyGeneratorService.generateEnemy(this.trialService.getTrialOfSkillBattle());
    
    return "<span class='" + this.getGodColorClass(boss.name) + "'>" + boss.name + "</span>";
  }

  getGodColorClass(name: string) {
    return {
      'athenaColor': name === "Athena",
      'zeusColor': name === "Zeus",
      'apolloColor': name === "Apollo",
      'aresColor': name === "Ares",
      'poseidonColor': name === "Poseidon",
      'artemisColor': name === "Artemis",
      'hermesColor': name === "Hermes",
      'hadesColor': name === "Hades",
      'dionysusColor': name === "Dionysus",
      'nemesisColor': name === "Nemesis"
    };
  }

  /*getFirstTimeCompletionRewards() {
    var reward = "";

    this.selectedTrial.completionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item)));
      if (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item)?.quality);

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount.toLocaleString() + " " + itemName + "<br/>";
    });

    return reward;
  }

  firstTimeRewardAlreadyObtained(type?: TrialEnum) {
    if (type === undefined)
      type = this.selectedTrial.type;

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType?.count !== undefined && tournamentType?.count >= 1)
      return true;

    return false;
  }

  getQuickCompletionRewards() {
    var reward = "";

    this.selectedTrial.quickCompletionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item)));
      if (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item)?.quality);

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount + " " + itemName + "<br/>";
    });

    return reward;
  }

  quickCompletionRewardAlreadyObtained(type?: TrialEnum) {
    if (type === undefined)
      type = this.selectedTrial.type;

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType?.quickVictoryCompleted)
      return true;

    return false;
  }

  //1 is not started, 2 is cleared, 3 is completed
  getColiseumCompletionLevel(type: TrialEnum) {
    var level = 1;

    if (this.firstTimeRewardAlreadyObtained(type))
      level = 2;

    if (this.quickCompletionRewardAlreadyObtained(type))
      level = 3;

    return level;
  }

  */

  getTrialNameColor(type: TrialEnum) {    
    /*if (this.firstTimeRewardAlreadyObtained(type) && !this.quickCompletionRewardAlreadyObtained(type)) {              
        if (this.selectedTrial !== undefined && this.selectedTrial.type === type)
          return { 'activeBackground clearedSubzoneColor': true };
        else
          return { 'clearedSubzoneColor': true };      
    }
    else if (this.firstTimeRewardAlreadyObtained(type) && this.quickCompletionRewardAlreadyObtained(type)) {      
      if (this.selectedTrial !== undefined && this.selectedTrial.type === type)
        return { 'activeBackground completedSubzoneColor': true };
      else
        return { 'completedSubzoneColor': true };
    }
    else
    {*/
      if (this.selectedTrial !== undefined && this.selectedTrial.type === type)
          return { 'active': true };
    //}

    return {};
  }

  startTrial() {
    this.globalService.startTrial(this.selectedTrial);
    this.dialog.closeAll();
  }

  getRemainingPreferredGodTime() {
    var date = new Date();
    var endDate = new Date();

    var remainingTime = 0;

    if (date.getHours() >= this.utilityService.preferredGodStartTime2 && date.getHours() < this.utilityService.preferredGodEndTime2) {
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime2);
      endDate.setMinutes(0, 0, 0);
    }
    else if (date.getHours() >= this.utilityService.preferredGodStartTime3 || date.getHours() < this.utilityService.preferredGodEndTime3) //between 8 PM and 3:59 AM
    {
      //in day prior
      if (date.getHours() >= this.utilityService.preferredGodStartTime3)
      {
        endDate = new Date(new Date().setDate(new Date().getDate() + 1));
        
      }
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime3);
      endDate.setMinutes(0, 0, 0);
    }
    else {
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime1);
      endDate.setMinutes(0, 0, 0);
    }

    remainingTime = (endDate.getTime() - date.getTime()) / 1000;

    return this.utilityService.convertSecondsToHHMMSS(remainingTime);
  }

  openModal(content: any) {    
    return this.dialog.open(content, { width: '40%', height: 'auto' });      
  }
}
