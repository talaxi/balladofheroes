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

  isTrialOfResolve() {
    return this.selectedTrial.type === TrialEnum.TrialOfResolve;
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
    
    return boss.name;
  }

  getEnemyTrialBossWithScaledStats() {
    var boss = this.enemyGeneratorService.generateEnemy(this.trialService.getTrialOfSkillBattle());    
    boss = this.trialService.scaleTrialOfSkillBattle(boss);
    return boss;
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
    if (this.selectedTrial.type === TrialEnum.TrialOfSkill) {
      this.selectedTrial.godEnum = this.trialService.getGodEnumFromTrialOfSkillBattle();
    }

    this.globalService.startTrial(this.selectedTrial);
    this.dialog.closeAll();
  }

  getRemainingPreferredGodTime() {
    var date = new Date();
    var endDate = new Date();

    var remainingTime = 0;
    
    if (date.getMinutes() >= 30) {
      endDate.setHours(date.getHours() + 1, 0, 0);      
    }
    else {
    endDate.setHours(date.getHours(), 30, 0);      
    }

    remainingTime = (endDate.getTime() - date.getTime()) / 1000;

    return this.utilityService.convertSecondsToHHMMSS(remainingTime);
  }

  openModal(content: any) {    
    return this.dialog.open(content, { width: '40%', height: 'auto' });      
  }
}
