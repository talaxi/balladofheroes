import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { EquipmentTypeEnum } from 'src/app/models/enums/equipment-type-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Equipment } from 'src/app/models/resources/equipment.model';
import { Loadout } from 'src/app/models/utility/loadout.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';

@Component({
  selector: 'app-add-loadout',
  templateUrl: './add-loadout.component.html',
  styleUrls: ['./add-loadout.component.css']
})
export class AddLoadoutComponent {
  @Input() ownDialogRef: MatDialogRef<any, any>;
  @Input() mode = "Add";
  @Input() existingLoadout: Loadout | undefined = undefined;
  dialogRef: MatDialogRef<any, any>;
  newLoadout: Loadout;
  selectedCharacter: number;
  selectedGod: number;
  equipmentPieceType: EquipmentTypeEnum;
  loadoutName = "";

  constructor(private deviceDetectorService: DeviceDetectorService, public dialog: MatDialog, private globalService: GlobalService,
    private lookupService: LookupService, private dictionaryService: DictionaryService, private keybindService: KeybindService) {

  }

  ngOnInit() {
    this.selectedCharacter = 0;
    this.selectedGod = 0;
    this.newLoadout = new Loadout();

    if (this.mode === "Edit" && this.existingLoadout !== undefined)
    {
      this.newLoadout = this.existingLoadout;
    }
  }

  selectLoadoutCharacter(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }

  selectLoadoutGod(content: any, whichCharacter: number, whichGod: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = whichGod;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }

  selectLoadoutCharacterWeapon(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;
    this.equipmentPieceType = EquipmentTypeEnum.Weapon;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }
  
  selectLoadoutCharacterShield(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;
    this.equipmentPieceType = EquipmentTypeEnum.Shield;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }
  
  selectLoadoutCharacterArmor(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;
    this.equipmentPieceType = EquipmentTypeEnum.Armor;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }
  
  selectLoadoutCharacterRing(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;
    this.equipmentPieceType = EquipmentTypeEnum.Ring;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }
  
  selectLoadoutCharacterNecklace(content: any, whichCharacter: number) {
    this.selectedCharacter = whichCharacter;
    this.selectedGod = 0;
    this.equipmentPieceType = EquipmentTypeEnum.Necklace;

    if (this.deviceDetectorService.isMobile())
      this.dialogRef = this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialogRef = this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }

  characterSelected(type: CharacterEnum) {
    if (this.selectedCharacter === 1) {
      this.newLoadout.character1 = type;
      if (this.newLoadout.character2 === type)
        this.newLoadout.character2 = CharacterEnum.None;
    }
    if (this.selectedCharacter === 2) {
      this.newLoadout.character2 = type;
      if (this.newLoadout.character1 === type)
        this.newLoadout.character1 = CharacterEnum.None;
    }
  }

  godSelected(type: GodEnum) {
    if (this.selectedCharacter === 1) {
      if (this.selectedGod === 1) {
        this.newLoadout.god1Character1 = type;

        if (this.newLoadout.god2Character1 === type)
          this.newLoadout.god2Character1 = GodEnum.None;
        if (this.newLoadout.god1Character2 === type)
          this.newLoadout.god1Character2 = GodEnum.None;
        if (this.newLoadout.god2Character2 === type)
          this.newLoadout.god2Character2 = GodEnum.None;
      }
      if (this.selectedGod === 2) {
        this.newLoadout.god2Character1 = type;

        if (this.newLoadout.god1Character1 === type)
          this.newLoadout.god1Character1 = GodEnum.None;
        if (this.newLoadout.god1Character2 === type)
          this.newLoadout.god1Character2 = GodEnum.None;
        if (this.newLoadout.god2Character2 === type)
          this.newLoadout.god2Character2 = GodEnum.None;
      }
    }
    if (this.selectedCharacter === 2) {
      if (this.selectedGod === 1) {
        this.newLoadout.god1Character2 = type;

        if (this.newLoadout.god2Character2 === type)
          this.newLoadout.god2Character2 = GodEnum.None;
        if (this.newLoadout.god1Character1 === type)
          this.newLoadout.god1Character1 = GodEnum.None;
        if (this.newLoadout.god2Character1 === type)
          this.newLoadout.god2Character1 = GodEnum.None;
      }
      if (this.selectedGod === 2) {
        this.newLoadout.god2Character2 = type;

        if (this.newLoadout.god1Character2 === type)
          this.newLoadout.god1Character2 = GodEnum.None;
        if (this.newLoadout.god1Character1 === type)
          this.newLoadout.god1Character1 = GodEnum.None;
        if (this.newLoadout.god2Character1 === type)
          this.newLoadout.god2Character1 = GodEnum.None;
      }
    }
  }
  
