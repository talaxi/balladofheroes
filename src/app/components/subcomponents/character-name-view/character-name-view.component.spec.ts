import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterNameViewComponent } from './character-name-view.component';

describe('CharacterNameViewComponent', () => {
  let component: CharacterNameViewComponent;
  let fixture: ComponentFixture<CharacterNameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterNameViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterNameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
