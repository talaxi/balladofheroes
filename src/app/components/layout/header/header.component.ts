import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() isMobile = false;
  navigationEnum = NavigationEnum;
  textMode = true;
  tooltipDirection = DirectionEnum.Down;
  @ViewChild('logContent') logContent: any;

  constructor(private battleService: BattleService, public layoutService: LayoutService, private menuService: MenuService,
    public utilityService: UtilityService, public globalService: GlobalService, public deploymentService: DeploymentService,
    public dialog: MatDialog, private keybindService: KeybindService, private lookupService: LookupService,
    private deviceDetectorService: DeviceDetectorService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    var keybinds = this.globalService.globalVar.keybinds;    

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openMenu"))) {      
      this.openMenu();
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("togglePauseGame"))) {      
      this.pauseGame();
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openLog"))) {      
      this.openLog(this.logContent);
    }
  }

  ngOnInit(): void {
  }

  pauseGame() {
    this.battleService.togglePause();
  }

  getExtraSpeedTime() {
    var time = "";

    time = this.utilityService.convertSecondsToHHMMSS(this.globalService.globalVar.extraSpeedTimeRemaining);

    return time;
  }

  toggleExtraSpeed() {
    this.globalService.globalVar.extraSpeedEnabled = !this.globalService.globalVar.extraSpeedEnabled;
  }

  openMenu() {
    if (this.isMobile) {
      if (this.layoutService.mobileMenuOpen)
        this.layoutService.mobileMenuOpen = false;
      else
        this.layoutService.mobileMenuOpen = true;
    }
    else {
      if (this.layoutService.navigation === NavigationEnum.Default) {
        this.layoutService.changeLayout(NavigationEnum.Menu);
        if (this.menuService.selectedMenuDisplay === MenuEnum.Characters && this.menuService.selectedCharacter === CharacterEnum.None)
          this.menuService.setSelectedCharacter(CharacterEnum.Adventurer);
        if (this.menuService.selectedMenuDisplay === MenuEnum.Gods && this.menuService.selectedGod === GodEnum.None)
          this.menuService.setSelectedGod(GodEnum.Athena);
      }
      else
        this.layoutService.changeLayout(NavigationEnum.Default);

      this.utilityService.removeExcessOverlayDivs();
    }
  }

  backToMainView() {
    this.layoutService.mobileMenuOpen = false;
    this.layoutService.changeLayout(NavigationEnum.Default);
  }

  togglePerformanceMode() {
    this.globalService.globalVar.performanceMode = !this.globalService.globalVar.performanceMode;
    this.textMode = !this.textMode;
  }

  openLog(content: any) {
    if (this.isMobile)
    this.dialog.open(content, { width: '95%', height: '80%' });
  else 
    this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });
  }

  getPauseKeybindKey() {
    var keybindKey = "";
    var keybindString = "togglePauseGame";

    var keybind = this.globalService.globalVar.keybinds.settings.find(item => item[0] === keybindString);
    if (keybind !== undefined)
      keybindKey = this.keybindService.getBindingString(keybind[1]);

    return "<span class='keybind'>" + keybindKey + "</span>";
  }
}
