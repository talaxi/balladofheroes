import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { TutorialService } from 'src/app/services/global/tutorial.service';

@Component({
  selector: 'app-tutorial-box',
  templateUrl: './tutorial-box.component.html',
  styleUrls: ['./tutorial-box.component.css']
})
export class TutorialBoxComponent {
  confirmationText: string = "";
  wasGamePaused = false;

  constructor(private globalService: GlobalService, private tutorialService: TutorialService, public dialogRef: MatDialogRef<TutorialBoxComponent>, 
    public dialog: MatDialog) {

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
}
