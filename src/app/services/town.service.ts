import { Injectable } from '@angular/core';
import { Character } from '../models/character/character.model';
import { BattleService } from './battle/battle.service';
import { GlobalService } from './global/global.service';

@Injectable({
  providedIn: 'root'
})
export class TownService {

  constructor(private battleService: BattleService, private globalService: GlobalService) { }  
}
