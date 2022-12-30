import { Component, OnInit } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-chthonic-reset-menu-view',
  templateUrl: './chthonic-reset-menu-view.component.html',
  styleUrls: ['./chthonic-reset-menu-view.component.css']
})
export class ChthonicResetMenuViewComponent implements OnInit {

  availableGods: God[];

  constructor(private globalService: GlobalService, public lookupService: LookupService) { }

  ngOnInit(): void {
    this.availableGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
  }

  getChthonicPower(god: God)
  {
    //should give slightly more per level and also have a multiplier from favor
    var chthonicFavorMultiplier = this.lookupService.getChthonicFavorMultiplier();
    
    //give more for more levels at once so that there isn't a benefit in coming back every single level to stack favor
    var multiLevelBoost = 0;
    if (god.level > 2)
    {
      multiLevelBoost = (god.level - 2) * .1;
    }

    return ((god.level-1) + multiLevelBoost) * (1 + chthonicFavorMultiplier);
  }

  getChthonicFavor(god: God)
  {
    //gives a linear small amount
    return (god.level-1) / 20;
  }

  resetGod(god: God)
  {
    var powerGain = this.getChthonicPower(god);
    var favorGain = this.getChthonicFavor(god);

    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicFavor, ItemTypeEnum.Progression, favorGain));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, ItemTypeEnum.Progression, powerGain));

    god.level = 1;
    god.exp = 0;
    god.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);    
    god.lastStatGain = CharacterStatEnum.Resistance;
    god.expToNextLevel = 200;
    //reset god abilities

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member);
    });    
  }
}
