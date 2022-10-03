import { TestBed } from '@angular/core/testing';

import { EnemyGeneratorService } from './enemy-generator.service';

describe('EnemyGeneratorService', () => {
  let service: EnemyGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnemyGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
