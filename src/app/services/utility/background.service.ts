import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { BattleService } from '../battle/battle.service';
import { GlobalService } from '../global/global.service';
import { AlchemyService } from '../professions/alchemy.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private globalService: GlobalService, private battleService: BattleService, private utilityService: UtilityService,
    private alchemyService: AlchemyService) { }

  //global -- this occurs even when at a scene or in a town
  handleBackgroundTimers(deltaTime: number) {
    this.alchemyService.handleAlchemyTimer(deltaTime);
    var party = this.globalService.getActivePartyCharacters(true);

    party.forEach(partyMember => {
      //check for defeated      
      var isDefeated = this.battleService.isCharacterDefeated(partyMember);
      if (!isDefeated && !this.utilityService.isBattlePaused) {
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.AlwaysActive, partyMember, new Character(), party, []);
        this.battleService.handleAutoAttackTimer(partyMember, deltaTime);
        this.handleAbilityCooldowns(partyMember, deltaTime);
        this.battleService.handleStatusEffectDurations(true, partyMember, deltaTime);
      }
    });
  }

  handleTown(deltaTime: number, loading: any) {
    var party = this.globalService.getActivePartyCharacters(true);
    this.gainHpInTown(party, deltaTime);
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

  gainHpInTown(party: Character[], deltaTime: number) {
    this.globalService.globalVar.timers.townHpGainTimer += deltaTime;
    var teamNeedsHealing = party.some(item => item.battleStats.currentHp < item.battleStats.maxHp);

    while (this.globalService.globalVar.timers.townHpGainTimer > this.globalService.globalVar.timers.townHpGainLength && teamNeedsHealing) {
      party.forEach(partyMember => {
        if (partyMember.battleStats.currentHp < partyMember.battleStats.maxHp) {          
          partyMember.battleStats.currentHp += Math.ceil(partyMember.battleStats.maxHp * .02);
        }

        if (partyMember.battleStats.currentHp >= partyMember.battleStats.maxHp) {
          partyMember.battleStats.currentHp = partyMember.battleStats.maxHp;
        }
      });

      this.globalService.globalVar.timers.townHpGainTimer -= this.globalService.globalVar.timers.townHpGainLength;
      teamNeedsHealing = party.some(item => item.battleStats.currentHp < item.battleStats.maxHp);

      if (!teamNeedsHealing)        
        this.globalService.globalVar.timers.townHpGainTimer = 0;
    }
  }
}
