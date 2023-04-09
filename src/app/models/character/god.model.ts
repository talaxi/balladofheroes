import { Type } from "class-transformer";
import { CharacterStatEnum } from "../enums/character-stat-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { Ability } from "./ability.model";
import { CharacterStats } from "./character-stats.model";
import { PrimaryStats } from "./primary-stats.model";

export class God {
    name: string;
    type: GodEnum;
    level: number;
    @Type(() => PrimaryStats)
    gainModifiers: PrimaryStats;
    @Type(() => CharacterStats)
    statGain: CharacterStats;
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;
    @Type(() => Ability)
    abilityList: Ability[];
    exp: number;
    expToNextLevel: number;
    isAvailable: boolean;
    lastStatGain: CharacterStatEnum;
    statGainCount = 0;
    permanentStat1GainCount: [number, number][];
    permanentStat2GainCount: [number, number][];
    affinityLevel: number;
    affinityExp: number;
    affinityExpToNextLevel: number;
    displayOrder: number;

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
        this.permanentStat1GainCount = [];
        this.permanentStat2GainCount = [];

        this.affinityLevel = 0;
        this.affinityExp = 0;
        this.affinityExpToNextLevel = 5;
        this.displayOrder = 0;
    }

    private getGainModifier(type: GodEnum) {
        if (type === GodEnum.Athena)
            return new PrimaryStats(1.1, 1.05, 1.4, .8, .75, 1); //6.1 total
        else if (type === GodEnum.Artemis)
            return new PrimaryStats(.8, .985, .75, 1.2, 1.5, 1.1); //6.2 total
        else if (type === GodEnum.Hermes)
            return new PrimaryStats(.7, 1.07, .9, 1.5, 1.1, .6); //5.87 total
        else if (type === GodEnum.Apollo)
            return new PrimaryStats(1.075, .9, .8, .85, 1.175, 1.45); //6.26 total
        else if (type === GodEnum.Ares)
            return new PrimaryStats(1.4, 1.03, .7, .9, 1.25, .85); //6.13 total
        else if (type === GodEnum.Hades)
            return new PrimaryStats(1.075, 1.025, 1.025, .6, 1.3, 1.15); //6.175 total
        else if (type === GodEnum.Dionysus) //STILL TODO
            return new PrimaryStats(1.075, 1.025, 1.025, .6, 1.3, 1.15); //6.175 total
        else if (type === GodEnum.Nemesis) //STILL TODO
            return new PrimaryStats(1.075, 1.025, 1.025, .6, 1.3, 1.15); //6.175 total
        else if (type === GodEnum.Zeus) //STILL TODO
            return new PrimaryStats(.85, 1.1, 1.15, 1.05, 1.05, .7); //5.9 total
        else if (type === GodEnum.Poseidon) //STILL TODO
            return new PrimaryStats(.95, .95, 1.075, .95, 1.25, 1.05); //6.225 total

        return new PrimaryStats(1, 1, 1, 1, 1, 1);
    }
}
