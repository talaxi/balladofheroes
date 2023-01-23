import { Injectable } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private lookupService: LookupService) { }

  getTutorialText(type: TutorialTypeEnum, newAbility?: Ability, character?: Character, addToLog: boolean = true) {    
    var text = "";

    if (type === TutorialTypeEnum.CharacterPassiveAbility) {
      text = "Each character gains a unique passive ability at level 4. View your passive ability by hovering over your character's name or viewing their character page.";
      if (newAbility !== undefined && character !== undefined)
        text += "<br/>" + this.lookupService.getCharacterAbilityDescription(newAbility.name, character);
    }
    else if (type === TutorialTypeEnum.AutoAttack) {
      text = "You automatically attack opponents over time. Hover over the sword by your character's name for more details.";
    }
    else if (type === TutorialTypeEnum.BattleItems) {
      text = "You received your first battle item. Click the plus sign on the bottom left to add an item to your item belt and click the item again to use it. Some items require you to click an ally or enemy to use. Hover over an item to see its effect.";
    }
    else if (type === TutorialTypeEnum.NewSubzone) {
      text = "You've won enough battles here to move to the next area. On the right side of the screen, select 'Bay' to move to the next subzone within the 'Aigosthena' zone. If you wish, you can select 'Auto Progress' at the top of the page to automatically move to the next subzone when possible.";
    }
    else if (type === TutorialTypeEnum.Town) {
      text = "Towns offer respite and the opportunity to trade. Every few seconds, you will regain HP. Click the 'General' option to see new equipment options.";
    }
    else if (type === TutorialTypeEnum.Crafting) {
      text = "Crafters can create unique items with materials found from battle. Keep an eye out for what loot you are receiving from individual enemies.";
    }

    if (addToLog)
      this.lookupService.addTutorialToLog(type);

    return text;
  }
}
