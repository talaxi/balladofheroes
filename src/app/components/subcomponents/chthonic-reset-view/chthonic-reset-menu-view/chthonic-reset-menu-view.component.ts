import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
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
  bonusGod: GodEnum = GodEnum.None;
  godEnum = GodEnum;
  bonusGodText = "";
  bonusGodName: string;
  isMobile: boolean = false;

  constructor(public globalService: GlobalService, public lookupService: LookupService, private utilityService: UtilityService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.availableGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);

    if (this.globalService.globalVar.chthonicPowers.preferredGod !== GodEnum.None)    
      this.bonusGod = this.globalService.globalVar.chthonicPowers.preferredGod = this.lookupService.getPreferredGod();

    this.bonusGodName = this.globalService.globalVar.gods.find(item => item.type === this.bonusGod) !== undefined ? this.globalService.globalVar.gods.find(item => item.type === this.bonusGod)!.name : "";

    if (this.bonusGod === GodEnum.Athena) {
      this.bonusGodText = "Between you and me, I think Athena's the reason I'm here in the first place. One day you're fightin' in some war, the next day you're down here. Guess the other side was prayin' a little more. Well, guess it's never too late to start. Bring me a little favor from Athena.";
    }
    if (this.bonusGod === GodEnum.Artemis) {
      this.bonusGodText = "Look, I do <strong><i>not</i></strong> want to get on Artemis's bad side okay? The last guy I knew who didn't pray to Artemis, she turned him into a squirrel! How long do you think a squirrel is gonna last down here? Bring me some of Artemis's favor and I'll make it worth your while.";
    }
    if (this.bonusGod === GodEnum.Hermes) {
      this.bonusGodText = "How could you not love Hermes? If it wasn't for him, the whole world would be fulla spirits just ramblin' around! Cheers to Hermes!";
    }
    if (this.bonusGod === GodEnum.Apollo) {
      this.bonusGodText = "Tell me you're back with Apollo's favor. He's the god of <strong><i>AVERTING EVIL</i></strong>! You know how much evil there is down here that needs averting? I could use about 5 Apollos here at all times!";
    }
    if (this.bonusGod === GodEnum.Hades) {
      this.bonusGodText = "I don't need anyone's favor here except the boss himself. There's no one smarter or stronger than Hades! And you make sure to tell him I said that, alright?";
    }
    if (this.bonusGod === GodEnum.Ares) {
      this.bonusGodText = "You ever wake up with an unquenchable thirst for violence? Just me? Maybe I've been down here too long. Bring me a little favor from Ares so I can get a little taste.";
    }
    if (this.bonusGod === GodEnum.Nemesis) {
      this.bonusGodText = "Come up with some <i>creative interpretion</i> of the rules of dice? Here comes Nemesis to set you straight. Get a little too frisky with the farmer's daughter? Ten lashes from Nemesis. Collect money from the villagers to buy a sacrifice to the gods and blow it on wine and women? Guess who's here to ruin the fun, Nemesis! I'm hoping with a little favor, she might look the other way the next time me and the boys are playing a game of dice...";
    }
    if (this.bonusGod === GodEnum.Dionysus) {
      this.bonusGodText = "Now <b>HERE'S</b> someone that knows how to have a little fun! They oughtta start a cult or something for Dionysus, I'll be the first one to sign up!";
    }
    if (this.bonusGod === GodEnum.Zeus) {
      
    }
    if (this.bonusGod === GodEnum.Poseidon) {
      
    }

    this.bonusGodText = "<strong>" + this.bonusGodText + "</strong>";
    this.bonusGodText = this.bonusGodText.replaceAll("Athena", "<span class='athenaColor storyCharacterName'>Athena</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Hades", "<span class='hadesColor storyCharacterName'>Hades</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Hermes", "<span class='hermesColor storyCharacterName'>Hermes</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Artemis", "<span class='artemisColor storyCharacterName'>Artemis</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Apollos", "<span class='apolloColor storyCharacterName'>Apollos</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Apollo", "<span class='apolloColor storyCharacterName'>Apollo</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Ares", "<span class='aresColor storyCharacterName'>Ares</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Nemesis", "<span class='nemesisColor storyCharacterName'>Nemesis</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Dionysus", "<span class='dionysusColor storyCharacterName'>Dionysus</span>");
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

  getChthonicFavor(god: God) {    
    //500 * (log(.004 * x + 1))
    var factorAmount = (500 * Math.log10(.00325 * (Math.ceil(god.level * .75) - 1) + 1));

    return this.utilityService.roundTo((1.02**(factorAmount))-1, 2);
  }

  resetGod(god: God) {
    var powerGain = this.getChthonicPower(god);
    var favorGain = this.getChthonicFavor(god);

    if (this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked)
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicFavor, favorGain));

    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, powerGain));

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

    this.globalService.getActivePartyCharacters(true).forEach(member => {      
    if (god.type === GodEnum.Hades) {
      member.battleInfo.statusEffects = member.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.LordOfTheUnderworld);
    }

      this.globalService.calculateCharacterBattleStats(member, false);
    });
  }

  getRemainingPreferredGodTime() {
    var date = new Date();
    var endDate = new Date();

    var remainingTime = 0;

    if (date.getHours() >= this.utilityService.preferredGodStartTime2 && date.getHours() < this.utilityService.preferredGodEndTime2) {
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime2);
      endDate.setMinutes(0, 0, 0);
    }
    else if (date.getHours() >= this.utilityService.preferredGodStartTime3 || date.getHours() < this.utilityService.preferredGodEndTime3) //between 8 PM and 3:59 AM
    {
      //in day prior
      if (date.getHours() >= this.utilityService.preferredGodStartTime3)
      {
        endDate = new Date(new Date().setDate(new Date().getDate() + 1));
        
      }
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime3);
      endDate.setMinutes(0, 0, 0);
    }
    else {
      endDate.setHours(endDate.getHours() - date.getHours() + this.utilityService.preferredGodEndTime1);
      endDate.setMinutes(0, 0, 0);
    }

    remainingTime = (endDate.getTime() - date.getTime()) / 1000;

    return this.utilityService.convertSecondsToHHMMSS(remainingTime);
  }
}
