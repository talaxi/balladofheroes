import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';

@Component({
  selector: 'app-enemy-view',
  templateUrl: './enemy-view.component.html',
  styleUrls: ['./enemy-view.component.css']
})
export class EnemyViewComponent implements OnInit {
  @Input() character: Character;

  constructor() { }

  ngOnInit(): void {
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
