export class ChthonicPowers {
    attackBoostLevel: number;
    defenseBoostLevel: number;
    maxHpBoostLevel: number;
    agilityBoostLevel: number;
    luckBoostLevel: number;
    resistanceBoostLevel: number;

    constructor() {
        this.attackBoostLevel = 0;
        this.defenseBoostLevel = 0;
        this.maxHpBoostLevel = 0;
        this.agilityBoostLevel = 0;
        this.luckBoostLevel = 0;
        this.resistanceBoostLevel = 0;
    }

    getAttackBoostPercent() {
        return this.attackBoostLevel * .1;
    }

    getDefenseBoostPercent() {        
        return this.defenseBoostLevel * .1;
    }

    getMaxHpBoostPercent() {        
        return this.maxHpBoostLevel * .1;
    }

    getAgilityBoostPercent() {        
        return this.agilityBoostLevel * .1;
    }

    getLuckBoostPercent() {        
        return this.luckBoostLevel * .1;
    }

    getResistanceBoostPercent() {        
        return this.resistanceBoostLevel * .1;
    }
}
