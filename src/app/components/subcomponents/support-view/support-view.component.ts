import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-support-view',
  templateUrl: './support-view.component.html',
  styleUrls: ['./support-view.component.css']
})
export class SupportViewComponent {
  isMobile = false;
  isKongregate = false;
  isMainSite = false;

  constructor(private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService, private utilityService: UtilityService) {

  }

  ngOnInit() {  
    this.isMobile = this.deviceDetectorService.isMobile();
    this.isKongregate = this.utilityService.isKongregate();
    this.isMainSite = this.utilityService.isMainSite();
  }

  isSupporterAlreadyPurchased() {
    return this.globalService.globalVar.isSubscriber;
  }
}
