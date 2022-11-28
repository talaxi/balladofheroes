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
  subscription: any;

  constructor(private lookupService: LookupService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
    if (selectedGod !== undefined)
    {
      this.god = selectedGod;    
    }

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedGod !== undefined && this.menuService.selectedGod !== this.god.type) {
        var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
        if (selectedGod !== undefined)
        {
          this.god = selectedGod;
        }
      }
    });
  }

  getGodAbilityDescription(abilityName: string, ability?: Ability) {    
    var defaultCharacter = new Character();
    return this.lookupService.getGodAbilityDescription(abilityName, defaultCharacter, ability);
  }

  getGodColor() {
    return {
      'athenaColor': this.god.type === GodEnum.Athena,
      'zeusColor': this.god.type === GodEnum.Zeus,
      'apolloColor': this.god.type === GodEnum.Apollo,
      'aresColor': this.god.type === GodEnum.Ares,
      'poseidonColor': this.god.type === GodEnum.Poseidon,
      'artemisColor': this.god.type === GodEnum.Artemis
    };
  }
}
