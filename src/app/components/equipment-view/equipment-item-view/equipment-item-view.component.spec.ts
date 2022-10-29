import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentItemViewComponent } from './equipment-item-view.component';

describe('EquipmentItemViewComponent', () => {
  let component: EquipmentItemViewComponent;
  let fixture: ComponentFixture<EquipmentItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
