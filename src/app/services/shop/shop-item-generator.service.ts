import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShopItemGeneratorService {

  constructor() { }

  generateShopItem(item: ItemsEnum, originalStore: SubZoneEnum) {    
    var purchasePrice: ResourceValue[] = [];
    if (item === ItemsEnum.LinenArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 20));
    }
    if (item === ItemsEnum.IronArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 80));
    }
    if (item === ItemsEnum.IronSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 50));
    }
    if (item === ItemsEnum.IronHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 60));
    }
    if (item === ItemsEnum.ShortBow)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 60));
    }
    if (item === ItemsEnum.IronShield)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 80));
    }
    if (item === ItemsEnum.BronzeSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.BronzeHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.LongBow)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100));
    }
    if (item === ItemsEnum.BronzeShield)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 150));
    }
    if (item === ItemsEnum.BronzeArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 150));
    }
    if (item === ItemsEnum.HealingHerb)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 25));
    }
    if (item === ItemsEnum.ThrowingStone)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 10));
    }
    if (item === ItemsEnum.FortifiedBronzeSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));      
    }    
    if (item === ItemsEnum.FortifiedBronzeHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));
    }
    if (item === ItemsEnum.FortifiedBronzeArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
    }
    if (item === ItemsEnum.Venomstrike)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
    }
    if (item === ItemsEnum.SteelSword)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 750));
    }
    if (item === ItemsEnum.SteelHammer)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 750));
    }
    if (item === ItemsEnum.ElysianOakBow)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 750));
    }
    if (item === ItemsEnum.SteelArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 1000));
    }
    if (item === ItemsEnum.MoltenArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 1000));
    }
    if (item === ItemsEnum.MoltenShield)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 600));
    }
    if (item === ItemsEnum.MoltenRing)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 2000));
    }
    if (item === ItemsEnum.PendantOfFortune)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 3000));
    }
    if (item === ItemsEnum.PendantOfPower)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 3000));
    }
    if (item === ItemsEnum.PendantOfSpeed)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 3000));
    }
    if (item === ItemsEnum.WarriorClass)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 5000));
    }
    if (item === ItemsEnum.PriestClass)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 5000));
    }

    return new ShopItem(item, purchasePrice, originalStore);
  }
}
