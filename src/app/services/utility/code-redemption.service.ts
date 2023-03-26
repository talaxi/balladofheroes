import { Injectable } from '@angular/core';
import { GlobalService } from '../global/global.service';
import * as CryptoJS from 'crypto-js';
import { LookupService } from '../lookup.service';
import { environment } from 'src/environments/environment';
import { RedeemableCode } from 'src/app/models/utility/redeemable-code.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CodeRedemptionService {
  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService) { }

  getCodeItems(encryptedVal: string) {
    var key = environment.CODEREDEMPTIONSECRET;
    var decrypted = CryptoJS.AES.decrypt(encryptedVal, key);
    if (decrypted.toString(CryptoJS.enc.Utf8).length === 0) {
      return;
    }

    var list: ResourceValue[] = [];
    var parsedRewards = <RedeemableCode>JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    if (parsedRewards !== null && parsedRewards !== undefined && parsedRewards.rewards.length > 0) {

      parsedRewards.rewards.forEach(reward => {
        list.push(new ResourceValue(reward.item, reward.type, reward.amount));        
      });
    }

    return list;
  }

  redeemCode(encryptedVal: string) {
    var key = environment.CODEREDEMPTIONSECRET;
    var decrypted = CryptoJS.AES.decrypt(encryptedVal, key);
    if (decrypted.toString(CryptoJS.enc.Utf8).length === 0) {
      alert("Invalid code entered.");
      return false;
    }
    try {
      var parsedRewards = <RedeemableCode>JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

      if (parsedRewards !== null && parsedRewards !== undefined && parsedRewards.rewards.length > 0) {
        console.log(parsedRewards);
        if (new Date().getTime() > new Date(parsedRewards.expirationDate).getTime())
        {
          alert("This code has expired.");
          return false;
        }
        else if (this.globalService.globalVar.redeemedCodes.some(item => item.codeValue === decrypted.toString(CryptoJS.enc.Utf8)))
        {
          alert("This code has already been redeemed.");
          return false;
        }
        else {
          parsedRewards.rewards.forEach(reward => {
            this.lookupService.gainResource(reward);
            var itemName = (reward.amount === 1 ? this.lookupService.getItemName(reward.item) : this.utilityService.handlePlural(this.lookupService.getItemName(reward.item)));
            this.gameLogService.updateGameLog(GameLogEntryEnum.CodeRedemption, "You receive <strong>" + reward.amount + " " + itemName + "</strong> from a redeemed code.");
          });

          parsedRewards.codeValue = decrypted.toString(CryptoJS.enc.Utf8);
          this.globalService.globalVar.redeemedCodes.push(parsedRewards);
        }
      }
    }
    catch (error) {
      alert("You've run into an error! Please try again.");
      return false;
    }

    return true;
  }
}
