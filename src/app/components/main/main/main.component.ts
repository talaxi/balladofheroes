import { Component, OnInit } from '@angular/core';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { LookupService } from 'src/app/services/lookup.service';
import { StoryService } from 'src/app/services/story/story.service';

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

  constructor(private layoutService: LayoutService, private gameLoopService: GameLoopService, public lookupService: LookupService,
    public storyService: StoryService) { }

  ngOnInit(): void {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.navigation = this.layoutService.navigation;
    });
  }

}
