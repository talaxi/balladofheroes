import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { AltarService } from 'src/app/services/altar/altar.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-altar-view',
  templateUrl: './altar-view.component.html',
  styleUrls: ['./altar-view.component.css']
})
export class AltarViewComponent implements OnInit {
  @Input() altar: AltarInfo;
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;
  autoMode: boolean;
  spinnerDivSubscription: any;
  subscription: any;
  altarType = AltarEnum;
  tooltipDirection = DirectionEnum.Left;
  isReady = false;
  previousGod: GodEnum;
  previousAffinityLevel: number;
  showAffinityLevelUpAnimation = false;
  animation1Timer = 0;
  animationTimerCap = 3;
  animationSubscription: any;

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    public globalService: GlobalService, private changeDetectorRef: ChangeDetectorRef, private altarService: AltarService,
    private keybindService: KeybindService) { }

  ngOnInit(): void {
    this.isReady = this.isAltarReady();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      var isReadyNow = this.isAltarReady();
      /*if (isReadyNow && !this.isReady)
      {
        if (this.globalService.globalVar.altarInfo.length < 5)
          this.globalService.globalVar.altarInfo.push(this.altarService.getNewSmallAltar());
      }*/

      this.isReady = isReadyNow;
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
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

  getAltarCompletionPercent() {
    return (this.altar.conditionCount / this.altar.conditionMax) * 100;
  }

  getStrokeColor() {
    return this.lookupService.getGodColorClass(this.altar.god);
  }

  viewAltar() {
    /*this.globalService.globalVar.activeBattle.atScene = true;
    this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Altar;
    this.globalService.globalVar.activeBattle.selectedAltar = this.altar;*/

    if (this.altar !== undefined) {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.altar.god);
      if (god !== undefined) {
        this.previousGod = god.type;
        this.previousAffinityLevel = god.affinityLevel;
      }
    }

    this.altarService.pray(this.altar);

    if (this.altar !== undefined) {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.altar.god);
      if (god !== undefined && god.type === this.previousGod) {
        var affinityLevel = god.affinityLevel;

        if (affinityLevel > this.previousAffinityLevel) {
          this.showAffinityLevelUpAnimation = true;
          this.previousAffinityLevel = affinityLevel;
        }
      }
      else
        this.previousGod = god === undefined ? GodEnum.None : god.type;
    }

    this.animationSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (this.showAffinityLevelUpAnimation) {
        this.animation1Timer += deltaTime;
        if (this.animation1Timer >= this.animationTimerCap) {
          this.animation1Timer = 0;
          this.showAffinityLevelUpAnimation = false;
          this.animationSubscription.unsubscribe();
        }
      }
    });
  }

  getAltarName() {
    var typeName = "";
    var godType = GodEnum.None;

    if (this.altar !== undefined && this.altar.type === AltarEnum.Small) {
      typeName = "Small Altar";
      godType = this.altar.god;
    }

    return "<strong>" + typeName + "</strong> to <strong>" + this.lookupService.getGodNameByType(godType) + "</strong>";
  }

  getAltarDescription() {
    var description = "";
    var godType = GodEnum.None;
    var keybindKey = "";
    var keybindString = "openFirstAvailableAltar";

    if (this.globalService.globalVar.altars.altar2 === this.altar)
      keybindString = "openSecondAvailableAltar";
    if (this.globalService.globalVar.altars.altar3 === this.altar)
      keybindString = "openThirdAvailableAltar";

    var keybind = this.globalService.globalVar.keybinds.settings.find(item => item[0] === keybindString);
    if (keybind !== undefined)
      keybindKey = this.keybindService.getBindingString(keybind[1]);

    if (this.altar !== undefined && this.altar.type === AltarEnum.Small) {
      godType = this.altar.god;

      description = "When the condition is met, click or press <span class='keybind'>" + keybindKey + "</span> to pray at a <strong>Small Altar</strong> to <strong>" + this.lookupService.getGodNameByType(godType) + "</strong> for a boon. <strong>" + this.lookupService.getGodNameByType(godType) + "</strong> gains " + this.utilityService.basePrayGodXpIncrease + " XP and " + this.utilityService.smallAltarAffinityGain + " Affinity XP.";
    }

    return description;
  }

  getAltarConditions() {
    var conditionText = "Condition: ";
    if (this.altar !== undefined && this.altar.type === AltarEnum.Small) {
      conditionText += this.altar.conditionCount + " / " + this.altar.conditionMax + " ";

      if (this.altar.condition === AltarConditionEnum.AbilityUse)
        conditionText += "Ability Uses";
      if (this.altar.condition === AltarConditionEnum.AutoAttackUse)
        conditionText += "Auto Attacks";
      if (this.altar.condition === AltarConditionEnum.OverdriveUse)
        conditionText += "Overdrives";
      if (this.altar.condition === AltarConditionEnum.Victories)
        conditionText += "Victories";
    }

    return conditionText;
  }

  isAltarReady() {
    if (this.altar === undefined)
      return false;

    return this.altar.conditionCount >= this.altar.conditionMax;
  }

  getAltarImage() {
    var image = "assets/svg/";

    if (this.altar.type === AltarEnum.Small)
      image += "smallAltar.svg";
    if (this.altar.type === AltarEnum.Large)
      image += "largeAltar.svg";

    return image;
  }

  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    if (this.animationSubscription !== undefined)
      this.animationSubscription.unsubscribe();
  }
}
