import { Component, Input, OnInit } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { LookupService } from 'src/app/services/lookup.service';
import { ResourceGeneratorService } from 'src/app/services/resources/resource-generator.service';

@Component({
  selector: 'app-shopping-item-view',
  templateUrl: './shopping-item-view.component.html',
  styleUrls: ['./shopping-item-view.component.css']
})
export class ShoppingItemViewComponent implements OnInit {
  @Input() item: ShopItem;
  itemDescription = "";
  purchaseResourcesRequired: string;

  constructor(public lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService) { }

  ngOnInit(): void {
    this.itemDescription = this.lookupService.getItemDescription(this.item.shopItem);
    this.item.purchasePrice.forEach(resource => {
      var displayName = this.lookupService.getItemName(resource.item);
      this.purchaseResourcesRequired = (resource.amount).toLocaleString() + " " + displayName + ", ";

      if (this.purchaseResourcesRequired.length > 0) {
        this.purchaseResourcesRequired = this.purchaseResourcesRequired.substring(0, this.purchaseResourcesRequired.length - 2);
      }
    });
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

  getEquipmentClass() {
    var equipment = this.lookupService.getEquipmentPieceByItemType(this.item.shopItem);    
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
