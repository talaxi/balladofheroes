import { Injectable } from '@angular/core';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { BalladService } from '../ballad/ballad.service';
import { GlobalService } from '../global/global.service';
import { UtilityService } from './utility.service';
import { AchievementService } from '../achievements/achievement.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { InitializationService } from '../global/initialization.service';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { God } from 'src/app/models/character/god.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { IndividualFollower } from 'src/app/models/followers/individual-follower.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { CompletionStatusEnum } from 'src/app/models/enums/completion-status-enum.model';
import { LookupService } from '../lookup.service';
import { KeybindService } from './keybind.service';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  constructor(public globalService: GlobalService, private utilityService: UtilityService, private balladService: BalladService,
    private achievementService: AchievementService, private initializationService: InitializationService, private lookupService: LookupService,
    private keybindService: KeybindService) { }

  //DON'T FORGET TO CHANGE GLOBAL SERVICE VERSION AS WELL
  //add to this in descending order
  gameVersions = [0.5, 0.46, 0.45, 0.42, 0.41, 0.4, 0.32, 0.31, 0.3];

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

    if (version === 0.4)
      changes = "Ballad of argo launch";
    if (version === 0.32)
      changes = "Bug fixes";
    if (version === 0.31)
      changes = "Bug fixes";
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
    if (version === .3)
      date = new Date('2022-04-03 12:00:00');
    if (version === .31)
      date = new Date('2022-04-06 12:00:00');
    if (version === .32)
      date = new Date('2022-04-06 12:00:00');
    if (version === .4)
      date = new Date('2022-04-19 12:00:00');

    return date.toDateString().replace(/^\S+\s/, '');
  }

  updatePlayerVersion() {
    this.getListAscended().forEach(version => {
      if (this.globalService.globalVar.currentVersion < version) {
        if (version === .31) {
          var adventurer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer);
          if (adventurer !== undefined)
            adventurer.battleInfo.timeToAutoAttack = this.utilityService.quickAutoAttackSpeed;

          var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
          if (warrior !== undefined)
            warrior.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;

          var archer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
          if (archer !== undefined)
            archer.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;

          var wornDownBarn = this.balladService.findSubzone(SubZoneEnum.CalydonWornDownBarn);
          var letheBasin2 = this.balladService.findSubzone(SubZoneEnum.TheLetheLetheBasin2);
          if (wornDownBarn !== undefined && wornDownBarn.isAvailable && wornDownBarn.victoryCount > 0) {
            if (letheBasin2 !== undefined) {
              letheBasin2.isAvailable = true;
              letheBasin2.notify = true;
              this.achievementService.createDefaultAchievementsForSubzone(letheBasin2.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
          }
        }
        if (version === .32) {
          var priest = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest);
          if (priest !== undefined)
            priest.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;

          this.globalService.globalVar.ballads = this.globalService.globalVar.ballads.filter(item => item.type !== BalladEnum.None);
          this.globalService.globalVar.ballads.forEach(ballad => {
            ballad.zones = ballad.zones.filter(item => item.type !== ZoneEnum.None);
            ballad.zones.forEach(zone => {
              zone.subzones = zone.subzones.filter(item => item.type !== SubZoneEnum.None);
            });
          });
        }
        if (version === .4) {
          this.globalService.globalVar.sidequestData.weeklyMeleeEntries = 1;
          this.globalService.globalVar.sidequestData.highestWeeklyMeleeRound = 0;
          this.globalService.globalVar.sidequestData.lastWeeklyMeleeTicketReceived = new Date();

          var coliseumDefeatCount = new ColiseumDefeatCount(ColiseumTournamentEnum.WeeklyMelee, 0);
          this.globalService.globalVar.coliseumDefeatCount.push(coliseumDefeatCount);

          var tournamentCount = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.TournamentOfTheDead);
          if (tournamentCount !== undefined && tournamentCount.count > 0) {
            var weeklyMelee = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.WeeklyMelee);
            if (weeklyMelee !== undefined)
              weeklyMelee.isAvailable = true;
          }

          this.globalService.globalVar.characters.forEach(character => {
            character.maxLevel = 30;
          });

          var priest = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest);
          if (priest !== undefined) {
            priest.baseStats.attack += 4;
            priest.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
          }

          var adventurer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer);
          if (adventurer !== undefined) {
            adventurer.baseStats.attack += 6;
            adventurer.baseStats.defense += 1;
            adventurer.battleInfo.autoAttackModifier = this.utilityService.weakAutoAttack;
          }
          var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
          if (warrior !== undefined) {
            warrior.baseStats.attack += 2;
            warrior.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
          }

          var archer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
          if (archer !== undefined) {
            archer.baseStats.attack += 5;
            archer.battleInfo.autoAttackModifier = this.utilityService.weakAutoAttack;
          }

          this.globalService.globalVar.settings.set("showEnemyHpAsPercent", false);
          this.globalService.globalVar.settings.set("showPartyHpAsPercent", false);
          this.globalService.globalVar.timers.itemCooldowns = [];
          this.globalService.globalVar.keybinds.set("openJewelcraftingQuickView", "keyJ");
          this.globalService.globalVar.settings.set("displayQuickViewJewelcrafting", true);
          this.globalService.globalVar.gameLogSettings.set("jewelcraftingLevelUp", true);
          this.globalService.globalVar.gameLogSettings.set("jewelcraftingCreation", true);

          var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
          if (hades !== undefined)
            this.globalService.assignGodAbilityInfo(hades);

          var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
          if (ares !== undefined)
            this.globalService.assignGodAbilityInfo(ares);

          this.initializationService.initializeJewelcrafting();
          this.initializationService.initializeBalladOfTheArgo();

          var wornDownBarn = this.balladService.findSubzone(SubZoneEnum.CalydonWornDownBarn);
          if (wornDownBarn !== undefined && wornDownBarn.isAvailable && wornDownBarn.victoryCount > 0) {
            var argo = this.balladService.findBallad(BalladEnum.Argo);
            var aegeanSea = this.balladService.findZone(ZoneEnum.AegeanSea);
            var iolcus = this.balladService.findSubzone(SubZoneEnum.AegeanSeaIolcus);
            var openSeas = this.balladService.findSubzone(SubZoneEnum.AegeanSeaOpenSeas);

            if (argo !== undefined) {
              argo.isAvailable = true;
              argo.notify = true;
            }
            if (aegeanSea !== undefined) {
              aegeanSea.isAvailable = true;
              aegeanSea.notify = true;
            }
            if (iolcus !== undefined) {
              iolcus.isAvailable = true;
              iolcus.notify = true;
            }
            if (openSeas !== undefined) {
              openSeas.isAvailable = true;
              openSeas.notify = true;
            }
          }
        }
        if (version === .41) {
          var openSeas = this.balladService.findSubzone(SubZoneEnum.AegeanSeaOpenSeas);
          var wornDownBarn = this.balladService.findSubzone(SubZoneEnum.CalydonWornDownBarn);

          if (openSeas !== undefined && openSeas.isAvailable && wornDownBarn !== undefined && wornDownBarn.isAvailable && wornDownBarn.victoryCount > 0 &&
            this.globalService.globalVar.achievements.filter(item => item.subzone === SubZoneEnum.AegeanSeaOpenSeas).length === 0) {
            this.achievementService.createDefaultAchievementsForSubzone(openSeas.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
            });
          }
        }
        if (version === .45) {
          this.globalService.globalVar.keybinds.set("menuGoToBestiary", "keyB");

          this.globalService.globalVar.ballads.forEach(ballad => {
            ballad.zones.forEach(zone => {
              zone.subzones.forEach(subzone => {
                if (subzone.type === SubZoneEnum.BlackSeaStormySkies && subzone.victoryCount >= 2500) {
                  var charm = this.globalService.globalVar.resources.find(item => item.item === ItemsEnum.SmallCharmOfHaste);
                  if (charm !== undefined)
                    charm.amount += 1;
                  else
                    this.globalService.globalVar.resources.push(new ResourceValue(ItemsEnum.SmallCharmOfHaste, 1));
                }
              });
            });
          });


          var dionysus = new God(GodEnum.Dionysus);
          dionysus.name = "Dionysus";
          dionysus.displayOrder = 8;
          this.globalService.assignGodAbilityInfo(dionysus);
          this.globalService.globalVar.gods.push(dionysus);

          var nemesis = new God(GodEnum.Nemesis);
          nemesis.name = "Nemesis";
          nemesis.displayOrder = 7;
          this.globalService.assignGodAbilityInfo(nemesis);
          this.globalService.globalVar.gods.push(nemesis);

          var adventurer = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Adventurer);
          if (adventurer !== undefined) {
            var ability2 = adventurer.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterAbility2Level);

            if (ability2 !== undefined && adventurer.level >= 18) {
              ability2.effectiveness -= .025;
              ability2.userEffect[0].effectiveness += .025;
            }
            if (ability2 !== undefined && adventurer.level >= 28) {
              ability2.effectiveness -= .025;
              ability2.userEffect[0].effectiveness += .025;
            }
          }

          var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
          if (warrior !== undefined) {
            var ability1 = warrior.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (ability1 !== undefined) {
              ability1.cooldown = 16;
              ability1.targetEffect = [];
              ability1.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Taunt, 10, 0, false, false, false, warrior.name));

              if (warrior.level >= 12) {
                ability1.cooldown -= .5;
              }

              if (warrior.level >= 22) {
                ability1.cooldown -= .5;
              }

              ability1.currentCooldown = ability1.cooldown;
            }

            var ability2 = warrior.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterAbility2Level);
            if (ability2 !== undefined) {
              ability2.effectiveness += .1;
              ability2.secondaryEffectiveness += .15;
            }
          }

          var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
          if (hades !== undefined) {
            var passive = hades.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              var hadesCopy = new God(GodEnum.Hades);
              this.globalService.assignGodAbilityInfo(hadesCopy);
              for (var i = 0; i < hades.level; i++) {
                this.globalService.levelUpGod(hadesCopy);
              }

              var passiveCopy = hadesCopy.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
              if (passiveCopy !== undefined)
                passive.userEffect[0].duration = passiveCopy.userEffect[0].duration;
            }
          }

          this.globalService.globalVar.characters.forEach(character => {
            if (character.battleInfo !== undefined && character.battleInfo.statusEffects !== undefined && character.battleInfo.statusEffects.length > 0)
              character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.LordOfTheUnderworld);

            var ability1 = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (ability1 !== undefined) {
              if (character.level >= 12)
                ability1.abilityUpgradeLevel += 1;
              if (character.level >= 22)
                ability1.abilityUpgradeLevel += 1;
            }

            var abilityPassive = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterPassiveLevel);
            if (abilityPassive !== undefined) {
              if (character.level >= 14)
                abilityPassive.abilityUpgradeLevel += 1;
              if (character.level >= 24)
                abilityPassive.abilityUpgradeLevel += 1;
            }

            var ability2 = character.abilityList.find(ability => ability.requiredLevel === this.utilityService.characterAbility2Level);
            if (ability2 !== undefined) {
              if (character.level >= 18)
                ability2.abilityUpgradeLevel += 1;
              if (character.level >= 28)
                ability2.abilityUpgradeLevel += 1;
            }
          });

          var achievementsCompleted = this.globalService.globalVar.totalAchievementsCompleted;
          var achievementFollowers = 0;
          if (achievementsCompleted > 0) {
            achievementsCompleted -= 1;
            achievementFollowers += 1;


            while (achievementsCompleted > 12) {
              achievementFollowers += 1;
              achievementsCompleted -= 12;
            }

            this.globalService.globalVar.followerData.achievementCompletionCounter = achievementsCompleted;

            for (var i = this.globalService.globalVar.followerData.numberOfFollowersGainedFromAchievements; i < achievementFollowers; i++) {
              this.globalService.globalVar.followerData.numberOfFollowersGainedFromAchievements += 1;
              this.globalService.globalVar.followerData.availableFollowers += 1;
              this.globalService.globalVar.followerData.followers.push(new IndividualFollower());
            }
          }
        }
        if (version === .5) {
          this.globalService.globalVar.gods.forEach(god => {
            god.partyPermanentStatGain = new CharacterStats(0, 0, 0, 0, 0, 0);
            god.permanentStat3GainCount = [];
            god.permanentStat4GainCount = [];
            god.permanentAbility1GainCount = [];
            god.permanentPassiveGainCount = [];
            god.permanentAbility2GainCount = [];
            god.permanentAbility3GainCount = [];
            god.permanentAbilityUpgrades = [];
          });

          this.globalService.globalVar.characters.forEach(character => {
            character.trackedStats.healingDone = 0;
            character.trackedStats.damagingHitsTaken = 0;
            character.trackedStats.healsMade = 0;
            character.trackedStats.criticalsDealt = 0;  
          });
          
          var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
          if (hades !== undefined) {
            var passive = hades.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.maxCount = 3;
              passive.userEffect[0].maxCount = 3;
              passive.userEffect[0].effectiveness = 1.02 + ((passive.userEffect[0].effectiveness - 1.02) * (2/3)); 
            }

            var ability1 = hades.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (ability1 !== undefined) {
              ability1.cooldown += 6;
            }

            var ability2 = hades.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (ability2 !== undefined) {
              ability2.cooldown += 5;
              ability2.effectiveness -= 0.05;
            }
          }

          var dionysusGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
          if (dionysusGod !== undefined) {
            var ability1 = dionysusGod.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (ability1 !== undefined) {
              ability1.targetType = TargetEnum.LowestHpPercent;
            }

            var ability2 = dionysusGod.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (ability2 !== undefined) {
              ability2.targetEffect[0].effectiveness += .01;
            }
          }

          this.initializationService.initializeBalladOfLabors();
          var hurriedRetreat2 = this.balladService.findSubzone(SubZoneEnum.ColchisHurriedRetreat2);
          if (hurriedRetreat2 !== undefined && hurriedRetreat2.isAvailable && hurriedRetreat2.victoryCount > 0) {
            var labors = this.balladService.findBallad(BalladEnum.Labors);
            var nemea = this.balladService.findZone(ZoneEnum.Nemea);
            var cleonea = this.balladService.findSubzone(SubZoneEnum.NemeaCleonea);
            var countryRoads = this.balladService.findSubzone(SubZoneEnum.NemeaCountryRoadsTwo);
            var oldCountryRoads = this.balladService.findSubzone(SubZoneEnum.NemeaCountryRoadsOne);

            if (labors !== undefined) {
              labors.isAvailable = true;
              labors.notify = true;
            }
            if (nemea !== undefined) {
              nemea.isAvailable = true;
              nemea.notify = true;
            }
            if (cleonea !== undefined) {
              cleonea.isAvailable = true;
              cleonea.notify = true;
            }
            if (countryRoads !== undefined) {
              countryRoads.isAvailable = true;
              countryRoads.notify = true;
            }
            if (oldCountryRoads !== undefined) {
              oldCountryRoads.isAvailable = false;              
            }
          }

          this.globalService.globalVar.settings.set("autoProgressType", CompletionStatusEnum.Cleared);
          this.globalService.globalVar.settings.set("autoProgressIncludeSideQuests", true);
          this.globalService.globalVar.settings.set("autoProgressPauseStory", false);
          this.globalService.globalVar.settings.set("autoProgressIncludeAllAchievements", false);
          this.globalService.globalVar.settings.set("autoProgressRemoveOnDeath", true);   
          this.globalService.globalVar.settings.set("fps", this.utilityService.averageFps);
          this.globalService.globalVar.settings.set("loadingAccuracy", this.utilityService.averageLoadingAccuracy);
          this.globalService.globalVar.settings.set("loadingTime", this.utilityService.averageActiveTimeLimit);

          this.globalService.globalVar.gameLogSettings.set("battleXpRewards", true);
          this.globalService.globalVar.gameLogSettings.set("battleCoinsRewards", true);
          this.globalService.globalVar.gameLogSettings.set("battleItemsRewards", true);
          this.globalService.globalVar.gameLogSettings.set("godAffinityLevelUp", true);
          this.globalService.globalVar.gameLogSettings.set("alchemyQueueEmpty", false);
          this.globalService.globalVar.gameLogSettings.set("jewelcraftingQueueEmpty", false);
          this.globalService.globalVar.gameLogSettings.set("moveLocations", true);

          this.globalService.globalVar.keybinds.set("toggleAllCharactersTargetMode", this.keybindService.altKeyBind + "keyT");

          this.globalService.globalVar.sidequestData.traderHuntLevel = 0;
          this.globalService.globalVar.sidequestData.goldenApplesObtained = 0;          
          this.globalService.globalVar.sidequestData.augeanStablesLevel = 0;
          this.globalService.globalVar.sidequestData.maxAugeanStablesLevel = 3;

          var alchemy = this.globalService.globalVar.professions.find(type => type.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined && alchemy.upgrades.length > 0) {
            alchemy.isDurationHalved = false;
          }

          var jewelcrafting = this.globalService.globalVar.professions.find(type => type.type === ProfessionEnum.Jewelcrafting);
          if (jewelcrafting !== undefined && jewelcrafting.upgrades.length > 0) {
            jewelcrafting.isDurationHalved = false;
            jewelcrafting.upgrades.forEach(upgrades => {
              if (upgrades.chanceTo2xItem > 0) {
                upgrades.chanceForUpgrade = upgrades.chanceTo2xItem / 2;
                upgrades.chanceTo2xItem = 0;
              }

              if (upgrades.chanceTo5xItem > 0) {
                upgrades.chanceToHalfDuration = upgrades.chanceTo5xItem * 2;
                upgrades.chanceTo5xItem = 0;
              }
            });
          }

          this.globalService.globalVar.optionalScenesViewed.forEach(optionalStory => {
            this.lookupService.addSideStoryToLog(optionalStory, undefined);
          });

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Champion) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Champion)!.displayOrder = 1;

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Gorgon) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Gorgon)!.displayOrder = 2;

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld)!.displayOrder = 3;

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Boar) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Boar)!.displayOrder = 4;

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Argo) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Argo)!.displayOrder = 5;

          if (this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Labors) !== undefined)
            this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Labors)!.displayOrder = 6;
        }

        this.globalService.globalVar.currentVersion = version;
      }
    });
  }
}
