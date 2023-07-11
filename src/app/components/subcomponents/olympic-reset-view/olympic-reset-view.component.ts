import { Component } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-olympic-reset-view',
  templateUrl: './olympic-reset-view.component.html',
  styleUrls: ['./olympic-reset-view.component.css']
})
export class OlympicResetViewComponent {
  isDisplayingResetView = true;
  showNotificationIcon = false;
  subscription: any;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    
  }

  toggleView() {
    this.isDisplayingResetView = !this.isDisplayingResetView;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
