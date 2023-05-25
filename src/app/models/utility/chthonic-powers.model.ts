import { GodEnum } from "../enums/god-enum.model";

export class ChthonicPowers {
    attackBoostLevel: number;
    defenseBoostLevel: number;
    maxHpBoostLevel: number;
    agilityBoostLevel: number;
    luckBoostLevel: number;
    resistanceBoostLevel: number;
    isChthonicFavorUnlocked: boolean;
    isChthonicResetUnlocked: boolean;
    preferredGod: GodEnum;    
    increasedGodPrimaryStatResets: number;
    increasedPartyPrimaryStatResets: number;
    retainGodLevel: number;

    constructor() {
        this.isChthonicResetUnlocked = false;
        this.isChthonicFavorUnlocked = false;
        this.preferredGod = GodEnum.None;
        this.attackBoostLevel = 0;
        this.defenseBoostLevel = 0;
        this.maxHpBoostLevel = 0;
        this.agilityBoostLevel = 0;
        this.luckBoostLevel = 0;
        this.resistanceBoostLevel = 0;
        this.increasedGodPrimaryStatResets = 0;
        this.increasedPartyPrimaryStatResets = 0;
        this.retainGodLevel = 0;
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

    getIncreasedGodPrimaryStatResetCount() {        
        return this.increasedGodPrimaryStatResets;
    }
    
    getIncreasedPartyPrimaryStatResetCount() {        
        return this.increasedPartyPrimaryStatResets;
    }
    
    getRetainGodLevelPercent() {        
        return this.retainGodLevel * .01;
    }
}
