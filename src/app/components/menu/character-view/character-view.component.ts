import { Component, Input, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.css']
})
export class CharacterViewComponent implements OnInit {
  character: Character;
  subscription: any;
  god1AbilityList: Ability[] = [];
  god2AbilityList: Ability[] = [];
  characterAbilityList: Ability[] = [];
  public noGod = GodEnum.None;
  tooltipDirection = DirectionEnum.Down;
  abilityTooltipDirection = DirectionEnum.UpRight;
  otherClassesAvailable = false;
  overdriveAvailable = false;
  changeGodsAvailable = false;
  @Input() isMobile = false;

  constructor(public menuService: MenuService, public lookupService: LookupService, private globalService: GlobalService,
    private gameLoopService: GameLoopService, public dialog: MatDialog, private utilityService: UtilityService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.otherClassesAvailable = this.globalService.globalVar.characters.filter(item => item.isAvailable).length > 2;
    this.changeGodsAvailable = this.globalService.globalVar.gods.filter(item => item.isAvailable).length >= 2;

    var selectedCharacter = this.globalService.globalVar.characters.find(item => item.type === this.menuService.selectedCharacter);
    if (selectedCharacter !== undefined) {
      this.character = selectedCharacter;
      this.characterAbilityList = this.character.abilityList.sort(function (a, b) {
        return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
      }).filter(item => item.isAvailable);
      this.getCharacterGodAbilities();

      this.overdriveAvailable = this.character.level >= this.utilityService.characterOverdriveLevel;
    }

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedCharacter !== undefined && this.menuService.selectedCharacter !== this.character.type) {
        var selectedCharacter = this.globalService.globalVar.characters.find(item => item.type === this.menuService.selectedCharacter);
        if (selectedCharacter !== undefined) {
          this.character = selectedCharacter;          
          this.characterAbilityList = this.character.abilityList.sort(function (a, b) {
            return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
          }).filter(item => item.isAvailable);
        }
      }

