import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ResourceGeneratorService } from 'src/app/services/resources/resource-generator.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { StoryService } from 'src/app/services/story/story.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Uniques } from 'src/app/models/resources/uniques.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GameLogService } from 'src/app/services/battle/game-log.service';

@Component({
  selector: 'app-shopping-item-view',
  templateUrl: './shopping-item-view.component.html',
  styleUrls: ['./shopping-item-view.component.css']
})
export class ShoppingItemViewComponent implements OnInit {
  @Input() item: ShopItem;
  itemDescription = "";
  purchaseResourcesRequired: string = "";
  partyMembers: Character[];
  subscription: any;
  outOfStock: boolean = false;
  @Input() tooltipDirection = DirectionEnum.Right;
  @Input() excludeItemDescriptionLocationText = false;
  @Input() totalItemsInShop = 0;
  buyMultiplier: number = 1;

  constructor(public lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService,
    private utilityService: UtilityService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private deviceDetectorService: DeviceDetectorService, public dictionaryService: DictionaryService, public dialog: MatDialog,
    private storyService: StoryService, private battleService: BattleService, private tutorialService: TutorialService,
    private balladService: BalladService, private gameLogService: GameLogService) { }

  ngOnInit(): void {
    this.partyMembers = this.globalService.getActivePartyCharacters(true);
    this.itemDescription = this.lookupService.getItemDescription(this.item.shopItem, undefined, false, this.excludeItemDescriptionLocationText);
    this.setItemPurchasePrice();
    this.outOfStock = this.isItemOutOfStock();

    if (this.deviceDetectorService.isMobile())
      this.tooltipDirection = DirectionEnum.Down;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.setItemPurchasePrice();
      this.outOfStock = this.isItemOutOfStock();
    });
  }

  cannotMultiply() {
    var cannotMultiply = false;

    if (this.item.shopItem === ItemsEnum.WarriorClass || this.item.shopItem === ItemsEnum.PriestClass || this.item.shopItem === ItemsEnum.ThaumaturgeClass ||
      this.item.shopItem === ItemsEnum.MonkClass || this.item.shopItem === ItemsEnum.AugeanStables1 || this.item.shopItem === ItemsEnum.AugeanStables2 ||
      this.item.shopItem === ItemsEnum.AugeanStables3 || this.item.shopItem === ItemsEnum.Nemesis || this.item.shopItem === ItemsEnum.Dionysus ||
      this.item.shopItem === ItemsEnum.OlympicCommendation || this.item.shopItem === ItemsEnum.DarkMoonPendantUnique || this.item.shopItem === ItemsEnum.BlazingSunPendantUnique ||
      this.item.shopItem === ItemsEnum.AthenasSigil || this.item.shopItem === ItemsEnum.ArtemissSigil || this.item.shopItem === ItemsEnum.HermessSigil ||
      this.item.shopItem === ItemsEnum.ApollosSigil || this.item.shopItem === ItemsEnum.AressSigil || this.item.shopItem === ItemsEnum.HadessSigil ||
      this.item.shopItem === ItemsEnum.DionysussSigil || this.item.shopItem === ItemsEnum.NemesissSigil || this.item.shopItem === ItemsEnum.ZeussSigil ||
      this.item.shopItem === ItemsEnum.PoseidonsSigil || this.item.shopItem === ItemsEnum.AphroditesSigil || this.item.shopItem === ItemsEnum.HerasSigil ||
      this.item.shopItem === ItemsEnum.CirceAlchemy)
      cannotMultiply = true;

    return cannotMultiply;
  }

  isItemOutOfStock() {
    var outOfStock = false;

    if (this.item.shopItem === ItemsEnum.WarriorClass && this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.PriestClass && this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AugeanStables1 && this.globalService.globalVar.sidequestData.augeanStablesLevel >= 1)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AugeanStables2 && this.globalService.globalVar.sidequestData.augeanStablesLevel >= 2)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AugeanStables3 && this.globalService.globalVar.sidequestData.augeanStablesLevel >= 3)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.CirceAlchemy && this.globalService.globalVar.sidequestData.circeAlchemyLevel >= 1)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.Nemesis && this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.Dionysus && this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.OlympicCommendation && this.lookupService.getResourceAmount(ItemsEnum.OlympicCommendation) >= 5)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.MonkClass && this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Monk)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.ThaumaturgeClass && this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Thaumaturge)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.DarkMoonPendantUnique && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DarkMoonPendantUnique))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.BlazingSunPendantUnique && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.BlazingSunPendantUnique))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.BlazingSunPendantUniqueUpgrade && this.globalService.globalVar.uniques.some(item => item.type === ItemsEnum.BlazingSunPendantUnique && item.level >= 1000))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.DarkMoonPendantUniqueUpgrade && this.globalService.globalVar.uniques.some(item => item.type === ItemsEnum.DarkMoonPendantUnique && item.level >= 1000))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AthenasSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AthenasSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.ArtemissSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ArtemissSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.HermessSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HermessSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.ApollosSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ApollosSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AressSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AressSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.HadessSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HadessSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.NemesissSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.NemesissSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.DionysussSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DionysussSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.ZeussSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ZeussSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.PoseidonsSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.PoseidonsSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.AphroditesSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AphroditesSigil))
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.HerasSigil && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HerasSigil))
      outOfStock = true;

    return outOfStock;
  }

  setItemPurchasePrice() {
    this.buyMultiplier = this.utilityService.shopBuyMultiplier;
    if (this.cannotMultiply())
      this.buyMultiplier = 1;

    this.purchaseResourcesRequired = "";
    if (this.item.purchasePrice.some(item => item.item === ItemsEnum.Ambrosia)) {
      this.item.purchasePrice = this.item.purchasePrice.filter(item => item.item !== ItemsEnum.Coin);
    }

    this.item.purchasePrice.forEach(resource => {
      var amount = resource.amount;
      if (this.item.shopItem === ItemsEnum.SparringMatch) {
        amount = 0;
        var currentMultiplier = this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
        for (var i = 0; i < this.buyMultiplier; i++) {
          amount += resource.amount * currentMultiplier;
          currentMultiplier *= 1.1;
        }
      }
      else {
        amount *= this.buyMultiplier;
      }

      var displayName = this.dictionaryService.getItemName(resource.item);
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      //var insufficientText = "";
      //if (userResourceAmount < resource.amount)
      var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

      this.purchaseResourcesRequired += "<span class='" + this.getItemKeywordClass(this.lookupService.getItemTypeFromItemEnum(resource.item), resource.item, amount, userResourceAmount) + "'>" + (amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";
    });

    if (this.purchaseResourcesRequired.length > 0) {
      this.purchaseResourcesRequired = this.utilityService.getSanitizedHtml(this.purchaseResourcesRequired);
    }
  }

  getItemKeywordClass(type: ItemTypeEnum, item: ItemsEnum, amountNeeded: number, amountOwned: number) {
    var classText = "resourceKeyword";

    if (amountOwned < amountNeeded)
      classText = "insufficientResourcesKeyword";

    return classText;
  }

  buyItem() {
    if (this.canBuyItem()) {
      this.spendResourcesOnItem();
      var resource = this.resourceGeneratorService.getResourceFromItemType(this.item.shopItem, 1 * this.buyMultiplier);

      if (resource !== undefined) {
        if (resource.item === ItemsEnum.SparringMatch) {
          for (var i = 0; i < this.buyMultiplier; i++) {
            this.globalService.giveCharactersBonusExp(5000);
            this.globalService.globalVar.sidequestData.sparringMatchMultiplier *= 1.1;
          }
          /*this.globalService.globalVar.uniques.forEach(item => {
            item.level += 99;
            this.lookupService.levelUpUnique(item);
          });*/
        }
        else if (resource.item === ItemsEnum.DarkMoonPendantUniqueUpgrade) {
          for (var i = 0; i < this.buyMultiplier; i++) {
            var unique = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.DarkMoonPendantUnique);
            if (unique !== undefined)
              this.lookupService.giveUniqueXp(unique, 1);
          }
        }
        else if (resource.item === ItemsEnum.BlazingSunPendantUniqueUpgrade) {
          for (var i = 0; i < this.buyMultiplier; i++) {
            var unique = this.globalService.globalVar.uniques.find(item => item.type === ItemsEnum.BlazingSunPendantUnique);
            if (unique !== undefined)
              this.lookupService.giveUniqueXp(unique, 1);
          }
        }
        else if (resource.item === ItemsEnum.WarriorClass || resource.item === ItemsEnum.PriestClass || resource.item === ItemsEnum.MonkClass || resource.item === ItemsEnum.ThaumaturgeClass) {
          this.unlockClass(resource.item);
        }
        else if (resource.item === ItemsEnum.Nemesis || resource.item === ItemsEnum.Dionysus) {
          this.unlockGod(resource.item);
        }
        else if (resource.item === ItemsEnum.AugeanStables1 || resource.item === ItemsEnum.AugeanStables2) {
          var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
          if (jewelcrafting !== undefined) {
            jewelcrafting.maxLevel += 10;
            this.globalService.globalVar.sidequestData.augeanStablesLevel += 1;
            this.dialog.closeAll();

            if (resource.item === ItemsEnum.AugeanStables1) {
              this.storyService.displayOptionalScene(OptionalSceneEnum.AugeanStables2);
              this.battleService.checkScene();
            }
            else {
              this.storyService.displayOptionalScene(OptionalSceneEnum.AugeanStables4);
              this.battleService.checkScene();
            }
          }
        }
        else if (resource.item === ItemsEnum.AugeanStables3) {
          var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
          if (jewelcrafting !== undefined) {
            jewelcrafting.maxLevel += 5;
            this.globalService.globalVar.sidequestData.augeanStablesLevel += 1;
            this.dialog.closeAll();
            this.storyService.displayOptionalScene(OptionalSceneEnum.AugeanStables6);
            this.battleService.checkScene();
          }
        }
        else if (resource.item === ItemsEnum.CirceAlchemy) {
          var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined) {
            alchemy.maxLevel += 25;
            this.globalService.globalVar.sidequestData.circeAlchemyLevel += 1;
            this.dialog.closeAll();

            this.storyService.displayOptionalScene(OptionalSceneEnum.CirceAlchemy2);
            this.battleService.checkScene();
          }
        }
        else
          if (resource.item === ItemsEnum.DarkMoonPendantUnique || resource.item === ItemsEnum.BlazingSunPendantUnique) {
            this.globalService.globalVar.uniques.push(new Uniques(resource.item));

            if (!this.globalService.globalVar.logData.some(item => item.type === LogViewEnum.Tutorials && item.relevantEnumValue === TutorialTypeEnum.Uniques)) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Uniques, undefined, undefined, true, this.balladService.getActiveSubZone()?.type), this.globalService.globalVar);
              this.globalService.handleTutorialModal();
            }
          }

        this.lookupService.gainResource(resource);
      }
    }
  }

  getCurrentlyOwnedAmount() {
    if (this.item.shopItem === ItemsEnum.WarriorClass && this.globalService.globalVar.characters.some(item => item.type === CharacterEnum.Warrior && item.isAvailable))
      return 1;
    if (this.item.shopItem === ItemsEnum.PriestClass && this.globalService.globalVar.characters.some(item => item.type === CharacterEnum.Priest && item.isAvailable))
      return 1;
    if (this.item.shopItem === ItemsEnum.MonkClass && this.globalService.globalVar.characters.some(item => item.type === CharacterEnum.Monk && item.isAvailable))
      return 1;
    if (this.item.shopItem === ItemsEnum.ThaumaturgeClass && this.globalService.globalVar.characters.some(item => item.type === CharacterEnum.Thaumaturge && item.isAvailable))
      return 1;
    if (this.item.shopItem === ItemsEnum.Nemesis && this.globalService.globalVar.gods.some(item => item.type === GodEnum.Nemesis && item.isAvailable))
      return 1;
    if (this.item.shopItem === ItemsEnum.Dionysus && this.globalService.globalVar.gods.some(item => item.type === GodEnum.Dionysus && item.isAvailable))
      return 1;

    return this.lookupService.getResourceAmountIgnoreExtras(this.item.shopItem).toLocaleString();
  }

  unlockClass(item: ItemsEnum) {
    if (item === ItemsEnum.WarriorClass) {
      var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);

      if (warrior !== undefined)
        warrior.isAvailable = true;
    }
    if (item === ItemsEnum.PriestClass) {
      var priest = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest);

      if (priest !== undefined)
        priest.isAvailable = true;
    }
    if (item === ItemsEnum.MonkClass) {
      var monk = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Monk);

      if (monk !== undefined)
        monk.isAvailable = true;
    }
    if (item === ItemsEnum.ThaumaturgeClass) {
      var thaumaturge = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Thaumaturge);

      if (thaumaturge !== undefined)
        thaumaturge.isAvailable = true;
    }
  }

  unlockGod(item: ItemsEnum) {
    if (item === ItemsEnum.Nemesis) {
      var nemesis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);

      if (nemesis !== undefined)
        nemesis.isAvailable = true;
    }
    if (item === ItemsEnum.Dionysus) {
      var dionysus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);

      if (dionysus !== undefined)
        dionysus.isAvailable = true;
    }
  }

  getResource(resource: ResourceValue) {
    var resourceCopy = this.lookupService.makeResourceCopy(resource);

    if (this.item.shopItem === ItemsEnum.SparringMatch) {
      resourceCopy.amount *= this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
      resourceCopy.amount = Math.round(resourceCopy.amount);
    }

    return resourceCopy;
  }

  canBuyItem() {
    var canBuy = true;
    this.item.purchasePrice.forEach(resource => {
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      var amount = resource.amount;
      if (this.item.shopItem === ItemsEnum.SparringMatch) {
        amount = 0;
        var currentMultiplier = this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
        for (var i = 0; i < this.buyMultiplier; i++) {
          amount += resource.amount * currentMultiplier;
          currentMultiplier *= 1.1;
        }
      }
      else {
        amount *= this.buyMultiplier;
      }

      if (userResourceAmount < amount)
        canBuy = false;
    });

    return canBuy;
  }

  spendResourcesOnItem() {
    this.item.purchasePrice.forEach(resource => {
      var amount = resource.amount;
      if (this.item.shopItem === ItemsEnum.SparringMatch) {
        amount = 0;
        var currentMultiplier = this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
        for (var i = 0; i < this.buyMultiplier; i++) {
          amount += resource.amount * currentMultiplier;
          currentMultiplier *= 1.1;
        }
      }
      else {
        amount *= this.buyMultiplier;
      }

      this.lookupService.useResource(resource.item, amount);
    });
  }

  isEquipment() {
    return this.lookupService.getEquipmentPieceByItemType(this.item.shopItem) !== undefined;
  }

  getEquipmentClass(item?: ItemsEnum) {
    if (item === undefined)
      item = this.item.shopItem;

    var equipment = this.lookupService.getEquipmentPieceByItemType(item);
    if (equipment !== undefined) {
      var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType)?.quality);

      return qualityClass;
    }

    return "";
  }

  getStars() {
    var equipment = this.lookupService.getEquipmentPieceByItemType(this.item.shopItem);

    if (equipment?.quality === EquipmentQualityEnum.Basic)
      return "★";
    if (equipment?.quality === EquipmentQualityEnum.Uncommon)
      return "★★";
    if (equipment?.quality === EquipmentQualityEnum.Rare)
      return "★★★";
    if (equipment?.quality === EquipmentQualityEnum.Epic)
      return "★★★★";
    if (equipment?.quality === EquipmentQualityEnum.Special)
      return "★★★★★";
    if (equipment?.quality === EquipmentQualityEnum.Unique)
      return "★★★★★★";
    if (equipment?.quality === EquipmentQualityEnum.Extraordinary)
      return "★★★★★★★";

    return "";
  }

  getEquippedComparisonItem(whichCharacter: number) {
    var comparisonItem = undefined;
    var character = this.partyMembers[0];
    if (whichCharacter === 2) {
      character = this.partyMembers[1];
    }

    if (character === undefined)
      return comparisonItem;

    var equipment = this.lookupService.getEquipmentPieceByItemType(this.item.shopItem);
    if (equipment === undefined)
      return comparisonItem;

    comparisonItem = character.equipmentSet.getPieceBasedOnType(equipment.equipmentType);

    return comparisonItem;
  }

  getCharacterColorClass(whichCharacter: number) {
    var character = this.partyMembers[0];
    if (whichCharacter === 2) {
      character = this.partyMembers[1];
    }

    return this.lookupService.getCharacterColorClass(character.type);
  }

  getPartyMemberName(whichCharacter: number) {
    var name = "";

    var character = this.partyMembers[0];
    if (whichCharacter === 2) {
      character = this.partyMembers[1];
    }

    name = character.name;

    return name;
  }

  getPartyMember(whichCharacter: number) {
    var character = this.partyMembers[0];
    if (whichCharacter === 2) {
      character = this.partyMembers[1];
    }

    return character;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
