import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceGeneratorService {

  constructor(private globalService: GlobalService) { }

  getResourceFromItemType(type: ItemsEnum, amount: number) {
    //swords
    if (type === ItemsEnum.IronSword)
    {
      return new ResourceValue(ItemsEnum.IronSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeSword)
    {
      return new ResourceValue(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeSword)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelSword)
    {
      return new ResourceValue(ItemsEnum.SteelSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SwordOfFlames)
    {
      return new ResourceValue(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.GoldenSword)
    {
      return new ResourceValue(ItemsEnum.GoldenSword, ItemTypeEnum.Equipment, amount);
    }

    //hammers
    if (type === ItemsEnum.IronHammer)
    {
      return new ResourceValue(ItemsEnum.IronHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeHammer)
    {
      return new ResourceValue(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelHammer)
    {
      return new ResourceValue(ItemsEnum.SteelHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.DiamondHammer)
    {
      return new ResourceValue(ItemsEnum.DiamondHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FendingMace)
    {
      return new ResourceValue(ItemsEnum.FendingMace, ItemTypeEnum.Equipment, amount);
    }

    //bows
    if (type === ItemsEnum.ShortBow)
    {
      return new ResourceValue(ItemsEnum.ShortBow, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.LongBow)
    {
      return new ResourceValue(ItemsEnum.LongBow, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Venomstrike)
    {
      return new ResourceValue(ItemsEnum.Venomstrike, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.ElysianOakBow)
    {
      return new ResourceValue(ItemsEnum.ElysianOakBow, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Wolfsbane)
    {
      return new ResourceValue(ItemsEnum.Wolfsbane, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.EagleEye)
    {
      return new ResourceValue(ItemsEnum.EagleEye, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SpiritBow)
    {
      return new ResourceValue(ItemsEnum.SpiritBow, ItemTypeEnum.Equipment, amount);
    }

    //shields
    if (type === ItemsEnum.IronShield)
    {
      return new ResourceValue(ItemsEnum.IronShield, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeShield)
    {
      return new ResourceValue(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Aegis)
    {
      return new ResourceValue(ItemsEnum.Aegis, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.MoltenShield)
    {
      return new ResourceValue(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.ShieldOfTheHealer)
    {
      return new ResourceValue(ItemsEnum.ShieldOfTheHealer, ItemTypeEnum.Equipment, amount);
    }

    //armor
    if (type === ItemsEnum.LinenArmor)
    {
      return new ResourceValue(ItemsEnum.LinenArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.IronArmor)
    {
      return new ResourceValue(ItemsEnum.IronArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeArmor)
    {
      return new ResourceValue(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelArmor)
    {
      return new ResourceValue(ItemsEnum.SteelArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.MoltenArmor)
    {
      return new ResourceValue(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.HardenedLeatherArmor)
    {
      return new ResourceValue(ItemsEnum.HardenedLeatherArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BearskinArmor)
    {
      return new ResourceValue(ItemsEnum.BearskinArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BoarskinArmor)
    {
      return new ResourceValue(ItemsEnum.BoarskinArmor, ItemTypeEnum.Equipment, amount);
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket)
    {
      return new ResourceValue(ItemsEnum.ForgottenLocket, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.PendantOfFortune)
    {
      return new ResourceValue(ItemsEnum.PendantOfFortune, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.PendantOfPower)
    {
      return new ResourceValue(ItemsEnum.PendantOfPower, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.PendantOfSpeed)
    {
      return new ResourceValue(ItemsEnum.PendantOfSpeed, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.GemmedNecklace)
    {
      return new ResourceValue(ItemsEnum.GemmedNecklace, ItemTypeEnum.Equipment, amount);
    }

    //rings
    if (type === ItemsEnum.MoltenRing)
    {
      return new ResourceValue(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedAmethystRing)
    {
      return new ResourceValue(ItemsEnum.FracturedAmethystRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedRubyRing)
    {
      return new ResourceValue(ItemsEnum.FracturedRubyRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedTopazRing)
    {
      return new ResourceValue(ItemsEnum.FracturedTopazRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedEmeraldRing)
    {
      return new ResourceValue(ItemsEnum.FracturedEmeraldRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedOpalRing)
    {
      return new ResourceValue(ItemsEnum.FracturedOpalRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FracturedAquamarineRing)
    {
      return new ResourceValue(ItemsEnum.FracturedAquamarineRing, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BedazzledRing)
    {
      return new ResourceValue(ItemsEnum.BedazzledRing, ItemTypeEnum.Equipment, amount);
    }

    //equippables
    if (type === ItemsEnum.HealingHerb)
    {
      return new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.HealingPoultice)
    {
      return new ResourceValue(ItemsEnum.HealingPoultice, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.HealingSalve)
    {
      return new ResourceValue(ItemsEnum.HealingSalve, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.ThrowingStone)
    {
      return new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonFang)
    {
      return new ResourceValue(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonousToxin)
    {
      return new ResourceValue(ItemsEnum.PoisonousToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.DebilitatingToxin)
    {
      return new ResourceValue(ItemsEnum.DebilitatingToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.ExplodingPotion)
    {
      return new ResourceValue(ItemsEnum.ExplodingPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.FirePotion)
    {
      return new ResourceValue(ItemsEnum.FirePotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.StranglingGasPotion)
    {
      return new ResourceValue(ItemsEnum.StranglingGasPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonExtractPotion)
    {
      return new ResourceValue(ItemsEnum.PoisonExtractPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.HeroicElixir)
    {
      return new ResourceValue(ItemsEnum.HeroicElixir, ItemTypeEnum.Elixir, amount);
    }
    if (type === ItemsEnum.RejuvenatingElixir)
    {
      return new ResourceValue(ItemsEnum.RejuvenatingElixir, ItemTypeEnum.Elixir, amount);
    }
    if (type === ItemsEnum.HeftyStone)
    {
      return new ResourceValue(ItemsEnum.HeftyStone, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.RestorativeHerb)
    {
      return new ResourceValue(ItemsEnum.RestorativeHerb, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.FocusPotion)
    {
      return new ResourceValue(ItemsEnum.FocusPotion, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.WitheringToxin)
    {
      return new ResourceValue(ItemsEnum.WitheringToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.VenomousToxin)
    {
      return new ResourceValue(ItemsEnum.VenomousToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.ElixirOfFortitude)
    {
      return new ResourceValue(ItemsEnum.ElixirOfFortitude, ItemTypeEnum.Elixir, amount);
    }
    if (type === ItemsEnum.UnstablePotion)
    {
      return new ResourceValue(ItemsEnum.UnstablePotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.BoomingPotion)
    {
      return new ResourceValue(ItemsEnum.BoomingPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.RestorativePoultice)
    {
      return new ResourceValue(ItemsEnum.RestorativePoultice, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.RestorativeSalve)
    {
      return new ResourceValue(ItemsEnum.RestorativeSalve, ItemTypeEnum.HealingItem, amount);
    }

    //materials
    if (type === ItemsEnum.LightLeather)
    {
      return new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Leather)
    {
      return new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Wax)
    {
      return new ResourceValue(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Fennel) 
    {
      return new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Olive)
    {
      return new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Asphodelus)
    {
      return new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.VialOfTheLethe)
    {
      return new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.EssenceOfFire)
    {
      return new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SoulSpark)
    {
      return new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SatchelOfHerbs)
    {
      return new ResourceValue(ItemsEnum.SatchelOfHerbs, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SoulEssence)
    {
      return new ResourceValue(ItemsEnum.SoulEssence, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.BushelOfHerbs)
    {
      return new ResourceValue(ItemsEnum.BushelOfHerbs, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.VialOfLakeLerna)
    {
      return new ResourceValue(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Narcissus)
    {
      return new ResourceValue(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Goldroot)
    {
      return new ResourceValue(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Lousewort)
    {
      return new ResourceValue(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Violet)
    {
      return new ResourceValue(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.ThickLeather)
    {
      return new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.BearHide)
    {
      return new ResourceValue(ItemsEnum.BearHide, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.BoarHide)
    {
      return new ResourceValue(ItemsEnum.BoarHide, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SpiritEssence)
    {
      return new ResourceValue(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Sorrel)
    {
      return new ResourceValue(ItemsEnum.Sorrel, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.VialOfTheBlackSea)
    {
      return new ResourceValue(ItemsEnum.VialOfTheBlackSea, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallEmerald)
    {
      return new ResourceValue(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallRuby)
    {
      return new ResourceValue(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallOpal)
    {
      return new ResourceValue(ItemsEnum.SmallOpal, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallAquamarine)
    {
      return new ResourceValue(ItemsEnum.SmallAquamarine, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallTopaz)
    {
      return new ResourceValue(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SmallAmethyst)
    {
      return new ResourceValue(ItemsEnum.SmallAmethyst, ItemTypeEnum.CraftingMaterial, amount);
    }

    //charms
    if (type === ItemsEnum.SmallCharmOfDetermination)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfDetermination)
    {
      return new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.SmallCharmOfRejuvenation)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfRejuvenation)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.SmallCharmOfVulnerability)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfVulnerability)
    {
      return new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, ItemTypeEnum.Charm, amount);
    }

    //other
    if (type === ItemsEnum.SparringMatch)
    {
      return new ResourceValue(ItemsEnum.SparringMatch, ItemTypeEnum.Resource, amount);
    }
    if (type === ItemsEnum.WarriorClass)
    {
      return new ResourceValue(ItemsEnum.WarriorClass, ItemTypeEnum.Progression, amount);
    }
    if (type === ItemsEnum.PriestClass)
    {
      return new ResourceValue(ItemsEnum.PriestClass, ItemTypeEnum.Progression, amount);
    }
    if (type === ItemsEnum.Coin)
    {
      return new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, amount);
    }

    return new ResourceValue(ItemsEnum.None, ItemTypeEnum.None, 0);
  }
}
