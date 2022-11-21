import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodViewComponent } from './god-view.component';

describe('GodViewComponent', () => {
  let component: GodViewComponent;
  let fixture: ComponentFixture<GodViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GodViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GodViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
