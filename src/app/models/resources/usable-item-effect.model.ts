import { Type } from "class-transformer";
import { StatusEffect } from "../battle/status-effect.model";
import { EffectTriggerEnum } from "../enums/effect-trigger-enum.model";

export class UsableItemEffect {
    dealsDamage: boolean;
    trueDamageAmount: number;   
    healAmount: number; 
    trigger: EffectTriggerEnum;
    @Type(() => StatusEffect)
    userGainsStatusEffect: StatusEffect[];
    @Type(() => StatusEffect)
    targetGainsStatusEffect: StatusEffect[];
    chance: number; //for effects that don't land every time

    constructor() {
        this.userGainsStatusEffect = [];
        this.targetGainsStatusEffect = [];
        this.chance = 0;
    }
}
