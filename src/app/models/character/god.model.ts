import { Type } from "class-transformer";
import { GodEnum } from "../enums/god-enum.model";
import { Ability } from "./ability.model";
import { CharacterStats } from "./character-stats.model";

export class God {
    name: string;
    type: GodEnum;
    level: number;
    @Type(() => CharacterStats)
    statGain: CharacterStats;
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;
    abilityList: Ability[];
    exp: number;
    expToNextLevel: number;

    constructor(type: GodEnum) {
        this.type = type;
        this.level = 1;
        this.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.permanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.abilityList = [];
        this.exp = 0;
        this.expToNextLevel = 200;
    }
}
