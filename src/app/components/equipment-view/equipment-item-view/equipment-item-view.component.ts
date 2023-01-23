import { Component, Input, OnInit } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
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
  equipmentEffects = "";
  subscription: any;

  constructor(public lookupService: LookupService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.equipmentStats = this.lookupService.getEquipmentStats(this.equipment);
    this.equipmentEffects = this.lookupService.getEquipmentEffects(this.equipment);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.equipmentStats = this.lookupService.getEquipmentStats(this.equipment);
      this.equipmentEffects = this.lookupService.getEquipmentEffects(this.equipment);
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

  getEquipmentClass(item?: ItemsEnum) {
    if (item === undefined)
      item = this.equipment?.itemType;

    if (item === undefined)
      return "";

    var equipment = this.lookupService.getEquipmentPieceByItemType(item);
    if (equipment !== undefined)
    {
    var qualityClass = "s4Heading " + this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType));

    return qualityClass;
    }
    
    return "";
  }
}
