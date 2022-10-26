import { Type } from "class-transformer";
import { GodEnum } from "../enums/god-enum.model";
import { CharacterStats } from "./character-stats.model";

export class God {
    name: string;
    type: GodEnum;
    level: number;
    @Type(() => CharacterStats)
    statGain: CharacterStats;
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;


    constructor(type: GodEnum) {
        this.type = type;
        this.level = 1;
        this.statGain = new CharacterStats(0, 0, 0, 0, 0, 0, 0, 0,);
    }
}
