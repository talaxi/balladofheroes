import { Injectable } from '@angular/core';
import { MeleteActionEnum } from 'src/app/models/enums/melete-action-enum.model';
import { GlobalService } from '../global/global.service';
import { Melete } from 'src/app/models/melete/melete.model';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class MeleteService {
  private exhaleDeeplyTranquilityBonus = 10;

  constructor(private globalService: GlobalService, private lookupService: LookupService) { }

  handleAction(action: MeleteActionEnum) {
    var melete = this.globalService.globalVar.melete;
    var cooldown = this.getActionCooldown(action);

    if (action === MeleteActionEnum.BreatheInDeeply) {
      melete.resources.tranquility += 5;
    }
    if (action === MeleteActionEnum.ReflectOnSelf) {
      melete.resources.confidence += 2;
    }
    if (action === MeleteActionEnum.ReflectOnOthers) {
      melete.resources.faith += 2;
    }
    if (action === MeleteActionEnum.ExhaleDeeply) {
      var expGain = melete.resources.tranquility * this.exhaleDeeplyTranquilityBonus;
      this.lookupService.giveCharactersBonusExp(expGain);
      this.endMeleteSession();
    }

    //post action checks
    melete.activeActions.push([action, cooldown]);

    if (melete.resources.tranquility >= 5)
    {
      melete.resources.faithUnlocked = true;
      melete.resources.confidenceUnlocked = true;
    }
  }

  getActionCooldown(action: MeleteActionEnum) {
    var cooldown = 0;
    if (action === MeleteActionEnum.BreatheInDeeply) {
      cooldown = 3;
    }
    if (action === MeleteActionEnum.ReflectOnSelf) {
      cooldown = 3;
    }
    if (action === MeleteActionEnum.ReflectOnOthers) {
      cooldown = 3;
    }

    return cooldown;
  }

  endMeleteSession() {
    this.globalService.globalVar.melete = new Melete();
  }

  getActiveAction(action: MeleteActionEnum) {
    return this.globalService.globalVar.melete.activeActions.find(item => item[0] === action);
  }
}
