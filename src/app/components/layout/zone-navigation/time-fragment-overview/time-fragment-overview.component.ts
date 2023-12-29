import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-time-fragment-overview',
  templateUrl: './time-fragment-overview.component.html',
  styleUrls: ['./time-fragment-overview.component.css']
})
export class TimeFragmentOverviewComponent {

  constructor(private deviceDetectorService: DeviceDetectorService, public dialog: MatDialog) {

  }

  openModal(content: any) {
    if (this.deviceDetectorService.isMobile())
    this.dialog.open(content, { width: '95%', height: '80%' });
  else 
    this.dialog.open(content, { width: '80%', minHeight: '80vh', maxHeight: '80%', id: 'dialogNoPadding' });
  }
}
