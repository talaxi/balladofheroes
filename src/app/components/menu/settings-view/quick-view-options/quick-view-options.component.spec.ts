import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewOptionsComponent } from './quick-view-options.component';

describe('QuickViewOptionsComponent', () => {
  let component: QuickViewOptionsComponent;
  let fixture: ComponentFixture<QuickViewOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickViewOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickViewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
