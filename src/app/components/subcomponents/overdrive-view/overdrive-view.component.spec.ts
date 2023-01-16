import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdriveViewComponent } from './overdrive-view.component';

describe('OverdriveViewComponent', () => {
  let component: OverdriveViewComponent;
  let fixture: ComponentFixture<OverdriveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverdriveViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdriveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
