import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLogEditorComponent } from './game-log-editor.component';

describe('GameLogEditorComponent', () => {
  let component: GameLogEditorComponent;
  let fixture: ComponentFixture<GameLogEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLogEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLogEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
