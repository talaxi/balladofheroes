import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GodLevelIncreaseEnum } from 'src/app/models/enums/god-level-increase-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-god-view',
  templateUrl: './god-view.component.html',
  styleUrls: ['./god-view.component.css']
})
export class GodViewComponent implements OnInit {
  @Input() god: God;
  characters: Character[];
  characterTemplate: CharacterEnum = CharacterEnum.Adventurer;
  subscription: any;
  abilityList: Ability[] = [];
  tooltipDirection = DirectionEnum.Down;
  leftTooltipDirection = DirectionEnum.Left;
  isMobile = false;

  constructor(public lookupService: LookupService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private menuService: MenuService, private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();

    var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
    if (selectedGod !== undefined) {
      this.god = selectedGod;
      this.abilityList = this.god.abilityList.sort(function (a, b) {
        return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
      }).filter(item => item.isAvailable);

      //for each character, check if this is the assigned god. if so, default template to you
      this.globalService.getActivePartyCharacters(true).forEach(character => {
        if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
          this.characterTemplate = character.type;
      });
    }

    this.characters = this.globalService.globalVar.characters.filter(item => item.isAvailable);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedGod !== undefined && this.menuService.selectedGod !== this.god.type) {
        var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
        if (selectedGod !== undefined) {
          this.god = selectedGod;
          this.abilityList = this.god.abilityList.sort(function (a, b) {
            return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
          }).filter(item => item.isAvailable);

          this.globalService.getActivePartyCharacters(true).forEach(character => {
            if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
              this.characterTemplate = character.type;
          });
        }
      }
    });
  }

  getGodAbilityDescription(abilityName: string, ability?: Ability) {
    var defaultCharacter = new Character();
    var character = this.globalService.globalVar.characters.find(item => item.type.toString() === this.characterTemplate.toString());

    if (character !== undefined)
      defaultCharacter = character;
    return this.lookupService.getGodAbilityDescription(abilityName, defaultCharacter, ability);
  }

  getGodColor() {
    return this.lookupService.getGodColorClass(this.god.type);
  }

  getGodLevelRewards() {
    var totalLevelDisplay = 10;
    var statDisplayCount = 0;
    var rewards = "";
    var nextStatToIncrease = this.god.lastStatGain;
    var previousLevel = this.god.level;

    for (var i = 0; i < totalLevelDisplay; i++) {
      var nextLevel = previousLevel + 1;

      if (statDisplayCount >= 6) {

        if (i === totalLevelDisplay - 1) {
          //set next level to the next biggest thing
          if (nextLevel < this.utilityService.godAbility2Level)
            nextLevel = this.utilityService.godAbility2Level;          
          else if (nextLevel < 50) //permanent stat 1
            nextLevel = 50;
          else if (nextLevel < this.utilityService.godAbility3Level)
            nextLevel = this.utilityService.godAbility3Level;
          else if (nextLevel < 100) //permanent stat 2
            nextLevel = 100;
          else if (nextLevel < this.utilityService.permanentGodAbility2Level)
            nextLevel = this.utilityService.permanentGodAbility2Level;
          else if (nextLevel < 150) //permanent stat 3
            nextLevel = 150;
          else if (nextLevel < this.utilityService.permanentPassiveGodLevel)
            nextLevel = this.utilityService.permanentPassiveGodLevel;
          else if (nextLevel < 200) //permanent stat 4
            nextLevel = 200;
          else if (nextLevel <= 500) //end of permanent stats
            nextLevel = Math.ceil(nextLevel / 25) * 25;
          else
            nextLevel = Math.ceil(nextLevel / 5) * 5;  //for now, just go back to showing upgrades
        }
        else {
          //set next level to multiple of 5
          nextLevel = Math.ceil(nextLevel / 5) * 5;
        }
      }

      var nextLevelType = this.globalService.getGodLevelIncreaseTypeByLevel(this.god, nextLevel);
      if (nextLevel - previousLevel > 1)
        rewards += "...<br/>";
      
      rewards += "<strong class='smallCaps " + this.globalService.getGodColorClassText(this.god.type) + "'>level " + nextLevel + " </strong>- ";

      if (nextLevelType === GodLevelIncreaseEnum.Stats) {
        nextStatToIncrease = this.globalService.getNextStatToIncrease(nextStatToIncrease);
        var statGainAmount = this.utilityService.godStatGainBaseAmount + ((this.god.statGainCount + statDisplayCount) * this.utilityService.godStatGainLevelIncrement);
        statDisplayCount += 1;

        var increaseValues = this.globalService.getGodLevelStatIncreaseValues(this.god, nextStatToIncrease, statGainAmount);
        rewards += "+";
        if (increaseValues.maxHp > 0)
          rewards += Math.round(increaseValues.maxHp) + " Max HP, ";
        if (increaseValues.attack > 0)
          rewards += Math.round(increaseValues.attack) + " Attack, ";
        if (increaseValues.agility > 0)
          rewards += Math.round(increaseValues.agility) + " Agility, ";
        if (increaseValues.luck > 0)
          rewards += Math.round(increaseValues.luck) + " Luck, ";
        if (increaseValues.defense > 0)
          rewards += Math.round(increaseValues.defense) + " Defense, ";
        if (increaseValues.resistance > 0)
          rewards += Math.round(increaseValues.resistance) + " Resistance, ";

        if (rewards !== "")
          rewards = rewards.substring(0, rewards.length - 2);
      }
      if (nextLevelType === GodLevelIncreaseEnum.NewAbility) {
        if (nextLevel === this.utilityService.godPassiveLevel) {
          rewards += "<span>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + " (Passive Ability)</span>";
        }
        if (nextLevel === this.utilityService.godAbility2Level) {
          rewards += "<span>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + " (Ability 2)</span>";
        }
        if (nextLevel === this.utilityService.godAbility3Level) {
          rewards += "<span>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + " (Ability 3)</span>";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentAbility) {        
        if (nextLevel === this.utilityService.permanentPassiveGodLevel) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + " After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility2Level) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + " After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility3Level) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + " After Level Reset";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.AbilityUpgrade) {
        var upgradedAbility = this.globalService.getWhichAbilityUpgrade(this.god, nextLevel);
        if (upgradedAbility !== undefined)
          rewards += upgradedAbility.ability.name + " Upgrade " + upgradedAbility.upgradeLevel;
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentStats) {
        var increaseValues = this.globalService.getNewGodPermanentStats(this.god, nextLevel);
        var obtainTuple = this.globalService.getGodPermanentStatObtainCount(this.god, nextLevel);
        var obtainAmount = obtainTuple[1];
        var obtainCap = nextLevel % 100 === 0 ? this.utilityService.godPermanentStatGain2ObtainCap : this.utilityService.godPermanentStatGain1ObtainCap;
        var remainingAmount = (obtainCap - obtainAmount);

        rewards += "+";
        if (increaseValues.maxHp > 0)
          rewards += Math.round(increaseValues.maxHp) + " Max HP Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.attack > 0)
          rewards += Math.round(increaseValues.attack) + " Attack Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.agility > 0)
          rewards += Math.round(increaseValues.agility) + " Agility Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.luck > 0)
          rewards += Math.round(increaseValues.luck) + " Luck Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.defense > 0)
          rewards += Math.round(increaseValues.defense) + " Defense Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.resistance > 0)
          rewards += Math.round(increaseValues.resistance) + " Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.hpRegen > 0)
          rewards += this.utilityService.roundTo(increaseValues.hpRegen, 2) + " HP Regen per 5 sec Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.criticalMultiplier > 0)
          rewards += this.utilityService.roundTo(increaseValues.criticalMultiplier  * 100, 2) + "% Critical Multiplier Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.abilityCooldownReduction > 0)
          rewards += this.utilityService.roundTo(increaseValues.abilityCooldownReduction * 100, 3) + "% Ability Cooldown Reduction Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.autoAttackCooldownReduction > 0)
          rewards += this.utilityService.roundTo(increaseValues.autoAttackCooldownReduction * 100, 3) + "% Auto Attack Cooldown Reduction Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.armorPenetration > 0)
          rewards += this.utilityService.roundTo(increaseValues.armorPenetration  * 100, 2) + "% Armor Penetration Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.overdriveGain > 0)
          rewards += this.utilityService.roundTo(increaseValues.overdriveGain  * 100, 2) + "% Overdrive Gain Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.healingReceived > 0)
          rewards += this.utilityService.roundTo(increaseValues.healingReceived  * 100, 2) + "% Healing Received Bonus Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.debuffDuration > 0)
          rewards += this.utilityService.roundTo(increaseValues.debuffDuration  * 100, 2) + "% Debuff Duration Bonus Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.overdriveGainFromAutoAttacks > 0)
          rewards += this.utilityService.roundTo(increaseValues.overdriveGainFromAutoAttacks  * 100, 2) + "% Overdrive Gain From Auto Attacks Bonus Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          if (increaseValues.healingDone > 0)
          rewards += this.utilityService.roundTo(increaseValues.healingDone  * 100, 2) + "% Healing Done Bonus Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.elementalDamageIncrease.holy > 0)
          rewards += (increaseValues.elementalDamageIncrease.holy * 100) + "% Holy Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageIncrease.fire > 0)
          rewards += (increaseValues.elementalDamageIncrease.fire * 100) + "% Fire Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageIncrease.lightning > 0)
          rewards += (increaseValues.elementalDamageIncrease.lightning * 100) + "% Lightning Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageIncrease.water > 0)
          rewards += (increaseValues.elementalDamageIncrease.water * 100) + "% Water Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageIncrease.earth > 0)
          rewards += (increaseValues.elementalDamageIncrease.earth * 100) + "% Earth Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageIncrease.air > 0)
          rewards += (increaseValues.elementalDamageIncrease.air * 100) + "% Air Damage Increase Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.elementalDamageResistance.holy > 0)
          rewards += (increaseValues.elementalDamageResistance.holy * 100) + "% Holy Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageResistance.fire > 0)
          rewards += (increaseValues.elementalDamageResistance.fire * 100) + "% Fire Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageResistance.lightning > 0)
          rewards += (increaseValues.elementalDamageResistance.lightning * 100) + "% Lightning Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageResistance.water > 0)
          rewards += (increaseValues.elementalDamageResistance.water * 100) + "% Water Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageResistance.earth > 0)
          rewards += (increaseValues.elementalDamageResistance.earth * 100) + "% Earth Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementalDamageResistance.air > 0)
          rewards += (increaseValues.elementalDamageResistance.air * 100) + "% Air Damage Resistance Permanently <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (rewards !== "")
          rewards = rewards.substring(0, rewards.length - 2);
      }

      rewards += "<br/>";
      previousLevel = nextLevel;
    }
    this.globalService.getGodLevelIncreaseTypeByLevel(this.god, this.god.level);
    /*var statToIncrease = this.getNextStatToIncrease(god.lastStatGain);
    god.lastStatGain = statToIncrease;
    var statGainAmount = this.utilityService.godStatGainBaseAmount + (god.statGainCount * this.utilityService.godStatGainLevelIncrement);    

    var increaseValues = this.getGodLevelStatIncreaseValues(god, statToIncrease, statGainAmount);*/

    return rewards;
  }

  //TODO: maybe come back to this but seems like an insane amount of work just to display the effectiveness upgrade
  getAbilityUpgradeDescription(ability: { ability: Ability, upgradeLevel: number }) {
    return ability.upgradeLevel;
  }

  getNextAffinityReward() {
    var reward = this.lookupService.getAffinityRewardForLevel(this.god.affinityLevel + 1);

    if (reward === AffinityLevelRewardEnum.PrayerDuration)
      return "Increase Base Prayer Duration by " + this.utilityService.affinityRewardPrayerDuration * 100 + "%";
      if (reward === AffinityLevelRewardEnum.PrayerEffectiveness)
      return "Increase Base Prayer Effectiveness by " + this.utilityService.affinityRewardPrayerEffectiveness * 100 + "%";
      if (reward === AffinityLevelRewardEnum.GodXp)
      return "Increase God's EXP Gain by " + this.utilityService.affinityRewardGodXpBonus * 100 + "%";
      if (reward === AffinityLevelRewardEnum.SmallCharm)
      return "Small Charm of " + this.god.name;
      if (reward === AffinityLevelRewardEnum.LargeCharm)
      return "Large Charm of " + this.god.name;

      return "";
  }

  getMaxHpBonus() {
    return this.god.statGain.maxHp + this.god.permanentStatGain.maxHp;
  }

  getAttackBonus() {
    return this.god.statGain.attack + this.god.permanentStatGain.attack;
  }

  getDefenseBonus() {
    return this.god.statGain.defense + this.god.permanentStatGain.defense;
  }

  getAgilityBonus() {
    return this.god.statGain.agility + this.god.permanentStatGain.agility;
  }

  getLuckBonus() {
    return this.god.statGain.luck + this.god.permanentStatGain.luck;
  }

  getResistanceBonus() {
    return this.god.statGain.resistance + this.god.permanentStatGain.resistance;
  }

  getHpRegenBonus() {
    return this.god.statGain.hpRegen + this.god.permanentStatGain.hpRegen;
  }

  getCriticalMultiplierBonus() {
    return this.god.statGain.criticalMultiplier + this.god.permanentStatGain.criticalMultiplier;
  }

  getArmorPenetrationBonus() {
    return this.god.statGain.armorPenetration + this.god.permanentStatGain.armorPenetration;
  }

  getOverdriveGainBonus() {
    return this.god.statGain.overdriveGain + this.god.permanentStatGain.overdriveGain;
  }

  getHealingReceivedBonus() {
    return this.god.statGain.healingReceived + this.god.permanentStatGain.healingReceived;
  }

  getDebuffDurationBonus() {
    return this.god.statGain.debuffDuration + this.god.permanentStatGain.debuffDuration;
  }

  getOverdriveGainFromAutoAttacksBonus() {
    return this.god.statGain.overdriveGainFromAutoAttacks + this.god.permanentStatGain.overdriveGainFromAutoAttacks;
  }

  getHealingDoneBonus() {
    return this.god.statGain.healingDone + this.god.permanentStatGain.healingDone;
  }

  getAbilityCooldownReductionBonus() {
    return this.god.statGain.abilityCooldownReduction + this.god.permanentStatGain.abilityCooldownReduction;
  }

  getAutoAttackCooldownBonus() {    
    return this.god.statGain.autoAttackCooldownReduction + this.god.permanentStatGain.autoAttackCooldownReduction;
  }

  getHolyDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.holy + this.god.permanentStatGain.elementalDamageIncrease.holy;
  }

  getFireDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.fire + this.god.permanentStatGain.elementalDamageIncrease.fire;
  }
  
  getLightningDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.lightning + this.god.permanentStatGain.elementalDamageIncrease.lightning;
  }

  getAirDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.air + this.god.permanentStatGain.elementalDamageIncrease.air;
  }

  getWaterDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.water + this.god.permanentStatGain.elementalDamageIncrease.water;
  }

  getEarthDamageBonus() {
    return this.god.statGain.elementalDamageIncrease.earth + this.god.permanentStatGain.elementalDamageIncrease.earth;
  }

  getHolyResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.holy + this.god.permanentStatGain.elementalDamageResistance.holy;
  }

  getFireResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.fire + this.god.permanentStatGain.elementalDamageResistance.fire;
  }

  getAirResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.air + this.god.permanentStatGain.elementalDamageResistance.air;
  }

  getLightningResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.lightning + this.god.permanentStatGain.elementalDamageResistance.lightning;
  }

  getWaterResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.water + this.god.permanentStatGain.elementalDamageResistance.water;
  }

  getEarthResistanceBonus() {
    return this.god.statGain.elementalDamageResistance.earth + this.god.permanentStatGain.elementalDamageResistance.earth;
  }

  getMaxHpStatBreakdown() {
    return this.lookupService.getGodMaxHpStatBreakdown(this.god);
  }
  
  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
