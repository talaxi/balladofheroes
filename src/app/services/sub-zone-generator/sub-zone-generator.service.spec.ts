import { TestBed } from '@angular/core/testing';

import { SubZoneGeneratorService } from './sub-zone-generator.service';

describe('SubZoneGeneratorService', () => {
  let service: SubZoneGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubZoneGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
