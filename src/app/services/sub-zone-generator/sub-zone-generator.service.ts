import { Injectable } from '@angular/core';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';

@Injectable({
  providedIn: 'root'
})
export class SubZoneGeneratorService {

  constructor(private enemyGeneratorService: EnemyGeneratorService) { }

  generateSubZone(type: SubZoneEnum)
  {
    var subZone = new SubZone(type);    

    subZone.battleOptions = this.generateBattleOptions(type);

    return subZone;
  }

  generateBattleOptions(type: SubZoneEnum) {
    var battleOptions: EnemyTeam[] = [];
    if (type === SubZoneEnum.AigosthenaUpperCoast)
    {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam);

      var enemyTeam2: EnemyTeam = new EnemyTeam();
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam2.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam2);

      var enemyTeam3: EnemyTeam = new EnemyTeam();
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam3.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam3);

      var enemyTeam4: EnemyTeam = new EnemyTeam();
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      enemyTeam4.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam4);
    }
    if (type === SubZoneEnum.AigosthenaBay)
    {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Crustacean));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));      
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WaterSerpent));
      battleOptions.push(enemyTeam);
    }

    battleOptions.forEach(enemyTeam => {      
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1)
        {
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
}
