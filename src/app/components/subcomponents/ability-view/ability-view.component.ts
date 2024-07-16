import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
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
  verboseMode = false;
  tooltipDirection = DirectionEnum.Right;
  clickCount = 0;
  doubleClickTiming = 300;
  isAnimationActive: boolean = false; //for low performance mode
  animationDuration: number = 0;
  animationMaxDuration: number = 2;
  animationSubscription: any;
  previousProgress: number = 0;
  showPercents: boolean;
  linksAvailable = false;

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    private globalService: GlobalService, private keybindService: KeybindService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.verboseMode = this.globalService.globalVar.settings.get("verboseMode") ?? false;
    this.doubleClickTiming = this.globalService.globalVar.settings.get("doubleClickTiming") ?? this.utilityService.quickDoubleClickTiming;
     if (this.doubleClickTiming < 250)
      this.doubleClickTiming = 250;
    this.showPercents = this.globalService.globalVar.settings.get("showAbilityCooldownPercents") ?? true;    

    this.linksAvailable = this.character.linkInfo.totalLinks > 0;

    if (this.isMobile)
      this.tooltipDirection = DirectionEnum.Up;

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

    if (this.globalService.globalVar.settings.get("fps") === this.utilityService.lowFps &&
      this.globalService.globalVar.settings.get("showLowPerformanceAnimationFlash")) {
      var row = this.getFlashRow();
      var color = "#ff0000";
      if (this.isAutoAttack) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--' + this.globalService.getCharacterColorClassText(this.character.type));
      }
      else {
        if (this.god !== undefined)
          color = getComputedStyle(document.documentElement).getPropertyValue('--' + this.globalService.getGodColorClassText(this.god));
        else
          color = getComputedStyle(document.documentElement).getPropertyValue('--' + this.globalService.getCharacterColorClassText(this.character.type));
      }

      document.documentElement.style.setProperty('--low-performance-ability-animation-color-row' + row, color);

      this.animationSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime: number) => {
        if (this.isAnimationActive) {
          this.animationDuration += deltaTime;
          if (this.animationDuration >= this.animationMaxDuration) {
            this.animationDuration = 0;
            this.isAnimationActive = false;
          }
        }

        var progress = 0;
        if (this.isAutoAttack) {
          var timeToAutoAttack = this.globalService.getAutoAttackTime(this.character);
          progress = (this.character.battleInfo.autoAttackTimer / timeToAutoAttack) * 100;
        }
        else
          progress = 100 - ((this.ability.currentCooldown / this.globalService.getAbilityCooldown(this.ability, this.character)) * 100);

        if (progress < this.previousProgress) {
          this.isAnimationActive = true;
          this.animationDuration = 0;
        }

        this.previousProgress = progress;
      });
    }
  }

  getFlashRow() {
    var party = this.globalService.getActivePartyCharacters(true);
    if (party === undefined || party.length === 0)
      return 0;

    if (this.character.type === party[0].type) {
      if (this.isAutoAttack || this.god === undefined)
        return 1;
      else if (this.god === this.character.assignedGod1)
        return 2;
      else if (this.god === this.character.assignedGod2)
        return 3;
    }
    else {
      if (this.isAutoAttack || this.god === undefined)
        return 4;
      else if (this.god === this.character.assignedGod1)
        return 5;
      else if (this.god === this.character.assignedGod2)
        return 6;
    }

    return 0;
  }

  getCharacterAutoAttackProgress() {
    var timeToAutoAttack = this.globalService.getAutoAttackTime(this.character);
    var progress = (this.character.battleInfo.autoAttackTimer / timeToAutoAttack) * 100;
    
    return progress;
  }

  getAbilityProgress() {
    if (this.ability === undefined)
      return 0;

    var progress = 100 - ((this.ability.currentCooldown / this.globalService.getAbilityCooldown(this.ability, this.character)) * 100);
    
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

    if (description === "") {
      var god: God | undefined = undefined;
      if (this.god !== undefined)
        god = this.globalService.globalVar.gods.find(item => item.type === this.god);

      description = this.lookupService.getGodAbilityDescription(this.ability.name, this.character, this.ability, god);
    }

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

  toggleAutoWeb() {
    if (!this.isMobile) {
      this.toggleAuto();
    }

    return false;
  }

  toggleAuto() {
    this.autoMode = !this.autoMode;
    if (this.ability !== undefined) {
      this.ability.autoMode = this.autoMode;
      this.ability.manuallyTriggered = false;
    }
    else
      this.character.battleInfo.autoAttackAutoMode = this.autoMode;

    return false;
  }

  manuallyTrigger() {
    if (this.ability !== undefined)
      this.ability.manuallyTriggered = !this.ability.manuallyTriggered;
    else
      this.character.battleInfo.autoAttackManuallyTriggered = !this.character.battleInfo.autoAttackManuallyTriggered;

    if (this.isMobile) {
      this.clickCount += 1;
      //console.log("Click Count: " + this.clickCount);
      setTimeout(() => {
        if (this.clickCount === 2) {
          this.toggleAuto();
          //console.log("Click 2");
        }
        //console.log("Reset Click");
        this.clickCount = 0;
      }, this.doubleClickTiming)
    }
  }

  getStrokeColor() {
    if (this.god !== undefined) {
      return this.lookupService.getGodColorClass(this.god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type);
    }
  }

  getLowPerformanceProgress() {
    var progress = (this.isAutoAttack ? this.getCharacterAutoAttackProgress() : this.getAbilityProgress());
    if (progress > 100)
      progress = 100;

    return progress;
  }

  getProgressColor() {
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

  getAutoManualText() {
    var isAuto = true;
    if (this.ability !== undefined) {
      isAuto = this.ability.autoMode;
    }
    else
      isAuto = this.character.battleInfo.autoAttackAutoMode;

    if (isAuto)
      return "AUTO";
    else
      return "MANUAL";
  }

  getLinkText() {
    var isLinking = false;
    if (this.ability !== undefined) {
      isLinking = this.ability.manuallyTriggered;
    }

    if (isLinking)
      return "LINKED";
    else
      return "";
  }

  notLowPerformanceMode() {
    return this.globalService.globalVar.settings.get("fps") === undefined || this.globalService.globalVar.settings.get("fps") !== this.utilityService.lowFps;
  }

  isCharacterKOd() {
    return this.character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Dead);
  }

  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    if (this.animationSubscription !== undefined)
      this.animationSubscription.unsubscribe();
  }
}
