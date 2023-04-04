import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-ability-view',
  templateUrl: './ability-view.component.html',
  styleUrls: ['./ability-view.component.css']
})
export class AbilityViewComponent implements OnInit {
  @Input() character: Character;
  @Input() ability: Ability;
  @Input() isAutoAttack: boolean = false;
  @Input() god: GodEnum | undefined = undefined;
  @Input() abilityIndex: number = 0;
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;
  autoMode: boolean;
  spinnerDivSubscription: any;
  isMobile: boolean = false;
  longPressStartTime = 0;

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    private globalService: GlobalService, private keybindService: KeybindService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();

    if (this.ability === undefined)
      this.autoMode = this.character.battleInfo.autoAttackAutoMode;
    else
      this.autoMode = this.ability.autoMode;
  }

  ngAfterViewInit(): void {
    if (this.spinnerDiv.nativeElement.offsetHeight > 0)
      this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;

    if (this.spinnerDiv.nativeElement.offsetHeight === 0) {
      this.spinnerDivSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
        if (this.spinnerDiv.nativeElement.offsetHeight > 0)
          this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;

        if (this.spinnerDiv.nativeElement.offsetHeight > 0)
          this.spinnerDivSubscription.unsubscribe();
      });
    }
  }

  getCharacterAutoAttackProgress() {
    var timeToAutoAttack = this.globalService.getAutoAttackTime(this.character);
    return (this.character.battleInfo.autoAttackTimer / timeToAutoAttack) * 100;
  }

  getAbilityProgress() {
    if (this.ability === undefined)
      return 0;

    var progress = 100 - ((this.ability.currentCooldown / this.lookupService.getAbilityCooldown(this.ability, this.character)) * 100);

    if (progress < 0)
      progress = 0;

    return progress;
  }

  getAbilityName() {
    if (this.isAutoAttack)
      return "Auto Attack";

    if (this.ability === undefined)
      return;

    return this.utilityService.getSanitizedHtml(this.ability.name);
  }

  getAbilityDescription() {
    var description = "";

    if (this.isAutoAttack)
      description = this.lookupService.getAutoAttackDescription(this.character);
    else
      description = this.lookupService.getCharacterAbilityDescription(this.ability.name, this.character, this.ability);

    if (description === "")
      description = this.lookupService.getGodAbilityDescription(this.ability.name, this.character, this.ability);

    return this.utilityService.getSanitizedHtml(description);
  }

  longPressStart() {
    this.longPressStartTime = performance.now();
  }

  longPressEnd() {
    var timePassed = performance.now() - this.longPressStartTime;
    this.longPressStartTime = 0;

    if (timePassed > 500 && this.isMobile) { //longer than .5 seconds
      this.toggleAuto();
    }
  }

  toggleAuto() {    
    this.autoMode = !this.autoMode;
    if (this.ability !== undefined)
      this.ability.autoMode = this.autoMode;
    else
      this.character.battleInfo.autoAttackAutoMode = this.autoMode;

    return false;
  }

  manuallyTrigger() {
    if (this.ability !== undefined)
      this.ability.manuallyTriggered = true;
    else
      this.character.battleInfo.autoAttackManuallyTriggered = true;
  }

  getStrokeColor() {
    if (this.god !== undefined) {
      return this.lookupService.getGodColorClass(this.god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type);
    }
  }

  getKeybind() {
    var keybindKey = "";
    var keybindString = "openFirstAvailableAltar";

    if (this.character.type === this.globalService.globalVar.activePartyMember1) {
      if (this.isAutoAttack)
        keybindString = "useCharacter1AutoAttack";
      else {
        if (this.god === undefined) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter1Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter1Ability2";
        }
        else if (this.god === this.character.assignedGod1) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter1God1Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter1God1Ability2";
          else if (this.abilityIndex === 2)
            keybindString = "useCharacter1God1Ability3";
        }
        else if (this.god === this.character.assignedGod2) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter1God2Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter1God2Ability2";
          else if (this.abilityIndex === 2)
            keybindString = "useCharacter1God2Ability3";
        }
      }
    }
    else {
      if (this.isAutoAttack)
        keybindString = "useCharacter2AutoAttack";
      else {
        if (this.god === undefined) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter2Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter2Ability2";
        }
        else if (this.god === this.character.assignedGod1) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter2God1Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter2God1Ability2";
          else if (this.abilityIndex === 2)
            keybindString = "useCharacter2God1Ability3";
        }
        else if (this.god === this.character.assignedGod2) {
          if (this.abilityIndex === 0)
            keybindString = "useCharacter2God2Ability1";
          else if (this.abilityIndex === 1)
            keybindString = "useCharacter2God2Ability2";
          else if (this.abilityIndex === 2)
            keybindString = "useCharacter2God2Ability3";
        }
      }
    }

    var keybind = this.globalService.globalVar.keybinds.settings.find(item => item[0] === keybindString);
    if (keybind !== undefined)
      keybindKey = this.keybindService.getBindingString(keybind[1]);

    return "<span class='keybind'>" + keybindKey + "</span>";
  }

  preventRightClick() {    
    return false;
  }

  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();
  }
}
