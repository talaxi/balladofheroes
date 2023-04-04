import { Component } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-professions-view',
  templateUrl: './professions-view.component.html',
  styleUrls: ['./professions-view.component.css']
})
export class ProfessionsViewComponent {
  selectedProfession: ProfessionEnum;
  professionEnum = ProfessionEnum;
  upgrades: ProfessionUpgrades[] = [];
  qualityEnumList: EquipmentQualityEnum[] = [];
  upgradesRows: ProfessionUpgrades[][];
  upgradesCells: ProfessionUpgrades[];

  constructor(private lookupService: LookupService, private menuService: MenuService, private globalService: GlobalService) {

  }

  ngOnInit() {
    this.selectedProfession = this.menuService.selectedProfession;    
    if (this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession) === undefined)
      return;
    this.upgrades = this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession)!.upgrades;    
    this.qualityEnumList = this.setupQualityList();
    //this.setupDisplayUpgrades();
  }

  getProfessionName() {
    return this.lookupService.getProfessionName(this.selectedProfession);
  }

  getProfessionColor() {
    return this.lookupService.getProfessionColorClass(this.selectedProfession);
  }

  setupQualityList() {
    var qualityTypes: EquipmentQualityEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(EquipmentQualityEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as EquipmentQualityEnum;
      if (enumValue !== EquipmentQualityEnum.None)
        qualityTypes.push(enumValue);
    }

    return qualityTypes;
  }

  getUpgradesByQuality(quality: EquipmentQualityEnum) {
    return this.upgrades.filter(item => item.quality === quality);
  }

  getUpgradeValues(upgrade: ProfessionUpgrades) {    
    var description = "";

    //TODO: maybe show how many recipes are available and how many they have?

    if (upgrade.chanceTo2xItem > 0) {
      description += "<span class='smallCaps alchemyText bold'>chance to receive 2x items</span>: " + Math.round(upgrade.chanceTo2xItem * 100) + "%<br/>";
    }
    if (upgrade.chanceTo5xItem > 0) {
      description += "<span class='smallCaps alchemyText bold'>chance to receive 5x items</span>: " + Math.round(upgrade.chanceTo5xItem * 100) + "%<br/>";
    }
    if (upgrade.chanceToRetainMaterials > 0) {
      description += "<span class='smallCaps alchemyText bold'>chance to retain materials</span>: " + Math.round(upgrade.chanceToRetainMaterials * 100) + "%<br/>";
    }
    if (upgrade.durationReduction > 0) {
      description += "<span class='smallCaps alchemyText bold'>crafting duration reduction</span>: " + Math.round(upgrade.durationReduction * 100) + "%<br/>";
    }

    if (description === "")
      return description;

    return this.lookupService.getQualityTypeName(upgrade.quality) + " (" + this.lookupService.getQualityStars(upgrade.quality) + ")" + "<br/>" + description;
  }

  getUpgradeValue(upgrade: ProfessionUpgrades) {
    var value = 0;

    return value;
  }

 /* setupDisplayUpgrades(): void {
    this.upgradesCells = [];
    this.upgradesRows = [];

    //var maxColumns = this.deviceDetectorService.isMobile() ? 2 : 4;
    

    for (var i = 1; i <= this.upgrades.length; i++) {
      this.upgradesCells.push(this.upgrades[i - 1]);
      if ((i % maxColumns) == 0) {
        this.upgradesRows.push(this.upgradesCells);
        this.upgradesCells = [];
      }
    }

    if (this.upgradesCells.length !== 0)
      this.upgradesRows.push(this.upgradesCells);
  }*/
}
