import { Component, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
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
  otherClassesAvailable = false;
  overdriveAvailable = false;
  changeGodsAvailable = false;

  constructor(public menuService: MenuService, public lookupService: LookupService, private globalService: GlobalService,
    private gameLoopService: GameLoopService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.otherClassesAvailable = this.globalService.globalVar.characters.filter(item => item.isAvailable).length > 2;
    this.changeGodsAvailable = this.globalService.globalVar.gods.filter(item => item.isAvailable).length >= 2;

    var selectedCharacter = this.globalService.globalVar.characters.find(item => item.type === this.menuService.selectedCharacter);    
    if (selectedCharacter !== undefined)
    {
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
        if (selectedCharacter !== undefined)
        {
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
    this.dialog.open(content, { width: '75%', maxHeight: '75%'});
  }

  openChangeGodMenu(content: any) {          
    this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding'  });  
  }

  openChangeClassMenu(content: any) {          
    this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding'  });  
  }

  openEquipmentModal(content: any) {
    this.dialog.open(content, { width: '50%', height: '55%', panelClass: 'mat-dialog-no-scroll' });
  }

  getCharacterGodAbilities() {
    this.god1AbilityList = [];
    if (this.character.assignedGod1 !== undefined && this.character.assignedGod1 !== GodEnum.None)
    {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.character.assignedGod1);
      if (god !== undefined)
        this.god1AbilityList = god.abilityList.sort(function (a, b) {
          return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
        }).filter(item => item.isAvailable);
    }

    this.god2AbilityList = [];
    if (this.character.assignedGod2 !== undefined && this.character.assignedGod2 !== GodEnum.None)
    {
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
  
  getArmorPenetrationBonus() {    
    return this.character.battleStats.armorPenetration;
  }

  getHolyDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.holy;
  }

  getFireDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.fire;
  }
  
  getLightningDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.lightning;
  }

  getAirDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.air;
  }

  getWaterDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.water;
  }

  getEarthDamageBonus() {
    return this.character.battleStats.elementalDamageIncrease.earth;
  }

  getHolyResistanceBonus() {
    return this.character.battleStats.elementalDamageResistance.holy;
  }

  getFireResistanceBonus() {    
    return this.character.battleStats.elementalDamageResistance.fire;
  }

  getAirResistanceBonus() {
    return this.character.battleStats.elementalDamageResistance.air;
  }

  getLightningResistanceBonus() {
    return this.character.battleStats.elementalDamageResistance.lightning;
  }

  getWaterResistanceBonus() {
    return this.character.battleStats.elementalDamageResistance.water;
  }

  getEarthResistanceBonus() {
    return this.character.battleStats.elementalDamageResistance.earth;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
