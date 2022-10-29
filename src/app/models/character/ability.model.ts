import { StatusEffect } from "../battle/status-effect.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";

export class Ability {
    name: string;
    isSelected: boolean;
    isAvailable: boolean;
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

    constructor() {
        this.damageMultiplier = 1;
        this.cooldown = 15;

        this.userGainsStatusEffect = [];
        this.targetGainsStatusEffect = [];
    }
}
