import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerOverviewViewComponent } from './follower-overview-view.component';

describe('FollowerOverviewViewComponent', () => {
  let component: FollowerOverviewViewComponent;
  let fixture: ComponentFixture<FollowerOverviewViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowerOverviewViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerOverviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
