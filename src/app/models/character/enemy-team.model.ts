import { Type } from "class-transformer";
import { Character } from "./character.model";
import { Enemy } from "./enemy.model";

export class EnemyTeam {
    isBossFight: boolean;
    isDoubleBossFight: boolean;
    @Type(() => Enemy)
    enemyList: Enemy[];

    constructor() {
        this.enemyList = [];
    }
}
