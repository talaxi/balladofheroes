import { Component, OnInit } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-chthonic-reward-menu-view',
  templateUrl: './chthonic-reward-menu-view.component.html',
  styleUrls: ['./chthonic-reward-menu-view.component.css']
})
export class ChthonicRewardMenuViewComponent implements OnInit {

  primaryStatBoost = .1;

  constructor(public lookupService: LookupService, private globalService: GlobalService, private utilityService: UtilityService) { }

  ngOnInit(): void {

  }

  advancedUpgradesAvailable() {
    return this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked;
  }

  getChthonicPower() {
    return this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower);
  }

  getChthonicAttackBoost() {
    return this.globalService.globalVar.chthonicPowers.getAttackBoostPercent() * 100;
  }

  buyChthonicAttackBoost() {
    var requiredPower = this.getRequiredChthonicPowerForAttack();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.attackBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  getChthonicDefenseBoost() {
    return this.globalService.globalVar.chthonicPowers.getDefenseBoostPercent() * 100;
  }

  buyChthonicDefenseBoost() {
    var requiredPower = this.getRequiredChthonicPowerForDefense();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.defenseBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  getChthonicMaxHPBoost() {
    return this.globalService.globalVar.chthonicPowers.getMaxHpBoostPercent() * 100;;
  }

  buyChthonicMaxHPBoost() {
    var requiredPower = this.getRequiredChthonicPowerForMaxHp();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.maxHpBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member, false);
    });
  }

  getChthonicAgilityBoost() {
    return this.globalService.globalVar.chthonicPowers.getAgilityBoostPercent() * 100;
  }

  buyChthonicAgilityBoost() {
    var requiredPower = this.getRequiredChthonicPowerForAgility();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.agilityBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  getChthonicLuckBoost() {
    return this.globalService.globalVar.chthonicPowers.getLuckBoostPercent() * 100;
  }

  buyChthonicLuckBoost() {
    var requiredPower = this.getRequiredChthonicPowerForLuck();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.luckBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  getChthonicResistanceBoost() {
    return this.globalService.globalVar.chthonicPowers.getResistanceBoostPercent() * 100;
  }

  buyChthonicResistanceBoost() {
    var requiredPower = this.getRequiredChthonicPowerForResistance();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.resistanceBoostLevel += 1;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  getChthonicGodPrimaryStatResetIncreaseBoost() {
    return this.globalService.globalVar.chthonicPowers.getIncreasedGodPrimaryStatResetCount();
  }

  buyChthonicGodPrimaryStatResetIncreaseBoost() {
    var requiredPower = this.getRequiredChthonicPowerForPrimaryGodStatIncrease();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets += 1;
    }
  }

  getChthonicPartyPrimaryStatResetIncreaseBoost() {
    return this.globalService.globalVar.chthonicPowers.getIncreasedPartyPrimaryStatResetCount();
  }

  buyChthonicPartyPrimaryStatResetIncreaseBoost() {
    var requiredPower = this.getRequiredChthonicPowerForPrimaryPartyStatIncrease();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets += 1;
    }
  }

  getChthonicRetainGodLevelBoost() {
    return this.globalService.globalVar.chthonicPowers.getRetainGodLevelPercent() * 100;
  }

  buyChthonicRetainGodLevelBoost() {
    var requiredPower = this.getRequiredChthonicPowerForRetainGodLevel();
    if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) >= requiredPower) {
      this.lookupService.useResource(ItemsEnum.ChthonicPower, requiredPower);
      this.globalService.globalVar.chthonicPowers.retainGodLevel += 1;
    }
  }

  atRetainGodCap() {
    return this.getChthonicRetainGodLevelBoost() >= 25;
  }

  getRequiredChthonicPowerForAttack() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.attackBoostLevel);
  }

  getRequiredChthonicPowerForDefense() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.defenseBoostLevel);
  }

  getRequiredChthonicPowerForMaxHp() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.maxHpBoostLevel);
  }

  getRequiredChthonicPowerForAgility() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.agilityBoostLevel);
  }

  getRequiredChthonicPowerForLuck() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.luckBoostLevel);
  }

  getRequiredChthonicPowerForResistance() {
    return this.utilityService.getFibonacciValue(this.globalService.globalVar.chthonicPowers.resistanceBoostLevel);
  }

  getRequiredChthonicPowerForPrimaryGodStatIncrease() {
    var repeaterTotal = Math.floor(this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets / 4);
    var repeaterOrder = this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets % 4;

    if (repeaterOrder === 0)
      return 15 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 1)
      return 35 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 2)
      return 65 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 3)
      return 105 * Math.pow(10, 2 + repeaterTotal);

    return 0;
  }

  getRequiredChthonicPowerForPrimaryPartyStatIncrease() {
    var repeaterTotal = Math.floor(this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets / 3);
    var repeaterOrder = this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets % 3;

    if (repeaterOrder === 0)
      return 10 * Math.pow(10, 3 + repeaterTotal);
    if (repeaterOrder === 1)
      return 30 * Math.pow(10, 3 + repeaterTotal);
    if (repeaterOrder === 2)
      return 60 * Math.pow(10, 3 + repeaterTotal);

    return 0;
  }

  getRequiredChthonicPowerForRetainGodLevel() {
    var repeaterTotal = Math.floor(this.globalService.globalVar.chthonicPowers.retainGodLevel / 4);
    var repeaterOrder = this.globalService.globalVar.chthonicPowers.retainGodLevel % 4;

    if (repeaterOrder === 0)
      return 30 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 1)
      return 70 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 2)
      return 130 * Math.pow(10, 2 + repeaterTotal);
    if (repeaterOrder === 3)
      return 210 * Math.pow(10, 2 + repeaterTotal);

    return 0;
  }
}
