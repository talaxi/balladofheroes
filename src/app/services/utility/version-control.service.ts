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
import { Melete } from 'src/app/models/melete/melete.model';
import { JewelcraftingService } from '../professions/jewelcrafting.service';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { UsableItemEffect } from 'src/app/models/resources/usable-item-effect.model';
declare var LZString: any;

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  constructor(public globalService: GlobalService, private utilityService: UtilityService, private balladService: BalladService,
    private achievementService: AchievementService, private initializationService: InitializationService, private lookupService: LookupService,
    private keybindService: KeybindService, private jewelcraftingService: JewelcraftingService) { }

  //DON'T FORGET TO CHANGE GLOBAL SERVICE VERSION AS WELL
  //add to this in descending order
  gameVersions = [0.6, 0.56, 0.55, 0.51, 0.5, 0.46, 0.45, 0.42, 0.41, 0.4, 0.32, 0.31, 0.3];

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

  updatePlayerVersion(autoExport: boolean = false) {
    if (autoExport && this.getCurrentVersion() > this.globalService.globalVar.currentVersion) {
      this.exportData();
    }

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
              passive.userEffect[0].effectiveness = 1.02 + ((passive.userEffect[0].effectiveness - 1.02) * (1 / 3));
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
        if (version === .46) {
          var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);

          if (apollo !== undefined) {
            var ostinato = apollo.abilityList.find(item => item.name === "Ostinato");
            if (ostinato !== undefined) {
              ostinato.targetType = TargetEnum.LowestHpPercent;
            }
          }

          var priest = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Priest);

          if (priest !== undefined) {
            var heal = priest.abilityList.find(item => item.name === "Heal");
            if (heal !== undefined)
              heal.targetType = TargetEnum.LowestHpPercent;
          }
        }
        if (version === .51) {
          var countryRoadsOne = this.balladService.findSubzone(SubZoneEnum.NemeaCountryRoadsTwo);
          var hurriedRetreatTwo = this.balladService.findSubzone(SubZoneEnum.ColchisHurriedRetreat2);

          if (countryRoadsOne !== undefined && countryRoadsOne.isAvailable && hurriedRetreatTwo !== undefined && hurriedRetreatTwo.isAvailable && hurriedRetreatTwo.victoryCount > 0 &&
            this.globalService.globalVar.achievements.filter(item => item.subzone === SubZoneEnum.NemeaCountryRoadsTwo).length === 0) {
            this.achievementService.createDefaultAchievementsForSubzone(countryRoadsOne.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
            });
          }
        }
        if (version === .55) {
          this.globalService.globalVar.melete = new Melete();

          if (this.globalService.globalVar.altars.altar1 !== undefined && this.globalService.globalVar.altars.altar1.god === GodEnum.None)
            this.globalService.globalVar.altars.altar1!.god = GodEnum.Athena;

          var prefix = "equipment";
          this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowWeaponsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowShieldsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowArmorFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowNecklacesFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowRingsFilter", true);

          prefix = "slots";
          this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);

          prefix = "shop";
          this.globalService.globalVar.settings.set(prefix + "ShowBasicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUncommonFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowRareFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowEpicFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowSpecialFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowExtraordinaryFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowUniqueFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowWeaponsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowShieldsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowArmorFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowNecklacesFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowRingsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowEquipmentFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowBattleItemsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowHealingItemsFilter", true);
          this.globalService.globalVar.settings.set(prefix + "ShowSlotItemsFilter", true);


          this.globalService.globalVar.chthonicPowers.increasedGodPrimaryStatResets = 0;
          this.globalService.globalVar.chthonicPowers.increasedPartyPrimaryStatResets = 0;
          this.globalService.globalVar.chthonicPowers.retainGodLevel = 0;

          var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined) {
            var basicAlchemyUpgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);
            var uncommonAlchemyUpgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);
            var rareAlchemyUpgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Rare);

            if (alchemy.level >= 22 && basicAlchemyUpgrades !== undefined)
              basicAlchemyUpgrades.chanceToRetainMaterials += .05;
            if (alchemy.level >= 25 && basicAlchemyUpgrades !== undefined)
              basicAlchemyUpgrades.chanceTo5xItem += .025;

            if (alchemy.level >= 50 && uncommonAlchemyUpgrades !== undefined)
              uncommonAlchemyUpgrades.chanceTo5xItem += .025;

            if (alchemy.level >= 55 && rareAlchemyUpgrades !== undefined)
              rareAlchemyUpgrades.durationReduction += .04;
            if (alchemy.level >= 75 && rareAlchemyUpgrades !== undefined)
              rareAlchemyUpgrades.chanceTo5xItem += .025;
          }

          var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
          if (jewelcrafting !== undefined) {
            var uncommonJewelcraftingUpgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);

            if (jewelcrafting.level >= 48 && uncommonJewelcraftingUpgrades !== undefined)
              uncommonJewelcraftingUpgrades.chanceForUpgrade += .025;
            if (jewelcrafting.level >= 42 && uncommonJewelcraftingUpgrades !== undefined)
              uncommonJewelcraftingUpgrades.chanceToRetainMaterials += .05;

            jewelcrafting.availableRecipes.forEach(recipe => {
              var updatedRecipe = this.jewelcraftingService.getRecipe(recipe.createdItem);
              recipe.expGain = updatedRecipe.expGain;
              recipe.ingredients = [];
              updatedRecipe.ingredients.forEach(ingredient => {
                recipe.ingredients.push(ingredient);
              });
            });
          }
        }
        if (version === .56) {
          this.globalService.globalVar.characters.forEach(character => {
            if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Enwater) && (character.equipmentSet.weapon === undefined ||
              character.equipmentSet.weapon.itemType !== ItemsEnum.LiquidSaber)) {
              character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Enwater);
            }

            if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Enair) && (character.equipmentSet.weapon === undefined ||
              character.equipmentSet.weapon.itemType !== ItemsEnum.BirchBow)) {
              character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.Enair);
            }

            if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.ReduceDirectDamage) && (character.equipmentSet.armor === undefined ||
              (character.equipmentSet.armor.itemType !== ItemsEnum.BoarskinArmor && character.equipmentSet.armor.itemType !== ItemsEnum.ScaleArmor))) {
              character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ReduceDirectDamage);
            }

            if (character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.Thorns) &&
              (character.equipmentSet.shield === undefined || (character.equipmentSet.shield.itemType !== ItemsEnum.Aegis && character.equipmentSet.shield.itemType !== ItemsEnum.SpikedShield)) &&
              (character.equipmentSet.armor === undefined || character.equipmentSet.armor.itemType !== ItemsEnum.ScaleArmor) &&
              (character.equipmentSet.ring === undefined || character.equipmentSet.ring.itemType !== ItemsEnum.ScalyRing)) {
              character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.ReduceDirectDamage);
            }
          });
        }
        if (version === .6) {          
          this.globalService.globalVar.settings.set("autoExportOnUpdate", false);
          this.globalService.globalVar.loadouts = [];
          this.initializationService.initializeBalladOfOlympus();
          this.globalService.globalVar.globalStatusEffects = [];
          this.globalService.globalVar.sidequestData.levelsForNextAmbrosia = this.utilityService.levelsNeededForAmbrosia;

          this.globalService.globalVar.characters.filter(item => item.isAvailable).forEach(character => {
            if (character.equipmentSet.weapon !== undefined && character.equipmentSet.weapon.itemType === ItemsEnum.RadiatingHammer) {
              var equipmentPiece = character.equipmentSet.weapon;              
              var equipmentEffect = new UsableItemEffect();
              equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAbilityUse;
              equipmentEffect.chance = .25;
              equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantHpPercentDamage, 0, .02, true, false, false, "Radiating Hammer", 15000, undefined, undefined, undefined, false));
              equipmentPiece.equipmentEffects.push(equipmentEffect);
            }
          });

          var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
          if (zeus !== undefined)
            this.globalService.assignGodAbilityInfo(zeus);

          var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
          if (apollo !== undefined) {
            var passive = apollo.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.effectiveness = .4 + (passive.abilityUpgradeLevel * .02);
            }

            var ability1 = apollo.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (ability1 !== undefined) {
              ability1.userEffect[0].effectiveness = 1.15 + ((ability1.userEffect[0].effectiveness - 1.15) * (3 / 4));
            }

            var ability2 = apollo.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (ability2 !== undefined) {
              ability2.userEffect[0].effectiveness = 1.15 + ((ability2.userEffect[0].effectiveness - 1.15) * (3 / 4));
            }

            var ability3 = apollo.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (ability3 !== undefined) {
              ability3.userEffect[0].effectiveness = 1.15 + ((ability3.userEffect[0].effectiveness - 1.2) * (3 / 4));
            }

            var permanentPassive = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness *= (2/10);
            }
          }

          var dionysusGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
          if (dionysusGod !== undefined) {
            var permanentAbility1 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined) {
              permanentAbility1.targetEffect[0].threshold = (permanentAbility1.targetEffect[0].effectiveness / .1) * .25;
              permanentAbility1.targetEffect[0].effectiveness = 0;
            }

            var permanentAbility3 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.targetEffect[0].effectiveness /= 10;
            }
          }

          var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
          if (hermes !== undefined) {
            var permanentPassive = hermes.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness *= .4;
            }
          }

          var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
          if (ares !== undefined) {
            var ability1 = ares.abilityList.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (ability1 !== undefined) {
              ability1.targetEffect[0].duration -= 5;
              ability1.cooldown += 2;
              ability1.targetEffect[0].duration -= Math.floor(ability1.abilityUpgradeLevel / 5) * .25;
              ability1.targetEffect[0].effectiveness *= .5;
              ability1.targetEffect[0].effectiveness += .05;
            }

            var ability3 = ares.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (ability3 !== undefined) {
              ability3.targetEffect[0].effectiveness = ((ability3.targetEffect[0].effectiveness - 2) * 2) + 2;
            }

            var passive = ares.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.effectiveness = .02 + ((passive.effectiveness - .025) * .8);
            }

            var permanentPassive = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness *= .5;
            }

            var permanentAbility3 = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined && permanentAbility3.targetEffect.length > 0 && permanentAbility3.targetEffect[0] !== undefined) {
              permanentAbility3.targetEffect[0].effectiveness *= 2;
            }
          }

          this.globalService.globalVar.characters.forEach(character => {
            this.globalService.assignAbilityInfo(character);

            for (var i = 1; i < character.level; i++) {
              this.globalService.checkForNewCharacterAbilities(character, i);
            }
          });

          /*var warrior = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
          if (warrior !== undefined) {
            var battleCry = warrior.abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (battleCry !== undefined)
              battleCry.targetEffect.unshift(this.globalService.createStatusEffect(StatusEffectEnum.ThornsDamageTakenUp, 10, 1.1, false, false, false, warrior.name));
          }*/

          var geryonsFarm = this.balladService.findSubzone(SubZoneEnum.ErytheiaGeryonsFarm);
          if (geryonsFarm !== undefined && geryonsFarm.isAvailable && geryonsFarm.victoryCount > 0) {
            var olympus = this.balladService.findBallad(BalladEnum.Olympus);
            var mountOlympus = this.balladService.findZone(ZoneEnum.MountOlympus);
            var upTheMountain = this.balladService.findSubzone(SubZoneEnum.MountOlympusUpTheMountain);

            if (olympus !== undefined) {
              olympus.isAvailable = true;
              olympus.notify = true;
            }
            if (mountOlympus !== undefined) {
              mountOlympus.isAvailable = true;
              mountOlympus.notify = true;
            }
            if (upTheMountain !== undefined) {
              upTheMountain.isAvailable = true;
              upTheMountain.notify = true;

              this.achievementService.createDefaultAchievementsForSubzone(upTheMountain.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }

          }
          //TODO: remove, this is just for testing          
          var olympusSubzone = this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus);
          olympusSubzone!.isAvailable = true;
          //^^^

          var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined) {
            alchemy.availableRecipes.forEach(recipe => {
              alchemy!.availableRecipeItems.push(recipe.createdItem);
            });

            alchemy.availableRecipes = [];
          }

          var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
          if (jewelcrafting !== undefined) {
            jewelcrafting.availableRecipes.forEach(recipe => {
              jewelcrafting!.availableRecipeItems.push(recipe.createdItem);
            });

            jewelcrafting.availableRecipes = [];
          }
        }

        this.globalService.globalVar.currentVersion = version;
      }
    });
  }

  exportData() {
    var globalData = JSON.stringify(this.globalService.globalVar);
    var compressedData = LZString.compressToBase64(globalData);

    let file = new Blob([compressedData], { type: '.txt' });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "BalladOfHeroes-v" + this.globalService.globalVar.currentVersion.toString().replace(".", "_") + "-" + new Date().toLocaleDateString();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
