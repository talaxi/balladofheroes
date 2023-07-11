import { Directive, Input, TemplateRef, ElementRef, OnInit, HostListener, ComponentRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CustomTooltipComponent } from './custom-tooltip.component';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';

@Directive({
  selector: '[customToolTip]'
})
export class ToolTipRendererDirective {

  /**
  * This will be used to show tooltip or not
  * This can be used to show the tooltip conditionally
  */
  @Input() showToolTip: boolean = true;

  //If this is specified then specified text will be showin in the tooltip
  @Input(`customToolTip`) text: string;

  //If this is specified then specified template will be rendered in the tooltip
  @Input() contentTemplate: TemplateRef<any>;

  private _overlayRef: OverlayRef;
  @Output() overlayRefEmitter = new EventEmitter<OverlayRef>(); 

  delayTimer: number = 0;
  subscription: any;
  delayTimerCap = .35;
  @Input() isDelayed: boolean = true;
  @Input() isLargeTooltip: boolean = false;
  @Input() tooltipDirection: DirectionEnum = DirectionEnum.Right;
  regularTooltipPercent = .38; //these need to match the css
  largeTooltipPercent = .58; //these need to match the css

  constructor(private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private globalService: GlobalService,
    private gameLoopService: GameLoopService,
    private deviceDetectorService: DeviceDetectorService) { }

  /**
   * Init life cycle event handler
   */
  ngOnInit() {
    if (!this.showToolTip) {
      return;
    }

    var positionStrategy: FlexibleConnectedPositionStrategy;

    if (this.tooltipDirection === DirectionEnum.Right) {      
      var tooltipPercent = this.isLargeTooltip ? this.largeTooltipPercent : this.regularTooltipPercent;
      
      if ((screen.width * (1-tooltipPercent) < (this._elementRef.nativeElement.getBoundingClientRect().x + this._elementRef.nativeElement.getBoundingClientRect().width)))
        this.tooltipDirection = DirectionEnum.DownRight;
    }

    if (this.tooltipDirection === DirectionEnum.Down) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 5,
        }]);
    }    
    else if (this.tooltipDirection === DirectionEnum.Up) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -5,
        }]);
    }
    else if (this.tooltipDirection === DirectionEnum.Left) {
      positionStrategy = this._overlayPositionBuilder
        .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -5,
        }]);
    }
    else if (this.tooltipDirection === DirectionEnum.UpLeft) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -5,
          offsetX: -5
        }]);
    }
    else if (this.tooltipDirection === DirectionEnum.DownRight) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 5,
          offsetX: 5
        }]);
    }
    else if (this.tooltipDirection === DirectionEnum.DownLeft) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 5,
          offsetX: -5
        }]);
    } 
    else if (this.tooltipDirection === DirectionEnum.UpRight) {
      positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -5,
          offsetX: 5
        }]);
    }
    else { //Right
      positionStrategy = this._overlayPositionBuilder
        .flexibleConnectedTo(this._elementRef)
        .withPositions([{
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 5,
        }]);
    }
    
    this._overlayRef = this._overlay.create({ positionStrategy });        
    this.overlayRefEmitter.emit(this._overlayRef);  
  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  show() { 
    if (!this.deviceDetectorService.isMobile())   
      this.openToolTip();
  }

  @HostListener('touchstart')
  mobileShow(event: any) { 
    if (this.deviceDetectorService.isMobile()) {        
      event?.preventDefault();
      this.openToolTip();      
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  hide() {    
    if (!this.deviceDetectorService.isMobile())   
      this.closeToolTip();
  }

  @HostListener('touchend')
  mobileHide() {    
    if (this.deviceDetectorService.isMobile())   
      this.closeToolTip();
  }

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy() {
    this.closeToolTip();
  }

  openToolTip() {
    if (this.isDelayed) {
      this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
        this.delayTimer += deltaTime;

        //attach the component if it has not already attached to the overlay
        if (this._overlayRef && !this._overlayRef.hasAttached() && this.delayTimer > this.delayTimerCap) {
          const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(new ComponentPortal(CustomTooltipComponent));
          tooltipRef.instance.text = this.text;
          tooltipRef.instance.contentTemplate = this.contentTemplate;
          tooltipRef.instance.isLargeTooltip = this.isLargeTooltip;
          tooltipRef.instance.tooltipDirection = this.tooltipDirection;
        }
      });
    }
    else {
      if (this._overlayRef && !this._overlayRef.hasAttached()) {
        const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(new ComponentPortal(CustomTooltipComponent));
        tooltipRef.instance.text = this.text;
        tooltipRef.instance.contentTemplate = this.contentTemplate;  
        tooltipRef.instance.isLargeTooltip = this.isLargeTooltip; 
        tooltipRef.instance.tooltipDirection = this.tooltipDirection;     
      }
    }
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  closeToolTip() {
    this.delayTimer = 0;
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    if (this._overlayRef) {
      this._overlayRef.detach();
      //this._overlayRef.dispose();
    }
  }
}