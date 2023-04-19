import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
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
  overlayRef: OverlayRef;

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
      effect.type === StatusEffectEnum.DamageTakenDown || effect.type === StatusEffectEnum.DamageTakenUp ||
      effect.type === StatusEffectEnum.BattleItemEffectUp || effect.type === StatusEffectEnum.AoeDamageUp)
      return true;

    return false;
  }

  isSplitStatUpDownEffect(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageDown ||
      effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageDown ||
      effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageDown ||
      effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageDown ||
      effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageDown ||
      effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageDown ||
      effect.type === StatusEffectEnum.AllElementalResistanceDown)
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
    if (effect.type === StatusEffectEnum.DamageDealtUp || effect.type === StatusEffectEnum.DamageDealtDown ||
      effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageDown ||
      effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageDown ||
      effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageDown ||
      effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageDown ||
      effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageDown ||
      effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageDown)
      return "DMG";
    if (effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.DamageTakenDown ||
      effect.type === StatusEffectEnum.AllElementalResistanceDown)
      return "TKN";
    if (effect.type === StatusEffectEnum.Dead)
      return "KO";
    if (effect.type === StatusEffectEnum.BattleItemEffectUp)
      return "ITM";
      if (effect.type === StatusEffectEnum.AoeDamageUp)
      return "AOE";

    return effect.type;
  }

  getSplitStatImage(effect: StatusEffect) {
    var img = "assets/svg/statUpSE.svg";

    if (effect.type === StatusEffectEnum.EarthDamageUp)
      img = "assets/svg/earth.svg";
      if (effect.type === StatusEffectEnum.AirDamageUp)
      img = "assets/svg/air.svg";
      if (effect.type === StatusEffectEnum.HolyDamageUp)
      img = "assets/svg/holy.svg";
      if (effect.type === StatusEffectEnum.LightningDamageUp)
      img = "assets/svg/lightning.svg";
      if (effect.type === StatusEffectEnum.FireDamageUp)
      img = "assets/svg/fire.svg";
      if (effect.type === StatusEffectEnum.WaterDamageUp)
      img = "assets/svg/water.svg";
      if (effect.type === StatusEffectEnum.AllElementalResistanceDown)
      img = "assets/svg/elementalResistanceDown.svg";

    return img;
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
    if (effect.type === StatusEffectEnum.WitheringToxin) {
      src += "witheringToxin.svg";
    }
    if (effect.type === StatusEffectEnum.VenomousToxin) {
      src += "venomousToxin.svg";
    }
    if (effect.type === StatusEffectEnum.HeroicElixir) {
      src += "heroicElixir.svg";
    }
    if (effect.type === StatusEffectEnum.RejuvenatingElixir) {
      src += "rejuvenatingElixir.svg";
    }
    if (effect.type === StatusEffectEnum.ElixirOfFortitude) {
      src += "elixirOfFortitude.svg";
    }
    if (effect.type === StatusEffectEnum.Thorns) {
      src += "thorns.svg";
    }
    if (effect.type === StatusEffectEnum.Dodge) {
      src += "dodge.svg";
    }
    if (effect.type === StatusEffectEnum.Enfire) {
      src += "enfire.svg";
    }
    if (effect.type === StatusEffectEnum.Enearth) {
      src += "enearth.svg";
    }
    if (effect.type === StatusEffectEnum.Enlightning) {
      src += "enlightning.svg";
    }
    if (effect.type === StatusEffectEnum.Enwater) {
      src += "enwater.svg";
    }
    if (effect.type === StatusEffectEnum.Enair) {
      src += "enair.svg";
    }
    if (effect.type === StatusEffectEnum.Enholy) {
      src += "enholy.svg";
    }
    if (effect.type === StatusEffectEnum.Taunt) {
      src += "taunt.svg";
    }
    if (effect.type === StatusEffectEnum.Stagger) {
      src += "stagger.svg";
    }
    if (effect.type === StatusEffectEnum.Unsteady) {
      src += "unbalanced.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Fire) {
      src += "barfire.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Earth) {
      src += "barearth.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Holy) {
      src += "barholy.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Lightning) {
      src += "barlightning.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Air) {
      src += "barair.svg";
    }
    if (effect.type === StatusEffectEnum.AbsorbElementalDamage && effect.element === ElementalTypeEnum.Water) {
      src += "barwater.svg";
    }
    if (effect.type === StatusEffectEnum.ReduceHealing) {
      src += "reduceHealing.svg";
    }
    if (effect.type === StatusEffectEnum.ReduceDirectDamage) {
      src += "reduceDirectDamage.svg";
    }
    if (effect.type === StatusEffectEnum.BlessingOfDionysus) {
      src += "boonOfDionysus.svg";
    }
    if (effect.type === StatusEffectEnum.Untargetable) {
      src += "plunge.svg";
    }
    if (effect.type === StatusEffectEnum.LordOfTheUnderworld) {
      src += "lordOfTheUnderworld.svg";
    }
    if (effect.type === StatusEffectEnum.Onslaught) {
      src += "onslaught.svg";
    }
    if (effect.type === StatusEffectEnum.Focus) {
      src += "focus.svg";
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

  preventRightClick() {
    return false;
  }

  overlayEmitter(overlayRef: OverlayRef) {    
    if (this.overlayRef !== undefined) {      
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }

  ngOnDestroy() {   
      if (this.overlayRef !== undefined) { 
        console.log("Destroy status effect overlay");       
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
  }
}
