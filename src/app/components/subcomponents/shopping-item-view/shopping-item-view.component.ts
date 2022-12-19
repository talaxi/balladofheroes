import { Component, Input, OnInit } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
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

  constructor(public lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService, 
    private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.itemDescription = this.lookupService.getItemDescription(this.item.shopItem);
    this.item.purchasePrice.forEach(resource => {
      var displayName = this.lookupService.getItemName(resource.item);
      this.purchaseResourcesRequired += "<span class='" + this.getItemKeywordClass(resource.type, resource.item) + "'>" +(resource.amount).toLocaleString() + " " + displayName + "</span><br/>";      
    });

    if (this.purchaseResourcesRequired.length > 0) {
      this.purchaseResourcesRequired = this.utilityService.getSanitizedHtml(this.purchaseResourcesRequired);
    }    
  }

  getItemKeywordClass(type: ItemTypeEnum, item: ItemsEnum) {
    var classText = "";

    if (type === ItemTypeEnum.Resource)
      classText = "resourceKeyword";
    if (type === ItemTypeEnum.CraftingMaterial)
      classText = "craftingMaterialKeyword";
    if (type === ItemTypeEnum.Equipment)  
      classText = this.getEquipmentClass(item);    

    return classText;
  }

  buyItem() {
    if (this.canBuyItem()) {
      this.spendResourcesOnItem();

      var resource = this.resourceGeneratorService.getResourceFromItemType(this.item.shopItem, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
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
    if (equipment !== undefined)
    {
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
}
