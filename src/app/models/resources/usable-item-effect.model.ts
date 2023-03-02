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
    userEffect: StatusEffect[];
    @Type(() => StatusEffect)
    targetEffect: StatusEffect[];
    chance: number; //for effects that don't land every time
    elementalProperty: ElementalTypeEnum;    
    triggersEveryCount: number;

    constructor() {
        this.userEffect = [];
        this.targetEffect = [];
        this.chance = 0;
        this.triggersEveryCount = 0;
        this.elementalProperty = ElementalTypeEnum.None;
    }
}
