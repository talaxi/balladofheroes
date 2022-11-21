import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMenuItemComponent } from './item-menu-item.component';

describe('ItemMenuItemComponent', () => {
  let component: ItemMenuItemComponent;
  let fixture: ComponentFixture<ItemMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
