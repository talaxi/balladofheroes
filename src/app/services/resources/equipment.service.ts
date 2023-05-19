import { Injectable } from '@angular/core';
import { EquipmentSet } from 'src/app/models/resources/equipment-set.model';
import { ResourceGeneratorService } from './resource-generator.service';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private resourceGeneratorService: ResourceGeneratorService) { }

  getTotalMaxHpGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.maxHp;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.maxHp > 0)
            total += slotItemValues.maxHp;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.maxHp;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.maxHp > 0)
            total += slotItemValues.maxHp;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.maxHp;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.maxHp > 0)
            total += slotItemValues.maxHp;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.maxHp;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.maxHp > 0)
            total += slotItemValues.maxHp;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.maxHp;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.maxHp > 0)
            total += slotItemValues.maxHp;
        });
      }
    }

    return total;
  }

  getTotalAttackGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.attack;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.attack > 0)
            total += slotItemValues.attack;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.attack;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.attack > 0)
            total += slotItemValues.attack;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.attack;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.attack > 0)
            total += slotItemValues.attack;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.attack;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.attack > 0)
            total += slotItemValues.attack;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.attack;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.attack > 0)
            total += slotItemValues.attack;
        });
      }
    }

    return total;
  }

  getTotalAgilityGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.agility;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.agility > 0)
            total += slotItemValues.agility;
        });
      }
    }

    if (equipmentSet.shield !== undefined){
      total += equipmentSet.shield.stats.agility;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.agility > 0)
            total += slotItemValues.agility;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.agility;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.agility > 0)
            total += slotItemValues.agility;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.agility;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.agility > 0)
            total += slotItemValues.agility;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.agility;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.agility > 0)
            total += slotItemValues.agility;
        });
      }
    }

    return total;
  }

  getTotalLuckGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.luck;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.luck > 0)
            total += slotItemValues.luck;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.luck;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.luck > 0)
            total += slotItemValues.luck;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.luck;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.luck > 0)
            total += slotItemValues.luck;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.luck;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.luck > 0)
            total += slotItemValues.luck;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {    
      total += equipmentSet.ring.stats.luck;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.luck > 0)
            total += slotItemValues.luck;
        });
      }
    }

    return total;
  }

  getTotalDefenseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.defense;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.defense > 0)
            total += slotItemValues.defense;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.defense;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.defense > 0)
            total += slotItemValues.defense;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.defense;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.defense > 0)
            total += slotItemValues.defense;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.defense;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.defense > 0)
            total += slotItemValues.defense;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.defense;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.defense > 0)
            total += slotItemValues.defense;
        });
      }
    }

    return total;
  }

  getTotalResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.resistance;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.resistance > 0)
            total += slotItemValues.resistance;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.resistance;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.resistance > 0)
            total += slotItemValues.resistance;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.resistance;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.resistance > 0)
            total += slotItemValues.resistance;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.resistance;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.resistance > 0)
            total += slotItemValues.resistance;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.resistance;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.resistance > 0)
            total += slotItemValues.resistance;
        });
      }
    }

    return total;
  }

  getTotalHpRegenGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.hpRegen;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.hpRegen;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.hpRegen > 0)
            total += slotItemValues.hpRegen;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.hpRegen;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.hpRegen;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.hpRegen;

    return total;
  }

  getTotalOverdriveGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.overdriveGain;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.overdriveGain;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.overdriveGain > 0)
            total += slotItemValues.overdriveGain;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.overdriveGain;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.overdriveGain;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.overdriveGain;

    return total;
  }

  getTotalArmorPenetrationGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.armorPenetration;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.armorPenetration;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.armorPenetration > 0)
            total += slotItemValues.armorPenetration;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.armorPenetration;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.armorPenetration;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.armorPenetration;

    return total;
  }

  getTotalCriticalMultiplierGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.criticalMultiplier;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.criticalMultiplier;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.criticalMultiplier > 0)
            total += slotItemValues.criticalMultiplier;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.criticalMultiplier;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.criticalMultiplier;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.criticalMultiplier;

    return total;
  }

  getTotalDebuffDurationGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.debuffDuration;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.debuffDuration;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.debuffDuration > 0)
            total += slotItemValues.debuffDuration;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.debuffDuration;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.debuffDuration;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.debuffDuration;

    return total;
  }

  getTotalOverdriveGainFromAutoAttacksGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.overdriveGainFromAutoAttacks;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.overdriveGainFromAutoAttacks;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.overdriveGainFromAutoAttacks > 0)
            total += slotItemValues.overdriveGainFromAutoAttacks;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.overdriveGainFromAutoAttacks;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.overdriveGainFromAutoAttacks;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.overdriveGainFromAutoAttacks;

    return total;
  }

  getTotalHealingReceivedGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.healingReceived;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.healingReceived;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.healingReceived > 0)
            total += slotItemValues.healingReceived;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.healingReceived;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.healingReceived;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.healingReceived;

    return total;
  }

  getTotalHealingDoneGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.healingDone;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.healingDone;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.healingDone > 0)
            total += slotItemValues.healingDone;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.healingDone;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.healingDone;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.healingDone;

    return total;
  }

  getTotalAbilityCooldownReductionWithBuffsGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.abilityCooldownReductionWithBuffs;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.abilityCooldownReductionWithBuffs;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.abilityCooldownReductionWithBuffs > 0)
            total += slotItemValues.abilityCooldownReductionWithBuffs;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.abilityCooldownReductionWithBuffs;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.abilityCooldownReductionWithBuffs;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.abilityCooldownReductionWithBuffs;

    return total;
  }

  getTotalAbilityCooldownReductionStartGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.abilityCooldownReductionStart;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.abilityCooldownReductionStart;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.abilityCooldownReductionStart > 0)
            total += slotItemValues.abilityCooldownReductionStart;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.abilityCooldownReductionStart;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.abilityCooldownReductionStart;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.abilityCooldownReductionStart;

    return total;
  }

  getTotalTickFrequencyGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.tickFrequency;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.tickFrequency;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.tickFrequency > 0)
            total += slotItemValues.tickFrequency;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.tickFrequency;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.tickFrequency;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.tickFrequency;

    return total;
  }

  getTotalAoeDamageGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.aoeDamage;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.aoeDamage;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.aoeDamage > 0)
            total += slotItemValues.aoeDamage;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.aoeDamage;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.aoeDamage;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.aoeDamage;

    return total;
  }

  getTotalThornsGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.thorns;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.thorns;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.thorns > 0)
            total += slotItemValues.thorns;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.thorns;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.thorns;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.thorns;

    return total;
  }

  getTotalAbilityCooldownReductionGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.abilityCooldownReduction;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.abilityCooldownReduction;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.abilityCooldownReduction > 0)
            total += slotItemValues.abilityCooldownReduction;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.abilityCooldownReduction;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.abilityCooldownReduction;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.abilityCooldownReduction;

    return total;
  }

  getTotalAutoAttackCooldownReductionGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.autoAttackCooldownReduction;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.autoAttackCooldownReduction;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.autoAttackCooldownReduction > 0)
            total += slotItemValues.autoAttackCooldownReduction;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.autoAttackCooldownReduction;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.autoAttackCooldownReduction;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.autoAttackCooldownReduction;

    return total;
  }

  getTotalHolyDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.holy;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.holy > 0)
            total += slotItemValues.elementIncrease.holy;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.holy;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.holy > 0)
            total += slotItemValues.elementIncrease.holy;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.holy;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.holy > 0)
            total += slotItemValues.elementIncrease.holy;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.holy;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.holy > 0)
            total += slotItemValues.elementIncrease.holy;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.holy;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.holy > 0)
            total += slotItemValues.elementIncrease.holy;
        });
      }
    }

    return total;
  }

  getTotalFireDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.fire;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.fire > 0)
            total += slotItemValues.elementIncrease.fire;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.fire;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.fire > 0)
            total += slotItemValues.elementIncrease.fire;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.fire;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.fire > 0)
            total += slotItemValues.elementIncrease.fire;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.fire;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.fire > 0)
            total += slotItemValues.elementIncrease.fire;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.fire;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.fire > 0)
            total += slotItemValues.elementIncrease.fire;
        });
      }
    }

    return total;
  }

  getTotalLightningDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.lightning;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.lightning > 0)
            total += slotItemValues.elementIncrease.lightning;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.lightning;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.lightning > 0)
            total += slotItemValues.elementIncrease.lightning;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.lightning;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.lightning > 0)
            total += slotItemValues.elementIncrease.lightning;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.lightning;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.lightning > 0)
            total += slotItemValues.elementIncrease.lightning;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.lightning;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    return total;
  }

  getTotalWaterDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.water;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.water > 0)
            total += slotItemValues.elementIncrease.water;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.water;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.water > 0)
            total += slotItemValues.elementIncrease.water;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.water;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.water > 0)
            total += slotItemValues.elementIncrease.water;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.water;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.water > 0)
            total += slotItemValues.elementIncrease.water;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.water;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.water > 0)
            total += slotItemValues.elementIncrease.water;
        });
      }
    }

    return total;
  }

  getTotalAirDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.air;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.air > 0)
            total += slotItemValues.elementIncrease.air;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.air;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.air > 0)
            total += slotItemValues.elementIncrease.air;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.air;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.air > 0)
            total += slotItemValues.elementIncrease.air;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.air;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.air > 0)
            total += slotItemValues.elementIncrease.air;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.air;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.air > 0)
            total += slotItemValues.elementIncrease.air;
        });
      }
    }

    return total;
  }

  getTotalEarthDamageIncreaseGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined) {
      total += equipmentSet.weapon.stats.elementIncrease.earth;

      if (equipmentSet.weapon.associatedResource !== undefined && equipmentSet.weapon.associatedResource.extras !== undefined &&
        equipmentSet.weapon.associatedResource.extras.length > 0) {
        equipmentSet.weapon.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementIncrease.earth;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    if (equipmentSet.armor !== undefined) {
      total += equipmentSet.armor.stats.elementIncrease.earth;

      if (equipmentSet.armor.associatedResource !== undefined && equipmentSet.armor.associatedResource.extras !== undefined &&
        equipmentSet.armor.associatedResource.extras.length > 0) {
        equipmentSet.armor.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    if (equipmentSet.necklace !== undefined) {
      total += equipmentSet.necklace.stats.elementIncrease.earth;

      if (equipmentSet.necklace.associatedResource !== undefined && equipmentSet.necklace.associatedResource.extras !== undefined &&
        equipmentSet.necklace.associatedResource.extras.length > 0) {
        equipmentSet.necklace.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    if (equipmentSet.ring !== undefined) {
      total += equipmentSet.ring.stats.elementIncrease.earth;

      if (equipmentSet.ring.associatedResource !== undefined && equipmentSet.ring.associatedResource.extras !== undefined &&
        equipmentSet.ring.associatedResource.extras.length > 0) {
        equipmentSet.ring.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementIncrease.earth > 0)
            total += slotItemValues.elementIncrease.earth;
        });
      }
    }

    return total;
  }

  getTotalHolyDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.holy;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementResistance.holy;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.holy > 0)
            total += slotItemValues.elementResistance.holy;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.holy;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.holy;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.holy;

    return total;
  }

  getTotalFireDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.fire;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementResistance.fire;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.fire > 0)
            total += slotItemValues.elementResistance.fire;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.fire;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.fire;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.fire;

    return total;
  }

  getTotalLightningDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.lightning;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementResistance.lightning;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.lightning > 0)
            total += slotItemValues.elementResistance.lightning;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.lightning;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.lightning;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.lightning;

    return total;
  }

  getTotalWaterDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.water;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementResistance.water;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.water > 0)
            total += slotItemValues.elementResistance.water;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.water;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.water;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.water;

    return total;
  }

  getTotalAirDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.air;

    if (equipmentSet.shield !== undefined) {
      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.air > 0)
            total += slotItemValues.elementResistance.air;
        });
      }

      total += equipmentSet.shield.stats.elementResistance.air;
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.air;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.air;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.air;

    return total;
  }

  getTotalEarthDamageResistanceGain(equipmentSet: EquipmentSet) {
    var total = 0;

    if (equipmentSet.weapon !== undefined)
      total += equipmentSet.weapon.stats.elementResistance.earth;

    if (equipmentSet.shield !== undefined) {
      total += equipmentSet.shield.stats.elementResistance.earth;

      if (equipmentSet.shield.associatedResource !== undefined && equipmentSet.shield.associatedResource.extras !== undefined &&
        equipmentSet.shield.associatedResource.extras.length > 0) {
        equipmentSet.shield.associatedResource.extras.forEach(extra => {
          var slotItemValues = this.resourceGeneratorService.getSlotItemValues(extra);
          if (slotItemValues.elementResistance.earth > 0)
            total += slotItemValues.elementResistance.earth;
        });
      }
    }

    if (equipmentSet.armor !== undefined)
      total += equipmentSet.armor.stats.elementResistance.earth;

    if (equipmentSet.necklace !== undefined)
      total += equipmentSet.necklace.stats.elementResistance.earth;

    if (equipmentSet.ring !== undefined)
      total += equipmentSet.ring.stats.elementResistance.earth;

    return total;
  }
}
