import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor() { }

  getConfirmationModalText() {
    return "Thank you for becoming a subscriber!";
  }
}
