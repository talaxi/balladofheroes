import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingItemViewComponent } from './shopping-item-view.component';

describe('ShoppingItemViewComponent', () => {
  let component: ShoppingItemViewComponent;
  let fixture: ComponentFixture<ShoppingItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
