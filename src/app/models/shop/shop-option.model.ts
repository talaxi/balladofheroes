import { ShopTypeEnum } from "../enums/shop-type-enum.model";
import { ShopItem } from "./shop-item.model";

export class ShopOption {
    type: ShopTypeEnum;
    availableItems: ShopItem[];

    constructor(type: ShopTypeEnum, availableItems: ShopItem[]) {
        this.type = type;
        this.availableItems = availableItems;
    }
}
