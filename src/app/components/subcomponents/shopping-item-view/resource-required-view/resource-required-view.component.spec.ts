import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceRequiredViewComponent } from './resource-required-view.component';

describe('ResourceRequiredViewComponent', () => {
  let component: ResourceRequiredViewComponent;
  let fixture: ComponentFixture<ResourceRequiredViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceRequiredViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceRequiredViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
