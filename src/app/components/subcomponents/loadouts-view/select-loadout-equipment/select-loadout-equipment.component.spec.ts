import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLoadoutEquipmentComponent } from './select-loadout-equipment.component';

describe('SelectLoadoutEquipmentComponent', () => {
  let component: SelectLoadoutEquipmentComponent;
  let fixture: ComponentFixture<SelectLoadoutEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLoadoutEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLoadoutEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
