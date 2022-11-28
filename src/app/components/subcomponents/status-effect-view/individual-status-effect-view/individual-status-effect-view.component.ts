import { Component, Input, OnInit } from '@angular/core';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-individual-status-effect-view',
  templateUrl: './individual-status-effect-view.component.html',
  styleUrls: ['./individual-status-effect-view.component.css']
})
export class IndividualStatusEffectViewComponent implements OnInit {
  @Input() isPositiveEffect: boolean;
  @Input() statusEffect: StatusEffect;

  constructor(private lookupService: LookupService) { }

  ngOnInit(): void {
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

  getStatusEffectDescription() {
    var description = this.lookupService.getStatusEffectDescription(this.statusEffect);

    return description;
  }
}
