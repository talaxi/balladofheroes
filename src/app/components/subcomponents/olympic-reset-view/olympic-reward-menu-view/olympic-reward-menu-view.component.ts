import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';

@Component({
  selector: 'app-olympic-reward-menu-view',
  templateUrl: './olympic-reward-menu-view.component.html',
  styleUrls: ['./olympic-reward-menu-view.component.css']
})
export class OlympicRewardMenuViewComponent {
  shopItems: ShopItem[];  
  shopItemRows: ShopItem[][];
  shopItemCells: ShopItem[];
  
  equipmentItems: ShopItem[];  
  equipmentItemRows: ShopItem[][];
  equipmentItemCells: ShopItem[];

  constructor(private subzoneGeneratorService: SubZoneGeneratorService, private deviceDetectorService: DeviceDetectorService, private lookupService: LookupService,
    private globalService: GlobalService) {
    
  }

  ngOnInit() {
    var allItems = this.subzoneGeneratorService.getAvailableOlympianRewardOptions(this.globalService.globalVar.resources, this.globalService.globalVar.isSubscriber, this.globalService.globalVar.gods);
    this.equipmentItems = allItems.filter(item => this.lookupService.getItemTypeFromItemEnum(item.shopItem) === ItemTypeEnum.Equipment);
    this.shopItems = allItems.filter(item => this.lookupService.getItemTypeFromItemEnum(item.shopItem) !== ItemTypeEnum.Equipment);
    this.setupDisplayShopItems();
    this.setupDisplayEquipmentItems();
  }

  setupDisplayShopItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= filteredItems.length; i++) {
      this.shopItemCells.push(filteredItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.shopItemRows.push(this.shopItemCells);
        this.shopItemCells = [];
      }
    }

    if (this.shopItemCells.length !== 0)
      this.shopItemRows.push(this.shopItemCells);
  }

  
  getShopItemTooltipDirection(index: number) {
    if (index % 4 === 0)
      return DirectionEnum.Right;
    else if (index % 4 === 1)
      return DirectionEnum.Right;
      else if (index % 4 === 2)
      return DirectionEnum.Left;
      else if (index % 4 === 3)
      return DirectionEnum.Left;

      return DirectionEnum.Right;
  }

  setupDisplayEquipmentItems(): void {
    this.equipmentItemCells = [];
    this.equipmentItemRows = [];

    var filteredItems = this.filterItems(this.equipmentItems);

    var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;

    for (var i = 1; i <= filteredItems.length; i++) {
      this.equipmentItemCells.push(filteredItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.equipmentItemRows.push(this.equipmentItemCells);
        this.equipmentItemCells = [];
      }
    }

    if (this.equipmentItemCells.length !== 0)
      this.equipmentItemRows.push(this.equipmentItemCells);
  }

  filterItems(shopItems: ShopItem[])
  {
    return shopItems;
  }
}
