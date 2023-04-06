import { Injectable } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { BalladService } from '../ballad/ballad.service';
import { GameLogService } from '../battle/game-log.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { TutorialService } from '../global/tutorial.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { ShopItemGeneratorService } from '../shop/shop-item-generator.service';

@Injectable({
  providedIn: 'root'
})
export class SubZoneGeneratorService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private resourceGeneratorService: ResourceGeneratorService,
    private shopItemGenerator: ShopItemGeneratorService) { }

  generateBattleOptions(type: SubZoneEnum) {
    var battleOptions: EnemyTeam[] = [];
    if (type === SubZoneEnum.AigosthenaUpperCoast) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam2);
    }
    if (type === SubZoneEnum.AigosthenaBay) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.AigosthenaLowerCoast) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedGull));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedGull));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.AigosthenaWesternWoodlands) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarvingMongrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WildBoar));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.KillerBees));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.KillerBees));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.KillerBees));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.KillerBees));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarvingMongrel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarvingMongrel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WildBoar));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StarvingMongrel));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Patriarch));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.DodonaDelphiOutskirts) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bandit));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bandit));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thief));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thief));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Highwayman));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thief));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Highwayman));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Highwayman));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thief));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Coyote));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Coyote));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bandit));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bandit));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thief));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bandit));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.DodonaCountryside) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Archer));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.DodonaMountainOpening) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Coyote));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Coyote));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Coyote));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.DodonaMountainPassOne) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.DodonaLakeTrichonida) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Sybaris));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.DodonaMountainPassTwo) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueHarpy));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreenHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.DodonaAmbracianGulf) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeOctopus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeOctopus));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeOctopus));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeOctopus));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeOctopus));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FledglingLamia));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.LibyaBeach) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.LibyaRockyOutcrops) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnsettlingShade));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gorgon));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.LibyaDeeperPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stheno));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Euryale));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.LibyaIsleCenter) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Medusa));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.NemeaCountryRoadsOne) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnceladusOne));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.NemeaCountryRoadsTwo) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lion));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lion));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.AsphodelTheDepths) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LostSoul));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LostSoul));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Wretched));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Wretched));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Wretched));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Wretched));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LostSoul));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AsphodelForgottenHalls) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EngorgedShade));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EngorgedShade));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EngorgedShade));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Wretched));
      battleOptions.push(enemyTeam5);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EngorgedShade));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.AsphodelEndlessStaircase) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingSpectre));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Revenant));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingSpectre));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingSpectre));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IncoherentBanshee));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingSpectre));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.AsphodelFieryPassage) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingFlame));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.AsphodelDarkenedMeadows) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AsphodelLetheBasin) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HellRider));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HellRider));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      battleOptions.push(enemyTeam5);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      battleOptions.push(enemyTeam7);

      var enemyTeam8: EnemyTeam = new EnemyTeam();
      enemyTeam8.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam8.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      battleOptions.push(enemyTeam8);

      var enemyTeam9: EnemyTeam = new EnemyTeam();
      enemyTeam9.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam9.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Empusa));
      enemyTeam9.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.InsaneSoul));
      battleOptions.push(enemyTeam9);
    }
    if (type === SubZoneEnum.AsphodelLetheTributary) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnflamedSalamander));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FieryNewt));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ElysiumElysianFields) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.ElysiumOpenPlains) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.ElysiumWindingPaths) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlessedShade));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.ElysiumWaterloggedMarsh) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CreatureFromTheDeep));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CreatureFromTheDeep));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));            
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CreatureFromTheDeep));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));      
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));      
      battleOptions.push(enemyTeam5);
      
      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedSoul));      
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.ElysiumWavesOfOceanus) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Acheron));      
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.PeloposNisosGatesOfTheUnderworld) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnrulyHound));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UnrulyHound));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FirebreathingSerpent));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FirebreathingSerpent));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FirebreathingSerpent));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.PeloposNisosArcadianRoads) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RogueNymph));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RogueNymph));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RogueNymph));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RogueNymph));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestWisp));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianVulture));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianVulture));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianVulture));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FirebreathingSerpent));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RogueNymph));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestWisp));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.PeloposNisosFootOfTheMountain) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.PeloposNisosSteepAscent) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.PeloposNisosMountParthenionCaverns) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StoneElemental));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StoneElemental));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StoneElemental));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StoneElemental));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.PeloposNisosValleyOpening) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurWarrior));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurScout));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      battleOptions.push(enemyTeam3);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMystic));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurArcher));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossArcadia) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShadyTraveler));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistyBadger));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenJackal));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenJackal));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenJackal));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenJackal));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShadyTraveler));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistyBadger));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianVulture));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianVulture));
      battleOptions.push(enemyTeam7);

      var enemyTeam8: EnemyTeam = new EnemyTeam();
      enemyTeam8.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam8.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam8.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      battleOptions.push(enemyTeam8);
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossAcheae) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BrownBear));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PushyMerchant));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosBandit));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosBandit));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRogue));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosBandit));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRogue));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosBandit));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosBandit));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.PeloposNisosPatrasBorder) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosGangLeader));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRogue));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PatrinosRuffian));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CalydonForestPassage) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WoodlandNymph));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WoodlandNymph));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.CalydonHeavyThicket) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WoodlandNymph));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WoodlandNymph));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestDryad));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      battleOptions.push(enemyTeam3);
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestDryad));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WoodlandNymph));      
      battleOptions.push(enemyTeam4);      
    }
    if (type === SubZoneEnum.CalydonWelltroddenPathway) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggravatedHunter));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggravatedHunter));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggravatedHunter));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Trapper));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Trapper));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));
      battleOptions.push(enemyTeam3);      
    }
    if (type === SubZoneEnum.CalydonSparseClearing) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));                  
      battleOptions.push(enemyTeam2);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar));    
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));      
      battleOptions.push(enemyTeam4);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HornedViper));
      battleOptions.push(enemyTeam3);      
    }
    if (type === SubZoneEnum.CalydonShroudedFoliage) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoisonSpewingFungi));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestDryad));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestDryad));
      battleOptions.push(enemyTeam3);      
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestDryad));
      battleOptions.push(enemyTeam4);      
    }
    if (type === SubZoneEnum.CalydonBabblingStream) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSpeckledToad));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSpeckledToad));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      battleOptions.push(enemyTeam3);      
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSpeckledToad));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));
      battleOptions.push(enemyTeam4);      
    }
    if (type === SubZoneEnum.CalydonMudpit) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingIbex));
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralBoar)); 
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CalydonMarkedTreeTrail) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SavageBear));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SavageBear));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SavageBear));       
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();      
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));      
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      battleOptions.push(enemyTeam5);  
    }
    if (type === SubZoneEnum.CalydonOvergrownVerdure) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSpeckledToad));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSpeckledToad));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Leopard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Leopard));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowSpeckledToad));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CarnivorousFlora));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Leopard));       
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CalydonWornDownBarn) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CalydonianBoar));            
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CalydonWateringHole) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));        
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlphaGreyWolf));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingIbex));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingIbex));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreyWolf));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingIbex));       
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CalydonTallGrass) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DenMother));            
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SavageBear));            
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SavageBear));            
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CalydonDeadEnd) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));        
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PitViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PitViper));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PitViper));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Bobcat));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PitViper));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GriffonVulture));       
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLetheLetheBasin2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade)); 
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ArmoredRevenant));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ArmoredRevenant));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ArmoredRevenant));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedSalamander));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedSalamander));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedSalamander));             
      battleOptions.push(enemyTeam4);
      
      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedSalamander));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedSalamander));       
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));             
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLetheFerryRide) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForgetfulShade));       
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));            
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLetheRiverDivergence) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));        
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingSpirit));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverKarp));     
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));       
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));                   
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingSpirit));       
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingSpirit));                   
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLetheStillWaters) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NightmareMonstrosity));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NightmareMonstrosity));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NightmareMonstrosity));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NightmareMonstrosity));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedAbomination));      
      battleOptions.push(enemyTeam3);    
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFlames));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NightmareMonstrosity));           
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLetheHypnosIsland) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShadeOfHypnos));      
      battleOptions.push(enemyTeam);      
    }

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
            if (duplicateEnemy.abilityList.length > 0)
            {
            //go through user/target effects, look for caster, update name
              duplicateEnemy.abilityList.forEach(ability => {
                if (ability.userEffect.length > 0 && ability.userEffect.filter(item => item.caster !== "").length > 0)
                {
                  ability.userEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                    effect.caster = duplicateEnemy.name + " " + count;
                  });
                }

                if (ability.targetEffect.length > 0 && ability.targetEffect.filter(item => item.caster !== "").length > 0)
                {
                  ability.targetEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                    effect.caster = duplicateEnemy.name + " " + count;
                  });
                }
              })
            }
            duplicateEnemy.name += " " + count;

            var charCode = count.charCodeAt(0);
            count = String.fromCharCode(++charCode);
          })
        }
      });
    });

    return battleOptions;
  }

  generateTreasureChestChance(type: SubZoneEnum) {
    var chance = 0;

    if (type === SubZoneEnum.AigosthenaWesternWoodlands) {
      chance = .05;
    }
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris) {
      chance = .025;
    }
    if (type === SubZoneEnum.DodonaCountryside) {
      chance = .02;
    }
    if (type === SubZoneEnum.DodonaMountainPassOne) {
      chance = .075;
    }
    if (type === SubZoneEnum.DodonaMountainPassTwo) {
      chance = .03;
    }
    if (type === SubZoneEnum.DodonaAmbracianGulf) {
      chance = .05;
    }
    if (type === SubZoneEnum.AsphodelForgottenHalls) {
      chance = .075;
    }
    if (type === SubZoneEnum.AsphodelFieryPassage) {
      chance = .025;
    }
    if (type === SubZoneEnum.AsphodelLetheBasin) {
      chance = .05;
    }
    if (type === SubZoneEnum.ElysiumOpenPlains) {
      chance = .03;
    }
    if (type === SubZoneEnum.PeloposNisosArcadianRoads) {
      chance = .025;
    }
    if (type === SubZoneEnum.PeloposNisosSteepAscent) {
      chance = .03;
    }
    if (type === SubZoneEnum.PeloposNisosMountParthenionCaverns) {
      chance = .04;
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossAcheae) {
      chance = .05;
    }
    if (type === SubZoneEnum.CalydonOvergrownVerdure) {
      chance = .025;
    }
    if (type === SubZoneEnum.CalydonHeavyThicket) {
      chance = .075;
    }
    if (type === SubZoneEnum.CalydonTallGrass) {
      chance = .08;
    }
    if (type === SubZoneEnum.CalydonShroudedFoliage) {
      chance = .08;
    }

    return chance;
  }

  getTreasureChestRewards(type: SubZoneEnum) {
    var rewards: ResourceValue[] = [];

    if (type === SubZoneEnum.AigosthenaUpperCoast) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 15));
    }
    if (type === SubZoneEnum.AigosthenaBay) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.IronSword, 1));
    }
    if (type === SubZoneEnum.AigosthenaLowerCoast) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingHerb, 3));
    }
    if (type === SubZoneEnum.AigosthenaWesternWoodlands) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingHerb, 1));
    }
    if (type === SubZoneEnum.DodonaMountainOpening) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 30));
    }
    if (type === SubZoneEnum.DodonaMountainPassOne) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 2));
    }
    if (type === SubZoneEnum.DodonaMountainPassTwo) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 5));
    }
    if (type === SubZoneEnum.DodonaCountryside) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 1));
    }
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Wax, 1));
    }
    if (type === SubZoneEnum.DodonaAmbracianGulf) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Fennel, 2));
    }
    if (type === SubZoneEnum.AsphodelForgottenHalls) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheLethe, 1));
    }
    if (type === SubZoneEnum.AsphodelFieryPassage) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SoulSpark, 2));
    }
    if (type === SubZoneEnum.AsphodelLetheBasin) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfTheLethe, 2));
    }
    if (type === SubZoneEnum.ElysiumOpenPlains) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughEmeraldFragment, 1));
    }
    if (type === SubZoneEnum.PeloposNisosArcadianRoads) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.VialOfLakeLerna, 2));
    }
    if (type === SubZoneEnum.PeloposNisosSteepAscent) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAmethystFragment, 1));
    }
    if (type === SubZoneEnum.PeloposNisosMountParthenionCaverns) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughOpalFragment, 1));
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossAcheae) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HeftyStone, 2));
    }
    if (type === SubZoneEnum.CalydonOvergrownVerdure) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Goldroot, 3));
    }
    if (type === SubZoneEnum.CalydonHeavyThicket) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Lousewort, 1));
    }
    if (type === SubZoneEnum.CalydonTallGrass) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Violet, 2));
    }
    if (type === SubZoneEnum.CalydonShroudedFoliage) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Goldroot, 1));
    }

    return rewards;
  }

  getBalladUnlocks(type: SubZoneEnum, isUnderworldAvailable: boolean) {
    var balladEnums: BalladEnum[] = [];    

    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods) {
      balladEnums.push(BalladEnum.Gorgon);
    }    
    if (type === SubZoneEnum.LibyaIsleCenter && !isUnderworldAvailable) {
      balladEnums.push(BalladEnum.Labors);
    }
    if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory) {
      balladEnums.push(BalladEnum.Boar);
    }
    if (type === SubZoneEnum.CalydonWornDownBarn) {
      balladEnums.push(BalladEnum.Argo);
    }

    return balladEnums;
  }

  getZoneUnlocks(type: SubZoneEnum) {
    var zoneEnums: ZoneEnum[] = [];

    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods) {
      zoneEnums.push(ZoneEnum.Dodona);
    }
    if (type === SubZoneEnum.DodonaAmbracianGulf) {
      zoneEnums.push(ZoneEnum.Libya);
    }
    if (type === SubZoneEnum.LibyaIsleCenter) {
      zoneEnums.push(ZoneEnum.Nemea);
    }
    if (type === SubZoneEnum.AsphodelLetheTributary) {
      zoneEnums.push(ZoneEnum.Elysium);
    }
    if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory) {
      zoneEnums.push(ZoneEnum.PeloposNisos);
    }
    if (type === SubZoneEnum.PeloposNisosPatrasBorder) {
      zoneEnums.push(ZoneEnum.Calydon);
    }
    if (type === SubZoneEnum.CalydonWornDownBarn) {
      zoneEnums.push(ZoneEnum.TheLethe);
      zoneEnums.push(ZoneEnum.AegeanSea);
    }
    if (type === SubZoneEnum.AegeanSeaSympegadesOverlook) {
      zoneEnums.push(ZoneEnum.BlackSea);
    }
    if (type === SubZoneEnum.BlackSeaWindyGale) {
      zoneEnums.push(ZoneEnum.Colchis);
    }

    return zoneEnums;
  }

  getSubZoneUnlocks(type: SubZoneEnum) {
    var subZoneEnums: SubZoneEnum[] = [];

    if (type === SubZoneEnum.AigosthenaUpperCoast) {
      subZoneEnums.push(SubZoneEnum.AigosthenaBay);
    }
    if (type === SubZoneEnum.AigosthenaBay) {
      subZoneEnums.push(SubZoneEnum.AigosthenaLowerCoast);
    }
    if (type === SubZoneEnum.AigosthenaLowerCoast) {
      subZoneEnums.push(SubZoneEnum.AigosthenaWesternWoodlands);
    }
    if (type === SubZoneEnum.AigosthenaWesternWoodlands) {
      subZoneEnums.push(SubZoneEnum.AigosthenaHeartOfTheWoods);
    }
    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods) {
      subZoneEnums.push(SubZoneEnum.DodonaDelphi);
      subZoneEnums.push(SubZoneEnum.DodonaDelphiOutskirts);
    }
    if (type === SubZoneEnum.DodonaDelphiOutskirts) {
      subZoneEnums.push(SubZoneEnum.DodonaCoastalRoadsOfLocris);
    }
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris) {
      subZoneEnums.push(SubZoneEnum.DodonaCountryside);
    }
    if (type === SubZoneEnum.DodonaCountryside) {
      subZoneEnums.push(SubZoneEnum.DodonaMountainOpening);
    }
    if (type === SubZoneEnum.DodonaMountainOpening) {
      subZoneEnums.push(SubZoneEnum.DodonaMountainPassOne);
    }
    if (type === SubZoneEnum.DodonaMountainPassOne) {
      subZoneEnums.push(SubZoneEnum.DodonaLakeTrichonida);
    }
    if (type === SubZoneEnum.DodonaLakeTrichonida) {
      subZoneEnums.push(SubZoneEnum.DodonaMountainPassTwo);
    }
    if (type === SubZoneEnum.DodonaMountainPassTwo) {
      subZoneEnums.push(SubZoneEnum.DodonaAmbracianGulf);
    }
    if (type === SubZoneEnum.DodonaAmbracianGulf) {
      subZoneEnums.push(SubZoneEnum.DodonaArta);
      subZoneEnums.push(SubZoneEnum.LibyaBeach);
    }
    if (type === SubZoneEnum.LibyaBeach) {
      subZoneEnums.push(SubZoneEnum.LibyaRockyOutcrops);
    }
    if (type === SubZoneEnum.LibyaRockyOutcrops) {
      subZoneEnums.push(SubZoneEnum.LibyaDeeperPath);
    }
    if (type === SubZoneEnum.LibyaDeeperPath) {
      subZoneEnums.push(SubZoneEnum.LibyaIsleCenter);
    }
    if (type === SubZoneEnum.LibyaIsleCenter) {
      subZoneEnums.push(SubZoneEnum.NemeaCountryRoadsOne);
    }
    if (type === SubZoneEnum.NemeaCountryRoadsTwo) {
      subZoneEnums.push(SubZoneEnum.NemeaRollingHills);
    }
    if (type === SubZoneEnum.NemeaRollingHills) {
      subZoneEnums.push(SubZoneEnum.NemeaLairOfTheLion);
    }
    if (type === SubZoneEnum.AsphodelTheDepths) {
      subZoneEnums.push(SubZoneEnum.AsphodelForgottenHalls);
    }
    if (type === SubZoneEnum.AsphodelForgottenHalls) {
      subZoneEnums.push(SubZoneEnum.AsphodelLostHaven);
      subZoneEnums.push(SubZoneEnum.AsphodelEndlessStaircase);
    }
    if (type === SubZoneEnum.AsphodelEndlessStaircase) {
      subZoneEnums.push(SubZoneEnum.AsphodelFieryPassage);
    }
    if (type === SubZoneEnum.AsphodelFieryPassage) {
      subZoneEnums.push(SubZoneEnum.AsphodelDarkenedMeadows);
    }
    if (type === SubZoneEnum.AsphodelDarkenedMeadows) {
      subZoneEnums.push(SubZoneEnum.AsphodelLetheBasin);
    }
    if (type === SubZoneEnum.AsphodelLetheBasin) {
      subZoneEnums.push(SubZoneEnum.AsphodelLetheTributary);
    }
    if (type === SubZoneEnum.AsphodelLetheTributary) {
      subZoneEnums.push(SubZoneEnum.ElysiumElysianFields);
    }
    if (type === SubZoneEnum.ElysiumElysianFields) {
      subZoneEnums.push(SubZoneEnum.ElysiumOpenPlains);
    }
    if (type === SubZoneEnum.ElysiumOpenPlains) {
      subZoneEnums.push(SubZoneEnum.ElysiumColiseum);
    }
    if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosGatesOfTheUnderworld);
      subZoneEnums.push(SubZoneEnum.ElysiumWindingPaths);
    }
    if (type === SubZoneEnum.ElysiumWindingPaths) {
      subZoneEnums.push(SubZoneEnum.ElysiumWaterloggedMarsh);
    }
    if (type === SubZoneEnum.ElysiumWaterloggedMarsh) {
      subZoneEnums.push(SubZoneEnum.ElysiumWavesOfOceanus);
    }
    if (type === SubZoneEnum.PeloposNisosGatesOfTheUnderworld) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosArcadianRoads);
    }
    if (type === SubZoneEnum.PeloposNisosArcadianRoads) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosTravelPost);
      subZoneEnums.push(SubZoneEnum.PeloposNisosFootOfTheMountain);
    }
    if (type === SubZoneEnum.PeloposNisosFootOfTheMountain) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosSteepAscent);
    }
    if (type === SubZoneEnum.PeloposNisosSteepAscent) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosMountParthenionCaverns);
    }
    if (type === SubZoneEnum.PeloposNisosMountParthenionCaverns) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosValleyOpening);
    }
    if (type === SubZoneEnum.PeloposNisosValleyOpening) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosTrekAcrossArcadia);
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossArcadia) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosTrekAcrossAcheae);
    }
    if (type === SubZoneEnum.PeloposNisosTrekAcrossAcheae) {
      subZoneEnums.push(SubZoneEnum.PeloposNisosPatrasBorder);
    }
    if (type === SubZoneEnum.PeloposNisosPatrasBorder) {
      subZoneEnums.push(SubZoneEnum.CalydonTownMarket);
      subZoneEnums.push(SubZoneEnum.CalydonAltarOfAsclepius);
      subZoneEnums.push(SubZoneEnum.CalydonForestPassage);
    }
    if (type === SubZoneEnum.CalydonForestPassage) {      
      subZoneEnums.push(SubZoneEnum.CalydonHeavyThicket);
      subZoneEnums.push(SubZoneEnum.CalydonWelltroddenPathway);
      subZoneEnums.push(SubZoneEnum.CalydonSparseClearing);
    }
    if (type === SubZoneEnum.CalydonHeavyThicket) {
      subZoneEnums.push(SubZoneEnum.CalydonShroudedFoliage);  
      subZoneEnums.push(SubZoneEnum.CalydonBabblingStream);    
    }
    if (type === SubZoneEnum.CalydonWelltroddenPathway) {      
      subZoneEnums.push(SubZoneEnum.CalydonBabblingStream);
      subZoneEnums.push(SubZoneEnum.CalydonMudpit);
    }
    if (type === SubZoneEnum.CalydonSparseClearing) {
      subZoneEnums.push(SubZoneEnum.CalydonMudpit);
      subZoneEnums.push(SubZoneEnum.CalydonMarkedTreeTrail);      
    }
    if (type === SubZoneEnum.CalydonShroudedFoliage) {
      subZoneEnums.push(SubZoneEnum.CalydonOvergrownVerdure);
      subZoneEnums.push(SubZoneEnum.CalydonWornDownBarn);      
    }
    if (type === SubZoneEnum.CalydonBabblingStream) {
      subZoneEnums.push(SubZoneEnum.CalydonWornDownBarn);
      subZoneEnums.push(SubZoneEnum.CalydonWateringHole);      
    }
    if (type === SubZoneEnum.CalydonMudpit) {
      subZoneEnums.push(SubZoneEnum.CalydonWateringHole);
      subZoneEnums.push(SubZoneEnum.CalydonTallGrass);      
    }
    if (type === SubZoneEnum.CalydonMarkedTreeTrail) {
      subZoneEnums.push(SubZoneEnum.CalydonTallGrass);
      subZoneEnums.push(SubZoneEnum.CalydonDeadEnd);      
    }
    if (type === SubZoneEnum.CalydonWornDownBarn) {
      subZoneEnums.push(SubZoneEnum.TheLetheLetheBasin2);  
      subZoneEnums.push(SubZoneEnum.AegeanSeaIolcus);      
      subZoneEnums.push(SubZoneEnum.AegeanSeaOpenSeas);       
    }
    if (type === SubZoneEnum.TheLetheLetheBasin2) {
      subZoneEnums.push(SubZoneEnum.TheLetheFerryRide);      
    }
    if (type === SubZoneEnum.TheLetheFerryRide) {
      subZoneEnums.push(SubZoneEnum.TheLetheRiverDivergence);      
    }
    if (type === SubZoneEnum.TheLetheRiverDivergence) {
      subZoneEnums.push(SubZoneEnum.TheLetheStillWaters);      
    }
    if (type === SubZoneEnum.TheLetheStillWaters) {
      subZoneEnums.push(SubZoneEnum.TheLetheHypnosIsland);     
    }
    if (type === SubZoneEnum.AegeanSeaOpenSeas) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaIslandOfLemnos);      
    }
    if (type === SubZoneEnum.AegeanSeaIslandOfLemnos) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaIslandOfImbros);      
    }
    if (type === SubZoneEnum.AegeanSeaIslandOfImbros) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaHellespointPassage1);      
    }
    if (type === SubZoneEnum.AegeanSeaHellespointPassage1) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaPropontis);      
    }
    if (type === SubZoneEnum.AegeanSeaPropontis) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaHellespointPassage2);      
    }
    if (type === SubZoneEnum.AegeanSeaHellespointPassage2) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaCoastalThrace);      
    }
    if (type === SubZoneEnum.AegeanSeaCoastalThrace) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaSalmydessus);      
      subZoneEnums.push(SubZoneEnum.AegeanSeaDesertedPath);      
    }
    if (type === SubZoneEnum.AegeanSeaDesertedPath) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaRockyOverhang);      
    }
    if (type === SubZoneEnum.AegeanSeaRockyOverhang) {
      subZoneEnums.push(SubZoneEnum.AegeanSeaSympegadesOverlook);      
    }
    if (type === SubZoneEnum.AegeanSeaSympegadesOverlook) {
      subZoneEnums.push(SubZoneEnum.BlackSeaStillWaters);      
    }
    if (type === SubZoneEnum.BlackSeaStillWaters) {
      subZoneEnums.push(SubZoneEnum.BlackSeaMariandyna);      
      subZoneEnums.push(SubZoneEnum.BlackSeaUnderAssault);      
    }
    if (type === SubZoneEnum.BlackSeaUnderAssault) {
      subZoneEnums.push(SubZoneEnum.BlackSeaSeaEscape);      
    }
    if (type === SubZoneEnum.BlackSeaSeaEscape) {
      subZoneEnums.push(SubZoneEnum.BlackSeaStormySkies);      
    }
    if (type === SubZoneEnum.BlackSeaStormySkies) {
      subZoneEnums.push(SubZoneEnum.BlackSeaAreonesosPassing);      
    }
    if (type === SubZoneEnum.BlackSeaAreonesosPassing) {
      subZoneEnums.push(SubZoneEnum.BlackSeaWindyGale);      
    }
    if (type === SubZoneEnum.BlackSeaWindyGale) {
      subZoneEnums.push(SubZoneEnum.ColchisCityCenter);      
      subZoneEnums.push(SubZoneEnum.ColchisGroveOfAres);      
    }
    if (type === SubZoneEnum.ColchisGroveOfAres) {
      subZoneEnums.push(SubZoneEnum.ColchisReinforcementsFromAeetes);      
    }
    if (type === SubZoneEnum.ColchisReinforcementsFromAeetes) {
      subZoneEnums.push(SubZoneEnum.ColchisHurriedRetreat1);      
    }
    if (type === SubZoneEnum.ColchisHurriedRetreat1) {
      subZoneEnums.push(SubZoneEnum.ColchisHurriedRetreat2);      
    }
    
    return subZoneEnums;
  }

  getShopOptions(subzoneType: SubZoneEnum) {
    var shopOptions: ShopOption[] = [];
    var availableOptionsGeneral: ShopItem[] = [];
    var availableOptionsCrafter: ShopItem[] = [];
    var availableOptionsTraveler: ShopItem[] = [];

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LinenArmor, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.IronArmor, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.IronSword, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.IronHammer, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ShortBow, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.IronShield, SubZoneEnum.DodonaDelphi));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HealingHerb, SubZoneEnum.DodonaDelphi));

    //every general shop should have access to everything previous shop had
    if (subzoneType === SubZoneEnum.DodonaDelphi) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));

      return shopOptions;
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeArmor, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeSword, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeHammer, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeShield, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LongBow, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ThrowingStone, SubZoneEnum.DodonaArta));

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FortifiedBronzeSword, SubZoneEnum.DodonaArta));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FortifiedBronzeHammer, SubZoneEnum.DodonaArta));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FortifiedBronzeArmor, SubZoneEnum.DodonaArta));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Venomstrike, SubZoneEnum.DodonaArta));

    if (subzoneType === SubZoneEnum.DodonaArta) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));

      return shopOptions;
    }

    if (subzoneType === SubZoneEnum.AsphodelPalaceOfHades) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Story, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.Alchemist, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.ChthonicFavor, []));

      return shopOptions;
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SteelArmor, SubZoneEnum.AsphodelLostHaven));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SteelSword, SubZoneEnum.AsphodelLostHaven));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SteelHammer, SubZoneEnum.AsphodelLostHaven));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ElysianOakBow, SubZoneEnum.AsphodelLostHaven));

    /*availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MoltenArmor, SubZoneEnum.AsphodelLostHaven));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MoltenShield, SubZoneEnum.AsphodelLostHaven));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MoltenRing, SubZoneEnum.AsphodelLostHaven));*/

    if (subzoneType === SubZoneEnum.AsphodelLostHaven) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));

      return shopOptions;
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PendantOfFortune, SubZoneEnum.ElysiumColiseum));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PendantOfPower, SubZoneEnum.ElysiumColiseum));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PendantOfSpeed, SubZoneEnum.ElysiumColiseum));

    availableOptionsTraveler.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SparringMatch, SubZoneEnum.ElysiumColiseum));
    availableOptionsTraveler.push(this.shopItemGenerator.generateShopItem(ItemsEnum.WarriorClass, SubZoneEnum.ElysiumColiseum));
    availableOptionsTraveler.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PriestClass, SubZoneEnum.ElysiumColiseum));

    if (subzoneType === SubZoneEnum.ElysiumColiseum) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Coliseum, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
      shopOptions.push(new ShopOption(ShopTypeEnum.Traveler, availableOptionsTraveler));
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedAmethystRing, SubZoneEnum.PeloposNisosTravelPost));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedAquamarineRing, SubZoneEnum.PeloposNisosTravelPost));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedEmeraldRing, SubZoneEnum.PeloposNisosTravelPost));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedOpalRing, SubZoneEnum.PeloposNisosTravelPost));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedRubyRing, SubZoneEnum.PeloposNisosTravelPost));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FracturedTopazRing, SubZoneEnum.PeloposNisosTravelPost));

    if (subzoneType === SubZoneEnum.PeloposNisosTravelPost) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HeftyStone, SubZoneEnum.CalydonTownMarket));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.RestorativeHerb, SubZoneEnum.CalydonTownMarket));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ShieldOfTheHealer, SubZoneEnum.CalydonTownMarket));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BedazzledRing, SubZoneEnum.CalydonTownMarket));

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HardenedLeatherArmor, SubZoneEnum.CalydonTownMarket));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BoarskinArmor, SubZoneEnum.CalydonTownMarket));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BearskinArmor, SubZoneEnum.CalydonTownMarket));

    if (subzoneType === SubZoneEnum.CalydonTownMarket) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    return shopOptions;
  }
}
