import { Component, Input, OnInit } from '@angular/core';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menu-display',
  templateUrl: './menu-display.component.html',
  styleUrls: ['./menu-display.component.css']
})
export class MenuDisplayComponent implements OnInit {
  public menuEnum = MenuEnum;
  @Input() isMobile = false;
  presetBallad: Ballad | undefined = undefined;
  presetZone: Zone | undefined = undefined;
  presetSubzone: SubZone | undefined = undefined;
  subscription: any;
  previousMenuOption: MenuEnum;

  constructor(public menuService: MenuService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.previousMenuOption = this.menuService.selectedMenuDisplay;
    this.presetBallad = this.menuService.selectedBestiaryBallad;
    this.presetZone = this.menuService.selectedBestiaryZone;
    this.presetSubzone = this.menuService.selectedBestiarySubzone;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedMenuDisplay !== this.previousMenuOption)
      {
        this.presetBallad = this.menuService.selectedBestiaryBallad;
        this.presetZone = this.menuService.selectedBestiaryZone;
        this.presetSubzone = this.menuService.selectedBestiarySubzone;        
        this.previousMenuOption = this.menuService.selectedMenuDisplay;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
