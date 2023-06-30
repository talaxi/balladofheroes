import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

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
  displayFunFacts = false;
  isMobile = false;

  constructor(private layoutService: LayoutService, private gameLoopService: GameLoopService, public lookupService: LookupService,
    public storyService: StoryService, private deviceDetectorService: DeviceDetectorService, private globalService: GlobalService,
    private utilityService: UtilityService) { }

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
    var fact = "<strong><i>Tip:</i> ";

    var factList: string[] = [];
    factList.push("You receive more XP based on how many enemies are in the enemy party when defeating them. 2 enemies increase XP gain by 15%, 3 enemies increase XP gain by 30%, and 4 enemies increase XP gain by 45%.");
    factList.push("Any barrier amount your characters have is reset when switching subzones.");
    factList.push("You can adjust your FPS in the Settings for a smoother or less CPU-intensive experience.");
    factList.push("Your party can consist of at most 2 classes and 4 gods.");


    var rng = this.utilityService.getRandomInteger(0, factList.length);


    return factList[rng] + "</strong>";
  }

  ngOnDestroy() {    
  }
}
