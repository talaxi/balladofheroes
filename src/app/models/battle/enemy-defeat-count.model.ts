import { BestiaryEnum } from "../enums/bestiary-enum.model";

export class EnemyDefeatCount {
    bestiaryEnum: BestiaryEnum;
    defeatCount: number;

    constructor(type: BestiaryEnum, count: number) {
        this.bestiaryEnum = type;
        this.defeatCount = count;
    }
}
