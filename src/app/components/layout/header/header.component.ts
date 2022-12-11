import { Component, HostListener, OnInit } from '@angular/core';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private battleService: BattleService, private layoutService: LayoutService, private menuService: MenuService,
    private utilityService: UtilityService, private globalService: GlobalService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
  
    if (event.key === "m" || event.key === "M") {
      this.openMenu();
    }
  }

  ngOnInit(): void {
  }

  pauseGame() {
    this.battleService.togglePause();
  }

  getExtraSpeedTime() {
    var time = "";

    time = this.utilityService.convertSecondsToHHMMSS(this.globalService.globalVar.extraSpeedTimeRemaining);

    return time;
  }

  openMenu() {
    if (this.layoutService.navigation === NavigationEnum.Default)
    {
      this.layoutService.changeLayout(NavigationEnum.Menu);
      if (this.menuService.selectedMenuDisplay === MenuEnum.Characters && this.menuService.selectedCharacter === CharacterEnum.None)
        this.menuService.setSelectedCharacter(CharacterEnum.Adventurer);
      if (this.menuService.selectedMenuDisplay === MenuEnum.Gods && this.menuService.selectedGod === GodEnum.None)
        this.menuService.setSelectedGod(GodEnum.Athena);
    }    
    else
      this.layoutService.changeLayout(NavigationEnum.Default);
  }
}
