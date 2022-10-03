import { Type } from "class-transformer";
import { BattleInfo } from "../battle/battle-info.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { CharacterStats } from "./character-stats.model";
import { God } from "./god.model";

export class Character {
    name: string;   
    level: number; 
    type: CharacterEnum;
    @Type(() => CharacterStats)
    baseStats: CharacterStats;
    @Type(() => CharacterStats)
    battleStats: CharacterStats; //includes equipment, buffs, etc
    @Type(() => BattleInfo)
    battleInfo: BattleInfo;
    isAvailable: boolean;
    @Type(() => God)
    assignedGod1: God;
    @Type(() => God)
    assignedGod2: God;
    exp: number;
    expToNextLevel: number;

    constructor(type?: CharacterEnum) {      
        this.type = type === undefined ? CharacterEnum.none : type;  
        this.battleInfo = new BattleInfo();
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 1000;

        if (type === CharacterEnum.Warrior)
        {         
            this.battleInfo = new BattleInfo(type);
        }
    }
}
