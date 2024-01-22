import { Injectable } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { God } from 'src/app/models/character/god.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ShopTypeEnum } from 'src/app/models/enums/shop-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { ShopItem } from 'src/app/models/shop/shop-item.model';
import { ShopOption } from 'src/app/models/shop/shop-option.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { ShopItemGeneratorService } from '../shop/shop-item-generator.service';
import { SidequestData } from 'src/app/models/utility/sidequest-data.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { OptionalSceneEnum } from 'src/app/models/enums/optional-scene-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';

@Injectable({
  providedIn: 'root'
})
export class SubZoneGeneratorService {

  constructor(private enemyGeneratorService: EnemyGeneratorService, private resourceGeneratorService: ResourceGeneratorService,
    private shopItemGenerator: ShopItemGeneratorService) { }

  generateBattleOptions(type: SubZoneEnum, differentiateIndividuals: boolean = true) {
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
      battleOptions.push(enemyTeam5);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
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
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
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
    if (type === SubZoneEnum.AegeanSeaOpenSeas) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShortfinMako));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShortfinMako));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AegeanSeaIslandOfLemnos) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShortfinMako));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShortfinMako));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.AegeanSeaIslandOfImbros) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlindedVillager));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnragedVillager));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnragedVillager));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnragedVillager));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlindedVillager));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlindedVillager));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlindedVillager));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.AegeanSeaHellespointPassage1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SeaSerpent));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AegeanSeaPropontis) {
      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Falcon));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.AegeanSeaHellespointPassage2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Blackfin));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      battleOptions.push(enemyTeam6);

      var enemyTeam7: EnemyTeam = new EnemyTeam();
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      enemyTeam7.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingCormorant));
      battleOptions.push(enemyTeam7);
    }
    if (type === SubZoneEnum.AegeanSeaCoastalThrace) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFox));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ClickingCrabs));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ClickingCrabs));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSnapper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedSnapper));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.AegeanSeaDesertedPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoullessHusk));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RamblingHusk));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AegeanSeaRockyOverhang) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TerritorialHarpy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TerritorialHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TerritorialHarpy));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TerritorialHarpy));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeralHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.AegeanSeaSympegadesOverlook) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HarpyQueen));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerventHarpy));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TerritorialHarpy));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.BlackSeaStillWaters) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AngryHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AngryHarpy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HungryCormorant));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AngryHarpy));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AngryHarpy));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HungryCormorant));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HungryCormorant));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HungryCormorant));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.BlackSeaUnderAssault) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveHusk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveHusk));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MindlessHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MindlessHusk));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MindlessHusk));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MindlessHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MindlessHusk));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.BlackSeaSeaEscape) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.BlackSeaStormySkies) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedSerpent));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Stingray));
      battleOptions.push(enemyTeam6);

    }
    if (type === SubZoneEnum.BlackSeaAreonesosPassing) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LesserKestrel));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.BlackSeaWindyGale) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrimsonKestrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TanKestrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GrayKestrel));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhiteKestrel));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ColchisGroveOfAres) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManicHusk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeHusk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShufflingHusk));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthenHusk));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LumberingHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShufflingHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EmptyHusk));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeHusk));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EmptyHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManicHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LumberingHusk));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShufflingHusk));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthenHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManicHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LumberingHusk));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EmptyHusk));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeHusk));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthenHusk));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EmptyHusk));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShufflingHusk));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManicHusk));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeHusk));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthenHusk));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LumberingHusk));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.ColchisReinforcementsFromAeetes) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Khalkotauroi));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Khalkotauroi));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ColchisHurriedRetreat1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatShrike));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MorayEel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MorayEel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Snapjaw));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MorayEel));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.ColchisHurriedRetreat2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BaskingShark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LongfinMako));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MorayEel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MorayEel));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SnapperSwarm));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.YellowfootedFalcon));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.NemeaCountryRoadsTwo) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeScorpion));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedBees));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Raider));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Raider));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mugger));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeScorpion));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Raider));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mugger));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mugger));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.NemeaRollingHills) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeScorpion));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedBees));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingHyena));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingHyena));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedBees));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.NemeaFlatlands) {
      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BloodthirstyHyena));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CacklingHyena));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lioness));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lioness));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.NemeaLairOfTheLion) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.NemeanLion));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.LernaAroundTheInachus) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhipSnake));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhipSnake));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FumingPeafowl));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.LernaThickMarsh) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhipSnake));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FumingPeafowl));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.LernaSwampySurroundings) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiverNymph));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.LernaDarkenedThicket) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.VenomousViper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GiantCrab));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GiantCrab));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.UntamedBoar));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GiantCrab));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.LernaSpringOfAmymone) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LerneanHydra));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HydraHead));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HydraHead));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.StymphaliaArcadianWilderness) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ScavengingCoyote));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveCoyote));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveCoyote));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveCoyote));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ScavengingCoyote));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ScavengingCoyote));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ScavengingCoyote));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.StymphaliaAbandonedVillage) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ScavengingCoyote));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AggressiveCoyote));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesperateLooter));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesperateLooter));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesperateLooter));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.StymphaliaSourceOfTheLadon) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Kingfisher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Kingfisher));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WanderingRam));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrazedVulture));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrazedVulture));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Kingfisher));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrazedVulture));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrazedVulture));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.StymphaliaLakeStymphalia) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianBird));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StymphalianBird));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ErymanthusLadonRiverbeds) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PiranhaSwarm));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PiranhaSwarm));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PiranhaSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HuntingBear));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurLookout));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurLookout));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurLookout));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HuntingBear));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.ErymanthusGreatMassif) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurLookout));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurLookout));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.ErymanthusCragInlet) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.ErymanthusMountainClimb) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurCaptain));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurCaptain));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurCaptain));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurBruiser));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurMarksman));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurCaptain));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurShaman));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CentaurAlchemist));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.ErymanthusSnowCappedPeaks) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ErymanthianBoar));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CoastOfCreteDownThePineios) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CoastOfCreteCretanSeas) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackStingray));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackStingray));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackStingray));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.CoastOfCreteCretanCoast) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ClickingCrabPair));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ClickingCrabPair));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ClickingCrabPair));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.CoastOfCreteVillageGardens) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SneakyFox));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SneakyFox));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AppleThief));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DerelictCityGuard));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AppleThief));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AppleThief));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CoastOfCreteAppleOrchards) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CretanBull));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackStingray));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueMako));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FeistySnapper));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MarredShark));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CamouflagedSnake));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crocodile));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesDesertSands) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SandBoa));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SandBoa));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesSaharanDunes) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SandBoa));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesertLocustSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SandBoa));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidMongrel));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SandBoa));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesertLocustSwarm));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DesertLocustSwarm));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesHiddenOasis) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThirstyLion));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhinoceros));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhinoceros));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EgyptianCobra));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.StripedHyena));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThirstyLion));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThirstyLion));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ThirstyLion));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeClawedCrab));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeClawedCrab));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhinoceros));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhinoceros));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeClawedCrab));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SkulkingJackal));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SkulkingJackal));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesFertileFields) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SkulkingJackal));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SkulkingJackal));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGardenSnake));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGardenSnake));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGardenSnake));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGardenSnake));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SkulkingJackal));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenAppleThief));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenAppleThief));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenAppleThief));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenAppleThief));
      battleOptions.push(enemyTeam5);

      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGardenSnake));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeeSwarm));
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Ladon));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ErytheiaLushValley) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AfricanWolf));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AfricanWolf));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringFalcon));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AfricanWolf));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedViper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringFalcon));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpottedViper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringFalcon));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.ErytheiaWesternOceanWaters) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlluringSiren));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlluringSiren));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlluringSiren));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SoaringFalcon));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RigidCrocodile));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RigidCrocodile));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.ErytheiaPillarsOfHeracles) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlluringSiren));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AlluringSiren));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MonsterDentex));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MonsterDentex));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SingingSiren));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RigidCrocodile));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RigidCrocodile));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MonsterDentex));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MonsterDentex));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MonsterDentex));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.ErytheiaIslandOfErytheia) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Eurytion));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Orthrus));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.ErytheiaGeryonsFarm) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Geryon));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.MountOlympusUpTheMountain) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidJackal));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgileChamois));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidJackal));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidJackal));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgileChamois));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgileChamois));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenEagle));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgileChamois));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.MountOlympusMeanderingPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidJackal));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenEagle));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenEagle));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldenEagle));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RabidJackal));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgileChamois));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.MountOlympusCouloir) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeftChamois));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeftChamois));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.MountOlympusMusesPlateau) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.MountOlympusPathwayToTheZenith) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeftChamois));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeftChamois));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerociousBear));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerociousBear));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FerociousBear));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeftChamois));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.MountOlympusMytikasSummit) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EarthSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.HuntForYarrowMountainHike) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphHealer));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam2);
    }
    if (type === SubZoneEnum.HuntForYarrowWoodlandTrail) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphHealer));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphHealer));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphHealer));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowTrailFork1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicSpark));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.HuntForYarrowTrailFork2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LowFlyingFalcon));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowTrailFork3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LargeGrub));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ManEatingSundew));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DevouringAldrovanda));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CoiledViper));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DevouringAldrovanda));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DevouringAldrovanda));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DevouringAldrovanda));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CoiledViper));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CoiledViper));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphWitch));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphHealer));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphWitch));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphWitch));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphKeeper));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphWitch));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphKeeper));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphWitch));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ForestNymphAssailant));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LightningSprite));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AirSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.HolySprite));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSprite));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MagicalSphere));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FireSprite));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.HuntForYarrowYarrowField) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MammothMagicalSphere));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.WarForTheMountainBattleAtTheGates) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Agrius));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thoon));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.WarForTheMountainOpenCourtyard) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mimon));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Mimas));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.WarForTheMountainStables) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Aristaeus));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.WarForTheMountainPalaces) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Gration));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.WarForTheMountainThePeak) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Porphyrion));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CreteTravelsAtSea) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleJellyfish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleJellyfish));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueJellyfish));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueJellyfish));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreaterGrebe));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreaterGrebe));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreaterGrebe));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CreteApproachingCrete) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleJellyfish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueJellyfish));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlueJellyfish));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreaterGrebe));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PurpleJellyfish));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CreteRapidWaters) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MauveStinger));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MauveStinger));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MauveStinger));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AgitatedStingray));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.CreteTurbulentCurrents) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MauveStinger));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FishFrenzy));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiledUpDolphin));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RiledUpDolphin));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.CreteWhirlpool) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoseidonsDolphin));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.PoseidonsDolphin));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.CreteNorthernCretanCoast) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeardedVulture));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RedFootedFalcon));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatWeever));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatWeever));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GreatWeever));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BeardedVulture));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthColdHallway) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthColdHallway) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthRightCorner) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthSolidWall1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.CrawlingOutline));
      battleOptions.push(enemyTeam2);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SpinningSilhouette));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthCenterPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DisfiguredShape));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DisfiguredShape));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DisfiguredShape));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthSlopedHallway) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DisfiguredShape));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ToxicSludge));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ToxicSludge));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ToxicSludge));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DisfiguredShape));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftFork) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ToxicSludge));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthRoundedPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftTurn) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthSolidWall3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RivetingPhantom));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RivetingPhantom));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      battleOptions.push(enemyTeam4);

      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FidgetingPhantom));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TranslucentPhantom));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RivetingPhantom));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.RivetingPhantom));
      battleOptions.push(enemyTeam5);
    }
    if (type === SubZoneEnum.TheLabyrinthCenterFork) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedCloak));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthDarkCorridor) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedCloak));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedCloak));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthOrnateEntryway) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BronzeAutomaton));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldAutomaton));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldAutomaton));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.GoldAutomaton));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TheMinotaur));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.TheLabyrinthRightFork) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedCloak));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BewitchedCloak));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.EnchantedArmor));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SilentPhantom));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthSolidWall4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.IntertwinedShadows));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DustyCloak));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DustyCloak));
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.TheLabyrinthRightPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.TwistedShadow));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthLongPassage1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.LabyrinthGuard));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthLongPassage2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedApparation));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedApparation));
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.TheLabyrinthSolidWall2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedApparation));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedApparation));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DarkSpecter));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WingedApparation));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FracturedShape));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.AiaiaUnknownWaters) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingBlob));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingBlob));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingBlob));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));      
      battleOptions.push(enemyTeam3);
    }
    if (type === SubZoneEnum.AiaiaBreezyDays) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FloatingBlob));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hammerhead));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hammerhead));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));      
      battleOptions.push(enemyTeam3);
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hammerhead));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hammerhead));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.AiaiaShoreline) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DivingRaptor));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      battleOptions.push(enemyTeam3);
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));
      battleOptions.push(enemyTeam4);
    }    
    if (type === SubZoneEnum.AiaiaForestPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      battleOptions.push(enemyTeam3);
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));
      battleOptions.push(enemyTeam4);
      
      var enemyTeam5: EnemyTeam = new EnemyTeam();
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));      
      enemyTeam5.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      battleOptions.push(enemyTeam5);
      
      var enemyTeam6: EnemyTeam = new EnemyTeam();
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));      
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      battleOptions.push(enemyTeam6);
    }
    if (type === SubZoneEnum.AiaiaOpenClearing) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OvergrownLizard));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));            
      battleOptions.push(enemyTeam3);      
    }
    if (type === SubZoneEnum.AiaiaThornyPath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));          
      battleOptions.push(enemyTeam3);      
    }
    if (type === SubZoneEnum.AiaiaWildThicket) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BlackWolf));      
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.BurrowingMole));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.MossyColossus));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaspSwarm));          
      battleOptions.push(enemyTeam3);  
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));          
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExoticDragonfly));          
      battleOptions.push(enemyTeam4);      
    }
    if (type === SubZoneEnum.AiaiaFlowerGarden) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OrangeFloweredColossus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WhiteFloweredColossus));
      battleOptions.push(enemyTeam);      
    }
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));            
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedSpirit));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedSpirit));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedSpirit));          
      battleOptions.push(enemyTeam3);      
    }
    if (type === SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));            
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedSpirit));      
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DrownedSpirit));          
      battleOptions.push(enemyTeam3);      
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));      
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheVortex) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));                  
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OpenMouthedShark));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.SubmergedAbomination));          
      battleOptions.push(enemyTeam3);      
      
      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OpenMouthedShark));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.OpenMouthedShark));      
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.StraitsOfMessinaCavernOpening) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));                  
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));                  
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));      
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.AbyssalFish));          
      battleOptions.push(enemyTeam3);            
    }
    if (type === SubZoneEnum.StraitsOfMessinaDarkTunnel) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedHydra));                  
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DeepSeaMonster));                  
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedHydra));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedHydra));            
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedHydra));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FrenziedHydra));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ShriekingLamia));          
      battleOptions.push(enemyTeam3);            
    }
    if (type === SubZoneEnum.StraitsOfMessinaUnavoidablePath) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Scylla));      
      battleOptions.push(enemyTeam);
    }
    if (type === SubZoneEnum.StraitsOfMessinaMawOfTheMonster) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Charybdis));      
      battleOptions.push(enemyTeam);
    }

    if (differentiateIndividuals) {
      battleOptions.forEach(enemyTeam => {
        enemyTeam.enemyList.forEach(enemy => {
          var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
          if (duplicateNameList.length > 1) {
            var count = "A";
            duplicateNameList.forEach(duplicateEnemy => {
              if (duplicateEnemy.abilityList.length > 0) {
                //go through user/target effects, look for caster, update name
                duplicateEnemy.abilityList.forEach(ability => {
                  if (ability.userEffect.length > 0 && ability.userEffect.filter(item => item.caster !== "").length > 0) {
                    ability.userEffect.filter(item => item.caster !== "").forEach(effect => {
                      if (effect.caster === duplicateEnemy.name)
                        effect.caster = duplicateEnemy.name + " " + count;
                    });
                  }

                  if (ability.targetEffect.length > 0 && ability.targetEffect.filter(item => item.caster !== "").length > 0) {
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
    }
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
    if (type === SubZoneEnum.AegeanSeaOpenSeas) {
      chance = .02;
    }
    if (type === SubZoneEnum.AegeanSeaPropontis) {
      chance = .04;
    }
    if (type === SubZoneEnum.AegeanSeaRockyOverhang) {
      chance = .02;
    }
    if (type === SubZoneEnum.BlackSeaStillWaters) {
      chance = .03;
    }
    if (type === SubZoneEnum.BlackSeaStormySkies) {
      chance = .035;
    }
    if (type === SubZoneEnum.BlackSeaAreonesosPassing) {
      chance = .04;
    }
    if (type === SubZoneEnum.ColchisGroveOfAres) {
      chance = .01;
    }

    return chance;
  }

  getTreasureChestRewards(type: SubZoneEnum) {
    var rewards: ResourceValue[] = [];

    if (type === SubZoneEnum.AigosthenaUpperCoast) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 25));
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
    //if (type === SubZoneEnum.DodonaDelphiOutskirts) {
    //rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ExtraSpeed1Hour, 1));
    //}
    if (type === SubZoneEnum.DodonaMountainOpening) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.ThrowingStone, 40));
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
    if (type === SubZoneEnum.AegeanSeaOpenSeas) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 1));
    }
    if (type === SubZoneEnum.AegeanSeaPropontis) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.SharkTeeth, 1));
    }
    if (type === SubZoneEnum.AegeanSeaRockyOverhang) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAmethystFragment, 1));
    }
    if (type === SubZoneEnum.BlackSeaStillWaters) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 600));
    }
    if (type === SubZoneEnum.BlackSeaStormySkies) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 1));
    }
    if (type === SubZoneEnum.BlackSeaAreonesosPassing) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Sorrel, 2));
    }
    if (type === SubZoneEnum.ColchisGroveOfAres) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.MetalScraps, 1));
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
    if (type === SubZoneEnum.ColchisHurriedRetreat2) {
      balladEnums.push(BalladEnum.Labors);
    }
    if (type === SubZoneEnum.ErytheiaGeryonsFarm) {
      balladEnums.push(BalladEnum.Olympus);
    }
    if (type === SubZoneEnum.WarForTheMountainThePeak) {
      balladEnums.push(BalladEnum.Labyrinth);
    }
    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter) {
      balladEnums.push(BalladEnum.Witch);
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
    if (type === SubZoneEnum.ColchisHurriedRetreat2) {
      zoneEnums.push(ZoneEnum.Nemea);
    }
    if (type === SubZoneEnum.NemeaLairOfTheLion) {
      zoneEnums.push(ZoneEnum.Lerna);
    }
    if (type === SubZoneEnum.LernaSpringOfAmymone) {
      zoneEnums.push(ZoneEnum.Stymphalia);
    }
    if (type === SubZoneEnum.StymphaliaLakeStymphalia) {
      zoneEnums.push(ZoneEnum.Erymanthus);
    }
    if (type === SubZoneEnum.ErymanthusSnowCappedPeaks) {
      zoneEnums.push(ZoneEnum.CoastOfCrete);
    }
    if (type === SubZoneEnum.CoastOfCreteAppleOrchards) {
      zoneEnums.push(ZoneEnum.GardenOfTheHesperides);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides) {
      zoneEnums.push(ZoneEnum.Erytheia);
    }
    if (type === SubZoneEnum.ErytheiaGeryonsFarm) {
      zoneEnums.push(ZoneEnum.MountOlympus);
    }
    if (type === SubZoneEnum.MountOlympusMytikasSummit) {
      zoneEnums.push(ZoneEnum.HuntForYarrow);
    }
    if (type === SubZoneEnum.HuntForYarrowYarrowField) {
      zoneEnums.push(ZoneEnum.WarForTheMountain);
    }
    if (type === SubZoneEnum.WarForTheMountainThePeak) {
      zoneEnums.push(ZoneEnum.Crete);
    }
    if (type === SubZoneEnum.CreteNorthernCretanCoast) {
      zoneEnums.push(ZoneEnum.Labyrinth);
    }    
    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter) {
      zoneEnums.push(ZoneEnum.Aiaia);
    }
    if (type === SubZoneEnum.AiaiaFlowerGarden) {
      zoneEnums.push(ZoneEnum.StraitsOfMessina);
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
    if (type === SubZoneEnum.ColchisHurriedRetreat1) {
      subZoneEnums.push(SubZoneEnum.ColchisHurriedRetreat2);
    }
    if (type === SubZoneEnum.ColchisHurriedRetreat2) {
      subZoneEnums.push(SubZoneEnum.NemeaCleonea);
      subZoneEnums.push(SubZoneEnum.NemeaCountryRoadsTwo);
    }
    if (type === SubZoneEnum.NemeaCountryRoadsTwo) {
      subZoneEnums.push(SubZoneEnum.NemeaRollingHills);
    }
    if (type === SubZoneEnum.NemeaRollingHills) {
      subZoneEnums.push(SubZoneEnum.NemeaFlatlands);
    }
    if (type === SubZoneEnum.NemeaFlatlands) {
      subZoneEnums.push(SubZoneEnum.NemeaLairOfTheLion);
    }
    if (type === SubZoneEnum.NemeaLairOfTheLion) {
      subZoneEnums.push(SubZoneEnum.LernaAroundTheInachus);
    }
    if (type === SubZoneEnum.LernaAroundTheInachus) {
      subZoneEnums.push(SubZoneEnum.LernaThickMarsh);
    }
    if (type === SubZoneEnum.LernaThickMarsh) {
      subZoneEnums.push(SubZoneEnum.LernaSwampySurroundings);
    }
    if (type === SubZoneEnum.LernaSwampySurroundings) {
      subZoneEnums.push(SubZoneEnum.LernaDarkenedThicket);
    }
    if (type === SubZoneEnum.LernaDarkenedThicket) {
      subZoneEnums.push(SubZoneEnum.LernaSpringOfAmymone);
    }
    if (type === SubZoneEnum.LernaSpringOfAmymone) {
      subZoneEnums.push(SubZoneEnum.StymphaliaTiryns);
      subZoneEnums.push(SubZoneEnum.StymphaliaArcadianWilderness);
    }
    if (type === SubZoneEnum.StymphaliaArcadianWilderness) {
      subZoneEnums.push(SubZoneEnum.StymphaliaAbandonedVillage);
    }
    if (type === SubZoneEnum.StymphaliaAbandonedVillage) {
      subZoneEnums.push(SubZoneEnum.StymphaliaSourceOfTheLadon);
    }
    if (type === SubZoneEnum.StymphaliaSourceOfTheLadon) {
      subZoneEnums.push(SubZoneEnum.StymphaliaLakeStymphalia);
    }
    if (type === SubZoneEnum.StymphaliaLakeStymphalia) {
      subZoneEnums.push(SubZoneEnum.ErymanthusLadonRiverbeds);
    }
    if (type === SubZoneEnum.ErymanthusLadonRiverbeds) {
      subZoneEnums.push(SubZoneEnum.ErymanthusGreatMassif);
    }
    if (type === SubZoneEnum.ErymanthusGreatMassif) {
      subZoneEnums.push(SubZoneEnum.ErymanthusCragInlet);
    }
    if (type === SubZoneEnum.ErymanthusCragInlet) {
      subZoneEnums.push(SubZoneEnum.ErymanthusMountainClimb);
    }
    if (type === SubZoneEnum.ErymanthusMountainClimb) {
      subZoneEnums.push(SubZoneEnum.ErymanthusSnowCappedPeaks);
    }
    if (type === SubZoneEnum.ErymanthusSnowCappedPeaks) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteDownThePineios);
    }
    if (type === SubZoneEnum.CoastOfCreteDownThePineios) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteElis);
      subZoneEnums.push(SubZoneEnum.CoastOfCreteSoutheasternIonianSeas);
    }
    if (type === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteCretanSeas);
    }
    if (type === SubZoneEnum.CoastOfCreteCretanSeas) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteCretanCoast);
    }
    if (type === SubZoneEnum.CoastOfCreteCretanCoast) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteVillageGardens);
    }
    if (type === SubZoneEnum.CoastOfCreteVillageGardens) {
      subZoneEnums.push(SubZoneEnum.CoastOfCreteAppleOrchards);
    }
    if (type === SubZoneEnum.CoastOfCreteAppleOrchards) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesDesertSands);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesDesertSands) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesSaharanDunes);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesSaharanDunes) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesHiddenOasis);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesHiddenOasis) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesMoroccanCoast);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesFertileFields);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesFertileFields) {
      subZoneEnums.push(SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides);
    }
    if (type === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides) {
      subZoneEnums.push(SubZoneEnum.ErytheiaLushValley);
    }
    if (type === SubZoneEnum.ErytheiaLushValley) {
      subZoneEnums.push(SubZoneEnum.ErytheiaWesternOceanWaters);
    }
    if (type === SubZoneEnum.ErytheiaWesternOceanWaters) {
      subZoneEnums.push(SubZoneEnum.ErytheiaCadiz);
      subZoneEnums.push(SubZoneEnum.ErytheiaPillarsOfHeracles);
    }
    if (type === SubZoneEnum.ErytheiaPillarsOfHeracles) {
      subZoneEnums.push(SubZoneEnum.ErytheiaIslandOfErytheia);
    }
    if (type === SubZoneEnum.ErytheiaIslandOfErytheia) {
      subZoneEnums.push(SubZoneEnum.ErytheiaGeryonsFarm);
    }
    if (type === SubZoneEnum.ErytheiaGeryonsFarm) {
      subZoneEnums.push(SubZoneEnum.MountOlympusUpTheMountain);
    }
    if (type === SubZoneEnum.MountOlympusUpTheMountain) {
      subZoneEnums.push(SubZoneEnum.MountOlympusMeanderingPath);
    }
    if (type === SubZoneEnum.MountOlympusMeanderingPath) {
      subZoneEnums.push(SubZoneEnum.MountOlympusCouloir);
    }
    if (type === SubZoneEnum.MountOlympusCouloir) {
      subZoneEnums.push(SubZoneEnum.MountOlympusMusesPlateau);
    }
    if (type === SubZoneEnum.MountOlympusMusesPlateau) {
      subZoneEnums.push(SubZoneEnum.MountOlympusPathwayToTheZenith);
    }
    if (type === SubZoneEnum.MountOlympusPathwayToTheZenith) {
      subZoneEnums.push(SubZoneEnum.MountOlympusMytikasSummit);
    }
    if (type === SubZoneEnum.MountOlympusMytikasSummit) {
      subZoneEnums.push(SubZoneEnum.MountOlympusOlympus);
    }
    if (type === SubZoneEnum.HuntForYarrowMountainHike) {
      subZoneEnums.push(SubZoneEnum.HuntForYarrowWoodlandTrail);
    }
    if (type === SubZoneEnum.HuntForYarrowWoodlandTrail) {
      subZoneEnums.push(SubZoneEnum.HuntForYarrowTrailFork1);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowTrailFork2);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowTrailFork3);
    }
    if (type === SubZoneEnum.HuntForYarrowTrailFork3) {
      subZoneEnums.push(SubZoneEnum.HuntForYarrowDenseGreenery1);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowDenseGreenery2);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowDenseGreenery3);
    }
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery2) {
      subZoneEnums.push(SubZoneEnum.HuntForYarrowPromisingPathway1);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowPromisingPathway2);
      subZoneEnums.push(SubZoneEnum.HuntForYarrowPromisingPathway3);
    }
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway1) {
      subZoneEnums.push(SubZoneEnum.HuntForYarrowYarrowField);
    }
    if (type === SubZoneEnum.HuntForYarrowYarrowField) {
      subZoneEnums.push(SubZoneEnum.WarForTheMountainBattleAtTheGates);
    }
    if (type === SubZoneEnum.WarForTheMountainBattleAtTheGates) {
      subZoneEnums.push(SubZoneEnum.WarForTheMountainOpenCourtyard);
    }
    if (type === SubZoneEnum.WarForTheMountainOpenCourtyard) {
      subZoneEnums.push(SubZoneEnum.WarForTheMountainStables);
    }
    if (type === SubZoneEnum.WarForTheMountainStables) {
      subZoneEnums.push(SubZoneEnum.WarForTheMountainPalaces);
    }
    if (type === SubZoneEnum.WarForTheMountainPalaces) {
      subZoneEnums.push(SubZoneEnum.WarForTheMountainThePeak);
    }
    if (type === SubZoneEnum.WarForTheMountainThePeak) {
      subZoneEnums.push(SubZoneEnum.CreteTravelsAtSea);
    }
    if (type === SubZoneEnum.CreteTravelsAtSea) {
      subZoneEnums.push(SubZoneEnum.CreteApproachingCrete);
    }
    if (type === SubZoneEnum.CreteApproachingCrete) {
      subZoneEnums.push(SubZoneEnum.CreteRapidWaters);
    }
    if (type === SubZoneEnum.CreteRapidWaters) {
      subZoneEnums.push(SubZoneEnum.CreteTurbulentCurrents);
    }
    if (type === SubZoneEnum.CreteTurbulentCurrents) {
      subZoneEnums.push(SubZoneEnum.CreteWhirlpool);
    }
    if (type === SubZoneEnum.CreteWhirlpool) {
      subZoneEnums.push(SubZoneEnum.CreteNorthernCretanCoast);
    }
    if (type === SubZoneEnum.CreteNorthernCretanCoast) {
      subZoneEnums.push(SubZoneEnum.CreteKnossos);
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLeftPath);
      subZoneEnums.push(SubZoneEnum.TheLabyrinthCenterPath);
      subZoneEnums.push(SubZoneEnum.TheLabyrinthRightPath);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftPath) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthColdHallway);
    }
    if (type === SubZoneEnum.TheLabyrinthColdHallway) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthRightCorner);
    }
    if (type === SubZoneEnum.TheLabyrinthRightCorner) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthSolidWall1);
    }
    if (type === SubZoneEnum.TheLabyrinthCenterPath) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthSlopedHallway);
    }
    if (type === SubZoneEnum.TheLabyrinthSlopedHallway) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLeftFork);
      subZoneEnums.push(SubZoneEnum.TheLabyrinthCenterFork);
      subZoneEnums.push(SubZoneEnum.TheLabyrinthRightFork);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftFork) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthRoundedPath);
    }
    if (type === SubZoneEnum.TheLabyrinthRoundedPath) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLeftTurn);
    }
    if (type === SubZoneEnum.TheLabyrinthLeftTurn) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthSolidWall3);
    }
    if (type === SubZoneEnum.TheLabyrinthCenterFork) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthDarkCorridor);
    }
    if (type === SubZoneEnum.TheLabyrinthDarkCorridor) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthOrnateEntryway);
    }
    if (type === SubZoneEnum.TheLabyrinthOrnateEntryway) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLabyrinthCenter);
    }
    if (type === SubZoneEnum.TheLabyrinthRightFork) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthSolidWall4);
    }
    if (type === SubZoneEnum.TheLabyrinthSolidWall4) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthCloakedStranger);
    }
    if (type === SubZoneEnum.TheLabyrinthRightPath) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLongPassage1);
    }
    if (type === SubZoneEnum.TheLabyrinthLongPassage1) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthLongPassage2);
    }
    if (type === SubZoneEnum.TheLabyrinthLongPassage2) {
      subZoneEnums.push(SubZoneEnum.TheLabyrinthSolidWall2);
    }    
    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter) {
      subZoneEnums.push(SubZoneEnum.AiaiaUnknownWaters);
    }
    if (type === SubZoneEnum.AiaiaUnknownWaters) {
      subZoneEnums.push(SubZoneEnum.AiaiaBreezyDays);
    }
    if (type === SubZoneEnum.AiaiaBreezyDays) {
      subZoneEnums.push(SubZoneEnum.AiaiaShoreline);
    }
    if (type === SubZoneEnum.AiaiaShoreline) {
      subZoneEnums.push(SubZoneEnum.AiaiaForestPath);
    }    
    if (type === SubZoneEnum.AiaiaForestPath) {
      subZoneEnums.push(SubZoneEnum.AiaiaCircesHome);
      subZoneEnums.push(SubZoneEnum.AiaiaOpenClearing)
    }    
    if (type === SubZoneEnum.AiaiaOpenClearing) {
      subZoneEnums.push(SubZoneEnum.AiaiaThornyPath);
    }
    if (type === SubZoneEnum.AiaiaThornyPath) {
      subZoneEnums.push(SubZoneEnum.AiaiaWildThicket);
    }
    if (type === SubZoneEnum.AiaiaWildThicket) {
      subZoneEnums.push(SubZoneEnum.AiaiaFlowerGarden);
    }    
    if (type === SubZoneEnum.AiaiaFlowerGarden) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits);
    }
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis);
    }
    if (type === SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaIntoTheVortex);
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaCavernOpening);
    }
    if (type === SubZoneEnum.StraitsOfMessinaCavernOpening) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaDarkTunnel);
    }
    if (type === SubZoneEnum.StraitsOfMessinaDarkTunnel) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaUnavoidablePath);
    }
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheVortex) {
      subZoneEnums.push(SubZoneEnum.StraitsOfMessinaMawOfTheMonster);
    }

    return subZoneEnums;
  }

  getShopOptions(subzoneType: SubZoneEnum, sidequestData: SidequestData, returnAllShopOptions: boolean = false, balladList?: Ballad[], optionalScenesViewed?: OptionalSceneEnum[], cloakedStrangerFound: boolean = false, gods?: God[]) {
    var shopOptions: ShopOption[] = [];
    var availableOptionsGeneral: ShopItem[] = [];
    var availableOptionsCrafter: ShopItem[] = [];
    var availableOptionsTraveler: ShopItem[] = [];
    var availableOptionsAugeanStables: ShopItem[] = [];

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

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.GoldenSword, SubZoneEnum.AegeanSeaIolcus));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DiamondHammer, SubZoneEnum.AegeanSeaIolcus));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.EagleEye, SubZoneEnum.AegeanSeaIolcus));

    if (subzoneType === SubZoneEnum.AegeanSeaIolcus) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Jewelcrafter, []));
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ScalyRing, SubZoneEnum.AegeanSeaSalmydessus));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SharkstoothNecklace, SubZoneEnum.AegeanSeaSalmydessus));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SharkstoothPendant, SubZoneEnum.AegeanSeaSalmydessus));

    if (subzoneType === SubZoneEnum.AegeanSeaSalmydessus) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FeatheredTunic, SubZoneEnum.BlackSeaMariandyna));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ShieldOfTheSea, SubZoneEnum.BlackSeaMariandyna));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SpikedShield, SubZoneEnum.BlackSeaMariandyna));

    if (subzoneType === SubZoneEnum.BlackSeaMariandyna) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedRuby, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedEmerald, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedOpal, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedAquamarine, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedAmethyst, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserCrackedTopaz, SubZoneEnum.ColchisCityCenter));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.QuadRing, SubZoneEnum.ColchisCityCenter));

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BlackLance, SubZoneEnum.ColchisCityCenter));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LiquidSaber, SubZoneEnum.ColchisCityCenter));

    if (subzoneType === SubZoneEnum.ColchisCityCenter) {
      shopOptions.push(new ShopOption(ShopTypeEnum.StoryScene24, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    if (subzoneType === SubZoneEnum.NemeaCleonea) {
      if (sidequestData.traderHuntLevel !== undefined)
        shopOptions.push(new ShopOption(ShopTypeEnum.Trader, this.getAvailableTraderOptions(sidequestData.traderHuntLevel)));
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.FurArmor, SubZoneEnum.StymphaliaTiryns));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ScaleArmor, SubZoneEnum.StymphaliaTiryns));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HideArmor, SubZoneEnum.StymphaliaTiryns));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HesperidianArmor, SubZoneEnum.StymphaliaTiryns));

    if (subzoneType === SubZoneEnum.StymphaliaTiryns) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
    }

    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeBeakNecklace, SubZoneEnum.CoastOfCreteElis));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.JaggedSword, SubZoneEnum.CoastOfCreteElis));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BirchBow, SubZoneEnum.CoastOfCreteElis));
    availableOptionsCrafter.push(this.shopItemGenerator.generateShopItem(ItemsEnum.RadiatingHammer, SubZoneEnum.CoastOfCreteElis));

    if (sidequestData.augeanStablesLevel === 0)
      availableOptionsAugeanStables.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AugeanStables1, SubZoneEnum.CoastOfCreteElis));
    if (sidequestData.augeanStablesLevel === 1)
      availableOptionsAugeanStables.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AugeanStables2, SubZoneEnum.CoastOfCreteElis));
    if (sidequestData.augeanStablesLevel === 2)
      availableOptionsAugeanStables.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AugeanStables3, SubZoneEnum.CoastOfCreteElis));

    if (subzoneType === SubZoneEnum.CoastOfCreteElis) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
      if (availableOptionsAugeanStables.length > 0)
        shopOptions.push(new ShopOption(ShopTypeEnum.AugeanStables, availableOptionsAugeanStables));
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SpiritShield, SubZoneEnum.ErytheiaCadiz));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LightShield, SubZoneEnum.ErytheiaCadiz));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BloodyNecklace, SubZoneEnum.ErytheiaCadiz));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SafeRing, SubZoneEnum.ErytheiaCadiz));

    if (subzoneType === SubZoneEnum.ErytheiaCadiz) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
    }

    if (subzoneType === SubZoneEnum.MountOlympusOlympus) {
      shopOptions.push(new ShopOption(ShopTypeEnum.StoryZeus, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.Hephaestus, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.OlympicFavor, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.Trials, []));

      return shopOptions;
    }

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedRuby, SubZoneEnum.CreteKnossos));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedAmethyst, SubZoneEnum.CreteKnossos));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedOpal, SubZoneEnum.CreteKnossos));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedEmerald, SubZoneEnum.CreteKnossos));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedTopaz, SubZoneEnum.CreteKnossos));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LesserFlawedAquamarine, SubZoneEnum.CreteKnossos));
    availableOptionsTraveler.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MonkClass, SubZoneEnum.CreteKnossos));
    availableOptionsTraveler.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ThaumaturgeClass, SubZoneEnum.CreteKnossos));

    if (subzoneType === SubZoneEnum.CreteKnossos) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Traveler, availableOptionsTraveler));
      shopOptions.push(new ShopOption(ShopTypeEnum.IslandOfNaxos, []));
    }

    if (cloakedStrangerFound && gods !== undefined) {
      if (gods.find(item => item.type === GodEnum.Athena)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AthenasSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Artemis)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ArtemissSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Hermes)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HermessSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Apollo)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ApollosSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Ares)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AressSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Hades)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HadessSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Nemesis)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.NemesissSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Dionysus)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DionysussSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Zeus)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ZeussSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Poseidon)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PoseidonsSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Aphrodite)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AphroditesSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
      if (gods.find(item => item.type === GodEnum.Hera)?.isAvailable)
        availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HerasSigil, SubZoneEnum.TheLabyrinthCloakedStranger));
    }
    
    if (subzoneType === SubZoneEnum.TheLabyrinthCloakedStranger) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
    }

    if (returnAllShopOptions) {
      shopOptions.push(new ShopOption(ShopTypeEnum.General, availableOptionsGeneral));
      shopOptions.push(new ShopOption(ShopTypeEnum.Crafter, availableOptionsCrafter));
      if (sidequestData.traderHuntLevel !== undefined && this.findSubzone(SubZoneEnum.NemeaCleonea, balladList)?.isAvailable)
        shopOptions.push(new ShopOption(ShopTypeEnum.Trader, this.getAvailableTraderOptions(sidequestData.traderHuntLevel)));

      if (this.findSubzone(SubZoneEnum.ElysiumColiseum, balladList)?.isAvailable)
        shopOptions.push(new ShopOption(ShopTypeEnum.Traveler, availableOptionsTraveler));

      if (optionalScenesViewed !== undefined && optionalScenesViewed.some(item => item === OptionalSceneEnum.ChthonicFavor))
        shopOptions.push(new ShopOption(ShopTypeEnum.ChthonicFavor, []));

      if (this.findSubzone(SubZoneEnum.MountOlympusOlympus, balladList)?.isAvailable)
        shopOptions.push(new ShopOption(ShopTypeEnum.OlympicFavor, []));

      if (availableOptionsAugeanStables.length > 0 && optionalScenesViewed !== undefined && optionalScenesViewed.some(item => item === OptionalSceneEnum.AugeanStables1))
        shopOptions.push(new ShopOption(ShopTypeEnum.AugeanStables, availableOptionsAugeanStables));
    }

    return shopOptions;
  }

  getAvailableTraderOptions(level: number) {
    var shopOptions: ShopItem[] = [];

    if (level >= 1) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Leather, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ThickLeather, SubZoneEnum.NemeaCleonea));
    }
    if (level >= 2) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BearHide, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BoarHide, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Honey, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.VialOfLakeLerna, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.VialOfTheBlackSea, SubZoneEnum.NemeaCleonea));
    }
    if (level >= 3) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.EssenceOfWater, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ToxicIchor, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.VialOfTheCretanSea, SubZoneEnum.NemeaCleonea));
    }
    if (level >= 4) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MetalNuggets, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.EssenceOfEarth, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.EssenceOfAir, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.MagicTreeBark, SubZoneEnum.NemeaCleonea));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.SerpentScale, SubZoneEnum.NemeaCleonea));
    }

    return shopOptions;
  }

  findSubzone(type: SubZoneEnum, balladList?: Ballad[]) {
    if (balladList === undefined)
      return undefined;

    var returnSubzone: SubZone | undefined;
    var subzoneFound = false;

    balladList.forEach(ballad => {
      if (!subzoneFound) {
        ballad.zones.forEach(zone => {
          if (!subzoneFound) {
            zone.subzones.forEach(subzone => {
              if (subzone.type === type) {
                returnSubzone = subzone;
                subzoneFound = true;
              }
            });
          }
        });
      }
    });

    return returnSubzone;
  }

  getAvailableOlympianRewardOptions(resources: ResourceValue[], isPatron: boolean = false, gods: God[]) {
    var shopOptions: ShopItem[] = [];

    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Nemesis, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Dionysus, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.OlympicCommendation, SubZoneEnum.MountOlympusOlympus));
    //shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DuoAbilityAccess, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.Ambrosia, SubZoneEnum.MountOlympusOlympus));

    if (resources.some(item => item.item === ItemsEnum.BlazingSunPendant) && !resources.some(item => item.item === ItemsEnum.BlazingSunPendantUnique))
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BlazingSunPendantUnique, SubZoneEnum.MountOlympusOlympus, isPatron));
    if (resources.some(item => item.item === ItemsEnum.DarkMoonPendant) && !resources.some(item => item.item === ItemsEnum.DarkMoonPendantUnique))
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DarkMoonPendantUnique, SubZoneEnum.MountOlympusOlympus, isPatron));
    if (resources.some(item => item.item === ItemsEnum.BlazingSunPendantUnique))
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BlazingSunPendantUniqueUpgrade, SubZoneEnum.MountOlympusOlympus));
    if (resources.some(item => item.item === ItemsEnum.DarkMoonPendantUnique))
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DarkMoonPendantUniqueUpgrade, SubZoneEnum.MountOlympusOlympus));

    if (gods.some(item => item.type === GodEnum.Athena && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AthenasScythe, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AthenasShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AthenasNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Artemis && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ArtemissBow, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ArtemissShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ArtemissNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Hermes && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HermessStaff, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HermessShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HermessNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Apollo && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ApollosBow, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ApollosShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ApollosNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Hades && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HadessBident, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HadessShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HadessNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Ares && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AressSpear, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AressShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AressNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Nemesis && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.NemesissSword, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.NemesissShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.NemesissNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Dionysus && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DionysussScepter, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DionysussShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.DionysussNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Zeus && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ZeussLightningBolts, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ZeussShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.ZeussNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Poseidon && item.isAvailable)) {
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PoseidonsTrident, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PoseidonsShield, SubZoneEnum.MountOlympusOlympus));
    shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.PoseidonsNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Aphrodite && item.isAvailable)) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AphroditesRoses, SubZoneEnum.MountOlympusOlympus));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AphroditesShield, SubZoneEnum.MountOlympusOlympus));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.AphroditesNecklace, SubZoneEnum.MountOlympusOlympus));
    }
    if (gods.some(item => item.type === GodEnum.Hera && item.isAvailable)) {
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HerasRod, SubZoneEnum.MountOlympusOlympus));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HerasShield, SubZoneEnum.MountOlympusOlympus));
      shopOptions.push(this.shopItemGenerator.generateShopItem(ItemsEnum.HerasNecklace, SubZoneEnum.MountOlympusOlympus));
    }

    return shopOptions;
  }
}
