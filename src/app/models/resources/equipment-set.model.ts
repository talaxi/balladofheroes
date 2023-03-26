import { Type } from "class-transformer";
import { EquipmentTypeEnum } from "../enums/equipment-type-enum.model";
import { Equipment } from "./equipment.model";

export class EquipmentSet {
    @Type(() => Equipment)
    weapon: Equipment | undefined;
    @Type(() => Equipment)
    shield: Equipment | undefined;
    @Type(() => Equipment)
    armor: Equipment | undefined;
    @Type(() => Equipment)
    ring: Equipment | undefined;
    @Type(() => Equipment)    
    necklace: Equipment | undefined;

    constructor() {

    }

    getPieceBasedOnType(type: EquipmentTypeEnum) {
        if (type === EquipmentTypeEnum.Weapon)
            return this.weapon;
        else if (type === EquipmentTypeEnum.Armor)
            return this.armor;
        else if (type === EquipmentTypeEnum.Shield)
            return this.shield;
        else if (type === EquipmentTypeEnum.Ring)
            return this.ring;
        else if (type === EquipmentTypeEnum.Necklace)
            return this.necklace;

        return undefined;
    }

    getTotalMaxHpGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.maxHp;

        if (this.shield !== undefined)
            total += this.shield.stats.maxHp;

        if (this.armor !== undefined)
            total += this.armor.stats.maxHp;

        if (this.necklace !== undefined)
            total += this.necklace.stats.maxHp;

        if (this.ring !== undefined)
            total += this.ring.stats.maxHp;

