import { ColiseumTournamentEnum } from "../enums/coliseum-tournament-enum.model";

export class ColiseumDefeatCount {
    type: ColiseumTournamentEnum;
    defeatCount: number;
    quickVictoryCompleted: boolean;

    constructor(type: ColiseumTournamentEnum, count: number) {
        this.type = type;
        this.defeatCount = count;
        this.quickVictoryCompleted = false;
    }
}
