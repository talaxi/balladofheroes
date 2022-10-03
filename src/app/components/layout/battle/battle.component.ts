import { Component, OnInit } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {

  currentEnemies: EnemyTeam;
  subscription: any;

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.activeBattle !== undefined)
      this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      if (this.globalService.globalVar.activeBattle !== undefined)
        this.currentEnemies = this.globalService.globalVar.activeBattle?.currentEnemies;
    });
  }
}
