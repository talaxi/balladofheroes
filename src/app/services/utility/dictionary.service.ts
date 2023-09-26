import { Injectable } from '@angular/core';
import { ItemsEnum } from '../../models/enums/items-enum.model';
import { ColiseumTournamentEnum } from '../../models/enums/coliseum-tournament-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { MeleteActionEnum } from 'src/app/models/enums/melete-action-enum.model';
import { Trial } from 'src/app/models/battle/trial.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';

@Injectable({
  providedIn: 'root'
})
//THE RULE HERE IS CANNOT REFERENCE ANY OTHER SERVICE
export class DictionaryService {

  constructor() { }

  getItemName(type: ItemsEnum) {
    var name = "";

    //resources
    if (type === ItemsEnum.Coin)
      name = "Coin";
    if (type === ItemsEnum.EternalMeleeTicket)
      name = "Eternal Melee Ticket";
    if (type === ItemsEnum.ExtraSpeed1Hour)
      name = "Hour of Extra Speed";

    //progression
    if (type === ItemsEnum.ChthonicFavor)
      name = "Chthonic Favor";
    if (type === ItemsEnum.ChthonicPower)
      name = "Chthonic Power";
    if (type === ItemsEnum.BoonOfOlympus)
      name = "Boon of Olympus";
    if (type === ItemsEnum.ItemBeltUp)
      name = "Item Belt Size";
    if (type === ItemsEnum.Ambrosia)
      name = "Ambrosia";

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
    else if (type === ItemsEnum.FireAbsorptionPotion)
      name = "Fire Absorption Potion";
    else if (type === ItemsEnum.WaterAbsorptionPotion)
      name = "Water Absorption Potion";
    else if (type === ItemsEnum.EarthAbsorptionPotion)
      name = "Earth Absorption Potion";
    else if (type === ItemsEnum.HolyAbsorptionPotion)
      name = "Holy Absorption Potion";
    else if (type === ItemsEnum.LightningAbsorptionPotion)
      name = "Lightning Absorption Potion";
    else if (type === ItemsEnum.AirAbsorptionPotion)
      name = "Air Absorption Potion";

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
    else if (type === ItemsEnum.ElixirOfSpeed)
      name = "Elixir of Speed";
    else if (type === ItemsEnum.PiercingPotion)
      name = "Piercing Potion";
    else if (type === ItemsEnum.HoneyPoultice)
      name = "Honey Poultice";
    else if (type === ItemsEnum.HoneySalve)
      name = "Honey Salve";
    else if (type === ItemsEnum.FlamingToxin)
      name = "Flaming Toxin";
    else if (type === ItemsEnum.SlowingPotion)
      name = "Slowing Potion";
    else if (type === ItemsEnum.PotentConcoction)
      name = "Potent Concoction";
    else if (type === ItemsEnum.ParalyzingToxin)
      name = "Paralyzing Toxin";
      else if (type === ItemsEnum.SandToxin)
      name = "Sand Toxin";
      else if (type === ItemsEnum.ElectrifiedToxin)
      name = "Electrified Toxin";
      else if (type === ItemsEnum.MagicToxin)
      name = "Magic Toxin";
      else if (type === ItemsEnum.ElixirOfFortune)
      name = "Elixir of Fortune";
      else if (type === ItemsEnum.MagicRevivify)
      name = "Magic Revivify";
      else if (type === ItemsEnum.BouncingPotion)
      name = "Bouncing Potion";
      else if (type === ItemsEnum.MagicSalve)
      name = "Magic Salve";

    //equipment
    //swords
    else if (type === ItemsEnum.IronSword)
      name = "Iron Sword";
    else if (type === ItemsEnum.BronzeSword)
      name = "Bronze Sword";
    else if (type === ItemsEnum.FortifiedBronzeSword)
      name = "Fortified Bronze Sword";
    else if (type === ItemsEnum.HarpyTalon)
      name = "Harpy Talon";
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
    else if (type === ItemsEnum.JaggedSword)
      name = "Jagged Sword";

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
    else if (type === ItemsEnum.RadiatingHammer)
      name = "Radiating Hammer";

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
    else if (type === ItemsEnum.BirchBow)
      name = "Birch Bow";
    else if (type === ItemsEnum.AthenasScythe)
      name = "Athena's Scythe";
    else if (type === ItemsEnum.ArtemissBow)
      name = "Artemis's Bow";
    else if (type === ItemsEnum.HermessStaff)
      name = "Hermes's Staff";
    else if (type === ItemsEnum.ApollosBow)
      name = "Apollo's Bow";
    else if (type === ItemsEnum.HadessBident)
      name = "Hades's Bident";
    else if (type === ItemsEnum.AressSpear)
      name = "Ares's Spear";
    else if (type === ItemsEnum.DionysussScepter)
      name = "Dionysus's Scepter";
    else if (type === ItemsEnum.NemesissSword)
      name = "Nemesis's Sword";
    else if (type === ItemsEnum.ZeussLightningBolts)
      name = "Zeus's Lightning Bolts";
      else if (type === ItemsEnum.PoseidonsTrident)
        name = "Poseidon's Trident";
    else if (type === ItemsEnum.GiantSword)
      name = "Giant Sword";
    else if (type === ItemsEnum.GiantHammer)
      name = "Giant Hammer";
    else if (type === ItemsEnum.PorphyrionsMace)
      name = "Porphyrion's Mace";
    else if (type === ItemsEnum.DivinePlate)
      name = "Divine Plate";
    else if (type === ItemsEnum.DivineTarge)
      name = "Divine Targe";

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
    else if (type === ItemsEnum.SpiritShield)
      name = "Spirit Shield";
    else if (type === ItemsEnum.LightShield)
      name = "Light Shield";
    else if (type === ItemsEnum.BloodyShield)
      name = "Bloody Shield";
    else if (type === ItemsEnum.AthenasShield)
      name = "Athena's Shield";
    else if (type === ItemsEnum.ArtemissShield)
      name = "Artemis's Shield";
    else if (type === ItemsEnum.HermessShield)
      name = "Hermes's Shield";
    else if (type === ItemsEnum.ApollosShield)
      name = "Apollo's Shield";
    else if (type === ItemsEnum.HadessShield)
      name = "Hades's Shield";
    else if (type === ItemsEnum.AressShield)
      name = "Ares's Shield";
    else if (type === ItemsEnum.DionysussShield)
      name = "Dionysus's Shield";
    else if (type === ItemsEnum.NemesissShield)
      name = "Nemesis's Shield";
    else if (type === ItemsEnum.ZeussShield)
      name = "Zeus's Shield";
    else if (type === ItemsEnum.GiantShield)
      name = "Giant Shield";
      else if (type === ItemsEnum.PoseidonsShield)
        name = "Poseidon's Shield";

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
    else if (type === ItemsEnum.DarkMoonPendant)
      name = "Dark Moon Pendant";
    else if (type === ItemsEnum.BlazingSunPendant)
      name = "Blazing Sun Pendant";
    else if (type === ItemsEnum.BronzeBeakNecklace)
      name = "Bronze Beak Necklace";
    else if (type === ItemsEnum.BloodyNecklace)
      name = "Bloody Necklace";
    else if (type === ItemsEnum.AthenasNecklace)
      name = "Athena's Necklace";
    else if (type === ItemsEnum.ArtemissNecklace)
      name = "Artemis's Necklace";
    else if (type === ItemsEnum.HermessNecklace)
      name = "Hermes's Necklace";
    else if (type === ItemsEnum.ApollosNecklace)
      name = "Apollo's Necklace";
    else if (type === ItemsEnum.HadessNecklace)
      name = "Hades's Necklace";
    else if (type === ItemsEnum.AressNecklace)
      name = "Ares's Necklace";
    else if (type === ItemsEnum.DionysussNecklace)
      name = "Dionysus's Necklace";
    else if (type === ItemsEnum.NemesissNecklace)
      name = "Nemesis's Necklace";
    else if (type === ItemsEnum.ZeussNecklace)
      name = "Zeus's Necklace";
    else if (type === ItemsEnum.GiantNecklace)
      name = "Giant Necklace";
      else if (type === ItemsEnum.PoseidonsNecklace)
        name = "Poseidon's Necklace";

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
    else if (type === ItemsEnum.FurArmor)
      name = "Fur Armor";
    else if (type === ItemsEnum.HideArmor)
      name = "Hide Armor";
    else if (type === ItemsEnum.ScaleArmor)
      name = "Scale Armor";
    else if (type === ItemsEnum.HesperidianArmor)
      name = "Hesperidian Armor";
    else if (type === ItemsEnum.AthenasArmor)
      name = "Athena's Armor";
    else if (type === ItemsEnum.ArtemissArmor)
      name = "Artemis's Armor";
    else if (type === ItemsEnum.HermessArmor)
      name = "Hermes's Armor";
    else if (type === ItemsEnum.ApollosArmor)
      name = "Apollo's Armor";
    else if (type === ItemsEnum.HadessArmor)
      name = "Hades's Armor";
    else if (type === ItemsEnum.AressArmor)
      name = "Ares's Armor";
    else if (type === ItemsEnum.DionysussArmor)
      name = "Dionysus's Armor";
    else if (type === ItemsEnum.NemesissArmor)
      name = "Nemesis's Armor";
    else if (type === ItemsEnum.ZeussArmor)
      name = "Zeus's Armor";
    else if (type === ItemsEnum.GiantArmor)
      name = "Giant Armor";
    else if (type === ItemsEnum.PoseidonsArmor)
      name = "Poseidon's Armor";

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
    else if (type === ItemsEnum.RingOfCurses)
      name = "Ring of Curses";
    else if (type === ItemsEnum.SafeRing)
      name = "Safe Ring";
    else if (type === ItemsEnum.SirensongRing)
      name = "Sirensong Ring";
    else if (type === ItemsEnum.AthenasRing)
      name = "Athena's Ring";
    else if (type === ItemsEnum.ArtemissRing)
      name = "Artemis's Ring";
    else if (type === ItemsEnum.HermessRing)
      name = "Hermes's Ring";
    else if (type === ItemsEnum.ApollosRing)
      name = "Apollo's Ring";
    else if (type === ItemsEnum.HadessRing)
      name = "Hades's Ring";
    else if (type === ItemsEnum.AressRing)
      name = "Ares's Ring";
    else if (type === ItemsEnum.DionysussRing)
      name = "Dionysus's Ring";
    else if (type === ItemsEnum.NemesissRing)
      name = "Nemesis's Ring";
    else if (type === ItemsEnum.ZeussRing)
      name = "Zeus's Ring";
    else if (type === ItemsEnum.GiantRing)
      name = "Giant Ring";
      else if (type === ItemsEnum.PoseidonsRing)
        name = "Poseidon's Ring";

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
    else if (type === ItemsEnum.PotentEssence)
      name = "Potent Essence";
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
    else if (type === ItemsEnum.MetalNuggets)
      name = "Metal Nuggets";
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
    else if (type === ItemsEnum.CoarseFur)
      name = "Coarse Fur";
    else if (type === ItemsEnum.SerpentScale)
      name = "Serpent Scale";
    else if (type === ItemsEnum.Honey)
      name = "Honey";
    else if (type === ItemsEnum.AnimalHide)
      name = "Animal Hide";
    else if (type === ItemsEnum.EssenceOfWater)
      name = "Essence of Water";
    else if (type === ItemsEnum.Tusk)
      name = "Tusk";
    else if (type === ItemsEnum.SharpFeather)
      name = "Sharp Feather";
    else if (type === ItemsEnum.BronzeBeak)
      name = "Bronze Beak";
    else if (type === ItemsEnum.GoldenApple)
      name = "Golden Apple";
    else if (type === ItemsEnum.OlympicCommendation)
      name = "Olympic Commendation";
    else if (type === ItemsEnum.MagicTreeBark)
      name = "Magic Tree Bark";
    else if (type === ItemsEnum.CanineFang)
      name = "Canine Fang";
    else if (type === ItemsEnum.PristineCrabClaw)
      name = "Pristine Crab Claw";
    else if (type === ItemsEnum.VialOfTheCretanSea)
      name = "Vial of the Cretan Sea";
    else if (type === ItemsEnum.SmallAnimalBones)
      name = "Small Animal Bone";
    else if (type === ItemsEnum.BirchBark)
      name = "Birch Bark";
    else if (type === ItemsEnum.RadiatingGemstone)
      name = "Radiating Gemstone";
    else if (type === ItemsEnum.WhiteHorn)
      name = "White Horn";
    else if (type === ItemsEnum.BlackHorn)
      name = "Black Horn";
    else if (type === ItemsEnum.MagicCore)
      name = "Magic Core";
    else if (type === ItemsEnum.EssenceOfEarth)
      name = "Essence of Earth";
    else if (type === ItemsEnum.EssenceOfAir)
      name = "Essence of Air";
    else if (type === ItemsEnum.EssenceOfLightning)
      name = "Essence of Lightning";
    else if (type === ItemsEnum.EssenceOfHoly)
      name = "Essence of Holy";
    else if (type === ItemsEnum.PerfectCrackedRuby)
      name = "Perfect Cracked Ruby";
    else if (type === ItemsEnum.PerfectCrackedAmethyst)
      name = "Perfect Cracked Amethyst";
    else if (type === ItemsEnum.PerfectCrackedTopaz)
      name = "Perfect Cracked Topaz";
    else if (type === ItemsEnum.PerfectCrackedOpal)
      name = "Perfect Cracked Opal";
    else if (type === ItemsEnum.PerfectCrackedAquamarine)
      name = "Perfect Cracked Aquamarine";
    else if (type === ItemsEnum.PerfectCrackedEmerald)
      name = "Perfect Cracked Emerald";
    else if (type === ItemsEnum.PerfectDullRuby)
      name = "Perfect Dull Ruby";
    else if (type === ItemsEnum.PerfectDullAmethyst)
      name = "Perfect Dull Amethyst";
    else if (type === ItemsEnum.PerfectDullTopaz)
      name = "Perfect Dull Topaz";
    else if (type === ItemsEnum.PerfectDullOpal)
      name = "Perfect Dull Opal";
    else if (type === ItemsEnum.PerfectDullAquamarine)
      name = "Perfect Dull Aquamarine";
    else if (type === ItemsEnum.PerfectDullEmerald)
      name = "Perfect Dull Emerald";
    else if (type === ItemsEnum.PerfectRadiatingAirStone)
      name = "Perfect Radiating Air Stone";
    else if (type === ItemsEnum.PerfectRadiatingEarthStone)
      name = "Perfect Radiating Earth Stone";
    else if (type === ItemsEnum.PerfectRadiatingFireStone)
      name = "Perfect Radiating Fire Stone";
    else if (type === ItemsEnum.PerfectRadiatingHolyStone)
      name = "Perfect Radiating Holy Stone";
    else if (type === ItemsEnum.PerfectRadiatingLightningStone)
      name = "Perfect Radiating Lightning Stone";
    else if (type === ItemsEnum.PerfectRadiatingWaterStone)
      name = "Perfect Radiating Water Stone";
    else if (type === ItemsEnum.RadiatingAirStone)
      name = "Radiating Air Stone";
    else if (type === ItemsEnum.RadiatingEarthStone)
      name = "Radiating Earth Stone";
    else if (type === ItemsEnum.RadiatingFireStone)
      name = "Radiating Fire Stone";
    else if (type === ItemsEnum.RadiatingHolyStone)
      name = "Radiating Holy Stone";
    else if (type === ItemsEnum.RadiatingLightningStone)
      name = "Radiating Lightning Stone";
    else if (type === ItemsEnum.RadiatingWaterStone)
      name = "Radiating Water Stone";
    else if (type === ItemsEnum.Nectar)
      name = "Nectar";
    else if (type === ItemsEnum.FlawedRuby)
      name = "Flawed Ruby";
    else if (type === ItemsEnum.FlawedAmethyst)
      name = "Flawed Amethyst";
    else if (type === ItemsEnum.FlawedTopaz)
      name = "Flawed Topaz";
    else if (type === ItemsEnum.FlawedOpal)
      name = "Flawed Opal";
    else if (type === ItemsEnum.FlawedAquamarine)
      name = "Flawed Aquamarine";
    else if (type === ItemsEnum.FlawedEmerald)
      name = "Flawed Emerald";
    else if (type === ItemsEnum.PerfectFlawedRuby)
      name = "Perfect Flawed Ruby";
    else if (type === ItemsEnum.PerfectFlawedAmethyst)
      name = "Perfect Flawed Amethyst";
    else if (type === ItemsEnum.PerfectFlawedTopaz)
      name = "Perfect Flawed Topaz";
    else if (type === ItemsEnum.PerfectFlawedOpal)
      name = "Perfect Flawed Opal";
    else if (type === ItemsEnum.PerfectFlawedAquamarine)
      name = "Perfect Flawed Aquamarine";
    else if (type === ItemsEnum.PerfectFlawedEmerald)
      name = "Perfect Flawed Emerald";
    else if (type === ItemsEnum.PointedStone)
      name = "Pointed Stone";
    else if (type === ItemsEnum.PerfectPointedStone)
      name = "Perfect Pointed Stone";
    else if (type === ItemsEnum.ShiningStone)
      name = "Shining Stone";
    else if (type === ItemsEnum.PerfectShiningStone)
      name = "Perfect Shining Stone";
    else if (type === ItemsEnum.JaggedStone)
      name = "Jagged Stone";
    else if (type === ItemsEnum.PerfectJaggedStone)
      name = "Perfect Jagged Stone";
    else if (type === ItemsEnum.BlessedStone)
      name = "Blessed Stone";
    else if (type === ItemsEnum.PerfectBlessedStone)
      name = "Perfect Blessed Stone";
    else if (type === ItemsEnum.WeaponSlotAddition)
      name = "Weapon Slot Addition";
    else if (type === ItemsEnum.RingSlotAddition)
      name = "Ring Slot Addition";
    else if (type === ItemsEnum.ArmorSlotAddition)
      name = "Armor Slot Addition";
    else if (type === ItemsEnum.ShieldSlotAddition)
      name = "Shield Slot Addition";
    else if (type === ItemsEnum.NecklaceSlotAddition)
      name = "Necklace Slot Addition";

    //recipes
    else if (type === ItemsEnum.PoisonExtractPotionRecipe)
      name = "Poison Extract Potion Recipe";
    else if (type === ItemsEnum.HeroicElixirRecipe)
      name = "Heroic Elixir Recipe";
    else if (type === ItemsEnum.FocusPotionRecipe)
      name = "Focus Potion Recipe";
    else if (type === ItemsEnum.PotentConcoctionRecipe)
      name = "Potent Concoction Recipe";
    else if (type === ItemsEnum.FireAbsorptionPotionRecipe)
      name = "Fire Absorption Recipe";
    else if (type === ItemsEnum.HolyAbsorptionPotionRecipe)
      name = "Holy Absorption Recipe";
    else if (type === ItemsEnum.WaterAbsorptionPotionRecipe)
      name = "Water Absorption Recipe";
    else if (type === ItemsEnum.EarthAbsorptionPotionRecipe)
      name = "Earth Absorption Recipe";
    else if (type === ItemsEnum.LightningAbsorptionPotionRecipe)
      name = "Lightning Absorption Recipe";
    else if (type === ItemsEnum.AirAbsorptionPotionRecipe)
      name = "Air Absorption Recipe";

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
    else if (type === ItemsEnum.SmallOrnateKantharos)
      name = "Small Ornate Kantharos";
    else if (type === ItemsEnum.SmallGildedKantharos)
      name = "Small Gilded Kantharos";
    else if (type === ItemsEnum.SmallBlackKantharos)
      name = "Small Black Kantharos";
    else if (type === ItemsEnum.SmallSilverKantharos)
      name = "Small Silver Kantharos";
    else if (type === ItemsEnum.SmallBuccheroKantharos)
      name = "Small Bucchero Kantharos";
    else if (type === ItemsEnum.SmallCrackedKantharos)
      name = "Small Cracked Kantharos";
    else if (type === ItemsEnum.LargeOrnateKantharos)
      name = "Large Ornate Kantharos";
    else if (type === ItemsEnum.LargeGildedKantharos)
      name = "Large Gilded Kantharos";
    else if (type === ItemsEnum.LargeBlackKantharos)
      name = "Large Black Kantharos";
    else if (type === ItemsEnum.LargeSilverKantharos)
      name = "Large Silver Kantharos";
    else if (type === ItemsEnum.LargeBuccheroKantharos)
      name = "Large Bucchero Kantharos";
    else if (type === ItemsEnum.LargeCrackedKantharos)
      name = "Large Cracked Kantharos";

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
    else if (type === ItemsEnum.Nemesis)
      name = "<span class='nemesisColor'>Nemesis</span>";
    else if (type === ItemsEnum.Dionysus)
      name = "<span class='dionysusColor'>Dionysus</span>";
    else if (type === ItemsEnum.AugeanStables1)
      name = "Repair Augean Stables Door";
    else if (type === ItemsEnum.AugeanStables2)
      name = "Repair Augean Stables Roof";
    else if (type === ItemsEnum.AugeanStables3)
      name = "Repair Augean Stable Walls";
    else if (type === ItemsEnum.DarkOrb)
      name = "Dark Orb";

    return name;
  }

