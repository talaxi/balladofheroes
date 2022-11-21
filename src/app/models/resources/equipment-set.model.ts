import { EquipmentTypeEnum } from "../enums/equipment-type-enum.model";
import { Equipment } from "./equipment.model";

export class EquipmentSet {
    weapon: Equipment | undefined;
    shield: Equipment | undefined;
    armor: Equipment | undefined;
    rightRing: Equipment | undefined;
    leftRing: Equipment | undefined;
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
            return this.rightRing;
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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.maxHp;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.maxHp;

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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.attack;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.attack;

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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.agility;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.agility;

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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.luck;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.luck;

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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.defense;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.defense;

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

        if (this.rightRing !== undefined)
            total += this.rightRing.stats.resistance;

        if (this.leftRing !== undefined)
            total += this.leftRing.stats.resistance;

        return total;
    }
}
