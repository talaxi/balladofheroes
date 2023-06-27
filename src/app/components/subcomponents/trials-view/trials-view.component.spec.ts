import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialsViewComponent } from './trials-view.component';

describe('TrialsViewComponent', () => {
  let component: TrialsViewComponent;
  let fixture: ComponentFixture<TrialsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
