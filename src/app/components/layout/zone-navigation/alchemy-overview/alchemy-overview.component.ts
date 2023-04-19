import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { AlchemyService } from 'src/app/services/professions/alchemy.service';
import { ProfessionService } from 'src/app/services/professions/profession.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-alchemy-overview',
  templateUrl: './alchemy-overview.component.html',
  styleUrls: ['./alchemy-overview.component.css']
})
export class AlchemyOverviewComponent {
@Input() expandedView = false;
alchemy: Profession | undefined;

constructor(private deviceDetectorService: DeviceDetectorService, private lookupService: LookupService,
  private globalService: GlobalService, private alchemyService: AlchemyService, public dialog: MatDialog,
  private utilityService: UtilityService, private professionService: ProfessionService, private dictionaryService: DictionaryService) {

}

ngOnInit() {
  this.alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
}

openAlchemy(content: any) {
    if (this.deviceDetectorService.isMobile())
    this.dialog.open(content, { width: '95%', height: '80%' });
  else 
    this.dialog.open(content, { width: '75%', maxHeight: '75%', id: 'dialogNoPadding' });
  }

  getCreatingRecipeName() {
    if (this.alchemy !== undefined && this.alchemy.creatingRecipe !== undefined)
      return this.dictionaryService.getItemName(this.alchemy.creatingRecipe.createdItem);

    return "";
  }

  creatingRecipe() {
    return this.alchemy !== undefined && this.alchemy.creatingRecipe !== undefined;
  }

  getStepProgress() {
    if (this.alchemy === undefined || this.alchemy.creatingRecipe === undefined)
      return 0;
    var totalLength = 0;
    var passedTime = 0;

    for (var i = 0; i < this.alchemy.creatingRecipe.steps.length; i++) {
      var actionLength = this.alchemyService.getActionLength(this.alchemy.creatingRecipe.steps[i]) * this.professionService.getDurationReduction(this.alchemy.type, this.alchemy.creatingRecipe.quality);
      totalLength += actionLength;

      if (this.alchemy.creationStep > i + 1) {
        passedTime += actionLength;
      }
    }

    passedTime += this.alchemy.creationTimer;
    return (passedTime / totalLength) * 100;
    //return (this.alchemy.alchemyTimer / this.alchemy.alchemyTimerLength) * 100;
  }

  getRecipeStepName() {
    if (this.alchemy === undefined || this.alchemy.creatingRecipe === undefined)
      return "";
    return this.lookupService.getAlchemyActionName(this.alchemy.creatingRecipe.steps[this.alchemy.creationStep - 1]);
  }

  getTimeRemaining() {
    if (this.alchemy === undefined || this.alchemy.creatingRecipe === undefined)
      return "";

    var timeRemaining = this.alchemy.creationTimerLength - this.alchemy.creationTimer;

    for (var i = this.alchemy.creationStep + 1; i <= this.alchemy.creatingRecipe.numberOfSteps; i++) {
      var step = this.alchemy.creatingRecipe.steps[i - 1];
      timeRemaining += this.alchemyService.getActionLength(step) * this.professionService.getDurationReduction(this.alchemy.type, this.alchemy.creatingRecipe.quality);
    }

    if (timeRemaining > 60 * 60)
      return this.utilityService.convertSecondsToHHMMSS(timeRemaining);

    return this.utilityService.convertSecondsToMMSS(timeRemaining);
  }

  getTotalAmountToCreate() {
    if (this.alchemy === undefined)
      return 0;
    return this.alchemy.creationCreateAmount;
  }

  getAmountCreated() {
    if (this.alchemy === undefined)
      return 0;
    return this.alchemy.creationCurrentAmountCreated;
  }

  atMaxLevel() {
    if (this.alchemy === undefined)
      return false;
    return this.alchemy.level >= this.alchemy.maxLevel;
  }

  getLevel() {
    if (this.alchemy === undefined)
      return 0;
    return this.alchemy.level;
  }

  getExp() {
    if (this.alchemy === undefined)
      return 0;
    return this.alchemy.exp;
  }

  getExpToNextLevel() {
    if (this.alchemy === undefined)
      return 0;
    return this.alchemy.expToNextLevel;
  }
}
