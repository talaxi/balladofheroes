import { Type } from "class-transformer";
import { AltarInfo } from "../altar/altar-info.model";
import { Character } from "../character/character.model";
import { EnemyTeam } from "../character/enemy-team.model";
import { ColiseumTournamentEnum } from "../enums/coliseum-tournament-enum.model";
import { SceneTypeEnum } from "../enums/scene-type-enum.model";
import { ResourceValue } from "../resources/resource-value.model";
import { ColiseumTournament } from "./coliseum-tournament.model";
import { Trial } from "./trial.model";

export class Battle {    
    @Type(() => EnemyTeam)
    currentEnemies: EnemyTeam;
    
    //scene related variables
    atScene: boolean;
    sceneType: SceneTypeEnum;
    atTown: boolean;
    @Type(() => ResourceValue)
    chestRewards: ResourceValue[];
    selectedAltar: AltarInfo | undefined;
    battleDuration: number;

    activeTournament: ColiseumTournament;
    activeTrial: Trial;

    constructor() {
        this.currentEnemies = new EnemyTeam();
        this.atScene = false;
        this.atTown = false;
        this.sceneType = SceneTypeEnum.None;
        this.chestRewards = [];
        this.battleDuration = 0;
        this.activeTournament = new ColiseumTournament();
        this.activeTrial = new Trial();
    }
}
