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

  getBindingString(button: string | undefined) {
    var binding = "";
    if (button === undefined)
      return "";

    if (button.includes(this.altKeyBind)) {
      binding += "ALT + ";
      button = button.replace(this.altKeyBind, "");
    }
    if (button.includes(this.ctrlKeyBind)) {
      binding += "CTRL + ";
      button = button.replace(this.ctrlKeyBind, "");
    }
    if (button.includes(this.shiftKeyBind)) {
      binding += "SHIFT + ";
      button = button.replace(this.shiftKeyBind, "");
    }

    if (button.includes("key")) {
      binding += button.replace("key", "").toUpperCase();
    }

    if (button.includes("digit")) {
      binding += button.replace("digit", "");
    }

    if (button.includes("arrowdown")) {
      binding += "Down Arrow";
    }

    if (button.includes("arrowup")) {
      binding += "Up Arrow";
    }

    if (button.includes("arrowright")) {
      binding += "Right Arrow";
    }

    if (button.includes("arrowleft")) {
      binding += "Left Arrow";
    }

    if (button.includes("space")) {
      binding += "Space";
    }

    return binding;
  }
}
