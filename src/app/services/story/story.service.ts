import { Injectable, Optional } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AchievementService } from '../achievements/achievement.service';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { UtilityService } from '../utility/utility.service';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { DictionaryService } from '../utility/dictionary.service';
import { ProfessionService } from '../professions/profession.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  showStory: boolean;
  showOptionalStory: OptionalSceneEnum = OptionalSceneEnum.None;
  currentPage = 1;
  pageCount: number;
  sceneText = "";
  triggerFirstTimeUnderworldScene = false;
  endFirstTimeUnderworldScene = false;
  showFirstTimeUnderworldStory = false;
  returnedFromOptionalScene = true;

  constructor(private globalService: GlobalService, private lookupService: LookupService, private balladService: BalladService,
    private utilityService: UtilityService, private tutorialService: TutorialService, private gameLogService: GameLogService,
    private resourceGeneratorService: ResourceGeneratorService, private achievementService: AchievementService,
    private deviceDetectorService: DeviceDetectorService, private dictionaryService: DictionaryService, private professionService: ProfessionService) { }

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
    else if (this.globalService.globalVar.currentStoryId === 8 && this.balladService.getActiveSubZone().type === SubZoneEnum.AsphodelPalaceOfHades)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 10 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AsphodelDarkenedMeadows))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 11 && this.balladService.getActiveSubZone().type === SubZoneEnum.ElysiumColiseum)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 12 && this.balladService.getActiveSubZone().type === SubZoneEnum.ElysiumColiseum && this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.TournamentOfTheDead)!.count > 0)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 13 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.ElysiumGatesOfHornAndIvory))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 14 && this.balladService.getActiveSubZone().type === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 15 && this.balladService.getActiveSubZone().type === SubZoneEnum.CalydonTownMarket)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 16 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.CalydonWornDownBarn))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 17 && this.balladService.getActiveSubZone().type === SubZoneEnum.AegeanSeaOpenSeas)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 18 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AegeanSeaIslandOfImbros))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 19 && this.balladService.getActiveSubZone().type === SubZoneEnum.AegeanSeaPropontis)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 20 && this.balladService.getActiveSubZone().type === SubZoneEnum.AegeanSeaDesertedPath)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 21 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AegeanSeaSympegadesOverlook))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 22 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.BlackSeaSeaEscape))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 23 && this.balladService.getActiveSubZone().type === SubZoneEnum.ColchisCityCenter)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 25 && this.balladService.getActiveSubZone().type === SubZoneEnum.ColchisGroveOfAres)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 26 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.ColchisReinforcementsFromAeetes))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 27 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.ColchisHurriedRetreat2))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 28 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.NemeaCountryRoadsTwo))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 29 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.NemeaLairOfTheLion))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 30 && this.balladService.getActiveSubZone().type === SubZoneEnum.StymphaliaArcadianWilderness)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 31 && this.balladService.getActiveSubZone().type === SubZoneEnum.ErymanthusSnowCappedPeaks)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 32 && this.balladService.getActiveSubZone().type === SubZoneEnum.CoastOfCreteCretanCoast)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 33 && this.balladService.getActiveSubZone().type === SubZoneEnum.GardenOfTheHesperidesHiddenOasis)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 34 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 35 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.ErytheiaGeryonsFarm))
      this.showStory = true;

    if (this.showStory)
      this.lookupService.addStoryToLog(this.globalService.globalVar.currentStoryId, this.balladService.getActiveSubZone().type);
  }

  thalesText(text: string) {
    return "<span class='adventurerColor bold'>" + text + "</span>";
  }

  zosimeText(text: string) {
    return "<span class='archerColor bold'>" + text + "</span>";
  }

  hadesText(text: string) {
    return "<span class='hadesColor bold'>" + text + "</span>";
  }

  hermesText(text: string) {
    return "<span class='hermesColor bold'>" + text + "</span>";
  }

  commonCharacterText(text: string) {
    return "<span class='commonCharacterText'>" + text + "</span>";
  }

  getStoryText(storyId: number, pageCount: number) {
    var sceneText = "";

    if (storyId === 0) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Today is the Festival of Gods in your small village in Greece. " +
          "Musicians are performing, children are playing, men and women are eating and drinking. </div><div class='sceneDiv'>You, Thales of Aigosthena, are racing.</div>" +
          "<div>Every year, you and many others set out inland to the Temple of Athena. It is modest compared to the one in Athens, but it is the " +
          "largest most people in your village will ever see. From generation to generation, the story has held that the first person to reach the temple on the day of the Festival will be graced with the presence of Athena herself.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Some believe the stories and race to prove their piety. Others race to prove their skill and honor Athena in their own way. You race simply because every year you have tried, and every year you have failed. You have always yearned for greatness, but could never quite reach it. This year was going to be different.</div>";
    }
    else if (storyId === 1) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You've never moved this fast before. Heart pounding, you start to really believe you can do this.</div><div class='sceneDiv'> Growing up, you were always inspired by the stories of heroes and their tales of incredible deeds and dauntless courage. You were never the fastest nor the strongest, but you always tried. When others would falter, you stayed steady.</div> <div>If Theseus can look into the eyes of a ten foot tall half-man with the head of a snarling bull, then what do you have to fear?</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>As your thoughts stray, you belatedly notice you have stumbled into what looks like a bird nest. Overgrown eggs litter the sides of a massive roost.</div>" +
          "<div>While you pass through, you hear the sound of wind moving rapidly behind you. You dodge out of the way just in time to avoid being ripped to shreds by a large figure. The owner of the nest isn't pleased to see you here. You will have to defeat this oversized bird to continue.</div>";
    }
    else if (storyId === 2) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You arrive at the temple. The lone figure inside is an oracle, mixing powders together under the light of a single flame. <span class='adventurerColor bold'>“Am I the first?”</span> you ask, falling to your knees. " + this.commonCharacterText("“You are.”") + " She replies, the strong scent of incense filling the room. You've done it. Year after year you have tried, and you have finally succeeded. As you kneel, elated, exhausted, you begin to offer up a prayer.</div>" +
          "<div><span class='athenaColor bold'>“Your resolve is impressive.”</span> a voice says from behind. The Goddess of Wisdom and Warfare. Athena.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'><span class='athenaColor bold'>“Be warned, mortal, for my mother has foreseen the impending fall of Olympus. She sees the Giants and Titans joining forces and planning a coordinated attack against us. We cannot hope to stand against both of them on our own. </div>" +
          "<div class='sceneDiv'>We need allies, and I believe that you can help us. Prove your resolve once more. Trace the steps and trials of champions past. Let their strength be yours.”</span></div>" +
          "<div>And then she was gone. All that remained was the overwhelming smell of incense. After taking in what just occurred, you offer up another prayer and step back outside of the temple. But instead of woodlands, you see the open road. Instead of Aigosthena, you are in Delphi.</div>";
    }
    else if (storyId === 3) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You find your way out of Delphi while processing your meeting with Athena. Could you walk the path of champions? You know all of the stories by heart -- the trials of Heracles, the winding journey of Odysseus, the triumph and fall of Jason. Could you truly be in the same conversations as these heroes? </div>" +
          "<div>Your feet unconsciously make their way northwest towards Dodona, following the path of Perseus on his journey to defeat the monstrous Medusa. As you cross the countryside between Locris and Aetolia, you get the feeling you are being followed. You've battled numerous bandits on your path and before this one can get the jump on you, you go on the offensive.</div>";
    }
    else if (storyId === 4) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Your power has grown significantly since you were chosen by Athena, but you feel this Archer matches you in the same way. As your fight comes to a stalemate, you raise your hands in surrender. </div>" +
          "<div class='sceneDiv'><span class='adventurerColor bold'>“I thought you were trying to mug me, but you fight harder than an ordinary bandit. Why are you following me?”</span></div>" +
          "<div><span class='archerColor bold'>“I didn't mean to startle you.”</span> Your opponent says, cautiously lowering her bow. <span class='archerColor bold'>“I was leaving Delphi at the same time as you, and couldn't help notice you cutting down the outlaws running these roads. Following you made it easier to travel.. and I was curious what you were after.”</span></div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'><span class='archerColor bold'>“My name is Zosime. The goddess Artemis guides my arrows. She tasked me with hunting the strongest enemies I can find to prove myself worthy of defending Olympus. I almost added you to that list.”</span></div>" +
          "<div>The gods seem to each have their own favorites. <span class='adventurerColor bold'>“Sorry about that.”</span> You reply with a grin. <span class='adventurerColor bold'>“If you want a challenge, then walk with me to Dodona. Athena guides my path as Artemis guides yours. Keep your distance if you choose, but we have the same goal. We can prove ourselves together.”</span></div>";
    }
    else if (storyId === 5) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Like Perseus before you, you wander through the oak grove outside of Dodona. The stories say that the trees spoke advice to Perseus, but to you they are quiet. As you make your way around the grove, a youthful man wearing a feather-brimmed hat steps out to greet you.</div>" +
          "<div class='sceneDiv'><span class='hermesColor bold'>“This is your champion? Seems a little… fresh, don't you think?”</span> he says. True to the stories, <span class='hermesColor bold'>Hermes</span> has arrived to greet you with <span class='athenaColor bold'>Athena</span> just behind him.</div>" +
          "<div><span class='athenaColor bold'>“We must all start somewhere, brother.”</span> Athena says as she turns to you. <span class='athenaColor bold'>“You've done well. But your real trial is only just beginning.”</span></div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'><span class='athenaColor bold'>Athena</span> steps forward towards you, shield in hand. <span class='athenaColor bold'>“The next step on your journey is to slay Medusa. We're here to help you.”</span> She hands you the shield, its surface so clean it looks almost like a mirror. </div>" +
          "<div class='sceneDiv'><span class='hermesColor bold'>“Take these too. They'll take you straight where you need to be.”</span> Hermes says as he hands you a pair of sandals. <span class='hermesColor bold'>“You know, I wasn't sure you would come all the way here. You know how the story went right? Medusa is in Libya. Just wanted to do some sightseeing?”</span></div>" +
          "<div><span class='adventurerColor bold'>“I... just wanted to follow in the footsteps of a real hero.”</span> You reply.</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'><span class='hermesColor bold'>“That's well and good, but we need a real hero of our own. Use those sandals and see if you have what it takes to defeat Medusa. I've got another pair for your friend there hiding in the shadows as well. Good luck!”</span> </div>" +
          "<div><span class='athenaColor bold'>“We will see you soon. Farewell.” Athena</span> says as she and <span class='hermesColor bold'>Hermes</span> vanish back into the grove. Zosime steps out from behind the trees, grabbing a pair of sandals and putting them on. <span class='archerColor bold'>“Sounds like we're heading to Libya.”</span></div>";
    }
    else if (storyId === 6) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>With one final attack, you slice Medusa's head clean off. With the power of the gods, what felt impossible before is now within your reach. Despite what Hermes said, your potential is undeniable! Your companion kneels beside you, inspecting the snake-like hair of the Gorgon. </div>" +
          "<div><span class='archerColor bold'>“That's one name off my list. Who's next?”</span></div>";
    }
    else if (storyId === 7) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Shortly after finishing up with Medusa, you next journey to Nemea back near Athens. With the strength you possess, nothing short of Heracles's labors could stop you.  </div>" +
          "<div>Heracles was tasked with twelve impossible tasks, forced to battle terrifying beasts and recover mystifying objects. First up was the lion terrorizing the countryside of Nemea.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>As you work your way around the roads of Nemea, you find a towering figure blocking the path. </div>" +
          "<div class='sceneDiv'>A Giant?! You hadn't expected to encounter one so early on your journey, but here was one in your way. It seems like he was waiting for you.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“Little heroes! I've been looking for ya. Come on over, don't be shy!”") + " it bellows as it makes its way towards you.</div>" +
          "<div class='sceneDiv'>This is what <span class='athenaColor bold'>Athena</span> trusted you to handle. Time to make her proud.</div>" +
          "<div class='smallStoryText'><b><i>You will temporarily lose access to previous Ballads after completing the following battle.</i></b></div>";
    }
    else if (storyId === 8) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Darkness. </div>" +
          "<div class='sceneDiv'>Darkness is all you see as you float down. </div>" +
          "<div>Down. Down to the Underworld.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'><span class='hermesColor bold'>“Guess you <i>were</i> a little too green. Don't be disappointed, not everyone can be the ultimate champion of the gods can they?”</span> You hear from a familiar voice.</div>" +
          "<div><span class='hermesColor bold'>“Get up, let's get you situated here. Time to go see Hades.”</span></div>";
    }
    else if (storyId === 9) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'><span class='hadesColor bold'>“Asphodel.” Hades</span> commands, assigning you to the afterlife of the ordinary. You shuffle out of the procession of those waiting to be given their final resting place as your partner steps up to take your place at the head of the line. </div>" +
          "<div class='sceneDiv'><span class='hermesColor bold'>“He's a man of few words. Much like yourself lately!”</span> Hermes whispers to you, cracking a smile. Hermes guides all souls down to the underworld, so it would seem the gravity of dying means little to him. You say nothing as you hear Hades decree that your partner will be joining you in Asphodel. </div>" +
          "<div><span class='hadesColor bold'>“Hermes. A word.”</span></div>";
      if (pageCount === 2)
        sceneText = "<div><span class='archerColor bold'>“Asphodel? <i>Really?</i>”</span> Your partner moves out of the line towards you while <span class='hermesColor bold'>Hermes</span> and <span class='hadesColor bold'>Hades</span> converse. <span class='archerColor bold'>“All I've done... and still I go to Asphodel?”</span> Zosime's thoughts mirror your own. You thought your destiny was to be a hero -- but that had all gone up in smoke. Is this all you were meant for?</div>";
      if (pageCount === 3)
        sceneText = "<div class='sceneDiv'><span class='hermesColor bold'>“Right, well I've left you two to brood long enough. Let's have a quick chat.”</span> Hermes says as he leads you to an empty part of the room. <span class='hermesColor bold'>“Believe it or not, even Hades is concerned about the impending war for Olympus. There's going to be a tournament in the Coliseum of Elysium. Hades is granting the winner, or winners, passage from the Underworld so long as they fight with Olympus when the time comes. I don't know if you really have what it takes but… why not give it a shot?”</span> </div>" +
          "<div><span class='archerColor bold'>Zosime</span> looks to you, but you offer up no response. <span class='archerColor bold'>“Let's do this. Our story doesn't have to be over yet.”</span> She says.</div>";
    }
    else if (storyId === 10) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You go through the motions as you ascend your way through Asphodel. Hit this, dodge that, keep moving. Your fall from such high heights down to the depths of failure remind you of your thoughts as a youth. You've known how to go through the motions, but you were always one step behind.</div>" +
          "<div>Zosime, noticing the stark contrast in your demeanor, pauses for a moment. " + this.zosimeText("“Well on the plus side, it looks like Artemis and Athena still favor us. Maybe this was part of their  plan?”") + " She says.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Listen Thales. All my life, I've been a hunter. When you're alone in the forest, tracking a wild animal for days.. things don't always go as planned. Maybe you lose the trail, maybe what you're tracking gets the better of you. Setbacks happen. But just because you lose the trail doesn't mean you can't pick it up again.”") + "</div>" +
          "<div>You look at Zosime as she speaks. The fire in her heart and belief in herself is contagious. " + this.thalesText("“You're right. Thank you.”") + " You do feel a little better. Together, you continue to press forward.</div>";
    }
    else if (storyId === 11) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As you traverse the underworld, you start to understand the madness of the souls you've met. You've always taken for granted the welcoming sound of the wind at your back, the birds chirping to each other, the leaves rustling as dogs run past you. But here, there is nothing but deafening silence. All you have to hear are the screams of souls long dead... and your own thoughts.</div>" +
          "<div class='sceneDiv'>As you finally approach your destination, your contemplative trance is broken by the hustle and bustle of the coliseum. This seems to be the largest gathering of souls in the underworld and you two aren't the only ones who want a ticket out. " + this.zosimeText("“I'll go sign us up, wait here.”") + " Zosime says as she walks through the coliseum gates.</div>" +
          "<div>" + this.commonCharacterText("“Hello, child.”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>You look to your side as an old man approaches you. " + this.thalesText("“Sorry, have we met?”") + " You reply.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“Perhaps not in the flesh, but I have been with you since your journey began. I hear that we slayed the lady Medusa. Tell me, haven't you wondered how? She was already dead, slain by the Founder of Mycenae. How can that be?”") + "</div>" +
          "<div>You had wondered how all of this was possible, ever since you were taken from Aigosthena to Delphi in an instant. " + this.thalesText("“I just assumed Athena used magic..”") + "</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>The old man chuckled. " + this.commonCharacterText("“A simple answer, but not wrong. I am Khronos, keeper of time. Yes, Athena approached me and together we devised a spell that would allow someone to slip in and out of the past to see those who are no longer living.") + "</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("When she first came to me, I must confess I did not like the idea. Time is a delicate thing, you see. But I relented for one reason. I think your journey is a necessary one. I hope that one day, you will be able to tell me truthfully what it means to be a hero. You, above all, will have the experience necessary. I wish you luck.”") + "</div>" +
          "<div>With that, the man turned and walked away. As you absorb the conversation that just occurred, you see Zosime making her way back to you. " + this.zosimeText("“Hey, we're up next. Ready?”") + "</div>";
    }
    else if (storyId === 12) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You win! The crowd of souls cheer as you make your way to the front of the arena. Hades sits here above all others, staring at you with a piercing gaze. " + this.hadesText("“Continue past the coliseum and you will find Charon ready to ferry you back to the surface. You are free to go, under one condition. Under <i>NO CIRCUMSTANCES</i> will the fools of Olympus be allowed to fall. I will not have them here. Now go.”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>As you make your way out of the arena, you find Hermes waiting for you at the front gates. " + this.hermesText("“Well done! Couldn't have done too much better myself. I think I may have been mistaken about you two. You're not wrong for the job, you just need a little guidance. Call on me when you need help, I'm never too far. See you around!”") + "</div>" +
          "<div>Free from gods for the time being, you begin the short trek to the ferryman of the Underworld.</div>";
    }
    else if (storyId === 13) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As you emerge from the Underworld, you feel the warmth of the sun on your skin for the first time in what feels like ages. You close your eyes against the brightness, hoping the sun will wash away some of your self-doubt as well. Your conversation with Khronos still lingers on your mind. What is it to be a hero? Am I really capable of answering that question?</div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“Any ideas on where to go next?”") + " Zosime asks you, snapping you out of your thoughts.</div>" +
          "<div>" + this.thalesText("“Before we fell, I felt invincible. As if there was nothing any hero had done that we couldn't do. But now, honestly, I don't know.”") + " You say to Zosime, uncertain.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Great, then I'll decide. Let's go to Calydon. I've idolized Atalanta for as long as I can remember. Once as a child, I spent hours in the forest looking for bears hoping they would take me in. I never thought I'd ever have the chance to walk in her footsteps like this. Considering we were just given a second chance… I can't miss this opportunity!”") + "</div>" +
          "<div>You nod your head, just happy to have someone else make the decision. " + this.thalesText("“Lead the way.”") + "</div>";
    }
    else if (storyId === 14) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As you make your way from the opening of the Underworld near Lake Lerna towards Calydon, Zosime insists on a detour through Mount Parthenion. The mountain is home to many a wild spirit and the birth place of several heroes' origin stories, Atalanta included. During a lull in your fighting, Zosime begins to tell you of her favorite hero.</div>" +
          "<div>" + this.zosimeText("“Somewhere in all this wilderness is where Atalanta was abandoned at birth. Can you imagine, a babe alone in a dangerous place like this? And yet, to survive and accomplish all that she did!”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Artemis took to her and she became one with the wilds. And in turn, she became Artemis's arrow.”") + "</div>" +
          "<div class='sceneDiv'>As Zosime recounts the events of the story, she kneels down to feel the earth below her feet. These grounds are obviously sacred to her. The sounds of approaching centaurs bring Zosime back to her feet. " + "</div>" +
          "<div>" + this.zosimeText("“Artemis has looked after me as well, when no one else would. Without her, I would never have made it this far. No matter how many times I fall, I won't fail her.”") + "</div>";
    }
    else if (storyId === 15) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The commotion and activity of Calydon is a welcome sight after your long journey. Even though you've now traveled all across Greece, seeing so many people in one place still amazes you. Outside of Delphi, this is the largest city you've ever been in. The intricate architecture of the buildings and array of goods for sale in the streets leaves you in awe and feeling a little overwhelmed.</div>" +
          "<div>If Zosime also felt this way, she did not show it. It was clear that she was ready to continue on and find the forest where Atalanta shed the blood of the Calydonian Boar for the first time. Somehow, it seems Zosime wasn't shaken at all by your encounter with Enceladus. Was this what it was like to be a hero, to ignore your failings and never stray from the path?</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>The famous stories you heard when you were young never included the messy details. You knew that Atalanta was raised in the forest and rose to legendary status by slaying the great boar. But what was life like in the in between?</div>" +
          "<div>Growing up alone in the hard wilderness, did her belief in herself ever waver? Even after she was known around Greece, did she falter when she was turned away from joining the other heroes on the Argo? How many times did she stumble before putting an arrow through the Calydonian Boar?</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>Perhaps the truth isn't that the heroes were simply greater than others, but their unyielding spirit allowed them to push forward when others would turn back. On the other hand, Atalanta was never swatted down like an insect by a Giant as far as you knew... You're pretty confident that if Athena had Atalanta instead of you, Enceladus would no longer have a head.</div>" +
          "<div>While you are lost in your own head, Zosime tracks down the path to the Calydonian Forest. The two of you step out of the city and into the wilderness once more, ready for whatever you may find.</div>";
    }
    else if (storyId === 16) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Like Atalanta before her, Zosime's arrow spells the end for the massive boar. " + this.thalesText("“Another one off your list, Zosime!”") + " You say as you catch your breath, caught up in the thrill of victory. She grins as she eagerly examines the boar. You can tell this moment means a lot to her. </div>" +
          "<div>The sound of leaves rustling immediately puts you on guard. You scan the trees nearby in search of the source and find a large stag with golden antlers. You take a few steps towards the animal and it immediately looks up at you, meeting your gaze.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“That's Artemis's stag!”") + " Zosime says from behind you. She begins a silent prayer as the majestic beast returns to grazing the forest. " + this.thalesText("“The gods are still with us.”") + " You whisper, feeling a great relief. What greater reassurance can you receive than to know that you may not believe in yourself, but the gods do?</div>" +
          "<div>The stag's grazing pattern eventually puts it out of sight. You attempt to follow it, but there is no tracking a beast whose very nature is the forest. You return to Zosime, still in prayer.</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>Whether you believe in yourself or not, whether you etch your name in the annals of history or not, you've decided it does not matter. You are needed, and you will try.</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“I've decided that we should go to Iolcus next. My favorite story as a child was Jason's travels. I loved to hear so many heroes working together. Besides, I've spent my whole life on the coast and I've been away for too long.”") + "</div>" +
          "<div>" + this.zosimeText("“What are we waiting for then?”") + " Zosime says cheerily, pleased to see you getting back to yourself. The two of you make your way out of the forest and make for the coastal village of Iolcus, birthplace of Jason.</div>";
    }
    else if (storyId === 17) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Upon arriving in Iolcus, the taste of salt in the air and smell of the sea immediately put you at ease. Your journey has taken you a long way from the safety and familiarity of home, but the sea was a welcome sight. </div>" +
          "<div>When Jason arrived at his homeland of Iolcus, he set out on a journey across the seas to regain the Golden Fleece and prove himself the rightful king to his people. He assembled a great band of heroes to help him on his journey including Heracles, Asclepius, and Orpheus. You were not quite so lucky, but after some discussion around town, you were able to secure travel on a vessel headed to Colchis.</div>";
    }
    else if (storyId === 18) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“Should be a straight shot through Hellespoint.”") + " The captain says to the two of you, pointing east. " + this.commonCharacterText("“And from there, it's on to the Black Sea.”") + "</div>" +
          "<div>" + this.commonCharacterText("“Heard some wild rumors around these parts.”") + " He continues, eyes on the sea. " + this.commonCharacterText("“Something strange going on with the land. Glad to have you two aboard in case something goes wrong.”") + " He gives you a nod and walks off, keeping a watchful eye over the crew.</div>";
      else if (pageCount === 2)
        sceneText = "<div>No matter what may come, you felt ready. At the beginning of your journey, you were filled with a bright-eyed confidence that was not earned. But now, you've overcome odds that most couldn't imagine. Maybe you aren't ready to slay a giant, but you're ready to give it your best shot.</div>";
    }
    else if (storyId === 19) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The captain decides to stop at an island near Propontis for the night. So far, your journey has gone without incident. Before resting for the night, you decide to stretch your legs and check out the island. Somewhere near here, the Argonauts once battled a mighty storm that left them disoriented and turned around. In the dark of night, the Argonauts and islanders mistook friend for foe and had a deadly clash.</div>" +
          "<div>Oddly, the island was so quiet that it was as if no one ever resettled here. You could see evidence of homes and walking paths, but no people. " + this.thalesText("“Where is everyone, do you think?”") + " You ask Zosime.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“In for the night maybe?”") + " She responds. In the darkness, it was hard to tell if people had passed through here or not. </div>" +
          "<div class='sceneDiv'>A loud noise jolts both you and Zosime to action. You could make out shapes in the night moving down the coastline towards your ship. You move back towards the vessel to head them off. " + this.zosimeText("“Why are they moving like that?”") + " Zosime asks you, hastening her pace.</div>" +
          "<div>The men moved with a consistent pace, like a soldier's march. But they were too clumsy to be soldiers. Every so often, one would trip over its own feet or run directly into a rock and fall. They seemed almost possessed, and they were making directly for your only way off of this island. You break into a sprint, keeping up with Zosime to head off this uncanny threat.</div>";
    }
    else if (storyId === 20) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>After escaping from the Propontis, the crew rowed through the night to get as far away as possible. Aside from that and a word of thanks from the captain, no one from the crew spoke any further of what you saw that unsettling night. </div>" +
          "<div>The men you faced were like puppets, moving in strange yet consistent fashion and making hardly any noise. Whatever was going on there, you hoped that would be the last you saw of it.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Before passing the Sympegades rocks, your crew puts in at Salmydessus, a small town off the coast.</div>" +
          "<div>The Sympegades is a known danger to all who try to pass through. Without warning, the rocks will slam together and crush any vessels caught in between. You and Zosime decide to get a closer look on foot before traveling through by water.</div>";
    }
    else if (storyId === 21) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You make your way up the treacherous path to an overlook near the top of the Sympegades. You stay for a while until finally another ship passes through the cliffs. All who pass through these rock walls know the stories. Tense, you watch on to see what happens.</div>" +
          "<div>The waves crash lazily into the rocks as the ship passes through the midway point, but nothing happens. You realize perhaps too late that standing near the peak of a moving cliffside is not the best idea, but nonetheless the ship makes it through with no issue.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“So we're being attacked by people who look dead but are alive, and things we expect to be alive seem dead. That's.. unsettling.”") + " Zosime says. You nod in agreement. Something is clearly wrong here. You hope that you have seen the last of these mindless husks, but you have a strong feeling that the closer you get to Colchis, the more you will see.</div>" +
          "<div>" + this.thalesText("“Well, at least we know the way is clear. Let's keep moving.”") + " You say.</div>";
    }
    else if (storyId === 22) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The closer you are to Colchis, the more of these inhuman abominations littered the coast. After finally breaking free from the pursuit out of Mariandynia, you take Zosime aside.</div>" +
          "<div>" + this.thalesText("“When Jason retrieved the Golden Fleece, the King of Colchis assigned him three impossible tasks. One was to defeat an army of men risen from the ground. I'm starting to think this could be the same magic.”") + " You say, mulling over the situation.</div>";
      if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“You think someone is doing this intentionally?”") + "</div>" +
          "<div>" + this.thalesText("“Maybe. We should be on our guard when we reach Colchis. It feels like whatever is going on here is deeper than just the stories.”") + "</div>";
    }
    else if (storyId === 23) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The captain of your vessel thanks you for your help. Without you, they would never have made it all the way to the edge of the Black Sea. You express your gratitude as well and part ways. As you make your way into town, it does not take long before the feeling of uneasiness returns.</div>" +
          "<div>You and Zosime try to ask the townsfolk about what you've seen, but no one cares to answer. You can't help but notice that, despite being a bustling city off the coast, much of the greenery around the city seems decaying. Unable to get a straight answer from the townspeople, you try to come up with another plan.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Let's just go straight to the King. If anyone would know what is going on here, it's him.”") + " Zosime says.</div> " +
          "<div>It would seem that is the only option left. " + this.thalesText("“I think that's what Jason would do, so we should too.”") + "</div>";
    }
    else if (storyId === 24) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You approach the grand doors to a palace near the center of Colchis. Two heavily armored guards stand stiffly near the doors. Before you can speak, they open the doors for you to enter. The entryway gives way to a great hall filled with intricate golden columns, majestic artwork, and vaulted ceilings. There was only one other person here, a man with eagle-like features seated in one of two thrones. </div>" +
          "<div class='sceneDiv'>You approach the throne and kneel down, showing respect for the king. </div>" +
          "<div>" + this.commonCharacterText("“Welcome! I am Aeëtes, the King of Colchis. You look like you've had quite the journey. What brings you to these lands?”") + " The King says, his voice filling the halls.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>You try not to show your shock on your face. Aeëtes still rules these lands? He was the King in Jason's time, many years ago. The pieces in your head start coming together. You must tread lightly. </div>" +
          "<div class='sceneDiv'>" + this.thalesText("“My King, my name is-”") + "</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“Do speak up! Humans have <i>such</i> weak voices.”") + "</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“My King,”") + " you say louder, " + this.thalesText("“I am Thales and my companion is Zosime. We-”") + "</div>" +
          "<div>" + this.commonCharacterText("“Ah, but I do not believe you are from these lands? I am not <i>your</i> King then. The distinction is quite important.”") + " Aeëtes says sternly.</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>Noticing your struggles, Zosime steps in. " + this.zosimeText("“King Aeëtes, we have traveled here from Iolcus and come with urgent news. From here to the Propontis, soulless men roam the seaside with no words or thoughts, only violence. Every village we stopped at was overrun with these monsters.”") + "</div>" +
          "<div class='sceneDiv'>Aeëtes's gaze moves to Zosime as she speaks, and for a moment you see disgust in his eyes. His voice does not betray him though as he continues the conversation.</div>" +
          "<div>" + this.commonCharacterText("“I see. Traveled from Iolcus, you say? I've heard tell of a pair traveling Greece, following after our most renowned heroes. How remarkable. As for your urgent news, I think it is rather common for violence to be at the heart of man. You seem well equipped to deal with a bandit or two.”") + "</div>";
      else if (pageCount === 4)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Bandits? These were no ordinary <i>bandits.</i> We barely escaped with our lives thanks be to the gods.”") + "</div>" +
          "<div class='sceneDiv'>His look of disgust returned. " + this.commonCharacterText("“I see. How grateful we must then be to the gods. Tell me, <i>why</i> are you here?”") + "</div>" +
          "<div>Finally finding your voice, you rejoin the conversation. " + this.thalesText("“It is as you said, King Aeëtes. We have been following the path of Jason so that we can become the hero he once was. We were just hoping to make it here and perhaps see the Grove of Ares where the Golden Fleece once was, at least that was our goal before we were attacked. We came to you hoping you would know more about what we have seen on our travels.”") + "</div>";
      else if (pageCount === 5)
        sceneText = "<div class='sceneDiv'>King Aeëtes's eyes lit up. " + this.commonCharacterText("“Of course! You want to be the great hero Jason once was. Then come, see the Grove.”") + "</div>" +
          "<div>He stands and walks straight through the door you entered without sparing a glance at either of you. You look to Zosime, concern on your face. Aeëtes was an incredibly powerful sorcerer, and incredibly intelligent. You would need to keep your guard up. Zosime begins to follow the King before he gets too far ahead of you, and you follow suit.</div>";
    }
    else if (storyId === 25) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You, Zosime, and Aeëtes make your way silently to the edge of the city. Despite how the King may act, his energy was unsettling and kept you on edge. The sooner you could be away from him, the better.</div>" +
          "<div class='sceneDiv'>Soon you come upon a beautiful grove known as the Grove of Ares. To your surprise, the Golden Fleece that Jason had once stolen away was hanging at the center of a great oak tree.</div>" +
          "<div>" + this.thalesText("“The Golden Fleece! It has returned?”") + " You say in surprise.</div>";
      if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Aeëtes smiled, but his voice turned icy. " + this.commonCharacterText("“It should be no surprise, the fleece was and is mine by right. I simply took back what belonged to me.") + "</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("How noble, the two of you emulating such great heroes. Tell me, what footsteps of mighty Jason's do you wish to follow? His heroic endeavors include coming to my homeland, stealing my treasures, and seeing to my son's death. Which of these great deeds are you hoping to accomplish?”") + "</div>"
      "<div>The more he speaks, the angrier he grows. Before you can formulate a response, he continues.</div>";
      if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“I have shown you what you wanted to see. I, in turn, have a request. You say you faced many of my people on your way here. I would like to see your power against theirs.”") + "</div>" +
          "<div>Aeëtes whispers a command, and immediately the lifeless husks rise from the earth. Within moments, you are surrounded. You have no choice but to fight your way out.</div>";
    }
    else if (storyId === 26) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>With each enemy you defeat, Aeëtes's thinly veiled rage grows. " + this.commonCharacterText("“Enough.”") + " He says, barely maintaining his calm. His smile is long gone, his face twisted in anger. </div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“I wanted to see your power and I've seen it. Your power over the dead interests me, even if the magic is not your own. Regardless, you've now overstayed your welcome.”") + "</div>" +
          "<div>Behind Aeëtes, a massive serpent slithers its way through the forest. The Colchis Dragon, known around Greece as the immortal denizen of the Groves of Ares. The serpent stops just short of its master, keeping a watchful eye on you.</div>";
      if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“The people of this city are mine and mine alone. They would throw themselves at you to protect their King. Shall I show you?”") + "</div>" +
          "<div class='sceneDiv'>Unbeknownst to you, a small mob of people began arriving during your trials. You look into the eyes of those closest to you and you see nothing behind them. Whatever witchcraft Aeëtes performed on the husks, it seems he has done on the people of this city as well. </div>" +
          "<div>If you are to cut Aeëtes down, you would have to fight all of Colchis to make it happen.</div>";
      if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>Begrudgingly, you begin to back out of the grove. Zosime follows your lead as the two of you make your way back through the city, the Colchians keeping a healthy distance. </div>" +
          "<div class='sceneDiv'>As you make your way back to the docks, it would seem the captain of your vessel has also been made to feel unwelcome. His ship is ready to sail.</div>" +
          "<div>" + this.zosimeText("“This place.. is like a nightmare.”") + " Zosime says to you as you board the ship. As soon as you step onto the boat, the Colchian people stop following and merely watch. In the distance, you can see Aeëtes behind them all, smiling again. " + this.thalesText("“I don't know how, but we will stop this.”") + " You say.</div>";
    }
    else if (storyId === 27) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>A black cloud follows you as you make your way back the way you came. A ship from Colchis follows as far as the Sympegades before turning back. Whatever Aeëtes is up to, he does not want you interfering. You make your way to the stern of the boat where Zosime is standing, looking back towards Colchis. </div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“That man is a monster. Did we do the right thing?”") + " She says, looking troubled. </div>" +
          "<div>You have been wrestling with the same question as well. Aeëtes was said to be immensely powerful, and the fear of failing your mission again no doubt impacted your decision. You close your eyes, trying to imagine how a hero would feel. What would Jason do?</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.thalesText("“We will return and set things right. I want to be the kind of hero who abolishes the evil in this world, and I've never seen more evil in my life than in Colchis.") + "</div>" +
          "<div class='sceneDiv'>" + this.thalesText("But we'll need to be stronger. We'll need to figure out a way to beat Aeëtes without sacrificing a city.") + "</div>" +
          "<div>" + this.thalesText("I've been thinking about this since we started our journey to Iolcus. I think it's time we attempt Heracles' trials again. If I want to be a hero, I have to be able to do what is right without fearing death. People need our help, and the only way we can do that is to keep moving forward.”") + "</div>";
    }
    else if (storyId === 28) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As you make your way through the roads surrounding Nemea, you can't help but feel immense gratitude. Your encounter with Enceladus feels like a lifetime ago, and if not for Zosime and the gods, you would not be here right now.</div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“No sign of any giants.”") + " Zosime says, returning from her scouting mission. " + this.zosimeText("We should be clear.”") + "</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“Great, hopefully we can avoid getting our heads knocked off this time!”") + " You respond cheerfully.</div>" +
          "<div>" + this.zosimeText("“Seems like you're in better spirits.”") + " Zosime responds.";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.thalesText("“I am. Thank you Zosime. If it wasn't for you, I would be spending the rest of my days in Asphodel full of regret. I couldn't have made it out of there without you.”") + " You say.</div>" +
          "<div class='sceneDiv'>She smiles. " + this.zosimeText("“We've been asked to do the impossible, I think it's okay to doubt yourself a little… as long as you get back up. I couldn't do this alone either. I'm glad I have you here with me.”") + "</div>" +
          "<div>You return her smile, and the two of you continue on to the heart of Nemea.</div>";
    }
    else if (storyId === 29) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As you finish off the Nemean Lion that once terrorized the citizens of Nemea, you begin the short trek back to Lake Lerna for the second trial of Heracles. The demi god was next tasked with disposing of the Lernean Hydra, a feat that even Heracles was not able to do alone. The task will not be any easier for you now.</div>";
    }
    else if (storyId === 30) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>After resupplying in Tiryns, you consider which path to take next. " + this.thalesText("“I know it's not how Heracles did it, but I think we should head to Stymphalia next. It's a lot closer, and there's no penalty for going out of order, right?”") + " You say. </div>" +
          "<div>" + this.zosimeText("“Makes sense to me.”") + " Zosime responds with a shrug as the two of you head in the direction of Heracles's sixth trial, the Stymphalian Birds. The birds, with beaks made of bronze and feathers as sharp as razors, were a constant nuisance over the countryside of Arcadia. Heracles required Athena’s assistance to bring the birds down, and you hope that the power Athena has already gifted to you will be enough to do the same.</div>";
    }
    else if (storyId === 31) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Every step you take up the frigid Mount Erymanthos has you once again wishing for the sea. The chill of the winter months was bad enough off of the coast of Aigosthena, but here you cannot seem to stay warm no matter how many layers you wear.</div>" +
          "<div>" + this.zosimeText("“We already fought this boar once, doesn't that count?”") + " Zosime laments, shivering under her own layers. The boar who once destroyed much of the Calydonian countryside was first captured and spared by Heracles on the top of Mount Erymanthos.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.thalesText("“Surely we're almost there now. Let's look just a little longer, or I might freeze to death out here.”") + " You reply.</div>" +
        "<div>The minutes come and go without any luck. Just as you decide to turn around and try again another day, you see the boar charging in your direction. You seem to have finally found its territory, and it was not happy to see you.</div>";
    }
    else if (storyId === 32) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Even the wintery chill of the sea breeze was a welcome reprieve from climbing mountains. Your journey has once again brought you to the seas, this time en route to the island of Crete. The largest island in Greece, Crete was no stranger to monsters and heroes.</div>" +
          "<div>The seventh trial of Heracles was to capture the Cretan Bull, perhaps most famous for being the father of the Minotaur. The Cretan Bull itself wreaked havoc throughout Greece, starting in Crete. Like Heracles before you, you intend to put an end to its destruction.</div>";
    }
    else if (storyId === 33) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The seasons change while you make your way to your next target. The snow gives way to sun as you travel towards two of the remaining labors far to the west on foreign soil. You must travel beyond Greece and past the desert of northern Libya. As the days of walking through the endless sand pass, you decide that the wind and snow weren't all that bad.</div>" +
          "<div>You hardly believe your eyes when you happen upon a hidden oasis in the middle of the desert. The deep green of the foliage and blue of the water is a welcome sight on your monotonous journey. You and Zosime quickly make your way to the water, taking a much needed break.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.thalesText("“First we'll make our way to the Garden of the Hesperides and see if we can get a golden apple. After that, we'll make way to the island of Erytheia and look for the cattle on Geryon’s farm. We can loop back from the north and finish up the few labors left on our way back home.”") + " You say, mentally recalling the maps of Heracles's travels you studied before leaving Greece.</div>" +
        "<div>" + this.zosimeText("“I'm glad you've got all of the stories memorized.”") + " Zosime replies while filling several canteens with water from the oasis. " + this.zosimeText("“Lead the way and I'm right beside you.”") + "</div>";
    }
    else if (storyId === 34) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>After defeating the serpent Ladon, you spend some time circling the famed garden. You are surprised to see so many people around. You approach an exasperated woman within the grove.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“Thieves! The lot of you!”") + " She shouts at the people picking golden apples from the orchards.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“You!”") + " She points towards you and Zosime. " + this.commonCharacterText("“If you can stop these thieves and bring me back their apples, I'll let you keep some for yourselves!”") + "</div>" +
          "<div><i><b>Golden Apples</b> have a chance to drop from certain enemies in the Fertile Fields, increasing your alchemy level.</i></div>";
    }
    else if (storyId === 35) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>With the demise of Geryon, your journey to the West is complete. You've completed more than half of Heracles's trials now, and the remainder of your journey lays back on the eastern side of Greece. </div>" +
          "<div>You journey back the way you came, reaching Cádiz and securing boat travel back to your homeland. On the first night of your return trip, you are greeted by a familiar face.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.hermesText("“You've accomplished quite a lot since the last time we spoke! You sure can go a lot further now that you have my power, huh?”") + " Hermes, Messenger of the gods, says to you. Before you can say much, he continues.</div>" +
          "<div>" + this.hermesText("“You've impressed quite a few of us on Olympus. Even father is ready to speak to you now.”") + " Zeus, father of Hermes, Athena, and many others, was seeking your presence. You felt equal parts excitement and anxiety. </div>";
      else if (pageCount === 3)        
          sceneText = "<div class='sceneDiv'>" + this.hermesText("“I think the Giants and the Titans are ready to make their move. Hopefully this time, they'll get the message that they can't beat us. Anyway, you should come as soon as you can!”") + " Hermes says just before taking flight, no doubt delivering another urgent message elsewhere.</div>" +
          "<div>You quickly make your way to tell the news to Zosime. It seems a change of plans was in order and that Heracles's trials would have to wait a little longer. Your destination was now Mount Olympus.</div>";
    }

    sceneText = sceneText.replaceAll("Thales", "<span class='adventurerColor storyCharacterName'>Thales</span>");
    sceneText = sceneText.replaceAll("Zosime", "<span class='archerColor storyCharacterName'>Zosime</span>");
    sceneText = sceneText.replaceAll("Athena", "<span class='athenaColor storyCharacterName'>Athena</span>");
    sceneText = sceneText.replaceAll("Hades", "<span class='hadesColor storyCharacterName'>Hades</span>");
    sceneText = sceneText.replaceAll("Hermes", "<span class='hermesColor storyCharacterName'>Hermes</span>");
    sceneText = sceneText.replaceAll("Artemis", "<span class='artemisColor storyCharacterName'>Artemis</span>");
    sceneText = sceneText.replaceAll("Heracles", "<span class='commonCharacterColor storyCharacterName'>Heracles</span>");
    sceneText = sceneText.replaceAll("Jason", "<span class='commonCharacterColor storyCharacterName'>Jason</span>");
    sceneText = sceneText.replaceAll("Odysseus", "<span class='commonCharacterColor storyCharacterName'>Odysseus</span>");
    sceneText = sceneText.replaceAll("Theseus", "<span class='commonCharacterColor storyCharacterName'>Theseus</span>");
    sceneText = sceneText.replaceAll("Perseus", "<span class='commonCharacterColor storyCharacterName'>Perseus</span>");
    sceneText = sceneText.replaceAll("Khronos", "<span class='commonCharacterColor storyCharacterName'>Khronos</span>");
    sceneText = sceneText.replaceAll("Orpheus", "<span class='commonCharacterColor storyCharacterName'>Orpheus</span>");
    sceneText = sceneText.replaceAll("Asclepius", "<span class='commonCharacterColor storyCharacterName'>Asclepius</span>");
    sceneText = sceneText.replaceAll("Atalanta", "<span class='commonCharacterColor storyCharacterName'>Atalanta</span>");
    sceneText = sceneText.replaceAll("Enceladus", "<span class='commonCharacterColor storyCharacterName'>Enceladus</span>");
    sceneText = sceneText.replaceAll("Aeëtes", "<span class='commonCharacterColor storyCharacterName'>AEËTES</span>");
    sceneText = sceneText.replaceAll("Aeetes", "<span class='commonCharacterColor storyCharacterName'>AEËTES</span>");

    return sceneText;
  }

  handleScene(deltaTime: number) {
    this.globalService.globalVar.isBattlePaused = true;
    if (this.globalService.globalVar.currentStoryId === 0) {
      this.pageCount = 2;
    }

    if (this.globalService.globalVar.currentStoryId === 1) {
      this.pageCount = 2;
    }

    if (this.globalService.globalVar.currentStoryId === 2) {
      this.pageCount = 2;
    }

    if (this.globalService.globalVar.currentStoryId === 3) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 4) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 5) {
      //After Ambracian Gulf
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 6) {
      //After Medusa
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 7) {
      //Before Enceladus
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 8 && this.showFirstTimeUnderworldStory) {
      //Before Underworld
      this.pageCount = 2;

    }
    if (this.globalService.globalVar.currentStoryId === 9) {
      //Speak to Hades for the first time
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 10) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 11) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 12) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 13) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 14) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 15) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 16) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 17) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 18) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 19) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 20) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 21) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 22) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 23) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 24) {
      this.pageCount = 5;
    }
    if (this.globalService.globalVar.currentStoryId === 25) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 26) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 27) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 28) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 29) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 30) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 31) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 32) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 33) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 34) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 35) {
      this.pageCount = 3;
    }

    this.sceneText = this.getStoryText(this.globalService.globalVar.currentStoryId, this.currentPage);

    var isAutoProgressOn = this.globalService.globalVar.settings.get("autoProgress") ?? false;
    var isPauseAutoProgressOn = this.globalService.globalVar.settings.get("autoProgressPauseStory") ?? false;
    if (this.globalService.globalVar.timers.scenePageLength !== this.globalService.globalVar.timers.pauseStorySpeed &&
      !(isAutoProgressOn && isPauseAutoProgressOn))
      this.globalService.globalVar.timers.scenePageTimer += deltaTime;
    if (this.globalService.globalVar.timers.scenePageTimer >= this.globalService.globalVar.timers.scenePageLength) {
      this.globalService.globalVar.timers.scenePageTimer = 0;
      this.currentPage += 1;
    }

    if (this.currentPage > this.pageCount) {
      this.globalService.globalVar.currentStoryId += 1;
      this.currentPage = 1;
      this.showStory = false;
      this.globalService.globalVar.isBattlePaused = false;
      var subzone = this.balladService.getActiveSubZone();

      //post story events, if any
      if (this.globalService.globalVar.currentStoryId === 1) {
        this.globalService.globalVar.isBattlePaused = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.AutoAttack, undefined, undefined, true, subzone.type));

        if (this.deviceDetectorService.isMobile())
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.MobileOverlay, undefined, undefined, true, subzone.type));
      }
      if (this.globalService.globalVar.currentStoryId === 3) {
        this.globalService.globalVar.settings.set("autoProgress", false);
        this.balladService.setActiveSubZone(SubZoneEnum.DodonaDelphi);
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Town, undefined, undefined, true, SubZoneEnum.DodonaDelphi));
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.SkipStory, undefined, undefined, true, SubZoneEnum.DodonaDelphi));
      }
      if (this.globalService.globalVar.currentStoryId === 6) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Crafting, undefined, undefined, true, subzone.type));
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(ItemsEnum.Aegis)?.quality);
        var itemName = "<span class='" + qualityClass + "'>Aegis</span>";
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Athena gives you her shield " + itemName + ".");
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Aegis, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
      }
      if (this.globalService.globalVar.currentStoryId === 8) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Warning, "<b><i>You will temporarily lose access to previous Ballads after completing the following battle.</i></b>");
      }
      if (this.globalService.globalVar.currentStoryId === 9) {
        this.showFirstTimeUnderworldStory = false;
        this.triggerFirstTimeUnderworldScene = false;
        this.endFirstTimeUnderworldScene = true;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Notifications, undefined, undefined, true, subzone.type));
        setTimeout(() => {
          this.endFirstTimeUnderworldScene = false;
        }, 5000);
      }
      if (this.globalService.globalVar.currentStoryId === 10) {
        var theDepths = this.balladService.findSubzone(SubZoneEnum.AsphodelTheDepths);
        if (theDepths !== undefined) {
          theDepths.isAvailable = true;

          this.achievementService.createDefaultAchievementsForSubzone(theDepths.type).forEach(achievement => {
            this.globalService.globalVar.achievements.push(achievement);
          });
        }
      }
      if (this.globalService.globalVar.currentStoryId === 14) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.SideQuests, undefined, undefined, true, subzone.type));
        var championBallad = this.balladService.findBallad(BalladEnum.Champion);
        if (championBallad !== undefined)
          championBallad.isAvailable = true;

        var gorgonBallad = this.balladService.findBallad(BalladEnum.Gorgon);
        if (gorgonBallad !== undefined)
          gorgonBallad.isAvailable = true;

        var boarBallad = this.balladService.findBallad(BalladEnum.Boar);
        if (boarBallad !== undefined)
          boarBallad.isAvailable = true;
      }

      if (this.globalService.globalVar.currentStoryId === 17) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.SideQuest, "A new side quest is available in the Ballad of the Underworld.");
      }

      if (this.globalService.globalVar.currentStoryId === 25) {
        var groveOfAres = this.balladService.findSubzone(SubZoneEnum.ColchisGroveOfAres);
        if (groveOfAres !== undefined) {
          groveOfAres.isAvailable = true;
          groveOfAres.notify = true;

          this.achievementService.createDefaultAchievementsForSubzone(groveOfAres.type).forEach(achievement => {
            this.globalService.globalVar.achievements.push(achievement);
          });
        }
      }
    }

    return this.showStory;
  }

  displayOptionalScene(scene: OptionalSceneEnum) {
    this.showOptionalStory = scene;
    this.returnedFromOptionalScene = false;
  }

  getOptionalStoryText(scene: OptionalSceneEnum, pageCount: number) {
    var sceneText = "";

    if (scene === OptionalSceneEnum.HecateAlchemy) {
      if (pageCount === 1)
        sceneText = "You make your way around the great hall of the Palace, inspecting numerous trinkets and oddities. Despite the never ending stream of souls awaiting their judgment, the palace remained exceptionally quiet. The sound of clinking glasses in a room off to the side draws your attention.";
      else if (pageCount === 2)
        sceneText = "You enter into a room filled with an array of flowers, herbs, vials, and scents. You marvel at the sheer number of plants that you wouldn't expect to make it in the underworld.<br/><br/>" +
          this.commonCharacterText("“Hello child. Can I help you?”") + " Asked the goddess Hecate, her back turned to you as she prepared herbs in a bowl. A black dog laid curled up to the goddess's right with its eyes on you. You feel warmth emanating from the pair.<br/><br/>" +
          this.thalesText("“Sorry, I was just passing by and was curious.”") + " <br/><br/>" +
          this.commonCharacterText("“You do not need to apologize. Come, you may join me.”");
    }
    if (scene === OptionalSceneEnum.ChthonicFavor) {
      if (pageCount === 1)
        sceneText = this.commonCharacterText("“Psst. Hey, you.”") + " You hear a voice echoing from the back side of the great hall. Walking towards the voice, you find a ghastly spirit huddled in a corner. " + this.commonCharacterText("“Listen, I got what you need if you got what I want. And what I want is a little taste of Olympus.  Understand? You give me a little of what you got, and I'll put in a good word around here.”");
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade1Scene1) {
      if (pageCount === 1)
        sceneText = "As you make your way through Elysium, you notice a shade darting towards you. All of the shades you've seen look more or less the same, but theres something familiar about this one.<br/><br/>" +
          this.commonCharacterText("“Hey hey, you two remember me don'tcha? We met back at the palace! You scratch my back, I scratch yours, remember?”") + " The shade says, floating around you. That's right -- this is the one who claimed to help you out in exchange for the favor of the gods.";
      else if (pageCount === 2)
        sceneText = this.commonCharacterText("“Listen, I don't know if you've noticed but we're supposed to be in a little paradise down here right? Elysium's where all the important people get to sit around on little islands and enjoy the sea breeze and the waves off the coast. But there's no breeze! No waves!") + "<br/><br/>" +
          this.commonCharacterText("You're pretty tough. Won a whole bunch of fights at the coliseum right? I think something's upsetting the big guy. He gets that way sometimes. You know, Oceanus? Big titan, in charge of all the rivers? Look, you go down the river to the coast and see what's wrong, and I'll make it worth you're while alright? I can't take anymore yapping from the other shades about no breeze!”");
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade1Scene2) {
      if (pageCount === 1)
        sceneText = "You step into the still waters off the coast of Elysium and look out across the sea separating the living from the dead. You share a look with Zosime who shrugs her shoulders. " + this.zosimeText("“What are we doing here, exactly?”") + " She wonders aloud.<br/><br/>" +
          this.commonCharacterText("“Who dares to step into the great ocean without paying the proper respects!?”") + " Comes from a voice deep in the waters. A creature  rose from the depths looking eerily human, yet it was anything but. " + this.commonCharacterText("“I am Acheron, son of Oceanus. You shall leave this place!”");
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade1Scene3) {
      if (pageCount === 1)
        sceneText = "As your fight winds down, Acheron finally seems to calm down. " + this.thalesText("“We mean no disrespect. We come as representatives of the souls of Elysium. We wish to honor Oceanus how he deserves, and more souls will come to pray here daily. Please accept our praise.”") + " You say, kneeling down.<br/><br/>" +
          this.commonCharacterText("“That is a start. See that it continues.”") + " Acheron says, sinking back into the depths of the sea.";
      else if (pageCount === 2)
        sceneText = "As soon as Acheron is out of sight, the familiar shade darts towards you again. " + this.commonCharacterText("“I saw the whole thing! How much prayin' does someone need, I mean sheesh! Well, I'll let the boys know to start coming out here and say sweet nothins' to Oceanus if they want their sea breeze. You start coming by at the palace and I'll sweeten our deal alright?”");
    }
    if (scene === OptionalSceneEnum.CalydonDenMother) {
      if (pageCount === 1)
        sceneText = this.thalesText("“Here!”") + " You exclaim after catching a glimpse of a trail. You've watched Zosime examining animal tracks in search of the boar and finally found some yourself. " + this.thalesText("“It's this way!”") + " You call out, excitedly following your new found trail.<br/><br/>" +
          "Zosime follows behind you more cautiously, seeing the tracks for the first time. " + this.zosimeText("“Thales… I don't think these are boar tracks.”") + " She says as she catches up to you. The tracks have led you down a wooded ravine to a small cave. As you peek your head inside expecting to see your prey, you are instead greeted by the angry bear who lives in this cave.";
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade2Scene1) {
      if (pageCount === 1)
        sceneText = "Your journey has brought you to and from the Underworld more than you ever expected. If you look past the fiery pits and distressed souls, the calm was quite relaxing. The calm was often interrupted, however, by your friendly bartering shade.<br/><br/>" +
          this.commonCharacterText("“Hey! Just the two I wanted to see!”") + " Came from just the shade as you were traveling through Asphodel.<br/><br/>" +
          this.commonCharacterText("“Got another problem for ya if you've got the time!”");
      else if (pageCount === 2)
        sceneText = this.commonCharacterText("“Look, we got a good thing going down here. The big guy doesn't just let all of us waltz in and out whenever we want like you, sure, but it beats what happened to all the feisty little guys that keep picking fights with ya!") + "<br/><br/>" +
          this.commonCharacterText("Back in the day, everyone down in Asphodel had to drink from the river and lose their damn mind! Bit by bit you just forget everything you know until you got nothing left. But that all changed once the boss brought his Queen down here. Things started getting a little more lax around here, and so did all the people who enforce the rules!”");
      else if (pageCount === 3)
        sceneText = this.commonCharacterText("“But here's the thing. I don't know what it is, but somethin's going on with Hypnos. He usually just sleeps in his little cave on the Lethe, but there's been some reeeeal weird sounds coming from over there. Check it out for me, will ya? I don't want anything rocking the boat down here! One god starts complaining, then another, next thing you know boss is gonna be ruling with an iron fist again!”");
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade2Scene2) {
      if (pageCount === 1)
        sceneText = "The closer you get to Hypnos' isle, the darker it seems to be. By the time you reach the island, you can barely see your own hand in front of your face. You exit the ferry taking you across the Lethe and carefully make your way to Hypnos' resting place.<br/><br/>" +
          "When you arrive, you find Hypnos sleeping as he often is. A dark shadow looking exactly like Hypnos stands above him, whispering into his ear and causing Hypnos fits while he sleeps. The shadow notices you immediately as you enter, focusing its gaze on you and beginning to speak the same nightmares it was sharing with Hypnos to you.";
    }
    if (scene === OptionalSceneEnum.ChthonicFavorUpgrade2Scene3) {
      if (pageCount === 1)
        sceneText = "With a final blow, the shadow dissolves into nothingness. Almost immediately, the area brightens back to normal levels. All of the fighting seems to have barely phased Hypnos, although he did seem to waken.<br/><br/>" +
          this.commonCharacterText("“I was having quite the nightmare. Thanks for that...”") + " He murmurs, falling back asleep. Your job complete, you make your way back to the shade to deliver the good news.";
    }
    if (scene === OptionalSceneEnum.Jewelcrafting) {
      if (pageCount === 1)
        sceneText = "You walk around the marketplace while soaking in the breeze coming off of the sea. Being near the sea gives you a level of peace that had been missing in your travels. It was not so long ago that all you knew was Aigosthena.<br/><br/>" +
          "The sound of metal on metal breaks your focus and draws your attention. Following the sound, you come upon an outdoor stall in front of a smaller work area.";
      if (pageCount === 2)
        sceneText = "Moving to the stall, you see people working with delicate jewelry. Intricately designed pieces were being shaped and set with sparkling gemstones. <br/><br/>" +
          "A woman behind the stall notices your curiosity. " + this.commonCharacterText("“Beautiful, isn't it? You look like the type with a discerning eye and delicate touch. If you're interested, bring the materials and we'll show you how to do this yourself. For a small fee, of course.”");
    }
    if (scene === OptionalSceneEnum.TraderIntro) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>On your return trip to Nemea, you stop at the small village of Cleonea to prepare for Heracles's first trial. Even though it is the first, no trial will be easy and you do not want to rush in overconfident. As you enter the village, you notice a large wagon stopped just before the entrance and a man frantically collecting goods scattered across the fields.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“The best guards of the Pelopos Nisos, huh? I hope the crows take the lot of you!”") + " You hear him muttering as you and Zosime approach him.</div>" +
          "<div>" + this.zosimeText("“Need some help?”") + " Zosime asks as she helps the man lift a particularly heavy box full of various types of leather.</div>";
      if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“What I need is my money back! …But yes, some help would be nice, thank you.”") + " The man says as he struggles to put the box into place.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“My lifelong dream has been to travel Greece and trade amongst the people. To become the greatest merchant there ever was!") + "</div>" +
          "<div>" + this.commonCharacterText("But I'm not the fighting type, you see? I finally saved up enough money to hire some help and away we finally were! We barely made it a day before they turned tail and ran from a pack of hyenas, with my money! This is just what I was able to escape with, but my goods are scattered out there, no doubt being sullied by those beasts!”") + "</div>";
      if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>The man lets out a big sigh as he starts to walk towards the next box.</div>" +
          "<div>" + this.commonCharacterText("“You two look like you can handle yourselves. Do you think you could bring back my goods? If you can help me, I'd be more than happy to trade with you!”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables1) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>While traveling through Elis, you decide to stop at the Augean Stables, location of Heracles's fifth trial. The demigod was tasked with cleaning the stables, home to divine immortal livestock. In Heracles's time, the stables had not been cleaned in 30 years. As you approach, you are thankful to see that the area has been kept clean since then.</div>" +
          "<div>As you reach the stables, you notice two things. One, the animals here are some of the most beautiful you have ever seen. Each animal has an aura about them that looked truly divine and pristine. The second thing you notice was that the stables themselves were the opposite, looking almost as if they could collapse at any moment.</div>";
      if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>A man stood nearby, inspecting the stables. You hear him muttering to himself as you walk his direction.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“...could only get the door to latch, then...”") + " He says, puzzled by his current predicament.</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“Hi there.”") + " You say. " + this.thalesText("“Anything we can help with?”") + "</div>" +
          "<div>The thinking man ponders his situation for a further moment, then turns to you. " + this.commonCharacterText("“The livestock here have been taken care of since the time of King Phyleus. Money has flowed in to take care of the animals, but the stables themselves have fallen by the wayside… I'm trying to make do with what I have. If you have any resources I could use, you would have my thanks.”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables2) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“Thank you! With your help, I can fix the door and keep the livestock separated.”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables3) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You approach the stables once more, finding the man once again pondering its state. " + this.commonCharacterText("“...could cover this section, but there's just not enough for the whole barn...”") + "</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“Hi again.”") + " You say. " + this.thalesText("“Anything we can help with?”") + "</div>" +
          "<div>" + this.commonCharacterText("“Now that you mention it...”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables4) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“Thank you! With your help, I can fix the roof and keep the rain off the livestock.”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables5) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You approach the stables once more, finding the man once again pondering its state. " + this.commonCharacterText("“...could just secure these two walls, then...”") + "</div>" +
          "<div class='sceneDiv'>" + this.thalesText("“Hi again.”") + " You say. " + this.thalesText("“Anything we can help with?”") + "</div>" +
          "<div>" + this.commonCharacterText("“Now that you mention it...”") + "</div>";
    }
    if (scene === OptionalSceneEnum.AugeanStables6) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“Thank you! With your help, I can fix up the walls and keep the livestock out of the elements.") + "</div>" +
          "<div>" + this.commonCharacterText("“I think that will just about do it. You know, while I was working I stumbled upon this weird rock. I'm not quite sure what to do with it, but maybe you can make use of it?”") + "</div>";
    }

    sceneText = sceneText.replaceAll("Thales", "<span class='adventurerColor storyCharacterName'>Thales</span>");
    sceneText = sceneText.replaceAll("Zosime", "<span class='archerColor storyCharacterName'>Zosime</span>");
    sceneText = sceneText.replaceAll("Athena", "<span class='athenaColor storyCharacterName'>Athena</span>");
    sceneText = sceneText.replaceAll("Hades", "<span class='hadesColor storyCharacterName'>Hades</span>");
    sceneText = sceneText.replaceAll("Hermes", "<span class='hermesColor storyCharacterName'>Hermes</span>");
    sceneText = sceneText.replaceAll("Artemis", "<span class='artemisColor storyCharacterName'>Artemis</span>");
    sceneText = sceneText.replaceAll("Hecate", "<span class='commonCharacterColor storyCharacterName'>Hecate</span>");
    sceneText = sceneText.replaceAll("Acheron", "<span class='commonCharacterColor storyCharacterName'>Acheron</span>");
    sceneText = sceneText.replaceAll("Oceanus", "<span class='commonCharacterColor storyCharacterName'>Oceanus</span>");
    sceneText = sceneText.replaceAll("Orpheus", "<span class='commonCharacterColor storyCharacterName'>Orpheus</span>");
    sceneText = sceneText.replaceAll("Asclepius", "<span class='commonCharacterColor storyCharacterName'>Asclepius</span>");
    sceneText = sceneText.replaceAll("Hypnos", "<span class='commonCharacterColor storyCharacterName'>Hypnos</span>");
    sceneText = sceneText.replaceAll("Atalanta", "<span class='commonCharacterColor storyCharacterName'>Atalanta</span>");
    sceneText = sceneText.replaceAll("Heracles", "<span class='commonCharacterColor storyCharacterName'>Heracles</span>");
    sceneText = sceneText.replaceAll("Heracles's", "<span class='commonCharacterColor storyCharacterName'>Heracles's</span>");

    return sceneText;
  }

  handleOptionalScene(deltaTime: number) {
    this.globalService.globalVar.isBattlePaused = true;
    if (this.showOptionalStory === OptionalSceneEnum.HecateAlchemy) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavor) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade1Scene1) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade1Scene2) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade1Scene3) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.CalydonDenMother) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade2Scene1) {
      this.pageCount = 3;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade2Scene2) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade2Scene3) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.Jewelcrafting) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.TraderIntro) {
      this.pageCount = 3;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables1) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables2) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables3) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables4) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables5) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.AugeanStables6) {
      this.pageCount = 1;
    }

    this.sceneText = this.getOptionalStoryText(this.showOptionalStory, this.currentPage);

    if (this.globalService.globalVar.timers.scenePageLength !== this.globalService.globalVar.timers.pauseStorySpeed)
      this.globalService.globalVar.timers.scenePageTimer += deltaTime;
    if (this.globalService.globalVar.timers.scenePageTimer >= this.globalService.globalVar.timers.scenePageLength) {
      this.globalService.globalVar.timers.scenePageTimer = 0;
      this.currentPage += 1;
    }

    if (this.currentPage > this.pageCount) {
      this.globalService.globalVar.isBattlePaused = false;
      if (this.showOptionalStory === OptionalSceneEnum.HecateAlchemy) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Hecate provides you with 15 Olives and Fennel.");
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Olive, 15);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 15);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
      }
      if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavor) {
        this.globalService.globalVar.chthonicPowers.isChthonicResetUnlocked = true;
      }
      if (this.showOptionalStory === OptionalSceneEnum.ChthonicFavorUpgrade2Scene3) {
        this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked = true;
      }
      if (this.showOptionalStory === OptionalSceneEnum.TraderIntro) {        
        this.globalService.globalVar.sidequestData.traderHuntLevel = 1;
      }
      if (this.showOptionalStory === OptionalSceneEnum.AugeanStables2) {
        this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 10.");
      }
      if (this.showOptionalStory === OptionalSceneEnum.AugeanStables4) {
        this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 10.");
      }
      if (this.showOptionalStory === OptionalSceneEnum.AugeanStables6) {
        this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 5.");

        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RadiatingHolyStone, 1);
        if (resource !== undefined) {
          this.lookupService.gainResource(resource);
        }

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive 1 " + this.dictionaryService.getItemName(ItemsEnum.RadiatingHolyStone) + " and learn the Jewelcrafting recipe to craft it.");
        this.professionService.learnRecipe(ProfessionEnum.Jewelcrafting, ItemsEnum.RadiatingHolyStone);
      }

      this.currentPage = 1;
      this.globalService.globalVar.optionalScenesViewed.push(this.showOptionalStory);
      this.lookupService.addSideStoryToLog(this.showOptionalStory, this.balladService.getActiveSubZone().type);
      this.showOptionalStory = OptionalSceneEnum.None;
      this.returnedFromOptionalScene = true;
    }

    if (this.showOptionalStory === OptionalSceneEnum.None)
      return false;
    else
      return true;
  }

}
