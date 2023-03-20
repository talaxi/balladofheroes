import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBeltOverviewComponent } from './item-belt-overview.component';

describe('ItemBeltOverviewComponent', () => {
  let component: ItemBeltOverviewComponent;
  let fixture: ComponentFixture<ItemBeltOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemBeltOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemBeltOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
