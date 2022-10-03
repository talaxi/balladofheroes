import { Injectable } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor() { }

  generateEnemy(type: BestiaryEnum)
  {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;

    if (type === BestiaryEnum.Dingo)
    {
      enemy.name = "Dingo";
      enemy.battleStats = new CharacterStats(125, 10, 13, 1, 1, 120, 10, 15, 0, 5); 
      enemy.xpGainFromDefeat = 500;
    }

    return enemy;
  }
}
