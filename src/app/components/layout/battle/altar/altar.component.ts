import { Component, OnInit } from '@angular/core';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { Character } from 'src/app/models/character/character.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { AltarService } from 'src/app/services/altar/altar.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-altar',
  templateUrl: './altar.component.html',
  styleUrls: ['./altar.component.css']
})
export class AltarComponent implements OnInit {
  altar: AltarInfo;
  buttonOptions: AltarPrayOptionsEnum[] = [];

  constructor(private globalService: GlobalService, private altarService: AltarService, private lookupService: LookupService,
    private battleService: BattleService) { }

  ngOnInit(): void {
    if (this.globalService.globalVar.activeBattle.selectedAltar !== undefined)
    {
      this.altar = this.globalService.globalVar.activeBattle.selectedAltar;
      this.buttonOptions = this.altarService.getButtonOptions(this.altar);
    }
  }

  displayAltarText() {
    //var text = "You come across an altar to " + this.lookupService.getGodNameByType(this.altar.god) + " on your journey and take a moment to pray.";
    var text = "Honor Asclepius by leaving healing items at the altar.";
    return text;
  }

  targetAltarWithItem() {
    var isTargeted = false;

    if (!this.battleService.targetbattleItemMode || this.battleService.battleItemInUse === undefined ||
       this.battleService.battleItemInUse === ItemsEnum.None) {
      return isTargeted;
    }

    var itemType = this.lookupService.getItemTypeFromItemEnum(this.battleService.battleItemInUse);
    if (itemType === ItemTypeEnum.None) {
      console.log("Error getting item type from item");      
      return isTargeted;
    }

    if (itemType !== ItemTypeEnum.HealingItem) {      
        return isTargeted;
    }

    if (this.battleService.targetbattleItemMode)
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnAltar() {
    if (this.targetAltarWithItem())
      this.battleService.useBattleItemOnCharacter(this.globalService.globalVar.altarOfAsclepus, this.globalService.getActivePartyCharacters(true));
  }

  getAsclepiusHp() {
    return (this.globalService.globalVar.altarOfAsclepus.battleStats.currentHp / this.globalService.globalVar.altarOfAsclepus.battleStats.maxHp) * 100;
  }
}
