import { EventEmitter, Injectable } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {  
  gameUpdateEvent = new EventEmitter<number>();
  deltaTime: number;

  constructor(private globalService: GlobalService) { }

  public Update(): void {  
    var dateNow = Date.now();    
    const deltaTime = (dateNow - this.globalService.globalVar.lastTimeStamp) / 1000;
  
    this.deltaTime = deltaTime;
    this.globalService.globalVar.lastTimeStamp = dateNow;
    this.gameUpdateEvent.emit(deltaTime);
    
    window.requestAnimationFrame(() => this.Update());    
  } 
}
