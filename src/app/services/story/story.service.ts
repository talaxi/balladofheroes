import { Injectable, Optional } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
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
import { GodEnum } from 'src/app/models/enums/god-enum.model';

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
    else if (this.globalService.globalVar.currentStoryId === 36 && this.balladService.getActiveSubZone().type === SubZoneEnum.MountOlympusUpTheMountain)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 37 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.MountOlympusMytikasSummit))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 39 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.HuntForYarrowTrailFork3))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 40 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.HuntForYarrowYarrowField))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 41 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.WarForTheMountainOpenCourtyard))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 42 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.WarForTheMountainThePeak))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 43 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.CreteTravelsAtSea))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 44 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.CreteWhirlpool))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 45 && this.balladService.getActiveSubZone().type === SubZoneEnum.CreteKnossos)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 46 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.TheLabyrinthLabyrinthCenter))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 47 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AiaiaBreezyDays))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 48 && this.balladService.getActiveSubZone().type === SubZoneEnum.AiaiaCircesHome)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 49 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.AiaiaFlowerGarden))
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 50 && this.balladService.getActiveSubZone().type === SubZoneEnum.StraitsOfMessinaUnavoidablePath)
      this.showStory = true;
    else if (this.globalService.globalVar.currentStoryId === 51 && this.lookupService.getSubZoneCompletionByType(SubZoneEnum.StraitsOfMessinaUnavoidablePath))
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

  poseidonText(text: string) {
    return "<span class='poseidonColor bold'>" + text + "</span>";
  }

  hermesText(text: string) {
    return "<span class='hermesColor bold'>" + text + "</span>";
  }

  zeusText(text: string) {
    return "<span class='zeusColor bold'>" + text + "</span>";
  }

  athenaText(text: string) {
    return "<span class='athenaColor bold'>" + text + "</span>";
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
          "<div class='sceneDiv'>Free from gods for the time being, you begin the short trek to the ferryman of the Underworld.</div>";
        else if (pageCount === 3)
          sceneText = "<div class='sceneDiv s4Heading bold textCentered sidequestText'>Coliseum Available!</div>" +
          "Return to the coliseum throughout your journey for increasingly more difficult and rewarding battles. Use the special <b class='smallCaps'>Eternal Melee</b> fight to gain a massive amount of experience for your entire team.";
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
          "<div class='s4Heading bold textCentered sidequestText'><b>Golden Apples</b> have a chance to drop from certain enemies in the Fertile Fields, increasing your Alchemy level.</div>";
    }
    else if (storyId === 35) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>With the demise of Geryon, your journey to the West is complete. You've completed more than half of Heracles's trials now, and the remainder of your journey lays back on the eastern side of Greece. </div>" +
          "<div>You journey back the way you came, reaching Cádiz and securing boat travel back to your homeland. On the first night of your return trip, you are greeted by a familiar face.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.hermesText("“You've accomplished quite a lot since the last time we spoke! You sure can make it a lot further now that you have my power, huh?”") + " Hermes, Messenger of the gods, says to you. Before you can say much, he continues.</div>" +
          "<div>" + this.hermesText("“You've impressed quite a few of us on Olympus. Even father is ready to speak to you now.”") + " Zeus, father of Hermes, Athena, and many others, was seeking your presence. You felt equal parts excitement and anxiety. </div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.hermesText("“He believes the Giants and the Titans are ready to make their move. Hopefully this time, they'll get the message that they can't beat us. Anyway, you should come as soon as you can!”") + " Hermes says just before taking flight, no doubt delivering another urgent message elsewhere.</div>" +
          "<div>You quickly make your way to tell the news to Zosime. It seems a change of plans was in order and that Heracles's trials would have to wait a little longer. Your destination was now Mount Olympus.</div>";
    }
    else if (storyId === 36) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You make your way to the base of Mount Olympus with great haste. The peaks are farther than the eye can see, extending into the clouds. </div>" +
          "<div class='sceneDiv'>As you take your first steps up the mountain, you think back to the days spent on Aigosthena. You loved to read the stories of the gods, but never expected to be a part of them yourself. You've met gods, faced monsters, and ascended from the Underworld. </div>" +
          "<div>Although you feel some trepidation, most importantly you feel ready. You know that you can do this. Each step you take up the mountain is one step closer to becoming the hero you know you can be.</div>";
    }
    else if (storyId === 37) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>All around you, you notice the sprites begin to behave differently. Air Sprites dance in the wind, Fire Sprites lash playfully out at one another, Lightning Sprites dive from the clouds to the earth.</div>" +
          "<div>" + this.zosimeText("“This area is teeming with magic. We must be close!”") + " Zosime says, picking up her pace. Before long, you reach the peak of Mytikas and are greeted with an ornate golden gate. As if noticing your presence, the gate slowly opens itself allowing you entry into the home of the gods.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>As you step inside, you are immediately awed by the sights. Massive ornate palaces surround a large open plaza. It is quiet as you approach, and you only notice a few areas of activity. The sound of metal on metal draws your attention, likely the god Hephaestus  preparing for war. Several of the Oceanids make their way towards one of the palaces, perhaps speaking to the gods on Oceanus's behalf.</div>" +
          "<div class='sceneDiv'>One particular palace stands out among all of the others in its size and detail. This could only belong to the King of Gods.</div>" +
          "<div>" + this.thalesText("“Let's speak to Zeus and see what we can do to help prepare.”") + " You say.</div>";
    }
    else if (storyId === 38) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The inside of the extravagant palace mirrors the outside, with hallway after hallway of beautiful ornaments and gilded paths. You make your way to the inner sanctum of the palace to find Zeus meeting with the Oceanids. You anxiously await your turn to speak, but the King of Gods immediately rises at the sight of you. Did he seem angry?</div>" +
          "<div class='sceneDiv'>" + this.zeusText("“And look who finally decided to show up.”") + " He bellows, his voice booming throughout the halls.</div>" +
          "<div>You and Zosime both immediately kneel, anxiously dropping your heads. You were not sure what to expect, and your mind raced for answers on your delayed journey.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Zeus bursts into laughter. " + this.zeusText("“Merely a joke! Rise, rise!”") + " He says, making his way towards you. " + this.zeusText("“Don't look so frightened! My daughters believe you will be the key to protecting our home. I see it as well.”") + " He continues, inspecting the two of you. " + this.zeusText("“Yes, yes, I think you will do handsomely.”") + "</div>" +
          "<div>His jovial demeanor shifts into a more serious posture. " + this.zeusText("“War is right on our doorstep. These envoys of Oceanus tell me that the Giants will arrive within the day and the Titans right behind them. The time has come.”") + "</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.zeusText("“I have a task for you before it is too late. Do you know of the yarrow plant? There is a field nearby that grows the exact yarrow I need for our preparations. The only field in all of Greece to grow it. It will be a dangerous journey! But a necessary one. Retrieve this for me. Then our preparations will be complete, and I will know for sure you are who we need.”") + "</div>" +
          "<div class='sceneDiv'>You nod fervently. " + this.thalesText("“We will return with what you need, King of Gods.”") + "</div>" +
          "<div>Zeus bursts into laughter again. " + this.zeusText("“Yes, please, and do be quick about it. I will aid you with my power just in case.”") + "</div>";
    }
    else if (storyId === 39) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“What do you think the yarrow is for?”") + " Zosime asks, cutting back the brush of the pathless greenery.</div>" +
          "<div>" + this.thalesText("“Some sort of magical defense, maybe?”") + " You reply as you follow. " + this.thalesText("“It sounds like we arrived just in time. This is our chance to prove ourselves.”") + "</div>";
    }
    else if (storyId === 40) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You collect a healthy amount of yarrow and hurry back to Olympus. The courtyard was beginning to fill up with more familiar faces. You see Athena making the rounds and having conversations with her siblings. Hermes had forgone his traditional attire and donned armor instead. You quickly make your way to Zeus with the yarrow he requested.</div>" +
          "<div class='sceneDiv'>" + this.zeusText("“You're back! And just in time.”") + " He says after you present him with his request. " + this.zeusText("“Very good. With this, we're ready for the victory celebration!”") + "</div>" +
          "<div>" + this.thalesText("“The -- what?”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Zeus laughs at your confusion. " + this.zeusText("“This yarrow makes the perfect Ambrosia! It's been too long since we had a proper reason to celebrate.”") + "</div>" +
          "<div class='sceneDiv'>A horn sounds from outside. Zeus places the yarrow to his side and stands from his throne.</div>" +
          "<div>" + this.zeusText("“It is time. Come.”") + "</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>You walk with Zeus to the gates of Olympus. In the distance, you see numerous giants coming your way. You glance towards Zosime, who gives you a reassuring nod back. Almost all of the Olympian gods surround you, although Hades was noticeably absent.</div>" +
          "<div class='sceneDiv'>" + this.zeusText("“Open the gates.”") + " Zeus commands. " + this.zeusText("“I've waited long enough. Let's not drag this out.”") + "</div>" +
          "The giants begin to pick up speed as the gates open. You do not see any titans, but you knew they would be close. You tried to focus on the impending threat. The gods would be better suited to battle the gargantuan titans, and you had a score to settle with the giants. As the first wave makes it to the gates, you charge in to greet them.";
    }
    else if (storyId === 41) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You take a moment to catch your breath and scan the battlefield. Some giants had pushed forward into the main courtyard of Olympus, but had not made much success beyond that. Ares remained near the gates, a one god army drawing blood from every giant who attempted to enter. You catch sight of Apollo bringing a giant down with an arrow to the skull and Poseidon doing battle with two giants himself.</div>" +
          "<div>You were correct to be weary of the titans. Shortly after the giants pushed through the gates, they made their move. Zeus quickly engaged the massive Hyperion while Athena and Hermes were doing battle with Coeus between palaces.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Between all of the battling, you notice two giants splitting from the main group. One was heading towards Zeus's palace, the other towards the royal stables.</div>" +
          "<div>" + this.zosimeText("“Thales! Take the stables, I've got the palace!”") + " Zosime shouts, heading after the giant going to the palace. You in turn make for the stables. </div>";
    }
    else if (storyId === 42) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Slowly but surely, you are able to stymie the giant threat. As more and more of the gods are able to focus on the titans, you can see them beginning to pull back to the gates of Olympus.</div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“We did it. We did it Thales!”") + " Zosime excitedly says to you. You can scarcely believe it.</div>" +
          "<div>Zeus returns to the center of the courtyard. " + this.zeusText("“It would seem a lifetime in Tartarus is not enough of a punishment.”") + " His voice booms throughout all of Olympus. " + this.zeusText("“This time you will —”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Zeus's proclamation stops short as he notices the fallen giants rising from the dead. Slowly but surely, they each rise to their feet once again, fully revived. Gration continues his dash towards Zeus's palace to ransack the keep, while Aristaeus arrives at the stable to scatter the royal steeds.</div>" +
          "<div class='sceneDiv'>" + this.zeusText("“What is the meaning of this? Has Hades betrayed us?!”") + " Zeus shouts in anger.</div>" +
          "<div class='sceneDiv'>You try to figure out your next move within all of the confusion. Many of the gods move to re-engage the fallen giants. You find Athena in the crowd and make your way over to your patron goddess. You see the spark of realization in her eyes.</div>" +
          "<div>" + this.athenaText("“We were betrayed. But not by him.”") + "</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>At the Olympus gates, the giant Enceladus finally arrives. He is in no hurry to join the fight, sauntering through the gates towards you. Behind him is a man you haven't seen since your time in the Underworld: Khronos. The two of them approach Athena in the courtyards.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“Hello again, my heroes.”") + " Khronos says to you and Zosime. " + this.commonCharacterText("“You've done so well.”") + "</div>" +
          "<div class='sceneDiv'>" + this.athenaText("“What is the meaning of this, snake? The spell was not cast to work on giants!”") + "Athena hisses, every word covered in venom.</div>" +
          "<div>Khronos turns his attention to Athena. " + this.commonCharacterText("“Surely you understand. You, the goddess of wisdom. Your brother, the god of war. Your father, king of gods. You think you know everything. Do you know what you all should be called? The gods of hubris.") + "</div>";
      else if (pageCount === 4)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("Only hubris would convince you that you could surpass time. You believe that you will rule this world forever. And what do you do when you see your time coming to an end? You break the rules. You try to control time itself. You come to me with a request to turn these mortals into abominations, stepping in and out of time.") + "</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("But Athena. <b>No one</b> controls time.”") + "</div>" +
          "<div>" + this.thalesText("“You asked me to learn what it means to be a hero.”") + " You interject. " + this.thalesText("“This isn't it! The deceit, the backstabbing… being a hero is doing what is right no matter the cost. No matter what it takes.”") + "</div>";
      else if (pageCount === 5)
        sceneText = "<div class='sceneDiv'>" + "Khronos turns his glance back to you. " + this.commonCharacterText("“Yes, yes... We must do what has to be done, and what is more right than following the natural order of things? The seasons change, my son, and the season of gods on Olympus is over.”") + "</div>" +
          "<div class='sceneDiv'>With that, Enceladus rushes in to attack. Athena quickly engages him, their battle sprawling all over the courtyard.</div>" +
          "<div class='sceneDiv'>While you and Athena were processing Khronos's betrayal, Zosime was trying to think of a solution. " + this.zosimeText("“Thales, we need to run. If we aren't here, the giants will die for good. It's the only way.”") + "</div>" +
          "<div>She's right. You turn to run but find that you aren't able to move at all.</div>";
      else if (pageCount === 6)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“You've journeyed all this way, you should stay. I am grateful to you both. Without your heroism, the Olympians would be able to simply do as they please without care of the consequences.”") + " Khronos says whilst casting a spell to bind you in place. You're forced to watch as the giants and titans combined might drive your allies back. " + this.commonCharacterText("“In time, you will see that this is right. All things must change.”") + "</div>" +
          "<div class='sceneDiv'>The winged giant Alcyoneus had joined with Enceladus in the battle against Athena, and the two were overwhelming her. You struggle against your shackles with all of your might to no avail. Just as things were beginning to look dire, the ground began to quake all over Olympus.</div>" +
          "<div class='sceneDiv'>" + this.hadesText("“KHRONOS.”") + "</div>" +
          "<div>Hades had finally arrived to the battle.</div>";
      else if (pageCount === 7)
        sceneText = "<div class='sceneDiv'>" + this.hadesText("“You speak of hubris, and yet YOU attempt to sow chaos and control my domain. You have no right to decide which souls do and do not come to me. And these prisoners you freed,”") + " he says, pointing at the titans, " + this.hadesText("“belong to ME.”") + " Flames gush from the ground, creating a divide between the olympians and their attackers.</div>" +
          "<div class='sceneDiv'>The spell Khronos cast on you is interrupted, allowing you to move freely once again. You immediately rush to Athena's aid.</div>" +
          "<div class='sceneDiv'>" + this.athenaText("“We must leave this place. We cannot win.”") + " she says. Not even Zeus would question her expertise on warfare.</div>" +
          "<div class='sceneDiv'>" + this.athenaText("“Leave. As far away from here as you can. I will find you.”") + " She says to you. </div>" +
          "<div>At Athena's command, you race from Mount Olympus as quickly as possible.</div>";
      else if (pageCount === 8)
        sceneText = "<div><i class='s4Heading'>End of Chapter 1</i></div>"
    }
    else if (storyId === 43) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You stand alone at the prow of a ship bound for Crete. A week had passed since your encounter with Khronos, and yet not even the calm waves of the sea could fix your uneasiness. You knew there was no other option, but the guilt of fleeing the battle still weighed upon you.</div>" +
          "<div class='sceneDiv'>Zosime had decided you should return to Crete. It was about as far away from Olympus as you could go, and she thought returning to some normalcy and following another hero would do you some good.  You weren't sure it was going to be that easy to return to normalcy. You hadn’t made contact with any of the Olympian gods since the battle for Olympus, and you weren't sure what may have happened to them.</div>" +
          "<div>Lost in your thoughts, you absently watch the rhythm of the waves.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>In an instant, the waves turned violent. Sailors hurried across the boat, the captain of the vessel shouted out orders. The crashing of the waves roused Zosime from her cabin, racing across the deck towards you.</div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“Storms?”") + " She asked groggily. The sun had just begun to rise and illuminate the sky, revealing a blue canvas with hardly a cloud in sight. You looked again to the sea and saw what looked like shining fins breaching the water. </div>" +
          "<div>" + this.thalesText("“No. Worse. I think the God of the Sea is angry with us.”") + "</div>";
    }
    else if (storyId === 44) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The current of the water pulls you deeper and deeper towards the whirlpool. The panicked crew do everything they can to steer out of it, but the sea has taken on a life of its own.</div>" +
          "<div class='sceneDiv'>" + this.poseidonText("“I SAT IDLY BY WHILE MY NIECES PUT TOGETHER THIS FOLLY OF A PLAN. NO LONGER.”") + " A voice booming deep from the middle of the whirlpool calls out. " + this.poseidonText("“I WILL BE KEEPING A MUCH CLOSER EYE ON YOU.”") + "</div>" +
          "<div>You feel Poseidon granting you his power as the waves finally begin to calm. The whirlpool dissipates, freeing your ship from its clutches. Despite drawing the Sea God’s ire, you were grateful to see him. The gods hadn’t given up, and they were ready to fight back for their home.</div>";
    }
    else if (storyId === 45) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>As the day begins to give way to night, your ship arrives on the shores of Crete. You use your remaining moments of sunlight to track down an inn.</div>" +
          "<div>You secure a room for the night and stop for a warm meal, although the uneasy feeling around you is unmistakable. You hear hushed conversations discussing the events of Mount Olympus. You pick up exaggerated bits and pieces here and there, but it seems everyone knows the truth of the matter: Olympus had fallen.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>You listen in on a nearby conversation from a particularly agitated patron. He had received warning from family living in a village near the mountain.</div>" +
          "<div class='sceneDiv'>The giants had wasted no time in their destruction and pillaging, and their presence had been felt all around the mountain. Many patrons at this establishment seemed concerned for loved ones on the mainland.</div>" +
          "<div>The chatter stirred something deep inside of you. You may have failed, but you would not give up. You will get answers from Khronos and find a way to put the rightful gods back on Olympus. But first, you will make your way to the Labyrinth like Theseus before you and defeat the great Minotaur.</div>";
    }
    else if (storyId === 46) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>With the Minotaur defeated, you work your way out of the Labyrinth and back to Knossos. On the return journey, your meeting with Poseidon crept its way into your thoughts. It would seem the gods had escaped unscathed, but you had not heard yet from Athena.</div>" +
          "<div>Upon arriving in Knossos, you make your way to the religious sanctuary within the Palace of Minos. You begin praying to your patron goddess, hoping for a sign on what to do next.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>After some time, a vision slowly appears to you, almost begrudgingly. Athena had the makings of a plan, but did not seem sure about it. Eager to right your loss at Mount Olympus, you were determined to see it through regardless of the danger.</div>" +
          "<div>You finish your prayer to Athena, and begin to make travel plans with Zosime. Your next target: The island of Aiaia. Home to the sorceress Circe, sister of Aeëtes.</div>";
    }
    else if (storyId === 47) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Your travels once again bring you to the open seas. You find yourself on a much smaller vessel this time, as convincing a crew to travel to the island of the Witch was no easy task. Your trip to Aiaia is contingent on working as a crewman.</div>" +
          "<div class='sceneDiv'>As you work to clean the decks of the small ship, you notice Zosime mopping the deck in a direction heading directly towards you. As she approaches, you notice concern on her face.</div>" +
          "<div>" + this.zosimeText("“Have we thought this through well enough?”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“Aeëtes was the most monstrous god I've known, do we think his sister will be different?”") + "</div>" +
          "<div class='sceneDiv'>Her fears matched up well with your own. " + this.thalesText("“Athena seemed cautious, but she believed this could work. I trust her.”") + " You aren't entirely certain of that, but you tried to sound convincing. She nods, trusting your judgment.</div>" +
          "<div>You've heard more stories of the havoc wrought by the giants on the towns near Olympus, and their attention was spreading further and further out. This plan may be dangerous, but you know that time is of the essence. You will have to make it work. </div>";
    }
    else if (storyId === 48) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Finally, you see a small speck of brown in the sea of blue. Jagged rocks scatter the island of Aiaia, but your crewmates manage to find a small cove safe to drop anchor. This was as far as they go -- they've heard stories of the Witch and have no desire to meet face to face.</div>" +
          "<div class='sceneDiv'>The island itself was quite forested, and there was only one obvious path inland. You lead the way for a short while before coming to a clearing. In front of you is a small house, alongside a barn with chickens and pigs. </div>" +
          "<div>Since stepping onto the island, you felt a bit uneasy. That feeling grew with every step, and now your mind was spinning. Your vision distorts and fades to black as you try to reach out to Zosime but cannot. You lose control of your body as you feel yourself twisting and shifting about. " + this.zosimeText("“Thales?!”") + " is the last thing you hear before your vision returns. You are much shorter. You can no longer remember what you are doing. You are a pig. You search for something to eat.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Zosime watches in fear as her companion flails around, body shrinking and contorting. Tanned skin fades to a light pink and arms shrink to small legs. To her horror, Thales has been transformed into a hog.</div>" +
          "<div class='sceneDiv'>Outside of the house, Zosime notices a woman flanked by a lioness. Her focus had been entirely on Thales, but now shifts. Zosime quickly draws her bow at the ready, but does not yet raise it to attack.</div>" +
          "<div>" + this.commonCharacterText("“Who are you, and why are you here?”") + " The woman, Circe, demanded. To Zosime's surprise, she spoke with a mortal voice unlike the booming voice of her brother. </div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.zosimeText("“I am Zosime, and he is Thales. We've come to ask for your help, and he has done nothing against you! Return him!”") + " Zosime replies, raising her bow slightly, unsure how best to proceed with the Witch.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“He is not the first man to wander onto my island in search of 'help' only to show his true desires. His desires are much simpler now.”") + " the Witch says coldly.</div>" +
          "<div class='sceneDiv'>Circe steps forward from her home, the lioness still at her flank.</div>" +
          "<div>" + this.commonCharacterText("“I must confess, I did not notice you at first. I ask again, why are you here?”") + "</div>";
      else if (pageCount === 4)
        sceneText = "<div class='sceneDiv'>Zosime hurriedly tells the story of her journey so far. The chance meeting in Delphi, the magic attached to Thales by Athena and Khronos, their conquests over monsters, and the fall of Olympus.</div>" +
          "<div class='sceneDiv'>Circe listened patiently for the story to end. She paused for a moment upon its completion, mulling over what she had heard. Zosime thought she noticed the Witch flinch upon the mention of Athena, but otherwise Circe gave nothing away.</div>" +
          "<div>Circe and her lionness continued to step forward, stalking closer to Zosime. " + this.commonCharacterText("“I have no love for the Olympians or the games they play. What difference does it make to me who lives on the mountain while I live on Aiaia?”") + "</div>"; 
      else if (pageCount === 5)
        sceneText = "<div class='sceneDiv'>As Circe approaches, Zosime finally began to feel alarm. She points her bow at the lionness, but stops short when noticing the look of surprise on the Witch's face.</div>" +
          "<div class='sceneDiv'>Zosime turned to see what they were staring at and noticed her own lioness by her side. After swallowing down a brief instinct to move, she saw that her lioness had a slight golden glow. Artemis.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“I believe this is the first time we have met. Your brothers and sisters have all been by to make their demands or have their fun of course. I wondered if your absence was out of respect or indifference.”") + "</div>" +
          "<div class='sceneDiv'>With a slight frown, she continues. </div>" + 
          "<div>" + this.commonCharacterText("“I will return your friend to you, and you will leave this place. I do not want Athena's ire, but I will not be a pawn in her games. She has taken enough from me.”") + "</div>"; 
      else if (pageCount === 6)
        sceneText = "<div class='sceneDiv'>Feeling her chance slipping away, Zosime decides to push her luck.</div>" +
          "<div class='sceneDiv'>" + this.zosimeText("“It's not just about the gods. It's about your brother, Aeëtes. He spreads corruption to all around him, keeping the dead alive for his bidding. I aim to stop him and the terrors he inflicts upon those around him, and I cannot do it without Thales.”") + "</div>" +
          "<div class='sceneDiv'>Zosime believed she had piqued the Witch's interest. Circe moves to Thales and kneels down, covering his snout with oil and muttering an unintelligible phrase. Thales began to take shape once more.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“I will say that I am interested in this magic over time you speak of. This island is full of potent herbs. Deep in the forest, you will find a rare flower of deep yellow and green. I have avoided collecting it to due to its scarcity, but if what you say is true then you should be able to bring me a bundle of them. Go now and bring them to me.”") + "</div>" +
          "<div>Seizing on this small opportunity, Zosime hurries Thales along the trail while filling him on what he missed.</div>";
    }
    else if (storyId === 49) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You find a beautiful flower matching the description given by Circe. After picking it, you wait awhile and see that it returns. You suppose that picking a flower over and over isn't that much different than fighting the same monster multiple times. After picking a sizable amount, you make your way back the way you came.</div>" +
          "<div>When you return to the home of the Witch, she is nowhere to be seen but the door has been left open. You hesitate, not certain that you can truly trust her. Zosime proceeds into the house though, unwavering, and you follow.</div>";          
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>The house is filled with various flora and is more inviting and warm than you expected. Circe is in an open room off to the side, working with different herbs. She turns towards you as you enter and gives a small nod of approval when she sees your bushel of flowers.</div>" +
          "<div class='sceneDiv'>" + this.commonCharacterText("“You can leave those on the table.”") + " She says, putting her own herbs down as well. She walks over to you and you notice her demeanor soften slightly.</div>" + 
          "<div>" + this.commonCharacterText("“There was a time when Aeëtes was my best friend. My only friend. My sister would mock him, asking why Helios's favored son would waste his time.”") + "</div>";
          else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“When I was first sent away, I knew that no one would think of me, except for perhaps him. I thought he loved me as I loved him, and that he would surely come to see me in my exile.”") + "</div>" +
          "<div class='sceneDiv'>You could tell she was choosing her words carefully, deciding how much she should share. Circe had lived in isolation for a long time, and she seemed both on guard and longing for connection.</div>" + 
          "<div>" + this.commonCharacterText("“He did not. I do not fault him for that. I have only seen him once since, lifetimes later, in pursuit of my niece Medea after I allowed her safe passage.”") + " She begins to speak again, then pauses and seems to change her mind. " + this.commonCharacterText("“That was the only time I saw him for who he was.”") + " She does not elaborate.</div>";
          else if (pageCount === 4)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“I will not help you kill him, but I will help you with your dilemma. First, you will need to seek out Scylla. She is long gone, but to you that should be no issue. Go to her, defeat her, and return with her scales. We will continue from there.”") + "</div>" +
          "<div>You agree and withdraw from Circe's home. You are honestly surprised that she decided to help you, but you are grateful nonetheless. You return back to your vessel and convince the crew to go on a new journey.</div>";
    }
    else if (storyId === 50) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>On a calm and sunny day, the narrow path finally appears upon the horizon. As you approach, the still waters become more vigorous, and you start to feel the pull of the great whirlpool.</div>" +
      "<div class='sceneDiv'>Traveling through here was once like picking your own poison. To avoid the disastrous whirlpool Charybdis, you would be driven straight into the lair of the monstrous Scylla.</div>" +
      "<div>That is the path you take today. Your ship careens in the darkness through the rocky cove.</div>";
      else if (pageCount === 2)
        sceneText = "<div>As always, your magic holds. The waves part to reveal one head, then two, then too many thrashing about to count. The monster seemed to relish in the opportunity to take one more set of victims, and you were in for the fight of your life.</div>";
    }
    else if (storyId === 51) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>Victorious, you set sail back to the island of Aiaia. Upon your return, you find Circe tending to an array of chickens and you briefly wonder if they had been humans in the past.</div>" +
        "<div>Zosime steps forward and proudly displays the scales taken from the sea monster's corpse. " + this.zosimeText("“Lady Circe, we have what you requested. Will this do?”") + "</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>Circe takes the scales and makes her way back to her house. She places the scales down and enters her room filled with herbs. " + this.commonCharacterText("“The scales are for me. A reminder of how a single act of cruelty can lead to the agony of so many.") + "</div>" + 
        "<div class='sceneDiv'>" + this.commonCharacterText("And proof. Aeëtes was the strongest of us. If you could not defeat Scylla, you could not withstand him.”") + "</div>" +
        "<div>She proffers a bushel of herbs with dark black roots and white leaves to Thales.</div>";
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“This is what you need. Do not lose them -- you will never find more, as a mortal cannot pick Moly. Take this when you want the magic to stop for a time, and it will.”") + "</div>" +
      "<div class='sceneDiv'>You take the herbs and give thanks.</div>" + 
      "<div>" + this.commonCharacterText("“He is more powerful than even I realize. Good luck. You will need it.”") + "</div>";
    }

    sceneText = sceneText.replaceAll("Thales", "<span class='adventurerColor storyCharacterName'>Thales</span>");
    sceneText = sceneText.replaceAll("Zosime", "<span class='archerColor storyCharacterName'>Zosime</span>");
    sceneText = sceneText.replaceAll("Athena", "<span class='athenaColor storyCharacterName'>Athena</span>");
    sceneText = sceneText.replaceAll("Hades", "<span class='hadesColor storyCharacterName'>Hades</span>");
    sceneText = sceneText.replaceAll("Hermes", "<span class='hermesColor storyCharacterName'>Hermes</span>");
    sceneText = sceneText.replaceAll("Artemis", "<span class='artemisColor storyCharacterName'>Artemis</span>");
    sceneText = sceneText.replaceAll("Ares", "<span class='aresColor storyCharacterName'>Ares</span>");
    sceneText = sceneText.replaceAll("Apollo", "<span class='apolloColor storyCharacterName'>Apollo</span>");
    sceneText = sceneText.replaceAll("Poseidon", "<span class='poseidonColor storyCharacterName'>Poseidon</span>");
    sceneText = sceneText.replaceAll("Zeus", "<span class='zeusColor storyCharacterName'>Zeus</span>");
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
    sceneText = sceneText.replaceAll("Circe", "<span class='commonCharacterColor storyCharacterName'>Circe</span>");
    sceneText = sceneText.replaceAll("Hephaestus", "<span class='commonCharacterColor storyCharacterName'>Hephaestus</span>");
    sceneText = sceneText.replaceAll("Oceanus", "<span class='commonCharacterColor storyCharacterName'>Oceanus</span>");
    sceneText = sceneText.replaceAll("Hyperion", "<span class='commonCharacterColor storyCharacterName'>Hyperion</span>");
    sceneText = sceneText.replaceAll("Coeus", "<span class='commonCharacterColor storyCharacterName'>Coeus</span>");
    sceneText = sceneText.replaceAll("Alcyoneus", "<span class='commonCharacterColor storyCharacterName'>Alcyoneus</span>");
    sceneText = sceneText.replaceAll("Gration", "<span class='commonCharacterColor storyCharacterName'>Gration</span>");
    sceneText = sceneText.replaceAll("Aristaeus", "<span class='commonCharacterColor storyCharacterName'>Aristaeus</span>");
    sceneText = sceneText.replaceAll("Helios", "<span class='commonCharacterColor storyCharacterName'>Helios</span>");

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
      this.pageCount = 3;
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
    if (this.globalService.globalVar.currentStoryId === 36) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 37) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 38) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 39) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 40) {
      this.pageCount = 3;
    }
    if (this.globalService.globalVar.currentStoryId === 41) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 42) {
      this.pageCount = 8;
    }
    if (this.globalService.globalVar.currentStoryId === 43) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 44) {
      this.pageCount = 1;
    }
    if (this.globalService.globalVar.currentStoryId === 45) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 46) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 47) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 48) {
      this.pageCount = 6;
    }
    if (this.globalService.globalVar.currentStoryId === 49) {
      this.pageCount = 4;
    }
    if (this.globalService.globalVar.currentStoryId === 50) {
      this.pageCount = 2;
    }
    if (this.globalService.globalVar.currentStoryId === 51) {
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
      if (this.globalService.globalVar.activeBattle !== undefined)
        this.globalService.globalVar.activeBattle.atScene = false;

      //post story events, if any
      if (this.globalService.globalVar.currentStoryId === 1) {
        this.globalService.globalVar.isBattlePaused = false;

        if (this.deviceDetectorService.isMobile())
          this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.MobileOverlay, undefined, undefined, true, subzone.type), this.globalService.globalVar);

        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.AutoAttack, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }
      if (this.globalService.globalVar.currentStoryId === 3) {
        this.globalService.globalVar.settings.set("autoProgress", false);
        this.balladService.setActiveSubZone(SubZoneEnum.DodonaDelphi);
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Town, undefined, undefined, true, SubZoneEnum.DodonaDelphi), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.SkipStory, undefined, undefined, true, SubZoneEnum.DodonaDelphi), this.globalService.globalVar);
      }
      if (this.globalService.globalVar.currentStoryId === 6) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Crafting, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
        var qualityClass = this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(ItemsEnum.Aegis)?.quality);
        var itemName = "<span class='" + qualityClass + "'>Aegis</span>";
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Athena gives you her shield " + itemName + ".", this.globalService.globalVar);
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Aegis, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
      }
      if (this.globalService.globalVar.currentStoryId === 7) {
        this.globalService.globalVar.settings.set("autoProgress", false);
      }
      if (this.globalService.globalVar.currentStoryId === 8) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Warning, "<b><i>You will temporarily lose access to previous Ballads after completing the following battle.</i></b>", this.globalService.globalVar);
      }
      if (this.globalService.globalVar.currentStoryId === 9) {
        this.showFirstTimeUnderworldStory = false;
        this.triggerFirstTimeUnderworldScene = false;
        this.endFirstTimeUnderworldScene = true;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Notifications, undefined, undefined, true, subzone.type), this.globalService.globalVar);
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
      if (this.globalService.globalVar.currentStoryId === 12) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Traveler, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }
      if (this.globalService.globalVar.currentStoryId === 14) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.SideQuests, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.SideQuest, "A new side quest is available in the Ballad of the Underworld.", this.globalService.globalVar);
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
      if (this.globalService.globalVar.currentStoryId === 38) {
        this.globalService.globalVar.settings.set("autoProgress", false);
        this.balladService.setActiveSubZone(SubZoneEnum.MountOlympusOlympus);
      }
      if (this.globalService.globalVar.currentStoryId === 39) {
        var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
        if (zeus !== undefined) {
          zeus.isAvailable = true;
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You have gained the powers of the almighty Zeus, God of Thunder and Lightning.", this.globalService.globalVar);
        }

        var mountainHike = this.balladService.findSubzone(SubZoneEnum.HuntForYarrowMountainHike);
        if (mountainHike !== undefined) {
          mountainHike.isAvailable = true;
          mountainHike.notify = true;

          this.achievementService.createDefaultAchievementsForSubzone(mountainHike.type).forEach(achievement => {
            this.globalService.globalVar.achievements.push(achievement);
          });
        }
      }
      if (this.globalService.globalVar.currentStoryId === 45) {
        var poseidon = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon);
        if (poseidon !== undefined) {
          poseidon.isAvailable = true;
          this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You have gained the powers of Poseidon, God of the Sea.", this.globalService.globalVar);
        }
      }
    }
    if (this.globalService.globalVar.currentStoryId === 49) {
      var openClearing = this.balladService.findSubzone(SubZoneEnum.AiaiaOpenClearing);
      if (openClearing !== undefined) {
        openClearing.isAvailable = true;

        this.achievementService.createDefaultAchievementsForSubzone(openClearing.type).forEach(achievement => {
          this.globalService.globalVar.achievements.push(achievement);
        });
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
      else if (pageCount === 3)
        sceneText = "<div class='sceneDiv s4Heading bold textCentered sidequestText'>Side Quest Complete!</div>" +
          this.tutorialService.getTutorialText(TutorialTypeEnum.ChthonicFavorUpgrade1, undefined, undefined, false);
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
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv s4Heading bold textCentered sidequestText'>Side Quest Complete!</div>" +
          this.tutorialService.getTutorialText(TutorialTypeEnum.ChthonicFavorUpgrade2, undefined, undefined, false);
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
    if (scene === OptionalSceneEnum.HephaestusJewelcrafting) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You move towards the sound of metalwork and sure enough the divine blacksmith Hephaestus is pounding away at his anvil. He does not notice you as you approach, as he is lost in the fervor of his work. You do not speak, as you are lost in the beauty of it.</div>" +
          "<div class='sceneDiv'>The blacksmith alternates between the heaviest of blows and most delicate of touches to shape the metal exactly as he wants it. The fire of the forge roared but bent entirely to his will. If blacksmithing was an art, there was no greater artist than Hephaestus.</div>" +
          "<div>After some time, the god eventually notices your presence.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.commonCharacterText("“You must be the mortals here to aid us in battle. You've been the talk of Olympus for some time.”") + " He says as he puts down his tools. He nods for you to follow as he makes his way back towards an armory holding his greatest artwork.</div>" +
          this.commonCharacterText("“I made a couple of pieces for you. Won't have you dying on my watch. Here, try this on and go give it a test run.”");
    }
    if (scene === OptionalSceneEnum.IslandOfNaxos) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You take a detour to the nearby Island of Naxos. The cult of Dionysus is alive and well here, and it is home to one of his largest temples.</div>" +
          "<div class='sceneDiv'>When you arrive, you are surprised to see Dionysus himself, seemingly unphased by recent events. A party was in full swing and you decided the best way to make amends and venerate the god of wine was to partake.</div>" +
          "<div>You're not quite sure what was in the wine, but you eventually leave the island with a throbbing headache and a greater knowledge of mixology.</div>";
    }
    if (scene === OptionalSceneEnum.TimeFragmentInTheSwamp) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>After defeating the Lernean Hydra, you wade your way out of the swamp. Near the edge, you notice a dim green object partially obscured in the muck. You reach down and retrieve what seems to be a crystal. As soon as you touch it, it reacts to your magic and immediately begins to glow.</div>" +
          "<br/><br/><br/><div class='s4Heading bold textCentered sidequestText'>Time Fragments Unlocked</div>";
    }
    if (scene === OptionalSceneEnum.CirceAlchemy) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You return to Circe's home. You do not see her outside, but the door is open. You decide it best to knock -- no need to give Circe any reason to transform you once again.</div>" +
        "<div class='sceneDiv'>" + this.commonCharacterText("“Come in.”") + "</div>" +
        "<div class='sceneDiv'>You enter the abode at the Witch's request. Despite living alone, Circe's home was not cold. On this day, various animals moved about including the lionness laying calmly by Circe's side. The Witch herself was hard at work spinning yarn with her beautiful loom. You clear your throat, trying to think of the right way to ask for another favor.</div>";
      else if (pageCount === 2)
        sceneText = "<div class='sceneDiv'>" + this.thalesText("“Do you think you could show me some of your potions?”") + " You finally blurt out. All who know of Circe know that she has perhaps the greatest mind of potions and herbs amongst the living. You didn't want to miss an opportunity to improve your craft.</div>" +
        "<div class='sceneDiv'>Circe continued to work at her loom without acknowledgement. Finally, she spoke. " + this.commonCharacterText("“Have you been touched by Hecate? You continue to surprise me.”") + " She said without looking away from her work.</div>" + 
        "<div>" + this.commonCharacterText("“I'm in need of some roots from the forest. Bring me some and we'll talk.”") + "</div>";
    }
    if (scene === OptionalSceneEnum.CirceAlchemy2) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>You return to Circe with the roots she requested. " + this.commonCharacterText("Well done. I suppose I should hold up my end of the deal. Come now, gather around and try to keep up.") + " She says, pulling down an array of herbs and potions from her collection.</div>" +
          "<br/><br/><br/><div class='s4Heading bold textCentered sidequestText'>Alchemy Max Level Increase!</div>";
    }
    if (scene === OptionalSceneEnum.CharybdisJewelcrafting) {
      if (pageCount === 1)
        sceneText = "<div class='sceneDiv'>The waves begin to calm as the great monster falls. For the first time, the mighty whirlpool stills. Near the center, you spy fragments of the sea monster's spikes. You retrieve them and immediately feel their great power.</div>" +
          "<br/><br/><br/><div class='s4Heading bold textCentered sidequestText'>Jewelcrafting Max Level Increase!</div>";
    }

    sceneText = sceneText.replaceAll("Thales", "<span class='adventurerColor storyCharacterName'>Thales</span>");
    sceneText = sceneText.replaceAll("Zosime", "<span class='archerColor storyCharacterName'>Zosime</span>");
    sceneText = sceneText.replaceAll("Athena", "<span class='athenaColor storyCharacterName'>Athena</span>");
    sceneText = sceneText.replaceAll("Hades", "<span class='hadesColor storyCharacterName'>Hades</span>");
    sceneText = sceneText.replaceAll("Dionysus", "<span class='dionysusColor storyCharacterName'>Dionysus</span>");
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
    sceneText = sceneText.replaceAll("Hephaestus", "<span class='commonCharacterColor storyCharacterName'>Hephaestus</span>");
    sceneText = sceneText.replaceAll("Circe", "<span class='commonCharacterColor storyCharacterName'>Circe</span>");

    return sceneText;
  }

  handleOptionalScene(deltaTime: number) {
    this.globalService.globalVar.isBattlePaused = true;
    var subzone = this.balladService.getActiveSubZone();

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
      this.pageCount = 3;
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
      this.pageCount = 2;
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
    if (this.showOptionalStory === OptionalSceneEnum.HephaestusJewelcrafting) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.IslandOfNaxos) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.TimeFragmentInTheSwamp) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.CharybdisJewelcrafting) {
      this.pageCount = 1;
    }
    if (this.showOptionalStory === OptionalSceneEnum.CirceAlchemy) {
      this.pageCount = 2;
    }
    if (this.showOptionalStory === OptionalSceneEnum.CirceAlchemy2) {
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Hecate provides you with 25 Olives and Fennel.", this.globalService.globalVar);
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Olive, 25);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 25);
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
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 10.", this.globalService.globalVar);
      }
      if (this.showOptionalStory === OptionalSceneEnum.AugeanStables4) {
        this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 10.", this.globalService.globalVar);
      }
      if (this.showOptionalStory === OptionalSceneEnum.AugeanStables6) {
        this.globalService.globalVar.sidequestData.displayAugeanStablesPayScene = false;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, "Your max Jewelcrafting level has increased by 5.", this.globalService.globalVar);

        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RadiatingHolyStone, 1);
        if (resource !== undefined) {
          this.lookupService.gainResource(resource);
        }

        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You receive 1 " + this.dictionaryService.getItemName(ItemsEnum.RadiatingHolyStone) + " and learn the Jewelcrafting recipe to craft it.", this.globalService.globalVar);
        this.professionService.learnRecipe(ProfessionEnum.Jewelcrafting, ItemsEnum.RadiatingHolyStone);
      }
      if (this.showOptionalStory === OptionalSceneEnum.HephaestusJewelcrafting) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Hephaestus provides you with the Divine Targe and Divine Plate.", this.globalService.globalVar);
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.DivinePlate, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.DivineTarge, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);

        var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
        if (jewelcrafting !== undefined) {
          jewelcrafting.maxLevel += 25;

          var gameLogEntry = "Watching Hephestaus work has given you inspiration. Your Jewelcrafting max level increases by <strong>25</strong> to a total of <strong>" + jewelcrafting.maxLevel + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
        }
      }
      if (this.showOptionalStory === OptionalSceneEnum.IslandOfNaxos) {
        var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
        if (alchemy !== undefined) {
          alchemy.maxLevel += 25;

          var gameLogEntry = "Your experience on the Island of Naxos has improved your Alchemy skills. Your Alchemy max level increases by <strong>25</strong> to a total of <strong>" + alchemy.maxLevel + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry, this.globalService.globalVar);
        }
      }
      if (this.showOptionalStory === OptionalSceneEnum.TimeFragmentInTheSwamp) {
        this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You find a Time Fragment.", this.globalService.globalVar);
        var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.TimeFragment, 1);
        if (resource !== undefined)
          this.lookupService.gainResource(resource);

        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.TimeFragments, undefined, undefined, true, subzone.type), this.globalService.globalVar);
        this.globalService.handleTutorialModal();
      }
      if (this.showOptionalStory === OptionalSceneEnum.CharybdisJewelcrafting) {
        var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
        if (jewelcrafting !== undefined) {
          jewelcrafting.maxLevel += 25;

          var gameLogEntry = "Handling Charybdis's spikes has given you inspiration. Your Jewelcrafting max level increases by <strong>25</strong> to a total of <strong>" + jewelcrafting.maxLevel + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry, this.globalService.globalVar);
        }
      }
      if (this.showOptionalStory === OptionalSceneEnum.CirceAlchemy2) {
        this.globalService.globalVar.sidequestData.displayCirceAlchemyPayScene = false;
        var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
        if (alchemy !== undefined) {
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, "Your max Alchemy level has increased by <strong>25</strong> to a total of <strong>" + alchemy.maxLevel + "</strong>.", this.globalService.globalVar);
        }
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
