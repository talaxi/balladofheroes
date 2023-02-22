import { Type } from "class-transformer";
import { ColiseumTournamentEnum } from "../enums/coliseum-tournament-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class ColiseumTournament {
    type: ColiseumTournamentEnum;
    tournamentTimer: number;
    tournamentTimerLength: number;
    quickVictoryThreshold: number;
    currentRound: number;
    maxRounds: number;
    @Type(() => ResourceValue)
    completionReward: ResourceValue[];
    @Type(() => ResourceValue)
    quickCompletionReward: ResourceValue[];

    constructor() {
        this.type = ColiseumTournamentEnum.None;
        this.completionReward = [];
        this.quickCompletionReward = [];
    }
}
