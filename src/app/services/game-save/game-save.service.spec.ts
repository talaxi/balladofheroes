import { TestBed } from '@angular/core/testing';

import { GameSaveService } from './game-save.service';

describe('GameSaveService', () => {
  let service: GameSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
