import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as seedrandom from "seedrandom";
import * as pluralize from 'pluralize';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from 'src/app/components/subcomponents/utility/confirmation-box/confirmation-box.component';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  //glossary
  public activeTimeLimit = 1 * 30 * 60;
  public extraSpeedTimeLimit = 8 * 60 * 60;

  public quickAutoAttackSpeed = 6;
  public averageAutoAttackSpeed = 8;
  public longAutoAttackSpeed = 10;

  public enemyQuickAutoAttackSpeed = 5;
  public enemyAverageAutoAttackSpeed = 10;
  public enemyLongAutoAttackSpeed = 15;
  public enemyVeryLongAutoAttackSpeed = 20;

  public maxItemBeltSize = 4;
  public defaultCharacterAbilityLevel = 2;
  public characterPassiveLevel = 4;
  public characterOverdriveLevel = 10;
  public characterAbility2Level = 8;
  public defaultGodAbilityLevel = 1;
  public godPassiveLevel = 5;
  public godAbility2Level = 20;
  public godAbility3Level = 75;
  public permanentPassiveGodLevel = 125;
  public permanentGodAbility2Level = 175;
  public permanentGodAbility3Level = 375;

  public godStatGainLevelIncrement = (1 / 18);
  public godStatGainBaseAmount = 6;
  public godPermanentStatGain1ObtainCap = 10;
  public godPermanentStatGain2ObtainCap = 10;

  public firstAlchemyLevelCap = 25;
  public alchemyLevelCapGain = 25;
  public firstJewelcraftingLevelCap = 50; //TODO: make 25
  public jewelcraftingLevelCapGain = 25;

  public smallAltarAffinityGain = 1;
  public largeAltarAffinityGain = 5;
  public pyreAffinityGain = 20;

  public affinityRewardPrayerDuration = .5;
  public affinityRewardPrayerEffectiveness = .5;
  public affinityRewardGodXpBonus = .1;
  public basePrayGodXpIncrease = 20;
  public largeAltarPrayGodXpIncrease = 250;

  public killCountDisplayEnemyStatsAbilities = 1;
  public killCountDisplayBasicEnemyLoot = 10;
  public killCountDisplayFullEnemyLoot = 30;

  public overdriveDamageNeededToUnlockProtection = 100000;
  public overdriveAttacksNeededToUnlockNature = 250000;

  public enemyMinorElementalWeakness = -.1;
  public enemyMediumElementalWeakness = -.25;
  public enemyMajorElementalWeakness = -.5;

  public preferredGodStartTime1 = 4;
  public preferredGodEndTime1 = 12;
  public preferredGodStartTime2 = 12;
  public preferredGodEndTime2 = 20;
  public preferredGodStartTime3 = 20;
  public preferredGodEndTime3 = 4;

  public followerSearchZoneInterval = 60;
  public smallAltarActivationChancePerFollower = .25;
  public smallAltarPrayChancePerFollower = .02;
  public largeAltarActivationChancePerFollower = .1;
  public largeAltarPrayChancePerFollower = .01;

  public genericRoundTo = 4; //rounds generic math values to 4 numbers after decimal

  constructor(public sanitizer: DomSanitizer, public dialog: MatDialog) { }

  getSanitizedHtml(text: string) {
    var sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(text));

    if (sanitizedHtml === null)
      return "";

    return sanitizedHtml;
  }

  getRandomSeededInteger(min: number, max: number, seedValue: string = "seeded"): number {
    var prng = seedrandom(seedValue);
    return Math.round(prng() * (max - min) + min);
  }

  getRandomInteger(min: number, max: number): number {
    min -= .500000001;
    max += .499999999;
    return Math.round((Math.random() * (max - min) + min));
  }

  getRandomSeededNumber(min: number, max: number, seedValue: string = "seeded") {
    var prng = seedrandom(seedValue);
    return (prng() * (max - min) + min);
  }

  getRandomNumber(min: number, max: number): number {
    return (Math.random() * (max - min) + min);
  }

  getRandomNumberPercent(): number {
    return (Math.random() * (99) + 1);
  }

  getNumericValueOfCircuitRank(circuitRank: string) {
    var circuitValue = 0;
    if (circuitRank.length > 1) {
      circuitValue = 26 * (circuitRank.length - 1);
    }

    circuitValue += 91 - circuitRank.charCodeAt(circuitRank.length - 1);
    return circuitValue;
  }

  getCircuitRankFromNumericValue(numericValue: number) {
    var circuitValue = "";
    while (numericValue > 26) {
      circuitValue += "A";
      numericValue -= 26;
    }

    circuitValue += String.fromCharCode(91 - numericValue);
    return circuitValue;
  }

  getHoursRemainingFromSeconds(seconds: number) {
    return Math.floor(seconds / 3600);
  }

  getMinutesLeftInHourRemainingFromSeconds(seconds: number) {
    var hours = Math.floor(seconds / 3600);
    return Math.floor((seconds / 60) - (hours * 60));
  }

  getSecondsLeftInMinuteRemainingFromSeconds(seconds: number) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds / 60) - (hours * 60));
    return (seconds - (hours * 60 * 60) - (minutes * 60));
  }

  convertSecondsToHHMMSS(secondsRemaining: number) {
    var hours = Math.floor(secondsRemaining / 3600);
    var minutes = Math.floor((secondsRemaining / 60) - (hours * 60));
    var seconds = (secondsRemaining - (hours * 60 * 60) - (minutes * 60));

    var hoursDisplay = hours.toString();
    var minutesDisplay = minutes.toString();
    var secondsDisplay = Math.floor(seconds).toString();
    if (hours < 10) {
      if (hours < 1 || hours > 59)
        hoursDisplay = "00";
      else
        hoursDisplay = String(hoursDisplay).padStart(2, '0');
    }
    if (minutes < 10) {
      if (minutes < 1 || minutes > 59)
        minutesDisplay = "00";
      else
        minutesDisplay = String(minutesDisplay).padStart(2, '0');
    }

    if (seconds < 10) {
      if (seconds < 1 || seconds > 59)
        secondsDisplay = "00";
      else
        secondsDisplay = String(secondsDisplay).padStart(2, '0');
    }

    return hoursDisplay + ":" + minutesDisplay + ":" + secondsDisplay;
  }

  convertSecondsToMMSS(secondsRemaining: number) {
    var hours = Math.floor(secondsRemaining / 3600);
    var minutes = Math.floor((secondsRemaining / 60) - (hours * 60));
    var seconds = (secondsRemaining - (hours * 60 * 60) - (minutes * 60));

    var hoursDisplay = hours.toString();
    var minutesDisplay = minutes.toString();
    var secondsDisplay = Math.floor(seconds).toString();
    if (hours < 10) {
      if (hours < 1 || hours > 59)
        hoursDisplay = "00";
      else
        hoursDisplay = String(hoursDisplay).padStart(2, '0');
    }
    if (minutes < 10) {
      if (minutes < 1 || minutes > 59)
        minutesDisplay = "00";
      else
        minutesDisplay = String(minutesDisplay).padStart(2, '0');
    }

    if (seconds < 10) {
      if (seconds < 1 || seconds > 59)
        secondsDisplay = "00";
      else
        secondsDisplay = String(secondsDisplay).padStart(2, '0');
    }

    return minutesDisplay + ":" + secondsDisplay;
  }

  ordinalSuffixOf(i: number) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  roundTo(value: number, degree: number) {
    return Math.round((value + Number.EPSILON) * (10 ** degree)) / (10 ** degree);
  }

  //level 0 = 1
  //level 1 = 2
  //level 2 = 3
  //level 3 = 5
  getFibonacciValue(level: number) {
    var i;
    var fib = [0, 1];

    for (i = 0; i <= level; i++) {
      fib[i + 2] = fib[i] + fib[i + 1];
    }

    return fib[level + 2];
  }

  bigNumberReducer(originalAmount: number) {
    var originalAmount = Math.round(originalAmount);
    var reducedNumber = "";

    if (this.getDigitCount(originalAmount) <= 3)
      reducedNumber = originalAmount.toString();
    else if (this.getDigitCount(originalAmount) <= 6) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 3;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      reducedNumber += "K";
    }

    return reducedNumber;
  }

  getDigitCount(x: number) {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
  }

  //angular material creates all of these divs and they don't close and it causes lag issues
  removeExcessOverlayDivs() {
    var elements = document.getElementsByClassName('cdk-overlay-container');
    var elementLength = elements.length;

    if (elements !== null && elements !== undefined && elementLength > 0) {
      for (var i = 0; i < elementLength; i++) {
        elements[0].replaceChildren();
      }
    }
  }

  handlePlural(text: string) {
    if (text === "Boon of Olympus" || text === "Fennel" || text === "Bonus XP")
      return text;

    if (text === "Vial of the Lethe")
      return "Vials of the Lethe";

    if (text === "Vial of Lake Lerna")
      return "Vials of the Lake Lerna";

    if (text === "Vial of the Black Sea")
      return "Vials of the Black Sea";

    if (text === "Essence of Fire")
      return "Essences of Fire";

    if (text === "Small Topaz")
      return "Small Topazes";

    if (text === "Shark Tooth")
      return "Shark Teeth";

    return pluralize(text);
  }

  openConfirmationDialog() {          
    return this.dialog.open(ConfirmationBoxComponent, { width: '40%', height: 'auto' });  
  }
}
