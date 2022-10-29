import { Component, Input, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-equipment-item-view',
  templateUrl: './equipment-item-view.component.html',
  styleUrls: ['./equipment-item-view.component.css']
})
export class EquipmentItemViewComponent implements OnInit {
  @Input() equipment: Equipment | undefined;

  constructor(public lookupService: LookupService) { }

  ngOnInit(): void {
  }

}
