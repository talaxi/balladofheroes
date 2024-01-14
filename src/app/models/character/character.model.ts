import { Type } from "class-transformer";
import { BattleInfo } from "../battle/battle-info.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { OverdriveNameEnum } from "../enums/overdrive-name-enum.model";
import { EquipmentSet } from "../resources/equipment-set.model";
import { Ability } from "./ability.model";
import { CharacterStats } from "./character-stats.model";
import { OverdriveInfo } from "./overdrive-info.model";
import { LinkInfo } from "./link-info.model";
import { TrackedStats } from "./tracked-stats.model";

export class Character {
    name: string;
    level: number;
    maxLevel: number;
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
    @Type(() => Ability)
    abilityList: Ability[];
    @Type(() => EquipmentSet)
    equipmentSet: EquipmentSet;
    @Type(() => OverdriveInfo)
    overdriveInfo: OverdriveInfo;  
    @Type(() => LinkInfo)
    linkInfo: LinkInfo;  
    unlockedOverdrives: OverdriveNameEnum[];
    @Type(() => TrackedStats)
    trackedStats: TrackedStats;
    targeting: Character | undefined;    
    @Type(() => CharacterStats)
    permanentStatGain: CharacterStats;
    @Type(() => Ability)
    permanentAbilityUpgrades: Ability[];
    permanentAbility1GainCount: [number, number][];
    permanentAbility2GainCount: [number, number][];
    permanentPassiveGainCount: [number, number][];

    constructor(type?: CharacterEnum) {
        this.type = type === undefined ? CharacterEnum.None : type;
        this.battleInfo = new BattleInfo();
        this.level = 1;
        this.maxLevel = 30;
        this.exp = 0;
        this.expToNextLevel = 100;
        this.assignedGod1 = GodEnum.None;
        this.assignedGod2 = GodEnum.None;
        this.battleStats = new CharacterStats(0, 0, 0, 0, 0, 0);

        this.battleInfo = new BattleInfo(type);
        this.equipmentSet = new EquipmentSet();
        this.overdriveInfo = new OverdriveInfo();
        this.linkInfo = new LinkInfo();

        this.abilityList = [];
        this.trackedStats = new TrackedStats();
        this.unlockedOverdrives = [OverdriveNameEnum.Smash];
        this.permanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
        this.permanentAbilityUpgrades = [];
        this.permanentAbility1GainCount = [];
        this.permanentAbility2GainCount = [];
        this.permanentPassiveGainCount = [];
    }    
}
