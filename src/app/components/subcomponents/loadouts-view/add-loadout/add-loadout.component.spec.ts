import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoadoutComponent } from './add-loadout.component';

describe('AddLoadoutComponent', () => {
  let component: AddLoadoutComponent;
  let fixture: ComponentFixture<AddLoadoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoadoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLoadoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
