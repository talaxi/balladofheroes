import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  navigation: NavigationEnum;
  subscription: any;
  public navigationEnum = NavigationEnum;
  underworldAnimation = false;
  maxBankedTime = 0;
  displayFunFacts = true;
  isMobile = false;

  constructor(private layoutService: LayoutService, private gameLoopService: GameLoopService, public lookupService: LookupService,
    public storyService: StoryService, private deviceDetectorService: DeviceDetectorService, private globalService: GlobalService,
    private utilityService: UtilityService, private balladService: BalladService) { }

  ngOnInit(): void {
    //TODO: remove this on deploy unless complete
    //this.lookupService.isUIHidden = true;

    this.isMobile = this.deviceDetectorService.isMobile();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.navigation = this.layoutService.navigation;
    });
  }

  closeMobileMenu() {
    this.layoutService.mobileMenuOpen = false;
  }

  getLoadingPercent() {
    var remainingLoad = 0;

    remainingLoad = (1 - (this.globalService.bankedTime / this.globalService.maxBankedTime)) * 100;

    return remainingLoad;
  }

  getActiveTimeAmount() {
    return (this.globalService.globalVar.settings.get("loadingTime") ?? this.utilityService.averageActiveTimeLimit) / 60;
  }

  getFunFact() {
    var coliseumUnlocked = this.isColiseumAvailable();
    var underworldUnlocked = this.isPalaceOfHadesAvailable();
    var trialsUnlocked = this.isOlympusAvailable();

    var factList: string[] = [];
    factList.push("You receive more XP based on how many enemies are in the enemy party when defeating them. 2 enemies increase XP gain by 15%, 3 enemies increase XP gain by 30%, and 4 enemies increase XP gain by 45%.");
    factList.push("Any barrier amount your characters have is reset when switching subzones.");
    factList.push("You can adjust your FPS in the Settings for a smoother or less CPU-intensive experience.");
    factList.push("Your party can consist of at most 2 classes and 4 gods.");
    factList.push("By default, inactive classes gain no XP and inactive gods gain 25% XP from battle.");
    factList.push("All classes can use any weapon type without any penalty or boost.");

    if (this.isMobile)
      factList.push("Tap on an enemy's name to see their stats, ability details, and possible loot.");
    else
      factList.push("Hover over an enemy's name to see their stats, ability details, and possible loot.");

    if (underworldUnlocked) {
      if (!coliseumUnlocked && !trialsUnlocked)
        factList.push("Chthonic Preferred God Resets are based on real time and not game time.");
      else if (coliseumUnlocked && !trialsUnlocked)
        factList.push("Eternal Melee Tickets and Chthonic Preferred God Resets are based on real time and not game time.");
      else
        factList.push("Eternal Melee Tickets, Trial Boss rotation, and Chthonic Preferred God Resets are based on real time and not game time.");
    }

    if (coliseumUnlocked) {
      if (!trialsUnlocked)
        factList.push("On Saturdays and Sundays, you gain two additional Eternal Melee Tickets.");
      else
        factList.push("On Saturdays and Sundays, you gain two additional Eternal Melee Tickets and the buffs gained from defeating Trial Bosses last twice as long.");
    }


    var seed = new Date().getDay() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes();
    var rng = this.utilityService.getRandomSeededInteger(0, factList.length - 1, seed.toString());


    return "<strong><i>Tip:</i> " + factList[rng] + "</strong>";
  }


  isPalaceOfHadesAvailable() {
    var underworld = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld);
    if (underworld !== undefined && underworld.isAvailable) {
      return true;
    }
    return false;
  }

  isColiseumAvailable() {
    var coliseum = this.balladService.findSubzone(SubZoneEnum.ElysiumColiseum);
    if (coliseum !== undefined && coliseum.isAvailable) {
      return true;
    }
    return false;
  }

  isOlympusAvailable() {
    var coliseum = this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus);
    if (coliseum !== undefined && coliseum.isAvailable) {
      return true;
    }
    return false;
  }


  ngOnDestroy() {
  }
}
