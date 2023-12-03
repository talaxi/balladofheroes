import { Component, Input, OnInit } from '@angular/core';
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

  constructor(public lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService,
    private utilityService: UtilityService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private deviceDetectorService: DeviceDetectorService, public dictionaryService: DictionaryService, public dialog: MatDialog,
    private storyService: StoryService, private battleService: BattleService) { }

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
    if (this.item.shopItem === ItemsEnum.Nemesis && this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis)?.isAvailable)
      outOfStock = true;
    if (this.item.shopItem === ItemsEnum.Dionysus && this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus)?.isAvailable)
      outOfStock = true;
      if (this.item.shopItem === ItemsEnum.OlympicCommendation && this.lookupService.getResourceAmount(ItemsEnum.OlympicCommendation) >= 5)
      outOfStock = true;
      if (this.item.shopItem === ItemsEnum.MonkClass && this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Monk)?.isAvailable)
      outOfStock = true;

    return outOfStock;  
  }

  setItemPurchasePrice() {
    this.purchaseResourcesRequired = "";
    if (this.item.purchasePrice.some(item => item.item === ItemsEnum.Ambrosia))
    {
      this.item.purchasePrice = this.item.purchasePrice.filter(item => item.item !== ItemsEnum.Coin);
    }

    this.item.purchasePrice.forEach(resource => {
      var amount = resource.amount;
      if (this.item.shopItem === ItemsEnum.SparringMatch) {        
        amount *= this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
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
      var resource = this.resourceGeneratorService.getResourceFromItemType(this.item.shopItem, 1);

      if (resource !== undefined) {
        if (resource.item === ItemsEnum.SparringMatch) { 
          this.globalService.giveCharactersBonusExp(5000);          
          this.globalService.globalVar.sidequestData.sparringMatchMultiplier *= 1.1;
          //TODO: REMOVE BELOW
          this.globalService.globalVar.uniques.forEach(item => {
            item.level += 100;
          });
        }
        else if (resource.item === ItemsEnum.WarriorClass || resource.item === ItemsEnum.PriestClass || resource.item === ItemsEnum.MonkClass) {
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
        else
          this.lookupService.gainResource(resource);
      }
    }
  }

  getCurrentlyOwnedAmount() {
    return this.lookupService.getResourceAmount(this.item.shopItem).toLocaleString();
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
        amount *= this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
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
        amount *= this.globalService.globalVar.sidequestData.sparringMatchMultiplier;
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
    if (equipment?.quality === EquipmentQualityEnum.Extraordinary)
      return "★★★★★★";
    if (equipment?.quality === EquipmentQualityEnum.Unique)
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
