import { Component, Input, OnInit } from '@angular/core';
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
  storyStyleEnum = StoryStyleSettingEnum;
  quickViewOverlayFlipped: boolean = false;
  @Input() isMobile = false;

  constructor(private globalService: GlobalService, private balladService: BalladService, private storyService: StoryService,
    private utilityService: UtilityService, public dialog: MatDialog, private deploymentService: DeploymentService,
    private versionControlService: VersionControlService, private codeCreationService: CodeCreationService,
    private codeRedemptionService: CodeRedemptionService, private patreonAccessService: PatreonAccessService) { }

  ngOnInit(): void {
    if (this.deploymentService.codeCreationMode)
      console.log(this.globalService.globalVar);
    //console.log(JSON.stringify(this.globalService.globalVar));
    
    this.patreonAccessService.getPatronList();

    if (this.deploymentService.codeCreationMode)
      console.log(this.codeCreationService.createCode());

    var storyStyle = this.globalService.globalVar.settings.get("storyStyle");
    if (storyStyle === undefined)
      this.storyStyle = StoryStyleSettingEnum.Medium;
    else
      this.storyStyle = storyStyle;

    this.quickViewOverlayFlipped = this.globalService.globalVar.settings.get("quickViewOverlayFlipped") ?? false;
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
      }
    }
  }

  public SaveGameToFile() {
    var globalData = JSON.stringify(this.globalService.globalVar);
    var compressedData = LZString.compressToBase64(globalData);

    let file = new Blob([compressedData], { type: '.txt' });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "BalladOfHeroes-v" + "-" + new Date().toLocaleDateString();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  public LoadGameFromFile() {
    if (this.file === null || this.file === undefined || this.file.length === 0)
      alert("First select a file to import.");

    if (confirm("This will overwrite your existing game data. Continue?")) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        var decompressedData = LZString.decompressFromBase64(fileReader.result);
        var loadDataJson = <GlobalVariables>JSON.parse(decompressedData);
        if (loadDataJson !== null && loadDataJson !== undefined) {
          this.globalService.globalVar = plainToInstance(GlobalVariables, loadDataJson);
          this.versionControlService.updatePlayerVersion();

          this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
          this.storyService.showStory = false;
          this.globalService.globalVar.isBattlePaused = false;
          //console.log(this.globalService.globalVar);
        }
      }
      fileReader.readAsText(this.file);
    }
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

  openKeybinds(content: any) {
    if (this.isMobile)
      this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
    else
      this.dialog.open(content, { width: '75%', maxHeight: '75%', minHeight: '50%', id: 'dialogNoPadding' });
  }

  enterRedemptionCode() {
    this.codeRedemptionService.redeemCode(this.enteredRedemptionCode);
  }

  quickViewOverlayFlippedToggle() {
    this.globalService.globalVar.settings.set("quickViewOverlayFlipped", this.quickViewOverlayFlipped);
  }
}
