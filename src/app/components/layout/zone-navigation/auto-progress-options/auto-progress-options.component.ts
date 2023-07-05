import { Component } from '@angular/core';
import { CompletionStatusEnum } from 'src/app/models/enums/completion-status-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-auto-progress-options',
  templateUrl: './auto-progress-options.component.html',
  styleUrls: ['./auto-progress-options.component.css']
})
export class AutoProgressOptionsComponent {
  autoProgressType: CompletionStatusEnum;
  includeSideQuests: boolean;
  pauseStory: boolean;
  completionStatusEnum = CompletionStatusEnum;
  includeAllAchievements: boolean;
  removeAutoProgressOnDeath: boolean;
  progressFromCurrentSubzone: boolean;

  constructor(private globalService: GlobalService) {

  }

  ngOnInit() {
    this.autoProgressType = this.globalService.globalVar.settings.get("autoProgressType") ?? CompletionStatusEnum.Cleared;
    this.includeSideQuests = this.globalService.globalVar.settings.get("autoProgressIncludeSideQuests") ?? true;
    this.pauseStory = this.globalService.globalVar.settings.get("autoProgressPauseStory") ?? false;
    this.progressFromCurrentSubzone = this.globalService.globalVar.settings.get("autoProgressProgressFromCurrentSubzone") ?? false;
    this.includeAllAchievements = !this.globalService.globalVar.settings.get("autoProgressIncludeAllAchievements") ?? true;   
    this.removeAutoProgressOnDeath = this.globalService.globalVar.settings.get("autoProgressRemoveOnDeath") ?? true;    
  }

  autoProgressTypeToggle() {
    this.globalService.globalVar.settings.set("autoProgressType", this.autoProgressType);
  }

  includeSideQuestsToggle() {
    this.globalService.globalVar.settings.set("autoProgressIncludeSideQuests", this.includeSideQuests);
  }

  pauseStoryToggle() {
    this.globalService.globalVar.settings.set("autoProgressPauseStory", this.pauseStory);
  }

  includeAllAchievementsToggle() {
    this.globalService.globalVar.settings.set("autoProgressIncludeAllAchievements", !this.includeAllAchievements);
  }

  removeAutoProgressOnDeathToggle() {
    this.globalService.globalVar.settings.set("autoProgressRemoveOnDeath", this.removeAutoProgressOnDeath);
  }

  progressFromCurrentSubzoneToggle() {
    this.globalService.globalVar.settings.set("autoProgressProgressFromCurrentSubzone", this.progressFromCurrentSubzone);
  }
}
