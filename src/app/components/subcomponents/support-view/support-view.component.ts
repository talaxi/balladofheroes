import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-support-view',
  templateUrl: './support-view.component.html',
  styleUrls: ['./support-view.component.css']
})
export class SupportViewComponent {

  constructor(private globalService: GlobalService) {

  }

  isSupporterAlreadyPurchased() {
    return this.globalService.globalVar.isSubscriber;
  }
}
