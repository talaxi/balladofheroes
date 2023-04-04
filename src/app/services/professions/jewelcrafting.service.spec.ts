import { TestBed } from '@angular/core/testing';

import { JewelcraftingService } from './jewelcrafting.service';

describe('JewelcraftingService', () => {
  let service: JewelcraftingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JewelcraftingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
