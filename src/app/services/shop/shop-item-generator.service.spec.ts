import { TestBed } from '@angular/core/testing';

import { ShopItemGeneratorService } from './shop-item-generator.service';

describe('ShopItemGeneratorService', () => {
  let service: ShopItemGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopItemGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
