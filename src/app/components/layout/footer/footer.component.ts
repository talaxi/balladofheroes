import { Component, OnInit } from '@angular/core';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { VersionControlService } from 'src/app/services/utility/version-control.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  tooltipDirection = DirectionEnum.Up;

  constructor(private versionControlService: VersionControlService) { }

  ngOnInit(): void {

  }

  getVersion() {
    return this.versionControlService.getCurrentVersion();
  }
}
