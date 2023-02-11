import { Component, OnInit } from '@angular/core';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { AltarService } from 'src/app/services/altar/altar.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-altar',
  templateUrl: './altar.component.html',
  styleUrls: ['./altar.component.css']
})
export class AltarComponent implements OnInit {
  altar: AltarInfo;
  buttonOptions: AltarPrayOptionsEnum[] = [];

  constructor(private globalService: GlobalService, private altarService: AltarService, private lookupService: LookupService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.activeBattle.selectedAltar !== undefined)
    {
      this.altar = this.globalService.globalVar.activeBattle.selectedAltar;
      this.buttonOptions = this.altarService.getButtonOptions(this.altar);
    }
  }

  displayAltarText() {
    var text = "You come across an altar to " + this.lookupService.getGodNameByType(this.altar.god) + " on your journey and take a moment to pray.";
    return text;
  }

  pray() {
    this.altarService.pray(this.altar);

    this.globalService.globalVar.activeBattle.atScene = false;
    this.globalService.globalVar.activeBattle.sceneType = SceneTypeEnum.None;
    this.globalService.globalVar.activeBattle.selectedAltar = undefined;
  }

  getButtonText(option: AltarPrayOptionsEnum) {    
    return this.altarService.getButtonText(option, this.altar);
  }
}
