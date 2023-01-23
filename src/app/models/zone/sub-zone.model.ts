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
    fastestCompletionSpeed: number;
    victoriesNeededToProceed: number;
    isAvailable: boolean;
    showNewNotification: boolean;
    treasureChestChance: number;

    constructor(enumVal?: SubZoneEnum) {
        this.victoriesNeededToProceed = 0;
        this.type = SubZoneEnum.None;
        this.name = "None";

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
        if (type === SubZoneEnum.NemeaCountryRoadsOne)
            name = "Country Roads";
        if (type === SubZoneEnum.NemeaCountryRoadsTwo)
            name = "Country Roads";
        if (type === SubZoneEnum.NemeaRollingHills)
            name = "Rolling Hills";
        if (type === SubZoneEnum.NemeaLairOfTheLion)
            name = "Lair of the Lion";
        if (type === SubZoneEnum.AsphodelPalaceOfHades)
            name = "Palace of Hades";
        if (type === SubZoneEnum.AsphodelTheDepths)
            name = "The Depths";
        if (type === SubZoneEnum.AsphodelForgottenHalls)
            name = "Forgotten Halls";
            if (type === SubZoneEnum.AsphodelLostHaven)
            name = "Lost Haven";
        if (type === SubZoneEnum.AsphodelEndlessStaircase)
            name = "Endless Staircase";
        if (type === SubZoneEnum.AsphodelFieryPassage)
            name = "Fiery Passage";
        if (type === SubZoneEnum.AsphodelDarkenedMeadows)
            name = "Darkened Meadows";
        if (type === SubZoneEnum.AsphodelLetheBasin)
            name = "Lethe Basin";
        if (type === SubZoneEnum.AsphodelLetheTributary)
            name = "Lethe Tributary";
        if (type === SubZoneEnum.ElysiumElysianFields)
            name = "Elysian Fields";
        if (type === SubZoneEnum.ElysiumOpenPlains)
            name = "Open Plains";
        if (type === SubZoneEnum.ElysiumColiseum)
            name = "Coliseum";
        if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory)
            name = "Gates of Horn and Ivory";
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

        if (type === SubZoneEnum.NemeaCountryRoadsOne)
            victories = defaultVictories;

        if (type === SubZoneEnum.AsphodelTheDepths || type === SubZoneEnum.AsphodelForgottenHalls || type === SubZoneEnum.AsphodelEndlessStaircase ||
            type === SubZoneEnum.AsphodelFieryPassage || type === SubZoneEnum.AsphodelDarkenedMeadows || type === SubZoneEnum.AsphodelLetheBasin)
            victories = defaultVictories;

        if (type === SubZoneEnum.AsphodelLetheTributary)
            victories = bossVictories;

        if (type === SubZoneEnum.ElysiumElysianFields || type === SubZoneEnum.ElysiumOpenPlains || type === SubZoneEnum.ElysiumGatesOfHornAndIvory)
            victories = defaultVictories;

        return victories;
    }

    isSubzoneTown(type: SubZoneEnum) {
        if (type === SubZoneEnum.DodonaDelphi || type === SubZoneEnum.DodonaArta || type === SubZoneEnum.AsphodelPalaceOfHades ||
            type === SubZoneEnum.AsphodelLostHaven || type === SubZoneEnum.ElysiumColiseum) {
            return true;
        }

        return false;
    }

}
