import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { LookupService } from '../lookup.service';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private lookupService: LookupService, private deviceDetectorService: DeviceDetectorService) { }

  getTutorialText(type: TutorialTypeEnum, newAbility?: Ability, character?: Character, addToLog: boolean = true, subzoneEnum?: SubZoneEnum) {    
    var text = "";

    if (type === TutorialTypeEnum.GameReview) {
      var supportButtonText = "By clicking on the '<b class='smallCaps clickableText linkForeground supportClickableItem'><u>Support</u></b>' link below on the footer of the page, ";
      if (this.deviceDetectorService.isMobile())
        supportButtonText = "By clicking on the <span class='bold supportMobileClickableItem'>'<u>Support</u>'</span> tab option on the bottom of the Menu, ";

      text = "I hope that you are enjoying <b class='smallCaps'>Ballad of Heroes</b>! If you have any feedback, recommendations, or issues, I would love to hear about them on <a href='https://discord.gg/gcRvF2AJGV' rel='noopener noreferrer' target='_blank'>Discord</a> or via email at balladofheroes@gmail.com. <br/><br/>" +
      "This game will always be free, but if you are able, I would greatly appreciate your support. " + supportButtonText + " you will see a couple of options to support the development of Ballad of Heroes so that I can continue to create content at a regular pace. You can gain early access to gods, design your own Eternal Melee boss fight, and more. Thank you, and I hope you continue to enjoy the game!";
    }
    if (type === TutorialTypeEnum.CharacterPassiveAbility) {
      if (this.deviceDetectorService.isMobile())
        text = "Each character gains a unique passive ability at level 4. View your passive ability by tapping and hold your character's name or viewing their character page.";
      else
        text = "Each character gains a unique passive ability at level 4. View your passive ability by hovering over your character's name or viewing their character page.";
      if (newAbility !== undefined && character !== undefined)
        text += "<br/>" + this.lookupService.getCharacterAbilityDescription(newAbility.name, character);
    }
    else if (type === TutorialTypeEnum.AutoAttack) {
      if (this.deviceDetectorService.isMobile())
        text = "On the bottom of your screen is your character information. Here you can see your character's health and all abilities available to you. Currently, you only have access to an auto attack that automatically deals attack damage to an enemy over time. Tap and hold the sword icon by your character's name for more details.<br/><br/>Enemies are displayed at the top of your screen. When you reduce all enemies' HP to 0, you will gain XP and immediately begin fighting a new set of enemies. Tap and hold an enemy's name to see more details about them.";
      else
        text = "On the left side of your screen is your character information. Here you can see your character's health and all abilities available to you. Currently, you only have access to an auto attack that automatically deals attack damage to an enemy over time. Hover over the sword by your character's name for more details.<br/><br/>Enemies are displayed in the middle of your screen. When you reduce all enemies' HP to 0, you will gain XP and immediately begin fighting a new set of enemies. Hover over an enemy's name to see more details about them.";
    }
    else if (type === TutorialTypeEnum.BattleItems) {
      if (this.deviceDetectorService.isMobile())
        text = "You received your first battle item. Tap the gray sack icon on the quick link bar above your character's name to open your item belt. Tap the plus sign on the left to add an item to your item belt and tap the item again to use it. Some items require you to click an ally or enemy to use. Tap and hold an item to see its effect.";
      else
        text = "You received your first battle item. Click the plus sign on the bottom left to add an item to your item belt and click the item again to use it. Some items require you to click an ally or enemy to use. Hover over an item to see its effect.";
    }
    else if (type === TutorialTypeEnum.NewSubzone) {
      if (this.deviceDetectorService.isMobile())
        text = "As you proceed through the game, you will need to defeat enough enemies in each subzone before moving forward. You've won enough battles in the <b>'Upper Coast'</b> subzone to continue. To the right of the <b>'Upper Coast'</b> name at the top of the screen, tap the right arrow to move to the next subzone, <b>'Bay'</b>. The down arrow to the left will show all available ballads, zones, and subzones. If you wish, you can select 'Auto Progress' in this menu to automatically move to the next subzone when possible. Continue proceeding through each subzone to progress the story.";
      else
        text = "As you proceed through the game, you will need to defeat enough enemies in each subzone before moving forward. You've won enough battles in the <b>'Upper Coast'</b> subzone to continue. On the right side of the screen, select <b>'Bay'</b> to move to the next subzone within the <b>'Aigosthena'</b> zone. If you wish, you can select 'Auto Progress' at the top of the page to automatically move to the next subzone when possible. Continue proceeding through each subzone to progress the story.";
    }
    else if (type === TutorialTypeEnum.Town) {
      if (this.deviceDetectorService.isMobile())
        text = "Towns offer respite and the opportunity to trade. Tap the 'General' option to see new equipment options.";
      else
        text = "Towns offer respite and the opportunity to trade. Click the 'General' option to see new equipment options.";
    }
    else if (type === TutorialTypeEnum.ExtraSpeed) {
      if (this.deviceDetectorService.isMobile())
        text = "You've received 1 hour of extra speed time. This allows you to run the game at 2x speed. Normally, you will accrue this when leaving the game. If you prefer to turn this off or pause it, tap the » button in the header.";
      else
        text = "You've received 1 hour of extra speed time. This allows you to run the game at 2x speed. Normally, you will accrue this when leaving the game. If you prefer to turn this off or pause it, click the » button in the header.";
    }
    else if (type === TutorialTypeEnum.Crafting) {
      text = "Crafters can create unique items with materials found from battle. Keep an eye out for what loot you are receiving from individual enemies.";
    }
    else if (type === TutorialTypeEnum.SkipStory) {
      if (this.deviceDetectorService.isMobile())
        text = "Under settings, you can adjust the speed at which story scenes progress or skip the story entirely. You can always review the story, as well as tutorial tips and recently gained loot, by tapping the Log button on the top right.";
      else
        text = "Under settings, you can adjust the speed at which story scenes progress or skip the story entirely. You can always review the story, as well as tutorial tips and recently gained loot, by clicking the Log button on the top right.";
    }
    else if (type === TutorialTypeEnum.Equipment) {
      if (this.deviceDetectorService.isMobile())
        text = "You've acquired your first equipment item. Tap on <span class='smallCaps adventurerColor bold'>'Adventurer'</span> in the middle of the screen to quickly jump to the menu and view the character page. Use the <b>'Change'</b> button to update your equipment.";
      else
        text = "You've acquired your first equipment item. Click on <span class='smallCaps adventurerColor bold'>'Adventurer'</span> on the top left of the screen to quickly jump to the menu and view the character page. Use the <b>'Change Equipment'</b> button to update your equipment.";
    }
    else if (type === TutorialTypeEnum.Altars) {
      if (this.deviceDetectorService.isMobile())
        text = "As you proceed on your journey, you will have access to different altars to honor the gods. Select the Altar quick link option and tap the altar to pray to Athena. You will gain a party-wide buff and affinity EXP for Athena.";
      else
        text = "As you proceed on your journey, you will have access to different altars to honor the gods. Select the Altar on the right and pray to Athena to gain a party-wide buff and affinity EXP for Athena.";
    }
    else if (type === TutorialTypeEnum.Achievements) {
      text = "You've gained a reward by completing an achievement. View all achievements and rewards in the menu under Achievements.";
    }
    else if (type === TutorialTypeEnum.QuickView) {
      if (this.deviceDetectorService.isMobile())
        text = "Use the quick link bar above your character's name to quickly access useful information, such as the number of coins you have, seeing battle text, and jumping quickly to important locations as they become available.";
      else
        text = "Use the section on the right to quickly view useful information such as the amount of coins you currently have. Hover over each quick view icon for more information.";
    }
    else if (type === TutorialTypeEnum.Notifications) {
      text = "Different notification colors indicate different things. Blue notification icons always indicate the way to go to progress the main story. Purple notification icons are optional professions that you may take on to improve your combat capabilities. Green notification icons lead to resets, which usually mean you weaken yourself in the short term to get stronger in the long term.";
    }
    else if (type === TutorialTypeEnum.SideQuests) {
      text = "An orange notification icon means there is a side quest available. You do not need to follow the path of a side quest to progress the story, but typically there will be a useful reward at the end.";
    }
    else if (type === TutorialTypeEnum.Followers) {
      text = "Your triumphs have inspired the people of Greece and have motivated some to follow you. Use the Followers menu to assign followers to search completed zones for items or pray to the gods for boons.";
    }
    else if (type === TutorialTypeEnum.ObscurredNotification) {
      text = "If the path forward is not linear, the notification icon will be marked with a ?. Try the available paths in front of you and see if you can find the right way!";
    }
    else if (type === TutorialTypeEnum.MobileOverlay) {
      text = "Important information will display in this overlay such as tutorial hints and battle rewards. You can adjust what displays by going to the 'Settings' page after tapping 'Menu' on the top left of the screen.";
    }
    else if (type === TutorialTypeEnum.Jewelcrafting) {
      text = "Jewelcrafting allows you to create items that augment your equipment, either through making gems that can slot into items to increase their stats or adding slots to existing equipment.";
    }
    else if (type === TutorialTypeEnum.Alchemy) {
      text = "Alchemy allows you to craft battle items that you can use to aid your party or hinder your foes.";
    }
    else if (type === TutorialTypeEnum.ChthonicFavorUpgrade1) {
      text = "Every 8 hours, a random god will be selected to provide 25% more Chthonic Power when resetting your gods in the Underworld.";
    }
    else if (type === TutorialTypeEnum.ChthonicFavorUpgrade2) {
      text = "You now gain Chthonic Favor in addition to gaining Chthonic Power when resetting your gods in the Underworld. Chthonic Favor directly multiplies the amount of Chthonic Power you gain.";
    }
    else if (type === TutorialTypeEnum.Overdrive) {
      text = "You've obtained your first overdrive. A new bar is now under the unlocking character's health bar that shows their progress to using their overdrive. Attacking and being attacked by enemies increases your overdrive gauge, and once it reaches 100% you will enter a powerful state for a period of time. You can view the overdrive menu when looking at your characters in the menu.";
    }
    else if (type === TutorialTypeEnum.Link) {
      text = "You can now empower your abilities in the form of Links. When you manually select an ability, you will activate a Link and deal increased damage. As you level up, you will be able to link more abilities together and deal increasingly higher damage with them.";
    }
    else if (type === TutorialTypeEnum.Traveler) {
      text = "The Traveler will teach you new classes for a price. You can only have two classes active at any given time, but any new classes you learn will be available to switch to by selecting a class in the Menu and pressing 'Change Class'.";
    }
    else if (type === TutorialTypeEnum.TimeFragments) {
      text = "You now have access to Time Fragments. Select the diamond icon in the Quick View options to view the Time Fragment View. With Time Fragments, you can automatically run completed subzones and certain battles in the background.";
    }
    else if (type === TutorialTypeEnum.Uniques) {
      text = "You've obtained your first Unique equipment item. You can only obtain each Unique item one time. Any subsequent time you would gain that item, you instead gain XP for that item. A Unique item can reach level 1000 and will gain increased stats as well as increased effectiveness for its abilities.";
    }

    if (addToLog)
      this.lookupService.addTutorialToLog(type, subzoneEnum);

    return text;
  }
}
