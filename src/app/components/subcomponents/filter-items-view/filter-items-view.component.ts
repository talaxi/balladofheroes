import { Component, Input } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-filter-items-view',
  templateUrl: './filter-items-view.component.html',
  styleUrls: ['./filter-items-view.component.css']
})
export class FilterItemsViewComponent {
  @Input() dialogRef: any;
  @Input() prefix: string;
  filterBasic: boolean;
  filterUncommon: boolean;
  filterRare: boolean;
  filterEpic: boolean;
  filterSpecial: boolean;
  filterExtraordinary: boolean;
  filterUnique: boolean;

  filterWeapons: boolean;
  filterShields: boolean;
  filterArmor: boolean;
  filterNecklaces: boolean;
  filterRings: boolean;

  filterEquipment: boolean;
  filterBattleItems: boolean;
  filterHealingItems: boolean;
  filterSlotItems: boolean;

  constructor(private globalService: GlobalService) {
  
  }

  ngOnInit() {
    this.filterBasic = this.globalService.globalVar.settings.get(this.prefix + "ShowBasicFilter") ?? true;
    this.filterUncommon = this.globalService.globalVar.settings.get(this.prefix + "ShowUncommonFilter") ?? true;
    this.filterRare = this.globalService.globalVar.settings.get(this.prefix + "ShowRareFilter") ?? true;
    this.filterEpic = this.globalService.globalVar.settings.get(this.prefix + "ShowEpicFilter") ?? true;
    this.filterSpecial = this.globalService.globalVar.settings.get(this.prefix + "ShowSpecialFilter") ?? true;
    this.filterExtraordinary = this.globalService.globalVar.settings.get(this.prefix + "ShowExtraordinaryFilter") ?? true;
    this.filterUnique = this.globalService.globalVar.settings.get(this.prefix + "ShowUniqueFilter") ?? true;

    this.filterWeapons = this.globalService.globalVar.settings.get(this.prefix + "ShowWeaponsFilter") ?? true;
    this.filterShields = this.globalService.globalVar.settings.get(this.prefix + "ShowShieldsFilter") ?? true;
    this.filterArmor = this.globalService.globalVar.settings.get(this.prefix + "ShowArmorFilter") ?? true;
    this.filterNecklaces = this.globalService.globalVar.settings.get(this.prefix + "ShowNecklacesFilter") ?? true;
    this.filterRings = this.globalService.globalVar.settings.get(this.prefix + "ShowRingsFilter") ?? true;

    this.filterEquipment = this.globalService.globalVar.settings.get(this.prefix + "ShowEquipmentFilter") ?? true;
    this.filterBattleItems = this.globalService.globalVar.settings.get(this.prefix + "ShowBattleItemsFilter") ?? true;
    this.filterHealingItems = this.globalService.globalVar.settings.get(this.prefix + "ShowHealingItemsFilter") ?? true;
    this.filterSlotItems = this.globalService.globalVar.settings.get(this.prefix + "ShowSlotItemsFilter") ?? true;
  }

  filterBasicToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowBasicFilter", this.filterBasic);
  }
  
  filterUncommonToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowUncommonFilter", this.filterUncommon);
  }
  
  filterRareToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowRareFilter", this.filterRare);
  }
  
  filterEpicToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowEpicFilter", this.filterEpic);
  }
  
  filterSpecialToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowSpecialFilter", this.filterSpecial);
  }
  
  filterExtraordinaryToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowExtraordinaryFilter", this.filterExtraordinary);
  }
  
  filterUniqueToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowUniqueFilter", this.filterUnique);
  }

  filterWeaponsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowWeaponsFilter", this.filterWeapons);
  }
  
  filterShieldsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowShieldsFilter", this.filterShields);
  }
  
  filterArmorToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowArmorFilter", this.filterArmor);
  }
  
  filterNecklacesToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowNecklacesFilter", this.filterNecklaces);
  }
  
  filterRingsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowRingsFilter", this.filterRings);
  }
  
  filterEquipmentToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowEquipmentFilter", this.filterEquipment);
  }

  filterBattleItemsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowBattleItemsFilter", this.filterBattleItems);
  }
  
  filterHealingItemsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowHealingItemsFilter", this.filterHealingItems);
  }
  
  filterSlotItemsToggle() {
    this.globalService.globalVar.settings.set(this.prefix + "ShowSlotItemsFilter", this.filterSlotItems);
  }
}
