import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GodLevelIncreaseEnum } from 'src/app/models/enums/god-level-increase-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-god-view',
  templateUrl: './god-view.component.html',
  styleUrls: ['./god-view.component.css']
})
export class GodViewComponent implements OnInit {
  @Input() god: God;
  characters: Character[];
  characterTemplate: CharacterEnum = CharacterEnum.Adventurer;
  subscription: any;
  abilityList: Ability[] = [];

  constructor(private lookupService: LookupService, private globalService: GlobalService, private gameLoopService: GameLoopService,
    private menuService: MenuService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
    if (selectedGod !== undefined) {
      this.god = selectedGod;
      this.abilityList = this.god.abilityList.sort(function (a, b) {
        return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
      }).filter(item => item.isAvailable);

      //for each character, check if this is the assigned god. if so, default template to you
      this.globalService.getActivePartyCharacters(true).forEach(character => {
        if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
          this.characterTemplate = character.type;
      });
    }

    this.characters = this.globalService.globalVar.characters.filter(item => item.isAvailable);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.menuService.selectedGod !== undefined && this.menuService.selectedGod !== this.god.type) {
        var selectedGod = this.globalService.globalVar.gods.find(item => item.type === this.menuService.selectedGod);
        if (selectedGod !== undefined) {
          this.god = selectedGod;
          this.abilityList = this.god.abilityList.sort(function (a, b) {
            return a.isPassive && !b.isPassive ? -1 : !a.isPassive && b.isPassive ? 1 : 0;
          }).filter(item => item.isAvailable);

          this.globalService.getActivePartyCharacters(true).forEach(character => {
            if (character.assignedGod1 === this.god.type || character.assignedGod2 === this.god.type)
              this.characterTemplate = character.type;
          });
        }
      }
    });
  }

  getGodAbilityDescription(abilityName: string, ability?: Ability) {
    var defaultCharacter = new Character();
    var character = this.globalService.globalVar.characters.find(item => item.type.toString() === this.characterTemplate.toString());

    if (character !== undefined)
      defaultCharacter = character;
    return this.lookupService.getGodAbilityDescription(abilityName, defaultCharacter, ability);
  }

  getGodColor() {
    return this.lookupService.getGodColorClass(this.god.type);
  }

  getGodLevelRewards() {
    var totalLevelDisplay = 10;
    var statDisplayCount = 0;
    var rewards = "";
    var nextStatToIncrease = this.god.lastStatGain;
    var previousLevel = this.god.level;

    for (var i = 0; i < totalLevelDisplay; i++) {
      var nextLevel = previousLevel + 1;     

      if (statDisplayCount >= 6) {

        if (i === totalLevelDisplay - 1) {
          //set next level to the next biggest thing
          if (nextLevel < this.utilityService.godAbility2Level)
            nextLevel = this.utilityService.godAbility2Level;
          else if (nextLevel < this.utilityService.permanentDefaultGodAbilityLevel)
            nextLevel = this.utilityService.permanentDefaultGodAbilityLevel;
          else if (nextLevel < 50) //permanent stat 1
            nextLevel = 50;
          else if (nextLevel < this.utilityService.godAbility3Level)
            nextLevel = this.utilityService.godAbility3Level;
          else if (nextLevel < 100) //permanent stat 2
            nextLevel = 100;
          else if (nextLevel < this.utilityService.permanentGodAbility2Level)
            nextLevel = this.utilityService.permanentGodAbility2Level;
          else if (nextLevel < 150) //permanent stat 3
            nextLevel = 150;
          else if (nextLevel < this.utilityService.permanentPassiveGodLevel)
            nextLevel = this.utilityService.permanentPassiveGodLevel;
          else if (nextLevel < 200) //permanent stat 4
            nextLevel = 200;
          else if (nextLevel <= 500) //end of permanent stats
            nextLevel  = Math.ceil(nextLevel / 25) * 25;
          else 
            nextLevel = Math.ceil(nextLevel / 5) * 5;  //for now, just go back to showing upgrades
        }
        else {
          //set next level to multiple of 5
          nextLevel = Math.ceil(nextLevel / 5) * 5;
        }

      }
      
      var nextLevelType = this.globalService.getGodLevelIncreaseTypeByLevel(nextLevel);       
      if (nextLevel - previousLevel > 1)
        rewards += "...<br/>";

      rewards += "<strong>Lv " + nextLevel + " </strong>- ";

      if (nextLevelType === GodLevelIncreaseEnum.Stats) {        
        nextStatToIncrease = this.globalService.getNextStatToIncrease(nextStatToIncrease);        
        var statGainAmount = this.utilityService.godStatGainBaseAmount + ((this.god.statGainCount + statDisplayCount) * this.utilityService.godStatGainLevelIncrement);
        statDisplayCount += 1;

        var increaseValues = this.globalService.getGodLevelStatIncreaseValues(this.god, nextStatToIncrease, statGainAmount);
        rewards += "+";
        if (increaseValues.maxHp > 0)
          rewards += Math.round(increaseValues.maxHp) + " Max HP, ";
        if (increaseValues.attack > 0)
          rewards += Math.round(increaseValues.attack) + " Attack, ";
        if (increaseValues.agility > 0)
          rewards += Math.round(increaseValues.agility) + " Agility, ";
        if (increaseValues.luck > 0)
          rewards += Math.round(increaseValues.luck) + " Luck, ";
        if (increaseValues.defense > 0)
          rewards += Math.round(increaseValues.defense) + " Defense, ";
        if (increaseValues.resistance > 0)
          rewards += Math.round(increaseValues.resistance) + " Resistance, ";

        if (rewards !== "")
          rewards = rewards.substring(0, rewards.length - 2);
      }
      if (nextLevelType === GodLevelIncreaseEnum.NewAbility) {        
        if (nextLevel === this.utilityService.godPassiveLevel) {
          rewards += this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + " (Passive Ability)";
        }
        if (nextLevel === this.utilityService.godAbility2Level) {
          rewards += this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + " (Ability 2)";
        }
        if (nextLevel === this.utilityService.godAbility3Level) {
          rewards += this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + " (Ability 3)";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentAbility) {
        if (nextLevel === this.utilityService.permanentDefaultGodAbilityLevel) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel)?.name + " After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentPassiveGodLevel) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godPassiveLevel)?.name + " After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility2Level) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility2Level)?.name + " After Level Reset";
        }
        if (nextLevel === this.utilityService.permanentGodAbility3Level) {
          rewards += "Permanently Keep " + this.god.abilityList.find(item => item.requiredLevel === this.utilityService.godAbility3Level)?.name + " After Level Reset";
        }
      }
      if (nextLevelType === GodLevelIncreaseEnum.AbilityUpgrade) {
        var upgradedAbility = this.globalService.getWhichAbilityUpgrade(this.god, nextLevel);        
        if (upgradedAbility !== undefined)
          rewards += upgradedAbility.ability.name + " Upgrade " + upgradedAbility.upgradeLevel;
      }
      if (nextLevelType === GodLevelIncreaseEnum.PermanentStats) {
        rewards += "Permanent Stats! (TODO)";
      }

      rewards += "<br/>";
      previousLevel = nextLevel;
    }
    this.globalService.getGodLevelIncreaseTypeByLevel(this.god.level);
    /*var statToIncrease = this.getNextStatToIncrease(god.lastStatGain);
    god.lastStatGain = statToIncrease;
    var statGainAmount = this.utilityService.godStatGainBaseAmount + (god.statGainCount * this.utilityService.godStatGainLevelIncrement);    

    var increaseValues = this.getGodLevelStatIncreaseValues(god, statToIncrease, statGainAmount);*/

    return rewards;
  }
}
