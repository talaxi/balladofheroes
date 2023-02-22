import { Component, OnInit } from '@angular/core';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-chthonic-reset-menu-view',
  templateUrl: './chthonic-reset-menu-view.component.html',
  styleUrls: ['./chthonic-reset-menu-view.component.css']
})
export class ChthonicResetMenuViewComponent implements OnInit {

  availableGods: God[];

  constructor(public globalService: GlobalService, public lookupService: LookupService, private utilityService: UtilityService) { }

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

    return this.utilityService.roundTo((((god.level-1) / 2) + multiLevelBoost) * (1 + chthonicFavorMultiplier), 2);
  }

  getChthonicFavor(god: God)
  {
    //gives a linear small amount
    return this.utilityService.roundTo((god.level-1) / 20, 2);
  }

  resetGod(god: God)
  {
    var powerGain = this.getChthonicPower(god);
    var favorGain = this.getChthonicFavor(god);

    if (this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked)
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicFavor, ItemTypeEnum.Progression, favorGain));
        
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, ItemTypeEnum.Progression, powerGain));

    god.level = 1;
    god.exp = 0;
    god.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);    
    god.lastStatGain = CharacterStatEnum.Resistance;
    god.statGainCount = 0;
    god.expToNextLevel = 200;
    var isAbility2Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.isAbilityPermanent;
    var isAbility3Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.isAbilityPermanent;
    var isPassivePermanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.isAbilityPermanent;
    this.globalService.assignGodAbilityInfo(god);

    if (isAbility2Permanent)
    {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
      if (newAbility !== undefined)
        newAbility.isAvailable = true;
    }

    if (isAbility3Permanent)
    {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
      if (newAbility !== undefined)
        newAbility.isAvailable = true;
    }

    if (isPassivePermanent)
    {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
      if (newAbility !== undefined)
        newAbility.isAvailable = true;
    }

    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel)
        ability.isAvailable = true;
    });

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      this.globalService.calculateCharacterBattleStats(member, false);
    });    
  }
}
