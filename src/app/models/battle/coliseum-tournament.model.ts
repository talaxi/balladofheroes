import { Type } from "class-transformer";
import { ColiseumTournamentEnum } from "../enums/coliseum-tournament-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class ColiseumTournament {
    type: ColiseumTournamentEnum;
    tournamentTimer: number;
    tournamentTimerLength: number;
    currentRound: number;
    maxRounds: number;
    @Type(() => ResourceValue)
    bonusResources: ResourceValue[];

    constructor() {
        this.type = ColiseumTournamentEnum.None;
        this.bonusResources = [];
    }
}
