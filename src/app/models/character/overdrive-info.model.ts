export class OverdriveInfo {
    overdriveGaugeAmount: number;
    overdriveGaugeTotal: number;
    gainPerAutoAttack: number;
    gainPerAbility: number;
    overdriveAutoMode: boolean;
    manuallyTriggered: boolean;

    constructor() {
        this.gainPerAutoAttack = .5;
        this.gainPerAbility = 1.5;
        this.overdriveGaugeAmount = 0;
        this.overdriveGaugeTotal = 100;
        this.overdriveAutoMode = true;
        this.manuallyTriggered = false;
    }
}
