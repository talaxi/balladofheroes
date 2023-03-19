import { ElementalStats } from "./elemental-stats.model";
import { Type } from "class-transformer";

export class TrackedStats {
    damageTaken: number;
    @Type(() => ElementalStats)
    elementalAttacksUsed: ElementalStats;
    elementalDamageDealt: number;

    constructor() {
        this.damageTaken = 0;
        this.elementalDamageDealt = 0;
        this.elementalAttacksUsed = new ElementalStats();
    }
}
