import { StatusEffectEnum } from "../enums/status-effects-enum.model";

export class StatusEffect {
    type: StatusEffectEnum;

    constructor(type: StatusEffectEnum)
    {
        this.type = type;
    }
}
