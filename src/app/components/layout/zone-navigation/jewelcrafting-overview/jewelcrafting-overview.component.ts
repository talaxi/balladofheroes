import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { JewelcraftingService } from 'src/app/services/professions/jewelcrafting.service';
import { ProfessionService } from 'src/app/services/professions/profession.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-jewelcrafting-overview',
  templateUrl: './jewelcrafting-overview.component.html',
  styleUrls: ['./jewelcrafting-overview.component.css']
})
export class JewelcraftingOverviewComponent {
  @Input() expandedView = false;
  jewelcrafting: Profession | undefined;
  
  constructor(private deviceDetectorService: DeviceDetectorService, private lookupService: LookupService,
    private globalService: GlobalService, private jewelcraftingService: JewelcraftingService, public dialog: MatDialog,
    private utilityService: UtilityService, private professionService: ProfessionService, private dictionaryService: DictionaryService) {
  
  }
  
  ngOnInit() {
    this.jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
  }
  
  notLowPerformanceMode() {
    return this.globalService.globalVar.settings.get("fps") === undefined || this.globalService.globalVar.settings.get("fps") !== this.utilityService.lowFps;
  }
  
  openProfession(content: any) {
      if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '90%' });
    else 
      this.dialog.open(content, { width: '80%', minHeight: '75vh', maxHeight: '83%', id: 'dialogNoPadding' });
    }
  
    getCreatingRecipeName() {
      if (this.jewelcrafting !== undefined && this.jewelcrafting.creatingRecipe !== undefined)
        return this.dictionaryService.getItemName(this.jewelcrafting.creatingRecipe.createdItem);
  
      return "";
    }
  
    creatingRecipe() {
      return this.jewelcrafting !== undefined && this.jewelcrafting.creatingRecipe !== undefined;
    }
  
    getStepProgress() {
      if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
        return 0;
      var totalLength = 0;
      var passedTime = 0;
  
      for (var i = 0; i < this.jewelcrafting.creatingRecipe.steps.length; i++) {
        var durationHalved = 1;
        if (this.jewelcrafting.isDurationHalved)
          durationHalved = .5;

        var actionLength = this.jewelcraftingService.getActionLength(this.jewelcrafting.creatingRecipe.steps[i]) * durationHalved * this.professionService.getDurationReduction(this.jewelcrafting.type, this.jewelcrafting.creatingRecipe.quality);
        totalLength += actionLength;
  
        if (this.jewelcrafting.creationStep > i + 1) {
          passedTime += actionLength;
        }
      }
  
      passedTime += this.jewelcrafting.creationTimer;
      return (passedTime / totalLength) * 100;
      //return (this.jewelcrafting.jewelcraftingTimer / this.jewelcrafting.jewelcraftingTimerLength) * 100;
    }
  
    getRecipeStepName() {
      if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
        return "";
      return this.lookupService.getAlchemyActionName(this.jewelcrafting.creatingRecipe.steps[this.jewelcrafting.creationStep - 1]);
    }
  
    getTimeRemaining() {
      if (this.jewelcrafting === undefined || this.jewelcrafting.creatingRecipe === undefined)
        return "";
  
      var timeRemaining = this.jewelcrafting.creationTimerLength - this.jewelcrafting.creationTimer;
  
      for (var i = this.jewelcrafting.creationStep + 1; i <= this.jewelcrafting.creatingRecipe.numberOfSteps; i++) {
        var step = this.jewelcrafting.creatingRecipe.steps[i - 1];        
        var durationHalved = 1;
        if (this.jewelcrafting.isDurationHalved)
          durationHalved = .5;
        timeRemaining += this.jewelcraftingService.getActionLength(step) * durationHalved * this.professionService.getDurationReduction(this.jewelcrafting.type, this.jewelcrafting.creatingRecipe.quality);
      }
  
      if (timeRemaining > 60 * 60)
        return this.utilityService.convertSecondsToHHMMSS(timeRemaining);
  
      return this.utilityService.convertSecondsToMMSS(timeRemaining);
    }
  
    getTotalAmountToCreate() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.creationCreateAmount;
    }
  
    getAmountCreated() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.creationCurrentAmountCreated;
    }
  
    atMaxLevel() {
      if (this.jewelcrafting === undefined)
        return false;
      return this.jewelcrafting.level >= this.jewelcrafting.maxLevel;
    }
  
    getLevel() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.level;
    }
    
    getMaxLevel() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.maxLevel;
    }
  
    getExp() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.exp;
    }
  
    getExpToNextLevel() {
      if (this.jewelcrafting === undefined)
        return 0;
      return this.jewelcrafting.expToNextLevel;
    }
}
