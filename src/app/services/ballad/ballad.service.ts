import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { GlobalService } from '../global/global.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';

@Injectable({
  providedIn: 'root'
})
export class BalladService {

  constructor(private globalService: GlobalService) { }

  getBalladName(type?: BalladEnum) {
    var name = "";

    if (type === BalladEnum.Champion)
      name = "Ballad of a Champion";
    if (type === BalladEnum.Gorgon)
      name = "Ballad of the Gorgon";
    if (type === BalladEnum.Labors)
      name = "Ballad of the Labors";
    if (type === BalladEnum.Underworld)
      name = "Ballad of the Underworld";

    return name;
  }

  getActiveBallad() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    return activeBallad;
  }

  getActiveZone() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    var zone = activeBallad?.zones.find(item => item.isSelected);
    return zone;
  }

  getActiveSubZone() {
    var subzone = new SubZone();
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    if (activeBallad !== undefined) {
      var zone = activeBallad.zones.find(item => item.isSelected);
      if (zone !== undefined) {
        if (zone.subzones.some(item => item.isSelected))
          subzone = zone.subzones.find(item => item.isSelected)!;
      }
    }
    return subzone;
  }

  findBallad(type: BalladEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.type === type)
        returnBallad = ballad;
    });

    return returnBallad;
  }

  findZone(type: ZoneEnum) {
    var returnZone: Zone | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
          if (zone.type === type)
            returnZone = zone;        
      })
    });

    return returnZone;
  }

  findSubzone(type: SubZoneEnum) {
    var returnSubzone: SubZone | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnSubzone = subzone;
        })
      })
    });

    return returnSubzone;
  }  
}
