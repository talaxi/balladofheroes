import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlympicRewardMenuViewComponent } from './olympic-reward-menu-view.component';

describe('OlympicRewardMenuViewComponent', () => {
  let component: OlympicRewardMenuViewComponent;
  let fixture: ComponentFixture<OlympicRewardMenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlympicRewardMenuViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlympicRewardMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
