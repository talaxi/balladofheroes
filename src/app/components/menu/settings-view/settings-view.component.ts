import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { plainToInstance } from 'class-transformer';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { StoryService } from 'src/app/services/story/story.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
declare var LZString: any;

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {
  importExportValue: string;
  file: any;
  enteredRedemptionCode: string;

  constructor(private globalService: GlobalService, private balladService: BalladService, private storyService: StoryService,
    private utilityService: UtilityService, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.globalService.globalVar);
    console.log(JSON.stringify(this.globalService.globalVar));
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
        
        this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
        this.storyService.showStory = false;
        this.utilityService.isBattlePaused = false;
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

          this.globalService.globalVar.playerNavigation.currentSubzone = this.balladService.getActiveSubZone(true);
          this.storyService.showStory = false;
          this.utilityService.isBattlePaused = false;
          console.log(this.globalService.globalVar);
          //this.versionControlService.updatePlayerVersion(); //TODO
        }
      }
      fileReader.readAsText(this.file);
    }
  }

  openKeybinds(content: any) {    
      this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });    
  }

  enterRedemptionCode() {
    /*var wasSuccessful = this.codeRedemptionService.redeemCode(this.enteredRedemptionCode);

    if (wasSuccessful) {
      var items = this.codeRedemptionService.getCodeItems(this.enteredRedemptionCode);
      if (items !== undefined) {
        var itemList = "";
        items.forEach(item => itemList += item.amount + " " + item.name + ", ");
        itemList = itemList.replace(/,\s*$/, "")
        alert("You received: " + itemList);        
      }
    }*/
  }
}
