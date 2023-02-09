import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeClassViewComponent } from './change-class-view.component';

describe('ChangeClassViewComponent', () => {
  let component: ChangeClassViewComponent;
  let fixture: ComponentFixture<ChangeClassViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeClassViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeClassViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
