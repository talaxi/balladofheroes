import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-character-name-view',
  templateUrl: './character-name-view.component.html',
  styleUrls: ['./character-name-view.component.css']
})
export class CharacterNameViewComponent implements OnInit {
  @Input() character: Character;
  previousLevel: number;
  public noCharacter = CharacterEnum.None;
  public noGod = GodEnum.None;
  showDevStats = false;
  showLevelUpAnimation = false;
  subscription: any;
  animationTimer = 0;
  animationTimerCap = 3;
  levelUpAnimationText = "Lv Up!";

  constructor(public lookupService: LookupService, private globalService: GlobalService, private menuService: MenuService,
    private layoutService: LayoutService, private utilityService: UtilityService, private deploymentService: DeploymentService,
    private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.showDevStats = this.deploymentService.showStats;
    this.previousLevel = this.character.level;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async (deltaTime) => {
      if (this.character.level > this.previousLevel)
      {
        this.showLevelUpAnimation = true;
        this.previousLevel = this.character.level;
      }

      if (this.showLevelUpAnimation) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationTimerCap) {
          this.animationTimer = 0;
          this.showLevelUpAnimation = false;
        }
      }
    });
  }

  goToCharacterDetails() {    
    this.layoutService.changeLayout(NavigationEnum.Menu);
    this.menuService.selectedMenuDisplay = MenuEnum.Characters;
    this.menuService.setSelectedCharacter(this.character.type);
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

    return "";
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

    return this.utilityService.getSanitizedHtml(passiveDescription);
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

  getCharacterDps() {
    return this.lookupService.getCharacterDps(this.character);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
    {
      this.subscription.unsubscribe();
    }
  }
}
