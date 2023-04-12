import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
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
  public professions: ProfessionEnum[] = [];
  public professionsAvailable: boolean = false;
  @Input() isMobile = false;

  godsAvailable = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuUp"))) {
      this.toggleSubMenuOptions(-1);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuTraverseSubMenuDown"))) {
      this.toggleSubMenuOptions(1);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToCharacters"))) {
      this.switchView(MenuEnum.Characters);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToGods"))) {
      this.switchView(MenuEnum.Gods);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToResources"))) {
      this.switchView(MenuEnum.Resources);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToSettings"))) {
      this.switchView(MenuEnum.Settings);
    }

    if (this.professionsAvailable && this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToProfessions"))) {
      this.switchView(MenuEnum.Professions);
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("menuGoToAchievements"))) {
      this.switchView(MenuEnum.Achievements);
    }
  }

  constructor(public menuService: MenuService, private globalService: GlobalService, private keybindService: KeybindService,
    private layoutService: LayoutService, private lookupService: LookupService) { }

  ngOnInit(): void {
    this.partyMembers = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.selectedMenu = this.menuService.selectedMenuDisplay;
    this.gods = this.globalService.globalVar.gods.sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > a.displayOrder ? 1 : 0;
    }).filter(item => item.isAvailable);
    this.godsAvailable = this.gods.length > 0;
    this.getProfessions();
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
    if (type === MenuEnum.Professions && this.menuService.selectedProfession === ProfessionEnum.None) {
      this.menuService.setSelectedProfession(this.professions[0]);
    }
  }

  selectPartyMember(character: Character) {
    this.menuService.setSelectedCharacter(character.type);
  }

  selectGod(god: God) {
    this.menuService.setSelectedGod(god.type);
  }

  selectProfession(profession: ProfessionEnum) {
    this.menuService.setSelectedProfession(profession);
  }

  getProfessions() {
    this.globalService.globalVar.professions.forEach(profession => {
      if (profession.isUnlocked)
        this.professions.push(profession.type);
    });

    this.professionsAvailable = this.professions.length > 0;
  }

  getProfessionName(profession: ProfessionEnum) {
    return this.lookupService.getProfessionName(profession);
  }

  toggleSubMenuOptions(direction: number) {
    if (this.menuService.selectedMenuDisplay === MenuEnum.Characters) {
      var currentIndex = this.partyMembers.findIndex(item => item.type === this.menuService.selectedCharacter);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.partyMembers.length - 1;
      if (currentIndex > this.partyMembers.length - 1)
        currentIndex = 0;

      this.menuService.setSelectedCharacter(this.partyMembers[currentIndex].type);
    }
    if (this.menuService.selectedMenuDisplay === MenuEnum.Gods) {
      var currentIndex = this.gods.findIndex(item => item.type === this.menuService.selectedGod);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.gods.length - 1;
      if (currentIndex > this.gods.length - 1)
        currentIndex = 0;

      this.menuService.setSelectedGod(this.gods[currentIndex].type);
    }
    if (this.menuService.selectedMenuDisplay === MenuEnum.Professions) {
      var currentIndex = this.professions.findIndex(item => item === this.menuService.selectedProfession);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.professions.length - 1;
      if (currentIndex > this.professions.length - 1)
        currentIndex = 0;

      this.menuService.setSelectedProfession(this.professions[currentIndex]);
    }
  }
}
