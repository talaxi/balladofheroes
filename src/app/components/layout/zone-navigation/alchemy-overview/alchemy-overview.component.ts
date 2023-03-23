import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-alchemy-overview',
  templateUrl: './alchemy-overview.component.html',
  styleUrls: ['./alchemy-overview.component.css']
})
export class AlchemyOverviewComponent {

constructor(private deviceDetectorService: DeviceDetectorService, private lookupService: LookupService,
  private globalService: GlobalService, private alchemyService: AlchemyService, public dialog: MatDialog,
  private utilityService: UtilityService) {

}

openAlchemy(content: any) {
    if (this.deviceDetectorService.isMobile())
    this.dialog.open(content, { width: '95%', height: '80%' });
  else 
    this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });
  }

  getCreatingRecipeName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe !== undefined)
      return this.lookupService.getItemName(this.globalService.globalVar.alchemy.creatingRecipe.createdItem);

    return "";
  }

  creatingRecipe() {
    return this.globalService.globalVar.alchemy.creatingRecipe !== undefined;
  }

  getStepProgress() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return 0;
    var totalLength = 0;
    var passedTime = 0;

    for (var i = 0; i < this.globalService.globalVar.alchemy.creatingRecipe.steps.length; i++) {
      var actionLength = this.alchemyService.getActionLength(this.globalService.globalVar.alchemy.creatingRecipe.steps[i]) * this.alchemyService.getDurationReduction(this.globalService.globalVar.alchemy.creatingRecipe.quality);
      totalLength += actionLength;

      if (this.globalService.globalVar.alchemy.alchemyStep > i + 1) {
        passedTime += actionLength;
      }
    }

    passedTime += this.globalService.globalVar.alchemy.alchemyTimer;
    return (passedTime / totalLength) * 100;
    //return (this.globalService.globalVar.alchemy.alchemyTimer / this.globalService.globalVar.alchemy.alchemyTimerLength) * 100;
  }

  getRecipeStepName() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";
    return this.lookupService.getAlchemyActionName(this.globalService.globalVar.alchemy.creatingRecipe.steps[this.globalService.globalVar.alchemy.alchemyStep - 1]);
  }

  getTimeRemaining() {
    if (this.globalService.globalVar.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.globalService.globalVar.alchemy.alchemyTimerLength - this.globalService.globalVar.alchemy.alchemyTimer;

    for (var i = this.globalService.globalVar.alchemy.alchemyStep + 1; i <= this.globalService.globalVar.alchemy.creatingRecipe.numberOfSteps; i++) {
      var step = this.globalService.globalVar.alchemy.creatingRecipe.steps[i - 1];
      timeRemaining += this.alchemyService.getActionLength(step) * this.alchemyService.getDurationReduction(this.globalService.globalVar.alchemy.creatingRecipe.quality);
    }

    if (timeRemaining > 60 * 60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  getTotalAmountToCreate() {
    return this.globalService.globalVar.alchemy.alchemyCreateAmount;
  }

  getAmountCreated() {
    return this.globalService.globalVar.alchemy.alchemyCurrentAmountCreated;
  }
}
