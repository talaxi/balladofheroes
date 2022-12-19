import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShopItemGeneratorService {

  constructor() { }

  generateShopItem(item: ItemsEnum) {    
    var purchasePrice: ResourceValue[] = [];
    if (item === ItemsEnum.LinenArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 20));
    }
    if (item === ItemsEnum.IronArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.IronSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 75));
    }
    if (item === ItemsEnum.IronHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.ShortBow)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.IronShield)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 80));
    }
    if (item === ItemsEnum.BronzeSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 250));
    }
    if (item === ItemsEnum.BronzeHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 250));
    }
    if (item === ItemsEnum.LongBow)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 250));
    }
    if (item === ItemsEnum.BronzeShield)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 350));
    }
    if (item === ItemsEnum.BronzeArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 350));
    }
    if (item === ItemsEnum.HealingHerb)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 25));
    }
    if (item === ItemsEnum.FortifiedBronzeSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));      
    }    
    if (item === ItemsEnum.FortifiedBronzeHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
    }
    if (item === ItemsEnum.FortifiedBronzeArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 750));
    }
    if (item === ItemsEnum.Venomstrike)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 1000));
    }

    return new ShopItem(item, purchasePrice);
  }
}
