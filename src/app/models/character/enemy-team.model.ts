import { Character } from "./character.model";
import { Enemy } from "./enemy.model";

export class EnemyTeam {
    isBossFight: boolean;
    enemyList: Enemy[];

    constructor() {
        this.enemyList = [];
    }
}
