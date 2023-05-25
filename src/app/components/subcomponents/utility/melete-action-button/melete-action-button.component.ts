import { Component, Input } from '@angular/core';
import { MeleteActionEnum } from 'src/app/models/enums/melete-action-enum.model';
import { MeleteService } from 'src/app/services/minigames/melete.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-melete-action-button',
  templateUrl: './melete-action-button.component.html',
  styleUrls: ['./melete-action-button.component.css']
})
export class MeleteActionButtonComponent {
  @Input() action: MeleteActionEnum;
  @Input() disabled: boolean;

  constructor(private meleteService: MeleteService, private dictionaryService: DictionaryService) {

  }

  getActionName() {
    return this.dictionaryService.getMeleteActionName(this.action);
  }

  getActionCooldown() {
    return this.meleteService.getActionCooldown(this.action);
  }

  getBackgroundStyle() {
    var activeAction = this.meleteService.getActiveAction(this.action);
    var remainingCooldown = 0;
    var remainder = 100;
    if (activeAction !== undefined) {
      remainingCooldown = (activeAction[1] / this.meleteService.getActionCooldown(this.action)) * 100;
      remainder = 100 - remainingCooldown;
    }

    if (remainder <= 50)
      //need to adjust background position or something
      return { 'background': 'linear-gradient(to right, var(--button-hover) ' + remainingCooldown + '%, var(--button-selected) ' + remainder + '%)' };
    else
      return { 'background': 'linear-gradient(to left, var(--button-selected) ' + remainder + '%, var(--button-hover) ' + remainingCooldown + '%)' };
  }

  performAction() {
    //service handle all of the stuff
    this.meleteService.handleAction(this.action);
  }
}
