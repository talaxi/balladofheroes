import { Component, Input } from '@angular/core';
import { FollowerTabEnum } from 'src/app/models/enums/follower-tab-enum.model';
import { FollowerData } from 'src/app/models/followers/follower-data.model';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-follower-default-view',
  templateUrl: './follower-default-view.component.html',
  styleUrls: ['./follower-default-view.component.css']
})
export class FollowerDefaultViewComponent {  
  selectedTab: FollowerTabEnum;
  followerTabEnum = FollowerTabEnum;
  @Input() fromMenu: boolean = false;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    this.selectedTab = FollowerTabEnum.Overview;    
    var activeTab = this.globalService.globalVar.settings.get("activeFollowerTab");
    if (activeTab !== undefined)
      this.selectedTab = activeTab;

  }

  changeView(tab: FollowerTabEnum) {
    this.selectedTab = tab;
    this.globalService.globalVar.settings.set("activeFollowerTab", tab);
  }
}