  equipmentSelected(equipment: Equipment) {
    if (this.selectedCharacter === 1) {
      if (this.equipmentPieceType === EquipmentTypeEnum.Weapon)
        this.newLoadout.character1EquipmentSet.weapon = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Armor)
        this.newLoadout.character1EquipmentSet.armor = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Shield)
        this.newLoadout.character1EquipmentSet.shield = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Ring)
        this.newLoadout.character1EquipmentSet.ring = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Necklace)
        this.newLoadout.character1EquipmentSet.necklace = equipment;
    }
    if (this.selectedCharacter === 2) {
      if (this.equipmentPieceType === EquipmentTypeEnum.Weapon)
        this.newLoadout.character2EquipmentSet.weapon = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Armor)
        this.newLoadout.character2EquipmentSet.armor = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Shield)
        this.newLoadout.character2EquipmentSet.shield = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Ring)
        this.newLoadout.character2EquipmentSet.ring = equipment;
        if (this.equipmentPieceType === EquipmentTypeEnum.Necklace)
        this.newLoadout.character2EquipmentSet.necklace = equipment;
    }
  }

  getClassColor(type: CharacterEnum) {
    return this.lookupService.getCharacterColorClass(type);
  }
  
  getGodColor(type: GodEnum) {
    return this.lookupService.getGodColorClass(type);
  }

  getClassName(type: CharacterEnum) {
    var name = "";
    
    var character = this.globalService.globalVar.characters.find(item => item.type === type);
    if (character !== undefined) {
      name = character.name;
    }

    return name;
  }

  getGodName(type: GodEnum) {
    var name = "";
    
    var god = this.globalService.globalVar.gods.find(item => item.type === type);
    if (god !== undefined) {
      name = god.name;
    }

    return name;
  }

  addLoadout() {
    //need to do error handling and check if in edit or add mode

    if (this.loadoutName === "")
      this.newLoadout.name = "Loadout " + (this.globalService.globalVar.loadouts.length + 1);
    else
      this.newLoadout.name = this.loadoutName;

    if (this.mode === "Add")
      this.globalService.globalVar.loadouts.push(this.newLoadout);
      
    this.ownDialogRef.close();
  }

  getEquipmentText(item: Equipment) {    
    var itemText = "";
    
    var itemName = this.dictionaryService.getItemName(item.itemType);
    var qualityClass = this.lookupService.getEquipmentQualityClass(item.quality);
    var extraNameAddition = this.lookupService.getEquipmentExtraNameAddition(item.associatedResource);

    itemText = "<strong class='" + qualityClass + "'>" + itemName + extraNameAddition + "</strong>";

    return itemText;
  }

  getWeapon(item: Equipment | undefined) {
    if (item === undefined)
      return "Keep Equipped Weapon";

    return this.getEquipmentText(item);
  }
  
  getShield(item: Equipment | undefined) {
    if (item === undefined)
      return "Keep Equipped Shield";

    return this.getEquipmentText(item);
  }
  
  getArmor(item: Equipment | undefined) {
    if (item === undefined)
      return "Keep Equipped Armor";

    return this.getEquipmentText(item);
  }
  
  getRing(item: Equipment | undefined) {
    if (item === undefined)
      return "Keep Equipped Ring";

    return this.getEquipmentText(item);
  }
  
  getNecklace(item: Equipment | undefined) {
    if (item === undefined)
      return "Keep Equipped Necklace";

    return this.getEquipmentText(item);
  }

  inTextbox() {
    this.keybindService.isInTextbox = true;
  }

  outOfTextbox() {
    this.keybindService.isInTextbox = false;
  }

  ngOnDestroy() {
    this.keybindService.isInTextbox = false;
  }
}
