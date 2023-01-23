import { TestBed } from '@angular/core/testing';

import { CharmService } from './charm.service';

describe('CharmService', () => {
  let service: CharmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
