import { Type, Exclude } from "class-transformer";
import { EnemyTeam } from "../character/enemy-team.model";
import { BalladEnum } from "../enums/ballad-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";

export class SubZone {
    //name: string;
    type: SubZoneEnum;
    isSelected: boolean;
    //isTown: boolean;
    //@Type(() => EnemyTeam)    
    //battleOptions: EnemyTeam[];
    victoryCount: number;
    fastestCompletion: number;
    maxXps: number;
    //winsNeeded: number; //wins needed to proceed to next subzone
    isAvailable: boolean;
    notify: boolean;
    //notificationType: NotificationTypeEnum;

    constructor(enumVal?: SubZoneEnum) {
        //this.winsNeeded = 0;
        this.type = SubZoneEnum.None;
        //this.name = "None";

        if (enumVal !== undefined) {
            this.type = enumVal;
            //this.name = this.setSubZoneName(this.type);
            //this.winsNeeded = this.getVictoriesNeededToProceed(this.type);
        }
        //this.battleOptions = [];
        this.victoryCount = 0;
        this.isAvailable = false;
        this.maxXps = 0;
        //this.isTown = this.isSubzoneTown(this.type);        
        //this.notificationType = this.shouldShowSideQuestNotification(this.type);
    }    
}
