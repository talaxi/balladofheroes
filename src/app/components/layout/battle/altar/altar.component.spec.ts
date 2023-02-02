import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltarComponent } from './altar.component';

describe('AltarComponent', () => {
  let component: AltarComponent;
  let fixture: ComponentFixture<AltarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
