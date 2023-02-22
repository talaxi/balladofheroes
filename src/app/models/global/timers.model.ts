export class Timers {
    scenePageTimer: number;
    chestTimer: number;
    townHpGainTimer: number;

    scenePageLength: number;
    chestLength: number;
    townHpGainLength: number;

    skipStorySpeed = 0;
    fastStorySpeed = 15;
    mediumStorySpeed = 30;
    slowStorySpeed = 60;

    constructor() {
        this.scenePageTimer = 0;
        this.scenePageLength = this.mediumStorySpeed; 

        this.chestTimer = 0;
        this.chestLength = 5;

        this.townHpGainTimer = 0;
        this.townHpGainLength = 2;
    }
}
