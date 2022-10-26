import { LootItem } from "../resources/loot-item.model";
import { ResourceValue } from "../resources/resource-value.model";
import { CharacterStats } from "./character-stats.model";
import { Character } from "./character.model";

export class Enemy extends Character {
    xpGainFromDefeat: number;
    loot: LootItem[];
    baseStagger: number;
    currentStagger: number;
    breakPoint: number;
    breakLength: number;
    
    constructor() {
        super();
       this.loot = [];       
    }
}
