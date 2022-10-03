import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { GlobalService } from '../global/global.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';

@Injectable({
  providedIn: 'root'
})
export class BalladService {

  constructor(private subZoneGeneratorService: SubZoneGeneratorService, private globalService: GlobalService) { }

  generateBallad(type?: BalladEnum, name?: string) {
    var ballad = new Ballad();

    if (type === BalladEnum.Champion || name === "Champion") {      
      ballad.name = "Champion";

      var forest = new Zone();
      forest.subzones.push(this.subZoneGeneratorService.generateSubZone(SubZoneEnum.Coast));
      forest.subzones.push(this.subZoneGeneratorService.generateSubZone(SubZoneEnum.Valley));
      forest.subzones.push(this.subZoneGeneratorService.generateSubZone(SubZoneEnum.Mountainside));

      ballad.zones.push(forest);
      this.globalService.globalVar.ballads.push(ballad);
    }

    return ballad;
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

  testPlayerNavigation() {
    this.globalService.globalVar.playerNavigation.currentBallad = this.generateBallad(BalladEnum.Champion);    

    if (this.globalService.globalVar.playerNavigation.currentBallad !== undefined) {
      this.globalService.globalVar.playerNavigation.currentBallad.isSelected = true;
      this.globalService.globalVar.playerNavigation.currentBallad.zones[0].isSelected = true;
      this.globalService.globalVar.playerNavigation.currentBallad.zones[0].subzones[0].isSelected = true;
      this.globalService.globalVar.activeBattle = new Battle();
    }
  }
}
