export class CharacterStats {
    maxHp: number;
    mp: number;
    strength: number;
    defense: number;
    magic: number;
    magicDefense: number;
    agility: number;
    luck: number; 

    currentHp: number;
    currentMp: number;

    constructor(hp: number, mp: number, strength: number, defense: number, magic: number, magicDefense: number, agility: number,
        luck: number) {
        this.maxHp = hp;
        this.currentHp = hp;
        this.mp = mp;
        this.currentMp = mp;
        this.strength = strength;
        this.defense = defense;
        this.magic = magic;
        this.magicDefense = magicDefense;
        this.agility = agility;
        this.luck = luck;
    }

    makeCopy() {
        var copy = new CharacterStats(this.maxHp, this.mp, this.strength, this.defense, this.magic, this.magicDefense, this.agility,
            this.luck);

            return copy;
    }
}
