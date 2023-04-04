import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-overlay-notification-options',
  templateUrl: './overlay-notification-options.component.html',
  styleUrls: ['./overlay-notification-options.component.css']
})
export class OverlayNotificationOptionsComponent {
  displayOverlayBattleRewards: boolean;
  displayOverlayTutorials: boolean;
  displayOverlayPray: boolean;

  constructor(private globalService: GlobalService) {

  }

  ngOnInit() {    
    var displayOverlayTutorials = this.globalService.globalVar.settings.get("displayOverlayTutorials");    
    if (displayOverlayTutorials === undefined)
      this.displayOverlayTutorials = false;
    else
      this.displayOverlayTutorials = displayOverlayTutorials;
      
    var displayOverlayBattleRewards = this.globalService.globalVar.settings.get("displayOverlayBattleRewards");
    if (displayOverlayBattleRewards === undefined)
      this.displayOverlayBattleRewards = false;
    else
      this.displayOverlayBattleRewards = displayOverlayBattleRewards;
      
    var displayOverlayPray = this.globalService.globalVar.settings.get("displayOverlayPray");
    if (displayOverlayPray === undefined)
      this.displayOverlayPray = false;
    else
      this.displayOverlayPray = displayOverlayPray;
  }

  displayOverlayBattleRewardsToggle() {
    this.globalService.globalVar.settings.set("displayOverlayBattleRewards", this.displayOverlayBattleRewards);
  }
  
  displayOverlayTutorialsToggle() {
    this.globalService.globalVar.settings.set("displayOverlayTutorials", this.displayOverlayTutorials);
  }

  displayOverlayPrayToggle() {
    this.globalService.globalVar.settings.set("displayOverlayPray", this.displayOverlayPray);
  }
}
