import { OverdriveNameEnum } from "../enums/overdrive-name-enum.model";

export class OverdriveInfo {
    overdriveGaugeAmount: number;
    overdriveGaugeTotal: number;
    gainPerAutoAttack: number;
    gainPerAbility: number;
    overdriveAutoMode: boolean;
    manuallyTriggered: boolean;
    selectedOverdrive: OverdriveNameEnum;

    constructor() {
        this.gainPerAutoAttack = .5;
        this.gainPerAbility = 1.5;
        this.overdriveGaugeAmount = 0;
        this.overdriveGaugeTotal = 100;
        this.overdriveAutoMode = true;
        this.manuallyTriggered = false;
        this.selectedOverdrive = OverdriveNameEnum.HeavyAttack;
    }
}
