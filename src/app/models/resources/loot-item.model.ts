import { ItemTypeEnum } from "../enums/item-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";

export class LootItem {
    chance: number; //% chance of getting item
    item: ItemsEnum;
    type: ItemTypeEnum;
    amount: number;

    constructor(item: ItemsEnum, itemType: ItemTypeEnum, amount: number, chance: number) {
        this.item = item;
        this.type = itemType;
        this.amount = amount;
        this.chance = chance;
    }
}
