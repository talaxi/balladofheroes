import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorOverviewComponent } from './calculator-overview.component';

describe('CalculatorOverviewComponent', () => {
  let component: CalculatorOverviewComponent;
  let fixture: ComponentFixture<CalculatorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
