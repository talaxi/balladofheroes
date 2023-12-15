import { Injectable } from '@angular/core';
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { God } from 'src/app/models/character/god.model';

@Injectable({
  providedIn: 'root'
})
export class ZodiacService {

  constructor() { }

  getBonusGods(availableGods?: God[]) {
    var zodiac = this.getCurrentZodiac();
    var bonusGods: GodEnum[] = [];

    if (zodiac === ZodiacEnum.Aries) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Ares))
        bonusGods.push(GodEnum.Ares);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Athena))
        bonusGods.push(GodEnum.Athena);
    }
    if (zodiac === ZodiacEnum.Taurus) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Artemis))
        bonusGods.push(GodEnum.Artemis);
      //bonusGods.push(GodEnum.Athena); //Aphrodite
    }
    if (zodiac === ZodiacEnum.Gemini) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Zeus))
        bonusGods.push(GodEnum.Zeus);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Hermes))
        bonusGods.push(GodEnum.Hermes);
    }
    if (zodiac === ZodiacEnum.Cancer) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Poseidon))
        bonusGods.push(GodEnum.Poseidon);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Dionysus))
        bonusGods.push(GodEnum.Dionysus);
    }
    if (zodiac === ZodiacEnum.Leo) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Apollo))
        bonusGods.push(GodEnum.Apollo);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Hades))
        bonusGods.push(GodEnum.Hades);
    }
    if (zodiac === ZodiacEnum.Virgo) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Hermes))
        bonusGods.push(GodEnum.Hermes);
      //bonusGods.push(GodEnum.Athena); //Hera
    }
    if (zodiac === ZodiacEnum.Libra) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Nemesis))
        bonusGods.push(GodEnum.Nemesis);
      //bonusGods.push(GodEnum.Athena); //Aphrodite
    }
    if (zodiac === ZodiacEnum.Scorpio) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Ares))
        bonusGods.push(GodEnum.Ares);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Hades))
        bonusGods.push(GodEnum.Hades);
    }
    if (zodiac === ZodiacEnum.Sagittarius) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Zeus))
        bonusGods.push(GodEnum.Zeus);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Artemis))
        bonusGods.push(GodEnum.Artemis);
    }
    if (zodiac === ZodiacEnum.Capricorn) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Apollo))
        bonusGods.push(GodEnum.Apollo);
      //bonusGods.push(GodEnum.Hades); //Hera
    }
    if (zodiac === ZodiacEnum.Aquarius) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Dionysus))
        bonusGods.push(GodEnum.Dionysus);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Nemesis))
        bonusGods.push(GodEnum.Nemesis);
    }
    if (zodiac === ZodiacEnum.Pisces) {
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Poseidon))
        bonusGods.push(GodEnum.Poseidon);
      if (availableGods === undefined || availableGods.some(item => item.type === GodEnum.Athena))
        bonusGods.push(GodEnum.Athena);
    }

    return bonusGods;
  }

  getCurrentZodiac() {
    var zodiacSign: ZodiacEnum = ZodiacEnum.None;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    if (month === 1) {
      zodiacSign = day <= 20 ? ZodiacEnum.Capricorn : ZodiacEnum.Aquarius;
    } else if (month === 2) {
      zodiacSign = day <= 19 ? ZodiacEnum.Aquarius : ZodiacEnum.Pisces;
    } else if (month === 3) {
      zodiacSign = day <= 20 ? ZodiacEnum.Pisces : ZodiacEnum.Aries;
    } else if (month === 4) {
      zodiacSign = day <= 19 ? ZodiacEnum.Aries : ZodiacEnum.Taurus;
    } else if (month === 5) {
      zodiacSign = day <= 20 ? ZodiacEnum.Taurus : ZodiacEnum.Gemini;
    } else if (month === 6) {
      zodiacSign = day <= 20 ? ZodiacEnum.Gemini : ZodiacEnum.Cancer;
    } else if (month === 7) {
      zodiacSign = day <= 22 ? ZodiacEnum.Cancer : ZodiacEnum.Leo;
    } else if (month === 8) {
      zodiacSign = day <= 22 ? ZodiacEnum.Leo : ZodiacEnum.Virgo;
    } else if (month === 9) {
      zodiacSign = day <= 22 ? ZodiacEnum.Virgo : ZodiacEnum.Libra;
    } else if (month === 10) {
      zodiacSign = day <= 22 ? ZodiacEnum.Libra : ZodiacEnum.Scorpio; 
    } else if (month === 11) {
      zodiacSign = day <= 21 ? ZodiacEnum.Scorpio : ZodiacEnum.Sagittarius; 
    } else if (month === 12) {
      zodiacSign = day <= 21 ? ZodiacEnum.Pisces : ZodiacEnum.Capricorn; //TODO: FIRST ONE SHOULD BE Sagittarius
    }

    return zodiacSign;
  }
}
