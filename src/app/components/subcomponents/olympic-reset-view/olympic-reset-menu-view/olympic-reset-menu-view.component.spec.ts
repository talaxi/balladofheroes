import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlympicResetMenuViewComponent } from './olympic-reset-menu-view.component';

describe('OlympicResetMenuViewComponent', () => {
  let component: OlympicResetMenuViewComponent;
  let fixture: ComponentFixture<OlympicResetMenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlympicResetMenuViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlympicResetMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
