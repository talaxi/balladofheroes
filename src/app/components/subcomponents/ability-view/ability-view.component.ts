import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-ability-view',
  templateUrl: './ability-view.component.html',
  styleUrls: ['./ability-view.component.css']
})
export class AbilityViewComponent implements OnInit {
  @Input() character: Character;
  @Input() ability: Ability;
  @Input() isAutoAttack: boolean = false;
  @Input() god: GodEnum | undefined = undefined;
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;

  constructor(private lookupService: LookupService, private utilityService: UtilityService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
  }

  getCharacterAutoAttackProgress() {
    return (this.character.battleInfo.autoAttackTimer / this.character.battleInfo.timeToAutoAttack) * 100;
  }

  getAbilityProgress() {
    if (this.ability === undefined)
      return;

    return 100 - ((this.ability.currentCooldown / this.ability.cooldown) * 100);
  }

  getAbilityName() {
    if (this.isAutoAttack)
      return "Auto Attack";

    if (this.ability === undefined)
      return;

    return this.utilityService.getSanitizedHtml(this.ability.name);
  }

  getAbilityDescription() {
    var description = "";

    if (this.isAutoAttack)
      description = this.lookupService.getAutoAttackDescription(this.character);
    else
      description = this.lookupService.getCharacterAbilityDescription(this.ability.name);

    if (description === "")
      description = this.lookupService.getGodAbilityDescription(this.ability.name);

    return this.utilityService.getSanitizedHtml(description);
  }

  getStrokeColor() {
    if (this.god !== undefined) {
      return {
        'athenaColor': this.god === GodEnum.Athena,
        'zeusColor': this.god === GodEnum.Zeus,
        'apolloColor': this.god === GodEnum.Apollo,
        'aresColor': this.god === GodEnum.Ares,
        'poseidonColor': this.god === GodEnum.Poseidon,
        'artemisColor': this.god === GodEnum.Artemis
      };
    }
    else {
      return {
        'adventurerColor': this.character.type === CharacterEnum.Adventurer,
        'archerColor': this.character.type === CharacterEnum.Archer,
        'warriorColor': this.character.type === CharacterEnum.Warrior,
        'priestColor': this.character.type === CharacterEnum.Priest
      };
    }
  }
}
