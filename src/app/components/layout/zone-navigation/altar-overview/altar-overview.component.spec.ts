import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltarOverviewComponent } from './altar-overview.component';

describe('AltarOverviewComponent', () => {
  let component: AltarOverviewComponent;
  let fixture: ComponentFixture<AltarOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltarOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltarOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
