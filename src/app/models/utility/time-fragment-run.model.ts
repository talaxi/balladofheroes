import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { TrialEnum } from "../enums/trial-enum.model";

export class TimeFragmentRun {
    selectedSubzone: SubZoneEnum | undefined;
    selectedTrial: TrialEnum | undefined;
    timer: number;
    clearTime: number;

    constructor() {
        this.timer = 0;
    }
}
