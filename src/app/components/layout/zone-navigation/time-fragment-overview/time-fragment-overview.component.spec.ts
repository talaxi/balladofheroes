import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFragmentOverviewComponent } from './time-fragment-overview.component';

describe('TimeFragmentOverviewComponent', () => {
  let component: TimeFragmentOverviewComponent;
  let fixture: ComponentFixture<TimeFragmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeFragmentOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFragmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
