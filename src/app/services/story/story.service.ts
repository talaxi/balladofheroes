import { Injectable } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  showStory: boolean;
  currentPage = 1;
  pageCount: number;
  sceneText = "";
  triggerFirstTimeUnderworldScene = false;
  endFirstTimeUnderworldScene = false;
  showFirstTimeUnderworldStory = false;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private balladService: BalladService,
    private utilityService: UtilityService, private tutorialService: TutorialService, private gameLogService: GameLogService,
    private resourceGeneratorService: ResourceGeneratorService) { }

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
    else if (this.globalService.globalVar.currentStoryId === 5 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.DodonaAmbracianGulf))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 6 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.LibyaIsleCenter))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 7 && this.balladService.getActiveSubZone().type === SubZoneEnum.NemeaCountryRoadsOne)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 8 && this.balladService.getActiveSubZone().type === SubZoneEnum.AsphodelHallOfTheDead)
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
        this.sceneText = "You arrive at the Temple of Athena. The lone figure inside is an oracle, mixing powders together under the light of a single flame. <span class='adventurerColor bold'>“Am I the first?”</span> you ask, falling to your knees. <span class='bold'>“You are.”</span> She replies, the strong scent of incense filling the room. You've done it. Year after year you have tried, and you have finally succeeded. As you kneel, elated, exhausted, you begin to offer up a prayer. <br/><br/>" +
          "<span class='athenaColor bold'>“Your resolve is impressive.”</span> a voice says from behind. The Goddess of Wisdom and War. <span class='athenaColor bold'>Athena</span>.";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "<span class='athenaColor bold'>“Be warned, mortal, for my mother has foreseen the impending fall of Olympus. She sees the Giants and Titans joining forces and planning a coordinated attack against us. We cannot hope to stand against both of them on our own. <br/><br/>" +
          "We need allies, and I believe that you can help us. Prove your resolve once more. Trace the steps and trials of champions past. Let their strength be yours.”</span><br/><br/>" +
          "And then she was gone. All that remained was the overwhelming smell of incense. After taking in what just occurred, you offer up another prayer and step back outside of the temple. But instead of woodlands, you see the open road. Instead of Aigosthena, you are in Delphi.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 3) {
      this.pageCount = 1;

      if (this.currentPage === 1) {
        this.sceneText = "You find your way out of Delphi while trying to take in your meeting with Athena. Could you walk the path of champions? You know all of the stories by heart -- the trials of Heracles, the winding journey of Odysseus, the triumphs of Jason. Could you truly be in the same conversations as these heroes? <br/><br/>" +
          "Your feet unconsciously make their way northwest towards Dodona, following the path of Perseus. As you cross the countryside between Locris and Aetolia, you get the feeling you are being followed. No sooner than you make that realization, you are set upon by an assailant.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 4) {
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "After a hard fought battle, your opponent relents. Your power has grown significantly since being chosen by Athena, but you feel this Archer matches you in the same way. With your opponent thoroughly defeated, you sheathe your weapon and extend a hand. <br/><br/>" +
          "<span class='archerColor bold'>“My goddess Artemis guides my arrows. She tasked me with hunting the strongest enemies I can find, so that I can prove myself and defend Olympus in the war to come.”</span>";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "The gods seem to each have their own favorites. <span class='adventurerColor bold'>“Walk with me, keep your distance if you choose. Athena guides my path as Artemis guides yours. We can prove ourselves together.”</span> You reply. You continue to Dodona.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 5) {
      //After Ambracian Gulf
      this.pageCount = 3;

      if (this.currentPage === 1) {
        this.sceneText = "Like Perseus before you, you wander through the oak grove outside of Dodona. The stories say that the trees spoke advice to Perseus, but to you they are quiet. As you make your way around the grove, a youthful man wearing a feather-brimmed hat steps out to greet you.<br/><br/>" +
          "<span class='hermesColor bold'>“This is your champion? Seems a little… fresh, don't you think?”</span> he says. True to the stories, <span class='hermesColor bold'>Hermes</span> has arrived to greet you with <span class='athenaColor bold'>Athena</span> just behind him.<br/><br/>" +
          "<span class='athenaColor bold'>“We must all start somewhere, brother.” Athena</span> says as she turns to you. <span class='athenaColor bold'>“You've done well. But your real trial is only just beginning.”</span>";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "<span class='athenaColor bold'>Athena</span> steps forward towards you, shield in hand. <span class='athenaColor bold'>“The next step on your journey is to slay Medusa. We're here to help you.”</span> She hands you the shield, its surface so clean it looks almost like a mirror. <br/><br/>" +
          "<span class='hermesColor bold'>“Take these too. They'll take you straight where you need to be.” Hermes</span> says as he hands you a pair of sandals. <span class='hermesColor bold'>“You know, I wasn't sure you would come all the way here. You know how the story went right? Medusa is in Libya. Just wanted to do some sightseeing?”</span><br/><br/>" +
          "<span class='adventurerColor bold'>“Well… I just wanted to follow in the footsteps of a real champion.”</span> You reply.";
      }
      else if (this.currentPage === 3) {
        this.sceneText = "<span class='hermesColor bold'>“That's well and good, but we need a champion of our own. Use those sandals and see if you have what it takes to defeat Medusa. I've got another pair for your friend there hiding in the shadows as well. Good luck!”</span> <br/><br/>" +
          "<span class='athenaColor bold'>“We will see you soon. Farewell.” Athena</span> says as she and <span class='hermesColor bold'>Hermes</span> vanish back into the grove. Your partner steps out from behind the trees, keeping a healthy distance behind you. <span class='archerColor bold'>“It looks like our journey will continue in Libya.”</span>";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 6) {
      //After Medusa
      this.pageCount = 1;

      if (this.currentPage === 1) {
        this.sceneText = "With one final attack, you slice Medusa's head clean off. With the power of the gods, what felt impossible before was now within your reach. Your strength is greater than you ever dreamed. Your companion kneels beside you, inspecting the snake-like hair of the Gorgon. <br/><br/>" +
          "<span class='archerColor bold'>“That's one name off of my list. Who's next?”</span>";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 7) {
      //Before Enceladus
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "Shortly after finishing up with Medusa, you next journey to Nemea back near Athens. With the strength you possess, nothing short of Heracles's labors could stop you.  <br/><br/>" +
          "Heracles was tasked with twelve impossible tasks, forced to battle terrifying beasts and recover mystifying objects. First on the list was the lion terrorizing Nemea.";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "As you work your way around the roads of Nemea, you find a towering figure seemingly waiting for you. " +
          "A Giant?! Most were imprisoned or dead, but here was one in your path." +
          "<span class='bold'>“Little champions, I've been waiting a looong time for ya. Come on over, don't be shy!”</span> it bellows as it makes its way towards you. <br/> <br/>" +
          "This is what <span class='athenaColor bold'>Athena</span> trusted you to handle. Time to make her proud.";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 8 && this.showFirstTimeUnderworldStory) {
      //Before Underworld
      this.pageCount = 2;

      if (this.currentPage === 1) {
        this.sceneText = "Darkness. <br/><br/>" +
          "Darkness is all you see as you float down. <br/><br/>" +
          "Down. Down to the Underworld.";
      }
      else if (this.currentPage === 2) {
        this.sceneText = "<span class='hermesColor bold'>“Guess you <i>were</i> a little too green. Don't be disappointed, not everyone can be the ultimate champion of the gods can they?”</span> You hear from a familiar voice." +
          "<span class='hermesColor bold'>“Get up, let's get you situated here. Time to go see Hades.”</span>";
      }
    }
    if (this.globalService.globalVar.currentStoryId === 9) {
      //Speak to Hades for the first time
      this.pageCount = 1;

      if (this.currentPage === 1) {
        this.sceneText = "<i>This is as far as the game goes for now. Feel free to go back and try out things you may have missed earlier in the game. Thanks for playing and stay tuned for more!</i>";
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Town));
      }
      if (this.globalService.globalVar.currentStoryId === 6) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Crafting));
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Aegis, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
      }
      if (this.globalService.globalVar.currentStoryId === 9) {
        this.showFirstTimeUnderworldStory = false;
        this.triggerFirstTimeUnderworldScene = false;
        this.endFirstTimeUnderworldScene = true;
        setTimeout(() => {
          this.endFirstTimeUnderworldScene = false;
        }, 5000);
      }
      if (this.globalService.globalVar.currentStoryId === 10) {
        this.utilityService.isBattlePaused = false;
        var championBallad = this.balladService.findBallad(BalladEnum.Champion);
        if (championBallad !== undefined)
          championBallad.isAvailable = true;

        var gorgonBallad = this.balladService.findBallad(BalladEnum.Gorgon);
        if (gorgonBallad !== undefined)
          gorgonBallad.isAvailable = true;

        var laborsBallad = this.balladService.findBallad(BalladEnum.Labors);
        if (laborsBallad !== undefined)
        laborsBallad.isAvailable = true;

        this.globalService.globalVar.currentStoryId = 9;
      }
    }

    return this.showStory;
  }
}
