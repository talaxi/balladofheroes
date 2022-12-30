import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChthonicRewardMenuViewComponent } from './chthonic-reward-menu-view.component';

describe('ChthonicRewardMenuViewComponent', () => {
  let component: ChthonicRewardMenuViewComponent;
  let fixture: ComponentFixture<ChthonicRewardMenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChthonicRewardMenuViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChthonicRewardMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
