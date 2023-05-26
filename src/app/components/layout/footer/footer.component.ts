import { Component, OnInit } from '@angular/core';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { VersionControlService } from 'src/app/services/utility/version-control.service';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  tooltipDirection = DirectionEnum.Up;
  latestVersionChanges: string;
  changeLog: string[];
  allVersions: number[];

  constructor(private versionControlService: VersionControlService, public dialog: MatDialog, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.latestVersionChanges = this.versionControlService.getLatestChanges();
    this.changeLog = this.versionControlService.getAllChanges();
    this.allVersions = this.versionControlService.gameVersions;
  }

  getVersion() {
    return this.versionControlService.getCurrentVersion();
  }

  viewSupportModal(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%', id: 'dialogNoPadding' });
    else
      this.dialog.open(content, { width: '75%', height: '80%' });
  }

}
