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
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';
import { TrialEnum } from 'src/app/models/enums/trial-enum.model';
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
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { UsableItemEffect } from 'src/app/models/resources/usable-item-effect.model';
import { OverdriveNameEnum } from 'src/app/models/enums/overdrive-name-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { Character } from 'src/app/models/character/character.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
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
  gameVersions = [0.8, 0.76, 0.75, 0.71, 0.7, 0.65, 0.64, 0.63, 0.62, 0.61, 0.6, 0.56, 0.55, 0.51, 0.5, 0.46, 0.45, 0.42, 0.41, 0.4, 0.32, 0.31, 0.3];

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
    var shouldAutoExport = this.globalService.globalVar.settings.get("autoExportOnUpdate") ?? false;
    if (autoExport && shouldAutoExport && this.getCurrentVersion() > this.globalService.globalVar.currentVersion) {
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
          if (zeus !== undefined) {
            this.globalService.assignGodAbilityInfo(zeus);
            zeus.displayOrder = 9;
          }

          var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
          if (hermes !== undefined) {
            var permanentAbility = hermes.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility !== undefined && permanentAbility.userEffect.length > 1) {
              permanentAbility.userEffect[0].effectiveness /= 2;
              permanentAbility.userEffect[1].effectiveness /= 2;
            }
          }

          var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
          if (apollo !== undefined) {
            var passive = apollo.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.effectiveness = .4 + (passive.abilityUpgradeLevel * .015);
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

            var permanentAbility1 = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined) {
              permanentAbility1.userEffect[0].effectiveness = (permanentAbility1.userEffect[0].effectiveness / .05) * .03;
            }

            var permanentAbility2 = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility2 !== undefined) {
              permanentAbility2.userEffect[0].effectiveness = (permanentAbility2.userEffect[0].effectiveness / .05) * .03;
            }

            var permanentAbility3 = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.userEffect[0].effectiveness = (permanentAbility3.userEffect[0].effectiveness / .05) * .03;
            }

            var permanentPassive = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness *= (2.5 / 10);
            }
          }

          var dionysusGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
          if (dionysusGod !== undefined) {
            var permanentAbility1 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined && permanentAbility1.userEffect[0] !== undefined) {
              var totalGainCount = 0;
              dionysusGod.permanentAbility1GainCount.forEach(item => {
                totalGainCount += item[1];
              });

              permanentAbility1.userEffect[0].threshold = totalGainCount * .025;
              permanentAbility1.userEffect[0].effectiveness = 0;
            }

            var permanentAbility3 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.targetEffect[0].effectiveness = (permanentAbility3.targetEffect[0].effectiveness / .02) * .0028;
            }
          }

          var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
          if (hermes !== undefined) {
            var permanentPassive = hermes.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness *= .4;
            }
          }

          var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
          if (hades !== undefined) {
            var permanentAbility1 = hades.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined) {
              permanentAbility1.effectiveness = (permanentAbility1.effectiveness / .25) * .2;
            }

            var permanentAbility2 = hades.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility2 !== undefined) {
              permanentAbility2.effectiveness = (permanentAbility2.effectiveness / .3) * .25;
            }
          }

          var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
          if (athena !== undefined) {
            var permanentAbility1 = athena.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined) {
              permanentAbility1.effectiveness = (permanentAbility1.effectiveness / .5) * .6;
            }

            var permanentAbility3 = athena.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.effectiveness = (permanentAbility3.effectiveness / .15) * .25;
            }
          }

          var nemesisGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
          if (nemesisGod !== undefined) {
            var permanentAbility1 = nemesisGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined) {
              permanentAbility1.effectiveness = permanentAbility1.effectiveness * .5;
            }

            var permanentAbility3 = nemesisGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.effectiveness = (permanentAbility3.effectiveness / .3) * .25;
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

            var permanentAbility1 = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined && permanentAbility1.targetEffect.length > 0 && permanentAbility1.targetEffect[0] !== undefined) {
              permanentAbility1.targetEffect[0].effectiveness = (permanentAbility1.targetEffect[0].effectiveness / .15) * .1;
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

            if (character.equipmentSet.weapon !== undefined) {
              var existingWeapon = this.lookupService.getEquipmentPieceByItemType(character.equipmentSet.weapon?.itemType);
              if (existingWeapon !== undefined) {

                existingWeapon.associatedResource = character.equipmentSet.weapon.associatedResource;

                this.globalService.equipItem(existingWeapon, character);
              }
            }
            if (character.equipmentSet.shield !== undefined) {
              var existingShield = this.lookupService.getEquipmentPieceByItemType(character.equipmentSet.shield?.itemType);
              if (existingShield !== undefined) {

                existingShield.associatedResource = character.equipmentSet.shield.associatedResource;

                this.globalService.equipItem(existingShield, character);
              }
            }
            if (character.equipmentSet.armor !== undefined) {
              var existingArmor = this.lookupService.getEquipmentPieceByItemType(character.equipmentSet.armor?.itemType);
              if (existingArmor !== undefined) {

                existingArmor.associatedResource = character.equipmentSet.armor.associatedResource;

                this.globalService.equipItem(existingArmor, character);
              }
            }
            if (character.equipmentSet.ring !== undefined) {
              var existingRing = this.lookupService.getEquipmentPieceByItemType(character.equipmentSet.ring?.itemType);
              if (existingRing !== undefined) {

                existingRing.associatedResource = character.equipmentSet.ring.associatedResource;

                this.globalService.equipItem(existingRing, character);
              }
            }
            if (character.equipmentSet.necklace !== undefined) {
              var existingNecklace = this.lookupService.getEquipmentPieceByItemType(character.equipmentSet.necklace?.itemType);
              if (existingNecklace !== undefined) {

                existingNecklace.associatedResource = character.equipmentSet.necklace.associatedResource;

                this.globalService.equipItem(existingNecklace, character);
              }
            }

            if (character.level === 30) {
              if (character.type === CharacterEnum.Adventurer)
                character.unlockedOverdrives.push(OverdriveNameEnum.Quickness);
              if (character.type === CharacterEnum.Archer)
                character.unlockedOverdrives.push(OverdriveNameEnum.Weaken);
              if (character.type === CharacterEnum.Warrior)
                character.unlockedOverdrives.push(OverdriveNameEnum.Revenge);
              if (character.type === CharacterEnum.Priest)
                character.unlockedOverdrives.push(OverdriveNameEnum.Hope);
            }
          });

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

            if (jewelcrafting.level >= 3)
              this.jewelcraftingService.learnRecipe(ItemsEnum.PointedStone);
            if (jewelcrafting.level >= 8)
              this.jewelcraftingService.learnRecipe(ItemsEnum.ShiningStone);
            if (jewelcrafting.level >= 30)
              this.jewelcraftingService.learnRecipe(ItemsEnum.JaggedStone);
            if (jewelcrafting.level >= 38)
              this.jewelcraftingService.learnRecipe(ItemsEnum.BlessedStone);
          }
        }
        if (version === .61) {
          var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined) {
            alchemy.availableRecipeItems = alchemy.availableRecipeItems.filter((item, index, self) => self.indexOf(item) === index);
          }
        }
        if (version === .62) {
          var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
          if (alchemy !== undefined) {
            alchemy.availableRecipeItems = alchemy.availableRecipeItems.filter((item, index, self) => self.indexOf(item) === index);
          }

          if (!this.globalService.globalVar.isSubscriber) {
            if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis)?.isAvailable)
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 2));
            if (this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus)?.isAvailable)
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 2));
          }

          if (this.lookupService.getResourceAmount(ItemsEnum.AthenasNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ArtemissNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.HermessNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ApollosNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.AressNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.HadessNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.DionysussNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.NemesissNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ZeussNecklace) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.AthenasShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ArtemissShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.HermessShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ApollosShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.AressShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.HadessShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.DionysussShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.NemesissShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
          if (this.lookupService.getResourceAmount(ItemsEnum.ZeussShield) > 0)
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, 1));
        }
        if (version === .64) {
          var levelsReset = 0;
          this.globalService.globalVar.characters.forEach(character => {
            if (character.maxLevel > 30) {
              var maxLevelGain = character.maxLevel - 30;
              for (var i = 5; i <= maxLevelGain; i += 5) {
                levelsReset += i + 30;
              }
            }
          });

          if (levelsReset > 0) {
            var originalAmount = Math.floor(levelsReset / 100);
            var newAmount = Math.floor(levelsReset / 50);

            this.lookupService.gainResource(new ResourceValue(ItemsEnum.Ambrosia, newAmount - originalAmount));
            this.globalService.globalVar.sidequestData.levelsForNextAmbrosia = (50 - levelsReset % 50);
          }
          else
            this.globalService.globalVar.sidequestData.levelsForNextAmbrosia = 50;

          this.globalService.globalVar.resources = this.globalService.globalVar.resources.filter(item => this.lookupService.getItemTypeFromItemEnum(item.item) !== ItemTypeEnum.Charm);

          this.globalService.globalVar.gods.forEach(god => {
            var smallCharms = this.lookupService.getGodAffinitySmallCharmCount(god);
            var largeCharms = this.lookupService.getGodAffinityLargeCharmCount(god);

            if (god.type === GodEnum.Athena) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAthena, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAthena, largeCharms));
            }
            if (god.type === GodEnum.Artemis) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfArtemis, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfArtemis, largeCharms));
            }
            if (god.type === GodEnum.Hermes) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHermes, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHermes, largeCharms));
            }
            if (god.type === GodEnum.Apollo) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfApollo, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfApollo, largeCharms));
            }
            if (god.type === GodEnum.Hades) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfHades, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfHades, largeCharms));
            }
            if (god.type === GodEnum.Ares) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfAres, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfAres, largeCharms));
            }
            if (god.type === GodEnum.Dionysus) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfDionysus, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfDionysus, largeCharms));
            }
            if (god.type === GodEnum.Nemesis) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfNemesis, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfNemesis, largeCharms));
            }
            if (god.type === GodEnum.Zeus) {
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.SmallCharmOfZeus, smallCharms));
              this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfZeus, largeCharms));
            }
          });

          var tournamentOfTheDead = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.TournamentOfTheDead);
          if (tournamentOfTheDead !== undefined && tournamentOfTheDead.quickVictoryCompleted) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));
          }

          var flamesOfTartarus = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.FlamesOfTartarus);
          if (flamesOfTartarus !== undefined && flamesOfTartarus.quickVictoryCompleted) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
          }

          var forgottenKings = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.ForgottenKings);
          if (forgottenKings !== undefined && forgottenKings.quickVictoryCompleted) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
          }

          var riverLords = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.RiverLords);
          if (riverLords !== undefined && riverLords.quickVictoryCompleted) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, 1));
          }

          var hadesTrial = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HadesTrial);
          if (hadesTrial !== undefined && hadesTrial.quickVictoryCompleted) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
          }

          var windyGale = this.lookupService.getSubZoneByType(SubZoneEnum.BlackSeaWindyGale);
          if (windyGale.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.BlackSeaWindyGale);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.BlackSeaWindyGale).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && windyGale !== undefined && windyGale.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && windyGale !== undefined && windyGale.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && windyGale !== undefined && windyGale.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var yarrowField = this.lookupService.getSubZoneByType(SubZoneEnum.HuntForYarrowYarrowField);
          if (yarrowField.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.HuntForYarrowYarrowField);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.HuntForYarrowYarrowField).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && yarrowField !== undefined && yarrowField.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && yarrowField !== undefined && yarrowField.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && yarrowField !== undefined && yarrowField.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var battleAtTheGates = this.lookupService.getSubZoneByType(SubZoneEnum.WarForTheMountainBattleAtTheGates);
          if (battleAtTheGates.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.WarForTheMountainBattleAtTheGates);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.WarForTheMountainBattleAtTheGates).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && battleAtTheGates !== undefined && battleAtTheGates.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && battleAtTheGates !== undefined && battleAtTheGates.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && battleAtTheGates !== undefined && battleAtTheGates.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var openCourtyard = this.lookupService.getSubZoneByType(SubZoneEnum.WarForTheMountainOpenCourtyard);
          if (openCourtyard.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.WarForTheMountainOpenCourtyard);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.WarForTheMountainOpenCourtyard).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && openCourtyard !== undefined && openCourtyard.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && openCourtyard !== undefined && openCourtyard.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && openCourtyard !== undefined && openCourtyard.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var stables = this.lookupService.getSubZoneByType(SubZoneEnum.WarForTheMountainStables);
          if (stables.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.WarForTheMountainStables);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.WarForTheMountainStables).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && stables !== undefined && stables.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && stables !== undefined && stables.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && stables !== undefined && stables.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var palaces = this.lookupService.getSubZoneByType(SubZoneEnum.WarForTheMountainPalaces);
          if (palaces.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.WarForTheMountainPalaces);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.WarForTheMountainPalaces).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && palaces !== undefined && palaces.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && palaces !== undefined && palaces.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && palaces !== undefined && palaces.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var thePeak = this.lookupService.getSubZoneByType(SubZoneEnum.WarForTheMountainThePeak);
          if (thePeak.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.WarForTheMountainThePeak);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.WarForTheMountainThePeak).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && thePeak !== undefined && thePeak.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && thePeak !== undefined && thePeak.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && thePeak !== undefined && thePeak.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          this.globalService.globalVar.achievements.forEach(achievement => {
            if (achievement.completed && this.achievementService.getAchievementReward(achievement.subzone, achievement.type).some(item => this.lookupService.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Charm)) {
              this.achievementService.getAchievementReward(achievement.subzone, achievement.type).forEach(reward => {
                if (this.lookupService.getItemTypeFromItemEnum(reward.item) === ItemTypeEnum.Charm) {
                  this.lookupService.gainResource(this.lookupService.makeResourceCopy(reward));
                }
              });
            }
          });
        }
        if (version === .65) {
          this.globalService.globalVar.sidequestData.trialStage = 1;
          this.globalService.globalVar.settings.set("showTutorialsAsModals", false);

          var heroesOfYore1 = new ColiseumDefeatCount(ColiseumTournamentEnum.HeroesOfYore1, 0);
          var hadesTrial = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HadesTrial);
          if (hadesTrial !== undefined && hadesTrial.count > 0) {
            heroesOfYore1.isAvailable = true;
          }

          this.globalService.globalVar.coliseumDefeatCount.push(heroesOfYore1);
          this.globalService.globalVar.coliseumDefeatCount.push(new ColiseumDefeatCount(ColiseumTournamentEnum.ElementalPressure, 0));
          this.globalService.globalVar.coliseumDefeatCount.push(new ColiseumDefeatCount(ColiseumTournamentEnum.HeroesOfYore2, 0));

          this.globalService.globalVar.keybinds.set("autoToggleCharacter1AllAbilities", "");
          this.globalService.globalVar.keybinds.set("autoToggleCharacter2AllAbilities", "");

          this.globalService.globalVar.gods.forEach(god => {
            god.highestLevelReached = god.level;
          });

          var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
          if (zeus !== undefined && zeus.isAvailable && zeus.abilityList.length > 0) {
            var overload = zeus.abilityList.find(item => item.name === "Overload");
            if (overload !== undefined && overload.userEffect.length > 0)
              overload.userEffect[0].duration = -1;
          }

          var aresGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
          if (aresGod !== undefined) {
            var permanentPassive = aresGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              var totalGainCount = 0;
              aresGod.permanentPassiveGainCount.forEach(item => {
                totalGainCount += item[1];
              });

              permanentPassive.effectiveness = totalGainCount * .0058;
            }
          }

          var nemesisGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Nemesis);
          if (nemesisGod !== undefined) {
            var passive = nemesisGod.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.userEffect[0].duration = -1;
              passive.effectiveness = .2;
              passive.secondaryEffectiveness = .2;

              for (var i = 1; i <= passive.abilityUpgradeLevel; i++) {
                if (i % 10 === 0 && i <= 100)
                  passive.effectiveness += .08;
                else if (i <= 100)
                  passive.secondaryEffectiveness += .02;
              }
            }

            var permanentPassive = nemesisGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              var totalGainCount = 0;
              nemesisGod.permanentPassiveGainCount.forEach(item => {
                totalGainCount += item[1];
              });

              permanentPassive.effectiveness = 0;
              permanentPassive.secondaryEffectiveness = totalGainCount * .04;
            }
          }
        }
        if (version === .7) {
          this.initializationService.initializeBalladOfTheLabyrinth();

          var poseidon = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Poseidon);
          if (poseidon !== undefined) {
            this.globalService.assignGodAbilityInfo(poseidon);
            poseidon.displayOrder = 10;
          }

          var thePeakSubZone = this.balladService.findSubzone(SubZoneEnum.WarForTheMountainThePeak);
          if (thePeakSubZone !== undefined && thePeakSubZone.isAvailable && thePeakSubZone.victoryCount > 0) {
            var labyrinth = this.balladService.findBallad(BalladEnum.Labyrinth);
            var crete = this.balladService.findZone(ZoneEnum.Crete);
            var travelsAtSea = this.balladService.findSubzone(SubZoneEnum.CreteTravelsAtSea);

            if (labyrinth !== undefined) {
              labyrinth.isAvailable = true;
              labyrinth.notify = true;
            }
            if (crete !== undefined) {
              crete.isAvailable = true;
              crete.notify = true;
            }
            if (travelsAtSea !== undefined) {
              travelsAtSea.isAvailable = true;
              travelsAtSea.notify = true;

              this.achievementService.createDefaultAchievementsForSubzone(travelsAtSea.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
          }

          this.globalService.globalVar.characters.forEach(character => {
            character.linkInfo.totalLinks += Math.floor((character.level + 4) / 10);
            character.linkInfo.remainingLinks += Math.floor((character.level + 4) / 10);
          });
        }
        if (version === .71) {
          var monk = new Character(CharacterEnum.Monk);
          monk.name = "Monk";
          monk.type = CharacterEnum.Monk;
          monk.isAvailable = false;
          monk.baseStats = this.globalService.getCharacterBaseStats(CharacterEnum.Monk);
          monk.battleStats = monk.baseStats.makeCopy();
          monk.battleInfo.timeToAutoAttack = this.utilityService.longAutoAttackSpeed;
          monk.battleInfo.autoAttackModifier = this.utilityService.strongAutoAttack;
          this.globalService.calculateCharacterBattleStats(monk);
          this.globalService.assignAbilityInfo(monk);

          this.globalService.globalVar.characters.push(monk);
        }
        if (version === .75) {
          //this.globalService.globalVar.sidequestData.duosUnlocked = false;          
          this.globalService.globalVar.settings.set("showLowPerformanceAnimationFlash", false);
          this.globalService.globalVar.settings.set("showAbilityCooldownPercents", true);
          this.globalService.globalVar.keybinds.set("triggerAction", "enter");
          this.globalService.globalVar.keybinds.set("openTimeFragmentQuickView", "keyF");
          this.globalService.globalVar.keybinds.set("useCharacter1DuoAbility", "keyG");
          this.globalService.globalVar.keybinds.set("useCharacter2DuoAbility", this.keybindService.shiftKeyBind + "keyG");
          this.globalService.globalVar.settings.set("displayQuickViewTimeFragment", true);

          if (this.globalService.globalVar.isSubscriber) {
            this.lookupService.gainResource(new ResourceValue(ItemsEnum.TimeFragment, 2));
          }

          var sympegadesOverlook = this.lookupService.getSubZoneByType(SubZoneEnum.AegeanSeaSympegadesOverlook);
          if (sympegadesOverlook.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.AegeanSeaSympegadesOverlook);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.AegeanSeaSympegadesOverlook).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && sympegadesOverlook !== undefined && sympegadesOverlook.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && sympegadesOverlook !== undefined && sympegadesOverlook.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && sympegadesOverlook !== undefined && sympegadesOverlook.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var aeetesReinforcements = this.lookupService.getSubZoneByType(SubZoneEnum.ColchisReinforcementsFromAeetes);
          if (aeetesReinforcements.isAvailable) {
            this.globalService.globalVar.achievements = this.globalService.globalVar.achievements.filter(item => item.subzone !== SubZoneEnum.ColchisReinforcementsFromAeetes);
            this.achievementService.createDefaultAchievementsForSubzone(SubZoneEnum.ColchisReinforcementsFromAeetes).forEach(achievement => {
              if (achievement.type === AchievementTypeEnum.HundredVictories && aeetesReinforcements !== undefined && aeetesReinforcements.victoryCount >= 100)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.ThousandVictories && aeetesReinforcements !== undefined && aeetesReinforcements.victoryCount >= 500)
                achievement.completed = true;
              if (achievement.type === AchievementTypeEnum.TenThousandVictories && aeetesReinforcements !== undefined && aeetesReinforcements.victoryCount >= 2500)
                achievement.completed = true;

              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var aphrodite = new God(GodEnum.Aphrodite);
          aphrodite.name = "Aphrodite";
          aphrodite.displayOrder = 11;
          this.globalService.assignGodAbilityInfo(aphrodite);
          this.globalService.globalVar.gods.push(aphrodite);

          var hera = new God(GodEnum.Hera);
          hera.name = "Hera";
          hera.displayOrder = 12;
          this.globalService.assignGodAbilityInfo(hera);
          this.globalService.globalVar.gods.push(hera);

          if (this.globalService.globalVar.uniques === undefined)
            this.globalService.globalVar.uniques = [];
          if (this.globalService.globalVar.timeFragmentRuns === undefined)
            this.globalService.globalVar.timeFragmentRuns = [];

          var mountOlympusOlympus = this.balladService.findSubzone(SubZoneEnum.MountOlympusOlympus);
          if (mountOlympusOlympus !== undefined && mountOlympusOlympus.isAvailable) {
            this.achievementService.createDefaultAchievementsForSubzone(mountOlympusOlympus.type).forEach(achievement => {
              this.globalService.globalVar.achievements.push(achievement);
            });
          }

          var theLabyrinth = this.balladService.findZone(ZoneEnum.Labyrinth);
          if (theLabyrinth !== undefined) {
            var cloakedStranger = new SubZone(SubZoneEnum.TheLabyrinthCloakedStranger);
            var safetyCount = 0;

            var solidWall4 = this.balladService.findSubzone(SubZoneEnum.TheLabyrinthSolidWall4);
            if (solidWall4 !== undefined && solidWall4.victoryCount >= 10) {
              cloakedStranger.notify = true;
              cloakedStranger.isAvailable = true;
            }

            theLabyrinth.subzones.push(cloakedStranger);

            while (safetyCount < 20 && theLabyrinth.subzones[theLabyrinth.subzones.length - (safetyCount + 2)].type !== SubZoneEnum.TheLabyrinthSolidWall4) {
              var holder = theLabyrinth.subzones[theLabyrinth.subzones.length - (safetyCount + 2)];
              theLabyrinth.subzones = theLabyrinth.subzones.filter(item => item.type !== holder.type);
              theLabyrinth.subzones.push(holder);

              safetyCount += 1;
            }
          }

          this.globalService.globalVar.gods.forEach(god => {
            god.statGain.linkEffectiveness = 0;
            god.permanentStatGain.linkEffectiveness = 0;
            god.statGain.allyDamageBonus = 0;
            god.permanentStatGain.allyDamageBonus = 0;
            god.permanentStatGain.duoPermanentEffectiveness = 0;
          });

          if (this.globalService.globalVar.currentStoryId === 46) {
            this.lookupService.addStoryToLog(this.globalService.globalVar.currentStoryId, SubZoneEnum.TheLabyrinthLabyrinthCenter);
            this.globalService.globalVar.currentStoryId += 1;
          }

          var thaumaturge = new Character(CharacterEnum.Thaumaturge);
          thaumaturge.name = "Thaumaturge";
          thaumaturge.type = CharacterEnum.Thaumaturge;
          thaumaturge.isAvailable = false;
          thaumaturge.baseStats = this.globalService.getCharacterBaseStats(CharacterEnum.Thaumaturge);
          thaumaturge.battleStats = thaumaturge.baseStats.makeCopy();
          thaumaturge.battleInfo.timeToAutoAttack = this.utilityService.averageAutoAttackSpeed;
          thaumaturge.battleInfo.autoAttackModifier = this.utilityService.averageAutoAttack;
          this.globalService.calculateCharacterBattleStats(thaumaturge);
          this.globalService.assignAbilityInfo(thaumaturge);

          this.globalService.globalVar.characters.push(thaumaturge);

          var monkClass = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Monk);
          if (monkClass !== undefined) {
            var ability1 = monkClass.abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (ability1 !== undefined) {
              ability1.effectiveness = .8;
              ability1.secondaryEffectiveness = 1.5;
              ability1.cooldown = ability1.currentCooldown = 9;
              ability1.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.PalmStrike, -1, 1, false, false, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, 3));
            }

            var permanentAbility1Upgrades = monkClass.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (permanentAbility1Upgrades !== undefined) {
              permanentAbility1Upgrades.effectiveness = 0;

              monkClass.permanentAbility1GainCount.forEach(item => {
                permanentAbility1Upgrades!.effectiveness += item[1] * (.075 * Math.ceil(item[0] / 10));
              });
            }

            var passive = monkClass.abilityList.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
            if (passive !== undefined) {
              passive.userEffect = [];
              passive.effectiveness = .1;
              passive.secondaryEffectiveness = 2;
            }

            var permanentPassiveUpgrades = monkClass.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
            if (permanentPassiveUpgrades !== undefined) {
              permanentPassiveUpgrades!.userEffect = [];

              monkClass.permanentPassiveGainCount.forEach(item => {
                permanentPassiveUpgrades!.effectiveness += item[1] * (.015 * Math.ceil(item[0] / 10));
              });
            }

            var ability2 = monkClass.abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
            if (ability2 !== undefined) {
              ability2.userEffect = [];
              ability2.targetEffect = [];
              ability2.effectiveness = 2.1;
              ability2.dealsDirectDamage = true;
              ability2.cooldown = ability2.currentCooldown = 36;
              ability2.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenUp, 7, 1.25, false, false));
              ability2.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageDealtDown, 7, .75, false, false));
              ability2.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 7, .25, false, false));
            }

            var permanentPassiveUpgrades = monkClass.permanentAbilityUpgrades.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
            if (permanentPassiveUpgrades !== undefined) {
              permanentPassiveUpgrades!.effectiveness = 0;
              monkClass.permanentAbility2GainCount.forEach(item => {
                permanentPassiveUpgrades!.effectiveness += item[1] * (.125 * Math.ceil(item[0] / 10));
              });
            }
          }

          var dionysusGod = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Dionysus);
          if (dionysusGod !== undefined) {
            var ability2 = dionysusGod.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (ability2 !== undefined)
              ability2.cooldown += 10;

            var permanentAbility1 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined && permanentAbility1.userEffect.length > 0) {
              permanentAbility1.userEffect[0].threshold = (permanentAbility1.userEffect[0].threshold * .6);
            }

            var permanentAbility2 = dionysusGod.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility2 !== undefined && permanentAbility2.targetEffect.length > 0) {
              permanentAbility2.targetEffect[0].effectiveness = (permanentAbility2.targetEffect[0].effectiveness * (4 / 5) * (2 / 5));
            }
          }

          var artemis = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Artemis);
          if (artemis !== undefined) {
            var passive = artemis.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (passive !== undefined) {
              passive.effectiveness = 1.1;
              passive.secondaryEffectiveness = 1;

              for (var i = 1; i <= passive.abilityUpgradeLevel; i++) {
                if (i % 10 === 0 && i <= 100)
                  passive.secondaryEffectiveness += .02;
                else if (i <= 100)
                  passive.effectiveness += .02;
              }
            }

            var permanentPassive = artemis.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness = permanentPassive.effectiveness / 5;
            }
          }

          var hermes = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hermes);
          if (hermes !== undefined) {
            var permanentPassive = hermes.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness = permanentPassive.effectiveness / 2;
            }
          }

          var zeus = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Zeus);
          if (zeus !== undefined) {
            var permanentPassive = zeus.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined && permanentPassive.userEffect.length > 0) {
              permanentPassive.userEffect[0].effectiveness = permanentPassive.userEffect[0].effectiveness * (2 / 5);
            }
          }

          var apollo = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Apollo);
          if (apollo !== undefined) {
            var permanentAbility2 = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility2 !== undefined) {
              permanentAbility2.effectiveness = permanentAbility2.effectiveness / 3;
            }

            var permanentAbility3 = apollo.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentAbility3 !== undefined) {
              permanentAbility3.effectiveness = permanentAbility3.effectiveness * (2 / 3);
            }
          }

          var ares = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Ares);
          if (ares !== undefined) {
            var permanentAbility1 = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.defaultGodAbilityLevel);
            if (permanentAbility1 !== undefined && permanentAbility1.targetEffect.length > 0) {
              permanentAbility1.targetEffect[0].effectiveness = permanentAbility1.targetEffect[0].effectiveness / 4;
            }

            var permanentPassive = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentPassive !== undefined) {
              permanentPassive.effectiveness = permanentPassive.effectiveness / 2.9;
            }

            var permanentAbility2 = ares.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (permanentAbility2 !== undefined && permanentAbility2.targetEffect.length > 0) {
              permanentAbility2.targetEffect[0].duration /= 2;
            }
          }

          var athena = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Athena);
          if (athena !== undefined) {
            var secondWind = athena.abilityList.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (secondWind !== undefined) {
              if (secondWind.abilityUpgradeLevel >= 45) {
                secondWind.userEffect[0].maxCount = 2;
                secondWind.userEffect[0].effectiveness -= 47;
              }
              else
                secondWind.userEffect[0].maxCount = 1;
            }

            var heavenlyShield = athena.abilityList.find(ability => ability.requiredLevel === this.utilityService.godAbility2Level);
            if (heavenlyShield !== undefined) {
              var originalEffect = heavenlyShield.userEffect[0];
              heavenlyShield.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.HealingReceivedUp, originalEffect.duration, 1.25, false, true));
            }

            var permanentSecondWind = athena.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godPassiveLevel);
            if (permanentSecondWind !== undefined && permanentSecondWind.userEffect.length > 0) {
              permanentSecondWind.userEffect[0].effectiveness = (permanentSecondWind.userEffect[0].effectiveness / 250) * .05;
            }

            var permanentBlindingLight = athena.permanentAbilityUpgrades.find(ability => ability.requiredLevel === this.utilityService.godAbility3Level);
            if (permanentBlindingLight !== undefined) {
              permanentBlindingLight.effectiveness = (permanentBlindingLight.effectiveness / .25) * .35;
            }
          }
        }
        if (version === .76) {
          var starsNormal = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsNormal);
          var starsHard = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsHard);
          var starsVeryHard = this.globalService.globalVar.trialDefeatCount.find(item => item.type === TrialEnum.TrialOfTheStarsVeryHard);
          if (starsNormal !== undefined && starsNormal.count >= 0) {
            starsNormal.zodiacType = ZodiacEnum.Capricorn;
          }
          if (starsHard !== undefined && starsHard.count >= 0) {
            starsHard.zodiacType = ZodiacEnum.Capricorn;
          }
          if (starsVeryHard !== undefined && starsVeryHard.count >= 0) {
            starsVeryHard.zodiacType = ZodiacEnum.Capricorn;
          }
        }
        if (version === .8) {
          this.globalService.globalVar.sidequestData.circeAlchemyLevel = 0;
          this.globalService.globalVar.settings.set("showBigNumberColors", false);

          this.initializationService.initializeBalladOfTheWitch();

          this.globalService.globalVar.settings.set("showPauseMessage", true);
          if (this.globalService.globalVar.settings.get("loadingTime") === this.utilityService.lowActiveTimeLimit)
            this.globalService.globalVar.settings.set("loadingTime", this.utilityService.averageActiveTimeLimit);

          this.globalService.globalVar.gods.forEach(god => {
            god.permanentStat5GainCount.forEach(count => {
              if (count[1] > this.utilityService.godPermanentStatGain5ObtainCap)
                count[1] = this.utilityService.godPermanentStatGain5ObtainCap;
            });

            god.permanentStat6GainCount.forEach(count => {
              if (count[1] > this.utilityService.godPermanentStatGain6ObtainCap)
                count[1] = this.utilityService.godPermanentStatGain6ObtainCap;
            });

            god.permanentDuoAbilityGainCount.forEach(count => {
              if (count[1] > this.utilityService.godPermanentDuoAbilityObtainCap)
                count[1] = this.utilityService.godPermanentDuoAbilityObtainCap;
            });

            god.permanentStat7GainCount.forEach(count => {
              if (count[1] > this.utilityService.godPermanentStatGain7ObtainCap)
                count[1] = this.utilityService.godPermanentStatGain7ObtainCap;
            });
          });

          var monkClass = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Monk);
          if (monkClass !== undefined) {
            var passive = monkClass.abilityList.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
            if (passive !== undefined) {
              passive.secondaryEffectiveness = 1.5;
            }
          }

          var archerClass = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Archer);
          if (archerClass !== undefined) {
            var ability2 = archerClass.abilityList.find(item => item.requiredLevel === this.utilityService.characterAbility2Level);
            if (ability2 !== undefined && ability2.targetEffect.length > 0) {
              ability2.targetEffect[0].duration = 2;
            }
          }

          var warriorClass = this.globalService.globalVar.characters.find(item => item.type === CharacterEnum.Warrior);
          if (warriorClass !== undefined) {
            var ability1 = warriorClass.abilityList.find(item => item.requiredLevel === this.utilityService.defaultCharacterAbilityLevel);
            if (ability1 !== undefined && ability1.targetEffect.length > 1) {
              ability1.targetEffect[0].duration = 12;
              ability1.targetEffect[1].duration = 12;
            }
            var passive = warriorClass.abilityList.find(item => item.requiredLevel === this.utilityService.characterPassiveLevel);
            if (passive !== undefined) {
              passive.threshold = .5;
            }
          }

          var labyrinthCenterSubZone = this.balladService.findSubzone(SubZoneEnum.TheLabyrinthLabyrinthCenter);
          if (labyrinthCenterSubZone !== undefined && labyrinthCenterSubZone.isAvailable && labyrinthCenterSubZone.victoryCount > 0) {
            var witch = this.balladService.findBallad(BalladEnum.Witch);
            var aiaia = this.balladService.findZone(ZoneEnum.Aiaia);
            var unknownWaters = this.balladService.findSubzone(SubZoneEnum.AiaiaUnknownWaters);

            if (witch !== undefined) {
              witch.isAvailable = true;
              witch.notify = true;
            }
            if (aiaia !== undefined) {
              aiaia.isAvailable = true;
              aiaia.notify = true;
            }
            if (unknownWaters !== undefined) {
              unknownWaters.isAvailable = true;
              unknownWaters.notify = true;

              this.achievementService.createDefaultAchievementsForSubzone(unknownWaters.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
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
