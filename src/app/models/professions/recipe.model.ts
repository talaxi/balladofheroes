import { Type } from "class-transformer";
import { AlchemyActionsEnum } from "../enums/alchemy-actions-enum.model";
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
    steps: AlchemyActionsEnum[];
    expGain: number;

    constructor() {
        this.ingredients = [];
        this.steps = [];
    }
}
