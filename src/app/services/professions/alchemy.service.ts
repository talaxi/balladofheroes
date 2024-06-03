import { Injectable } from '@angular/core';
import { ProfessionActionsEnum } from 'src/app/models/enums/profession-actions-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';
import { DictionaryService } from '../utility/dictionary.service';
import { TutorialService } from '../global/tutorial.service';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';

@Injectable({
  providedIn: 'root'
})
export class AlchemyService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService, private dictionaryService: DictionaryService, private tutorialService: TutorialService) { }



  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AsphodelPalaceOfHades) {
      var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
      if (alchemy !== undefined && !alchemy.isUnlocked) {
        alchemy.isUnlocked = true;
        alchemy.level = 1;
        alchemy.maxLevel += this.utilityService.firstAlchemyLevelCap;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Alchemy,  undefined, undefined, true, subzone), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }
    }
  }

  getActionLength(action: ProfessionActionsEnum) {
    var duration = 0;

    if (action === ProfessionActionsEnum.PrepareWaterSmallPot)
      duration = 1 * 20;
    if (action === ProfessionActionsEnum.CombineIngredientsPot)
      duration = 1 * 10;
      if (action === ProfessionActionsEnum.RareCombineIngredientsPot)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.CombineIngredientsPotion)
      duration = 1 * 15;
      if (action === ProfessionActionsEnum.RareCombineIngredientsPotion)
      duration = 1 * 45;
    if (action === ProfessionActionsEnum.HeatMixture)
      duration = 1 * 30;
    if (action === ProfessionActionsEnum.CrushIngredients)
      duration = 1 * 75;
      if (action === ProfessionActionsEnum.RareCrushIngredients)
      duration = 1 * 115;
    if (action === ProfessionActionsEnum.CombineIngredients)
      duration = 1 * 15;
    if (action === ProfessionActionsEnum.MixOil)
      duration = 1 * 10;
    if (action === ProfessionActionsEnum.MeltWax)
      duration = 1 * 20;
    if (action === ProfessionActionsEnum.StrainMixture)
      duration = 1 * 10;
    if (action === ProfessionActionsEnum.ExtractEssence)
      duration = 1 * 45;
    if (action === ProfessionActionsEnum.Infuse)
      duration = 1 * 60;
    if (action === ProfessionActionsEnum.StoreIngredients)
      duration = 1 * 5;
      if (action === ProfessionActionsEnum.Transmutate)
      duration = 3 * 60;

    return duration;
  }

  doesUserHaveRecipe(item: ItemsEnum) {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return false;

    return alchemy.availableRecipeItems.some(availableItem => item === availableItem);
  }

  learnRecipe(item: ItemsEnum) {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return;

    if (!alchemy.availableRecipeItems.some(availableItem => item === availableItem))
      alchemy.availableRecipeItems.push(item);
  }

  checkForNewRecipes() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return;
    var newRecipeLearned = false;

    if (alchemy.level >= 1) {
      if (!this.doesUserHaveRecipe(ItemsEnum.HealingPoultice)) {
        this.learnRecipe(ItemsEnum.HealingPoultice);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HealingPoultice);
      }
    }
    if (alchemy.level >= 2) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ExplodingPotion)) {
        this.learnRecipe(ItemsEnum.ExplodingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ExplodingPotion);
      }
    }
    if (alchemy.level >= 4) {
      if (!this.doesUserHaveRecipe(ItemsEnum.DebilitatingToxin)) {
        this.learnRecipe(ItemsEnum.DebilitatingToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DebilitatingToxin);
      }
    }
    if (alchemy.level >= 7) {
      if (!this.doesUserHaveRecipe(ItemsEnum.HealingSalve)) {
        this.learnRecipe(ItemsEnum.HealingSalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HealingSalve);
      }
    }
    if (alchemy.level >= 10) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FirePotion)) {
        this.learnRecipe(ItemsEnum.FirePotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FirePotion);
      }
    }
    if (alchemy.level >= 15) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PoisonousToxin)) {
        this.learnRecipe(ItemsEnum.PoisonousToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PoisonousToxin);
      }
    }
    if (alchemy.level >= 20) {
      if (!this.doesUserHaveRecipe(ItemsEnum.StranglingGasPotion)) {
        this.learnRecipe(ItemsEnum.StranglingGasPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.StranglingGasPotion);
      }
    }

    if (alchemy.level >= 22) {
      if (!this.doesUserHaveRecipe(ItemsEnum.SoulEssence)) {
        this.learnRecipe(ItemsEnum.SoulEssence);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SoulEssence);
      }
    }
    if (alchemy.level >= 25) {
      if (!this.doesUserHaveRecipe(ItemsEnum.SatchelOfHerbs)) {
        this.learnRecipe(ItemsEnum.SatchelOfHerbs);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SatchelOfHerbs);
      }
    }
    if (alchemy.level >= 26) {
      if (!this.doesUserHaveRecipe(ItemsEnum.UnstablePotion)) {
        this.learnRecipe(ItemsEnum.UnstablePotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.UnstablePotion);
      }
    }
    if (alchemy.level >= 27) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElixirOfFortitude)) {
        this.learnRecipe(ItemsEnum.ElixirOfFortitude);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfFortitude);
      }
    }
    if (alchemy.level >= 29) {
      if (!this.doesUserHaveRecipe(ItemsEnum.WitheringToxin)) {
        this.learnRecipe(ItemsEnum.WitheringToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.WitheringToxin);
      }
    }
    if (alchemy.level >= 32) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RestorativePoultice)) {
        this.learnRecipe(ItemsEnum.RestorativePoultice);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RestorativePoultice);
      }
    }
    if (alchemy.level >= 35) {
      if (!this.doesUserHaveRecipe(ItemsEnum.BoomingPotion)) {
        this.learnRecipe(ItemsEnum.BoomingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BoomingPotion);
      }
    }
    if (alchemy.level >= 40) {
      if (!this.doesUserHaveRecipe(ItemsEnum.VenomousToxin)) {
        this.learnRecipe(ItemsEnum.VenomousToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.VenomousToxin);
      }
    }
    if (alchemy.level >= 45) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RestorativeSalve)) {
        this.learnRecipe(ItemsEnum.RestorativeSalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RestorativeSalve);
      }
    }
    if (alchemy.level >= 50) {
      if (!this.doesUserHaveRecipe(ItemsEnum.BushelOfHerbs)) {
        this.learnRecipe(ItemsEnum.BushelOfHerbs);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BushelOfHerbs);
      }
    }
    if (alchemy.level >= 51) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElixirOfSpeed)) {
        this.learnRecipe(ItemsEnum.ElixirOfSpeed);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfSpeed);
      }
    }    
    if (alchemy.level >= 52) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PotentEssence)) {
        this.learnRecipe(ItemsEnum.PotentEssence);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PotentEssence);
      }
    }
    if (alchemy.level >= 54) {
      if (!this.doesUserHaveRecipe(ItemsEnum.HoneyPoultice)) {
        this.learnRecipe(ItemsEnum.HoneyPoultice);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HoneyPoultice);
      }
    }    
    if (alchemy.level >= 55) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PiercingPotion)) {
        this.learnRecipe(ItemsEnum.PiercingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PiercingPotion);
      }
    }
    if (alchemy.level >= 57) {
      if (!this.doesUserHaveRecipe(ItemsEnum.FlamingToxin)) {
        this.learnRecipe(ItemsEnum.FlamingToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FlamingToxin);
      }
    }
    if (alchemy.level >= 65) {
      if (!this.doesUserHaveRecipe(ItemsEnum.SlowingPotion)) {
        this.learnRecipe(ItemsEnum.SlowingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SlowingPotion);
      }
    }
    if (alchemy.level >= 70) {
      if (!this.doesUserHaveRecipe(ItemsEnum.HoneySalve)) {
        this.learnRecipe(ItemsEnum.HoneySalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HoneySalve);
      }
    }
    if (alchemy.level >= 75) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ParalyzingToxin)) {
        this.learnRecipe(ItemsEnum.ParalyzingToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ParalyzingToxin);
      }
    }
    if (alchemy.level >= 76) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElixirOfFortune)) {
        this.learnRecipe(ItemsEnum.ElixirOfFortune);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfFortune);
      }
    }
    if (alchemy.level >= 80) {
      if (!this.doesUserHaveRecipe(ItemsEnum.BouncingPotion)) {
        this.learnRecipe(ItemsEnum.BouncingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BouncingPotion);
      }
    }
    if (alchemy.level >= 82) {
      if (!this.doesUserHaveRecipe(ItemsEnum.SandToxin)) {
        this.learnRecipe(ItemsEnum.SandToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SandToxin);
      }
    }    
    if (alchemy.level >= 85) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MagicSalve)) {
        this.learnRecipe(ItemsEnum.MagicSalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MagicSalve);
      }
    }
    if (alchemy.level >= 90) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElectrifiedToxin)) {
        this.learnRecipe(ItemsEnum.ElectrifiedToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElectrifiedToxin);
      }
    }
    if (alchemy.level >= 95) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MagicRevivify)) {
        this.learnRecipe(ItemsEnum.MagicRevivify);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MagicRevivify);
      }
    }
    if (alchemy.level >= 100) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MagicToxin)) {
        this.learnRecipe(ItemsEnum.MagicToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MagicToxin);
      }
    }
    if (alchemy.level >= 101) {
      if (!this.doesUserHaveRecipe(ItemsEnum.TidalToxin)) {
        this.learnRecipe(ItemsEnum.TidalToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.TidalToxin);
      }
    }
    if (alchemy.level >= 105) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PeonyPoultice)) {
        this.learnRecipe(ItemsEnum.PeonyPoultice);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PeonyPoultice);
      }
    }
    if (alchemy.level >= 107) {
      if (!this.doesUserHaveRecipe(ItemsEnum.WildPotion)) {
        this.learnRecipe(ItemsEnum.WildPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.WildPotion);
      }
    }    
    if (alchemy.level >= 110) {
      if (!this.doesUserHaveRecipe(ItemsEnum.PeonySalve)) {
        this.learnRecipe(ItemsEnum.PeonySalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PeonySalve);
      }
    }
    if (alchemy.level >= 115) {
      if (!this.doesUserHaveRecipe(ItemsEnum.UnsteadyingToxin)) {
        this.learnRecipe(ItemsEnum.UnsteadyingToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.UnsteadyingToxin);
      }
    }
    if (alchemy.level >= 120) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElixirOfWill)) {
        this.learnRecipe(ItemsEnum.ElixirOfWill);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfWill);
      }
    }
    if (alchemy.level >= 125) {
      if (!this.doesUserHaveRecipe(ItemsEnum.AgonizingToxin)) {
        this.learnRecipe(ItemsEnum.AgonizingToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.AgonizingToxin);
      }
    }
    
    if (alchemy.level >= 126) {
      if (!this.doesUserHaveRecipe(ItemsEnum.TempestToxin)) {
        this.learnRecipe(ItemsEnum.TempestToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.TempestToxin);
      }
    }
    if (alchemy.level >= 130) {
      if (!this.doesUserHaveRecipe(ItemsEnum.InkPoultice)) {
        this.learnRecipe(ItemsEnum.InkPoultice);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.InkPoultice);
      }
    }
    if (alchemy.level >= 132) {
      if (!this.doesUserHaveRecipe(ItemsEnum.BurstingPotion)) {
        this.learnRecipe(ItemsEnum.BurstingPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BurstingPotion);
      }
    }    
    if (alchemy.level >= 135) {
      if (!this.doesUserHaveRecipe(ItemsEnum.MetalElixir)) {
        this.learnRecipe(ItemsEnum.MetalElixir);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MetalElixir);
      }
    }
    if (alchemy.level >= 140) {
      if (!this.doesUserHaveRecipe(ItemsEnum.LightToxin)) {
        this.learnRecipe(ItemsEnum.LightToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.LightToxin);
      }
    }
    if (alchemy.level >= 145) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ElixirOfPower)) {
        this.learnRecipe(ItemsEnum.ElixirOfPower);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfPower);
      }
    }
    if (alchemy.level >= 150) {
      if (!this.doesUserHaveRecipe(ItemsEnum.Transmutation)) {
        this.learnRecipe(ItemsEnum.Transmutation);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.Transmutation);
      }
    }
    
    if (alchemy.level >= 151) {
      if (!this.doesUserHaveRecipe(ItemsEnum.CorrosiveToxin)) {
        this.learnRecipe(ItemsEnum.CorrosiveToxin);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CorrosiveToxin);
      }
    }
    if (alchemy.level >= 155) {
      if (!this.doesUserHaveRecipe(ItemsEnum.InkSalve)) {
        this.learnRecipe(ItemsEnum.InkSalve);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.InkSalve);
      }
    }
    if (alchemy.level >= 157) {
      if (!this.doesUserHaveRecipe(ItemsEnum.ShatteringPotion)) {
        this.learnRecipe(ItemsEnum.ShatteringPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ShatteringPotion);
      }
    }    
    if (alchemy.level >= 160) {
      if (!this.doesUserHaveRecipe(ItemsEnum.RestorativeElixir)) {
        this.learnRecipe(ItemsEnum.RestorativeElixir);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RestorativeElixir);
      }
    }
    if (alchemy.level >= 168) {
      if (!this.doesUserHaveRecipe(ItemsEnum.EndlessPotion)) {
        this.learnRecipe(ItemsEnum.EndlessPotion);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.EndlessPotion);
      }
    }
    if (alchemy.level >= 175) {
      if (!this.doesUserHaveRecipe(ItemsEnum.Extraction)) {
        this.learnRecipe(ItemsEnum.Extraction);
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.Extraction);
      }
    }

    return newRecipeLearned;
  }

  getLevelUpReward() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return;

    var upgrades: ProfessionUpgrades | undefined = undefined;
    var additionalChanceTo2x = .05;
    var additionalChanceTo5x = .025;
    var additionalChanceToRetainMaterials = .05;
    var additionalDurationReduction = .04;

    var qualityName = "";

    if (alchemy.level <= 25)
    {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);
      qualityName = "Basic";
    }
    else if (alchemy.level <= 50) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);
      qualityName = "Uncommon";
    }
    else if (alchemy.level <= 75) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Rare);
      qualityName = "Rare";
    }
    else if (alchemy.level <= 100) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Epic);
      qualityName = "Epic";
    }
    else if (alchemy.level <= 125) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Special);
      qualityName = "Special";
    }
    else if (alchemy.level <= 150) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Unique);
      qualityName = "Unique";
    }
    else if (alchemy.level <= 175) {
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Extraordinary);
      qualityName = "Extraordinary";
    }

    if (upgrades === undefined)
      return;

    if (alchemy.level % 25 === 3 || alchemy.level % 25 === 6 ||
      alchemy.level % 25 === 11 || alchemy.level % 25 === 14 ||
      alchemy.level % 25 === 16 || alchemy.level % 25 === 23) {
      upgrades.chanceTo2xItem += additionalChanceTo2x;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo2x * 100) + "%</strong> chance to make 2x as many items when making " + (qualityName === "Uncommon" || qualityName === "Epic" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (alchemy.level % 25 === 5 || alchemy.level % 25 === 8 ||
      alchemy.level % 25 === 13 || alchemy.level % 25 === 19 ||
      alchemy.level % 25 === 21) {
      upgrades.durationReduction += additionalDurationReduction;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "The time it takes to create " + (qualityName === "Uncommon" || qualityName === "Epic" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Alchemy Recipe is reduced by <strong>" + (additionalDurationReduction * 100) + "%</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (alchemy.level % 25 === 9 || alchemy.level % 25 === 12 ||
      alchemy.level % 25 === 17 || alchemy.level % 25 === 22 ||
      alchemy.level % 25 === 24) {
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToRetainMaterials * 100) + "%</strong> chance to retain your ingredients when making " + (qualityName === "Uncommon" || qualityName === "Epic" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
      }
    }

    if (alchemy.level % 25 === 18 || alchemy.level % 25 === 0) {
      upgrades.chanceTo5xItem += additionalChanceTo5x;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo5x * 100) + "%</strong> chance to make 5x as many items when making " + (qualityName === "Uncommon" || qualityName === "Epic" || qualityName === "Extraordinary" ? "an" : "a" ) + " " + qualityName + " quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
      }
    }

  }

  updateGameLogWithNewRecipe(type: ItemsEnum) {
    if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
      var gameLogEntry = "You learn how to make the Alchemy recipe: <strong>" + this.dictionaryService.getItemName(type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.HealingPoultice) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.ExplodingPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 8;
    }

    if (item === ItemsEnum.DebilitatingToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.HealingSalve) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HealingHerb, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Wax, 2));

      recipe.numberOfSteps = 4;
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.FirePotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 14;
    }
    if (item === ItemsEnum.PoisonousToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, 3));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 15;
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, 3));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 15;
    }
    if (item === ItemsEnum.SatchelOfHerbs) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Violet, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredients);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.SoulEssence) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SpiritEssence, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PoisonFang, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.HeroicElixir) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs, 2));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.RejuvenatingElixir) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Violet, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }
    //lvl 26
    if (item === ItemsEnum.UnstablePotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 20;
    }
    //lvl 27
    if (item === ItemsEnum.ElixirOfFortitude) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 20;
    }
    //lvl 29
    if (item === ItemsEnum.WitheringToxin) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 23;
    }
    //lvl 32
    if (item === ItemsEnum.RestorativePoultice) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 25;
    }
    //lvl 35
    if (item === ItemsEnum.BoomingPotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 25;
    }
    //lvl 40
    if (item === ItemsEnum.VenomousToxin) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort, 3));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 25;
    }
    //lvl 45
    if (item === ItemsEnum.RestorativeSalve) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Sorrel, 1));

      recipe.numberOfSteps = 4;
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 28;
    }
    if (item === ItemsEnum.BushelOfHerbs) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Sorrel, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredients);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.FocusPotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }
    //lvl 51
    if (item === ItemsEnum.ElixirOfSpeed) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 32;
    }
    //lvl 52
    if (item === ItemsEnum.PiercingPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PotentEssence, 2));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SmallAnimalBones, 2));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 34;
    }
    //lvl 54
    if (item === ItemsEnum.HoneyPoultice) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Honey, 2));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPot);

      recipe.expGain = 34;
    }
    //lvl 55
    if (item === ItemsEnum.PotentEssence) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, 1));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfWater, 1));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 32;
    }
    //lvl 57
    if (item === ItemsEnum.FlamingToxin) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, 4));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ToxicIchor, 1));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 34;
    }
    //lvl 65
    if (item === ItemsEnum.SlowingPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.CanineFang, 2));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 37;
    }
    //lvl 70
    if (item === ItemsEnum.HoneySalve) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PristineCrabClaw, 1));

      recipe.numberOfSteps = 4;
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 37;
    }
    //lvl 75
    if (item === ItemsEnum.ParalyzingToxin) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ToxicIchor, 4));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.PotentConcoction) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PotentEssence, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfWater, 2));            
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 2));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.EarthAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfEarth, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.FireAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.WaterAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfWater, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.AirAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfAir, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.LightningAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfLightning, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }
    if (item === ItemsEnum.HolyAbsorptionPotion) {
      recipe.quality = EquipmentQualityEnum.Rare;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicCore, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfHoly, 3));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 40;
    }    
    //lvl 76
    if (item === ItemsEnum.ElixirOfFortune) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 3));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 45;
    }
    //lvl 78
    if (item === ItemsEnum.BouncingPotion) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PotentEssence, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfAir, 2));            
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 45;
    }    
    //lvl 82
    if (item === ItemsEnum.SandToxin) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfEarth, 4));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 48;
    }     
    //lvl 88
    if (item === ItemsEnum.MagicSalve) {
      recipe.quality = EquipmentQualityEnum.Epic;      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs, 4));    

      recipe.numberOfSteps = 4;      
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPot);

      recipe.expGain = 48;
    }
    //lvl 88
    if (item === ItemsEnum.ElectrifiedToxin) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfLightning, 4));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 48;
    }
    //lvl 88
    if (item === ItemsEnum.MagicRevivify) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PotentEssence, 1));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicDust, 1));      

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.Infuse);

      recipe.expGain = 50;
    }
    //lvl 88
    if (item === ItemsEnum.MagicToxin) {
      recipe.quality = EquipmentQualityEnum.Epic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicDust, 3));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 55;
    }
    if (item === ItemsEnum.TidalToxin) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MagicDust, 2));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 75;
    }
    if (item === ItemsEnum.PeonyPoultice) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Peony, 4));    

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPot);

      recipe.expGain = 80;
    }
    if (item === ItemsEnum.WildPotion) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.UnstableElement, 2));      

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 80;
    }
    if (item === ItemsEnum.PeonySalve) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Peony, 2));    
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Mandrake, 2));      

      recipe.numberOfSteps = 4;      
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPot);

      recipe.expGain = 90;
    }
    if (item === ItemsEnum.UnsteadyingToxin) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.UnstableElement, 1));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 95;
    }
    if (item === ItemsEnum.ElixirOfWill) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Mandrake, 2));            

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 95;
    }
    if (item === ItemsEnum.AgonizingToxin) {
      recipe.quality = EquipmentQualityEnum.Special;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ColossalRoot, 1));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 100;
    }    
    if (item === ItemsEnum.TempestToxin) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SpiderSilk, 2));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 110;
    }    
    if (item === ItemsEnum.InkPoultice) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SquidInk, 2));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 115;
    }
    if (item === ItemsEnum.BurstingPotion) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PureEnergy, 2));      

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 125;
    }
    if (item === ItemsEnum.MetalElixir) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfForeignWaters, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MisshapenMetalPiece, 2));            

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 135;
    }
    if (item === ItemsEnum.LightToxin) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 3));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 140;
    }   
    if (item === ItemsEnum.ElixirOfPower) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ImmortalScales, 1));            

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 145;
    }
    if (item === ItemsEnum.Transmutation) {
      recipe.quality = EquipmentQualityEnum.Unique;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 3000));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.ImmortalScales, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.InfiniteEssence, 1)); 
      recipe.ingredients.push(new ResourceValue(ItemsEnum.MetalCore, 5));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 150;
    } 
    if (item === ItemsEnum.CorrosiveToxin) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 1));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SpiderSilk, 1));      

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 160;
    }  
    if (item === ItemsEnum.InkSalve) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SquidInk, 2));    
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Passionflower, 2));      

      recipe.numberOfSteps = 4;      
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPot);

      recipe.expGain = 175;
    }
    if (item === ItemsEnum.ShatteringPotion) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PureEnergy, 2));      

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 185;
    }
    if (item === ItemsEnum.RestorativeElixir) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Passionflower, 2));            

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 190;
    }
    if (item === ItemsEnum.EndlessPotion) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTartaranFlames, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.InfiniteEssence, 2));      

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);
      recipe.steps.push(ProfessionActionsEnum.RareCombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 200;
    }
    if (item === ItemsEnum.Extraction) {
      recipe.quality = EquipmentQualityEnum.Extraordinary;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 20000));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.InfiniteEssence, 25)); 

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.RareCrushIngredients);

      recipe.expGain = 250;
    } 
    
    if (this.globalService.globalVar.isSubscriber)
      recipe.expGain *= 2;

    return recipe;
  }
}