import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ResourceGeneratorService } from 'src/app/services/resources/resource-generator.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

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
  tooltipDirection = DirectionEnum.Right;
  outOfStock: boolean = false;

  constructor(public lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService,
    private utilityService: UtilityService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.partyMembers = this.globalService.getActivePartyCharacters(true);
    this.itemDescription = this.lookupService.getItemDescription(this.item.shopItem);
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

    return outOfStock;
  }

  setItemPurchasePrice() {
    this.purchaseResourcesRequired = "";
    this.item.purchasePrice.forEach(resource => {
      var displayName = this.lookupService.getItemName(resource.item);
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      //var insufficientText = "";
      //if (userResourceAmount < resource.amount)
      var insufficientText = " <i>(" + userResourceAmount + " owned)</i>";

      this.purchaseResourcesRequired += "<span class='" + this.getItemKeywordClass(this.lookupService.getItemTypeFromItemEnum(resource.item), resource.item, resource.amount, userResourceAmount) + "'>" + (resource.amount).toLocaleString() + " " + displayName + insufficientText + "</span><br/>";
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
          this.globalService.giveCharactersBonusExp(this.globalService.getActivePartyCharacters(true), 5000);
        }
        else if (resource.item === ItemsEnum.WarriorClass || resource.item === ItemsEnum.PriestClass) {
          this.unlockClass(resource.item);
        }
        else
          this.lookupService.gainResource(resource);
      }
    }
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
  }

  canBuyItem() {
    var canBuy = true;
    this.item.purchasePrice.forEach(resource => {
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);
      if (userResourceAmount < resource.amount)
        canBuy = false;
    });

    return canBuy;
  }

  spendResourcesOnItem() {
    this.item.purchasePrice.forEach(resource => {
      this.lookupService.useResource(resource.item, resource.amount);
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
      var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType));

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

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
