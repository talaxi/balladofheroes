import { Component, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ColiseumService } from 'src/app/services/battle/coliseum.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-coliseum-view',
  templateUrl: './coliseum-view.component.html',
  styleUrls: ['./coliseum-view.component.css']
})
export class ColiseumViewComponent implements OnInit {
  selectedTournament: ColiseumTournament;
  repeatColiseumFight: boolean = false;
  rewardsText = "";

  constructor(private coliseumService: ColiseumService, private globalService: GlobalService, public dialog: MatDialog,
    private lookupService: LookupService, private utilityService: UtilityService, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.rewardsText = this.setRewardsText();
    this.repeatColiseumFight = this.globalService.globalVar.settings.get("repeatColiseumFight") ?? false
    var standardTournaments = this.getStandardColiseumTournaments();
    if (standardTournaments.length > 0)
      this.selectedTournament = this.dictionaryService.getColiseumInfoFromType(standardTournaments[0]);
  }

  getStandardColiseumTournaments() {
    var tournaments: ColiseumTournamentEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ColiseumTournamentEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ColiseumTournamentEnum;
      if (enumValue !== ColiseumTournamentEnum.None) {
        if (enumValue === ColiseumTournamentEnum.TournamentOfTheDead)
          tournaments.push(enumValue)
        else {
          var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === enumValue);
          if (tournamentType !== undefined && tournamentType.isAvailable && !this.coliseumService.isTournamentTypeSpecial(tournamentType.type)) {
            tournaments.push(enumValue);
          }
        }
      }
    }

    tournaments.sort((a, b) => this.sortColiseumList(a, b));

    return tournaments;
  }

  sortColiseumList(a: ColiseumTournamentEnum, b: ColiseumTournamentEnum) {
    var aLevel = this.getColiseumCompletionLevel(a);
    var bLevel = this.getColiseumCompletionLevel(b);
    return aLevel < bLevel ? -1 : aLevel > bLevel ? 1 : 0;
  }

  getSpecialColiseumTournaments() {
    var tournaments: ColiseumTournamentEnum[] = [];

    var weeklyMelee = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.WeeklyMelee);
    //console.log((weeklyMelee !== undefined) + " && " + weeklyMelee?.isAvailable);
    if (weeklyMelee !== undefined && weeklyMelee.isAvailable) {
      tournaments.push(weeklyMelee.type);
    }

    tournaments.sort((a, b) => this.sortColiseumList(a, b));

    return tournaments;
  }

  chooseColiseumTournament(tournament: ColiseumTournamentEnum) {
    this.selectedTournament = this.dictionaryService.getColiseumInfoFromType(tournament);
  }

  getTournamentName(type?: ColiseumTournamentEnum) {
    if (type === undefined) {
      return this.dictionaryService.getTournamentName(this.selectedTournament.type);
    }
    else
      return this.dictionaryService.getTournamentName(type);
  }

  getTournamentDescription() {
    return this.coliseumService.getTournamentDescription(this.selectedTournament.type);
  }

  getRequiredDpsForSelectedTournament() {
    return this.utilityService.roundTo(this.coliseumService.getRequiredDps(this.selectedTournament.type), 0);
  }

  getFirstTimeCompletionRewards() {
    var reward = "";

    this.selectedTournament.completionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item)));
      if (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item)?.quality);

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount.toLocaleString() + " " + itemName + "<br/>";
    });

    return reward;
  }

  firstTimeRewardAlreadyObtained(type?: ColiseumTournamentEnum) {
    if (type === undefined)
      type = this.selectedTournament.type;

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType?.count !== undefined && tournamentType?.count >= 1)
      return true;

    return false;
  }

  getQuickCompletionRewards() {
    var reward = "";

    this.selectedTournament.quickCompletionReward.forEach(item => {
      var itemName = (item.amount === 1 ? this.dictionaryService.getItemName(item.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(item.item)));
      if (this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment) {
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(item.item)?.quality);

        itemName = "<span class='" + qualityClass + "'>" + itemName + "</span>";
      }

      reward += item.amount + " " + itemName + "<br/>";
    });

    return reward;
  }

  quickCompletionRewardAlreadyObtained(type?: ColiseumTournamentEnum) {
    if (type === undefined)
      type = this.selectedTournament.type;

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType?.quickVictoryCompleted)
      return true;

    return false;
  }

  //1 is not started, 2 is cleared, 3 is completed
  getColiseumCompletionLevel(type: ColiseumTournamentEnum) {
    var level = 1;

    if (this.firstTimeRewardAlreadyObtained(type))
      level = 2;

    if (this.quickCompletionRewardAlreadyObtained(type))
      level = 3;

    return level;
  }

  getColiseumNameColor(type: ColiseumTournamentEnum) {    
    if (this.firstTimeRewardAlreadyObtained(type) && !this.quickCompletionRewardAlreadyObtained(type)) {              
        if (this.selectedTournament !== undefined && this.selectedTournament.type === type)
          return { 'activeBackground clearedSubzoneColor': true };
        else
          return { 'clearedSubzoneColor': true };      
    }
    else if (this.firstTimeRewardAlreadyObtained(type) && this.quickCompletionRewardAlreadyObtained(type)) {      
      if (this.selectedTournament !== undefined && this.selectedTournament.type === type)
        return { 'activeBackground completedSubzoneColor': true };
      else
        return { 'completedSubzoneColor': true };
    }
    else
    {
      if (this.selectedTournament !== undefined && this.selectedTournament.type === type)
          return { 'active': true };
    }

    return {};
  }

  startTournament() {
    this.globalService.startColiseumTournament(this.selectedTournament);
    this.dialog.closeAll();
  }

  canEnterWeeklyMelee() {
    return this.globalService.globalVar.sidequestData.weeklyMeleeEntries > 0;
  }

  isSelectedTournamentWeeklyMelee() {
    return this.selectedTournament.type === ColiseumTournamentEnum.WeeklyMelee;
  }

  getWeeklyEntries() {
    return this.globalService.globalVar.sidequestData.weeklyMeleeEntries;
  }

  getWeeklyEntryCap() {
    var ticketMultiplier = 1;
      if (this.globalService.globalVar.isSubscriber)
        ticketMultiplier = 2;

    return this.utilityService.weeklyMeleeEntryCap * ticketMultiplier;
  }

  getHighestWeeklyMeleeRoundCompleted() {
    return this.globalService.globalVar.sidequestData.highestWeeklyMeleeRound;
  }

  repeatColiseumFightToggle() {
    this.globalService.globalVar.settings.set("repeatColiseumFight", this.repeatColiseumFight);
  }

  setRewardsText() {
    var rewardsText = "";

    rewardsText = "Enemies will not give XP, Coins, or Items like normal. Instead, you will gain XP and Coins based on how many rounds you complete. The further you progress, the more you will gain. In addition, you will gain an item reward after each boss fight. <br/><br/>" +
    "Completing Round 5: +10-50 Basic Crafting Materials<br/>" +
    "Completing Round 10: +30-70 Rough Gem Fragments<br/>" +
    "Completing Round 15: +25-100 Metal Scraps<br/>" +
    "Completing Round 20: +60-100 Rough Gem Fragments<br/>" +
    "Completing Round 25: +30-70 Uncommon Crafting Materials<br/>" +
    "Every successive boss fight: +100 Rough Gem Fragments<br/><br/>" +
    "<b><i>Rewards will continue to be adjusted as future content is added to the game</i></b>"

    return rewardsText;
  }

  openModal(content: any) {    
    return this.dialog.open(content, { width: '40%', height: 'auto' });      
  }
}
