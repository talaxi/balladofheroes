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

    getTotalHolyDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.holy;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.holy;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.holy;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.holy;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.holy;

        return total;
    }

    getTotalFireDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.fire;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.fire;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.fire;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.fire;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.fire;

        return total;
    }

    getTotalLightningDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.lightning;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.lightning;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.lightning;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.lightning;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.lightning;

        return total;
    }

    getTotalWaterDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.water;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.water;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.water;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.water;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.water;

        return total;
    }

    getTotalAirDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.air;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.air;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.air;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.air;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.air;

        return total;
    }

    getTotalEarthDamageIncreaseGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageIncrease.earth;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageIncrease.earth;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageIncrease.earth;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageIncrease.earth;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageIncrease.earth;

        return total;
    }

    getTotalHolyDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.holy;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.holy;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.holy;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.holy;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.holy;

        return total;
    }

    getTotalFireDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.fire;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.fire;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.fire;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.fire;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.fire;

        return total;
    }

    getTotalLightningDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.lightning;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.lightning;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.lightning;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.lightning;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.lightning;

        return total;
    }

    getTotalWaterDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.water;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.water;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.water;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.water;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.water;

        return total;
    }

    getTotalAirDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.air;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.air;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.air;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.air;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.air;

        return total;
    }

    getTotalEarthDamageResistanceGain() {
        var total = 0;

        if (this.weapon !== undefined)
            total += this.weapon.stats.elementalDamageResistance.earth;

        if (this.shield !== undefined)
            total += this.shield.stats.elementalDamageResistance.earth;

        if (this.armor !== undefined)
            total += this.armor.stats.elementalDamageResistance.earth;

        if (this.necklace !== undefined)
            total += this.necklace.stats.elementalDamageResistance.earth;

        if (this.ring !== undefined)
            total += this.ring.stats.elementalDamageResistance.earth;

        return total;
    }
}
