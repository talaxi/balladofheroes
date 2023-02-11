import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { KeybindService } from 'src/app/services/utility/keybind.service';
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
  altarType = AltarEnum;
  availableAltars: AltarInfo[];
  buffTooltipDirection = DirectionEnum.Left;
  
  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService,
    public globalService: GlobalService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {    
    /*this.availableAltars = this.globalService.globalVar.altarInfo;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.availableAltars = this.globalService.globalVar.altarInfo;
    });*/
  }
 
  getAltarEffects() {
    var effects = "";

    /*this.globalService.globalVar.activeAltarEffects.forEach(effect => {
      effects += this.lookupService.getAltarEffectDescription(effect);      
    });*/
    
    effects = effects.replace(new RegExp("<hr/>" + '$'), '');

    return this.utilityService.getSanitizedHtml(effects);
  }


  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
