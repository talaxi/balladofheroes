import { Type } from "class-transformer";
import { BestiaryEnum } from "../enums/bestiary-enum.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { StatusEffect } from "./status-effect.model";

export class BattleInfo {
    autoAttackTimer: number;
    timeToAutoAttack: number;
    autoAttackAutoMode: boolean;
    autoAttackManuallyTriggered: boolean;
    @Type(() => StatusEffect)
    statusEffects: StatusEffect[];
    barrierValue: number;
    fastAutoAttackCount: number;
    hpRegenTimer: number;
    hpRegenTimerLength: number;

    constructor(characterType?: CharacterEnum, enemyType?: BestiaryEnum) {
        this.autoAttackTimer = 0;
        this.timeToAutoAttack = 10;
        this.autoAttackAutoMode = true;
        this.autoAttackManuallyTriggered = false;
        this.barrierValue = 0;
        this.fastAutoAttackCount = 0;
        this.hpRegenTimer = 0;
        this.hpRegenTimerLength = 5;
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
