import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionsViewComponent } from './professions-view.component';

describe('ProfessionsViewComponent', () => {
  let component: ProfessionsViewComponent;
  let fixture: ComponentFixture<ProfessionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
