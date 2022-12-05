import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShopItemGeneratorService {

  constructor() { }

  generateShopItem(item: ItemsEnum) {    
    var purchasePrice: ResourceValue[] = [];
    if (item === ItemsEnum.LinenArmor)
    {
      purchasePrice.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 20));
    }
    
    return new ShopItem(item, purchasePrice);
  }
}
