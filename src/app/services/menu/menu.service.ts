import { Injectable } from '@angular/core';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  selectedMenuDisplay: MenuEnum;
  selectedCharacter: CharacterEnum;
  selectedGod: GodEnum;

  constructor() { 
    this.selectedMenuDisplay = MenuEnum.Characters;
    this.selectedCharacter = CharacterEnum.Adventurer;
    this.selectedGod = GodEnum.Athena;
  }
}
