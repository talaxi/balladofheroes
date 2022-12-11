import { Component, Input, OnInit } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-equipment-item-view',
  templateUrl: './equipment-item-view.component.html',
  styleUrls: ['./equipment-item-view.component.css']
})
export class EquipmentItemViewComponent implements OnInit {
  @Input() equipment: Equipment | undefined;
  equipmentStats = "";
  subscription: any;

  constructor(public lookupService: LookupService, private utilityService: UtilityService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.equipmentStats = this.lookupService.getEquipmentStats(this.equipment);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.equipmentStats = this.lookupService.getEquipmentStats(this.equipment);
    });
  }

  getStars() {
    if (this.equipment?.quality === EquipmentQualityEnum.Basic)
      return "★";
    if (this.equipment?.quality === EquipmentQualityEnum.Uncommon)
      return "★★";
    if (this.equipment?.quality === EquipmentQualityEnum.Rare)
      return "★★★";
    if (this.equipment?.quality === EquipmentQualityEnum.Epic)
      return "★★★★";
    if (this.equipment?.quality === EquipmentQualityEnum.Special)
      return "★★★★★";
    if (this.equipment?.quality === EquipmentQualityEnum.Extraordinary)
      return "★★★★★★";
    if (this.equipment?.quality === EquipmentQualityEnum.Unique)
      return "★★★★★★★";

    return "";
  }
}
