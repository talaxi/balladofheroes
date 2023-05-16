import { AltarConditionEnum } from "../enums/altar-condition-enum.model";
import { AltarEnum } from "../enums/altar-enum.model";
import { GodEnum } from "../enums/god-enum.model";

export class AltarInfo {
    type: AltarEnum;
    god: GodEnum;
    condition: AltarConditionEnum;
    conditionCount: number;
    conditionMax: number; //max value that needs to be reached for the condition to be met    

    constructor() {
        this.type = AltarEnum.None;
        this.god = GodEnum.None;
        this.condition = AltarConditionEnum.None;

        this.conditionCount = 0;
        this.conditionMax = 0;
    }
}
