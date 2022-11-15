import { Injectable } from '@angular/core';
import { Ability } from '../models/character/ability.model';
import { CharacterStats } from '../models/character/character-stats.model';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { God } from '../models/character/god.model';
import { CharacterEnum } from '../models/enums/character-enum.model';
import { EquipmentTypeEnum } from '../models/enums/equipment-type-enum.model';
import { GodEnum } from '../models/enums/god-enum.model';
import { ItemTypeEnum } from '../models/enums/item-type-enum.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { SubZoneEnum } from '../models/enums/sub-zone-enum.model';
import { WeaponTypeEnum } from '../models/enums/weapon-type-enum.model';
import { Equipment } from '../models/resources/equipment.model';
import { SubZone } from '../models/zone/sub-zone.model';
import { GlobalService } from './global/global.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private globalService: GlobalService) { }

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

  getTotalXpGainFromEnemyTeam(enemyTeam: Enemy[]) {
    var totalXp = 0;

    enemyTeam.forEach(enemy => {
      totalXp += enemy.xpGainFromDefeat;
    });

    return totalXp;
  }

  getItemTypeFromItemEnum(type: ItemsEnum) {
    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingSalve)
    {
      return ItemTypeEnum.HealingItem;
    }

    return ItemTypeEnum.None;
  }

  getItemName(type: ItemsEnum) {
    var name = "";

    if (type === ItemsEnum.HealingHerb) 
      name = "Healing Herb";    
    else if (type === ItemsEnum.BronzeSword)
      name = "Bronze Sword";
    else if (type === ItemsEnum.BronzeAxe)
      name = "Bronze Axe";
    else if (type === ItemsEnum.BronzeShield)
      name = "Bronze Shield";
    else if (type === ItemsEnum.BronzeArmor)
      name = "Bronze Armor";

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
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 5, 0, 3, 0);
    }
    if (type === ItemsEnum.BronzeShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield);
      equipmentPiece.stats = new CharacterStats(0, 0, 8, 0, 0);
    }
    if (type === ItemsEnum.BronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor);
      equipmentPiece.stats = new CharacterStats(30, 0, 3, 0, 0);
    }
    if (type === ItemsEnum.BronzeAxe) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 9, 0, 0, 0);
    }

    return equipmentPiece;
  }

  getAutoAttackDescription(character: Character) {
    var description = "";
    var secondsPerAutoAttack = this.getAutoAttackTime(character).toFixed(3);

    description = "Deal <strong>" + character.battleStats.attack + "</strong> damage to a single target every <strong>" + secondsPerAutoAttack + "</strong> seconds."

    return description;
  }
  
  getCharacterAbilityDescription(abilityName: string) {
    var abilityDescription = "";

    if (abilityName === "Barrage")
      abilityDescription = "Barrage Description";
      if (abilityName === "Last Stand")
      abilityDescription = "Last Stand Description";
      if (abilityName === "Mark")
      abilityDescription = "Mark Description";
    if (abilityName === "Faith")
      abilityDescription = "Faith Description";

    return abilityDescription;
  }

  getGodAbilityDescription(abilityName: string)
  {
    var abilityDescription = "";

    if (abilityName === "Second Wind")
    {
      abilityDescription = "Second Wind Description";
    }

    return abilityDescription;
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

  itemDoesNotNeedSelection() {
    var doesNotNeedSelection = false;

    return doesNotNeedSelection;
  }

  getHealingHerbAmount() {
    return 50;
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

    
    if (ability !== undefined && ability.name === "Shield Slam")
    {
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
      'artemisColor': type === GodEnum.Artemis
    };
  }  
}
