import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-olympic-reset-menu-view',
  templateUrl: './olympic-reset-menu-view.component.html',
  styleUrls: ['./olympic-reset-menu-view.component.css']
})
export class OlympicResetMenuViewComponent {
  availableCharacters: Character[];
  availableGods: God[];
  bonusGod: GodEnum = GodEnum.None;
  godEnum = GodEnum;
  bonusGodText = "";
  bonusGodName: string;
  isMobile: boolean = false;
  olympicLevelCap = 100;

  constructor(public globalService: GlobalService, public lookupService: LookupService, private utilityService: UtilityService,
    private deviceDetectorService: DeviceDetectorService, private gameLogService: GameLogService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.availableCharacters = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.availableGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
  }

  getAmbrosiaGain(levelsSpent: number) {
    var totalGain = 0;
    this.globalService.globalVar.sidequestData.levelsForNextAmbrosia -= levelsSpent;

    while (this.globalService.globalVar.sidequestData.levelsForNextAmbrosia <= 0) {
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
      this.globalService.globalVar.sidequestData.levelsForNextAmbrosia += this.utilityService.levelsNeededForAmbrosia;
      totalGain += 1;
    }

    return totalGain;
  }

  getMaxLevel(character: Character) {
    return character.maxLevel;
  }

  getNewMaxLevel(character: Character) {
    if (character.maxLevel >= this.olympicLevelCap)
      return character.maxLevel;

    return character.maxLevel + 5;
  }

  resetLevelGain(character: Character) {
    return Math.round(this.getNewMaxLevel(character) - this.getMaxLevel(character));
  }

  getTotalLevelsNeededForAmbrosia() {
    return this.utilityService.levelsNeededForAmbrosia;
  }

  getLevelsNeededForAmbrosia() {
    return this.globalService.globalVar.sidequestData.levelsForNextAmbrosia;
  }

  resetClass(character: Character) {
    var totalGain = this.getAmbrosiaGain(character.maxLevel);
    character.maxLevel = this.getNewMaxLevel(character);
    character.level = 1;
    character.exp = 0;
    character.linkInfo.totalLinks = 0;
    character.linkInfo.remainingLinks = 0;
    character.baseStats = this.globalService.getCharacterBaseStats(character.type);
    character.expToNextLevel = this.globalService.getCharacterXpToNextLevel(character.level);
    this.globalService.calculateCharacterBattleStats(character, false);

    if (totalGain > 0) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain " + totalGain + " Ambrosia.", this.globalService.globalVar);
    }
  }
}
