import { TrialEnum } from "../enums/trial-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { ZodiacEnum } from "../enums/zodiac-enum.model";

export class TrialDefeatCount {
    type: TrialEnum;
    godType: GodEnum;
    zodiacType: ZodiacEnum;
    count: number;        
    highestDps: number;
    highestXps: number;
    highestGodLevelTotal: number;
    highestHp: number; //need to keep track of god's hp for time fragments

    constructor(type: TrialEnum, count: number, godType?: GodEnum, zodiacType?: ZodiacEnum) {
        this.type = type;
        this.count = count;
        this.highestXps = 0;
        this.highestDps = 0;
        this.highestHp = 0;
        if (godType !== undefined)
            this.godType = godType;
        if (zodiacType !== undefined)
            this.zodiacType = zodiacType;
    }
}
