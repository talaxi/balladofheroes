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
    if (type === ItemsEnum.ExtraSpeed1Hour) {
      return new ResourceValue(ItemsEnum.ExtraSpeed1Hour, amount);
    }

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
    if (type === ItemsEnum.HarpyTalon) {
      return new ResourceValue(ItemsEnum.HarpyTalon, amount);
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
    if (type === ItemsEnum.RingOfCurses) {
      return new ResourceValue(ItemsEnum.RingOfCurses, amount);
    }
    if (type === ItemsEnum.SirensongRing) {
      return new ResourceValue(ItemsEnum.SirensongRing, amount);
    }
    if (type === ItemsEnum.BloodyShield) {
      return new ResourceValue(ItemsEnum.BloodyShield, amount);
    }
    if (type === ItemsEnum.SpiritShield) {
      return new ResourceValue(ItemsEnum.SpiritShield, amount);
    }
    if (type === ItemsEnum.JaggedSword) {
      return new ResourceValue(ItemsEnum.JaggedSword, amount);
    }
    if (type === ItemsEnum.BirchBow) {
      return new ResourceValue(ItemsEnum.BirchBow, amount);
    }
    if (type === ItemsEnum.RadiatingHammer) {
      return new ResourceValue(ItemsEnum.RadiatingHammer, amount);
    }
    if (type === ItemsEnum.LightShield) {
      return new ResourceValue(ItemsEnum.LightShield, amount);
    }
    if (type === ItemsEnum.FurArmor) {
      return new ResourceValue(ItemsEnum.FurArmor, amount);
    }
    if (type === ItemsEnum.ScaleArmor) {
      return new ResourceValue(ItemsEnum.ScaleArmor, amount);
    }
    if (type === ItemsEnum.HideArmor) {
      return new ResourceValue(ItemsEnum.HideArmor, amount);
    }
    if (type === ItemsEnum.HesperidianArmor) {
      return new ResourceValue(ItemsEnum.HesperidianArmor, amount);
    }
    if (type === ItemsEnum.SafeRing) {
      return new ResourceValue(ItemsEnum.SafeRing, amount);
    }
    if (type === ItemsEnum.BronzeBeakNecklace) {
      return new ResourceValue(ItemsEnum.BronzeBeakNecklace, amount);
    }
    if (type === ItemsEnum.BloodyNecklace) {
      return new ResourceValue(ItemsEnum.BloodyNecklace, amount);
    }
    if (type === ItemsEnum.AthenasScythe) {
      return new ResourceValue(ItemsEnum.AthenasScythe, amount);
    }
    if (type === ItemsEnum.ArtemissBow) {
      return new ResourceValue(ItemsEnum.ArtemissBow, amount);
    }
    if (type === ItemsEnum.HermessStaff) {
      return new ResourceValue(ItemsEnum.HermessStaff, amount);
    }
    if (type === ItemsEnum.ApollosBow) {
      return new ResourceValue(ItemsEnum.ApollosBow, amount);
    }
    if (type === ItemsEnum.HadessBident) {
      return new ResourceValue(ItemsEnum.HadessBident, amount);
    }
    if (type === ItemsEnum.AressSpear) {
      return new ResourceValue(ItemsEnum.AressSpear, amount);
    }
    if (type === ItemsEnum.NemesissSword) {
      return new ResourceValue(ItemsEnum.NemesissSword, amount);
    }
    if (type === ItemsEnum.DionysussScepter) {
      return new ResourceValue(ItemsEnum.DionysussScepter, amount);
    }
    if (type === ItemsEnum.ZeussLightningBolts) {
      return new ResourceValue(ItemsEnum.ZeussLightningBolts, amount);
    }
    if (type === ItemsEnum.AthenasShield) {
      return new ResourceValue(ItemsEnum.AthenasShield, amount);
    }
    if (type === ItemsEnum.AthenasArmor) {
      return new ResourceValue(ItemsEnum.AthenasArmor, amount);
    }
    if (type === ItemsEnum.AthenasRing) {
      return new ResourceValue(ItemsEnum.AthenasRing, amount);
    }
    if (type === ItemsEnum.AthenasNecklace) {
      return new ResourceValue(ItemsEnum.AthenasNecklace, amount);
    }
    if (type === ItemsEnum.ArtemissShield) {
      return new ResourceValue(ItemsEnum.ArtemissShield, amount);
    }
    if (type === ItemsEnum.ArtemissArmor) {
      return new ResourceValue(ItemsEnum.ArtemissArmor, amount);
    }
    if (type === ItemsEnum.ArtemissRing) {
      return new ResourceValue(ItemsEnum.ArtemissRing, amount);
    }
    if (type === ItemsEnum.ArtemissNecklace) {
      return new ResourceValue(ItemsEnum.ArtemissNecklace, amount);
    }
    if (type === ItemsEnum.HermessShield) {
      return new ResourceValue(ItemsEnum.HermessShield, amount);
    }
    if (type === ItemsEnum.HermessArmor) {
      return new ResourceValue(ItemsEnum.HermessArmor, amount);
    }
    if (type === ItemsEnum.HermessRing) {
      return new ResourceValue(ItemsEnum.HermessRing, amount);
    }
    if (type === ItemsEnum.HermessNecklace) {
      return new ResourceValue(ItemsEnum.HermessNecklace, amount);
    }
    if (type === ItemsEnum.ApollosShield) {
      return new ResourceValue(ItemsEnum.ApollosShield, amount);
    }
    if (type === ItemsEnum.ApollosArmor) {
      return new ResourceValue(ItemsEnum.ApollosArmor, amount);
    }
    if (type === ItemsEnum.ApollosRing) {
      return new ResourceValue(ItemsEnum.ApollosRing, amount);
    }
    if (type === ItemsEnum.ApollosNecklace) {
      return new ResourceValue(ItemsEnum.ApollosNecklace, amount);
    }
    if (type === ItemsEnum.HadessShield) {
      return new ResourceValue(ItemsEnum.HadessShield, amount);
    }
    if (type === ItemsEnum.HadessArmor) {
      return new ResourceValue(ItemsEnum.HadessArmor, amount);
    }
    if (type === ItemsEnum.HadessRing) {
      return new ResourceValue(ItemsEnum.HadessRing, amount);
    }
    if (type === ItemsEnum.HadessNecklace) {
      return new ResourceValue(ItemsEnum.HadessNecklace, amount);
    }
    if (type === ItemsEnum.AressShield) {
      return new ResourceValue(ItemsEnum.AressShield, amount);
    }
    if (type === ItemsEnum.AressArmor) {
      return new ResourceValue(ItemsEnum.AressArmor, amount);
    }
    if (type === ItemsEnum.AressRing) {
      return new ResourceValue(ItemsEnum.AressRing, amount);
    }
    if (type === ItemsEnum.AressNecklace) {
      return new ResourceValue(ItemsEnum.AressNecklace, amount);
    }
    if (type === ItemsEnum.NemesissShield) {
      return new ResourceValue(ItemsEnum.NemesissShield, amount);
    }
    if (type === ItemsEnum.NemesissArmor) {
      return new ResourceValue(ItemsEnum.NemesissArmor, amount);
    }
    if (type === ItemsEnum.NemesissRing) {
      return new ResourceValue(ItemsEnum.NemesissRing, amount);
    }
    if (type === ItemsEnum.NemesissNecklace) {
      return new ResourceValue(ItemsEnum.NemesissNecklace, amount);
    }
    if (type === ItemsEnum.DionysussShield) {
      return new ResourceValue(ItemsEnum.DionysussShield, amount);
    }
    if (type === ItemsEnum.DionysussArmor) {
      return new ResourceValue(ItemsEnum.DionysussArmor, amount);
    }
    if (type === ItemsEnum.DionysussRing) {
      return new ResourceValue(ItemsEnum.DionysussRing, amount);
    }
    if (type === ItemsEnum.DionysussNecklace) {
      return new ResourceValue(ItemsEnum.DionysussNecklace, amount);
    }
    if (type === ItemsEnum.ZeussShield) {
      return new ResourceValue(ItemsEnum.ZeussShield, amount);
    }
    if (type === ItemsEnum.ZeussArmor) {
      return new ResourceValue(ItemsEnum.ZeussArmor, amount);
    }
    if (type === ItemsEnum.ZeussRing) {
      return new ResourceValue(ItemsEnum.ZeussRing, amount);
    }
    if (type === ItemsEnum.ZeussNecklace) {
      return new ResourceValue(ItemsEnum.ZeussNecklace, amount);
    }
    if (type === ItemsEnum.GiantHammer) {
      return new ResourceValue(ItemsEnum.GiantHammer, amount);
    }
    if (type === ItemsEnum.GiantSword) {
      return new ResourceValue(ItemsEnum.GiantSword, amount);
    }
    if (type === ItemsEnum.GiantRing) {
      return new ResourceValue(ItemsEnum.GiantRing, amount);
    }
    if (type === ItemsEnum.GiantNecklace) {
      return new ResourceValue(ItemsEnum.GiantNecklace, amount);
    }
    if (type === ItemsEnum.GiantArmor) {
      return new ResourceValue(ItemsEnum.GiantArmor, amount);
    }
    if (type === ItemsEnum.GiantShield) {
      return new ResourceValue(ItemsEnum.GiantShield, amount);
    }
    if (type === ItemsEnum.PorphyrionsMace) {
      return new ResourceValue(ItemsEnum.PorphyrionsMace, amount);
    }
    if (type === ItemsEnum.DivinePlate) {
      return new ResourceValue(ItemsEnum.DivinePlate, amount);
    }
    if (type === ItemsEnum.DivineTarge) {
      return new ResourceValue(ItemsEnum.DivineTarge, amount);
    }
    if (type === ItemsEnum.PoseidonsTrident) {
      return new ResourceValue(ItemsEnum.PoseidonsTrident, amount);
    }
    if (type === ItemsEnum.PoseidonsShield) {
      return new ResourceValue(ItemsEnum.PoseidonsShield, amount);
    }
    if (type === ItemsEnum.PoseidonsArmor) {
      return new ResourceValue(ItemsEnum.PoseidonsArmor, amount);
    }
    if (type === ItemsEnum.PoseidonsRing) {
      return new ResourceValue(ItemsEnum.PoseidonsRing, amount);
    }
    if (type === ItemsEnum.PoseidonsNecklace) {
      return new ResourceValue(ItemsEnum.PoseidonsNecklace, amount);
    }
    if (type === ItemsEnum.ShadowSpear) {
      return new ResourceValue(ItemsEnum.ShadowSpear, amount);
    }
    if (type === ItemsEnum.ShadowShield) {
      return new ResourceValue(ItemsEnum.ShadowShield, amount);
    }
    if (type === ItemsEnum.ShadowArmor) {
      return new ResourceValue(ItemsEnum.ShadowArmor, amount);
    }
    if (type === ItemsEnum.ShadowRing) {
      return new ResourceValue(ItemsEnum.ShadowRing, amount);
    }
    if (type === ItemsEnum.ShadowNecklace) {
      return new ResourceValue(ItemsEnum.ShadowNecklace, amount);
    }
    if (type === ItemsEnum.RagingBull) {
      return new ResourceValue(ItemsEnum.RagingBull, amount);
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
    if (type === ItemsEnum.PiercingPotion) {
      return new ResourceValue(ItemsEnum.PiercingPotion, amount);
    }
    if (type === ItemsEnum.ElixirOfSpeed) {
      return new ResourceValue(ItemsEnum.ElixirOfSpeed, amount);
    }
    if (type === ItemsEnum.HoneyPoultice) {
      return new ResourceValue(ItemsEnum.HoneyPoultice, amount);
    }
    if (type === ItemsEnum.HoneySalve) {
      return new ResourceValue(ItemsEnum.HoneySalve, amount);
    }
    if (type === ItemsEnum.FlamingToxin) {
      return new ResourceValue(ItemsEnum.FlamingToxin, amount);
    }
    if (type === ItemsEnum.SlowingPotion) {
      return new ResourceValue(ItemsEnum.SlowingPotion, amount);
    }
    if (type === ItemsEnum.PotentConcoction) {
      return new ResourceValue(ItemsEnum.PotentConcoction, amount);
    }
    if (type === ItemsEnum.SandToxin) {
      return new ResourceValue(ItemsEnum.SandToxin, amount);
    }
    if (type === ItemsEnum.ElectrifiedToxin) {
      return new ResourceValue(ItemsEnum.ElectrifiedToxin, amount);
    }
    if (type === ItemsEnum.MagicToxin) {
      return new ResourceValue(ItemsEnum.MagicToxin, amount);
    }
    if (type === ItemsEnum.BouncingPotion) {
      return new ResourceValue(ItemsEnum.BouncingPotion, amount);
    }
    if (type === ItemsEnum.MagicRevivify) {
      return new ResourceValue(ItemsEnum.MagicRevivify, amount);
    }
    if (type === ItemsEnum.MagicSalve) {
      return new ResourceValue(ItemsEnum.MagicSalve, amount);
    }
    if (type === ItemsEnum.ElixirOfFortune) {
      return new ResourceValue(ItemsEnum.ElixirOfFortune, amount);
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
    if (type === ItemsEnum.PotentEssence) {
      return new ResourceValue(ItemsEnum.PotentEssence, amount);
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
    if (type === ItemsEnum.MetalNuggets) {
      return new ResourceValue(ItemsEnum.MetalNuggets, amount);
    }
    if (type === ItemsEnum.Ambrosia) {
      return new ResourceValue(ItemsEnum.Ambrosia, amount);
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
    if (type === ItemsEnum.WeaponSlotAddition) {
      return new ResourceValue(ItemsEnum.WeaponSlotAddition, amount);
    }
    if (type === ItemsEnum.ArmorSlotAddition) {
      return new ResourceValue(ItemsEnum.ArmorSlotAddition, amount);
    }
    if (type === ItemsEnum.RingSlotAddition) {
      return new ResourceValue(ItemsEnum.RingSlotAddition, amount);
    }
    if (type === ItemsEnum.ShieldSlotAddition) {
      return new ResourceValue(ItemsEnum.ShieldSlotAddition, amount);
    }
    if (type === ItemsEnum.NecklaceSlotAddition) {
      return new ResourceValue(ItemsEnum.NecklaceSlotAddition, amount);
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
    if (type === ItemsEnum.ToxicIchor) {
      return new ResourceValue(ItemsEnum.ToxicIchor, amount);
    }
    if (type === ItemsEnum.CoarseFur) {
      return new ResourceValue(ItemsEnum.CoarseFur, amount);
    }
    if (type === ItemsEnum.SerpentScale) {
      return new ResourceValue(ItemsEnum.SerpentScale, amount);
    }
    if (type === ItemsEnum.Honey) {
      return new ResourceValue(ItemsEnum.Honey, amount);
    }
    if (type === ItemsEnum.AnimalHide) {
      return new ResourceValue(ItemsEnum.AnimalHide, amount);
    }
    if (type === ItemsEnum.EssenceOfWater) {
      return new ResourceValue(ItemsEnum.EssenceOfWater, amount);
    }
    if (type === ItemsEnum.Tusk) {
      return new ResourceValue(ItemsEnum.Tusk, amount);
    }
    if (type === ItemsEnum.SharpFeather) {
      return new ResourceValue(ItemsEnum.SharpFeather, amount);
    }
    if (type === ItemsEnum.MagicTreeBark) {
      return new ResourceValue(ItemsEnum.MagicTreeBark, amount);
    }
    if (type === ItemsEnum.BronzeBeak) {
      return new ResourceValue(ItemsEnum.BronzeBeak, amount);
    }
    if (type === ItemsEnum.SmallAnimalBones) {
      return new ResourceValue(ItemsEnum.SmallAnimalBones, amount);
    }
    if (type === ItemsEnum.VialOfTheCretanSea) {
      return new ResourceValue(ItemsEnum.VialOfTheCretanSea, amount);
    }
    if (type === ItemsEnum.CanineFang) {
      return new ResourceValue(ItemsEnum.CanineFang, amount);
    }
    if (type === ItemsEnum.PristineCrabClaw) {
      return new ResourceValue(ItemsEnum.PristineCrabClaw, amount);
    }
    if (type === ItemsEnum.BirchBark) {
      return new ResourceValue(ItemsEnum.BirchBark, amount);
    }
    if (type === ItemsEnum.RadiatingGemstone) {
      return new ResourceValue(ItemsEnum.RadiatingGemstone, amount);
    }
    if (type === ItemsEnum.WhiteHorn) {
      return new ResourceValue(ItemsEnum.WhiteHorn, amount);
    }    
    if (type === ItemsEnum.BlackHorn) {
      return new ResourceValue(ItemsEnum.BlackHorn, amount);
    }
    if (type === ItemsEnum.MagicCore) {
      return new ResourceValue(ItemsEnum.MagicCore, amount);
    }    
    if (type === ItemsEnum.EssenceOfAir) {
      return new ResourceValue(ItemsEnum.EssenceOfAir, amount);
    }
    if (type === ItemsEnum.EssenceOfEarth) {
      return new ResourceValue(ItemsEnum.EssenceOfEarth, amount);
    }
    if (type === ItemsEnum.EssenceOfLightning) {
      return new ResourceValue(ItemsEnum.EssenceOfLightning, amount);
    }
    if (type === ItemsEnum.EssenceOfHoly) {
      return new ResourceValue(ItemsEnum.EssenceOfHoly, amount);
    }
    if (type === ItemsEnum.Nectar) {
      return new ResourceValue(ItemsEnum.Nectar, amount);
    }
    if (type === ItemsEnum.OlympicCommendation)
      return new ResourceValue(ItemsEnum.OlympicCommendation, amount);
    if (type === ItemsEnum.RadiatingAirStone)
      return new ResourceValue(ItemsEnum.RadiatingAirStone, amount);
    if (type === ItemsEnum.RadiatingEarthStone)
      return new ResourceValue(ItemsEnum.RadiatingEarthStone, amount);
    if (type === ItemsEnum.RadiatingLightningStone)
      return new ResourceValue(ItemsEnum.RadiatingLightningStone, amount);
    if (type === ItemsEnum.RadiatingHolyStone)
      return new ResourceValue(ItemsEnum.RadiatingHolyStone, amount);
    if (type === ItemsEnum.RadiatingFireStone)
      return new ResourceValue(ItemsEnum.RadiatingFireStone, amount);
    if (type === ItemsEnum.RadiatingWaterStone)
      return new ResourceValue(ItemsEnum.RadiatingWaterStone, amount);
      if (type === ItemsEnum.PerfectRadiatingAirStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingAirStone, amount);
    if (type === ItemsEnum.PerfectRadiatingEarthStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingEarthStone, amount);
    if (type === ItemsEnum.PerfectRadiatingLightningStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingLightningStone, amount);
    if (type === ItemsEnum.PerfectRadiatingHolyStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingHolyStone, amount);
    if (type === ItemsEnum.PerfectRadiatingFireStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingFireStone, amount);
    if (type === ItemsEnum.PerfectRadiatingWaterStone)
      return new ResourceValue(ItemsEnum.PerfectRadiatingWaterStone, amount);

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
    if (type === ItemsEnum.PerfectCrackedRuby) {
      return new ResourceValue(ItemsEnum.PerfectCrackedRuby, amount);
    }
    if (type === ItemsEnum.PerfectCrackedEmerald) {
      return new ResourceValue(ItemsEnum.PerfectCrackedEmerald, amount);
    }
    if (type === ItemsEnum.PerfectCrackedAquamarine) {
      return new ResourceValue(ItemsEnum.PerfectCrackedAquamarine, amount);
    }
    if (type === ItemsEnum.PerfectCrackedTopaz) {
      return new ResourceValue(ItemsEnum.PerfectCrackedTopaz, amount);
    }
    if (type === ItemsEnum.PerfectCrackedOpal) {
      return new ResourceValue(ItemsEnum.PerfectCrackedOpal, amount);
    }
    if (type === ItemsEnum.PerfectCrackedAmethyst) {
      return new ResourceValue(ItemsEnum.PerfectCrackedAmethyst, amount);
    }
    if (type === ItemsEnum.PerfectDullRuby) {
      return new ResourceValue(ItemsEnum.PerfectDullRuby, amount);
    }
    if (type === ItemsEnum.PerfectDullEmerald) {
      return new ResourceValue(ItemsEnum.PerfectDullEmerald, amount);
    }
    if (type === ItemsEnum.PerfectDullAquamarine) {
      return new ResourceValue(ItemsEnum.PerfectDullAquamarine, amount);
    }
    if (type === ItemsEnum.PerfectDullTopaz) {
      return new ResourceValue(ItemsEnum.PerfectDullTopaz, amount);
    }
    if (type === ItemsEnum.PerfectDullOpal) {
      return new ResourceValue(ItemsEnum.PerfectDullOpal, amount);
    }
    if (type === ItemsEnum.PerfectDullAmethyst) {
      return new ResourceValue(ItemsEnum.PerfectDullAmethyst, amount);
    }
    if (type === ItemsEnum.FlawedRuby) {
      return new ResourceValue(ItemsEnum.FlawedRuby, amount);
    }
    if (type === ItemsEnum.FlawedEmerald) {
      return new ResourceValue(ItemsEnum.FlawedEmerald, amount);
    }
    if (type === ItemsEnum.FlawedAquamarine) {
      return new ResourceValue(ItemsEnum.FlawedAquamarine, amount);
    }
    if (type === ItemsEnum.FlawedTopaz) {
      return new ResourceValue(ItemsEnum.FlawedTopaz, amount);
    }
    if (type === ItemsEnum.FlawedOpal) {
      return new ResourceValue(ItemsEnum.FlawedOpal, amount);
    }
    if (type === ItemsEnum.FlawedAmethyst) {
      return new ResourceValue(ItemsEnum.FlawedAmethyst, amount);
    }
    if (type === ItemsEnum.PerfectFlawedRuby) {
      return new ResourceValue(ItemsEnum.PerfectFlawedRuby, amount);
    }
    if (type === ItemsEnum.PerfectFlawedEmerald) {
      return new ResourceValue(ItemsEnum.PerfectFlawedEmerald, amount);
    }
    if (type === ItemsEnum.PerfectFlawedAquamarine) {
      return new ResourceValue(ItemsEnum.PerfectFlawedAquamarine, amount);
    }
    if (type === ItemsEnum.PerfectFlawedTopaz) {
      return new ResourceValue(ItemsEnum.PerfectFlawedTopaz, amount);
    }
    if (type === ItemsEnum.PerfectFlawedOpal) {
      return new ResourceValue(ItemsEnum.PerfectFlawedOpal, amount);
    }
    if (type === ItemsEnum.PerfectFlawedAmethyst) {
      return new ResourceValue(ItemsEnum.PerfectFlawedAmethyst, amount);
    }    
    if (type === ItemsEnum.LesserFlawedRuby) {
      return new ResourceValue(ItemsEnum.LesserFlawedRuby, amount);
    }
    if (type === ItemsEnum.LesserFlawedEmerald) {
      return new ResourceValue(ItemsEnum.LesserFlawedEmerald, amount);
    }
    if (type === ItemsEnum.LesserFlawedAquamarine) {
      return new ResourceValue(ItemsEnum.LesserFlawedAquamarine, amount);
    }
    if (type === ItemsEnum.LesserFlawedTopaz) {
      return new ResourceValue(ItemsEnum.LesserFlawedTopaz, amount);
    }
    if (type === ItemsEnum.LesserFlawedOpal) {
      return new ResourceValue(ItemsEnum.LesserFlawedOpal, amount);
    }
    if (type === ItemsEnum.LesserFlawedAmethyst) {
      return new ResourceValue(ItemsEnum.LesserFlawedAmethyst, amount);
    }    
    if (type === ItemsEnum.PointedStone) {
      return new ResourceValue(ItemsEnum.PointedStone, amount);
    }
    if (type === ItemsEnum.PerfectPointedStone) {
      return new ResourceValue(ItemsEnum.PerfectPointedStone, amount);
    }
    if (type === ItemsEnum.ShiningStone) {
      return new ResourceValue(ItemsEnum.ShiningStone, amount);
    }
    if (type === ItemsEnum.PerfectShiningStone) {
      return new ResourceValue(ItemsEnum.PerfectShiningStone, amount);
    }
    if (type === ItemsEnum.JaggedStone) {
      return new ResourceValue(ItemsEnum.JaggedStone, amount);
    }
    if (type === ItemsEnum.PerfectJaggedStone) {
      return new ResourceValue(ItemsEnum.PerfectJaggedStone, amount);
    }
    if (type === ItemsEnum.BlessedStone) {
      return new ResourceValue(ItemsEnum.BlessedStone, amount);
    }
    if (type === ItemsEnum.PerfectBlessedStone) {
      return new ResourceValue(ItemsEnum.PerfectBlessedStone, amount);
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
    if (type === ItemsEnum.MonkClass) {
      return new ResourceValue(ItemsEnum.MonkClass, amount);
    }  
    if (type === ItemsEnum.Dionysus) {
      return new ResourceValue(ItemsEnum.Dionysus, amount);
    }
    if (type === ItemsEnum.Nemesis) {
      return new ResourceValue(ItemsEnum.Nemesis, amount);
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
    if (type === ItemsEnum.AugeanStables1) {
      return new ResourceValue(ItemsEnum.AugeanStables1, amount);
    }
    if (type === ItemsEnum.AugeanStables2) {
      return new ResourceValue(ItemsEnum.AugeanStables2, amount);
    }
    if (type === ItemsEnum.AugeanStables3) {
      return new ResourceValue(ItemsEnum.AugeanStables3, amount);
    }
    if (type === ItemsEnum.DarkOrb) {
      return new ResourceValue(ItemsEnum.DarkOrb, amount);
    }

    return new ResourceValue(ItemsEnum.None, 0);
  }

  getSlotItemValues(item: ItemsEnum) {
    var baseLesserCrackedStatValue = 15;
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

    var baseCrackedStatValue = 30;
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

    var basePerfectCrackedStatValue = 45;
    if (item === ItemsEnum.PerfectCrackedOpal) {
      return new CharacterStats(0, basePerfectCrackedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectCrackedRuby) {
      return new CharacterStats(0, 0, 0, 0, basePerfectCrackedStatValue, 0);
    }
    if (item === ItemsEnum.PerfectCrackedAquamarine) {
      return new CharacterStats(0, 0, 0, basePerfectCrackedStatValue, 0, 0);
    }
    if (item === ItemsEnum.PerfectCrackedEmerald) {
      return new CharacterStats(0, 0, basePerfectCrackedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectCrackedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, basePerfectCrackedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.PerfectCrackedTopaz) {
      return new CharacterStats(basePerfectCrackedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    if (item === ItemsEnum.PointedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.thorns += 50;
      return stats;
    }
    if (item === ItemsEnum.ShiningStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.hpRegen += 8;
      return stats;
    }
    if (item === ItemsEnum.PerfectPointedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.thorns += 75;
      return stats;
    }
    if (item === ItemsEnum.PerfectShiningStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.hpRegen += 12;
      return stats;
    }
    if (item === ItemsEnum.JaggedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.thorns += 200;
      return stats;
    }
    if (item === ItemsEnum.BlessedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.hpRegen += 20;
      return stats;
    }
    if (item === ItemsEnum.PerfectJaggedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.thorns += 300;
      return stats;
    }
    if (item === ItemsEnum.PerfectBlessedStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.hpRegen += 30;
      return stats;
    }

    var baseDullStatValue = 60;
    if (item === ItemsEnum.DullOpal) {
      return new CharacterStats(0, baseDullStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.DullRuby) {
      return new CharacterStats(0, 0, 0, 0, baseDullStatValue, 0);
    }
    if (item === ItemsEnum.DullAquamarine) {
      return new CharacterStats(0, 0, 0, baseDullStatValue, 0, 0);
    }
    if (item === ItemsEnum.DullEmerald) {
      return new CharacterStats(0, 0, baseDullStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.DullAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, baseDullStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.DullTopaz) {
      return new CharacterStats(baseDullStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    var basePerfectDullStatValue = 90;
    if (item === ItemsEnum.PerfectDullOpal) {
      return new CharacterStats(0, basePerfectDullStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectDullRuby) {
      return new CharacterStats(0, 0, 0, 0, basePerfectDullStatValue, 0);
    }
    if (item === ItemsEnum.PerfectDullAquamarine) {
      return new CharacterStats(0, 0, 0, basePerfectDullStatValue, 0, 0);
    }
    if (item === ItemsEnum.PerfectDullEmerald) {
      return new CharacterStats(0, 0, basePerfectDullStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectDullAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, basePerfectDullStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.PerfectDullTopaz) {
      return new CharacterStats(basePerfectDullStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    var baseFlawedStatValue = 120;
    if (item === ItemsEnum.FlawedOpal) {
      return new CharacterStats(0, baseFlawedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.FlawedRuby) {
      return new CharacterStats(0, 0, 0, 0, baseFlawedStatValue, 0);
    }
    if (item === ItemsEnum.FlawedAquamarine) {
      return new CharacterStats(0, 0, 0, baseFlawedStatValue, 0, 0);
    }
    if (item === ItemsEnum.FlawedEmerald) {
      return new CharacterStats(0, 0, baseFlawedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.FlawedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, baseFlawedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.FlawedTopaz) {
      return new CharacterStats(baseFlawedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    var baseLesserFlawedStatValue = 90;
    if (item === ItemsEnum.LesserFlawedOpal) {
      return new CharacterStats(0, baseLesserFlawedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.LesserFlawedRuby) {
      return new CharacterStats(0, 0, 0, 0, baseLesserFlawedStatValue, 0);
    }
    if (item === ItemsEnum.LesserFlawedAquamarine) {
      return new CharacterStats(0, 0, 0, baseLesserFlawedStatValue, 0, 0);
    }
    if (item === ItemsEnum.LesserFlawedEmerald) {
      return new CharacterStats(0, 0, baseLesserFlawedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.LesserFlawedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, baseLesserFlawedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.LesserFlawedTopaz) {
      return new CharacterStats(baseLesserFlawedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }
    
    var basePerfectFlawedStatValue = 180;
    if (item === ItemsEnum.PerfectFlawedOpal) {
      return new CharacterStats(0, basePerfectFlawedStatValue, 0, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectFlawedRuby) {
      return new CharacterStats(0, 0, 0, 0, basePerfectFlawedStatValue, 0);
    }
    if (item === ItemsEnum.PerfectFlawedAquamarine) {
      return new CharacterStats(0, 0, 0, basePerfectFlawedStatValue, 0, 0);
    }
    if (item === ItemsEnum.PerfectFlawedEmerald) {
      return new CharacterStats(0, 0, basePerfectFlawedStatValue * defensiveModifier, 0, 0, 0);
    }
    if (item === ItemsEnum.PerfectFlawedAmethyst) {
      return new CharacterStats(0, 0, 0, 0, 0, basePerfectFlawedStatValue * defensiveModifier);
    }
    if (item === ItemsEnum.PerfectFlawedTopaz) {
      return new CharacterStats(basePerfectFlawedStatValue * defensiveModifier * hpModifier, 0, 0, 0, 0, 0);
    }

    var baseRadiatingStoneValue = .05;
    if (item === ItemsEnum.RadiatingHolyStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.holy = baseRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.RadiatingFireStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.fire = baseRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.RadiatingLightningStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.lightning = baseRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.RadiatingAirStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.air = baseRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.RadiatingEarthStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.earth = baseRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.RadiatingWaterStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.water = baseRadiatingStoneValue;
      return stats;
    }

    var basePerfectRadiatingStoneValue = .075;
    if (item === ItemsEnum.PerfectRadiatingHolyStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.holy = basePerfectRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.PerfectRadiatingFireStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.fire = basePerfectRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.PerfectRadiatingLightningStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.lightning = basePerfectRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.PerfectRadiatingAirStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.air = basePerfectRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.PerfectRadiatingEarthStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.earth = basePerfectRadiatingStoneValue;
      return stats;
    }
    if (item === ItemsEnum.PerfectRadiatingWaterStone) {
      var stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      stats.elementIncrease.water = basePerfectRadiatingStoneValue;
      return stats;
    }

    return new CharacterStats(0, 0, 0, 0, 0, 0);
  }
}
