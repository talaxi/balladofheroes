import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { DpsCalculatorService } from '../battle/dps-calculator.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class BalladService {

  constructor(private globalService: GlobalService, private gameLogService: GameLogService, private dpsCalculatorService: DpsCalculatorService,
    private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService, private deviceDetectorService: DeviceDetectorService,
    public dialog: MatDialog) { }

  getBalladName(type?: BalladEnum) {
    var name = "";

    if (type === BalladEnum.Champion)
      name = "Ballad of a Champion";
    if (type === BalladEnum.Gorgon)
      name = "Ballad of the Gorgon";
    if (type === BalladEnum.Labors)
      name = "Ballad of the Labors";
    if (type === BalladEnum.Underworld)
      name = "Ballad of the Underworld";
    if (type === BalladEnum.Boar)
      name = "Ballad of the Boar";
    if (type === BalladEnum.Argo)
      name = "Ballad of the Argo";

    return name;
  }

  getActiveBallad() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    return activeBallad;
  }

  getActiveZone() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    var zone = activeBallad?.zones.find(item => item.isSelected);
    return zone;
  }

  getActiveSubZone(search: boolean = false) {
    var subzone = new SubZone();

    if (this.globalService.globalVar.playerNavigation.currentSubzone === undefined || search) {
      var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
      if (activeBallad !== undefined) {
        var zone = activeBallad.zones.find(item => item.isSelected);
        if (zone !== undefined) {
          if (zone.subzones.some(item => item.isSelected))
            subzone = zone.subzones.find(item => item.isSelected)!;
        }
      }
    }
    else {
      subzone = this.globalService.globalVar.playerNavigation.currentSubzone;
    }

    return subzone;
  }

  setActiveSubZone(type: SubZoneEnum) {
    var relatedZone: Zone | undefined = this.getActiveZone();
    var relatedBallad: Ballad | undefined = this.getActiveBallad();
    var relatedSubzone: SubZone = this.getActiveSubZone();

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
      ballad.zones.forEach(zone => {
        zone.isSelected = false;
        zone.subzones.forEach(subzone => {
          subzone.isSelected = false;

          if (subzone.type === type) {
            relatedZone = zone;
            relatedBallad = ballad;
            relatedSubzone = subzone;
          }
        })
      })
    });

    relatedSubzone.isSelected = true;
    relatedSubzone.notify = false;
    if (relatedZone !== undefined) {
      relatedZone.isSelected = true;
      relatedZone.notify = false;
    }
    if (relatedBallad !== undefined) {
      relatedBallad.isSelected = true;
      relatedBallad.notify = false;
    }
    this.globalService.globalVar.playerNavigation.currentSubzone = relatedSubzone;
    this.globalService.resetCooldowns();

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + this.getSubZoneName(relatedSubzone.type) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.dpsCalculatorService.xpGain = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();

    if (!this.isSubzoneTown(relatedSubzone.type)) {
      var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(relatedSubzone.type);
      if (enemyOptions.length > 0) {
        var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
        this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
      }
    }
  }

  findBallad(type: BalladEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.type === type)
        returnBallad = ballad;
    });

    return returnBallad;
  }

  findZone(type: ZoneEnum) {
    var returnZone: Zone | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type === type)
          returnZone = zone;
      })
    });

    return returnZone;
  }

  findBalladOfSubzone(type: SubZoneEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnBallad = ballad;
        })
      })
    });

    return returnBallad;
  }

  findSubzone(type: SubZoneEnum) {
    var returnSubzone: SubZone | undefined;
    var subzoneFound = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (!subzoneFound) {
        ballad.zones.forEach(zone => {
          if (!subzoneFound) {
            zone.subzones.forEach(subzone => {
              if (subzone.type === type) {
                returnSubzone = subzone;
                subzoneFound = true;
              }
            });
          }
        });
      }
    });

    return returnSubzone;
  }

  isSubzoneInBallad(type: SubZoneEnum, balladType: BalladEnum) {
    var inBallad = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (balladType.toString() === ballad.type.toString()) {
        ballad.zones.forEach(zone => {
          zone.subzones.forEach(subzone => {
            if (subzone.type === type)
              inBallad = true;
          });
        });
      }
    });

    return inBallad;
  }

  isZoneInBallad(type: ZoneEnum, balladType: BalladEnum) {
    var inBallad = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (balladType.toString() === ballad.type.toString()) {
        ballad.zones.forEach(zone => {
          if (zone.type === type)
            inBallad = true;
        });
      }
    });

    return inBallad;
  }

  isSubzoneInZone(type: SubZoneEnum, zoneType: ZoneEnum) {
    var inZone = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type.toString() === zoneType.toString()) {
          zone.subzones.forEach(subzone => {
            if (subzone.type === type)
              inZone = true;
          });
        }
      });
    });

    return inZone;
  }

  selectNextSubzone() {
    var nextSubzoneFound = false;
    var reverseOrderBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable).slice().reverse();
    reverseOrderBallads.forEach(ballad => {
      if (!nextSubzoneFound) {
        var reverseZones = ballad.zones.filter(item => item.isAvailable).slice().reverse();
        reverseZones.forEach(zone => {
          var reverseSubzones = zone.subzones.filter(item => item.isAvailable).slice().reverse();
          reverseSubzones.forEach(subzone => {
            if (!nextSubzoneFound && subzone.type !== SubZoneEnum.CalydonAltarOfAsclepius && !this.isSubzoneTown(subzone.type) &&
              this.getVictoriesNeededToProceed(subzone.type) - subzone.victoryCount > 0) {
              nextSubzoneFound = true;
              this.selectBallad(ballad)
              this.selectZone(zone);
              this.selectSubZone(subzone, zone);
            }
          });
        })
      }
    });
  }

  selectBallad(ballad: Ballad) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
    });

    ballad.isSelected = true;
    ballad.notify = false;
    return ballad.zones.filter(item => item.isAvailable);
  }

  selectZone(zone: Zone) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          zone.isSelected = false;
        });
    });

    zone.isSelected = true;
    zone.notify = false;
    return zone.subzones.filter(item => item.isAvailable);
  }

  selectSubZone(subzone: SubZone, zone: Zone) {
    if (this.isSubZoneToBeContinued(subzone)) {
      return;
    }

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.forEach(subzone => {
              subzone.isSelected = false;
            });
        });
    });

    subzone.isSelected = true;
    subzone.notify = false;
    this.globalService.globalVar.playerNavigation.currentSubzone = subzone;
    this.globalService.resetCooldowns();

    var gameLogEntry = "You move to <strong>" + zone.zoneName + " - " + this.getSubZoneName(subzone.type) + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);
    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.dpsCalculatorService.xpGain = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();

    if (this.isSubzoneTown(subzone.type)) {
      this.globalService.globalVar.settings.set("autoProgress", false);
    }

    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
    if (enemyOptions.length > 0) {
      var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
      this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
    }

    if (this.deviceDetectorService.isMobile()) {
      this.dialog.closeAll();
    }
  }

  isSubZoneToBeContinued(subzone: SubZone) {
    //if (subzone.type === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
    //return true;

    return false;
  }

  getSubZoneName(type: SubZoneEnum) {
    var name = "";

    if (type === SubZoneEnum.AigosthenaUpperCoast)
      name = "Upper Coast";
    if (type === SubZoneEnum.AigosthenaBay)
      name = "Bay";
    if (type === SubZoneEnum.AigosthenaLowerCoast)
      name = "Lower Coast";
    if (type === SubZoneEnum.AigosthenaWesternWoodlands)
      name = "Western Woodlands";
    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods)
      name = "Heart of the Woods";

    if (type === SubZoneEnum.DodonaDelphi)
      name = "Delphi";
    if (type === SubZoneEnum.DodonaDelphiOutskirts)
      name = "Delphi Outskirts";
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      name = "Coastal Roads of Locris";
    if (type === SubZoneEnum.DodonaCountryside)
      name = "Countryside";
    if (type === SubZoneEnum.DodonaMountainOpening)
      name = "Mountain Opening";
    if (type === SubZoneEnum.DodonaMountainPassOne)
      name = "Mountain Pass 1";
    if (type === SubZoneEnum.DodonaLakeTrichonida)
      name = "Lake Trichonida";
    if (type === SubZoneEnum.DodonaMountainPassTwo)
      name = "Mountain Pass 2";
    if (type === SubZoneEnum.DodonaAmbracianGulf)
      name = "Ambracian Gulf";
    if (type === SubZoneEnum.DodonaArta)
      name = "Arta";
    if (type === SubZoneEnum.LibyaBeach)
      name = "Beach";
    if (type === SubZoneEnum.LibyaRockyOutcrops)
      name = "Rocky Outcrops";
    if (type === SubZoneEnum.LibyaDeeperPath)
      name = "Deeper Path";
    if (type === SubZoneEnum.LibyaIsleCenter)
      name = "Isle Center";
    if (type === SubZoneEnum.NemeaCountryRoadsOne)
      name = "Country Roads";
    if (type === SubZoneEnum.NemeaCountryRoadsTwo)
      name = "Country Roads";
    if (type === SubZoneEnum.NemeaRollingHills)
      name = "Rolling Hills";
    if (type === SubZoneEnum.NemeaLairOfTheLion)
      name = "Lair of the Lion";
    if (type === SubZoneEnum.AsphodelPalaceOfHades)
      name = "Palace of Hades";
    if (type === SubZoneEnum.AsphodelTheDepths)
      name = "The Depths";
    if (type === SubZoneEnum.AsphodelForgottenHalls)
      name = "Forgotten Halls";
    if (type === SubZoneEnum.AsphodelLostHaven)
      name = "Lost Haven";
    if (type === SubZoneEnum.AsphodelEndlessStaircase)
      name = "Endless Staircase";
    if (type === SubZoneEnum.AsphodelFieryPassage)
      name = "Fiery Passage";
    if (type === SubZoneEnum.AsphodelDarkenedMeadows)
      name = "Darkened Meadows";
    if (type === SubZoneEnum.AsphodelLetheBasin)
      name = "Lethe Basin";
    if (type === SubZoneEnum.AsphodelLetheTributary)
      name = "Lethe Tributary";
    if (type === SubZoneEnum.ElysiumElysianFields)
      name = "Elysian Fields";
    if (type === SubZoneEnum.ElysiumOpenPlains)
      name = "Open Plains";
    if (type === SubZoneEnum.ElysiumColiseum)
      name = "Coliseum";
    if (type === SubZoneEnum.ElysiumGatesOfHornAndIvory)
      name = "Gates of Horn and Ivory";
    if (type === SubZoneEnum.PeloposNisosGatesOfTheUnderworld)
      name = "Gates of the Underworld";
    if (type === SubZoneEnum.PeloposNisosArcadianRoads)
      name = "Arcadian Roads";
    if (type === SubZoneEnum.PeloposNisosTravelPost)
      name = "Travel Post";
    if (type === SubZoneEnum.PeloposNisosFootOfTheMountain)
      name = "Foot of the Mountain";
    if (type === SubZoneEnum.PeloposNisosSteepAscent)
      name = "Steep Ascent";
    if (type === SubZoneEnum.PeloposNisosMountParthenionCaverns)
      name = "Mt. Parthenion Caverns";
    if (type === SubZoneEnum.PeloposNisosValleyOpening)
      name = "Valley Opening";
    if (type === SubZoneEnum.PeloposNisosTrekAcrossArcadia)
      name = "Trek Across Arcadia";
    if (type === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      name = "Trek Across Acheae";
    if (type === SubZoneEnum.PeloposNisosPatrasBorder)
      name = "Patras Border";
    if (type === SubZoneEnum.CalydonTownMarket)
      name = "Town Market";
    if (type === SubZoneEnum.CalydonAltarOfAsclepius)
      name = "Altar of Asclepius";
    if (type === SubZoneEnum.ElysiumWindingPaths)
      name = "Winding Paths";
    if (type === SubZoneEnum.ElysiumWaterloggedMarsh)
      name = "Water-logged Marsh";
    if (type === SubZoneEnum.ElysiumWavesOfOceanus)
      name = "Waves of Oceanus";
    if (type === SubZoneEnum.CalydonForestPassage)
      name = "Forest Passage";
    if (type === SubZoneEnum.CalydonHeavyThicket)
      name = "Heavy Thicket";
    if (type === SubZoneEnum.CalydonWelltroddenPathway)
      name = "Well-trodden Pathway";
    if (type === SubZoneEnum.CalydonSparseClearing)
      name = "Sparse Clearing";
    if (type === SubZoneEnum.CalydonShroudedFoliage)
      name = "Shrouded Foliage";
    if (type === SubZoneEnum.CalydonBabblingStream)
      name = "Babbling Stream";
    if (type === SubZoneEnum.CalydonMudpit)
      name = "Mudpit";
    if (type === SubZoneEnum.CalydonMarkedTreeTrail)
      name = "Marked Tree Trail";
    if (type === SubZoneEnum.CalydonOvergrownVerdure)
      name = "Overgrown Verdure";
    if (type === SubZoneEnum.CalydonWornDownBarn)
      name = "Worn Down Barn";
    if (type === SubZoneEnum.CalydonWateringHole)
      name = "Watering Hole";
    if (type === SubZoneEnum.CalydonTallGrass)
      name = "Tall Grass";
    if (type === SubZoneEnum.CalydonDeadEnd)
      name = "Dead End";
    if (type === SubZoneEnum.TheLetheLetheBasin2)
      name = "Lethe Basin 2";
    if (type === SubZoneEnum.TheLetheFerryRide)
      name = "Ferry Ride";
    if (type === SubZoneEnum.TheLetheRiverDivergence)
      name = "River Divergence";
    if (type === SubZoneEnum.TheLetheStillWaters)
      name = "Still Waters";
    if (type === SubZoneEnum.TheLetheHypnosIsland)
      name = "Hypnos' Island";
    if (type === SubZoneEnum.AegeanSeaIolcus)
      name = "Iolcus";
    if (type === SubZoneEnum.AegeanSeaOpenSeas)
      name = "Open Seas";
    if (type === SubZoneEnum.AegeanSeaIslandOfLemnos)
      name = "Island of Lemnos";
    if (type === SubZoneEnum.AegeanSeaIslandOfImbros)
      name = "Island of Imbros";
    if (type === SubZoneEnum.AegeanSeaHellespointPassage1)
      name = "Hellespoint Passage 1";
    if (type === SubZoneEnum.AegeanSeaPropontis)
      name = "Propontis";
    if (type === SubZoneEnum.AegeanSeaHellespointPassage2)
      name = "Hellespoint Passage 2";
    if (type === SubZoneEnum.AegeanSeaCoastalThrace)
      name = "Coastal Thrace";
    if (type === SubZoneEnum.AegeanSeaSalmydessus)
      name = "Salmydessus";
    if (type === SubZoneEnum.AegeanSeaDesertedPath)
      name = "Deserted Path";
    if (type === SubZoneEnum.AegeanSeaRockyOverhang)
      name = "Rocky Overhang";
    if (type === SubZoneEnum.AegeanSeaSympegadesOverlook)
      name = "Sympegades Overlook";
    if (type === SubZoneEnum.BlackSeaStillWaters)
      name = "Still Waters";
    if (type === SubZoneEnum.BlackSeaMariandyna)
      name = "Mariandyna";
    if (type === SubZoneEnum.BlackSeaUnderAssault)
      name = "Under Assault";
    if (type === SubZoneEnum.BlackSeaSeaEscape)
      name = "Sea Escape";
    if (type === SubZoneEnum.BlackSeaStormySkies)
      name = "Stormy Skies";
    if (type === SubZoneEnum.BlackSeaAreonesosPassing)
      name = "Areonesos Passing";
    if (type === SubZoneEnum.BlackSeaWindyGale)
      name = "Windy Gale";
    if (type === SubZoneEnum.ColchisCityCenter)
      name = "City Center";
    if (type === SubZoneEnum.ColchisGroveOfAres)
      name = "Grove of Ares";
    if (type === SubZoneEnum.ColchisReinforcementsFromAeetes)
      name = "Aeëtes' Reinforcements";
    if (type === SubZoneEnum.ColchisHurriedRetreat1)
      name = "Hurried Retreat 1";
    if (type === SubZoneEnum.ColchisHurriedRetreat2)
      name = "Hurried Retreat 2";
      if (type === SubZoneEnum.NemeaCleonea)
      name = "Cleonea";
    if (type === SubZoneEnum.NemeaCountryRoadsTwo)
      name = "Country Roads";
    if (type === SubZoneEnum.NemeaRollingHills)
      name = "Rolling Hills";
    if (type === SubZoneEnum.NemeaFlatlands)
      name = "Flatlands";
    if (type === SubZoneEnum.NemeaLairOfTheLion)
      name = "Lair of the Lion";
    if (type === SubZoneEnum.LernaAroundTheInachus)
      name = "Around the Inachus";
      if (type === SubZoneEnum.LernaThickMarsh)
      name = "Thick Marsh";
      if (type === SubZoneEnum.LernaSwampySurroundings)
      name = "Swampy Surroundings";
      if (type === SubZoneEnum.LernaDarkenedThicket)
      name = "Darkened Thicket";
      if (type === SubZoneEnum.LernaSpringOfAmymone)
      name = "Spring of Amymone";
      if (type === SubZoneEnum.StymphaliaTiryns)
      name = "Tiryns";
      if (type === SubZoneEnum.StymphaliaArcadianWilderness)
      name = "Arcadian Wilderness";
      if (type === SubZoneEnum.StymphaliaAbandonedVillage)
      name = "Abandoned Village";
      if (type === SubZoneEnum.StymphaliaSourceOfTheLadon)
      name = "Source of the Ladon";
      if (type === SubZoneEnum.StymphaliaLakeStymphalia)
      name = "Lake Stymphalia";
      if (type === SubZoneEnum.ErymanthusLadonRiverbeds)
      name = "Ladon Riverbeds";
      if (type === SubZoneEnum.ErymanthusGreatMassif)
      name = "Great Massif";
      if (type === SubZoneEnum.ErymanthusCragInlet)
      name = "Crag Inlet";
      if (type === SubZoneEnum.ErymanthusMountainClimb)
      name = "Mountain Climb";
      if (type === SubZoneEnum.ErymanthusSnowCappedPeaks)
      name = "Snow-capped Peaks";
      if (type === SubZoneEnum.CoastOfCreteDownThePineios)
      name = "Down the Pineios";
      if (type === SubZoneEnum.CoastOfCreteElis)
      name = "Elis";
      if (type === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas)
      name = "Southeastern Ionian Seas";
      if (type === SubZoneEnum.CoastOfCreteCretanSeas)
      name = "Cretan Seas";
      if (type === SubZoneEnum.CoastOfCreteCretanCoast)
      name = "Cretan Coast";
      if (type === SubZoneEnum.CoastOfCreteVillageGardens)
      name = "Village Gardens";
      if (type === SubZoneEnum.CoastOfCreteAppleOrchards)
      name = "Apple Orchards";
      if (type === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas)
      name = "Southern Cretan Seas";
      if (type === SubZoneEnum.GardenOfTheHesperidesDesertSands)
      name = "Desert Sands";
      if (type === SubZoneEnum.GardenOfTheHesperidesSaharanDunes)
      name = "Saharan Dunes";
      if (type === SubZoneEnum.GardenOfTheHesperidesHiddenOasis)
      name = "Hidden Oasis";
      if (type === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast)
      name = "Moroccan Coast";
      if (type === SubZoneEnum.GardenOfTheHesperidesFertileFields)
      name = "Fertile Fields";
      if (type === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
      name = "Garden of the Hesperides";
      if (type === SubZoneEnum.ErytheiaLushValley)
      name = "Lush Valley";
      if (type === SubZoneEnum.ErytheiaWesternOceanWaters)
      name = "Western Ocean Waters";
      if (type === SubZoneEnum.ErytheiaPillarsOfHeracles)
      name = "Pillars of Heracles";
      if (type === SubZoneEnum.ErytheiaCadiz)
      name = "Cádiz";
      if (type === SubZoneEnum.ErytheiaIslandOfErytheia)
      name = "Island of Erytheia";
      if (type === SubZoneEnum.ErytheiaGeryonsFarm)
      name = "Geryon's Farm";

    return name;
  }

  getVictoriesNeededToProceed(type: SubZoneEnum) {
    var victories = 1;
    var testing = false;

    var aigosthenaVictories = 5;
    var defaultVictories = 10;
    var bossVictories = 1;
    var groveOfAresVictories = 25;

    if (testing) {
      aigosthenaVictories = 1;
      defaultVictories = 1;
    }

    if (type === SubZoneEnum.AigosthenaUpperCoast)
      victories = aigosthenaVictories;
    if (type === SubZoneEnum.AigosthenaBay)
      victories = aigosthenaVictories;
    if (type === SubZoneEnum.AigosthenaLowerCoast)
      victories = aigosthenaVictories;
    if (type === SubZoneEnum.AigosthenaWesternWoodlands)
      victories = aigosthenaVictories;
    if (type === SubZoneEnum.AigosthenaHeartOfTheWoods)
      victories = bossVictories;

    if (type === SubZoneEnum.DodonaDelphiOutskirts)
      victories = defaultVictories;
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      victories = defaultVictories;
    if (type === SubZoneEnum.DodonaCountryside)
      victories = bossVictories;
    if (type === SubZoneEnum.DodonaMountainOpening)
      victories = defaultVictories;
    if (type === SubZoneEnum.DodonaMountainPassOne)
      victories = defaultVictories;
    if (type === SubZoneEnum.DodonaLakeTrichonida)
      victories = bossVictories;
    if (type === SubZoneEnum.DodonaMountainPassTwo)
      victories = defaultVictories;
    if (type === SubZoneEnum.DodonaAmbracianGulf)
      victories = defaultVictories;

    if (type === SubZoneEnum.LibyaBeach)
      victories = defaultVictories;
    if (type === SubZoneEnum.LibyaRockyOutcrops)
      victories = defaultVictories;
    if (type === SubZoneEnum.LibyaDeeperPath)
      victories = bossVictories;
    if (type === SubZoneEnum.LibyaIsleCenter)
      victories = bossVictories;

    if (type === SubZoneEnum.NemeaCountryRoadsOne)
      victories = defaultVictories;

    if (type === SubZoneEnum.AsphodelTheDepths || type === SubZoneEnum.AsphodelForgottenHalls || type === SubZoneEnum.AsphodelEndlessStaircase ||
      type === SubZoneEnum.AsphodelFieryPassage || type === SubZoneEnum.AsphodelDarkenedMeadows || type === SubZoneEnum.AsphodelLetheBasin)
      victories = defaultVictories;

    if (type === SubZoneEnum.AsphodelLetheTributary)
      victories = bossVictories;

    if (type === SubZoneEnum.ElysiumElysianFields || type === SubZoneEnum.ElysiumOpenPlains || type === SubZoneEnum.ElysiumGatesOfHornAndIvory
      || type === SubZoneEnum.ElysiumWindingPaths || type === SubZoneEnum.ElysiumWaterloggedMarsh)
      victories = defaultVictories;

    if (type === SubZoneEnum.ElysiumWavesOfOceanus)
      victories = bossVictories;

    if (type === SubZoneEnum.PeloposNisosGatesOfTheUnderworld || type === SubZoneEnum.PeloposNisosArcadianRoads || type === SubZoneEnum.PeloposNisosFootOfTheMountain
      || type === SubZoneEnum.PeloposNisosSteepAscent || type === SubZoneEnum.PeloposNisosMountParthenionCaverns || type === SubZoneEnum.PeloposNisosValleyOpening
      || type === SubZoneEnum.PeloposNisosTrekAcrossArcadia || type === SubZoneEnum.PeloposNisosTrekAcrossAcheae)
      victories = defaultVictories;

    if (type === SubZoneEnum.PeloposNisosPatrasBorder)
      victories = bossVictories;

    if (type === SubZoneEnum.CalydonHeavyThicket || type === SubZoneEnum.CalydonForestPassage || type === SubZoneEnum.CalydonWelltroddenPathway ||
      type === SubZoneEnum.CalydonSparseClearing || type === SubZoneEnum.CalydonShroudedFoliage || type === SubZoneEnum.CalydonBabblingStream ||
      type === SubZoneEnum.CalydonMudpit || type === SubZoneEnum.CalydonMarkedTreeTrail || type === SubZoneEnum.CalydonOvergrownVerdure ||
      type === SubZoneEnum.CalydonWateringHole || type === SubZoneEnum.CalydonDeadEnd)
      victories = defaultVictories;

    if (type === SubZoneEnum.CalydonWornDownBarn || type === SubZoneEnum.CalydonTallGrass)
      victories = bossVictories;

    if (type === SubZoneEnum.TheLetheLetheBasin2 || type === SubZoneEnum.TheLetheFerryRide || type === SubZoneEnum.TheLetheRiverDivergence ||
      type === SubZoneEnum.TheLetheStillWaters)
      victories = defaultVictories;

    if (type === SubZoneEnum.TheLetheHypnosIsland)
      victories = bossVictories;

    if (type === SubZoneEnum.AegeanSeaOpenSeas || type === SubZoneEnum.AegeanSeaIslandOfLemnos || type === SubZoneEnum.AegeanSeaIslandOfImbros
      || type === SubZoneEnum.AegeanSeaHellespointPassage1 || type === SubZoneEnum.AegeanSeaPropontis || type === SubZoneEnum.AegeanSeaHellespointPassage2
      || type === SubZoneEnum.AegeanSeaCoastalThrace || type === SubZoneEnum.AegeanSeaDesertedPath || type === SubZoneEnum.AegeanSeaRockyOverhang)
      victories = defaultVictories;

    if (type === SubZoneEnum.AegeanSeaSympegadesOverlook)
      victories = bossVictories;

    if (type === SubZoneEnum.BlackSeaStillWaters || type === SubZoneEnum.BlackSeaStormySkies || type === SubZoneEnum.BlackSeaUnderAssault
      || type === SubZoneEnum.BlackSeaAreonesosPassing || type === SubZoneEnum.BlackSeaSeaEscape)
      victories = defaultVictories;

    if (type === SubZoneEnum.BlackSeaWindyGale)
      victories = bossVictories;

    if (type === SubZoneEnum.ColchisHurriedRetreat1 || type === SubZoneEnum.ColchisHurriedRetreat2)
      victories = defaultVictories;

    if (type === SubZoneEnum.ColchisReinforcementsFromAeetes)
      victories = bossVictories;

    if (type === SubZoneEnum.ColchisGroveOfAres)
      victories = groveOfAresVictories;

    if (type === SubZoneEnum.NemeaCountryRoadsTwo || type === SubZoneEnum.NemeaFlatlands || type === SubZoneEnum.NemeaRollingHills)
      victories = defaultVictories;
      
    if (type === SubZoneEnum.NemeaLairOfTheLion)
    victories = bossVictories;

    if (type === SubZoneEnum.LernaAroundTheInachus || type === SubZoneEnum.LernaThickMarsh || type === SubZoneEnum.LernaSwampySurroundings ||
      type === SubZoneEnum.LernaDarkenedThicket)
      victories = defaultVictories;
      
    if (type === SubZoneEnum.LernaSpringOfAmymone)
    victories = bossVictories;

    if (type === SubZoneEnum.StymphaliaArcadianWilderness || type === SubZoneEnum.StymphaliaAbandonedVillage || type === SubZoneEnum.StymphaliaSourceOfTheLadon)
      victories = defaultVictories;
      
      if (type === SubZoneEnum.StymphaliaLakeStymphalia)
      victories = bossVictories;

      if (type === SubZoneEnum.ErymanthusLadonRiverbeds || type === SubZoneEnum.ErymanthusGreatMassif || type === SubZoneEnum.ErymanthusCragInlet ||
        type === SubZoneEnum.ErymanthusMountainClimb)
      victories = defaultVictories;

      if (type === SubZoneEnum.ErymanthusSnowCappedPeaks)
      victories = bossVictories;

      if (type === SubZoneEnum.CoastOfCreteDownThePineios || type === SubZoneEnum.CoastOfCreteSoutheasternIonianSeas || type === SubZoneEnum.CoastOfCreteCretanCoast ||
        type === SubZoneEnum.CoastOfCreteCretanSeas || type === SubZoneEnum.CoastOfCreteVillageGardens)
      victories = defaultVictories;

      if (type === SubZoneEnum.CoastOfCreteAppleOrchards)
      victories = bossVictories;

      if (type === SubZoneEnum.GardenOfTheHesperidesDesertSands || type === SubZoneEnum.GardenOfTheHesperidesFertileFields || type === SubZoneEnum.GardenOfTheHesperidesHiddenOasis ||
        type === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts || type === SubZoneEnum.GardenOfTheHesperidesMoroccanCoast || type === SubZoneEnum.GardenOfTheHesperidesSaharanDunes
        || type === SubZoneEnum.GardenOfTheHesperidesSouthernCretanSeas)
      victories = defaultVictories;

      if (type === SubZoneEnum.GardenOfTheHesperidesGardenOfTheHesperides)
      victories = bossVictories;

      if (type === SubZoneEnum.ErytheiaLushValley || type === SubZoneEnum.ErytheiaPillarsOfHeracles || type === SubZoneEnum.ErytheiaWesternOceanWaters)
      victories = defaultVictories;

      if (type === SubZoneEnum.ErytheiaIslandOfErytheia || type === SubZoneEnum.ErytheiaGeryonsFarm)
      victories = bossVictories;

    return victories;
  }

  isSubzoneTown(type: SubZoneEnum) {
    if (type === SubZoneEnum.DodonaDelphi || type === SubZoneEnum.DodonaArta || type === SubZoneEnum.AsphodelPalaceOfHades ||
      type === SubZoneEnum.AsphodelLostHaven || type === SubZoneEnum.ElysiumColiseum || type === SubZoneEnum.PeloposNisosTravelPost ||
      type === SubZoneEnum.CalydonTownMarket || type === SubZoneEnum.AegeanSeaIolcus || type === SubZoneEnum.AegeanSeaSalmydessus ||
      type === SubZoneEnum.BlackSeaMariandyna || type === SubZoneEnum.ColchisCityCenter || type === SubZoneEnum.NemeaCleonea ||
      type === SubZoneEnum.StymphaliaTiryns || type === SubZoneEnum.CoastOfCreteElis || type === SubZoneEnum.ErytheiaCadiz) {
      return true;
    }

    return false;
  }

  shouldSubzoneShowSideQuestNotification(type: SubZoneEnum) {
    if (type === SubZoneEnum.ElysiumWindingPaths || type === SubZoneEnum.ElysiumWaterloggedMarsh || type === SubZoneEnum.ElysiumWavesOfOceanus ||
      type === SubZoneEnum.CalydonAltarOfAsclepius || type === SubZoneEnum.TheLetheLetheBasin2 || type === SubZoneEnum.TheLetheFerryRide ||
      type === SubZoneEnum.TheLetheRiverDivergence || type === SubZoneEnum.TheLetheStillWaters || type === SubZoneEnum.TheLetheHypnosIsland)
      return NotificationTypeEnum.SideQuest;

    return NotificationTypeEnum.Story;
  }

  isSubzoneSideQuest(type?: SubZoneEnum) {
    if (type === SubZoneEnum.CalydonAltarOfAsclepius) {
      return true;
    }

    return false;
  }

  isSubzoneColiseum(type: SubZoneEnum) {
    if (type === SubZoneEnum.ElysiumColiseum) {
      return true;
    }

    return false;
  }

  isBalladFullyAvailable(type: BalladEnum) {
    var isFullyAvailable = true;
    var ballad = this.findBallad(type);
    if (ballad === undefined)
      return false;

    ballad.zones.forEach(zone => {
      if (!zone.isAvailable || zone.subzones.some(subzone => !subzone.isAvailable))
        isFullyAvailable = false;
    })

    return isFullyAvailable;
  }

  isZoneFullyAvailable(type: ZoneEnum) {
    var isFullyAvailable = true;
    var zone = this.findZone(type);
    if (zone === undefined)
      return false;

    if (zone.subzones.some(subzone => !subzone.isAvailable))
      isFullyAvailable = false;

    return isFullyAvailable;
  }
}
