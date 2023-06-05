import { GodEnum } from "../enums/god-enum.model";
import { TrialEnum } from "../enums/trial-enum.model";

export class Trial {
    type: TrialEnum;
    timer: number;
    timerLength: number;
    godEnum: GodEnum;

    constructor() {
        this.type = TrialEnum.None;
        this.timer = 0;
        this.timerLength = 0;
        this.godEnum = GodEnum.None;
    }
}
