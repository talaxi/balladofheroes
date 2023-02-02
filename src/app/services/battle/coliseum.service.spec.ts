import { TestBed } from '@angular/core/testing';

import { ColiseumService } from './coliseum.service';

describe('ColiseumService', () => {
  let service: ColiseumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColiseumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
