import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelcraftingOverviewComponent } from './jewelcrafting-overview.component';

describe('JewelcraftingOverviewComponent', () => {
  let component: JewelcraftingOverviewComponent;
  let fixture: ComponentFixture<JewelcraftingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelcraftingOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JewelcraftingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
