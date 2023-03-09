import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { AltarEffect } from '../models/altar/altar-effect.model';
import { StatusEffect } from '../models/battle/status-effect.model';
import { Ability } from '../models/character/ability.model';
import { CharacterStats } from '../models/character/character-stats.model';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { God } from '../models/character/god.model';
import { OverdriveInfo } from '../models/character/overdrive-info.model';
import { AchievementTypeEnum } from '../models/enums/achievement-type-enum.copy';
import { AffinityLevelRewardEnum } from '../models/enums/affinity-level-reward-enum.model';
import { AlchemyActionsEnum } from '../models/enums/alchemy-actions-enum.model';
import { AltarEffectsEnum } from '../models/enums/altar-effects-enum.model';
import { BestiaryEnum } from '../models/enums/bestiary-enum.model';
import { CharacterEnum } from '../models/enums/character-enum.model';
import { dotTypeEnum } from '../models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from '../models/enums/effect-trigger-enum.model';
import { ElementalTypeEnum } from '../models/enums/elemental-type-enum.model';
import { EquipmentQualityEnum } from '../models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from '../models/enums/equipment-type-enum.model';
import { GodEnum } from '../models/enums/god-enum.model';
import { ItemTypeEnum } from '../models/enums/item-type-enum.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { LogViewEnum } from '../models/enums/log-view-enum.model';
import { OverdriveNameEnum } from '../models/enums/overdrive-name-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { SubZoneEnum } from '../models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from '../models/enums/tutorial-type-enum.model';
import { WeaponTypeEnum } from '../models/enums/weapon-type-enum.model';
import { ZoneEnum } from '../models/enums/zone-enum.model';
import { Achievement } from '../models/global/achievement.model';
import { Equipment } from '../models/resources/equipment.model';
import { ResourceValue } from '../models/resources/resource-value.model';
import { UsableItemEffect } from '../models/resources/usable-item-effect.model';
import { LogData } from '../models/utility/log-data.model';
import { Ballad } from '../models/zone/ballad.model';
import { SubZone } from '../models/zone/sub-zone.model';
import { BalladService } from './ballad/ballad.service';
import { EnemyGeneratorService } from './enemy-generator/enemy-generator.service';
import { GlobalService } from './global/global.service';
import { CharmService } from './resources/charm.service';
import { ShopItemGeneratorService } from './shop/shop-item-generator.service';
import { SubZoneGeneratorService } from './sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from './utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  isUIHidden = false;

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService,
    private charmService: CharmService, private enemyGeneratorService: EnemyGeneratorService, private balladService: BalladService,
    private shopItemGeneratorService: ShopItemGeneratorService) { }

  getSubZoneCompletionByType(type: SubZoneEnum) {
    var chosenSubzone = new SubZone();

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            chosenSubzone = subzone;
        });
      });
    });

    return chosenSubzone.victoryCount >= chosenSubzone.victoriesNeededToProceed;
  }

  getSubZoneByType(type: SubZoneEnum) {
    var chosenSubzone = new SubZone();

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            chosenSubzone = subzone;
        });
      });
    });

    return chosenSubzone;
  }

  getAchievementName(achievement: Achievement) {
    var name = "";

    name += "'" + this.getSubZoneByType(achievement.relatedSubzone).name + " - " + this.getAchievementDescription(achievement.achievementType) + "'";

    return name;
  }

  getTotalXpGainFromEnemyTeam(enemyTeam: Enemy[]) {
    var totalXp = 0;

    enemyTeam.forEach(enemy => {
      totalXp += enemy.xpGainFromDefeat;
    });

    return totalXp;
  }

  getCharacterDescription(type: CharacterEnum) {
    var description = "";

    if (type === CharacterEnum.Adventurer)
      description = "The Adventurer class focuses on speed over damage, having access to agility buffs and increasing damage based on how many attacks you can perform in quick succession.";
    if (type === CharacterEnum.Archer)
      description = "The Archer class focuses on debilitating enemies, having access to damage over time and stunning effects.";
    if (type === CharacterEnum.Warrior)
      description = "The Warrior class focuses on taking damage over dealing damage, having the ability to force enemies' attention and increasing defense when HP drops low.";
    if (type === CharacterEnum.Priest)
      description = "The Priest class focuses on keeping the party alive, having access to healing and barrier effects.";


    return description;
  }

  getGodDescription(type: GodEnum) {
    var description = "";

    if (type === GodEnum.Athena)
      description = "Athena, Goddess of Wisdom and Warfare, focuses on combat and self-reliance. Her abilities and upgrades give the user the ability to heal themselves based on damage dealt and reduce incoming damage to themselves.";
    if (type === GodEnum.Artemis)
      description = "Artemis, Goddess of the Hunt, focuses on critical hits and debilitating enemies. Her abilities and upgrades can weaken enemies through status effects and increase damage dealt from critical attacks.";
    if (type === GodEnum.Hermes)
      description = "Hermes, Messenger of the Gods, focuses on agility and quick attacks. His abilities and upgrades can increase agility and reduce auto attack and ability cooldowns.";
    if (type === GodEnum.Apollo)
      description = "Apollo, God of Archery and Music, focuses on strengthening and healing allies. His abilities and upgrades allow the user to heal over time and provide a variety of buffs to the party.";
    if (type === GodEnum.Zeus)
      description = "";
    if (type === GodEnum.Ares)
      description = "";
    if (type === GodEnum.Poseidon)
      description = "";

    return description;
  }

  getAlchemyActionName(action: AlchemyActionsEnum) {
    var name = "";

    if (action === AlchemyActionsEnum.PrepareWaterSmallPot)
      name = "Boiling water in a small pot";
    if (action === AlchemyActionsEnum.StrainMixture)
      name = "Straining mixture";
    if (action === AlchemyActionsEnum.CombineIngredientsPot)
      name = "Combining ingredients in pot";
    if (action === AlchemyActionsEnum.MeltWax)
      name = "Melting wax";
    if (action === AlchemyActionsEnum.MixOil)
      name = "Mixing oil";
    if (action === AlchemyActionsEnum.CombineIngredientsPotion)
      name = "Combining ingredients in vial and stoppering";
    if (action === AlchemyActionsEnum.HeatMixture)
      name = "Heating mixture";
    if (action === AlchemyActionsEnum.CombineIngredients)
      name = "Combining ingredients together";
    if (action === AlchemyActionsEnum.CrushIngredients)
      name = "Crushing ingredients into a powder";
    if (action === AlchemyActionsEnum.ExtractEssence)
      name = "Extract essence from ingredients";
    if (action === AlchemyActionsEnum.Infuse)
      name = "Steep ingredients in liquid and infuse";

    return name;
  }

  isItemACharm(type: ItemsEnum) {
    var isACharm = false;

    if (type === ItemsEnum.LargeCharmOfDetermination || type === ItemsEnum.LargeCharmOfRejuvenation || type === ItemsEnum.LargeCharmOfVulnerability ||
      type === ItemsEnum.SmallCharmOfDetermination || type === ItemsEnum.SmallCharmOfRejuvenation || type === ItemsEnum.SmallCharmOfVulnerability ||
      type === ItemsEnum.SmallCharmOfHaste || type === ItemsEnum.LargeCharmOfHaste ||
      type === ItemsEnum.SmallCharmOfPreparation || type === ItemsEnum.LargeCharmOfPreparation ||
      type === ItemsEnum.SmallCharmOfIngenuity || type === ItemsEnum.LargeCharmOfIngenuity ||
      type === ItemsEnum.SmallCharmOfHolyDestruction || type === ItemsEnum.LargeCharmOfHolyDestruction ||
      type === ItemsEnum.SmallCharmOfFireDestruction || type === ItemsEnum.LargeCharmOfFireDestruction ||
      type === ItemsEnum.SmallCharmOfLightningDestruction || type === ItemsEnum.LargeCharmOfLightningDestruction ||
      type === ItemsEnum.SmallCharmOfAirDestruction || type === ItemsEnum.LargeCharmOfAirDestruction ||
      type === ItemsEnum.SmallCharmOfWaterDestruction || type === ItemsEnum.LargeCharmOfWaterDestruction ||
      type === ItemsEnum.SmallCharmOfEarthDestruction || type === ItemsEnum.LargeCharmOfEarthDestruction ||
      type === ItemsEnum.SmallCharmOfHolyProtection || type === ItemsEnum.LargeCharmOfHolyProtection ||
      type === ItemsEnum.SmallCharmOfFireProtection || type === ItemsEnum.LargeCharmOfFireProtection ||
      type === ItemsEnum.SmallCharmOfAirProtection || type === ItemsEnum.LargeCharmOfAirProtection ||
      type === ItemsEnum.SmallCharmOfLightningProtection || type === ItemsEnum.LargeCharmOfLightningProtection ||
      type === ItemsEnum.SmallCharmOfWaterProtection || type === ItemsEnum.LargeCharmOfWaterProtection ||
      type === ItemsEnum.SmallCharmOfEarthProtection || type === ItemsEnum.LargeCharmOfEarthProtection ||
      type === ItemsEnum.SmallCharmOfAthena || type === ItemsEnum.LargeCharmOfAthena ||
      type === ItemsEnum.SmallCharmOfArtemis || type === ItemsEnum.LargeCharmOfArtemis ||
      type === ItemsEnum.SmallCharmOfHermes || type === ItemsEnum.LargeCharmOfHermes ||
      type === ItemsEnum.SmallCharmOfApollo || type === ItemsEnum.LargeCharmOfApollo)
      isACharm = true;

    return isACharm;
  }

  getItemTypeFromItemEnum(type: ItemsEnum) {
    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice || type === ItemsEnum.HealingSalve ||
      type === ItemsEnum.RestorativeHerb) {
      return ItemTypeEnum.HealingItem;
    }

    if (type === ItemsEnum.ThrowingStone || type === ItemsEnum.PoisonFang || type === ItemsEnum.ExplodingPotion
      || type === ItemsEnum.FirePotion || type === ItemsEnum.StranglingGasPotion || type === ItemsEnum.PoisonExtractPotion ||
      type === ItemsEnum.HeftyStone) {
      return ItemTypeEnum.BattleItem;
    }

    if (type === ItemsEnum.PoisonousToxin || type === ItemsEnum.DebilitatingToxin) {
      return ItemTypeEnum.Toxin;
    }

    if (type === ItemsEnum.HeroicElixir || type === ItemsEnum.RejuvenatingElixir) {
      return ItemTypeEnum.Elixir;
    }

    if (type === ItemsEnum.EagleFeather || type === ItemsEnum.LamiaHeart || type === ItemsEnum.Leather || type === ItemsEnum.LightLeather ||
      type === ItemsEnum.PetrifiedBark || type === ItemsEnum.SmallFeather || type === ItemsEnum.Asphodelus || type === ItemsEnum.Fennel ||
      type === ItemsEnum.Olive || type === ItemsEnum.SoulSpark || type === ItemsEnum.VialOfTheLethe || type === ItemsEnum.EssenceOfFire ||
      type === ItemsEnum.Narcissus || type === ItemsEnum.ThickLeather || type === ItemsEnum.SmallRuby || type === ItemsEnum.SmallEmerald || type === ItemsEnum.SmallTopaz ||
      type === ItemsEnum.SmallOpal || type === ItemsEnum.SmallAmethyst || type === ItemsEnum.SmallAquamarine || type === ItemsEnum.Goldroot || type === ItemsEnum.Lousewort ||
      type === ItemsEnum.Violet || type === ItemsEnum.VialOfTheBlackSea || type === ItemsEnum.Sorrel || type === ItemsEnum.SpiritEssence) {
      return ItemTypeEnum.CraftingMaterial;
    }

    if (this.isItemACharm(type))
      return ItemTypeEnum.Charm;

    if (type === ItemsEnum.Coin) {
      return ItemTypeEnum.Resource;
    }

    if (this.getEquipmentPieceByItemType(type) !== undefined) {
      return ItemTypeEnum.Equipment;
    }

    return ItemTypeEnum.None;
  }

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
    else if (type === ItemsEnum.FirePotion)
      name = "Fire Potion";
    else if (type === ItemsEnum.ExplodingPotion)
      name = "Exploding Potion";
    else if (type === ItemsEnum.StranglingGasPotion)
      name = "Strangling Gas Potion";
    else if (type === ItemsEnum.PoisonExtractPotion)
      name = "Poison Extract Potion";
    else if (type === ItemsEnum.HeroicElixir)
      name = "Heroic Elixir";
    else if (type === ItemsEnum.RejuvenatingElixir)
      name = "Rejuvenating Elixir";

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
    else if (type === ItemsEnum.BrokenNecklace)
      name = "Broken Necklace";
    else if (type === ItemsEnum.SmallAmethyst)
      name = "Small Amethyst";
    else if (type === ItemsEnum.SmallOpal)
      name = "Small Opal";
    else if (type === ItemsEnum.SmallAquamarine)
      name = "Small Aquamarine";
    else if (type === ItemsEnum.SmallEmerald)
      name = "Small Emerald";
    else if (type === ItemsEnum.SmallTopaz)
      name = "Small Topaz";
    else if (type === ItemsEnum.SmallRuby)
      name = "Small Ruby";
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

    //recipes
    else if (type === ItemsEnum.PoisonExtractPotionRecipe)
      name = "Poison Extract Potion Recipe";

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

    //other
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

    return name;
  }

  enableChthonicFavoredGod() {
    this.globalService.globalVar.chthonicPowers.preferredGod = this.getPreferredGod();
  }

  giveCharactersBonusExp(amount: number) {
    this.globalService.giveCharactersBonusExp(this.globalService.getActivePartyCharacters(true), amount);
  }

  getItemDescription(type: ItemsEnum): string {
    var name = "";
    var effect = this.getBattleItemEffect(type);

    var relatedUserGainStatusEffectDuration = 0;
    var durationInMinutes = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;

    if (effect !== undefined) {

      var relatedUserGainStatusEffect = effect?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        durationInMinutes = Math.ceil(relatedUserGainStatusEffectDuration / 60);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = effect?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness - 1) * 100);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice || type === ItemsEnum.RestorativeHerb)
      name = "Heal a party member for " + effect.healAmount + " HP.";

    else if (type === ItemsEnum.HealingSalve)
      name = "Heal both party members for " + effect.healAmount + " HP.";

    //battle items
    else if (type === ItemsEnum.ThrowingStone || type === ItemsEnum.ExplodingPotion || type === ItemsEnum.FirePotion || type === ItemsEnum.HeftyStone)
      name = "Deal " + effect.trueDamageAmount + " damage to a target.";
    else if (type === ItemsEnum.PoisonFang || type === ItemsEnum.StranglingGasPotion)
      name = "Poison an enemy, dealing " + relatedTargetGainStatusEffectEffectiveness + " damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for " + relatedTargetGainStatusEffectDuration + " seconds.";
    else if (type === ItemsEnum.PoisonExtractPotion)
      name = "Poison all enemies, dealing " + relatedTargetGainStatusEffectEffectiveness + " damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for " + relatedTargetGainStatusEffectDuration + " seconds.";
    else if (type === ItemsEnum.DebilitatingToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to reduce a target's agility by 10% for 8 seconds. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.PoisonousToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to deal an additional 22 damage. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.HeroicElixir)
      name = "Increase user's max HP by " + relatedUserGainStatusEffectEffectivenessPercent + "% for " + durationInMinutes + " minutes. Only one elixir can be active per party member at a time.";
    else if (type === ItemsEnum.RejuvenatingElixir)
      name = "Increase user's HP Regen by " + relatedUserGainStatusEffectEffectiveness + " per 5 seconds for " + durationInMinutes + " minutes. Only one elixir can be active per party member at a time.";


    //resources    
    else if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Resource || this.getItemTypeFromItemEnum(type) === ItemTypeEnum.CraftingMaterial)
      name = this.getResourceDescription(type);

    //progression
    else if (type === ItemsEnum.BoonOfOlympus)
      name = "Increase experience gained by all gods.";
    else if (type === ItemsEnum.ChthonicFavor)
      name = "Increase Chthonic Power gain by " + (this.getChthonicFavorMultiplier() * 100).toFixed(0) + "%.";
    else if (type === ItemsEnum.ChthonicPower)
      name = "Spend on permanent stat boosts.";

    //equipment
    else if (this.getEquipmentPieceByItemType(type) !== undefined) {
      name = this.getEquipmentStats(this.getEquipmentPieceByItemType(type)) + "<br/><br/>" + this.getEquipmentEffects(this.getEquipmentPieceByItemType(type));
    }
    //equipment
    else if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Charm) {
      name = this.getCharmDescription(type);
    }

    else if (type === ItemsEnum.WarriorClass)
      name = "New Class: Warrior";
    else if (type === ItemsEnum.PriestClass)
      name = "New Class: Priest";
    else if (type === ItemsEnum.BonusXp)
      name = "Give bonus XP to all characters and gods.";
    else if (type == ItemsEnum.ItemBeltUp)
      name = "Gain an extra item belt slot.";

    return name;
  }

  getCharmDescription(type: ItemsEnum) {
    var description = "";

    if (type === ItemsEnum.SmallCharmOfRejuvenation)
      description = "Increase all characters' HP Regen by <span class='charmDescriptor'>" + this.charmService.getSmallCharmOfRejuvenationValue() + " HP / 5 seconds</span>.";
    if (type === ItemsEnum.LargeCharmOfRejuvenation)
      description = "Increase all characters' HP Regen by <span class='charmDescriptor'>" + this.charmService.getLargeCharmOfRejuvenationValue() + " HP / 5 seconds</span>.";

    if (type === ItemsEnum.SmallCharmOfDetermination)
      description = "Increase Overdrive gauge gain from all sources by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfDeterminationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfDetermination)
      description = "Increase Overdrive gauge gain from all sources by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfDeterminationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfVulnerability)
      description = "Increase all characters' Critical Damage Multiplier by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfVulnerabilityValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfVulnerability)
      description = "Increase all characters' Critical Damage Multiplier by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfVulnerabilityValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfPreparation)
      description = "Reduce all characters' Ability Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfPreparationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfPreparation)
      description = "Reduce all characters' Ability Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfPreparationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHaste)
      description = "Reduce all characters' Auto Attack Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfPreparationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHaste)
      description = "Reduce all characters' Auto Attack Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfPreparationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfIngenuity)
      description = "Increase all characters' Armor Penetration by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfIngenuityValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfIngenuity)
      description = "Increase all characters' Armor Penetration by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfIngenuityValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHolyDestruction)
      description = "Increase all characters' Holy damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHolyDestruction)
      description = "Increase all characters' Holy damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfFireDestruction)
      description = "Increase all characters' Fire damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfFireDestruction)
      description = "Increase all characters' Fire damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfWaterDestruction)
      description = "Increase all characters' Water damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfWaterDestruction)
      description = "Increase all characters' Water damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfLightningDestruction)
      description = "Increase all characters' Lightning damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfLightningDestruction)
      description = "Increase all characters' Lightning damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAirDestruction)
      description = "Increase all characters' Air damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfAirDestruction)
      description = "Increase all characters' Air damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfEarthDestruction)
      description = "Increase all characters' Earth damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfEarthDestruction)
      description = "Increase all characters' Earth damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHolyProtection)
      description = "Reduce all characters' Holy damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHolyProtection)
      description = "Reduce all characters' Holy damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfFireProtection)
      description = "Reduce all characters' Fire damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfFireProtection)
      description = "Reduce all characters' Fire damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfLightningProtection)
      description = "Reduce all characters' Lightning damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfLightningProtection)
      description = "Reduce all characters' Lightning damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfWaterProtection)
      description = "Reduce all characters' Water damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfWaterProtection)
      description = "Reduce all characters' Water damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAirProtection)
      description = "Reduce all characters' Air damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfAirProtection)
      description = "Reduce all characters' Air damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfEarthProtection)
      description = "Reduce all characters' Earth damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfEarthProtection)
      description = "Reduce all characters' Earth damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAthena)
      description = "Increase Healing Received from all sources by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfAthenaValue() * 100) + "%</span> for the character equipped with Athena.";
    if (type === ItemsEnum.LargeCharmOfAthena)
      description = "Increase Healing Received from all sources by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfAthenaValue() * 100) + "%</span> for the character equipped with Athena.";

    if (type === ItemsEnum.SmallCharmOfArtemis)
      description = "Increase Debuff Duration by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfArtemisValue() * 100) + "%</span> for all debuffs created by the character equipped with Artemis.";
    if (type === ItemsEnum.LargeCharmOfAthena)
      description = "Increase Debuff Duration by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfArtemisValue() * 100) + "%</span> for all debuffs created by the character equipped with Artemis.";

    if (type === ItemsEnum.SmallCharmOfHermes)
      description = "Increase Overdrive gauge gain from auto attacks by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfHermesValue() * 100) + "%</span> for the character equipped with Hermes.";
    if (type === ItemsEnum.LargeCharmOfHermes)
      description = "Increase Overdrive gauge gain from auto attacks by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfHermesValue() * 100) + "%</span> for the character equipped with Hermes.";

    if (type === ItemsEnum.SmallCharmOfApollo)
      description = "Increase Healing Done by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfApolloValue() * 100) + "%</span> for the character equipped with Apollo.";
    if (type === ItemsEnum.LargeCharmOfApollo)
      description = "Increase Healing Done by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfApolloValue() * 100) + "%</span> for the character equipped with Apollo.";

    return description;
  }

  getResourceDescription(item: ItemsEnum) {
    var description = "";
    if (item === ItemsEnum.Coin)
      description = "Use to trade with merchants.";
    else //if (item === ItemsEnum.LightLeather)
      description = "Used for crafting. <hr/>Can be found at:<br/>" +
        this.getResourceItemLocations(item);

    return description;
  }

  getResourceItemLocations(item: ItemsEnum) {
    var locations = "<div>???</div>";
    var matchingEnemies: Enemy[] = [];
    var matchingSubzones: SubZoneEnum[] = [];

    //get enemies who have item
    //find what subzones they exist in, remove those that aren't unlocked
    //list highest % chance of top 3-5 or so

    for (const [propertyKey, propertyValue] of Object.entries(BestiaryEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as BestiaryEnum;
      //todo: one option for optimization is abstract out loot from enemy generation and call that both in generateEnemy and here
      var enemy = this.enemyGeneratorService.generateEnemy(enumValue);
      if (enemy.loot.some(loot => loot.item === item)) {
        //todo: should I hide it like below or not?
        //var defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
        //if (defeatCount !== undefined && defeatCount.defeatCount >= this.utilityService.killCountDisplayBasicEnemyLoot)
        matchingEnemies.push(enemy);
      }
    }

    if (matchingEnemies.length > 0) {
      matchingEnemies.forEach(enemy => {
        for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
          if (!Number.isNaN(Number(propertyKey))) {
            continue;
          }

          var enumValue = propertyValue as SubZoneEnum;

          var options = this.subzoneGeneratorService.generateBattleOptions(enumValue);
          if (options.some(option => option.enemyList.some(list => list.name === enemy.name))) {
            matchingSubzones.push(enumValue);
          }
        }
      });
    }

    for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var subzoneValue = propertyValue as SubZoneEnum;

      var rewards = this.subzoneGeneratorService.getTreasureChestRewards(subzoneValue);

      if (rewards.some(loot => loot.item === item)) {
        matchingSubzones.push(subzoneValue);
      }
    }

    if (matchingSubzones.length === 0)
      return locations;

    locations = "";
    matchingSubzones = matchingSubzones.filter((el, i, a) => i === a.indexOf(el));
    matchingSubzones.forEach(subzone => {
      var matchedSubzone = this.balladService.findSubzone(subzone);
      var name = this.getSubZoneByType(subzone).name;

      if (matchedSubzone !== undefined) {
        var matchedBallad = this.balladService.findBalladOfSubzone(matchedSubzone?.type);
        if (matchedBallad !== undefined && !matchedBallad.isAvailable && matchedSubzone.isAvailable) {
          name = "<span class='subzoneUnavailable'>" + name + " (Unavailable)</span>";
          locations += "<div class='" + subzone.toString() + "'>" + name + "</div>";
        }
        else if (matchedSubzone.isAvailable) {
          //TODO: clear count should be relevant here, <100 clears = ???, >100 clears gives info maybe
          locations += "<div class='subzoneClickableItem " + subzone.toString() + "'>" + name + "</div>";
        }
      }

    });

    return this.utilityService.getSanitizedHtml(locations);
    //<div>???</div><div>???</div>";
  }

  getItemTypeName(item: ItemsEnum) {
    var itemTypeName = "";

    var equipment = this.getEquipmentPieceByItemType(item);

    if (equipment !== undefined)
      itemTypeName = this.getEquipmentTypeName(equipment);
    else {
      var itemType = this.getItemTypeFromItemEnum(item);

      if (itemType === ItemTypeEnum.BattleItem)
        itemTypeName = "Equippable Damaging Item";
      else if (itemType === ItemTypeEnum.HealingItem)
        itemTypeName = "Equippable Healing Item";
      else if (itemType === ItemTypeEnum.CraftingMaterial)
        itemTypeName = "Material";
      else if (itemType === ItemTypeEnum.Resource)
        itemTypeName = "Resource";
    }

    return itemTypeName;
  }

  getEquipmentTypeName(equipment: Equipment) {
    var name = "";

    if (equipment.equipmentType === EquipmentTypeEnum.Weapon) {
      if (equipment.weaponType === WeaponTypeEnum.Sword)
        name = "Weapon - Sword";
      if (equipment.weaponType === WeaponTypeEnum.Hammer)
        name = "Weapon - Hammer";
      if (equipment.weaponType === WeaponTypeEnum.Bow)
        name = "Weapon - Bow";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Shield) {
      name = "Shield";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Armor) {
      name = "Armor";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Ring) {
      name = "Ring";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Necklace) {
      name = "Necklace";
    }

    return name;
  }

  getEquipmentPieceByItemType(type: ItemsEnum) {
    var equipmentPiece: Equipment | undefined = undefined;

    //swords
    if (type === ItemsEnum.IronSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 4, 0, 5, 0, 0);
    }
    if (type === ItemsEnum.BronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 8, 0, 10, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 12, 0, 15, 0, 0);
    }
    if (type === ItemsEnum.SteelSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 16, 0, 20, 0, 0);
      equipmentPiece.stats.overdriveGain = .05;
    }
    if (type === ItemsEnum.SwordOfFlames) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 20, 0, 25, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.OnAbilityUse;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 30, true, false, false, "Sword of Flames", undefined, undefined, ElementalTypeEnum.Fire, undefined, false));
    }
    if (type === ItemsEnum.GoldenSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 32, 0, 40, 0, 0);
    }

    //hammers
    if (type === ItemsEnum.IronHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 7, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 14, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 21, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 28, 0, 0, 0, 0);
      equipmentPiece.stats.armorPenetration = .025;
    }
    if (type === ItemsEnum.FendingMace) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(50, 37, 0, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.OnAutoAttack;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 24, true, false, false, "Fending Mace", undefined, undefined, undefined, undefined, false));
    }
    if (type === ItemsEnum.DiamondHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 56, 0, 0, 0, 0);
    }

    //bows
    if (type === ItemsEnum.ShortBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 5, 0, 0, 4, 0);
    }
    if (type === ItemsEnum.LongBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 10, 0, 0, 8, 0);
    }
    if (type === ItemsEnum.Venomstrike) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 15, 0, 0, 12, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .2;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 3, 15, "Venomstrike", dotTypeEnum.TrueDamage));
    }
    if (type === ItemsEnum.ElysianOakBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 20, 0, 0, 16, 0);
      equipmentPiece.stats.criticalMultiplier = .05;
    }
    if (type === ItemsEnum.SpiritBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 25, 0, 0, 20, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enearth, -1, 1, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.EagleEye) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 40, 0, 0, 40, 0);
    }

    //shields
    if (type === ItemsEnum.IronShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(0, 0, 7, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(0, 0, 14, 0, 0, 0);
    }
    if (type === ItemsEnum.Aegis) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 13, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 3, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.MoltenShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 25, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 3;
      equipmentPiece.stats.elementalDamageResistance.fire += .05;
    }
    if (type === ItemsEnum.ShieldOfTheHealer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 45, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 5;
      equipmentPiece.stats.healingDone += .05;
    }

    //armor
    if (type === ItemsEnum.LinenArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(20, 0, 2, 0, 0, 0);
    }
    if (type === ItemsEnum.IronArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(40, 0, 3, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(80, 0, 5, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(120, 0, 10, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(240, 0, 25, 0, 0, 10);
    }
    if (type === ItemsEnum.MoltenArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(300, 0, 20, 10, 0, 0);
      equipmentPiece.stats.elementalDamageResistance.fire += .05;
    }
    if (type === ItemsEnum.HardenedLeatherArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(450, 0, 45, 25, 0, 0);
    }
    if (type === ItemsEnum.BearskinArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(600, 0, 85, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceDirectDamage, -1, 6, false, true, false));
    }
    if (type === ItemsEnum.BoarskinArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(600, 0, 30, 55, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .25;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 4, 4, 4, 4, 4);
    }
    if (type === ItemsEnum.PendantOfFortune) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 25, 0);
      equipmentPiece.stats.criticalMultiplier = .1;
    }
    if (type === ItemsEnum.PendantOfPower) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 25, 0, 0, 0, 0);
      equipmentPiece.stats.armorPenetration = .05;
    }
    if (type === ItemsEnum.PendantOfSpeed) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 25, 0, 0);
      equipmentPiece.stats.overdriveGain = .1;
    }
    if (type === ItemsEnum.GemmedNecklace) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 25);
      equipmentPiece.stats.elementalDamageResistance.earth += .1;
    }

    //ring
    if (type === ItemsEnum.MoltenRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 10);
      equipmentPiece.stats.elementalDamageResistance.fire += .10;
    }
    //+% to elemental damage, absorb certain amount of elemental damage
    if (type === ItemsEnum.FracturedRubyRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.fire += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Fire, 90));
    }
    if (type === ItemsEnum.FracturedAmethystRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.air += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Air, 90));
    }
    if (type === ItemsEnum.FracturedAquamarineRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.water += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Water, 90));
    }
    if (type === ItemsEnum.FracturedEmeraldRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.earth += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Earth, 90));
    }
    if (type === ItemsEnum.FracturedOpalRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.lightning += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Lightning, 90));
    }
    if (type === ItemsEnum.FracturedTopazRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementalDamageIncrease.holy += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 90, 50, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Holy, 90));
    }
    if (type === ItemsEnum.BedazzledRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(80, 0, 0, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.BattleItemDamageUp, -1, 1.5, false, true, false, type.toString()));
    }

    return equipmentPiece;
  }

  getEquipmentQualityClass(item?: Equipment) {
    var classText = "";
    if (item === undefined)
      return classText;

    if (item.quality === EquipmentQualityEnum.Basic)
      classText = "basicEquipment";
    if (item.quality === EquipmentQualityEnum.Uncommon)
      classText = "uncommonEquipment";
    if (item.quality === EquipmentQualityEnum.Rare)
      classText = "rareEquipment";
    if (item.quality === EquipmentQualityEnum.Epic)
      classText = "epicEquipment";
    if (item.quality === EquipmentQualityEnum.Special)
      classText = "specialEquipment";
    if (item.quality === EquipmentQualityEnum.Extraordinary)
      classText = "extraordinaryEquipment";
    if (item.quality === EquipmentQualityEnum.Unique)
      classText = "uniqueEquipment";

    return classText;
  }

  getItemTextClass(item: ResourceValue) {
    if (item.type === ItemTypeEnum.Equipment)
      return this.getEquipmentQualityClass(this.getEquipmentPieceByItemType(item.item));
    else
      return "";
  }

  getItemSellPrice(item: ItemsEnum) {
    var sellPrice = 1;
    var originalPrice = this.shopItemGeneratorService.generateShopItem(item, SubZoneEnum.None);

    var coinCost = originalPrice.purchasePrice.find(item => item.item === ItemsEnum.Coin);

    if (coinCost !== undefined)
      sellPrice = coinCost.amount / 4;

    return sellPrice;
  }

  getAutoAttackDescription(character: Character) {
    var description = "";
    var secondsPerAutoAttack = this.utilityService.roundTo(this.globalService.getAutoAttackTime(character), 3);//.replace(/[.,]00$/, "");    
    var totalAutoAttackCount = this.getTotalAutoAttackCount(character);

    description = "Deal <strong>100% of Attack</strong> damage to a single target " + totalAutoAttackCount.toFixed(3) + (totalAutoAttackCount === 1 ? " time" : " times") + " every <strong>" + secondsPerAutoAttack + "</strong> seconds.";

    return description;
  }

  isOverdriveDiscovered(type: OverdriveNameEnum, character?: Character) {
    if (character !== undefined && character.unlockedOverdrives.some(item => item === type)) {
      return true;
    }

    return false;
  }


  getOverdriveName(type: OverdriveNameEnum, character?: Character) {
    var name = "";

    if (character !== undefined && !character.unlockedOverdrives.some(item => item === type)) {
      return "???";
    }

    if (type === OverdriveNameEnum.Fervor)
      name = "Fervor";
    if (type === OverdriveNameEnum.Smash)
      name = "Smash";
    if (type === OverdriveNameEnum.Protection)
      name = "Protection";
    if (type === OverdriveNameEnum.Nature)
      name = "Nature";


    return name;
  }

  getOverdriveDescription(type: OverdriveNameEnum) {
    var description = "";

    if (type === OverdriveNameEnum.Fervor) {
      description = "For 20 seconds, your auto attack cooldown is twice as fast.";
    }
    if (type === OverdriveNameEnum.Smash) {
      description = "For 20 seconds, your auto attacks deal 50% increased damage.";
    }
    if (type === OverdriveNameEnum.Protection) {
      description = "After 20 seconds, you recover 50% of the damage you took while this effect was active.";
    }
    if (type === OverdriveNameEnum.Nature) {
      description = "For 20 seconds, all non elemental attacks take on the element of the last elemental attack you used while this effect is active.";
    }

    return description;
  }

  getOverdriveUnlockCondition(type: OverdriveNameEnum, character: Character) {
    var description = "???";

    if (type === OverdriveNameEnum.Fervor) {
      description = "Reach character level 20. <i>(" + character.level + ")</i>";
    }
    if (type === OverdriveNameEnum.Protection) {
      description = "Take " + this.utilityService.overdriveDamageNeededToUnlockProtection.toLocaleString() + " damage. <i>(" + character.trackedStats.damageTaken.toLocaleString() + ")</i>";
    }
    if (type === OverdriveNameEnum.Nature) {
      description = "Deal " + this.utilityService.overdriveAttacksNeededToUnlockNature.toLocaleString() + " elemental damage. <i>(" + character.trackedStats.elementalDamageDealt.toLocaleString() + ")</i>";
    }

    return description;
  }

  setOverdrive(character: Character, type: OverdriveNameEnum) {
    character.overdriveInfo = this.getOverdriveInfo(type);
  }

  getOverdriveInfo(type: OverdriveNameEnum) {
    var overdriveInfo = new OverdriveInfo();

    overdriveInfo.selectedOverdrive = type;

    if (type === OverdriveNameEnum.Fervor) {
      overdriveInfo.overdriveGaugeTotal = 120;
      overdriveInfo.overdriveActiveLength = 20;
    }
    if (type === OverdriveNameEnum.Smash) {
      overdriveInfo.overdriveGaugeTotal = 80;
      overdriveInfo.overdriveActiveLength = 20;
    }
    if (type === OverdriveNameEnum.Nature) {
      overdriveInfo.overdriveGaugeTotal = 150;
      overdriveInfo.overdriveActiveLength = 20;
    }
    if (type === OverdriveNameEnum.Protection) {
      overdriveInfo.overdriveGaugeTotal = 150;
      overdriveInfo.overdriveActiveLength = 20;
    }

    return overdriveInfo;
  }

  getOverdriveMultiplier(character: Character) {
    return 3;
  }

  getAbilityEffectiveAmount(character: Character, ability: Ability) {
    return ability.effectiveness * this.getAdjustedAttack(character);
  }

  getCharacterAbilityDescription(abilityName: string, character: Character, ability?: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var thresholdAmountPercent = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;

    if (ability !== undefined) {
      effectivenessPercent = ability.effectiveness * 100;
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = this.utilityService.roundTo((ability.effectiveness - 1) * 100, 2);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = this.utilityService.roundTo(ability.cooldown * character.battleStats.abilityCooldownReduction, 3);

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness) * 100, 2);
        else
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness - 1) * 100, 2);
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedTargetGainStatusEffectEffectiveness) * 100, 2);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedTargetGainStatusEffectEffectiveness - 1) * 100, 2);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    //Adventurer
    if (abilityName === "Quick Hit")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Barrage")
      abilityDescription = "Every <strong>" + this.utilityService.ordinalSuffixOf(abilityCount) + "</strong> auto attack hits all additional enemies for <strong>" + (ability !== undefined ? (ability!.effectiveness * 100).toString() : "") + "%</strong> of the damage dealt. Passive.";
    if (abilityName === "Thousand Cuts")
      abilityDescription = "For <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds, deal an additional <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> damage after each auto attack or ability. " + cooldown + " second cooldown.";

    //Archer
    if (abilityName === "Sure Shot")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Mark")
      abilityDescription = "When an enemy has a status effect that you have applied, they also have Mark. Mark increases damage taken by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong>. Passive.";
    if (abilityName === "Pinning Shot")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Stun the target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Warrior
    if (abilityName === "Battle Cry")
      abilityDescription = "Draw all targets' focus for the next <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds, forcing all attacks to target you. " + cooldown + " second cooldown.";
    if (abilityName === "Last Stand")
      abilityDescription = "When HP drops below <strong>" + thresholdAmountPercent + "%</strong>, increase Defense by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Shield Slam")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Deals increased damage based on defense. " + cooldown + " second cooldown.";

    //Priest
    if (abilityName === "Heal")
      abilityDescription = "Heal a party member for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP. Targets the party member with the lowest HP %. " + cooldown + " second cooldown.";
    if (abilityName === "Faith")
      abilityDescription = "God abilities for all characters are more effective by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Pray")
      abilityDescription = "Grant all characters a <strong>" + (effectivenessPercent) + "% of Attack</strong> HP Shield, up to <strong>" + thresholdAmountPercent + "%</strong> of their total health. " + cooldown + " second cooldown.";

    return this.utilityService.getSanitizedHtml(abilityDescription);
  }

  getGodAbilityDescription(abilityName: string, character: Character, ability?: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var secondaryEffectiveAmount = 0;
    var secondaryEffectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var thresholdAmountPercent = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;

    if (ability !== undefined) {
      effectivenessPercent = Math.round(ability.effectiveness * 100);
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = Math.round((ability.effectiveness - 1) * 100);
      secondaryEffectiveAmount = ability.secondaryEffectiveness;
      secondaryEffectiveAmountPercent = Math.round((secondaryEffectiveAmount - 1) * 100);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = ability.cooldown;

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness - 1) * 100);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    //Athena
    if (abilityName === "Second Wind")
      abilityDescription = "After using an ability, your next auto attack heals for <strong>" + relatedUserGainStatusEffectEffectiveness + "</strong> HP. Passive.";
    if (abilityName === "Divine Strike")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Holy</span> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    if (abilityName === "Heavenly Shield")
      abilityDescription = "Reduce damage taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Blinding Light")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Holy</span> damage to all targets. Blind them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Artemis
    if (abilityName === "True Shot")
      abilityDescription = "If your target has a negative status effect, increase critical strike chance by <strong>" + effectiveAmountPercent + "%</strong> when attacking. Passive.";
    if (abilityName === "Wounding Arrow")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their attack by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Paralyzing Volley")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and paralyze them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Expose Weakness")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Any negative status effects on the target have their duration increased by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the original duration. " + cooldown + " second cooldown.";

    //Apollo
    if (abilityName === "Staccato")
      abilityDescription = "Increase the party's agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Staccato is active, each party member performs a free auto attack. " + cooldown + " second cooldown.";
    if (abilityName === "Fortissimo")
      abilityDescription = "Increase the party's attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Fortissimo is active, reduce your other cooldowns by <strong>" + secondaryEffectiveAmountPercent + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Coda")
      abilityDescription = "Increase the party's luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Coda is active, cleanse a random debuff from a party member. " + cooldown + " second cooldown.";
    if (abilityName === "Ostinato")
      abilityDescription = "Every " + cooldown + " seconds, heal a party member for <strong>" + effectiveAmount + "</strong> HP. Targets the party member with the lowest HP %.";

    //Hermes
    if (abilityName === "Nimble Strike")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. " + cooldown + " second cooldown.";
    if (abilityName === "Take Flight")
      abilityDescription = "Increase your attack and agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Special Delivery")
      abilityDescription = "Immediately perform <strong>three</strong> auto attacks. Their damage is increased by <strong>" + effectiveAmountPercent + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Quicken")
      abilityDescription = "Every auto attack reduces your cooldowns by <strong>" + ability?.effectiveness.toFixed(3) + "</strong> seconds. Passive.";

    //Zeus
    if (abilityName === "Overload")
      abilityDescription = "Surge effect increases damage dealt by next ability by " + effectiveAmount + "%. Passive";
    if (abilityName === "Lightning Bolt")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. Grants user Surge. " + cooldown + " second cooldown.";
    if (abilityName === "Chain Lightning")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. Deal 25% less damage to another random target. Repeat until all targets have been hit. " + cooldown + " second cooldown.";
    if (abilityName === "Judgment")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. " + cooldown + " second cooldown.";

    return abilityDescription;
  }

  getEnemyAbilityDescription(character: Character, ability: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var secondaryEffectiveAmount = 0;
    var secondaryEffectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var thresholdAmountPercent = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;

    if (ability !== undefined) {
      effectivenessPercent = Math.round(ability.effectiveness * 100);
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = Math.round((ability.effectiveness - 1) * 100);
      secondaryEffectiveAmount = ability.secondaryEffectiveness;
      secondaryEffectiveAmountPercent = Math.round((secondaryEffectiveAmount - 1) * 100);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = ability.cooldown;

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness - 1) * 100);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    if (ability.name === "Slash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sure Shot") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Claw") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Enrage") {
      abilityDescription = "Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Ravage") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Empower") {
      abilityDescription = "Increase the party's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Constrict") {
      abilityDescription = "Reduce target's Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Ethereal") {
      abilityDescription = "Avoid all auto attacks for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Gaze") {
      abilityDescription = "Stun target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Snake Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Feint") {
      abilityDescription = "Reduce target's Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Smash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wallop") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Death's Touch") {
      abilityDescription = "Reduce target's Attack and Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Soul Rip") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rambling") {
      abilityDescription = "Reduce all enemies' Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Burn") {
      abilityDescription = "Apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Slice" || ability.name === "Dual Slice") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Roll") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Enfire") {
      abilityDescription = "All attacks are now Fire elemental for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Slam") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Trample") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stagger") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Reduce target's auto attack cooldown rate by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fire Breath") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tail Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target.";
    }
    if (ability.name === "Regeneration") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP.";
    }
    if (ability.name === "Shields Up") {
      abilityDescription = "Increase the party's Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Focus") {
      abilityDescription = "Cast taunt onto a target, forcing that character to direct all attacks onto you for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sap") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> true damage to a target and heal back the amount of damage dealt.";
    }
    if (ability.name === "Path of Flames") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Speed Up") {
      abilityDescription = "Increase the user's Attack and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong>. Stacks up to three times.";
    }
    if (ability.name === "Flames of Tartarus") {
      abilityDescription = "Used when user attempts to Speed Up for the fourth time. Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. Resets Speed Up stacks back to 0.";
    }
    if (ability.name === "Ride Down") {
      abilityDescription = "Increase the party's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Fire Power") {
      abilityDescription = "Increase the party's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Divinity") {
      abilityDescription = "Give each party member a Barrier of <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Gemini Strike") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Increase Attack based on how much Barrier you have.";
    }
    if (ability.name === "Explode") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Instantly die. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Savage Claw") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lacerate") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Howl") {
      abilityDescription = "Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Spray") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to all targets. Apply Unsteady debuff to targets, reducing ability cooldown speed by " + relatedTargetGainStatusEffectEffectivenessPercent + "% for " + relatedTargetGainStatusEffectDuration + " seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Defense") {
      abilityDescription = "Reduce the user's Damage Taken by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Bark") {
      abilityDescription = "Reduce target's Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Fire Breath") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Peck") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Spirit of the Forest") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }

    return abilityDescription;
  }

  getStatusEffectDescription(statusEffect: StatusEffect) {
    var description = "";

    if (statusEffect.type === StatusEffectEnum.AgilityUp)
      description = "Increase Agility by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AttackUp)
      description = "Increase Attack by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DefenseUp)
      description = "Increase Defense by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LuckUp)
      description = "Increase Luck by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ResistanceUp)
      description = "Increase Resistance by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.MaxHpUp)
      description = "Increase Max HP by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageDealtUp)
      description = "Increase damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageTakenUp)
      description = "Increase damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.AgilityDown)
      description = "Decrease Agility by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AttackDown)
      description = "Decrease Attack by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DefenseDown)
      description = "Decrease Defense by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LuckDown)
      description = "Decrease Luck by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ResistanceDown)
      description = "Decrease Resistance by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.MaxHpDown)
      description = "Decrease Max HP by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageDealtDown)
      description = "Decrease damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageTakenDown)
      description = "Decrease damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.Blind)
      description = "Auto attacks have a 50% chance to miss, dealing no damage and not triggering any associated effects.";
    if (statusEffect.type === StatusEffectEnum.Fortissimo)
      description = "Apollo is playing at Fortissimo.";
    if (statusEffect.type === StatusEffectEnum.Coda)
      description = "Apollo is playing a Coda.";
    if (statusEffect.type === StatusEffectEnum.Staccato)
      description = "Apollo is playing a Staccato.";
    if (statusEffect.type === StatusEffectEnum.Dead)
      description = "This character is dead.";
    if (statusEffect.type === StatusEffectEnum.Dodge)
      description = "Avoid all auto attacks.";
    if (statusEffect.type === StatusEffectEnum.InstantHealAfterAutoAttack)
      description = "Your next auto attack will also heal you for " + statusEffect.effectiveness + " HP.";
    if (statusEffect.type === StatusEffectEnum.Mark)
      description = "Damage against this target is increased by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.Stun)
      description = "Auto attack and ability cooldowns are not charging.";
    if (statusEffect.type === StatusEffectEnum.Paralyze)
      description = "10% chance every second to be stunned for 2 seconds.";
    if (statusEffect.type === StatusEffectEnum.RecentlyDefeated)
      description = "You have recently been defeated and are still nursing your wounds. Your primary stats are reduced by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ThousandCuts)
      description = "Deal increased damage after every attack.";
    if (statusEffect.type === StatusEffectEnum.DamageOverTime)
      description = "Taking damage over time.";
    if (statusEffect.type === StatusEffectEnum.Thorns)
      description = "Dealing damage back to auto attackers.";
    if (statusEffect.type === StatusEffectEnum.Stagger)
      description = "Decrease auto attack cooldown speed by " + Math.round((statusEffect.effectiveness) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.DebilitatingToxin)
      description = "10% chance on auto attack to reduce target's agility by 10% for 8 seconds.";
    if (statusEffect.type === StatusEffectEnum.PoisonousToxin)
      description = "10% chance on auto attack to deal 22 additional damage.";

    if (statusEffect.type === StatusEffectEnum.HeroicElixir)
      description = "Increase Max HP by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.RejuvenatingElixir)
      description = "Increase HP Regen by " + statusEffect.effectiveness + " per 5 seconds.";


    return description;
  }

  getAltarEffectDescription(effect: AltarEffect) {
    var description = "";

    var duration = Math.round(effect.duration);
    var durationString = "";
    if (duration < 60)
      durationString = duration + " seconds";
    else
      durationString = Math.ceil(duration / 60) + " minutes";

    /*if (effect.type === AltarEffectsEnum.SmallAltarPrayStrength)
      description = "Increase all Primary Stats by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
    if (effect.type === AltarEffectsEnum.SmallAltarPrayFortune)
      description = "Increase Coin gain from battle by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
*/
    if (effect.type === AltarEffectsEnum.AttackUp)
      description = "Increase Attack of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaDefenseUp)
      description = "Increase Defense of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaHeal)
      description = "When the duration expires, heal all party members for " + effect.effectiveness + " HP.";
    if (effect.type === AltarEffectsEnum.AthenaHealOverTime)
      description = "Heal all party members for " + effect.effectiveness + " HP every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.ArtemisLuckUp)
      description = "Increase Luck of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisCriticalDamageUp)
      description = "Increase Critical Damage Multiplier of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisDefenseDebuff)
      description = "When the duration expires, reduce all enemies' Defense by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAgilityUp)
      description = "Increase Agility of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAutoAttackUp)
      description = "Increase Auto Attack Damage of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAbilityCooldown)
      description = "When the duration expires, reduce all party members' cooldowns by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloBuffDurationUp)
      description = "Increase the duration of any buffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloResistanceUp)
      description = "Increase Resistance of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloHeal)
      description = "Heal the party member with the lowest HP % for " + effect.effectiveness + " HP.";

    description += "<br/>Remaining Duration: " + durationString + "<br/><hr/>";
    return description;
  }

  getGodNameByType(godType: GodEnum) {
    var name = "";

    if (godType === GodEnum.Athena)
      name = "Athena";
    if (godType === GodEnum.Zeus)
      name = "Zeus";
    if (godType === GodEnum.Apollo)
      name = "Apollo";
    if (godType === GodEnum.Hermes)
      name = "Hermes";
    if (godType === GodEnum.Ares)
      name = "Ares";
    if (godType === GodEnum.Artemis)
      name = "Artemis";
    if (godType === GodEnum.Poseidon)
      name = "Poseidon";

    return name;
  }

  getResourceAmount(type: ItemsEnum) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type);
    if (resource === undefined)
      return 0;

    if (type === ItemsEnum.Coin)
      return Math.floor(resource.amount);

    return resource.amount;
  }

  useResource(type: ItemsEnum, amount: number) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type);
    if (resource === undefined)
      return;

    resource.amount -= amount;

    if (resource.amount < 0)
      resource.amount = 0;

    if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Equipment) {
      var equipCount = this.getItemEquipCount(type);
      if (equipCount > 0 && resource.amount < equipCount) {
        while (resource.amount < equipCount) {
          var character = this.getCharacterTypeEquippedWithItem(type);
          this.globalService.unequipItem(this.getEquipmentPieceByItemType(type)?.equipmentType, character);

          equipCount -= 1;
        }
      }
    }
  }

  getItemEquipCount(type: ItemsEnum) {
    var equipCount = 0;

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      if (member.equipmentSet.weapon !== undefined && member.equipmentSet.weapon.itemType === type)
        equipCount += 1;
      if (member.equipmentSet.shield !== undefined && member.equipmentSet.shield.itemType === type)
        equipCount += 1;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type)
        equipCount += 1;
      if (member.equipmentSet.necklace !== undefined && member.equipmentSet.necklace.itemType === type)
        equipCount += 1;
      if (member.equipmentSet.ring !== undefined && member.equipmentSet.ring.itemType === type)
        equipCount += 1;
    })

    return equipCount;
  }

  getCharacterTypeEquippedWithItem(type: ItemsEnum) {
    var characterType = CharacterEnum.None;

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      if (member.equipmentSet.weapon !== undefined && member.equipmentSet.weapon.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.shield !== undefined && member.equipmentSet.shield.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.necklace !== undefined && member.equipmentSet.necklace.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type)
        characterType = member.type;
    })

    return characterType;
  }

  gainResource(item: ResourceValue) {
    if (item === undefined)
      return;

    var existingResource = this.globalService.globalVar.resources.find(resource => item.item === resource.item);
    if (existingResource === undefined) {
      this.globalService.globalVar.resources.push(item);
    }
    else {
      existingResource.amount += item.amount;
    }
  }

  increaseItemBeltSize() {
    this.globalService.globalVar.itemBeltSize += 1;
  }

  itemDoesNotNeedSelection() {
    var doesNotNeedSelection = false;

    return doesNotNeedSelection;
  }

  getBattleItemEffect(item: ItemsEnum) {
    var itemEffect: UsableItemEffect = new UsableItemEffect();

    if (item === ItemsEnum.HealingHerb) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 50;
    }
    if (item === ItemsEnum.HealingPoultice) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 200;
    }
    if (item === ItemsEnum.HealingSalve) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 150;
      itemEffect.isAoe = true;
    }
    if (item === ItemsEnum.RestorativeHerb) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 150;
    }
    if (item === ItemsEnum.ThrowingStone) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 3;
    }
    if (item === ItemsEnum.PoisonFang) {
      itemEffect.dealsDamage = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, 7, "Poison Fang", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.ExplodingPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 23;
    }
    if (item === ItemsEnum.FirePotion) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 40;
      itemEffect.elementalProperty = ElementalTypeEnum.Fire;
    }
    if (item === ItemsEnum.HeftyStone) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 32;
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(9, 3, 22, "Strangling Gas", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.DebilitatingToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DebilitatingToxin, 30 * 60, .1, false, true));
    }
    if (item === ItemsEnum.PoisonousToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.PoisonousToxin, 30 * 60, .1, false, true, undefined, "Poisonous Toxin"));
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.isAoe = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 2, 30, "Poison Extract", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.HeroicElixir) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.HeroicElixir, 30 * 60, 1.1, false, true));
    }
    if (item === ItemsEnum.RejuvenatingElixir) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RejuvenatingElixir, 30 * 60, 5, false, true));
    }

    return itemEffect;
  }

  getTotalAutoAttackCount(character: Character, forPartyMember: boolean = true, nonadjusted: boolean = false) {
    var adjustedAgility = this.getAdjustedAgility(character, forPartyMember);
    if (nonadjusted)
      adjustedAgility = character.battleStats.agility;
    var agilityPerAdditionalAttack = 250;
    var remainingAgility = adjustedAgility;
    var attackCount = 0;
    var attackRemainder = 0;
    var reachedFinalBreakpoint = false;

    while (remainingAgility > 0 && !reachedFinalBreakpoint) {
      agilityPerAdditionalAttack = this.getAgilityPerAttackForAttackCount(attackCount + 1);

      if (remainingAgility > agilityPerAdditionalAttack) {
        remainingAgility -= agilityPerAdditionalAttack;
        attackCount += 1;
      }
      else {
        reachedFinalBreakpoint = true;
      }
    }

    attackRemainder = remainingAgility / agilityPerAdditionalAttack;

    return 1 + attackCount + attackRemainder; //(adjustedAgility / agilityPerAdditionalAttack);
  }

  getAgilityPerAttackForAttackCount(attackCount: number) {
    var agilityCost = 500; //for a specific attack
    var totalAgilityCost = agilityCost; //overall agility required

    for (var i = 2; i <= attackCount; i++) {
      agilityCost = totalAgilityCost * 4;
      totalAgilityCost += agilityCost;
    }
    //1 = 500, 2 = 2,000, 3 = 10,000, 4 = 50,000, 5 = 250,000   

    return agilityCost;
  }

  getDamageCriticalChance(attacker: Character, target: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    var targetResistance = this.getAdjustedResistance(target);

    criticalChance = this.getDamageCriticalChanceByNumbers(attackerLuck, targetResistance);

    var trueShot = this.characterHasAbility("True Shot", attacker);
    if (trueShot !== undefined && target.battleInfo.statusEffects.some(effect => !effect.isPositive)) {
      criticalChance *= trueShot.effectiveness;
    }

    return criticalChance;
  }

  getHealingCriticalChance(attacker: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    criticalChance = this.getHealingCriticalChanceByNumbers(attackerLuck);

    return criticalChance;
  }

  getDamageCriticalChanceByNumbers(attackerLuck: number, targetResistance: number) {
    var criticalChance = .05;

    var differential = attackerLuck / targetResistance;

    if (differential >= 1) {
      var horizontalStretch = .75;
      var horizontalPosition = .325;

      //log(.75 * x) + .325
      criticalChance = Math.log10(horizontalStretch * differential) + horizontalPosition;
    }
    else if (differential < 1) {
      //.25 * log(9^x) - .25      
      var amplifier = .25;
      var horizontalStretch = 9;
      var horizontalPosition = -.25;

      criticalChance = amplifier * (Math.log10(horizontalStretch * differential + horizontalPosition));
    }

    return criticalChance;
  }

  getHealingCriticalChanceByNumbers(attackerLuck: number) {
    var criticalChance = .05;

    var amplifier = 20;
    var horizontalStretch = .05;
    var horizontalPosition = 5;

    //500 * (log(.0035 * 10 + 1)) + 50      
    criticalChance = (amplifier * Math.log10(horizontalStretch * (attackerLuck) + horizontalPosition) / 100);

    return criticalChance;
  }

  getAdjustedMaxHp(character: Character, forPartyMember: boolean = true) {
    var maxHp = character.battleStats.maxHp;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.MaxHpUp ||
        effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.HeroicElixir);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.MaxHpUp || effect.type === StatusEffectEnum.MaxHpDown
            || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.HeroicElixir) {
            maxHp *= effect.effectiveness;
          }
        });
      }
    }

    if (maxHp < character.battleStats.currentHp)
      character.battleStats.currentHp = maxHp;

    /*if (this.globalService.globalVar.activeAltarEffects.length > 0) {
      var relevantAltarEffects = this.globalService.globalVar.activeAltarEffects.filter(effect => effect.type === AltarEffectsEnum.SmallAltarPrayStrength);

      if (relevantAltarEffects.length > 0) {
        relevantAltarEffects.forEach(effect => {
          if (effect.type === AltarEffectsEnum.SmallAltarPrayStrength) {
            maxHp *= effect.effectiveness;
          }
        })
      }
    }*/

    return maxHp;
  }

  getAdjustedAgility(character: Character, forPartyMember: boolean = true) {
    var agility = character.battleStats.agility;
    var activeStaccato: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        if (effect !== undefined)
          activeStaccato = effect;
      });

      if (activeStaccato !== undefined)
        agility *= activeStaccato.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AgilityUp ||
        effect.type === StatusEffectEnum.AgilityDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AgilityUp || effect.type === StatusEffectEnum.AgilityDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            agility *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.HermesAgilityUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.HermesAgilityUp);
      agility *= relevantAltarEffect!.effectiveness;
    }

    return agility;
  }

  getAdjustedLuck(character: Character, forPartyMember: boolean = true) {
    var luck = character.battleStats.luck;
    var activeCoda: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (effect !== undefined)
          activeCoda = effect;
      });

      if (activeCoda !== undefined)
        luck *= activeCoda.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.LuckUp ||
        effect.type === StatusEffectEnum.LuckDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.LuckUp || effect.type === StatusEffectEnum.LuckDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            luck *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisLuckUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisLuckUp);
      luck *= relevantAltarEffect!.effectiveness;
    }

    return luck;
  }

  getAdjustedResistance(character: Character, forPartyMember: boolean = true) {
    var resistance = character.battleStats.resistance;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.ResistanceUp ||
        effect.type === StatusEffectEnum.ResistanceDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.ResistanceUp || effect.type === StatusEffectEnum.ResistanceDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            resistance *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.ApolloResistanceUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.ApolloResistanceUp);
      resistance *= relevantAltarEffect!.effectiveness;
    }

    return resistance;
  }

  getAdjustedAttack(character: Character, ability?: Ability, forPartyMember: boolean = true) {
    var attack = character.battleStats.attack;
    var activeFortissimo: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        if (effect !== undefined)
          activeFortissimo = effect;
      });

      if (activeFortissimo !== undefined)
        attack *= activeFortissimo.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AttackUp ||
        effect.type === StatusEffectEnum.AttackDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AttackUp || effect.type === StatusEffectEnum.AttackDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            attack *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.AttackUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.AttackUp);
      attack *= relevantAltarEffect!.effectiveness;
    }

    if (ability !== undefined && ability.name === "Shield Slam") {
      attack += this.getAdjustedDefense(character) * ability.secondaryEffectiveness;
    }

    //increase attack by % of barrier
    if (ability !== undefined && ability.name === "Gemini Strike") {
      attack *= 1 + (character.battleInfo.barrierValue / character.battleStats.maxHp);
    }

    return attack;
  }

  getAdjustedDefense(character: Character, forPartyMember: boolean = true) {
    var defense = character.battleStats.defense;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DefenseUp ||
        effect.type === StatusEffectEnum.DefenseDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.DefenseUp || effect.type === StatusEffectEnum.DefenseDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            defense *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.AthenaDefenseUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.AthenaDefenseUp);
      defense *= relevantAltarEffect!.effectiveness;
    }

    var lastStand = character.abilityList.find(item => item.name === "Last Stand" && item.isAvailable);
    if (lastStand !== undefined && character.battleStats.getHpPercent() <= lastStand.threshold) {
      defense *= lastStand.effectiveness;
    }

    return defense;
  }

  getAbilityCooldown(ability: Ability, character: Character) {
    return ability.cooldown * (character.battleStats.abilityCooldownReduction);
  }

  getAutoAttackCooldown(character: Character) {
    return this.globalService.getAutoAttackTime(character);//character.battleInfo.timeToAutoAttack - character.battleStats.autoAttackCooldownReduction;
  }

  getAdjustedCriticalMultiplier(character: Character, forPartyMember: boolean = true) {
    var defaultMultiplier = 1.25;

    var altarIncrease = 0;
    if (forPartyMember && this.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisCriticalDamageUp) !== undefined) {
      var relevantAltarEffect = this.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisCriticalDamageUp);
      altarIncrease *= relevantAltarEffect!.effectiveness;
    }

    return defaultMultiplier + character.battleStats.criticalMultiplier + altarIncrease;
  }

  getOverdriveGainMultiplier(character: Character, isAutoAttack: boolean = false) {
    var defaultMultiplier = 1;
    var gainBonus = character.battleStats.overdriveGain;

    if (isAutoAttack)
      gainBonus += character.battleStats.overdriveGainFromAutoAttacks;

    return defaultMultiplier + gainBonus;
  }

  getArmorPenetrationMultiplier(character: Character) {
    var defaultMultiplier = 1;

    return defaultMultiplier - character.battleStats.armorPenetration;
  }

  getChthonicFavorMultiplier() {
    var multiplier = 1;
    var breakpoint = 100;
    var chthonicFavor = this.getResourceAmount(ItemsEnum.ChthonicFavor);

    if (chthonicFavor <= breakpoint) {
      multiplier = chthonicFavor * 1.5;
    }
    else {
      var preBreakpointAmount = 150;
      var amplifier = 15;
      multiplier = amplifier * Math.sqrt(chthonicFavor + breakpoint) + preBreakpointAmount;
    }

    return multiplier;
  }

  getEquipmentStats(equipment: Equipment | undefined) {
    var equipmentStats = "";

    if (equipment === undefined)
      return equipmentStats;

    if (equipment.stats.maxHp > 0)
      equipmentStats += "+" + equipment.stats.maxHp + " Max HP<br />";
    if (equipment.stats.attack > 0)
      equipmentStats += "+" + equipment.stats.attack.toString() + " Attack<br />";
    if (equipment.stats.agility > 0)
      equipmentStats += "+" + equipment.stats.agility + " Agility<br />";
    if (equipment.stats.defense > 0)
      equipmentStats += "+" + equipment.stats.defense + " Defense<br />";
    if (equipment.stats.luck > 0)
      equipmentStats += "+" + equipment.stats.luck + " Luck<br />";
    if (equipment.stats.resistance > 0)
      equipmentStats += "+" + equipment.stats.resistance + " Resistance<br />";

    if (equipment.stats.hpRegen > 0)
      equipmentStats += "+" + equipment.stats.hpRegen + " HP / 5 Sec<br />";
    if (equipment.stats.criticalMultiplier > 0)
      equipmentStats += "+" + (equipment.stats.criticalMultiplier * 100) + "% Critical Damage Bonus<br />";
    if (equipment.stats.armorPenetration > 0)
      equipmentStats += "+" + (equipment.stats.armorPenetration * 100) + "% Armor Penetration<br />";
    if (equipment.stats.overdriveGain > 0)
      equipmentStats += "+" + (equipment.stats.overdriveGain * 100) + "% Overdrive Gain Bonus<br />";
    if (equipment.stats.abilityCooldownReduction > 0)
      equipmentStats += "+" + (equipment.stats.abilityCooldownReduction * 100) + "% Ability Cooldown Reduction<br />";
    if (equipment.stats.autoAttackCooldownReduction > 0)
      equipmentStats += "+" + (equipment.stats.autoAttackCooldownReduction * 100) + "% Auto Attack Cooldown Reduction<br />";
    if (equipment.stats.elementalDamageIncrease.holy > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.holy * 100) + "% Holy Damage Bonus<br />";
    if (equipment.stats.elementalDamageIncrease.fire > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.fire * 100) + "% Fire Damage Bonus<br />";
    if (equipment.stats.elementalDamageIncrease.lightning > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.lightning * 100) + "% Lightning Damage Bonus<br />";
    if (equipment.stats.elementalDamageIncrease.water > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.water * 100) + "% Water Damage Bonus<br />";
    if (equipment.stats.elementalDamageIncrease.air > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.air * 100) + "% Air Damage Bonus<br />";
    if (equipment.stats.elementalDamageIncrease.earth > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageIncrease.earth * 100) + "% Earth Damage Bonus<br />";
    if (equipment.stats.elementalDamageResistance.holy > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.holy * 100) + "% Holy Resistance Bonus<br />";
    if (equipment.stats.elementalDamageResistance.fire > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.fire * 100) + "% Fire Resistance Bonus<br />";
    if (equipment.stats.elementalDamageResistance.lightning > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.lightning * 100) + "% Lightning Resistance Bonus<br />";
    if (equipment.stats.elementalDamageResistance.air > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.air * 100) + "% Air Resistance Bonus<br />";
    if (equipment.stats.elementalDamageResistance.water > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.water * 100) + "% Water Resistance Bonus<br />";
    if (equipment.stats.elementalDamageResistance.earth > 0)
      equipmentStats += "+" + (equipment.stats.elementalDamageResistance.earth * 100) + "% Earth Resistance Bonus<br />";

    equipmentStats = this.utilityService.getSanitizedHtml(equipmentStats);

    return equipmentStats;
  }

  getEquipmentEffects(equipment: Equipment | undefined) {
    var equipmentEffects = "";

    if (equipment === undefined)
      return equipmentEffects;

    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      equipmentEffects += "Always Active: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnAutoAttack)
      equipmentEffects += "On Auto Attack: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnAbilityUse)
      equipmentEffects += "On Ability Use: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnHit)
      equipmentEffects += "On Hit: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.TriggersEvery)
      equipmentEffects += "Triggers Over Time: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.ChanceOnAutoAttack)
      equipmentEffects += "Chance on Auto Attack (" + (equipment.equipmentEffect.chance * 100) + "%): ";

    if (equipment.equipmentEffect.targetEffect !== undefined && equipment.equipmentEffect.targetEffect.length > 0) {
      equipment.equipmentEffect.targetEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.DamageOverTime) {
          if (equipment.itemType === ItemsEnum.Venomstrike)
            equipmentEffects += "Poison your target, dealing " + effect.effectiveness + " damage every " + effect.tickFrequency + " seconds for " + effect.duration + " seconds.<br/>";
        }

        if (effect.type === StatusEffectEnum.InstantTrueDamage) {
          if (equipment.itemType === ItemsEnum.SwordOfFlames)
            equipmentEffects += "Blast your target with fire, dealing " + effect.effectiveness + " Fire damage.<br/>";
          else
            equipmentEffects += "Deal an additional " + effect.effectiveness + " damage.<br/>";
        }
      });
    }

    if (equipment.equipmentEffect.userEffect !== undefined && equipment.equipmentEffect.userEffect.length > 0) {
      equipment.equipmentEffect.userEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.Thorns) {
          equipmentEffects += "Deal " + effect.effectiveness + " damage to those who auto attack you. <br/>";
        }

        if (effect.type === StatusEffectEnum.BattleItemDamageUp)
          equipmentEffects += "Increase damage dealt by battle items by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>";

        if (effect.type === StatusEffectEnum.AgilityUp)
          equipmentEffects += "Increase Agility by " + Math.round((effect.effectiveness - 1) * 100) + "% for " + effect.duration + " seconds.<br/>";

        if (effect.type === StatusEffectEnum.ReduceDirectDamage)
          equipmentEffects += "Reduce damage from every direct attack by " + effect.effectiveness + ".<br/>";

        if (effect.type === StatusEffectEnum.Enearth)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Earth element.<br/>";
        if (effect.type === StatusEffectEnum.Enfire)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Fire element.<br/>";
        if (effect.type === StatusEffectEnum.Enholy)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Holy element.<br/>";
        if (effect.type === StatusEffectEnum.Enwater)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Water element.<br/>";
        if (effect.type === StatusEffectEnum.Enair)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Air element.<br/>";
        if (effect.type === StatusEffectEnum.Enlightning)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Lightning element.<br/>";


        if (equipment.itemType === ItemsEnum.FracturedRubyRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Fire damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedTopazRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Holy damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedOpalRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Lightning damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedAquamarineRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Water damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedAmethystRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Air damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedEmeraldRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Earth damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
      });
    }

    equipmentEffects = this.utilityService.getSanitizedHtml(equipmentEffects);

    return equipmentEffects;
  }

  getCharacterColorClass(type: CharacterEnum) {
    return {
      'adventurerColor': type === CharacterEnum.Adventurer,
      'archerColor': type === CharacterEnum.Archer,
      'warriorColor': type === CharacterEnum.Warrior,
      'priestColor': type === CharacterEnum.Priest
    };
  }

  getGodColorClass(type: GodEnum) {
    return {
      'athenaColor': type === GodEnum.Athena,
      'zeusColor': type === GodEnum.Zeus,
      'apolloColor': type === GodEnum.Apollo,
      'aresColor': type === GodEnum.Ares,
      'poseidonColor': type === GodEnum.Poseidon,
      'artemisColor': type === GodEnum.Artemis,
      'hermesColor': type === GodEnum.Hermes,
    };
  }

  getItemImage(type: ItemsEnum) {
    var src = "assets/svg/";

    if (type === ItemsEnum.HealingHerb) {
      src += "healingHerb.svg";
    }
    if (type === ItemsEnum.RestorativeHerb) {
      src += "restorativeHerb.svg";
    }
    if (type === ItemsEnum.ThrowingStone) {
      src += "throwingStone.svg";
    }
    if (type === ItemsEnum.HeftyStone) {
      src += "heftyStone.svg";
    }
    if (type === ItemsEnum.PoisonFang) {
      src += "poisonFang.svg";
    }
    if (type === ItemsEnum.ExplodingPotion) {
      src += "explodingPotion.svg";
    }
    if (type === ItemsEnum.HealingPoultice) {
      src += "healingPoultice.svg";
    }
    if (type === ItemsEnum.HealingSalve) {
      src += "healingSalve.svg";
    }
    if (type === ItemsEnum.FirePotion) {
      src += "firePotion.svg";
    }
    if (type === ItemsEnum.StranglingGasPotion) {
      src += "stranglingGasPotion.svg";
    }
    if (type === ItemsEnum.DebilitatingToxin) {
      src += "debilitatingToxin.svg";
    }
    if (type === ItemsEnum.PoisonousToxin) {
      src += "poisonousToxin.svg";
    }
    if (type === ItemsEnum.HeroicElixir) {
      src += "heroicElixir.svg";
    }
    if (type === ItemsEnum.RejuvenatingElixir) {
      src += "rejuvenatingElixir.svg";
    }
    if (type === ItemsEnum.PoisonExtractPotion) {
      src += "poisonExtractPotion.svg";
    }

    return src;
  }

  getAbilityImage(abilityName: string) {
    var src = "assets/svg/";

    if (abilityName === "Quick Hit") {
      src += "quickHit.svg";
    }
    else if (abilityName === "Thousand Cuts") {
      src += "thousandCuts.svg";
    }
    else if (abilityName === "Sure Shot") {
      src += "bow.svg";
    }
    else if (abilityName === "Pinning Shot") {
      src += "pinningShot.svg";
    }
    else if (abilityName === "Battle Cry") {
      src += "battlecry.svg";
    }
    else if (abilityName === "Shield Slam") {
      src += "shieldSlam.svg";
    }
    else if (abilityName === "Heal") {
      src += "heal.svg";
    }
    else if (abilityName === "Pray") {
      src += "barrier.svg";
    }
    else if (abilityName === "Divine Strike") {
      src += "divineStrike.svg";
    }
    else if (abilityName === "Heavenly Shield") {
      src += "heavenlyShield.svg";
    }
    else if (abilityName === "Blinding Light") {
      src += "blindingLight.svg";
    }
    else if (abilityName === "Wounding Arrow") {
      src += "sureShot.svg";
    }
    else if (abilityName === "Paralyzing Volley") {
      src += "paralyzingVolley.svg";
    }
    else if (abilityName === "Expose Weakness") {
      src += "exposeWeakness.svg";
    }
    else if (abilityName === "Nimble Strike") {
      src += "nimbleStrike.svg";
    }
    else if (abilityName === "Take Flight") {
      src += "takeFlight.svg";
    }
    else if (abilityName === "Special Delivery") {
      src += "specialDelivery.svg";
    }
    else if (abilityName === "Staccato") {
      src += "staccato.svg";
    }
    else if (abilityName === "Fortissimo") {
      src += "fortissimo.svg";
    }
    else if (abilityName === "Coda") {
      src += "coda.svg";
    }
    else
      src += "sword.svg";

    return src;
  }

  getAchievementDescription(type: AchievementTypeEnum) {
    var description = "";

    if (type === AchievementTypeEnum.HundredVictories)
      description = "Reach 100 victories";
    if (type === AchievementTypeEnum.ThousandVictories)
      description = "Reach 500 victories";
    if (type === AchievementTypeEnum.TenThousandVictories)
      description = "Reach 2,500 victories";
    if (type === AchievementTypeEnum.FullHPClear)
      description = "Clear without losing HP";
    if (type === AchievementTypeEnum.TenSecondClear)
      description = "Clear in 10 seconds";
    if (type === AchievementTypeEnum.ThirtySecondClear)
      description = "Clear in 30 seconds";
    if (type === AchievementTypeEnum.Complete)
      description = "Complete Subzone";

    return description;
  }

  addTutorialToLog(type: TutorialTypeEnum) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Tutorials;
    logItem.relevantEnumValue = type;
    logItem.dateReceived = formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    this.globalService.globalVar.logData.push(logItem);
  }

  addStoryToLog(type: TutorialTypeEnum) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Story;
    logItem.relevantEnumValue = type;
    logItem.dateReceived = formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    if (!this.globalService.globalVar.logData.some(item => item.relevantEnumValue === type && item.type === LogViewEnum.Story))
      this.globalService.globalVar.logData.push(logItem);
  }

  addLootToLog(type: ItemsEnum, amount: number) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Loot;
    logItem.relevantEnumValue = type;
    logItem.amount = amount;
    logItem.dateReceived = formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    this.globalService.globalVar.logData.push(logItem);

    var logLengthTotal = 200;
    var currentItemLog = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot);
    if (currentItemLog.length > logLengthTotal) {
      for (var i = currentItemLog.length; i > logLengthTotal; i--) {
        this.globalService.globalVar.logData = this.globalService.globalVar.logData.filter(item => item != currentItemLog[0]);
        currentItemLog = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot);
      }
    }
  }

  getCharacterDps(character: Character, target?: Character) {
    var totalDps = 0;
    var adjustedAttack = this.getAdjustedAttack(character);
    var adjustedDefense = target === undefined ? 0 : this.getAdjustedDefense(target);
    var critChance = this.getDamageCriticalChance(character, target === undefined ? new Character() : target);
    var adjustedCriticalMultiplier = ((1 - critChance)) + (critChance * this.getAdjustedCriticalMultiplier(character));

    if (target === undefined) {
      totalDps += adjustedAttack * adjustedCriticalMultiplier / this.globalService.getAutoAttackTime(character);

      character.abilityList.filter(item => item.isAvailable).forEach(ability => {
        var damageMultiplier = 1;
        var abilityDamageMultiplier = this.getAbilityEffectiveAmount(character, ability);

        if (ability.dealsDirectDamage) {
          var damageMultiplier = 1;

          totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
            (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / ability.cooldown);
        }
      });

    }
    else {
      var damageMultiplier = 1;
      var abilityDamageMultiplier = 1;

      //auto attack
      totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
        (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / this.globalService.getAutoAttackTime(character));

      character.abilityList.filter(item => item.isAvailable).forEach(ability => {
        var damageMultiplier = 1;
        var abilityDamageMultiplier = this.getAbilityEffectiveAmount(character, ability);

        if (ability.dealsDirectDamage) {
          var damageMultiplier = 1;

          totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
            (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / ability.cooldown);
        }
      });

      //console.log ("Total DPS = " + totalDps + " = (" + adjustedAttack + " (2 / 3)) - (" + adjustedDefense + " (2 / 5)) * " + adjustedCriticalMultiplier + ") / " + this.getAutoAttackTime(character));
    }

    return this.utilityService.roundTo(totalDps, 1);
  }

  getPartyDps(party: Character[], target?: Character) {
    var totalDps = 0;

    party.forEach(character => {
      totalDps += this.getCharacterDps(character, target);
    });

    return this.utilityService.roundTo(totalDps, 1);
  }

  getSubzoneExpPerSec(subzoneType: SubZoneEnum) {
    var expPerSecPerEnemyTeam: number[] = [];
    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzoneType);

    enemyOptions.forEach(enemyTeam => {
      var timeToClear = 0;
      var totalXp = 0;
      enemyTeam.enemyList.forEach(enemy => {
        var dpsAgainstEnemy = this.getPartyDps(this.globalService.getActivePartyCharacters(true), enemy);
        var enemyClearTime = enemy.battleStats.maxHp / dpsAgainstEnemy;
        timeToClear += enemyClearTime;
        totalXp += enemy.xpGainFromDefeat;
      });

      expPerSecPerEnemyTeam.push(totalXp / timeToClear);
    });

    return (expPerSecPerEnemyTeam.reduce((a, b) => a + b, 0) / expPerSecPerEnemyTeam.length) || 0;
  }

  characterHasAbility(abilityName: string, character: Character): Ability | undefined {
    var matchingAbility: Ability | undefined = undefined;

    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        if (ability.name === abilityName)
          matchingAbility = ability;
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (ability.name === abilityName)
              matchingAbility = ability;
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (ability.name === abilityName)
              matchingAbility = ability;
          });
      }
    }

    return matchingAbility;
  }

  getMaxHpDescription() {
    return "The amount of damage you can take before being knocked unconscious. If your entire party is unconscious, you must retreat to a town.";
  }

  getAttackDescription() {
    return "Increase auto attack and ability damage.";
  }

  getDefenseDescription() {
    return "Reduce damage taken from enemy attacks.";
  }

  getAgilityDescription(character?: Character) {
    if (character === undefined) {
      return "Increase auto attack damage.";
    }

    var totalAutoAttackCount = this.getTotalAutoAttackCount(character, true, true);
    var description = "Increases the number of times you hit when auto attacking, multiplying auto attack damage by <strong>" + this.utilityService.roundTo(totalAutoAttackCount, 3) + "</strong>.<br/>Agility needed for <strong>" + Math.ceil(totalAutoAttackCount) + "</strong> total hits: <strong>" + this.getAgilityPerAttackForAttackCount(Math.floor(totalAutoAttackCount)) + "</strong>.";
    if (totalAutoAttackCount >= 2)
      description += "On Hit effects occur <strong>" + Math.floor(totalAutoAttackCount) + "</strong> times from auto attacks.";
    return description;
  }

  getLuckDescription(character?: Character) {
    var description = "Increase your chance to deal a critical hit.";

    if (character === undefined)
      return description;

    var latestBallad = new Ballad();
    this.globalService.globalVar.ballads.forEach(item => {
      if (item.isAvailable)
        latestBallad = item;
    });
    var allPossibleEnemies: Enemy[] = [];
    var allPossibleEnemyResistances: number[] = [];
    latestBallad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
        enemyOptions.forEach(option => {
          option.enemyList.forEach(enemy => {
            if (!allPossibleEnemies.some(possibleEnemy => possibleEnemy.bestiaryType === enemy.bestiaryType)) {
              allPossibleEnemies.push(enemy);
              allPossibleEnemyResistances.push(enemy.battleStats.resistance);
            }
          });
        });
      });
    });

    var sum = allPossibleEnemyResistances.reduce((acc, cur) => acc + cur, 0);
    var mean = Math.round(sum / allPossibleEnemyResistances.length);

    description += "<br/>Odds to critically hit an enemy from " + this.balladService.getBalladName(latestBallad.type) + " (Avg " + mean + " Resistance): <strong>" + this.utilityService.roundTo(this.getDamageCriticalChanceByNumbers(character.battleStats.luck, mean) * 100, 2) + "%</strong>" +
      "<br/>Odds to critically hit with a healing spell: <strong>" + this.utilityService.roundTo(this.getHealingCriticalChanceByNumbers(character.battleStats.luck) * 100, 2) + "%</strong>";

    return description;
  }

  getResistanceDescription(character?: Character) {
    var description = "Reduce your chance to be critically hit by enemies.";

    if (character === undefined)
      return description;

    var latestBallad = new Ballad();
    this.globalService.globalVar.ballads.forEach(item => {
      if (item.isAvailable)
        latestBallad = item;
    });
    var allPossibleEnemies: Enemy[] = [];
    var allPossibleEnemyLuck: number[] = [];
    latestBallad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
        enemyOptions.forEach(option => {
          option.enemyList.forEach(enemy => {
            if (!allPossibleEnemies.some(possibleEnemy => possibleEnemy.bestiaryType === enemy.bestiaryType)) {
              allPossibleEnemies.push(enemy);
              allPossibleEnemyLuck.push(enemy.battleStats.luck);
            }
          });
        });
      });
    });

    var sum = allPossibleEnemyLuck.reduce((acc, cur) => acc + cur, 0);
    var mean = Math.round(sum / allPossibleEnemyLuck.length);

    description += "<br/>Odds to be critically hit by an enemy from " + this.balladService.getBalladName(latestBallad.type) + " (Avg " + mean + " Luck): <strong>" + this.utilityService.roundTo(this.getDamageCriticalChanceByNumbers(mean, character.battleStats.resistance) * 100, 2) + "%</strong>";

    return description;
  }

  getHpRegenDescription() {
    return "Amount of HP you gain every 5 seconds.";
  }

  getCriticalMultiplierDescription() {
    return "Increase the amount of damage dealt when dealing a critical hit.";
  }

  getArmorPenetrationDescription() {
    return "Reduce target's defense by this percentage before any attack.";
  }

  getOverdriveGainBonusDescription() {
    return "Increase the amount of overdrive gauge gained from all attacks and being attacked.";
  }

  getHealingReceivedBonusDescription() {
    return "Increase the amount of healing received.";
  }

  getDebuffDurationBonusDescription() {
    return "Increase the duration of any debuff you inflict.";
  }

  getOverdriveGainFromAutoAttacksBonusDescription() {
    return "Increase the amount of overdrive gauge gained from auto attacking.";
  }

  getHealingDoneBonusDescription() {
    return "Increase the amount of healing done.";
  }

  getAbilityCooldownReductionDescription() {
    return "Reduces cooldown for all abilities.";
  }

  getAutoAttackCooldownReductionDescription() {
    return "Reduces cooldown for auto attack.";
  }

  getElementalDamageIncreaseDescription(type?: ElementalTypeEnum, name?: string) {
    var element = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy")
      element = "Holy";
    else if (type === ElementalTypeEnum.Fire || name === "Fire")
      element = "Fire";
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning")
      element = "Lightning";
    else if (type === ElementalTypeEnum.Water || name === "Water")
      element = "Water";
    else if (type === ElementalTypeEnum.Air || name === "Air")
      element = "Air";
    else if (type === ElementalTypeEnum.Earth || name === "Earth")
      element = "Earth";

    return "Increase " + element + " damage dealt.";
  }

  getElementalResistanceIncreaseDescription(type?: ElementalTypeEnum, name?: string) {
    var element = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy")
      element = "Holy";
    else if (type === ElementalTypeEnum.Fire || name === "Fire")
      element = "Fire";
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning")
      element = "Lightning";
    else if (type === ElementalTypeEnum.Water || name === "Water")
      element = "Water";
    else if (type === ElementalTypeEnum.Air || name === "Air")
      element = "Air";
    else if (type === ElementalTypeEnum.Earth || name === "Earth")
      element = "Earth";

    return "Reduce " + element + " damage taken.";
  }

  getGodMaxHpStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.maxHp > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.maxHp) + "<br />";
    if (god.permanentStatGain.maxHp > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.maxHp) + "<br />";

    return breakdown;
  }

  getGodAttackStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.attack > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.attack) + "<br />";
    if (god.permanentStatGain.attack > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.attack) + "<br />";

    return breakdown;
  }

  getGodDefenseStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.defense > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.defense) + "<br />";
    if (god.permanentStatGain.defense > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.defense) + "<br />";

    return breakdown;
  }

  getGodAgilityStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.agility > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.agility) + "<br />";
    if (god.permanentStatGain.agility > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.agility) + "<br />";

    return breakdown;
  }

  getGodLuckStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.luck > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.luck) + "<br />";
    if (god.permanentStatGain.luck > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.luck) + "<br />";

    return breakdown;
  }

  getGodResistanceStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.resistance > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.resistance) + "<br />";
    if (god.permanentStatGain.resistance > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.resistance) + "<br />";

    return breakdown;
  }

  getGodHpRegenStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.hpRegen > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.hpRegen, 2) + "<br />";
    if (god.permanentStatGain.hpRegen > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.hpRegen, 2) + "<br />";

    return breakdown;
  }

  getGodCriticalMultiplierStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.criticalMultiplier > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.criticalMultiplier * 100, 2) + "%<br />";
    if (god.permanentStatGain.criticalMultiplier > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.criticalMultiplier * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodArmorPenetrationStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.armorPenetration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.armorPenetration * 100, 2) + "%<br />";
    if (god.permanentStatGain.armorPenetration > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.armorPenetration * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodOverdriveGainBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.overdriveGain > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.overdriveGain * 100, 2) + "%<br />";
    if (god.permanentStatGain.overdriveGain > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.overdriveGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodHealingReceivedBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.healingReceived > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.healingReceived * 100, 2) + "%<br />";
    if (god.permanentStatGain.healingReceived > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.healingReceived * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodDebuffDurationBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.debuffDuration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.debuffDuration * 100, 2) + "%<br />";
    if (god.permanentStatGain.debuffDuration > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.debuffDuration * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodOverdriveGainFromAutoAttacksBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.overdriveGainFromAutoAttacks > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.overdriveGainFromAutoAttacks * 100, 2) + "%<br />";
    if (god.permanentStatGain.overdriveGainFromAutoAttacks > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.overdriveGainFromAutoAttacks * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodHealingDoneBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.healingDone > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.healingDone * 100, 2) + "%<br />";
    if (god.permanentStatGain.healingDone > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.healingReceived * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodAbilityCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.abilityCooldownReduction, 3) + "<br />";
    if (god.permanentStatGain.abilityCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.abilityCooldownReduction, 3) + "<br />";

    return breakdown;
  }

  getGodAutoAttackCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.autoAttackCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.autoAttackCooldownReduction, 3) + "<br />";
    if (god.permanentStatGain.autoAttackCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.autoAttackCooldownReduction, 3) + "<br />";

    return breakdown;
  }

  getGodElementalDamageIncreaseStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementalDamageIncrease.holy > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.holy * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.holy > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.holy * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementalDamageIncrease.fire > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.fire * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.fire > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.fire * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementalDamageIncrease.lightning > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.lightning * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.lightning * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementalDamageIncrease.water > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.water * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.water > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.water * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementalDamageIncrease.air > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.air * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.air > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.air * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementalDamageIncrease.earth > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageIncrease.earth * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.earth > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageIncrease.earth * 100, 2) + "%<br />";
    }

    return breakdown;
  }

  getGodElementalDamageResistanceStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementalDamageResistance.holy > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.holy * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.holy > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.holy * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementalDamageResistance.fire > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.fire * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.fire > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.fire * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementalDamageResistance.lightning > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.lightning * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.lightning * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementalDamageResistance.water > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.water * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.water > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.water * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementalDamageResistance.air > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.air * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.air > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.air * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementalDamageResistance.earth > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementalDamageResistance.earth * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.earth > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementalDamageResistance.earth * 100, 2) + "%<br />";
    }

    return breakdown;
  }

  getMaxHpStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.maxHp > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.maxHp) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.maxHp + assignedGod1.permanentStatGain.maxHp;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.maxHp + assignedGod2.permanentStatGain.maxHp;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalMaxHpGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalMaxHpGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getMaxHpBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getMaxHpBoostPercent()) + "<br />";

    return breakdown;
  }

  getAttackStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.attack > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.attack) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.attack + assignedGod1.permanentStatGain.attack;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.attack + assignedGod2.permanentStatGain.attack;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalAttackGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalAttackGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getAttackBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getAttackBoostPercent()) + "<br />";

    return breakdown;
  }

  getDefenseStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.defense > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.defense) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.defense + assignedGod1.permanentStatGain.defense;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.defense + assignedGod2.permanentStatGain.defense;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalDefenseGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalDefenseGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getDefenseBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getDefenseBoostPercent()) + "<br />";

    return breakdown;
  }

  getAgilityStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.agility > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.agility) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.agility + assignedGod1.permanentStatGain.agility;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.agility + assignedGod2.permanentStatGain.agility;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalAgilityGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalAgilityGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getAgilityBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getAgilityBoostPercent()) + "<br />";

    return breakdown;
  }

  getLuckStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.luck > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.luck) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.luck + assignedGod1.permanentStatGain.luck;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.luck + assignedGod2.permanentStatGain.luck;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalLuckGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalLuckGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getLuckBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getLuckBoostPercent()) + "<br />";

    return breakdown;
  }

  getResistanceStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.resistance > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.resistance) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.resistance + assignedGod1.permanentStatGain.resistance;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.resistance + assignedGod2.permanentStatGain.resistance;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (character.equipmentSet.getTotalResistanceGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalResistanceGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getResistanceBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getResistanceBoostPercent()) + "<br />";

    return breakdown;
  }

  getHpRegenStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.hpRegen > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(character.baseStats.hpRegen, 2) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.hpRegen + assignedGod1.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.hpRegen + assignedGod2.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    var charmGain = this.charmService.getTotalHpRegenAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain, 2) + "<br />";
    }

    if (character.equipmentSet.getTotalHpRegenGain() > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalHpRegenGain(), 2) + "<br />";
    /*
        if (this.globalService.globalVar.chthonicPowers.getHpRegenBoostPercent() > 0)
          breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getHpRegenBoostPercent())+ "<br />";
    */
    return breakdown;
  }

  getCriticalMultiplierStatBreakdown(character: Character) {
    var breakdown = "";
    var defaultCriticalMultiplier = .25;
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    breakdown += "Base Stat Gain: +" + Math.round((character.baseStats.criticalMultiplier + defaultCriticalMultiplier) * 100) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.criticalMultiplier + assignedGod1.permanentStatGain.criticalMultiplier;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.criticalMultiplier + assignedGod2.permanentStatGain.criticalMultiplier;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    var charmGain = this.charmService.getTotalCriticalMultiplierAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + Math.round(charmGain * 100) + "%<br />";
    }

    if (character.equipmentSet.getTotalCriticalMultiplierGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalCriticalMultiplierGain() * 100) + "%<br />";

    return breakdown;
  }

  getOverdriveGainBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.overdriveGain > 0)
      breakdown += "Base Stat Gain: +" + Math.round((character.baseStats.overdriveGain) * 100) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.overdriveGain + assignedGod1.permanentStatGain.overdriveGain;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.overdriveGain + assignedGod2.permanentStatGain.overdriveGain;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    var charmGain = this.charmService.getTotalOverdriveGainAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + Math.round(charmGain * 100) + "%<br />";
    }

    if (character.equipmentSet.getTotalOverdriveGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalOverdriveGain() * 100) + "%<br />";

    return breakdown;
  }

  getHealingReceivedBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.healingReceived > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.healingReceived) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.healingReceived + assignedGod1.permanentStatGain.healingReceived;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.healingReceived + assignedGod2.permanentStatGain.healingReceived;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalHealingReceivedAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    /*if (character.equipmentSet.getTotalOverdriveGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalOverdriveGain() * 100) + "%<br />";*/

    return breakdown;
  }

  getDebuffDurationBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.debuffDuration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.debuffDuration) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.debuffDuration + assignedGod1.permanentStatGain.debuffDuration;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.debuffDuration + assignedGod2.permanentStatGain.debuffDuration;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalDebuffDurationAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    /*if (character.equipmentSet.getTotalOverdriveGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalOverdriveGain() * 100) + "%<br />";*/

    return breakdown;
  }

  getOverdriveGainFromAutoAttacksBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.overdriveGainFromAutoAttacks > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.overdriveGainFromAutoAttacks) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.overdriveGainFromAutoAttacks + assignedGod1.permanentStatGain.overdriveGainFromAutoAttacks;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.overdriveGainFromAutoAttacks + assignedGod2.permanentStatGain.overdriveGainFromAutoAttacks;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    /*if (character.equipmentSet.getTotalOverdriveGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalOverdriveGain() * 100) + "%<br />";*/

    return breakdown;
  }

  getHealingDoneBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.healingDone > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.healingDone) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.healingDone + assignedGod1.permanentStatGain.healingDone;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.healingDone + assignedGod2.permanentStatGain.healingDone;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalHealingDoneAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    /*if (character.equipmentSet.getTotalOverdriveGain() > 0)
      breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalOverdriveGain() * 100) + "%<br />";*/

    return breakdown;
  }

  getArmorPenetrationStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.armorPenetration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.armorPenetration) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.armorPenetration + assignedGod1.permanentStatGain.armorPenetration;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.armorPenetration + assignedGod2.permanentStatGain.armorPenetration;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalArmorPenetrationAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    if (character.equipmentSet.getTotalArmorPenetrationGain() > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalArmorPenetrationGain() * 100, 2) + "%<br />";

    return breakdown;
  }

  getAbilityCooldownReductionStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.abilityCooldownReduction * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.abilityCooldownReduction + assignedGod1.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.abilityCooldownReduction + assignedGod2.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAbilityCooldownReductionAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    if (character.equipmentSet.getTotalAbilityCooldownReductionGain() > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(character.equipmentSet.getTotalAbilityCooldownReductionGain() * 100, 2) + "%<br />";

    /*

    if (this.globalService.globalVar.chthonicPowers.getAbilityCooldownReductionBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getAbilityCooldownReductionBoostPercent())+ "<br />";
*/
    return breakdown;
  }

  getAutoAttackCooldownReductionStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.autoAttackCooldownReduction > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.autoAttackCooldownReduction * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.autoAttackCooldownReduction + assignedGod1.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.autoAttackCooldownReduction + assignedGod2.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAutoAttackCooldownReductionAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    if (character.equipmentSet.getTotalAutoAttackCooldownReductionGain() > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(character.equipmentSet.getTotalAutoAttackCooldownReductionGain() * 100, 2) + "%<br />";

    /*
    if (this.globalService.globalVar.chthonicPowers.getAutoAttackCooldownReductionBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getAutoAttackCooldownReductionBoostPercent())+ "<br />";
*/
    return breakdown;
  }

  getElementalDamageIncreaseStatBreakdown(character: Character, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.holy + assignedGod1.permanentStatGain.elementalDamageIncrease.holy;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.holy + assignedGod2.permanentStatGain.elementalDamageIncrease.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalHolyDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalHolyDamageIncreaseGain() * 100) + "%<br />";

      var charmGain = this.charmService.getTotalHolyDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.fire + assignedGod1.permanentStatGain.elementalDamageIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.fire + assignedGod2.permanentStatGain.elementalDamageIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalFireDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalFireDamageIncreaseGain() * 100) + "%<br />";

      var charmGain = this.charmService.getTotalFireDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.lightning + assignedGod1.permanentStatGain.elementalDamageIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.lightning + assignedGod2.permanentStatGain.elementalDamageIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalLightningDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalLightningDamageIncreaseGain() * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalLightningDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.water + assignedGod1.permanentStatGain.elementalDamageIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.water + assignedGod2.permanentStatGain.elementalDamageIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalWaterDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalWaterDamageIncreaseGain() * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalWaterDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.air + assignedGod1.permanentStatGain.elementalDamageIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.air + assignedGod2.permanentStatGain.elementalDamageIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalAirDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalAirDamageIncreaseGain() * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalAirDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.earth + assignedGod1.permanentStatGain.elementalDamageIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.earth + assignedGod2.permanentStatGain.elementalDamageIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalEarthDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalEarthDamageIncreaseGain() * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalEarthDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }

    return breakdown;
  }

  getElementalDamageResistanceStatBreakdown(character: Character, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.holy + assignedGod1.permanentStatGain.elementalDamageResistance.holy;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.holy + assignedGod2.permanentStatGain.elementalDamageResistance.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalHolyDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalHolyDamageResistanceGain() * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalHolyDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.fire + assignedGod1.permanentStatGain.elementalDamageResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.fire + assignedGod2.permanentStatGain.elementalDamageResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalFireDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalFireDamageResistanceGain() * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalFireDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + Math.round(charmGain * 100) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.lightning + assignedGod1.permanentStatGain.elementalDamageResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.lightning + assignedGod2.permanentStatGain.elementalDamageResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalLightningDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalLightningDamageResistanceGain() * 100) + "%<br />";


      var charmGain = this.charmService.getTotalLightningDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + Math.round(charmGain * 100) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.water + assignedGod1.permanentStatGain.elementalDamageResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.water + assignedGod2.permanentStatGain.elementalDamageResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalWaterDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalWaterDamageResistanceGain() * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalWaterDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.air + assignedGod1.permanentStatGain.elementalDamageResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.air + assignedGod2.permanentStatGain.elementalDamageResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalAirDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalAirDamageResistanceGain() * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalAirDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.earth + assignedGod1.permanentStatGain.elementalDamageResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.earth + assignedGod2.permanentStatGain.elementalDamageResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (character.equipmentSet.getTotalEarthDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(character.equipmentSet.getTotalEarthDamageResistanceGain() * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalEarthDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }

    return breakdown;
  }

  isSubzoneATown(subzoneEnum: SubZoneEnum) {
    if (subzoneEnum === SubZoneEnum.DodonaDelphi || subzoneEnum === SubZoneEnum.DodonaArta || subzoneEnum === SubZoneEnum.AsphodelPalaceOfHades ||
      subzoneEnum === SubZoneEnum.AsphodelLostHaven || subzoneEnum === SubZoneEnum.ElysiumColiseum || subzoneEnum === SubZoneEnum.PeloposNisosTravelPost
      || subzoneEnum === SubZoneEnum.CalydonTownMarket)
      return true;

    return false;
  }

  isSubzoneInZone(subzoneEnum: SubZoneEnum, zoneEnum: ZoneEnum) {
    var inZone = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type.toString() === zoneEnum.toString()) {
          zone.subzones.forEach(subzone => {
            if (subzone.type === subzoneEnum)
              inZone = true;
          });
        }
      });
    });

    return inZone;
  }

  getRandomGodEnum(noRepeatingAltars: boolean = false) {
    var availableEnums: GodEnum[] = [];

    this.globalService.globalVar.gods.forEach(god => {
      if (god.isAvailable && (!noRepeatingAltars || (noRepeatingAltars &&
        (this.globalService.globalVar.altars.altar1 === undefined || this.globalService.globalVar.altars.altar1.god !== god.type) &&
        (this.globalService.globalVar.altars.altar2 === undefined || this.globalService.globalVar.altars.altar2.god !== god.type) &&
        (this.globalService.globalVar.altars.altar3 === undefined || this.globalService.globalVar.altars.altar3.god !== god.type))))
        availableEnums.push(god.type);
    });

    var rng = this.utilityService.getRandomInteger(0, availableEnums.length - 1);

    return availableEnums[rng];
  }

  //seeded by time
  getPreferredGod() {
    var availableEnums: GodEnum[] = [];

    this.globalService.globalVar.gods.filter(item => item.isAvailable).forEach(god => {
      availableEnums.push(god.type);
    });

    var date = new Date();
    var dayBreakpoint = 1; //between 4:00 AM and 11:59 AM

    if (date.getHours() >= this.utilityService.preferredGodStartTime2 && date.getHours() < this.utilityService.preferredGodEndTime2) //between 12 PM and 7:59 PM
      dayBreakpoint = 2;
    else if (date.getHours() >= this.utilityService.preferredGodStartTime3 || date.getHours() < this.utilityService.preferredGodEndTime3) //between 8 PM and 3:59 AM
      dayBreakpoint = 3;

    var seedValue = date.getDay() + date.getMonth() + date.getFullYear() + dayBreakpoint;

    var rng = this.utilityService.getRandomSeededInteger(0, availableEnums.length - 1, seedValue.toString());

    return availableEnums[rng];
  }

  getAffinityRewardForLevel(level: number) {
    var reward: AffinityLevelRewardEnum = AffinityLevelRewardEnum.None;

    if (level % 8 === 0)
      reward = AffinityLevelRewardEnum.LargeCharm;
    else if (level % 4 === 0)
      reward = AffinityLevelRewardEnum.SmallCharm;
    else if (level % 4 === 1)
      reward = AffinityLevelRewardEnum.PrayerDuration;
    else if (level % 4 === 2)
      reward = AffinityLevelRewardEnum.PrayerEffectiveness;
    else if (level % 4 === 3)
      reward = AffinityLevelRewardEnum.GodXp;

    return reward;
  }

  getAltarEffectWithEffect(effect: AltarEffectsEnum) {
    if (this.globalService.globalVar.altars.activeAltarEffect1 !== undefined &&
      this.globalService.globalVar.altars.activeAltarEffect1.type === effect)
      return this.globalService.globalVar.altars.activeAltarEffect1;

    if (this.globalService.globalVar.altars.activeAltarEffect2 !== undefined &&
      this.globalService.globalVar.altars.activeAltarEffect2.type === effect)
      return this.globalService.globalVar.altars.activeAltarEffect2;

    if (this.globalService.globalVar.altars.activeAltarEffect3 !== undefined &&
      this.globalService.globalVar.altars.activeAltarEffect3.type === effect)
      return this.globalService.globalVar.altars.activeAltarEffect3;

    return undefined;
  }
}
