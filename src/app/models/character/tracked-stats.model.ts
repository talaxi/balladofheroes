import { ElementalStats } from "./elemental-stats.model";
import { Type } from "class-transformer";

export class TrackedStats {
    damageTaken: number;
    @Type(() => ElementalStats)
    elementalAttacksUsed: ElementalStats;

    constructor() {
        this.damageTaken = 0;
        this.elementalAttacksUsed = new ElementalStats();
    }
}
