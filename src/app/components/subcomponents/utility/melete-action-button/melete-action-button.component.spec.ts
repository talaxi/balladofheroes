import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeleteActionButtonComponent } from './melete-action-button.component';

describe('MeleteActionButtonComponent', () => {
  let component: MeleteActionButtonComponent;
  let fixture: ComponentFixture<MeleteActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeleteActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeleteActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
