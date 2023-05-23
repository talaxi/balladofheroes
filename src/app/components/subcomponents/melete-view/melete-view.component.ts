import { Component } from '@angular/core';
import { MeleteActionEnum } from 'src/app/models/enums/melete-action-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MeleteService } from 'src/app/services/minigames/melete.service';

@Component({
  selector: 'app-melete-view',
  templateUrl: './melete-view.component.html',
  styleUrls: ['./melete-view.component.css']
})
export class MeleteViewComponent {
  meleteAction = MeleteActionEnum;

  constructor(private meleteService: MeleteService, private globalService: GlobalService) {

  }

  isConfidenceUnlocked() {
    return this.globalService.globalVar.melete.resources.confidenceUnlocked;
  }

  isFaithUnlocked() {
    return this.globalService.globalVar.melete.resources.faithUnlocked;
  }

  getTranquility() {
    return this.globalService.globalVar.melete.resources.tranquility;
  }

  getConfidence() {
    return this.globalService.globalVar.melete.resources.confidence;
  }

  getFaith() {
    return this.globalService.globalVar.melete.resources.faith;
  }

  hiddenStyle(boolValue: boolean) {
    return {
      'opacity': boolValue ? '1' : '0',
      'visibility' : boolValue ? "visible" : "hidden"
    };
  }
}
