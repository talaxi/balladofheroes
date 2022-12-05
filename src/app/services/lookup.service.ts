import { Injectable } from '@angular/core';
import { StatusEffect } from '../models/battle/status-effect.model';
import { Ability } from '../models/character/ability.model';
import { CharacterStats } from '../models/character/character-stats.model';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { God } from '../models/character/god.model';
import { CharacterEnum } from '../models/enums/character-enum.model';
import { EquipmentQualityEnum } from '../models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from '../models/enums/equipment-type-enum.model';
import { GodEnum } from '../models/enums/god-enum.model';
import { ItemTypeEnum } from '../models/enums/item-type-enum.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { SubZoneEnum } from '../models/enums/sub-zone-enum.model';
import { WeaponTypeEnum } from '../models/enums/weapon-type-enum.model';
import { Achievement } from '../models/global/achievement.model';
import { Equipment } from '../models/resources/equipment.model';
import { ResourceValue } from '../models/resources/resource-value.model';
import { SubZone } from '../models/zone/sub-zone.model';
import { GlobalService } from './global/global.service';
import { UtilityService } from './utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService) { }

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


    return name;
  }

  getTotalXpGainFromEnemyTeam(enemyTeam: Enemy[]) {
    var totalXp = 0;

    enemyTeam.forEach(enemy => {
      totalXp += enemy.xpGainFromDefeat;
    });

    return totalXp;
  }

  getItemTypeFromItemEnum(type: ItemsEnum) {
    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingSalve) {
      return ItemTypeEnum.HealingItem;
    }

    if (type === ItemsEnum.ThrowingStone) {
      return ItemTypeEnum.BattleItem;
    }

    return ItemTypeEnum.None;
  }

  getItemName(type: ItemsEnum) {
    var name = "";

    if (type === ItemsEnum.HealingHerb)
      name = "Healing Herb";

    //battle items
    else if (type === ItemsEnum.ThrowingStone)
      name = "Throwing Stone";

    //equipment
    else if (type === ItemsEnum.BronzeSword)
      name = "Bronze Sword";
    else if (type === ItemsEnum.BronzeHammer)
      name = "Bronze Hammer";
    else if (type === ItemsEnum.ShortBow)
      name = "Short Bow";
    else if (type === ItemsEnum.BronzeShield)
      name = "Bronze Shield";
    else if (type === ItemsEnum.BronzeArmor)
      name = "Bronze Armor";

    return name;
  }

  getItemDescription(type: ItemsEnum) {
    var name = "";

    if (type === ItemsEnum.HealingHerb)
      name = "Heal a party member for " + this.getHealingHerbAmount() + " HP.";

    //battle items
    else if (type === ItemsEnum.ThrowingStone)
      name = "Deal " + this.getThrowingStoneAmount() + " damage to a target.";

    return name;
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

    if (type === ItemsEnum.BronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 5, 0, 3, 0, 0);
    }
    if (type === ItemsEnum.BronzeShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(0, 0, 8, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(30, 0, 3, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 9, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.ShortBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 6, 0, 0, 5, 0);
    }

    return equipmentPiece;
  }

  getEquipmentQualityClass(item?: Equipment) {
    var classText = "";
    if (item === undefined)
      return classText;

    if (item.quality === EquipmentQualityEnum.Basic)
      classText = "basicEquipment";
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
    var secondsPerAutoAttack = this.getAutoAttackTime(character).toFixed(3);

    description = "Deal <strong>" + character.battleStats.attack + "</strong> damage to a single target every <strong>" + secondsPerAutoAttack + "</strong> seconds."

    return description;
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
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Barrage")
      abilityDescription = "Every <strong>" + this.utilityService.ordinalSuffixOf(abilityCount) + "</strong> auto attack hits all additional enemies for <strong>" + (ability !== undefined ? (ability!.effectiveness * 100).toString() : "") + "%</strong> of the damage dealt. Passive.";
    if (abilityName === "Thousand Cuts")
      abilityDescription = "For <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds, deal an additional <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> damage after each auto attack or ability. " + cooldown + " second cooldown.";

    //Archer
    if (abilityName === "Sure Shot")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Mark")
      abilityDescription = "When an enemy has a status effect that you have applied, they also have Mark. Mark increases damage taken by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong>. Passive.";
    if (abilityName === "Pinning Shot")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. Stun the target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Warrior
    if (abilityName === "Battle Cry")
      abilityDescription = "Draw all targets' focus for the next <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds, forcing all attacks to target you. " + cooldown + " second cooldown.";
    if (abilityName === "Last Stand")
      abilityDescription = "When HP drops below <strong>" + thresholdAmountPercent + "%</strong>, increase Defense by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Shield Slam")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. Deals increased damage based on defense. " + cooldown + " second cooldown.";

    //Priest
    if (abilityName === "Heal")
      abilityDescription = "Heal a party member for <strong>" + effectiveAmount + "</strong> HP. Targets the party member with the lowest HP %. " + cooldown + " second cooldown.";
    if (abilityName === "Faith")
      abilityDescription = "God abilities for all characters are more effective by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Pray")
      abilityDescription = "Grant all characters a <strong>" + effectiveAmount + "</strong> HP Shield, up to <strong>" + thresholdAmountPercent + "%</strong> of their total health. " + cooldown + " second cooldown.";

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
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    if (abilityName === "Heavenly Shield")
      abilityDescription = "Reduce damage taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Blinding Light")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage to all targets. Blind them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Artemis
    if (abilityName === "True Shot")
      abilityDescription = "If your target has a negative status effect, increase critical strike chance by <strong>" + effectiveAmountPercent + "%</strong> when attacking. Passive.";
    if (abilityName === "Wounding Arrow")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage to a target and reduce their attack by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Electric Volley")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage to all targets and paralyze them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Expose Weakness")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. Any negative status effects on the target have their duration increased by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the original duration. " + cooldown + " second cooldown.";

    //Apollo
    if (abilityName === "Staccato")
      abilityDescription = "Increase the party's agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Staccato is active, each party member performs a free auto attack. " + cooldown + " second cooldown.";
      if (abilityName === "Fortissimo")
      abilityDescription = "Increase the party's attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Fortissimo is active, reduce your other cooldowns by <strong>" + secondaryEffectiveAmountPercent + "%</strong>. " + cooldown + " second cooldown.";
      if (abilityName === "Allegro")
      abilityDescription = "Increase the party's luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Allegro is active, cleanse a random debuff from a party member. " + cooldown + " second cooldown.";
      if (abilityName === "Ostinato")
      abilityDescription = "Every " + cooldown + " seconds, heal a HP party member for <strong>" + effectiveAmount + "</strong>. Targets the party member with the lowest HP %.";
    
    //Hermes
    if (abilityName === "Trick Shot")
    abilityDescription = "Deal <strong>" + effectiveAmount + " </strong>damage. " + cooldown + " second cooldown.";
    if (abilityName === "Embellish")
    abilityDescription = "Increase your attack and agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Special Delivery")
    abilityDescription = "Immediately perform <strong>three</strong> auto attacks. Their damage is increased by <strong>" + effectiveAmountPercent + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Quicken")
    abilityDescription = "Every auto attack reduces your cooldowns by <strong>" + ability?.effectiveness + "</strong> seconds. Passive.";
  
    //Zeus
    if (abilityName === "Overload")
      abilityDescription = "Surge effect increases damage dealt by next ability by " + effectiveAmount + "%. Passive";
    if (abilityName === "Lightning Bolt")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> Lightning damage. Grants user Surge. " + cooldown + " second cooldown.";
    if (abilityName === "Chain Lightning")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> Lightning damage. Deal 25% less damage to another random target. Repeat until all targets have been hit. " + cooldown + " second cooldown.";
    if (abilityName === "Judgment")
      abilityDescription = "Deal <strong>" + effectiveAmount + "</strong> damage. " + cooldown + " second cooldown.";

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

  itemDoesNotNeedSelection() {
    var doesNotNeedSelection = false;

    return doesNotNeedSelection;
  }

  getHealingHerbAmount() {
    return 50;
  }

  getThrowingStoneAmount() {
    return 3;
  }

  getAutoAttackTime(character: Character) {
    var timeToAutoAttack = character.battleInfo.timeToAutoAttack;
    var adjustedAgility = this.getAdjustedAgility(character);

    var amplifier = 120;
    var horizontalStretch = .00035;
    var horizontalPosition = 1;

    //500 * (log(.0035 * 10 + 1)) + 50      
    var modifierAmount = amplifier * Math.log10(horizontalStretch * (adjustedAgility) + horizontalPosition);

    //if it goes below 0, needs to attack multi times
    //although probably need to make it more like if it gets reduced to 33% or something like that because otherwise its a nerf       
    timeToAutoAttack -= modifierAmount;

    return timeToAutoAttack;
  }

  getDamageCriticalChance(attacker: Character, target: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    var targetResistance = this.getAdjustedResistance(target);

    var difference = attackerLuck - targetResistance;

    if (difference > 0) {
      var amplifier = 50;
      var horizontalStretch = .05;
      var horizontalPosition = 5;

      //500 * (log(.0035 * 10 + 1)) + 50      
      criticalChance = (amplifier * Math.log10(horizontalStretch * (difference) + horizontalPosition) / 100);
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

  getAdjustedAgility(character: Character) {
    var agility = character.battleStats.agility;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AgilityUp ||
        effect.type === StatusEffectEnum.AgilityDown);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AgilityUp || effect.type === StatusEffectEnum.AgilityDown) {
            agility *= effect.effectiveness;
          }
        });
      }
    }

    return agility;
  }

  getAdjustedLuck(character: Character) {
    var luck = character.battleStats.luck;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.LuckUp ||
        effect.type === StatusEffectEnum.LuckDown);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.LuckUp || effect.type === StatusEffectEnum.LuckDown) {
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
        effect.type === StatusEffectEnum.ResistanceDown);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.ResistanceUp || effect.type === StatusEffectEnum.ResistanceDown) {
            resistance *= effect.effectiveness;
          }
        });
      }
    }

    return resistance;
  }

  getAdjustedAttack(character: Character, ability?: Ability) {
    var attack = character.battleStats.attack;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AttackUp ||
        effect.type === StatusEffectEnum.AttackDown);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AttackUp || effect.type === StatusEffectEnum.AttackDown) {
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
        effect.type === StatusEffectEnum.DefenseDown);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.DefenseUp || effect.type === StatusEffectEnum.DefenseDown) {
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

  getAdjustedCriticalMultiplier(character: Character) {
    return 1.5;
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

    return src;
  }
}
