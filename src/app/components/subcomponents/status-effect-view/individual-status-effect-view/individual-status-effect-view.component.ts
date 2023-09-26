import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
import { StatusEffect } from 'src/app/models/battle/status-effect.model';
import { Character } from 'src/app/models/character/character.model';
import { EffectResolutionEnum } from 'src/app/models/enums/effect-resolution-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-individual-status-effect-view',
  templateUrl: './individual-status-effect-view.component.html',
  styleUrls: ['./individual-status-effect-view.component.css']
})
export class IndividualStatusEffectViewComponent implements OnInit {
  @Input() isPositiveEffect: boolean;
  @Input() statusEffect: StatusEffect;
  @Input() character: Character;
  @Input() displayedEffects: StatusEffect[]
  overlayRef: OverlayRef;

  constructor(private lookupService: LookupService, private utilityService: UtilityService, private dictionaryService: DictionaryService) { }

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
      effect.type === StatusEffectEnum.BattleItemEffectUp || effect.type === StatusEffectEnum.AoeDamageUp ||
      effect.type === StatusEffectEnum.DamageOverTimeDamageUp || effect.type === StatusEffectEnum.AllPrimaryStatsExcludeHpUp ||
      effect.type === StatusEffectEnum.AllPrimaryStatsUp || 
      effect.type === StatusEffectEnum.ArmorPenetrationUp || effect.type === StatusEffectEnum.ArmorPenetrationDown ||
      effect.type === StatusEffectEnum.HpRegenUp)
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
      effect.type === StatusEffectEnum.AllElementalResistanceDown || effect.type === StatusEffectEnum.DamageOverTimeTakenDown ||
      effect.type === StatusEffectEnum.EarthDamageTakenUp || effect.type === StatusEffectEnum.EarthDamageTakenDown ||
      effect.type === StatusEffectEnum.AirDamageTakenUp || effect.type === StatusEffectEnum.AirDamageTakenDown ||
      effect.type === StatusEffectEnum.WaterDamageTakenUp || effect.type === StatusEffectEnum.WaterDamageTakenDown ||
      effect.type === StatusEffectEnum.LightningDamageTakenUp || effect.type === StatusEffectEnum.LightningDamageTakenDown ||
      effect.type === StatusEffectEnum.HolyDamageTakenUp || effect.type === StatusEffectEnum.HolyDamageTakenDown ||
      effect.type === StatusEffectEnum.FireDamageTakenUp || effect.type === StatusEffectEnum.FireDamageTakenDown ||
      effect.type === StatusEffectEnum.ThornsDamageTakenUp || effect.type === StatusEffectEnum.ThornsDamageUp ||
      effect.type === StatusEffectEnum.AllElementalResistanceUp)
      return true;

    return false;
  }

  isNumericalEffect(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.DamageOverTime && this.getEffectCount() > 1)
      return true;

    return false;
  }

  hasImage(effect: StatusEffect) {
    var imageSrc = this.getStatusEffectImage(effect);

    return imageSrc.charAt(imageSrc.length - 1) !== "/";
  }

  getNumericalImage(effect: StatusEffect) {
    var src = "assets/svg/";

    if (effect.type === StatusEffectEnum.DamageOverTime) {
      src += "fullBloodDoT.svg";
    }

    return src;
  }

  getNumericalText(effect: StatusEffect) {
    var text = "";

    if (effect.type === StatusEffectEnum.DamageOverTime) {
      text += "X" + this.getEffectCount();
    }

    return text;
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
    if (effect.type === StatusEffectEnum.AllPrimaryStatsExcludeHpUp || effect.type === StatusEffectEnum.AllPrimaryStatsUp)
      return "ALL";
    if (effect.type === StatusEffectEnum.DamageDealtUp || effect.type === StatusEffectEnum.DamageDealtDown ||
      effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageDown ||
      effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageDown ||
      effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageDown ||
      effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageDown ||
      effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageDown ||
      effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageDown ||
      effect.type === StatusEffectEnum.ThornsDamageUp)
      return "DMG";
    if (effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.DamageTakenDown ||
      effect.type === StatusEffectEnum.AllElementalResistanceDown || effect.type === StatusEffectEnum.AllElementalResistanceUp ||
      effect.type === StatusEffectEnum.EarthDamageTakenUp || effect.type === StatusEffectEnum.EarthDamageTakenDown ||
      effect.type === StatusEffectEnum.AirDamageTakenUp || effect.type === StatusEffectEnum.AirDamageTakenDown ||
      effect.type === StatusEffectEnum.LightningDamageTakenUp || effect.type === StatusEffectEnum.LightningDamageTakenDown ||
      effect.type === StatusEffectEnum.WaterDamageTakenUp || effect.type === StatusEffectEnum.WaterDamageTakenDown ||
      effect.type === StatusEffectEnum.FireDamageTakenUp || effect.type === StatusEffectEnum.FireDamageTakenDown ||
      effect.type === StatusEffectEnum.HolyDamageTakenUp || effect.type === StatusEffectEnum.HolyDamageTakenDown ||
      effect.type === StatusEffectEnum.ThornsDamageTakenUp)
      return "TKN";
    if (effect.type === StatusEffectEnum.Dead)
      return "KO";
    if (effect.type === StatusEffectEnum.BattleItemEffectUp)
      return "ITM";
    if (effect.type === StatusEffectEnum.AoeDamageUp)
      return "AOE";
      if (effect.type === StatusEffectEnum.DamageOverTimeDamageUp || effect.type === StatusEffectEnum.DamageOverTimeTakenDown)
      return "DOT";
    if (effect.type === StatusEffectEnum.ArmorPenetrationUp || effect.type === StatusEffectEnum.ArmorPenetrationDown)
      return "PEN";
      if (effect.type === StatusEffectEnum.HpRegenUp)
      return "RGN";
    if (effect.type === StatusEffectEnum.StatusEffectDisplayCatchAll) {
      var hiddenEffectCount = 0;

      if (this.character !== undefined) {
        if (this.isPositiveEffect) {
          this.character.battleInfo.statusEffects.filter(item => item.isPositive && !this.isEffectInvisible(item)).forEach(item => {
            if (!this.displayedEffects.some(displayedEffect => displayedEffect.type === item.type)) {
              hiddenEffectCount += 1;
            }
          });
        }
        if (!this.isPositiveEffect) {
          this.character.battleInfo.statusEffects.filter(item => !item.isPositive && !this.isEffectInvisible(item)).forEach(item => {
            if (!this.displayedEffects.some(displayedEffect => displayedEffect.type === item.type)) {
              hiddenEffectCount += 1;
            }
          });
        }
      }

      return "+" + hiddenEffectCount;
    }

    return effect.type;
  }

  getSplitStatImage(effect: StatusEffect) {
    var img = "assets/svg/statUpSE.svg";

    if (effect.type === StatusEffectEnum.EarthDamageUp || effect.type === StatusEffectEnum.EarthDamageTakenUp)
      img = "assets/svg/earth.svg";
    if (effect.type === StatusEffectEnum.AirDamageUp || effect.type === StatusEffectEnum.AirDamageTakenUp)
      img = "assets/svg/air.svg";
    if (effect.type === StatusEffectEnum.HolyDamageUp || effect.type === StatusEffectEnum.HolyDamageTakenUp)
      img = "assets/svg/holy.svg";
    if (effect.type === StatusEffectEnum.LightningDamageUp || effect.type === StatusEffectEnum.LightningDamageTakenUp)
      img = "assets/svg/largeLightning.svg";
    if (effect.type === StatusEffectEnum.FireDamageUp || effect.type === StatusEffectEnum.FireDamageTakenUp)
      img = "assets/svg/fire.svg";
    if (effect.type === StatusEffectEnum.WaterDamageUp || effect.type === StatusEffectEnum.WaterDamageTakenUp)
      img = "assets/svg/water.svg";
    if (effect.type === StatusEffectEnum.AllElementalResistanceDown || effect.type === StatusEffectEnum.AllElementalResistanceUp)
      img = "assets/svg/elementalResistanceDown.svg";
    if (effect.type === StatusEffectEnum.DamageOverTimeTakenDown)
      img = "assets/svg/shieldSlam.svg";
      if (effect.type === StatusEffectEnum.ThornsDamageTakenUp || effect.type === StatusEffectEnum.ThornsDamageUp)
      img = "assets/svg/thorns.svg";

    return img;
  }

  getStatUpImage(effect: StatusEffect) {
    var img = "assets/svg/statUpSE.svg";

    if (effect.type === StatusEffectEnum.DamageTakenDown || effect.type === StatusEffectEnum.FireDamageTakenDown ||
      effect.type === StatusEffectEnum.EarthDamageTakenDown || effect.type === StatusEffectEnum.LightningDamageTakenDown ||
      effect.type === StatusEffectEnum.HolyDamageTakenDown || effect.type === StatusEffectEnum.WaterDamageTakenDown ||
      effect.type === StatusEffectEnum.AirDamageTakenDown || effect.type === StatusEffectEnum.AllElementalResistanceUp)
      img = "assets/svg/invertStatUpSE.svg";

    return img;
  }

  getStatDownImage(effect: StatusEffect) {
    var img = "assets/svg/statDownSE.svg";

    if (effect.type === StatusEffectEnum.DamageTakenUp || effect.type === StatusEffectEnum.FireDamageTakenUp ||
      effect.type === StatusEffectEnum.EarthDamageTakenUp || effect.type === StatusEffectEnum.LightningDamageTakenUp ||
      effect.type === StatusEffectEnum.HolyDamageTakenUp || effect.type === StatusEffectEnum.WaterDamageTakenUp ||
      effect.type === StatusEffectEnum.AirDamageTakenUp || effect.type === StatusEffectEnum.ThornsDamageTakenUp)
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
    if (effect.type === StatusEffectEnum.SandToxin) {
      src += "sandToxin.svg";
    }
    if (effect.type === StatusEffectEnum.ElectrifiedToxin) {
      src += "electrifiedToxin.svg";
    }
    if (effect.type === StatusEffectEnum.MagicToxin) {
      src += "magicToxin.svg";
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
    if (effect.type === StatusEffectEnum.ElixirOfSpeed) {
      src += "elixirOfSpeed.svg";
    }
    if (effect.type === StatusEffectEnum.ElixirOfFortune) {
      src += "elixirOfFortune.svg";
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
    if (effect.type === StatusEffectEnum.Insight) {
      src += "insight.svg";
    }
    if (effect.type === StatusEffectEnum.AutoAttackSpeedUp) {
      src += "attackSpeedUp.svg";
    }
    if (effect.type === StatusEffectEnum.AutoAttackInvulnerable) {
      src += "autoAttackInvulnerability.svg";
    }
    if (effect.type === StatusEffectEnum.Invulnerable) {
      src += "invulnerability.svg";
    }
    if (effect.type === StatusEffectEnum.Unsteady) {
      src += "unbalanced.svg";
    }
    if (effect.type === StatusEffectEnum.AbilitySpeedUp) {
      src += "abilitySpeedUp.svg";
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
    if (effect.type === StatusEffectEnum.DispenserOfDues) {
      src += "dispenserOfDues.svg";
    }
    if (effect.type === StatusEffectEnum.ChainsOfFate) {
      src += "chainsOfFate.svg";
    }
    if (effect.type === StatusEffectEnum.Retribution) {
      src += "retribution.svg";
    }
    if (effect.type === StatusEffectEnum.Surge) {
      src += "surge.svg";
    }
    if (effect.type === StatusEffectEnum.Thyrsus) {
      src += "thyrsus.svg";
    }
    if (effect.type === StatusEffectEnum.FlamingToxin) {
      src += "flamingToxin.svg";
    }
    if (effect.type === StatusEffectEnum.ParalyzingToxin) {
      src += "paralyzingToxin.svg";
    }
    if (effect.type === StatusEffectEnum.PreventEscape) {
      src += "preventEscape.svg";
    }
    if (effect.type === StatusEffectEnum.ExtraTrueDamage) {
      src += "extraTrueDamage.svg";
    }
    if (effect.type === StatusEffectEnum.Immobilize || effect.type === StatusEffectEnum.CastingImmobilize) {
      src += "strangle.svg";
    }
    if (effect.type === StatusEffectEnum.RepeatDamageAfterDelay) {
      src += "chainLightning.svg";
    }
    if (effect.type === StatusEffectEnum.DivineProtection) {
      src += "divineProtection.svg";
    }
    if (effect.type === StatusEffectEnum.FastDebuffs) {
      src += "boonOfDionysus.svg";
    }
    if (effect.type === StatusEffectEnum.OstinatoAfter) {
      src += "ostinato.svg";
    }
    if (effect.type === StatusEffectEnum.GaiasBlessing) {
      src += "earth.svg";
    }
    if (effect.type === StatusEffectEnum.StockpileRock) {
      src += "heftyStone.svg";
    }
    if (effect.type === StatusEffectEnum.EarthenOffense) {
      src += "sword.svg";
    }
    if (effect.type === StatusEffectEnum.EarthenDefense) {
      src += "shieldSlam.svg";
    }
    if (effect.type === StatusEffectEnum.HealAfterDuration) {
      src += "heal.svg";
    }
    if (effect.type === StatusEffectEnum.CounterStun) {
      src += "lightning.svg";
    }
    if (effect.type === StatusEffectEnum.AbilityAppliesDebuff) {
      src += "abilityAppliesDebuff.svg";
    }
    if (effect.type === StatusEffectEnum.HealingDoneUp) {
      src += "healingDoneUp.svg";
    }
    if (effect.type === StatusEffectEnum.Flow) {
      src += "flow.svg";
    }
    if (effect.type === StatusEffectEnum.KingOfTheSea) {
      src += "kingOfTheSea.svg";
    }

    return src;
  }

  getStatusEffectDescription() {
    var description = "";
    if (this.getEffectCount() > 1 && this.statusEffect.type === StatusEffectEnum.DamageOverTime) {    
      this.character.battleInfo.statusEffects.filter(item => item.type === this.statusEffect.type).forEach((effect, index, array) => {
        description += this.lookupService.getStatusEffectDescription(effect, this.character) + "<br/><br/>";
        description += this.getStatusEffectDuration(effect);
        if (!Object.is(array.length - 1, index))
          description += "<hr/>";
      });
    }
    else if (this.statusEffect.type === StatusEffectEnum.StatusEffectDisplayCatchAll) {
      if (this.character !== undefined) {
        if (this.isPositiveEffect) {
          this.character.battleInfo.statusEffects.filter(item => item.isPositive && !this.isEffectInvisible(item)).forEach((item, index, array) => {
            if (!this.displayedEffects.some(displayedEffect => displayedEffect.type === item.type)) {
              description += this.lookupService.getStatusEffectDescription(item, this.character) + "<br/><br/>";
              description += this.getStatusEffectDuration(item);
              if (!Object.is(array.length - 1, index))
              description += "<hr/>";
            }
          });
        }
        if (!this.isPositiveEffect) {
          this.character.battleInfo.statusEffects.filter(item => !item.isPositive && !this.isEffectInvisible(item)).forEach((item, index, array) => {
            if (!this.displayedEffects.some(displayedEffect => displayedEffect.type === item.type)) {
              description += this.lookupService.getStatusEffectDescription(item, this.character) + "<br/><br/>";
              description += this.getStatusEffectDuration(item);
              if (!Object.is(array.length - 1, index))
              description += "<hr/>";
            }
          });
        }
      }

    }
    else {
      description = this.lookupService.getStatusEffectDescription(this.statusEffect, this.character) + "<br/><br/>" + this.getStatusEffectDuration();;
    }

    return description;
  }

  getStatusEffectDuration(effect?: StatusEffect) {
    if (effect === undefined)
      effect = this.statusEffect;

    if (effect.duration < 0) {
      if (effect.resolution !== undefined) {
        if (effect.resolution === EffectResolutionEnum.AlwaysActiveEquipment)
          return "Always Active - " + this.dictionaryService.getItemName(Number(effect.caster));
        else if (effect.resolution === EffectResolutionEnum.AlwaysActive)
          return "Always Active";
      }
      else
        return "Resolves Upon Effect Condition";
    }

    var duration = Math.round(effect.duration);
    var durationString = "";
    if (duration < 60)
      durationString = duration + " seconds";
    else if (duration < 60 * 60)
      durationString = Math.ceil(duration / 60) + " minutes";
    else
      durationString = Math.ceil(duration / (60 * 60)) + " hours";

    return "Remaining Duration: " + durationString;
  }

  getEffectCount() {
    if (this.statusEffect.type === StatusEffectEnum.DamageOverTime) {
      return this.character.battleInfo.statusEffects.filter(item => item.type === this.statusEffect.type).length;
    }

    return 1;
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

  isEffectInvisible(effect: StatusEffect) {
    if (effect.type === StatusEffectEnum.Dead || effect.type === StatusEffectEnum.InstantCounter)
      return true;

    return false;
  }

  ngOnDestroy() {
    if (this.overlayRef !== undefined) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }
}
