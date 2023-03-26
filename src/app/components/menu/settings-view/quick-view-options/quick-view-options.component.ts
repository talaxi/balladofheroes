import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-quick-view-options',
  templateUrl: './quick-view-options.component.html',
  styleUrls: ['./quick-view-options.component.css']
})
export class QuickViewOptionsComponent {
  isMobile = false;
  displayQuickViewOverview: boolean;
  displayQuickViewResources: boolean;
  displayQuickViewGameText: boolean;
  displayQuickViewItemBelt: boolean;
  displayQuickViewAltars: boolean;
  displayQuickViewAlchemy: boolean;

  altarsUnlocked = false;
  alchemyUnlocked = false;

  constructor(private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService) {

  }

  ngOnInit() {   
    this.isMobile = this.deviceDetectorService.isMobile();
    this.altarsUnlocked = this.globalService.globalVar.altars.isUnlocked;
    this.alchemyUnlocked = this.globalService.globalVar.alchemy.isUnlocked;

    var displayQuickViewOverview = this.globalService.globalVar.settings.get("displayQuickViewOverview");    
    if (displayQuickViewOverview === undefined)
      this.displayQuickViewOverview = false;
    else
      this.displayQuickViewOverview = displayQuickViewOverview;
      
    var displayQuickViewResources = this.globalService.globalVar.settings.get("displayQuickViewResources");
    if (displayQuickViewResources === undefined)
      this.displayQuickViewResources = false;
    else
      this.displayQuickViewResources = displayQuickViewResources;
      
    var displayQuickViewGameText = this.globalService.globalVar.settings.get("displayQuickViewGameText");
    if (displayQuickViewGameText === undefined)
      this.displayQuickViewGameText = false;
    else
      this.displayQuickViewGameText = displayQuickViewGameText;
      
    var displayQuickViewItemBelt = this.globalService.globalVar.settings.get("displayQuickViewItemBelt");
    if (displayQuickViewItemBelt === undefined)
      this.displayQuickViewItemBelt = false;
    else
      this.displayQuickViewItemBelt = displayQuickViewItemBelt;
      
    var displayQuickViewAltars = this.globalService.globalVar.settings.get("displayQuickViewAltars");
    if (displayQuickViewAltars === undefined)
      this.displayQuickViewAltars = false;
    else
      this.displayQuickViewAltars = displayQuickViewAltars;
      
    var displayQuickViewAlchemy = this.globalService.globalVar.settings.get("displayQuickViewAlchemy");
    if (displayQuickViewAlchemy === undefined)
      this.displayQuickViewAlchemy = false;
    else
      this.displayQuickViewAlchemy = displayQuickViewAlchemy;
  }

  displayQuickViewOverviewToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewOverview", this.displayQuickViewOverview);
  }
  
  displayQuickViewResourcesToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewResources", this.displayQuickViewResources);
  }
  
  displayQuickViewGameTextToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewGameText", this.displayQuickViewGameText);
  }
  
  displayQuickViewItemBeltToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewItemBelt", this.displayQuickViewItemBelt);
  }
  
  displayQuickViewAltarsToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewAltars", this.displayQuickViewAltars);
  }
  
  displayQuickViewAlchemyToggle() {
    this.globalService.globalVar.settings.set("displayQuickViewAlchemy", this.displayQuickViewAlchemy);
  }
}
