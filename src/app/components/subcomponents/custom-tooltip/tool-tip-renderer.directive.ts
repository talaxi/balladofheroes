import { Directive, Input, TemplateRef, ElementRef, OnInit, HostListener, ComponentRef, OnDestroy } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CustomTooltipComponent } from './custom-tooltip.component';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';

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

  delayTimer: number = 0;
  subscription: any;
  delayTimerCap = .35;
  @Input() isDelayed: boolean = true;

  constructor(private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private gameLoopService: GameLoopService) { }

  /**
   * Init life cycle event handler
   */
  ngOnInit() {

    if (!this.showToolTip) {
      return;
    }

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([{
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetY: 5,
      }]);

    this._overlayRef = this._overlay.create({ positionStrategy });

  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  show() {
    if (this.isDelayed) {
      this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
        this.delayTimer += deltaTime;

        //attach the component if it has not already attached to the overlay
        if (this._overlayRef && !this._overlayRef.hasAttached() && this.delayTimer > this.delayTimerCap) {
          const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(new ComponentPortal(CustomTooltipComponent));
          tooltipRef.instance.text = this.text;
          tooltipRef.instance.contentTemplate = this.contentTemplate;
        }
      });
    }
    else {
      if (this._overlayRef && !this._overlayRef.hasAttached()) {
        const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(new ComponentPortal(CustomTooltipComponent));
        tooltipRef.instance.text = this.text;
        tooltipRef.instance.contentTemplate = this.contentTemplate;
      }
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  hide() {
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

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  closeToolTip() {
    this.delayTimer = 0;
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

}