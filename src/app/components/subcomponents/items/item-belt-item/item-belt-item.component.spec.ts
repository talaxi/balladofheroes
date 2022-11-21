import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBeltItemComponent } from './item-belt-item.component';

describe('ItemBeltItemComponent', () => {
  let component: ItemBeltItemComponent;
  let fixture: ComponentFixture<ItemBeltItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemBeltItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBeltItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
