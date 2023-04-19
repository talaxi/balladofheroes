import { Component, Input, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
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

  @Input() isSticky: boolean = false;
  @Input() isLargeTooltip: boolean = false;
  tooltipTheme: boolean = true;

  constructor(private balladService: BalladService, private globalService: GlobalService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.tooltipTheme = this.globalService.globalVar.settings.get("tooltipTheme") ?? true;    
  }

  ngAfterViewInit() {
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
}
