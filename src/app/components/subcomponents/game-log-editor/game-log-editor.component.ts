import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-game-log-editor',
  templateUrl: './game-log-editor.component.html',
  styleUrls: ['./game-log-editor.component.css']
})
export class GameLogEditorComponent implements OnInit {
  partyAutoAttacks = false;
  partyAbilityUse = false;
  enemyAutoAttacks = false;
  enemyAbilityUse = false;
  partyEquipmentEffect = false;
  partyStatusEffect = false;
  enemyStatusEffect = false;
  battleRewards = false;
  partyLevelUp = false;
  godLevelUp = false;
  achievementUnlocked = false;
  alchemyLevelUp = false;
  alchemyCreation = false;
  battleUpdates = false;
  useBattleItem = false;
  followerSearch = false;
  followerPrayer = false;

  followersUnlocked = false;
  alchemyUnlocked = false;

  constructor(private globalService: GlobalService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.alchemyUnlocked = this.globalService.globalVar.alchemy.isUnlocked;
    this.followersUnlocked = this.globalService.globalVar.followerData.availableFollowers > 0;

    var partyAutoAttacks = this.globalService.globalVar.gameLogSettings.get("partyAutoAttacks");
    if (partyAutoAttacks === undefined)
      this.partyAutoAttacks = false;
    else
      this.partyAutoAttacks = partyAutoAttacks;

    var partyAbilityUse = this.globalService.globalVar.gameLogSettings.get("partyAbilityUse");
    if (partyAbilityUse === undefined)
      this.partyAbilityUse = false;
    else
      this.partyAbilityUse = partyAbilityUse;

    var enemyAutoAttacks = this.globalService.globalVar.gameLogSettings.get("enemyAutoAttacks");
    if (enemyAutoAttacks === undefined)
      this.enemyAutoAttacks = false;
    else
      this.enemyAutoAttacks = enemyAutoAttacks;

    var enemyAbilityUse = this.globalService.globalVar.gameLogSettings.get("enemyAbilityUse");
    if (enemyAbilityUse === undefined)
      this.enemyAbilityUse = false;
    else
      this.enemyAbilityUse = enemyAbilityUse;

    var partyEquipmentEffect = this.globalService.globalVar.gameLogSettings.get("partyEquipmentEffect");
    if (partyEquipmentEffect === undefined)
      this.partyEquipmentEffect = false;
    else
      this.partyEquipmentEffect = partyEquipmentEffect;

    var partyStatusEffect = this.globalService.globalVar.gameLogSettings.get("partyStatusEffect");
    if (partyStatusEffect === undefined)
      this.partyStatusEffect = false;
    else
      this.partyStatusEffect = partyStatusEffect;

    var enemyStatusEffect = this.globalService.globalVar.gameLogSettings.get("enemyStatusEffect");
    if (enemyStatusEffect === undefined)
      this.enemyStatusEffect = false;
    else
      this.enemyStatusEffect = enemyStatusEffect;

    var battleRewards = this.globalService.globalVar.gameLogSettings.get("battleRewards");
    if (battleRewards === undefined)
      this.battleRewards = false;
    else
      this.battleRewards = battleRewards;

    var partyLevelUp = this.globalService.globalVar.gameLogSettings.get("partyLevelUp");
    if (partyLevelUp === undefined)
      this.partyLevelUp = partyLevelUp;
    else
      this.partyLevelUp = partyLevelUp;

    var godLevelUp = this.globalService.globalVar.gameLogSettings.get("godLevelUp");
    if (godLevelUp === undefined)
      this.godLevelUp = false;
    else
      this.godLevelUp = godLevelUp;

    var achievementUnlocked = this.globalService.globalVar.gameLogSettings.get("achievementUnlocked");
    if (achievementUnlocked === undefined)
      this.achievementUnlocked = false;
    else
      this.achievementUnlocked = achievementUnlocked;

    var alchemyLevelUp = this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp");
    if (alchemyLevelUp === undefined)
      this.alchemyLevelUp = false;
    else
      this.alchemyLevelUp = alchemyLevelUp;

    var alchemyCreation = this.globalService.globalVar.gameLogSettings.get("alchemyCreation");
    if (alchemyCreation === undefined)
      this.alchemyCreation = false;
    else
      this.alchemyCreation = alchemyCreation;

    var battleUpdates = this.globalService.globalVar.gameLogSettings.get("battleUpdates");
    if (battleUpdates === undefined)
      this.battleUpdates = false;
    else
      this.battleUpdates = battleUpdates;

    var useBattleItem = this.globalService.globalVar.gameLogSettings.get("useBattleItem");
    if (useBattleItem === undefined)
      this.useBattleItem = false;
    else
      this.useBattleItem = useBattleItem;

      var followerSearch = this.globalService.globalVar.gameLogSettings.get("followerSearch");
      if (followerSearch === undefined)
        this.followerSearch = false;
      else
        this.followerSearch = followerSearch;
  
      var followerPrayer = this.globalService.globalVar.gameLogSettings.get("followerPrayer");
      if (followerPrayer === undefined)
        this.followerPrayer = false;
      else
        this.followerPrayer = followerPrayer;
  }

  partyAutoAttacksToggle() {
    this.globalService.globalVar.gameLogSettings.set("partyAutoAttacks", this.partyAutoAttacks);
  }

  partyAbilityUseToggle() {
    this.globalService.globalVar.gameLogSettings.set("partyAbilityUse", this.partyAbilityUse);
  }

  enemyAutoAttacksToggle() {
    this.globalService.globalVar.gameLogSettings.set("enemyAutoAttacks", this.enemyAutoAttacks);
  }

  enemyAbilityUseToggle() {
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", this.enemyAbilityUse);
  }

  partyEquipmentEffectToggle() {
    this.globalService.globalVar.gameLogSettings.set("partyEquipmentEffect", this.partyEquipmentEffect);
  }

  partyStatusEffectToggle() {
    this.globalService.globalVar.gameLogSettings.set("partyStatusEffect", this.partyStatusEffect);
  }

  enemyStatusEffectToggle() {
    this.globalService.globalVar.gameLogSettings.set("enemyStatusEffect", this.enemyStatusEffect);
  }

  battleRewardsToggle() {
    this.globalService.globalVar.gameLogSettings.set("battleRewards", this.battleRewards);
  }

  partyLevelUpToggle() {
    this.globalService.globalVar.gameLogSettings.set("partyLevelUp", this.partyLevelUp);
  }

  godLevelUpToggle() {
    this.globalService.globalVar.gameLogSettings.set("godLevelUp", this.godLevelUp);
  }

  achievementUnlockedToggle() {
    this.globalService.globalVar.gameLogSettings.set("achievementUnlocked", this.achievementUnlocked);
  }

  alchemyLevelUpToggle() {
    this.globalService.globalVar.gameLogSettings.set("alchemyLevelUp", this.alchemyLevelUp);
  }

  alchemyCreationToggle() {
    this.globalService.globalVar.gameLogSettings.set("alchemyCreation", this.alchemyCreation);
  }

  battleUpdatesToggle() {
    this.globalService.globalVar.gameLogSettings.set("battleUpdates", this.battleUpdates);
  }

  useBattleItemToggle() {
    this.globalService.globalVar.gameLogSettings.set("useBattleItem", this.useBattleItem);
  }

  followerSearchToggle() {
    this.globalService.globalVar.gameLogSettings.set("followerSearch", this.followerSearch);
  }

  followerPrayerToggle() {
    this.globalService.globalVar.gameLogSettings.set("followerPrayer", this.followerPrayer);
  }
}
