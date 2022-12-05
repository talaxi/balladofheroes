import { Injectable } from '@angular/core';
import { Character } from '../models/character/character.model';
import { BattleService } from './battle/battle.service';
import { GlobalService } from './global/global.service';

@Injectable({
  providedIn: 'root'
})
export class TownService {

  constructor(private battleService: BattleService, private globalService: GlobalService) { }

  handleTown(deltaTime: number) {
    var party = this.globalService.getActivePartyCharacters(true);

      //global -- this occurs even when at a scene or in a town
      party.forEach(partyMember => {
        //check for defeated
        var isDefeated = this.battleService.isCharacterDefeated(partyMember);
        if (!isDefeated) {
          this.battleService.handleAbilities(partyMember, [], party, deltaTime);
        }
      });
  }
}
