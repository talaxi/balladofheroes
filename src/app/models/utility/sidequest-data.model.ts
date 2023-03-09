import { Character } from "../character/character.model";

export class SidequestData {
    isAltarOfAsclepiusUnlocked: boolean;
    altarOfAsclepius: Character;

    constructor() {       
        this.isAltarOfAsclepiusUnlocked = false; 
        this.altarOfAsclepius = new Character();
        this.altarOfAsclepius.name = "Asclepius";
        this.altarOfAsclepius.battleStats.maxHp = 20000;
        this.altarOfAsclepius.battleStats.currentHp = 0;
    }
}
