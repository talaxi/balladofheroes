import { Component, Input, OnInit } from '@angular/core';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-individual-status-effect-view',
  templateUrl: './individual-status-effect-view.component.html',
  styleUrls: ['./individual-status-effect-view.component.css']
})
export class IndividualStatusEffectViewComponent implements OnInit {
  @Input() isPositiveEffect: boolean;
  @Input() statusEffect: StatusEffect;

  constructor(private lookupService: LookupService, private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  //simple stat up or down
  isStatUpDownEffect(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.AgilityDown || effect.type === StatusEffectEnum.AgilityUp ||
      effect.type === StatusEffectEnum.AttackDown || effect.type === StatusEffectEnum.AttackUp ||
      effect.type === StatusEffectEnum.DefenseDown || effect.type === StatusEffectEnum.DefenseUp ||
      effect.type === StatusEffectEnum.LuckDown || effect.type === StatusEffectEnum.LuckUp ||
      effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.MaxHpUp ||
      effect.type === StatusEffectEnum.ResistanceDown || effect.type === StatusEffectEnum.ResistanceUp ||
      effect.type === StatusEffectEnum.DamageDealtDown || effect.type === StatusEffectEnum.DamageDealtUp ||
      effect.type === StatusEffectEnum.DamageTakenDown || effect.type === StatusEffectEnum.DamageTakenUp)
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
    if (effect.type === StatusEffectEnum.DamageDealtUp || effect.type === StatusEffectEnum.DamageDealtDown)
      return "DMG";
    if (effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.DamageTakenDown)
      return "TKN";
    if (effect.type === StatusEffectEnum.Taunt)
      return "TNT";
    if (effect.type === StatusEffectEnum.Dead)
      return "KO";

    return effect.type;
  }

  getStatUpImage(effect: StatusEffect) {
    var img = "assets/svg/statUpSE.svg";

    if (effect.type === StatusEffectEnum.DamageTakenDown)
      img = "assets/svg/invertStatUpSE.svg";

    return img;
  }

  getStatDownImage(effect: StatusEffect) {
    var img = "assets/svg/statDownSE.svg";

    if (effect.type === StatusEffectEnum.DamageTakenUp)
      img = "assets/svg/invertStatDownSE.svg";

    return img;
  }

  getStatusEffectImage(effect: StatusEffect) {
    var src = "assets/svg/";

    if (effect.type === StatusEffectEnum.Mark) {
      src += "mark.svg";
    }
    if (effect.type === StatusEffectEnum.Staccato) {
      src += "staccato.svg";
    }
    if (effect.type === StatusEffectEnum.Fortissimo) {
      src += "fortissimo.svg";
    }
    if (effect.type === StatusEffectEnum.Coda) {
      src += "coda.svg";
    }
    if (effect.type === StatusEffectEnum.ThousandCuts) {
      src += "thousandCuts.svg";
    }
    if (effect.type === StatusEffectEnum.Blind) {
      src += "blind.svg";
    }
    if (effect.type === StatusEffectEnum.Stun) {
      src += "stun.svg";
    }
    if (effect.type === StatusEffectEnum.Paralyze) {
      src += "paralyze.svg";
    }
    if (effect.type === StatusEffectEnum.InstantHealAfterAutoAttack) {
      src += "healAfterAutoAttack.svg";
    }
    if (effect.type === StatusEffectEnum.DamageOverTime) {
      src += "bloodDoT.svg";
    }
    if (effect.type === StatusEffectEnum.RecentlyDefeated) {
      src += "skull.svg";
    }
    if (effect.type === StatusEffectEnum.DebilitatingToxin) {
      src += "debilitatingToxin.svg";
    }
    if (effect.type === StatusEffectEnum.PoisonousToxin) {
      src += "poisonousToxin.svg";
    }
    if (effect.type === StatusEffectEnum.HeroicElixir) {
      src += "heroicElixir.svg";
    }

    return src;
  }

  getStatusEffectDescription() {
    var description = this.lookupService.getStatusEffectDescription(this.statusEffect);

    return description;
  }

  getStatusEffectDuration() {
    var duration = Math.round(this.statusEffect.duration);
    var durationString = "";
    if (duration < 60)
      durationString = duration + " seconds";
    else
      durationString = Math.ceil(duration / 60) + " minutes";

    return durationString;
  }
}
