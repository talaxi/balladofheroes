import { Type } from "class-transformer";
import { ElementalStats } from "./elemental-stats.model";

export class CharacterStats {
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    agility: number;
    luck: number; 
    resistance: number;

    //regen is every 5 seconds
    hpRegen: number;
    criticalMultiplier: number;
    @Type(() => ElementalStats)
    elementalDamageIncrease: ElementalStats;
    @Type(() => ElementalStats)
    elementalDamageResistance: ElementalStats;
    abilityCooldownReduction: number;
    autoAttackCooldownReduction: number;

    constructor(hp: number,strength: number, defense: number, agility: number, luck: number, resistance: number) {
        this.maxHp = hp;
        this.currentHp = hp;        
        this.attack = strength;
        this.defense = defense;
        this.agility = agility;
        this.luck = luck;
        this.resistance = resistance;

        this.hpRegen = 0;
        this.criticalMultiplier = 0;
        this.elementalDamageIncrease = new ElementalStats();
        this.elementalDamageResistance = new ElementalStats();
        this.abilityCooldownReduction = 0; 
        this.autoAttackCooldownReduction = 0; 
    }

    makeCopy(excludeCurrentHp: boolean = true) {
        var currentHp = this.currentHp;
        var copy = new CharacterStats(this.maxHp,this.attack, this.defense, this.agility, this.luck, this.resistance);

        if (excludeCurrentHp)
            copy.currentHp = currentHp;

        return copy;
    }

    getHpPercent(asPercent: boolean = false) {
        if (asPercent)
            return (this.currentHp / this.maxHp) * 100;
        else
            return this.currentHp / this.maxHp;
    }
}
