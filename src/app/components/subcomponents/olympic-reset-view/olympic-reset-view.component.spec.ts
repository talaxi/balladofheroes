import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlympicResetViewComponent } from './olympic-reset-view.component';

describe('OlympicResetViewComponent', () => {
  let component: OlympicResetViewComponent;
  let fixture: ComponentFixture<OlympicResetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlympicResetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlympicResetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
