import { ItemsEnum } from "../enums/items-enum.model";

export class Timers {
    scenePageTimer: number;
    chestTimer: number;
    townHpGainTimer: number;
    followerSearchZoneTimer: number;
    followerPrayerTimer: number;

    scenePageLength: number;
    chestLength: number;
    townHpGainLength: number;
    followerSearchZoneTimerLength: number;
    followerPrayerTimerLength: number;

    itemCooldowns: [ItemsEnum, number][];

    skipStorySpeed = 0;
    fastStorySpeed = 15;
    mediumStorySpeed = 30;
    slowStorySpeed = 60;
    pauseStorySpeed = 1000;

    constructor() {
        this.scenePageTimer = 0;
        this.scenePageLength = this.slowStorySpeed; 
        
        this.followerSearchZoneTimer = 0;
        this.followerSearchZoneTimerLength = 60;

        this.followerPrayerTimer = 0;
        this.followerPrayerTimerLength = 60;

        this.chestTimer = 0;
        this.chestLength = 5;

        this.townHpGainTimer = 0;
        this.townHpGainLength = 2;

        this.itemCooldowns = [];
    }
}
