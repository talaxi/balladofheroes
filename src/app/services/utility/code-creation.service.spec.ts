import { TestBed } from '@angular/core/testing';

import { CodeCreationService } from './code-creation.service';

describe('CodeCreationService', () => {
  let service: CodeCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
