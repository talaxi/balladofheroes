import { Component, OnInit } from '@angular/core';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private battleService: BattleService, private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  pauseGame() {
    this.battleService.togglePause();
  }

  changeEquipment() {
    if (this.layoutService.navigation === NavigationEnum.Default)
    this.layoutService.changeLayout(NavigationEnum.Menu);
    else
    this.layoutService.changeLayout(NavigationEnum.Default);
  }
}
