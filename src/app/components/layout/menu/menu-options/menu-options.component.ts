import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';

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
  @Input() isMobile = false;

  godsAvailable = false;
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuTraverseSubMenuUp"))) {
      this.toggleSubMenuOptions(-1);
    }
      
    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuTraverseSubMenuDown"))) {
      this.toggleSubMenuOptions(1);
    }
    
    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuGoToCharacters"))) {
      this.switchView(MenuEnum.Characters);
    }

      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuGoToGods"))) {
      this.switchView(MenuEnum.Gods);
    }
    
      if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuGoToResources"))) {
      this.switchView(MenuEnum.Resources);
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuGoToSettings"))) {
      this.switchView(MenuEnum.Settings);
    }

    if (this.keybindService.doesKeyMatchKeybind(event,keybinds.get("menuGoToAchievements"))) {
      this.switchView(MenuEnum.Achievements);
    }
  }

  constructor(public menuService: MenuService, private globalService: GlobalService, private keybindService: KeybindService,
    private layoutService: LayoutService) { }

  ngOnInit(): void {    
    this.partyMembers = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.selectedMenu = this.menuService.selectedMenuDisplay;
    this.gods = this.globalService.globalVar.gods.sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > a.displayOrder ? 1 : 0;
    }).filter(item => item.isAvailable);
    this.godsAvailable = this.gods.length > 0;
  }

  switchView(type: MenuEnum) {
    if (this.isMobile) {
      this.layoutService.changeLayout(NavigationEnum.Menu);
      this.layoutService.mobileMenuOpen = false;      
    }

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

  toggleSubMenuOptions(direction: number) {
    if (this.menuService.selectedMenuDisplay === MenuEnum.Characters)
    {
      var currentIndex = this.partyMembers.findIndex(item => item.type === this.menuService.selectedCharacter);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.partyMembers.length - 1;
      if (currentIndex > this.partyMembers.length - 1)
        currentIndex = 0;
      
        this.menuService.setSelectedCharacter(this.partyMembers[currentIndex].type);
    }
    if (this.menuService.selectedMenuDisplay === MenuEnum.Gods)
    {
      var currentIndex = this.gods.findIndex(item => item.type === this.menuService.selectedGod);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.gods.length - 1;
      if (currentIndex > this.gods.length - 1)
        currentIndex = 0;
      
        this.menuService.setSelectedGod(this.gods[currentIndex].type);
    }
  }  
}
