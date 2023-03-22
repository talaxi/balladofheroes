import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameLogService } from 'src/app/services/battle/game-log.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { StoryService } from 'src/app/services/story/story.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-game-text-overview',
  templateUrl: './game-text-overview.component.html',
  styleUrls: ['./game-text-overview.component.css']
})
export class GameTextOverviewComponent {
  @ViewChild('scrollToTop') gameLogScroll: ElementRef;
  scrollButtonDelay = 0;
  scrollButtonDelayTotalCount = 5;
  previousLogHeight = 0;
  subscription: any;

  constructor(public dialog: MatDialog, private gameLogService: GameLogService, private utilityService: UtilityService,
    public storyService: StoryService, private gameLoopService: GameLoopService)
  {
    
  }

  ngAfterViewInit() {
    if (this.gameLogScroll !== undefined && this.gameLogScroll.nativeElement !== undefined)
    {
      this.skipToBottom(this.gameLogScroll.nativeElement);
      this.gameLogService.notificationOverlayBuffer = [];

      this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
        this.gameLogService.notificationOverlayBuffer = [];
      });
    }
  }

  skipToBottom(scrollToTop: any) {
    if (scrollToTop !== undefined)
      scrollToTop.scrollTop = scrollToTop.scrollHeight;
  }

  openGameLogEditor(content: any) {
    this.dialog.open(content, { width: '95%', height: '80%' });
  }

  displayGameUpdates() {
    var gameLogEntries = "";
    this.gameLogService.gameLog.forEach(item => {
      gameLogEntries += item;
    });

    return this.utilityService.getSanitizedHtml(gameLogEntries);
  }

  getScrollHeight(scrollToTop: any) {
    var offsetMultiplier = .95;
    if (this.previousLogHeight > 1000)
      offsetMultiplier = .97;

    if (Math.ceil(scrollToTop.scrollTop + scrollToTop.offsetHeight) >= (this.previousLogHeight * offsetMultiplier)) {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollHeight;
    }
    else {
      this.previousLogHeight = scrollToTop.scrollHeight;
      return scrollToTop.scrollTop;
    }
  }

  displayScrollToBottom(scrollToTop: any) {
    var offsetMultiplier = .98;
    if (this.previousLogHeight > 1000)
      offsetMultiplier = .995;

    console.log(scrollToTop.scrollTop + " + " + scrollToTop.offsetHeight + " >= " + this.previousLogHeight + " * " + offsetMultiplier);

    if (Math.ceil(scrollToTop.scrollTop + scrollToTop.offsetHeight) >= (this.previousLogHeight * offsetMultiplier)) {
      this.scrollButtonDelay = 0;
      return false;
    }
    else {
      this.scrollButtonDelay += 1;
      if (this.scrollButtonDelay >= this.scrollButtonDelayTotalCount)
      {
        console.log("Show button");
        return true;
      }
      else
        return false;
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
