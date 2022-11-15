import { Character } from "../character/character.model";
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

    //for DoTs
    associatedAbilityName: string;
    tickFrequency: number;
    tickTimer: number;

    constructor(type: StatusEffectEnum, persistsDeath?: boolean) {
        this.type = type;

        if (persistsDeath !== undefined)
        this.persistsDeath = persistsDeath;

        this.tickTimer = 0;
        this.tickFrequency = 0;
        this.duration = 0;
        this.count = 0;
        this.maxCount = 0;
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
        
        copy.associatedAbilityName = this.associatedAbilityName;
        copy.tickFrequency = this.tickFrequency;
        copy.tickTimer = this.tickTimer;

        return copy;
    }
}
