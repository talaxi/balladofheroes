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
  xpGain: [number, number][] = [];
  rollingAverageTimer: number = 0;
  bonusTime: number = 0;

  constructor(private gameLoopService: GameLoopService, private utilityService: UtilityService, private globalService: GlobalService) {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (!this.globalService.globalVar.isGamePaused && !this.globalService.globalVar.isBattlePaused)
      {
        if (this.globalService.globalVar.extraSpeedTimeRemaining > 0)
          deltaTime *= 2;

        this.rollingAverageTimer += deltaTime;

        if (this.bonusTime > 0) {
          this.rollingAverageTimer += this.bonusTime;
          this.bonusTime = 0;
        }
      }
    });
   }

   addPartyDamageAction(damageDealt: number) {
    this.partyDamagingActions.push([damageDealt, this.rollingAverageTimer]);
  }

  addEnemyDamageAction(damageDealt: number) {
    this.enemyDamagingActions.push([damageDealt, this.rollingAverageTimer]);    
  }

  addXpGain(xp: number) {
    this.xpGain.push([xp, this.rollingAverageTimer]);    
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

  calculateXps() {
    var xps = 0;
    console.log(this.xpGain);
    if (this.xpGain === undefined || this.xpGain.length === 0)
      return xps;

    var rollingAverageTime = 120; //only factor in the latest 120 seconds

    var latestTime = this.xpGain[this.xpGain.length - 1][1];

    this.xpGain = this.xpGain.filter(item => item[1] >= latestTime - rollingAverageTime);
    
    var sum = this.xpGain.reduce((accumulator, currentValue) => accumulator + currentValue[0], 0);

    if (latestTime < rollingAverageTime)    
      xps = sum / latestTime;    
    else
      xps = sum / rollingAverageTime;

    return xps;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
