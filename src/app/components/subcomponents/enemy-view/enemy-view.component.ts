import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-enemy-view',
  templateUrl: './enemy-view.component.html',
  styleUrls: ['./enemy-view.component.css']
})
export class EnemyViewComponent implements OnInit {
  @Input() enemyParty: Enemy[];
  @Input() character: Enemy;
  @Input() showNewEnemyGroupAnimation: boolean = false;
  @Input() isBoss = false;
  tooltipDirection = DirectionEnum.Down;

  constructor(public battleService: BattleService, public lookupService: LookupService) { }

  ngOnInit(): void {
    
  }

  getCharacterHpPercent(character: Enemy) {    
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
  }

  getCharacterBarrierPercent(character: Enemy) {    
    return (character.battleInfo.barrierValue / character.battleStats.maxHp) * 100;
  }

  getCharacterAutoAttackProgress(character: Enemy) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  
  targetCharacterWithItem(character: Character) {
    var isTargeted = false;

    var isTargetable = this.battleService.isTargetableWithItem(character, true);

    if (this.battleService.targetbattleItemMode && isTargetable) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnCharacter(character: Character) {
    if (this.targetCharacterWithItem(character))
      return this.battleService.useBattleItemOnCharacter(character, this.enemyParty);
  }

  getCharacterBarrierValue(character: Character) {    
    return character.battleInfo.barrierValue;
  }

  /*ngOnChanges(changes: any) {
    this.showNewEnemyGroupAnimation = changes.showNewEnemyGroupAnimation.currentValue;    
  }*/
}
