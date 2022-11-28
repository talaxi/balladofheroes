import { Component, Input, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {

  }

  getPositiveStatusEffects() {
    return this.character.battleInfo.statusEffects.filter(item => item.isPositive && !this.isEffectInvisible(item));
  }

  getNegativeStatusEffects() {
    return this.character.battleInfo.statusEffects.filter(item => !item.isPositive  && !this.isEffectInvisible(item));
  }

  isEffectInvisible(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.Dead)
      return true;

    return false;
  }  
}
