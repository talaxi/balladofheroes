import { Type } from "class-transformer";
import { StatusEffect } from "../battle/status-effect.model";

export class UsableItemEffect {
    dealsDamage: boolean;
    trueDamageAmount: number;   
    healAmount: number; 
    @Type(() => StatusEffect)
    userGainsStatusEffect: StatusEffect[];
    @Type(() => StatusEffect)
    targetGainsStatusEffect: StatusEffect[];

    constructor() {
        this.userGainsStatusEffect = [];
        this.targetGainsStatusEffect = [];
    }
}
