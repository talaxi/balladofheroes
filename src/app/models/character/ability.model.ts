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
    isPermanent: boolean;
    damageModifierRange: number; 

    constructor(setToZero: boolean = false) {
        this.effectiveness = setToZero ? 0 : 1;
        this.abilityUpgradeLevel = 0;
        this.secondaryEffectiveness = setToZero ? 0 : 1;
        this.cooldown = setToZero ? 0 : 15;
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

        this.isPermanent = false;
    }

    makeCopy() {
        var copy = new Ability();
        copy.name = this.name;
        copy.isAvailable = this.isAvailable;
        copy.requiredLevel = this.requiredLevel;
        copy.abilitySequence = this.abilitySequence;
        copy.currentCooldown = this.currentCooldown;
        copy.targetType = this.targetType;
        copy.cooldown = this.cooldown;
        copy.effectiveness = this.effectiveness;
        copy.secondaryEffectiveness = this.secondaryEffectiveness;
        copy.dealsDirectDamage = this.dealsDirectDamage;
        copy.heals = this.heals;
        copy.targetsAllies = this.targetsAllies;
        copy.elementalType = this.elementalType;        
        copy.userEffect = [];
        this.userEffect.forEach(effect => {
            copy.userEffect.push(effect.makeCopy());
        });
        copy.targetEffect = [];
        this.targetEffect.forEach(effect => {
            copy.targetEffect.push(effect.makeCopy());
        });
        copy.isAoe = this.isAoe;
        copy.isPassive = this.isPassive;
        copy.isActivatable = this.isActivatable;
        copy.aoeModifier = this.aoeModifier;
        copy.count = this.count;
        copy.maxCount = this.maxCount;
        copy.threshold = this.threshold;
        copy.autoMode = this.autoMode;
        copy.manuallyTriggered = this.manuallyTriggered;
        copy.abilityUpgradeLevel = this.abilityUpgradeLevel;
        copy.isPermanent = this.isPermanent;
        copy.damageModifierRange = this.damageModifierRange;

        return copy;
    }
}
