import { Type } from "class-transformer";
import { CharacterStats } from "../character/character-stats.model";
import { EquipmentQualityEnum } from "../enums/equipment-quality-enum.model";
import { EquipmentTypeEnum } from "../enums/equipment-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";
import { WeaponTypeEnum } from "../enums/weapon-type-enum.model";
import { UsableItemEffect } from "./usable-item-effect.model";

export class Equipment {
    itemType: ItemsEnum;
    equipmentType: EquipmentTypeEnum;
    weaponType: WeaponTypeEnum;
    @Type(() => CharacterStats)
    stats: CharacterStats;
    @Type(() => UsableItemEffect)
    equipmentEffect: UsableItemEffect;
    quality: EquipmentQualityEnum;

    constructor(itemType: ItemsEnum, equipmentType: EquipmentTypeEnum, quality: EquipmentQualityEnum, weaponType?: WeaponTypeEnum) {
        this.itemType = itemType;
        this.equipmentType = equipmentType;
        this.quality = quality;
        if (weaponType !== undefined)
            this.weaponType = weaponType;
        else
            this.weaponType = WeaponTypeEnum.None;
        
        this.equipmentEffect = new UsableItemEffect();
    }
}
