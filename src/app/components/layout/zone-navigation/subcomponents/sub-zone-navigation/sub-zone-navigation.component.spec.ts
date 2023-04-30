import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubZoneNavigationComponent } from './sub-zone-navigation.component';

describe('SubZoneNavigationComponent', () => {
  let component: SubZoneNavigationComponent;
  let fixture: ComponentFixture<SubZoneNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubZoneNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubZoneNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
