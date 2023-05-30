import { TrialEnum } from "../enums/trial-enum.model";

export class Trial {
    type: TrialEnum;
    timer: number;
    timerLength: number;

    constructor() {
        this.type = TrialEnum.None;
        this.timer = 0;
        this.timerLength = 0;
    }
}
