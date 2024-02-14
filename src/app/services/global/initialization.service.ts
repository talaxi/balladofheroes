import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { FollowerTabEnum } from 'src/app/models/enums/follower-tab-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
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
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { CompletionStatusEnum } from 'src/app/models/enums/completion-status-enum.model';
import { JewelcraftingService } from '../professions/jewelcrafting.service';
import { UtilityService } from '../utility/utility.service';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Uniques } from 'src/app/models/resources/uniques.model';
import { CharacterStatEnum } from 'src/app/models/enums/character-stat-enum.model';
import { Loadout } from 'src/app/models/utility/loadout.model';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(private globalService: GlobalService, private achievementService: AchievementService, private lookupService: LookupService,
    private resourceGeneratorService: ResourceGeneratorService, private alchemyService: AlchemyService, private keybindService: KeybindService,
    private altarService: AltarService, private deviceDetectorService: DeviceDetectorService, private jewelcraftingService: JewelcraftingService,
    private utilityService: UtilityService) { }

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
    championBallad.displayOrder = 1;
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
    gorgonBallad.displayOrder = 2;
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
    laborsBallad.displayOrder = 6;
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
    underworldBallad.displayOrder = 3;
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
    boarBallad.displayOrder = 4;
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
    this.initializeBalladOfLabors();
    this.initializeBalladOfOlympus();
    this.initializeBalladOfTheLabyrinth();
    this.initializeBalladOfTheWitch();
    this.initializeBalladOfTheEagle(); //TODO: comment until ready
  }

  initializeSettings() {
    this.globalService.globalVar.settings.set("activeOverview", QuickViewEnum.Overview);
    this.globalService.globalVar.settings.set("activeLog", LogViewEnum.Story);
    this.globalService.globalVar.settings.set("activeFollowerTab", FollowerTabEnum.Overview);
    this.globalService.globalVar.settings.set("autoProgress", false);
    this.globalService.globalVar.settings.set("showOnlyUncompletedAchievements", false);
    this.globalService.globalVar.settings.set("achievementsPerPage", 5);
    this.globalService.globalVar.settings.set("storyStyle", StoryStyleSettingEnum.Slow);
    this.globalService.globalVar.settings.set("tooltipTheme", true);
    this.globalService.globalVar.settings.set("showTutorialsAsModals", true);
    this.globalService.globalVar.settings.set("changeClassSwapEquipment", true);
    this.globalService.globalVar.settings.set("changeClassSwapGods", true);
    this.globalService.globalVar.settings.set("showEnemyHpAsPercent", false);
    this.globalService.globalVar.settings.set("showPartyHpAsPercent", false);
    this.globalService.globalVar.settings.set("autoExportOnUpdate", false);
    this.globalService.globalVar.settings.set("showPauseMessage", true);
    this.globalService.globalVar.settings.set("fps", this.utilityService.averageFps);
    this.globalService.globalVar.settings.set("loadingAccuracy", this.utilityService.averageLoadingAccuracy);
    this.globalService.globalVar.settings.set("loadingTime", this.utilityService.highActiveTimeLimit);

    var prefix = "equipment";
    this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowWeaponsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowShieldsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowArmorFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowNecklacesFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowRingsFilter", true);

    prefix = "slots";
    this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);

    prefix = "shop";
    this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowWeaponsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowShieldsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowArmorFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowNecklacesFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowRingsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowEquipmentFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowBattleItemsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowHealingItemsFilter", true);
    this.globalService.globalVar.settings.set(prefix + "ShowSlotItemsFilter", true);

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
    this.globalService.globalVar.settings.set("displayQuickViewTimeFragment", true);

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
    this.globalService.globalVar.settings.set("showLowPerformanceAnimationFlash", false);
    this.globalService.globalVar.settings.set("showAbilityCooldownPercents", true);
    this.globalService.globalVar.settings.set("showBigNumberColors", false);

    this.globalService.globalVar.settings.set("autoProgressType", CompletionStatusEnum.Cleared);
    this.globalService.globalVar.settings.set("autoProgressIncludeSideQuests", true);
    this.globalService.globalVar.settings.set("autoProgressPauseStory", false);
    this.globalService.globalVar.settings.set("autoProgressIncludeAllAchievements", false);
    this.globalService.globalVar.settings.set("autoProgressRemoveOnDeath", true);
    this.globalService.globalVar.settings.set("autoProgressCustomVictoryCount", 10);
  }

  initializeGameLogSettings() {
    this.globalService.globalVar.gameLogSettings.set("partyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("partyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("partyOverdrives", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAutoAttacks", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("enemyAbilityUse", true);
    this.globalService.globalVar.gameLogSettings.set("prayToAltar", true);
    this.globalService.globalVar.gameLogSettings.set("godAffinityLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("partyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("enemyStatusEffect", true);
    this.globalService.globalVar.gameLogSettings.set("partyEquipmentEffect", true);
    this.globalService.globalVar.gameLogSettings.set("battleRewards", true);
    this.globalService.globalVar.gameLogSettings.set("battleXpRewards", true);
    this.globalService.globalVar.gameLogSettings.set("battleCoinsRewards", true);
    this.globalService.globalVar.gameLogSettings.set("battleItemsRewards", true);
    this.globalService.globalVar.gameLogSettings.set("partyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("godLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("foundTreasureChest", true);
    this.globalService.globalVar.gameLogSettings.set("achievementUnlocked", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyCreation", true);
    this.globalService.globalVar.gameLogSettings.set("alchemyQueueEmpty", false);
    this.globalService.globalVar.gameLogSettings.set("jewelcraftingLevelUp", true);
    this.globalService.globalVar.gameLogSettings.set("jewelcraftingCreation", true);
    this.globalService.globalVar.gameLogSettings.set("jewelcraftingQueueEmpty", false);
    this.globalService.globalVar.gameLogSettings.set("battleUpdates", true);
    this.globalService.globalVar.gameLogSettings.set("useBattleItem", true);
    this.globalService.globalVar.gameLogSettings.set("followerSearch", true);
    this.globalService.globalVar.gameLogSettings.set("followerPrayer", true);
    this.globalService.globalVar.gameLogSettings.set("moveLocations", true);
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

    this.globalService.globalVar.keybinds.set("triggerAction", "enter");
    this.globalService.globalVar.keybinds.set("togglePauseGame", "keyP");
    this.globalService.globalVar.keybinds.set("openMenu", "keyM");
    this.globalService.globalVar.keybinds.set("openLog", "keyL");
    this.globalService.globalVar.keybinds.set("openOverviewQuickView", "keyO");
    this.globalService.globalVar.keybinds.set("openResourcesQuickView", "keyR");
    this.globalService.globalVar.keybinds.set("openAlchemyQuickView", "keyH");
    this.globalService.globalVar.keybinds.set("openJewelcraftingQuickView", "keyJ");
    this.globalService.globalVar.keybinds.set("openTimeFragmentQuickView", "keyF");
    this.globalService.globalVar.keybinds.set("openAltarsQuickView", "keyA");

    this.globalService.globalVar.keybinds.set("toggleAllCharactersTargetMode", this.keybindService.altKeyBind + "keyT");
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
    this.globalService.globalVar.keybinds.set("useCharacter1DuoAbility", "keyG");

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
    this.globalService.globalVar.keybinds.set("useCharacter2DuoAbility", this.keybindService.shiftKeyBind + "keyG");

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

    this.globalService.globalVar.keybinds.set("autoToggleCharacter1AllAbilities", "");
    this.globalService.globalVar.keybinds.set("autoToggleCharacter2AllAbilities", "");

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
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Coin, 3000000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ChthonicPower, 30000000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BronzeHammer, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LightLeather, 10));
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
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.TokenOfFavor, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.TokenOfSupport, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Asphodelus, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EssenceOfFire, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughAmethystFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughRubyFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughTopazFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RoughOpalFragment, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.CoarseFur, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AnimalHide, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BrokenNecklace, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoisonExtractPotion, 1000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedRuby, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedEmerald, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LesserCrackedAquamarine, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorWeaponSlotAddition, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorNecklaceSlotAddition, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorArmorSlotAddition, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorRingSlotAddition, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MinorShieldSlotAddition, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MetalScraps, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HeroicElixir, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.VenomousToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AgonizingToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoisonousToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.WitheringToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RejuvenatingElixir, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RingOfNightmares, 4));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Seashell, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SharkTeeth, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.FishScales, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EagleFeather, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.FocusPotion, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BoomingPotion, 10000));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SerpentScale, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RadiatingGemstone, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.WhiteHorn, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.Nectar, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.TimeFragment, 3));

    /*this.lookupService.gainResource(new ResourceValue(ItemsEnum.ParalyzingToxin, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.FlamingToxin, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SlowingPotion, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PiercingPotion, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HoneySalve, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HoneyPoultice, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ElixirOfSpeed, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PotentConcoction, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.UnstablePotion, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BouncingPotion, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MagicRevivify, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MagicSalve, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SandToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ElectrifiedToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.MagicToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ElixirOfFortune, 10));*/
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.FireAbsorptionPotion, 100));
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.HolyAbsorptionPotion, 100));
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.LightningAbsorptionPotion, 100));
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.AirAbsorptionPotion, 100));
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.EarthAbsorptionPotion, 100));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.TidalToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.UnsteadyingToxin, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.ElixirOfWill, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.BouncingPotion, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.WildPotion, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PeonyPoultice, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PeonySalve, 10));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.RareToEpicTransmutation, 10));

    /* this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasScythe, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissBow, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessStaff, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosBow, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessBident, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressSpear, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissSword, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussScepter, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussLightningBolts, 1));
 
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissNecklace, 1));
     
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsTrident, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.GiantNecklace, 5));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ShadowSpear, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ShadowArmor, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ShadowRing, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ShadowShield, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.ShadowNecklace, 1));
     this.lookupService.gainResource(new ResourceValue(ItemsEnum.RagingBull, 5));*/
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsTrident, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsArmor, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsRing, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsShield, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsNecklace, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.EternalMeleeTicket, 5));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRod, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasArmor, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRing, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasShield, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasNecklace, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesRoses, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesArmor, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesRing, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesShield, 1));
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesNecklace, 1));

    this.globalService.globalVar.currentStoryId = 310;
    this.globalService.globalVar.isDpsUnlocked = true;
    this.globalService.globalVar.altars.isUnlocked = true;
    this.globalService.globalVar.areBattleItemsUnlocked = true;
    this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked = true;
    this.globalService.globalVar.coliseumDefeatCount.forEach(item => {
      item.isAvailable = true;
    });
    this.setPowerLevel(1);
    this.globalService.globalVar.settings.set("showTutorialsAsModals", false);

    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer)!.isAvailable = true;
    //this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer)!.isAvailable = true;

    this.globalService.globalVar.altars.altar1 = this.altarService.getTutorialAltar();
    this.globalService.globalVar.altars.altar2 = this.altarService.getTutorialAltar();
    this.globalService.globalVar.altars.altar3 = this.altarService.getTutorialAltar();

    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.PoisonExtractPotion));
    //this.globalService.globalVar.alchemy.availableRecipes.push(this.alchemyService.getRecipe(ItemsEnum.HeroicElixir));

    var allAchievementsComplete = true;

    if (allAchievementsComplete) {
      this.globalService.globalVar.followerData.numberOfFollowersGainedFromAchievements = 100;
      this.globalService.globalVar.followerData.availableFollowers = 100;
      for (var i = 0; i < 100; i++)
        this.globalService.globalVar.followerData.followers.push(new IndividualFollower());
    }

    this.globalService.globalVar.ballads.forEach(ballad => {
      //if (ballad.type === BalladEnum.Gorgon || ballad.type === BalladEnum.Champion || ballad.type === BalladEnum.Underworld) {
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


    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HarpyTalon, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.StingrayTip, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);  

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScorpionStingerEpic, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScorpionStingerSpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScorpionStingerUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BucklerOfPerfectHarmonyEpic, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BucklerOfPerfectHarmonySpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BucklerOfPerfectHarmonyUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CarcanetOfTheCentaurEpic, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CarcanetOfTheCentaurSpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.CarcanetOfTheCentaurUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BoundingBandEpic, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BoundingBandSpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BoundingBandUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScathingBeautyEpic, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScathingBeautySpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ScathingBeautyUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RainbowScaledPlatingUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

      
    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RainbowScaledPlatingSpecial, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);
    
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RainbowScaledPlatingEpic, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BatteringMaceUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.GleamingLoopUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.AstralRingUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SturdyShellUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.EnergyShieldUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.GlowingChokerUnique, 1);
    if (resource !== undefined)
      this.lookupService.gainResource(resource);

    this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfDionysus, 3));    
    this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfDionysus, 4));
    
    //this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 3));
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

      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfNemesis, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfNemesis, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfDionysus, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfDionysus, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAres, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAres, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHades, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHades, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfZeus, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfZeus, 5));*/
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHera, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHera, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAphrodite, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAphrodite, 5));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.GoldenApple, 25));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1000));
      this.globalService.globalVar.sidequestData.goldenApplesObtained = 25;
      //this.globalService.globalVar.sidequestData.duosUnlocked = true;

      this.globalService.globalVar.chthonicPowers.attackBoostLevel = 22;
      this.globalService.globalVar.chthonicPowers.defenseBoostLevel = 20;
      this.globalService.globalVar.chthonicPowers.maxHpBoostLevel = 21;
      this.globalService.globalVar.chthonicPowers.resistanceBoostLevel = 20;
      this.globalService.globalVar.chthonicPowers.luckBoostLevel = 21;
      this.globalService.globalVar.chthonicPowers.agilityBoostLevel = 20;
      this.globalService.globalVar.altars.largeAltarsUnlocked = true;
      this.globalService.globalVar.extraSpeedTimeRemaining = 8 * 60 * 60;
      this.globalService.globalVar.extraSpeedEnabled = true;

      //Balanced
      var balancedLoadout = new Loadout();
      balancedLoadout.name = "Balanced";
      balancedLoadout.character1 = CharacterEnum.Archer;
      balancedLoadout.god1Character1 = GodEnum.Zeus;
      balancedLoadout.god2Character1 = GodEnum.Ares;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussLightningBolts, 1));
      balancedLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussLightningBolts);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussArmor, 1));
      balancedLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussShield, 1));
      balancedLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussRing, 1));
      balancedLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussNecklace, 1));
      balancedLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussNecklace);
      balancedLoadout.character2 = CharacterEnum.Priest;
      balancedLoadout.god1Character2 = GodEnum.Artemis;
      balancedLoadout.god2Character2 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussScepter, 1));
      balancedLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussScepter);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussArmor, 1));
      balancedLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussShield, 1));
      balancedLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussRing, 1));
      balancedLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussNecklace, 1));
      balancedLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussNecklace);

      this.globalService.globalVar.loadouts.push(balancedLoadout);

      //typical play style for someone not min/maxing
      var casualLoadout = new Loadout();
      casualLoadout.name = "Casual";
      casualLoadout.character1 = CharacterEnum.Thaumaturge;
      casualLoadout.god1Character1 = GodEnum.Hades;
      casualLoadout.god2Character1 = GodEnum.Zeus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessBident, 1));
      casualLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HadessBident);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessArmor, 1));
      casualLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HadessArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessShield, 1));
      casualLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HadessShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessRing, 1));
      casualLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HadessRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessNecklace, 1));
      casualLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HadessNecklace);
      casualLoadout.character2 = CharacterEnum.Priest;
      casualLoadout.god1Character2 = GodEnum.Hermes;
      casualLoadout.god2Character2 = GodEnum.Apollo;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosBow, 1));
      casualLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosBow);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosArmor, 1));
      casualLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosShield, 1));
      casualLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosRing, 1));
      casualLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosNecklace, 1));
      casualLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosNecklace);

      this.globalService.globalVar.loadouts.push(casualLoadout);

      //Defense
      var defenseLoadout = new Loadout();
      defenseLoadout.name = "Defense";
      defenseLoadout.character1 = CharacterEnum.Warrior;
      defenseLoadout.god1Character1 = GodEnum.Nemesis;
      defenseLoadout.god2Character1 = GodEnum.Athena;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissSword, 1));
      defenseLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.NemesissSword);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissArmor, 1));
      defenseLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.NemesissArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissShield, 1));
      defenseLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.NemesissShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissRing, 1));
      defenseLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.NemesissRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissNecklace, 1));
      defenseLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.NemesissNecklace);
      defenseLoadout.character2 = CharacterEnum.Monk;
      defenseLoadout.god1Character2 = GodEnum.Hera;
      defenseLoadout.god2Character2 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRod, 1));
      defenseLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasRod);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasArmor, 1));
      defenseLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasShield, 1));
      defenseLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRing, 1));
      defenseLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasNecklace, 1));
      defenseLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasNecklace);

      this.globalService.globalVar.loadouts.push(defenseLoadout);

      //Offense
      var offenseLoadout = new Loadout();
      offenseLoadout.name = "Offense (Crits)";
      offenseLoadout.character1 = CharacterEnum.Adventurer;
      offenseLoadout.god1Character1 = GodEnum.Apollo;
      offenseLoadout.god2Character1 = GodEnum.Hermes;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessStaff, 1));
      offenseLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessStaff);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessArmor, 1));
      offenseLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessShield, 1));
      offenseLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessRing, 1));
      offenseLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessNecklace, 1));
      offenseLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessNecklace);
      offenseLoadout.character2 = CharacterEnum.Archer;
      offenseLoadout.god1Character2 = GodEnum.Artemis;
      offenseLoadout.god2Character2 = GodEnum.Ares;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissBow, 1));
      offenseLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ArtemissBow);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissArmor, 1));
      offenseLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ArtemissArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissShield, 1));
      offenseLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ArtemissShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissRing, 1));
      offenseLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ArtemissRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissNecklace, 1));
      offenseLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ArtemissNecklace);

      this.globalService.globalVar.loadouts.push(offenseLoadout);

      //DoTs
      var dotLoadout = new Loadout();
      dotLoadout.name = "DoTs";
      dotLoadout.character1 = CharacterEnum.Priest;
      dotLoadout.god1Character1 = GodEnum.Poseidon;
      dotLoadout.god2Character1 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussScepter, 1));
      dotLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussScepter);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussArmor, 1));
      dotLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussShield, 1));
      dotLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussRing, 1));
      dotLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussNecklace, 1));
      dotLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussNecklace);
      dotLoadout.character2 = CharacterEnum.Archer;
      dotLoadout.god1Character2 = GodEnum.Artemis;
      dotLoadout.god2Character2 = GodEnum.Ares;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressSpear, 1));
      dotLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AressSpear);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressArmor, 1));
      dotLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AressArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressShield, 1));
      dotLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AressShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressRing, 1));
      dotLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AressRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressNecklace, 1));
      dotLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AressNecklace);

      this.globalService.globalVar.loadouts.push(dotLoadout);
      //Control
      var controlLoadout = new Loadout();
      controlLoadout.name = "Control";
      controlLoadout.character1 = CharacterEnum.Warrior;
      controlLoadout.god1Character1 = GodEnum.Athena;
      controlLoadout.god2Character1 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasScythe, 1));
      controlLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AthenasScythe);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasArmor, 1));
      controlLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AthenasArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasShield, 1));
      controlLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AthenasShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasRing, 1));
      controlLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AthenasRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasNecklace, 1));
      controlLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.AthenasNecklace);
      controlLoadout.character2 = CharacterEnum.Archer;
      controlLoadout.god1Character2 = GodEnum.Zeus;
      controlLoadout.god2Character2 = GodEnum.Artemis;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussLightningBolts, 1));
      controlLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussLightningBolts);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussArmor, 1));
      controlLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussShield, 1));
      controlLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussRing, 1));
      controlLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussNecklace, 1));
      controlLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ZeussNecklace);

      this.globalService.globalVar.loadouts.push(controlLoadout);

      //Sustain
      var loadout1 = new Loadout();
      loadout1.name = "Sustain";
      loadout1.character1 = CharacterEnum.Thaumaturge;
      loadout1.god1Character1 = GodEnum.Hermes;
      loadout1.god2Character1 = GodEnum.Hera;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessStaff, 1));
      loadout1.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessStaff);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessArmor, 1));
      loadout1.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessShield, 1));
      loadout1.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessRing, 1));
      loadout1.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessNecklace, 1));
      loadout1.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HermessNecklace);
      loadout1.character2 = CharacterEnum.Priest;
      loadout1.god1Character2 = GodEnum.Poseidon;
      loadout1.god2Character2 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsTrident, 1));
      loadout1.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsTrident);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsArmor, 1));
      loadout1.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsShield, 1));
      loadout1.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsRing, 1));
      loadout1.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsNecklace, 1));
      loadout1.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsNecklace);
      this.globalService.globalVar.loadouts.push(loadout1);

      //Air
      var loadout1 = new Loadout();
      loadout1.name = "Air";
      loadout1.character1 = CharacterEnum.Thaumaturge;
      loadout1.god1Character1 = GodEnum.Hera;
      loadout1.god2Character1 = GodEnum.Artemis;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRod, 1));
      loadout1.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasRod);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasArmor, 1));
      loadout1.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasShield, 1));
      loadout1.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasRing, 1));
      loadout1.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasNecklace, 1));
      loadout1.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.HerasNecklace);
      loadout1.character2 = CharacterEnum.Priest;
      loadout1.god1Character2 = GodEnum.Hermes;
      loadout1.god2Character2 = GodEnum.Dionysus;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussScepter, 1));
      loadout1.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussScepter);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussArmor, 1));
      loadout1.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussShield, 1));
      loadout1.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussRing, 1));
      loadout1.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussNecklace, 1));
      loadout1.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.DionysussNecklace);
      this.globalService.globalVar.loadouts.push(loadout1);

      //AltBalanced
      var balancedLoadout = new Loadout();
      balancedLoadout.name = "AltBalanced";
      balancedLoadout.character1 = CharacterEnum.Archer;
      balancedLoadout.god1Character1 = GodEnum.Poseidon;
      balancedLoadout.god2Character1 = GodEnum.Ares;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsTrident, 1));
      balancedLoadout.character1EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsTrident);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsArmor, 1));
      balancedLoadout.character1EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsShield, 1));
      balancedLoadout.character1EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsRing, 1));
      balancedLoadout.character1EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsNecklace, 1));
      balancedLoadout.character1EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PoseidonsNecklace);
      balancedLoadout.character2 = CharacterEnum.Priest;
      balancedLoadout.god1Character2 = GodEnum.Artemis;
      balancedLoadout.god2Character2 = GodEnum.Apollo;
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosBow, 1));
      balancedLoadout.character2EquipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosBow);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosArmor, 1));
      balancedLoadout.character2EquipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosArmor);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosShield, 1));
      balancedLoadout.character2EquipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosShield);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosRing, 1));
      balancedLoadout.character2EquipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosRing);
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosNecklace, 1));
      balancedLoadout.character2EquipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.ApollosNecklace);

      this.globalService.globalVar.loadouts.push(balancedLoadout);

      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AthenasSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ArtemissSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HermessSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ApollosSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AressSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HadessSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.DionysussSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.NemesissSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.ZeussSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.PoseidonsSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.AphroditesSigil, 1));
      this.lookupService.gainResource(new ResourceValue(ItemsEnum.HerasSigil, 1));

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
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.WaterAbsorptionPotion, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.DarkMoonPendant, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.BlazingSunPendant, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosSigil, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ApollosCrest, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissSigil, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
      resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ArtemissCrest, 1);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRutilatedOpal, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRutilatedTopaz, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRutilatedRuby, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRutilatedAquamarine, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectRutilatedEmerald, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectFlawlessOpal, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

        
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAdamantineOpal, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAdamantineTopaz, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAdamantineRuby, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAdamantineAquamarine, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);
        resource = this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.PerfectAdamantineEmerald, 100);
      if (resource !== undefined)
        this.lookupService.gainResource(resource);

        this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.BoundingBandUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.ScorpionStingerUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.BucklerOfPerfectHarmonyUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.CarcanetOfTheCentaurUnique));      
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.ScathingBeautyUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.RainbowScaledPlatingUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.GlowingChokerUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.BatteringMaceUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.EnergyShieldUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.SturdyShellUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.AstralRingUnique));
      this.globalService.globalVar.uniques.push(new Uniques(ItemsEnum.GleamingLoopUnique));      

      this.globalService.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
      this.globalService.globalVar.characters.forEach(character => { character.isAvailable = true; character.unlockedOverdrives.push(OverdriveNameEnum.Reprisal); character.unlockedOverdrives.push(OverdriveNameEnum.Preservation); character.unlockedOverdrives.push(OverdriveNameEnum.Harmony); character.unlockedOverdrives.push(OverdriveNameEnum.Bullseye); });     //
      this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
      this.globalService.globalVar.itemBeltSize = 1;
      this.globalService.globalVar.sidequestData.traderHuntLevel = 2;
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)!.level = 75;
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy)!.isUnlocked = true;
      //if (this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting) !== undefined)
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)!.level = 50;
      //this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting)!.isUnlocked = true;
      //this.alchemyService.checkForNewRecipes();
      //this.jewelcraftingService.checkForNewRecipes();

      var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
      if (character1 !== undefined) {
        character1.assignedGod1 = GodEnum.Apollo;
        character1.assignedGod2 = GodEnum.Hermes;
        character1.equipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SwordOfFlames);
        character1.equipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenShield);
        character1.equipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenArmor);
        character1.equipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenRing);
        character1.equipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PendantOfFortune);
      }

      var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);
      if (character2 !== undefined) {
        character2.assignedGod1 = GodEnum.Nemesis;
        character2.assignedGod2 = GodEnum.Poseidon;
        character2.equipmentSet.weapon = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.SwordOfFlames);
        character2.equipmentSet.shield = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenShield);
        character2.equipmentSet.armor = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenArmor);
        character2.equipmentSet.ring = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.MoltenRing);
        character2.equipmentSet.necklace = this.lookupService.getEquipmentPieceByItemType(ItemsEnum.PendantOfPower);
      }

      var chthonicResetCount = 5;
      var godLevel = 500;

      for (var j = 0; j < chthonicResetCount; j++) {
        var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
        athena!.isAvailable = true;
        athena!.level = 1;
        athena!.exp = 0;
        athena!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        athena!.lastStatGain = CharacterStatEnum.Resistance;
        athena!.statGainCount = 0;
        athena!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(athena!);

        if (j < chthonicResetCount - 1)
          godLevel = 1200;
        else
          godLevel = 1650;

        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(athena!);
        }
        athena!.exp = 0;
        athena!.affinityLevel = 15;

        var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
        hermes!.isAvailable = true;
        hermes!.level = 1;
        hermes!.exp = 0;
        hermes!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        hermes!.lastStatGain = CharacterStatEnum.Resistance;
        hermes!.statGainCount = 0;
        hermes!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(hermes!);

        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(hermes!);
        }
        hermes!.exp = 0;
        hermes!.affinityLevel = 15;

        var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
        apollo!.isAvailable = true;
        apollo!.level = 1;
        apollo!.exp = 0;
        apollo!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        apollo!.lastStatGain = CharacterStatEnum.Resistance;
        apollo!.statGainCount = 0;
        apollo!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(apollo!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(apollo!);
        }
        apollo!.exp = 0;
        apollo!.affinityLevel = 15;

        var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
        artemis!.isAvailable = true;
        artemis!.level = 1;
        artemis!.exp = 0;
        artemis!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        artemis!.lastStatGain = CharacterStatEnum.Resistance;
        artemis!.statGainCount = 0;
        artemis!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(artemis!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(artemis!);
        }
        artemis!.exp = 0;
        artemis!.affinityLevel = 15;

        var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
        hades!.isAvailable = true;
        hades!.level = 1;
        hades!.exp = 0;
        hades!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        hades!.lastStatGain = CharacterStatEnum.Resistance;
        hades!.statGainCount = 0;
        hades!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(hades!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(hades!);
        }
        hades!.exp = 0;
        hades!.affinityLevel = 15;

        var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
        ares!.isAvailable = true;
        ares!.level = 1;
        ares!.exp = 0;
        ares!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        ares!.lastStatGain = CharacterStatEnum.Resistance;
        ares!.statGainCount = 0;
        ares!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(ares!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(ares!);
        }
        ares!.exp = 0;
        ares!.affinityLevel = 15;

        var dionysus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
        dionysus!.isAvailable = true;
        dionysus!.level = 1;
        dionysus!.exp = 0;
        dionysus!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        dionysus!.lastStatGain = CharacterStatEnum.Resistance;
        dionysus!.statGainCount = 0;
        dionysus!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(dionysus!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(dionysus!);
        }
        dionysus!.exp = 0;
        dionysus!.affinityLevel = 15;

        var nemesis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
        nemesis!.isAvailable = true;
        nemesis!.level = 1;
        nemesis!.exp = 0;
        nemesis!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        nemesis!.lastStatGain = CharacterStatEnum.Resistance;
        nemesis!.statGainCount = 0;
        nemesis!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(nemesis!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(nemesis!);
        }
        nemesis!.exp = 0;
        nemesis!.affinityLevel = 15;

        var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
        zeus!.isAvailable = true;
        zeus!.level = 1;
        zeus!.exp = 0;
        zeus!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        zeus!.lastStatGain = CharacterStatEnum.Resistance;
        zeus!.statGainCount = 0;
        zeus!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(zeus!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(zeus!);
        }
        zeus!.exp = 0;
        zeus!.affinityLevel = 15;

        var poseidon = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon);
        poseidon!.isAvailable = true;
        poseidon!.level = 1;
        poseidon!.exp = 0;
        poseidon!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        poseidon!.lastStatGain = CharacterStatEnum.Resistance;
        poseidon!.statGainCount = 0;
        poseidon!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(poseidon!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(poseidon!);
        }
        poseidon!.exp = 0;
        poseidon!.affinityLevel = 15;

        var hera = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hera);
        hera!.isAvailable = true;
        hera!.level = 1;
        hera!.exp = 0;
        hera!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        hera!.lastStatGain = CharacterStatEnum.Resistance;
        hera!.statGainCount = 0;
        hera!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(hera!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(hera!);
        }
        hera!.exp = 0;
        hera!.affinityLevel = 15;

        var aphrodite = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Aphrodite);
        aphrodite!.isAvailable = true;
        aphrodite!.level = 1;
        aphrodite!.exp = 0;
        aphrodite!.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        aphrodite!.lastStatGain = CharacterStatEnum.Resistance;
        aphrodite!.statGainCount = 0;
        aphrodite!.expToNextLevel = 200;
        this.globalService.assignGodAbilityInfo(aphrodite!);
        for (var i = 0; i < godLevel; i++) {
          this.globalService.levelUpGod(aphrodite!);
        }
        aphrodite!.exp = 0;
        aphrodite!.affinityLevel = 15;
      }

      var characterLevel = 25;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
        character.level = 1;
        character.exp = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
      });

      var characterLevel = 1;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
        character.level = 1;
        character.exp = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
      });

      var characterLevel = 39;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
      });

      var characterLevel = 44;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }

        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });

      var characterLevel = 49;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        //character.level = 1;
        character.exp = 0;
        //character.linkInfo.totalLinks = 0;
        //character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 50;
      });
      /*
      var characterLevel = 54;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      

      var characterLevel = 59;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        //character.level = 1;
        character.exp = 0;
        //character.linkInfo.totalLinks = 0;
        //character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 64;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 64;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 69;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });      

      var characterLevel = 74;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 79;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });

      var characterLevel = 84;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });

      var characterLevel = 89;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 89;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });
      
      var characterLevel = 89;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });

      var characterLevel = 89;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        character.level = 1;
        character.exp = 0;
        character.linkInfo.totalLinks = 0;
        character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });

      var characterLevel = 94;
      this.globalService.globalVar.characters.forEach(character => {
        for (var i = 0; i < characterLevel; i++) {
          this.globalService.levelUpPartyMember(character);
        }
 
        //character.level = 1;
        character.exp = 0;
        //character.linkInfo.totalLinks = 0;
        //character.linkInfo.remainingLinks = 0;
        character.baseStats = this.globalService.getCharacterBaseStats(character.type);
        character.maxLevel = 100;
      });*/


      this.globalService.globalVar.characters.forEach(character => {
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
    argoBallad.displayOrder = 5;
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

  initializeBalladOfLabors() {
    var laborsBallad = this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Labors);
    if (laborsBallad !== undefined) {
      var nemea = laborsBallad.zones.find(item => item.type === ZoneEnum.Nemea);
      if (nemea !== undefined) {
        nemea.subzones = [];
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaCountryRoadsOne));
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaCleonea));
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaCountryRoadsTwo));
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaRollingHills));
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaFlatlands));
        nemea.subzones.push(new SubZone(SubZoneEnum.NemeaLairOfTheLion));
      }

      var lerna = new Zone();
      lerna.type = ZoneEnum.Lerna;
      lerna.zoneName = "Lerna";
      lerna.subzones.push(new SubZone(SubZoneEnum.LernaAroundTheInachus));
      lerna.subzones.push(new SubZone(SubZoneEnum.LernaThickMarsh));
      lerna.subzones.push(new SubZone(SubZoneEnum.LernaSwampySurroundings));
      lerna.subzones.push(new SubZone(SubZoneEnum.LernaDarkenedThicket));
      lerna.subzones.push(new SubZone(SubZoneEnum.LernaSpringOfAmymone));
      lerna.notificationType = lerna.shouldShowSideQuestNotification();
      laborsBallad.zones.push(lerna);

      var stymphalia = new Zone();
      stymphalia.type = ZoneEnum.Stymphalia;
      stymphalia.zoneName = "Stymphalia";
      stymphalia.subzones.push(new SubZone(SubZoneEnum.StymphaliaTiryns));
      stymphalia.subzones.push(new SubZone(SubZoneEnum.StymphaliaArcadianWilderness));
      stymphalia.subzones.push(new SubZone(SubZoneEnum.StymphaliaAbandonedVillage));
      stymphalia.subzones.push(new SubZone(SubZoneEnum.StymphaliaSourceOfTheLadon));
      stymphalia.subzones.push(new SubZone(SubZoneEnum.StymphaliaLakeStymphalia));
      stymphalia.notificationType = stymphalia.shouldShowSideQuestNotification();
      laborsBallad.zones.push(stymphalia);

      var erymanthus = new Zone();
      erymanthus.type = ZoneEnum.Erymanthus;
      erymanthus.zoneName = "Mount Erymanthos";
      erymanthus.subzones.push(new SubZone(SubZoneEnum.ErymanthusLadonRiverbeds));
      erymanthus.subzones.push(new SubZone(SubZoneEnum.ErymanthusGreatMassif));
      erymanthus.subzones.push(new SubZone(SubZoneEnum.ErymanthusCragInlet));
      erymanthus.subzones.push(new SubZone(SubZoneEnum.ErymanthusMountainClimb));
      erymanthus.subzones.push(new SubZone(SubZoneEnum.ErymanthusSnowCappedPeaks));
      erymanthus.notificationType = erymanthus.shouldShowSideQuestNotification();
      laborsBallad.zones.push(erymanthus);

      var coastOfCrete = new Zone();
      coastOfCrete.type = ZoneEnum.CoastOfCrete;
      coastOfCrete.zoneName = "Coast of Crete";
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteDownThePineios));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteElis));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteSoutheasternIonianSeas));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteCretanSeas));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteCretanCoast));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteVillageGardens));
      coastOfCrete.subzones.push(new SubZone(SubZoneEnum.CoastOfCreteAppleOrchards));
      coastOfCrete.notificationType = coastOfCrete.shouldShowSideQuestNotification();
      laborsBallad.zones.push(coastOfCrete);

      var gardenOfTheHesperides = new Zone();
      gardenOfTheHesperides.type = ZoneEnum.GardenOfTheHesperides;
      gardenOfTheHesperides.zoneName = "Garden of the Hesperides";
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesDesertSands));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesSaharanDunes));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesHiddenOasis));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesMoroccanCoast));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesFertileFields));
      gardenOfTheHesperides.subzones.push(new SubZone(SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides));
      gardenOfTheHesperides.notificationType = gardenOfTheHesperides.shouldShowSideQuestNotification();
      laborsBallad.zones.push(gardenOfTheHesperides);

      var erytheia = new Zone();
      erytheia.type = ZoneEnum.Erytheia;
      erytheia.zoneName = "Erytheia";
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaLushValley));
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaWesternOceanWaters));
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaPillarsOfHeracles));
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaCadiz));
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaIslandOfErytheia));
      erytheia.subzones.push(new SubZone(SubZoneEnum.ErytheiaGeryonsFarm));
      erytheia.notificationType = erytheia.shouldShowSideQuestNotification();
      laborsBallad.zones.push(erytheia);
    }
  }

  initializeBalladOfOlympus() {
    var olympusBallad = new Ballad(BalladEnum.Olympus);
    olympusBallad.displayOrder = 7;
    var zone1 = new Zone();
    zone1.type = ZoneEnum.MountOlympus;
    zone1.zoneName = "Mount Olympus";
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusUpTheMountain));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusMeanderingPath));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusCouloir));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusMusesPlateau));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusPathwayToTheZenith));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusMytikasSummit));
    zone1.subzones.push(new SubZone(SubZoneEnum.MountOlympusOlympus));
    zone1.notificationType = zone1.shouldShowSideQuestNotification();
    olympusBallad.zones.push(zone1);

    var zone2 = new Zone();
    zone2.type = ZoneEnum.HuntForYarrow;
    zone2.zoneName = "The Hunt for Yarrow";
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowMountainHike));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowWoodlandTrail));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowTrailFork1));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowTrailFork2));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowTrailFork3));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowDenseGreenery1));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowDenseGreenery2));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowDenseGreenery3));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowPromisingPathway1));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowPromisingPathway2));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowPromisingPathway3));
    zone2.subzones.push(new SubZone(SubZoneEnum.HuntForYarrowYarrowField));
    zone2.notificationType = zone2.shouldShowSideQuestNotification();
    olympusBallad.zones.push(zone2);

    var zone3 = new Zone();
    zone3.type = ZoneEnum.WarForTheMountain;
    zone3.zoneName = "War for the Mountain";
    zone3.subzones.push(new SubZone(SubZoneEnum.WarForTheMountainBattleAtTheGates));
    zone3.subzones.push(new SubZone(SubZoneEnum.WarForTheMountainOpenCourtyard));
    zone3.subzones.push(new SubZone(SubZoneEnum.WarForTheMountainStables));
    zone3.subzones.push(new SubZone(SubZoneEnum.WarForTheMountainPalaces));
    zone3.subzones.push(new SubZone(SubZoneEnum.WarForTheMountainThePeak));
    olympusBallad.zones.push(zone3);

    this.globalService.globalVar.ballads.push(olympusBallad);
  }

  initializeBalladOfTheLabyrinth() {
    var labyrinthBallad = new Ballad(BalladEnum.Labyrinth);
    labyrinthBallad.displayOrder = 8;
    var zone1 = new Zone();
    zone1.type = ZoneEnum.Crete;
    zone1.zoneName = "Crete";
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteTravelsAtSea));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteApproachingCrete));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteRapidWaters));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteTurbulentCurrents));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteWhirlpool));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteNorthernCretanCoast));
    zone1.subzones.push(new SubZone(SubZoneEnum.CreteKnossos));
    zone1.notificationType = zone1.shouldShowSideQuestNotification();
    labyrinthBallad.zones.push(zone1);

    var zone2 = new Zone();
    zone2.type = ZoneEnum.Labyrinth;
    zone2.zoneName = "The Labyrinth";
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLeftPath));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthColdHallway));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthRightCorner));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthSolidWall1));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthCenterPath));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthSlopedHallway));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLeftFork));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthRoundedPath));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLeftTurn));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthSolidWall3));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthCenterFork));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthDarkCorridor));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthOrnateEntryway));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLabyrinthCenter));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthRightFork));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthSolidWall4));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthCloakedStranger));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthRightPath));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLongPassage1));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthLongPassage2));
    zone2.subzones.push(new SubZone(SubZoneEnum.TheLabyrinthSolidWall2));
    zone2.notificationType = zone2.shouldShowSideQuestNotification();
    labyrinthBallad.zones.push(zone2);

    this.globalService.globalVar.ballads.push(labyrinthBallad);
  }
  
  initializeBalladOfTheWitch() {
    var ballad = new Ballad(BalladEnum.Witch);
    ballad.displayOrder = 9;
    var zone1 = new Zone();
    zone1.type = ZoneEnum.Aiaia;
    zone1.zoneName = "Aiaia";
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaUnknownWaters));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaBreezyDays));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaShoreline));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaForestPath));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaCircesHome));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaOpenClearing));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaThornyPath));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaWildThicket));
    zone1.subzones.push(new SubZone(SubZoneEnum.AiaiaFlowerGarden));
    zone1.notificationType = zone1.shouldShowSideQuestNotification();
    ballad.zones.push(zone1);

    var zone2 = new Zone();
    zone2.type = ZoneEnum.StraitsOfMessina;
    zone2.zoneName = "Straits of Messina";
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits));
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis));
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaCavernOpening));
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaDarkTunnel));
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaUnavoidablePath));        
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaIntoTheVortex));
    zone2.subzones.push(new SubZone(SubZoneEnum.StraitsOfMessinaMawOfTheMonster));    
    zone2.notificationType = zone2.shouldShowSideQuestNotification();
    ballad.zones.push(zone2);

    this.globalService.globalVar.ballads.push(ballad);
  }

  initializeBalladOfTheEagle() {
    var ballad = new Ballad(BalladEnum.Eagle);
    ballad.displayOrder = 10;
    var zone1 = new Zone();
    zone1.type = ZoneEnum.ReturnToColchis;
    zone1.zoneName = "Return to Colchis";
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisPhasisBeach));
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisUnderTheStars));
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisParanoidMerchant));
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisColchisOutskirts));
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisColchisStreets));
    zone1.subzones.push(new SubZone(SubZoneEnum.ReturnToColchisReturnToTheGrove));
    zone1.notificationType = zone1.shouldShowSideQuestNotification();
    ballad.zones.push(zone1);

    var zone2 = new Zone();
    zone2.type = ZoneEnum.EscapeFromColchis;
    zone2.zoneName = "Escape from Colchis";
    zone2.subzones.push(new SubZone(SubZoneEnum.EscapeFromColchisEscape1));
    zone2.subzones.push(new SubZone(SubZoneEnum.EscapeFromColchisEscape2));
    zone2.subzones.push(new SubZone(SubZoneEnum.EscapeFromColchisInnerPath));
    zone2.subzones.push(new SubZone(SubZoneEnum.EscapeFromColchisBackAgainstTheWall));
    zone2.subzones.push(new SubZone(SubZoneEnum.EscapeFromColchisBattleAtSea));        
    zone2.notificationType = zone2.shouldShowSideQuestNotification();
    ballad.zones.push(zone2);

    this.globalService.globalVar.ballads.push(ballad);
  }
}
