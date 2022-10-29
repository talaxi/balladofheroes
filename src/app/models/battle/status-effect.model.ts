import { StatusEffectEnum } from "../enums/status-effects-enum.model";

export class StatusEffect {
    type: StatusEffectEnum;
    duration: number;
    effectiveness: number;
    isPermanent: boolean;
    isInstant: boolean;

    constructor(type: StatusEffectEnum) {
        this.type = type;
    }

    makeCopy() {
        var copy = new StatusEffect(this.type);

        copy.duration = this.duration;
        copy.effectiveness = this.effectiveness;
        copy.isPermanent = this.isPermanent;
        copy.isInstant = this.isInstant;

        return copy;
    }
}
