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
    this.redeemableCode.expirationDate = new Date('2024-04-01');   
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAmethystFragment, 20000));                      
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRubyFragment, 20000));                      
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectEmeraldFragment, 20000));                      
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectOpalFragment, 20000));                      
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAquamarineFragment, 20000));                      
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectTopazFragment, 20000));                      
    /*this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 500000));           
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Ambrosia, 20));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EternalMeleeTicket, 14));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalNuggets, 50));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileAmethystFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileAquamarineFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileEmeraldFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileRubyFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileOpalFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RutileTopazFragment, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.NecklaceSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ShieldSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.WeaponSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RingSlotAddition, 5));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArmorSlotAddition, 5));    
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalCore, 100));*/       
  }

  createCode() {
    this.setupRewards();
    var key = environment.CODEREDEMPTIONSECRET;
    var rewardString = JSON.stringify(this.redeemableCode);
    var encrypted = CryptoJS.AES.encrypt(rewardString, key);
    return encrypted.toString();
  }
}
