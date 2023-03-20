import { Component } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent {
  townsAvailable = false;
  quickView: QuickViewEnum = QuickViewEnum.None;
  quickViewEnum = QuickViewEnum;
  quickLinksUnlocked = false;

  constructor(private balladService: BalladService, public globalService: GlobalService) {
    
  }

  ngOnInit(): void {    
    if (this.balladService.findSubzone(SubZoneEnum.AigosthenaLowerCoast)?.isAvailable)
      this.quickLinksUnlocked = true;
  }

  getTotalAmountToCreate() {
    return this.globalService.globalVar.alchemy.alchemyCreateAmount;
  }

  getAmountCreated() {
    return this.globalService.globalVar.alchemy.alchemyCurrentAmountCreated;
  }

  isAlchemyAvailable() {
    return this.globalService.globalVar.alchemy.isUnlocked;
  }

  areAltarsAvailable() {
    return this.globalService.globalVar.altars.isUnlocked;
  }

  openQuickView(type: QuickViewEnum) {
    if (this.quickView === type)
      this.quickView = QuickViewEnum.None;
    else
      this.quickView = type;

    if (type === QuickViewEnum.Altars)
      this.globalService.globalVar.altars.showNewNotification = false;
  }
}
