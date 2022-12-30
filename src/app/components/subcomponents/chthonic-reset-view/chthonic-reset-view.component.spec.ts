import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChthonicResetViewComponent } from './chthonic-reset-view.component';

describe('ChthonicResetViewComponent', () => {
  let component: ChthonicResetViewComponent;
  let fixture: ComponentFixture<ChthonicResetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChthonicResetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChthonicResetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
