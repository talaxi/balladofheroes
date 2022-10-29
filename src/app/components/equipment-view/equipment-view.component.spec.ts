import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentViewComponent } from './equipment-view.component';

describe('EquipmentViewComponent', () => {
  let component: EquipmentViewComponent;
  let fixture: ComponentFixture<EquipmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
