import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { plainToInstance } from 'class-transformer';
import { StoryStyleSettingEnum } from 'src/app/models/enums/story-style-setting-enum.model';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { StoryService } from 'src/app/services/story/story.service';
import { CodeCreationService } from 'src/app/services/utility/code-creation.service';
import { CodeRedemptionService } from 'src/app/services/utility/code-redemption.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { VersionControlService } from 'src/app/services/utility/version-control.service';
declare var LZString: any;
import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from 'stripe';
import { PatreonAccessService } from 'src/app/services/utility/patreon-access.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { InitializationService } from 'src/app/services/global/initialization.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {
  importExportValue: string;
  file: any;
  enteredRedemptionCode: string;
  storyStyle: StoryStyleSettingEnum;
  fps: number;
  loadingAccuracy: number;
  loadingTime: number;
  storyStyleEnum = StoryStyleSettingEnum;
  tooltipTheme: boolean;
  quickViewOverlayFlipped: boolean = false;
  showPartyHpAsPercent: boolean = false;
  showEnemyHpAsPercent: boolean = false;
  autoExportOnUpdate: boolean = true;
  showTutorialsAsModals: boolean = false;
  verboseMode: boolean = false;
  @Input() isMobile = false;
  confirmationText = "";
  @ViewChild('confirmationBox') confirmationBox: any;

  constructor(private globalService: GlobalService, private balladService: BalladService, private storyService: StoryService,
    public utilityService: UtilityService, public dialog: MatDialog, private deploymentService: DeploymentService,
    private versionControlService: VersionControlService, private codeCreationService: CodeCreationService,
    private codeRedemptionService: CodeRedemptionService, private patreonAccessService: PatreonAccessService, private lookupService: LookupService,
    private menuService: MenuService, private initializationService: InitializationService) { }

  ngOnInit(): void {
    if (this.deploymentService.codeCreationMode) {
      console.log(this.globalService.globalVar);
      //console.log(JSON.stringify(this.globalService.globalVar));

      /*console.log("1 hit (default): " + this.lookupService.getAgilityPerAttackForAttackCount(0));
      console.log("2 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(1));
      console.log("3 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(2));
      console.log("4 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(3));
      console.log("5 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(4));
      console.log("6 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(5));
      console.log("7 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(6));
      console.log("8 hits: " + this.lookupService.getAgilityPerAttackForAttackCount(7));*/
    }

    //this.patreonAccessService.getPatronList();

    if (this.deploymentService.codeCreationMode)
      console.log(this.codeCreationService.createCode());

    this.getSettings();
  }

  getSettings() {
    var storyStyle = this.globalService.globalVar.settings.get("storyStyle");
    if (storyStyle === undefined)
      this.storyStyle = StoryStyleSettingEnum.Medium;
    else
      this.storyStyle = storyStyle;
      
    var tooltipTheme = this.globalService.globalVar.settings.get("tooltipTheme");
    if (tooltipTheme === undefined)
      this.tooltipTheme = true;
    else
      this.tooltipTheme = tooltipTheme;

    this.fps = this.globalService.globalVar.settings.get("fps") ?? this.utilityService.averageFps;
    this.loadingAccuracy = this.globalService.globalVar.settings.get("loadingAccuracy") ?? this.utilityService.averageLoadingAccuracy;
    this.loadingTime = this.globalService.globalVar.settings.get("loadingTime") ?? this.utilityService.lowActiveTimeLimit;
    this.quickViewOverlayFlipped = this.globalService.globalVar.settings.get("quickViewOverlayFlipped") ?? false;
    this.showPartyHpAsPercent = this.globalService.globalVar.settings.get("showPartyHpAsPercent") ?? false;
    this.showEnemyHpAsPercent = this.globalService.globalVar.settings.get("showEnemyHpAsPercent") ?? false;
    this.autoExportOnUpdate = this.globalService.globalVar.settings.get("autoExportOnUpdate") ?? true;
    this.showTutorialsAsModals = this.globalService.globalVar.settings.get("showTutorialsAsModals") ?? false;
    this.verboseMode = this.globalService.globalVar.settings.get("verboseMode") ?? false;
  }

  public SaveGame() {
    var globalData = JSON.stringify(this.globalService.globalVar);
    var compressedData = LZString.compressToBase64(globalData);
    this.importExportValue = compressedData;
  }

  fileChanged(e: any) {
    this.file = e.target.files[0];
  }

  public LoadGame() {
    if (confirm("This will overwrite your existing game data. Continue?")) {
      var decompressedData = LZString.decompressFromBase64(this.importExportValue);
      var loadDataJson = <GlobalVariables>JSON.parse(decompressedData);
      if (loadDataJson !== null && loadDataJson !== undefined) {
        this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);
        this.versionControlService.updatePlayerVersion();

        this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
        this.storyService.showStory = false;
        this.globalService.globalVar.isBattlePaused = false;

        this.getSettings();
      }
    }
  }

  public SaveGameToFile() {
    this.versionControlService.exportData();
  }

  public LoadGameFromFile() {
    if (this.file === null || this.file === undefined || this.file.length === 0)
      alert("First select a file to import.");

    if (confirm("This will overwrite your existing game data. Continue?")) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        var decompressedData = LZString.decompressFromBase64(fileReader.result);
        console.log(decompressedData);
        decompressedData.replace("耬","");
        var loadDataJson = <GlobalVariables>JSON.parse(decompressedData);
        if (loadDataJson !== null && loadDataJson !== undefined) {
          this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);                
          this.versionControlService.updatePlayerVersion();

          this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
          this.storyService.showStory = false;
          this.globalService.globalVar.isBattlePaused = false;

          this.getSettings();
        }
      }
      fileReader.readAsText(this.file);
    }
  }

  inTextbox() {
    this.menuService.inTextbox = true;
  }

  outOfTextbox() {
    this.menuService.inTextbox = false;
  }

  setStoryStyle() {
    if (this.storyStyle === StoryStyleSettingEnum.Fast)
      this.globalService.globalVar.timers.scenePageLength = this.globalService.globalVar.timers.fastStorySpeed;
    if (this.storyStyle === StoryStyleSettingEnum.Skip)
      this.globalService.globalVar.timers.scenePageLength = this.globalService.globalVar.timers.skipStorySpeed;
    if (this.storyStyle === StoryStyleSettingEnum.Medium)
      this.globalService.globalVar.timers.scenePageLength = this.globalService.globalVar.timers.mediumStorySpeed;
    if (this.storyStyle === StoryStyleSettingEnum.Slow)
      this.globalService.globalVar.timers.scenePageLength = this.globalService.globalVar.timers.slowStorySpeed;
    if (this.storyStyle === StoryStyleSettingEnum.Pause)
      this.globalService.globalVar.timers.scenePageLength = this.globalService.globalVar.timers.pauseStorySpeed;

    this.globalService.globalVar.settings.set("storyStyle", this.storyStyle);
  }

  setFps() {    
    this.globalService.globalVar.settings.set("fps", this.fps);
  }

  setLoadingAccuracy() {    
    this.globalService.globalVar.settings.set("loadingAccuracy", this.loadingAccuracy);
  }

  setLoadingTime() {    
    this.globalService.globalVar.settings.set("loadingTime", this.loadingTime);
  }

  setTooltipTheme() {
    this.globalService.globalVar.settings.set("tooltipTheme", this.tooltipTheme);
  }

  openKeybinds(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
    else
      this.dialog.open(content, { width: '75%', maxHeight: '75%', minHeight: '50%', id: 'dialogNoPadding' });
  }

  openQuickViewOptions(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
    else
    this.dialog.open(content, { width: '60%', height: '75%', panelClass: 'mat-dialog-no-scroll' });
  }

  resetGame() {
    if (confirm("This will export a copy of your current data and then reset your game back to the start. Continue?")) {
      this.SaveGameToFile();
      var isSubscriber = this.globalService.globalVar.isSubscriber;      
      var subscribedDate = this.globalService.globalVar.subscribedDate;

      this.globalService.initializeGlobalVariables();
      this.initializationService.initializeVariables();
      
      if (isSubscriber) {
        this.globalService.setAsSubscriber(subscribedDate);
      }
    }
  }

  enterRedemptionCode() {
    this.confirmationText = this.codeRedemptionService.redeemCode(this.enteredRedemptionCode);
    if (this.confirmationText !== "")
      this.dialog.open(this.confirmationBox, { width: '40%', height: 'auto' });
  }

  quickViewOverlayFlippedToggle() {
    this.globalService.globalVar.settings.set("quickViewOverlayFlipped", this.quickViewOverlayFlipped);
  }
  showEnemyHpAsPercentToggle() {
    this.globalService.globalVar.settings.set("showEnemyHpAsPercent", this.showEnemyHpAsPercent);
  }
  showPartyHpAsPercentToggle() {
    this.globalService.globalVar.settings.set("showPartyHpAsPercent", this.showPartyHpAsPercent);
  }
  autoExportOnUpdateToggle() {
    this.globalService.globalVar.settings.set("autoExportOnUpdate", this.autoExportOnUpdate);
  }
  showTutorialsAsModalsToggle() {
    this.globalService.globalVar.settings.set("showTutorialsAsModals", this.showTutorialsAsModals);
  }
  verboseModeToggle() {
    this.globalService.globalVar.settings.set("verboseMode", this.verboseMode);
  }

  ngOnDestroy() {    
    this.menuService.inTextbox = false;
  }
}
