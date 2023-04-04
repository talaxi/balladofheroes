import { BestiaryEnum } from "../enums/bestiary-enum.model";

export class EnemyDefeatCount {
    bestiaryEnum: BestiaryEnum;
    count: number;

    constructor(type: BestiaryEnum, count: number) {
        this.bestiaryEnum = type;
        this.count = count;
    }
}
