import { Injectable } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShopItemGeneratorService {

  constructor() { }

  generateShopItem(item: ItemsEnum, originalStore: SubZoneEnum, isPatron: boolean = false) {
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
    if (item === ItemsEnum.HarpyTalon) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 300));
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
      purchasePrice.push(new ResourceValue(ItemsEnum.PetrifiedBark, 3));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 500));
    }
    if (item === ItemsEnum.Venomstrike) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, 6));
      purchasePrice.push(new ResourceValue(ItemsEnum.LamiaHeart, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 500));
    }
    if (item === ItemsEnum.ForgottenLocket) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 800));
    }
    if (item === ItemsEnum.Aegis) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 600));
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
    if (item === ItemsEnum.MonkClass) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ThaumaturgeClass) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
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
      purchasePrice.push(new ResourceValue(ItemsEnum.EagleFeather, 10));
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
      purchasePrice.push(new ResourceValue(ItemsEnum.EagleFeather, 8));
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
    if (item === ItemsEnum.DarkMoonPendant) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.BlazingSunPendant) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.Leather) {
      purchasePrice.push(new ResourceValue(ItemsEnum.LightLeather, 8));
    }
    if (item === ItemsEnum.ThickLeather) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Leather, 5));
    }
    if (item === ItemsEnum.BoarHide) {
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 5));
    }
    if (item === ItemsEnum.BearHide) {
      purchasePrice.push(new ResourceValue(ItemsEnum.ThickLeather, 5));
    }
    if (item === ItemsEnum.Honey) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Olive, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Fennel, 10));
    }
    if (item === ItemsEnum.VialOfLakeLerna) {
      purchasePrice.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 10));
    }
    if (item === ItemsEnum.VialOfTheBlackSea) {
      purchasePrice.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 8));
    }
    if (item === ItemsEnum.VialOfTheCretanSea) {
      purchasePrice.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 8));
    }
    if (item === ItemsEnum.EssenceOfWater) {
      purchasePrice.push(new ResourceValue(ItemsEnum.EssenceOfFire, 8));
    }
    if (item === ItemsEnum.ToxicIchor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.SpiritEssence, 12));
    }
    if (item === ItemsEnum.JaggedSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Tusk, 8));
      purchasePrice.push(new ResourceValue(ItemsEnum.CanineFang, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.BirchBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.CoarseFur, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.BirchBark, 6));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.RadiatingHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.WhiteHorn, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.SpiritShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.LightShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.FurArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.CoarseFur, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 12500));
    }
    if (item === ItemsEnum.ScaleArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.SerpentScale, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 12500));
    }
    if (item === ItemsEnum.HideArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.AnimalHide, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 12500));
    }
    if (item === ItemsEnum.HesperidianArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.MagicTreeBark, 15));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 12500));
    }
    if (item === ItemsEnum.BronzeBeakNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BronzeBeak, 2));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 15000));
    }
    if (item === ItemsEnum.BloodyNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.SafeRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.SirensongRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.RingOfCurses) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.BloodyShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 35000));
    }
    if (item === ItemsEnum.DivinePlate) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.DivineTarge) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantHammer) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.GiantNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.PorphyrionsMace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.AugeanStables1) {
      purchasePrice.push(new ResourceValue(ItemsEnum.MetalScraps, 25));
    }
    if (item === ItemsEnum.AugeanStables2) {
      purchasePrice.push(new ResourceValue(ItemsEnum.MetalScraps, 50));
      purchasePrice.push(new ResourceValue(ItemsEnum.CoarseFur, 10));
    }
    if (item === ItemsEnum.AugeanStables3) {
      purchasePrice.push(new ResourceValue(ItemsEnum.MetalScraps, 100));
      purchasePrice.push(new ResourceValue(ItemsEnum.AnimalHide, 25));
    }
    if (item === ItemsEnum.CirceAlchemy) {
      purchasePrice.push(new ResourceValue(ItemsEnum.ColossalRoot, 50));      
    }

    if (item === ItemsEnum.Dionysus) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 8));
    }
    if (item === ItemsEnum.Nemesis) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 8));
    }
    
    if (item === ItemsEnum.TokenOfSupport) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 10));
    }    
    if (item === ItemsEnum.TokenOfFavor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 20));
    }

    if (item === ItemsEnum.AthenasScythe) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ArtemissBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.HermessStaff) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ApollosBow) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.HadessBident) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.AressSpear) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.NemesissSword) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.DionysussScepter) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ZeussLightningBolts) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.HerasRod) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.AphroditesRoses) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.PoseidonsTrident) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 12));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.AphroditesShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AthenasShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ArtemissShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HermessShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HadessShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ApollosShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AressShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.NemesissShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.DionysussShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ZeussShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.PoseidonsShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AphroditesArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AthenasArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ArtemissArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HermessArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.PoseidonsArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HadessArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ApollosArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AressArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.NemesissArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.DionysussArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ZeussArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AthenasRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ArtemissRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HermessRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HadessRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ApollosRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AressRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.NemesissRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.DionysussRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ZeussRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AphroditesRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HerasRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.PoseidonsRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AthenasNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ArtemissNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HermessNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HadessNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ApollosNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AressNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.NemesissNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.DionysussNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.ZeussNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.HerasNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.AphroditesNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.PoseidonsNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 4));
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 45000));
    }
    if (item === ItemsEnum.BlazingSunPendantUnique) {
      if (isPatron)
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 10));
      else
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 100));
    }
    if (item === ItemsEnum.DarkMoonPendantUnique) {
      if (isPatron)
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 10));
      else
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 100));
    }
    if (item === ItemsEnum.BlazingSunPendantUniqueUpgrade) {
      if (isPatron)
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 1));
      else
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 2));
    }
    if (item === ItemsEnum.DarkMoonPendantUniqueUpgrade) {
      if (isPatron)
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 1));
      else
        purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 2));
    }
    if (item === ItemsEnum.Ambrosia) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Nectar, 10));
    }    
    if (item === ItemsEnum.BoundingBandEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.BoundingBandSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.ScathingBeautyEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.ScathingBeautySpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.RainbowScaledPlatingEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.RainbowScaledPlatingSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.BatteringMaceEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.BatteringMaceSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.GleamingLoopEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.GleamingLoopSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.EnergyShieldEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.EnergyShieldSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.SturdyShellEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.SturdyShellSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.GlowingChokerEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.GlowingChokerSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.AstralRingEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.AstralRingSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.CarcanetOfTheCentaurEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.CarcanetOfTheCentaurSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.BucklerOfPerfectHarmonyEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.BucklerOfPerfectHarmonySpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }    
    if (item === ItemsEnum.ScorpionStingerEpic) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 25000));
    }
    if (item === ItemsEnum.ScorpionStingerSpecial) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.StingrayTip) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.DarkShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 40000));
    }
    if (item === ItemsEnum.EssenceOfEarth) {
      purchasePrice.push(new ResourceValue(ItemsEnum.EssenceOfWater, 3));
    }
    if (item === ItemsEnum.EssenceOfAir) {
      purchasePrice.push(new ResourceValue(ItemsEnum.EssenceOfWater, 3));
    }
    if (item === ItemsEnum.SerpentScale) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BoarHide, 8));
    }
    if (item === ItemsEnum.MagicTreeBark) {
      purchasePrice.push(new ResourceValue(ItemsEnum.BearHide, 8));
    }
    if (item === ItemsEnum.MetalNuggets) {
      purchasePrice.push(new ResourceValue(ItemsEnum.MetalScraps, 10));
    }
    if (item === ItemsEnum.OlympicCommendation) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Ambrosia, 3));
    }
    if (item === ItemsEnum.ShadowSpear) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ShadowArmor) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ShadowRing) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ShadowShield) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.ShadowNecklace) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.RagingBull) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 50000));
    }
    if (item === ItemsEnum.LesserFlawedRuby) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.LesserFlawedOpal) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.LesserFlawedEmerald) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.LesserFlawedTopaz) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.LesserFlawedAquamarine) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }
    if (item === ItemsEnum.LesserFlawedAmethyst) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 20000));
    }    
    if (item === ItemsEnum.AthenasSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.ArtemissSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.HermessSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.ApollosSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.AressSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.HadessSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.DionysussSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.NemesissSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.ZeussSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.PoseidonsSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.AphroditesSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }
    if (item === ItemsEnum.HerasSigil) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500000));
    }        
    if (item === ItemsEnum.MysteryStone) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedAmethyst, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedAquamarine, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedEmerald, 10));
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedOpal, 10));            
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedRuby, 10));      
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectRutilatedTopaz, 10));
    }
    if (item === ItemsEnum.RutileRubyFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 100));
    }
    if (item === ItemsEnum.RutileOpalFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 100));
    }
    if (item === ItemsEnum.RutileAquamarineFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 100));
    }
    if (item === ItemsEnum.RutileEmeraldFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 100));
    }
    if (item === ItemsEnum.RutileTopazFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 100));
    }
    if (item === ItemsEnum.RutileAmethystFragment) {
      purchasePrice.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 100));
    }
    if (item === ItemsEnum.DullRuby) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedRuby, 1));
    }
    if (item === ItemsEnum.DullAmethyst) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedAmethyst, 1));
    }
    if (item === ItemsEnum.DullTopaz) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedTopaz, 1));
    }
    if (item === ItemsEnum.DullOpal) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedOpal, 1));
    }
    if (item === ItemsEnum.DullEmerald) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedEmerald, 1));
    }
    if (item === ItemsEnum.DullAquamarine) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectCrackedAquamarine, 1));
    }
    if (item === ItemsEnum.FlawedRuby) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullRuby, 1));
    }
    if (item === ItemsEnum.FlawedAmethyst) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullAmethyst, 1));
    }
    if (item === ItemsEnum.FlawedTopaz) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullTopaz, 1));
    }
    if (item === ItemsEnum.FlawedOpal) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullOpal, 1));
    }
    if (item === ItemsEnum.FlawedEmerald) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullEmerald, 1));
    }
    if (item === ItemsEnum.FlawedAquamarine) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectDullAquamarine, 1));
    }
    if (item === ItemsEnum.RutilatedRuby) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedRuby, 2));
    }
    if (item === ItemsEnum.RutilatedAmethyst) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedAmethyst, 2));
    }
    if (item === ItemsEnum.RutilatedTopaz) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedTopaz, 2));
    }
    if (item === ItemsEnum.RutilatedOpal) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedOpal, 2));
    }
    if (item === ItemsEnum.RutilatedEmerald) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedEmerald, 2));
    }
    if (item === ItemsEnum.RutilatedAquamarine) {
      purchasePrice.push(new ResourceValue(ItemsEnum.PerfectFlawedAquamarine, 2));
    }
    if (item === ItemsEnum.SoothingHerb) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 2500));
    }
    if (item === ItemsEnum.NecklaceOfStarryNights) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 55000));
    }
    if (item === ItemsEnum.NecklaceOfEndlessWaves) {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, 55000));
    }

    return new ShopItem(item, purchasePrice, originalStore);
  }
}
