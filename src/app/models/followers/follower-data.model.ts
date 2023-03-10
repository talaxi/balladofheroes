import { Type } from "class-transformer";
import { IndividualFollower } from "./individual-follower.model";

export class FollowerData {
    availableFollowers: number;
    @Type(() => IndividualFollower)
    followers: IndividualFollower[];

    constructor() {
        this.availableFollowers = 1; //TODO: should be 0 with 1 available after completing your first achievement
        this.followers = [];
        //TODO: remove after adding to first achievement
        this.followers.push(new IndividualFollower());
    }
}
