import { StatusEffectEnum } from "../enums/status-effects-enum.model";

export class StatusEffect {
    type: StatusEffectEnum;
    duration: number;
    effectiveness: number;
    isPermanent: boolean;
    isInstant: boolean;    

    //for DoTs
    associatedAbilityName: string;
    tickFrequency: number;
    tickTimer: number;

    constructor(type: StatusEffectEnum) {
        this.type = type;

        this.tickTimer = 0;
        this.tickFrequency = 0;
        this.duration = 0;
    }

    makeCopy() {
        var copy = new StatusEffect(this.type);

        copy.duration = this.duration;
        copy.effectiveness = this.effectiveness;
        copy.isPermanent = this.isPermanent;
        copy.isInstant = this.isInstant;

        copy.associatedAbilityName = this.associatedAbilityName;
        copy.tickFrequency = this.tickFrequency;
        copy.tickTimer = this.tickTimer;

        return copy;
    }
}
