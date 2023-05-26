import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportViewComponent } from './support-view.component';

describe('SupportViewComponent', () => {
  let component: SupportViewComponent;
  let fixture: ComponentFixture<SupportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
