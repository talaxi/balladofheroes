import { Injectable } from '@angular/core';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { AltarService } from '../altar/altar.service';
import { LookupService } from '../lookup.service';
import { AlchemyService } from '../professions/alchemy.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { KeybindService } from '../utility/keybind.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(private globalService: GlobalService, private achievementService: AchievementService, private lookupService: LookupService,
    private resourceGeneratorService: ResourceGeneratorService, private alchemyService: AlchemyService, private keybindService: KeybindService,
    private altarService: AltarService) { }

  initializeVariables() {
    this.initializeBallads(); //need to initialize the connections and names so you have a place to store kill count
    this.initializeSettings();   
    this.initializeGameLogSettings(); 
    this.initializeQuickView();
    this.initializeKeybinds();
    this.initializeBestiaryDefeatCount();
    this.initializeColiseumDefeatCount();
  }

  initializeBallads() {    
    var championBallad = new Ballad(BalladEnum.Champion);
    championBallad.isSelected = true;
    championBallad.isAvailable = true;

    var aigosthena = new Zone();
    aigosthena.zoneName = "Aigosthena"; //can be replaced using enum to save space
    aigosthena.type = ZoneEnum.Aigosthena;
    aigosthena.isAvailable = true;
    aigosthena.isSelected = true;

    var upperCoast = new SubZone(SubZoneEnum.AigosthenaUpperCoast);
    upperCoast.isSelected = true;
    upperCoast.isAvailable = true;
    this.globalService.globalVar.playerNavigation.currentSubzone = upperCoast;
    aigosthena.subzones.push(upperCoast);

    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaBay));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaLowerCoast));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaWesternWoodlands));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaHeartOfTheWoods));
    //aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaEasternWoodlands));

    championBallad.zones.push(aigosthena);
    this.globalService.globalVar.ballads.push(championBallad);

    this.achievementService.createDefaultAchievementsForSubzone(upperCoast.type).forEach(achievement => {
      this.globalService.globalVar.achievements.push(achievement);
    });

    var gorgonBallad = new Ballad(BalladEnum.Gorgon);
    var dodona = new Zone();
    dodona.zoneName = "Road to Dodona";
    dodona.type = ZoneEnum.Dodona;
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaDelphi));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaDelphiOutskirts));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaCoastalRoadsOfLocris));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaCountryside));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainOpening));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainPassOne));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaLakeTrichonida));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainPassTwo));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaAmbracianGulf));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaArta));

    var libya = new Zone();
    libya.zoneName = "Isle of Libya";
    libya.type = ZoneEnum.Libya;
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaBeach));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaRockyOutcrops));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaDeeperPath));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaIsleCenter));

    gorgonBallad.zones.push(dodona);
    gorgonBallad.zones.push(libya);
    this.globalService.globalVar.ballads.push(gorgonBallad);

    var laborsBallad = new Ballad(BalladEnum.Labors);
    var nemea = new Zone();
    nemea.zoneName = "Nemea";
    nemea.type = ZoneEnum.Nemea;
    nemea.subzones.push(new SubZone(SubZoneEnum.NemeaCountryRoadsOne));
    nemea.subzones.push(new SubZone(SubZoneEnum.NemeaCountryRoadsTwo));
    nemea.subzones.push(new SubZone(SubZoneEnum.NemeaRollingHills));
    nemea.subzones.push(new SubZone(SubZoneEnum.NemeaLairOfTheLion));
    laborsBallad.zones.push(nemea);
    this.globalService.globalVar.ballads.push(laborsBallad);

    var underworldBallad = new Ballad(BalladEnum.Underworld);
    var asphodel = new Zone();
    asphodel.type = ZoneEnum.Asphodel;
    asphodel.zoneName = "Asphodel";
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelPalaceOfHades));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelTheDepths));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelForgottenHalls));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelLostHaven));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelEndlessStaircase));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelFieryPassage));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelDarkenedMeadows));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelLetheBasin));
    asphodel.subzones.push(new SubZone(SubZoneEnum.AsphodelLetheTributary));
    underworldBallad.zones.push(asphodel);

    var elysium = new Zone();
    elysium.type = ZoneEnum.Elysium;
    elysium.zoneName = "Elysium";
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumElysianFields));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumOpenPlains));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumColiseum));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumGatesOfHornAndIvory));
    underworldBallad.zones.push(elysium);
    this.globalService.globalVar.ballads.push(underworldBallad);
  }

  initializeSettings() {
    this.globalService.globalVar.settings.set("activeOverview", QuickViewEnum.Overview);  
    this.globalService.globalVar.settings.set("autoProgress", false);    
  }

  initializeGameLogSettings() {
    this.globalService.globalVar.gameLogSettings.set("partyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("partyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", true);
    
    this.globalService.globalVar.gameLogSettings.set("partyEquipmentEffect", true);
    this.globalService.globalVar.gameLogSettings.set("partyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("enemyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("battleRewards", true);
    this.globalService.globalVar.gameLogSettings.set("partyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("godLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("foundTreasureChest", true);
    this.globalService.globalVar.gameLogSettings.set("achievementUnlocked", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyCreation", true);
    this.globalService.globalVar.gameLogSettings.set("battleUpdates", true);
    this.globalService.globalVar.gameLogSettings.set("useBattleItem", true);
  }

  initializeQuickView() {
    this.globalService.globalVar.trackedResources.push(ItemsEnum.Coin);
  }

  initializeKeybinds() {
    this.globalService.globalVar.keybinds.set("menuGoToCharacters", "keyC");
    this.globalService.globalVar.keybinds.set("menuGoToGods", "keyG");
    this.globalService.globalVar.keybinds.set("menuGoToResources", "keyR");
    this.globalService.globalVar.keybinds.set("menuGoToAchievements", "keyA");
    this.globalService.globalVar.keybinds.set("menuGoToSettings", "keyS");
    this.globalService.globalVar.keybinds.set("menuTraverseSubMenuUp", "arrowup");
    this.globalService.globalVar.keybinds.set("menuTraverseSubMenuDown", "arrowdown");

    this.globalService.globalVar.keybinds.set("togglePauseGame", "keyP");
    this.globalService.globalVar.keybinds.set("openMenu", "keyM");
    this.globalService.globalVar.keybinds.set("openOverviewQuickView", "keyO");
    this.globalService.globalVar.keybinds.set("openResourcesQuickView", "keyR");
    this.globalService.globalVar.keybinds.set("openAlchemyQuickView", "keyL");
    this.globalService.globalVar.keybinds.set("openAltarsQuickView", "keyA");

    this.globalService.globalVar.keybinds.set("openFirstAvailableAltar", "keyZ"); 
    this.globalService.globalVar.keybinds.set("openSecondAvailableAltar", "keyX"); 
    this.globalService.globalVar.keybinds.set("openThirdAvailableAltar", "keyC"); 
    this.globalService.globalVar.keybinds.set("toggleCharacter1TargetMode", "keyT");  
    this.globalService.globalVar.keybinds.set("useCharacter1AutoAttack", "digit1");
    this.globalService.globalVar.keybinds.set("useCharacter1Ability1", "digit2");
    this.globalService.globalVar.keybinds.set("useCharacter1Ability2", "digit3");
    this.globalService.globalVar.keybinds.set("useCharacter1God1Ability1", "digit4");
    this.globalService.globalVar.keybinds.set("useCharacter1God1Ability2", "digit5");
    this.globalService.globalVar.keybinds.set("useCharacter1God1Ability3", "digit6");
    this.globalService.globalVar.keybinds.set("useCharacter1God2Ability1", "digit7");
    this.globalService.globalVar.keybinds.set("useCharacter1God2Ability2", "digit8");
    this.globalService.globalVar.keybinds.set("useCharacter1God2Ability3", "digit9");
    this.globalService.globalVar.keybinds.set("useCharacter1Overdrive", "digit0");
    
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1AutoAttack", this.keybindService.altKeyBind + "digit1");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1Ability1", this.keybindService.altKeyBind + "digit2");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1Ability2", this.keybindService.altKeyBind + "digit3");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God1Ability1", this.keybindService.altKeyBind + "digit4");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God1Ability2", this.keybindService.altKeyBind + "digit5");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God1Ability3", this.keybindService.altKeyBind + "digit6");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God2Ability1", this.keybindService.altKeyBind + "digit7");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God2Ability2", this.keybindService.altKeyBind + "digit8");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1God2Ability3", this.keybindService.altKeyBind + "digit9");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter1Overdrive", this.keybindService.altKeyBind + "digit0");

    this.globalService.globalVar.keybinds.set("toggleCharacter2TargetMode", this.keybindService.shiftKeyBind + "keyT");
    this.globalService.globalVar.keybinds.set("useCharacter2AutoAttack", this.keybindService.shiftKeyBind + "digit1");
    this.globalService.globalVar.keybinds.set("useCharacter2Ability1", this.keybindService.shiftKeyBind + "digit2");
    this.globalService.globalVar.keybinds.set("useCharacter2Ability2", this.keybindService.shiftKeyBind + "digit3");
    this.globalService.globalVar.keybinds.set("useCharacter2God1Ability1", this.keybindService.shiftKeyBind + "digit4");
    this.globalService.globalVar.keybinds.set("useCharacter2God1Ability2", this.keybindService.shiftKeyBind + "digit5");
    this.globalService.globalVar.keybinds.set("useCharacter2God1Ability3", this.keybindService.shiftKeyBind + "digit6");
    this.globalService.globalVar.keybinds.set("useCharacter2God2Ability1", this.keybindService.shiftKeyBind + "digit7");
    this.globalService.globalVar.keybinds.set("useCharacter2God2Ability2", this.keybindService.shiftKeyBind + "digit8");
    this.globalService.globalVar.keybinds.set("useCharacter2God2Ability3", this.keybindService.shiftKeyBind + "digit9");
    this.globalService.globalVar.keybinds.set("useCharacter2Overdrive", this.keybindService.shiftKeyBind + "digit0");
    
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2AutoAttack", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit1");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2Ability1", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit2");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2Ability2", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit3");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God1Ability1", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit4");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God1Ability2", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit5");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God1Ability3", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit6");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God2Ability1", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit7");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God2Ability2", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit8");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2God2Ability3", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit9");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2Overdrive", this.keybindService.shiftKeyBind + this.keybindService.altKeyBind + "digit0");
  }

  initializeBestiaryDefeatCount() {    
    for (const [propertyKey, propertyValue] of Object.entries(BestiaryEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as BestiaryEnum;
      var bestiaryDefeatCount = new EnemyDefeatCount(enumValue, 0);
      this.globalService.globalVar.enemyDefeatCount.push(bestiaryDefeatCount);
    }
  }

  initializeColiseumDefeatCount() {    
    for (const [propertyKey, propertyValue] of Object.entries(ColiseumTournamentEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ColiseumTournamentEnum;
      var coliseumDefeatCount = new ColiseumDefeatCount(enumValue, 0);
      this.globalService.globalVar.coliseumDefeatCount.push(coliseumDefeatCount);
    }
  }

  devMode() {
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 100000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoisonExtractPotion, ItemTypeEnum.BattleItem, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HeroicElixir, ItemTypeEnum.Elixir, 10));

    this.globalService.globalVar.currentStoryId = 10000;
    this.globalService.globalVar.isDpsUnlocked = true;
    this.globalService.globalVar.altars.isUnlocked = true;
    this.globalService.globalVar.areBattleItemsUnlocked = true;
    
    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer)!.isAvailable = true;
    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer)!.isAvailable = true;

    this.globalService.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
    this.globalService.globalVar.characters.forEach(character => { character.isAvailable = true;  });    //character.unlockedOverdrives.push(OverdriveNameEnum.Fervor); character.unlockedOverdrives.push(OverdriveNameEnum.Nature);
    this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
    this.globalService.globalVar.itemBeltSize = 1;
    this.globalService.globalVar.alchemy.level = 25;
    this.alchemyService.checkForNewRecipes();

    this.globalService.globalVar.altars.altar1 = this.altarService.getTutorialAltar();  
    this.globalService.globalVar.altars.altar2 = this.altarService.getTutorialAltar();  
    this.globalService.globalVar.altars.altar3 = this.altarService.getTutorialAltar();  

    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.PoisonExtractPotion));
    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.HeroicElixir));

    var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
    if (character1 !== undefined) {
      character1.assignedGod1 = GodEnum.Athena;
      character1.assignedGod2 = GodEnum.Hermes;
    }

    var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);

    if (character2 !== undefined) {
      character2.assignedGod1 = GodEnum.Artemis;
      character2.assignedGod2 = GodEnum.Apollo;
    }

    character1?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    character2?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest)?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior)?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
    athena!.isAvailable = true;
    athena?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
    hermes!.isAvailable = true;
    hermes?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
    apollo!.isAvailable = true;
    apollo?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
    artemis!.isAvailable = true;
    artemis?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    this.globalService.globalVar.ballads.forEach(ballad => {
      //if (ballad.type !== BalladEnum.Underworld)
        ballad.isAvailable = true;
        //ballad.showNewNotification=true;
      ballad.zones.forEach(zone => {
        zone.isAvailable = true;
        //zone.showNewNotification=true;
        zone.subzones.forEach(subzone => {
          subzone.isAvailable = true;
          //subzone.showNewNotification =true;
          if (subzone.type !== SubZoneEnum.AigosthenaUpperCoast) {
            this.achievementService.createDefaultAchievementsForSubzone(subzone.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
            });
          }
        })
      })
    });

    var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Aegis, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Venomstrike, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);
    //console.log(this.globalService.globalVar.achievements);
  }
}
