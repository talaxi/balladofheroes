import { Component, Input, OnInit } from '@angular/core';
import { NotificationTypeEnum } from 'src/app/models/enums/notification-type-enum.model';

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.css']
})
export class NotificationIconComponent implements OnInit {
  @Input() notificationColor = NotificationTypeEnum.Story; 
  @Input() isButton = false;
  @Input() notificationStyle = "!";

  constructor() { }

  ngOnInit(): void {
    
  }

  baseClass() {
    var className = "availableIcon";

    if (this.isButton) {
      className += " onButton";
    }

    return className;
  }

  getNotificationStyle() {
    return this.notificationStyle;
  }

  getIconColor() {
    return {
      'availableIconSideQuest': this.notificationColor === NotificationTypeEnum.SideQuest,      
      'availableIconProfession': this.notificationColor === NotificationTypeEnum.Profession,      
      'availableIconReset': this.notificationColor === NotificationTypeEnum.Reset      
    };
  }
}
