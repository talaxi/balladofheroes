import { Type } from "class-transformer";
import { BalladEnum } from "../enums/ballad-enum.model";
import { Zone } from "./zone.model";

export class Ballad {
    name: string;
    type: BalladEnum;
    isSelected: boolean;
    isAvailable: boolean;
    notify: boolean;
    @Type(() => Zone)
    zones: Zone[];
    displayOrder: number;

    constructor(type?: BalladEnum) {
        this.zones = [];
        this.type = BalladEnum.None;
        this.name = "None";
        this.displayOrder = 0;

        if (type !== undefined)
            this.type = type;

        this.isAvailable = false;
    }
}
