import { Type } from "class-transformer";
import { ItemsEnum } from "../enums/items-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class ShopItem {
    shopItem: ItemsEnum;
    @Type(() => ResourceValue)
    purchasePrice: ResourceValue[];

    constructor(item: ItemsEnum, purchasePrice: ResourceValue[]) {
        this.shopItem = item;
        this.purchasePrice = purchasePrice;
    }
}
