import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColiseumViewComponent } from './coliseum-view.component';

describe('ColiseumViewComponent', () => {
  let component: ColiseumViewComponent;
  let fixture: ComponentFixture<ColiseumViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColiseumViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColiseumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