  getColiseumInfoFromType(type: ColiseumTournamentEnum) {
    var tournament = new ColiseumTournament();
    tournament.type = type;
    tournament.currentRound = 1;
    tournament.tournamentTimer = 0;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.UnderworldAccess, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Coin, 2500));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 10000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
    }
    if (type === ColiseumTournamentEnum.ForgottenKings) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.HeroicElixirRecipe, 1));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 25000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
    }
    if (type === ColiseumTournamentEnum.RiverLords) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Coin, 8000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 65000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, 1));
    }
    if (type === ColiseumTournamentEnum.HadesTrial) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 90000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Hades, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore1) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;      
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 2000000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.DarkOrb, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
    }
    if (type === ColiseumTournamentEnum.ElementalPressure) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;      
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 4500000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.DarkOrb, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
    }
    if (type === ColiseumTournamentEnum.HeroesOfYore2) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 90;      
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 7500000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.HadessBident, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
    }
    if (type === ColiseumTournamentEnum.WeeklyMelee) {
      tournament.maxRounds = -1;
      tournament.tournamentTimerLength = 300;
    }

    return tournament;
  }

  getTournamentName(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.TournamentOfTheDead)
      return "Tournament of the Dead";
    if (type === ColiseumTournamentEnum.FlamesOfTartarus)
      return "Flames of Tartarus";
    if (type === ColiseumTournamentEnum.ForgottenKings)
      return "Forgotten Kings and Queens";
    if (type === ColiseumTournamentEnum.RiverLords)
      return "River Lords";
    else if (type === ColiseumTournamentEnum.HadesTrial)
      return "Hades' Trial";
    else if (type === ColiseumTournamentEnum.HeroesOfYore1)
      return "Heroes of Yore 1";
    else if (type === ColiseumTournamentEnum.ElementalPressure)
      return "Chaotic Pressure";
    else if (type === ColiseumTournamentEnum.HeroesOfYore2)
      return "Heroes of Yore 2";
    else if (type === ColiseumTournamentEnum.WeeklyMelee)
      return "Eternal Melee";
    return "";
  }

  getTrialInfoFromType(type: TrialEnum) {
    var trial = new Trial();
    trial.type = type;
    trial.timerLength = 300;
    return trial;
  }

  getTrialName(type: TrialEnum) {
    if (type === TrialEnum.TrialOfSkill)
      return "Trial of Skill";
    if (type === TrialEnum.TrialOfResolve)
      return "Trial of Resolve";

    return "";
  }

  getMeleteActionName(action: MeleteActionEnum) {
    var name = "";

    if (action === MeleteActionEnum.BreatheInDeeply)
      name = "Breathe In Deeply";

    if (action === MeleteActionEnum.ExhaleDeeply)
      name = "Exhale Deeply";

    return name;
  }
}
