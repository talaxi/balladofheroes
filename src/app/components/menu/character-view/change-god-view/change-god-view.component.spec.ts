import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeGodViewComponent } from './change-god-view.component';

describe('ChangeGodViewComponent', () => {
  let component: ChangeGodViewComponent;
  let fixture: ComponentFixture<ChangeGodViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeGodViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeGodViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
