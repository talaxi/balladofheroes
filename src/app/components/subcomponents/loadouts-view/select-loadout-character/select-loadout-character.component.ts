import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-select-loadout-character',
  templateUrl: './select-loadout-character.component.html',
  styleUrls: ['./select-loadout-character.component.css']
})
export class SelectLoadoutCharacterComponent {
  @Input() character: Character;
  currentParty: Character[];
  swappingClass: number | undefined;
  allClasses: Character[];

  classRows: Character[][];
  classCells: Character[];

  swapEquipment: boolean;
  swapGods: Boolean;
  @Output() selectedCharacterEmitter = new EventEmitter<CharacterEnum>();
  @Input() dialogRef: MatDialogRef<any, any>;

  constructor(private lookupService: LookupService, private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    this.allClasses = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.setupDisplayClasses();
  }

  getClassName(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.globalService.globalVar.characters.find(item => item.type === type)?.name;
  }

  getClassLevel(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return "Lv " + this.globalService.globalVar.characters.find(item => item.type === type)?.level;
  }

  getClassColor(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.lookupService.getCharacterColorClass(type);
  }

  getClassDescription(whichClass?: number, type?: CharacterEnum) {
    if (type === undefined) {
      type = this.currentParty[0].type;
      if (whichClass === 2)
        type = this.currentParty[1].type;
    }

    return this.lookupService.getCharacterDescription(type);
  }

  setupDisplayClasses(): void {
    this.classCells = [];
    this.classRows = [];

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= this.allClasses.length; i++) {
      this.classCells.push(this.allClasses[i - 1]);
      if ((i % maxColumns) == 0) {
        this.classRows.push(this.classCells);
        this.classCells = [];
      }
    }

    if (this.classCells.length !== 0)
      this.classRows.push(this.classCells);
  }

  selectNewClass(type: CharacterEnum) {
    this.selectedCharacterEmitter.emit(type);
    this.dialogRef.close();
  }
}
