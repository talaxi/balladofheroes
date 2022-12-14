import { Component, OnInit } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.css']
})
export class CharacterViewComponent implements OnInit {
  character: Character;
  subscription: any;
  god1AbilityList: Ability[] = [];
  god2AbilityList: Ability[] = [];
  characterAbilityList: Ability[] = [];
  public noGod = GodEnum.None;

  constructor(public menuService: MenuService, public lookupService: LookupService, private globalService: GlobalService,
    private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    var selectedCharacter = this.globalService.globalVar.characters.find(item => item.type === this.menuService.selectedCharacter);    
    if (selectedCharacter !== undefined)
    {
      this.character = selectedCharacter;    
      this.characterAbilityList = this.character.abilityList.sort(function (a, b) {
        return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
      }).filter(item => item.isAvailable);
      this.getCharacterGodAbilities();
    }

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedCharacter !== undefined && this.menuService.selectedCharacter !== this.character.type) {
        var selectedCharacter = this.globalService.globalVar.characters.find(item => item.type === this.menuService.selectedCharacter);        
        if (selectedCharacter !== undefined)
        {
          this.character = selectedCharacter;
          this.characterAbilityList = this.character.abilityList.sort(function (a, b) {
            return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
          }).filter(item => item.isAvailable);
          this.getCharacterGodAbilities();
        }
      }
    });
  }

  getCharacterGodAbilities() {
    this.god1AbilityList = [];
    if (this.character.assignedGod1 !== undefined && this.character.assignedGod1 !== GodEnum.None)
    {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.character.assignedGod1);
      if (god !== undefined)
        this.god1AbilityList = god.abilityList.sort(function (a, b) {
          return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
        }).filter(item => item.isAvailable);
    }

    this.god2AbilityList = [];
    if (this.character.assignedGod2 !== undefined && this.character.assignedGod2 !== GodEnum.None)
    {
      var god = this.globalService.globalVar.gods.find(item => item.type === this.character.assignedGod2);
      if (god !== undefined)
        this.god2AbilityList = god.abilityList.sort(function (a, b) {
          return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
        }).filter(item => item.isAvailable);
    }
  }

  getCharacterGodName(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    
    if (god !== undefined) {
      return god.name;
    }

    return "";
  }

  getCharacterGodLevel(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return god.level;
    }

    return "";
  }

  getCharacterColor() {
    return this.lookupService.getCharacterColorClass(this.character.type);
  }

  getGodAbilityDescription(abilityName: string, character: Character, whichGod: number, ability?: Ability) {
    var godName = this.character.assignedGod1;
    if (whichGod === 2)
      godName = this.character.assignedGod2;

    return this.lookupService.getGodAbilityDescription(abilityName, character, ability);
  }

  getAbilityColor(isGod: boolean, whichGod?: number) {
    if (isGod) {
      var god = this.character.assignedGod1;
      if (whichGod === 2)
        god = this.character.assignedGod2;

      //TODO: make this one call to lookup so you only have to add new gods once
      return this.lookupService.getGodColorClass(god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type)
    }
  }

  areGodsAvailable() {
    return this.globalService.globalVar.gods.some(item => item.isAvailable);
  }

  hasGodEquipped() {
    return this.character.assignedGod1 !== GodEnum.None || this.character.assignedGod2 !== GodEnum.None;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
