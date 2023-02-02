import { AltarEffectsEnum } from "../enums/altar-effects-enum.model";

export class AltarEffect {
    type: AltarEffectsEnum;
    duration: number;
    effectiveness: number;
    stacks: boolean;
    stackCount: number;

    constructor() {
        
    }
}
