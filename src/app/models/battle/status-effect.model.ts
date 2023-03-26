import { Character } from "../character/character.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { dotTypeEnum } from "../enums/damage-over-time-type-enum.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";
import { StatusEffectEnum } from "../enums/status-effects-enum.model";

export class StatusEffect {
    type: StatusEffectEnum;
    duration: number;
    effectiveness: number;
    isPermanent: boolean; //no duration
    persistsDeath: boolean; //persists after dieing
    isInstant: boolean;    
    isAoe: boolean;
    refreshes: boolean; //true if reapplying refreshes the current instance, false if it creates a new one
    count: number; //some status effects require a count
    maxCount: number;
    isPositive: boolean;
    caster: string;
    casterEnum: CharacterEnum;
    threshold: number;
    effectStacks: boolean;
    stackCount: number;
    triggersEvery: number; //for effects that trigger every X seconds
    targetsAllies: boolean;

    //for DoTs
    associatedAbilityName: string;
    tickFrequency: number;
    tickTimer: number;
    //basedOnOriginalDamage: boolean; //is the DoT based on original damage dealt or is it standalone?
    dotType: dotTypeEnum;
    element: ElementalTypeEnum;

    constructor(type: StatusEffectEnum, persistsDeath?: boolean) {
        this.type = type;

        if (persistsDeath !== undefined)
        this.persistsDeath = persistsDeath;

        this.tickTimer = 0;
        this.tickFrequency = 0;
        this.duration = 0;
        this.count = 0;
        this.maxCount = 0;
        this.dotType = dotTypeEnum.BasedOnDamage;
        this.element = ElementalTypeEnum.None;
        this.casterEnum = CharacterEnum.None;
        this.effectStacks = false;
        this.stackCount = 1;
        this.triggersEvery = 0;
        this.targetsAllies = false;
    }

    makeCopy() {
        var copy = new StatusEffect(this.type);

        copy.duration = this.duration;
        copy.effectiveness = this.effectiveness;
        copy.isPermanent = this.isPermanent;
        copy.persistsDeath = this.persistsDeath;
        copy.isInstant = this.isInstant;
        copy.isPositive = this.isPositive;
        copy.isAoe = this.isAoe;
        copy.count = this.count;
        copy.maxCount = this.maxCount;
        copy.caster = this.caster;
        copy.refreshes = this.refreshes;
        copy.effectStacks = this.effectStacks;
        copy.casterEnum = this.casterEnum;
        copy.threshold = this.threshold;
        copy.targetsAllies = this.targetsAllies;

        copy.associatedAbilityName = this.associatedAbilityName;
        copy.tickFrequency = this.tickFrequency;
        copy.tickTimer = this.tickTimer;
        copy.dotType = this.dotType;
        copy.element = this.element;
        copy.triggersEvery = this.triggersEvery;

        return copy;
    }
}
