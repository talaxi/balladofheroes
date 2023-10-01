import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenShopViewComponent } from './open-shop-view.component';

describe('OpenShopViewComponent', () => {
  let component: OpenShopViewComponent;
  let fixture: ComponentFixture<OpenShopViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenShopViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenShopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
