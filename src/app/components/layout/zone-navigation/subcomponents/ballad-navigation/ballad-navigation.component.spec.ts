import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalladNavigationComponent } from './ballad-navigation.component';

describe('BalladNavigationComponent', () => {
  let component: BalladNavigationComponent;
  let fixture: ComponentFixture<BalladNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalladNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalladNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
