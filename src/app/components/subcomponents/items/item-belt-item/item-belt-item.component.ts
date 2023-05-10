import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-item-belt-item',
  templateUrl: './item-belt-item.component.html',
  styleUrls: ['./item-belt-item.component.css']
})
export class ItemBeltItemComponent implements OnInit {
  @Input() slotNumber: number;
  item: ItemsEnum;
  @ViewChild('spinnerDiv', { static: false }) spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;
  spinnerDivSubscription: any;
  overlayRef: OverlayRef;

  constructor(public lookupService: LookupService, public battleService: BattleService, private globalService: GlobalService,
    private gameLoopService: GameLoopService, private changeDetector: ChangeDetectorRef, private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.itemBelt.length < this.slotNumber)
      return;

    this.item = this.globalService.globalVar.itemBelt[this.slotNumber];

    /*this.spinnerDivSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.isItemOnCooldown(this.slotNumber)) {
        console.log("Checking for diameter");
        this.changeDetector.detectChanges();
        if (this.spinnerDiv !== undefined) {
          console.log("Spinner found");
          if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {
            console.log("setting diameter to " + this.spinnerDiv.nativeElement.offsetHeight);
            this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
          }

          if (this.spinnerDiv.nativeElement.offsetHeight <= this.spinnerDiameter) {
            if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {
              this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
            }
          }

          if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {
            console.log("Unsub");
            this.spinnerDivSubscription.unsubscribe();
          }
        }
      }
      else {
        this.spinnerDivSubscription.unsubscribe();
      }
    });*/
  }

  checkForCooldown(slotNumber: number) {    
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

    this.spinnerDivSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      if (this.isItemOnCooldown(this.slotNumber)) {        
        this.changeDetector.detectChanges();

        if (this.spinnerDiv !== undefined) {          
          if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {            
            this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
          }

          if (this.spinnerDiv.nativeElement.offsetHeight <= this.spinnerDiameter) {
            if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {
              this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
            }
          }

          if (this.spinnerDiv.nativeElement.offsetHeight > this.spinnerDiameter) {
            this.spinnerDivSubscription.unsubscribe();
          }
        }
      }
    });
  }

  battleItemInUse(slotNumber: number) {
    if (this.globalService.globalVar.itemBelt.length < slotNumber)
      return;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    if (item === this.battleService.battleItemInUse && this.battleService.targetbattleItemMode)
      return true;
    else
      return false;
  }

  getItemAmount(slotNumber: number) {
    var amount = 0;

    if (this.globalService.globalVar.itemBelt.length < slotNumber)
      return amount;

    var item = this.globalService.globalVar.itemBelt[slotNumber];
    amount = this.lookupService.getResourceAmount(item);

    return amount;
  }

  getSelectedItemImage(slotNumber: number) {
    var src = "assets/svg/";
    if (this.globalService.globalVar.itemBelt.length < slotNumber) {
      src += "emptyItemSlot.svg";
      return;
    }

    var item = this.globalService.globalVar.itemBelt[slotNumber];

    src = this.lookupService.getItemImage(item);

    return src;
  }

  unselectItemSlot(slotNumber: number) {
    this.globalService.globalVar.itemBelt[slotNumber] = ItemsEnum.None;
    this.battleService.targetbattleItemMode = false;
  }

  getItemName() {
    return this.dictionaryService.getItemName(this.item);
  }

  getItemDescription() {
    return this.lookupService.getItemDescription(this.item);
  }

  preventRightClick() {
    return false;
  }

  isItemOnCooldown(slotNumber: number) {
    var item = this.globalService.globalVar.itemBelt[slotNumber];
    //console.log("On CD? " + this.battleService.isBattleItemOnCooldown(item) + " Width: " + this.strokeWidth + " Diameter: " + this.spinnerDiameter);
    return this.battleService.isBattleItemOnCooldown(item);
  }

  getItemCooldownPercent(slotNumber: number) {
    var item = this.globalService.globalVar.itemBelt[slotNumber];
    var itemCooldownTimer = this.globalService.globalVar.timers.itemCooldowns.find(itemCooldown => itemCooldown[0] === item);
    if (itemCooldownTimer !== undefined) {
      var timeLeft = itemCooldownTimer[1];
      var originalCooldown = this.lookupService.getBattleItemEffect(item).cooldown;
      
      return 100 - ((timeLeft / originalCooldown) * 100);
    }

    return 0;
  }

  overlayEmitter(overlayRef: OverlayRef) {    
    if (this.overlayRef !== undefined) {      
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }
  
  ngOnDestroy() {
    if (this.spinnerDivSubscription !== undefined)
      this.spinnerDivSubscription.unsubscribe();

      if (this.overlayRef !== undefined) {    
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
  }
}
