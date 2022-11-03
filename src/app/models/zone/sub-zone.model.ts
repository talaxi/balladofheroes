import { EnemyTeam } from "../character/enemy-team.model";
import { BalladEnum } from "../enums/ballad-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";

export class SubZone {
    name: string;
    type: SubZoneEnum;
    isSelected: boolean;
    battleOptions: EnemyTeam[];
    victoryCount: number;
    victoriesNeededToProceed: number;
    isAvailable: boolean;
    
    constructor(enumVal?: SubZoneEnum) {
        this.victoriesNeededToProceed = 0;

        if (enumVal !== undefined) {
            this.type = enumVal;
            this.name = this.setSubZoneName(this.type);
            this.victoriesNeededToProceed = this.getVictoriesNeededToProceed(this.type);            
        }
        this.battleOptions = [];        
        this.victoryCount = 0;
        this.isAvailable = false;
    }

    setSubZoneName(type: SubZoneEnum) {
        var name = "";

        if (type === SubZoneEnum.AigosthenaUpperCoast)
            name = "Upper Coast";
        if (type === SubZoneEnum.AigosthenaBay)
            name = "Bay";
        if (type === SubZoneEnum.AigosthenaLowerCoast)
            name = "Lower Coast";
        if (type === SubZoneEnum.AigosthenaWesternWoodlands)
            name = "Western Woodlands";
        if (type === SubZoneEnum.AigosthenaHeartOfTheWoods)
            name = "Heart of the Woods";
        /*if (type === SubZoneEnum.AigosthenaEasternWoodlands)
            name = "Eastern Woodlands";*/

        return name;
    }

    getVictoriesNeededToProceed(type: SubZoneEnum) {
        var victories = 1;
        var testing = true;

        if (!testing)
        {
            if (type === SubZoneEnum.AigosthenaUpperCoast)
                victories = 10;
            if (type === SubZoneEnum.AigosthenaBay)
                victories = 10;
            if (type === SubZoneEnum.AigosthenaLowerCoast)
                victories = 10;
            if (type === SubZoneEnum.AigosthenaWesternWoodlands)
                victories = 10;
            if (type === SubZoneEnum.AigosthenaHeartOfTheWoods)
                victories = 1;
            /*if (type === SubZoneEnum.AigosthenaEasternWoodlands)
                victories = 10;*/
        }

        return victories;
    } 
}
