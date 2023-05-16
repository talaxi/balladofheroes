import { ElementalStats } from "./elemental-stats.model";
import { Type } from "class-transformer";

export class TrackedStats {
    damageTaken: number;
    @Type(() => ElementalStats)
    elementalAttacksUsed: ElementalStats;
    elementalDamageDealt: number;
    damagingHitsTaken: number;
    healingDone: number;
    healsMade: number;
    criticalsDealt: number;

    constructor() {
        this.damageTaken = 0;
        this.elementalDamageDealt = 0;
        this.elementalAttacksUsed = new ElementalStats();
        this.healingDone = 0;
        this.damagingHitsTaken = 0;
        this.healsMade = 0;
        this.criticalsDealt = 0;
    }
}
