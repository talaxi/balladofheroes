import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-change-god-view',
  templateUrl: './change-god-view.component.html',
  styleUrls: ['./change-god-view.component.css']
})
export class ChangeGodViewComponent implements OnInit {
  @Input() character: Character;
  swappingGod: number | undefined;
  allGods: God[];

  godRows: God[][];
  godCells: God[];

  constructor(private lookupService: LookupService, private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService,
    private battleService: BattleService) { }

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

  currentlyAssignedToSameCharacter(type: GodEnum) {    
    return this.character.assignedGod1 === type || this.character.assignedGod2 === type;
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

    //var filteredItems = this.filterItems(this.shopItems);

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
    var party = this.globalService.getActivePartyCharacters(true);
    var swappedGod = GodEnum.None;

    if (this.swappingGod === 1)
      swappedGod = this.character.assignedGod1;
    else if (this.swappingGod === 2)
      swappedGod = this.character.assignedGod2;

    var swappingUndefinedGod = false;
    if ((this.swappingGod === 1 && this.character.assignedGod1 === GodEnum.None) ||
    (this.swappingGod === 2 && this.character.assignedGod2 === GodEnum.None))
      swappingUndefinedGod = true;

    if (this.isCurrentlyAssigned(type))
    {
      this.globalService.globalVar.characters.filter(character => character.isAvailable).forEach(member => {
        if (member.assignedGod1 === type)
        {
          if (swappingUndefinedGod) {
            member.assignedGod1 = GodEnum.None;            
          }
          else
            member.assignedGod1 = swappedGod;
        }
        else if (member.assignedGod2 === type)
        {
          if (swappingUndefinedGod)
            member.assignedGod2 = GodEnum.None;
          else
            member.assignedGod2 = swappedGod;
        }
      })
    }

    if (this.swappingGod === 1)
      this.character.assignedGod1 = type;
    else if (this.swappingGod === 2)
      this.character.assignedGod2 = type;

    this.swappingGod = undefined;

    //if member has a god in slot 2 but not 1, reverse them
    party.forEach(member => {
      if (member.assignedGod1 === GodEnum.None && member.assignedGod2 !== GodEnum.None)
      {
        member.assignedGod1 = member.assignedGod2;
        member.assignedGod2 = GodEnum.None;
      }

      this.setGodStatuses(member);
      this.globalService.calculateCharacterBattleStats(member);
    });
  }

  isCurrentlyAssigned(type: GodEnum) {
    var isAssigned = false;
    var party = this.globalService.globalVar.characters.filter(character => character.isAvailable);

    party.forEach(member => {
      if (member.assignedGod1 === type || member.assignedGod2 === type)
        isAssigned = true;
    });

    return isAssigned;
  }

  GetCurrentlyAssignedCharacter(type: GodEnum) {
    var party = this.globalService.globalVar.characters.filter(character => character.isAvailable);
    var assignedCharacter = new Character();

    party.forEach(member => {
      if (member.assignedGod1 === type || member.assignedGod2 === type)
        assignedCharacter = member;
    });

    return "<span class='" + this.globalService.getCharacterColorClassText(assignedCharacter.type) + "'>" + assignedCharacter.name + "</span>";
  }

  setGodStatuses(character: Character) {
    if ((character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis) && 
    !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", character);
      if (dispenserOfDues !== undefined) {
        this.battleService.applyStatusEffect(dispenserOfDues.userEffect[0], character);
      }
    }
    else if ((character.assignedGod1 !== GodEnum.Nemesis && character.assignedGod2 !== GodEnum.Nemesis) && 
    character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DispenserOfDues);
    }

    if ((character.assignedGod1 !== GodEnum.Ares && character.assignedGod2 !== GodEnum.Ares) && 
    character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Onslaught)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Onslaught);
    }

    if (character.assignedGod1 !== GodEnum.Apollo && character.assignedGod2 !== GodEnum.Apollo) {      
      if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Staccato))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Staccato);

        if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Fortissimo))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Fortissimo);

        if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Coda))
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Coda);
    }
  }
}
