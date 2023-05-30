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
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Jewelcrafting, undefined, undefined, true, subzone));
      }
    }
  }

  getActionLength(action: ProfessionActionsEnum) {
    var duration = 0;    

    if (action === ProfessionActionsEnum.CombiningGems)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.Polish)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.HeatingMetal)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.ShapingMetal)
      duration = 2 * 60;
    if (action === ProfessionActionsEnum.CoolingMetal)
      duration = 1 * 60;

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

    if (upgrades === undefined)
      return;

    if (jewelcrafting.level % 25 === 3 || jewelcrafting.level % 25 === 6 ||
      jewelcrafting.level % 25 === 11 || jewelcrafting.level % 25 === 14 ||
      jewelcrafting.level % 25 === 16 || jewelcrafting.level % 25 === 23) {
      upgrades.chanceForUpgrade += additionalChanceToUpgrade;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToUpgrade * 100) + "%</strong> chance to to gain an upgraded gem when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 5 || jewelcrafting.level % 25 === 8 ||
      jewelcrafting.level % 25 === 13 || jewelcrafting.level % 25 === 19 ||
      jewelcrafting.level % 25 === 21) {
      upgrades.durationReduction += additionalDurationReduction;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "The time it takes to create " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Jewelcrafting Recipe is reduced by <strong>" + (additionalDurationReduction * 100) + "%</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 9 || jewelcrafting.level % 25 === 12 ||
      jewelcrafting.level % 25 === 17 || jewelcrafting.level % 25 === 22 ||
      jewelcrafting.level % 25 === 24) {
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToRetainMaterials * 100) + "%</strong> chance to retain your ingredients when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 18 || jewelcrafting.level % 25 === 0) {
      upgrades.chanceToHalfDuration += additionalChanceToHalfDuration;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToHalfDuration * 100) + "%</strong> chance to reduce crafting time by half when making " + (qualityName === "Uncommon" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

  }

  updateGameLogWithNewRecipe(type: ItemsEnum) {
    if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
      var gameLogEntry = "You learn how to make the Jewelcrafting recipe: <strong>" + this.dictionaryService.getItemName(type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
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

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.CrackedAquamarine) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.CrackedOpal) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.CrackedTopaz) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.CrackedAmethyst) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.CrackedEmerald) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.MinorWeaponSlotAddition) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 2000));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.HeatingMetal);
      recipe.steps.push(ProfessionActionsEnum.ShapingMetal);
      recipe.steps.push(ProfessionActionsEnum.CoolingMetal);

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

      recipe.expGain = 20;
    }
    if (item === ItemsEnum.DullRuby) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedRuby, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.DullAquamarine) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedAquamarine, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.DullOpal) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedOpal, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.DullTopaz) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedTopaz, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.DullAmethyst) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedAmethyst, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.DullEmerald) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      //recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 12));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CrackedEmerald, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 500));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 16;
    }
    if (item === ItemsEnum.RadiatingLightningStone) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.RadiatingHolyStone) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 10));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 800));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 18;
    }

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
    if (item === ItemsEnum.RadiatingEarthStone) {
      upgradedItem = ItemsEnum.PerfectRadiatingEarthStone;
    }

    return upgradedItem;
  }
}
