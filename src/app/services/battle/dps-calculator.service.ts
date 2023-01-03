import { Injectable } from '@angular/core';
import { GameLoopService } from '../game-loop/game-loop.service';
import { GlobalService } from '../global/global.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class DpsCalculatorService {
  subscription: any;
  partyDamagingActions: [number, number][] = [];
  enemyDamagingActions: [number, number][] = [];
  rollingAverageTimer: number = 0;

  constructor(private gameLoopService: GameLoopService, private utilityService: UtilityService, private globalService: GlobalService) {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (!this.utilityService.isGamePaused && !this.utilityService.isBattlePaused)
      {
        if (this.globalService.globalVar.extraSpeedTimeRemaining > 0)
          deltaTime *= 2;

        this.rollingAverageTimer += deltaTime;
      }
    });
   }

   addPartyDamageAction(damageDealt: number) {
    this.partyDamagingActions.push([damageDealt, this.rollingAverageTimer]);
  }

  addEnemyDamageAction(damageDealt: number) {
    this.enemyDamagingActions.push([damageDealt, this.rollingAverageTimer]);
    console.log("Add: (" + damageDealt + ", " + this.rollingAverageTimer + ")");
    console.log(this.enemyDamagingActions);
  }

  calculatePartyDps() {
    var dps = 0;
    if (this.partyDamagingActions === undefined || this.partyDamagingActions.length === 0)
      return dps;

    var rollingAverageTime = 120; //only factor in the latest 120 seconds

    var latestTime = this.partyDamagingActions[this.partyDamagingActions.length - 1][1];

    this.partyDamagingActions = this.partyDamagingActions.filter(item => item[1] >= latestTime - rollingAverageTime);
    
    var sum = this.partyDamagingActions.reduce((accumulator, currentValue) => accumulator + currentValue[0], 0);

    if (latestTime < rollingAverageTime)    
      dps = sum / latestTime;    
    else
      dps = sum / rollingAverageTime;

    return dps;
  }

  calculateEnemyDps() {
    var dps = 0;
    if (this.enemyDamagingActions === undefined || this.enemyDamagingActions.length === 0)
      return dps;

    var rollingAverageTime = 120; //only factor in the latest 120 seconds

    var latestTime = this.enemyDamagingActions[this.enemyDamagingActions.length - 1][1];

    this.enemyDamagingActions = this.enemyDamagingActions.filter(item => item[1] >= latestTime - rollingAverageTime);
    
    var sum = this.enemyDamagingActions.reduce((accumulator, currentValue) => accumulator + currentValue[0], 0);

    if (latestTime < rollingAverageTime)    
      dps = sum / latestTime;    
    else
      dps = sum / rollingAverageTime;

    return dps;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
