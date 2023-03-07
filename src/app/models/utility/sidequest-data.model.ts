import { Character } from "../character/character.model";

export class SidequestData {
    altarOfAsclepus: Character;

    constructor() {        
        this.altarOfAsclepus = new Character();
        this.altarOfAsclepus.name = "Asclepius";
        this.altarOfAsclepus.battleStats.maxHp = 20000;
        this.altarOfAsclepus.battleStats.currentHp = 0;
    }
}
