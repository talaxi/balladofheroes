import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualStatusEffectViewComponent } from './individual-status-effect-view.component';

describe('IndividualStatusEffectViewComponent', () => {
  let component: IndividualStatusEffectViewComponent;
  let fixture: ComponentFixture<IndividualStatusEffectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualStatusEffectViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualStatusEffectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
