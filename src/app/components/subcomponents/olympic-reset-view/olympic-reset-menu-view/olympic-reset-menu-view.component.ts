import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-olympic-reset-menu-view',
  templateUrl: './olympic-reset-menu-view.component.html',
  styleUrls: ['./olympic-reset-menu-view.component.css']
})
export class OlympicResetMenuViewComponent {
  availableCharacters: Character[];
  availableGods: God[];
  bonusGod: GodEnum = GodEnum.None;
  godEnum = GodEnum;
  bonusGodText = "";
  bonusGodName: string;
  isMobile: boolean = false;

  constructor(public globalService: GlobalService, public lookupService: LookupService, private utilityService: UtilityService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.availableCharacters = this.globalService.globalVar.characters.filter(item => item.isAvailable);
    this.availableGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
  }

  getChthonicPower(god: God) {
    //should give slightly more per level and also have a multiplier from favor
    var chthonicFavorMultiplier = this.lookupService.getChthonicFavorMultiplier();
    var preferredGodBoost = 1;

    //give more for more levels at once so that there isn't a benefit in coming back every single level to stack favor
    var multiLevelBoost = 0;
    if (god.level > 2) {
      multiLevelBoost = (god.level - 2) * .1;
    }

    if (god.type === this.globalService.globalVar.chthonicPowers.preferredGod) {
      preferredGodBoost = 1.25;
    }

    return this.utilityService.roundTo((((god.level - 1) / 2) + multiLevelBoost) * (1 + chthonicFavorMultiplier) * preferredGodBoost, 2);
  }

  getAmbrosiaGain() {
    
  }

  resetCharacters(god: God) {
    /*var powerGain = this.getChthonicPower(god);
    var favorGain = this.getChthonicFavor(god);

    if (this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked)
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicFavor, favorGain));

    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, powerGain));

    var originalLevel = god.level;
    god.level = 1;
    god.exp = 0;
    god.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
    god.lastStatGain = CharacterStatEnum.Resistance;
    god.statGainCount = 0;
    god.expToNextLevel = 200;
    var isAbility2Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.isPermanent;
    var isAbility3Permanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.isPermanent;
    var isPassivePermanent = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.isPermanent;
    this.globalService.assignGodAbilityInfo(god);

    if (isAbility2Permanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    if (isAbility3Permanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    if (isPassivePermanent) {
      var newAbility = god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel);
      if (newAbility !== undefined) {
        newAbility.isAvailable = true;
        newAbility.isPermanent = true;
      }
    }

    god.abilityList.forEach(ability => {
      if (god.level >= ability.requiredLevel)
        ability.isAvailable = true;
    });

    var resetRetainAmount = this.globalService.globalVar.chthonicPowers.getRetainGodLevelPercent();
    if (resetRetainAmount > 0) {
      var godLevel = Math.floor(originalLevel * resetRetainAmount);
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(god, true);
      }
      god.exp = 0;
    }

    this.globalService.getActivePartyCharacters(true).forEach(member => {      
    if (god.type === GodEnum.Hades) {
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.LordOfTheUnderworld);
    }

      this.globalService.calculateCharacterBattleStats(member, false);
    });*/
  }
}
