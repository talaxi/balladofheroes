import { Injectable } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionActionsEnum } from 'src/app/models/enums/profession-actions-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { UtilityService } from '../utility/utility.service';
import { GlobalService } from '../global/global.service';
import { GameLogService } from '../battle/game-log.service';
import { LookupService } from '../lookup.service';
import { DictionaryService } from '../utility/dictionary.service';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { TutorialService } from '../global/tutorial.service';

@Injectable({
  providedIn: 'root'
})
export class JewelcraftingService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService, private dictionaryService: DictionaryService, private tutorialService: TutorialService) { }

  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AegeanSeaIolcus) {
      var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
      if (jewelcrafting !== undefined && !jewelcrafting.isUnlocked) {
        jewelcrafting.isUnlocked = true;
        jewelcrafting.level = 1;
        jewelcrafting.maxLevel += this.utilityService.firstJewelcraftingLevelCap;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Jewelcrafting, undefined, undefined, true, subzone), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }
    }
  }

  getActionLength(action: ProfessionActionsEnum) {
    var duration = 0;

    if (action === ProfessionActionsEnum.CombiningStones)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.CombiningGems)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.RareCombiningStones)
      duration = 3 * 60;
    if (action === ProfessionActionsEnum.RareCombiningGems)
      duration = 4 * 60;
    if (action === ProfessionActionsEnum.Polish)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.HeatingMetal)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.ShapingMetal)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.CoolingMetal)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.SpecialHeatingMetal)
      duration = 5 * 60;
    if (action === ProfessionActionsEnum.SpecialShapingMetal)
      duration = 5 * 60;
    if (action === ProfessionActionsEnum.SpecialCoolingMetal)
      duration = 2.5 * 60;

    return duration;
  }

  doesUserHaveRecipe(item: ItemsEnum) {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return false;

    return jewelcrafting.availableRecipeItems.some(availableItem => item === availableItem);
  }

  learnRecipe(item: ItemsEnum) {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return;

    if (!jewelcrafting.availableRecipeItems.some(availableItem => item === availableItem))
      jewelcrafting.availableRecipeItems.push(item);
  }

  checkForNewRecipes() {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return;
    var newRecipeLearned = false;

    if (jewelcrafting.level >= 1) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedRuby)) {
        this.learnRecipe(ItemsEnum.CrackedRuby);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedRuby);
      }
    }
    if (jewelcrafting.level >= 2) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedAquamarine)) {
        this.learnRecipe(ItemsEnum.CrackedAquamarine);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedAquamarine);
      }
    }
    if (jewelcrafting.level >= 3) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PointedStone)) {
        this.learnRecipe(ItemsEnum.PointedStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PointedStone);
      }
    }
    if (jewelcrafting.level >= 4) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedOpal)) {
        this.learnRecipe(ItemsEnum.CrackedOpal);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedOpal);
      }
    }
    if (jewelcrafting.level >= 7) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MinorArmorSlotAddition)) {
        this.learnRecipe(ItemsEnum.MinorArmorSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorArmorSlotAddition);
      }
    }
    if (jewelcrafting.level >= 8) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ShiningStone)) {
        this.learnRecipe(ItemsEnum.ShiningStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ShiningStone);
      }
    }
    if (jewelcrafting.level >= 10) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedTopaz)) {
        this.learnRecipe(ItemsEnum.CrackedTopaz);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedTopaz);
      }
    }
    if (jewelcrafting.level >= 15) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedAmethyst)) {
        this.learnRecipe(ItemsEnum.CrackedAmethyst);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedAmethyst);
      }
    }
    if (jewelcrafting.level >= 20) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CrackedEmerald)) {
        this.learnRecipe(ItemsEnum.CrackedEmerald);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedEmerald);
      }
    }
    if (jewelcrafting.level >= 25) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MinorNecklaceSlotAddition)) {
        this.learnRecipe(ItemsEnum.MinorNecklaceSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorNecklaceSlotAddition);
      }
    }
    if (jewelcrafting.level >= 26) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullRuby)) {
        this.learnRecipe(ItemsEnum.DullRuby);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullRuby);
      }
    }
    if (jewelcrafting.level >= 27) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullAquamarine)) {
        this.learnRecipe(ItemsEnum.DullAquamarine);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullAquamarine);
      }
    }
    if (jewelcrafting.level >= 29) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MinorWeaponSlotAddition)) {
        this.learnRecipe(ItemsEnum.MinorWeaponSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorWeaponSlotAddition);
      }
    }
    if (jewelcrafting.level >= 30) {
      if (!this.doesUserHaveRecipe(ItemsEnum.JaggedStone)) {
        this.learnRecipe(ItemsEnum.JaggedStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.JaggedStone);
      }
    }
    if (jewelcrafting.level >= 32) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullOpal)) {
        this.learnRecipe(ItemsEnum.DullOpal);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullOpal);
      }
    }
    if (jewelcrafting.level >= 35) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullTopaz)) {
        this.learnRecipe(ItemsEnum.DullTopaz);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullTopaz);
      }
    }
    if (jewelcrafting.level >= 38) {
      if (!this.doesUserHaveRecipe(ItemsEnum.BlessedStone)) {
        this.learnRecipe(ItemsEnum.BlessedStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BlessedStone);
      }
    }
    if (jewelcrafting.level >= 40) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MinorShieldSlotAddition)) {
        this.learnRecipe(ItemsEnum.MinorShieldSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorShieldSlotAddition);
      }
    }
    if (jewelcrafting.level >= 42) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullAmethyst)) {
        this.learnRecipe(ItemsEnum.DullAmethyst);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullAmethyst);
      }
    }
    if (jewelcrafting.level >= 45) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DullEmerald)) {
        this.learnRecipe(ItemsEnum.DullEmerald);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DullEmerald);
      }
    }
    if (jewelcrafting.level >= 48) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RadiatingLightningStone)) {
        this.learnRecipe(ItemsEnum.RadiatingLightningStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RadiatingLightningStone);
      }
    }
    if (jewelcrafting.level >= 50) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MinorRingSlotAddition)) {
        this.learnRecipe(ItemsEnum.MinorRingSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorRingSlotAddition);
      }
    }
    if (jewelcrafting.level >= 51) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedRuby)) {
        this.learnRecipe(ItemsEnum.FlawedRuby);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedRuby);
      }
    }
    if (jewelcrafting.level >= 53) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedAquamarine)) {
        this.learnRecipe(ItemsEnum.FlawedAquamarine);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedAquamarine);
      }
    }
    if (jewelcrafting.level >= 54) {
      if (!this.doesUserHaveRecipe(ItemsEnum.NecklaceSlotAddition)) {
        this.learnRecipe(ItemsEnum.NecklaceSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.NecklaceSlotAddition);
      }
    }
    if (jewelcrafting.level >= 56) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RadiatingEarthStone)) {
        this.learnRecipe(ItemsEnum.RadiatingEarthStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RadiatingEarthStone);
      }
    }
    if (jewelcrafting.level >= 58) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedOpal)) {
        this.learnRecipe(ItemsEnum.FlawedOpal);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedOpal);
      }
    }
    if (jewelcrafting.level >= 60) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedTopaz)) {
        this.learnRecipe(ItemsEnum.FlawedTopaz);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedTopaz);
      }
    }
    if (jewelcrafting.level >= 63) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RadiatingWaterStone)) {
        this.learnRecipe(ItemsEnum.RadiatingWaterStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RadiatingWaterStone);
      }
    }
    if (jewelcrafting.level >= 65) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RadiatingFireStone)) {
        this.learnRecipe(ItemsEnum.RadiatingFireStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RadiatingFireStone);
      }
    }
    if (jewelcrafting.level >= 68) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedAmethyst)) {
        this.learnRecipe(ItemsEnum.FlawedAmethyst);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedAmethyst);
      }
    }
    if (jewelcrafting.level >= 70) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlawedEmerald)) {
        this.learnRecipe(ItemsEnum.FlawedEmerald);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedEmerald);
      }
    }
    if (jewelcrafting.level >= 73) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RadiatingAirStone)) {
        this.learnRecipe(ItemsEnum.RadiatingAirStone);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RadiatingAirStone);
      }
    }
    if (jewelcrafting.level >= 75) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RingSlotAddition)) {
        this.learnRecipe(ItemsEnum.RingSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RingSlotAddition);
      }
    }

    if (jewelcrafting.level >= 76) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedRuby)) {
        this.learnRecipe(ItemsEnum.RutilatedRuby);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RutilatedRuby);
      }
    }
    if (jewelcrafting.level >= 78) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedAquamarine)) {
        this.learnRecipe(ItemsEnum.RutilatedAquamarine);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlawedAquamarine);
      }
    }
    if (jewelcrafting.level >= 81) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ArmorSlotAddition)) {
        this.learnRecipe(ItemsEnum.ArmorSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ArmorSlotAddition);
      }
    }
    if (jewelcrafting.level >= 84) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedOpal)) {
        this.learnRecipe(ItemsEnum.RutilatedOpal);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RutilatedOpal);
      }
    }
    if (jewelcrafting.level >= 87) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedTopaz)) {
        this.learnRecipe(ItemsEnum.RutilatedTopaz);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RutilatedTopaz);
      }
    }
    
    if (jewelcrafting.level >= 90) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ShieldSlotAddition)) {
        this.learnRecipe(ItemsEnum.ShieldSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ShieldSlotAddition);
      }
    }
    if (jewelcrafting.level >= 93) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedAmethyst)) {
        this.learnRecipe(ItemsEnum.RutilatedAmethyst);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RutilatedAmethyst);
      }
    }
    if (jewelcrafting.level >= 95) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RutilatedEmerald)) {
        this.learnRecipe(ItemsEnum.RutilatedEmerald);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RutilatedEmerald);
      }
    }
    if (jewelcrafting.level >= 100) {
      if (!this.doesUserHaveRecipe(ItemsEnum.WeaponSlotAddition)) {
        this.learnRecipe(ItemsEnum.WeaponSlotAddition);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.WeaponSlotAddition);
      }
    }

    return newRecipeLearned;
  }

  getLevelUpReward() {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return;

    var upgrades: ProfessionUpgrades | undefined = undefined;
    var additionalChanceToUpgrade = .025;
    var additionalChanceToHalfDuration = .05;
    var additionalChanceToRetainMaterials = .05;
    var additionalDurationReduction = .04;

    var qualityName = "";

    if (jewelcrafting.level <= 25) {
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);
      qualityName = "Basic";
    }
    else if (jewelcrafting.level <= 50) {
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);
      qualityName = "Uncommon";
    }
    else if (jewelcrafting.level <= 75) {
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Rare);
      qualityName = "Rare";
    }
    else if (jewelcrafting.level <= 100) {
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Epic);
      qualityName = "Epic";
    }

    if (upgrades === undefined)
      return;

    if (jewelcrafting.level % 25 === 3 || jewelcrafting.level % 25 === 6 ||
      jewelcrafting.level % 25 === 11 || jewelcrafting.level % 25 === 14 ||
      jewelcrafting.level % 25 === 16 || jewelcrafting.level % 25 === 23) {
      upgrades.chanceForUpgrade += additionalChanceToUpgrade;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToUpgrade * 100) + "%</strong> chance to to gain an upgraded gem when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a") + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (jewelcrafting.level % 25 === 5 || jewelcrafting.level % 25 === 8 ||
      jewelcrafting.level % 25 === 13 || jewelcrafting.level % 25 === 19 ||
      jewelcrafting.level % 25 === 21) {
      upgrades.durationReduction += additionalDurationReduction;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "The time it takes to create " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a") + " " + qualityName + " quality Jewelcrafting Recipe is reduced by <strong>" + (additionalDurationReduction * 100) + "%</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (jewelcrafting.level % 25 === 9 || jewelcrafting.level % 25 === 12 ||
      jewelcrafting.level % 25 === 17 || jewelcrafting.level % 25 === 22 ||
      jewelcrafting.level % 25 === 24) {
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToRetainMaterials * 100) + "%</strong> chance to retain your ingredients when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a") + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (jewelcrafting.level % 25 === 18 || jewelcrafting.level % 25 === 0) {
      upgrades.chanceToHalfDuration += additionalChanceToHalfDuration;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToHalfDuration * 100) + "%</strong> chance to reduce crafting time by half when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a") + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
      }
    }

  }

  updateGameLogWithNewRecipe(type: ItemsEnum) {
    if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
      var gameLogEntry = "You learn how to make the Jewelcrafting recipe: <strong>" + this.dictionaryService.getItemName(type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.CrackedRuby) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 3;

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.CrackedAquamarine) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 4;

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.PointedStone) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HeftyStone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 1;

      recipe.expGain = 3;
    }
    if (item === ItemsEnum.CrackedOpal) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 5;

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.CrackedTopaz) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 6;

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.CrackedAmethyst) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 7;

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.CrackedEmerald) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 8;

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.ShiningStone) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HeftyStone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 2;

      recipe.expGain = 6;
    }
    if (item === ItemsEnum.MinorWeaponSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);
      recipe.displayOrder = 3;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.MinorRingSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);
      recipe.displayOrder = 1;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.MinorArmorSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);
      recipe.displayOrder = 2;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.MinorShieldSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);
      recipe.displayOrder = 4;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.MinorNecklaceSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);
      recipe.displayOrder = 5;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.DullRuby) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedRuby, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 3;

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.JaggedStone) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PointedStone, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 1;

      recipe.expGain = 7;
    }
    if (item === ItemsEnum.DullAquamarine) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedAquamarine, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 4;

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.DullOpal) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedOpal, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 5;

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.DullTopaz) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedTopaz, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 6;

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.DullAmethyst) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedAmethyst, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 7;

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.DullEmerald) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedEmerald, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 8;

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.BlessedStone) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ShiningStone, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 2;

      recipe.expGain = 12;
    }
    if (item === ItemsEnum.RadiatingLightningStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 8;

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.RadiatingHolyStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 9;

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.FlawedRuby) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullRuby, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 12;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.FlawedAquamarine) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullAquamarine, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 13;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.FlawedOpal) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullOpal, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 14;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.FlawedTopaz) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullTopaz, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 15;

      recipe.expGain = 30;
    }
    if (item === ItemsEnum.FlawedAmethyst) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullAmethyst, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 16;

      recipe.expGain = 30;
    }
    if (item === ItemsEnum.FlawedEmerald) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullEmerald, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 17;

      recipe.expGain = 30;
    }
    if (item === ItemsEnum.RadiatingEarthStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 11;

      recipe.expGain = 25;
    }
    if (item === ItemsEnum.RadiatingWaterStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 7;

      recipe.expGain = 25;
    }
    if (item === ItemsEnum.RadiatingFireStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 6;

      recipe.expGain = 35;
    }
    if (item === ItemsEnum.RadiatingAirStone) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));
      recipe.displayOrder = 10;

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningStones);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 35;
    }
    if (item === ItemsEnum.RingSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 5000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.SpecialHeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialCoolingMetal);
      recipe.displayOrder = 1;

      recipe.expGain = 40;
    }        
    if (item === ItemsEnum.NecklaceSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.SpecialHeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialCoolingMetal);
      recipe.displayOrder = 4;

      recipe.expGain = 40;
    }
    /*if (item === ItemsEnum.WeaponSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 5000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.SpecialHeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialCoolingMetal);
      recipe.displayOrder = 3;

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.ArmorSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.SpecialHeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialCoolingMetal);
      recipe.displayOrder = 2;

      recipe.expGain = 40;
    }*/
    /*if (item === ItemsEnum.ShieldSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.SpecialHeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.SpecialCoolingMetal);
      recipe.displayOrder = 5;

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.RutilatedRuby) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullRuby, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 12;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.RutilatedAquamarine) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullAquamarine, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 13;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.RutilatedOpal) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullOpal, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 14;

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.RutilatedTopaz) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullTopaz, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 15;

      recipe.expGain = 30;
    }
    if (item === ItemsEnum.RutilatedAmethyst) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullAmethyst, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 16;

      recipe.expGain = 30;
    }
    if (item === ItemsEnum.RutilatedEmerald) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.DullEmerald, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 1000));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.RareCombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);
      recipe.displayOrder = 17;

      recipe.expGain = 30;
    }*/

    return recipe;
  }

  getUpgradedItem(item: ItemsEnum) {
    var upgradedItem = item;

    if (item === ItemsEnum.CrackedRuby) {
      upgradedItem = ItemsEnum.PerfectCrackedRuby;
    }
    if (item === ItemsEnum.CrackedEmerald) {
      upgradedItem = ItemsEnum.PerfectCrackedEmerald;
    }
    if (item === ItemsEnum.CrackedAmethyst) {
      upgradedItem = ItemsEnum.PerfectCrackedAmethyst;
    }
    if (item === ItemsEnum.CrackedTopaz) {
      upgradedItem = ItemsEnum.PerfectCrackedTopaz;
    }
    if (item === ItemsEnum.CrackedOpal) {
      upgradedItem = ItemsEnum.PerfectCrackedOpal;
    }
    if (item === ItemsEnum.CrackedAquamarine) {
      upgradedItem = ItemsEnum.PerfectCrackedAquamarine;
    }

    if (item === ItemsEnum.PointedStone) {
      upgradedItem = ItemsEnum.PerfectPointedStone;
    }
    if (item === ItemsEnum.ShiningStone) {
      upgradedItem = ItemsEnum.PerfectShiningStone;
    }
    if (item === ItemsEnum.JaggedStone) {
      upgradedItem = ItemsEnum.PerfectJaggedStone;
    }
    if (item === ItemsEnum.BlessedStone) {
      upgradedItem = ItemsEnum.PerfectBlessedStone;
    }

    if (item === ItemsEnum.DullRuby) {
      upgradedItem = ItemsEnum.PerfectDullRuby;
    }
    if (item === ItemsEnum.DullEmerald) {
      upgradedItem = ItemsEnum.PerfectDullEmerald;
    }
    if (item === ItemsEnum.DullAmethyst) {
      upgradedItem = ItemsEnum.PerfectDullAmethyst;
    }
    if (item === ItemsEnum.DullTopaz) {
      upgradedItem = ItemsEnum.PerfectDullTopaz;
    }
    if (item === ItemsEnum.DullOpal) {
      upgradedItem = ItemsEnum.PerfectDullOpal;
    }
    if (item === ItemsEnum.DullAquamarine) {
      upgradedItem = ItemsEnum.PerfectDullAquamarine;
    }

    if (item === ItemsEnum.RadiatingHolyStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingHolyStone;
    }
    if (item === ItemsEnum.RadiatingLightningStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingLightningStone;
    }
    if (item === ItemsEnum.RadiatingFireStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingFireStone;
    }
    if (item === ItemsEnum.RadiatingAirStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingAirStone;
    }
    if (item === ItemsEnum.RadiatingEarthStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingEarthStone;
    }
    if (item === ItemsEnum.RadiatingWaterStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingWaterStone;
    }

    if (item === ItemsEnum.FlawedRuby) {
      upgradedItem = ItemsEnum.PerfectFlawedRuby;
    }
    if (item === ItemsEnum.FlawedEmerald) {
      upgradedItem = ItemsEnum.PerfectFlawedEmerald;
    }
    if (item === ItemsEnum.FlawedAmethyst) {
      upgradedItem = ItemsEnum.PerfectFlawedAmethyst;
    }
    if (item === ItemsEnum.FlawedTopaz) {
      upgradedItem = ItemsEnum.PerfectFlawedTopaz;
    }
    if (item === ItemsEnum.FlawedOpal) {
      upgradedItem = ItemsEnum.PerfectFlawedOpal;
    }
    if (item === ItemsEnum.FlawedAquamarine) {
      upgradedItem = ItemsEnum.PerfectFlawedAquamarine;
    }

    return upgradedItem;
  }
}
