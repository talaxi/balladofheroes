import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.css']
})
export class CustomTooltipComponent implements OnInit {
  /**
    * This is simple text which is to be shown in the tooltip
    */
  @Input() text: string;

  /**
   * This provides finer control on the content to be visible on the tooltip
   * This template will be injected in McToolTipRenderer directive in the consumer template
   * <ng-template #template>
   *  content.....
   * </ng-template>
   */
  @Input() contentTemplate: TemplateRef<any>;
  @ViewChild('tooltipElement') tooltipElement: ElementRef;
  @Input() isSticky: boolean = false;
  @Input() isLargeTooltip: boolean = false;
  @Input() elementRef: ElementRef;
  @Input() isFlippedLeft: boolean = false;
  tooltipTheme: boolean = true;
  regularTooltipPercent = .38; //these need to match the css
  largeTooltipPercent = .58; //these need to match the css
  shiftLeft = false;
  shiftUp = false;
  subscription: any;
  viewingAllItems: boolean = false;

  constructor(private balladService: BalladService, private globalService: GlobalService, public dialog: MatDialog,
    private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.tooltipTheme = this.globalService.globalVar.settings.get("tooltipTheme") ?? true;
  }

  ngAfterViewInit() {
    var divs = document.querySelectorAll('.subzoneClickableItem');
    divs.forEach(el => el.addEventListener('click', event => {
      console.log("Clicked"); //seems to not be attaching the listener when you view all      
      var className = el.getAttribute("class");
      var subzoneEnumValue = className?.split(" ")[1];
      if (subzoneEnumValue !== undefined) {        
        if (subzoneEnumValue === 'viewAll')
        {
          this.globalService.globalVar.settings.set("viewAllResourceLocations", true);                  
        }
        else
        {
          this.jumpToSubzone(Number(subzoneEnumValue) as SubZoneEnum);
          this.dialog.closeAll();
        }
      }
    }));

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => { 
      if (!this.viewingAllItems && this.globalService.globalVar.settings.get("viewAllResourceLocations"))
      {
        this.setClickEvent();
        this.viewingAllItems = true;
      }
    });
    
    if (this.elementRef !== undefined) {
      //console.log("Width: " + screen.width + " < " + this.elementRef.nativeElement.getBoundingClientRect().x  + " + " + this.elementRef.nativeElement.getBoundingClientRect().width + " + " + this.tooltipElement.nativeElement.getBoundingClientRect().width);
      if (!this.isFlippedLeft && (screen.width * .95 < (this.elementRef.nativeElement.getBoundingClientRect().x + this.elementRef.nativeElement.getBoundingClientRect().width + this.tooltipElement.nativeElement.getBoundingClientRect().width)))
        this.shiftLeft = true;

      //var tooltipPercent = this.isLargeTooltip ? this.largeTooltipPercent : this.regularTooltipPercent;
      //console.log("Height: " + screen.height + " < " + this.elementRef.nativeElement.getBoundingClientRect().y  + " + " + this.elementRef.nativeElement.getBoundingClientRect().height + " + " + this.tooltipElement.nativeElement.getBoundingClientRect().height);
      //console.log("Bounding:");
      //console.log(this.tooltipElement.nativeElement.getBoundingClientRect());
      if ((screen.height * .795 < (this.elementRef.nativeElement.getBoundingClientRect().y + this.elementRef.nativeElement.getBoundingClientRect().height + this.tooltipElement.nativeElement.getBoundingClientRect().height)))
        this.shiftUp = true;
    }
  }

  setClickEvent() {
    var divs = document.querySelectorAll('.subzoneClickableItem');
    divs.forEach(el => el.addEventListener('click', event => {           
      var className = el.getAttribute("class");
      var subzoneEnumValue = className?.split(" ")[1];
      if (subzoneEnumValue !== undefined) {                
        this.jumpToSubzone(Number(subzoneEnumValue) as SubZoneEnum);
        this.dialog.closeAll();        
      }
    }));
  }

  jumpToSubzone(type: SubZoneEnum) {
    var startingPoint = this.balladService.findSubzone(type);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
    }

    this.globalService.globalVar.settings.set("autoProgress", false);
  }
  
  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
