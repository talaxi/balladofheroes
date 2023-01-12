import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlchemyViewComponent } from './alchemy-view.component';

describe('AlchemyViewComponent', () => {
  let component: AlchemyViewComponent;
  let fixture: ComponentFixture<AlchemyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlchemyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlchemyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
