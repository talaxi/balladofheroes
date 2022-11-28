import { TestBed } from '@angular/core/testing';

import { ResourceGeneratorService } from './resource-generator.service';

describe('ResourceGeneratorService', () => {
  let service: ResourceGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
