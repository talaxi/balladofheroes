import { Injectable } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
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

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private lookupService: LookupService, private alchemyService: AlchemyService, private tutorialService: TutorialService,
    private gameLogService: GameLogService, private globalService: GlobalService) { }

  createDefaultAchievementsForSubzone(subzoneType: SubZoneEnum) {
    var newAchievements: Achievement[] = [];

    if (this.lookupService.isSubzoneATown(subzoneType))
      return newAchievements;

    var hundredVictories = new Achievement(AchievementTypeEnum.HundredVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 20));

    else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));
    else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 300));
    else if (subzoneType === SubZoneEnum.DodonaCountryside)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 25));
    else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 25));
    else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 15));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.LibyaBeach)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 500));
    else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 10));
    else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 10));

    else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 1000));
    else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 50));
    else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 40));
    else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 25));
    else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingSalve, ItemTypeEnum.HealingItem, 10));
    else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.HealingPoultice, ItemTypeEnum.HealingItem, 20));
    else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 40));
    else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 2500));

    else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 30));
    else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 20));
    else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallAquamarine, ItemTypeEnum.CraftingMaterial, 3));
    else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 15));
    else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 3));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 3));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 5));
    else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      hundredVictories.bonusResources.push(new ResourceValue(ItemsEnum.Coin, ItemTypeEnum.Resource, 10000));

    if (hundredVictories.bonusResources.length > 0)
      newAchievements.push(hundredVictories);

    var thousandVictories = new Achievement(AchievementTypeEnum.ThousandVictories, subzoneType);

    var aigosthenaBoonBonus = .02;
    var dodonaBoonBonus = .02;
    var libyaBoonBonus = .03;
    var asphodelBoonBonus = .03;
    var elysiumBoonBonus = .03;
    var peloposNisosBoonBonus = .03;
    var calydonBoonBonus = .03;

    if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Aigosthena))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, aigosthenaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Dodona))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, dodonaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Libya))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, libyaBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Asphodel))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, asphodelBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Elysium))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, elysiumBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.PeloposNisos))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, peloposNisosBoonBonus));
    else if (this.lookupService.isSubzoneInZone(subzoneType, ZoneEnum.Calydon))
      thousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.BoonOfOlympus, ItemTypeEnum.Progression, calydonBoonBonus));


    if (thousandVictories.bonusResources.length > 0)
      newAchievements.push(thousandVictories);

    var tenThousandVictories = new Achievement(AchievementTypeEnum.TenThousandVictories, subzoneType);

    if (subzoneType === SubZoneEnum.AigosthenaUpperCoast)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaBay)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaLowerCoast)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaWesternWoodlands)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.DodonaDelphiOutskirts)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaCountryside)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainOpening)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassOne)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaMountainPassTwo)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfAirDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.DodonaAmbracianGulf)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaBeach)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaRockyOutcrops)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.AsphodelTheDepths)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelForgottenHalls)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelEndlessStaircase)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelFieryPassage)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelDarkenedMeadows)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelLetheBasin)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumElysianFields)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumOpenPlains)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumGatesOfHornAndIvory)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWindingPaths)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWaterloggedMarsh)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfIngenuity, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, ItemTypeEnum.Charm, 1));

    else if (subzoneType === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfEarthDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosArcadianRoads)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosFootOfTheMountain)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosSteepAscent)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterDestruction, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosValleyOpening)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfPreparation, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfLightningProtection, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    else if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      tenThousandVictories.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfAirDestruction, ItemTypeEnum.Charm, 1));

    if (tenThousandVictories.bonusResources.length > 0)
      newAchievements.push(tenThousandVictories);

    var thirtySecondClear = new Achievement(AchievementTypeEnum.ThirtySecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaCountryside)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.SmallCharmOfWaterProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      thirtySecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthProtection, ItemTypeEnum.Charm, 1));

    if (thirtySecondClear.bonusResources.length > 0)
      newAchievements.push(thirtySecondClear);

    var tenSecondClear = new Achievement(AchievementTypeEnum.TenSecondClear, subzoneType);
    if (subzoneType === SubZoneEnum.AigosthenaHeartOfTheWoods)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfHolyDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaCountryside)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfAirProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.DodonaLakeTrichonida)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.PoisonExtractPotionRecipe, ItemTypeEnum.Resource, 1));
    if (subzoneType === SubZoneEnum.LibyaDeeperPath)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfFireProtection, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.LibyaIsleCenter)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfPreparation, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.AsphodelLetheTributary)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, ItemTypeEnum.Charm, 1));
    if (subzoneType === SubZoneEnum.PeloposNisosPatrasBorder)
      tenSecondClear.bonusResources.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, ItemTypeEnum.Charm, 1));

    if (tenSecondClear.bonusResources.length > 0)
      newAchievements.push(tenSecondClear);

    var completeClear = new Achievement(AchievementTypeEnum.Complete, subzoneType);
    if (subzoneType === SubZoneEnum.LibyaIsleCenter) {
      completeClear.bonusResources.push(new ResourceValue(ItemsEnum.ItemBeltUp, ItemTypeEnum.Progression, 1));
      completeClear.bonusResources.push(new ResourceValue(ItemsEnum.BonusXp, ItemTypeEnum.Resource, 4000));
    }
    if (subzoneType === SubZoneEnum.ElysiumWavesOfOceanus) {
      completeClear.bonusResources.push(new ResourceValue(ItemsEnum.ChthonicFavorUpgrade1, ItemTypeEnum.Progression, 1));
    }

    if (completeClear.bonusResources.length > 0)
      newAchievements.push(completeClear);

    return newAchievements;
  }

  checkForSubzoneAchievement(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var completedAchievement: Achievement[] = [];
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    if (subzoneRelatedAchievements !== undefined && subzoneRelatedAchievements.length > 0) {
      var subzone = this.lookupService.getSubZoneByType(subzoneType);
      if (subzone === undefined)
        return completedAchievement;

      var hundredVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.HundredVictories);
      if (hundredVictories !== undefined && subzone.victoryCount >= 100 && !hundredVictories.completed && hundredVictories.bonusResources !== undefined) {
        completedAchievement.push(hundredVictories);
        hundredVictories.completed = true;
        hundredVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var thousandVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.ThousandVictories);
      if (thousandVictories !== undefined && subzone.victoryCount >= 500 && !thousandVictories.completed && thousandVictories.bonusResources !== undefined) {
        completedAchievement.push(thousandVictories);
        thousandVictories.completed = true;
        thousandVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var tenThousandVictories = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.TenThousandVictories);
      if (tenThousandVictories !== undefined && subzone.victoryCount >= 2500 && !tenThousandVictories.completed && tenThousandVictories.bonusResources !== undefined) {
        completedAchievement.push(tenThousandVictories);
        tenThousandVictories.completed = true;
        tenThousandVictories.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var tenSecondClear = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.TenSecondClear);
      if (tenSecondClear !== undefined && subzone.fastestCompletionSpeed <= 10 && !tenSecondClear.completed && tenSecondClear.bonusResources !== undefined) {
        completedAchievement.push(tenSecondClear);
        tenSecondClear.completed = true;
        tenSecondClear.bonusResources.forEach(bonus => {

          if (bonus.item === ItemsEnum.PoisonExtractPotionRecipe) {
            this.alchemyService.learnRecipe(ItemsEnum.PoisonExtractPotion);
          }
          else
            this.lookupService.gainResource(bonus);
        });
      }

      var thirtySecondClear = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.ThirtySecondClear);
      if (thirtySecondClear !== undefined && subzone.fastestCompletionSpeed <= 30 && !thirtySecondClear.completed && thirtySecondClear.bonusResources !== undefined) {
        completedAchievement.push(thirtySecondClear);
        thirtySecondClear.completed = true;
        thirtySecondClear.bonusResources.forEach(bonus => {
          this.lookupService.gainResource(bonus);
        });
      }

      var complete = subzoneRelatedAchievements.find(item => item.achievementType === AchievementTypeEnum.Complete);
      if (complete !== undefined && subzone.victoryCount >= 1 && !complete.completed && complete.bonusResources !== undefined) {
        completedAchievement.push(complete);
        complete.completed = true;
        complete.bonusResources.forEach(bonus => {
          if (bonus.item === ItemsEnum.ItemBeltUp) {
            this.lookupService.increaseItemBeltSize();
          }
          else if (bonus.item === ItemsEnum.BonusXp) {
            this.lookupService.giveCharactersBonusExp(bonus.amount);
          }
          else if (bonus.item === ItemsEnum.ChthonicFavorUpgrade1) {
            this.lookupService.enableChthonicFavoredGod();
          }
          else
            this.lookupService.gainResource(bonus);
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

    if (previousAchievementCount === 0 && this.globalService.globalVar.totalAchievementsCompleted > 0)
    {
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
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    return subzoneRelatedAchievements;
  }

  getUncompletedAchievementCountBySubZone(subzoneType: SubZoneEnum, achievements: Achievement[]) {
    var subzoneRelatedAchievements = achievements.filter(item => item.relatedSubzone === subzoneType);

    return subzoneRelatedAchievements.filter(item => !item.completed).length;
  }

  getCompletedAchievementPercentByZone(zone: Zone | undefined, achievements: Achievement[]) {
    if (zone === undefined)
      return 0;
    
    var relatedAchievements: Achievement[] = [];

    zone.subzones.forEach(subzone => {
      achievements.filter(item => item.relatedSubzone === subzone.type).forEach(achievement => {
        relatedAchievements.push(achievement);
      });
    });

    return relatedAchievements.filter(item => item.completed).length / relatedAchievements.length;
  }
}
