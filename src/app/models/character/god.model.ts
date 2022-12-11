import { Type } from "class-transformer";
import { CharacterStatEnum } from "../enums/character-stat-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { Ability } from "./ability.model";
import { CharacterStats } from "./character-stats.model";

export class God {
    name: string;
    type: GodEnum;
    level: number;
    @Type(() => CharacterStats)
    gainModifiers: CharacterStats;
    @Type(() => CharacterStats)
    statGain: CharacterStats;
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;
    abilityList: Ability[];
    exp: number;
    expToNextLevel: number;
    isAvailable: boolean;
    lastStatGain: CharacterStatEnum;
    statGainCount = 0;

    constructor(type: GodEnum) {
        this.type = type;
        this.level = 1;
        this.gainModifiers = this.getGainModifier(type);
        this.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.permanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.abilityList = [];
        this.exp = 0;
        this.expToNextLevel = 200;
        this.isAvailable = false;
        this.lastStatGain = CharacterStatEnum.Resistance;
    }

    private getGainModifier(type: GodEnum) {
        if (type === GodEnum.Athena)
            return new CharacterStats(1.1, 1.05, 1.4, .8, .75, 1); //6.1 total
        else if (type === GodEnum.Artemis)
            return new CharacterStats(.8, .985, .75, 1.2, 1.5, 1.1); //6.2 total
        else if (type === GodEnum.Hermes)
            return new CharacterStats(.7, 1.07, .9, 1.5, 1.1, .6); //5.87 total
        else if (type === GodEnum.Apollo)
            return new CharacterStats(1.1, .9, .8, .85, 1.175, 1.45); //6.285 total
        else if (type === GodEnum.Zeus)
            return new CharacterStats(1.35, 1.1, .8, .55, 1.15, .95); //5.9 total
        else if (type === GodEnum.Ares)
            return new CharacterStats(.85, 1.075, .7, 1.2, 1.2, .85); //5.875 total
        else if (type === GodEnum.Poseidon)
            return new CharacterStats(0, 1.1, 0, 0, 0, 0);

        return new CharacterStats(0, 0, 0, 0, 0, 0);
    }
}
