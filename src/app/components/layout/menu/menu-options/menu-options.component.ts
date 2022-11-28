import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
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
  
  constructor(public menuService: MenuService, private globalService: GlobalService) { }

  ngOnInit(): void {    
    this.partyMembers = this.globalService.globalVar.characters;
    this.selectedMenu = this.menuService.selectedMenuDisplay;
    this.gods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
  }

  switchView(type: MenuEnum) {
    this.menuService.selectedMenuDisplay = type;
  }

  selectPartyMember(character: Character) {
    this.menuService.selectedCharacter = character.type;
  }

  selectGod(god: God) {
    this.menuService.selectedGod = god.type;
  }
}
