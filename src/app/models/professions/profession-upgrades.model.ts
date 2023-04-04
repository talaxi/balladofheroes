import { EquipmentQualityEnum } from "../enums/equipment-quality-enum.model";

export class ProfessionUpgrades {
    quality: EquipmentQualityEnum;
    durationReduction: number;
    chanceTo2xItem: number;
    chanceToRetainMaterials: number;
    chanceTo5xItem: number;

    constructor(type: EquipmentQualityEnum) {
        this.quality = type;
        this.durationReduction = 0;
        this.chanceTo2xItem = 0;
        this.chanceTo5xItem = 0;
        this.chanceToRetainMaterials = 0;
    }
}
