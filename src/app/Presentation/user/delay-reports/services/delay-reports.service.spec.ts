import { TestBed } from '@angular/core/testing';

import { DelayReportsService } from './delay-reports.service';

describe('DelayReportsService', () => {
  let service: DelayReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelayReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
