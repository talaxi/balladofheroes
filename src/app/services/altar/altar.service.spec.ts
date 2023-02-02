import { TestBed } from '@angular/core/testing';

import { AltarService } from './altar.service';

describe('AltarService', () => {
  let service: AltarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AltarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
