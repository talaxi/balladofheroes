import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentEquipmentViewComponent } from './current-equipment-view.component';

describe('CurrentEquipmentViewComponent', () => {
  let component: CurrentEquipmentViewComponent;
  let fixture: ComponentFixture<CurrentEquipmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentEquipmentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentEquipmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
