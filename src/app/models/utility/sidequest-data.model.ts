import { Character } from "../character/character.model";

export class SidequestData {
    isAltarOfAsclepiusUnlocked: boolean;
    altarOfAsclepius: Character;
    weeklyMeleeEntries: number;
    lastWeeklyMeleeTicketReceived: Date;
    highestWeeklyMeleeRound: number;

    constructor() {       
        this.isAltarOfAsclepiusUnlocked = false; 
        this.altarOfAsclepius = new Character();
        this.altarOfAsclepius.name = "Asclepius";
        this.altarOfAsclepius.battleStats.maxHp = 24000;
        this.altarOfAsclepius.battleStats.currentHp = 0;
        this.weeklyMeleeEntries = 1;
        this.highestWeeklyMeleeRound = 0;
        this.lastWeeklyMeleeTicketReceived = new Date();
    }
}
