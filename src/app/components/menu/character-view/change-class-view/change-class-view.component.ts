import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-change-class-view',
  templateUrl: './change-class-view.component.html',
  styleUrls: ['./change-class-view.component.css']
})
export class ChangeClassViewComponent implements OnInit {
  @Input() character: Character;
  currentParty: Character[];
  swappingClass: number | undefined;
  allClasses: Character[];

  classRows: Character[][];
  classCells: Character[];

  constructor(private lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.currentParty = this.globalService.getActivePartyCharacters(false);

    if (this.character.type === this.currentParty[0].type)
      this.swappingClass = 1;
    if (this.character.type === this.currentParty[1].type)
      this.swappingClass = 2;        

    this.allClasses = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.setupDisplayClasses();
  }

  swapClass(whichClass: number) {
    this.swappingClass = whichClass;
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

  currentlyAssignedToSameCharacter(type: CharacterEnum) {
    //return this.character.assignedClass1 === type || this.character.assignedClass2 === type;
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

    //var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = 4;

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
    if (this.globalService.globalVar.activePartyMember1 === type && this.swappingClass === 2)
    {      
      this.globalService.globalVar.activePartyMember2 = this.globalService.globalVar.activePartyMember1;
    }

    if (this.globalService.globalVar.activePartyMember2 === type && this.swappingClass === 1)
    {      
      this.globalService.globalVar.activePartyMember1 = this.globalService.globalVar.activePartyMember2;
    }

    if (this.swappingClass === 1)
      this.globalService.globalVar.activePartyMember1 = type;
    else if (this.swappingClass === 2)
      this.globalService.globalVar.activePartyMember2 = type;

    this.swappingClass = undefined;
    this.currentParty = this.globalService.getActivePartyCharacters(false);
    this.setupDisplayClasses();

    this.currentParty.forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  /*isCurrentlyAssigned(type: CharacterEnum) {
    var isAssigned = false;
    var party = this.globalService.getActivePartyCharacters(true);

    party.forEach(member => {
      if (member.assignedClass1 === type || member.assignedClass2 === type)
        isAssigned = true;
    });

    return isAssigned;
  }*/

  /*GetCurrentlyAssignedCharacter(type: CharacterEnum) {
    var party = this.globalService.getActivePartyCharacters(true);
    var assignedCharacter = new Character();

    party.forEach(member => {
      if (member.assignedClass1 === type || member.assignedClass2 === type)
        assignedCharacter = member;
    });

    return "<span class='" + this.globalService.getCharacterColorClassText(assignedCharacter.type) + "'>" + assignedCharacter.name + "</span>";
  }*/
}
