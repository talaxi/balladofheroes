import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { FollowerTabEnum } from 'src/app/models/enums/follower-tab-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LogViewEnum } from 'src/app/models/enums/log-view-enum.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { QuickViewEnum } from 'src/app/models/enums/quick-view-enum.model';
import { StoryStyleSettingEnum } from 'src/app/models/enums/story-style-setting-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Profession } from 'src/app/models/professions/profession.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
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
import { VersionControlService } from '../utility/version-control.service';
import { GlobalService } from './global.service';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(private globalService: GlobalService, private achievementService: AchievementService, private lookupService: LookupService,
    private resourceGeneratorService: ResourceGeneratorService, private alchemyService: AlchemyService, private keybindService: KeybindService,
    private altarService: AltarService, private deviceDetectorService: DeviceDetectorService) { }

  initializeVariables() {
    this.globalService.globalVar.startingVersion = this.globalService.getCurrentVersion();
    this.globalService.globalVar.currentVersion = this.globalService.getCurrentVersion();

    this.initializeBallads(); //need to initialize the connections and names so you have a place to store kill count
    this.initializeSettings();
    this.initializeGameLogSettings();
    this.initializeQuickView();
    this.initializeKeybinds();
    this.initializeBestiaryDefeatCount();
    this.initializeColiseumDefeatCount();
    this.initializeAlchemy();
    this.initializeJewelcrafting();
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

    aigosthena.notificationType = aigosthena.shouldShowSideQuestNotification();
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

    dodona.notificationType = dodona.shouldShowSideQuestNotification();
    libya.notificationType = libya.shouldShowSideQuestNotification();

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
    asphodel.notificationType = asphodel.shouldShowSideQuestNotification();
    underworldBallad.zones.push(asphodel);

    var elysium = new Zone();
    elysium.type = ZoneEnum.Elysium;
    elysium.zoneName = "Elysium";
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumElysianFields));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumOpenPlains));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumColiseum));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumGatesOfHornAndIvory));

    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumWindingPaths));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumWaterloggedMarsh));
    elysium.subzones.push(new SubZone(SubZoneEnum.ElysiumWavesOfOceanus));
    elysium.notificationType = elysium.shouldShowSideQuestNotification();
    underworldBallad.zones.push(elysium);

    underworldBallad.zones.push(this.initializeRiverLetheZone());
    this.globalService.globalVar.ballads.push(underworldBallad);

    var boarBallad = new Ballad(BalladEnum.Boar);
    var peloposNisos = new Zone();
    peloposNisos.type = ZoneEnum.PeloposNisos;
    peloposNisos.zoneName = "Pelopos Nisos";
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosGatesOfTheUnderworld));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosArcadianRoads));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosTravelPost));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosFootOfTheMountain));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosSteepAscent));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosMountParthenionCaverns));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosValleyOpening));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosTrekAcrossArcadia));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosTrekAcrossAcheae));
    peloposNisos.subzones.push(new SubZone(SubZoneEnum.PeloposNisosPatrasBorder));
    peloposNisos.notificationType = peloposNisos.shouldShowSideQuestNotification();

    boarBallad.zones.push(peloposNisos);

    var calydon = new Zone();
    calydon.type = ZoneEnum.Calydon;
    calydon.zoneName = "Calydon";
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonTownMarket));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonAltarOfAsclepius));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonForestPassage));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonOvergrownVerdure));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonShroudedFoliage));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonWornDownBarn));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonHeavyThicket));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonBabblingStream));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonWateringHole));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonWelltroddenPathway));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonMudpit));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonTallGrass));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonSparseClearing));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonMarkedTreeTrail));
    calydon.subzones.push(new SubZone(SubZoneEnum.CalydonDeadEnd));
    calydon.notificationType = calydon.shouldShowSideQuestNotification();
    boarBallad.zones.push(calydon);

    this.globalService.globalVar.ballads.push(boarBallad);

    this.initializeBalladOfTheArgo();
  }

  initializeSettings() {
    this.globalService.globalVar.settings.set("activeOverview", QuickViewEnum.Overview);
    this.globalService.globalVar.settings.set("activeLog", LogViewEnum.Tutorials);
    this.globalService.globalVar.settings.set("activeFollowerTab", FollowerTabEnum.Overview);
    this.globalService.globalVar.settings.set("autoProgress", false);
    this.globalService.globalVar.settings.set("showOnlyUncompletedAchievements", false);
    this.globalService.globalVar.settings.set("achievementsPerPage", 5);
    this.globalService.globalVar.settings.set("storyStyle", StoryStyleSettingEnum.Medium);
    this.globalService.globalVar.settings.set("tooltipTheme", true);
    this.globalService.globalVar.settings.set("changeClassSwapEquipment", true);
    this.globalService.globalVar.settings.set("changeClassSwapGods", true);
    this.globalService.globalVar.settings.set("showEnemyHpAsPercent", false);
    this.globalService.globalVar.settings.set("showPartyHpAsPercent", false);

    this.globalService.globalVar.settings.set("displayQuickViewOverview", true);
    if (this.deviceDetectorService.isMobile())
      this.globalService.globalVar.settings.set("displayQuickViewResources", false);
    else
      this.globalService.globalVar.settings.set("displayQuickViewResources", true);
    if (this.deviceDetectorService.isMobile())
      this.globalService.globalVar.settings.set("displayQuickViewGameText", true);
    else
      this.globalService.globalVar.settings.set("displayQuickViewGameText", false);
    if (this.deviceDetectorService.isMobile())
      this.globalService.globalVar.settings.set("displayQuickViewItemBelt", true);
    else
      this.globalService.globalVar.settings.set("displayQuickViewItemBelt", false);
    this.globalService.globalVar.settings.set("displayQuickViewAltars", true);
    this.globalService.globalVar.settings.set("displayQuickViewAlchemy", true);
    this.globalService.globalVar.settings.set("displayQuickViewJewelcrafting", true);

    if (this.deviceDetectorService.isMobile()) {
      this.globalService.globalVar.settings.set("displayOverlayTutorials", true);
      this.globalService.globalVar.settings.set("displayOverlayBattleRewards", true);
      this.globalService.globalVar.settings.set("displayOverlayPray", true);
    }
    else {
      this.globalService.globalVar.settings.set("displayOverlayTutorials", false);
      this.globalService.globalVar.settings.set("displayOverlayBattleRewards", false);
      this.globalService.globalVar.settings.set("displayOverlayPray", false);
    }

    this.globalService.globalVar.settings.set("quickViewOverlayFlipped", false);
  }

  initializeGameLogSettings() {
    this.globalService.globalVar.gameLogSettings.set("partyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("partyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("partyOverdrives", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("prayToAltar", true);
    this.globalService.globalVar.gameLogSettings.set("partyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("enemyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("partyEquipmentEffect", true);
    this.globalService.globalVar.gameLogSettings.set("battleRewards", true);
    this.globalService.globalVar.gameLogSettings.set("partyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("godLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("foundTreasureChest", true);
    this.globalService.globalVar.gameLogSettings.set("achievementUnlocked", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyCreation", true);
    this.globalService.globalVar.gameLogSettings.set("jewelcraftingLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("jewelcraftingCreation", true);
    this.globalService.globalVar.gameLogSettings.set("battleUpdates", true);
    this.globalService.globalVar.gameLogSettings.set("useBattleItem", true);
    this.globalService.globalVar.gameLogSettings.set("followerSearch", true);
    this.globalService.globalVar.gameLogSettings.set("followerPrayer", true);
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
    this.globalService.globalVar.keybinds.set("menuGoToProfessions", "keyY");
    this.globalService.globalVar.keybinds.set("menuGoToBestiary", "keyB");
    this.globalService.globalVar.keybinds.set("menuTraverseSubMenuUp", "arrowup");
    this.globalService.globalVar.keybinds.set("menuTraverseSubMenuDown", "arrowdown");

    this.globalService.globalVar.keybinds.set("togglePauseGame", "keyP");
    this.globalService.globalVar.keybinds.set("openMenu", "keyM");
    this.globalService.globalVar.keybinds.set("openLog", "keyL");
    this.globalService.globalVar.keybinds.set("openOverviewQuickView", "keyO");
    this.globalService.globalVar.keybinds.set("openResourcesQuickView", "keyR");
    this.globalService.globalVar.keybinds.set("openAlchemyQuickView", "keyH");
    this.globalService.globalVar.keybinds.set("openJewelcraftingQuickView", "keyJ");
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
    for (const [propertyKey, propertyValue] of Object.entries(BestiaryEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as BestiaryEnum;
      var bestiaryDefeatCount = new EnemyDefeatCount(enumValue, 0);
      this.globalService.globalVar.enemyDefeatCount.push(bestiaryDefeatCount);
    }
  }

  initializeColiseumDefeatCount() {
    for (const [propertyKey, propertyValue] of Object.entries(ColiseumTournamentEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ColiseumTournamentEnum;
      var coliseumDefeatCount = new ColiseumDefeatCount(enumValue, 0);
      this.globalService.globalVar.coliseumDefeatCount.push(coliseumDefeatCount);
    }
  }

  devMode() {
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, 100000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Olive, 1000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Fennel, 1000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VialOfTheLethe, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VialOfLakeLerna, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Goldroot, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Lousewort, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Sorrel, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SoulSpark, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Wax, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Violet, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SpiritEssence, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HealingHerb, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HealingPoultice, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Asphodelus, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EssenceOfFire, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughAmethystFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughRubyFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughTopazFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughOpalFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BrokenNecklace, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoisonExtractPotion, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedRuby, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedEmerald, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedAquamarine, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorWeaponSlotAddition, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorNecklaceSlotAddition, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MetalScraps, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HeroicElixir, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VenomousToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.WitheringToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RejuvenatingElixir, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RingOfNightmares, 4));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Seashell, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SharkTeeth, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.FishScales, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EagleFeather, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.FocusPotion, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BoomingPotion, 10000));

    this.globalService.globalVar.currentStoryId = 7;
    this.globalService.globalVar.isDpsUnlocked = true;
    this.globalService.globalVar.altars.isUnlocked = true;
    this.globalService.globalVar.areBattleItemsUnlocked = true;
    this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked = true;
    this.globalService.globalVar.coliseumDefeatCount.forEach(item => {
      item.isAvailable = true;
    });
    this.setPowerLevel(1);

    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer)!.isAvailable = true;
    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer)!.isAvailable = true;

    this.globalService.globalVar.altars.altar1 = this.altarService.getTutorialAltar();
    this.globalService.globalVar.altars.altar2 = this.altarService.getTutorialAltar();
    this.globalService.globalVar.altars.altar3 = this.altarService.getTutorialAltar();

    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.PoisonExtractPotion));
    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.HeroicElixir));

    var allAchievementsComplete = false;

    if (allAchievementsComplete) {
      this.globalService.globalVar.followerData.numberOfFollowersGainedFromAchievements = 100;
      this.globalService.globalVar.followerData.availableFollowers = 100;
      for (var i = 0; i < 100; i++)
        this.globalService.globalVar.followerData.followers.push(new IndividualFollower());
    }

    this.globalService.globalVar.ballads.forEach(ballad => {
      //if (ballad.type !== BalladEnum.Underworld) {
      ballad.isAvailable = true;
      ballad.notify = true;
      ballad.zones.forEach(zone => {
        //if (zone.type !== ZoneEnum.TheLethe) {
        zone.isAvailable = true;
        zone.notify = true;
        zone.subzones.forEach(subzone => {
          subzone.isAvailable = true;
          subzone.notify = true;
          //subzone.victoryCount = 100;
          if (subzone.type !== SubZoneEnum.AigosthenaUpperCoast) {
            this.achievementService.createDefaultAchievementsForSubzone(subzone.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
              if (allAchievementsComplete) {
                achievement.completed = true;
                this.achievementService.getAchievementReward(achievement.subzone, achievement.type).forEach(bonus => {
                  this.lookupService.gainResource(bonus.makeCopy());
                });
              }
            });
          }
        })
        //}
      });
      //}
    });

    //set up ballad for original testing          
    /*var argo = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Argo);
    if (argo !== undefined) {
      argo.isAvailable = true;
      var aegeanSea = argo.zones.find(item => item.type === ZoneEnum.AegeanSea);
      if (aegeanSea !== undefined) {
        var iolcus = aegeanSea.subzones.find(item => item.type === SubZoneEnum.AegeanSeaIolcus);
        var openSeas = aegeanSea.subzones.find(item => item.type === SubZoneEnum.AegeanSeaOpenSeas);
        aegeanSea.isAvailable = true;
        if (iolcus !== undefined)
          iolcus.isAvailable = true;
        if (openSeas !== undefined)
          openSeas.isAvailable = true;
      }
    }*/

    var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Aegis, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Venomstrike, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);


    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SwordOfFlames, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);
    //console.log(this.globalService.globalVar.achievements);
  }

  setPowerLevel(level: number) {
    if (level === 1) {
      /*var allCharmCount = level;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfApollo, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfApollo, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHermes, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHermes, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAthena, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAthena, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfArtemis, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfArtemis, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHolyProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHaste, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, allCharmCount));  
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHades, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHades, allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAres,  allCharmCount));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAres,  allCharmCount));
*/
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfNemesis, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfNemesis, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfDionysus, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfDionysus, 5));

      this.globalService.globalVar.chthonicPowers.attackBoostLevel = 5;
      this.globalService.globalVar.chthonicPowers.defenseBoostLevel = 5;
      this.globalService.globalVar.chthonicPowers.maxHpBoostLevel = 5;
      this.globalService.globalVar.chthonicPowers.resistanceBoostLevel = 5;
      this.globalService.globalVar.chthonicPowers.luckBoostLevel = 5;
      this.globalService.globalVar.chthonicPowers.agilityBoostLevel = 5;
      this.globalService.globalVar.altars.largeAltarsUnlocked = true;

      var resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.FendingMace, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SwordOfFlames, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenShield, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenShield, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenArmor, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenArmor, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenRing, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MoltenRing, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PendantOfPower, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PendantOfSpeed, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

      this.globalService.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
      this.globalService.globalVar.characters.forEach(character => { character.isAvailable = true; });    //character.unlockedOverdrives.push(OverdriveNameEnum.Fervor); character.unlockedOverdrives.push(OverdriveNameEnum.Nature);
      this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
      this.globalService.globalVar.itemBeltSize = 1;
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)!.level = 50;
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)!.isUnlocked = true;
      //if (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting) !== undefined)
      //  this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)!.isUnlocked = true;
      //this.alchemyService.checkForNewRecipes();

      var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
      if (character1 !== undefined) {
        character1.assignedGod1 = GodEnum.Hades;
        character1.assignedGod2 = GodEnum.Athena;
        character1.equipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SwordOfFlames);
        character1.equipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenShield);
        character1.equipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenArmor);
        character1.equipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenRing);
        //character1.equipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SharkstoothNecklace);
      }

      var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);
      if (character2 !== undefined) {
        character2.assignedGod1 = GodEnum.Artemis;
        character2.assignedGod2 = GodEnum.Apollo;
        character2.equipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SteelHammer);
        character2.equipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenShield);
        character2.equipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenArmor);
        character2.equipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenRing);
        //character2.equipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SharkstoothPendant);
      }

      var godLevel = 2409;
      var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
      athena!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(athena!);
      }
      athena!.exp = 0;
      athena!.affinityLevel = 0;

      var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
      hermes!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(hermes!);
      }
      hermes!.exp = 0;
      hermes!.affinityLevel = 5;

      var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
      apollo!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(apollo!);
      }
      apollo!.exp = 0;
      apollo!.affinityLevel = 7;

      var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
      artemis!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(artemis!);
      }
      artemis!.exp = 0;
      artemis!.affinityLevel = 4;

      var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
      hades!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(hades!);
      }
      hades!.exp = 0;
      hades!.affinityLevel = 8;

      var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
      ares!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(ares!);
      }
      ares!.exp = 0;
      ares!.affinityLevel = 10;

      var dionysus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
      dionysus!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(dionysus!);
      }
      dionysus!.exp = 0;
      dionysus!.affinityLevel = 15;

      var nemesis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
      nemesis!.isAvailable = true;
      for (var i = 0; i < godLevel; i++) {
        this.globalService.levelUpGod(nemesis!);
      }
      nemesis!.exp = 0;
      nemesis!.affinityLevel = 40;

      var characterLevel = 14;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }

        this.globalService.calculateCharacterBattleStats(character);
        character.battleStats.currentHp = character.battleStats.maxHp;
      });
    }
  }

  initializeAlchemy() {
    var alchemy = new Profession();
    alchemy.type = ProfessionEnum.Alchemy;

    for (const [propertyKey, propertyValue] of Object.entries(EquipmentQualityEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as EquipmentQualityEnum;
      if (enumValue !== EquipmentQualityEnum.None) {
        var alchemyUpgrade = new ProfessionUpgrades(enumValue);
        alchemy.upgrades.push(alchemyUpgrade);
      }
    }

    this.globalService.globalVar.professions.push(alchemy);
  }

  initializeJewelcrafting() {
    var jewelcrafting = new Profession();
    jewelcrafting.type = ProfessionEnum.Jewelcrafting;

    for (const [propertyKey, propertyValue] of Object.entries(EquipmentQualityEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as EquipmentQualityEnum;
      if (enumValue !== EquipmentQualityEnum.None) {
        var jewelcraftingUpgrade = new ProfessionUpgrades(enumValue);
        jewelcrafting.upgrades.push(jewelcraftingUpgrade);
      }
    }

    this.globalService.globalVar.professions.push(jewelcrafting);
  }

  initializeRiverLetheZone() {
    var theLethe = new Zone();
    theLethe.type = ZoneEnum.TheLethe;
    theLethe.zoneName = "The Lethe";
    theLethe.subzones.push(new SubZone(SubZoneEnum.TheLetheLetheBasin2));
    theLethe.subzones.push(new SubZone(SubZoneEnum.TheLetheFerryRide));
    theLethe.subzones.push(new SubZone(SubZoneEnum.TheLetheRiverDivergence));
    theLethe.subzones.push(new SubZone(SubZoneEnum.TheLetheStillWaters));
    theLethe.subzones.push(new SubZone(SubZoneEnum.TheLetheHypnosIsland));
    theLethe.notificationType = theLethe.shouldShowSideQuestNotification();
    return theLethe;
  }

  initializeBalladOfTheArgo() {
    var argoBallad = new Ballad(BalladEnum.Argo);
    var aegean = new Zone();
    aegean.type = ZoneEnum.AegeanSea;
    aegean.zoneName = "Aegean Sea";
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaIolcus));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaOpenSeas));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaIslandOfLemnos));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaIslandOfImbros));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaHellespointPassage1));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaPropontis));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaHellespointPassage2));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaCoastalThrace));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaSalmydessus));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaDesertedPath));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaRockyOverhang));
    aegean.subzones.push(new SubZone(SubZoneEnum.AegeanSeaSympegadesOverlook));
    aegean.notificationType = aegean.shouldShowSideQuestNotification();

    argoBallad.zones.push(aegean);

    var blackSea = new Zone();
    blackSea.type = ZoneEnum.BlackSea;
    blackSea.zoneName = "Black Sea";
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaStillWaters));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaMariandyna));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaUnderAssault));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaSeaEscape));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaStormySkies));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaAreonesosPassing));
    blackSea.subzones.push(new SubZone(SubZoneEnum.BlackSeaWindyGale));
    blackSea.notificationType = blackSea.shouldShowSideQuestNotification();
    argoBallad.zones.push(blackSea);

    var colchis = new Zone();
    colchis.type = ZoneEnum.Colchis;
    colchis.zoneName = "Colchis";
    colchis.subzones.push(new SubZone(SubZoneEnum.ColchisCityCenter));
    colchis.subzones.push(new SubZone(SubZoneEnum.ColchisGroveOfAres));
    colchis.subzones.push(new SubZone(SubZoneEnum.ColchisReinforcementsFromAeetes));
    colchis.subzones.push(new SubZone(SubZoneEnum.ColchisHurriedRetreat1));
    colchis.subzones.push(new SubZone(SubZoneEnum.ColchisHurriedRetreat2));
    colchis.notificationType = colchis.shouldShowSideQuestNotification();
    argoBallad.zones.push(colchis);

    this.globalService.globalVar.ballads.push(argoBallad);
  }
}
