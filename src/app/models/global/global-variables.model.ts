import { Type } from "class-transformer";
import { Battle } from "../battle/battle.model";
import { Character } from "../character/character.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { Ballad } from "../zone/ballad.model";
import { PlayerNavigation } from "../zone/player-navigation.model";
import { Zone } from "../zone/zone.model";

export class GlobalVariables {
    lastTimeStamp: number;
    @Type(() => Character)
    characters: Character[];
    @Type(() => Ballad)
    ballads: Ballad[];
    activePartyMember1: CharacterEnum;
    activePartyMember2: CharacterEnum;
    activePartyMember3: CharacterEnum;
    activeBattle: Battle | undefined;
    playerNavigation: PlayerNavigation;

    constructor() {
        this.lastTimeStamp = 0;
        this.characters = [];
        this.ballads = [];
        this.activeBattle = new Battle();
        this.playerNavigation = new PlayerNavigation();
    }
}
