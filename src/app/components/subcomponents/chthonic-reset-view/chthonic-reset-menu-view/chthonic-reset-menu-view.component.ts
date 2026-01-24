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
import { ZodiacService } from 'src/app/services/global/zodiac.service';
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
    private deviceDetectorService: DeviceDetectorService, private zodiacService: ZodiacService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.availableGods = this.globalService.globalVar.gods.filter(item => item.isAvailable).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    });

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
      this.bonusGodText = "Come up with some <i>creative interpretion</i> of the rules of dice? Here comes Nemesis to set you straight. Get a little too frisky with the farmer's daughter? Ten lashes from Nemesis. Collect money from the villagers to buy a sacrifice to the gods and blow it on wine and women? Guess who's here to ruin the fun, Nemesis! I'm hoping with a little favor, she might look the other way the next time me and the boys get together...";
    }
    if (this.bonusGod === GodEnum.Dionysus) {
      this.bonusGodText = "Now <b>HERE'S</b> someone that knows how to have a little fun! They oughtta start a cult or something for Dionysus, I'll be the first one to sign up!";
    }
    if (this.bonusGod === GodEnum.Zeus) {
      this.bonusGodText = "We're not really supposed to say his name down here, but if you happen to see the <i class='zeusColor storyCharacterName'>head honcho with all the lightning bolts</i>, put in a good word for me will ya?"
    }
    if (this.bonusGod === GodEnum.Poseidon) {
      this.bonusGodText = "Boy oh boy, is there anything like the ocean breeze? Seriously, it's about the only nice thing we have left down here. If you manage to get some favor from Poseidon, bring it by will ya?";
    }
    if (this.bonusGod === GodEnum.Hera) {
      this.bonusGodText = "They say Queen Hera can see and hear everything. Well, hopefully she can hear how much I want some of her favor!";
    }
    if (this.bonusGod === GodEnum.Aphrodite) {
      this.bonusGodText = "I think I've been shot! Right in the heart with the power of love, baby! Give me everything you got with Aphrodite's name on it!";
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
    this.bonusGodText = this.bonusGodText.replaceAll("Poseidon", "<span class='poseidonColor storyCharacterName'>Poseidon</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Hera", "<span class='heraColor storyCharacterName'>Hera</span>");
    this.bonusGodText = this.bonusGodText.replaceAll("Aphrodite", "<span class='aphroditeColor storyCharacterName'>Aphrodite</span>");
  }

  getChthonicPower(god: God) {
    //should give slightly more per level and also have a multiplier from favor
    var chthonicFavorMultiplier = this.lookupService.getChthonicFavorMultiplier();
    var preferredGodBoost = 1;
    var zodiacBoost = 1;

    if (god.level <= 1)
      return 0;

    //give more for more levels at once so that there isn't a benefit in coming back every single level to stack favor
   /* var multiLevelBoost = 0;
    if (god.level > 2) {
      multiLevelBoost = (god.level - 2) * .1;
    }*/

    if (god.type === this.globalService.globalVar.chthonicPowers.preferredGod) {
      preferredGodBoost = 1.25;
    }

    var zodiacBonusGods = this.zodiacService.getBonusGods();
    if (zodiacBonusGods.some(item => item === god.type))
      zodiacBoost += this.utilityService.zodiacGodResetBoost;

    var baseAmount = 1.00081475 ** (5325 * Math.log10(.08 * (Math.ceil((god.level + 13) * .8)) + 2)) - 1;

    if (god.level <= 100) {
      baseAmount -= (5 - ((god.level/100) * 5));

      if (god.level <= 10) {
        baseAmount -= (1.5 - ((god.level/10) * 1.5));
      }
    }
    
    var darkOrbs = this.lookupService.getResourceAmount(ItemsEnum.DarkOrb);

    return this.utilityService.roundTo((baseAmount) * (1 + chthonicFavorMultiplier) * preferredGodBoost * zodiacBoost * (1 + (darkOrbs * .1)), 2);
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

    var originalLevel = god.level;
    if (originalLevel > god.highestLevelReached)
      god.highestLevelReached = originalLevel;
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
      var xp = this.lookupService.getTotalExpRequiredForGodLevel(originalLevel);            
      god.exp += xp * resetRetainAmount;

      var previousXp: number | undefined = undefined;
      while (god.exp >= god.expToNextLevel && (previousXp === undefined || god.exp < previousXp)) {
        previousXp = god.exp;
        this.globalService.levelUpGod(god);
      }      
    }

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
