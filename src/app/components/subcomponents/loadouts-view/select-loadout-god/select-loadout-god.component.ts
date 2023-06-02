import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-select-loadout-god',
  templateUrl: './select-loadout-god.component.html',
  styleUrls: ['./select-loadout-god.component.css']
})
export class SelectLoadoutGodComponent {
  @Input() character: Character;
  swappingGod: number | undefined;
  allGods: God[];

  godRows: God[][];
  godCells: God[];
  @Output() selectedGodEmitter = new EventEmitter<GodEnum>();
  @Input() dialogRef: MatDialogRef<any, any>;

  constructor(private lookupService: LookupService, private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.allGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
    this.setupDisplayGods();
  }

  swapGod(whichGod: number) {
    this.swappingGod = whichGod;
  }
 
  getGodName(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    if (type === GodEnum.None)
      return "No God Assigned";

    return this.lookupService.getGodNameByType(type);
  }

  getGodLevel(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    if (type === GodEnum.None)
      return "";

    return "Lv " + this.globalService.globalVar.gods.find(item => item.type === type)?.level;
  }

  getGodColor(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return this.lookupService.getGodColorClass(type);
  }

  getGodDescription(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return this.lookupService.getGodDescription(type);
  }

  godEquipped(whichGod?: number) {
    var type = GodEnum.None;
    
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return type !== GodEnum.None;
  }

  setupDisplayGods(): void {
    this.godCells = [];
    this.godRows = [];

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= this.allGods.length; i++) {
      this.godCells.push(this.allGods[i - 1]);
      if ((i % maxColumns) == 0) {
        this.godRows.push(this.godCells);
        this.godCells = [];
      }
    }

    if (this.godCells.length !== 0)
      this.godRows.push(this.godCells);
  }

  selectNewGod(type: GodEnum) {   
    this.selectedGodEmitter.emit(type);
    this.dialogRef.close();
  }  
}
