import { StatusEffect } from "../battle/status-effect.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";

export class Ability {
    name: string;
    isAvailable: boolean;
    requiredLevel: number;
    currentCooldown: number;
    cooldown: number;
    damageMultiplier: number;
    dealsDirectDamage: boolean;
    elementalType: ElementalTypeEnum;
    userGainsStatusEffect: StatusEffect[];
    targetGainsStatusEffect: StatusEffect[];
    isAoe: boolean;
    isPassive: boolean;
    aoeModifier: number;
    count: number; //some abilities require a count
    maxCount: number;

    constructor() {
        this.damageMultiplier = 1;
        this.cooldown = 15;
        this.count = 0;
        this.maxCount = 0;

        this.userGainsStatusEffect = [];
        this.targetGainsStatusEffect = [];
    }
}
