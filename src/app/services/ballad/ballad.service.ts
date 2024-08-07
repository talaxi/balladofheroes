import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';
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
import { CompletionStatusEnum } from 'src/app/models/enums/completion-status-enum.model';
import { MenuService } from '../menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class BalladService {

  constructor(private globalService: GlobalService, private gameLogService: GameLogService, private dpsCalculatorService: DpsCalculatorService,
    private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService, private deviceDetectorService: DeviceDetectorService,
    public dialog: MatDialog, private menuService: MenuService) { }

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
    if (type === BalladEnum.Olympus)
      name = "Ballad of Olympus";
    if (type === BalladEnum.Labyrinth)
      name = "Ballad of the Labyrinth";
    if (type === BalladEnum.Witch)
      name = "Ballad of the Witch";
    if (type === BalladEnum.Eagle)
      name = "Ballad of the Eagle";
    if (type === BalladEnum.Redemption)
      name = "Ballad of Redemption";
    if (type === BalladEnum.Time)
      name = "Ballad of Time";

    return name;
  }

  getShortBalladName(type?: BalladEnum) {
    var name = "";

    if (type === BalladEnum.Champion)
      name = "Champion";
    if (type === BalladEnum.Gorgon)
      name = "Gorgon";
    if (type === BalladEnum.Labors)
      name = "Labors";
    if (type === BalladEnum.Underworld)
      name = "Underworld";
    if (type === BalladEnum.Boar)
      name = "Boar";
    if (type === BalladEnum.Argo)
      name = "Argo";
    if (type === BalladEnum.Olympus)
      name = "Olympus";
    if (type === BalladEnum.Labyrinth)
      name = "Labyrinth";
    if (type === BalladEnum.Witch)
      name = "Witch";
    if (type === BalladEnum.Eagle)
      name = "Eagle";
    if (type === BalladEnum.Redemption)
      name = "Redemption";
    if (type === BalladEnum.Time)
      name = "Time";

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

    if (this.globalService.globalVar.playerNavigation.currentSubzone === undefined ||
      this.globalService.globalVar.playerNavigation.currentSubzone.type === SubZoneEnum.None || search) {
      var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
      if (activeBallad !== undefined) {
        var zone = activeBallad.zones.find(item => item.isSelected);
        if (zone !== undefined) {
          if (zone.subzones.some(item => item.isSelected))
            subzone = zone.subzones.find(item => item.isSelected)!;
        }
      }

      if (subzone.type === SubZoneEnum.None) {
        this.globalService.globalVar.ballads.forEach(ballad => {
          ballad.zones.forEach(zone => {
            zone.subzones.forEach(subzoneOption => {
              if (subzoneOption.isSelected)
                subzone = subzoneOption;
            })
          })
        })
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

    if (relatedSubzone.type === SubZoneEnum.WarForTheMountainStables) {
      this.globalService.globalVar.partyMember2Hidden = true;
      this.menuService.updateParty = true;
    }
    else {
      this.globalService.globalVar.partyMember2Hidden = false;
      this.menuService.updateParty = true;
    }

    if (relatedSubzone.type === SubZoneEnum.WarForTheMountainPalaces) {
      this.globalService.globalVar.partyMember1Hidden = true;
      this.menuService.updateParty = true;
    }
    else {
      this.globalService.globalVar.partyMember1Hidden = false;
      this.menuService.updateParty = true;
    }

    if (this.globalService.globalVar.gameLogSettings.get("moveLocations")) {
      var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + this.getSubZoneName(relatedSubzone.type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry, this.globalService.globalVar);
    }

    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.dpsCalculatorService.xpGain = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();
    this.globalService.ResetTrialInfoAfterChangingSubzone();

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

  findZoneOfSubzone(type: SubZoneEnum) {
    var returnZone: Zone | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnZone = zone;
        })
      })
    });

    return returnZone;
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

  getLatestSubzone() {
    var reverseOrderBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }).slice().reverse();

    var reverseZones = reverseOrderBallads[0].zones.filter(item => item.isAvailable).slice().reverse();
    var lastSubzone = reverseZones[0].subzones.filter(item => item.isAvailable).slice().reverse()[0].type;

    return lastSubzone;
  }

  selectNextSubzone() {
    var currentSubzone = this.getActiveSubZone();
    var includeSideQuests = this.globalService.globalVar.settings.get("autoProgressIncludeSideQuests") ?? true;
    var onlyProgressForward = this.globalService.globalVar.settings.get("autoProgressProgressFromCurrentSubzone") ?? false;
    var shouldHideCountryRoads1 = this.findSubzone(SubZoneEnum.NemeaCountryRoadsTwo)?.isAvailable ?? false;

    var currentBallad = this.getActiveBallad();
    var currentZone = this.getActiveZone();
    var currentSubzone = this.getActiveSubZone();

    var nextSubzoneFound = false;
    var reverseOrderBallads = this.globalService.globalVar.ballads.filter(item => item.isAvailable).sort(function (a, b) {
      return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    });//.slice().reverse();

    if (onlyProgressForward && currentBallad !== undefined)
      reverseOrderBallads = reverseOrderBallads.filter(item => item.displayOrder >= currentBallad!.displayOrder);

    reverseOrderBallads.forEach(ballad => {
      if (!nextSubzoneFound) {
        var reverseZones = ballad.zones.filter(item => item.isAvailable);//.slice().reverse();

        if (onlyProgressForward && currentZone !== undefined) {
          var currentZoneIndex = reverseZones.findIndex(item => item === currentZone!);
          reverseZones = reverseZones.filter((item, index) => index >= currentZoneIndex);
        }

        reverseZones.forEach(zone => {
          var reverseSubzones = zone.subzones.filter(item => item.isAvailable);//.slice().reverse();

          if (onlyProgressForward && currentSubzone !== undefined) {
            var currentSubzoneIndex = reverseSubzones.findIndex(item => item === currentSubzone!);
            reverseSubzones = reverseSubzones.filter((item, index) => index >= currentSubzoneIndex);
          }

          reverseSubzones.forEach(subzone => {
            if (!nextSubzoneFound && subzone.type !== SubZoneEnum.CalydonAltarOfAsclepius && !this.isSubzoneTown(subzone.type) &&
              (!shouldHideCountryRoads1 || (shouldHideCountryRoads1 && subzone.type !== SubZoneEnum.NemeaCountryRoadsOne)) &&
              !this.autoProgressShouldChangeSubZone(subzone) && (includeSideQuests || (!includeSideQuests && this.shouldSubzoneShowSideQuestNotification(subzone.type) !== NotificationTypeEnum.SideQuest))) {
              nextSubzoneFound = true;
              if (currentSubzone.type !== subzone.type) { //don't constantly re-enter the same subzone
                this.selectBallad(ballad)
                this.selectZone(zone);
                this.selectSubZone(subzone, zone);
              }
            }
          });
        })
      }
    });
  }

  autoProgressShouldChangeSubZone(subzone: SubZone) {
    var shouldChange = false;
    var autoProgressType = this.globalService.globalVar.settings.get("autoProgressType") ?? CompletionStatusEnum.Cleared;
    var includeAllAchievements = this.globalService.globalVar.settings.get("autoProgressIncludeAllAchievements") ?? false;

    if (autoProgressType === CompletionStatusEnum.Complete) {
      shouldChange = this.globalService.getVictoriesNeededForAllAchievements(subzone.type) - subzone.victoryCount <= 0;

      if (includeAllAchievements) {
        shouldChange = this.globalService.getUncompletedAchievementCountBySubZone(subzone.type) === 0;
      }
    }
    else if (autoProgressType === CompletionStatusEnum.Custom) {
      var autoProgressCustomVictoryCount = this.globalService.globalVar.settings.get("autoProgressCustomVictoryCount") ?? 10;
      shouldChange = subzone.victoryCount >= autoProgressCustomVictoryCount;
    }
    else {
      shouldChange = this.getVictoriesNeededToProceed(subzone.type) - subzone.victoryCount <= 0;
    }

    return shouldChange;
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

    if (zone.type === ZoneEnum.Nemea) {
      //this is dumb but I'm tired of it continuously popping up
      var countryRoadsOne = this.findSubzone(SubZoneEnum.NemeaCountryRoadsOne);
      var countryRoadsTwo = this.findSubzone(SubZoneEnum.NemeaCountryRoadsTwo);

      if (countryRoadsTwo !== undefined && countryRoadsTwo.isAvailable && countryRoadsOne !== undefined) {
        countryRoadsOne.isAvailable = false;
      }
    }

    return zone.subzones.filter(item => item.isAvailable);
  }

  selectSubZone(subzone: SubZone, zone: Zone) {
    if (this.isSubZoneToBeContinued(subzone)) {
      return;
    }

    if (subzone.type === SubZoneEnum.WarForTheMountainStables) {
      this.globalService.globalVar.partyMember2Hidden = true;
      this.menuService.updateParty = true;
    }
    else {
      this.globalService.globalVar.partyMember2Hidden = false;
      this.menuService.updateParty = true;
    }

    if (subzone.type === SubZoneEnum.WarForTheMountainPalaces) {
      this.globalService.globalVar.partyMember1Hidden = true;
      this.menuService.updateParty = true;
    }
    else {
      this.globalService.globalVar.partyMember1Hidden = false;
      this.menuService.updateParty = true;
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

    if (this.globalService.globalVar.gameLogSettings.get("moveLocations")) {
      var gameLogEntry = "You move to <strong>" + zone.zoneName + " - " + this.getSubZoneName(subzone.type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry, this.globalService.globalVar);
    }
    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.dpsCalculatorService.xpGain = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.ResetTournamentInfoAfterChangingSubzone();
    this.globalService.ResetTrialInfoAfterChangingSubzone();

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
      name = "Hellespont Passage 1";
    if (type === SubZoneEnum.AegeanSeaPropontis)
      name = "Propontis";
    if (type === SubZoneEnum.AegeanSeaHellespointPassage2)
      name = "Hellespont Passage 2";
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
      name = "Calm Waters";
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
    if (type === SubZoneEnum.GardenOfTheHesperidesLibyanOutskirts)
      name = "Libyan Outskirts";
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
    if (type === SubZoneEnum.MountOlympusUpTheMountain)
      name = "Up the Mountain";
    if (type === SubZoneEnum.MountOlympusMeanderingPath)
      name = "Meandering Path";
    if (type === SubZoneEnum.MountOlympusCouloir)
      name = "Couloir";
    if (type === SubZoneEnum.MountOlympusMusesPlateau)
      name = "Muses Plateau";
    if (type === SubZoneEnum.MountOlympusPathwayToTheZenith)
      name = "Path to the Zenith";
    if (type === SubZoneEnum.MountOlympusMytikasSummit)
      name = "Mytikas Summit";
    if (type === SubZoneEnum.MountOlympusOlympus)
      name = "Olympus";
    if (type === SubZoneEnum.HuntForYarrowOlympianGrounds)
      name = "Olympian Grounds";
    if (type === SubZoneEnum.HuntForYarrowMountainHike)
      name = "Mountain Hike";
    if (type === SubZoneEnum.HuntForYarrowWoodlandTrail)
      name = "Woodland Trail";
    if (type === SubZoneEnum.HuntForYarrowTrailFork1)
      name = "Trail Fork 1";
    if (type === SubZoneEnum.HuntForYarrowTrailFork2)
      name = "Trail Fork 2";
    if (type === SubZoneEnum.HuntForYarrowTrailFork3)
      name = "Trail Fork 3";
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery1)
      name = "Dense Greenery 1";
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery2)
      name = "Dense Greenery 2";
    if (type === SubZoneEnum.HuntForYarrowDenseGreenery3)
      name = "Dense Greenery 3";
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway1)
      name = "Promising Pathway 1";
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway2)
      name = "Promising Pathway 2";
    if (type === SubZoneEnum.HuntForYarrowPromisingPathway3)
      name = "Promising Pathway 3";
    if (type === SubZoneEnum.HuntForYarrowYarrowField)
      name = "Yarrow Field";
    if (type === SubZoneEnum.WarForTheMountainBattleAtTheGates)
      name = "Battle at the Gates";
    if (type === SubZoneEnum.WarForTheMountainOpenCourtyard)
      name = "Open Courtyard";
    if (type === SubZoneEnum.WarForTheMountainPalaces)
      name = "Palaces";
    if (type === SubZoneEnum.WarForTheMountainStables)
      name = "Stables";
    if (type === SubZoneEnum.WarForTheMountainThePeak)
      name = "The Peak";
    if (type === SubZoneEnum.CreteTravelsAtSea)
      name = "Travels at Sea";
    if (type === SubZoneEnum.CreteApproachingCrete)
      name = "Approaching Crete";
    if (type === SubZoneEnum.CreteRapidWaters)
      name = "Rapid Waters";
    if (type === SubZoneEnum.CreteTurbulentCurrents)
      name = "Turbulent Currents";
    if (type === SubZoneEnum.CreteWhirlpool)
      name = "Whirlpool";
    if (type === SubZoneEnum.CreteNorthernCretanCoast)
      name = "Northern Cretan Coast";
    if (type === SubZoneEnum.CreteKnossos)
      name = "Knossos";
    if (type === SubZoneEnum.TheLabyrinthCenterFork)
      name = "Center Fork";
    if (type === SubZoneEnum.TheLabyrinthCenterPath)
      name = "Center Path";
    if (type === SubZoneEnum.TheLabyrinthColdHallway)
      name = "Cold Hallway";
    if (type === SubZoneEnum.TheLabyrinthDarkCorridor)
      name = "Dark Corridor";
    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter)
      name = "Labyrinth Center";
    if (type === SubZoneEnum.TheLabyrinthLeftFork)
      name = "Left Fork";
    if (type === SubZoneEnum.TheLabyrinthLeftPath)
      name = "Left Path";
    if (type === SubZoneEnum.TheLabyrinthLeftTurn)
      name = "Left Turn";
    if (type === SubZoneEnum.TheLabyrinthLongPassage1)
      name = "Long Passage 1";
    if (type === SubZoneEnum.TheLabyrinthLongPassage2)
      name = "Long Passage 2";
    if (type === SubZoneEnum.TheLabyrinthOrnateEntryway)
      name = "Ornate Entryway";
    if (type === SubZoneEnum.TheLabyrinthRightCorner)
      name = "Right Corner";
    if (type === SubZoneEnum.TheLabyrinthRightFork)
      name = "Right Fork";
    if (type === SubZoneEnum.TheLabyrinthRightPath)
      name = "Right Path";
    if (type === SubZoneEnum.TheLabyrinthRoundedPath)
      name = "Rounded Path";
    if (type === SubZoneEnum.TheLabyrinthSlopedHallway)
      name = "Sloped Hallway";
    if (type === SubZoneEnum.TheLabyrinthSolidWall1)
      name = "Solid Wall 1";
    if (type === SubZoneEnum.TheLabyrinthSolidWall2)
      name = "Solid Wall 2";
    if (type === SubZoneEnum.TheLabyrinthSolidWall3)
      name = "Solid Wall 3";
    if (type === SubZoneEnum.TheLabyrinthSolidWall4)
      name = "Solid Wall 4";
    if (type === SubZoneEnum.TheLabyrinthCloakedStranger)
      name = "Cloaked Stranger";
    if (type === SubZoneEnum.AiaiaUnknownWaters)
      name = "Unknown Waters";
    if (type === SubZoneEnum.AiaiaBreezyDays)
      name = "Breezy Days";
    if (type === SubZoneEnum.AiaiaShoreline)
      name = "Shoreline";
    if (type === SubZoneEnum.AiaiaForestPath)
      name = "Forest Path";
    if (type === SubZoneEnum.AiaiaCircesHome)
      name = "Circe's Home";
    if (type === SubZoneEnum.AiaiaOpenClearing)
      name = "Open Clearing";
    if (type === SubZoneEnum.AiaiaThornyPath)
      name = "Thorny Path";
    if (type === SubZoneEnum.AiaiaWildThicket)
      name = "Wild Thicket";
    if (type === SubZoneEnum.AiaiaFlowerGarden)
      name = "Flower Garden";
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits)
      name = "Into the Narrow Straits";
    if (type === SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis)
      name = "Edge of Charybdis";
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheVortex)
      name = "Into the Vortex";
    if (type === SubZoneEnum.StraitsOfMessinaMawOfTheMonster)
      name = "Maw of the Monster";
    if (type === SubZoneEnum.StraitsOfMessinaCavernOpening)
      name = "Cavern Opening";
    if (type === SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits)
      name = "Into the Narrow Straits";
    if (type === SubZoneEnum.StraitsOfMessinaDarkTunnel)
      name = "Dark Tunnel";
    if (type === SubZoneEnum.StraitsOfMessinaUnavoidablePath)
      name = "Unavoidable Path";
    if (type === SubZoneEnum.ReturnToColchisPhasisBeach)
      name = "Phasis Beach";
    if (type === SubZoneEnum.ReturnToColchisUnderTheStars)
      name = "Under the Stars";
    if (type === SubZoneEnum.ReturnToColchisParanoidMerchant)
      name = "Paranoid Merchant";
    if (type === SubZoneEnum.ReturnToColchisColchisOutskirts)
      name = "Colchis Outskirts";
    if (type === SubZoneEnum.ReturnToColchisColchisStreets)
      name = "Colchis Streets";
    if (type === SubZoneEnum.ReturnToColchisReturnToTheGrove)
      name = "Return to the Grove";
    if (type === SubZoneEnum.EscapeFromColchisEscape1)
      name = "Escape 1";
    if (type === SubZoneEnum.EscapeFromColchisEscape2)
      name = "Escape 2";
    if (type === SubZoneEnum.EscapeFromColchisInnerPath)
      name = "Inner Path";
    if (type === SubZoneEnum.EscapeFromColchisBackAgainstTheWall)
      name = "Back Against the Wall";
    if (type === SubZoneEnum.EscapeFromColchisBattleAtSea)
      name = "Battle at Sea";
    if (type === SubZoneEnum.OlympusMassifThessalyGrasslands)
      name = "Thessaly Grasslands";
    if (type === SubZoneEnum.OlympusMassifInnerThessalyPathways)
      name = "Inner Thessaly Pathways";    
    if (type === SubZoneEnum.OlympusMassifLargeOutcroppings)
      name = "Large Outcroppings";
    if (type === SubZoneEnum.OlympusMassifMountainBase)
      name = "Mountain Base";
    if (type === SubZoneEnum.TheAscentHarshRise)
      name = "Harsh Rise";
    if (type === SubZoneEnum.TheAscentAbundantGreenery)
      name = "Abundant Greenery";
    if (type === SubZoneEnum.TheAscentHigherElevation)
      name = "Higher Elevation";
    if (type === SubZoneEnum.TheAscentFinalAscent)
      name = "Final Ascent";
    if (type === SubZoneEnum.WarForTheMountainTwoSpoiledCourtyard)
      name = "Spoiled Courtyard";
    if (type === SubZoneEnum.WarForTheMountainTwoGardens)
      name = "Gardens";
    if (type === SubZoneEnum.WarForTheMountainTwoForOlympus)
      name = "For Olympus";
    if (type === SubZoneEnum.TartarusWesternPath)
      name = "Western Path";
    if (type === SubZoneEnum.TartarusDesolateFields)
      name = "Desolate Fields";
    if (type === SubZoneEnum.TartarusPlainsOfJudgment)
      name = "Plains  of Judgment";
    if (type === SubZoneEnum.TartarusWallsOfFire)
      name = "Walls of Fire";
    if (type === SubZoneEnum.TartarusPhlegethonRiver)
      name = "Phlegethon River";
    if (type === SubZoneEnum.TartarusScorchedMeadow)
      name = "Scorched Meadow";
    if (type === SubZoneEnum.TartarusUnholyHalls)
      name = "Unholy Halls";
    if (type === SubZoneEnum.TartarusTitanHoldingGrounds)
      name = "Titan Holding Grounds";
    if (type === SubZoneEnum.MountOthrysCaveOpening)
      name = "Cave Opening";
    if (type === SubZoneEnum.MountOthrysTightPassage)
      name = "Tight Passage";
    if (type === SubZoneEnum.MountOthrysFracturedWall)
      name = "Fractured Wall";
    if (type === SubZoneEnum.MountOthrysCavernOfTime)
      name = "Cavern of Time";

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
      victories = aigosthenaVictories;
    if (type === SubZoneEnum.DodonaCoastalRoadsOfLocris)
      victories = aigosthenaVictories;
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

    if (type === SubZoneEnum.MountOlympusUpTheMountain || type === SubZoneEnum.MountOlympusCouloir || type === SubZoneEnum.MountOlympusPathwayToTheZenith ||
      type === SubZoneEnum.MountOlympusMeanderingPath || type === SubZoneEnum.MountOlympusMusesPlateau)
      victories = defaultVictories;

    if (type === SubZoneEnum.MountOlympusMytikasSummit)
      victories = bossVictories;

    if (type === SubZoneEnum.HuntForYarrowDenseGreenery1 || type === SubZoneEnum.HuntForYarrowDenseGreenery2 || type === SubZoneEnum.HuntForYarrowDenseGreenery3 ||
      type === SubZoneEnum.HuntForYarrowPromisingPathway1 || type === SubZoneEnum.HuntForYarrowPromisingPathway2 || type === SubZoneEnum.HuntForYarrowPromisingPathway3 ||
      type === SubZoneEnum.HuntForYarrowTrailFork1 || type === SubZoneEnum.HuntForYarrowTrailFork2 || type === SubZoneEnum.HuntForYarrowTrailFork3 ||
      type === SubZoneEnum.HuntForYarrowMountainHike || type === SubZoneEnum.HuntForYarrowOlympianGrounds || type === SubZoneEnum.HuntForYarrowWoodlandTrail)
      victories = defaultVictories;

    if (type === SubZoneEnum.HuntForYarrowYarrowField)
      victories = bossVictories;

    if (type === SubZoneEnum.WarForTheMountainBattleAtTheGates || type === SubZoneEnum.WarForTheMountainPalaces || type === SubZoneEnum.WarForTheMountainStables ||
      type === SubZoneEnum.WarForTheMountainOpenCourtyard || type === SubZoneEnum.WarForTheMountainThePeak)
      victories = bossVictories;

    if (type === SubZoneEnum.CreteTravelsAtSea || type === SubZoneEnum.CreteApproachingCrete || type === SubZoneEnum.CreteRapidWaters ||
      type === SubZoneEnum.CreteTurbulentCurrents || type === SubZoneEnum.CreteNorthernCretanCoast || type === SubZoneEnum.CreteKnossos)
      victories = defaultVictories;

    if (type === SubZoneEnum.CreteWhirlpool)
      victories = bossVictories;

    if (type === SubZoneEnum.TheLabyrinthLeftPath || type === SubZoneEnum.TheLabyrinthLeftFork || type === SubZoneEnum.TheLabyrinthColdHallway ||
      type === SubZoneEnum.TheLabyrinthRightCorner || type === SubZoneEnum.TheLabyrinthSolidWall1 || type === SubZoneEnum.TheLabyrinthCenterPath ||
      type === SubZoneEnum.TheLabyrinthSlopedHallway || type === SubZoneEnum.TheLabyrinthRoundedPath || type === SubZoneEnum.TheLabyrinthLeftTurn ||
      type === SubZoneEnum.TheLabyrinthSolidWall3 || type === SubZoneEnum.TheLabyrinthCenterFork || type === SubZoneEnum.TheLabyrinthDarkCorridor ||
      type === SubZoneEnum.TheLabyrinthOrnateEntryway || type === SubZoneEnum.TheLabyrinthRightFork || type === SubZoneEnum.TheLabyrinthSolidWall4 ||
      type === SubZoneEnum.TheLabyrinthRightPath || type === SubZoneEnum.TheLabyrinthLongPassage1 || type === SubZoneEnum.TheLabyrinthLongPassage2 ||
      type === SubZoneEnum.TheLabyrinthSolidWall2)
      victories = defaultVictories;

    if (type === SubZoneEnum.TheLabyrinthLabyrinthCenter)
      victories = bossVictories;

    if (type === SubZoneEnum.AiaiaUnknownWaters || type === SubZoneEnum.AiaiaBreezyDays || type === SubZoneEnum.AiaiaShoreline ||
      type === SubZoneEnum.AiaiaForestPath || type === SubZoneEnum.AiaiaOpenClearing || type === SubZoneEnum.AiaiaThornyPath ||
      type === SubZoneEnum.AiaiaWildThicket)
      victories = defaultVictories;

    if (type === SubZoneEnum.AiaiaFlowerGarden)
      victories = bossVictories;

    if (type === SubZoneEnum.StraitsOfMessinaIntoTheNarrowStraits || type === SubZoneEnum.StraitsOfMessinaEdgeOfCharybdis || type === SubZoneEnum.StraitsOfMessinaIntoTheVortex ||
      type === SubZoneEnum.StraitsOfMessinaCavernOpening || type === SubZoneEnum.StraitsOfMessinaDarkTunnel)
      victories = defaultVictories;

    if (type === SubZoneEnum.StraitsOfMessinaMawOfTheMonster || type === SubZoneEnum.StraitsOfMessinaUnavoidablePath)
      victories = bossVictories;

    if (type === SubZoneEnum.ReturnToColchisPhasisBeach || type === SubZoneEnum.ReturnToColchisUnderTheStars || type === SubZoneEnum.ReturnToColchisColchisOutskirts ||
      type === SubZoneEnum.ReturnToColchisColchisStreets)
      victories = defaultVictories;

    if (type === SubZoneEnum.ReturnToColchisReturnToTheGrove)
      victories = bossVictories;

    if (type === SubZoneEnum.EscapeFromColchisEscape1 || type === SubZoneEnum.EscapeFromColchisEscape2 || type === SubZoneEnum.EscapeFromColchisInnerPath)
      victories = defaultVictories;

    if (type === SubZoneEnum.EscapeFromColchisBackAgainstTheWall || type === SubZoneEnum.EscapeFromColchisBattleAtSea)
      victories = bossVictories;

    if (type === SubZoneEnum.OlympusMassifThessalyGrasslands || type === SubZoneEnum.OlympusMassifInnerThessalyPathways || type === SubZoneEnum.OlympusMassifLargeOutcroppings ||
      type === SubZoneEnum.TheAscentHarshRise || type === SubZoneEnum.TheAscentAbundantGreenery || type === SubZoneEnum.TheAscentHigherElevation)
      victories = defaultVictories;
      
    if (type === SubZoneEnum.TartarusWesternPath || type === SubZoneEnum.TartarusDesolateFields || type === SubZoneEnum.TartarusPlainsOfJudgment ||
      type === SubZoneEnum.TartarusWallsOfFire || type === SubZoneEnum.TartarusPhlegethonRiver || type === SubZoneEnum.TartarusScorchedMeadow ||
      type === SubZoneEnum.TartarusUnholyHalls || type === SubZoneEnum.MountOthrysCaveOpening || type === SubZoneEnum.MountOthrysTightPassage || type === SubZoneEnum.MountOthrysFracturedWall)
      victories = defaultVictories;

    if (type === SubZoneEnum.OlympusMassifMountainBase || type === SubZoneEnum.TheAscentFinalAscent || type === SubZoneEnum.WarForTheMountainTwoSpoiledCourtyard || 
      type === SubZoneEnum.WarForTheMountainTwoGardens || type === SubZoneEnum.WarForTheMountainTwoForOlympus || type === SubZoneEnum.TartarusTitanHoldingGrounds || 
      type === SubZoneEnum.MountOthrysCavernOfTime)
      victories = bossVictories;

    return victories;
  }

  isSubzoneTown(type: SubZoneEnum) {
    if (type === SubZoneEnum.DodonaDelphi || type === SubZoneEnum.DodonaArta || type === SubZoneEnum.AsphodelPalaceOfHades ||
      type === SubZoneEnum.AsphodelLostHaven || type === SubZoneEnum.ElysiumColiseum || type === SubZoneEnum.PeloposNisosTravelPost ||
      type === SubZoneEnum.CalydonTownMarket || type === SubZoneEnum.AegeanSeaIolcus || type === SubZoneEnum.AegeanSeaSalmydessus ||
      type === SubZoneEnum.BlackSeaMariandyna || type === SubZoneEnum.ColchisCityCenter || type === SubZoneEnum.NemeaCleonea ||
      type === SubZoneEnum.StymphaliaTiryns || type === SubZoneEnum.CoastOfCreteElis || type === SubZoneEnum.ErytheiaCadiz ||
      type === SubZoneEnum.MountOlympusOlympus || type === SubZoneEnum.CreteKnossos || type === SubZoneEnum.TheLabyrinthCloakedStranger ||
      type === SubZoneEnum.AiaiaCircesHome || type === SubZoneEnum.ReturnToColchisParanoidMerchant) {
      return true;
    }

    return false;
  }

  shouldSubzoneShowSideQuestNotification(type: SubZoneEnum) {
    if (type === SubZoneEnum.ElysiumWindingPaths || type === SubZoneEnum.ElysiumWaterloggedMarsh || type === SubZoneEnum.ElysiumWavesOfOceanus ||
      type === SubZoneEnum.CalydonAltarOfAsclepius || type === SubZoneEnum.TheLetheLetheBasin2 || type === SubZoneEnum.TheLetheFerryRide ||
      type === SubZoneEnum.TheLetheRiverDivergence || type === SubZoneEnum.TheLetheStillWaters || type === SubZoneEnum.TheLetheHypnosIsland ||
      type === SubZoneEnum.StraitsOfMessinaIntoTheVortex || type === SubZoneEnum.StraitsOfMessinaMawOfTheMonster || type === SubZoneEnum.EscapeFromColchisBackAgainstTheWall)
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
      if (!zone.isAvailable || zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).some(subzone => !subzone.isAvailable))
        isFullyAvailable = false;
    })

    return isFullyAvailable;
  }

  isZoneFullyAvailable(type: ZoneEnum) {
    var isFullyAvailable = true;
    var zone = this.findZone(type);
    if (zone === undefined)
      return false;

    if (zone.subzones.filter(item => item.type !== SubZoneEnum.NemeaCountryRoadsOne).some(subzone => !subzone.isAvailable))
      isFullyAvailable = false;

    return isFullyAvailable;
  }
}
