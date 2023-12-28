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
import { GlobalService } from '../global/global.service';
import { TutorialService } from '../global/tutorial.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private lookupService: LookupService, private professionService: ProfessionService, private tutorialService: TutorialService,
    private gameLogService: GameLogService, private globalService: GlobalService) { }

  createDefaultAchievementsForSubzone(subzoneType: SubZoneEnum) {
    var newAchievements: Achievement[] = [];

    if (subzoneType === SubZoneEnum.MountOlympusOlympus) {
      newAchievements.push(new Achievement(AchievementTypeEnum.TenVictoriesAthena, subzoneType));
      newAchievements.push(new Achievement(AchievementTypeEnum.TenVictoriesArtemis, subzoneType));
    }

    if (this.lookupService.isSubzoneATown(subzoneType) || subzoneType === SubZoneEnum.NemeaCountryRoadsOne)
      return newAchievements;

    var hundredVictories = new Achievement(AchievementTypeEnum.HundredVictories, subzoneType);

    if (subzoneType !== SubZoneEnum.CalydonAltarOfAsclepius && this.getAchievementReward(subzoneType, AchievementTypeEnum.HundredVictories).length > 0) {
      newAchievements.push(hundredVictories);
    }

    var thousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);

    if (subzoneType !== SubZoneEnum.CalydonAltarOfAsclepius && this.getAchievementReward(subzoneType, AchievementTypeEnum.ThousandVictories).length > 0) {
      newAchievements.push(thousandVictories);
    }

    var tenThousandVictories = new Achievement(AchievementTypeEnum.TenThousandVictories, subzoneType);

    if (subzoneType !== SubZoneEnum.CalydonAltarOfAsclepius && this.getAchievementReward(subzoneType, AchievementTypeEnum.TenThousandVictories).length > 0) {
      newAchievements.push(tenThousandVictories);
    }

    var fiveThousandVictories = new Achievement(AchievementTypeEnum.FiveThousandVictories, subzoneType);

    if (subzoneType !== SubZoneEnum.CalydonAltarOfAsclepius && this.getAchievementReward(subzoneType, AchievementTypeEnum.FiveThousandVictories).length > 0) {
      newAchievements.push(fiveThousandVictories);
    }

    var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods || subzoneType === SubZoneEnum.DodonaCountryside ||
      subzoneType === SubZoneEnum.DodonaLakeTrichonida || subzoneType === SubZoneEnum.LibyaDeeperPath ||
      subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.AsphodelLetheTributary ||
      subzoneType === SubZoneEnum.ElysiumWavesOfOceanus || subzoneType === SubZoneEnum.TheLetheHypnosIsland ||
      subzoneType === SubZoneEnum.PeloposNisosPatrasBorder || subzoneType === SubZoneEnum.CalydonWornDownBarn ||
      subzoneType === SubZoneEnum.CalydonTallGrass || subzoneType === SubZoneEnum.NemeaLairOfTheLion ||
      subzoneType === SubZoneEnum.LernaSpringOfAmymone || subzoneType === SubZoneEnum.StymphaliaLakeStymphalia ||
      subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks || subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards ||
      subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides || subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia ||
      subzoneType === SubZoneEnum.ErytheiaGeryonsFarm || subzoneType === SubZoneEnum.HuntForYarrowYarrowField || subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates ||
      subzoneType === SubZoneEnum.WarForTheMountainPalaces || subzoneType === SubZoneEnum.WarForTheMountainStables || subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard ||
      subzoneType === SubZoneEnum.WarForTheMountainThePeak || subzoneType === SubZoneEnum.BlackSeaWindyGale || subzoneType === SubZoneEnum.CreteWhirlpool ||
      subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter) {
      newAchievements.push(thirtySecondClear);
    }

    var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods || subzoneType === SubZoneEnum.DodonaCountryside ||
      subzoneType === SubZoneEnum.DodonaLakeTrichonida || subzoneType === SubZoneEnum.LibyaDeeperPath ||
      subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.AsphodelLetheTributary ||
      subzoneType === SubZoneEnum.ElysiumWavesOfOceanus || subzoneType === SubZoneEnum.TheLetheHypnosIsland ||
      subzoneType === SubZoneEnum.PeloposNisosPatrasBorder || subzoneType === SubZoneEnum.CalydonWornDownBarn ||
      subzoneType === SubZoneEnum.CalydonTallGrass || subzoneType === SubZoneEnum.NemeaLairOfTheLion ||
      subzoneType === SubZoneEnum.LernaSpringOfAmymone || subzoneType === SubZoneEnum.StymphaliaLakeStymphalia ||
      subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks || subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards ||
      subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides || subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia ||
      subzoneType === SubZoneEnum.ErytheiaGeryonsFarm || subzoneType === SubZoneEnum.HuntForYarrowYarrowField || subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates ||
      subzoneType === SubZoneEnum.WarForTheMountainPalaces || subzoneType === SubZoneEnum.WarForTheMountainStables || subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard ||
      subzoneType === SubZoneEnum.WarForTheMountainThePeak || subzoneType === SubZoneEnum.BlackSeaWindyGale || subzoneType === SubZoneEnum.CreteWhirlpool ||
      subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter)
      newAchievements.push(tenSecondClear);

    var completeClear = new Achievement(AchievementTypeEnum.Complete, subzoneType);

    if (subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.ElysiumWavesOfOceanus ||
      subzoneType === SubZoneEnum.TheLetheHypnosIsland || subzoneType === SubZoneEnum.ErytheiaGeryonsFarm || subzoneType === SubZoneEnum.WarForTheMountainThePeak)
      newAchievements.push(completeClear);

    return newAchievements;
  }

  getAchievementReward(subzoneType: SubZoneEnum, achievementType: AchievementTypeEnum) {
    var rewards: ResourceValue[] = [];

    if (achievementType === AchievementTypeEnum.HundredVictories) {
      if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
        rewards.push(new ResourceValue(ItemsEnum.HealingHerb, 10));
      else if (subzoneType === SubZoneEnum.AigosthenaBay)
        rewards.push(new ResourceValue(ItemsEnum.ThrowingStone, 10));
      else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
        rewards.push(new ResourceValue(ItemsEnum.LightLeather, 10));
      else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
        rewards.push(new ResourceValue(ItemsEnum.HealingHerb, 10));
      else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
        rewards.push(new ResourceValue(ItemsEnum.LightLeather, 20));

      else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 300));
      else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 300));
      else if (subzoneType === SubZoneEnum.DodonaCountryside)
        rewards.push(new ResourceValue(ItemsEnum.HealingHerb, 25));
      else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
        rewards.push(new ResourceValue(ItemsEnum.Olive, 20));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
        rewards.push(new ResourceValue(ItemsEnum.ThrowingStone, 25));
      else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
        rewards.push(new ResourceValue(ItemsEnum.PoisonFang, 15));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
        rewards.push(new ResourceValue(ItemsEnum.Fennel, 30));
      else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
        rewards.push(new ResourceValue(ItemsEnum.Leather, 10));
      else if (subzoneType === SubZoneEnum.LibyaBeach)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 500));
      else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
        rewards.push(new ResourceValue(ItemsEnum.Olive, 20));
      else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
        rewards.push(new ResourceValue(ItemsEnum.PetrifiedBark, 10));
      else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
        rewards.push(new ResourceValue(ItemsEnum.PetrifiedBark, 10));

      else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 1000));
      else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
        rewards.push(new ResourceValue(ItemsEnum.Fennel, 25));
      else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
        rewards.push(new ResourceValue(ItemsEnum.Olive, 25));
      else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfFire, 25));
      else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
        rewards.push(new ResourceValue(ItemsEnum.Asphodelus, 30));
      else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 25));
      else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
        rewards.push(new ResourceValue(ItemsEnum.Asphodelus, 45));
      else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
        rewards.push(new ResourceValue(ItemsEnum.SoulSpark, 25));
      else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
        rewards.push(new ResourceValue(ItemsEnum.Narcissus, 25));
      else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
        rewards.push(new ResourceValue(ItemsEnum.HealingSalve, 10));
      else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
        rewards.push(new ResourceValue(ItemsEnum.HealingPoultice, 20));
      else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheLethe, 40));
      else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 2500));
      else if (subzoneType === SubZoneEnum.TheLetheLetheBasin2)
        rewards.push(new ResourceValue(ItemsEnum.SpiritEssence, 15));
      else if (subzoneType === SubZoneEnum.TheLetheFerryRide)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 5));
      else if (subzoneType === SubZoneEnum.TheLetheRiverDivergence)
        rewards.push(new ResourceValue(ItemsEnum.FishScales, 15));
      else if (subzoneType === SubZoneEnum.TheLetheStillWaters)
        rewards.push(new ResourceValue(ItemsEnum.LesserCrackedEmerald, 1));
      else if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavor, 5));

      else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
        rewards.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, 30));
      else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
        rewards.push(new ResourceValue(ItemsEnum.Leather, 20));
      else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
        rewards.push(new ResourceValue(ItemsEnum.ThickLeather, 5));
      else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 5));
      else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
        rewards.push(new ResourceValue(ItemsEnum.Goldroot, 15));
      else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
        rewards.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 5));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
        rewards.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 5));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
        rewards.push(new ResourceValue(ItemsEnum.ThickLeather, 5));
      else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 10000));

      else if (subzoneType === SubZoneEnum.CalydonForestPassage)
        rewards.push(new ResourceValue(ItemsEnum.RestorativeHerb, 10));
      else if (subzoneType === SubZoneEnum.CalydonHeavyThicket)
        rewards.push(new ResourceValue(ItemsEnum.Violet, 25));
      else if (subzoneType === SubZoneEnum.CalydonWelltroddenPathway)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 7500));
      else if (subzoneType === SubZoneEnum.CalydonSparseClearing)
        rewards.push(new ResourceValue(ItemsEnum.Goldroot, 25));
      else if (subzoneType === SubZoneEnum.CalydonShroudedFoliage)
        rewards.push(new ResourceValue(ItemsEnum.Lousewort, 25));
      else if (subzoneType === SubZoneEnum.CalydonBabblingStream)
        rewards.push(new ResourceValue(ItemsEnum.HeftyStone, 20));
      else if (subzoneType === SubZoneEnum.CalydonMudpit)
        rewards.push(new ResourceValue(ItemsEnum.Leather, 40));
      else if (subzoneType === SubZoneEnum.CalydonMarkedTreeTrail)
        rewards.push(new ResourceValue(ItemsEnum.ThickLeather, 8));
      else if (subzoneType === SubZoneEnum.CalydonOvergrownVerdure)
        rewards.push(new ResourceValue(ItemsEnum.Goldroot, 35));
      else if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
        rewards.push(new ResourceValue(ItemsEnum.BoarHide, 3));
      else if (subzoneType === SubZoneEnum.CalydonWateringHole)
        rewards.push(new ResourceValue(ItemsEnum.Lousewort, 35));
      else if (subzoneType === SubZoneEnum.CalydonTallGrass)
        rewards.push(new ResourceValue(ItemsEnum.Violet, 35));
      else if (subzoneType === SubZoneEnum.CalydonDeadEnd)
        rewards.push(new ResourceValue(ItemsEnum.BearHide, 3));

      else if (subzoneType === SubZoneEnum.AegeanSeaOpenSeas)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 5));
      else if (subzoneType === SubZoneEnum.AegeanSeaIslandOfLemnos)
        rewards.push(new ResourceValue(ItemsEnum.SharkTeeth, 5));
      else if (subzoneType === SubZoneEnum.AegeanSeaIslandOfImbros)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 10000));
      else if (subzoneType === SubZoneEnum.AegeanSeaHellespointPassage1)
        rewards.push(new ResourceValue(ItemsEnum.LesserCrackedAquamarine, 2));
      else if (subzoneType === SubZoneEnum.AegeanSeaPropontis)
        rewards.push(new ResourceValue(ItemsEnum.SharkTeeth, 5));
      else if (subzoneType === SubZoneEnum.AegeanSeaHellespointPassage2)
        rewards.push(new ResourceValue(ItemsEnum.FishScales, 8));
      else if (subzoneType === SubZoneEnum.AegeanSeaCoastalThrace)
        rewards.push(new ResourceValue(ItemsEnum.Seashell, 6));
      else if (subzoneType === SubZoneEnum.AegeanSeaDesertedPath)
        rewards.push(new ResourceValue(ItemsEnum.ThickLeather, 8));
      else if (subzoneType === SubZoneEnum.AegeanSeaRockyOverhang)
        rewards.push(new ResourceValue(ItemsEnum.LesserCrackedAmethyst, 2));
      else if (subzoneType === SubZoneEnum.AegeanSeaSympegadesOverlook)
        rewards.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 8));

      else if (subzoneType === SubZoneEnum.BlackSeaStillWaters)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 30));
      else if (subzoneType === SubZoneEnum.BlackSeaUnderAssault)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 15000));
      else if (subzoneType === SubZoneEnum.BlackSeaSeaEscape)
        rewards.push(new ResourceValue(ItemsEnum.Seashell, 6));
      else if (subzoneType === SubZoneEnum.BlackSeaStormySkies)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 30));
      else if (subzoneType === SubZoneEnum.BlackSeaAreonesosPassing)
        rewards.push(new ResourceValue(ItemsEnum.Sorrel, 15));
      else if (subzoneType === SubZoneEnum.BlackSeaWindyGale)
        rewards.push(new ResourceValue(ItemsEnum.EagleFeather, 10));

      else if (subzoneType === SubZoneEnum.ColchisGroveOfAres)
        rewards.push(new ResourceValue(ItemsEnum.SpiritEssence, 8));
      else if (subzoneType === SubZoneEnum.ColchisReinforcementsFromAeetes)
        rewards.push(new ResourceValue(ItemsEnum.MetalScraps, 10));
      else if (subzoneType === SubZoneEnum.ColchisHurriedRetreat1)
        rewards.push(new ResourceValue(ItemsEnum.Sorrel, 15));
      else if (subzoneType === SubZoneEnum.ColchisHurriedRetreat2)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea, 45));

      else if (subzoneType === SubZoneEnum.NemeaCountryRoadsTwo)
        rewards.push(new ResourceValue(ItemsEnum.ToxicIchor, 30));
      else if (subzoneType === SubZoneEnum.NemeaRollingHills)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 12000));
      else if (subzoneType === SubZoneEnum.NemeaFlatlands)
        rewards.push(new ResourceValue(ItemsEnum.Honey, 25));
      else if (subzoneType === SubZoneEnum.NemeaLairOfTheLion)
        rewards.push(new ResourceValue(ItemsEnum.CoarseFur, 8));

      else if (subzoneType === SubZoneEnum.LernaAroundTheInachus)
        rewards.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 10));
      else if (subzoneType === SubZoneEnum.LernaThickMarsh)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfWater, 15));
      else if (subzoneType === SubZoneEnum.LernaSwampySurroundings)
        rewards.push(new ResourceValue(ItemsEnum.Tusk, 6));
      else if (subzoneType === SubZoneEnum.LernaDarkenedThicket)
        rewards.push(new ResourceValue(ItemsEnum.PristineCrabClaw, 6));
      else if (subzoneType === SubZoneEnum.LernaSpringOfAmymone)
        rewards.push(new ResourceValue(ItemsEnum.SerpentScale, 8));

      else if (subzoneType === SubZoneEnum.StymphaliaArcadianWilderness)
        rewards.push(new ResourceValue(ItemsEnum.SmallAnimalBones, 8));
      else if (subzoneType === SubZoneEnum.StymphaliaAbandonedVillage)
        rewards.push(new ResourceValue(ItemsEnum.CoarseFur, 5));
      else if (subzoneType === SubZoneEnum.StymphaliaSourceOfTheLadon)
        rewards.push(new ResourceValue(ItemsEnum.WhiteHorn, 6));
      else if (subzoneType === SubZoneEnum.StymphaliaLakeStymphalia)
        rewards.push(new ResourceValue(ItemsEnum.SharpFeather, 15));

      else if (subzoneType === SubZoneEnum.ErymanthusLadonRiverbeds)
        rewards.push(new ResourceValue(ItemsEnum.BearHide, 8));
      else if (subzoneType === SubZoneEnum.ErymanthusGreatMassif)
        rewards.push(new ResourceValue(ItemsEnum.MetalScraps, 15));
      else if (subzoneType === SubZoneEnum.ErymanthusCragInlet)
        rewards.push(new ResourceValue(ItemsEnum.BirchBark, 4));
      else if (subzoneType === SubZoneEnum.ErymanthusMountainClimb)
        rewards.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 4));
      else if (subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks)
        rewards.push(new ResourceValue(ItemsEnum.Tusk, 12));

      else if (subzoneType === SubZoneEnum.CoastOfCreteDownThePineios)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 12000));
      else if (subzoneType === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas)
        rewards.push(new ResourceValue(ItemsEnum.FishScales, 10));
      else if (subzoneType === SubZoneEnum.CoastOfCreteCretanSeas)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 20));
      else if (subzoneType === SubZoneEnum.CoastOfCreteCretanCoast)
        rewards.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 4));
      else if (subzoneType === SubZoneEnum.CoastOfCreteVillageGardens)
        rewards.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 10));
      else if (subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards)
        rewards.push(new ResourceValue(ItemsEnum.AnimalHide, 8));

      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 20));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts)
        rewards.push(new ResourceValue(ItemsEnum.CanineFang, 8));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesDesertSands)
        rewards.push(new ResourceValue(ItemsEnum.ToxicIchor, 15));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesSaharanDunes)
        rewards.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 10));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesHiddenOasis)
        rewards.push(new ResourceValue(ItemsEnum.SerpentScale, 5));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast)
        rewards.push(new ResourceValue(ItemsEnum.PristineCrabClaw, 6));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesFertileFields)
        rewards.push(new ResourceValue(ItemsEnum.Honey, 15));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
        rewards.push(new ResourceValue(ItemsEnum.MagicTreeBark, 5));

      else if (subzoneType === SubZoneEnum.ErytheiaLushValley)
        rewards.push(new ResourceValue(ItemsEnum.SharpFeather, 8));
      else if (subzoneType === SubZoneEnum.ErytheiaWesternOceanWaters)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 10));
      else if (subzoneType === SubZoneEnum.ErytheiaPillarsOfHeracles)
        rewards.push(new ResourceValue(ItemsEnum.FishScales, 12));
      else if (subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia)
        rewards.push(new ResourceValue(ItemsEnum.MagicTreeBark, 5));
      else if (subzoneType === SubZoneEnum.ErytheiaGeryonsFarm)
        rewards.push(new ResourceValue(ItemsEnum.MetalScraps, 100));

      else if (subzoneType === SubZoneEnum.MountOlympusUpTheMountain)
        rewards.push(new ResourceValue(ItemsEnum.CanineFang, 10));
      else if (subzoneType === SubZoneEnum.MountOlympusMeanderingPath)
        rewards.push(new ResourceValue(ItemsEnum.EagleFeather, 10));
      else if (subzoneType === SubZoneEnum.MountOlympusCouloir)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfEarth, 20));
      else if (subzoneType === SubZoneEnum.MountOlympusMusesPlateau)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfHoly, 20));
      else if (subzoneType === SubZoneEnum.MountOlympusPathwayToTheZenith)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfFire, 45));
      else if (subzoneType === SubZoneEnum.MountOlympusMytikasSummit)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfHoly, 20));

      else if (subzoneType === SubZoneEnum.HuntForYarrowMountainHike)
        rewards.push(new ResourceValue(ItemsEnum.RadiatingGemstone, 10));
      else if (subzoneType === SubZoneEnum.HuntForYarrowWoodlandTrail)
        rewards.push(new ResourceValue(ItemsEnum.MagicCore, 6));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork1)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfLightning, 20));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork2)
        rewards.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork3)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfWater, 20));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery1)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfAir, 20));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery2)
        rewards.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery3)
        rewards.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway1)
        rewards.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway2)
        rewards.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway3)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 50));
      else if (subzoneType === SubZoneEnum.HuntForYarrowYarrowField)
        rewards.push(new ResourceValue(ItemsEnum.MagicCore, 35));

      else if (subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates)
        rewards.push(new ResourceValue(ItemsEnum.GiantNecklace, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard)
        rewards.push(new ResourceValue(ItemsEnum.GiantArmor, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainStables)
        rewards.push(new ResourceValue(ItemsEnum.GiantSword, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainPalaces)
        rewards.push(new ResourceValue(ItemsEnum.GiantRing, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainThePeak)
        rewards.push(new ResourceValue(ItemsEnum.GiantShield, 1));

      else if (subzoneType === SubZoneEnum.CreteTravelsAtSea)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfWater, 25));
      else if (subzoneType === SubZoneEnum.CreteApproachingCrete)
        rewards.push(new ResourceValue(ItemsEnum.ToxicIchor, 30));
      else if (subzoneType === SubZoneEnum.CreteRapidWaters)
        rewards.push(new ResourceValue(ItemsEnum.EssenceOfAir, 25));
      else if (subzoneType === SubZoneEnum.CreteTurbulentCurrents)
        rewards.push(new ResourceValue(ItemsEnum.RoughAquamarineFragment, 100));
      else if (subzoneType === SubZoneEnum.CreteWhirlpool)
        rewards.push(new ResourceValue(ItemsEnum.VialOfTheCretanSea, 40));
      else if (subzoneType === SubZoneEnum.CreteNorthernCretanCoast)
        rewards.push(new ResourceValue(ItemsEnum.EagleFeather, 25));

      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftPath)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 15000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthColdHallway)
        rewards.push(new ResourceValue(ItemsEnum.RoughOpalFragment, 100));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightCorner)
        rewards.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall1)
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 100000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthCenterPath)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 15000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSlopedHallway)
        rewards.push(new ResourceValue(ItemsEnum.RoughTopazFragment, 100));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftFork)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 25000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRoundedPath)
        rewards.push(new ResourceValue(ItemsEnum.RoughAmethystFragment, 100));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftTurn)
        rewards.push(new ResourceValue(ItemsEnum.RoughEmeraldFragment, 100));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall3)
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 100000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthCenterFork)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 25000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthDarkCorridor)
        rewards.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 100));
      else if (subzoneType === SubZoneEnum.TheLabyrinthOrnateEntryway)
        rewards.push(new ResourceValue(ItemsEnum.MetalNuggets, 25));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter)
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 1000000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightFork)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 25000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall4)
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 100000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightPath)
        rewards.push(new ResourceValue(ItemsEnum.Coin, 15000));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLongPassage1)
        rewards.push(new ResourceValue(ItemsEnum.ShadowShield, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLongPassage2)
        rewards.push(new ResourceValue(ItemsEnum.ShadowArmor, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall2)
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 100000));
    }

    if (achievementType === AchievementTypeEnum.ThousandVictories) {
      var aigosthenaBoonBonus = .02;
      var dodonaBoonBonus = .02;
      var libyaBoonBonus = .03;
      var asphodelBoonBonus = .03;
      var elysiumBoonBonus = .03;
      var peloposNisosBoonBonus = .03;
      var calydonBoonBonus = .03;
      var theLetheBoonBonus = .03;
      var aegeanSeaBoonBonus = .03;
      var blackSeaBoonBonus = .03;
      var colchisBoonBonus = .05;
      var nemeaBoonBonus = .04;
      var lernaBoonBonus = .04;
      var stymphaliaBoonBonus = .04;
      var erymanthusBoonBonus = .04;
      var coastOfCreteBoonBonus = .04;
      var gardenOfTheHesperidesBoonBonus = .04;
      var erytheiaBoonBonus = .05;
      var mountOlympusBoonBonus = .04;
      var huntForYarrowBoonBonus = .04;
      var warForTheMountainBoonBonus = .05;
      var creteBoonBonus = .04;
      var theLabyrinthBoonBonus = .04;

      if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Aigosthena))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, aigosthenaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Dodona))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, dodonaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Libya))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, libyaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Asphodel))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, asphodelBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Elysium))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, elysiumBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.PeloposNisos))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, peloposNisosBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Calydon))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, calydonBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.TheLethe))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, theLetheBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.AegeanSea))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, aegeanSeaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.BlackSea))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, blackSeaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Colchis))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, colchisBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Nemea))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, nemeaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Lerna))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, lernaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Stymphalia))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, stymphaliaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Erymanthus))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, erymanthusBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.CoastOfCrete))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, coastOfCreteBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.GardenOfTheHesperides))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, gardenOfTheHesperidesBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Erytheia))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, erytheiaBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.MountOlympus))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, mountOlympusBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.HuntForYarrow))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, huntForYarrowBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.WarForTheMountain))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, warForTheMountainBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Crete))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, creteBoonBonus));
      else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Labyrinth))
        rewards.push(new ResourceValue(ItemsEnum.BoonOfOlympus, theLabyrinthBoonBonus));
    }

    //need to figure out what you actually want
    if (achievementType === AchievementTypeEnum.TenThousandVictories) {
      if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaBay)
        rewards.push(new ResourceValue(ItemsEnum.SmallBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
        rewards.push(new ResourceValue(ItemsEnum.SmallGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, 1));

      else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
        rewards.push(new ResourceValue(ItemsEnum.SmallCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
        rewards.push(new ResourceValue(ItemsEnum.SmallBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.DodonaCountryside)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
        rewards.push(new ResourceValue(ItemsEnum.SmallSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
        rewards.push(new ResourceValue(ItemsEnum.SmallBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
        rewards.push(new ResourceValue(ItemsEnum.SmallOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
        rewards.push(new ResourceValue(ItemsEnum.SmallGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.LibyaBeach)
        rewards.push(new ResourceValue(ItemsEnum.SmallCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
        rewards.push(new ResourceValue(ItemsEnum.SmallBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));

      else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
        rewards.push(new ResourceValue(ItemsEnum.SmallSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
        rewards.push(new ResourceValue(ItemsEnum.SmallBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
        rewards.push(new ResourceValue(ItemsEnum.SmallOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
        rewards.push(new ResourceValue(ItemsEnum.SmallGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
        rewards.push(new ResourceValue(ItemsEnum.SmallCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.TheLetheLetheBasin2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.TheLetheFerryRide)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.TheLetheRiverDivergence)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.TheLetheStillWaters)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, 1));

      else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
        rewards.push(new ResourceValue(ItemsEnum.SmallBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
        rewards.push(new ResourceValue(ItemsEnum.SmallSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
        rewards.push(new ResourceValue(ItemsEnum.SmallBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
        rewards.push(new ResourceValue(ItemsEnum.SmallOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, 1));

      else if (subzoneType === SubZoneEnum.CalydonForestPassage)
        rewards.push(new ResourceValue(ItemsEnum.SmallGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonHeavyThicket)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.CalydonWelltroddenPathway)
        rewards.push(new ResourceValue(ItemsEnum.SmallCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonSparseClearing)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.CalydonShroudedFoliage)
        rewards.push(new ResourceValue(ItemsEnum.SmallBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonBabblingStream)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonMudpit)
        rewards.push(new ResourceValue(ItemsEnum.SmallSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonMarkedTreeTrail)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      else if (subzoneType === SubZoneEnum.CalydonOvergrownVerdure)
        rewards.push(new ResourceValue(ItemsEnum.SmallBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonWateringHole)
        rewards.push(new ResourceValue(ItemsEnum.SmallOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.CalydonTallGrass)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonDeadEnd)
        rewards.push(new ResourceValue(ItemsEnum.SmallGildedKantharos, 1));

      else if (subzoneType === SubZoneEnum.AegeanSeaOpenSeas)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaIslandOfLemnos)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaIslandOfImbros)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaHellespointPassage1)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaPropontis)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaHellespointPassage2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaCoastalThrace)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaDesertedPath)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaRockyOverhang)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.AegeanSeaSympegadesOverlook)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyProtection, 1));

      else if (subzoneType === SubZoneEnum.BlackSeaStillWaters)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.BlackSeaUnderAssault)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.BlackSeaSeaEscape)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      else if (subzoneType === SubZoneEnum.BlackSeaStormySkies)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.BlackSeaAreonesosPassing)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.BlackSeaWindyGale)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, 1));

      else if (subzoneType === SubZoneEnum.ColchisGroveOfAres)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.ColchisReinforcementsFromAeetes)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.ColchisHurriedRetreat1)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.ColchisHurriedRetreat2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));

      else if (subzoneType === SubZoneEnum.NemeaCountryRoadsTwo)
        rewards.push(new ResourceValue(ItemsEnum.SmallCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.NemeaRollingHills)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.NemeaFlatlands)
        rewards.push(new ResourceValue(ItemsEnum.SmallBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.NemeaLairOfTheLion)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));

      else if (subzoneType === SubZoneEnum.LernaAroundTheInachus)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.LernaThickMarsh)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      else if (subzoneType === SubZoneEnum.LernaSwampySurroundings)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.LernaDarkenedThicket)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.LernaSpringOfAmymone)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));

      else if (subzoneType === SubZoneEnum.StymphaliaArcadianWilderness)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.StymphaliaAbandonedVillage)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      else if (subzoneType === SubZoneEnum.StymphaliaSourceOfTheLadon)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.StymphaliaLakeStymphalia)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, 1));

      else if (subzoneType === SubZoneEnum.ErymanthusLadonRiverbeds)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.ErymanthusGreatMassif)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      else if (subzoneType === SubZoneEnum.ErymanthusCragInlet)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      else if (subzoneType === SubZoneEnum.ErymanthusMountainClimb)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyProtection, 1));

      else if (subzoneType === SubZoneEnum.CoastOfCreteDownThePineios)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.CoastOfCreteCretanSeas)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.CoastOfCreteCretanCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.CoastOfCreteVillageGardens)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, 1));

      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesDesertSands)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesSaharanDunes)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesHiddenOasis)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesFertileFields)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, 1));

      else if (subzoneType === SubZoneEnum.ErytheiaLushValley)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.ErytheiaWesternOceanWaters)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.ErytheiaPillarsOfHeracles)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.ErytheiaGeryonsFarm)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, 1));

      else if (subzoneType === SubZoneEnum.MountOlympusUpTheMountain)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.MountOlympusMeanderingPath)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.MountOlympusCouloir)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.MountOlympusMusesPlateau)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.MountOlympusPathwayToTheZenith)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.MountOlympusMytikasSummit)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));

      else if (subzoneType === SubZoneEnum.HuntForYarrowMountainHike)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowWoodlandTrail)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork1)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowTrailFork3)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery1)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowDenseGreenery3)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway1)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway2)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowPromisingPathway3)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      else if (subzoneType === SubZoneEnum.HuntForYarrowYarrowField)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, 1));

      else if (subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainStables)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainPalaces)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.WarForTheMountainThePeak)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, 1));

      else if (subzoneType === SubZoneEnum.CreteTravelsAtSea)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.CreteApproachingCrete)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.CreteRapidWaters)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.CreteTurbulentCurrents)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.CreteWhirlpool)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.CreteNorthernCretanCoast)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));

      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthColdHallway)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightCorner)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall1)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthCenterPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSlopedHallway)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftFork)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRoundedPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLeftTurn)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall3)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthCenterFork)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthDarkCorridor)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthOrnateEntryway)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightFork)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall4)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthRightPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLongPassage1)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthLongPassage2)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      else if (subzoneType === SubZoneEnum.TheLabyrinthSolidWall2)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
    }

    if (achievementType === AchievementTypeEnum.ThirtySecondClear) {
      if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      if (subzoneType === SubZoneEnum.DodonaCountryside)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      if (subzoneType === SubZoneEnum.LibyaDeeperPath)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      if (subzoneType === SubZoneEnum.LibyaIsleCenter)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavor, 10));
      if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      if (subzoneType === SubZoneEnum.CalydonTallGrass)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      if (subzoneType === SubZoneEnum.AegeanSeaSympegadesOverlook)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      if (subzoneType === SubZoneEnum.BlackSeaWindyGale)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      if (subzoneType === SubZoneEnum.ColchisReinforcementsFromAeetes)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
      if (subzoneType === SubZoneEnum.NemeaLairOfTheLion)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      if (subzoneType === SubZoneEnum.LernaSpringOfAmymone)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      if (subzoneType === SubZoneEnum.StymphaliaLakeStymphalia)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      if (subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      if (subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      if (subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      if (subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      if (subzoneType === SubZoneEnum.ErytheiaGeryonsFarm)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      if (subzoneType === SubZoneEnum.MountOlympusMytikasSummit)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      if (subzoneType === SubZoneEnum.HuntForYarrowYarrowField)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates)
        rewards.push(new ResourceValue(ItemsEnum.LargeCrackedKantharos, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard)
        rewards.push(new ResourceValue(ItemsEnum.LargeOrnateKantharos, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainStables)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainPalaces)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainThePeak)
        rewards.push(new ResourceValue(ItemsEnum.LargeGildedKantharos, 1));
      if (subzoneType === SubZoneEnum.CreteWhirlpool)
        rewards.push(new ResourceValue(ItemsEnum.LargeBlackKantharos, 1));
      if (subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
    }

    if (achievementType === AchievementTypeEnum.TenSecondClear) {

      var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);
      if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, 1));
      if (subzoneType === SubZoneEnum.DodonaCountryside)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, 1));
      if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
        rewards.push(new ResourceValue(ItemsEnum.PoisonExtractPotionRecipe, 1));
      if (subzoneType === SubZoneEnum.LibyaDeeperPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, 1));
      if (subzoneType === SubZoneEnum.LibyaIsleCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, 1));
      if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, 1));
      if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
      if (subzoneType === SubZoneEnum.TheLetheHypnosIsland)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, 1));
      if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
      if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, 1));
      if (subzoneType === SubZoneEnum.CalydonTallGrass)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, 1));
      if (subzoneType === SubZoneEnum.AegeanSeaSympegadesOverlook)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, 1));
      if (subzoneType === SubZoneEnum.BlackSeaWindyGale)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
      if (subzoneType === SubZoneEnum.ColchisReinforcementsFromAeetes)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, 1));
      if (subzoneType === SubZoneEnum.NemeaLairOfTheLion)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, 1));
      if (subzoneType === SubZoneEnum.LernaSpringOfAmymone)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
      if (subzoneType === SubZoneEnum.StymphaliaLakeStymphalia)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, 1));
      if (subzoneType === SubZoneEnum.ErymanthusSnowCappedPeaks)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, 1));
      if (subzoneType === SubZoneEnum.CoastOfCreteAppleOrchards)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, 1));
      if (subzoneType === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, 1));
      if (subzoneType === SubZoneEnum.ErytheiaIslandOfErytheia)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, 1));
      if (subzoneType === SubZoneEnum.ErytheiaGeryonsFarm)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, 1));
      if (subzoneType === SubZoneEnum.MountOlympusMytikasSummit)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, 1));
      if (subzoneType === SubZoneEnum.HuntForYarrowYarrowField)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainBattleAtTheGates)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainOpenCourtyard)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainStables)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyProtection, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainPalaces)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, 1));
      if (subzoneType === SubZoneEnum.WarForTheMountainThePeak)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, 1));
      if (subzoneType === SubZoneEnum.CreteWhirlpool)
        rewards.push(new ResourceValue(ItemsEnum.LargeBuccheroKantharos, 1));
      if (subzoneType === SubZoneEnum.TheLabyrinthLabyrinthCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeSilverKantharos, 1));
    }

    if (achievementType === AchievementTypeEnum.Complete) {
      if (subzoneType === SubZoneEnum.LibyaIsleCenter) {
        rewards.push(new ResourceValue(ItemsEnum.ItemBeltUp, 1));
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 5000));
      }
      if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus) {
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade1, 1));
      }
      if (subzoneType === SubZoneEnum.TheLetheHypnosIsland) {
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade2, 1));
      }
      if (subzoneType === SubZoneEnum.ErytheiaGeryonsFarm) {
        rewards.push(new ResourceValue(ItemsEnum.ItemBeltUp, 1));
      }
      if (subzoneType === SubZoneEnum.WarForTheMountainThePeak) {
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 10000000));
      }
    }


    if (achievementType === AchievementTypeEnum.FiveThousandVictories) {
      if (subzoneType === SubZoneEnum.ColchisGroveOfAres) {
        rewards.push(new ResourceValue(ItemsEnum.Ares, 1));
      }
    }

    if (achievementType === AchievementTypeEnum.TenVictoriesAthena) {
      rewards.push(new ResourceValue(ItemsEnum.AthenasCrest, 1));
    }
    if (achievementType === AchievementTypeEnum.TenVictoriesArtemis) {
      rewards.push(new ResourceValue(ItemsEnum.ArtemissCrest, 1));
    }

    return rewards;
  }

  checkForSubzoneAchievement(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var completedAchievement: Achievement[] = [];
    var subzoneRelatedAchievements = achievements.filter(item => item.subzone === subzoneType);

    if (subzoneRelatedAchievements !== undefined && subzoneRelatedAchievements.length > 0) {
      var subzone = this.lookupService.getSubZoneByType(subzoneType);
      if (subzone === undefined)
        return completedAchievement;

      var hundredVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.HundredVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.HundredVictories);
      if (hundredVictories !== undefined && subzone.victoryCount >= 100 && !hundredVictories.completed && rewards !== undefined) {
        completedAchievement.push(hundredVictories);
        hundredVictories.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      var thousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThousandVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.ThousandVictories);
      if (thousandVictories !== undefined && subzone.victoryCount >= 500 && !thousandVictories.completed && rewards !== undefined) {
        completedAchievement.push(thousandVictories);
        thousandVictories.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      var tenThousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenThousandVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.TenThousandVictories);
      if (tenThousandVictories !== undefined && subzone.victoryCount >= 2500 && !tenThousandVictories.completed && rewards !== undefined) {
        completedAchievement.push(tenThousandVictories);
        tenThousandVictories.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      var fiveThousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.FiveThousandVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.FiveThousandVictories);
      if (fiveThousandVictories !== undefined && subzone.victoryCount >= 5000 && !fiveThousandVictories.completed && rewards !== undefined) {
        completedAchievement.push(fiveThousandVictories);
        fiveThousandVictories.completed = true;
        rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.Ares) {
            var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
            if (ares !== undefined) {
              ares.isAvailable = true;
              ares.abilityList.forEach(ability => {
                if (ares!.level >= ability.requiredLevel)
                  ability.isAvailable = true;
              });
              this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your commitment to bloodshed has impressed Ares, God of War. Ares will now assist you on your journey.");
            }
          }
          else
            this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      //need to test this
      var tenVictoriesAthena = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenVictoriesAthena);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.TenVictoriesAthena);
      var athenaWinCount = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === GodEnum.Athena);
      if (tenVictoriesAthena !== undefined && athenaWinCount !== undefined && athenaWinCount.count >= 10 && !tenVictoriesAthena.completed && rewards !== undefined) {
        completedAchievement.push(tenVictoriesAthena);
        tenVictoriesAthena.completed = true;
        rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.AthenasCrest) {
            var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
            if (athena !== undefined) {
              athena.duoAbilityAccess = true;
            }
          }
        });
      }

      var tenVictoriesArtemis = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenVictoriesArtemis);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.TenVictoriesArtemis);
      var artemisWinCount = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfSkill && item.godType === GodEnum.Artemis);
      if (tenVictoriesArtemis !== undefined && artemisWinCount !== undefined && artemisWinCount.count >= 10 && !tenVictoriesArtemis.completed && rewards !== undefined) {
        completedAchievement.push(tenVictoriesArtemis);
        tenVictoriesArtemis.completed = true;
        rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.ArtemissCrest) {
            var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
            if (artemis !== undefined) {
              artemis.duoAbilityAccess = true;
            }
          }
        });
      }

      var tenSecondClear = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenSecondClear);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.TenSecondClear);
      if (tenSecondClear !== undefined && subzone.fastestCompletion <= 10 && !tenSecondClear.completed && rewards !== undefined) {
        completedAchievement.push(tenSecondClear);
        tenSecondClear.completed = true;
        rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.PoisonExtractPotionRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.PoisonExtractPotion);
          }
          else
            this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      var thirtySecondClear = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThirtySecondClear);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.ThirtySecondClear);
      if (thirtySecondClear !== undefined && subzone.fastestCompletion <= 30 && !thirtySecondClear.completed && rewards !== undefined) {
        completedAchievement.push(thirtySecondClear);
        thirtySecondClear.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }

      var complete = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.Complete);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.Complete);
      if (complete !== undefined && subzone.victoryCount >= 1 && !complete.completed && rewards !== undefined) {
        completedAchievement.push(complete);
        complete.completed = true;
        rewards.forEach(bonus => {
          if (bonus.item === ItemsEnum.ItemBeltUp) {
            this.lookupService.increaseItemBeltSize();
          }
          else if (bonus.item === ItemsEnum.BonusXp) {
            this.lookupService.giveCharactersBonusExp(bonus.amount);
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade1) {
            this.lookupService.enableChthonicFavoredGod();
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.ChthonicFavorUpgrade1, undefined, undefined, true, subzoneType));
            this.globalService.handleTutorialModal();
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade2) {
            this.lookupService.enableChthonicFavor();
            this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.ChthonicFavorUpgrade2, undefined, undefined, true, subzoneType));
            this.globalService.handleTutorialModal();
          }
          else
            this.lookupService.gainResource(this.lookupService.makeResourceCopy(bonus));
        });
      }
    }

    var count = completedAchievement.length;
    var previousAchievementCount = this.globalService.globalVar.totalAchievementsCompleted;
    this.globalService.globalVar.followerData.achievementCompletionCounter += count;
    this.globalService.globalVar.totalAchievementsCompleted += count;

    if (previousAchievementCount === 0 && this.globalService.globalVar.totalAchievementsCompleted > 0) {
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Achievements, undefined, undefined, true, subzoneType));
      this.globalService.handleTutorialModal();
      this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Followers, undefined, undefined, true, subzoneType));
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
