import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelcraftingViewComponent } from './jewelcrafting-view.component';

describe('JewelcraftingViewComponent', () => {
  let component: JewelcraftingViewComponent;
  let fixture: ComponentFixture<JewelcraftingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelcraftingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JewelcraftingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
