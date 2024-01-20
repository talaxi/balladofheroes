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
    this.redeemableCode.expirationDate = new Date('2024-03-01');            
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Subscriber, 1));       
    /*this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Subscriber, 1)); 
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 10000000));           
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Ambrosia, 200));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AthenasScythe, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AthenasShield, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AthenasArmor, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AthenasRing, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AthenasNecklace, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HermessStaff, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HermessShield, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HermessArmor, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HermessRing, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HermessNecklace, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissBow, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissShield, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissArmor, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissRing, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissNecklace, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosBow, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosShield, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosArmor, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosRing, 2));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosNecklace, 2)); 
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughOpalFragment, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAmethystFragment, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughRubyFragment, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughEmeraldFragment, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughTopazFragment, 2000));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughTopazFragment, 2000));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SoulEssence, 2000));       
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SatchelOfHerbs, 2000));   */    
  }

  createCode() {
    this.setupRewards();
    var key = environment.CODEREDEMPTIONSECRET;
    var rewardString = JSON.stringify(this.redeemableCode);
    var encrypted = CryptoJS.AES.encrypt(rewardString, key);
    return encrypted.toString();
  }
}
