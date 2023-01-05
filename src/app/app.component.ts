import { Component, TemplateRef, ViewChild } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { GlobalVariables } from './models/global/global-variables.model';
import { GameLoopService } from './services/game-loop/game-loop.service';
import { GameSaveService } from './services/game-save/game-save.service';
import { GlobalService } from './services/global/global.service';
import { environment } from 'src/environments/environment';
import { DeploymentService } from './services/deployment/deployment.service';
import { BattleService } from './services/battle/battle.service';
import { BalladService } from './services/ballad/ballad.service';
import { InitializationService } from './services/global/initialization.service';
import { TownService } from './services/town.service';
import { BackgroundService } from './services/utility/background.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from './services/utility/utility.service';
import { SubZone } from './models/zone/sub-zone.model';
import { LookupService } from './services/lookup.service';
import { StoryService } from './services/story/story.service';
declare var LZString: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('loadingModal') loading: any;
  title = 'Ballad of Heroes';
  newGame = true;
  saveTime = 0;
  saveFrequency = 10; //in seconds
  bankedTime = 0;
  catchupDialog: MatDialogRef<unknown, any> | undefined = undefined;

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService, private gameSaveService: GameSaveService,
    private deploymentService: DeploymentService, private battleService: BattleService, private initializationService: InitializationService,
    private balladService: BalladService, private backgroundService: BackgroundService, public dialog: MatDialog,
    private utilityService: UtilityService, private lookupService: LookupService, private storyService: StoryService) {

  }

  ngOnInit() {
    var compressedGameData = localStorage.getItem("theBalladOfHeroesGameData");

    if (compressedGameData !== null && compressedGameData !== undefined) {
      var gameData = LZString.decompressFromBase64(compressedGameData);
      var loadDataJson = <GlobalVariables>JSON.parse(gameData);
      if (loadDataJson !== null && loadDataJson !== undefined) {
        this.newGame = false;
        this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);
        this.loadStartup();
      }
    }

    if (environment.staging) {
      this.deploymentService.setStagingMode();
    }
    else {
      this.deploymentService.setProductionMode();
    }

    var forceNewGame = this.deploymentService.forceStartNewGame;
    var devMode = this.deploymentService.devModeActive;

    if (this.newGame || forceNewGame) {
      console.log("New game forced");
      this.globalService.initializeGlobalVariables();
      this.initializationService.initializeVariables();
    }

    if (devMode) {
      this.initializationService.devMode();
    }

    var subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime: number) => {
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
    var activeSubzone = this.balladService.getActiveSubZone();

    if (this.utilityService.isGamePaused)
      deltaTime = 0;

    deltaTime = this.handleShortTermCatchUpTime(deltaTime, this.loading, activeSubzone);

    //this runs regardless of battle state
    this.backgroundService.handleBackgroundTimers(deltaTime);

    if (!activeSubzone.isTown) {
      this.globalService.globalVar.timers.townHpGainTimer = 0;
    }
    else
      this.backgroundService.handleTown(deltaTime, this.loading);

    this.battleService.handleBattle(deltaTime, this.loading);
  }

  loadStartup() {
    /*var selectedTheme = this.globalService.globalVar.settings.get("theme");
    if (selectedTheme !== null && selectedTheme !== undefined)
      this.themeService.setActiveTheme(selectedTheme);*/
      
    this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
    this.storyService.showStory = false;
    this.utilityService.isBattlePaused = false;
  }

  handleShortTermCatchUpTime(deltaTime: number, loadingContent: any, subzone: SubZone) {
    if (deltaTime > this.utilityService.activeTimeLimit) {
      this.globalService.globalVar.extraSpeedTimeRemaining += deltaTime - this.utilityService.activeTimeLimit;
      deltaTime = this.utilityService.activeTimeLimit;

      if (this.globalService.globalVar.extraSpeedTimeRemaining > this.utilityService.extraSpeedTimeLimit)
        this.globalService.globalVar.extraSpeedTimeRemaining = this.utilityService.extraSpeedTimeLimit;
    }

    //if speed up time remains, use it (only if not doing batches which causes issues)
    if (!this.globalService.globalVar.isCatchingUp) {
      if (this.globalService.globalVar.extraSpeedTimeRemaining > 0 && deltaTime < this.utilityService.activeTimeLimit / 2) {
        if (this.globalService.globalVar.extraSpeedTimeRemaining < deltaTime) {
          deltaTime += this.globalService.globalVar.extraSpeedTimeRemaining;
          this.globalService.globalVar.extraSpeedTimeRemaining = 0;
        }
        else {
          this.globalService.globalVar.extraSpeedTimeRemaining -= deltaTime;
          deltaTime *= 2;
        }
      }
    }

    var batchTime = this.getBatchRunTime(subzone); //runs the game in batches of 5 seconds max
    //user was afk, run battle in batches until you're caught up
    if (deltaTime > batchTime) {
      this.lookupService.isUIHidden = true;
      this.globalService.globalVar.isCatchingUp = true;
      this.bankedTime += deltaTime - batchTime;
      deltaTime = batchTime;

      //if (this.bankedTime > 60 && this.catchupDialog === undefined)
        //this.catchupDialog = this.openCatchUpModal(loadingContent);
    }

    if (deltaTime < batchTime && this.bankedTime > 0) {
      if (this.bankedTime + deltaTime <= batchTime) //amount of time banked is less than a batch so use it all
      {
        deltaTime += this.bankedTime;
        this.bankedTime = 0;
        this.lookupService.isUIHidden = false;
        this.globalService.globalVar.isCatchingUp = false;

        if (this.catchupDialog !== undefined) {
          this.catchupDialog.close();
          this.catchupDialog = undefined;
        }
      }
      else //use partial amount of banked time
      {
        var useAmount = batchTime - deltaTime;
        this.bankedTime -= useAmount;
        deltaTime += useAmount;

        if (this.bankedTime <= 0)
          this.bankedTime = 0;
      }
    }

    return deltaTime;
  }

  getBatchRunTime(subzone: SubZone) {
    var batchRunTime = 5;

    if (subzone.isTown)
      batchRunTime = 30;

    return batchRunTime;
  }

  openCatchUpModal(content: any) {
    var dialog = this.dialog.open(content, { width: '50%' });

    return dialog;
  }
}
