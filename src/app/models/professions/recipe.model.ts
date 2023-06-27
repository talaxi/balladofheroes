import { Type } from "class-transformer";
import { ProfessionActionsEnum } from "../enums/profession-actions-enum.model";
import { EquipmentQualityEnum } from "../enums/equipment-quality-enum.model";
import { ItemTypeEnum } from "../enums/item-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class Recipe {
    createdItem: ItemsEnum;
    createdAmount: number;
    createdItemType: ItemTypeEnum;
    @Type(() => ResourceValue)
    ingredients: ResourceValue[];
    numberOfSteps: number;
    steps: ProfessionActionsEnum[];
    expGain: number;
    quality: EquipmentQualityEnum;
    displayOrder: number;

    constructor() {
        this.ingredients = [];
        this.steps = [];
        this.displayOrder = 0;
    }
}
