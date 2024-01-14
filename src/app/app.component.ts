import { Component, ViewChild } from '@angular/core';
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
import { BackgroundService } from './services/utility/background.service';
import { MatDialog as MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from './services/utility/utility.service';
import { SubZone } from './models/zone/sub-zone.model';
import { LookupService } from './services/lookup.service';
import { StoryService } from './services/story/story.service';
import { OptionalSceneEnum } from './models/enums/optional-scene-enum.model';
import { VersionControlService } from './services/utility/version-control.service';
import { GameLogService } from './services/battle/game-log.service';
declare var LZString: any;
import { ActivatedRoute, Router } from '@angular/router';
import { DpsCalculatorService } from './services/battle/dps-calculator.service';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

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
  saveFrequency = 5; //in seconds
  catchupDialog: MatDialogRef<unknown, any> | undefined = undefined;
  @ViewChild('confirmationBox') confirmationBox: any;
  @ViewChild('ticketsBox') ticketsBox: any;

  constructor(private globalService: GlobalService, private gameLoopService: GameLoopService, private gameSaveService: GameSaveService,
    private deploymentService: DeploymentService, private battleService: BattleService, private initializationService: InitializationService,
    private balladService: BalladService, private backgroundService: BackgroundService, public dialog: MatDialog,
    private utilityService: UtilityService, private lookupService: LookupService, private storyService: StoryService,
    private versionControlService: VersionControlService, private gameLogService: GameLogService, private activatedRoute: ActivatedRoute,
    private router: Router, private dpsCalculatorService: DpsCalculatorService) {

  }

  ngOnInit() {
    var compressedGameData = localStorage.getItem("theBalladOfHeroesFinalGameData");

    if (compressedGameData !== null && compressedGameData !== undefined) {
      var gameData = LZString.decompressFromBase64(compressedGameData);
      var loadDataJson = <GlobalVariables>JSON.parse(gameData);
      if (loadDataJson !== null && loadDataJson !== undefined) {
        this.newGame = false;
        this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);
        this.loadStartup();

        //if (this.globalService.globalVar.betaSave)
        //this.newGame = true;
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
    
    this.checkForSupporterConfirmation();
    this.versionControlService.updatePlayerVersion(true);

    var lastPerformanceNow = 0;
    var subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime: number) => {
      deltaTime = this.utilityService.roundTo(deltaTime, 5);
      var checkupPerformanceNow = performance.now();

      this.gameCheckup(deltaTime);

      if (this.globalService.globalVar.performanceMode) {
        var checkupDiff = performance.now() - checkupPerformanceNow;
        console.log("Check up performance: " + checkupDiff + " ms");
      }
      this.saveTime += deltaTime;

      if (this.saveTime >= this.saveFrequency) {
        this.saveTime = 0;
        this.gameSaveService.saveGame();
      }

      if (this.globalService.globalVar.performanceMode) {
        var performanceNow = performance.now();
        var diff = performanceNow - lastPerformanceNow;
        console.log('Full Game Loop: ' + diff + " ms, FPS is: " + (1000 / diff));

        lastPerformanceNow = performanceNow;
      }
    });

    this.gameLoopService.Update();
  }

  public gameCheckup(deltaTime: number): void {
    //all game logic that should be updated behind the scenes
    var activeSubzone = this.balladService.getActiveSubZone();

    if (this.globalService.globalVar.isGamePaused)
      deltaTime = 0;

    var maxRunCount = 1;
    var runCount = 1;

    if (this.globalService.globalVar.isCatchingUp)
      maxRunCount = 5;

    while (runCount <= maxRunCount) {
      if (runCount > 1)
        deltaTime = 0;
      //console.log("Run Count: " + runCount + " Max Count: " + maxRunCount);
      this.updateGameState(deltaTime, activeSubzone);
      runCount += 1;
    }
  }

  updateGameState(deltaTime: number, activeSubzone: SubZone) {
    var originalDeltaTime = deltaTime;
    deltaTime = this.handleShortTermCatchUpTime(deltaTime, activeSubzone);
    var isInTown = this.balladService.isSubzoneTown(activeSubzone.type) && this.lookupService.userNotInTownBattle();
    //vv not used anymore I think
    //if (Math.abs(deltaTime - originalDeltaTime) < this.getBatchRunTime(activeSubzone, deltaTime))
    //this.dpsCalculatorService.bonusTime += deltaTime - originalDeltaTime;

    //this runs regardless of battle state
    //console.log("originalDeltaTime: " + originalDeltaTime + " New: " + deltaTime);
    this.backgroundService.handleBackgroundTimers(deltaTime, isInTown);

    if (isInTown)
      this.backgroundService.handleTown(deltaTime, this.loading);
    else
      this.globalService.globalVar.timers.townHpGainTimer = 0;

    this.battleService.handleBattle(deltaTime, this.loading);
  }

  loadStartup() {
    //TODO: after beta, remove this
    if (this.globalService.globalVar.betaSave === undefined)
      this.globalService.globalVar.betaSave = true;
    //^^^

    this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
    this.storyService.showStory = false;
    this.storyService.showOptionalStory = OptionalSceneEnum.None;
    this.globalService.globalVar.isBattlePaused = false;
  }

  handleShortTermCatchUpTime(deltaTime: number, subzone: SubZone) {
    var activeTimeLimit = this.globalService.globalVar.settings.get("loadingTime") ?? this.utilityService.lowActiveTimeLimit;

    if (deltaTime > activeTimeLimit) {
      //this.globalService.globalVar.extraSpeedTimeRemaining += deltaTime - activeTimeLimit;
      deltaTime = activeTimeLimit;
    }
    //var doubleSpeedActive = false;

    if (this.globalService.globalVar.extraSpeedEnabled)
      deltaTime *= 2;

    /*
  //if (!this.globalService.globalVar.isCatchingUp) {
    if (this.globalService.globalVar.extraSpeedTimeRemaining > 0 && //deltaTime < this.utilityService.activeTimeLimit / 2 &&
      this.globalService.globalVar.extraSpeedEnabled) {          
      if (this.globalService.globalVar.extraSpeedTimeRemaining < deltaTime) {
        deltaTime += this.globalService.globalVar.extraSpeedTimeRemaining;
        this.globalService.globalVar.extraSpeedTimeRemaining = 0;          
      }
      else {
        this.globalService.globalVar.extraSpeedTimeRemaining -= deltaTime;
        deltaTime *= 2;
        doubleSpeedActive = true;
      }
    }
  //}*/

    //cap extra speed after you deduct the catch up speed amount
    /*var timeLimit = this.utilityService.extraSpeedTimeLimit;
    if (this.globalService.globalVar.isSubscriber)
      timeLimit = this.utilityService.patronExtraSpeedTimeLimit;

    if (this.globalService.globalVar.extraSpeedTimeRemaining > timeLimit)
    this.globalService.globalVar.extraSpeedTimeRemaining = timeLimit;
    */

    var batchTime = this.getBatchRunTime(subzone, deltaTime); //runs the game in batches of 5 seconds max    
    //user was afk, run battle in batches until you're caught up
    if (deltaTime > batchTime) {
      this.lookupService.isUIHidden = true;
      this.globalService.globalVar.isCatchingUp = true;
      this.gameLogService.disableOverlayBuffer = true;
      this.globalService.bankedTime += deltaTime - batchTime;
      deltaTime = batchTime;

      if (this.globalService.bankedTime > this.globalService.maxBankedTime)
        this.globalService.maxBankedTime = this.globalService.bankedTime;
    }

    if (deltaTime < batchTime && this.globalService.bankedTime > 0) {
      if (this.globalService.bankedTime + deltaTime <= batchTime) //amount of time banked is less than a batch so use it all
      {
        deltaTime += this.globalService.bankedTime;
        this.dpsCalculatorService.bonusTime += this.globalService.bankedTime;
        this.globalService.bankedTime = 0;
        this.globalService.maxBankedTime = 0;
        this.lookupService.isUIHidden = false;
        this.globalService.globalVar.isCatchingUp = false;
        this.gameLogService.disableOverlayBuffer = false;
        this.gameSaveService.saveGame();

        if (this.catchupDialog !== undefined) {
          this.catchupDialog.close();
          this.catchupDialog = undefined;
        }
      }
      else //use partial amount of banked time
      {
        var useAmount = batchTime - deltaTime;
        this.globalService.bankedTime -= useAmount;
        deltaTime += useAmount;
        this.dpsCalculatorService.bonusTime += useAmount;

        if (this.globalService.bankedTime <= 0)
          this.globalService.bankedTime = 0;
      }
    }

    return deltaTime;
  }

  getBatchRunTime(subzone: SubZone, totalDeltaTime: number) {
    var batchRunTime = this.globalService.globalVar.settings.get("loadingAccuracy") ?? this.utilityService.averageLoadingAccuracy;

    if (this.balladService.isSubzoneTown(subzone.type) && this.lookupService.userNotInTownBattle())
      batchRunTime = 30;

    return batchRunTime;
  }

  openCatchUpModal(content: any) {
    var dialog = this.dialog.open(content, { width: '50%' });

    return dialog;
  }

  checkForSupporterConfirmation() {
    var setAsSubscriber = false;
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params === undefined || params.co === undefined)
        return;

      var checkoutConfirmation = params.co;
      
      if (checkoutConfirmation === environment.SQUARE_SUPPORTER && !this.globalService.globalVar.isSubscriber) {
        setAsSubscriber = true;
        this.globalService.setAsSubscriber(new Date());

        this.openSubscriberModal();
      }
      else if (checkoutConfirmation === environment.SQUARE_ETERNAL_MELEE_TICKETS) {
        var ticketMultiplier = 1;
        if (this.globalService.globalVar.isSubscriber)
          ticketMultiplier = 2;

        var additionalTickets = this.utilityService.weeklyMeleeEntryCap * ticketMultiplier;

        this.lookupService.gainResource(new ResourceValue(ItemsEnum.EternalMeleeTicket, additionalTickets));
        this.openTicketsModal();
      }

      this.gameSaveService.saveGame();
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: null,
          queryParamsHandling: '',
          replaceUrl: true
        });
    });
  }  

  openSubscriberModal() {
    var dialog = this.dialog.open(this.confirmationBox, { width: '50%' });

    return dialog;
  }

  openTicketsModal() {
    var dialog = this.dialog.open(this.ticketsBox, { width: '50%' });

    return dialog;
  }
}
