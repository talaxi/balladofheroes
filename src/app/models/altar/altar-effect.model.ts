import { AltarEffectsEnum } from "../enums/altar-effects-enum.model";
import { GodEnum } from "../enums/god-enum.model";

export class AltarEffect {
    type: AltarEffectsEnum;
    duration: number;
    totalDuration: number;
    effectiveness: number;
    stacks: boolean;
    stackCount: number;
    associatedGod: GodEnum;
    slotNumber: number;
    tickFrequency: number;
    tickTimer: number;
    effectOnExpiration: boolean = false;

    constructor() {
        this.tickTimer = 0;
        this.tickFrequency = 0;
    }
}
