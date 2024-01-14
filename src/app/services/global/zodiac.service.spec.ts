import { TestBed } from '@angular/core/testing';

import { ZodiacService } from './zodiac.service';

describe('ZodiacService', () => {
  let service: ZodiacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZodiacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
