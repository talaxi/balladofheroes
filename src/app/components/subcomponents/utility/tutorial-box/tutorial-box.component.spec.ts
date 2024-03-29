import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialBoxComponent } from './tutorial-box.component';

describe('TutorialBoxComponent', () => {
  let component: TutorialBoxComponent;
  let fixture: ComponentFixture<TutorialBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
