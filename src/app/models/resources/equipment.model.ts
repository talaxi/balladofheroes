import { CharacterStats } from "../character/character-stats.model";
import { EquipmentTypeEnum } from "../enums/equipment-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";
import { WeaponTypeEnum } from "../enums/weapon-type-enum.model";

export class Equipment {
    itemType: ItemsEnum;
    equipmentType: EquipmentTypeEnum;
    weaponType: WeaponTypeEnum;
    stats: CharacterStats;

    constructor(itemType: ItemsEnum, equipmentType: EquipmentTypeEnum, weaponType?: WeaponTypeEnum) {
        this.itemType = itemType;
        this.equipmentType = equipmentType;
        if (weaponType !== undefined)
            this.weaponType = weaponType;
        else
            this.weaponType = WeaponTypeEnum.None;
        
    }
}
