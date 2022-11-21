import { Component, Input, OnInit } from '@angular/core';
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
    this.getEquipmentStats();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.getEquipmentStats();
    });
  }

  getEquipmentStats() {
    if (this.equipment === undefined)
      return;
    this.equipmentStats = "";

    if (this.equipment.stats.attack > 0)
      this.equipmentStats += "+" + this.equipment.stats.attack.toString() + " Attack<br />";
    if (this.equipment.stats.defense > 0)
      this.equipmentStats += "+" + this.equipment.stats.defense + " Defense<br />";
    if (this.equipment.stats.maxHp > 0)
      this.equipmentStats += "+" + this.equipment.stats.maxHp + " Max HP<br />";
    if (this.equipment.stats.agility > 0)
      this.equipmentStats += "+" + this.equipment.stats.agility + " Agility<br />";
    if (this.equipment.stats.luck > 0)
      this.equipmentStats += "+" + this.equipment.stats.luck + " Luck<br />";
      if (this.equipment.stats.resistance > 0)
      this.equipmentStats += "+" + this.equipment.stats.resistance + " Luck<br />";

    this.equipmentStats = this.utilityService.getSanitizedHtml(this.equipmentStats);
  }
}
