import { Type } from "class-transformer";
import { AchievementTypeEnum } from "../enums/achievement-type-enum.copy";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class Achievement {
    subzone: SubZoneEnum;
    type: AchievementTypeEnum;
    @Type(() => ResourceValue)
    completed: boolean;

    constructor(achievementType: AchievementTypeEnum, subzone?: SubZoneEnum) {
        this.type = achievementType;
        this.completed = false;

        if (subzone !== undefined)
            this.subzone = subzone;
    }    
}
