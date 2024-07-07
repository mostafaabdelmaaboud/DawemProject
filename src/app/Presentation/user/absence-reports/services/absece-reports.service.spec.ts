import { TestBed } from '@angular/core/testing';

import { AbseceReportsService } from './absece-reports.service';

describe('AbseceReportsService', () => {
  let service: AbseceReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbseceReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
