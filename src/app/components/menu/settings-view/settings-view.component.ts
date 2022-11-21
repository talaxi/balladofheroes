import { Component, OnInit } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';
import { GlobalService } from 'src/app/services/global/global.service';
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

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  public SaveGame() {
    var globalData = JSON.stringify(this.globalService.globalVar);
    console.log(globalData);
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
        //this.versionControlService.updatePlayerVersion(); //TODO
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
    a.download = "Cultura-v" + this.globalService.globalVar.currentVersion.toString().replace(".", "_") + "-" + new Date().toLocaleDateString();
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
          //this.versionControlService.updatePlayerVersion(); //TODO
        }
      }
      fileReader.readAsText(this.file);
    }
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
