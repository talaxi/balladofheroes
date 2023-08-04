import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-support-view',
  templateUrl: './support-view.component.html',
  styleUrls: ['./support-view.component.css']
})
export class SupportViewComponent {
  isMobile = false;

  constructor(private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService) {

  }

  ngOnInit() {  
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  isSupporterAlreadyPurchased() {
    return this.globalService.globalVar.isSubscriber;
  }
}
