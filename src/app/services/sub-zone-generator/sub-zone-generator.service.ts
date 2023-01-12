import { Injectable } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
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
import { BalladService } from '../ballad/ballad.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
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
      enemyTeam6.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lamia));
      battleOptions.push(enemyTeam6);
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

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
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
    if (type === SubZoneEnum.AigosthenaWesternWoodlands) {
      rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.HealingHerb, 1));
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

    return rewards;
  }

  getBalladUnlocks(type: SubZoneEnum) {
    var balladEnums: BalladEnum[] = [];

    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods) {
      balladEnums.push(BalladEnum.Gorgon);
    }
    if (type === SubZoneEnum.LibyaIsleCenter) {
      balladEnums.push(BalladEnum.Labors);
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

    return subZoneEnums;
  }

  getShopOptions(subzoneType: SubZoneEnum) {
    var shopOptions: ShopOption[] = [];
    var availableOptionsGeneral: ShopItem[] = [];
    var availableOptionsCrafter: ShopItem[] = [];

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.LinenArmor, SubZoneEnum.DodonaDelphi));
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

    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.IronArmor, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeArmor, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeSword, SubZoneEnum.DodonaArta));
    availableOptionsGeneral.push(this.shopItemGenerator.generateShopItem(ItemsEnum.BronzeHammer, SubZoneEnum.DodonaArta));
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

    if (subzoneType === SubZoneEnum.AsphodelHallOfTheDead) {
      shopOptions.push(new ShopOption(ShopTypeEnum.Story, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.Alchemist, []));
      shopOptions.push(new ShopOption(ShopTypeEnum.ChthonicFavor, []));

      return shopOptions;
    }

    return shopOptions;
  }
}
