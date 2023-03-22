import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTextOverviewComponent } from './game-text-overview.component';

describe('GameTextOverviewComponent', () => {
  let component: GameTextOverviewComponent;
  let fixture: ComponentFixture<GameTextOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameTextOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTextOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
