import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
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
  public godEnum = GodEnum;
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
    private gameLoopService: GameLoopService, private layoutService: LayoutService, private menuService: MenuService,
    private battleService: BattleService) { }

  ngOnInit(): void {
    this.previousGod1Level = this.getCharacterGodLevel(this.character, 1);
    this.previousGod2Level = this.getCharacterGodLevel(this.character, 2);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      var god1Level = this.getCharacterGodLevel(this.character, 1);
      var god2Level = this.getCharacterGodLevel(this.character, 2);

      if (god1Level > this.previousGod1Level) {
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

      if (god2Level > this.previousGod2Level) {
        this.showGod2LevelUpAnimation = true;
        this.previousGod2Level = god2Level;
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

  goToGodDetails(whichGod: number) {
    if (this.isButtonActive()) {
      this.layoutService.changeLayout(NavigationEnum.Menu);
      this.menuService.selectedMenuDisplay = MenuEnum.Gods;

      if (whichGod === 1)
        this.menuService.setSelectedGod(this.character.assignedGod1);
      else if (whichGod === 2)
        this.menuService.setSelectedGod(this.character.assignedGod2);
    }
  }

  getGodSpecificProgressBar(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return 0;

    if (god.type === GodEnum.Apollo) {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", this.character);
      if (ostinato !== undefined)
      {
        return 100 - ((ostinato.currentCooldown / this.lookupService.getAbilityCooldown(ostinato, this.character)) * 100);
      }
    }

    return 0;
  }

  toggleAuto(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return false;

    //each god may have different specifications
    if (god.type === GodEnum.Apollo) {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", this.character);
      if (ostinato !== undefined) {
        ostinato.autoMode = !ostinato.autoMode;
      }
    }
    return false;
  }

  manuallyTrigger(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return;

    //each god may have different specifications
    if (god.type === GodEnum.Apollo) {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", this.character);
      if (ostinato !== undefined) {
        ostinato.manuallyTriggered = true;
      }
    }
  }

  isGodSpecificAbilityAuto(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return false;

    //each god may have different specifications
    if (god.type === GodEnum.Apollo) {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", this.character);
      if (ostinato !== undefined) {
        return ostinato.autoMode;
      }
    }
    return false;
  }

  godSpecificAbilityUnlocked(whichGod: number) {
    var matchTo = this.character.assignedGod1;
    if (whichGod === 2)
      matchTo = this.character.assignedGod2;

    var god = this.globalService.globalVar.gods.find(item => item.type === matchTo);
    if (god === undefined)
      return false;


    //each god may have different specifications
    if (god.type === GodEnum.Apollo) {
      var ostinato = this.lookupService.characterHasAbility("Ostinato", this.character);
      if (ostinato !== undefined) {
        return god.level >= ostinato.requiredLevel;
      }
    }

    return false;
  }

  isButtonActive() {
    if (this.battleService.targetbattleItemMode && this.battleService.isTargetableWithItem(this.character, false)) {
      return false;
    }
    else
      return true;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
