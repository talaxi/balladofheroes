import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFragmentViewComponent } from './time-fragment-view.component';

describe('TimeFragmentViewComponent', () => {
  let component: TimeFragmentViewComponent;
  let fixture: ComponentFixture<TimeFragmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeFragmentViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFragmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
