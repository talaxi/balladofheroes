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
}
