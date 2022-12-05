import { Component, Input, OnInit } from '@angular/core';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-shopping-item-view',
  templateUrl: './shopping-item-view.component.html',
  styleUrls: ['./shopping-item-view.component.css']
})
export class ShoppingItemViewComponent implements OnInit {
  @Input() item: ShopItem;

  constructor(public lookupService: LookupService) { }

  ngOnInit(): void {
  }
}
