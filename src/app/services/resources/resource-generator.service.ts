import { Injectable } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceGeneratorService {

  constructor() { }

  getResourceFromItemType(type: ItemsEnum, amount: number) {
    //swords
    if (type === ItemsEnum.IronSword) {
      return new ResourceValue(ItemsEnum.IronSword, amount);
    }
    if (type === ItemsEnum.BronzeSword) {
      return new ResourceValue(ItemsEnum.BronzeSword, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeSword) {
      return new ResourceValue(ItemsEnum.FortifiedBronzeSword, amount);
    }
    if (type === ItemsEnum.SteelSword) {
      return new ResourceValue(ItemsEnum.SteelSword, amount);
    }
    if (type === ItemsEnum.SwordOfFlames) {
      return new ResourceValue(ItemsEnum.SwordOfFlames, amount);
    }
    if (type === ItemsEnum.GoldenSword) {
      return new ResourceValue(ItemsEnum.GoldenSword, amount);
    }
    if (type === ItemsEnum.LiquidSaber) {
      return new ResourceValue(ItemsEnum.LiquidSaber, amount);
    }
    if (type === ItemsEnum.BlackLance) {
      return new ResourceValue(ItemsEnum.BlackLance, amount);
    }

    //hammers
    if (type === ItemsEnum.IronHammer) {
      return new ResourceValue(ItemsEnum.IronHammer, amount);
    }
    if (type === ItemsEnum.BronzeHammer) {
      return new ResourceValue(ItemsEnum.BronzeHammer, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer) {
      return new ResourceValue(ItemsEnum.FortifiedBronzeHammer, amount);
    }
    if (type === ItemsEnum.SteelHammer) {
      return new ResourceValue(ItemsEnum.SteelHammer, amount);
    }
    if (type === ItemsEnum.DiamondHammer) {
      return new ResourceValue(ItemsEnum.DiamondHammer, amount);
    }
    if (type === ItemsEnum.FendingMace) {
      return new ResourceValue(ItemsEnum.FendingMace, amount);
    }

    //bows
    if (type === ItemsEnum.ShortBow) {
      return new ResourceValue(ItemsEnum.ShortBow, amount);
    }
    if (type === ItemsEnum.LongBow) {
      return new ResourceValue(ItemsEnum.LongBow, amount);
    }
    if (type === ItemsEnum.Venomstrike) {
      return new ResourceValue(ItemsEnum.Venomstrike, amount);
    }
    if (type === ItemsEnum.ElysianOakBow) {
      return new ResourceValue(ItemsEnum.ElysianOakBow, amount);
    }
    if (type === ItemsEnum.Wolfsbane) {
      return new ResourceValue(ItemsEnum.Wolfsbane, amount);
    }
    if (type === ItemsEnum.EagleEye) {
      return new ResourceValue(ItemsEnum.EagleEye, amount);
    }
    if (type === ItemsEnum.SpiritBow) {
      return new ResourceValue(ItemsEnum.SpiritBow, amount);
    }

    //shields
    if (type === ItemsEnum.IronShield) {
      return new ResourceValue(ItemsEnum.IronShield, amount);
    }
    if (type === ItemsEnum.BronzeShield) {
      return new ResourceValue(ItemsEnum.BronzeShield, amount);
    }
    if (type === ItemsEnum.Aegis) {
      return new ResourceValue(ItemsEnum.Aegis, amount);
    }
    if (type === ItemsEnum.MoltenShield) {
      return new ResourceValue(ItemsEnum.MoltenShield, amount);
    }
    if (type === ItemsEnum.ShieldOfTheHealer) {
      return new ResourceValue(ItemsEnum.ShieldOfTheHealer, amount);
    }
    if (type === ItemsEnum.ShieldOfTheSea) {
      return new ResourceValue(ItemsEnum.ShieldOfTheSea, amount);
    }
    if (type === ItemsEnum.SpikedShield) {
      return new ResourceValue(ItemsEnum.SpikedShield, amount);
    }

    //armor
    if (type === ItemsEnum.LinenArmor) {
      return new ResourceValue(ItemsEnum.LinenArmor, amount);
    }
    if (type === ItemsEnum.IronArmor) {
      return new ResourceValue(ItemsEnum.IronArmor, amount);
    }
    if (type === ItemsEnum.BronzeArmor) {
      return new ResourceValue(ItemsEnum.BronzeArmor, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor) {
      return new ResourceValue(ItemsEnum.FortifiedBronzeArmor, amount);
    }
    if (type === ItemsEnum.SteelArmor) {
      return new ResourceValue(ItemsEnum.SteelArmor, amount);
    }
    if (type === ItemsEnum.MoltenArmor) {
      return new ResourceValue(ItemsEnum.MoltenArmor, amount);
    }
    if (type === ItemsEnum.HardenedLeatherArmor) {
      return new ResourceValue(ItemsEnum.HardenedLeatherArmor, amount);
    }
    if (type === ItemsEnum.BearskinArmor) {
      return new ResourceValue(ItemsEnum.BearskinArmor, amount);
    }
    if (type === ItemsEnum.BoarskinArmor) {
      return new ResourceValue(ItemsEnum.BoarskinArmor, amount);
    }
    if (type === ItemsEnum.FeatheredTunic) {
      return new ResourceValue(ItemsEnum.FeatheredTunic, amount);
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket) {
      return new ResourceValue(ItemsEnum.ForgottenLocket, amount);
    }
    if (type === ItemsEnum.PendantOfFortune) {
      return new ResourceValue(ItemsEnum.PendantOfFortune, amount);
    }
    if (type === ItemsEnum.PendantOfPower) {
      return new ResourceValue(ItemsEnum.PendantOfPower, amount);
    }
    if (type === ItemsEnum.PendantOfSpeed) {
      return new ResourceValue(ItemsEnum.PendantOfSpeed, amount);
    }
    if (type === ItemsEnum.GemmedNecklace) {
      return new ResourceValue(ItemsEnum.GemmedNecklace, amount);
    }
    if (type === ItemsEnum.SharkstoothNecklace) {
      return new ResourceValue(ItemsEnum.SharkstoothNecklace, amount);
    }
    if (type === ItemsEnum.SharkstoothPendant) {
      return new ResourceValue(ItemsEnum.SharkstoothPendant, amount);
    }
    if (type === ItemsEnum.BlazingSunPendant) {
      return new ResourceValue(ItemsEnum.BlazingSunPendant, amount);
    }
    if (type === ItemsEnum.DarkMoonPendant) {
      return new ResourceValue(ItemsEnum.DarkMoonPendant, amount);
    }

    //rings
    if (type === ItemsEnum.MoltenRing) {
      return new ResourceValue(ItemsEnum.MoltenRing, amount);
    }
    if (type === ItemsEnum.FracturedAmethystRing) {
      return new ResourceValue(ItemsEnum.FracturedAmethystRing, amount);
    }
    if (type === ItemsEnum.FracturedRubyRing) {
      return new ResourceValue(ItemsEnum.FracturedRubyRing, amount);
    }
    if (type === ItemsEnum.FracturedTopazRing) {
      return new ResourceValue(ItemsEnum.FracturedTopazRing, amount);
    }
    if (type === ItemsEnum.FracturedEmeraldRing) {
      return new ResourceValue(ItemsEnum.FracturedEmeraldRing, amount);
    }
    if (type === ItemsEnum.FracturedOpalRing) {
      return new ResourceValue(ItemsEnum.FracturedOpalRing, amount);
    }
    if (type === ItemsEnum.FracturedAquamarineRing) {
      return new ResourceValue(ItemsEnum.FracturedAquamarineRing, amount);
    }
    if (type === ItemsEnum.BedazzledRing) {
      return new ResourceValue(ItemsEnum.BedazzledRing, amount);
    }
    if (type === ItemsEnum.ScalyRing) {
      return new ResourceValue(ItemsEnum.ScalyRing, amount);
    }
    if (type === ItemsEnum.QuadRing) {
      return new ResourceValue(ItemsEnum.QuadRing, amount);
    }

    //equippables
    if (type === ItemsEnum.HealingHerb) {
      return new ResourceValue(ItemsEnum.HealingHerb, amount);
    }
    if (type === ItemsEnum.HealingPoultice) {
      return new ResourceValue(ItemsEnum.HealingPoultice, amount);
    }
    if (type === ItemsEnum.HealingSalve) {
      return new ResourceValue(ItemsEnum.HealingSalve, amount);
    }
    if (type === ItemsEnum.ThrowingStone) {
      return new ResourceValue(ItemsEnum.ThrowingStone, amount);
    }
    if (type === ItemsEnum.PoisonFang) {
      return new ResourceValue(ItemsEnum.PoisonFang, amount);
    }
    if (type === ItemsEnum.PoisonousToxin) {
      return new ResourceValue(ItemsEnum.PoisonousToxin, amount);
    }
    if (type === ItemsEnum.DebilitatingToxin) {
      return new ResourceValue(ItemsEnum.DebilitatingToxin, amount);
    }
    if (type === ItemsEnum.ExplodingPotion) {
      return new ResourceValue(ItemsEnum.ExplodingPotion, amount);
    }
    if (type === ItemsEnum.FirePotion) {
      return new ResourceValue(ItemsEnum.FirePotion, amount);
    }
    if (type === ItemsEnum.StranglingGasPotion) {
      return new ResourceValue(ItemsEnum.StranglingGasPotion, amount);
    }
    if (type === ItemsEnum.PoisonExtractPotion) {
      return new ResourceValue(ItemsEnum.PoisonExtractPotion, amount);
    }
    if (type === ItemsEnum.HeroicElixir) {
      return new ResourceValue(ItemsEnum.HeroicElixir, amount);
    }
    if (type === ItemsEnum.RejuvenatingElixir) {
      return new ResourceValue(ItemsEnum.RejuvenatingElixir, amount);
    }
    if (type === ItemsEnum.HeftyStone) {
      return new ResourceValue(ItemsEnum.HeftyStone, amount);
    }
    if (type === ItemsEnum.RestorativeHerb) {
      return new ResourceValue(ItemsEnum.RestorativeHerb, amount);
    }
    if (type === ItemsEnum.FocusPotion) {
      return new ResourceValue(ItemsEnum.FocusPotion, amount);
    }
    if (type === ItemsEnum.WitheringToxin) {
      return new ResourceValue(ItemsEnum.WitheringToxin, amount);
    }
    if (type === ItemsEnum.VenomousToxin) {
      return new ResourceValue(ItemsEnum.VenomousToxin, amount);
    }
    if (type === ItemsEnum.ElixirOfFortitude) {
      return new ResourceValue(ItemsEnum.ElixirOfFortitude, amount);
    }
    if (type === ItemsEnum.UnstablePotion) {
      return new ResourceValue(ItemsEnum.UnstablePotion, amount);
    }
    if (type === ItemsEnum.BoomingPotion) {
      return new ResourceValue(ItemsEnum.BoomingPotion, amount);
    }
    if (type === ItemsEnum.RestorativePoultice) {
      return new ResourceValue(ItemsEnum.RestorativePoultice, amount);
    }
    if (type === ItemsEnum.RestorativeSalve) {
      return new ResourceValue(ItemsEnum.RestorativeSalve, amount);
    }

    //materials
    if (type === ItemsEnum.LightLeather) {
      return new ResourceValue(ItemsEnum.LightLeather, amount);
    }
    if (type === ItemsEnum.Leather) {
      return new ResourceValue(ItemsEnum.Leather, amount);
    }
    if (type === ItemsEnum.Wax) {
      return new ResourceValue(ItemsEnum.Wax, amount);
    }
    if (type === ItemsEnum.Fennel) {
      return new ResourceValue(ItemsEnum.Fennel, amount);
    }
    if (type === ItemsEnum.Olive) {
      return new ResourceValue(ItemsEnum.Olive, amount);
    }
    if (type === ItemsEnum.Asphodelus) {
      return new ResourceValue(ItemsEnum.Asphodelus, amount);
    }
    if (type === ItemsEnum.VialOfTheLethe) {
      return new ResourceValue(ItemsEnum.VialOfTheLethe, amount);
    }
    if (type === ItemsEnum.EssenceOfFire) {
      return new ResourceValue(ItemsEnum.EssenceOfFire, amount);
    }
    if (type === ItemsEnum.SoulSpark) {
      return new ResourceValue(ItemsEnum.SoulSpark, amount);
    }
    if (type === ItemsEnum.SatchelOfHerbs) {
      return new ResourceValue(ItemsEnum.SatchelOfHerbs, amount);
    }
    if (type === ItemsEnum.SoulEssence) {
      return new ResourceValue(ItemsEnum.SoulEssence, amount);
    }
    if (type === ItemsEnum.BushelOfHerbs) {
      return new ResourceValue(ItemsEnum.BushelOfHerbs, amount);
    }
    if (type === ItemsEnum.VialOfLakeLerna) {
      return new ResourceValue(ItemsEnum.VialOfLakeLerna, amount);
    }
    if (type === ItemsEnum.Narcissus) {
      return new ResourceValue(ItemsEnum.Narcissus, amount);
    }
    if (type === ItemsEnum.Goldroot) {
      return new ResourceValue(ItemsEnum.Goldroot, amount);
    }
    if (type === ItemsEnum.Lousewort) {
      return new ResourceValue(ItemsEnum.Lousewort, amount);
    }
    if (type === ItemsEnum.Violet) {
      return new ResourceValue(ItemsEnum.Violet, amount);
    }
    if (type === ItemsEnum.ThickLeather) {
      return new ResourceValue(ItemsEnum.ThickLeather, amount);
    }
    if (type === ItemsEnum.BearHide) {
      return new ResourceValue(ItemsEnum.BearHide, amount);
    }
    if (type === ItemsEnum.BoarHide) {
      return new ResourceValue(ItemsEnum.BoarHide, amount);
    }
    if (type === ItemsEnum.SpiritEssence) {
      return new ResourceValue(ItemsEnum.SpiritEssence, amount);
    }
    if (type === ItemsEnum.Sorrel) {
      return new ResourceValue(ItemsEnum.Sorrel, amount);
    }
    if (type === ItemsEnum.VialOfTheBlackSea) {
      return new ResourceValue(ItemsEnum.VialOfTheBlackSea, amount);
    }
    if (type === ItemsEnum.RoughEmeraldFragment) {
      return new ResourceValue(ItemsEnum.RoughEmeraldFragment, amount);
    }
    if (type === ItemsEnum.RoughRubyFragment) {
      return new ResourceValue(ItemsEnum.RoughRubyFragment, amount);
    }
    if (type === ItemsEnum.RoughOpalFragment) {
      return new ResourceValue(ItemsEnum.RoughOpalFragment, amount);
    }
    if (type === ItemsEnum.RoughAquamarineFragment) {
      return new ResourceValue(ItemsEnum.RoughAquamarineFragment, amount);
    }
    if (type === ItemsEnum.RoughTopazFragment) {
      return new ResourceValue(ItemsEnum.RoughTopazFragment, amount);
    }
    if (type === ItemsEnum.RoughAmethystFragment) {
      return new ResourceValue(ItemsEnum.RoughAmethystFragment, amount);
    }
    if (type === ItemsEnum.PetrifiedBark) {
      return new ResourceValue(ItemsEnum.PetrifiedBark, amount);
    }
    if (type === ItemsEnum.FishScales) {
      return new ResourceValue(ItemsEnum.FishScales, amount);
    }
    if (type === ItemsEnum.MetalScraps) {
      return new ResourceValue(ItemsEnum.MetalScraps, amount);
    }
    if (type === ItemsEnum.CrackedRuby) {
      return new ResourceValue(ItemsEnum.CrackedRuby, amount);
    }
    if (type === ItemsEnum.CrackedEmerald) {
      return new ResourceValue(ItemsEnum.CrackedEmerald, amount);
    }
    if (type === ItemsEnum.CrackedAquamarine) {
      return new ResourceValue(ItemsEnum.CrackedAquamarine, amount);
    }
    if (type === ItemsEnum.CrackedTopaz) {
      return new ResourceValue(ItemsEnum.CrackedTopaz, amount);
    }
    if (type === ItemsEnum.CrackedOpal) {
      return new ResourceValue(ItemsEnum.CrackedOpal, amount);
    }
    if (type === ItemsEnum.CrackedAmethyst) {
      return new ResourceValue(ItemsEnum.CrackedAmethyst, amount);
    }
    if (type === ItemsEnum.LesserCrackedRuby) {
      return new ResourceValue(ItemsEnum.LesserCrackedRuby, amount);
    }
    if (type === ItemsEnum.LesserCrackedEmerald) {
      return new ResourceValue(ItemsEnum.LesserCrackedEmerald, amount);
    }
    if (type === ItemsEnum.LesserCrackedAquamarine) {
      return new ResourceValue(ItemsEnum.LesserCrackedAquamarine, amount);
    }
    if (type === ItemsEnum.LesserCrackedTopaz) {
      return new ResourceValue(ItemsEnum.LesserCrackedTopaz, amount);
    }
    if (type === ItemsEnum.LesserCrackedOpal) {
      return new ResourceValue(ItemsEnum.LesserCrackedOpal, amount);
    }
    if (type === ItemsEnum.LesserCrackedAmethyst) {
      return new ResourceValue(ItemsEnum.LesserCrackedAmethyst, amount);
    }
    if (type === ItemsEnum.DullRuby) {
      return new ResourceValue(ItemsEnum.DullRuby, amount);
    }
    if (type === ItemsEnum.DullEmerald) {
      return new ResourceValue(ItemsEnum.DullEmerald, amount);
    }
    if (type === ItemsEnum.DullAquamarine) {
      return new ResourceValue(ItemsEnum.DullAquamarine, amount);
    }
    if (type === ItemsEnum.DullTopaz) {
      return new ResourceValue(ItemsEnum.DullTopaz, amount);
    }
    if (type === ItemsEnum.DullOpal) {
      return new ResourceValue(ItemsEnum.DullOpal, amount);
    }
    if (type === ItemsEnum.DullAmethyst) {
      return new ResourceValue(ItemsEnum.DullAmethyst, amount);
    }
    if (type === ItemsEnum.MinorWeaponSlotAddition) {
      return new ResourceValue(ItemsEnum.MinorWeaponSlotAddition, amount);
    }
    if (type === ItemsEnum.MinorArmorSlotAddition) {
      return new ResourceValue(ItemsEnum.MinorArmorSlotAddition, amount);
    }
    if (type === ItemsEnum.MinorRingSlotAddition) {
      return new ResourceValue(ItemsEnum.MinorRingSlotAddition, amount);
    }
    if (type === ItemsEnum.MinorShieldSlotAddition) {
      return new ResourceValue(ItemsEnum.MinorShieldSlotAddition, amount);
    }
    if (type === ItemsEnum.MinorNecklaceSlotAddition) {
      return new ResourceValue(ItemsEnum.MinorNecklaceSlotAddition, amount);
    }
    if (type === ItemsEnum.LamiaHeart) {
      return new ResourceValue(ItemsEnum.LamiaHeart, amount);
    }
    if (type === ItemsEnum.SharkTeeth) {
      return new ResourceValue(ItemsEnum.SharkTeeth, amount);
    }
    if (type === ItemsEnum.Seashell) {
      return new ResourceValue(ItemsEnum.Seashell, amount);
    }

    //charms
    if (type === ItemsEnum.SmallCharmOfDetermination) {
      return new ResourceValue(ItemsEnum.SmallCharmOfDetermination, amount);
    }
    if (type === ItemsEnum.LargeCharmOfDetermination) {
      return new ResourceValue(ItemsEnum.LargeCharmOfDetermination, amount);
    }
    if (type === ItemsEnum.SmallCharmOfRejuvenation) {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, amount);
    }
    if (type === ItemsEnum.LargeCharmOfRejuvenation) {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, amount);
    }
    if (type === ItemsEnum.SmallCharmOfVulnerability) {
      return new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, amount);
    }
    if (type === ItemsEnum.LargeCharmOfVulnerability) {
      return new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, amount);
    }

    //other
    if (type === ItemsEnum.SparringMatch) {
      return new ResourceValue(ItemsEnum.SparringMatch, amount);
    }
    if (type === ItemsEnum.WarriorClass) {
      return new ResourceValue(ItemsEnum.WarriorClass, amount);
    }
    if (type === ItemsEnum.PriestClass) {
      return new ResourceValue(ItemsEnum.PriestClass, amount);
    }
    if (type === ItemsEnum.Coin) {
      return new ResourceValue(ItemsEnum.Coin, amount);
    }
    if (type === ItemsEnum.EternalMeleeTicket) {
      return new ResourceValue(ItemsEnum.EternalMeleeTicket, amount);
    }
    if (type === ItemsEnum.Subscriber) {
      return new ResourceValue(ItemsEnum.Subscriber, amount);
    }

    return new ResourceValue(ItemsEnum.None, 0);
  }

  getSlotItemValues(item: ItemsEnum) {   
    var baseLesserCrackedStatValue = 10; 
    var hpModifier = 5;
    var defensiveModifier = 1.5;
    if (item === ItemsEnum.LesserCrackedOpal) {
      return new CharacterStats(0, baseLesserCrackedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.LesserCrackedRuby) {
      return new CharacterStats(0, 0, 0, 0, baseLesserCrackedStatValue, 0);
    }
    if (item === ItemsEnum.LesserCrackedAquamarine) {
      return new CharacterStats(0, 0, 0, baseLesserCrackedStatValue, 0, 0);
    }
    if (item === ItemsEnum.LesserCrackedEmerald) {
      return new CharacterStats(0, 0, baseLesserCrackedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.LesserCrackedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, baseLesserCrackedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.LesserCrackedTopaz) {
      return new CharacterStats(baseLesserCrackedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    var baseCrackedStatValue = 20;
    if (item === ItemsEnum.CrackedOpal) {
      return new CharacterStats(0, baseCrackedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.CrackedRuby) {
      return new CharacterStats(0, 0, 0, 0, baseCrackedStatValue, 0);
    }
    if (item === ItemsEnum.CrackedAquamarine) {
      return new CharacterStats(0, 0, 0, baseCrackedStatValue, 0, 0);
    }
    if (item === ItemsEnum.CrackedEmerald) {
      return new CharacterStats(0, 0, baseCrackedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.CrackedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, baseCrackedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.CrackedTopaz) {
      return new CharacterStats(baseCrackedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    return new CharacterStats(0, 0, 0, 0, 0, 0);
  }
}
