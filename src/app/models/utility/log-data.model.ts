import { LogViewEnum } from "../enums/log-view-enum.model";

export class LogData {
    dateReceived: string;
    type: LogViewEnum;
    relevantEnumValue: number; //ItemsEnum, TutorialTypeEnum, Story ID
    amount: number; //for items
}
