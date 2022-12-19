import { Type } from "class-transformer";
import { EnemyTeam } from "../character/enemy-team.model";
import { BalladEnum } from "../enums/ballad-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";

export class SubZone {
    name: string;
    type: SubZoneEnum;
    isSelected: boolean;
    isTown: boolean;
    @Type(() => EnemyTeam)
    battleOptions: EnemyTeam[];
    victoryCount: number;
    victoriesNeededToProceed: number;
    isAvailable: boolean;
    showNewNotification: boolean;
    treasureChestChance: number;

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
        this.isTown = this.isSubzoneTown(this.type);
        this.treasureChestChance = 0;
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

        if (type === SubZoneEnum.DodonaDelphi)
            name = "Delphi";
        if (type === SubZoneEnum.DodonaDelphiOutskirts)
            name = "Delphi Outskirts";
        if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris)
            name = "Coastal Roads of Locris";
        if (type === SubZoneEnum.DodonaCountryside)
            name = "Countryside";
        if (type === SubZoneEnum.DodonaMountainOpening)
            name = "Mountain Opening";
        if (type === SubZoneEnum.DodonaMountainPassOne)
            name = "Mountain Pass 1";
        if (type === SubZoneEnum.DodonaLakeTrichonida)
            name = "Lake Trichonida";
        if (type === SubZoneEnum.DodonaMountainPassTwo)
            name = "Mountain Pass 2";
        if (type === SubZoneEnum.DodonaAmbracianGulf)
            name = "Ambracian Gulf";
        if (type === SubZoneEnum.DodonaArta)
            name = "Arta";
        if (type === SubZoneEnum.LibyaBeach)
            name = "Beach";
        if (type === SubZoneEnum.LibyaRockyOutcrops)
            name = "Rocky Outcrops";
        if (type === SubZoneEnum.LibyaDeeperPath)
            name = "Deeper Path";
        if (type === SubZoneEnum.LibyaIsleCenter)
            name = "Isle Center";

        return name;
    }

    getVictoriesNeededToProceed(type?: SubZoneEnum) {
        if (type === undefined)
            type = this.type;

        var victories = 1;
        var testing = false;

        var aigosthenaVictories = 5;
        var defaultVictories = 10;
        var bossVictories = 1;

        if (testing) {
            aigosthenaVictories = 1;
            defaultVictories = 1;
        }

        if (type === SubZoneEnum.AigosthenaUpperCoast)
            victories = aigosthenaVictories;
        if (type === SubZoneEnum.AigosthenaBay)
            victories = aigosthenaVictories;
        if (type === SubZoneEnum.AigosthenaLowerCoast)
            victories = aigosthenaVictories;
        if (type === SubZoneEnum.AigosthenaWesternWoodlands)
            victories = aigosthenaVictories;
        if (type === SubZoneEnum.AigosthenaHeartOfTheWoods)
            victories = bossVictories;

        if (type === SubZoneEnum.DodonaDelphiOutskirts)
            victories = defaultVictories;
        if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris)
            victories = defaultVictories;
        if (type === SubZoneEnum.DodonaCountryside)
            victories = bossVictories;
        if (type === SubZoneEnum.DodonaMountainOpening)
            victories = defaultVictories;
        if (type === SubZoneEnum.DodonaMountainPassOne)
            victories = defaultVictories;
        if (type === SubZoneEnum.DodonaLakeTrichonida)
            victories = bossVictories;
        if (type === SubZoneEnum.DodonaMountainPassTwo)
            victories = defaultVictories;
        if (type === SubZoneEnum.DodonaAmbracianGulf)
            victories = defaultVictories;

        if (type === SubZoneEnum.LibyaBeach)
            victories = defaultVictories;
        if (type === SubZoneEnum.LibyaRockyOutcrops)
            victories = defaultVictories;
        if (type === SubZoneEnum.LibyaDeeperPath)
            victories = bossVictories;
        if (type === SubZoneEnum.LibyaIsleCenter)
            victories = bossVictories;

        return victories;
    }

    isSubzoneTown(type: SubZoneEnum) {
        if (type === SubZoneEnum.DodonaDelphi || type === SubZoneEnum.DodonaArta) {
            return true;
        }

        return false;
    }

}
