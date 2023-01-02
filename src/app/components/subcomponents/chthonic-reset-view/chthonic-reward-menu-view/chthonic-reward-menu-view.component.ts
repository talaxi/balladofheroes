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
      this.globalService.calculateCharacterBattleStats(member);
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
}
