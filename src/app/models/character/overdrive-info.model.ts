import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";
import { OverdriveNameEnum } from "../enums/overdrive-name-enum.model";

export class OverdriveInfo {
    overdriveGaugeAmount: number;
    overdriveGaugeTotal: number;
    gainPerAutoAttack: number;
    gainPerAbility: number;
    gainPerBeingAttacked: number;
    overdriveAutoMode: boolean;
    manuallyTriggered: boolean;
    selectedOverdrive: OverdriveNameEnum;
    overdriveActiveDuration: number;
    overdriveActiveLength: number;
    overdriveIsActive: boolean;
    lastUsedElement: ElementalTypeEnum; //used specifically for Nature overdrive
    damageTaken: number; //used specifically for Protection overdrive

    constructor() {
        this.gainPerAutoAttack = .5;
        this.gainPerBeingAttacked = .5;
        this.gainPerAbility = 1.5;
        this.overdriveGaugeAmount = 0;
        this.overdriveGaugeTotal = 80;
        this.overdriveAutoMode = true;
        this.manuallyTriggered = false;
        this.selectedOverdrive = OverdriveNameEnum.Smash;
        this.overdriveActiveDuration = 0;
        this.overdriveActiveLength = 20;
        this.overdriveIsActive = false;
        this.lastUsedElement = ElementalTypeEnum.None;
        this.damageTaken = 0;
    }
}
