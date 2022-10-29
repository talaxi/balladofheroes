import { Type } from "class-transformer";
import { BattleInfo } from "../battle/battle-info.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { EquipmentSet } from "../resources/equipment-set.model";
import { Ability } from "./ability.model";
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
    assignedGod1: GodEnum;    
    assignedGod2: GodEnum;
    exp: number;
    expToNextLevel: number;
    abilityList: Ability[];
    @Type(() => EquipmentSet)
    equipmentSet: EquipmentSet;

    constructor(type?: CharacterEnum) {      
        this.type = type === undefined ? CharacterEnum.none : type;  
        this.battleInfo = new BattleInfo();
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 1000;
        this.assignedGod1 = GodEnum.None;
        this.assignedGod2 = GodEnum.None;

        this.battleInfo = new BattleInfo(type);        
        this.equipmentSet = new EquipmentSet();
    }       
}
