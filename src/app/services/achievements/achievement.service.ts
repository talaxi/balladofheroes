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

    var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods || subzoneType === SubZoneEnum.DodonaCountryside ||
      subzoneType === SubZoneEnum.DodonaLakeTrichonida || subzoneType === SubZoneEnum.LibyaDeeperPath ||
      subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.AsphodelLetheTributary ||
      subzoneType === SubZoneEnum.ElysiumWavesOfOceanus || subzoneType === SubZoneEnum.TheLetheHypnosIsland ||
      subzoneType === SubZoneEnum.PeloposNisosPatrasBorder || subzoneType === SubZoneEnum.CalydonWornDownBarn ||
      subzoneType === SubZoneEnum.CalydonTallGrass)
      newAchievements.push(thirtySecondClear);

    var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods || subzoneType === SubZoneEnum.DodonaCountryside ||
      subzoneType === SubZoneEnum.DodonaLakeTrichonida || subzoneType === SubZoneEnum.LibyaDeeperPath ||
      subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.AsphodelLetheTributary ||
      subzoneType === SubZoneEnum.ElysiumWavesOfOceanus || subzoneType === SubZoneEnum.TheLetheHypnosIsland ||
      subzoneType === SubZoneEnum.PeloposNisosPatrasBorder || subzoneType === SubZoneEnum.CalydonWornDownBarn ||
      subzoneType === SubZoneEnum.CalydonTallGrass)
      newAchievements.push(tenSecondClear);

    var completeClear = new Achievement(AchievementTypeEnum.Complete, subzoneType);

    if (subzoneType === SubZoneEnum.LibyaIsleCenter || subzoneType === SubZoneEnum.ElysiumWavesOfOceanus ||
      subzoneType === SubZoneEnum.TheLetheHypnosIsland)
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
    }

    var thousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);

    if (achievementType === AchievementTypeEnum.ThousandVictories) {
      var aigosthenaBoonBonus = .02;
      var dodonaBoonBonus = .02;
      var libyaBoonBonus = .03;
      var asphodelBoonBonus = .03;
      var elysiumBoonBonus = .03;
      var peloposNisosBoonBonus = .03;
      var calydonBoonBonus = .03;
      var theLetheBoonBonus = .03;

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
    }

    if (achievementType === AchievementTypeEnum.TenThousandVictories) {
      if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaBay)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, 1));

      else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.DodonaCountryside)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, 1));
      else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.LibyaBeach)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, 1));

      else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
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
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, 1));

      else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, 1));
      else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, 1));

      else if (subzoneType === SubZoneEnum.CalydonForestPassage)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, 1));
      else if (subzoneType === SubZoneEnum.CalydonHeavyThicket)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, 1));
      else if (subzoneType === SubZoneEnum.CalydonWelltroddenPathway)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonSparseClearing)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
      else if (subzoneType === SubZoneEnum.CalydonShroudedFoliage)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, 1));
      else if (subzoneType === SubZoneEnum.CalydonBabblingStream)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonMudpit)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, 1));
      else if (subzoneType === SubZoneEnum.CalydonMarkedTreeTrail)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, 1));
      else if (subzoneType === SubZoneEnum.CalydonOvergrownVerdure)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, 1));
      else if (subzoneType === SubZoneEnum.CalydonWornDownBarn)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonWateringHole)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, 1));
      else if (subzoneType === SubZoneEnum.CalydonTallGrass)
        rewards.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterDestruction, 1));
      else if (subzoneType === SubZoneEnum.CalydonDeadEnd)
        rewards.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, 1));
    }

    if (achievementType === AchievementTypeEnum.ThirtySecondClear) {
      var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);
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
    }

    if (achievementType === AchievementTypeEnum.Complete) {
      var completeClear = new Achievement(AchievementTypeEnum.Complete, subzoneType);
      if (subzoneType === SubZoneEnum.LibyaIsleCenter) {
        rewards.push(new ResourceValue(ItemsEnum.ItemBeltUp, 1));
        rewards.push(new ResourceValue(ItemsEnum.BonusXp, 4000));
      }
      if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus) {
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade1, 1));
      }
      if (subzoneType === SubZoneEnum.TheLetheHypnosIsland) {
        rewards.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade2, 1));
      }
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
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var thousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThousandVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.ThousandVictories);
      if (thousandVictories !== undefined && subzone.victoryCount >= 500 && !thousandVictories.completed && rewards !== undefined) {
        completedAchievement.push(thousandVictories);
        thousandVictories.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var tenThousandVictories = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.TenThousandVictories);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.TenThousandVictories);
      if (tenThousandVictories !== undefined && subzone.victoryCount >= 2500 && !tenThousandVictories.completed && rewards !== undefined) {
        completedAchievement.push(tenThousandVictories);
        tenThousandVictories.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
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
            this.lookupService.gainResource(bonus.makeCopy());
        });
      }

      var thirtySecondClear = subzoneRelatedAchievements.find(item => item.type === AchievementTypeEnum.ThirtySecondClear);
      var rewards = this.getAchievementReward(subzoneType, AchievementTypeEnum.ThirtySecondClear);
      if (thirtySecondClear !== undefined && subzone.fastestCompletion <= 30 && !thirtySecondClear.completed && rewards !== undefined) {
        completedAchievement.push(thirtySecondClear);
        thirtySecondClear.completed = true;
        rewards.forEach(bonus => {
          this.lookupService.gainResource(bonus.makeCopy());
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
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade2) {
            this.lookupService.enableChthonicFavor();
          }
          else
            this.lookupService.gainResource(bonus.makeCopy());
        });
      }
    }

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
