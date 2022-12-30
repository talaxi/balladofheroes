import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chthonic-reset-view',
  templateUrl: './chthonic-reset-view.component.html',
  styleUrls: ['./chthonic-reset-view.component.css']
})
export class ChthonicResetViewComponent implements OnInit {
  isDisplayingResetView = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleView() {
    this.isDisplayingResetView = !this.isDisplayingResetView;
  }
}
