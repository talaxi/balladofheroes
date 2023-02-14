import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-current-equipment-view',
  templateUrl: './current-equipment-view.component.html',
  styleUrls: ['./current-equipment-view.component.css']
})
export class CurrentEquipmentViewComponent implements OnInit {
  public equipmentTypeEnum = EquipmentTypeEnum;
  @Input() characterType: CharacterEnum = CharacterEnum.Adventurer;
  @Input() canChangeEquipment: boolean = false;
  equipmentModalOpened = false;
  @Output() unequipEmitter = new EventEmitter<boolean>();

  constructor(public lookupService: LookupService, private globalService: GlobalService, public dialog: MatDialog,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  getEquippedItemNameByType(type: EquipmentTypeEnum) {
    var itemText = "";
    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      return "Unequipped";

    var itemName = this.lookupService.getItemName(item.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(item);

    itemText = "<strong class='" + qualityClass + "'>" + itemName + "</strong>";

    return itemText;
  }


  getEquippedItemByType(type: EquipmentTypeEnum) {
    var comparisonItem = undefined;
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);
    if (character === undefined)
      return comparisonItem;

    comparisonItem = character.equipmentSet.getPieceBasedOnType(type);

    return comparisonItem;
  }

  openEquipmentModal(content: any) {
    this.equipmentModalOpened = true;
    this.dialog.open(content, { width: '50%', height: '55%', panelClass: 'mat-dialog-no-scroll' });
  }

  isUnequipped(type: EquipmentTypeEnum) {
    var isUnequipped = false;

    var item = this.getEquippedItemByType(type);

    if (item === undefined)
      isUnequipped = true;


    return isUnequipped;
  }

  unequipItem(type: EquipmentTypeEnum) {   
    var character = this.globalService.globalVar.characters.find(item => item.type === this.characterType);

    if (character === undefined)
      return;

    if (type === EquipmentTypeEnum.Weapon)
    {
      if (character.equipmentSet.weapon?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      {
        var effect = character.equipmentSet.weapon.equipmentEffect.userEffect.length > 0 ? 
        character.equipmentSet.weapon.equipmentEffect.userEffect[0] : character.equipmentSet.weapon.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.weapon = undefined;
    }
    if (type === EquipmentTypeEnum.Shield)
    {
      if (character.equipmentSet.shield?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      {
        var effect = character.equipmentSet.shield.equipmentEffect.userEffect.length > 0 ? 
        character.equipmentSet.shield.equipmentEffect.userEffect[0] : character.equipmentSet.shield.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.shield = undefined;
    }
    if (type === EquipmentTypeEnum.Armor)
    {
      if (character.equipmentSet.armor?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      {
        var effect = character.equipmentSet.armor.equipmentEffect.userEffect.length > 0 ? 
        character.equipmentSet.armor.equipmentEffect.userEffect[0] : character.equipmentSet.armor.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.armor = undefined;
    }
    if (type === EquipmentTypeEnum.Ring)
    {
      if (character.equipmentSet.ring?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      {
        var effect = character.equipmentSet.ring.equipmentEffect.userEffect.length > 0 ? 
        character.equipmentSet.ring.equipmentEffect.userEffect[0] : character.equipmentSet.ring.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.ring = undefined;    
    }
    if (type === EquipmentTypeEnum.Necklace)
    {
      if (character.equipmentSet.necklace?.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      {
        var effect = character.equipmentSet.necklace.equipmentEffect.userEffect.length > 0 ? 
        character.equipmentSet.necklace.equipmentEffect.userEffect[0] : character.equipmentSet.necklace.equipmentEffect.targetEffect[0];
        character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(existingEffect => existingEffect.caster !== effect.caster);
      }

      character.equipmentSet.necklace = undefined;
    }

    this.globalService.calculateCharacterBattleStats(character); 
    this.unequipEmitter.emit(false); 
  }
}
