import { Injectable } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { GameLogService } from '../battle/game-log.service';
import { FollowersService } from '../followers/followers.service';
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { AlchemyService } from '../professions/alchemy.service';
import { ProfessionService } from '../professions/profession.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private lookupService: LookupService, private professionService: ProfessionService, private tutorialService: TutorialService,
    private gameLogService: GameLogService, private globalService: GlobalService) { }

  createDefaultAchievementsForSubzone(subzoneType: SubZoneEnum) {
    var newAchievements: Achievement[] = [];

    if (this.lookupService.isSubzoneATown(subzoneType))
      return newAchievements;

    var hundredVictories = new Achievement(AchievementTypeEnum.HundredVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 20));

    else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));
    else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));
    else if (subzoneType === SubZoneEnum.DodonaCountryside)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 25));
    else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 25));
    else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 15));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.LibyaBeach)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
    else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 10));

    else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 1000));
    else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 45));
    else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HealingSalve, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HealingPoultice, ItemTypeEnum.HealingItem, 20));
    else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 40));
    else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 2500));
      else if (subzoneType === SubZoneEnum.TheLetheLetheBasin2)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SpiritEssence, ItemTypeEnum.Resource, 15));
      else if (subzoneType === SubZoneEnum.TheLetheFerryRide)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.Resource, 5));
      else if (subzoneType === SubZoneEnum.TheLetheRiverDivergence)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.FishScales, ItemTypeEnum.Resource, 15)); 
      else if (subzoneType === SubZoneEnum.TheLetheStillWaters)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 2500)); //TODO: Weak Slot Item
      else if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ChthonicFavor, ItemTypeEnum.Progression, 5));

    else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 15));
    else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.RoughTopazFragment, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 10000));

    else if (subzoneType === SubZoneEnum.CalydonForestPassage)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.RestorativeHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.CalydonHeavyThicket)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.CalydonWelltroddenPathway)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 7500));
    else if (subzoneType === SubZoneEnum.CalydonSparseClearing)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.CalydonShroudedFoliage)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.CalydonBabblingStream)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.HeftyStone, ItemTypeEnum.BattleItem, 20));
    else if (subzoneType === SubZoneEnum.CalydonMudpit)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 40));
    else if (subzoneType === SubZoneEnum.CalydonMarkedTreeTrail)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 8));
    else if (subzoneType === SubZoneEnum.CalydonOvergrownVerdure)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 35));
    else if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.BoarHide, ItemTypeEnum.CraftingMaterial, 3));
    else if (subzoneType === SubZoneEnum.CalydonWateringHole)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 35));
    else if (subzoneType === SubZoneEnum.CalydonTallGrass)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 35));
    else if (subzoneType === SubZoneEnum.CalydonDeadEnd)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.BearHide, ItemTypeEnum.CraftingMaterial, 3));

    if (hundredVictories.rewards.length > 0)
      newAchievements.push(hundredVictories);

    var thousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);

    var aigosthenaBoonBonus = .02;
    var dodonaBoonBonus = .02;
    var libyaBoonBonus = .03;
    var asphodelBoonBonus = .03;
    var elysiumBoonBonus = .03;
    var peloposNisosBoonBonus = .03;
    var calydonBoonBonus = .03;
    var theLetheBoonBonus = .03;

    if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Aigosthena))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, aigosthenaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Dodona))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, dodonaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Libya))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, libyaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Asphodel))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, asphodelBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Elysium))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, elysiumBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.PeloposNisos))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, peloposNisosBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Calydon))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, calydonBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.TheLethe))
      thousandVictories.rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, theLetheBoonBonus));

    if (thousandVictories.rewards.length > 0)
      newAchievements.push(thousandVictories);

    var tenThousandVictories = new Achievement(AchievementTypeEnum.TenThousandVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaCountryside)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaBeach)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
      else if (subzoneType === SubZoneEnum.TheLetheLetheBasin2)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
      else if (subzoneType === SubZoneEnum.TheLetheFerryRide)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
      else if (subzoneType === SubZoneEnum.TheLetheRiverDivergence)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1)); 
      else if (subzoneType === SubZoneEnum.TheLetheStillWaters)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1)); 
      else if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
      hundredVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.CalydonForestPassage)
      tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonHeavyThicket)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonWelltroddenPathway)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonSparseClearing)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonShroudedFoliage)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonBabblingStream)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonMudpit)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonMarkedTreeTrail)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonOvergrownVerdure)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonWateringHole)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonTallGrass)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.CalydonDeadEnd)
    tenThousandVictories.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));

    if (tenThousandVictories.rewards.length > 0)
      newAchievements.push(tenThousandVictories);

    var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaCountryside)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.ChthonicFavor, ItemTypeEnum.Progression, 10));
    if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
      if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
      if (subzoneType === SubZoneEnum.CalydonTallGrass)
      thirtySecondClear.rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, 1));

    if (thirtySecondClear.rewards.length > 0)
      newAchievements.push(thirtySecondClear);

    var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaCountryside)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.PoisonExtractPotionRecipe, ItemTypeEnum.Resource, 1));
    if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
      if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
      if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
      if (subzoneType === SubZoneEnum.CalydonTallGrass)
      tenSecondClear.rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, ItemTypeEnum.Charm, 1));

    if (tenSecondClear.rewards.length > 0)
      newAchievements.push(tenSecondClear);

    var completeClear = new Achievement(AchievementTypeEnum.Complete, subzoneType);
    if (subzoneType === SubZoneEnum.LibyaIsleCenter) {
      completeClear.rewards.push(new ResourceValue(ItemsEnum.ItemBeltUp, ItemTypeEnum.Progression, 1));
      completeClear.rewards.push(new ResourceValue(ItemsEnum.BonusXp, ItemTypeEnum.Resource, 4000));
    }
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus) {
      completeClear.rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade1, ItemTypeEnum.Progression, 1));
    }
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus) {
      completeClear.rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade2, ItemTypeEnum.Progression, 1));
    }

    if (completeClear.rewards.length > 0)
      newAchievements.push(completeClear);

    return newAchievements;
  }

  checkForSubzoneAchievement(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var completedAchievement: Achievement[] = [];
    var subzoneRelatedAchievements = achievements.filter(item => item.subzone === subzoneType);    

    if (subzoneRelatedAchievements !== undefined && subzoneRelatedAchievements.length > 0) {
      var subzone = this.lookupService.getSubZoneByType(subzoneType);
      if (subzone === undefined)
        return completedAchievement;

      var hundredVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.HundredVictories);
      if (hundredVictories !== undefined && subzone.victoryCount >= 100 && !hundredVictories.completed && hundredVictories.rewards !== undefined) {
        completedAchievement.push(hundredVictories);
        hundredVictories.completed = true;
        hundredVictories.rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var thousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThousandVictories);
      if (thousandVictories !== undefined && subzone.victoryCount >= 500 && !thousandVictories.completed && thousandVictories.rewards !== undefined) {
        completedAchievement.push(thousandVictories);
        thousandVictories.completed = true;
        thousandVictories.rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var tenThousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenThousandVictories);
      if (tenThousandVictories !== undefined && subzone.victoryCount >= 2500 && !tenThousandVictories.completed && tenThousandVictories.rewards !== undefined) {
        completedAchievement.push(tenThousandVictories);
        tenThousandVictories.completed = true;
        tenThousandVictories.rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var tenSecondClear = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenSecondClear);
      if (tenSecondClear !== undefined && subzone.fastestCompletion <= 10 && !tenSecondClear.completed && tenSecondClear.rewards !== undefined) {
        completedAchievement.push(tenSecondClear);
        tenSecondClear.completed = true;
        tenSecondClear.rewards.forEach(bonus => {

          if (bonus.item === ItemsEnum.PoisonExtractPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.PoisonExtractPotion);
          }
          else
            this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var thirtySecondClear = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThirtySecondClear);
      if (thirtySecondClear !== undefined && subzone.fastestCompletion <= 30 && !thirtySecondClear.completed && thirtySecondClear.rewards !== undefined) {
        completedAchievement.push(thirtySecondClear);
        thirtySecondClear.completed = true;
        thirtySecondClear.rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var complete = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.Complete);
      if (complete !== undefined && subzone.victoryCount >= 1 && !complete.completed && complete.rewards !== undefined) {
        completedAchievement.push(complete);
        complete.completed = true;
        complete.rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.ItemBeltUp) {
            this.lookupService.increaseItemBeltSize();
          }
          else if (bonus.item === ItemsEnum.BonusXp) {
            this.lookupService.giveCharactersBonusExp(bonus.amount);
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade1) {
            this.lookupService.enableChthonicFavoredGod();
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade2) {
            this.lookupService.enableChthonicFavor();
          }
          else
            this.lookupService.gainResource(bonus.makeCopy());
        });
      }
    }

    //this.lookupService.addToAchievementCount(completedAchievement.length);
    //TODO: can remove this with versioning vvv
    if (this.globalService.globalVar.totalAchievementsCompleted === undefined)
      this.globalService.globalVar.totalAchievementsCompleted = 0;
    if (this.globalService.globalVar.followerData.achievementCompletionCounter === undefined)
      this.globalService.globalVar.followerData.achievementCompletionCounter = 0;
    // ^^^^

    var count = completedAchievement.length;
    var previousAchievementCount = this.globalService.globalVar.totalAchievementsCompleted;
    this.globalService.globalVar.followerData.achievementCompletionCounter += count;
    this.globalService.globalVar.totalAchievementsCompleted += count;

    if (previousAchievementCount === 0 && this.globalService.globalVar.totalAchievementsCompleted > 0) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Achievements));
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Followers));
    }

    if (this.globalService.globalVar.followerData.achievementCompletionCounter >= this.globalService.getAchievementsForNextFollower()) {
      this.globalService.globalVar.followerData.achievementCompletionCounter -= this.globalService.getAchievementsForNextFollower();
      this.globalService.globalVar.followerData.numberOfFollowersGainedFromAchievements += 1;
      this.globalService.globalVar.followerData.availableFollowers += 1;
      this.globalService.globalVar.followerData.followers.push(new IndividualFollower());
    }

    return completedAchievement;
  }

  getAchievementsBySubZone(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var subzoneRelatedAchievements = achievements.filter(item => item.subzone === subzoneType);

    return subzoneRelatedAchievements;
  }

  getUncompletedAchievementCountBySubZone(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var subzoneRelatedAchievements = achievements.filter(item => item.subzone === subzoneType);

    return subzoneRelatedAchievements.filter(item => !item.completed).length;
  }

  getCompletedAchievementPercentByZone(zone: Zone | undefined, achievements: Achievement[]) {
    if (zone === undefined)
      return 0;

    var relatedAchievements: Achievement[] = [];

    zone.subzones.forEach(subzone => {
      achievements.filter(item => item.subzone === subzone.type).forEach(achievement => {
        relatedAchievements.push(achievement);
      });
    });

    return relatedAchievements.filter(item => item.completed).length / relatedAchievements.length;
  }
}
