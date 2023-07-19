import { EventEmitter, Injectable } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {  
  gameUpdateEvent = new EventEmitter<number>();
  deltaTime: number;

  constructor(private globalService: GlobalService, private utilityService: UtilityService) { }

  public Update(): void {  
    var dateNow = Date.now();    
    if (this.globalService.globalVar.lastTimeStamp > dateNow) {
      this.globalService.globalVar.lastTimeStamp = dateNow;
    }

    const deltaTime = (dateNow - this.globalService.globalVar.lastTimeStamp) / 1000;
  
    this.deltaTime = deltaTime;
    var shouldEmit = false;
    var fps = this.globalService.globalVar.settings.get("fps") ?? this.utilityService.averageFps;    
    if (this.globalService.globalVar.isCatchingUp)
    {
      fps = this.utilityService.highFps;
    }

    var fpsInterval = 1000 / fps;
    //console.log(dateNow - this.globalService.globalVar.lastTimeStamp + " vs " + fpsInterval);    
    if (fps === this.utilityService.highFps || dateNow - this.globalService.globalVar.lastTimeStamp > fpsInterval)
      shouldEmit = true;    

    if (shouldEmit) {
      this.globalService.globalVar.lastTimeStamp = dateNow;
      this.gameUpdateEvent.emit(deltaTime);
    }
    
    window.requestAnimationFrame(() => this.Update());    
  } 
}