        return total;
    }

    getTotalAttackGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.attack;

        if (this.shield !== undefined)
            total += this.shield.stats.attack;

        if (this.armor !== undefined)
            total += this.armor.stats.attack;

        if (this.necklace !== undefined)
            total += this.necklace.stats.attack;

        if (this.ring !== undefined)
            total += this.ring.stats.attack;

        return total;
    }

    getTotalAgilityGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.agility;

        if (this.shield !== undefined)
            total += this.shield.stats.agility;

        if (this.armor !== undefined)
            total += this.armor.stats.agility;

        if (this.necklace !== undefined)
            total += this.necklace.stats.agility;

        if (this.ring !== undefined)
            total += this.ring.stats.agility;

        return total;
    }

    getTotalLuckGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.luck;

        if (this.shield !== undefined)
            total += this.shield.stats.luck;

        if (this.armor !== undefined)
            total += this.armor.stats.luck;

        if (this.necklace !== undefined)
            total += this.necklace.stats.luck;

        if (this.ring !== undefined)
            total += this.ring.stats.luck;

        return total;
    }

    getTotalDefenseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.defense;

        if (this.shield !== undefined)
            total += this.shield.stats.defense;

        if (this.armor !== undefined)
            total += this.armor.stats.defense;

        if (this.necklace !== undefined)
            total += this.necklace.stats.defense;

        if (this.ring !== undefined)
            total += this.ring.stats.defense;

        return total;
    }

    getTotalResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.resistance;

        if (this.shield !== undefined)
            total += this.shield.stats.resistance;

        if (this.armor !== undefined)
            total += this.armor.stats.resistance;

        if (this.necklace !== undefined)
            total += this.necklace.stats.resistance;

        if (this.ring !== undefined)
            total += this.ring.stats.resistance;

        return total;
    }

    getTotalHpRegenGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.hpRegen;

        if (this.shield !== undefined)
            total += this.shield.stats.hpRegen;

        if (this.armor !== undefined)
            total += this.armor.stats.hpRegen;

        if (this.necklace !== undefined)
            total += this.necklace.stats.hpRegen;

        if (this.ring !== undefined)
            total += this.ring.stats.hpRegen;

        return total;
    }

    getTotalOverdriveGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.overdriveGain;

        if (this.shield !== undefined)
            total += this.shield.stats.overdriveGain;

        if (this.armor !== undefined)
            total += this.armor.stats.overdriveGain;

        if (this.necklace !== undefined)
            total += this.necklace.stats.overdriveGain;

        if (this.ring !== undefined)
            total += this.ring.stats.overdriveGain;

        return total;
    }

    getTotalArmorPenetrationGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.armorPenetration;

        if (this.shield !== undefined)
            total += this.shield.stats.armorPenetration;

        if (this.armor !== undefined)
            total += this.armor.stats.armorPenetration;

        if (this.necklace !== undefined)
            total += this.necklace.stats.armorPenetration;

        if (this.ring !== undefined)
            total += this.ring.stats.armorPenetration;

        return total;
    }

    getTotalCriticalMultiplierGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.criticalMultiplier;

        if (this.shield !== undefined)
            total += this.shield.stats.criticalMultiplier;

        if (this.armor !== undefined)
            total += this.armor.stats.criticalMultiplier;

        if (this.necklace !== undefined)
            total += this.necklace.stats.criticalMultiplier;

        if (this.ring !== undefined)
            total += this.ring.stats.criticalMultiplier;

        return total;
    }

    getTotalAbilityCooldownReductionGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.abilityCooldownReduction;

        if (this.shield !== undefined)
            total += this.shield.stats.abilityCooldownReduction;

        if (this.armor !== undefined)
            total += this.armor.stats.abilityCooldownReduction;

        if (this.necklace !== undefined)
            total += this.necklace.stats.abilityCooldownReduction;

        if (this.ring !== undefined)
            total += this.ring.stats.abilityCooldownReduction;

        return total;
    }

    getTotalAutoAttackCooldownReductionGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.autoAttackCooldownReduction;

        if (this.shield !== undefined)
            total += this.shield.stats.autoAttackCooldownReduction;

        if (this.armor !== undefined)
            total += this.armor.stats.autoAttackCooldownReduction;

        if (this.necklace !== undefined)
            total += this.necklace.stats.autoAttackCooldownReduction;

        if (this.ring !== undefined)
            total += this.ring.stats.autoAttackCooldownReduction;

        return total;
    }    

    getTotalHolyDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.holy;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.holy;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.holy;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.holy;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.holy;

        return total;
    }

    getTotalFireDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.fire;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.fire;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.fire;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.fire;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.fire;

        return total;
    }

    getTotalLightningDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.lightning;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.lightning;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.lightning;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.lightning;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.lightning;

        return total;
    }

    getTotalWaterDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.water;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.water;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.water;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.water;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.water;

        return total;
    }

    getTotalAirDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.air;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.air;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.air;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.air;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.air;

        return total;
    }

    getTotalEarthDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementIncrease.earth;

        if (this.shield !== undefined)
            total += this.shield.stats.elementIncrease.earth;

        if (this.armor !== undefined)
            total += this.armor.stats.elementIncrease.earth;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementIncrease.earth;

        if (this.ring !== undefined)
            total += this.ring.stats.elementIncrease.earth;

        return total;
    }

    getTotalHolyDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.holy;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.holy;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.holy;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.holy;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.holy;

        return total;
    }

    getTotalFireDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.fire;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.fire;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.fire;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.fire;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.fire;

        return total;
    }

    getTotalLightningDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.lightning;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.lightning;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.lightning;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.lightning;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.lightning;

        return total;
    }

    getTotalWaterDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.water;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.water;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.water;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.water;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.water;

        return total;
    }

    getTotalAirDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.air;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.air;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.air;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.air;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.air;

        return total;
    }

    getTotalEarthDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementResistance.earth;

        if (this.shield !== undefined)
            total += this.shield.stats.elementResistance.earth;

        if (this.armor !== undefined)
            total += this.armor.stats.elementResistance.earth;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementResistance.earth;

        if (this.ring !== undefined)
            total += this.ring.stats.elementResistance.earth;

        return total;
    }
}
