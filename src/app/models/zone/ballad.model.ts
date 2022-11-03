import { BalladEnum } from "../enums/ballad-enum.model";
import { Zone } from "./zone.model";

export class Ballad {
    name: string;
    type: BalladEnum;
    isSelected: boolean;
    isAvailable: boolean;
    zones: Zone[];

    constructor(type?: BalladEnum) {
        this.zones = [];

        if (type !== undefined)
            this.type = type;

        this.isAvailable = false;
    }
}
