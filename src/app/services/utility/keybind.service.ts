import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeybindService {
  altKeyBind = '{alt}';
  ctrlKeyBind = '{ctrl}';
  shiftKeyBind = '{shift}';

  constructor() { }

  doesKeyMatchKeybind(event: KeyboardEvent, binding: string) {
    var lookingforAlt = binding.toLocaleLowerCase().includes(this.altKeyBind.toLocaleLowerCase());
    binding = binding.toLocaleLowerCase().replace(this.altKeyBind.toLocaleLowerCase(), "");

    var lookingforCtrl = binding.toLocaleLowerCase().includes(this.ctrlKeyBind.toLocaleLowerCase());
    binding = binding.toLocaleLowerCase().replace(this.ctrlKeyBind.toLocaleLowerCase(), "");

    var lookingforShift = binding.toLocaleLowerCase().includes(this.shiftKeyBind.toLocaleLowerCase());
    binding = binding.toLocaleLowerCase().replace(this.shiftKeyBind.toLocaleLowerCase(), "");

    if (event.code.toLowerCase() === binding.toLowerCase() && ((!lookingforAlt && !event.altKey) || (lookingforAlt && event.altKey))
      && ((!lookingforCtrl && !event.ctrlKey) || (lookingforCtrl && event.ctrlKey))
      && ((!lookingforShift && !event.shiftKey) || (lookingforShift && event.shiftKey)))
      return true;

    return false;
  }

  getKeybindString(event: KeyboardEvent) {
    var string = "";

    if (event.altKey)
      string += this.altKeyBind;

    if (event.ctrlKey)
      string += this.ctrlKeyBind;

    if (event.shiftKey)
      string += this.shiftKeyBind;

    string += event.code;

    return string;
  }
}
