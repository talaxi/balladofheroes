import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BattleService } from 'src/app/services/battle/battle.service';

@Component({
  selector: 'app-enemy-view',
  templateUrl: './enemy-view.component.html',
  styleUrls: ['./enemy-view.component.css']
})
export class EnemyViewComponent implements OnInit {
  @Input() character: Enemy;

  constructor(public battleService: BattleService) { }

  ngOnInit(): void {
  }

  getCharacterHpPercent(character: Enemy) {    
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
  }

  getCharacterMpPercent(character: Enemy) {
    return (character.battleStats.currentMp / character.battleStats.mp) * 100;
  }

  getStaggerPercent(character: Enemy) {
    return ((character.currentStagger - character.baseStagger) / (character.breakPoint - character.baseStagger)) * 100;
  }

  getCharacterAutoAttackProgress(character: Enemy) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  
  targetCharacterWithItem(character: Character) {
    var isTargeted = false;

    if (this.battleService.targetbattleItemMode) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }
}
