import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerDefaultViewComponent } from './follower-default-view.component';

describe('FollowerDefaultViewComponent', () => {
  let component: FollowerDefaultViewComponent;
  let fixture: ComponentFixture<FollowerDefaultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowerDefaultViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerDefaultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
