import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceGeneratorService {

  constructor(private globalService: GlobalService) { }

  bronzeSword(amount: number) {
    return new ResourceValue(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, amount);
  }

  healingHerb(amount: number) {
    return new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, amount);
  }

  throwingStone(amount: number) {
    return new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, amount);
  }
}
