import { Injectable } from '@angular/core';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  showStory: boolean;
  currentPage = 1;
  pageCount: number;
  sceneText = "";

  constructor(private globalService: GlobalService, private lookupService: LookupService, private balladService: BalladService,
    private utilityService: UtilityService, private tutorialService: TutorialService, private gameLogService: GameLogService) { }

  checkForNewStoryScene() {
    if (this.globalService.globalVar.currentStoryId === 0)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 1 && this.balladService.getActiveSubZone().type === SubZoneEnum.AigosthenaHeartOfTheWoods)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 2 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AigosthenaHeartOfTheWoods))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 3 && this.balladService.getActiveSubZone().type === SubZoneEnum.DodonaCountryside)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 4 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.DodonaCountryside))
      this.showStory = true;
  }

  handleScene(deltaTime: number) {
    if (this.globalService.globalVar.currentStoryId === 0) {
      this.utilityService.isBattlePaused = true;
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "Today is the Festival of Gods in your small village in Greece. " +
          "Musicians are performing, children are playing, men and women are eating and drinking. <br/><br/>You are racing.<br/><br/>" +
          "Every year, you and many others set out inland to the Temple of Athena. It is modest compared to the one in Athens, but it is the " +
          "largest most people in your village will ever see. From generation to generation, the story has held that the first person to reach the temple on the day of the Festival will be granted an audience with Athena herself.";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "Some believe the stories and race to prove their piety. Others race to prove their skill and honor Athena in their own way. You race simply because every year you have tried, and every year you have failed. You have always yearned for greatness, but come up short. This year was going to be different.";
        //"To reach the Temple of Athena, you first must travel down the coast of Aigosthena and through the woodlands inland. At the far edge of the woodlands, you will find the Temple. The competition is not difficult for its length, but for the treacherous monsters barring the way.";

      }
    }
    else
      this.utilityService.isBattlePaused = false;

    if (this.globalService.globalVar.currentStoryId === 1) {
      this.pageCount = 1;

      if (this.currentPage === 1) {
        this.sceneText = "You've never moved this fast before. Heart pounding, you start to really believe you can do this. As your thoughts begin to stray, you belatedly notice you have stumbled into what looks like a bird nest. Overgrown eggs litter the sides of a massive roost. <br/><br/>" +
          "While you pass through, you hear the sound of wind moving rapidly behind you. You dodge out of the way just in time to avoid being ripped to shreds by a large figure. The owner of the nest isn't pleased to see you here. You will have to defeat this oversized bird to continue.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 2) {
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "You arrive at the Temple of Athena. The lone figure inside is an oracle, mixing powders together under the light of a single flame. “Am I the first?” you ask, falling to your knees. “You are the first.” She replies, the strong scent of incense filling the room. You’ve done it. Year after year you have tried, and you have finally succeeded. As you kneel, elated, exhausted, you begin to offer up a prayer. <br/><br/>" +
          "“<span class='athenaColor'>Your resolve is impressive.</span>” a voice says from behind. The Goddess of Wisdom and War. <span class='athenaColor'>Athena</span>.";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "“<span class='athenaColor'>Be warned, mortal, for my mother has foreseen the impending fall of Olympus. She sees the Giants and Titans joining forces and planning a coordinated attack against us. We cannot hope to stand against both of them on our own. <br/><br/>" +
          "We need allies, and I believe that you can help us. Prove your resolve once more. Trace the steps and trials of champions past. Let their strength be yours.</span>”<br/><br/>" +
          "And then she was gone. All that remained was a scythe left where Athena once stood and the overwhelming smell of incense. After taking in what just occurred, you offer up another prayer and step back outside of the temple. But instead of woodlands, you see the open road. Instead of Aigosthena, you are in Delphi.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 3) {
      this.pageCount = 1;

      if (this.currentPage === 1) {
        this.sceneText = "You find your way out of Delphi while trying to take in your meeting with Athena. Could you walk the path of champions? You know all of the stories by heart -- the trials of Heracles, the winding journey of Odysseus, the triumphs of Jason. Could you truly be in the same conversations as these heroes? <br/><br/>" +
        "Your feet unconsciously make their way towards Dodona, following the path of Perseus. As you cross the countryside between Locris and Aetolia, you get the feeling you are being followed. No sooner than you make that realization, you are set upon by an assailant.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 4) {
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "After a hard fought battle, your opponent relents. Your power has grown significantly since being chosen by Athena -- and this Archer matches you in the same way. <br/><br/>" +
        "“I have been blessed by the goddess Artemis. She has tasked me with hunting and defeating the strongest enemies I can find, so that I may prove myself and defend Olympus in the war to come.”";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "The gods seem to each have their own favorites. “Walk with me. Athena guides my path. Together, we can prove ourselves.” You reply. You continue to Dodona.";
      }
    }

    this.globalService.globalVar.timers.scenePageTimer += deltaTime;
    if (this.globalService.globalVar.timers.scenePageTimer >= this.globalService.globalVar.timers.scenePageLength) {
      this.globalService.globalVar.timers.scenePageTimer = 0;
      this.currentPage += 1;
    }

    if (this.currentPage > this.pageCount) {
      this.globalService.globalVar.currentStoryId += 1;
      this.currentPage = 1;
      this.showStory = false;

      //post story events, if any
      if (this.globalService.globalVar.currentStoryId === 1) {
        this.utilityService.isBattlePaused = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.AutoAttack));
      }
      if (this.globalService.globalVar.currentStoryId === 3) {
        this.balladService.setActiveSubZone(SubZoneEnum.DodonaDelphi);
      }
    }

    return this.showStory;
  }
}
