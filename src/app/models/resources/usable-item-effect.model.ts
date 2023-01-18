import { Type } from "class-transformer";
import { StatusEffect } from "../battle/status-effect.model";
import { EffectTriggerEnum } from "../enums/effect-trigger-enum.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";

export class UsableItemEffect {
    dealsDamage: boolean;
    trueDamageAmount: number;   
    healAmount: number; 
    isAoe: boolean;
    trigger: EffectTriggerEnum;
    @Type(() => StatusEffect)
    userGainsStatusEffect: StatusEffect[];
    @Type(() => StatusEffect)
    targetGainsStatusEffect: StatusEffect[];
    chance: number; //for effects that don't land every time
    elementalProperty: ElementalTypeEnum;

    constructor() {
        this.userGainsStatusEffect = [];
        this.targetGainsStatusEffect = [];
        this.chance = 0;
        this.elementalProperty = ElementalTypeEnum.None;
    }
}
