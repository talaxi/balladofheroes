import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { OverdriveInfo } from 'src/app/models/character/overdrive-info.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-overdrive-view',
  templateUrl: './overdrive-view.component.html',
  styleUrls: ['./overdrive-view.component.css']
})
export class OverdriveViewComponent implements OnInit {
  @Input() character: Character;
  selectedOverdriveInfo: OverdriveInfo;

  constructor(public lookupService: LookupService) { }

  ngOnInit(): void {
  }

  getOverdrives() {
    var overdrives: OverdriveNameEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(OverdriveNameEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as OverdriveNameEnum;
      if (enumValue !== OverdriveNameEnum.None)
        overdrives.push(enumValue);
    }

    return overdrives;
  }

  chooseOverdrive(type: OverdriveNameEnum)
  {
    this.selectedOverdriveInfo = this.lookupService.getOverdriveInfo(type);
  }

  getOverdriveName(type?: OverdriveNameEnum)
  {
    if (type !== undefined)
      return this.lookupService.getOverdriveName(type, this.character);
    else
      return this.lookupService.getOverdriveName(this.selectedOverdriveInfo.selectedOverdrive, this.character);
  }

  getOverdriveDescription() {
    if (this.lookupService.isOverdriveDiscovered(this.selectedOverdriveInfo.selectedOverdrive, this.character))
      return this.lookupService.getOverdriveDescription(this.selectedOverdriveInfo.selectedOverdrive);

    return "Unlock: " + this.lookupService.getOverdriveUnlockCondition(this.selectedOverdriveInfo.selectedOverdrive);
  }

  isSelectedCurrentOverdrive() {
    return this.selectedOverdriveInfo.selectedOverdrive === this.character.overdriveInfo.selectedOverdrive;
  }

  setNewOverdrive() {
    this.lookupService.setOverdrive(this.character, this.selectedOverdriveInfo.selectedOverdrive);
  }
}
