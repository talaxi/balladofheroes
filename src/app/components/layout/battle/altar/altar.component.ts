import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { Character } from 'src/app/models/character/character.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { AltarService } from 'src/app/services/altar/altar.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-altar',
  templateUrl: './altar.component.html',
  styleUrls: ['./altar.component.css']
})
export class AltarComponent implements OnInit {
  altar: AltarInfo;
  buttonOptions: AltarPrayOptionsEnum[] = [];
  subscription: any;

  constructor(private globalService: GlobalService, private altarService: AltarService, private lookupService: LookupService,
    private battleService: BattleService, private gameLoopService: GameLoopService, private gameLogService: GameLogService,
    private alchemyService: AlchemyService, private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {    
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.checkThresholds();
    });
  }

  checkThresholds() {
    //kind of questionable but using XP as a placeholder for current threshold
    if (this.getAsclepiusHpThreshold1() >= 100 && this.globalService.globalVar.sidequestData.altarOfAsclepius.exp < 1) {
      this.gainThreshold1Reward();
      this.globalService.globalVar.sidequestData.altarOfAsclepius.exp = 1;
    }
    if (this.getAsclepiusHpThreshold2() >= 100 && this.globalService.globalVar.sidequestData.altarOfAsclepius.exp < 2) {
      this.gainThreshold2Reward();
      this.globalService.globalVar.sidequestData.altarOfAsclepius.exp = 2;
    }
    if (this.getAsclepiusHpThreshold3() >= 100 && this.globalService.globalVar.sidequestData.altarOfAsclepius.exp < 3) {
      this.gainThreshold3Reward();
      this.globalService.globalVar.sidequestData.altarOfAsclepius.exp = 3;
    }
    if (this.getAsclepiusHpThreshold4() >= 100 && this.globalService.globalVar.sidequestData.altarOfAsclepius.exp < 4) {
      this.gainThreshold4Reward();
      this.globalService.globalVar.sidequestData.altarOfAsclepius.exp = 4;
    }
  }

  displayAltarText() {
    //var text = "You come across an altar to " + this.lookupService.getGodNameByType(this.altar.god) + " on your journey and take a moment to pray.";
    var text = "Honor <span class='commonCharacterColor storyCharacterName'>Asclepius</span> by leaving healing items at the altar.";
    return text;
  }

  targetAltarWithItem() {
    var isTargeted = false;

    if (!this.battleService.targetbattleItemMode || this.battleService.battleItemInUse === undefined ||
      this.battleService.battleItemInUse === ItemsEnum.None) {
      return isTargeted;
    }

    var itemType = this.lookupService.getItemTypeFromItemEnum(this.battleService.battleItemInUse);
    if (itemType === ItemTypeEnum.None) {
      console.log("Error getting item type from item");
      return isTargeted;
    }

    if (itemType !== ItemTypeEnum.HealingItem) {
      return isTargeted;
    }

    if (this.battleService.targetbattleItemMode)
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnAltar() {
    if (this.targetAltarWithItem())
      this.battleService.useBattleItemOnCharacter(this.globalService.globalVar.sidequestData.altarOfAsclepius, this.globalService.getActivePartyCharacters(true));
  }

  getAsclepiusHpThreshold1() {
    var percentComplete = (this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.currentHp / (this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .25)) * 100;

    if (percentComplete > 100)
      percentComplete = 100;

    return percentComplete;
  }

  getAsclepiusHpThreshold2() {
    var startingHp = this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.currentHp - this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .25;
    if (startingHp < 0)
      startingHp = 0;

    var percentComplete = (startingHp / (this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .25)) * 100;

    if (percentComplete > 100)
      percentComplete = 100;

    return percentComplete;
  }

  getAsclepiusHpThreshold3() {
    var startingHp = this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.currentHp - this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .5;
    if (startingHp < 0)
      startingHp = 0;

    var percentComplete = (startingHp / (this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .25)) * 100;

    if (percentComplete > 100)
      percentComplete = 100;

    return percentComplete;
  }

  getAsclepiusHpThreshold4() {
    var startingHp = this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.currentHp - this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .75;
    if (startingHp < 0)
      startingHp = 0;

    var percentComplete = (startingHp / (this.globalService.globalVar.sidequestData.altarOfAsclepius.battleStats.maxHp * .25)) * 100;

    if (percentComplete > 100)
      percentComplete = 100;

    return percentComplete;
  }

  gainThreshold1Reward() {
    var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
    if (apollo !== undefined && !apollo.isAvailable) {
      apollo.isAvailable = true;

      apollo.abilityList.forEach(ability => {
        if (apollo!.level >= ability.requiredLevel)
          ability.isAvailable = true;
      });

      var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
      if (character1 !== undefined && character1.assignedGod1 === GodEnum.None) {
        character1.assignedGod1 = GodEnum.Apollo;
      }
      if (character1 !== undefined && character1.assignedGod2 === GodEnum.None) {
        character1.assignedGod2 = GodEnum.Apollo;
      }
    }

    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your sacrifice and devotion to healing has honored Asclepius and impressed his father Apollo, God of Healing and Music. Apollo will now assist you on your adventure.");
  }

  gainThreshold2Reward() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);

    if (alchemy !== undefined && !alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.RejuvenatingElixir)) {
      alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.RejuvenatingElixir));
      
      var gameLogEntry = "You learn how to make the Alchemy recipe: <strong>" + this.lookupService.getItemName(ItemsEnum.RejuvenatingElixir) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);      
    }
  }

  gainThreshold3Reward() {
    this.globalService.globalVar.altars.largeAltarsUnlocked = true;

    var gameLogEntry = "To further your devotion to the gods, you can now pray to <strong>Large Altars</strong>. Right click Small Altars to toggle between the two options.";
    if (this.deviceDetectorService.isMobile())
      gameLogEntry = "To further your devotion to the gods, you can now pray to <strong>Large Altars</strong>. Tap and hold Small Altars to toggle between the two options.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, gameLogEntry);
  }

  gainThreshold4Reward() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);

    if (alchemy !== undefined)
    {
      alchemy.maxLevel += this.utilityService.alchemyLevelCapGain;
      
      var gameLogEntry = "Your max Alchemy level has increased to <strong>" + alchemy.maxLevel + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
