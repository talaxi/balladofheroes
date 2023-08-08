import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
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
      this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You gain " + totalGain + " Ambrosia.");
    }

    /*var powerGain = this.getChthonicPower(god);
    var favorGain = this.getChthonicFavor(god);

    if (this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked)
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicFavor, favorGain));

    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, powerGain));

    var originalLevel = god.level;
    god.level = 1;
    god.exp = 0;
    god.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
    god.lastStatGain = CharacterStatEnum.Resistance;
    god.statGainCount = 0;
    god.expToNextLevel = 200;
    var isAbility2Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.isPermanent;
    var isAbility3Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.isPermanent;
    var isPassivePermanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.isPermanent;
    this.globalService.assignGodAbilityInfo(god);

    if (isAbility2Permanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    if (isAbility3Permanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    if (isPassivePermanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel)
        ability.isAvailable = true;
    });

    var resetRetainAmount = this.globalService.globalVar.chthonicPowers.getRetainGodLevelPercent();
    if (resetRetainAmount > 0) {
      var godLevel = Math.floor(originalLevel * resetRetainAmount);
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(god, true);
      }
      god.exp = 0;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {      
    if (god.type === GodEnum.Hades) {
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.LordOfTheUnderworld);
    }

      this.globalService.calculateCharacterBattleStats(member, false);
    });*/
  }
}
