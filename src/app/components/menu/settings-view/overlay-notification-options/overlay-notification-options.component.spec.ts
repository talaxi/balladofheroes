import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayNotificationOptionsComponent } from './overlay-notification-options.component';

describe('OverlayNotificationOptionsComponent', () => {
  let component: OverlayNotificationOptionsComponent;
  let fixture: ComponentFixture<OverlayNotificationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayNotificationOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayNotificationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
