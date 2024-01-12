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
    highestLevelReached: number;
    @Type(() => PrimaryStats)
    gainModifiers: PrimaryStats;
    @Type(() => CharacterStats)
    statGain: CharacterStats;
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;
    @Type(() => CharacterStats)
    partyPermanentStatGain: CharacterStats;    
    @Type(() => CharacterStats)
    partyPermanentStatMultiplier: CharacterStats;
    @Type(() => Ability)
    abilityList: Ability[];
    @Type(() => Ability)
    permanentAbilityUpgrades: Ability[];
    exp: number;
    expToNextLevel: number;
    isAvailable: boolean;
    lastStatGain: CharacterStatEnum;
    statGainCount = 0;
    permanentStat1GainCount: [number, number][]; //permanent god primary stat -- Levels 50, 150, etc
    permanentStat2GainCount: [number, number][]; //permanent god secondary stat -- Levels 100, 200, etc
    permanentStat3GainCount: [number, number][]; //permanent party primary stat -- Levels 550, 650, etc
    permanentStat4GainCount: [number, number][]; //permanent party xp boost -- Levels 600, 700, etc
    permanentStat5GainCount: [number, number][]; //permanent party xp boost 2 -- Levels 2050, 2150, etc
    permanentDuoAbilityGainCount: [number, number][]; //duo ability boost -- Levels 2100, 2200, etc
    permanentStat6GainCount: [number, number][]; //permanent god primary stat multiplier -- Levels 3050, 3150, etc
    permanentStat7GainCount: [number, number][]; //permanent party primary stat multiplier -- Levels 3100, 3200, etc
    permanentStat8GainCount: [number, number][]; //permanent party super stat boost -- Levels 4050, 4100, 4150, etc
    permanentAbility1GainCount: [number, number][];
    permanentPassiveGainCount: [number, number][];
    permanentAbility2GainCount: [number, number][];
    permanentAbility3GainCount: [number, number][];
    affinityLevel: number;
    affinityExp: number;
    affinityExpToNextLevel: number;
    displayOrder: number;
    duoAbilityAccess: boolean;

    constructor(type: GodEnum) {
        this.type = type;
        this.level = 1;
        this.highestLevelReached = 1;
        this.gainModifiers = this.getGainModifier(type);
        this.statGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.permanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.partyPermanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        //this.permanentStatMultiplier = new CharacterStats(1, 1, 1, 1, 1, 1);
        this.partyPermanentStatMultiplier = new CharacterStats(1, 1, 1, 1, 1, 1);
        this.abilityList = [];
        this.exp = 0;
        this.expToNextLevel = 200;
        this.isAvailable = false;
        this.lastStatGain = CharacterStatEnum.Resistance;
        this.permanentStat1GainCount = [];
        this.permanentStat2GainCount = [];
        this.permanentStat3GainCount = [];
        this.permanentStat4GainCount = [];
        this.permanentStat5GainCount = [];
        this.permanentStat6GainCount = [];
        this.permanentStat7GainCount = [];
        this.permanentStat8GainCount = [];
        this.permanentAbility1GainCount = [];
        this.permanentPassiveGainCount = [];
        this.permanentAbility2GainCount = [];
        this.permanentAbility3GainCount = [];
        this.permanentDuoAbilityGainCount = [];
        this.permanentAbilityUpgrades = [];

        this.affinityLevel = 0;
        this.affinityExp = 0;
        this.affinityExpToNextLevel = 5;
        this.displayOrder = 0;
        this.duoAbilityAccess = false;
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
            return new PrimaryStats(1.4, 1.0325, .725, .9, 1.15, .8775); //6.085 total
        else if (type === GodEnum.Hades)
            return new PrimaryStats(.925, 1.03, 1, .6, 1.25, 1.2); //6.005 total
        else if (type === GodEnum.Dionysus) 
            return new PrimaryStats(.9, .94, 1.3, 1.2, .85, 1.05); //6.24 total
        else if (type === GodEnum.Nemesis) 
            return new PrimaryStats(1.15, 1.01, 1.25, .8, .7, 1.25); //6.16 total
        else if (type === GodEnum.Zeus) 
            return new PrimaryStats(.85, 1.1, 1.15, 1.05, 1.05, .7); //5.9 total
        else if (type === GodEnum.Poseidon)
            return new PrimaryStats(.95, .95, 1.075, .95, 1.25, 1.05); //6.225 total
            else if (type === GodEnum.Aphrodite)
            return new PrimaryStats(1.2, .975, .925, 1.05, 1, 1.025); //6.175 total
            else if (type === GodEnum.Hera)
            return new PrimaryStats(.875, 1.075, .825, .975, 1.05, 1.15); //5.95 total

        return new PrimaryStats(1, 1, 1, 1, 1, 1);
    }
}
