import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TrialDefeatCount } from 'src/app/models/battle/trial-defeat-count.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { TimeFragmentRun } from 'src/app/models/utility/time-fragment-run.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { TrialService } from 'src/app/services/battle/trial.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ZodiacService } from 'src/app/services/global/zodiac.service';
import { LookupService } from 'src/app/services/lookup.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { BackgroundService } from 'src/app/services/utility/background.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';

@Component({
  selector: 'app-time-fragment-overview',
  templateUrl: './time-fragment-overview.component.html',
  styleUrls: ['./time-fragment-overview.component.css']
})
export class TimeFragmentOverviewComponent {
  timeFragmentRuns: TimeFragmentRun[] = [];
  availableFragments: number;
  subscription: any;

  constructor(private deviceDetectorService: DeviceDetectorService, public dialog: MatDialog, private lookupService: LookupService,
    private globalService: GlobalService, private gameLoopService: GameLoopService, private trialService: TrialService,
    private dictionaryService: DictionaryService, private balladService: BalladService, private subzoneGeneratorService: SubZoneGeneratorService,
    private utilityService: UtilityService, private backgroundService: BackgroundService, private zodiacService: ZodiacService) {

  }

  ngOnInit() {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.timeFragmentRuns = this.globalService.globalVar.timeFragmentRuns;
      this.availableFragments = this.lookupService.getResourceAmount(ItemsEnum.TimeFragment);
    });
  }

  openModal(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '80%', minHeight: '80vh', maxHeight: '80%' });
  }

  getClearTime(run: TimeFragmentRun) {
    return this.backgroundService.getTimeFragmentClearRate(run);
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
    var trialType: TrialDefeatCount | undefined;

    if (run.selectedTrial !== undefined) {
      if (run.selectedTrial === TrialEnum.TrialOfSkill) {
        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.godType === this.trialService.getGodEnumFromTrialOfSkillBattle());
      }
      else if (run.selectedTrial === TrialEnum.TrialOfTheStarsNormal || run.selectedTrial === TrialEnum.TrialOfTheStarsHard || run.selectedTrial === TrialEnum.TrialOfTheStarsVeryHard || run.selectedTrial === TrialEnum.TrialOfTheStarsUltimate) {
        var zodiacEnum = ZodiacEnum.None;

        if (this.globalService.globalVar.sidequestData.seasonShifterUnlocked && this.globalService.globalVar.sidequestData.selectedZodiac)
          zodiacEnum = this.globalService.globalVar.sidequestData.selectedZodiac;
        else
          zodiacEnum = this.zodiacService.getCurrentZodiac();

        trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === run.selectedTrial &&
          item.zodiacType === zodiacEnum);
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
    rewards += "<span>" + this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, xpGained) + "</span>" + " XP" + (oneLine ? ", " : "<br/>");

    if (trialType !== undefined && trialType.type === TrialEnum.TrialOfSkill) {
      var efficiency = this.globalService.globalVar.isSubscriber ? this.utilityService.supporterTimeFragmentEfficiency : this.utilityService.timeFragmentEfficiency;
      rewards += (efficiency * this.utilityService.trialAffinityXpGain) + " " + this.lookupService.getGodNameByType(trialType.godType) + " Affinity XP, "
    }

    if (coinsGained > 0)
      rewards += "<span>" + this.utilityService.genericShortRound(coinsGained) + "</span> <span class='coinKeyword'>Coins</span>" + (oneLine ? ", " : "<br/>");

    if (oneLine && coinsGained === 0 && finalLootOptions.length === 0)
      rewards = rewards.substring(0, rewards.length - 2);

    if (finalLootOptions.length > 0)
      rewards += finalLootOptions.length + " Items ";

    if (rewards !== "") {
      if (oneLine)
        rewards += " ";

      rewards += "every " + (clearRate > 60 ? Math.floor(clearRate / 60) + " minute" + (Math.floor(clearRate / 60) === 1 ? "" : "s") +
        " " + clearRate % 60 + " second" + (clearRate % 60 === 1 ? "" : "s") : clearRate + " second" + (clearRate === 1 ? "" : "s"));
    }

    return rewards;
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

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
