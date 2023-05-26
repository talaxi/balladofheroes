import { TestBed } from '@angular/core/testing';

import { MeleteService } from './melete.service';

describe('MeleteService', () => {
  let service: MeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
