import { AltarEnum } from "../enums/altar-enum.model";
import { FollowerActionEnum } from "../enums/follower-action-enum.model";
import { FollowerPrayerTypeEnum } from "../enums/follower-prayer-type-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";

export class IndividualFollower {
    assignedTo: FollowerActionEnum;
    assignedZone: ZoneEnum;
    assignedPrayerType: FollowerPrayerTypeEnum;
    assignedAltarType: AltarEnum;

    constructor() {
        this.assignedTo = FollowerActionEnum.None;
        this.assignedZone = ZoneEnum.None;
        this.assignedPrayerType = FollowerPrayerTypeEnum.None;
        this.assignedAltarType = AltarEnum.None;
    }
}
