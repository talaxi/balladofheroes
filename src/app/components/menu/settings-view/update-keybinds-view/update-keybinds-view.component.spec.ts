import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKeybindsViewComponent } from './update-keybinds-view.component';

describe('UpdateKeybindsViewComponent', () => {
  let component: UpdateKeybindsViewComponent;
  let fixture: ComponentFixture<UpdateKeybindsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateKeybindsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateKeybindsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
