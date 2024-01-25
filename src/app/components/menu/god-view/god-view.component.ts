import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GodLevelIncreaseEnum } from 'src/app/models/enums/god-level-increase-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { AltarService } from 'src/app/services/altar/altar.service';
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
  affinityTooltipDirection = DirectionEnum.UpRight;
  isMobile = false;
  areAltarsAvailable: boolean = false;
  areLargeAltarsAvailable: boolean = false;

  constructor(public lookupService: LookupService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private menuService: MenuService, private utilityService: UtilityService, private deviceDetectorService: DeviceDetectorService,
    private altarService: AltarService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.areAltarsAvailable = this.globalService.globalVar.altars.isUnlocked;
    this.areLargeAltarsAvailable = this.globalService.globalVar.altars.largeAltarsUnlocked;

    var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
    if (selectedGod !== undefined) {
      this.god = selectedGod;
      this.abilityList = this.god.abilityList.sort(function (a, b) {
        return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
      }).filter(item => item.isAvailable);

      //for each character, check if this is the assigned god. if so, default template to you
      this.globalService.getActivePartyCharacters(true).forEach(character => {
        if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type) {
          this.characterTemplate = character.type;
          var otherGodType = GodEnum.None;
          if (character.assignedGod1 === this.god.type)
            otherGodType = character.assignedGod2;
          else
            otherGodType = character.assignedGod1;

          if (this.lookupService.isDuoAvailable(this.god.type, otherGodType)) {
            var gods: GodEnum[] = [];
            gods.push(this.god.type);
            gods.push(otherGodType);
            this.abilityList.push(this.lookupService.getDuoAbility(gods));
          }
        }
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
            if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type) {
              this.characterTemplate = character.type;

              var otherGodType = GodEnum.None;
              if (character.assignedGod1 === this.god.type)
                otherGodType = character.assignedGod2;
              else
                otherGodType = character.assignedGod1;

              if (this.lookupService.isDuoAvailable(this.god.type, otherGodType)) {
                var gods: GodEnum[] = [];
                gods.push(this.god.type);
                gods.push(otherGodType);
                this.abilityList.push(this.lookupService.getDuoAbility(gods));
              }
            }
          });
        }
      }
    });
  }

  isDuoAbility(ability: Ability) {
    return ability.requiredLevel === this.utilityService.duoAbilityLevel;
  }

  getPartnerGod() {
    var character = this.globalService.globalVar.characters.find(item => item.type.toString() === this.characterTemplate.toString());
    if (character === undefined)
      return "";

    var otherGodType = GodEnum.None;
    if (character.assignedGod1 === this.god.type)
      otherGodType = character.assignedGod2;
    else
      otherGodType = character.assignedGod1;

    var partnerGod = this.globalService.globalVar.gods.find(item => item.type === otherGodType);
    if (partnerGod === undefined)
      return "";

    return "<span class='smallCaps bold'>with</span> <span class='smallCaps bold " + partnerGod.name.toLowerCase() + "Color'>" + partnerGod.name + "</span> - ";
  }

  getGodXp() {
    return this.utilityService.bigNumberReducer(this.god.exp);
  }

  getGodXpToNextLevel() {
    return this.utilityService.bigNumberReducer(this.god.expToNextLevel);
  }

  getGodAbilityDescription(abilityName: string, ability?: Ability) {
    var defaultCharacter = new Character();
    var character = this.globalService.globalVar.characters.find(item => item.type.toString() === this.characterTemplate.toString());

    if (character !== undefined)
      defaultCharacter = character;
    return this.lookupService.getGodAbilityDescription(abilityName, defaultCharacter, ability, this.god);
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
          else if (nextLevel < this.utilityService.permanentPassiveGodLevel)
            nextLevel = this.utilityService.permanentPassiveGodLevel;
          else if (nextLevel < 150) //permanent stat 3
            nextLevel = 150;
          else if (nextLevel < this.utilityService.permanentGodAbility2Level)
            nextLevel = this.utilityService.permanentGodAbility2Level;
          else if (nextLevel < 200) //permanent stat 4
            nextLevel = 200;
          else if (nextLevel > (this.utilityService.permanentGodAbility3Level - 26) && nextLevel < this.utilityService.permanentGodAbility3Level)
            nextLevel = this.utilityService.permanentGodAbility3Level;
          else if (nextLevel <= 20000) //end of permanent stats
            nextLevel = Math.ceil(nextLevel / 50) * 50;
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
          rewards += "<span><strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + "</strong> (Passive Ability)</span>";
        }
        if (nextLevel === this.utilityService.godAbility2Level) {
          rewards += "<span><strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + "</strong> (Ability 2)</span>";
        }
        if (nextLevel === this.utilityService.godAbility3Level) {
          rewards += "<span><strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + "</strong> (Ability 3)</span>";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentAbility) {
        if (nextLevel === this.utilityService.permanentPassiveGodLevel) {
          rewards += "Permanently Keep <strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + "</strong> After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility2Level) {
          rewards += "Permanently Keep <strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + "</strong> After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility3Level) {
          rewards += "Permanently Keep <strong>" + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + "</strong> After Level Reset";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.AbilityUpgrade) {
        var upgradedAbility = this.globalService.getWhichAbilityUpgrade(this.god, nextLevel);
        if (upgradedAbility !== undefined)
          rewards += "<strong>" + upgradedAbility.ability.name + "</strong> Upgrade " + upgradedAbility.upgradeLevel;
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentStats) {
        var increaseValues = this.globalService.getNewGodPermanentStats(this.god, nextLevel);
        var increaseAbilities = this.globalService.getNewGodPermanentAbilityUpgrades(this.god, nextLevel);
        var obtainTuple = this.globalService.getGodPermanentStatObtainCount(this.god, nextLevel);
        var obtainAmount = obtainTuple[1];
        var obtainCap = 10;
        if (nextLevel % 100 === 0 && nextLevel <= 500)
          obtainCap = this.utilityService.godPermanentStatGain2ObtainCap;
        else if (nextLevel % 50 === 0 && nextLevel <= 500)
          obtainCap = this.utilityService.godPermanentStatGain1ObtainCap + this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets;
        else if (nextLevel % 100 === 0 && nextLevel <= 1000)
          obtainCap = this.utilityService.godPermanentStatGain4ObtainCap;
        else if (nextLevel % 50 === 0 && nextLevel <= 1000)
          obtainCap = this.utilityService.godPermanentStatGain3ObtainCap + this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets;
        else if (nextLevel % 200 === 50 && nextLevel <= 2000)
          obtainCap = this.utilityService.godPermanentAbility1ObtainCap;
        else if (nextLevel % 200 === 100 && nextLevel <= 2000)
          obtainCap = this.utilityService.godPermanentPassiveObtainCap;
        else if (nextLevel % 200 === 150 && nextLevel <= 2000)
          obtainCap = this.utilityService.godPermanentAbility2ObtainCap;
        else if (nextLevel % 200 === 0 && nextLevel <= 2000)
          obtainCap = this.utilityService.godPermanentAbility3ObtainCap;
        else if (nextLevel % 100 === 0 && nextLevel <= 3000)
          obtainCap = this.utilityService.godPermanentStatGain6ObtainCap;
        else if (nextLevel % 50 === 0 && nextLevel <= 3000)
          obtainCap = this.utilityService.godPermanentStatGain5ObtainCap;
        else if (nextLevel % 100 === 0 && nextLevel <= 4000)
          obtainCap = this.utilityService.godPermanentStatGain7ObtainCap;
        else if (nextLevel % 50 === 0 && nextLevel <= 4000)
          obtainCap = this.utilityService.godPermanentDuoAbilityObtainCap;
        else if (nextLevel % 50 === 0 && nextLevel > 4000)
          obtainCap = this.utilityService.godPermanentStatGain8ObtainCap;

        var remainingAmount = (obtainCap - obtainAmount);

        var permanentText = "Permanently";
        if (nextLevel > 500 && nextLevel <= 1000 || (nextLevel > 2000 && nextLevel <= 3000) ||
          (nextLevel > 3000 && nextLevel <= 4000 && nextLevel % 100 === 0))
          permanentText = "Permanently For Entire Party";

        var multiplierText = "";
        if (nextLevel > 2000 && nextLevel <= 4000 && nextLevel % 100 === 0)
          multiplierText = "%";

        rewards += "+";
        if (increaseValues.maxHp > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.maxHp * 100 : increaseValues.maxHp) + multiplierText + " Max HP " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.attack > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.attack * 100 : increaseValues.attack) + multiplierText + " Attack " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.agility > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.agility * 100 : increaseValues.agility) + multiplierText + " Agility " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.luck > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.luck * 100 : increaseValues.luck) + multiplierText + " Luck " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.defense > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.defense * 100 : increaseValues.defense) + multiplierText + " Defense " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.resistance > 0)
          rewards += this.utilityService.genericRound(multiplierText !== "" ? increaseValues.resistance * 100 : increaseValues.resistance) + multiplierText + " Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.duoPermanentEffectiveness > 0)
          rewards += this.utilityService.genericRound(increaseValues.duoPermanentEffectiveness) + " Duo Ability Upgrade " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.xpGain > 0)
          rewards += this.utilityService.genericRound(increaseValues.xpGain * 100) + "% XP Gain " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.hpRegen > 0)
          rewards += this.utilityService.roundTo(increaseValues.hpRegen, 2) + " HP Regen per 5 sec " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.criticalMultiplier > 0)
          rewards += this.utilityService.roundTo(increaseValues.criticalMultiplier * 100, 2) + "% Critical Multiplier " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.abilityCooldownReduction > 0)
          rewards += this.utilityService.roundTo(increaseValues.abilityCooldownReduction * 100, 3) + "% Ability Cooldown Reduction " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.autoAttackCooldownReduction > 0)
          rewards += this.utilityService.roundTo(increaseValues.autoAttackCooldownReduction * 100, 3) + "% Auto Attack Cooldown Reduction " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.armorPenetration > 0)
          rewards += this.utilityService.roundTo(increaseValues.armorPenetration * 100, 2) + "% Armor Penetration " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.overdriveGain > 0)
          rewards += this.utilityService.roundTo(increaseValues.overdriveGain * 100, 2) + "% Overdrive Gain " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.healingReceived > 0)
          rewards += this.utilityService.roundTo(increaseValues.healingReceived * 100, 2) + "% Healing Received Bonus " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.debuffDuration > 0)
          rewards += this.utilityService.roundTo(increaseValues.debuffDuration * 100, 2) + "% Debuff Duration Bonus " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.buffDuration > 0)
          rewards += this.utilityService.roundTo(increaseValues.buffDuration * 100, 2) + "% Buff Duration Bonus " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.overdriveGainFromAutoAttacks > 0)
          rewards += this.utilityService.roundTo(increaseValues.overdriveGainFromAutoAttacks * 100, 2) + "% Overdrive Gain From Auto Attacks Bonus " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.healingDone > 0)
          rewards += this.utilityService.roundTo(increaseValues.healingDone * 100, 2) + "% Healing Done Bonus " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.elementIncrease.holy > 0)
          rewards += (increaseValues.elementIncrease.holy * 100) + "% Holy Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementIncrease.fire > 0)
          rewards += (increaseValues.elementIncrease.fire * 100) + "% Fire Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementIncrease.lightning > 0)
          rewards += (increaseValues.elementIncrease.lightning * 100) + "% Lightning Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementIncrease.water > 0)
          rewards += (increaseValues.elementIncrease.water * 100) + "% Water Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementIncrease.earth > 0)
          rewards += (increaseValues.elementIncrease.earth * 100) + "% Earth Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementIncrease.air > 0)
          rewards += (increaseValues.elementIncrease.air * 100) + "% Air Damage Increase " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        if (increaseValues.elementResistance.holy > 0)
          rewards += (increaseValues.elementResistance.holy * 100) + "% Holy Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementResistance.fire > 0)
          rewards += (increaseValues.elementResistance.fire * 100) + "% Fire Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementResistance.lightning > 0)
          rewards += (increaseValues.elementResistance.lightning * 100) + "% Lightning Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementResistance.water > 0)
          rewards += (increaseValues.elementResistance.water * 100) + "% Water Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementResistance.earth > 0)
          rewards += (increaseValues.elementResistance.earth * 100) + "% Earth Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (increaseValues.elementResistance.air > 0)
          rewards += (increaseValues.elementResistance.air * 100) + "% Air Damage Resistance " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";

        var ability = this.god.abilityList.find(item => item.requiredLevel === increaseAbilities.requiredLevel);
        var abilityName = "<span class='bold'>" + ability?.name + "</span>";
        var userGainsEffect = increaseAbilities.userEffect[0];
        var targetGainsEffect = increaseAbilities.targetEffect[0];
        if (increaseAbilities.effectiveness > 0) {
          if (ability?.name === "Quicken")
            rewards += (increaseAbilities.effectiveness) + " Sec Effectiveness Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          else
            rewards += (increaseAbilities.effectiveness * 100) + "% Effectiveness Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        }
        if (userGainsEffect !== undefined && userGainsEffect.effectiveness > 0) {
          if (ability?.name === "Second Wind")
            rewards += (userGainsEffect.effectiveness) + " HP Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
          else
            rewards += (userGainsEffect.effectiveness * 100) + "% Buff Effectiveness Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        }
        if (userGainsEffect !== undefined && userGainsEffect.threshold > 0)
          rewards += (userGainsEffect.threshold * 100) + "% Threshold Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (userGainsEffect !== undefined && userGainsEffect.duration > 0)
          rewards += (userGainsEffect.duration) + " Sec Duration Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (targetGainsEffect !== undefined && targetGainsEffect.effectiveness > 0)
          rewards += (targetGainsEffect.effectiveness * 100) + "% Debuff Effectiveness Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (targetGainsEffect !== undefined && targetGainsEffect.duration > 0)
          rewards += (targetGainsEffect.duration) + " Sec Duration Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        if (ability?.name === "Insanity") {
          if (targetGainsEffect !== undefined && targetGainsEffect.effectiveness < 0)
            rewards += Math.abs(targetGainsEffect.effectiveness * 100) + "% Debuff Effectiveness Increase to " + abilityName + " " + permanentText + " <span class='obtainableCount'><i>(Can obtain " + remainingAmount + " more " + (remainingAmount === 1 ? "time" : "times") + ")</i></span>, ";
        }

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

  //maybe come back to this but seems like an insane amount of work just to display the effectiveness upgrade
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

  getBuffDurationBonus() {
    return this.god.statGain.buffDuration + this.god.permanentStatGain.buffDuration;
  }

  getOverdriveGainFromAutoAttacksBonus() {
    return this.god.statGain.overdriveGainFromAutoAttacks + this.god.permanentStatGain.overdriveGainFromAutoAttacks;
  }

  getHealingDoneBonus() {
    return this.god.statGain.healingDone + this.god.permanentStatGain.healingDone;
  }

  getAllyDamageBonus() {
    return this.god.statGain.allyDamageBonus + this.god.permanentStatGain.allyDamageBonus;
  }

  getAoeDamageBonus() {
    return this.god.statGain.aoeDamage + this.god.permanentStatGain.aoeDamage;
  }

  getThornsBonus() {
    return this.god.statGain.thorns + this.god.permanentStatGain.thorns;
  }

  getAbilityCooldownReductionWithBuffsBonus() {
    return this.god.statGain.abilityCooldownReductionWithBuffs + this.god.permanentStatGain.abilityCooldownReductionWithBuffs;
  }

  getAbilityCooldownReductionStartBonus() {
    return this.god.statGain.abilityCooldownReductionStart + this.god.permanentStatGain.abilityCooldownReductionStart;
  }

  getTickFrequencyBonus() {
    return this.god.statGain.tickFrequency + this.god.permanentStatGain.tickFrequency;
  }

  getLinkEffectivenessBonus() {
    return this.god.statGain.linkEffectiveness + this.god.permanentStatGain.linkEffectiveness;
  }

  getAbilityCooldownReductionBonus() {
    return this.god.statGain.abilityCooldownReduction + this.god.permanentStatGain.abilityCooldownReduction;
  }

  getAutoAttackCooldownBonus() {
    return this.god.statGain.autoAttackCooldownReduction + this.god.permanentStatGain.autoAttackCooldownReduction;
  }

  getHolyDamageBonus() {
    return this.god.statGain.elementIncrease.holy + this.god.permanentStatGain.elementIncrease.holy;
  }

  getFireDamageBonus() {
    return this.god.statGain.elementIncrease.fire + this.god.permanentStatGain.elementIncrease.fire;
  }

  getLightningDamageBonus() {
    return this.god.statGain.elementIncrease.lightning + this.god.permanentStatGain.elementIncrease.lightning;
  }

  getAirDamageBonus() {
    return this.god.statGain.elementIncrease.air + this.god.permanentStatGain.elementIncrease.air;
  }

  getWaterDamageBonus() {
    return this.god.statGain.elementIncrease.water + this.god.permanentStatGain.elementIncrease.water;
  }

  getEarthDamageBonus() {
    return this.god.statGain.elementIncrease.earth + this.god.permanentStatGain.elementIncrease.earth;
  }

  getHolyResistanceBonus() {
    return this.god.statGain.elementResistance.holy + this.god.permanentStatGain.elementResistance.holy;
  }

  getFireResistanceBonus() {
    return this.god.statGain.elementResistance.fire + this.god.permanentStatGain.elementResistance.fire;
  }

  getAirResistanceBonus() {
    return this.god.statGain.elementResistance.air + this.god.permanentStatGain.elementResistance.air;
  }

  getLightningResistanceBonus() {
    return this.god.statGain.elementResistance.lightning + this.god.permanentStatGain.elementResistance.lightning;
  }

  getWaterResistanceBonus() {
    return this.god.statGain.elementResistance.water + this.god.permanentStatGain.elementResistance.water;
  }

  getEarthResistanceBonus() {
    return this.god.statGain.elementResistance.earth + this.god.permanentStatGain.elementResistance.earth;
  }

  getPartyXpGainBonus() {
    return this.god.partyPermanentStatGain.xpGain;
  }

  getPartyMaxHpBonus() {
    return this.god.partyPermanentStatGain.maxHp;
  }

  getPartyAttackBonus() {
    return this.god.partyPermanentStatGain.attack;
  }

  getPartyDefenseBonus() {
    return this.god.partyPermanentStatGain.defense;
  }

  getPartyLuckBonus() {
    return this.god.partyPermanentStatGain.luck;
  }

  getPartyResistanceBonus() {
    return this.god.partyPermanentStatGain.resistance;
  }

  getPartyAgilityBonus() {
    return this.god.partyPermanentStatGain.agility;
  }

  /*getMaxHpMultiplierBonus() {
    return this.god.permanentStatMultiplier.maxHp - 1;
  }

  getAttackMultiplierBonus() {
    return this.god.permanentStatMultiplier.attack - 1;
  }

  getDefenseMultiplierBonus() {
    return this.god.permanentStatMultiplier.defense - 1;
  }

  getLuckMultiplierBonus() {
    return this.god.permanentStatMultiplier.luck - 1;
  }

  getResistanceMultiplierBonus() {
    return this.god.permanentStatMultiplier.resistance - 1;
  }

  getAgilityMultiplierBonus() {
    return this.god.permanentStatMultiplier.agility - 1;
  }*/

  getPartyMaxHpMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.maxHp - 1;
  }

  getPartyAttackMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.attack - 1;
  }

  getPartyDefenseMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.defense - 1;
  }

  getPartyLuckMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.luck - 1;
  }

  getPartyResistanceMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.resistance - 1;
  }

  getPartyAgilityMultiplierBonus() {
    return this.god.partyPermanentStatMultiplier.agility - 1;
  }

  getMaxHpStatBreakdown() {
    return this.lookupService.getGodMaxHpStatBreakdown(this.god);
  }

  getDuoEffectivenessBonus() {
    return this.god.permanentStatGain.duoPermanentEffectiveness;
  }

  hasMoreThanOneGod() {
    return this.globalService.globalVar.gods.filter(item => item.isAvailable).length > 1;
  }

  traverseSubMenu(direction: number) {
    var gods = this.globalService.globalVar.gods.sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }).filter(item => item.isAvailable);

    var currentIndex = gods.findIndex(item => item.type === this.menuService.selectedGod);
    currentIndex += direction;

    if (currentIndex < 0)
      currentIndex = gods.length - 1;
    if (currentIndex > gods.length - 1)
      currentIndex = 0;

    this.menuService.setSelectedGod(gods[currentIndex].type);
  }

  getBoonDurationIncrease() {
    var durationIncreaseCount = this.lookupService.getGodAffinityBoonDurationIncreaseCount(this.god);

    return Math.round(durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration * 100) + "%";
  }

  getBoonEffectivenessIncrease() {
    var durationIncreaseCount = this.lookupService.getGodAffinityBoonEffectivenessIncreaseCount(this.god);

    return Math.round(durationIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness * 100) + "%";
  }

  getAffinityGodXpIncrease() {
    var increaseCount = this.lookupService.getGodAffinityXpIncreaseCount(this.god);

    return Math.round(increaseCount * this.utilityService.affinityRewardGodXpBonus * 100) + "%";
  }

  getAffinitySmallCharmCount() {
    return this.lookupService.getGodAffinitySmallCharmCount(this.god);
  }

  getAffinityLargeCharmCount() {
    return this.lookupService.getGodAffinityLargeCharmCount(this.god);
  }

  getSmallAltarEffectDescriptions() {
    var text = "";

    var possibleEffects = this.altarService.getPossibleEffects(this.god.type, AltarEnum.Small, true);

    possibleEffects.forEach(effect => {
      var baseAltarEffect = this.altarService.getBaseAltarEffect(AltarEnum.Small, effect);
      text += "<span class='statLabel " + this.god.name.toLowerCase() + "Color'>" + this.lookupService.getBoonName(effect) + "</span> - <span class='statValue'>" + this.lookupService.getBaseAltarEffectDescription(baseAltarEffect) + "</span><br/>";
    });

    return text;
  }

  getLargeAltarEffectDescriptions() {
    var text = "";

    var possibleEffects = this.altarService.getPossibleEffects(this.god.type, AltarEnum.Large, true);

    possibleEffects.forEach(effect => {
      var baseAltarEffect = this.altarService.getBaseAltarEffect(AltarEnum.Large, effect);
      text += "<span class='statLabel " + this.god.name.toLowerCase() + "Color'>" + this.lookupService.getBoonName(effect) + "</span> - <span class='statValue'>" + this.lookupService.getBaseAltarEffectDescription(baseAltarEffect) + "</span><br/>";
    });

    return text;
  }

  getAbilityUpgradeLevel(ability: Ability) {
    return ability.abilityUpgradeLevel;
  }


  getPermanentAbilityEffectivenessIncrease(ability: Ability) {
    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.effectiveness;

    if (ability !== undefined) {
      if (ability.name === "Quicken")
        return this.utilityService.genericRound(permanentAbilityUpgradeAmount);
      else
        return this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100) + "%";
    }

    return 0;
  }

  getPermanentSecondaryAbilityEffectivenessIncrease(ability: Ability) {
    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.secondaryEffectiveness;

    if (ability !== undefined) {
      return this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100) + "%";
    }

    return 0;
  }

  getAbilityEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      if (baseAbility.name === "Quicken")
        return this.utilityService.genericRound((ability.effectiveness - baseAbility.effectiveness));
      else
        return this.utilityService.genericRound((ability.effectiveness - baseAbility.effectiveness) * 100) + "%";
    }

    return 0;
  }

  getSecondaryAbilityEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      return this.utilityService.genericRound((ability.secondaryEffectiveness - baseAbility.secondaryEffectiveness) * 100) + "%";
    }

    return 0;
  }

  getAbilityEffectCountIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      if (baseAbility.name === "Special Delivery")
        return this.utilityService.genericRound((ability.userEffect.length - baseAbility.userEffect.length));
      if (baseAbility.name === "No Escape")
        return this.utilityService.genericRound((ability.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).length - baseAbility.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).length));
      if (baseAbility.name === "Insanity")
        return this.utilityService.genericRound((ability.targetEffect.length - baseAbility.targetEffect.length));
      if (baseAbility.name === "Chain Lightning")
        return this.utilityService.genericRound((ability.userEffect.length - baseAbility.userEffect.length));
    }

    return 0;
  }

  getAbilityEffectMaxCountIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      if (baseAbility.name === "Second Wind") {
        return this.utilityService.genericRound((ability.userEffect[0].maxCount - baseAbility.userEffect[0].maxCount));
      }
      return this.utilityService.genericRound((ability.maxCount - baseAbility.maxCount));
    }

    return 0;
  }

  getAbilityUserEffectEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0) {
      if (baseAbility.name === "Second Wind")
        return this.utilityService.genericRound((ability.userEffect[0].effectiveness - baseAbility.userEffect[0].effectiveness));
      else
        return Math.abs(this.utilityService.genericRound((ability.userEffect[0].effectiveness - baseAbility.userEffect[0].effectiveness) * 100)) + "%";
    }

    return 0;
  }

  getAbilityUserEffectDurationIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0)
      return this.utilityService.roundTo((ability.userEffect[0].duration - baseAbility.userEffect[0].duration), 2);

    return 0;
  }


  getAbilityUserEffectThresholdIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && ability.userEffect.length > 0 && ability.userEffect[0].threshold !== undefined && !Number.isNaN(ability.userEffect[0].threshold)) {
      return this.utilityService.genericRound((ability.userEffect[0].threshold - baseAbility.userEffect[0].threshold) * 100) + "%";
    }

    return 0;
  }


  getPermanentAbilityUserEffectEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].effectiveness;

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0) {
      if (baseAbility.name === "Second Wind")
        return "*" + this.utilityService.genericRound(1 + permanentAbilityUpgradeAmount);
      else
        return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getPermanentAbilityUserEffectThresholdIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0 &&
      permanentAbilityUpgrade.userEffect[0].threshold !== undefined && !Number.isNaN(permanentAbilityUpgrade.userEffect[0].threshold))
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].threshold;

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getPermanentAbilityUserEffectDurationIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].duration;

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0)
      return this.utilityService.roundTo(permanentAbilityUpgradeAmount, 2);

    return 0;
  }

  getPermanentAbilityTargetEffectEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.targetEffect !== undefined && permanentAbilityUpgrade.targetEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.targetEffect[0].effectiveness;

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getPermanentAbilityTargetEffectDurationIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    var permanentAbilityUpgradeAmount = 0;
    var permanentAbilityUpgrade = this.god.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.targetEffect !== undefined && permanentAbilityUpgrade.targetEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.targetEffect[0].duration;

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0)
      return this.utilityService.roundTo(permanentAbilityUpgradeAmount, 2);

    return 0;
  }

  getAbilityTargetEffectEffectivenessIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound((ability.targetEffect[0].effectiveness - baseAbility.targetEffect[0].effectiveness) * 100)) + "%";
    }

    return 0;
  }

  getAbilityTargetEffectDurationIncrease(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0)
      return this.utilityService.roundTo((ability.targetEffect[0].duration - baseAbility.targetEffect[0].duration), 2);

    return 0;
  }

  getAbilityCooldownReduction(ability: Ability) {
    var baseGod = new God(this.god.type);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined)
      return this.utilityService.genericRound(Math.abs(ability.cooldown - baseAbility.cooldown));

    return 0;
  }

  isDuoAbilityAvailable() {
    var conditionMet = false;

    if (this.god.type === GodEnum.Athena && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AthenasCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AthenasSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Artemis && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ArtemissCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ArtemissSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Hermes && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HermessCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HermessSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Apollo && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ApollosCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ApollosSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Ares && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AressCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AressSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Hades && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HadessCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HadessSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Nemesis && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.NemesissCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.NemesissSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Dionysus && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DionysussCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.DionysussSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Zeus && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ZeussCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.ZeussSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Poseidon && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.PoseidonsCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.PoseidonsSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Aphrodite && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AphroditesCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.AphroditesSigil && item.amount > 0))
      conditionMet = true;
    if (this.god.type === GodEnum.Hera && this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HerasCrest && item.amount > 0) &&
      this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.HerasSigil && item.amount > 0))
      conditionMet = true;

    return conditionMet;
  }

  openPermanentStatBreakdown(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialog.open(content, { width: '60%', height: '75%', panelClass: 'mat-dialog-no-scroll' });
  }

  openDuoAbilityBreakdown(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialog.open(content, { width: '60%', height: '75%', panelClass: 'mat-dialog-no-scroll' });
  }

  getPermanentStatBreakdown() {
    var text = "";
    var allPermanentStatCounts: [number, number][] = [];
    this.god.permanentStat1GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat2GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat3GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat4GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentAbility1GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentAbility2GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentAbility3GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentPassiveGainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat5GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentDuoAbilityGainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat6GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat7GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.god.permanentStat8GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });

    allPermanentStatCounts.sort((a, b) => this.sortStats(a, b)).forEach(item => {
      if (item[1] > 0) {
        var stats = this.globalService.getNewGodPermanentStats(this.god, item[0]);
        var abilities = this.globalService.getNewGodPermanentAbilityUpgrades(this.god, item[0]);
        var increasedStat = this.getIncreasedStatFromStats(stats, abilities, item[0]);
        var gainCap = 0;
        var partyText = "";

        if (item[0] === 50 || item[0] === 150 || item[0] === 250 || item[0] === 350 || item[0] === 450)
          gainCap = this.utilityService.godPermanentStatGain1ObtainCap + this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets;
        if (item[0] === 100 || item[0] === 200 || item[0] === 300 || item[0] === 400 || item[0] === 500)
          gainCap = this.utilityService.godPermanentStatGain2ObtainCap;
        if (item[0] === 950 || item[0] === 550 || item[0] === 650 || item[0] === 750 || item[0] === 850) {
          gainCap = this.utilityService.godPermanentStatGain3ObtainCap + this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets;
          partyText = " to party";
        }
        if (item[0] === 600 || item[0] === 700 || item[0] === 800 || item[0] === 900 || item[0] === 1000)
          gainCap = this.utilityService.godPermanentStatGain4ObtainCap;

        if (item[0] === 1050 || item[0] === 1250 || item[0] === 1450 || item[0] === 1650 || item[0] === 1850)
          gainCap = this.utilityService.godPermanentAbility1ObtainCap;
        if (item[0] === 1100 || item[0] === 1300 || item[0] === 1500 || item[0] === 1700 || item[0] === 1900)
          gainCap = this.utilityService.godPermanentPassiveObtainCap;
        if (item[0] === 1150 || item[0] === 1350 || item[0] === 1550 || item[0] === 1750 || item[0] === 1950)
          gainCap = this.utilityService.godPermanentAbility2ObtainCap;
        if (item[0] === 1200 || item[0] === 1400 || item[0] === 1600 || item[0] === 1800 || item[0] === 2000)
          gainCap = this.utilityService.godPermanentAbility3ObtainCap;

        if (item[0] === 2050 || item[0] === 2150 || item[0] === 2250 || item[0] === 2350 || item[0] === 2450 ||
          item[0] === 2550 || item[0] === 2650 || item[0] === 2750 || item[0] === 2850 || item[0] === 2950)
          gainCap = this.utilityService.godPermanentStatGain5ObtainCap;
        if (item[0] === 2100 || item[0] === 2200 || item[0] === 2300 || item[0] === 2400 || item[0] === 2500 ||
          item[0] === 2600 || item[0] === 2700 || item[0] === 2800 || item[0] === 2900 || item[0] === 3000) {
          gainCap = this.utilityService.godPermanentStatGain6ObtainCap;
          partyText = " to party";
        }
        if (item[0] === 3050 || item[0] === 3150 || item[0] === 3250 || item[0] === 3350 || item[0] === 3450 ||
          item[0] === 3550 || item[0] === 3650 || item[0] === 3750 || item[0] === 3850 || item[0] === 3950)
          gainCap = this.utilityService.godPermanentDuoAbilityObtainCap;
        if (item[0] === 3100 || item[0] === 3200 || item[0] === 3300 || item[0] === 3400 || item[0] === 3500 ||
          item[0] === 3600 || item[0] === 3700 || item[0] === 3800 || item[0] === 3900 || item[0] === 4000) {
          gainCap = this.utilityService.godPermanentStatGain7ObtainCap;
          partyText = " to party";
        }

        if (item[0] > 4000 && item[0] % 50 === 0)
          gainCap = this.utilityService.godPermanentStatGain8ObtainCap;

        var clearClass = "";
        if (item[1] >= gainCap)
          clearClass = "completedSubzoneColor";

        var upgradedAbilityName = this.god.abilityList.find(item => item.requiredLevel === abilities.requiredLevel)?.name;
        if (upgradedAbilityName !== undefined)
          upgradedAbilityName = "<b>" + upgradedAbilityName + "</b> ";
        else
          upgradedAbilityName = "";

        text += "<span class='statLabel bold " + this.god.name.toLowerCase() + "Color'>Level " + item[0] + ":</span> <span class='statValue " + clearClass + "'>" + upgradedAbilityName + "+" + increasedStat + partyText + " - " + item[1] + " / " + (gainCap) + " obtained</span><hr class='slimMargin'/>";
      }
    });

    return text;
  }

  sortStats(a: [number, number], b: [number, number]) {
    var ascending = 1;
    var descending = -1;

    return a[0] < b[0] ? descending : a[0] > b[0] ? ascending : 0;
  }

  getIncreasedStatFromStats(upgradedStats: CharacterStats, upgradedAbilities: Ability, level: number) {
    var statGainText = "";

    var multiplierText = "";
    if (level > 2000 && level <= 4000 && level % 100 === 0)
      multiplierText = "%";

    if (upgradedStats.maxHp > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.maxHp * 100 : upgradedStats.maxHp) + multiplierText + " Max HP, ";
    if (upgradedStats.attack > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.attack * 100 : upgradedStats.attack) + multiplierText + " Attack, ";
    if (upgradedStats.agility > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.agility * 100 : upgradedStats.agility) + multiplierText + " Agility, ";
    if (upgradedStats.luck > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.luck * 100 : upgradedStats.luck) + multiplierText + " Luck, ";
    if (upgradedStats.defense > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.defense * 100 : upgradedStats.defense) + multiplierText + " Defense, ";
    if (upgradedStats.resistance > 0)
      statGainText += this.utilityService.genericRound(multiplierText !== "" ? upgradedStats.resistance * 100 : upgradedStats.resistance) + multiplierText + " Resistance, ";

    if (upgradedStats.hpRegen > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.hpRegen) + " HP Regen per 5 sec, ";
    if (upgradedStats.criticalMultiplier > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.criticalMultiplier * 100) + "% Critical Multiplier, ";
    if (upgradedStats.autoAttackCooldownReduction > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.autoAttackCooldownReduction * 100) + "% Auto Attack Cooldown Reduction, ";
    if (upgradedStats.healingDone > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.healingDone * 100) + "% Healing Done, ";
    if (upgradedStats.elementIncrease.holy > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.holy * 100) + "% Holy Damage Increase, ";
    if (upgradedStats.elementIncrease.fire > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.fire * 100) + "% Fire Damage Increase, ";
    if (upgradedStats.elementIncrease.lightning > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.lightning * 100) + "% Lightning Damage Increase, ";
    if (upgradedStats.elementIncrease.water > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.elementIncrease.water * 100) + "% Water Damage Increase, ";
    if (upgradedStats.overdriveGain > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.overdriveGain * 100) + "% Overdrive Gain, ";
    if (upgradedStats.linkEffectiveness > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.linkEffectiveness * 100) + "% Link Effectiveness, ";
    if (upgradedStats.armorPenetration > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.armorPenetration * 100) + "% Armor Penetration, ";
    if (upgradedStats.abilityCooldownReduction > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.abilityCooldownReduction * 100) + "% Ability Cooldown Reduction, ";
    if (upgradedStats.xpGain > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.xpGain * 100) + "% XP Gain, ";
    if (upgradedStats.duoPermanentEffectiveness > 0)
      statGainText += this.utilityService.genericRound(upgradedStats.duoPermanentEffectiveness) + " Duo Ability Upgrade, ";

    var upgradedAbilityName = this.god.abilityList.find(item => item.requiredLevel === upgradedAbilities.requiredLevel)?.name;

    if (upgradedAbilities.effectiveness > 0) {
      if (upgradedAbilityName === "Quicken")
        statGainText += this.utilityService.genericRound(upgradedAbilities.effectiveness * 100) + " Effectiveness, ";
      else
        statGainText += this.utilityService.genericRound(upgradedAbilities.effectiveness * 100) + "% Effectiveness, ";
    }
    if (upgradedAbilities.secondaryEffectiveness > 0) {
      statGainText += this.utilityService.genericRound(upgradedAbilities.secondaryEffectiveness * 100) + "% Additional Effect Effectiveness, ";
    }
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].effectiveness > 0) {
      statGainText += this.utilityService.genericRound(upgradedAbilities.userEffect[0].effectiveness * 100) + "% Buff Effectiveness, ";
    }
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].duration > 0)
      statGainText += this.utilityService.genericRound(upgradedAbilities.userEffect[0].duration) + " Second Buff Duration, ";
    if (upgradedAbilities.userEffect !== undefined && upgradedAbilities.userEffect.length > 0 && upgradedAbilities.userEffect[0].threshold > 0)
      statGainText += this.utilityService.genericRound((upgradedAbilities.userEffect[0].threshold) * 100) + "% Threshold Increase, ";
    if (upgradedAbilities.targetEffect !== undefined && upgradedAbilities.targetEffect.length > 0 && upgradedAbilities.targetEffect[0].effectiveness !== 0)
      statGainText += this.utilityService.genericRound(Math.abs(upgradedAbilities.targetEffect[0].effectiveness) * 100) + "% Debuff Effectiveness, ";
    if (upgradedAbilities.targetEffect !== undefined && upgradedAbilities.targetEffect.length > 0 && upgradedAbilities.targetEffect[0].duration > 0)
      statGainText += this.utilityService.genericRound(upgradedAbilities.targetEffect[0].duration) + " Second Debuff Duration, ";


    if (statGainText !== "")
      statGainText = statGainText.substring(0, statGainText.length - 2);

    return statGainText;
  }

  getHighestLevelReached() {
    var highestLevelReached = this.god.highestLevelReached;
    if (this.god.level > highestLevelReached)
      highestLevelReached = this.god.level;

    return highestLevelReached;
  }

  getDuoAbilityBreakdown() {
    var text = "";

    this.globalService.globalVar.gods.filter(item => item.isAvailable && item.type !== this.god.type).forEach((god, index) => {
      text += "<span class='smallCaps bold'>with</span> <span class='smallCaps bold " + god.name.toLowerCase() + "Color'>" + god.name + "</span> - ";
      if (this.lookupService.isDuoAvailable(this.god.type, god.type)) {
        var gods: GodEnum[] = [];
        gods.push(this.god.type);
        gods.push(god.type);
        var ability = this.lookupService.getDuoAbility(gods);
        var character = this.globalService.globalVar.characters.find(item => item.type === this.characterTemplate);
        text += this.lookupService.getGodAbilityDescription(ability.name, character === undefined ? new Character() : character, ability);
      }
      else {
        text += "???";
      }

      if (index < this.globalService.globalVar.gods.filter(item => item.isAvailable).length - 1)
        text += "<hr/>";
    });

    return text;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
