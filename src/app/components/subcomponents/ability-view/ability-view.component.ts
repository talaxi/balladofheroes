import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';

@Component({
  selector: 'app-ability-view',
  templateUrl: './ability-view.component.html',
  styleUrls: ['./ability-view.component.css']
})
export class AbilityViewComponent implements OnInit {
  @Input() character: Character;
  @Input() ability: Ability;
  @Input() isAutoAttack: boolean = false;
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
  }
  
  getCharacterAutoAttackProgress(character: Character) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  getAbilityProgress() {   
    if (this.ability === undefined)
      return;

    return 100 - ((this.ability.currentCooldown / this.ability.cooldown) * 100);
  }

  getAbilityName() {    
    if (this.ability === undefined)
      return;

    return this.ability.name;
  }
}
