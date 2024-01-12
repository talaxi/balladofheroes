import { Component, HostListener, OnInit } from '@angular/core';
import { Settings } from 'src/app/models/utility/settings.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { InitializationService } from 'src/app/services/global/initialization.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';

@Component({
  selector: 'app-update-keybinds-view',
  templateUrl: './update-keybinds-view.component.html',
  styleUrls: ['./update-keybinds-view.component.css']
})
export class UpdateKeybindsViewComponent implements OnInit {
  keybinds: Settings;
  battleKeybinds: [string, any][] = [];
  menuKeybinds: [string, any][] = [];

  updateKeybindMode = false;
  keybindToUpdate: [string, any] | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();

    if (!this.updateKeybindMode || this.keybindToUpdate === undefined)
      return;

    var keybindString = this.keybindService.getKeybindString(event);

    this.globalService.globalVar.keybinds.set(this.keybindToUpdate[0], keybindString);

    this.updateKeybindMode = false;
    this.keybindToUpdate = undefined;
  }

  constructor(private globalService: GlobalService, private keybindService: KeybindService, private menuService: MenuService,
    private initializationService: InitializationService) { }

  ngOnInit(): void {
    this.keybinds = this.globalService.globalVar.keybinds;
    this.menuService.keybindModalOpen = true;

    var menuGoToCharacters = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToCharacters");
    if (menuGoToCharacters !== undefined)
      this.menuKeybinds.push(menuGoToCharacters);

    var menuGoToGods = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToGods");
    if (menuGoToGods !== undefined)
      this.menuKeybinds.push(menuGoToGods);

    var menuGoToResources = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToResources");
    if (menuGoToResources !== undefined)
      this.menuKeybinds.push(menuGoToResources);

    var menuGoToAchievements = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToAchievements");
    if (menuGoToAchievements !== undefined)
      this.menuKeybinds.push(menuGoToAchievements);

    var menuGoToProfessions = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToProfessions");
    if (menuGoToProfessions !== undefined)
      this.menuKeybinds.push(menuGoToProfessions);

    var menuGoToSettings = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToSettings");
    if (menuGoToSettings !== undefined)
      this.menuKeybinds.push(menuGoToSettings);

    var menuGoToBestiary = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuGoToBestiary");
    if (menuGoToBestiary !== undefined)
      this.menuKeybinds.push(menuGoToBestiary);

    var menuTraverseSubMenuUp = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuTraverseSubMenuUp");
    if (menuTraverseSubMenuUp !== undefined)
      this.menuKeybinds.push(menuTraverseSubMenuUp);

    var menuTraverseSubMenuDown = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "menuTraverseSubMenuDown");
    if (menuTraverseSubMenuDown !== undefined)
      this.menuKeybinds.push(menuTraverseSubMenuDown);

    var togglePauseGame = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "togglePauseGame");
    if (togglePauseGame !== undefined)
      this.battleKeybinds.push(togglePauseGame);

    var openMenu = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openMenu");
    if (openMenu !== undefined)
      this.battleKeybinds.push(openMenu);

    var openLog = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openLog");
    if (openLog !== undefined)
      this.battleKeybinds.push(openLog);

    var openOverviewQuickView = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openOverviewQuickView");
    if (openOverviewQuickView !== undefined)
      this.battleKeybinds.push(openOverviewQuickView);

    var openResourcesQuickView = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openResourcesQuickView");
    if (openResourcesQuickView !== undefined)
      this.battleKeybinds.push(openResourcesQuickView);

    var openAlchemyQuickView = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openAlchemyQuickView");
    if (openAlchemyQuickView !== undefined)
      this.battleKeybinds.push(openAlchemyQuickView);

    var openJewelcraftingQuickView = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openJewelcraftingQuickView");
    if (openJewelcraftingQuickView !== undefined)
      this.battleKeybinds.push(openJewelcraftingQuickView);

      var openTimeFragmentQuickView = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openTimeFragmentQuickView");
    if (openTimeFragmentQuickView !== undefined)
      this.battleKeybinds.push(openTimeFragmentQuickView);

    var openFirstAvailableAltar = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openFirstAvailableAltar");
    if (openFirstAvailableAltar !== undefined)
      this.battleKeybinds.push(openFirstAvailableAltar);

    var secondFirstAvailableAltar = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openSecondAvailableAltar");
    if (secondFirstAvailableAltar !== undefined)
      this.battleKeybinds.push(secondFirstAvailableAltar);

    var thirdFirstAvailableAltar = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "openThirdAvailableAltar");
    if (thirdFirstAvailableAltar !== undefined)
      this.battleKeybinds.push(thirdFirstAvailableAltar);

    var toggleAllCharactersTargetMode = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "toggleAllCharactersTargetMode");
    if (toggleAllCharactersTargetMode !== undefined)
      this.battleKeybinds.push(toggleAllCharactersTargetMode);

    var toggleCharacter1TargetMode = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "toggleCharacter1TargetMode");
    if (toggleCharacter1TargetMode !== undefined)
      this.battleKeybinds.push(toggleCharacter1TargetMode);

    var useCharacter1AutoAttack = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1AutoAttack");
    if (useCharacter1AutoAttack !== undefined)
      this.battleKeybinds.push(useCharacter1AutoAttack);

    var useCharacter1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1Ability1");
    if (useCharacter1Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter1Ability1);

    var useCharacter1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1Ability2");
    if (useCharacter1Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter1Ability2);

    var useCharacter1God1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God1Ability1");
    if (useCharacter1God1Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter1God1Ability1);

    var useCharacter1God1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God1Ability2");
    if (useCharacter1God1Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter1God1Ability2);

    var useCharacter1God1Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God1Ability3");
    if (useCharacter1God1Ability3 !== undefined)
      this.battleKeybinds.push(useCharacter1God1Ability3);

    var useCharacter1God2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God2Ability1");
    if (useCharacter1God2Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter1God2Ability1);

    var useCharacter1God2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God2Ability2");
    if (useCharacter1God2Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter1God2Ability2);

    var useCharacter1God2Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1God2Ability3");
    if (useCharacter1God2Ability3 !== undefined)
      this.battleKeybinds.push(useCharacter1God2Ability3);

    var useCharacter1Overdrive = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1Overdrive");
    if (useCharacter1Overdrive !== undefined)
      this.battleKeybinds.push(useCharacter1Overdrive);

      var useCharacter1DuoAbility = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter1DuoAbility");
    if (useCharacter1DuoAbility !== undefined)
      this.battleKeybinds.push(useCharacter1DuoAbility);

    var autoToggleCharacter1AutoAttack = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1AutoAttack");
    if (autoToggleCharacter1AutoAttack !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1AutoAttack);

    var autoToggleCharacter1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1Ability1");
    if (autoToggleCharacter1Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1Ability1);

    var autoToggleCharacter1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1Ability2");
    if (autoToggleCharacter1Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1Ability2);

    var autoToggleCharacter1God1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God1Ability1");
    if (autoToggleCharacter1God1Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God1Ability1);

    var autoToggleCharacter1God1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God1Ability2");
    if (autoToggleCharacter1God1Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God1Ability2);

    var autoToggleCharacter1God1Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God1Ability3");
    if (autoToggleCharacter1God1Ability3 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God1Ability3);

    var autoToggleCharacter1God2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God2Ability1");
    if (autoToggleCharacter1God2Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God2Ability1);

    var autoToggleCharacter1God2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God2Ability2");
    if (autoToggleCharacter1God2Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God2Ability2);

    var autoToggleCharacter1God2Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1God2Ability3");
    if (autoToggleCharacter1God2Ability3 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1God2Ability3);

    var autoToggleCharacter1Overdrive = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1Overdrive");
    if (autoToggleCharacter1Overdrive !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1Overdrive);


    var autoToggleCharacter1AllAbilities = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter1AllAbilities");
    if (autoToggleCharacter1AllAbilities !== undefined)
      this.battleKeybinds.push(autoToggleCharacter1AllAbilities);


    var toggleCharacter2TargetMode = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "toggleCharacter2TargetMode");
    if (toggleCharacter2TargetMode !== undefined)
      this.battleKeybinds.push(toggleCharacter2TargetMode);

    var useCharacter2AutoAttack = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2AutoAttack");
    if (useCharacter2AutoAttack !== undefined)
      this.battleKeybinds.push(useCharacter2AutoAttack);

    var useCharacter2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2Ability1");
    if (useCharacter2Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter2Ability1);

    var useCharacter2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2Ability2");
    if (useCharacter2Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter2Ability2);

    var useCharacter2God1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God1Ability1");
    if (useCharacter2God1Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter2God1Ability1);

    var useCharacter2God1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God1Ability2");
    if (useCharacter2God1Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter2God1Ability2);

    var useCharacter2God1Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God1Ability3");
    if (useCharacter2God1Ability3 !== undefined)
      this.battleKeybinds.push(useCharacter2God1Ability3);

    var useCharacter2God2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God2Ability1");
    if (useCharacter2God2Ability1 !== undefined)
      this.battleKeybinds.push(useCharacter2God2Ability1);

    var useCharacter2God2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God2Ability2");
    if (useCharacter2God2Ability2 !== undefined)
      this.battleKeybinds.push(useCharacter2God2Ability2);

    var useCharacter2God2Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2God2Ability3");
    if (useCharacter2God2Ability3 !== undefined)
      this.battleKeybinds.push(useCharacter2God2Ability3);

    var useCharacter2Overdrive = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2Overdrive");
    if (useCharacter2Overdrive !== undefined)
      this.battleKeybinds.push(useCharacter2Overdrive);

    var autoToggleCharacter2AutoAttack = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2AutoAttack");
    if (autoToggleCharacter2AutoAttack !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2AutoAttack);

    var autoToggleCharacter2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2Ability1");
    if (autoToggleCharacter2Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2Ability1);

    var autoToggleCharacter2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2Ability2");
    if (autoToggleCharacter2Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2Ability2);

    var autoToggleCharacter2God1Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God1Ability1");
    if (autoToggleCharacter2God1Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God1Ability1);

    var autoToggleCharacter2God1Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God1Ability2");
    if (autoToggleCharacter2God1Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God1Ability2);

    var autoToggleCharacter2God1Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God1Ability3");
    if (autoToggleCharacter2God1Ability3 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God1Ability3);

    var autoToggleCharacter2God2Ability1 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God2Ability1");
    if (autoToggleCharacter2God2Ability1 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God2Ability1);

    var autoToggleCharacter2God2Ability2 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God2Ability2");
    if (autoToggleCharacter2God2Ability2 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God2Ability2);

    var autoToggleCharacter2God2Ability3 = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2God2Ability3");
    if (autoToggleCharacter2God2Ability3 !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2God2Ability3);

    var autoToggleCharacter2Overdrive = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2Overdrive");
    if (autoToggleCharacter2Overdrive !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2Overdrive);
    
      var useCharacter2DuoAbility = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "useCharacter2DuoAbility");
    if (useCharacter2DuoAbility !== undefined)
      this.battleKeybinds.push(useCharacter2DuoAbility);

    var autoToggleCharacter2AllAbilities = this.globalService.globalVar.keybinds.settings.find(item => item[0] === "autoToggleCharacter2AllAbilities");
    if (autoToggleCharacter2AllAbilities !== undefined)
      this.battleKeybinds.push(autoToggleCharacter2AllAbilities);
  }

  resetToDefault() {
    this.initializationService.initializeKeybinds();
  }

  updateKeybind(keybind: [string, any]) {
    this.updateKeybindMode = true;
    this.keybindToUpdate = keybind;
  }

  getKeybindName(name: string) {
    var updatedName = "";

    if (name === "menuGoToCharacters")
      updatedName = "Open Characters Page";
    if (name === "menuGoToGods")
      updatedName = "Open Gods Page";
    if (name === "menuGoToResources")
      updatedName = "Open Resources Page";
    if (name === "menuGoToAchievements")
      updatedName = "Open Achievements Page";
    if (name === "menuGoToProfessions")
      updatedName = "Open Professions Page";
    if (name === "menuGoToSettings")
      updatedName = "Open Settings Page";
    if (name === "menuGoToBestiary")
      updatedName = "Open Bestiary Page";
    if (name === "menuTraverseSubMenuUp")
      updatedName = "Traverse Down Submenu";
    if (name === "menuTraverseSubMenuDown")
      updatedName = "Traverse Up Submenu";
    if (name === "togglePauseGame")
      updatedName = "Toggle Pause/Play";
    if (name === "openMenu")
      updatedName = "Open Menu";
    if (name === "openLog")
      updatedName = "Open Log";
    if (name === "openOverviewQuickView")
      updatedName = "Open Overview Quick View";
    if (name === "openResourcesQuickView")
      updatedName = "Open Resources Quick View";
    if (name === "openAlchemyQuickView")
      updatedName = "Open Alchemy Quick View";
    if (name === "openJewelcraftingQuickView")
      updatedName = "Open Jewelcrafting Quick View";
      if (name === "openTimeFragmentQuickView")
      updatedName = "Open Time Fragment Quick View";
    if (name === "useCharacter1AutoAttack")
      updatedName = "Use Character 1 Auto Attack";
    if (name === "openFirstAvailableAltar")
      updatedName = "Pray At First Altar";
    if (name === "openSecondAvailableAltar")
      updatedName = "Pray At Second Altar";
    if (name === "openThirdAvailableAltar")
      updatedName = "Pray At Third Altar";
    if (name === "toggleAllCharactersTargetMode")
      updatedName = "Toggle All Characters Target Mode";
    if (name === "autoToggleCharacter1AllAbilities")
      updatedName = "Toggle All Character 1 Abilities";
    if (name === "autoToggleCharacter2AllAbilities")
      updatedName = "Toggle All Character 1 Abilities";
    if (name === "toggleCharacter1TargetMode")
      updatedName = "Toggle Character 1 Target Mode";
    if (name === "toggleCharacter2TargetMode")
      updatedName = "Toggle Character 2 Target Mode";
    if (name === "useCharacter1Ability1")
      updatedName = "Use Character 1 Ability 1";
    if (name === "useCharacter1Ability2")
      updatedName = "Use Character 1 Ability 2";
    if (name === "useCharacter1God1Ability1")
      updatedName = "Use Character 1 God 1 Ability 1";
    if (name === "useCharacter1God1Ability2")
      updatedName = "Use Character 1 God 1 Ability 2";
    if (name === "useCharacter1God1Ability3")
      updatedName = "Use Character 1 God 1 Ability 3";
    if (name === "useCharacter1God2Ability1")
      updatedName = "Use Character 1 God 2 Ability 1";
    if (name === "useCharacter1God2Ability2")
      updatedName = "Use Character 1 God 2 Ability 2";
    if (name === "useCharacter1God2Ability3")
      updatedName = "Use Character 1 God 2 Ability 3";
    if (name === "useCharacter1Overdrive")
      updatedName = "Use Character 1 Overdrive";
      if (name === "useCharacter1DuoAbility")
      updatedName = "Use Character 1 Duo Ability";
    if (name === "autoToggleCharacter1AutoAttack")
      updatedName = "Toggle Auto Character 1 Auto Attack";
    if (name === "autoToggleCharacter1Ability1")
      updatedName = "Toggle Auto Character 1 Ability 1";
    if (name === "autoToggleCharacter1Ability2")
      updatedName = "Toggle Auto Character 1 Ability 2";
    if (name === "autoToggleCharacter1God1Ability1")
      updatedName = "Toggle Auto Character 1 God 1 Ability 1";
    if (name === "autoToggleCharacter1God1Ability2")
      updatedName = "Toggle Auto Character 1 God 1 Ability 2";
    if (name === "autoToggleCharacter1God1Ability3")
      updatedName = "Toggle Auto Character 1 God 1 Ability 3";
    if (name === "autoToggleCharacter1God2Ability1")
      updatedName = "Toggle Auto Character 1 God 2 Ability 1";
    if (name === "autoToggleCharacter1God2Ability2")
      updatedName = "Toggle Auto Character 1 God 2 Ability 2";
    if (name === "autoToggleCharacter1God2Ability3")
      updatedName = "Toggle Auto Character 1 God 2 Ability 3";
    if (name === "autoToggleCharacter1Overdrive")
      updatedName = "Toggle Auto Character 1 Overdrive";
    if (name === "useCharacter2AutoAttack")
      updatedName = "Use Character 2 Auto Attack";
    if (name === "useCharacter2Ability1")
      updatedName = "Use Character 2 Ability 1";
    if (name === "useCharacter2Ability2")
      updatedName = "Use Character 2 Ability 2";
    if (name === "useCharacter2God1Ability1")
      updatedName = "Use Character 2 God 1 Ability 1";
    if (name === "useCharacter2God1Ability2")
      updatedName = "Use Character 2 God 1 Ability 2";
    if (name === "useCharacter2God1Ability3")
      updatedName = "Use Character 2 God 1 Ability 3";
    if (name === "useCharacter2God2Ability1")
      updatedName = "Use Character 2 God 2 Ability 1";
    if (name === "useCharacter2God2Ability2")
      updatedName = "Use Character 2 God 2 Ability 2";
    if (name === "useCharacter2God2Ability3")
      updatedName = "Use Character 2 God 2 Ability 3";
    if (name === "useCharacter2Overdrive")
      updatedName = "Use Character 2 Overdrive";
      if (name === "useCharacter2DuoAbility")
      updatedName = "Use Character 2 Duo Ability";
    if (name === "autoToggleCharacter2AutoAttack")
      updatedName = "Toggle Auto Character 2 Auto Attack";
    if (name === "autoToggleCharacter2Ability1")
      updatedName = "Toggle Auto Character 2 Ability 1";
    if (name === "autoToggleCharacter2Ability2")
      updatedName = "Toggle Auto Character 2 Ability 2";
    if (name === "autoToggleCharacter2God1Ability1")
      updatedName = "Toggle Auto Character 2 God 1 Ability 1";
    if (name === "autoToggleCharacter2God1Ability2")
      updatedName = "Toggle Auto Character 2 God 1 Ability 2";
    if (name === "autoToggleCharacter2God1Ability3")
      updatedName = "Toggle Auto Character 2 God 1 Ability 3";
    if (name === "autoToggleCharacter2God2Ability1")
      updatedName = "Toggle Auto Character 2 God 2 Ability 1";
    if (name === "autoToggleCharacter2God2Ability2")
      updatedName = "Toggle Auto Character 2 God 2 Ability 2";
    if (name === "autoToggleCharacter2God2Ability3")
      updatedName = "Toggle Auto Character 2 God 2 Ability 3";
    if (name === "autoToggleCharacter2Overdrive")
      updatedName = "Toggle Auto Character 2 Overdrive";

    return updatedName;
  }


  getKeybindButton(keybind: [string, any]) {
    if (this.updateKeybindMode && this.keybindToUpdate !== undefined && this.keybindToUpdate[0] === keybind[0]) {
      return "&nbsp;";
    }

    var button = keybind[1].toLowerCase();
    var binding = "";

    binding = this.keybindService.getBindingString(button);

    return binding;
  }

  ngOnDestroy() {
    this.menuService.keybindModalOpen = false;
  }
}
