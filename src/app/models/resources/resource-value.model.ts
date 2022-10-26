import { ItemTypeEnum } from "../enums/item-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";

export class ResourceValue {    
    item: ItemsEnum;
    amount: number;
    type: ItemTypeEnum;

    constructor(item: ItemsEnum, type: ItemTypeEnum, amount: number) {
        this.item = item;
        this.type = type;
        this.amount = amount;
    }
}