import { TestBed } from '@angular/core/testing';

import { SummonMissingLogsService } from './summon-missing-logs.service';

describe('SummonMissingLogsService', () => {
  let service: SummonMissingLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummonMissingLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
