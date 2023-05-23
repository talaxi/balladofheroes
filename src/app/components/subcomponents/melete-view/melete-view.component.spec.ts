import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeleteViewComponent } from './melete-view.component';

describe('MeleteViewComponent', () => {
  let component: MeleteViewComponent;
  let fixture: ComponentFixture<MeleteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeleteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeleteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
