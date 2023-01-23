import { Injectable } from '@angular/core';
import { GlobalService } from '../global/global.service';
declare var LZString: any;

@Injectable({
  providedIn: 'root'
})
export class GameSaveService {

  constructor(private globalService: GlobalService) { }

  saveGame() {
    if (this.globalService.globalVar.performanceMode) {      
      console.log("Begin saving game");
    }

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../../webworker.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        localStorage.setItem("theBalladOfHeroesGameData", data);
        worker.terminate();
      };
      worker.postMessage(this.globalService.globalVar);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      const data = this.globalService.globalVar;
      var globalData = JSON.stringify(data);
      var compressedData = LZString.compressToBase64(globalData);
      localStorage.setItem("theBalladOfHeroesGameData", compressedData);
    }

    if (this.globalService.globalVar.performanceMode) {      
      console.log("End saving game");
    }
  }
}
