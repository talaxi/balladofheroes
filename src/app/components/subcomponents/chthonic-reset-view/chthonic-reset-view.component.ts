import { Component, OnInit } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-chthonic-reset-view',
  templateUrl: './chthonic-reset-view.component.html',
  styleUrls: ['./chthonic-reset-view.component.css']
})
export class ChthonicResetViewComponent implements OnInit {
  isDisplayingResetView = true;
  showNotificationIcon = false;
  subscription: any;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      var chthonicPowers = this.globalService.globalVar.chthonicPowers;
      if (this.lookupService.getResourceAmount(ItemsEnum.ChthonicPower) && (chthonicPowers.agilityBoostLevel === 0 && chthonicPowers.maxHpBoostLevel === 0 && chthonicPowers.attackBoostLevel === 0 &&
        chthonicPowers.luckBoostLevel === 0 && chthonicPowers.resistanceBoostLevel === 0 && chthonicPowers.defenseBoostLevel === 0))
        this.showNotificationIcon = true;
    });
  }

  toggleView() {
    this.isDisplayingResetView = !this.isDisplayingResetView;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
