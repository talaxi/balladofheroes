import { Component } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-time-fragment-view',
  templateUrl: './time-fragment-view.component.html',
  styleUrls: ['./time-fragment-view.component.css']
})
export class TimeFragmentViewComponent {
  availableBallads: BalladEnum[] = [];
  availableZones: ZoneEnum[] = [];
  availableSubzones: SubZoneEnum[] = [];
  @Input() selectedBallad: Ballad | undefined;
  @Input() selectedZone: Zone | undefined;
  @Input() selectedSubzone: SubZone | undefined;
  isMobile = false;

  constructor(public balladService: BalladService, private globalService: GlobalService, private lookupService: LookupService,
    private deviceDetectorService: DeviceDetectorService) {

  }

  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  isBalladSelected(type: BalladEnum) {
    if (this.selectedBallad === undefined)
      return false;

    return this.selectedBallad.type === type;
  }

  getBalladClass(ballad: BalladEnum) {
    if (this.selectedBallad === undefined)
      return {};

    return {
      'selectedBallad': ballad === this.selectedBallad.type
    };
  }

  isZoneSelected(type: ZoneEnum) {
    if (this.selectedZone === undefined)
      return false;

    return this.selectedZone?.type === type;
  }

  getZoneClass(zone: ZoneEnum) {
    if (this.selectedZone === undefined)
      return {};

    return {
      'selectedBallad': zone === this.selectedZone.type
    };
  }

  isSubzoneSelected(type: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return false;

    return this.selectedSubzone?.type === type;
  }

  getSubzoneClass(subzone: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return {};

    return {
      'selectedBallad': subzone === this.selectedSubzone.type
    };
  }

  getZoneName(type: ZoneEnum) {
    return this.balladService.findZone(type)?.zoneName;
  }

  getSubzoneName(type: SubZoneEnum) {
    return this.balladService.getSubZoneName(type);
  }

  selectBallad(type: BalladEnum) {
    var ballad = this.balladService.findBallad(type);
    if (ballad !== undefined) {
      this.selectedBallad = ballad;
      this.selectedZone = undefined;
      this.selectedSubzone = undefined;
      this.availableZones = [];
      this.availableSubzones = [];

      this.selectedBallad.zones.filter(item => item.isAvailable).forEach(zone => {
        this.availableZones.push(zone.type);
      });
    }
  }

  selectZone(type: ZoneEnum) {
    var zone = this.balladService.findZone(type);
    if (zone !== undefined) {
      this.selectedZone = zone;
      this.selectedSubzone = undefined;
      this.availableSubzones = [];

      this.selectedZone.subzones.filter(item => item.isAvailable).forEach(subzone => {
        this.availableSubzones.push(subzone.type);
      });
    }
  }

  selectSubzone(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);
    if (subzone !== undefined) {
      this.selectedSubzone = subzone;     
    }
  }
}
