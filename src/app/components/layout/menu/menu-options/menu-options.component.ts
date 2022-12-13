import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.component.html',
  styleUrls: ['./menu-options.component.css']
})
export class MenuOptionsComponent implements OnInit {
  public menuEnum = MenuEnum;
  public selectedMenu = 0;
  
  public partyMembers: Character[];
  public gods: God[];

  godsAvailable = false;
  
  constructor(public menuService: MenuService, private globalService: GlobalService) { }

  ngOnInit(): void {    
    this.partyMembers = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.selectedMenu = this.menuService.selectedMenuDisplay;
    this.gods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
    this.godsAvailable = this.gods.length > 0;
  }

  switchView(type: MenuEnum) {
    this.menuService.selectedMenuDisplay = type;

    if (type === MenuEnum.Characters && this.menuService.selectedCharacter === CharacterEnum.None)
      this.menuService.setSelectedCharacter(CharacterEnum.Adventurer);
    if (type === MenuEnum.Gods && this.menuService.selectedGod === GodEnum.None)
      this.menuService.setSelectedGod(GodEnum.Athena);
  }

  selectPartyMember(character: Character) {
    this.menuService.setSelectedCharacter(character.type);
  }

  selectGod(god: God) {
    this.menuService.setSelectedGod(god.type);
  }
}
