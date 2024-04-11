import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

@Injectable({
  providedIn: 'root'
})
export class CharmService {

  constructor() { }

  getTotalHpRegenAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfRejuvenationValue();
    var largeCharmValue = this.getLargeCharmOfRejuvenationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfRejuvenation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfRejuvenation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfRejuvenationValue() {
    return 1;
  }

  getLargeCharmOfRejuvenationValue() {
    return 3;
  }

  getTotalCriticalMultiplierAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfVulnerabilityValue();
    var largeCharmValue = this.getLargeCharmOfVulnerabilityValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfVulnerability);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfVulnerability);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfVulnerabilityValue() {
    return .0375;
  }

  getLargeCharmOfVulnerabilityValue() {
    return .1125;
  }

  getTotalOverdriveGainAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfDeterminationValue();
    var largeCharmValue = this.getLargeCharmOfDeterminationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfDetermination);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfDetermination);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfDeterminationValue() {
    return .02;
  }

  getLargeCharmOfDeterminationValue() {
    return .06;
  }

  getTotalArmorPenetrationAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfIngenuityValue();
    var largeCharmValue = this.getLargeCharmOfIngenuityValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfIngenuity);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfIngenuity);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfIngenuityValue() {
    return .0025;
  }

  getLargeCharmOfIngenuityValue() {
    return .0075;
  }

  getTotalAbilityCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfPreparationValue();
    var largeCharmValue = this.getLargeCharmOfPreparationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfPreparation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfPreparation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfPreparationValue() {
    return .005;
  }

  getLargeCharmOfPreparationValue() {
    return .015;
  }

  getTotalAutoAttackCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHasteValue();
    var largeCharmValue = this.getLargeCharmOfHasteValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHaste);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHaste);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHasteValue() {
    return .005;
  }

  getLargeCharmOfHasteValue() {
    return .015;
  }

  getSmallCharmOfElementalDestructionValue() {
    return .025;
  }

  getLargeCharmOfElementalDestructionValue() {
    return .075;
  }

  getSmallCharmOfElementalResistanceValue() {
    return .01;
  }

  getLargeCharmOfElementalResistanceValue() {
    return .03;
  }

  getTotalHolyDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

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
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfEarthProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfEarthProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalHealingReceivedAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfAthenaValue();
    var largeCharmValue = this.getLargeCharmOfAthenaValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAthena);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAthena);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Athena || character.assignedGod2 === GodEnum.Athena))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Athena || character.assignedGod2 === GodEnum.Athena))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfAthenaValue() {
    return .025;
  }

  getLargeCharmOfAthenaValue() {
    return .075;
  }

  getTotalDebuffDurationAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfArtemisValue();
    var largeCharmValue = this.getLargeCharmOfArtemisValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfArtemis);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfArtemis);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Artemis || character.assignedGod2 === GodEnum.Artemis))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Artemis || character.assignedGod2 === GodEnum.Artemis))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfArtemisValue() {
    return .015;
  }

  getLargeCharmOfArtemisValue() {
    return .045;
  }

  getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHermesValue();
    var largeCharmValue = this.getLargeCharmOfHermesValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHermes);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHermes);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hermes || character.assignedGod2 === GodEnum.Hermes))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hermes || character.assignedGod2 === GodEnum.Hermes))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHermesValue() {
    return .05;
  }

  getLargeCharmOfHermesValue() {
    return .15;
  }

  getTotalHealingDoneAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfApolloValue();
    var largeCharmValue = this.getLargeCharmOfApolloValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfApollo);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfApollo);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Apollo || character.assignedGod2 === GodEnum.Apollo))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Apollo || character.assignedGod2 === GodEnum.Apollo))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfApolloValue() {
    return .025;
  }

  getLargeCharmOfApolloValue() {
    return .075;
  }

  getTotalTickFrequencyAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfAresValue();
    var largeCharmValue = this.getLargeCharmOfAresValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAres);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAres);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Ares || character.assignedGod2 === GodEnum.Ares))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Ares || character.assignedGod2 === GodEnum.Ares))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfAresValue() {
    return .02;
  }

  getLargeCharmOfAresValue() {
    return .05;
  }

  getTotalAoeDamageAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHadesValue();
    var largeCharmValue = this.getLargeCharmOfHadesValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHades);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHades);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hades || character.assignedGod2 === GodEnum.Hades))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hades || character.assignedGod2 === GodEnum.Hades))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHadesValue() {
    return .02;
  }

  getLargeCharmOfHadesValue() {
    return .05;
  }

  getTotalAbilityCooldownReductionWithBuffsFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfDionysusValue();
    var largeCharmValue = this.getLargeCharmOfDionysusValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfDionysus);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfDionysus);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Dionysus || character.assignedGod2 === GodEnum.Dionysus))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Dionysus || character.assignedGod2 === GodEnum.Dionysus))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfDionysusValue() {
    return .005;
  }

  getLargeCharmOfDionysusValue() {
    return .015;
  }

  getTotalAbilityCooldownReductionStartAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfPoseidonValue();
    var largeCharmValue = this.getLargeCharmOfPoseidonValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfPoseidon);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfPoseidon);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Poseidon || character.assignedGod2 === GodEnum.Poseidon))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Poseidon || character.assignedGod2 === GodEnum.Poseidon))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfPoseidonValue() {
    return .02;
  }

  getLargeCharmOfPoseidonValue() {
    return .06;
  }

  getTotalThornsAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfNemesisValue();
    var largeCharmValue = this.getLargeCharmOfNemesisValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfNemesis);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfNemesis);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getElementResistanceReductionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfZeusValue();
    var largeCharmValue = this.getLargeCharmOfZeusValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfZeus);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfZeus);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Zeus || character.assignedGod2 === GodEnum.Zeus))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Zeus || character.assignedGod2 === GodEnum.Zeus))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalBuffDurationAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHeraValue();
    var largeCharmValue = this.getLargeCharmOfHeraValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHera);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHera);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hera || character.assignedGod2 === GodEnum.Hera))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Hera || character.assignedGod2 === GodEnum.Hera))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHeraValue() {
    return .015;
  }

  getLargeCharmOfHeraValue() {
    return .045;
  }

  getTotalAllyDamageAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfAphroditeValue();
    var largeCharmValue = this.getLargeCharmOfAphroditeValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAphrodite);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAphrodite);

    if (smallCharm !== undefined && smallCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Aphrodite || character.assignedGod2 === GodEnum.Aphrodite))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 &&
      (character.assignedGod1 === GodEnum.Aphrodite || character.assignedGod2 === GodEnum.Aphrodite))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfAphroditeValue() {
    return .015;
  }

  getLargeCharmOfAphroditeValue() {
    return .045;
  }

  getSmallCharmOfZeusValue() {
    return .01;
  }

  getLargeCharmOfZeusValue() {
    return .03;
  }

  getSmallCharmOfNemesisValue() {
    return .05;
  }

  getLargeCharmOfNemesisValue() {
    return .15;
  }

  getSmallOrnateKantharosValue() {
    return 30;
  }

  getSmallSilverKantharosValue() {
    return 30;
  }

  getSmallBuccheroKantharosValue() {
    return 30;
  }

  getSmallGildedKantharosValue() {
    return 30;
  }

  getSmallCrackedKantharosValue() {
    return 150;
  }

  getSmallBlackKantharosValue() {
    return 30;
  }

  getLargeOrnateKantharosValue() {
    return 200;
  }

  getLargeSilverKantharosValue() {
    return 200;
  }

  getLargeBuccheroKantharosValue() {
    return 200;
  }

  getLargeGildedKantharosValue() {
    return 200;
  }

  getLargeCrackedKantharosValue() {
    return 1000;
  }

  getLargeBlackKantharosValue() {
    return 200;
  }

  getPerfectOrnateKantharosValue() {
    return 20000;
  }

  getPerfectSilverKantharosValue() {
    return 20000;
  }

  getPerfectBuccheroKantharosValue() {
    return 20000;
  }

  getPerfectGildedKantharosValue() {
    return 20000;
  }

  getPerfectCrackedKantharosValue() {
    return 100000;
  }

  getPerfectBlackKantharosValue() {
    return 20000;
  }

  getTotalMaxHpAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCrackedKantharosValue();
    var largeCharmValue = this.getLargeCrackedKantharosValue();
    var perfectCharmValue = this.getPerfectCrackedKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCrackedKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCrackedKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectCrackedKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }

  getTotalAttackAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallBlackKantharosValue();
    var largeCharmValue = this.getLargeBlackKantharosValue();
    var perfectCharmValue = this.getPerfectBlackKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallBlackKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeBlackKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectBlackKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }

  getTotalLuckAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallOrnateKantharosValue();
    var largeCharmValue = this.getLargeOrnateKantharosValue();
    var perfectCharmValue = this.getPerfectOrnateKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallOrnateKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeOrnateKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectOrnateKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }

  getTotalAgilityAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallBuccheroKantharosValue();
    var largeCharmValue = this.getLargeBuccheroKantharosValue();
    var perfectCharmValue = this.getPerfectBuccheroKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallBuccheroKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeBuccheroKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectBuccheroKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }

  getTotalDefenseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallGildedKantharosValue();
    var largeCharmValue = this.getLargeGildedKantharosValue();
    var perfectCharmValue = this.getPerfectGildedKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallGildedKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeGildedKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectGildedKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }

  getTotalResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallSilverKantharosValue();
    var largeCharmValue = this.getLargeSilverKantharosValue();
    var perfectCharmValue = this.getPerfectSilverKantharosValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallSilverKantharos);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeSilverKantharos);
    var perfectCharm = resources.find(item => item.item === ItemsEnum.PerfectSilverKantharos);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;

    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    if (perfectCharm !== undefined && perfectCharm.amount > 0)
      amount += perfectCharmValue * perfectCharm.amount;

    return amount;
  }
}
