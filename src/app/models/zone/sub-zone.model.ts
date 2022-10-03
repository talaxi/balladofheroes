import { EnemyTeam } from "../character/enemy-team.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";

export class SubZone {
    name: string;
    type: SubZoneEnum;
    isSelected: boolean;
    battleOptions: EnemyTeam[];
    victoryCount: number;

    constructor(enumVal?: SubZoneEnum) {
        if (enumVal !== undefined)
            this.type = enumVal;
        this.battleOptions = [];
        this.victoryCount = 0;
    }
}
