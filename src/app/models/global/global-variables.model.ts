import { Type } from "class-transformer";
import { Battle } from "../battle/battle.model";
import { Character } from "../character/character.model";
import { God } from "../character/god.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";
import { ResourceValue } from "../resources/resource-value.model";
import { Ballad } from "../zone/ballad.model";
import { PlayerNavigation } from "../zone/player-navigation.model";
import { Zone } from "../zone/zone.model";

export class GlobalVariables {
    lastTimeStamp: number;
    @Type(() => Character)
    characters: Character[];
    @Type(() => God)
    gods: God[];
    @Type(() => Ballad)
    ballads: Ballad[];
    resources: ResourceValue[];
    activePartyMember1: CharacterEnum;
    activePartyMember2: CharacterEnum;
    activeBattle: Battle;
    playerNavigation: PlayerNavigation;
    itemBeltSize: number;
    itemBelt: ItemsEnum[];

    constructor() {
        this.lastTimeStamp = 0;
        this.characters = [];
        this.gods = [];
        this.ballads = [];
        this.resources = [];
        this.itemBelt = [];
        this.itemBeltSize = 1;
        this.activeBattle = new Battle();
        this.playerNavigation = new PlayerNavigation();
    }
}
