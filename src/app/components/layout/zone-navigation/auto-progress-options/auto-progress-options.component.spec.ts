import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoProgressOptionsComponent } from './auto-progress-options.component';

describe('AutoProgressOptionsComponent', () => {
  let component: AutoProgressOptionsComponent;
  let fixture: ComponentFixture<AutoProgressOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoProgressOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoProgressOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
