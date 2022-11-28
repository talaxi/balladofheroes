export class Timers {
    scenePageTimer: number;
    chestTimer: number;

    scenePageLength: number;
    chestLength: number;

    constructor() {
        this.scenePageTimer = 0;
        this.scenePageLength = 3; //TODO: SET TO 10

        this.chestTimer = 0;
        this.chestLength = 3;
    }
}
