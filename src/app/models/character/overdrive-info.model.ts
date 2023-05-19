import { CharacterEnum } from "../enums/character-enum.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";
import { OverdriveNameEnum } from "../enums/overdrive-name-enum.model";

export class OverdriveInfo {
    gaugeAmount: number;
    gaugeTotal: number;
    gainPerAutoAttack: number;
    gainPerAbility: number;
    gainPerBeingAttacked: number;
    autoMode: boolean;
    manuallyTriggered: boolean;
    selectedOverdrive: OverdriveNameEnum;
    activeDuration: number;
    activeLength: number;
    isActive: boolean;
    lastUsedElement: ElementalTypeEnum; //used specifically for Nature overdrive
    damageTaken: number; //used specifically for Protection overdrive
    criticalDamageTaken: [CharacterEnum, number][]; //used specifically for Bullseye overdrive

    constructor() {
        this.gainPerAutoAttack = .5;
        this.gainPerBeingAttacked = .5;
        this.gainPerAbility = 1.5;
        this.gaugeAmount = 0;
        this.gaugeTotal = 80;
        this.autoMode = true;
        this.manuallyTriggered = false;
        this.selectedOverdrive = OverdriveNameEnum.Smash;
        this.activeDuration = 0;
        this.activeLength = 20;
        this.isActive = false;
        this.lastUsedElement = ElementalTypeEnum.None;
        this.damageTaken = 0;
        this.criticalDamageTaken = [];
    }
}
