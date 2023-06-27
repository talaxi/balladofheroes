import { CharacterEnum } from "../enums/character-enum.model";
import { GodEnum } from "../enums/god-enum.model";
import { EquipmentSet } from "../resources/equipment-set.model";

export class Loadout {
    name: string;
    character1: CharacterEnum;
    god1Character1: GodEnum;
    god2Character1: GodEnum;
    character1EquipmentSet: EquipmentSet; 
    character2: CharacterEnum;
    god1Character2: GodEnum;
    god2Character2: GodEnum;
    character2EquipmentSet: EquipmentSet;

    constructor() {
        this.name = "Loadout";
        this.character1EquipmentSet = new EquipmentSet();
        this.character2EquipmentSet = new EquipmentSet();
    }
}
