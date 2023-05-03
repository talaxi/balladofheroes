import { Component, Input, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { Ability } from 'src/app/models/character/ability.model';
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
    private gameLoopService: GameLoopService, public dialog: MatDialog, private utilityService: UtilityService) { }

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

    return this.lookupService.getGodAbilityDescription(abilityName, character, ability);
  }

  getAbilityColor(isGod: boolean, whichGod?: number) {
    if (isGod) {
      var god = this.character.assignedGod1;
      if (whichGod === 2)
        god = this.character.assignedGod2;

      return this.lookupService.getGodColorClass(god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type)
    }
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

  getOverdriveGainBonus() {
    return this.character.battleStats.overdriveGain;
  }

  getHealingReceivedBonus() {
    return this.character.battleStats.healingReceived;
  }

  getDebuffDurationBonus() {
    return this.character.battleStats.debuffDuration;
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
    return ability.abilityUpgradeLevel;
  }

  getAbilityEffectivenessIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {      
        return this.utilityService.genericRound((ability.effectiveness - baseAbility.effectiveness) * 100) + "%";
    }

    return 0;
  }

  getSecondaryAbilityEffectivenessIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      return this.utilityService.genericRound((ability.secondaryEffectiveness - baseAbility.secondaryEffectiveness) * 100) + "%";
    }

    return 0;
  }

  getAbilityEffectCountIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    return 0;
  }

  getAbilityEffectMaxCountIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined) {
      return this.utilityService.genericRound((ability.maxCount - baseAbility.maxCount));
    }

    return 0;
  }

  getAbilityUserEffectEffectivenessIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound((ability.userEffect[0].effectiveness - baseAbility.userEffect[0].effectiveness) * 100)) + "%";
    }

    return 0;
  }

  getAbilityUserEffectDurationIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.userEffect.length > 0)
      return this.utilityService.roundTo((ability.userEffect[0].duration - baseAbility.userEffect[0].duration), 2);

    return 0;
  }

  getAbilityTargetEffectEffectivenessIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0) {
      return Math.abs(this.utilityService.genericRound((ability.targetEffect[0].effectiveness - baseAbility.targetEffect[0].effectiveness) * 100)) + "%";
    }

    return 0;
  }

  getAbilityTargetEffectDurationIncrease(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined && baseAbility.targetEffect.length > 0)
      return this.utilityService.roundTo((ability.targetEffect[0].duration - baseAbility.targetEffect[0].duration), 2);

    return 0;
  }

  getAbilityCooldownReduction(ability: Ability) {
    var baseCharacter = new Character(this.character.type);
    this.globalService.assignAbilityInfo(baseCharacter);
    var baseAbility = baseCharacter.abilityList.find(item => item.name === ability.name);

    if (baseAbility !== undefined)
      return this.utilityService.genericRound(Math.abs(ability.cooldown - baseAbility.cooldown));

    return 0;
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
        return this.utilityService.genericRound(permanentAbilityUpgradeAmount);
      else
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


  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
