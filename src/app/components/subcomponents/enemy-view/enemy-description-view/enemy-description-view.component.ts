import { Component, Input } from '@angular/core';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
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

  constructor(public utilityService: UtilityService, public lookupService: LookupService, private dictionaryService: DictionaryService,
    private gameLoopService: GameLoopService, private globalService: GlobalService) {

  }

  ngOnInit() {
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      if (this.character !== undefined) {
        var defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.character.bestiaryType);
        if (defeatCount !== undefined)
          this.defeatCount = defeatCount.count;

        //TODO: undo
        this.defeatCount = 100;
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
      increases += "<span class='statLabel'>Fire Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.fire * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.holy > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Holy Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.holy * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.water > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Water Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.water * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.air > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Air Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.air * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.earth > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Earth Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.earth * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.lightning > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Lightning Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.lightning * 100 + "%</span>";
    }

    return increases;
  }

  getElementalWeaknesses() {
    var decreases = "";
    if (this.character.battleStats.elementResistance.water > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.water * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.fire * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.holy * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.air * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.earth * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.lightning * 100 + "%</span>";
    }

    if (this.character.battleStats.elementResistance.water < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.water) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.holy) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.air) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.earth) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.fire) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.lightning) * 100 + "%</span>";
    }

    return decreases;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
