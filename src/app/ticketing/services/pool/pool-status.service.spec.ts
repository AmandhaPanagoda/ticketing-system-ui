import { TestBed } from '@angular/core/testing';

import { PoolStatusService } from './pool-status.service';

describe('PoolStatusService', () => {
  let service: PoolStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
