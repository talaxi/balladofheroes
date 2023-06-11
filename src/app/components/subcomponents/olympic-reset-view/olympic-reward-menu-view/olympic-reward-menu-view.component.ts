import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
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
  

  constructor(private subzoneGeneratorService: SubZoneGeneratorService, private deviceDetectorService: DeviceDetectorService) {
    
  }

  ngOnInit() {
    this.shopItems = this.subzoneGeneratorService.getAvailableOlympianRewardOptions();
    this.setupDisplayShopItems();
  }

  setupDisplayShopItems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    //this.shopItems = this.shopItems.filter(item => this.balladService.findSubzone(item.originalStore)?.isAvailable);
    //this.shopItems.sort((a, b) => this.sortFunction(a, b));

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

  filterItems(shopItems: ShopItem[])
  {
    return shopItems;
  }
}
