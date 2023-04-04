import { ItemTypeEnum } from "../enums/item-type-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";

export class ResourceValue {    
    item: ItemsEnum;
    amount: number;
    extras: ItemsEnum[];

    constructor(item: ItemsEnum, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    makeCopy() 
    {
        var copy = new ResourceValue(this.item, this.amount);        
        if (this.extras !== undefined && this.extras.length > 0) {
            copy.extras = [];
            this.extras.forEach(extra => {
                copy.extras.push(extra);
            });
        }
        return copy;
    }
}