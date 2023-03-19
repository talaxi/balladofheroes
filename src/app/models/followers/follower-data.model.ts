import { Type } from "class-transformer";
import { IndividualFollower } from "./individual-follower.model";

export class FollowerData {
    availableFollowers: number;
    @Type(() => IndividualFollower)
    followers: IndividualFollower[];
    numberOfFollowersPurchased: number;
    numberOfFollowersGainedFromAchievements: number;
    achievementCompletionCounter: number;

    constructor() {
        this.availableFollowers = 0; 
        this.numberOfFollowersGainedFromAchievements = 0;
        this.numberOfFollowersPurchased = 0;
        this.achievementCompletionCounter = 0;
        this.followers = [];
    }
}
