import { LogViewEnum } from "../enums/log-view-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";

export class LogData {
    //dateReceived: string;
    dateReceived: number;
    type: LogViewEnum;
    relevantEnumValue: number; //ItemsEnum, TutorialTypeEnum, Story ID
    amount: number; //for items
    loc: SubZoneEnum;
}
