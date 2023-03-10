import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerPrayerViewComponent } from './follower-prayer-view.component';

describe('FollowerPrayerViewComponent', () => {
  let component: FollowerPrayerViewComponent;
  let fixture: ComponentFixture<FollowerPrayerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowerPrayerViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerPrayerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
