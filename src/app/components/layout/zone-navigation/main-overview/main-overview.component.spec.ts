import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainOverviewComponent } from './main-overview.component';

describe('MainOverviewComponent', () => {
  let component: MainOverviewComponent;
  let fixture: ComponentFixture<MainOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
