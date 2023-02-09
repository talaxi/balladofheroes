import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltarViewComponent } from './altar-view.component';

describe('AltarViewComponent', () => {
  let component: AltarViewComponent;
  let fixture: ComponentFixture<AltarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltarViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
