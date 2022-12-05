import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.css']
})
export class ShopViewComponent implements OnInit {
  shopOptions: ShopOption[];
  
  shopItems: ShopItem[];
  shopItemRows: ShopItem[][];
  shopItemCells: ShopItem[];

  constructor(private subzoneGeneratorService: SubZoneGeneratorService, private balladService: BalladService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.shopOptions = this.subzoneGeneratorService.getShopOptions(this.balladService.getActiveSubZone().type);
  }

  getOptionText(type: ShopTypeEnum) {
    var text = "";

    if (type === ShopTypeEnum.General)
    {
      text = "General";
    }

    return text;
  }

  openShop(option: ShopOption, content: any) {    
    this.dialog.open(content, { width: '75%' });

  }

  
  setupDisplayShoptems(): void {
    this.shopItemCells = [];
    this.shopItemRows = [];

    var maxColumns = 4;
    
    for (var i = 1; i <= this.shopItems.length; i++) {
      this.shopItemCells.push(this.shopItems[i - 1]);
      if ((i % maxColumns) == 0) {
        this.shopItemRows.push(this.shopItemCells);
        this.shopItemCells = [];
      }
    }

    if (this.shopItemCells.length !== 0)
      this.shopItemRows.push(this.shopItemCells);
  }
}
