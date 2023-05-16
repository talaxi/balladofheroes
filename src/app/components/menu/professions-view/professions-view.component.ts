import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ProfessionService } from 'src/app/services/professions/profession.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

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
  subscription: any;
  isMobile: boolean = false;

  constructor(private lookupService: LookupService, private menuService: MenuService, private globalService: GlobalService,
    private gameLoopService: GameLoopService, private professionService: ProfessionService, private deviceDetectorService: DeviceDetectorService,
    private utilityService: UtilityService) {

  }

  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.selectedProfession = this.menuService.selectedProfession;    
    if (this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession) === undefined)
      return;
    this.upgrades = this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession)!.upgrades;    
    this.qualityEnumList = this.setupQualityList();
    
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.selectedProfession = this.menuService.selectedProfession;    
      if (this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession) === undefined)
        return;
      this.upgrades = this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession)!.upgrades;    
      this.qualityEnumList = this.setupQualityList();      
    });
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
    var professionText = "";

    if (this.selectedProfession === ProfessionEnum.Alchemy)
      professionText = "alchemyText";
      if (this.selectedProfession === ProfessionEnum.Jewelcrafting)
      professionText = "jewelcraftingText";

    var obtainedRecipeCount = this.getObtainedRecipeCount(upgrade.quality);
    if (obtainedRecipeCount > 0)
      description += "<span class='smallCaps " + professionText + " bold'>recipes obtained:</span> " + obtainedRecipeCount + " / " + this.getTotalRecipeCount(upgrade.quality) + "<br/>";

    if (upgrade.chanceTo2xItem > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>chance to receive 2x items:</span> " + Math.round(upgrade.chanceTo2xItem * 100) + "%<br/>";
    }
    if (upgrade.chanceTo5xItem > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>chance to receive 5x items:</span> " + Math.round(upgrade.chanceTo5xItem * 100) + "%<br/>";
    }
    if (upgrade.chanceToRetainMaterials > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>chance to retain materials:</span> " + Math.round(upgrade.chanceToRetainMaterials * 100) + "%<br/>";
    }
    if (upgrade.durationReduction > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>crafting duration reduction:</span> " + Math.round(upgrade.durationReduction * 100) + "%<br/>";
    }
    if (upgrade.chanceToHalfDuration > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>chance to craft 2x as fast:</span> " + Math.round(upgrade.chanceToHalfDuration * 100) + "%<br/>";
    }
    if (upgrade.chanceForUpgrade > 0) {
      description += "<span class='smallCaps " + professionText + " bold'>gem upgrade chance:</span> " + this.utilityService.genericRound(upgrade.chanceForUpgrade * 100) + "%<br/>";
    }

    if (description === "")
      return description;

    return this.lookupService.getQualityTypeName(upgrade.quality) + " (" + this.lookupService.getQualityStars(upgrade.quality) + ")" + "<br/>" + description;
  }

  getObtainedRecipeCount(quality: EquipmentQualityEnum) {
    var count = 0;
    var profession = this.globalService.globalVar.professions.find(item => item.type === this.selectedProfession);

    if (profession !== undefined) {
      profession.availableRecipes.forEach(recipe => {
        if (recipe.quality === quality)
          count += 1;
      });
    }

    return count;
  }

  getTotalRecipeCount(quality: EquipmentQualityEnum) {
    var count = 0;
    var allItems: ItemsEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ItemsEnum))
    {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ItemsEnum;
      //every other item type could feasibly be here I think, otherwise add more types to keep this list smaller
      if (enumValue !== ItemsEnum.None && this.lookupService.getItemTypeFromItemEnum(enumValue) !== ItemTypeEnum.Charm
      && this.lookupService.getItemTypeFromItemEnum(enumValue) !== ItemTypeEnum.Equipment)
      allItems.push(enumValue);
    }

    allItems.forEach(item => {
      var recipe = this.professionService.getRecipe(this.selectedProfession, item);
      if (recipe !== undefined && recipe.quality === quality)
        count += 1;
    });

    return count;
  }

  getUpgradeValue(upgrade: ProfessionUpgrades) {
    var value = 0;

    return value;
  }



  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }

  hasMoreThanOneProfession() {    
    return this.globalService.globalVar.professions.filter(item => item.isUnlocked).length > 1;
  }

  traverseSubMenu(direction: number) {
    var currentIndex = this.globalService.globalVar.professions.findIndex(item => item.type === this.menuService.selectedProfession);
      currentIndex += direction;

      if (currentIndex < 0)
        currentIndex = this.globalService.globalVar.professions.length - 1;
      if (currentIndex > this.globalService.globalVar.professions.length - 1)
        currentIndex = 0;
      
        this.menuService.setSelectedProfession(this.globalService.globalVar.professions[currentIndex].type);
  }
}
