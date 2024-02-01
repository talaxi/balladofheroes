import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Enemy } from 'src/app/models/character/enemy.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-enemy-description-view',
  templateUrl: './enemy-description-view.component.html',
  styleUrls: ['./enemy-description-view.component.css']
})
export class EnemyDescriptionViewComponent {
  @Input() character: Enemy;
  defeatCount: number = 0;
  subscription: any;
  sizeSubscription: any;
  @ViewChild('enemyDescriptionView') containerDiv: ElementRef;
  @ViewChild('infoView') infoDiv: ElementRef;

  constructor(public utilityService: UtilityService, public lookupService: LookupService, private dictionaryService: DictionaryService,
    private gameLoopService: GameLoopService, private globalService: GlobalService) {

  }

  ngOnInit() {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.character !== undefined) {
        var defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.character.bestiaryType);
        if (defeatCount !== undefined)
          this.defeatCount = defeatCount.count;
      }
    });
  }

  ngAfterViewInit() {
    //console.log(".98 * " + window.innerHeight + " < " + this.containerDiv.nativeElement.clientHeight + " + " + this.containerDiv.nativeElement.getBoundingClientRect().y);
    //console.log(this.containerDiv.nativeElement);
    //if (this.containerDiv !== undefined && (window.innerHeight * .98) < this.containerDiv.nativeElement.clientHeight + this.containerDiv.nativeElement.getBoundingClientRect().y) {
    //  this.containerDiv.nativeElement.classList.add('smallText');
    //}

    this.sizeSubscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      //this gives the necessary delay so that window is correctly sized      
      //console.log("** .98 * " + window.innerHeight + " < " + this.containerDiv.nativeElement.clientHeight + " + " + this.containerDiv.nativeElement.getBoundingClientRect().y);
      if (this.containerDiv !== undefined && (window.innerHeight * .98) < this.containerDiv.nativeElement.clientHeight + this.containerDiv.nativeElement.getBoundingClientRect().y) {
        this.containerDiv.nativeElement.classList.add('smallText');
        this.sizeSubscription.unsubscribe();
      }
    });
  }

  getLootItem(loot: LootItem) {
    var name = "";

    if (this.defeatCount >= this.utilityService.killCountDisplayFullEnemyLoot) {
      name = loot.amount + "x " + this.dictionaryService.getItemName(loot.item) + " (" + this.utilityService.genericRound(loot.chance * 100) + "%)";
    }
    else if (this.defeatCount >= this.utilityService.killCountDisplayBasicEnemyLoot) {
      name = this.dictionaryService.getItemName(loot.item);
    }

    return name;
  }

  getCharacterAttackSpeed() {
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyAverageAutoAttackSpeed)
      return "Average";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyQuickAutoAttackSpeed)
      return "Quick";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyLongAutoAttackSpeed)
      return "Long";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyVeryLongAutoAttackSpeed)
      return "Very Long";

    return "";
  }

  getElementalStrengths() {
    var increases = "";
    if (this.character.battleStats.elementIncrease.fire > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Fire Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.fire * 100) + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.holy > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Holy Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.holy * 100) + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.water > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Water Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.water * 100) + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.air > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Air Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.air * 100) + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.earth > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Earth Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.earth * 100) + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.lightning > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Lightning Damage Dealt:</span> <span class='statValue'>+" + this.utilityService.genericRound(this.character.battleStats.elementIncrease.lightning * 100) + "%</span>";
    }

    return increases;
  }

  getElementalWeaknesses() {
    var decreases = "";
    if (this.character.battleStats.elementResistance.water > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.water * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.fire * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.holy * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.air * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.earth * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>-" + this.utilityService.genericRound(this.character.battleStats.elementResistance.lightning * 100) + "%</span>";
    }

    if (this.character.battleStats.elementResistance.water < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.water) * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.holy) * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.air) * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.earth) * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.fire) * 100) + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>+" + this.utilityService.genericRound(Math.abs(this.character.battleStats.elementResistance.lightning) * 100) + "%</span>";
    }

    return decreases;
  }

  getAttack() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.attack);
  }

  getMaxHp() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.maxHp);
  }

  getDefense() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.defense);
  }

  getAgility() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.agility);
  }

  getLuck() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.luck);
  }

  getResistance() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.resistance);
  }

  getCharacterCriticalHitChance(whichCharacter: number) {
    var party = this.globalService.getActivePartyCharacters(true);

    var partyMember = party[0];
    if (whichCharacter === 2) {
      partyMember = party[1];
    }

    var critChance = this.lookupService.getDamageCriticalChanceByNumbers(this.lookupService.getAdjustedLuck(partyMember, true), this.lookupService.getAdjustedResistance(this.character));
    
    var trueShot = this.lookupService.characterHasAbility("True Shot", partyMember);
    if (trueShot !== undefined && this.character.battleInfo.statusEffects.some(effect => !effect.isPositive)) {
      critChance *= trueShot.secondaryEffectiveness;
    }

    if (critChance < .01)
      critChance = .01;

    if (critChance > 1)
      critChance = 1;

    var critPercent = this.utilityService.roundTo(critChance * 100, 2);

    return "<span class='bold " + this.globalService.getCharacterColorClassText(partyMember.type) + "'>" + critPercent + "%</span>";
  }

  getCharacterChanceToBeCriticallyHit(whichCharacter: number) {
    var party = this.globalService.getActivePartyCharacters(true);

    var partyMember = party[0];
    if (whichCharacter === 2) {
      partyMember = party[1];
    }

    var critChance = this.lookupService.getDamageCriticalChanceByNumbers(this.lookupService.getAdjustedLuck(this.character), this.lookupService.getAdjustedResistance(partyMember, true));

    if (critChance < .01)
      critChance = .01;

    if (critChance > 1)
      critChance = 1;

    var critPercent = this.utilityService.roundTo(critChance * 100, 2);

    return "<span class='bold " + this.globalService.getCharacterColorClassText(partyMember.type) + "'>" + critPercent + "%</span>";
  }

  getActivePartyCount() {
    return this.globalService.getActivePartyCharacters(true).length;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    if (this.sizeSubscription !== undefined)
      this.sizeSubscription.unsubscribe();
  }
}
