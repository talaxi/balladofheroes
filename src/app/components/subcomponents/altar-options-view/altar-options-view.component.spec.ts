import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltarOptionsViewComponent } from './altar-options-view.component';

describe('AltarOptionsViewComponent', () => {
  let component: AltarOptionsViewComponent;
  let fixture: ComponentFixture<AltarOptionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltarOptionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltarOptionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
