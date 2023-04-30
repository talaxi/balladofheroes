import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneAreaNavigationComponent } from './zone-area-navigation.component';

describe('ZoneAreaNavigationComponent', () => {
  let component: ZoneAreaNavigationComponent;
  let fixture: ComponentFixture<ZoneAreaNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZoneAreaNavigationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ZoneAreaNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
