import { Type } from "class-transformer";
import { StatusEffect } from "../battle/status-effect.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";
import { TargetEnum } from "../enums/target-enum.model";

export class Ability {
    name: string;
    isAvailable: boolean;
    requiredLevel: number;
    abilitySequence: number;
    currentCooldown: number;
    targetType: TargetEnum;
    cooldown: number;
    effectiveness: number; 
    secondaryEffectiveness: number; //for multi part abilities
    dealsDirectDamage: boolean;    
    heals: boolean;
    targetsAllies: boolean;
    elementalType: ElementalTypeEnum;
    @Type(() => StatusEffect)
    userEffect: StatusEffect[];
    @Type(() => StatusEffect)
    targetEffect: StatusEffect[];
    isAoe: boolean;
    isPassive: boolean;
    isActivatable: boolean;
    aoeModifier: number;
    count: number; //some abilities require a count
    maxCount: number;
    threshold: number; //some abilities are triggered by a specific threshold
    autoMode: boolean; //users can swap between auto mode and manual mode
    manuallyTriggered: boolean;
    abilityUpgradeLevel: number;
    isAbilityPermanent: boolean;

    constructor() {
        this.effectiveness = 1;
        this.abilityUpgradeLevel = 0;
        this.secondaryEffectiveness = 1;
        this.cooldown = 15;
        this.count = 0;
        this.maxCount = 0;
        this.abilitySequence = 1;
        this.threshold = 0;
        this.targetsAllies = false;
        this.isActivatable = true;
        this.elementalType = ElementalTypeEnum.None;

        this.userEffect = [];
        this.targetEffect = [];
        this.autoMode = true;
        this.manuallyTriggered = false;

        this.isAbilityPermanent = false;
    }
}
