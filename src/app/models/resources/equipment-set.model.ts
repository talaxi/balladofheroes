import { Type } from "class-transformer";
import { EquipmentTypeEnum } from "../enums/equipment-type-enum.model";
import { Equipment } from "./equipment.model";
import { UsableItemEffect } from "./usable-item-effect.model";
import { EquipmentSetEnum } from "../enums/equipment-set-enum.model";

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
    @Type(() => UsableItemEffect)
    setEffects: UsableItemEffect[];

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

    getAllSetCounts() {
        var setCounts: [EquipmentSetEnum, number][] = [];
        for (const [propertyKey, propertyValue] of Object.entries(EquipmentSetEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }

            var enumValue = propertyValue as EquipmentSetEnum;
            var count = this.getSetCount(enumValue);
            if (count > 0)
                setCounts.push([enumValue, count]);
        }

        return setCounts;
    }

    getSetCount(set: EquipmentSetEnum) {
        var count = 0;

        if (this.weapon?.set === set)
            count += 1;
        if (this.shield?.set === set)
            count += 1;
        if (this.armor?.set === set)
            count += 1;
        if (this.ring?.set === set)
            count += 1;
        if (this.necklace?.set === set)
            count += 1;

        return count;
    }
}
