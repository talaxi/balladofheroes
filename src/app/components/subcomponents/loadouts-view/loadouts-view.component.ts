import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { Loadout } from 'src/app/models/utility/loadout.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-loadouts-view',
  templateUrl: './loadouts-view.component.html',
  styleUrls: ['./loadouts-view.component.css']
})
export class LoadoutsViewComponent {
  loadouts: Loadout[] = [];
  dialogRef: MatDialogRef<any, any>;
  mode: string;
  existingLoadout: Loadout | undefined = undefined;

  constructor(private deviceDetectorService: DeviceDetectorService, public dialog: MatDialog, private lookupService: LookupService,
    private globalService: GlobalService, private dictionaryService: DictionaryService, private menuService: MenuService) {

  }


  ngOnInit() {
    this.loadouts = this.globalService.globalVar.loadouts;
  }

  addNewLoadout(content: any) {
    this.mode = "Add";
    this.existingLoadout = undefined;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });

    this.dialogRef.afterClosed().subscribe(() => {
      this.loadouts = this.globalService.globalVar.loadouts;
    });
  }

  getClassColor(loadout: Loadout, whichCharacter: number) {
    var type = loadout.character1;
    if (whichCharacter === 2)
      type = loadout.character2;

    return this.lookupService.getCharacterColorClass(type);
  }

  getGodColor(loadout: Loadout, whichCharacter: number, whichGod: number) {
    var type = GodEnum.None;

    if (whichCharacter === 1) {
      if (whichGod === 1)
        type = loadout.god1Character1;
      if (whichGod === 2)
        type = loadout.god2Character1;
    }

    if (whichCharacter === 2) {
      if (whichGod === 1)
        type = loadout.god1Character2;
      if (whichGod === 2)
        type = loadout.god2Character2;
    }

    return this.lookupService.getGodColorClass(type);
  }

  getClassName(loadout: Loadout, whichCharacter: number) {
    var type = loadout.character1;
    if (whichCharacter === 2)
      type = loadout.character2;

    var name = "";

    var character = this.globalService.globalVar.characters.find(item => item.type === type);
    if (character !== undefined) {
      name = character.name + " Lv " + character.level;
    }

    return name;
  }

  getGodName(loadout: Loadout, whichCharacter: number, whichGod: number) {
    var type = GodEnum.None;

    if (whichCharacter === 1) {
      if (whichGod === 1)
        type = loadout.god1Character1;
      if (whichGod === 2)
        type = loadout.god2Character1;
    }

    if (whichCharacter === 2) {
      if (whichGod === 1)
        type = loadout.god1Character2;
      if (whichGod === 2)
        type = loadout.god2Character2;
    }

    var name = "";

    var god = this.globalService.globalVar.gods.find(item => item.type === type);
    if (god !== undefined) {
      name = god.name + " Lv " + god.level;
    }

    return name;
  }

  getEquipmentText(item: Equipment) {
    var itemText = "";

    var itemName = this.dictionaryService.getItemName(item.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(item.quality);
    var extraNameAddition = this.lookupService.getEquipmentExtraNameAddition(item.associatedResource);

    var smallTextClass = "";
    
    if (itemName.length > 14 && extraNameAddition !== "")
      smallTextClass = " smallEquipmentText";

    itemText = "<strong class='" + qualityClass + smallTextClass + "'>" + itemName + extraNameAddition + "</strong>";

    return itemText;
  }

  getWeapon(loadout: Loadout, whichCharacter: number) {
    var item: Equipment | undefined = undefined;
    if (whichCharacter === 1)
      item = loadout.character1EquipmentSet.weapon;
    else if (whichCharacter === 2)
      item = loadout.character2EquipmentSet.weapon;

    if (item === undefined)
      return "Keep Weapon";

    return this.getEquipmentText(item);
  }

  getShield(loadout: Loadout, whichCharacter: number) {
    var item: Equipment | undefined = undefined;
    if (whichCharacter === 1)
      item = loadout.character1EquipmentSet.shield;
    else if (whichCharacter === 2)
      item = loadout.character2EquipmentSet.shield;

    if (item === undefined)
      return "Keep Shield";

    return this.getEquipmentText(item);
  }

  getArmor(loadout: Loadout, whichCharacter: number) {
    var item: Equipment | undefined = undefined;
    if (whichCharacter === 1)
      item = loadout.character1EquipmentSet.armor;
    else if (whichCharacter === 2)
      item = loadout.character2EquipmentSet.armor;

    if (item === undefined)
      return "Keep Armor";

    return this.getEquipmentText(item);
  }

  getRing(loadout: Loadout, whichCharacter: number) {
    var item: Equipment | undefined = undefined;
    if (whichCharacter === 1)
      item = loadout.character1EquipmentSet.ring;
    else if (whichCharacter === 2)
      item = loadout.character2EquipmentSet.ring;

    if (item === undefined)
      return "Keep Ring";

    return this.getEquipmentText(item);
  }

  getNecklace(loadout: Loadout, whichCharacter: number) {
    var item: Equipment | undefined = undefined;
    if (whichCharacter === 1)
      item = loadout.character1EquipmentSet.necklace;
    else if (whichCharacter === 2)
      item = loadout.character2EquipmentSet.necklace;

    if (item === undefined)
      return "Keep Necklace";

    return this.getEquipmentText(item);
  }

  selectLoadout(loadout: Loadout) {
    var character1 = this.globalService.globalVar.characters.find(item => item.type === loadout.character1);
    var character2 = this.globalService.globalVar.characters.find(item => item.type === loadout.character2);
    if (character1 === undefined || character2 === undefined) {
      console.log("Couldnt find");
      return;
    }

    this.globalService.globalVar.activePartyMember1 = loadout.character1;
    character1.assignedGod1 = loadout.god1Character1;
    character1.assignedGod2 = loadout.god2Character1;
    if (loadout.character1EquipmentSet.weapon !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character1EquipmentSet.weapon.itemType, loadout.character1EquipmentSet.weapon.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Weapon, character1.type);
      this.globalService.equipItem(loadout.character1EquipmentSet.weapon, character1);
    }
    if (loadout.character1EquipmentSet.shield !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character1EquipmentSet.shield.itemType, loadout.character1EquipmentSet.shield.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Shield, character1.type);
      this.globalService.equipItem(loadout.character1EquipmentSet.shield, character1);
    }
    if (loadout.character1EquipmentSet.armor !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character1EquipmentSet.armor.itemType, loadout.character1EquipmentSet.armor.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Armor, character1.type);
      this.globalService.equipItem(loadout.character1EquipmentSet.armor, character1);
    }
    if (loadout.character1EquipmentSet.ring !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character1EquipmentSet.ring.itemType, loadout.character1EquipmentSet.ring.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Ring, character1.type);
      this.globalService.equipItem(loadout.character1EquipmentSet.ring, character1);
    }
    if (loadout.character1EquipmentSet.necklace !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character1EquipmentSet.necklace.itemType, loadout.character1EquipmentSet.necklace.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Necklace, character1.type);
      this.globalService.equipItem(loadout.character1EquipmentSet.necklace, character1);
    }

    //console.log("Party member 2: " + loadout.character2);
    this.globalService.globalVar.activePartyMember2 = loadout.character2;
    character2.assignedGod1 = loadout.god1Character2;
    character2.assignedGod2 = loadout.god2Character2;
    if (loadout.character2EquipmentSet.weapon !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character2EquipmentSet.weapon.itemType, loadout.character2EquipmentSet.weapon.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Weapon, character2.type);
      this.globalService.equipItem(loadout.character2EquipmentSet.weapon, character2);
    }
    if (loadout.character2EquipmentSet.shield !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character2EquipmentSet.shield.itemType, loadout.character2EquipmentSet.shield.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Shield, character2.type);
      this.globalService.equipItem(loadout.character2EquipmentSet.shield, character2);
    }
    if (loadout.character2EquipmentSet.armor !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character2EquipmentSet.armor.itemType, loadout.character2EquipmentSet.armor.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Armor, character2.type);
      this.globalService.equipItem(loadout.character2EquipmentSet.armor, character2);
    }
    if (loadout.character2EquipmentSet.ring !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character2EquipmentSet.ring.itemType, loadout.character2EquipmentSet.ring.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Ring, character2.type);
      this.globalService.equipItem(loadout.character2EquipmentSet.ring, character2);
    }
    if (loadout.character2EquipmentSet.necklace !== undefined &&
      this.lookupService.getResourceAmountMinusEquippedCount(loadout.character2EquipmentSet.necklace.itemType, loadout.character2EquipmentSet.necklace.associatedResource?.extras) > 0) {
      this.globalService.unequipItem(EquipmentTypeEnum.Necklace, character2.type);
      this.globalService.equipItem(loadout.character2EquipmentSet.necklace, character2);
    }

    this.menuService.updateParty = true;
  }

  editLoadout(content: any, loadout: Loadout) {
    this.mode = "Edit";
    this.existingLoadout = loadout;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });

    this.dialogRef.afterClosed().subscribe(() => {
      this.loadouts = this.globalService.globalVar.loadouts;
    });
  }
}