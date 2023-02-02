import { Type } from "class-transformer";
import { BestiaryEnum } from "../enums/bestiary-enum.model";
import { LootItem } from "../resources/loot-item.model";
import { ResourceValue } from "../resources/resource-value.model";
import { CharacterStats } from "./character-stats.model";
import { Character } from "./character.model";

export class Enemy extends Character {
    xpGainFromDefeat: number;
    coinGainFromDefeat: number;
    @Type(() => LootItem)
    loot: LootItem[];
    isBoss: boolean;
    bestiaryType: BestiaryEnum;
    
    constructor() {
        super();
       this.loot = [];      
    }
}
