import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-altar-options-view',
  templateUrl: './altar-options-view.component.html',
  styleUrls: ['./altar-options-view.component.css']
})
export class AltarOptionsViewComponent implements OnInit {
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;
  autoMode: boolean;
  spinnerDivSubscription: any;
  subscription: any;
  smallAltar: AltarInfo | undefined;
  altarType = AltarEnum;
  tooltipDirection = DirectionEnum.Down;
  buffTooltipDirection = DirectionEnum.Left;

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    public globalService: GlobalService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {    
    this.smallAltar = this.globalService.globalVar.altarInfo.find(item => item.type === AltarEnum.Small);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      var smallAltar = this.globalService.globalVar.altarInfo.find(item => item.type === AltarEnum.Small);
      if (smallAltar !== this.smallAltar) {
        this.changeDetectorRef.detectChanges();
        this.smallAltar = smallAltar;
      }
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

  getAltarCompletionPercent(altar: AltarInfo) {
    return (altar.conditionCount / altar.conditionMax) * 100;
  }

  getStrokeColor(altar: AltarInfo) {
    return this.lookupService.getGodColorClass(altar.god);
  }

  viewAltar(altar: AltarInfo) {
    this.globalService.globalVar.activeBattle.atScene = true;
    this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Altar;
    this.globalService.globalVar.activeBattle.selectedAltar = altar;
  }

  getAltarName(type: AltarEnum) {    
    var typeName = "";
    var godType = GodEnum.None;

    if (type === AltarEnum.Small && this.smallAltar !== undefined) {
      typeName = "Small Altar";
      godType = this.smallAltar?.god;
    }

    return typeName + " to " + this.lookupService.getGodNameByType(godType);
  }

  getAltarDescription(type: AltarEnum) {
    var description = "";
    var godType = GodEnum.None;

    if (type === AltarEnum.Small && this.smallAltar !== undefined) {
      godType = this.smallAltar?.god;

      description = "When the condition is met, click to pray at a small altar to " + this.lookupService.getGodNameByType(godType) + " for a blessing.";
    }

    return description;
  }
  
  getAltarConditions(type: AltarEnum) {
    var conditionText = "Condition: ";
    if (type === AltarEnum.Small && this.smallAltar !== undefined) {
      conditionText += this.smallAltar.conditionCount + " / " + this.smallAltar.conditionMax + " ";

      if (this.smallAltar.condition === AltarConditionEnum.AbilityUse)
        conditionText += "Ability Uses";
      if (this.smallAltar.condition === AltarConditionEnum.AutoAttackUse)
        conditionText += "Auto Attacks";
      if (this.smallAltar.condition === AltarConditionEnum.OverdriveUse)
        conditionText += "Overdrives";
      if (this.smallAltar.condition === AltarConditionEnum.Victories)
        conditionText += "Victories";
    }

    return conditionText;
  }

  getAltarEffects() {
    var effects = "";

    this.globalService.globalVar.activeAltarEffects.forEach(effect => {
      effects += this.lookupService.getAltarEffectDescription(effect);      
    });
    
    effects = effects.replace(new RegExp("<hr/>" + '$'), '');

    return this.utilityService.getSanitizedHtml(effects);
  }

  isAltarReady(altar: AltarInfo) {
    return altar.conditionCount >= altar.conditionMax;
  }

  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
