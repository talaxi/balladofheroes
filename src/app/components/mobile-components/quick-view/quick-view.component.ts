import { Component } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
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
  trackedResourcesColumn1: ItemsEnum[] = [];
  trackedResourcesColumn2: ItemsEnum[] = [];

  displayQuickViewOverview: boolean;
  displayQuickViewResources: boolean;
  displayQuickViewGameText: boolean;
  displayQuickViewItemBelt: boolean;
  displayQuickViewAltars: boolean;
  displayQuickViewAlchemy: boolean;
  displayQuickViewJewelcrafting: boolean;  
  displayQuickViewCalculators: boolean;
  displayQuickViewTimeFragment: boolean;

  constructor(private balladService: BalladService, public globalService: GlobalService, private gameLoopService: GameLoopService,
    private battleService: BattleService, private lookupService: LookupService) {

  }

  ngOnInit(): void {
    this.displayQuickViewOverview = this.globalService.globalVar.settings.get("displayQuickViewOverview") ?? false;
    this.displayQuickViewResources = this.globalService.globalVar.settings.get("displayQuickViewResources") ?? false;
    this.displayQuickViewGameText = this.globalService.globalVar.settings.get("displayQuickViewGameText") ?? false;
    this.displayQuickViewItemBelt = this.globalService.globalVar.settings.get("displayQuickViewItemBelt") ?? false;
    this.displayQuickViewAltars = this.globalService.globalVar.settings.get("displayQuickViewAltars") ?? false;
    this.displayQuickViewAlchemy = this.globalService.globalVar.settings.get("displayQuickViewAlchemy") ?? false;
    this.displayQuickViewJewelcrafting = this.globalService.globalVar.settings.get("displayQuickViewJewelcrafting") ?? false;
    this.displayQuickViewCalculators = this.globalService.globalVar.settings.get("displayQuickViewCalculators") ?? false;
    this.displayQuickViewTimeFragment = this.globalService.globalVar.settings.get("displayQuickViewTimeFragment") ?? false;

    this.trackedResourcesColumn1 = this.globalService.globalVar.trackedResources.slice(0, 5);
    if (this.globalService.globalVar.trackedResources.length > 5)
      this.trackedResourcesColumn2 = this.globalService.globalVar.trackedResources.slice(5, 10);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      var activeSubzone = this.balladService.getActiveSubZone();

      var flippedOverlay = this.globalService.globalVar.settings.get("quickViewOverlayFlipped") ?? false;

      if (flippedOverlay) {
        if (this.battleService.targetbattleItemMode && !this.itemTargetsAllies(this.lookupService.getItemTypeFromItemEnum(this.battleService.battleItemInUse)))
        this.overlayShouldFlip = false;
      else if (activeSubzone !== undefined && activeSubzone.type !== SubZoneEnum.CalydonAltarOfAsclepius)
        this.overlayShouldFlip = true;
      }
      else {
        if (this.battleService.targetbattleItemMode && this.itemTargetsAllies(this.lookupService.getItemTypeFromItemEnum(this.battleService.battleItemInUse)) &&
        activeSubzone !== undefined && activeSubzone.type !== SubZoneEnum.CalydonAltarOfAsclepius)
          this.overlayShouldFlip = true;
        else
          this.overlayShouldFlip = false;
      }
    });
  }

  itemTargetsAllies(itemType: ItemTypeEnum) {
    if (itemType === ItemTypeEnum.HealingItem || itemType === ItemTypeEnum.Toxin || itemType === ItemTypeEnum.Elixir)
      return true;

    return false;
  }

  isAlchemyAvailable() {
    var isAvailable = false;
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return isAvailable;

    return alchemy.isUnlocked;
  }

  isJewelcraftingAvailable() {
    var isAvailable = false;
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (alchemy === undefined)
      return isAvailable;

    return alchemy.isUnlocked;
  }

  areAltarsAvailable() {
    return this.globalService.globalVar.altars.isUnlocked;
  }

  isQuickViewAvailable() {
    return this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AigosthenaBay);
  }

  isTimeFragmentAvailable() {
    return this.globalService.globalVar.resources.some(item => item.item === ItemsEnum.TimeFragment);
  }

  openQuickView(type: QuickViewEnum) {
    if (this.quickView === type)
      this.quickView = QuickViewEnum.None;
    else
      this.quickView = type;

    if (type === QuickViewEnum.Altars)
      this.globalService.globalVar.altars.showNewNotification = false;
  }

  preventRightClick() {
    return false;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
