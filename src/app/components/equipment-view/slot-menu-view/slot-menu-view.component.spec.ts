import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotMenuViewComponent } from './slot-menu-view.component';

describe('SlotMenuViewComponent', () => {
  let component: SlotMenuViewComponent;
  let fixture: ComponentFixture<SlotMenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotMenuViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
