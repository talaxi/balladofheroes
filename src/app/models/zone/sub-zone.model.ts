import { SubZoneEnum } from "../enums/sub-zone-enum.model";


export class SubZone {
    type: SubZoneEnum;
    isSelected: boolean;
    victoryCount: number;
    fastestCompletion: number;
    maxXps: number;
    maxDps: number;
    isAvailable: boolean;
    notify: boolean;

    constructor(enumVal?: SubZoneEnum) {
        this.type = SubZoneEnum.None;

        if (enumVal !== undefined) {
            this.type = enumVal;
        }
        this.victoryCount = 0;
        this.isAvailable = false;
        this.maxXps = 0;
        this.maxDps = 0;
    }
}
