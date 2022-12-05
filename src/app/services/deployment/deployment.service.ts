import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  devModeActive = false;
  forceStartNewGame = false;
  codeCreationMode = false;

  constructor() { }

  setProductionMode()
  {
    this.devModeActive = false;
    this.forceStartNewGame = false;
    this.codeCreationMode = false;
  }

  setStagingMode() {
    this.devModeActive = true;
    this.forceStartNewGame = true;
    this.codeCreationMode = true;
  }
}
