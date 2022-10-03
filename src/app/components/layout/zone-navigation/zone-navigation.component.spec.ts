import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneNavigationComponent } from './zone-navigation.component';

describe('ZoneNavigationComponent', () => {
  let component: ZoneNavigationComponent;
  let fixture: ComponentFixture<ZoneNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
