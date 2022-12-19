import { Injectable } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from '../achievements/achievement.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(private globalService: GlobalService, private achievementService: AchievementService) { }

  initializeVariables() {
    this.initializeBallads(); //need to initialize the connections and names so you have a place to store kill count
    this.initializeSettings();    
  }

  initializeBallads() {
    var championBallad = new Ballad(BalladEnum.Champion);
    championBallad.isSelected = true;
    championBallad.isAvailable = true;

    var aigosthena = new Zone();
    aigosthena.zoneName = "Aigosthena"; //TODO: can be replaced using enum to save space
    aigosthena.type = ZoneEnum.Aigosthena;
    aigosthena.isAvailable = true;
    aigosthena.isSelected = true;

    var upperCoast = new SubZone(SubZoneEnum.AigosthenaUpperCoast);
    upperCoast.isSelected = true;
    upperCoast.isAvailable = true;
    this.globalService.globalVar.playerNavigation.currentSubzone = upperCoast;
    this.achievementService.createDefaultAchievementsForSubzone(upperCoast.type).forEach(achievement => {
      this.globalService.globalVar.achievements.push(achievement);
    });

    aigosthena.subzones.push(upperCoast);

    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaBay));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaLowerCoast));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaWesternWoodlands));
    aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaHeartOfTheWoods));
    //aigosthena.subzones.push(new SubZone(SubZoneEnum.AigosthenaEasternWoodlands));

    championBallad.zones.push(aigosthena);
    this.globalService.globalVar.ballads.push(championBallad);

    var gorgonBallad = new Ballad(BalladEnum.Gorgon);
    var dodona = new Zone();
    dodona.zoneName = "Road to Dodona";
    dodona.type = ZoneEnum.Dodona;
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaDelphi));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaDelphiOutskirts));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaCoastalRoadsOfLocris));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaCountryside));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainOpening));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainPassOne));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaLakeTrichonida));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaMountainPassTwo));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaAmbracianGulf));
    dodona.subzones.push(new SubZone(SubZoneEnum.DodonaArta));

    var libya = new Zone();
    libya.zoneName = "Isle of Libya";
    libya.type = ZoneEnum.Libya;
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaBeach));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaRockyOutcrops));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaDeeperPath));
    libya.subzones.push(new SubZone(SubZoneEnum.LibyaIsleCenter));

    gorgonBallad.zones.push(dodona);
    gorgonBallad.zones.push(libya);
    this.globalService.globalVar.ballads.push(gorgonBallad);

    this.globalService.globalVar.ballads.push(new Ballad(BalladEnum.Underworld));
  }

  initializeSettings() {
    this.globalService.globalVar.settings.set("autoProgress", false);    
  }

  devMode() {
    this.globalService.globalVar.currentStoryId = 10000;
    
    this.globalService.globalVar.activePartyMember1 = CharacterEnum.Adventurer;
    this.globalService.globalVar.characters.forEach(character => { character.isAvailable = true; });
    this.globalService.globalVar.activePartyMember2 = CharacterEnum.Archer;
    this.globalService.globalVar.itemBeltSize = 4;

    var character1 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember1);
    if (character1 !== undefined) {
      //character1.assignedGod1 = GodEnum.Athena;
      character1.assignedGod1 = GodEnum.Hermes;
    }

    var character2 = this.globalService.globalVar.characters.find(item => item.type === this.globalService.globalVar.activePartyMember2);

    if (character2 !== undefined) {
      //character2.assignedGod1 = GodEnum.Artemis;
      character2.assignedGod1 = GodEnum.Apollo;
    }

    character1?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    character2?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
    athena!.isAvailable = true;
    athena?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
    hermes!.isAvailable = true;
    hermes?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
    apollo!.isAvailable = true;
    apollo?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
    artemis!.isAvailable = true;
    artemis?.abilityList.forEach(ability => {
      ability.isAvailable = true;
    });

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.type !== BalladEnum.Underworld)
        ballad.isAvailable = true;
        ballad.showNewNotification=true;
      ballad.zones.forEach(zone => {
        zone.isAvailable = true;
        zone.showNewNotification=true;
        zone.subzones.forEach(subzone => {
          subzone.isAvailable = true;
          subzone.showNewNotification =true;
          if (subzone.type !== SubZoneEnum.AigosthenaUpperCoast) {
            this.achievementService.createDefaultAchievementsForSubzone(subzone.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
            });
          }
        })
      })
    });

    //console.log(this.globalService.globalVar.achievements);
  }
}
