import { Type } from "class-transformer";
import { NotificationTypeEnum } from "../enums/notification-type-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";
import { SubZone } from "./sub-zone.model";

export class Zone {
    zoneName: string;
    type: ZoneEnum;
    isSelected: boolean;
    isAvailable: boolean;
    notify: boolean;
    @Type(() => SubZone)
    subzones: SubZone[];
    notificationType: NotificationTypeEnum;

    constructor() {
        this.subzones = [];
        this.type = ZoneEnum.None;
        this.zoneName = "None";
        this.notificationType = this.shouldShowSideQuestNotification(this.type);
    }
    
    shouldShowSideQuestNotification(type?: ZoneEnum) {
        if (type === undefined)
            type = this.type;

        if (type === ZoneEnum.TheLethe)
            return NotificationTypeEnum.SideQuest;

        return NotificationTypeEnum.Story;
    }
}
