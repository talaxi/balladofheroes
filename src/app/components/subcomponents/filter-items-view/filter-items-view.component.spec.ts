import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterItemsViewComponent } from './filter-items-view.component';

describe('FilterItemsViewComponent', () => {
  let component: FilterItemsViewComponent;
  let fixture: ComponentFixture<FilterItemsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterItemsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
