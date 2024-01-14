import { Component } from '@angular/core';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-calculator-overview',
  templateUrl: './calculator-overview.component.html',
  styleUrls: ['./calculator-overview.component.css']
})
export class CalculatorOverviewComponent {
  constructor(private utilityService: UtilityService, private dpsCalculatorService: DpsCalculatorService, private globalService: GlobalService) {

  }
  
  getPartyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculatePartyDps();

    return this.utilityService.bigNumberReducer(Math.round(dps));
  }

  getEnemyDps() {
    var dps = 0;

    dps = this.dpsCalculatorService.calculateEnemyDps();

    return this.utilityService.bigNumberReducer(Math.round(dps));
  }

  getXps() {
    var xps = 0;

    xps = this.dpsCalculatorService.calculateXps();

    return this.utilityService.bigNumberReducer(Math.round(xps));
  }

  characterDpsBreakdown(which: number) {
    var party = this.globalService.getActivePartyCharacters(false);
    var character = party[which];

    var breakdown = this.dpsCalculatorService.getCharacterDps(character.type);
    var percent = this.dpsCalculatorService.getCharacterDpsPercent(character.type);

    return "<span class='bold smallCaps " + character.name.toLowerCase() + "Color'>" + character.name + ":</span> " + this.utilityService.bigNumberReducer(breakdown) + " (" + this.utilityService.roundTo(percent * 100, 1) + "%)";
  }

  godDpsBreakdown(whichCharacter: number, whichGod: number) {
    var party = this.globalService.getActivePartyCharacters(false);
    var character = party[whichCharacter];
    var godEnum = GodEnum.None;

    if (whichGod === 1)
      godEnum = character.assignedGod1;
    else if (whichGod === 2)
      godEnum = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === godEnum);
    if (god === undefined)
      return "";

    var breakdown = this.dpsCalculatorService.getGodDps(godEnum);
    //var percent = this.dpsCalculatorService.getGodDpsPercent(godEnum);

    return "<span class='bold smallCaps " + god.name.toLowerCase() + "Color'>" + god.name + ":</span> " + this.utilityService.bigNumberReducer(breakdown);
  }

}
