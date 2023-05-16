import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor() { }

  getConfirmationModalText() {
    return "Thank you for becoming a subscriber! You receive: <br/><br/>" +
    "The gods <strong class='smallCaps dionysusColor'>Dionysus</strong> and <strong class='smallCaps nemesisColor'>Nemesis</strong><br/>" + 
    "2x the daily <strong>Eternal Melee</strong> tickets and ticket cap<br/>" +
    "100,000 Coins<br/>" + 
    "Double the offline 2x bonus speed cap (24 hours)<br/>" + 
    "The necklaces <strong class='specialEquipment'>Dark Moon Pendant</strong> and <strong class='specialEquipment'>Blazing Sun Pendant</strong><br/><br/>" + 
    "You will automatically gain any future additions to the subscriber benefits.";
  }
}
