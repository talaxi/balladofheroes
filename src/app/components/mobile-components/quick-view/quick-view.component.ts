import { Component } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent {
  townsAvailable = false;
  quickView: QuickViewEnum = QuickViewEnum.None;
  quickViewEnum = QuickViewEnum;
  quickLinksUnlocked = true;
  overlayShouldFlip = false;
  subscription: any;

  constructor(private balladService: BalladService, public globalService: GlobalService, private gameLoopService: GameLoopService,
    private battleService: BattleService, private lookupService: LookupService) {
    
  }

  ngOnInit(): void {    
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.battleService.targetbattleItemMode && this.itemTargetsAllies(this.lookupService.getItemTypeFromItemEnum(this.battleService.battleItemInUse)))
        this.overlayShouldFlip = true;
      else
        this.overlayShouldFlip = false;
    });
  }

  itemTargetsAllies(itemType: ItemTypeEnum) {
    if (itemType === ItemTypeEnum.HealingItem || itemType === ItemTypeEnum.Toxin || itemType === ItemTypeEnum.Elixir)
      return true;

    return false;
  }

  getTotalAmountToCreate() {
    return this.globalService.globalVar.alchemy.alchemyCreateAmount;
  }

  getAmountCreated() {
    return this.globalService.globalVar.alchemy.alchemyCurrentAmountCreated;
  }

  isAlchemyAvailable() {
    return this.globalService.globalVar.alchemy.isUnlocked;
  }

  areAltarsAvailable() {
    return this.globalService.globalVar.altars.isUnlocked;
  }

  openQuickView(type: QuickViewEnum) {
    if (this.quickView === type)
      this.quickView = QuickViewEnum.None;
    else
      this.quickView = type;

    if (type === QuickViewEnum.Altars)
      this.globalService.globalVar.altars.showNewNotification = false;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
