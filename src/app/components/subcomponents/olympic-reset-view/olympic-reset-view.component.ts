import { Component } from '@angular/core';

@Component({
  selector: 'app-olympic-reset-view',
  templateUrl: './olympic-reset-view.component.html',
  styleUrls: ['./olympic-reset-view.component.css']
})
export class OlympicResetViewComponent {
  isDisplayingResetView = true;
  showNotificationIcon = false;
  subscription: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  toggleView() {
    this.isDisplayingResetView = !this.isDisplayingResetView;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
