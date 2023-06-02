import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLoadoutGodComponent } from './select-loadout-god.component';

describe('SelectLoadoutGodComponent', () => {
  let component: SelectLoadoutGodComponent;
  let fixture: ComponentFixture<SelectLoadoutGodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLoadoutGodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLoadoutGodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
