import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAltarAutoComponent } from './update-altar-auto.component';

describe('UpdateAltarAutoComponent', () => {
  let component: UpdateAltarAutoComponent;
  let fixture: ComponentFixture<UpdateAltarAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAltarAutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAltarAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
