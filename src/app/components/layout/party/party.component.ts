import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})

export class PartyComponent implements OnInit {
  party: Character[];
  public characterEnum: CharacterEnum;
  public noCharacter = CharacterEnum.none;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    this.party = this.globalService.getActivePartyCharacters(false);    
  }

  getCharacterHpPercent(character: Character) {    
    return (character.battleStats.currentHp / character.battleStats.hp) * 100;
  }

  getCharacterMpPercent(character: Character) {
    return (character.battleStats.currentMp / character.battleStats.mp) * 100;
  }

  getCharacterAutoAttackProgress(character: Character) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }
}
