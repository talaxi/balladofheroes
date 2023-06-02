import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from 'src/app/models/character/character.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { GlobalService } from '../global/global.service';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  selectedMenuDisplay: MenuEnum;
  selectedCharacter: CharacterEnum;
  selectedGod: GodEnum;
  selectedProfession: ProfessionEnum;
  keybindModalOpen: boolean = false;
  inTextbox: boolean = false;

  partyMember1: BehaviorSubject<CharacterEnum>;
  partyMember2: BehaviorSubject<CharacterEnum>;
  updateParty: boolean = false;

  selectedBestiaryBallad: Ballad | undefined;
  selectedBestiaryZone: Zone | undefined;
  selectedBestiarySubzone: SubZone | undefined;

  constructor(private globalService: GlobalService) { 
    this.selectedMenuDisplay = MenuEnum.Characters;
    this.selectedCharacter = CharacterEnum.None;
    this.selectedGod = GodEnum.None;

    this.partyMember1 = new BehaviorSubject<CharacterEnum>(this.globalService.globalVar.activePartyMember1);
    this.partyMember2 = new BehaviorSubject<CharacterEnum>(this.globalService.globalVar.activePartyMember2);
  }

  setSelectedCharacter(characterType: CharacterEnum) {
    this.selectedCharacter = characterType;
    this.selectedGod = GodEnum.None;
    this.selectedProfession = ProfessionEnum.None;
  }

  setSelectedGod(godType: GodEnum) {
    this.selectedCharacter = CharacterEnum.None;
    this.selectedGod = godType;
    this.selectedProfession = ProfessionEnum.None;
  }

  setSelectedProfession(profession: ProfessionEnum) {
    this.selectedCharacter = CharacterEnum.None;
    this.selectedGod = GodEnum.None;
    this.selectedProfession = profession;
  }

  setNewPartyMember1(newCharacterType: CharacterEnum): void {
    if (newCharacterType !== this.partyMember1.value)
      this.partyMember1.next(newCharacterType);
  }

  getNewPartyMember1(): Observable<CharacterEnum> {
    return this.partyMember1.asObservable();
  }

  setNewPartyMember2(newCharacterType: CharacterEnum): void {
    if (newCharacterType !== this.partyMember1.value)
      this.partyMember2.next(newCharacterType);
  }

  getNewPartyMember2(): Observable<CharacterEnum> {
    return this.partyMember2.asObservable();
  }

  setBestiaryPresets(ballad: Ballad | undefined, zone: Zone | undefined, subzone: SubZone | undefined) {
    this.selectedBestiaryBallad = ballad;
    this.selectedBestiaryZone = zone;
    this.selectedBestiarySubzone = subzone;
  }
}
