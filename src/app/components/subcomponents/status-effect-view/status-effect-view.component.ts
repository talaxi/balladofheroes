import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Character } from 'src/app/models/character/character.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';

@Component({
  selector: 'app-status-effect-view',
  templateUrl: './status-effect-view.component.html',
  styleUrls: ['./status-effect-view.component.css']
})
export class StatusEffectViewComponent implements OnInit {
  @Input() character: Character;
  @Input() isBoss: boolean = false;
  displayCatchAll: StatusEffect;

  constructor(private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.displayCatchAll = new StatusEffect(StatusEffectEnum.StatusEffectDisplayCatchAll);
  }

  getPositiveStatusEffects() {
    //should also only display up to 6 effects + a catch all box
    var positiveEffects = this.character.battleInfo.statusEffects.filter(item => item.isPositive && !this.isEffectInvisible(item));
    //only display one thorns
    var foundThorns = false;
    positiveEffects = positiveEffects.filter(effect => {
      if (foundThorns && effect.type === StatusEffectEnum.Thorns) {
        return false;
      }

      if (effect.type === StatusEffectEnum.Thorns)
        foundThorns = true;

      return true;
    });

    var totalVisibleEffects = 6;
    var totalVisibleEffectCount = 0;

    if (this.deviceDetectorService.isMobile())
      totalVisibleEffects = 4;

    if (this.isBoss)
      totalVisibleEffects += 5;

    var shouldIncludeCatchAll = false;
    positiveEffects = positiveEffects.filter(effect => {
      if (totalVisibleEffectCount < totalVisibleEffects) {
        totalVisibleEffectCount += 1;
        return true;
      }
      if (!positiveEffects.some(item => item.type === StatusEffectEnum.StatusEffectDisplayCatchAll)) {
        shouldIncludeCatchAll = true;
      }

      return false;
    });

    if (shouldIncludeCatchAll)
      positiveEffects.push(this.displayCatchAll);

    return positiveEffects;
  }

  getNegativeStatusEffects() {
    var negativeEffects = this.character.battleInfo.statusEffects.filter(item => !item.isPositive && !this.isEffectInvisible(item));
    //only display one DoT
    var foundDoT = false;
    negativeEffects = negativeEffects.filter(effect => {
      if (foundDoT && effect.type === StatusEffectEnum.DamageOverTime) {
        return false;
      }

      if (effect.type === StatusEffectEnum.DamageOverTime)
        foundDoT = true;

      return true;
    });

    var totalVisibleEffects = 6;
    var totalVisibleEffectCount = 0;

    if (this.deviceDetectorService.isMobile())
      totalVisibleEffects = 4;

    if (this.isBoss)
      totalVisibleEffects += 5;

    var shouldIncludeCatchAll = false;
    negativeEffects = negativeEffects.filter(effect => {
      if (totalVisibleEffectCount < totalVisibleEffects) {
        totalVisibleEffectCount += 1;
        return true;
      }
      if (!negativeEffects.some(item => item.type === StatusEffectEnum.StatusEffectDisplayCatchAll)) {
        shouldIncludeCatchAll = true;
      }

      return false;
    });

    if (shouldIncludeCatchAll)
      negativeEffects.push(this.displayCatchAll);

    return negativeEffects;
  }

  isEffectInvisible(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.Dead || effect.type === StatusEffectEnum.InstantCounter)
      return true;

    return false;
  }
}
