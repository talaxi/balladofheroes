import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChthonicResetMenuViewComponent } from './chthonic-reset-menu-view.component';

describe('ChthonicResetMenuViewComponent', () => {
  let component: ChthonicResetMenuViewComponent;
  let fixture: ComponentFixture<ChthonicResetMenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChthonicResetMenuViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChthonicResetMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
