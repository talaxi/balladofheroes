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
    if (item === ItemsEnum.LinenArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20));
    }
    if (item === ItemsEnum.IronArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 80));
    }
    if (item === ItemsEnum.IronSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50));
    }
    if (item === ItemsEnum.IronHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50));
    }
    if (item === ItemsEnum.ShortBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50));
    }
    if (item === ItemsEnum.IronShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 80));
    }
    if (item === ItemsEnum.BronzeSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 100));
    }
    if (item === ItemsEnum.BronzeHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 100));
    }
    if (item === ItemsEnum.LongBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 100));
    }
    if (item === ItemsEnum.BronzeShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 150));
    }
    if (item === ItemsEnum.BronzeArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 150));
    }
    if (item === ItemsEnum.HealingHerb) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25));
    }
    if (item === ItemsEnum.ThrowingStone) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 10));
    }
    if (item === ItemsEnum.FortifiedBronzeSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeSword, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 300));
    }
    if (item === ItemsEnum.FortifiedBronzeHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeHammer, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 300));
    }
    if (item === ItemsEnum.FortifiedBronzeArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeArmor, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.PetrifiedBark, 8));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 500));
    }
    if (item === ItemsEnum.Venomstrike) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, 6));
      purchasePrice.push(new ResourceValue(ItemsEnum.LamiaHeart, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 500));
    }
    if (item === ItemsEnum.SteelSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 750));
    }
    if (item === ItemsEnum.SteelHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 750));
    }
    if (item === ItemsEnum.ElysianOakBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 750));
    }
    if (item === ItemsEnum.SteelArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 1000));
    }
    if (item === ItemsEnum.MoltenArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 1000));
    }
    if (item === ItemsEnum.MoltenShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 500));
    }
    if (item === ItemsEnum.MoltenRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 800));
    }
    if (item === ItemsEnum.SwordOfFlames) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2000));
    }
    if (item === ItemsEnum.PendantOfFortune) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 3000));
    }
    if (item === ItemsEnum.PendantOfPower) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 3000));
    }
    if (item === ItemsEnum.PendantOfSpeed) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.BrokenNecklace, 1));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 3000));
    }
    if (item === ItemsEnum.WarriorClass) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 5000));
    }
    if (item === ItemsEnum.PriestClass) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 5000));
    }
    if (item === ItemsEnum.FracturedRubyRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.FracturedEmeraldRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.FracturedAmethystRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.FracturedTopazRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.FracturedAquamarineRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.FracturedOpalRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.BedazzledRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 5000));
    }
    if (item === ItemsEnum.ShieldOfTheHealer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 7500));
    }
    if (item === ItemsEnum.HeftyStone) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 100));
    }
    if (item === ItemsEnum.RestorativeHerb) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 250));
    }
    if (item === ItemsEnum.HardenedLeatherArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, 30));
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 8));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 3500));
    }
    if (item === ItemsEnum.BearskinArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BearHide, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 5000));
    }
    if (item === ItemsEnum.BoarskinArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BoarHide, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 5000));
    }
    if (item === ItemsEnum.SparringMatch) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2000));
    }
    if (item === ItemsEnum.SpiritBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2000));
    }
    if (item === ItemsEnum.FendingMace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2000));
    }
    if (item === ItemsEnum.GemmedNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500));
    }
    if (item === ItemsEnum.RingOfNightmares) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 4000));
    }
    if (item === ItemsEnum.DiamondHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.EagleEye) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.GoldenSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.ScalyRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.FishScales, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Seashell, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 6000));
    }
    if (item === ItemsEnum.SharkstoothNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.SharkTeeth, 8));      
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 6000));
    }
    if (item === ItemsEnum.SharkstoothPendant) {
      purchasePrice.push(new ResourceValue(ItemsEnum.SharkTeeth, 8));      
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 6000));
    }
    if (item === ItemsEnum.FeatheredTunic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 7));
      purchasePrice.push(new ResourceValue(ItemsEnum.EagleFeather, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 10000));
    }
    if (item === ItemsEnum.ShieldOfTheSea) {
      purchasePrice.push(new ResourceValue(ItemsEnum.EagleFeather, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.SharkTeeth, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.SpikedShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.FishScales, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.SharkTeeth, 6));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.BlackLance) {
      purchasePrice.push(new ResourceValue(ItemsEnum.EagleFeather, 14));
      purchasePrice.push(new ResourceValue(ItemsEnum.MetalScraps, 8));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.LiquidSaber) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.FishScales, 18));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.QuadRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.LesserCrackedAmethyst) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.LesserCrackedRuby) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.LesserCrackedEmerald) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.LesserCrackedTopaz) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.LesserCrackedOpal) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }
    if (item === ItemsEnum.LesserCrackedAquamarine) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 8000));
    }

    return new ShopItem(item, purchasePrice, originalStore);
  }
}
