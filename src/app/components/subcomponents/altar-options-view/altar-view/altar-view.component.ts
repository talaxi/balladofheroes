import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
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
  tooltipDirection = DirectionEnum.Down;
  isReady = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    this.setupKeybinds(event);    
  }

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    public globalService: GlobalService, private changeDetectorRef: ChangeDetectorRef, private altarService: AltarService,
    private keybindService: KeybindService) { }

  ngOnInit(): void { 
    this.isReady = this.isAltarReady();   
    
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      var isReadyNow = this.isAltarReady();      
      if (isReadyNow && !this.isReady)
      {
        if (this.globalService.globalVar.altarInfo.length < 5)
          this.globalService.globalVar.altarInfo.push(this.altarService.getNewSmallAltar());
      }
      
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
    this.globalService.globalVar.activeBattle.atScene = true;
    this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.Altar;
    this.globalService.globalVar.activeBattle.selectedAltar = this.altar;
  }

  getAltarName() {    
    var typeName = "";
    var godType = GodEnum.None;

    if (this.altar !== undefined && this.altar.type === AltarEnum.Small) {
      typeName = "Small Altar";
      godType = this.altar.god;
    }

    return typeName + " to " + this.lookupService.getGodNameByType(godType);
  }

  getAltarDescription() {
    var description = "";
    var godType = GodEnum.None;

    if (this.altar !== undefined && this.altar.type === AltarEnum.Small) {
      godType = this.altar.god;

      description = "When the condition is met, click to pray at a small altar to " + this.lookupService.getGodNameByType(godType) + " for a blessing.";
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

  getAltarEffects() {
    var effects = "";

    this.globalService.globalVar.activeAltarEffects.forEach(effect => {
      effects += this.lookupService.getAltarEffectDescription(effect);      
    });
    
    effects = effects.replace(new RegExp("<hr/>" + '$'), '');

    return this.utilityService.getSanitizedHtml(effects);
  }

  isAltarReady() {
    if (this.altar === undefined)
      return false;

    return this.altar.conditionCount >= this.altar.conditionMax;
  }
  
  setupKeybinds(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openFirstAvailableAltar"))) {
      var availableAltars = this.globalService.globalVar.altarInfo.filter(item => item.conditionCount >= item.conditionMax);

      if (availableAltars.length > 0 && availableAltars[0] === this.altar)
      {
        this.viewAltar();
      }
    }
  }

  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
