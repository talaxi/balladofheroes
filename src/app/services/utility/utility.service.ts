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
  public shopBuyMultiplier = 1;
  public ctrlPressed: boolean = false;
  public shiftPressed: boolean = false;
  public altPressed: boolean = false;

  //glossary
  public lowActiveTimeLimit = 1 * 30 * 60;
  public averageActiveTimeLimit = 1 * 60 * 60;
  public highActiveTimeLimit = 2 * 60 * 60;
  public veryHighActiveTimeLimit = 4 * 60 * 60;
  public extremelyHighActiveTimeLimit = 8 * 60 * 60;
  public maximumActiveTimeLimit = 24 * 60 * 60;

  public extraSpeedTimeLimit = 12 * 60 * 60;
  public patronExtraSpeedTimeLimit = 24 * 60 * 60;

  public lowFps = 16;
  public averageFps = 32;
  public highFps = 64;

  public timeFragmentClearRateMinimumSeconds = 3;
  public friendlyCompetitionDamageReduction = .2;
  public trialOfSkillBuffHours = 6;

  public lowLoadingAccuracy = 10;
  public averageLoadingAccuracy = 5;
  public highLoadingAccuracy = 2;

  public quickDoubleClickTiming = 250;
  public averageDoubleClickTiming = 1000;
  public longDoubleClickTiming = 5000;

  public quickAutoAttackSpeed = 6;
  public averageAutoAttackSpeed = 8;
  public longAutoAttackSpeed = 10;
  public weakAutoAttack = .6;
  public averageAutoAttack = .8;
  public strongAutoAttack = 1;

  public enemyQuickAutoAttackSpeed = 5;
  public enemyAverageAutoAttackSpeed = 10;
  public enemyLongAutoAttackSpeed = 15;
  public enemyVeryLongAutoAttackSpeed = 20;

  public maxItemBeltSize = 4;
  public defaultCharacterAbilityLevel = 2;
  public characterPassiveLevel = 4;
  public characterLinkLevel = 6;
  public characterOverdriveLevel = 10;
  public characterAbility2Level = 8;
  public defaultGodAbilityLevel = 1;
  public godPassiveLevel = 5;
  public godAbility2Level = 20;
  public godAbility3Level = 75;
  public permanentPassiveGodLevel = 125;
  public permanentGodAbility2Level = 175;
  public permanentGodAbility3Level = 375;
  public duoAbilityLevel = 3000;

  public godStatGainLevelIncrement = (1 / 25);
  public godStatGainBaseAmount = 6;
  public godPermanentStatGain1ObtainCap = 10;
  public godPermanentStatGain2ObtainCap = 10;
  public godPermanentStatGain3ObtainCap = 10;
  public godPermanentStatGain4ObtainCap = 10;
  public godPermanentStatGain5ObtainCap = 10;
  public godPermanentStatGain6ObtainCap = 10;
  public godPermanentStatGain7ObtainCap = 10;
  public godPermanentStatGain8ObtainCap = 10;
  public godPermanentDuoAbilityObtainCap = 10;
  public godPermanentAbility1ObtainCap = 10;
  public godPermanentPassiveObtainCap = 10;
  public godPermanentAbility2ObtainCap = 10;
  public godPermanentAbility3ObtainCap = 10;
  public characterPermanentAbility1ObtainCap = 25;
  public characterPermanentAbility2ObtainCap = 25;
  public characterPermanentPassiveObtainCap = 25;
  public characterPermanentStatObtainCap = 25;

  public maxTrialOfResolveStage = 70;
  
  public damageLinkBoost = 10;
  public nonDamageLinkBoost = 15;
  public linkCooldown = 15;

  public zodiacGodXpBoost = .2;
  public zodiacGodResetBoost = .2;
  public zodiacGodStatBoost = .2;

  public firstAlchemyLevelCap = 25;
  public alchemyLevelCapGain = 25;
  public firstJewelcraftingLevelCap = 25;
  public jewelcraftingLevelCapGain = 25;

  public smallAltarAffinityGain = 1;
  public largeAltarAffinityGain = 5;
  public pyreAffinityGain = 20;

  public affinityRewardPrayerDuration = .5;
  public affinityRewardPrayerEffectiveness = .5;
  public affinityRewardGodXpBonus = .1;
  public basePrayGodXpIncrease = 20;
  public largeAltarPrayGodXpIncrease = 250;

  public killCountDisplayEnemyStatsAbilities = 0;
  public killCountDisplayBasicEnemyLoot = 10;
  public killCountDisplayFullEnemyLoot = 30;

  public overdriveDamageNeededToUnlockProtection = 100000;
  public overdriveAttacksNeededToUnlockNature = 250000;
  public overdriveHitsNeededToUnlockReprisal = 25000;
  public overdriveHealingNeededToUnlockPreservation = 100000;
  public overdriveHealsNeededToUnlockHarmony = 25000;
  public overdriveCriticalsNeededToUnlockBullseye = 15000;

  public reprisalAmount = 1;
  public reprisalBonus = 2;
  public preservationAmount = .5;
  public bullseyeAmount = .5;
  public quicknessCooldownReduction = 2;
  public hopeThresholdMultiplier = 2;

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
  public genericShortRoundTo = 2; //rounds generic math values to 2 numbers after decimal
  public weeklyMeleeEntryCap = 7;
  public levelsNeededForAmbrosia = 50;

  public trialAffinityXpGain = 200;
  public timeFragmentEfficiency = .2;
  public supporterTimeFragmentEfficiency = .3;

  constructor(public sanitizer: DomSanitizer, public dialog: MatDialog) { }

  isMainSite() {
    var isMainSite = false;
    var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
    if (url.toLowerCase().includes("talaxi.github")) {
      isMainSite = true;
    }

    return isMainSite;
  }

  isKongregate() {
    var isKongregate = false;
    var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
    if (url.toLowerCase().includes("kongregate")) {
      isKongregate = true;
    }

    return isKongregate;
  }

  getSanitizedHtml(text: string) {
    var sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(text));

    if (sanitizedHtml === null)
      return "";

    return sanitizedHtml;
  }

  getRandomSeededInteger(min: number, max: number, seedValue: string = "seeded"): number {
    var prng = seedrandom(seedValue);
    min -= .500000001;
    max += .499999999;
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

  convertMillisecondsToMMSS(secondsRemaining: number) {
    var hours = Math.floor(secondsRemaining / 3600);
    var minutes = Math.floor((secondsRemaining / 60) - (hours * 60));
    var seconds = (secondsRemaining - (hours * 60 * 60) - (minutes * 60));
    var milliseconds = this.roundTo(secondsRemaining - Math.floor(secondsRemaining), 3);

    var minutesDisplay = minutes.toString();
    var secondsDisplay = Math.floor(seconds).toString();
    var millisecondsDisplay = (milliseconds * 1000).toString();

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

    //if (milliseconds)

    if (milliseconds < 100 && milliseconds >= 10) {
      millisecondsDisplay = String(millisecondsDisplay).padStart(2, '0');
    }
    else if (milliseconds < 10) {
      millisecondsDisplay = String(millisecondsDisplay).padStart(3, '0');
    }

    return minutesDisplay + ":" + secondsDisplay + "." + millisecondsDisplay;
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

  genericRound(value: number) {
    return this.roundTo(value, this.genericRoundTo);
  }

  genericShortRound(value: number) {
    return this.roundTo(value, this.genericShortRoundTo);
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

  bigNumberReducer(includeSpan: boolean, originalAmount: number) {
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

      if (includeSpan)
        reducedNumber += "<span class='thousandsNumber'>K</span>";
      else
        reducedNumber += "K";
    }
    else if (this.getDigitCount(originalAmount) <= 9) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 6;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='millionsNumber'>M</span>";
      else
        reducedNumber += "M";
    }
    else if (this.getDigitCount(originalAmount) <= 12) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 9;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='billionsNumber'>B</span>";
      else
        reducedNumber += "B";
    }
    else if (this.getDigitCount(originalAmount) <= 15) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 12;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='trillionsNumber'>T</span>";
      else
        reducedNumber += "T";
    }
    else if (this.getDigitCount(originalAmount) <= 18) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 15;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='aaNumber'>AA</span>";
      else
        reducedNumber += "AA";
    }
    else if (this.getDigitCount(originalAmount) <= 21) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 18;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AB</span>";
      else
        reducedNumber += "AB";
    }
    else if (this.getDigitCount(originalAmount) <= 24) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 21;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AC</span>";
      else
        reducedNumber += "AC";
    }
    else if (this.getDigitCount(originalAmount) <= 27) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 24;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AD</span>";
      else
        reducedNumber += "AD";
    }
    else if (this.getDigitCount(originalAmount) <= 30) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 27;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AE</span>";
      else
        reducedNumber += "AE";
    }
    else if (this.getDigitCount(originalAmount) <= 33) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 30;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AF</span>";
      else
        reducedNumber += "AF";
    }
    else if (this.getDigitCount(originalAmount) <= 36) {
      var leadingNumberCount = this.getDigitCount(originalAmount) - 33;
      reducedNumber = originalAmount.toString().substring(0, leadingNumberCount);
      if (3 - leadingNumberCount > 0) {
        var remainingCount = 3 - leadingNumberCount;
        reducedNumber += "." + originalAmount.toString().substring(leadingNumberCount, leadingNumberCount + remainingCount);
      }

      if (includeSpan)
        reducedNumber += "<span class='abNumber'>AG</span>";
      else
        reducedNumber += "AG";
    }
    //gg you beat the game

    return reducedNumber;
  }

  getDigitCount(x: number) {
    return Math.log(x) * Math.LOG10E + 1 | 0;
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

    if (text === "Vial of the Cretan Sea")
      return "Vials of the Cretan Sea";

      if (text === "Vial of Foreign Waters")
      return "Vials of Foreign Waters";

      if (text === "Vial of Tartaran Flames")
      return "Vials of Tartaran Flames";

    if (text === "Essence of Fire")
      return "Essences of Fire";

    if (text === "Essence of Water")
      return "Essences of Water";

    if (text === "Essence of Earth")
      return "Essences of Earth";

    if (text === "Essence of Lightning")
      return "Essences of Lightning";

    if (text === "Essence of Air")
      return "Essences of Air";

    if (text === "Essence of Holy")
      return "Essences of Holy";

    if (text === "Small Topaz")
      return "Small Topazes";

    if (text === "Shark Tooth")
      return "Shark Teeth";

    return pluralize(text);
  }

  openConfirmationDialog(confirmationBoxComponent?: any) {
    if (confirmationBoxComponent !== undefined)
      return this.dialog.open(confirmationBoxComponent, { width: '40%', height: 'auto' });
    else
      return this.dialog.open(ConfirmationBoxComponent, { width: '40%', height: 'auto' });
  }
}
