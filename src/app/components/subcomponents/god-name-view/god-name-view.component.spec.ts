import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodNameViewComponent } from './god-name-view.component';

describe('GodNameViewComponent', () => {
  let component: GodNameViewComponent;
  let fixture: ComponentFixture<GodNameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GodNameViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GodNameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
