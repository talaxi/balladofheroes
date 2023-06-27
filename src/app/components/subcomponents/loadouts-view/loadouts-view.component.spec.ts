import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadoutsViewComponent } from './loadouts-view.component';

describe('LoadoutsViewComponent', () => {
  let component: LoadoutsViewComponent;
  let fixture: ComponentFixture<LoadoutsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadoutsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadoutsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
