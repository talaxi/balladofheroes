import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as seedrandom from "seedrandom";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  //glossary
  public quickAutoAttackSpeed = 4;
  public averageAutoAttackSpeed = 8;
  public longAutoAttackSpeed = 12;
  
  public maxItemBeltSize = 4;
  public defaultCharacterAbilityLevel = 1;
  public characterPassiveLevel = 2;
  public characterAbility2Level = 5;
  public godAbility2Level = 5;
  public godPassiveLevel = 2;
  public godAbility3Level = 10;

  constructor(public sanitizer: DomSanitizer) { }

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
}
