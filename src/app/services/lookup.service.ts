import { Injectable } from '@angular/core';
import { StatusEffect } from '../models/battle/status-effect.model';
import { Ability } from '../models/character/ability.model';
import { CharacterStats } from '../models/character/character-stats.model';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { God } from '../models/character/god.model';
import { OverdriveInfo } from '../models/character/overdrive-info.model';
import { AchievementTypeEnum } from '../models/enums/achievement-type-enum.copy';
import { AlchemyActionsEnum } from '../models/enums/alchemy-actions-enum.model';
import { CharacterEnum } from '../models/enums/character-enum.model';
import { DamageOverTimeTypeEnum } from '../models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from '../models/enums/effect-trigger-enum.model';
import { ElementalTypeEnum } from '../models/enums/elemental-type-enum.model';
import { EquipmentQualityEnum } from '../models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from '../models/enums/equipment-type-enum.model';
import { GodEnum } from '../models/enums/god-enum.model';
import { ItemTypeEnum } from '../models/enums/item-type-enum.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { OverdriveNameEnum } from '../models/enums/overdrive-name-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { SubZoneEnum } from '../models/enums/sub-zone-enum.model';
import { WeaponTypeEnum } from '../models/enums/weapon-type-enum.model';
import { Achievement } from '../models/global/achievement.model';
import { Equipment } from '../models/resources/equipment.model';
import { ResourceValue } from '../models/resources/resource-value.model';
import { UsableItemEffect } from '../models/resources/usable-item-effect.model';
import { SubZone } from '../models/zone/sub-zone.model';
import { GlobalService } from './global/global.service';
import { SubZoneGeneratorService } from './sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from './utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  isUIHidden = false;

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService) { }

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

  getAlchemyActionName(action: AlchemyActionsEnum) {
    var name = "";

    if (action === AlchemyActionsEnum.PrepareWaterSmallPot)
      name = "Boiling Water in a Small Pot";
    if (action === AlchemyActionsEnum.StrainMixture)
      name = "Straining Mixture";
    if (action === AlchemyActionsEnum.CombineIngredients)
      name = "Combining Ingredients in Pot";
    if (action === AlchemyActionsEnum.MeltWax)
      name = "Melting Wax";
    if (action === AlchemyActionsEnum.MixOil)
      name = "Mixing Oil";

    return name;
  }

  getItemTypeFromItemEnum(type: ItemsEnum) {
    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice || type === ItemsEnum.HealingSalve) {
      return ItemTypeEnum.HealingItem;
    }

    if (type === ItemsEnum.ThrowingStone || type === ItemsEnum.PoisonFang) {
      return ItemTypeEnum.BattleItem;
    }

    if (type === ItemsEnum.EagleFeather || type === ItemsEnum.LamiaHeart || type === ItemsEnum.Leather || type === ItemsEnum.LightLeather ||
      type === ItemsEnum.PetrifiedBark || type === ItemsEnum.SmallFeather) {
      return ItemTypeEnum.CraftingMaterial;
    }

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

    //battle items
    else if (type === ItemsEnum.ThrowingStone)
      name = "Throwing Stone";
    else if (type === ItemsEnum.PoisonFang)
      name = "Poison Fang";
    else if (type === ItemsEnum.PoisonousToxin)
      name = "Poisonous Toxin";
    else if (type === ItemsEnum.DebilitatingToxin)
      name = "Debilitating Toxin";

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

    //shields
    else if (type === ItemsEnum.IronShield)
      name = "Iron Shield";
    else if (type === ItemsEnum.BronzeShield)
      name = "Bronze Shield";
    else if (type === ItemsEnum.Aegis)
      name = "Aegis";

    //necklaces
    else if (type === ItemsEnum.ForgottenLocket)
      name = "Forgotten Locket";

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

    return name;
  }

  getItemDescription(type: ItemsEnum): string {
    var name = "";
    var effect = this.getBattleItemEffect(type);

    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;

    if (effect !== undefined) {

      var relatedUserGainStatusEffect = effect?.userGainsStatusEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = effect?.targetGainsStatusEffect[0];

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

    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice)
      name = "Heal a party member for " + effect.healAmount + " HP.";

    //battle items
    else if (type === ItemsEnum.ThrowingStone)
      name = "Deal " + effect.trueDamageAmount + " damage to a target.";
    else if (type === ItemsEnum.PoisonFang)
      name = "Poison an enemy, dealing " + relatedTargetGainStatusEffectEffectiveness + " every " + relatedTargetGainStatusEffectTickFrequency + " seconds for " + relatedTargetGainStatusEffectDuration + " seconds.";

    //resources
    else if (type === ItemsEnum.Coin)
      name = "Use to trade with merchants.";

    //progression
    else if (type === ItemsEnum.ChthonicFavor)
      name = "Increase Chthonic Power gain by " + (this.getChthonicFavorMultiplier() * 100).toFixed(0) + "%.";
    else if (type === ItemsEnum.ChthonicPower)
      name = "Spend on permanent stat boosts.";

    //equipment
    else if (this.getEquipmentPieceByItemType(type) !== undefined) {
      name = this.getEquipmentStats(this.getEquipmentPieceByItemType(type)) + "<br/><br/>" + this.getEquipmentEffects(this.getEquipmentPieceByItemType(type));
    }

    return name;
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
      equipmentPiece.stats = new CharacterStats(0, 5, 0, 3, 0, 0);
    }
    if (type === ItemsEnum.BronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 10, 0, 6, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 15, 0, 9, 0, 0);
    }
    if (type === ItemsEnum.SteelSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 20, 0, 12, 0, 0);
    }
    if (type === ItemsEnum.GoldenSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 40, 0, 24, 0, 0);
    }

    //hammers
    if (type === ItemsEnum.IronHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 9, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 18, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 27, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 36, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.DiamondHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 72, 0, 0, 0, 0);
    }

    //bows
    if (type === ItemsEnum.ShortBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 6, 0, 0, 5, 0);
    }
    if (type === ItemsEnum.LongBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 12, 0, 0, 10, 0);
    }
    if (type === ItemsEnum.Venomstrike) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 18, 0, 0, 15, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .25;
      equipmentPiece.equipmentEffect.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(6, 3, 15, "Venomstrike", DamageOverTimeTypeEnum.TrueDamage));
    }
    if (type === ItemsEnum.Wolfsbane) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 24, 0, 0, 20, 0);
    }
    if (type === ItemsEnum.EagleEye) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 40, 0, 0, 50, 0);
    }

    //shields
    if (type === ItemsEnum.IronShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(0, 0, 8, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(0, 0, 16, 0, 0, 0);
    }
    if (type === ItemsEnum.Aegis) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(0, 0, 25, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userGainsStatusEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 3, false, true, false, type.toString()));
    }

    //armor
    if (type === ItemsEnum.LinenArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(25, 0, 2, 0, 0, 0);
    }
    if (type === ItemsEnum.IronArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(60, 0, 3, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(120, 0, 6, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(180, 0, 10, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(400, 0, 15, 0, 0, 0);
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 5, 5, 5, 5, 5);
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

  getAutoAttackDescription(character: Character) {
    var description = "";
    var secondsPerAutoAttack = character.battleInfo.timeToAutoAttack; //this.getAutoAttackTime(character).toFixed(3);
    var totalAutoAttackCount = this.getTotalAutoAttackCount(character);

    description = "Deal <strong>" + this.getAdjustedAttack(character).toFixed(0) + "</strong> damage to a single target " + totalAutoAttackCount.toFixed(3) + (totalAutoAttackCount === 1 ? " time" : " times") + " every <strong>" + secondsPerAutoAttack + "</strong> seconds.";

    /*if (character.battleInfo.fastAutoAttackCount > 0)
      description += " Additionally, deal <strong>" + this.getAdjustedAttack(character).toFixed(0) + "</strong> damage to a single target " + character.battleInfo.fastAutoAttackCount + (character.battleInfo.fastAutoAttackCount === 1 ? "time" : "times") + " every <strong>" + (character.battleInfo.timeToAutoAttack / 2) + "</strong> seconds.";*/

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

    if (type === OverdriveNameEnum.HeavyAttack)
      name = "Heavy Attack";
    if (type === OverdriveNameEnum.Smash)
      name = "Smash";
    if (type === OverdriveNameEnum.Speed)
      name = "Speed";

    return name;
  }

  getOverdriveDescription(type: OverdriveNameEnum) {
    var description = "";

    if (type === OverdriveNameEnum.HeavyAttack) {
      description = "Your next auto attack deals <strong>300% Attack</strong> damage.";
    }
    if (type === OverdriveNameEnum.Smash) {
      description = "Your next auto attack deals <strong>500% Attack</strong> damage.";
    }

    return description;
  }

  getOverdriveUnlockCondition(type: OverdriveNameEnum) {
    var description = "???";

    if (type === OverdriveNameEnum.Smash) {
      description = "Reach character level 20.";
    }

    return description;
  }

  setOverdrive(character: Character, type: OverdriveNameEnum) {
    character.overdriveInfo = this.getOverdriveInfo(type);
  }

  getOverdriveInfo(type: OverdriveNameEnum) {
    var overdriveInfo = new OverdriveInfo();

    overdriveInfo.selectedOverdrive = type;

    if (type === OverdriveNameEnum.HeavyAttack) {
      overdriveInfo.overdriveGaugeTotal = 100;
    }
    if (type === OverdriveNameEnum.Smash) {
      overdriveInfo.overdriveGaugeTotal = 140;
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
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = Math.round((ability.effectiveness - 1) * 100);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = ability.cooldown;

      var relatedUserGainStatusEffect = ability?.userGainsStatusEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = ability?.targetGainsStatusEffect[0];

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

    //Adventurer
    if (abilityName === "Quick Hit")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Barrage")
      abilityDescription = "Every <strong>" + this.utilityService.ordinalSuffixOf(abilityCount) + "</strong> auto attack hits all additional enemies for <strong>" + (ability !== undefined ? (ability!.effectiveness * 100).toString() : "") + "%</strong> of the damage dealt. Passive.";
    if (abilityName === "Thousand Cuts")
      abilityDescription = "For <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds, deal an additional <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> damage after each auto attack or ability. " + cooldown + " second cooldown.";

    //Archer
    if (abilityName === "Sure Shot")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Mark")
      abilityDescription = "When an enemy has a status effect that you have applied, they also have Mark. Mark increases damage taken by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong>. Passive.";
    if (abilityName === "Pinning Shot")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. Stun the target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Warrior
    if (abilityName === "Battle Cry")
      abilityDescription = "Draw all targets' focus for the next <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds, forcing all attacks to target you. " + cooldown + " second cooldown.";
    if (abilityName === "Last Stand")
      abilityDescription = "When HP drops below <strong>" + thresholdAmountPercent + "%</strong>, increase Defense by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Shield Slam")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. Deals increased damage based on defense. " + cooldown + " second cooldown.";

    //Priest
    if (abilityName === "Heal")
      abilityDescription = "Heal a party member for <strong>" + effectiveAmount.toFixed(0) + "</strong> HP. Targets the party member with the lowest HP %. " + cooldown + " second cooldown.";
    if (abilityName === "Faith")
      abilityDescription = "God abilities for all characters are more effective by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Pray")
      abilityDescription = "Grant all characters a <strong>" + effectiveAmount.toFixed(0) + "</strong> HP Shield, up to <strong>" + thresholdAmountPercent + "%</strong> of their total health. " + cooldown + " second cooldown.";

    return this.utilityService.getSanitizedHtml(abilityDescription);
  }

  getGodAbilityDescription(abilityName: string, character: Character, ability?: Ability) {
    var abilityDescription = "";
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
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = Math.round((ability.effectiveness - 1) * 100);
      secondaryEffectiveAmount = ability.secondaryEffectiveness;
      secondaryEffectiveAmountPercent = Math.round((secondaryEffectiveAmount - 1) * 100);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = ability.cooldown;

      var relatedUserGainStatusEffect = ability?.userGainsStatusEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = ability?.targetGainsStatusEffect[0];

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
      abilityDescription = "After using an ability, your next auto attack heals for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. Passive.";
    if (abilityName === "Divine Strike")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    if (abilityName === "Heavenly Shield")
      abilityDescription = "Reduce damage taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Blinding Light")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage to all targets. Blind them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Artemis
    if (abilityName === "True Shot")
      abilityDescription = "If your target has a negative status effect, increase critical strike chance by <strong>" + effectiveAmountPercent + "%</strong> when attacking. Passive.";
    if (abilityName === "Wounding Arrow")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage to a target and reduce their attack by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Paralyzing Volley")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage to all targets and paralyze them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Expose Weakness")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. Any negative status effects on the target have their duration increased by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the original duration. " + cooldown + " second cooldown.";

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
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + " </strong>damage. " + cooldown + " second cooldown.";
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
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> Lightning damage. Grants user Surge. " + cooldown + " second cooldown.";
    if (abilityName === "Chain Lightning")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> Lightning damage. Deal 25% less damage to another random target. Repeat until all targets have been hit. " + cooldown + " second cooldown.";
    if (abilityName === "Judgment")
      abilityDescription = "Deal <strong>" + effectiveAmount.toFixed(0) + "</strong> damage. " + cooldown + " second cooldown.";

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

    //why is euryale debuff reducing by -600%?
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
      description = "Avoid all auto attacks and abilities.";
    if (statusEffect.type === StatusEffectEnum.InstantHealAfterAutoAttack)
      description = "Your next auto attack will also heal you for " + Math.round((statusEffect.effectiveness) * 100) + "% of the damage dealt.";
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

    return resource.amount;
  }

  useResource(type: ItemsEnum, amount: number) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type);
    if (resource === undefined)
      return;

    resource.amount -= amount;

    if (resource.amount < 0)
      resource.amount = 0;
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
    if (item === ItemsEnum.ThrowingStone) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 3;
    }
    if (item === ItemsEnum.PoisonFang) {
      itemEffect.dealsDamage = true;
      itemEffect.targetGainsStatusEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, 10, "Poison Fang", DamageOverTimeTypeEnum.TrueDamage));
    }

    return itemEffect;
  }

  getTotalAutoAttackCount(character: Character) {
    var adjustedAgility = this.getAdjustedAgility(character);
    var agilityPerAdditionalAttack = 250;

    return 1 + (adjustedAgility / agilityPerAdditionalAttack);
  }

  getAutoAttackTime(character: Character) {
    character.battleInfo.fastAutoAttackCount = 0;
    var timeToAutoAttack = character.battleInfo.timeToAutoAttack;
    var adjustedAgility = this.getAdjustedAgility(character);
    var attackCap = 100;
    var attackCount = 0;

    //120 * (log(.00035 * x + 1))      
    var amplifier = 120;
    var horizontalStretch = .00035;
    var horizontalPosition = 1;
    var timerReduction = amplifier * Math.log10(horizontalStretch * (adjustedAgility) + horizontalPosition);

    //can return .1 or 100
    //against 5s let's say
    while (attackCount < attackCap && timerReduction > 0) {
      timeToAutoAttack = character.battleInfo.timeToAutoAttack;

      //if it goes below half way, needs to break point and start over          
      if (timerReduction > character.battleInfo.timeToAutoAttack / 2) {
        timerReduction -= character.battleInfo.timeToAutoAttack / 2;
        character.battleInfo.fastAutoAttackCount += 1;
      }
      else {
        timeToAutoAttack -= timerReduction;
        timerReduction = 0;
      }
    }

    return timeToAutoAttack;
  }

  getDamageCriticalChance(attacker: Character, target: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    var targetResistance = this.getAdjustedResistance(target);

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
    /*var difference = attackerLuck - targetResistance;

    if (difference > 0) {
      var amplifier = 50;
      var horizontalStretch = .05;
      var horizontalPosition = 5;

      //50 * (log(.05 * x + 5))      
      criticalChance = (amplifier * Math.log10(horizontalStretch * (difference) + horizontalPosition) / 100);
    }*/

    var trueShot = this.characterHasAbility("True Shot", attacker);
    if (trueShot !== undefined && target.battleInfo.statusEffects.some(effect => !effect.isPositive)) {
      criticalChance *= trueShot.effectiveness;
    }

    return criticalChance;
  }

  getHealingCriticalChance(attacker: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);

    var amplifier = 20;
    var horizontalStretch = .05;
    var horizontalPosition = 5;

    //500 * (log(.0035 * 10 + 1)) + 50      
    criticalChance = (amplifier * Math.log10(horizontalStretch * (attackerLuck) + horizontalPosition) / 100);

    return criticalChance;
  }

  getAdjustedMaxHp(character: Character) {
    var maxHp = character.battleStats.maxHp;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.MaxHpUp ||
        effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.MaxHpUp || effect.type === StatusEffectEnum.MaxHpDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            maxHp *= effect.effectiveness;
          }
        });
      }
    }

    return maxHp;
  }

  getAdjustedAgility(character: Character) {
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

    return agility;
  }

  getAdjustedLuck(character: Character) {
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

    return luck;
  }

  getAdjustedResistance(character: Character) {
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

    return resistance;
  }

  getAdjustedAttack(character: Character, ability?: Ability) {
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


    if (ability !== undefined && ability.name === "Shield Slam") {
      attack += this.getAdjustedDefense(character) * ability.secondaryEffectiveness;
    }

    return attack;
  }

  getAdjustedDefense(character: Character) {
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

    var lastStand = character.abilityList.find(item => item.name === "Last Stand" && item.isAvailable);
    if (lastStand !== undefined && character.battleStats.getHpPercent() <= lastStand.threshold) {
      defense *= lastStand.effectiveness;
    }

    return defense;
  }

  getAbilityCooldown(ability: Ability, character: Character) {
    return ability.cooldown - character.battleStats.abilityCooldownReduction;
  }

  getAutoAttackCooldown(character: Character) {
    return character.battleInfo.timeToAutoAttack - character.battleStats.autoAttackCooldownReduction;
  }

  getAdjustedCriticalMultiplier(character: Character) {
    var defaultMultiplier = 1.25;
    return defaultMultiplier + character.battleStats.criticalMultiplier;
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

    if (equipment.stats.attack > 0)
      equipmentStats += "+" + equipment.stats.attack.toString() + " Attack<br />";
    if (equipment.stats.defense > 0)
      equipmentStats += "+" + equipment.stats.defense + " Defense<br />";
    if (equipment.stats.maxHp > 0)
      equipmentStats += "+" + equipment.stats.maxHp + " Max HP<br />";
    if (equipment.stats.agility > 0)
      equipmentStats += "+" + equipment.stats.agility + " Agility<br />";
    if (equipment.stats.luck > 0)
      equipmentStats += "+" + equipment.stats.luck + " Luck<br />";
    if (equipment.stats.resistance > 0)
      equipmentStats += "+" + equipment.stats.resistance + " Resistance<br />";

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
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.ChanceOnAutoAttack)
      equipmentEffects += "Chance on Auto Attack (" + (equipment.equipmentEffect.chance * 100) + "%): ";

    if (equipment.equipmentEffect.targetGainsStatusEffect !== undefined && equipment.equipmentEffect.targetGainsStatusEffect.length > 0) {
      equipment.equipmentEffect.targetGainsStatusEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.DamageOverTime) {
          if (equipment.itemType === ItemsEnum.Venomstrike)
            equipmentEffects += "Poison your target, dealing " + effect.effectiveness + " damage every " + effect.tickFrequency + " seconds for " + effect.duration + " seconds.<br/>";
        }
      });
    }

    if (equipment.equipmentEffect.userGainsStatusEffect !== undefined && equipment.equipmentEffect.userGainsStatusEffect.length > 0) {
      equipment.equipmentEffect.userGainsStatusEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.Thorns) {
          equipmentEffects += "Deal 3 damage to those who auto attack you. <br/>";
        }
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
    if (type === ItemsEnum.ThrowingStone) {
      src += "throwingStone.svg";
    }
    if (type === ItemsEnum.PoisonFang) {
      src += "poisonFang.svg";
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
      description = "Reach 1,000 victories";
    if (type === AchievementTypeEnum.TenThousandVictories)
      description = "Reach 10,000 victories";
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

  getCharacterDps(character: Character, target?: Character) {
    var totalDps = 0;
    var adjustedAttack = this.getAdjustedAttack(character);
    var adjustedDefense = target === undefined ? 0 : this.getAdjustedDefense(target);
    var critChance = this.getDamageCriticalChance(character, target === undefined ? new Character() : target);
    var adjustedCriticalMultiplier = ((1 - critChance)) + (critChance * this.getAdjustedCriticalMultiplier(character));

    if (target === undefined) {
      totalDps += adjustedAttack * adjustedCriticalMultiplier / this.getAutoAttackTime(character);

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
        (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / this.getAutoAttackTime(character));

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

  getAgilityDescription() {
    return "Increase the number of auto attacks you complete per cycle.";
  }

  getLuckDescription() {
    return "Increase your chance to deal a critical hit.";
  }

  getResistanceDescription() {
    return "Reduce your chance to be critically hit by enemies.";
  }

  getHpRegenDescription() {
    return "Amount of HP you gain every 5 seconds.";
  }

  getCriticalMultiplierDescription() {
    return "Increase the amount of damage dealt when dealing a critical hit.";
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
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.hpRegen) + "<br />";
    if (god.permanentStatGain.hpRegen > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.hpRegen) + "<br />";

    return breakdown;
  }

  getGodCriticalMultiplierStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.criticalMultiplier > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.criticalMultiplier * 100) + "%<br />";
    if (god.permanentStatGain.criticalMultiplier > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.criticalMultiplier * 100) + "%<br />";

    return breakdown;
  }

  getGodAbilityCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.abilityCooldownReduction, 2) + "<br />";
    if (god.permanentStatGain.abilityCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.abilityCooldownReduction, 2) + "<br />";

    return breakdown;
  }

  getGodAutoAttackCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.autoAttackCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.autoAttackCooldownReduction, 2) + "<br />";
    if (god.permanentStatGain.autoAttackCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.autoAttackCooldownReduction, 2) + "<br />";

    return breakdown;
  }

  getGodElementalDamageIncreaseStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementalDamageIncrease.holy > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.holy * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.holy > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.holy * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementalDamageIncrease.fire > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.fire * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.fire > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.fire * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementalDamageIncrease.lightning > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.lightning * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.lightning * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementalDamageIncrease.water > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.water * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.water > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.water * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementalDamageIncrease.air > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.air * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.air > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.air * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementalDamageIncrease.earth > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageIncrease.earth * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageIncrease.earth > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageIncrease.earth * 100) + "%<br />";
    }

    return breakdown;
  }

  getGodElementalDamageResistanceStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementalDamageResistance.holy > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.holy * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.holy > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.holy * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementalDamageResistance.fire > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.fire * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.fire > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.fire * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementalDamageResistance.lightning > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.lightning * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.lightning * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementalDamageResistance.water > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.water * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.water > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.water * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementalDamageResistance.air > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.air * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.air > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.air * 100) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementalDamageResistance.earth > 0)
        breakdown += "Base Stat Gain: +" + (god.statGain.elementalDamageResistance.earth * 100) + "%<br />";
      if (god.permanentStatGain.elementalDamageResistance.earth > 0)
        breakdown += "Permanent Stat Gain: +" + (god.permanentStatGain.elementalDamageResistance.earth * 100) + "%<br />";
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
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.hpRegen) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.hpRegen + assignedGod1.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.hpRegen + assignedGod2.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    /*if (character.equipmentSet.getTotalHpRegenGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalHpRegenGain() + "<br />";

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

    /*if (character.equipmentSet.getTotalCriticalMultiplierGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalCriticalMultiplierGain() + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getCriticalMultiplierBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getCriticalMultiplierBoostPercent())+ "<br />";
*/
    return breakdown;
  }

  getAbilityCooldownReductionStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(character.baseStats.abilityCooldownReduction, 2) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.abilityCooldownReduction + assignedGod1.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.abilityCooldownReduction + assignedGod2.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    /*if (character.equipmentSet.getTotalAbilityCooldownReductionGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalAbilityCooldownReductionGain() + "<br />";

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
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(character.baseStats.autoAttackCooldownReduction, 2) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.autoAttackCooldownReduction + assignedGod1.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.autoAttackCooldownReduction + assignedGod2.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    /*if (character.equipmentSet.getTotalAutoAttackCooldownReductionGain() > 0)
      breakdown += "Equipment: +" + character.equipmentSet.getTotalAutoAttackCooldownReductionGain() + "<br />";

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
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.holy + assignedGod2.permanentStatGain.elementalDamageIncrease.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalHolyDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalHolyDamageIncreaseGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.fire + assignedGod1.permanentStatGain.elementalDamageIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.fire + assignedGod2.permanentStatGain.elementalDamageIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalFireDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalFireDamageIncreaseGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.lightning + assignedGod1.permanentStatGain.elementalDamageIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.lightning + assignedGod2.permanentStatGain.elementalDamageIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalLightningDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalLightningDamageIncreaseGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.water + assignedGod1.permanentStatGain.elementalDamageIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.water + assignedGod2.permanentStatGain.elementalDamageIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalWaterDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalWaterDamageIncreaseGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.air + assignedGod1.permanentStatGain.elementalDamageIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.air + assignedGod2.permanentStatGain.elementalDamageIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalAirDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalAirDamageIncreaseGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageIncrease.earth + assignedGod1.permanentStatGain.elementalDamageIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageIncrease.earth + assignedGod2.permanentStatGain.elementalDamageIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalEarthDamageIncreaseGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalEarthDamageIncreaseGain() * 100) + "%<br />"
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
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.holy + assignedGod2.permanentStatGain.elementalDamageResistance.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalHolyDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalHolyDamageResistanceGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.fire + assignedGod1.permanentStatGain.elementalDamageResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.fire + assignedGod2.permanentStatGain.elementalDamageResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalFireDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalFireDamageResistanceGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.lightning + assignedGod1.permanentStatGain.elementalDamageResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.lightning + assignedGod2.permanentStatGain.elementalDamageResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalLightningDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalLightningDamageResistanceGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.water + assignedGod1.permanentStatGain.elementalDamageResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.water + assignedGod2.permanentStatGain.elementalDamageResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalWaterDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalWaterDamageResistanceGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.air + assignedGod1.permanentStatGain.elementalDamageResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.air + assignedGod2.permanentStatGain.elementalDamageResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalAirDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalAirDamageResistanceGain() * 100) + "%<br />"
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementalDamageResistance.earth + assignedGod1.permanentStatGain.elementalDamageResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementalDamageResistance.earth + assignedGod2.permanentStatGain.elementalDamageResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
      }

      if (character.equipmentSet.getTotalEarthDamageResistanceGain() > 0)
        breakdown += "Equipment: +" + Math.round(character.equipmentSet.getTotalEarthDamageResistanceGain() * 100) + "%<br />"
    }

    return breakdown;
  }
}
