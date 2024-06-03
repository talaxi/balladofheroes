import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog as MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { NavigationEnum } from 'src/app/models/enums/navigation-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { ZodiacEnum } from 'src/app/models/enums/zodiac-enum.model';
import { LayoutService } from 'src/app/models/global/layout.service';
import { BattleService } from 'src/app/services/battle/battle.service';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ZodiacService } from 'src/app/services/global/zodiac.service';
import { LookupService } from 'src/app/services/lookup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { KeybindService } from 'src/app/services/utility/keybind.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { formatDate } from "@angular/common";

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
  logDialogRef: MatDialogRef<any, any>;
  @ViewChild('logContent') logContent: any;

  constructor(private battleService: BattleService, public layoutService: LayoutService, private menuService: MenuService,
    public utilityService: UtilityService, public globalService: GlobalService, public deploymentService: DeploymentService,
    public dialog: MatDialog, private keybindService: KeybindService, private lookupService: LookupService,
    private deviceDetectorService: DeviceDetectorService, private zodiacService: ZodiacService, private dictionaryService: DictionaryService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.menuService.keybindModalOpen)
      return;

    var keybinds = this.globalService.globalVar.keybinds;

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openMenu"))) {
      this.openMenu();
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("togglePauseGame"))) {
      this.pauseGame();
    }

    if (this.keybindService.doesKeyMatchKeybind(event, keybinds.get("openLog"))) {
      if (this.menuService.logDisplayed) {
        this.dialog.closeAll();
        this.menuService.logDisplayed = false;
      }
      else
        this.openLog(this.logContent);
    }
  }

  ngOnInit(): void {
  }

  openZodiacPopover(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '75%', height: '80%' });
  }

  getZodiacSign() {
    var zodiacSrc = "assets/svg/";
    var zodiacSign = this.zodiacService.getCurrentZodiac();

    var signSrc = "";
    if (zodiacSign === ZodiacEnum.Aquarius)
      signSrc = "Aquarius.svg";
    if (zodiacSign === ZodiacEnum.Aries)
      signSrc = "Aries.svg";
    if (zodiacSign === ZodiacEnum.Taurus)
      signSrc = "Taurus.svg";
    if (zodiacSign === ZodiacEnum.Gemini)
      signSrc = "Gemini.svg";
    if (zodiacSign === ZodiacEnum.Cancer)
      signSrc = "Cancer.svg";
    if (zodiacSign === ZodiacEnum.Leo)
      signSrc = "Leo.svg";
    if (zodiacSign === ZodiacEnum.Virgo)
      signSrc = "Virgo.svg";
    if (zodiacSign === ZodiacEnum.Libra)
      signSrc = "Libra.svg";
    if (zodiacSign === ZodiacEnum.Scorpio)
      signSrc = "Scorpio.svg";
    if (zodiacSign === ZodiacEnum.Sagittarius)
      signSrc = "Sagittarius.svg";
    if (zodiacSign === ZodiacEnum.Capricorn)
      signSrc = "Capricorn.svg";
    if (zodiacSign === ZodiacEnum.Pisces)
      signSrc = "Pisces.svg";

    return zodiacSrc + signSrc;
  }

  getZodiacName() {
    return this.dictionaryService.getZodiacName(this.zodiacService.getCurrentZodiac());
  }

  getZodiacStartDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    var zodiacStartDate: Date = new Date();
    var zodiacSign = this.zodiacService.getCurrentZodiac();

    if (zodiacSign === ZodiacEnum.Aquarius)
      zodiacStartDate = new Date(year, 0, 20);
    if (zodiacSign === ZodiacEnum.Pisces)
      zodiacStartDate = new Date(year, 1, 19);
    if (zodiacSign === ZodiacEnum.Aries)
      zodiacStartDate = new Date(year, 2, 20);
    if (zodiacSign === ZodiacEnum.Taurus)
      zodiacStartDate = new Date(year, 3, 19);
    if (zodiacSign === ZodiacEnum.Gemini)
      zodiacStartDate = new Date(year, 4, 20);
    if (zodiacSign === ZodiacEnum.Cancer)
      zodiacStartDate = new Date(year, 5, 20);
    if (zodiacSign === ZodiacEnum.Leo)
      zodiacStartDate = new Date(year, 6, 22);
    if (zodiacSign === ZodiacEnum.Virgo)
      zodiacStartDate = new Date(year, 7, 22);
    if (zodiacSign === ZodiacEnum.Libra)
      zodiacStartDate = new Date(year, 8, 22);
    if (zodiacSign === ZodiacEnum.Scorpio)
      zodiacStartDate = new Date(year, 9, 22);
    if (zodiacSign === ZodiacEnum.Sagittarius)
      zodiacStartDate = new Date(year, 10, 21);
    if (zodiacSign === ZodiacEnum.Capricorn)
      zodiacStartDate = new Date(year, 11, 21);

    /*if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      zodiacStartDate = new Date(year, 0, 20);
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      zodiacStartDate = new Date(year, 1, 19);
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      zodiacStartDate = new Date(year, 2, 21);
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      zodiacStartDate = new Date(year, 3, 20);
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      zodiacStartDate = new Date(year, 4, 21);
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      zodiacStartDate = new Date(year, 5, 21);
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      zodiacStartDate = new Date(year, 6, 23);
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      zodiacStartDate = new Date(year, 7, 23);
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      zodiacStartDate = new Date(year, 8, 23);
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      zodiacStartDate = new Date(year, 9, 23);
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      zodiacStartDate = new Date(year, 10, 22);
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      zodiacStartDate = new Date(year, 11, 22);
    } else {
      zodiacStartDate = new Date(0); // Default to an invalid date
    }*/

    return formatDate(zodiacStartDate, 'MMMM d', 'en-US');
  }

  getZodiacEndDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    const day = now.getDate();
    var zodiacEndDate: Date = new Date();
    var zodiacSign = this.zodiacService.getCurrentZodiac();

    if (zodiacSign === ZodiacEnum.Aquarius)
      zodiacEndDate = new Date(year, 1, 18);
    if (zodiacSign === ZodiacEnum.Pisces)
      zodiacEndDate = new Date(year, 2, 19);
    if (zodiacSign === ZodiacEnum.Aries)
      zodiacEndDate = new Date(year, 3, 18);
    if (zodiacSign === ZodiacEnum.Taurus)
      zodiacEndDate = new Date(year, 4, 19);
    if (zodiacSign === ZodiacEnum.Gemini)
      zodiacEndDate = new Date(year, 5, 19);
    if (zodiacSign === ZodiacEnum.Cancer)
      zodiacEndDate = new Date(year, 6, 21);
    if (zodiacSign === ZodiacEnum.Leo)
      zodiacEndDate = new Date(year, 7, 21);
    if (zodiacSign === ZodiacEnum.Virgo)
      zodiacEndDate = new Date(year, 8, 21);
    if (zodiacSign === ZodiacEnum.Libra)
      zodiacEndDate = new Date(year, 9, 21);
    if (zodiacSign === ZodiacEnum.Scorpio)
      zodiacEndDate = new Date(year, 10, 20);
    if (zodiacSign === ZodiacEnum.Sagittarius)
      zodiacEndDate = new Date(year, 11, 20);
    if (zodiacSign === ZodiacEnum.Capricorn)
      zodiacEndDate = new Date(year, 0, 19);

    /*if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      zodiacEndDate = new Date(year, 1, 18);
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      zodiacEndDate = new Date(year, 2, 20);
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      zodiacEndDate = new Date(year, 3, 19);
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      zodiacEndDate = new Date(year, 4, 20);
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      zodiacEndDate = new Date(year, 5, 20);
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      zodiacEndDate = new Date(year, 6, 22);
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      zodiacEndDate = new Date(year, 7, 22);
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      zodiacEndDate = new Date(year, 8, 22);
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      zodiacEndDate = new Date(year, 9, 22);
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      zodiacEndDate = new Date(year, 10, 21);
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      zodiacEndDate = new Date(year, 11, 21);
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      zodiacEndDate = new Date(year, 12, 19);
    } else {
      zodiacEndDate = new Date(0); // Default to an invalid date
    }*/

    return formatDate(zodiacEndDate, 'MMMM d', 'en-US');
  }

  anyBonusGodsHidden() {
    var bonusGods = this.zodiacService.getBonusGods(this.globalService.globalVar.gods);
    var isHidden = false;

    bonusGods.forEach(bonusGod => {
      if (this.globalService.globalVar.gods.find(item => item.type === bonusGod) === undefined ||
        !this.globalService.globalVar.gods.find(item => item.type === bonusGod)?.isAvailable)
        isHidden = true;
    });

    return isHidden;
  }

  getBonusGods() {
    var bonusGods = this.zodiacService.getBonusGods(this.globalService.globalVar.gods);
    var godText = "";

    for (var i = 0; i < bonusGods.length; i++) {
      var bonusGod = bonusGods[i];
      var godName = this.lookupService.getGodNameByType(bonusGod);
      var isGodHidden = false;
      if (this.globalService.globalVar.gods.find(item => item.type === bonusGod) === undefined ||
        !this.globalService.globalVar.gods.find(item => item.type === bonusGod)?.isAvailable)
        isGodHidden = true;

      godText += "<span class='bold smallCaps " + godName.toLowerCase() + "Color'>" + (isGodHidden ? "???" : godName) + "</span>";
      if (i !== bonusGods.length - 1)
        godText += ", ";
    }

    return godText;
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
        if (this.menuService.selectedMenuDisplay === MenuEnum.Professions && this.menuService.selectedProfession === ProfessionEnum.None)
          this.menuService.setSelectedProfession(ProfessionEnum.Alchemy);
      }
      else {
        this.layoutService.changeLayout(NavigationEnum.Default);
      }

      this.utilityService.removeExcessOverlayDivs();
    }
  }

  backToMainView() {
    this.layoutService.mobileMenuOpen = false;
    this.menuService.setSelectedCharacter(CharacterEnum.None);
    this.menuService.setSelectedGod(GodEnum.None);
    this.menuService.setSelectedProfession(ProfessionEnum.None);
    this.layoutService.changeLayout(NavigationEnum.Default);
  }

  togglePerformanceMode() {
    this.globalService.globalVar.performanceMode = !this.globalService.globalVar.performanceMode;
    this.textMode = !this.textMode;
  }

  openLog(content: any) {
    this.dialog.closeAll();

    this.menuService.logDisplayed = true;
    if (this.isMobile)
      this.logDialogRef = this.dialog.open(content, { width: '95%', height: '80%', id: 'dialogNoPadding' });
    else
      this.logDialogRef = this.dialog.open(content, { width: '75%', height: '75%', id: 'dialogNoPadding' });

      this.logDialogRef.afterClosed().subscribe(dialogResult => {
        this.menuService.logDisplayed = false;
      });
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
