import { Component } from '@angular/core';
import { DpsCalculatorService } from 'src/app/services/battle/dps-calculator.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-calculator-overview',
  templateUrl: './calculator-overview.component.html',
  styleUrls: ['./calculator-overview.component.css']
})
export class CalculatorOverviewComponent {
  constructor(private utilityService: UtilityService, private dpsCalculatorService: DpsCalculatorService) {

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

}
