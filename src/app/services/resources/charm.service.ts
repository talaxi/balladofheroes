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

  getTotalCriticalMultiplierAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfVulnerability);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfVulnerability);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAbilityCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfPreparation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfPreparation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAutoAttackCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .1;
    var largeCharmValue = .3;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHaste);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHaste);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalHolyDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHolyDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHolyDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalFireDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfFireDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfFireDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalLightningDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfLightningDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfLightningDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAirDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAirDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAirDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalWaterDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfWaterDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfWaterDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalEarthDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .05;
    var largeCharmValue = .15;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfEarthDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfEarthDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalHolyDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHolyProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHolyProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalFireDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfFireProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfFireProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalLightningDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfLightningProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfLightningProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAirDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAirProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAirProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalWaterDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfWaterProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfWaterProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalEarthDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = .01;
    var largeCharmValue = .03;

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfEarthProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfEarthProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }
}
