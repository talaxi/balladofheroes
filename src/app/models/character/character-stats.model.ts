export class CharacterStats {
    hp: number;
    mp: number;
    strength: number;
    defense: number;
    magic: number;
    magicDefense: number;
    agility: number;
    luck: number;
    accuracy: number;
    evasion: number;

    currentHp: number;
    currentMp: number;

    constructor(hp: number, mp: number, strength: number, defense: number, magic: number, magicDefense: number, agility: number,
        luck: number, accuracy: number, evasion: number) {
        this.hp = hp;
        this.currentHp = hp;
        this.mp = mp;
        this.currentMp = mp;
        this.strength = strength;
        this.defense = defense;
        this.magic = magic;
        this.magicDefense = magicDefense;
        this.agility = agility;
        this.luck = luck;
        this.accuracy = accuracy;
        this.evasion = evasion;
    }

    makeCopy() {
        var copy = new CharacterStats(this.hp, this.mp, this.strength, this.defense, this.magic, this.magicDefense, this.agility,
            this.luck, this.accuracy, this.evasion);

            return copy;
    }
}
