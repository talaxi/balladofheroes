import { Injectable } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

@Injectable({
  providedIn: 'root'
})
export class CharmService {

  constructor() { }

  getTotalHpRegenAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = 1;
    var largeCharmValue = 3;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfRejuvenation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfRejuvenation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

      return amount;
  }
}
