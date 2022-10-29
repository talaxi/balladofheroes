import { Component, Input, OnInit, TemplateRef } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
