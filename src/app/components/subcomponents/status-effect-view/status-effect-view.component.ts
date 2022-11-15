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

  //simple stat up or down
  isStatUpDownEffect(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.AgilityDown || effect.type === StatusEffectEnum.AgilityUp ||
      effect.type === StatusEffectEnum.AttackDown || effect.type === StatusEffectEnum.AttackUp ||
      effect.type === StatusEffectEnum.DefenseDown || effect.type === StatusEffectEnum.DefenseUp ||
      effect.type === StatusEffectEnum.LuckDown || effect.type === StatusEffectEnum.LuckUp ||
      effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.MaxHpUp ||
      effect.type === StatusEffectEnum.ResistanceDown || effect.type === StatusEffectEnum.ResistanceUp)
      return true;

    return false;
  }

  hasImage(effect: StatusEffect) {
    var imageSrc = this.getStatusEffectImage(effect);
    return imageSrc.charAt(imageSrc.length - 1) !== "/";
  }

  getStatusEffectText(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.AgilityDown || effect.type === StatusEffectEnum.AgilityUp)
      return "AGI";
    if (effect.type === StatusEffectEnum.AttackDown || effect.type === StatusEffectEnum.AttackUp)
      return "ATK";
    if (effect.type === StatusEffectEnum.DefenseDown || effect.type === StatusEffectEnum.DefenseUp)
      return "DEF";
    if (effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.MaxHpUp)
      return "HP";
    if (effect.type === StatusEffectEnum.LuckDown || effect.type === StatusEffectEnum.LuckUp)
      return "LCK";
    if (effect.type === StatusEffectEnum.ResistanceDown || effect.type === StatusEffectEnum.ResistanceUp)
      return "RES";
    if (effect.type === StatusEffectEnum.Stun)
      return "STUN";
    if (effect.type === StatusEffectEnum.DamageOverTime)
      return "DOT";
      if (effect.type === StatusEffectEnum.Taunt)
      return "TNT";

    return effect.type;
  }

  getStatusEffectImage(effect: StatusEffect) {
    var src = "assets/svg/";

    if (effect.type === StatusEffectEnum.Mark)
    {
      src += "mark.svg";
    }

    return src;
  }
}
