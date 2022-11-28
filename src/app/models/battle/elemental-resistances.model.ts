import { ElementalResistanceEnum } from "../enums/elemental-resistance-enum.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";

export class ElementalResistances {
    elementalType: ElementalTypeEnum;
    elementalResistance: ElementalResistanceEnum;

    constructor(type: ElementalTypeEnum, resistance: ElementalResistanceEnum) {
        this.elementalType = type;
        this.elementalResistance = resistance;
    }
}
