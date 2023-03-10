import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerSearchViewComponent } from './follower-search-view.component';

describe('FollowerSearchViewComponent', () => {
  let component: FollowerSearchViewComponent;
  let fixture: ComponentFixture<FollowerSearchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowerSearchViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerSearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
