import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
import { EnemyGeneratorService } from 'src/app/services/enemy-generator/enemy-generator.service';
import { TrialService } from 'src/app/services/battle/trial.service';
import { TrialDefeatCount } from 'src/app/models/battle/trial-defeat-count.model';

@Component({
  selector: 'app-bestiary-view',
  templateUrl: './bestiary-view.component.html',
  styleUrls: ['./bestiary-view.component.css']
})

export class BestiaryViewComponent {
  availableBallads: BalladEnum[] = [];
  availableZones: ZoneEnum[] = [];
  availableSubzones: SubZoneEnum[] = [];
  @Input() selectedBallad: Ballad | undefined;
  @Input() selectedZone: Zone | undefined;
  @Input() selectedSubzone: SubZone | undefined;
  isMobile: boolean = false;
  enemyList: Enemy[] = [];
  enemyEncounters: EnemyTeam[] = [];
  coliseumPatronList: EnemyTeam[] = [];
  availableItems: LootItem[] = [];
  availableTreasure: ResourceValue[] = [];
  tooltipDirection = DirectionEnum.DownRight;
  itemTooltipDirection = DirectionEnum.UpRight;
  trialTooltipDirection = DirectionEnum.Left;
  godEnum = GodEnum;
  zodiacEnum = ZodiacEnum;
  overlayRef: OverlayRef;
  nameHiddenText = "????";
  shopOptions: ShopOption[] = [];
  selectedTrialGod: GodEnum = GodEnum.None;
  selectedZodiac: ZodiacEnum = ZodiacEnum.None;
  selectedZodiacDifficulty = "Normal";

  constructor(private globalService: GlobalService, public balladService: BalladService, private deviceDetectorService: DeviceDetectorService,
    private subzoneGeneratorService: SubZoneGeneratorService, private utilityService: UtilityService, public lookupService: LookupService,
    private dictionaryService: DictionaryService, private achievementService: AchievementService, private menuService: MenuService,
    private layoutService: LayoutService, private enemyGeneratorService: EnemyGeneratorService, private trialService: TrialService) {

  }

