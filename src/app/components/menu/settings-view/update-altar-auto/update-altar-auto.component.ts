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
  altar1Available: boolean = false;
  altar2Available: boolean = false;
  altar3Available: boolean = false;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.altars.altar1 !== undefined) {
      this.altar1Available = true;
      this.altar1Setting = this.globalService.globalVar.altars.altar1.type;
    }

    if (this.globalService.globalVar.altars.altar2 !== undefined) {
      this.altar2Available = true;
    this.altar2Setting = this.globalService.globalVar.altars.altar2.type;
    }
    
    if (this.globalService.globalVar.altars.altar3 !== undefined) {
      this.altar3Available = true;
    this.altar3Setting = this.globalService.globalVar.altars.altar3.type;
    }
  }

  setAltarSetting(whichAltar: number) {
    if (whichAltar === 1 && this.globalService.globalVar.altars.altar1 !== undefined) {
      this.globalService.globalVar.altars.altar1.type = this.altar1Setting;
    }

    if (whichAltar === 2 && this.globalService.globalVar.altars.altar2 !== undefined) {
      this.globalService.globalVar.altars.altar2.type = this.altar2Setting;
    }

    if (whichAltar === 3 && this.globalService.globalVar.altars.altar3 !== undefined) {
      this.globalService.globalVar.altars.altar3.type = this.altar3Setting;
    }
  }
}
