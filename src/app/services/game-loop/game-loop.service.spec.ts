import { TestBed } from '@angular/core/testing';

import { GameLoopService } from './game-loop.service';

describe('GameLoopService', () => {
  let service: GameLoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
