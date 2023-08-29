import { Component } from '@angular/core';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-update-altar-auto',
  templateUrl: './update-altar-auto.component.html',
  styleUrls: ['./update-altar-auto.component.css']
})
export class UpdateAltarAutoComponent {
  altarEnum = AltarEnum;
  altar1Setting: AltarEnum;
  altar2Setting: AltarEnum;
  altar3Setting: AltarEnum;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  setAltarSetting(whichAltar: number) {
    if (whichAltar === 1 && this.globalService.globalVar.altars.altar1 !== undefined) {
      this.globalService.globalVar.altars.altar1.type = this.altar1Setting;
    }
  }
}
