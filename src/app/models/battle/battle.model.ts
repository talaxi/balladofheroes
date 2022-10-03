import { Type } from "class-transformer";
import { Character } from "../character/character.model";
import { EnemyTeam } from "../character/enemy-team.model";

export class Battle {    
    @Type(() => EnemyTeam)
    currentEnemies: EnemyTeam;

    constructor() {
        this.currentEnemies = new EnemyTeam();
    }
}
