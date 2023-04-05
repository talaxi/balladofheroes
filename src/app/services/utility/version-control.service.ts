import { Injectable } from '@angular/core';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GlobalService } from '../global/global.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  constructor(public globalService: GlobalService, private utilityService: UtilityService) { }

  //add to this in descending order
  gameVersions = [0.3];

  getCurrentVersion() {
    return this.gameVersions[0];
  }

  getListAscended() {
    var ascendedList: number[] = [];

    this.gameVersions.forEach(item => {
      ascendedList.unshift(item);
    });

    return ascendedList;
  }

  getLatestChanges() {
    return this.getVersionChanges(this.gameVersions[0]);
  }

  getAllChanges() {
    var allChanges: string[] = [];
    this.gameVersions.forEach(version => {
      allChanges.push(this.getVersionChanges(version));
    });
    return allChanges;
  }

  getVersionChanges(version: number) {
    var changes = "";

    if (version === 0.3)
      changes = "Initial Launch!";

    /*if (version === 1.00)
      changes = "Initial Launch!";
    if (version === 1.01)
      changes = "Improved UI by adding better notifications and refactoring some clickable text.\n\n" +
        "Breeding Grounds specialization now grants a 10% bonus to Breeding XP from Training, up from 5%.\n\n" +
        "Refactored Breed Progression:\n" +
        "<ul><li>Breed Levels now grant a 5% bonus to racing stats as opposed to 2%. Breed Levels now require twice as much XP.</li>" +
        "<li>Animals have had their breed levels reduced by half to balance this change. Despite this, you should notice a small increase in stats.</li></ul>";
   */
    return changes;
  }

  getDateForVersion(version: number) {
    var date = new Date();
    /*if (version === 1.00)
      date = new Date('2022-07-08 12:00:00');
    if (version === 1.01)
      date = new Date('2022-07-10 12:00:00');*/

    return date.toDateString().replace(/^\S+\s/, '');
  }

  updatePlayerVersion() {
    //TODO remove this after next deploy
    var adventurer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer);
    if (adventurer !== undefined)
      adventurer.battleInfo.timeToAutoAttack = this.utilityService.quickAutoAttackSpeed;

    var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
    if (warrior !== undefined)
      warrior.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;

    var archer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
    if (archer !== undefined)
      archer.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;

    this.getListAscended().forEach(version => {
      if (this.globalService.globalVar.currentVersion < version) {
        if (version === .4) {

        }

        /*if (version === 1.01) {
          this.globalService.globalVar.notifications = new Notifications();
          var breedLevelStatModifier = this.globalService.globalVar.modifiers.find(item => item.text === "breedLevelStatModifier");
          if (breedLevelStatModifier !== undefined)
            breedLevelStatModifier.value = .05;

          var breedGaugeMaxIncreaseModifier = this.globalService.globalVar.modifiers.find(item => item.text === "breedGaugeMaxIncreaseModifier");
          if (breedGaugeMaxIncreaseModifier !== undefined)
            breedGaugeMaxIncreaseModifier.value = 10;

          var breedingGroundsSpecializationModifier = this.globalService.globalVar.modifiers.find(item => item.text === "breedingGroundsSpecializationModifier");
          if (breedingGroundsSpecializationModifier !== undefined)
            breedingGroundsSpecializationModifier.value = .10;

          this.globalService.globalVar.animals.forEach(animal => {
            animal.breedLevel = Math.round(animal.breedLevel / 2);
            animal.breedGaugeXp = animal.breedGaugeXp * 2;
          });

          var primaryDeck = this.globalService.globalVar.animalDecks.find(item => item.isPrimaryDeck);
          if (primaryDeck !== null && primaryDeck !== undefined) {
            primaryDeck.isEventDeck = true;
          }
        } */

        this.globalService.globalVar.currentVersion = version;
      }
    });
  }
}
