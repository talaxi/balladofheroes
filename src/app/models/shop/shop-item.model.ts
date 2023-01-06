import { Type } from "class-transformer";
import { ItemsEnum } from "../enums/items-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class ShopItem {
    shopItem: ItemsEnum;
    @Type(() => ResourceValue)
    purchasePrice: ResourceValue[];
    originalStore: SubZoneEnum;

    constructor(item: ItemsEnum, purchasePrice: ResourceValue[], originalStore: SubZoneEnum) {
        this.shopItem = item;
        this.purchasePrice = purchasePrice;
        this.originalStore = originalStore;
    }

    makeCopy() {
        var copy = new ShopItem(this.shopItem, this.purchasePrice, this.originalStore);

        return copy;
    }
}
