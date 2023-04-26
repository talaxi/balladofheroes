import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestiaryViewComponent } from './bestiary-view.component';

describe('BestiaryViewComponent', () => {
  let component: BestiaryViewComponent;
  let fixture: ComponentFixture<BestiaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestiaryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestiaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
