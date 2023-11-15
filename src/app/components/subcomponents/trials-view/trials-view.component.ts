import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Trial } from 'src/app/models/battle/trial.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { TrialService } from 'src/app/services/battle/trial.service';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-trials-view',
  templateUrl: './trials-view.component.html',
  styleUrls: ['./trials-view.component.css']
})
export class TrialsViewComponent {
  selectedTrial: Trial;
  repeatTrialFight: boolean = false;
  tooltipDirection = DirectionEnum.Left;
  isMobile: boolean = false;
  resolveEnemies: Enemy[] = [];
  starsEnemies: Enemy[] = [];
  trials: TrialEnum[] = [];

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuUp"))) {
      this.toggleSubMenuOptions(-1);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuDown"))) {
      this.toggleSubMenuOptions(1);
    }
    
    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("triggerAction"))) {
      this.startTrial();
    }
  }

  constructor(private trialService: TrialService, private globalService: GlobalService, public dialog: MatDialog,
    private lookupService: LookupService, private utilityService: UtilityService, private dictionaryService: DictionaryService,
    private enemyGeneratorService: EnemyGeneratorService, private deviceDetectorService: DeviceDetectorService,
    private keybindService: KeybindService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.resolveEnemies = this.getTrialEnemies();
    this.repeatTrialFight = this.globalService.globalVar.settings.get("repeatTrialFight") ?? false;
    this.trials = this.getStandardTrials();
    if (this.trials.length > 0)
      this.selectedTrial = this.dictionaryService.getTrialInfoFromType(this.trials[0]);
  }

  getStandardTrials() {
    var Trials: TrialEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(TrialEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as TrialEnum;
      if (enumValue !== TrialEnum.None && enumValue !== TrialEnum.TrialOfResolve) {
        Trials.push(enumValue);
      }
    }

    return Trials;
  }

  getTrialOfTheStarsEnemies() {    
    var battleOptions = this.trialService.generateBattleOptions(this.selectedTrial);    
    if (battleOptions !== undefined && battleOptions.length >= 1)
      return this.trialService.generateBattleOptions(this.selectedTrial)[0].enemyList;

    return [];
  }

  isTrialOfResolve() {
    return this.selectedTrial.type === TrialEnum.TrialOfResolve;
  }
  isTrialOfTheStars() {
    return this.selectedTrial.type === TrialEnum.TrialOfTheStarsNormal || this.selectedTrial.type === TrialEnum.TrialOfTheStarsHard ||
      this.selectedTrial.type === TrialEnum.TrialOfTheStarsVeryHard;
  }
  isTrialOfSkill() {
    return this.selectedTrial.type === TrialEnum.TrialOfSkill;
  }

  chooseTrial(trial: TrialEnum) {
    this.selectedTrial = this.dictionaryService.getTrialInfoFromType(trial);
    if (trial === TrialEnum.TrialOfTheStarsNormal || trial === TrialEnum.TrialOfTheStarsHard || trial === TrialEnum.TrialOfTheStarsVeryHard)
      this.starsEnemies = this.getTrialOfTheStarsEnemies();
  }

  getTrialName(type?: TrialEnum) {
    if (type === undefined) {
      return this.dictionaryService.getTrialName(this.selectedTrial.type);
    }
    else
      return this.dictionaryService.getTrialName(type);
  }

  getTrialDescription() {
    return "Do battle with a random god of Olympus. If you succeed, you will receive a buff increasing XP and Item Drop Rate for a duration of time. Gods may also drop Nectar and their respective Ring and Armor. You will not be able to change classes or gods during the trial.";
  }

  getTrialOfResolveDescription() {
    return "Work your way through all stages of the Trial of Resolve to obtain Ambrosia, coins, and more!";
  }

  getTrialOfTheStarsDescription() {
    return "Challenge the patron of the current Zodiac sign and gain special rewards!";
  }

  getTrialOfResolveStage() {
    return this.globalService.globalVar.sidequestData.trialStage;
  }

  getTrialOfResolveBossName() {
    return "Test";
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
      'nemesisColor': name === "Nemesis",
      'aphroditeColor': name === "Aphrodite",
      'heraColor': name === "Hera"
    };
  }

  getTrialNameColor(type: TrialEnum) {
    if (this.selectedTrial !== undefined && this.selectedTrial.type === type)
      return { 'active': true };

    return {};
  }

  startTrial() {
    this.globalService.startTrial(this.selectedTrial);
    this.dialog.closeAll();
  }

  getTrialEnemies() {
    return this.trialService.getTrialOfResolveBattle().enemyList;
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

  repeatTrialFightToggle() {
    this.globalService.globalVar.settings.set("repeatTrialFight", this.repeatTrialFight);
  }

  toggleSubMenuOptions(direction: number) {    
    var currentIndex = this.trials.findIndex(item => item === this.selectedTrial.type);
    currentIndex += direction;

    if (currentIndex < 0)
      currentIndex = this.trials.length - 1;
    if (currentIndex > this.trials.length - 1)
      currentIndex = 0;
    
    this.chooseTrial(this.trials[currentIndex]);
  }
}
