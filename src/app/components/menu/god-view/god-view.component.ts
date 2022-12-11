import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-god-view',
  templateUrl: './god-view.component.html',
  styleUrls: ['./god-view.component.css']
})
export class GodViewComponent implements OnInit {
  @Input() god: God;
  characters: Character[];
  characterTemplate: CharacterEnum = CharacterEnum.Adventurer;
  subscription: any;

  constructor(private lookupService: LookupService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
    if (selectedGod !== undefined)
    {
      this.god = selectedGod;    

      //for each character, check if this is the assigned god. if so, default template to you
      this.globalService.getActivePartyCharacters(true).forEach(character => {
        if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
          this.characterTemplate = character.type;
      });
    }

    this.characters = this.globalService.globalVar.characters.filter(item => item.isAvailable);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedGod !== undefined && this.menuService.selectedGod !== this.god.type) {
        var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
        if (selectedGod !== undefined)
        {
          this.god = selectedGod;
          
          this.globalService.getActivePartyCharacters(true).forEach(character => {
            if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
              this.characterTemplate = character.type;
          });
        }
      }
    });
  }

  getGodAbilityDescription(abilityName: string, ability?: Ability) {      
    var defaultCharacter = new Character();
    var character = this.globalService.globalVar.characters.find(item => item.type.toString() === this.characterTemplate.toString());
    
    if (character !== undefined)
      defaultCharacter = character;
    return this.lookupService.getGodAbilityDescription(abilityName, defaultCharacter, ability);
  }

  getGodColor() {
    return this.lookupService.getGodColorClass(this.god.type);
  }
}
