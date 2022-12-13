import { Type } from "class-transformer";
import { LootItem } from "../resources/loot-item.model";
import { ResourceValue } from "../resources/resource-value.model";
import { CharacterStats } from "./character-stats.model";
import { Character } from "./character.model";

export class Enemy extends Character {
    xpGainFromDefeat: number;
    coinGainFromDefeat: number;
    @Type(() => LootItem)
    loot: LootItem[];
    
    constructor() {
        super();
       this.loot = [];      
    }
}
