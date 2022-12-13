import { Type } from "class-transformer";
import { Character } from "../character/character.model";
import { EnemyTeam } from "../character/enemy-team.model";
import { SceneTypeEnum } from "../enums/scene-type-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class Battle {    
    @Type(() => EnemyTeam)
    currentEnemies: EnemyTeam;
    
    //scene related variables
    atScene: boolean;
    sceneType: SceneTypeEnum;
    atTown: boolean;
    @Type(() => ResourceValue)
    chestRewards: ResourceValue[];

    constructor() {
        this.currentEnemies = new EnemyTeam();
        this.atScene = false;
        this.atTown = false;
        this.sceneType = SceneTypeEnum.None;
        this.chestRewards = [];
    }
}
