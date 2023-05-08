import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private lookupService: LookupService, private deviceDetectorService: DeviceDetectorService) { }

  getTutorialText(type: TutorialTypeEnum, newAbility?: Ability, character?: Character, addToLog: boolean = true) {    
    var text = "";

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
        text = "You automatically attack opponents over time. Tap and hold the sword by your character's name for more details.";
      else
        text = "You automatically attack opponents over time. Hover over the sword by your character's name for more details.";
    }
    else if (type === TutorialTypeEnum.BattleItems) {
      if (this.deviceDetectorService.isMobile())
        text = "You received your first battle item. Tap the gray sack icon on the quick link bar above your character's name to open your item belt. Tap the plus sign on the left to add an item to your item belt and tap the item again to use it. Some items require you to click an ally or enemy to use. Tap and hold an item to see its effect.";
      else
        text = "You received your first battle item. Click the plus sign on the bottom left to add an item to your item belt and click the item again to use it. Some items require you to click an ally or enemy to use. Hover over an item to see its effect.";
    }
    else if (type === TutorialTypeEnum.NewSubzone) {
      if (this.deviceDetectorService.isMobile())
        text = "You've won enough battles here to move to the next area. To the right of the subzone name, tap the down arrow and then tap 'Bay' to move to the next subzone within the 'Aigosthena' zone. If you wish, you can select 'Auto Progress' at the top of the page to automatically move to the next subzone when possible.";
      else
        text = "You've won enough battles here to move to the next area. On the right side of the screen, select 'Bay' to move to the next subzone within the 'Aigosthena' zone. If you wish, you can select 'Auto Progress' at the top of the page to automatically move to the next subzone when possible.";
    }
    else if (type === TutorialTypeEnum.Town) {
      if (this.deviceDetectorService.isMobile())
        text = "Towns offer respite and the opportunity to trade. Every few seconds, you will regain HP. Tap the 'General' option to see new equipment options.";
      else
        text = "Towns offer respite and the opportunity to trade. Every few seconds, you will regain HP. Click the 'General' option to see new equipment options.";
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
        text = "You've acquired your first equipment item. Tap on 'Adventurer' in the middle of the screen to quickly jump to the menu and view the character page. Use the 'Change Equipment' button to update your equipment.";
      else
        text = "You've acquired your first equipment item. Click on 'Adventurer' on the top left of the screen to quickly jump to the menu and view the character page. Use the 'Change Equipment' button to update your equipment.";
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

    if (addToLog)
      this.lookupService.addTutorialToLog(type);

    return text;
  }
}
