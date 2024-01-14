export class PrimaryStats {
    //This class is used purely for storage space savings on instances where secondary stats are not relevant
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    agility: number;
    luck: number; 
    resistance: number;

    constructor(hp: number,strength: number, defense: number, agility: number, luck: number, resistance: number) {
        this.maxHp = hp;
        this.currentHp = hp;        
        this.attack = strength;
        this.defense = defense;
        this.agility = agility;
        this.luck = luck;
        this.resistance = resistance;
    }

    makeCopy(excludeCurrentHp: boolean = true) {
        var currentHp = this.currentHp;
        var copy = new PrimaryStats(this.maxHp,this.attack, this.defense, this.agility, this.luck, this.resistance);

        if (excludeCurrentHp)
            copy.currentHp = currentHp;

        return copy;
    }
}
