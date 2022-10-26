import { Component } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { GlobalVariables } from './models/global/global-variables.model';
import { GameLoopService } from './services/game-loop/game-loop.service';
import { GameSaveService } from './services/game-save/game-save.service';
import { GlobalService } from './services/global/global.service';
import { environment } from 'src/environments/environment';
import { DeploymentService } from './services/deployment/deployment.service';
import { BattleService } from './services/battle/battle.service';
import { BalladService } from './services/ballad/ballad.service';
declare var LZString: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pilgrimage';
  newGame = true;
  saveTime = 0;
  saveFrequency = 10; //in seconds

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService, private gameSaveService: GameSaveService,
    private deploymentService: DeploymentService, private battleService: BattleService, private balladService: BalladService) {

  }

  ngOnInit() {
    var compressedGameData = localStorage.getItem("thePilgrimageGameData");

    if (compressedGameData !== null && compressedGameData !== undefined) {
      var gameData = LZString.decompressFromBase64(compressedGameData);
      var loadDataJson = <GlobalVariables>JSON.parse(gameData);
      if (loadDataJson !== null && loadDataJson !== undefined) {
        this.newGame = false;
        this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);
        this.loadStartup();
      }
    }

    if (environment.staging)
      this.deploymentService.setStagingMode();
    else
      this.deploymentService.setProductionMode();

      var forceNewGame = this.deploymentService.forceStartNewGame;
      var devMode = this.deploymentService.devModeActive;

      if (this.newGame || forceNewGame)
      {
        console.log("New game forced");
        this.globalService.initializeGlobalVariables();
      }

      if (devMode) {
        this.globalService.devMode();
      }

    var subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime: number) => {      
      //institute a max deltaTime before something else happens, currently set to 5 minutes
      //TODO: use this to institute some sort of loading screen or something
      if (deltaTime > 1 * 5 * 60)
        deltaTime = 1 * 5 * 60; 

      this.gameCheckup(deltaTime);
      this.saveTime += deltaTime;

      if (this.saveTime >= this.saveFrequency) {
        this.saveTime = 0;
        this.gameSaveService.saveGame();
      }
    });

    this.gameLoopService.Update();
  }

  public gameCheckup(deltaTime: number): void {
    //all game logic that should be updated behind the scenes
    this.battleService.handleBattle(deltaTime);
  }

  loadStartup() {
    /*var selectedTheme = this.globalService.globalVar.settings.get("theme");
    if (selectedTheme !== null && selectedTheme !== undefined)
      this.themeService.setActiveTheme(selectedTheme);*/
  }
}
