import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { BattleService } from '../battle/battle.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private globalService: GlobalService, private battleService: BattleService) { }

  //global -- this occurs even when at a scene or in a town
  handleBackgroundTimers(deltaTime: number) {    
    var party = this.globalService.getActivePartyCharacters(true);

      party.forEach(partyMember => {
        //check for defeated
        var isDefeated = this.battleService.isCharacterDefeated(partyMember);
        if (!isDefeated) {
          this.battleService.handleAutoAttackTimer(partyMember, deltaTime);
          this.handleAbilityCooldowns(partyMember, deltaTime);
          this.battleService.handleStatusEffectDurations(partyMember, deltaTime);
        }
      });    
  }

  handleAbilityCooldowns(character: Character, deltaTime: number) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        this.battleService.handleAbilityCooldown(character, ability, deltaTime);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }
  }
}
