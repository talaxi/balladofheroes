import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-god-name-view',
  templateUrl: './god-name-view.component.html',
  styleUrls: ['./god-name-view.component.css']
})
export class GodNameViewComponent implements OnInit {
  @Input() character: Character;
  public noCharacter = CharacterEnum.None;
  public noGod = GodEnum.None;
  previousGod1Level: number;
  previousGod2Level: number;
  showGod1LevelUpAnimation = false;
  showGod2LevelUpAnimation = false;
  subscription: any;
  animation1Timer = 0;
  animation2Timer = 0;
  animationTimerCap = 3;
  levelUpAnimationText = "Lv Up!";
  
  constructor(private globalService: GlobalService, public lookupService: LookupService, private utilityService: UtilityService,
    private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.previousGod1Level = this.getCharacterGodLevel(this.character, 1);
    this.previousGod2Level = this.getCharacterGodLevel(this.character, 2);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      var god1Level = this.getCharacterGodLevel(this.character, 1);
      var god2Level = this.getCharacterGodLevel(this.character, 2);
      
      if (god1Level > this.previousGod1Level)
      {
        this.showGod1LevelUpAnimation = true;
        this.previousGod1Level = god1Level;
      }

      if (this.showGod1LevelUpAnimation) {
        this.animation1Timer += deltaTime;
        if (this.animation1Timer >= this.animationTimerCap) {
          this.animation1Timer = 0;
          this.showGod1LevelUpAnimation = false;
        }
      }

      if (god2Level > this.previousGod2Level)
      {
        this.showGod2LevelUpAnimation = true;
        this.previousGod2Level = god1Level;
      }

      if (this.showGod2LevelUpAnimation) {
        this.animation2Timer += deltaTime;
        if (this.animation2Timer >= this.animationTimerCap) {
          this.animation2Timer = 0;
          this.showGod2LevelUpAnimation = false;
        }
      }
    });
  }

  getCharacterGodName(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    
    if (god !== undefined) {
      return god.name;
    }

    return "";
  }

  getCharacterGodLevel(character: Character, whichGod: number) {
    var matchTo = character.assignedGod1;
    if (whichGod === 2)
      matchTo = character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return god.level;
    }

    return 0;
  }

  getGodExp(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return Math.round(god.exp);
    }

    return 0;
  }

  getGodExpToNextLevel(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god !== undefined) {
      return Math.round(god.expToNextLevel);
    }

    return 0;
  }
  
  getGodPassiveDescription(whichGod: number) {
    var passiveDescription = "";

    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined || !god.abilityList.some(ability => ability.isPassive && ability.isAvailable)) {
      return passiveDescription;      
    }

    var passiveAbility = god.abilityList.find(item => item.isPassive && item.isAvailable);
    if (passiveAbility === undefined)
      return passiveDescription;

    passiveDescription = this.lookupService.getGodAbilityDescription(passiveAbility.name, this.character, passiveAbility);

    return passiveDescription;
  }

  getCharacterPassiveDescription() {    
    var passiveDescription = "";

    var passiveAbility = this.character.abilityList.find(item => item.isPassive && item.isAvailable);
    if (passiveAbility === undefined)
      return passiveDescription;

    passiveDescription = this.lookupService.getCharacterAbilityDescription(passiveAbility.name, this.character, passiveAbility);

    return passiveDescription;
  }

  getCharacterXpPercent() {
    return (this.character.exp / this.character.expToNextLevel) * 100;
  }

  getGodXpPercent(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    
    if (god !== undefined) {
      return (god.exp / god.expToNextLevel) * 100;
    }

    return 0;
  }

  isCharacterPassiveUnlocked() {
    return this.character.abilityList.some(item => item.isPassive && item.isAvailable);
  }

  isGodPassiveUnlocked(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return false;

    return god.abilityList.some(item => item.isPassive && item.isAvailable);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
    {
      this.subscription.unsubscribe();
    }
  }
}