      this.getCharacterGodAbilities();
    });
  }

  getCharacterXp() {
    return this.utilityService.bigNumberReducer(this.character.exp);
  }
  
  getCharacterXpToNextLevel() {
    return this.utilityService.bigNumberReducer(this.character.expToNextLevel);
  }

  getOverdriveName() {
    return this.lookupService.getOverdriveName(this.character.overdriveInfo.selectedOverdrive);
  }

  openOverdriveMenu(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '75%', maxHeight: '75%' });
  }

  openChangeGodMenu(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '95%', height: '80%', id: 'dialogNoPadding' });
    else
      this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
  }

  openChangeClassMenu(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '95%', height: '80%', id: 'dialogNoPadding' });
    else
      this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
  }

  openEquipmentModal(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialog.open(content, { width: '60%', height: '75%', panelClass: 'mat-dialog-no-scroll' });
  }

  getCharacterGodAbilities() {
    this.god1AbilityList = [];
    if (this.character.assignedGod1 !== undefined && this.character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.character.assignedGod1);
      if (god !== undefined)
        this.god1AbilityList = god.abilityList.sort(function (a, b) {
          return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
        }).filter(item => item.isAvailable);
    }

    this.god2AbilityList = [];
    if (this.character.assignedGod2 !== undefined && this.character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.character.assignedGod2);
      if (god !== undefined)
        this.god2AbilityList = god.abilityList.sort(function (a, b) {
          return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
        }).filter(item => item.isAvailable);
    }
  }

  getCharacterGodName(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);

    if (god !== undefined) {
      return god.name;
    }

    return "";
  }

  getCharacterGodLevel(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return god.level;
    }

    return "";
  }

  getCharacterColor() {
    return this.lookupService.getCharacterColorClass(this.character.type);
  }

  getGodAbilityDescription(abilityName: string, character: Character, whichGod: number, ability?: Ability) {
    var godName = this.character.assignedGod1;
    if (whichGod === 2)
      godName = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === godName);

    return this.lookupService.getGodAbilityDescription(abilityName, character, ability, god);
  }

  getAbilityColor(isGod: boolean, whichGod?: number) {
    if (isGod) {
      var god = this.character.assignedGod1;
      if (whichGod === 2)
        god = this.character.assignedGod2;

      return this.lookupService.getGodColorClass(god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type);
    }
  }

  cannotChangeGodsOrClass() {
    return this.lookupService.cannotSwapGodsOrClasses();
  }

  areGodsAvailable() {
    return this.globalService.globalVar.gods.some(item => item.isAvailable);
  }

  multipleGodsAvailable() {
    return this.globalService.globalVar.gods.filter(item => item.isAvailable).length >= 2;
  }

  getHpRegenBonus() {
    return this.character.battleStats.hpRegen;
  }

  getCriticalMultiplierBonus() {
    var defaultMultiplier = .25;
    return defaultMultiplier + this.character.battleStats.criticalMultiplier;
  }

  getAbilityCooldownReductionBonus() {
    return (1 - this.character.battleStats.abilityCooldownReduction) * 100;
  }

  getAutoAttackCooldownBonus() {
    return (1 - this.character.battleStats.autoAttackCooldownReduction) * 100;
  }

  getLinkEffectivenessBonus() {
    return this.character.battleStats.linkEffectiveness;
  }

  getOverdriveGainBonus() {
    return this.character.battleStats.overdriveGain;
  }

  getHealingReceivedBonus() {
    return this.character.battleStats.healingReceived;
  }
  
  getAllyDamageBonus() {
    return this.character.battleStats.allyDamageBonus;
  }

  getDebuffDurationBonus() {
    return this.character.battleStats.debuffDuration;
  }

  getBuffDurationBonus() {
    return this.character.battleStats.buffDuration;
  }

  getOverdriveGainFromAutoAttacksBonus() {
    return this.character.battleStats.overdriveGainFromAutoAttacks;
  }

  getHealingDoneBonus() {
    return this.character.battleStats.healingDone;
  }

  getAoeDamageBonus() {
    return this.character.battleStats.aoeDamage;
  }

  getThornsBonus() {
    return this.character.battleStats.thorns;
  }

  getElementResistanceReductionBonus() {
    return this.character.battleStats.elementResistanceReduction;
  }

  getAbilityCooldownReductionWithBuffsBonus() {
    return (1 - this.character.battleStats.abilityCooldownReductionWithBuffs);
  }

  getAbilityCooldownReductionStartBonus() {
    return (1 - this.character.battleStats.abilityCooldownReductionStart);
  }

  getTickFrequencyBonus() {
    return this.character.battleStats.tickFrequency;
  }

  getArmorPenetrationBonus() {
    return this.character.battleStats.armorPenetration;
  }

  getHolyDamageBonus() {
    return this.character.battleStats.elementIncrease.holy;
  }

  getFireDamageBonus() {
    return this.character.battleStats.elementIncrease.fire;
  }

  getLightningDamageBonus() {
    return this.character.battleStats.elementIncrease.lightning;
  }

  getAirDamageBonus() {
    return this.character.battleStats.elementIncrease.air;
  }

  getWaterDamageBonus() {
    return this.character.battleStats.elementIncrease.water;
  }

  getEarthDamageBonus() {
    return this.character.battleStats.elementIncrease.earth;
  }

  getHolyResistanceBonus() {
    return this.character.battleStats.elementResistance.holy;
  }

  getFireResistanceBonus() {
    return this.character.battleStats.elementResistance.fire;
  }

  getAirResistanceBonus() {
    return this.character.battleStats.elementResistance.air;
  }

  getLightningResistanceBonus() {
    return this.character.battleStats.elementResistance.lightning;
  }

  getWaterResistanceBonus() {
    return this.character.battleStats.elementResistance.water;
  }

  getEarthResistanceBonus() {
    return this.character.battleStats.elementResistance.earth;
  }

  hasMoreThanOneCharacter() {
    return this.globalService.globalVar.characters.filter(item => item.isAvailable).length > 1;
  }

  traverseSubMenu(direction: number) {
    var partyMembers = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    var currentIndex = partyMembers.findIndex(item => item.type === this.menuService.selectedCharacter);
    currentIndex += direction;

    if (currentIndex < 0)
      currentIndex = partyMembers.length - 1;
    if (currentIndex > partyMembers.length - 1)
      currentIndex = 0;

    this.menuService.setSelectedCharacter(partyMembers[currentIndex].type);
  }


  getAbilityUpgradeLevel(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined)
      return 0;

    return permanentAbilityIncreases.abilityUpgradeLevel;
  }

  getGodAbilityUpgradeLevel(ability: Ability) {
    return ability.abilityUpgradeLevel;
  }

  getAbilityEffectivenessIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined)
      return 0;

    //var baseCharacter = new Character(this.character.type);
    //this.globalService.assignAbilityInfo(baseCharacter);
    //var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    //if (baseAbility !== undefined) {
      //return this.utilityService.genericRound((ability.effectiveness - baseAbility.effectiveness) * 100) + "%";
    //}
    return this.utilityService.genericRound((permanentAbilityIncreases.effectiveness) * 100) + "%";
  }

  getSecondaryAbilityEffectivenessIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined)
      return 0;

    return this.utilityService.genericRound((permanentAbilityIncreases.secondaryEffectiveness) * 100) + "%";    
  }

  getAbilityEffectCountIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);

    return 0;
  }

  getAbilityEffectMaxCountIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined)
      return 0;

    return this.utilityService.genericRound(permanentAbilityIncreases.maxCount);    
  }

  getAbilityUserEffectEffectivenessIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined || permanentAbilityIncreases.userEffect.length === 0)
      return 0;

    return this.utilityService.genericRound((permanentAbilityIncreases.userEffect[0].effectiveness) * 100) + "%";    
  }

  getAbilityUserEffectDurationIncrease(ability: Ability) {    
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined || permanentAbilityIncreases.userEffect.length === 0)
      return 0;

    return this.utilityService.genericRound(permanentAbilityIncreases.userEffect[0].duration);    
  }

  getAbilityTargetEffectEffectivenessIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined || permanentAbilityIncreases.targetEffect.length === 0)
      return 0;

    return this.utilityService.genericRound((permanentAbilityIncreases.targetEffect[0].effectiveness) * 100) + "%";    
  }

  getAbilityTargetEffectDurationIncrease(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined || permanentAbilityIncreases.targetEffect.length === 0)
      return 0;

    return this.utilityService.genericRound(permanentAbilityIncreases.targetEffect[0].duration);    
  }

  getAbilityCooldownReduction(ability: Ability) {
    var permanentAbilityIncreases = this.character.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);    
    if (permanentAbilityIncreases === undefined)
      return 0;

    return this.utilityService.genericRound(permanentAbilityIncreases.cooldown);    
  }

  getGodPermanentAbilityEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.effectiveness;

    if (ability.name === "Quicken")
      return this.utilityService.genericRound(permanentAbilityUpgradeAmount);
    else
      return this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100) + "%";
  }
  
  getGodPermanentSecondaryAbilityEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.secondaryEffectiveness;

      return this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100) + "%";
  }

  getGodPermanentAbilityUserEffectEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].effectiveness;

    if (ability !== undefined && ability.userEffect.length > 0) {
      if (ability.name === "Second Wind")
        return "*" + this.utilityService.genericRound(1 + permanentAbilityUpgradeAmount);
      else
        return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getGodPermanentAbilityUserEffectThresholdIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;
    
    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);     
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0 &&
      permanentAbilityUpgrade.userEffect[0].threshold !== undefined && !Number.isNaN(permanentAbilityUpgrade.userEffect[0].threshold))
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].threshold;

    if (ability !== undefined && ability.userEffect.length > 0) {         
      return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getGodPermanentAbilityUserEffectDurationIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.userEffect !== undefined && permanentAbilityUpgrade.userEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.userEffect[0].duration;

    if (ability !== undefined && ability.userEffect.length > 0)
      return this.utilityService.roundTo(permanentAbilityUpgradeAmount, 2);

    return 0;
  }

  getGodPermanentAbilityTargetEffectEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.targetEffect !== undefined && permanentAbilityUpgrade.targetEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.targetEffect[0].effectiveness;

    if (ability !== undefined && ability.targetEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound(permanentAbilityUpgradeAmount * 100)) + "%";
    }

    return 0;
  }

  getGodPermanentAbilityTargetEffectDurationIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var permanentAbilityUpgradeAmount = 0;
    var originalGod = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (originalGod === undefined)
      return 0;

    var permanentAbilityUpgrade = originalGod.permanentAbilityUpgrades.find(item => item.requiredLevel === ability.requiredLevel);
    if (permanentAbilityUpgrade !== undefined && permanentAbilityUpgrade.targetEffect !== undefined && permanentAbilityUpgrade.targetEffect.length > 0)
      permanentAbilityUpgradeAmount = permanentAbilityUpgrade.targetEffect[0].duration;

    if (ability !== undefined && ability.targetEffect.length > 0)
      return this.utilityService.roundTo(permanentAbilityUpgradeAmount, 2);

    return 0;
  }


  getGodAbilityEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
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

  getGodSecondaryAbilityEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      return this.utilityService.genericRound((ability.secondaryEffectiveness - baseAbility.secondaryEffectiveness) * 100) + "%";
    }

    return 0;
  }

  getGodAbilityEffectCountIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      if (baseAbility.name === "Special Delivery")
        return this.utilityService.genericRound((ability.userEffect.length - baseAbility.userEffect.length));
      if (baseAbility.name === "No Escape")
        return this.utilityService.genericRound((ability.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).length - baseAbility.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).length));
      if (baseAbility.name === "Insanity")
        return this.utilityService.genericRound((ability.targetEffect.length - baseAbility.targetEffect.length));
    }

    return 0;
  }

  getGodAbilityEffectMaxCountIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
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

  getGodAbilityUserEffectEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
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
  
  getGodAbilityUserEffectThresholdIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0 && ability.userEffect[0].threshold !== undefined && !Number.isNaN(ability.userEffect[0].threshold)) {      
      return Math.abs(this.utilityService.genericRound((ability.userEffect[0].threshold - baseAbility.userEffect[0].threshold) * 100)) + "%";
    }

    return 0;
  }

  getGodAbilityUserEffectDurationIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0)
      return this.utilityService.roundTo((ability.userEffect[0].duration - baseAbility.userEffect[0].duration), 2);

    return 0;
  }

  getGodAbilityTargetEffectEffectivenessIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound((ability.targetEffect[0].effectiveness - baseAbility.targetEffect[0].effectiveness) * 100)) + "%";
    }

    return 0;
  }

  getGodAbilityTargetEffectDurationIncrease(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0)
      return this.utilityService.roundTo((ability.targetEffect[0].duration - baseAbility.targetEffect[0].duration), 2);

    return 0;
  }

  getGodAbilityCooldownReduction(ability: Ability, whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var baseGod = new God(matchTo);
    this.globalService.assignGodAbilityInfo(baseGod);
    var baseAbility = baseGod.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined)
      return this.utilityService.genericRound(Math.abs(ability.cooldown - baseAbility.cooldown));

    return 0;
  }

  openPermanentStatBreakdown(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%', panelClass: 'mat-dialog-no-scroll' });
    else
      this.dialog.open(content, { width: '60%', height: '75%', panelClass: 'mat-dialog-no-scroll' });
  }


  getPermanentStatBreakdown() {
    var text = "";
    var allPermanentStatCounts: [number, number][] = [];
    this.character.permanentAbility1GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.character.permanentAbility2GainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });
    this.character.permanentPassiveGainCount.forEach(item => {
      allPermanentStatCounts.push(item);
    });

    allPermanentStatCounts.sort((a, b) => this.sortStats(a, b)).forEach(item => {
      if (item[1] > 0) {
        var gainCap = 0;

        if (item[0] % 10 === 2) {
          gainCap = this.utilityService.characterPermanentAbility1ObtainCap;
        }
        if (item[0] % 10 === 4) {
          gainCap = this.utilityService.characterPermanentPassiveObtainCap;
        }
        if (item[0] % 10 === 8) {
          gainCap = this.utilityService.characterPermanentAbility2ObtainCap;
        }

        var abilities = this.globalService.getCharacterAbilityUpgrade(this.character, item[0]);
        var increasedStat = this.getIncreasedStatFromStats(new CharacterStats(0, 0, 0, 0, 0, 0), abilities);

        var upgradedAbilityName = this.character.abilityList.find(item => item.requiredLevel === abilities.requiredLevel)?.name;
        if (upgradedAbilityName !== undefined)
          upgradedAbilityName += " ";        
        else
          upgradedAbilityName = "";

        var clearClass = "";
        if (item[1] >= gainCap)
          clearClass = "completedSubzoneColor";

        text += "<span class='statLabel " + this.character.name.toLowerCase() + "Color'>Level " + item[0] + ":</span> <span class='bold statValue " + clearClass + "'>" + upgradedAbilityName + "+" + increasedStat + " - " + item[1] + " / " + (gainCap) + " obtained</span><hr class='slimMargin'/>";
      }
    });

    return text;
  }

  sortStats(a: [number, number], b: [number, number]) {
    var ascending = 1;
    var descending = -1;

    return a[0] < b[0] ? descending : a[0] > b[0] ? ascending : 0;
  }

  getIncreasedStatFromStats(upgradedStats: CharacterStats, upgradedAbilities: Ability) {
    var statGainText = "";

    if (upgradedStats.maxHp > 0)
      statGainText += Math.round(upgradedStats.maxHp) + " Max HP, ";
    if (upgradedStats.attack > 0)
      statGainText += Math.round(upgradedStats.attack) + " Attack, ";
    if (upgradedStats.agility > 0)
      statGainText += Math.round(upgradedStats.agility) + " Agility, ";
    if (upgradedStats.luck > 0)
      statGainText += Math.round(upgradedStats.luck) + " Luck, ";
    if (upgradedStats.defense > 0)
      statGainText += Math.round(upgradedStats.defense) + " Defense, ";
    if (upgradedStats.resistance > 0)
      statGainText += Math.round(upgradedStats.resistance) + " Resistance, ";

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

    if (upgradedAbilities.effectiveness > 0) {
      statGainText += this.utilityService.genericRound(upgradedAbilities.effectiveness * 100) + "% Effectiveness, ";
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

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
