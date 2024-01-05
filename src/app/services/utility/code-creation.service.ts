import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { LookupService } from '../lookup.service';
import { environment } from 'src/environments/environment';
import { RedeemableCode } from 'src/app/models/utility/redeemable-code.model';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';

@Injectable({
  providedIn: 'root'
})
export class CodeCreationService {
  redeemableCode: RedeemableCode;

  constructor(private lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService) { }
  
  setupRewards() { 
    this.redeemableCode = new RedeemableCode();
    this.redeemableCode.expirationDate = new Date('2024-02-01');            
    //this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Subscriber, 1)); 
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 500000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EternalMeleeTicket, 10));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Ambrosia, 8));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalNuggets, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.NecklaceSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArmorSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ShieldSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RingSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.WeaponSlotAddition, 5));
  }

  createCode() {
    this.setupRewards();
    var key = environment.CODEREDEMPTIONSECRET;
    var rewardString = JSON.stringify(this.redeemableCode);
    var encrypted = CryptoJS.AES.encrypt(rewardString, key);
    return encrypted.toString();
  }
}
