import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyDescriptionViewComponent } from './enemy-description-view.component';

describe('EnemyDescriptionViewComponent', () => {
  let component: EnemyDescriptionViewComponent;
  let fixture: ComponentFixture<EnemyDescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnemyDescriptionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnemyDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
