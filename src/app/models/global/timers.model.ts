export class Timers {
    scenePageTimer: number;
    chestTimer: number;
    townHpGainTimer: number;

    scenePageLength: number;
    chestLength: number;
    townHpGainLength: number;

    constructor() {
        this.scenePageTimer = 0;
        this.scenePageLength = 30; 

        this.chestTimer = 0;
        this.chestLength = 5;

        this.townHpGainTimer = 0;
        this.townHpGainLength = 2;
    }
}
