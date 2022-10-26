import { TestBed } from '@angular/core/testing';

import { GameLogService } from './game-log.service';

describe('GameLogService', () => {
  let service: GameLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
