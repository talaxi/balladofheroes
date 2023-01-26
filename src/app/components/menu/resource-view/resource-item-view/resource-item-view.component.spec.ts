import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceItemViewComponent } from './resource-item-view.component';

describe('ResourceItemViewComponent', () => {
  let component: ResourceItemViewComponent;
  let fixture: ComponentFixture<ResourceItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
