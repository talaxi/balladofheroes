import { TestBed } from '@angular/core/testing';

import { CodeRedemptionService } from './code-redemption.service';

describe('CodeRedemptionService', () => {
  let service: CodeRedemptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeRedemptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
