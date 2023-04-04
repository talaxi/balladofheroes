import { TestBed } from '@angular/core/testing';

import { PatreonAccessService } from './patreon-access.service';

describe('PatreonAccessService', () => {
  let service: PatreonAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatreonAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
