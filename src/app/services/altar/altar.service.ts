import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AltarService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService) { }

  getTutorialAltar() {
    var altar = new AltarInfo();
    altar.type = AltarEnum.Small;
    altar.god = GodEnum.Athena;
    altar.condition = AltarConditionEnum.Victories;
    altar.conditionCount = altar.conditionMax = 1;

    return altar;
  }

  getNewSmallAltar() {
    var altar = new AltarInfo();

    altar.type = AltarEnum.Small;
    altar.god = this.lookupService.getRandomGodEnum();
    altar.condition = this.getRandomSmallAltarCondition();
    altar.conditionMax = this.getAltarMaxConditions(altar);

    return altar;
  }

  getAltarMaxConditions(altar: AltarInfo) {
    var maxCount = 0;

    if (altar.condition === AltarConditionEnum.OverdriveUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 6;
    }
    if (altar.condition === AltarConditionEnum.Victories) {
      if (altar.type === AltarEnum.Small)
        maxCount = 25;
    }
    if (altar.condition === AltarConditionEnum.AutoAttackUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 60;
    }
    if (altar.condition === AltarConditionEnum.AbilityUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = 50;
    }

    return maxCount;
  }

  incrementAltarCount(condition: AltarConditionEnum) {
    this.globalService.globalVar.altarInfo.forEach(altar => {
      if (altar.condition === condition && altar.conditionCount < altar.conditionMax)
        altar.conditionCount += 1;
    });
  }

  getButtonOptions(altar: AltarInfo) {
    var options: AltarPrayOptionsEnum[] = [];

    if (altar.type === AltarEnum.Small) {
      options.push(AltarPrayOptionsEnum.Strength);
      options.push(AltarPrayOptionsEnum.Fortune);
    }

    return options;
  }

  getButtonText(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    var text = "";

    if (option === AltarPrayOptionsEnum.Strength)
      text = "Pray for Strength";
    if (option === AltarPrayOptionsEnum.Fortune)
      text = "Pray for Fortune";

    return text;
  }

  pray(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    this.globalService.globalVar.altarInfo = this.globalService.globalVar.altarInfo.filter(item => item != altar);

    if (altar.type === AltarEnum.Small)
    {
      this.setAltarEffect(option, altar);

      var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);
      if (god !== undefined)
      {
        god.affinityExp += this.utilityService.smallAltarAffinityGain;
        if (god.affinityExp >= god.affinityExpToNextLevel)
        {
          god.affinityExp -= god.affinityExpToNextLevel;
          god.affinityLevel += 1;
        }
      }

      this.globalService.globalVar.altarInfo.push(this.getNewSmallAltar());
    }
  }

  setAltarEffect(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    //if strength, give stat buff
    var altarEffect = new AltarEffect();

    if (altar.type === AltarEnum.Small && option === AltarPrayOptionsEnum.Strength)
    {      
      altarEffect.type = AltarEffectsEnum.SmallAltarPrayStrength;
      altarEffect.duration = 2 * 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && option === AltarPrayOptionsEnum.Fortune)
    {     
      altarEffect.type = AltarEffectsEnum.SmallAltarPrayFortune;
      altarEffect.duration = 2 * 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
    }

    this.globalService.globalVar.activeAltarEffects.push(altarEffect);
  }

  getRandomSmallAltarCondition() {
    var availableEnums: AltarConditionEnum[] = [];

    for (const [propertyKey, propertyValue] of Object.entries(AltarConditionEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as AltarConditionEnum;
      //break down what can be chosen for small, large, etc
      if (enumValue !== AltarConditionEnum.None && enumValue !== AltarConditionEnum.CoinSpent)
        availableEnums.push(enumValue);
    }

    var rng = this.utilityService.getRandomInteger(0, availableEnums.length - 1);

    return availableEnums[rng];
  }
}
