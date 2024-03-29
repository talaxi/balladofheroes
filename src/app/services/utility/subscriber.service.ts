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
    "Two Time Fragments<br/>" + 
    "The necklaces <strong class='specialEquipment'>Dark Moon Pendant</strong> and <strong class='specialEquipment'>Blazing Sun Pendant</strong><br/><br/>" + 
    "You will automatically gain any future additions to the subscriber benefits. <br/><br/>" +
    "<b><i>It is highly recommend to export a save file from the Settings menu now that you have subscribed. If you ever want to start the game over in the future, selecting 'Reset Game' from the Settings page will let you restart with your Subscriber benefits still active.</i></b>";
  }
}
