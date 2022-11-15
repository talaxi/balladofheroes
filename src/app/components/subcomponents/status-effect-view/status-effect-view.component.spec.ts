import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusEffectViewComponent } from './status-effect-view.component';

describe('StatusEffectViewComponent', () => {
  let component: StatusEffectViewComponent;
  let fixture: ComponentFixture<StatusEffectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusEffectViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusEffectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
