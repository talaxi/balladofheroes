import { Type } from "class-transformer";
import { BestiaryEnum } from "../enums/bestiary-enum.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";
import { StatusEffect } from "./status-effect.model";

export class BattleInfo {
    autoAttackTimer: number;
    timeToAutoAttack: number;
    autoAttackModifier: number;
    autoAttackAutoMode: boolean;
    autoAttackManuallyTriggered: boolean;
    @Type(() => StatusEffect)
    statusEffects: StatusEffect[];
    barrierValue: number;
    fastAutoAttackCount: number;
    hpRegenTimer: number;
    hpRegenTimerLength: number;
    elementalType: ElementalTypeEnum;
    elementsUsed: ElementalTypeEnum[]; //specifically used for disaster
    outburstElementsUsed: ElementalTypeEnum[]; //specifically used for outburst
    specialAbilityUseCount: number;
    lastUsedPoseidonAbility: boolean;
    stingerCount: [number, number][]; //specifically used for unique weapon Scorpion Stinger
    duoAbilityUsed: boolean;
    duoAbilityCooldown: number;
    immortalityCount: number;
    finalHourUsed: boolean;
    duoAbilityAutoMode: boolean;

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
        this.elementalType = ElementalTypeEnum.None;
        this.lastUsedPoseidonAbility = false;
        this.specialAbilityUseCount = 0;
        this.stingerCount = [];
        this.duoAbilityUsed = false;
        this.immortalityCount = 0;
        this.duoAbilityCooldown = 0;
        this.finalHourUsed = false;
        this.duoAbilityAutoMode = true;
    }
}
