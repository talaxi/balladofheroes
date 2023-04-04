import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlchemyOverviewComponent } from './alchemy-overview.component';

describe('AlchemyOverviewComponent', () => {
  let component: AlchemyOverviewComponent;
  let fixture: ComponentFixture<AlchemyOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlchemyOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlchemyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
