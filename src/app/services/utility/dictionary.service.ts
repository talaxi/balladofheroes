import { Injectable } from '@angular/core';
import { ItemsEnum } from '../../models/enums/items-enum.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor() { }

  getItemName(type: ItemsEnum) {
    var name = "";

    //resources
    if (type === ItemsEnum.Coin)
      name = "Coin";

    //progression
    if (type === ItemsEnum.ChthonicFavor)
      name = "Chthonic Favor";
    if (type === ItemsEnum.ChthonicPower)
      name = "Chthonic Power";
    if (type === ItemsEnum.BoonOfOlympus)
      name = "Boon of Olympus";
    if (type === ItemsEnum.ItemBeltUp)
      name = "Item Belt Size";

    //healing items
    if (type === ItemsEnum.HealingHerb)
      name = "Healing Herb";
    if (type === ItemsEnum.HealingPoultice)
      name = "Healing Poultice";
    if (type === ItemsEnum.HealingSalve)
      name = "Healing Salve";
    if (type === ItemsEnum.RestorativeHerb)
      name = "Restorative Herb";
    if (type === ItemsEnum.RestorativePoultice)
      name = "Restorative Poultice";
    if (type === ItemsEnum.RestorativeSalve)
      name = "Restorative Salve";
    else if (type === ItemsEnum.FocusPotion)
      name = "Focus Potion";

    //battle items
    else if (type === ItemsEnum.ThrowingStone)
      name = "Throwing Stone";
    else if (type === ItemsEnum.HeftyStone)
      name = "Hefty Stone";
    else if (type === ItemsEnum.PoisonFang)
      name = "Poison Fang";
    else if (type === ItemsEnum.PoisonousToxin)
      name = "Poisonous Toxin";
    else if (type === ItemsEnum.DebilitatingToxin)
      name = "Debilitating Toxin";
    else if (type === ItemsEnum.WitheringToxin)
      name = "Withering Toxin";
    else if (type === ItemsEnum.VenomousToxin)
      name = "Venomous Toxin";
    else if (type === ItemsEnum.FirePotion)
      name = "Fire Potion";
    else if (type === ItemsEnum.ExplodingPotion)
      name = "Exploding Potion";
    else if (type === ItemsEnum.StranglingGasPotion)
      name = "Strangling Gas Potion";
    else if (type === ItemsEnum.PoisonExtractPotion)
      name = "Poison Extract Potion";
    else if (type === ItemsEnum.UnstablePotion)
      name = "Unstable Potion";
    else if (type === ItemsEnum.BoomingPotion)
      name = "Booming Potion";
    else if (type === ItemsEnum.HeroicElixir)
      name = "Heroic Elixir";
    else if (type === ItemsEnum.RejuvenatingElixir)
      name = "Rejuvenating Elixir";
    else if (type === ItemsEnum.ElixirOfFortitude)
      name = "Elixir of Fortitude";

    //equipment
    //swords
    else if (type === ItemsEnum.IronSword)
      name = "Iron Sword";
    else if (type === ItemsEnum.BronzeSword)
      name = "Bronze Sword";
    else if (type === ItemsEnum.FortifiedBronzeSword)
      name = "Fortified Bronze Sword";
    else if (type === ItemsEnum.SteelSword)
      name = "Steel Sword";
    else if (type === ItemsEnum.SwordOfFlames)
      name = "Sword of Flames";
    else if (type === ItemsEnum.GoldenSword)
      name = "Golden Sword";
    else if (type === ItemsEnum.LiquidSaber)
      name = "Liquid Saber";
    else if (type === ItemsEnum.BlackLance)
      name = "Black Lance";

    //hammers
    else if (type === ItemsEnum.IronHammer)
      name = "Iron Hammer";
    else if (type === ItemsEnum.BronzeHammer)
      name = "Bronze Hammer";
    else if (type === ItemsEnum.FortifiedBronzeHammer)
      name = "Fortified Bronze Hammer";
    else if (type === ItemsEnum.SteelHammer)
      name = "Steel Hammer";
    else if (type === ItemsEnum.FendingMace)
      name = "Fending Mace";
    else if (type === ItemsEnum.DiamondHammer)
      name = "Diamond Hammer";

    //bows
    else if (type === ItemsEnum.ShortBow)
      name = "Short Bow";
    else if (type === ItemsEnum.LongBow)
      name = "Long Bow";
    else if (type === ItemsEnum.Venomstrike)
      name = "Venomstrike";
    else if (type === ItemsEnum.Wolfsbane)
      name = "Wolfsbane";
    else if (type === ItemsEnum.EagleEye)
      name = "Eagle Eye";
    else if (type === ItemsEnum.ElysianOakBow)
      name = "Elysian Oak Bow";
    else if (type === ItemsEnum.SpiritBow)
      name = "Spirit Bow";

    //shields
    else if (type === ItemsEnum.IronShield)
      name = "Iron Shield";
    else if (type === ItemsEnum.BronzeShield)
      name = "Bronze Shield";
    else if (type === ItemsEnum.Aegis)
      name = "Aegis";
    else if (type === ItemsEnum.MoltenShield)
      name = "Molten Shield";
    else if (type === ItemsEnum.ShieldOfTheHealer)
      name = "Shield of the Healer";
    else if (type === ItemsEnum.ShieldOfTheSea)
      name = "Shield of the Sea";
    else if (type === ItemsEnum.SpikedShield)
      name = "Spiked Shield";

    //necklaces
    else if (type === ItemsEnum.ForgottenLocket)
      name = "Forgotten Locket";
    else if (type === ItemsEnum.PendantOfFortune)
      name = "Pendant of Fortune";
    else if (type === ItemsEnum.PendantOfPower)
      name = "Pendant of Power";
    else if (type === ItemsEnum.PendantOfSpeed)
      name = "Pendant of Speed";
    else if (type === ItemsEnum.GemmedNecklace)
      name = "Gemmed Necklace";
    else if (type === ItemsEnum.SharkstoothNecklace)
      name = "Sharkstooth Necklace";
    else if (type === ItemsEnum.SharkstoothPendant)
      name = "Sharkstooth Pendant";

    //armor
    else if (type === ItemsEnum.LinenArmor)
      name = "Linen Armor";
    else if (type === ItemsEnum.IronArmor)
      name = "Iron Armor";
    else if (type === ItemsEnum.BronzeArmor)
      name = "Bronze Armor";
    else if (type === ItemsEnum.FortifiedBronzeArmor)
      name = "Fortified Bronze Armor";
    else if (type === ItemsEnum.SteelArmor)
      name = "Steel Armor";
    else if (type === ItemsEnum.MoltenArmor)
      name = "Molten Armor";
    else if (type === ItemsEnum.HardenedLeatherArmor)
      name = "Hardened Leather Armor";
    else if (type === ItemsEnum.BoarskinArmor)
      name = "Boarskin Armor";
    else if (type === ItemsEnum.BearskinArmor)
      name = "Bearskin Armor";
    else if (type === ItemsEnum.FeatheredTunic)
      name = "Feathered Tunic";

    //rings
    else if (type === ItemsEnum.MoltenRing)
      name = "Molten Ring";
    else if (type === ItemsEnum.FracturedAmethystRing)
      name = "Fractured Amethyst Ring";
    else if (type === ItemsEnum.FracturedAquamarineRing)
      name = "Fractured Aquamarine Ring";
    else if (type === ItemsEnum.FracturedEmeraldRing)
      name = "Fractured Emerald Ring";
    else if (type === ItemsEnum.FracturedOpalRing)
      name = "Fractured Opal Ring";
    else if (type === ItemsEnum.FracturedRubyRing)
      name = "Fractured Ruby Ring";
    else if (type === ItemsEnum.FracturedTopazRing)
      name = "Fractured Topaz Ring";
    else if (type === ItemsEnum.BedazzledRing)
      name = "Bedazzled Ring";
    else if (type === ItemsEnum.RingOfNightmares)
      name = "Ring of Nightmares";
    else if (type === ItemsEnum.ScalyRing)
      name = "Scaly Ring";
    else if (type === ItemsEnum.QuadRing)
      name = "Quad Ring";

    //crafting materials
    else if (type === ItemsEnum.LightLeather)
      name = "Light Leather";
    else if (type === ItemsEnum.Leather)
      name = "Leather";
    else if (type === ItemsEnum.PetrifiedBark)
      name = "Petrified Bark";
    else if (type === ItemsEnum.LamiaHeart)
      name = "Lamia Heart";
    else if (type === ItemsEnum.SmallFeather)
      name = "Small Feather";
    else if (type === ItemsEnum.EagleFeather)
      name = "Eagle Feather";
    else if (type === ItemsEnum.Olive)
      name = "Olive";
    else if (type === ItemsEnum.Fennel)
      name = "Fennel";
    else if (type === ItemsEnum.Wax)
      name = "Wax";
    else if (type === ItemsEnum.VialOfTheLethe)
      name = "Vial of the Lethe";
    else if (type === ItemsEnum.EssenceOfFire)
      name = "Essence of Fire";
    else if (type === ItemsEnum.SoulSpark)
      name = "Soul Spark";
    else if (type === ItemsEnum.Asphodelus)
      name = "Asphodelus";
    else if (type === ItemsEnum.ToxicIchor)
      name = "Toxic Ichor";
    else if (type === ItemsEnum.SatchelOfHerbs)
      name = "Satchel of Herbs";
    else if (type === ItemsEnum.SoulEssence)
      name = "Soul Essence";
    else if (type === ItemsEnum.BushelOfHerbs)
      name = "Bushel of Herbs";
    else if (type === ItemsEnum.BrokenNecklace)
      name = "Broken Necklace";
    else if (type === ItemsEnum.RoughAmethystFragment)
      name = "Rough Amethyst Fragment";
    else if (type === ItemsEnum.RoughOpalFragment)
      name = "Rough Opal Fragment";
    else if (type === ItemsEnum.RoughAquamarineFragment)
      name = "Rough Aquamarine Fragment";
    else if (type === ItemsEnum.RoughEmeraldFragment)
      name = "Rough Emerald Fragment";
    else if (type === ItemsEnum.RoughTopazFragment)
      name = "Rough Topaz Fragment";
    else if (type === ItemsEnum.RoughRubyFragment)
      name = "Rough Ruby Fragment";
    else if (type === ItemsEnum.Narcissus)
      name = "Narcissus";
    else if (type === ItemsEnum.ThickLeather)
      name = "Thick Leather";
    else if (type === ItemsEnum.BearHide)
      name = "Bear Hide";
    else if (type === ItemsEnum.BoarHide)
      name = "Boar Hide";
    else if (type === ItemsEnum.Goldroot)
      name = "Goldroot";
    else if (type === ItemsEnum.Violet)
      name = "Violet";
    else if (type === ItemsEnum.Lousewort)
      name = "Lousewort";
    else if (type === ItemsEnum.VialOfLakeLerna)
      name = "Vial of Lake Lerna";
    else if (type === ItemsEnum.VialOfTheBlackSea)
      name = "Vial of The Black Sea";
    else if (type === ItemsEnum.Sorrel)
      name = "Sorrel";
    else if (type === ItemsEnum.SpiritEssence)
      name = "Spirit Essence";
    else if (type === ItemsEnum.FishScales)
      name = "Fish Scale";
    else if (type === ItemsEnum.MetalScraps)
      name = "Metal Scraps";
    else if (type === ItemsEnum.CrackedRuby)
      name = "Cracked Ruby";
    else if (type === ItemsEnum.CrackedAmethyst)
      name = "Cracked Amethyst";
    else if (type === ItemsEnum.CrackedTopaz)
      name = "Cracked Topaz";
    else if (type === ItemsEnum.CrackedOpal)
      name = "Cracked Opal";
    else if (type === ItemsEnum.CrackedAquamarine)
      name = "Cracked Aquamarine";
    else if (type === ItemsEnum.CrackedEmerald)
      name = "Cracked Emerald";
    else if (type === ItemsEnum.LesserCrackedRuby)
      name = "Lesser Cracked Ruby";
    else if (type === ItemsEnum.LesserCrackedAmethyst)
      name = "Lesser Cracked Amethyst";
    else if (type === ItemsEnum.LesserCrackedTopaz)
      name = "Lesser Cracked Topaz";
    else if (type === ItemsEnum.LesserCrackedOpal)
      name = "Lesser Cracked Opal";
    else if (type === ItemsEnum.LesserCrackedAquamarine)
      name = "Lesser Cracked Aquamarine";
    else if (type === ItemsEnum.LesserCrackedEmerald)
      name = "Lesser Cracked Emerald";
    else if (type === ItemsEnum.DullRuby)
      name = "Dull Ruby";
    else if (type === ItemsEnum.DullAmethyst)
      name = "Dull Amethyst";
    else if (type === ItemsEnum.DullTopaz)
      name = "Dull Topaz";
    else if (type === ItemsEnum.DullOpal)
      name = "Dull Opal";
    else if (type === ItemsEnum.DullAquamarine)
      name = "Dull Aquamarine";
    else if (type === ItemsEnum.DullEmerald)
      name = "Dull Emerald";
    else if (type === ItemsEnum.MinorWeaponSlotAddition)
      name = "Minor Weapon Slot Addition";
    else if (type === ItemsEnum.MinorRingSlotAddition)
      name = "Minor Ring Slot Addition";
    else if (type === ItemsEnum.MinorArmorSlotAddition)
      name = "Minor Armor Slot Addition";
    else if (type === ItemsEnum.MinorShieldSlotAddition)
      name = "Minor Shield Slot Addition";
    else if (type === ItemsEnum.MinorNecklaceSlotAddition)
      name = "Minor Necklace Slot Addition";
    else if (type === ItemsEnum.SharkTeeth)
      name = "Shark Tooth";
    else if (type === ItemsEnum.Seashell)
      name = "Seashell";

    //recipes
    else if (type === ItemsEnum.PoisonExtractPotionRecipe)
      name = "Poison Extract Potion Recipe";
    else if (type === ItemsEnum.HeroicElixirRecipe)
      name = "Heroic Elixir Recipe";
    else if (type === ItemsEnum.FocusPotionRecipe)
      name = "Focus Potion Recipe";

    //charms
    else if (type === ItemsEnum.SmallCharmOfDetermination)
      name = "Small Charm of Determination";
    else if (type === ItemsEnum.LargeCharmOfDetermination)
      name = "Large Charm of Determination";
    else if (type === ItemsEnum.SmallCharmOfRejuvenation)
      name = "Small Charm of Rejuvenation";
    else if (type === ItemsEnum.LargeCharmOfRejuvenation)
      name = "Large Charm of Rejuvenation";
    else if (type === ItemsEnum.SmallCharmOfVulnerability)
      name = "Small Charm of Vulnerability";
    else if (type === ItemsEnum.LargeCharmOfVulnerability)
      name = "Large Charm of Vulnerability";
    else if (type === ItemsEnum.SmallCharmOfPreparation)
      name = "Small Charm of Preparation";
    else if (type === ItemsEnum.LargeCharmOfPreparation)
      name = "Large Charm of Preparation";
    else if (type === ItemsEnum.SmallCharmOfHaste)
      name = "Small Charm of Haste";
    else if (type === ItemsEnum.LargeCharmOfHaste)
      name = "Large Charm of Haste";
    else if (type === ItemsEnum.SmallCharmOfHolyDestruction)
      name = "Small Charm of Holy Destruction";
    else if (type === ItemsEnum.LargeCharmOfHolyDestruction)
      name = "Large Charm of Holy Destruction";
    else if (type === ItemsEnum.SmallCharmOfFireDestruction)
      name = "Small Charm of Fire Destruction";
    else if (type === ItemsEnum.LargeCharmOfFireDestruction)
      name = "Large Charm of Fire Destruction";
    else if (type === ItemsEnum.SmallCharmOfWaterDestruction)
      name = "Small Charm of Water Destruction";
    else if (type === ItemsEnum.LargeCharmOfWaterDestruction)
      name = "Large Charm of Water Destruction";
    else if (type === ItemsEnum.SmallCharmOfLightningDestruction)
      name = "Small Charm of Lightning Destruction";
    else if (type === ItemsEnum.LargeCharmOfLightningDestruction)
      name = "Large Charm of Lightning Destruction";
    else if (type === ItemsEnum.SmallCharmOfAirDestruction)
      name = "Small Charm of Air Destruction";
    else if (type === ItemsEnum.LargeCharmOfAirDestruction)
      name = "Large Charm of Air Destruction";
    else if (type === ItemsEnum.SmallCharmOfEarthDestruction)
      name = "Small Charm of Earth Destruction";
    else if (type === ItemsEnum.LargeCharmOfEarthDestruction)
      name = "Large Charm of Earth Destruction";
    else if (type === ItemsEnum.SmallCharmOfHolyProtection)
      name = "Small Charm of Holy Protection";
    else if (type === ItemsEnum.LargeCharmOfHolyProtection)
      name = "Large Charm of Holy Protection";
    else if (type === ItemsEnum.SmallCharmOfFireProtection)
      name = "Small Charm of Fire Protection";
    else if (type === ItemsEnum.LargeCharmOfFireProtection)
      name = "Large Charm of Fire Protection";
    else if (type === ItemsEnum.SmallCharmOfWaterProtection)
      name = "Small Charm of Water Protection";
    else if (type === ItemsEnum.LargeCharmOfWaterProtection)
      name = "Large Charm of Water Protection";
    else if (type === ItemsEnum.SmallCharmOfLightningProtection)
      name = "Small Charm of Lightning Protection";
    else if (type === ItemsEnum.LargeCharmOfLightningProtection)
      name = "Large Charm of Lightning Protection";
    else if (type === ItemsEnum.SmallCharmOfAirProtection)
      name = "Small Charm of Air Protection";
    else if (type === ItemsEnum.LargeCharmOfAirProtection)
      name = "Large Charm of Air Protection";
    else if (type === ItemsEnum.SmallCharmOfEarthProtection)
      name = "Small Charm of Earth Protection";
    else if (type === ItemsEnum.LargeCharmOfEarthProtection)
      name = "Large Charm of Earth Protection";
    else if (type === ItemsEnum.SmallCharmOfAthena)
      name = "Small Charm of Athena";
    else if (type === ItemsEnum.LargeCharmOfAthena)
      name = "Large Charm of Athena";
    else if (type === ItemsEnum.SmallCharmOfArtemis)
      name = "Small Charm of Artemis";
    else if (type === ItemsEnum.LargeCharmOfArtemis)
      name = "Large Charm of Artemis";
    else if (type === ItemsEnum.SmallCharmOfHermes)
      name = "Small Charm of Hermes";
    else if (type === ItemsEnum.LargeCharmOfHermes)
      name = "Large Charm of Hermes";
    else if (type === ItemsEnum.SmallCharmOfApollo)
      name = "Small Charm of Apollo";
    else if (type === ItemsEnum.LargeCharmOfApollo)
      name = "Large Charm of Apollo";
    else if (type === ItemsEnum.SmallCharmOfAres)
      name = "Small Charm of Ares";
    else if (type === ItemsEnum.LargeCharmOfAres)
      name = "Large Charm of Ares";
    else if (type === ItemsEnum.SmallCharmOfZeus)
      name = "Small Charm of Zeus";
    else if (type === ItemsEnum.LargeCharmOfZeus)
      name = "Large Charm of Zeus";
    else if (type === ItemsEnum.SmallCharmOfPoseidon)
      name = "Small Charm of Poseidon";
    else if (type === ItemsEnum.LargeCharmOfPoseidon)
      name = "Large Charm of Poseidon";
    else if (type === ItemsEnum.SmallCharmOfHades)
      name = "Small Charm of Hades";
    else if (type === ItemsEnum.LargeCharmOfHades)
      name = "Large Charm of Hades";
    else if (type === ItemsEnum.SmallCharmOfIngenuity)
      name = "Small Charm of Ingenuity";
    else if (type === ItemsEnum.LargeCharmOfIngenuity)
      name = "Large Charm of Ingenuity";
    else if (type === ItemsEnum.SmallCharmOfDionysus)
      name = "Small Charm of Dionysus";
    else if (type === ItemsEnum.LargeCharmOfDionysus)
      name = "Large Charm of Dionysus";
    else if (type === ItemsEnum.SmallCharmOfNemesis)
      name = "Small Charm of Nemesis";
    else if (type === ItemsEnum.LargeCharmOfNemesis)
      name = "Large Charm of Nemesis";

    //other
    else if (type === ItemsEnum.SparringMatch)
      name = "Sparring Match";
    else if (type === ItemsEnum.WarriorClass)
      name = "<span class='warriorColor'>Warrior</span>";
    else if (type === ItemsEnum.PriestClass)
      name = "<span class='priestColor'>Priest</span>";
    else if (type === ItemsEnum.UnderworldAccess)
      name = "Freely Enter and Leave Underworld";
    else if (type === ItemsEnum.BonusXp)
      name = "Bonus XP";
    else if (type === ItemsEnum.ChthonicFavorUpgrade1)
      name = "Chthonic Favor Upgrade 1";
    else if (type === ItemsEnum.ChthonicFavorUpgrade2)
      name = "Chthonic Favor Upgrade 2";
    else if (type === ItemsEnum.Hades)
      name = "Hades";
    else if (type === ItemsEnum.Ares)
      name = "Ares";

    return name;
  }
}
