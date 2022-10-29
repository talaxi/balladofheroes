import { BestiaryEnum } from "../enums/bestiary-enum.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { StatusEffect } from "./status-effect.model";

export class BattleInfo {
    autoAttackTimer: number;
    timeToAutoAttack: number;
    statusEffects: StatusEffect[];

    constructor(characterType?: CharacterEnum, enemyType?: BestiaryEnum) {
        this.autoAttackTimer = 0;
        this.timeToAutoAttack = 10;
        this.statusEffects = [];

        if (characterType === CharacterEnum.Warrior)
        {
            this.timeToAutoAttack = 5;
        }
        if (characterType === CharacterEnum.Adventurer)
        {
            this.timeToAutoAttack = 3;
        }
    }
}
