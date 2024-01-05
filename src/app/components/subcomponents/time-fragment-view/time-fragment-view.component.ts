import { Component, Input } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { TrialService } from 'src/app/services/battle/trial.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TimeFragmentRun } from 'src/app/models/utility/time-fragment-run.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { TrialDefeatCount } from 'src/app/models/battle/trial-defeat-count.model';
import { BackgroundService } from 'src/app/services/utility/background.service';

@Component({
  selector: 'app-time-fragment-view',
  templateUrl: './time-fragment-view.component.html',
  styleUrls: ['./time-fragment-view.component.css']
})
export class TimeFragmentViewComponent {
  availableBallads: BalladEnum[] = [];
  availableZones: ZoneEnum[] = [];
  availableSubzones: SubZoneEnum[] = [];
  @Input() selectedBallad: Ballad | undefined;
  @Input() selectedZone: Zone | undefined;
  @Input() selectedSubzone: SubZone | undefined;
  selectedTrial: TrialEnum | undefined;
  isMobile = false;
  trialEnum = TrialEnum;
  trialsExpanded: boolean = false;
  timeFragmentRuns: TimeFragmentRun[] = [];
  availableFragments: number;

  constructor(public balladService: BalladService, private globalService: GlobalService, private lookupService: LookupService,
    private deviceDetectorService: DeviceDetectorService, private dictionaryService: DictionaryService, private trialService: TrialService,
    private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService, private achievementService: AchievementService,
    private backgroundService: BackgroundService) {

  }

  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.globalService.globalVar.ballads.filter(item => item.isAvailable && this.balladContainsCompletedSubzone(item)).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }).forEach(item => {
      this.availableBallads.push(item.type);
    });
    this.timeFragmentRuns = this.globalService.globalVar.timeFragmentRuns;
    this.availableFragments = this.lookupService.getResourceAmount(ItemsEnum.TimeFragment);
  }

  expandTrials() {
    this.trialsExpanded = !this.trialsExpanded;
    this.selectedBallad = undefined;
    this.selectedSubzone = undefined;
    this.selectedZone = undefined;
  }

  selectTrial(trial: TrialEnum) {
    this.selectedBallad = undefined;
    this.selectedSubzone = undefined;
    this.selectedZone = undefined;
    this.selectedTrial = trial;
  }

  getTrialClass(trial: TrialEnum) {
    if (this.selectedTrial === undefined)
      return {};

    return {
      'selectedBallad': trial === this.selectedTrial
    };
  }

  anyTrialAvailable() {
    var skill = this.isTrialAvailable(TrialEnum.TrialOfSkill);
    var starsNormal = this.isTrialAvailable(TrialEnum.TrialOfTheStarsNormal);
    var starsHard = this.isTrialAvailable(TrialEnum.TrialOfTheStarsHard);
    var starsVeryHard = this.isTrialAvailable(TrialEnum.TrialOfTheStarsVeryHard);

    return skill || starsNormal || starsHard || starsVeryHard;
  }

  isTrialAvailable(trial: TrialEnum) {
    var available = true;

    if (!this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus)?.isAvailable) {
      available = false;
      return available;
    }

    if (trial === TrialEnum.TrialOfSkill) {
      available = false;
      var skill = this.globalService.globalVar.trialDefeatCount.filter(item => item.type === TrialEnum.TrialOfSkill);
      skill.forEach(item => {
        if (item.count > 0) {
          available = true;
        }
      });

      return available;
    }

    var starsNormal = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsNormal);
    var starsHard = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsHard);
    var starsVeryHard = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsVeryHard);
    if (trial === TrialEnum.TrialOfTheStarsNormal && (starsNormal === undefined || starsNormal.count === 0)) {
      available = false;
      return available;
    }
    if (trial === TrialEnum.TrialOfTheStarsHard && (starsHard === undefined || starsHard.count === 0)) {
      available = false;
      return available;
    }
    if (trial === TrialEnum.TrialOfTheStarsVeryHard && (starsVeryHard === undefined || starsVeryHard.count === 0)) {
      available = false;
      return available;
    }

    return available;
  }

  isBalladSelected(type: BalladEnum) {
    if (this.selectedBallad === undefined)
      return false;

    return this.selectedBallad.type === type;
  }

  getBalladClass(ballad: BalladEnum) {
    if (this.selectedBallad === undefined)
      return {};

    return {
      'selectedBallad': ballad === this.selectedBallad.type
    };
  }

  isZoneSelected(type: ZoneEnum) {
    if (this.selectedZone === undefined)
      return false;

    return this.selectedZone?.type === type;
  }

  getZoneClass(zone: ZoneEnum) {
    if (this.selectedZone === undefined)
      return {};

    return {
      'selectedBallad': zone === this.selectedZone.type
    };
  }

  isSubzoneSelected(type: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return false;

    return this.selectedSubzone?.type === type;
  }

  getSubzoneClass(subzone: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return {};

    return {
      'selectedBallad': subzone === this.selectedSubzone.type
    };
  }

  getZoneName(type: ZoneEnum) {
    return this.balladService.findZone(type)?.zoneName;
  }

  getSubzoneName(type: SubZoneEnum) {
    return this.balladService.getSubZoneName(type);
  }

  selectBallad(type: BalladEnum) {
    var ballad = this.balladService.findBallad(type);
    if (ballad !== undefined) {
      this.selectedBallad = ballad;
      this.selectedTrial = undefined;
      this.selectedZone = undefined;
      this.selectedSubzone = undefined;
      this.trialsExpanded = false;
      this.availableZones = [];
      this.availableSubzones = [];

      this.selectedBallad.zones.filter(item => item.isAvailable && this.zoneContainsCompletedSubzone(item)).forEach(zone => {
        this.availableZones.push(zone.type);
      });
    }
  }

  balladContainsCompletedSubzone(ballad: Ballad) {
    var containsCompletedSubzone = false;
    ballad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) === 0 &&
          subzone.maxDps > 0)
          containsCompletedSubzone = true;
      });
    });
    return containsCompletedSubzone;
  }

  zoneContainsCompletedSubzone(zone: Zone) {
    var containsCompletedSubzone = false;
    zone.subzones.forEach(subzone => {
      if (this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements) === 0 &&
        subzone.maxDps > 0)
        containsCompletedSubzone = true;
    });
    return containsCompletedSubzone;
  }

  selectZone(type: ZoneEnum) {
    var zone = this.balladService.findZone(type);
    if (zone !== undefined) {
      this.selectedZone = zone;
      this.selectedSubzone = undefined;
      this.availableSubzones = [];

      this.selectedZone.subzones.filter(item => item.isAvailable && !this.lookupService.isSubzoneATown(item.type) &&
        this.achievementService.getUncompletedAchievementCountBySubZone(item.type, this.globalService.globalVar.achievements) === 0 &&
        item.maxDps > 0).forEach(subzone => {
          this.availableSubzones.push(subzone.type);
        });
    }
  }

  selectSubzone(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);
    if (subzone !== undefined) {
      this.selectedSubzone = subzone;
    }
  }

  itemIsSelected() {
    return this.selectedTrial !== undefined || this.selectedSubzone !== undefined;
  }

  getSelectedItemName() {
    var name = "";

    if (this.selectedTrial !== undefined)
      name = this.dictionaryService.getTrialName(this.selectedTrial);
    else if (this.selectedSubzone !== undefined)
      name = this.balladService.getSubZoneName(this.selectedSubzone.type);

    return name;
  }

  getSelectedItemDps() {
    var dps = "Max DPS Achieved: 0";

    if (this.selectedTrial !== undefined) {
      var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === this.selectedTrial &&
        item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      if (trialType === undefined)
        return 0;

      dps = this.utilityService.bigNumberReducer(trialType.highestDps);
    }
    else if (this.selectedSubzone !== undefined)
      dps = this.utilityService.bigNumberReducer(this.selectedSubzone.maxDps);

    return "Max DPS Achieved: " + dps;
  }

  getSelectedEstimatedRewards() {
    var timeFragmentRun = new TimeFragmentRun();
    timeFragmentRun.selectedSubzone = this.selectedSubzone?.type;
    timeFragmentRun.selectedTrial = this.selectedTrial;
    return this.getEstimatedRewards(timeFragmentRun);
  }

  getClearTime(run: TimeFragmentRun) {
    var clearRate = 0;
    var maxDps = 0;
    var hpList: number[] = [];
    var enemyOptions: EnemyTeam[] = [];

    if (run.selectedTrial !== undefined) {
      var trialType: TrialDefeatCount | undefined;
      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      }
      else {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial);
      }

      if (trialType !== undefined)
        maxDps = trialType.highestDps;

      var trial = this.dictionaryService.getTrialInfoFromType(run.selectedTrial);
      enemyOptions = this.trialService.generateBattleOptions(trial);
      enemyOptions.forEach(enemyTeam => {
        var teamHp = 0;

        enemyTeam.enemyList.forEach(enemy => {
          if (run.selectedTrial === TrialEnum.TrialOfSkill && trialType !== undefined)
            teamHp += trialType.highestHp;
          else
            teamHp += enemy.battleStats.maxHp;
        });
        hpList.push(teamHp);
      });
    }
    else if (run.selectedSubzone !== undefined) {
      var subzone = this.balladService.findSubzone(run.selectedSubzone);
      if (subzone !== undefined)
        maxDps = subzone.maxDps;

      enemyOptions = this.subzoneGeneratorService.generateBattleOptions(run.selectedSubzone);
      enemyOptions.forEach(enemyTeam => {
        var teamHp = 0;

        enemyTeam.enemyList.forEach(enemy => {
          teamHp += enemy.battleStats.maxHp;
        });

        hpList.push(teamHp);
      });
    }

    var hpSum = hpList.reduce(function (acc, cur) { return acc + cur; });
    clearRate = this.utilityService.genericShortRound(this.utilityService.genericShortRound(hpSum / hpList.length) / maxDps);

    if (clearRate < 5)
      clearRate = 5;

    return clearRate;
  }

  getEstimatedRewards(run: TimeFragmentRun, oneLine: boolean = false) {
    var rewardInfo = this.backgroundService.getTimeFragmentCondensedRewards(run);
    var rewards = "";
    var enemyOptions: EnemyTeam[] = [];
    var finalLootOptions: [ItemsEnum, number][] = rewardInfo[2];
    var xpGained = rewardInfo[0];
    var coinsGained = rewardInfo[1];
    var clearRate = 0;
    var maxDps = 0;

    if (run.selectedTrial !== undefined) {
      var trialType: TrialDefeatCount | undefined;
      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      }
      else {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial);
      }

      if (trialType !== undefined)
        maxDps = trialType.highestDps;
    }
    else if (run.selectedSubzone !== undefined) {
      var subzone = this.balladService.findSubzone(run.selectedSubzone);
      if (subzone !== undefined)
        maxDps = subzone.maxDps;
    }

    if (maxDps === 0)
      return "";

    clearRate = Math.round(this.getClearTime(run));
    rewards += "<span>" + this.utilityService.bigNumberReducer(xpGained) + "</span>" + " XP" + (oneLine ? ", " : "<br/>");

    if (coinsGained > 0)
      rewards += "<span>" + this.utilityService.genericShortRound(coinsGained) + "</span> Coins" + (oneLine ? ", " : "<br/>");

    if (oneLine && coinsGained === 0 && finalLootOptions.length === 0)
      rewards = rewards.substring(0, rewards.length - 2);

    finalLootOptions.forEach(loot => {
      rewards += "<span>" + this.utilityService.genericShortRound(loot[1] * 100) + "%</span> 1x " + this.dictionaryService.getItemName(loot[0]) + ", ";
    });

    if (rewards !== "" && finalLootOptions.length > 0) {
      rewards = rewards.substring(0, rewards.length - 2);
      if (!oneLine)
        rewards += "<br/>";
    }

    if (rewards !== "") {
      if (oneLine)
        rewards += " ";

      rewards += "every " + (clearRate > 60 ? Math.floor(clearRate / 60) + " minute" + (Math.floor(clearRate / 60) === 1 ? "" : "s") +
        " " + clearRate % 60 + " second" + (clearRate % 60 === 1 ? "" : "s") : clearRate + " second" + (clearRate === 1 ? "" : "s"));
    }

    return rewards;
  }

  selectTimeFragmentRun() {
    if (!this.isFragmentAvailableToAdd())
      return;

    var timeFragmentRun = new TimeFragmentRun();
    timeFragmentRun.selectedSubzone = this.selectedSubzone?.type;
    timeFragmentRun.selectedTrial = this.selectedTrial;
    timeFragmentRun.clearTime = this.getClearTime(timeFragmentRun);
    this.globalService.globalVar.timeFragmentRuns.push(timeFragmentRun);

    this.timeFragmentRuns = this.globalService.globalVar.timeFragmentRuns;
  }

  isFragmentAvailableToAdd() {
    if (this.availableFragments < this.timeFragmentRuns.length)
      return false;

    if (this.timeFragmentRuns.some(item => (item.selectedSubzone !== undefined && this.selectedSubzone !== undefined && item.selectedSubzone === this.selectedSubzone.type) ||
      (item.selectedTrial !== undefined && this.selectedTrial !== undefined && item.selectedTrial === this.selectedTrial)))
      return false;

    return true;
  }

  getRunDetails(run: TimeFragmentRun) {
    var details = "";

    if (run.selectedTrial !== undefined) {
      details = "<span class='bold s6Heading screenMarginRight'>" + this.dictionaryService.getTrialName(run.selectedTrial) + "</span>";
    }
    else if (run.selectedSubzone !== undefined) {
      details = "<span class='bold s6Heading screenMarginRight'>" + this.balladService.getSubZoneName(run.selectedSubzone) + "</span>";
    }

    details += "<span>" + this.getEstimatedRewards(run, true) + "</span>";

    return details;
  }

  removeTimeFragment(run: TimeFragmentRun) {
    this.globalService.globalVar.timeFragmentRuns = this.globalService.globalVar.timeFragmentRuns.filter(item => item !== run);
    this.timeFragmentRuns = this.globalService.globalVar.timeFragmentRuns;
  }

  ifVersionPriorTo75() {
    return this.globalService.globalVar.startingVersion < .75;
  }
}
