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
}
