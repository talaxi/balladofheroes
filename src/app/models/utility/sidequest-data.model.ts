import { Character } from "../character/character.model";
import { BestiaryEnum } from "../enums/bestiary-enum.model";

export class SidequestData {
    isAltarOfAsclepiusUnlocked: boolean;
    altarOfAsclepius: Character;
    weeklyMeleeEntries: number;
    lastWeeklyMeleeTicketReceived: Date;
    highestWeeklyMeleeRound: number;
    traderHuntLevel: number;
    traderBestiaryType: BestiaryEnum;
    goldenApplesObtained: number;
    augeanStablesLevel: number;
    displayAugeanStablesPayScene: boolean;
    maxAugeanStablesLevel: number;

    constructor() {       
        this.isAltarOfAsclepiusUnlocked = false; 
        this.altarOfAsclepius = new Character();
        this.altarOfAsclepius.name = "Asclepius";
        this.altarOfAsclepius.battleStats.maxHp = 24000;
        this.altarOfAsclepius.battleStats.currentHp = 0;
        this.weeklyMeleeEntries = 1;
        this.highestWeeklyMeleeRound = 0;
        this.lastWeeklyMeleeTicketReceived = new Date();
        this.traderHuntLevel = 0;
        this.goldenApplesObtained = 0;
        this.augeanStablesLevel = 0;
        this.displayAugeanStablesPayScene = false;
        this.maxAugeanStablesLevel = 3;
    }
}
