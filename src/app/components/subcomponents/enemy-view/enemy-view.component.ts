import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';

@Component({
  selector: 'app-enemy-view',
  templateUrl: './enemy-view.component.html',
  styleUrls: ['./enemy-view.component.css']
})
export class EnemyViewComponent implements OnInit {
  @Input() enemyParty: Enemy[];
  @Input() character: Enemy;
  @Input() showNewEnemyGroupAnimation: boolean = false;
  @Input() isBoss = false;
  tooltipDirection = DirectionEnum.Down;
  defeatCount: number;
  subscription: any;
  characterTargeting: boolean = false;
  bothCharactersTargeting: boolean = false;  
  @ViewChild('enemyNameContainer') enemyNameContainer: ElementRef;
  @ViewChild('enemyName') enemyName: ElementRef;
  previousName = "";

  constructor(public battleService: BattleService, public lookupService: LookupService, public utilityService: UtilityService,
    public globalService: GlobalService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {     
      var defeatCount: EnemyDefeatCount | undefined;

      if (this.character !== undefined)
      {
        defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.character.bestiaryType);
      
        if (this.previousName !== this.character.name)
        {
          this.enemyName.nativeElement.classList.remove('smallText');
          this.enemyName.nativeElement.classList.remove('verySmallText');
        }
  
        if ((this.enemyNameContainer.nativeElement.offsetHeight * 2.5) < this.enemyName.nativeElement.offsetHeight)
        {
          this.enemyName.nativeElement.classList.add('verySmallText');      
        }
        if ((this.enemyNameContainer.nativeElement.offsetHeight * 1.5) < this.enemyName.nativeElement.offsetHeight)
        {
          this.enemyName.nativeElement.classList.add('smallText');      
        }
  
        this.previousName = this.character.name;  
      }

      if (defeatCount !== undefined)
        this.defeatCount = defeatCount.defeatCount;
      else
        this.defeatCount = 0;

      this.characterTargeting = this.globalService.getActivePartyCharacters(true).some(item => item.targeting === this.character);
      this.bothCharactersTargeting = this.globalService.getActivePartyCharacters(true).filter(item => item.targeting === this.character).length > 1;
    });
  }

  getCharacterHpPercent(character: Enemy) {
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
  }

  getCharacterBarrierPercent(character: Enemy) {
    return (character.battleInfo.barrierValue / character.battleStats.maxHp) * 100;
  }

  getCharacterAutoAttackProgress(character: Enemy) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  targetCharacterWithItem(character: Character) {
    var isTargeted = false;

    var isTargetable = this.battleService.isTargetableWithItem(character, true);

    if (this.battleService.targetbattleItemMode && isTargetable) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }

  partyCharacterTargeting(character: Character) {
    var isTargeted = false;

    if (this.battleService.targetCharacterMode)
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnCharacter(character: Character) {
    //console.log("Checking battle item");
    if (!this.battleService.targetCharacterMode && this.targetCharacterWithItem(character))
      return this.battleService.useBattleItemOnCharacter(character, this.enemyParty);
  }

  characterTargetEnemy(character: Character) {
    if (character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Dead) !== undefined)  
      return;    
    
    if (this.battleService.targetCharacterMode) {
      var targetingCharacter = this.globalService.globalVar.characters.find(item => item.type === this.battleService.characterInTargetMode);
      if (targetingCharacter !== undefined)
      {
        targetingCharacter.targeting = character;
      }
    }

    this.battleService.targetCharacterMode = false;
  }

  getCharacterBarrierValue(character: Character) {
    return character.battleInfo.barrierValue;
  }

  getCharacterCurrentHp() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.currentHp + this.getCharacterBarrierValue(this.character));
  }

  getCharacterMaxHp() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.maxHp);
  }

  getLootItem(loot: LootItem) {
    var name = "";

    if (this.defeatCount >= this.utilityService.killCountDisplayFullEnemyLoot) {
      name = loot.amount + "x " + this.lookupService.getItemName(loot.item) + " (" + (loot.chance * 100) + "%)";
    }
    else if (this.defeatCount >= this.utilityService.killCountDisplayBasicEnemyLoot) {
      name = this.lookupService.getItemName(loot.item);
    }

    return name;
  }

  getTargetClass() {
    return {
      'characterTargeted': this.targetCharacterWithItem(this.character),
      'characterTargetedAdventurer': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Adventurer,
      'characterTargetedArcher': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Archer,
      'characterTargetedWarrior': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Warrior,
      'characterTargetedPriest': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Priest
    };
  }

  getFirstCharacterTargeting() {
    var src = "assets/svg/";

    var character = this.globalService.getActivePartyCharacters(true).find(item => item.targeting === this.character);

    if (character !== undefined) {
      if (character.type === CharacterEnum.Adventurer)
        src += "adventurerTarget.svg";
      if (character.type === CharacterEnum.Archer)
        src += "archerTarget.svg";
        if (character.type === CharacterEnum.Warrior)
        src += "warriorTarget.svg";
        if (character.type === CharacterEnum.Priest)
        src += "priestTarget.svg";
    }
    return src;
  }

  getSecondCharacterTargeting() {
    var src = "assets/svg/";
       
    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Adventurer)
      src += "adventurerTarget.svg";
    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Archer)
      src += "archerTarget.svg";  
      if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Warrior)
      src += "warriorTarget.svg";
      if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Priest)
      src += "priestTarget.svg";  

    return src;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }

  /*ngOnChanges(changes: any) {
    this.showNewEnemyGroupAnimation = changes.showNewEnemyGroupAnimation.currentValue;    
  }*/
}
