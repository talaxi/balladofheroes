import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAchievementViewComponent } from './individual-achievement-view.component';

describe('IndividualAchievementViewComponent', () => {
  let component: IndividualAchievementViewComponent;
  let fixture: ComponentFixture<IndividualAchievementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualAchievementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualAchievementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
