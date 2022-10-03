import { TestBed } from '@angular/core/testing';

import { BalladService } from './ballad.service';

describe('BalladService', () => {
  let service: BalladService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalladService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
