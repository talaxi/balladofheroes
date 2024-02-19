import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { TutorialService } from 'src/app/services/global/tutorial.service';
import { SupportViewComponent } from 'src/app/components/subcomponents/support-view/support-view.component';
import { MenuService } from 'src/app/services/menu/menu.service';
import { LayoutService } from 'src/app/models/global/layout.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-tutorial-box',
  templateUrl: './tutorial-box.component.html',
  styleUrls: ['./tutorial-box.component.css']
})
export class TutorialBoxComponent {
  confirmationText: string = "";
  wasGamePaused = false;

  constructor(private globalService: GlobalService, private tutorialService: TutorialService, public dialogRef: MatDialogRef<TutorialBoxComponent>, 
    public dialog: MatDialog, private layoutService: LayoutService, private menuService: MenuService, private deviceDetectorService: DeviceDetectorService) {

  }

  ngOnInit() {    
    this.wasGamePaused = this.globalService.globalVar.isGamePaused;
    if (!this.wasGamePaused)
    this.globalService.globalVar.isGamePaused = true;

    var tutorialData = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Tutorials).sort(function (a, b) {
      return a.dateReceived > b.dateReceived ? -1 : a.dateReceived < b.dateReceived ? 1 : 0;
    })[0];

    this.confirmationText = this.tutorialService.getTutorialText(tutorialData.relevantEnumValue, undefined, undefined, false);
  }

  ngAfterViewInit() {
    var divs = document.querySelectorAll('.supportClickableItem');
    divs.forEach(el => el.addEventListener('click', event => {
      var className = el.getAttribute("class");
      var value = className?.split(" ")[1];
      if (value !== undefined) {
          this.handleSupportModal();               
      }
    }));
  }

  continue(): void {
    if (!this.wasGamePaused)
      this.globalService.globalVar.isGamePaused = false;
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  skipTutorial(): void {
    if (!this.wasGamePaused)
      this.globalService.globalVar.isGamePaused = false;
    // Close the dialog, return false
    this.globalService.globalVar.settings.set("showTutorialsAsModals", false);
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    if (!this.wasGamePaused) {
      this.globalService.globalVar.isGamePaused = false;
    }
  }

  
  handleSupportModal() {    
    if (this.deviceDetectorService.isMobile())
      return this.dialog.open(SupportViewComponent, { width: '80%', height: 'auto' });
    else
      return this.dialog.open(SupportViewComponent, { width: '80%', height: 'auto' });
  }
}
