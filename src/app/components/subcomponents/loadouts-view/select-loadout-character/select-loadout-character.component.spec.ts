import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLoadoutCharacterComponent } from './select-loadout-character.component';

describe('SelectLoadoutCharacterComponent', () => {
  let component: SelectLoadoutCharacterComponent;
  let fixture: ComponentFixture<SelectLoadoutCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLoadoutCharacterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLoadoutCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
