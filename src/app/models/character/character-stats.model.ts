export class CharacterStats {
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    agility: number;
    luck: number; 
    resistance: number;

    constructor(hp: number,strength: number, defense: number, agility: number, luck: number) {
        this.maxHp = hp;
        this.currentHp = hp;        
        this.attack = strength;
        this.defense = defense;
        this.agility = agility;
        this.luck = luck;
    }

    makeCopy() {
        var copy = new CharacterStats(this.maxHp,this.attack, this.defense, this.agility, this.luck);

        return copy;
    }

    getHpPercent(asPercent: boolean = false) {
        if (asPercent)
            return (this.currentHp / this.maxHp) * 100;
        else
            return this.currentHp / this.maxHp;
    }
}
