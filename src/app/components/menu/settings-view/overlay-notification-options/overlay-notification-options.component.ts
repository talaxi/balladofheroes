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
  }

  displayOverlayBattleRewardsToggle() {
    this.globalService.globalVar.settings.set("displayOverlayBattleRewards", this.displayOverlayBattleRewards);
  }
  
  displayOverlayTutorialsToggle() {
    this.globalService.globalVar.settings.set("displayOverlayTutorials", this.displayOverlayTutorials);
  }
}