  ngOnInit() {
    var presetBallad = this.selectedBallad?.type;
    var presetZone = this.selectedZone?.type;
    var presetSubzone = this.selectedSubzone?.type;

    this.setupColiseumPatronList();

    if (presetBallad !== undefined)
      this.selectBallad(presetBallad);
    if (presetZone !== undefined)
      this.selectZone(presetZone);
    if (presetSubzone !== undefined)
      this.selectSubzone(presetSubzone);

    this.menuService.setBestiaryPresets(undefined, undefined, undefined);
    this.isMobile = this.deviceDetectorService.isMobile();
    this.globalService.globalVar.ballads.filter(item => item.isAvailable).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }).forEach(item => {
      this.availableBallads.push(item.type);
    });
  }

  setupColiseumPatronList() {
    this.coliseumPatronList = [];

      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ColchianDragon));
      this.coliseumPatronList.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.isDoubleBossFight = true;
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhoecus));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TheBee));
      this.coliseumPatronList.push(enemyTeam2);    
  }

  selectBallad(type: BalladEnum) {
    var ballad = this.balladService.findBallad(type);
    if (ballad !== undefined) {
      this.selectedBallad = ballad;
      this.selectedZone = undefined;
      this.selectedSubzone = undefined;
      this.availableZones = [];
      this.availableSubzones = [];

      this.selectedBallad.zones.filter(item => item.isAvailable).forEach(zone => {
        this.availableZones.push(zone.type);
      });
    }
  }

  selectZone(type: ZoneEnum) {
    var zone = this.balladService.findZone(type);
    if (zone !== undefined) {
      this.selectedZone = zone;
      this.selectedSubzone = undefined;
      this.availableSubzones = [];

      this.selectedZone.subzones.filter(item => item.isAvailable).forEach(subzone => {
        this.availableSubzones.push(subzone.type);
      });
    }
  }

  getEnemyTrialBossWithScaledStats() {
    var bestiaryItem = BestiaryEnum.None;

    if (this.selectedTrialGod === GodEnum.Athena)
      bestiaryItem = BestiaryEnum.Athena;
    if (this.selectedTrialGod === GodEnum.Artemis)
      bestiaryItem = BestiaryEnum.Artemis;
    if (this.selectedTrialGod === GodEnum.Hermes)
      bestiaryItem = BestiaryEnum.Hermes;
    if (this.selectedTrialGod === GodEnum.Apollo)
      bestiaryItem = BestiaryEnum.Apollo;
    if (this.selectedTrialGod === GodEnum.Hades)
      bestiaryItem = BestiaryEnum.Hades2;
    if (this.selectedTrialGod === GodEnum.Ares)
      bestiaryItem = BestiaryEnum.Ares;
    if (this.selectedTrialGod === GodEnum.Nemesis)
      bestiaryItem = BestiaryEnum.Nemesis;
    if (this.selectedTrialGod === GodEnum.Dionysus)
      bestiaryItem = BestiaryEnum.Dionysus;
    if (this.selectedTrialGod === GodEnum.Zeus)
      bestiaryItem = BestiaryEnum.Zeus;
    if (this.selectedTrialGod === GodEnum.Poseidon)
      bestiaryItem = BestiaryEnum.Poseidon;
    if (this.selectedTrialGod === GodEnum.Hera)
      bestiaryItem = BestiaryEnum.Hera;
    if (this.selectedTrialGod === GodEnum.Aphrodite)
      bestiaryItem = BestiaryEnum.Aphrodite;

    var boss = this.enemyGeneratorService.generateEnemy(bestiaryItem);
    boss = this.trialService.scaleTrialOfSkillBattle(boss);
    return boss;
  }

  getSelectedZodiacName() {
    return this.lookupService.getZodiacNameByType(this.selectedZodiac) + " (" + this.selectedZodiacDifficulty + ")";
  }

  getSelectedGodName() {
    return this.lookupService.getGodNameByType(this.selectedTrialGod);
  }

  getGodColorClass() {
    return this.lookupService.getGodColorClass(this.selectedTrialGod);
  }

  showTrialOfStars(zodiac: ZodiacEnum) {
    this.selectedZodiac = zodiac;
    this.selectedTrialGod = GodEnum.None;
  }

  setTrialOfStarsDifficulty(difficulty: string) {
    this.selectedZodiacDifficulty = difficulty;
  }

  getTrialOfTheStarsBestiary() {
    var bestiaryItem = BestiaryEnum.None;

    if (this.selectedZodiacDifficulty === "Normal") {
      if (this.selectedZodiac === ZodiacEnum.Aries)
        bestiaryItem = BestiaryEnum.SoaringRamNormal;
      if (this.selectedZodiac === ZodiacEnum.Capricorn)
        bestiaryItem = BestiaryEnum.SeaGoatNormal;
        if (this.selectedZodiac === ZodiacEnum.Taurus)
        bestiaryItem = BestiaryEnum.GreatBullNormal;
        if (this.selectedZodiac === ZodiacEnum.Gemini)
        bestiaryItem = BestiaryEnum.PolluxNormal;
        if (this.selectedZodiac === ZodiacEnum.Cancer)
        bestiaryItem = BestiaryEnum.GargantuanCrabNormal;
        if (this.selectedZodiac === ZodiacEnum.Leo)
        bestiaryItem = BestiaryEnum.MajesticLionNormal;
        if (this.selectedZodiac === ZodiacEnum.Virgo)
        bestiaryItem = BestiaryEnum.AstraeaNormal;
        if (this.selectedZodiac === ZodiacEnum.Libra)
        bestiaryItem = BestiaryEnum.ThemisNormal;
        if (this.selectedZodiac === ZodiacEnum.Scorpio)
        bestiaryItem = BestiaryEnum.HardenedScorpionNormal;
        if (this.selectedZodiac === ZodiacEnum.Sagittarius)
        bestiaryItem = BestiaryEnum.ChironNormal;
        if (this.selectedZodiac === ZodiacEnum.Aquarius)
        bestiaryItem = BestiaryEnum.GanymedeNormal;
        if (this.selectedZodiac === ZodiacEnum.Pisces)
        bestiaryItem = BestiaryEnum.RainbowScaledFishNormal;
    }
    else if (this.selectedZodiacDifficulty === "Hard") {
      if (this.selectedZodiac === ZodiacEnum.Aries)
        bestiaryItem = BestiaryEnum.SoaringRamHard;
      if (this.selectedZodiac === ZodiacEnum.Capricorn)
        bestiaryItem = BestiaryEnum.SeaGoatHard;
        if (this.selectedZodiac === ZodiacEnum.Taurus)
        bestiaryItem = BestiaryEnum.GreatBullHard;
        if (this.selectedZodiac === ZodiacEnum.Gemini)
        bestiaryItem = BestiaryEnum.PolluxHard;
        if (this.selectedZodiac === ZodiacEnum.Cancer)
        bestiaryItem = BestiaryEnum.GargantuanCrabHard;
        if (this.selectedZodiac === ZodiacEnum.Leo)
        bestiaryItem = BestiaryEnum.MajesticLionHard;
        if (this.selectedZodiac === ZodiacEnum.Virgo)
        bestiaryItem = BestiaryEnum.AstraeaHard;
        if (this.selectedZodiac === ZodiacEnum.Libra)
        bestiaryItem = BestiaryEnum.ThemisHard;
        if (this.selectedZodiac === ZodiacEnum.Scorpio)
        bestiaryItem = BestiaryEnum.HardenedScorpionHard;
        if (this.selectedZodiac === ZodiacEnum.Sagittarius)
        bestiaryItem = BestiaryEnum.ChironHard;
        if (this.selectedZodiac === ZodiacEnum.Aquarius)
        bestiaryItem = BestiaryEnum.GanymedeHard;
        if (this.selectedZodiac === ZodiacEnum.Pisces)
        bestiaryItem = BestiaryEnum.RainbowScaledFishHard;
    }
    else if (this.selectedZodiacDifficulty === "Very Hard") {
      if (this.selectedZodiac === ZodiacEnum.Aries)
        bestiaryItem = BestiaryEnum.SoaringRamVeryHard;
      if (this.selectedZodiac === ZodiacEnum.Capricorn)
        bestiaryItem = BestiaryEnum.SeaGoatVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Taurus)
        bestiaryItem = BestiaryEnum.GreatBullVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Gemini)
        bestiaryItem = BestiaryEnum.PolluxVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Cancer)
        bestiaryItem = BestiaryEnum.GargantuanCrabVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Leo)
        bestiaryItem = BestiaryEnum.MajesticLionVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Virgo)
        bestiaryItem = BestiaryEnum.AstraeaVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Libra)
        bestiaryItem = BestiaryEnum.ThemisVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Scorpio)
        bestiaryItem = BestiaryEnum.HardenedScorpionVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Sagittarius)
        bestiaryItem = BestiaryEnum.ChironVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Aquarius)
        bestiaryItem = BestiaryEnum.GanymedeVeryHard;
        if (this.selectedZodiac === ZodiacEnum.Pisces)
        bestiaryItem = BestiaryEnum.RainbowScaledFishVeryHard;
    }
    else if (this.selectedZodiacDifficulty === "Ultimate") {
      if (this.selectedZodiac === ZodiacEnum.Aries)
        bestiaryItem = BestiaryEnum.SoaringRamUltimate;
      if (this.selectedZodiac === ZodiacEnum.Capricorn)
        bestiaryItem = BestiaryEnum.SeaGoatUltimate;
        if (this.selectedZodiac === ZodiacEnum.Taurus)
        bestiaryItem = BestiaryEnum.GreatBullUltimate;
        if (this.selectedZodiac === ZodiacEnum.Gemini)
        bestiaryItem = BestiaryEnum.PolluxUltimate;
        if (this.selectedZodiac === ZodiacEnum.Cancer)
        bestiaryItem = BestiaryEnum.GargantuanCrabUltimate;
        if (this.selectedZodiac === ZodiacEnum.Leo)
        bestiaryItem = BestiaryEnum.MajesticLionUltimate;
        if (this.selectedZodiac === ZodiacEnum.Virgo)
        bestiaryItem = BestiaryEnum.AstraeaUltimate;
        if (this.selectedZodiac === ZodiacEnum.Libra)
        bestiaryItem = BestiaryEnum.ThemisUltimate;
        if (this.selectedZodiac === ZodiacEnum.Scorpio)
        bestiaryItem = BestiaryEnum.HardenedScorpionUltimate;
        if (this.selectedZodiac === ZodiacEnum.Sagittarius)
        bestiaryItem = BestiaryEnum.ChironUltimate;
        if (this.selectedZodiac === ZodiacEnum.Aquarius)
        bestiaryItem = BestiaryEnum.GanymedeUltimate;
        if (this.selectedZodiac === ZodiacEnum.Pisces)
        bestiaryItem = BestiaryEnum.RainbowScaledFishUltimate;
    }

    var boss = this.enemyGeneratorService.generateEnemy(bestiaryItem);

    return boss;
  }

  getTrialGodDefeatCount() {
    var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === this.selectedTrialGod);
    if (trialType === undefined)
      return 0;

    return trialType.count;
  }

  isShopOptionColiseum(option: ShopOption) {    
    return option.type === ShopTypeEnum.Coliseum;
  }

  isShopOptionTrialOfSkill(option: ShopOption) {
    return option.type === ShopTypeEnum.Trials;
  }

  showTrialOfSkill(god: GodEnum) {
    this.selectedTrialGod = god;
    this.selectedZodiac = ZodiacEnum.None;
  }

  isGodAvailable(godType: GodEnum) {
    var god = this.globalService.globalVar.gods.find(item => item.type === godType);
    if (god === undefined)
      return false;

    return god.isAvailable;
  }

  getHighestXpsForTrialGod() {
    var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === this.selectedTrialGod);
    if (trialType === undefined)
      return 0;

    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, trialType.highestXps);
  }

  getHighestDpsForTrialGod() {
    var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === this.selectedTrialGod);
    if (trialType === undefined)
      return 0;

    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, trialType.highestDps);
  }

  getTrialOfTheStarsDefeatCount() {
    var trialType: TrialDefeatCount | undefined = undefined;
    if (this.selectedZodiacDifficulty === "Normal") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsNormal && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsHard && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Very Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsVeryHard && item.zodiacType === this.selectedZodiac);
    }    
    if (this.selectedZodiacDifficulty === "Ultimate") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsUltimate && item.zodiacType === this.selectedZodiac);
    }

    if (trialType === undefined)
      return 0;

    return trialType.count;
  }
  
  getHighestXpsForTrialOfTheStars() {
    var trialType: TrialDefeatCount | undefined = undefined;
    if (this.selectedZodiacDifficulty === "Normal") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsNormal && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsHard && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Very Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsVeryHard && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Ultimate") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsUltimate && item.zodiacType === this.selectedZodiac);
    }

    if (trialType === undefined)
      return 0;

    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, trialType.highestXps);

    return 0;
  }

  getHighestDpsForTrialOfTheStars() {
    var trialType: TrialDefeatCount | undefined = undefined;
    if (this.selectedZodiacDifficulty === "Normal") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsNormal && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsHard && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Very Hard") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsVeryHard && item.zodiacType === this.selectedZodiac);
    }
    if (this.selectedZodiacDifficulty === "Ultimate") {
      trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsUltimate && item.zodiacType === this.selectedZodiac);
    }

    if (trialType === undefined)
      return 0;

    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, trialType.highestDps);

    return 0;
  }

  getHighestGodLevelsForTrialGod() {
    var trialType = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === this.selectedTrialGod);
    if (trialType === undefined)
      return 0;

    return trialType.highestGodLevelTotal;
  }

  getShopOptions(type: SubZoneEnum) {
    this.shopOptions = this.subzoneGeneratorService.getShopOptions(type, this.globalService.globalVar.sidequestData);
    this.shopOptions = this.shopOptions.filter(item => item.type !== ShopTypeEnum.Story && item.type !== ShopTypeEnum.StoryScene24 && item.type !== ShopTypeEnum.Hephaestus && item.type !== ShopTypeEnum.StoryZeus && item.type !== ShopTypeEnum.IslandOfNaxos);
  }

  selectSubzone(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);
    if (subzone !== undefined) {
      this.selectedSubzone = subzone;

      this.enemyList = [];
      this.availableItems = [];
      this.availableTreasure = [];
      this.enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(type, false);
      this.getShopOptions(type);

      if (type !== SubZoneEnum.AigosthenaUpperCoast && type !== SubZoneEnum.AigosthenaLowerCoast && type !== SubZoneEnum.AigosthenaBay &&
        type !== SubZoneEnum.DodonaMountainOpening) {
        var rewards = this.subzoneGeneratorService.getTreasureChestRewards(type);
        if (rewards !== undefined && rewards.length > 0) {
          rewards.forEach(reward => {
            this.availableTreasure.push(reward);
          });
        }
      }

      if (this.enemyEncounters.length > 0) {
        this.enemyEncounters.forEach(encounter => {
          encounter.enemyList.forEach(enemy => {
            if (!this.enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
              this.enemyList.push(enemy);

              enemy.loot.forEach(loot => {
                if (!this.availableItems.some(item => item.item === loot.item))
                  this.availableItems.push(loot);
              });
            }
          })
        });
      }
    }
  }

  getSelectedBalladDescription() {
    return this.lookupService.getBalladDescription(this.selectedBallad?.type);
  }

  isBalladSelected(type: BalladEnum) {
    if (this.selectedBallad === undefined)
      return false;

    return this.selectedBallad.type === type;
  }

  getBalladClass(ballad: BalladEnum) {
    if (this.selectedBallad === undefined)
      return {};

    return {
      'selectedBallad': ballad === this.selectedBallad.type
    };
  }

  isZoneSelected(type: ZoneEnum) {
    if (this.selectedZone === undefined)
      return false;

    return this.selectedZone?.type === type;
  }

  getZoneClass(zone: ZoneEnum) {
    if (this.selectedZone === undefined)
      return {};

    return {
      'selectedBallad': zone === this.selectedZone.type
    };
  }

  isSubzoneSelected(type: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return false;

    return this.selectedSubzone?.type === type;
  }

  getSubzoneClass(subzone: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return {};

    return {
      'selectedBallad': subzone === this.selectedSubzone.type
    };
  }

  getZoneName(type: ZoneEnum) {
    return this.balladService.findZone(type)?.zoneName;
  }

  getSubzoneName(type: SubZoneEnum) {
    return this.balladService.getSubZoneName(type);
  }

  goToSubzone(type: SubZoneEnum) {
    var startingPoint = this.balladService.findSubzone(type);
    if (startingPoint !== undefined) {
      this.balladService.setActiveSubZone(startingPoint.type);
      this.globalService.globalVar.playerNavigation.currentSubzone = startingPoint;
    }

    this.globalService.globalVar.settings.set("autoProgress", false);

    this.layoutService.changeLayout(NavigationEnum.Default);
    this.utilityService.removeExcessOverlayDivs();
  }

  getEnemyName(enemy: Enemy, bypassHiddenName: boolean = false) {
    var defeatCount = 0;
    var name = this.nameHiddenText;
    var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
    if (defeatCountStat !== undefined)
      defeatCount = defeatCountStat.count;

    if (defeatCount > 0 || bypassHiddenName)
      name = enemy.name;

    return name;
  }

  balladEnemyCount() {
    var enemyList: Enemy[] = [];
    if (this.selectedBallad === undefined)
      return 0;

    this.selectedBallad.zones.forEach(zone => {
      zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
        var enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(subzone.type, false);
        if (enemyEncounters.length > 0) {
          enemyEncounters.forEach(encounter => {
            encounter.enemyList.forEach(enemy => {
              if (!enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
                enemyList.push(enemy);
              }
            })
          });
        }
      });
    });

    return enemyList.length;
  }

  balladEnemiesDefeated() {
    var enemyList: Enemy[] = [];
    if (this.selectedBallad === undefined)
      return 0;

    this.selectedBallad.zones.forEach(zone => {
      zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
        var enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(subzone.type, false);
        if (enemyEncounters.length > 0) {
          enemyEncounters.forEach(encounter => {
            encounter.enemyList.forEach(enemy => {
              if (!enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
                var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
                if (defeatCountStat !== undefined && defeatCountStat.count > 0)
                  enemyList.push(enemy);
              }
            });
          });
        }
      });
    });

    return enemyList.length;
  }

  zoneEnemyCount() {
    var enemyList: Enemy[] = [];
    if (this.selectedZone === undefined)
      return 0;

    this.selectedZone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
      var enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(subzone.type, false);
      if (enemyEncounters.length > 0) {
        enemyEncounters.forEach(encounter => {
          encounter.enemyList.forEach(enemy => {
            if (!enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
              enemyList.push(enemy);
            }
          })
        });
      }
    });

    return enemyList.length;
  }

  zoneEnemiesDefeated() {
    var enemyList: Enemy[] = [];
    if (this.selectedZone === undefined)
      return 0;

    this.selectedZone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
      var enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(subzone.type, false);
      if (enemyEncounters.length > 0) {
        enemyEncounters.forEach(encounter => {
          encounter.enemyList.forEach(enemy => {
            if (!enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
              var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
              if (defeatCountStat !== undefined && defeatCountStat.count > 0)
                enemyList.push(enemy);
            }
          });
        });
      }
    });

    return enemyList.length;
  }

  getEnemiesDefeated() {
    var totalEnemiesDefeated = 0;
    if (this.enemyList.length > 0) {
      this.enemyList.forEach(enemy => {
        var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
        if (defeatCountStat !== undefined && defeatCountStat.count > 0)
          totalEnemiesDefeated += 1;
      });
    }

    return totalEnemiesDefeated;
  }

  getSubzoneEncounterChance() {
    return this.utilityService.roundTo((1 / this.enemyEncounters.length) * 100, 2);
  }

  getEnemyEncounter(encounter: EnemyTeam) {
    var encounterText = "";
    var enemyNotDefeated = false;
    var enemiesChecked: Enemy[] = [];
    var highestEnemyAmount = this.getLongestEnemyEncounter();

    encounter.enemyList.forEach(enemy => {
      var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
      if (defeatCountStat === undefined || defeatCountStat.count === 0)
        enemyNotDefeated = true;

      if (!enemiesChecked.some(item => item.bestiaryType === enemy.bestiaryType)) {
        var enemyCount = encounter.enemyList.filter(item => item.bestiaryType === enemy.bestiaryType).length;
        encounterText += enemy.name + (enemyCount > 1 ? (" x" + enemyCount) : "") + "<br/>";
        enemiesChecked.push(enemy);
      }
    });

    for (var i = enemiesChecked.length; i < highestEnemyAmount; i++) {
      encounterText += "<br/>";
    }

    if (enemyNotDefeated) {
      encounterText = this.nameHiddenText;
    }


    return encounterText;
  }

  getLongestEnemyEncounter() {
    var highestEnemyCount = 0;

    if (this.enemyEncounters !== undefined && this.enemyEncounters.length > 0) {
      this.enemyEncounters.forEach(encounter => {
        var enemiesChecked: Enemy[] = [];

        encounter.enemyList.forEach(enemy => {
          if (!enemiesChecked.some(item => item.bestiaryType === enemy.bestiaryType)) {
            enemiesChecked.push(enemy);
          }
        });

        if (enemiesChecked.length > highestEnemyCount)
          highestEnemyCount = enemiesChecked.length;
      })
    }

    return highestEnemyCount;
  }

  getHighestXps(subzone: SubZone) {
    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, subzone.maxXps);
  }

  getHighestDps(subzone: SubZone) {
    return this.utilityService.bigNumberReducer(this.globalService.globalVar.settings.get("showBigNumberColors") ?? false, subzone.maxDps);
  }

  itemIsMaterial(item: ItemsEnum) {
    return false;//this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.CraftingMaterial;
  }

  itemIsEquipment(item: ItemsEnum) {
    return this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.Equipment;
  }

  totalItemsAvailable() {
    return this.availableItems.length + this.availableTreasure.length;
  }

  getItemName(item: ItemsEnum, ignoreHiddenText: boolean = false) {
    var itemFound = false;

    if (!ignoreHiddenText) {
      if (this.availableTreasure.some(treasure => treasure.item === item))
        itemFound = true;
      else {
        this.enemyList.forEach(enemy => {
          var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
          if (defeatCountStat !== undefined && defeatCountStat.count > 0) {
            enemy.loot.forEach(loot => {
              if (loot.item === item)
                itemFound = true;
            })
          }
        });
      }
    }

    if (itemFound || ignoreHiddenText)
      return this.dictionaryService.getItemName(item);
    else
      return this.nameHiddenText;
  }

  getItemClass(item: ItemsEnum) {
    if (this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.Equipment) {

      var equipment = this.lookupService.getEquipmentPieceByItemType(item);
      if (equipment !== undefined) {
        var qualityClass = "bold " + this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType)?.quality);

        return qualityClass;
      }
    }
    else if (this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.SlotItem) {
      return this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(item));
    }

    return "";
  }

  getTreasureChestChance() {
    if (this.selectedSubzone === undefined)
      return "";

    return this.utilityService.genericRound(this.subzoneGeneratorService.generateTreasureChestChance(this.selectedSubzone.type) * 100) + "%";
  }

  isTown() {
    if (this.selectedSubzone === undefined)
      return false;
    return this.balladService.isSubzoneTown(this.selectedSubzone.type);
  }

  getOptionText(type: ShopTypeEnum) {
    return this.lookupService.getShopOptionText(type);
  }

  getShopOptionItems(shopOption: ShopOption) {
    if (this.selectedSubzone === undefined)
      return shopOption.availableItems;

    return shopOption.availableItems.filter(item => item.originalStore === this.selectedSubzone!.type);
  }

  isAltarOfAsclepius() {
    if (this.selectedSubzone === undefined)
      return false;

    return this.selectedSubzone.type === SubZoneEnum.CalydonAltarOfAsclepius;
  }

  balladAchievementsCompleted() {
    var achievementCount = 0;
    if (this.selectedBallad === undefined)
      return 0;

    this.selectedBallad.zones.forEach(zone => {
      zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
        var totalAchieves = this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length;
        var incompleteAchieves = this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements);
        achievementCount += totalAchieves - incompleteAchieves;
      });
    });

    return achievementCount;
  }

  balladTotalAchievements() {
    var achievementCount = 0;
    if (this.selectedBallad === undefined)
      return 0;

    if (!this.balladService.isBalladFullyAvailable(this.selectedBallad.type))
      return -1;

    this.selectedBallad.zones.forEach(zone => {
      zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
        achievementCount += this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length;
      });
    });

    return achievementCount;
  }

  zoneAchievementsCompleted() {
    var achievementCount = 0;
    if (this.selectedZone === undefined)
      return 0;

    this.selectedZone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
      var totalAchieves = this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length;
      var incompleteAchieves = this.achievementService.getUncompletedAchievementCountBySubZone(subzone.type, this.globalService.globalVar.achievements);
      achievementCount += totalAchieves - incompleteAchieves;
    });

    return achievementCount;
  }

  zoneTotalAchievements() {
    var achievementCount = 0;
    if (this.selectedZone === undefined)
      return 0;

    if (!this.balladService.isZoneFullyAvailable(this.selectedZone.type))
      return -1;

    this.selectedZone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).forEach(subzone => {
      achievementCount += this.achievementService.getAchievementsBySubZone(subzone.type, this.globalService.globalVar.achievements).length;
    });

    return achievementCount;
  }

  jumpToAchievements() {
    this.menuService.selectedMenuDisplay = MenuEnum.Achievements;    
    this.menuService.setAchievementPresets(this.selectedBallad, this.selectedZone, this.selectedSubzone);
  }

  overlayEmitter(overlayRef: OverlayRef) {
    if (this.overlayRef !== undefined) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }

  ngOnDestroy() {
    if (this.overlayRef !== undefined) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }
}
