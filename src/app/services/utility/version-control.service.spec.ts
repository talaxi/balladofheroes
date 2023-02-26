import { TestBed } from '@angular/core/testing';

import { VersionControlService } from './version-control.service';

describe('VersionControlService', () => {
  let service: VersionControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
