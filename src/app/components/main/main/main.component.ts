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
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';

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
  isGamePaused = false;
  viewingBattle = false;
  showPauseMessage = true;

  constructor(private layoutService: LayoutService, private gameLoopService: GameLoopService, public lookupService: LookupService,
    public storyService: StoryService, private deviceDetectorService: DeviceDetectorService, private globalService: GlobalService,
    private utilityService: UtilityService, private balladService: BalladService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.navigation = this.layoutService.navigation;
      this.isGamePaused = this.globalService.globalVar.isGamePaused;
      this.viewingBattle = this.layoutService.navigation === NavigationEnum.Default && !this.isAtStoryScene() && !this.isAtChestScene() && !this.isAtAltarScene();
      this.showPauseMessage = this.globalService.globalVar.settings.get("showPauseMessage") ?? true;
    });
  }

  isAtChestScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Chest;

    return false;
  }

  isAtAltarScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Altar;

    return false;
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
    factList.push("You can adjust game performance in the Settings to <b>Low</b> for a less CPU and battery intensive experience. If you want a smoother but more CPU and battery intensive experience, choose <b>High</b>.");
    factList.push("Your party can consist of at most 2 classes and 4 gods.");
    factList.push("By default, inactive classes gain no XP and inactive gods gain 25% XP from battle.");
    factList.push("All classes can use any weapon type without any penalty or boost.");

    if (!this.isMobile)
      factList.push("You can purchase items from stores in bulk by using the CTRL, ALT, and SHIFT keys.");

    if (this.isMobile)
      factList.push("Tap on an enemy's name to see their stats, ability details, and possible loot.");
    else
      factList.push("Hover over an enemy's name to see their stats, ability details, and possible loot.");

    if (this.isMobile)
      factList.push("Tap on 'LOG' on the top right of your screen to review any Story scene.");
    else
      factList.push("Click on 'LOG' on the top right of your screen to review any Story scene.");

    if (this.isMobile)
      factList.push("When viewing a class or god in the menu, tap and hold their level to see a detailed breakdown of their XP modifiers.");
    else
      factList.push("When viewing a class or god in the menu, hover their level to see a detailed breakdown of their XP modifiers.");

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
        factList.push("On Saturdays and Sundays, you gain an additional Eternal Melee Ticket.");
      else
        factList.push("On Saturdays and Sundays, you gain an additional Eternal Melee Ticket and the buffs gained from defeating Trial Bosses last twice as long.");
    }


    var seed = new Date().getDay() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes();
    var rng = this.utilityService.getRandomSeededInteger(0, factList.length - 1, seed.toString());


    return "<strong><i>Tip:</i> " + factList[rng] + "</strong>";
  }

  isAtStoryScene() {
    if (this.globalService.globalVar.activeBattle !== undefined)
      return this.globalService.globalVar.activeBattle.atScene && this.globalService.globalVar.activeBattle.sceneType === SceneTypeEnum.Story;

    return false;
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
