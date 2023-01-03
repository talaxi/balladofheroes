import { TestBed } from '@angular/core/testing';

import { DpsCalculatorService } from './dps-calculator.service';

describe('DpsCalculatorService', () => {
  let service: DpsCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DpsCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
