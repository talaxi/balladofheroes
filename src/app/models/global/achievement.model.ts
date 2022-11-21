import { AchievementTypeEnum } from "../enums/achievement-type-enum.copy";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ResourceValue } from "../resources/resource-value.model";

export class Achievement {
    relatedSubzone: SubZoneEnum;
    achievementType: AchievementTypeEnum;
    bonusResources: ResourceValue[];
    completed: boolean;

    constructor(achievementType: AchievementTypeEnum, relatedSubzone?: SubZoneEnum) {
        this.achievementType = achievementType;
        this.bonusResources = [];
        this.completed = false;

        if (relatedSubzone !== undefined)
            this.relatedSubzone = relatedSubzone;
    }
}
